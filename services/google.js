import { translations, getLocale } from "../locales/index.js";

export const googleContext = {
  state: null,
  safeFetch: null,
  escapeHtml: null,
  formatDateShort: null,
  formatEventTime: null,
  getLocalDateString: null
};

export function setupGoogleContext(context) {
  Object.assign(googleContext, context);
}

export let googleTokenClient = null;
export let googleLoginTarget = "personal";

export function setGoogleLoginTarget(target) {
  googleLoginTarget = target;
}
export function getGoogleTokenClient() {
  return googleTokenClient;
}

// Google APIs Integrations (Gmail, Tasks, Calendar)



export async function fetchGoogleUserEmail(token) {
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      return data.email;
    }
  } catch (e) {
    console.error("Failed to fetch user email", e);
  }
  return null;
}

export function initGoogleOAuth() {
  updateGoogleAuthStatus();

  if (!googleContext.state.googlePersonalToken && !googleContext.state.googleWorkToken) {
    fetchGoogleCalendar();
    fetchGmail();
    fetchGoogleTasks();
  }

  if (typeof google === 'undefined' || !googleContext.state.settings.googleClientId) {
    return;
  }

  googleTokenClient = google.accounts.oauth2.initTokenClient({
    client_id: googleContext.state.settings.googleClientId,
    scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/tasks.readonly https://www.googleapis.com/auth/calendar.readonly',
    callback: async (response) => {
      if (response.error) {
        console.error("Google Auth error:", response.error);
        isRefreshingToken[googleLoginTarget] = false;
        return;
      }
      
      const token = response.access_token;
      const expiresInSec = response.expires_in || 3600;
      const expiryTimestamp = Date.now() + (expiresInSec * 1000) - 60000;
      
      if (googleLoginTarget === 'personal') {
        googleContext.state.googlePersonalToken = token;
        localStorage.setItem('google_personal_token', token);
        localStorage.setItem('google_personal_expiry', String(expiryTimestamp));
        sessionStorage.setItem('google_personal_token', token);
        
        let email = googleContext.state.googlePersonalEmail;
        if (!email) {
          email = await fetchGoogleUserEmail(token);
          if (email) {
            googleContext.state.googlePersonalEmail = email;
            localStorage.setItem('google_personal_email', email);
            sessionStorage.setItem('google_personal_email', email);
          }
        }
      } else {
        googleContext.state.googleWorkToken = token;
        localStorage.setItem('google_work_token', token);
        localStorage.setItem('google_work_expiry', String(expiryTimestamp));
        sessionStorage.setItem('google_work_token', token);
        
        let email = googleContext.state.googleWorkEmail;
        if (!email) {
          email = await fetchGoogleUserEmail(token);
          if (email) {
            googleContext.state.googleWorkEmail = email;
            localStorage.setItem('google_work_email', email);
            sessionStorage.setItem('google_work_email', email);
          }
        }
      }
      
      // Keep googleClientToken for backward compatibility
      googleContext.state.googleClientToken = googleContext.state.googlePersonalToken || googleContext.state.googleWorkToken;
      localStorage.setItem('google_access_token', googleContext.state.googleClientToken || '');
      sessionStorage.setItem('google_access_token', googleContext.state.googleClientToken || '');
      
      isRefreshingToken[googleLoginTarget] = false;
      updateGoogleAuthStatus();
      await fetchGoogleData();
    }
  });

  checkAndFetchGoogleEmails();
  
  // Check if tokens need a silent refresh on initialization
  const now = Date.now();
  const personalExpiry = Number(localStorage.getItem('google_personal_expiry') || 0);
  const workExpiry = Number(localStorage.getItem('google_work_expiry') || 0);

  if (googleContext.state.googlePersonalEmail && (!googleContext.state.googlePersonalToken || now >= personalExpiry)) {
    refreshGoogleToken('personal');
  }

  if (googleContext.state.googleWorkEmail && (!googleContext.state.googleWorkToken || now >= workExpiry)) {
    refreshGoogleToken('work');
  }

  updateGoogleAuthStatus();
  if (googleContext.state.googlePersonalToken || googleContext.state.googleWorkToken) {
    fetchGoogleData();
  } else {
    fetchGoogleCalendar();
    fetchGmail();
    fetchGoogleTasks();
  }
}

let isRefreshingToken = { personal: false, work: false };

export function refreshGoogleToken(accountType) {
  if (isRefreshingToken[accountType]) return;
  if (typeof google === 'undefined' || !googleTokenClient) {
    console.warn("Google Client not initialized for refresh");
    return;
  }
  
  const emailHint = accountType === 'personal' ? googleContext.state.googlePersonalEmail : googleContext.state.googleWorkEmail;
  if (!emailHint) return;

  console.log(`Attempting silent token refresh for ${accountType} (${emailHint})...`);
  isRefreshingToken[accountType] = true;
  googleLoginTarget = accountType;
  
  try {
    googleTokenClient.requestAccessToken({
      hint: emailHint,
      prompt: ''
    });
    setTimeout(() => { isRefreshingToken[accountType] = false; }, 8000);
  } catch (e) {
    console.error("Silent refresh failed", e);
    isRefreshingToken[accountType] = false;
  }
}

export function handleInvalidToken(accountType) {
  console.warn(`Token expired (401) for ${accountType} account. Attempting silent renewal.`);
  const emailHint = accountType === 'personal' ? googleContext.state.googlePersonalEmail : googleContext.state.googleWorkEmail;
  if (emailHint && typeof googleTokenClient !== 'undefined' && googleTokenClient) {
    refreshGoogleToken(accountType);
  } else {
    googleContext.state.googleErrors = googleContext.state.googleErrors || {};
    googleContext.state.googleErrors[accountType] = 'Token expired (401)';
    if (accountType === 'personal') {
      googleContext.state.googlePersonalToken = null;
      localStorage.removeItem('google_personal_token');
      localStorage.removeItem('google_personal_expiry');
      sessionStorage.removeItem('google_personal_token');
    } else {
      googleContext.state.googleWorkToken = null;
      localStorage.removeItem('google_work_token');
      localStorage.removeItem('google_work_expiry');
      sessionStorage.removeItem('google_work_token');
    }
    googleContext.state.googleClientToken = googleContext.state.googlePersonalToken || googleContext.state.googleWorkToken;
    localStorage.setItem('google_access_token', googleContext.state.googleClientToken || '');
    sessionStorage.setItem('google_access_token', googleContext.state.googleClientToken || '');
    
    updateGoogleAuthStatus();
  }
}

export async function checkAndFetchGoogleEmails() {
  let changed = false;
  if (googleContext.state.googlePersonalToken && !googleContext.state.googlePersonalEmail) {
    const email = await fetchGoogleUserEmail(googleContext.state.googlePersonalToken);
    if (email) {
      googleContext.state.googlePersonalEmail = email;
      localStorage.setItem('google_personal_email', email);
      sessionStorage.setItem('google_personal_email', email);
      changed = true;
    }
  }
  if (googleContext.state.googleWorkToken && !googleContext.state.googleWorkEmail) {
    const email = await fetchGoogleUserEmail(googleContext.state.googleWorkToken);
    if (email) {
      googleContext.state.googleWorkEmail = email;
      localStorage.setItem('google_work_email', email);
      sessionStorage.setItem('google_work_email', email);
      changed = true;
    }
  }
  if (changed) {
    updateGoogleAuthStatus();
  }
}

export function updateGoogleAuthStatus() {
  const dict = translations[googleContext.state.lang];
  
  // Personal account status
  const personalStatusEl = document.getElementById('google-auth-status-personal');
  const personalLoginBtn = document.getElementById('google-login-btn-personal');
  const personalLogoutBtn = document.getElementById('google-logout-btn-personal');
  
  if (personalStatusEl && personalLoginBtn && personalLogoutBtn) {
    if (googleContext.state.googlePersonalToken) {
      const emailStr = googleContext.state.googlePersonalEmail ? ` (${googleContext.state.googlePersonalEmail})` : '';
      personalStatusEl.textContent = `${dict['connected']}${emailStr}`;
      personalStatusEl.className = "auth-status connected";
      personalLoginBtn.classList.add('hidden');
      personalLogoutBtn.classList.remove('hidden');
    } else {
      personalStatusEl.textContent = dict['disconnected'];
      personalStatusEl.className = "auth-status disconnected";
      personalLoginBtn.classList.remove('hidden');
      personalLogoutBtn.classList.add('hidden');
    }
  }
  
  // Work account status
  const workStatusEl = document.getElementById('google-auth-status-work');
  const workLoginBtn = document.getElementById('google-login-btn-work');
  const workLogoutBtn = document.getElementById('google-logout-btn-work');
  
  if (workStatusEl && workLoginBtn && workLogoutBtn) {
    if (googleContext.state.googleWorkToken) {
      const emailStr = googleContext.state.googleWorkEmail ? ` (${googleContext.state.googleWorkEmail})` : '';
      workStatusEl.textContent = `${dict['connected']}${emailStr}`;
      workStatusEl.className = "auth-status connected";
      workLoginBtn.classList.add('hidden');
      workLogoutBtn.classList.remove('hidden');
    } else {
      workStatusEl.textContent = dict['disconnected'];
      workStatusEl.className = "auth-status disconnected";
      workLoginBtn.classList.remove('hidden');
      workLogoutBtn.classList.add('hidden');
    }
  }

  // Update header status indicators (dots) for Events, Emails, and Weekly Schedule
  const personalClass = googleContext.state.googlePersonalToken ? 'personal' : 'disconnected';
  const personalTooltip = googleContext.state.googlePersonalToken 
    ? `${dict['google-personal'] || 'Personal'}: ${dict['git-connected'] || 'Connected'} (${googleContext.state.googlePersonalEmail || 'Google'})`
    : `${dict['google-personal'] || 'Personal'}: ${dict['git-disconnected'] || 'Disconnected'}`;
    
  const workClass = googleContext.state.googleWorkToken ? 'work' : 'disconnected';
  const workTooltip = googleContext.state.googleWorkToken 
    ? `${dict['google-work'] || 'Work'}: ${dict['git-connected'] || 'Connected'} (${googleContext.state.googleWorkEmail || 'Google'})`
    : `${dict['google-work'] || 'Work'}: ${dict['git-disconnected'] || 'Disconnected'}`;

  const hasGoogleError = !!(googleContext.state.googleErrors && (googleContext.state.googleErrors.personal || googleContext.state.googleErrors.work || googleContext.state.googleErrors.tasks));
  const googleWarningTooltip = dict['status-error-connecting'] || 'Failed to connect to some services';

  const googleWarningIconHTML = `<span class="status-warning-icon" data-tooltip="${googleContext.escapeHtml(googleWarningTooltip)}" onclick="event.stopPropagation(); window.openSettingsGoogleTab();">⚠️</span>`;

  const indicatorsHTML = `
    ${hasGoogleError ? googleWarningIconHTML : ''}
    <span class="status-dot ${personalClass}" title="${googleContext.escapeHtml(personalTooltip)}"></span>
    <span class="status-dot ${workClass}" title="${googleContext.escapeHtml(workTooltip)}"></span>
  `;

  const evInd = document.getElementById('google-events-status-indicators');
  const emInd = document.getElementById('google-emails-status-indicators');
  const wkInd = document.getElementById('google-weekly-status-indicators');
  const gtTodayInd = document.getElementById('google-gtasks-today-status-indicators');
  const gtWeekInd = document.getElementById('google-gtasks-week-status-indicators');

  if (evInd) evInd.innerHTML = indicatorsHTML;
  if (emInd) emInd.innerHTML = indicatorsHTML;
  if (wkInd) wkInd.innerHTML = indicatorsHTML;
  if (gtTodayInd) gtTodayInd.innerHTML = indicatorsHTML;
  if (gtWeekInd) gtWeekInd.innerHTML = indicatorsHTML;

  const settingsDotPers = document.getElementById('google-settings-dot-personal');
  const settingsDotWork = document.getElementById('google-settings-dot-work');

  if (settingsDotPers) {
    settingsDotPers.className = `status-dot ${personalClass}`;
  }
  if (settingsDotWork) {
    settingsDotWork.className = `status-dot ${workClass}`;
  }
}

export async function fetchGoogleData() {
  const token = googleContext.state.googlePersonalToken || googleContext.state.googleWorkToken;
  if (!token) return;

  googleContext.state.googleClientToken = token;
  googleContext.state.googleErrors = { personal: null, work: null };
  updateGoogleAuthStatus();

  // Run in parallel
  fetchGmail();
  fetchGoogleTasks();
  fetchGoogleCalendar();
}

export async function fetchGmail() {
  const gmailCard = document.getElementById('gmail-card');
  if (googleContext.state.settings.showGoogleEmails === false) {
    if (gmailCard) gmailCard.classList.add('hidden');
    return;
  }
  if (gmailCard) gmailCard.classList.remove('hidden');

  const container = document.getElementById('gmail-container');
  const emailsBadge = document.getElementById('emails-count-badge');
  if (emailsBadge) {
    emailsBadge.classList.add('hidden');
  }

  if (!googleContext.state.googlePersonalToken && !googleContext.state.googleWorkToken) {
    const dict = translations[googleContext.state.lang] || translations.en;
    const configLinkText = dict['google-config-gmail'] || 'Configure Gmail';
    container.innerHTML = `<p class="empty-msg" style="margin: 0.5rem 0;"><a href="#" onclick="event.preventDefault(); window.openSettingsGoogleTab();" style="color: var(--accent); text-decoration: underline; font-weight: 500;">${configLinkText}</a></p>`;
    return;
  }

  async function fetchEmailsForAccount(token, type, email) {
    if (!token) return [];
    try {
      const res = await googleContext.safeFetch('https://www.googleapis.com/gmail/v1/users/me/messages?q=is:unread%20in:inbox&maxResults=5', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        if (res.status === 401) {
          handleInvalidToken(type);
        }
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      if (!data.messages || data.messages.length === 0) return [];

      const detailsPromises = data.messages.map(msg =>
        googleContext.safeFetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        })
      );
      const details = await Promise.all(detailsPromises);
      return details.map(item => ({ ...item, accountType: type, accountEmail: email }));
    } catch (e) {
      console.error(`Error fetching Gmail for ${type}:`, e);
      googleContext.state.googleErrors = googleContext.state.googleErrors || {};
      googleContext.state.googleErrors[type] = e.message || 'Gmail fetch error';
      updateGoogleAuthStatus();
      return [];
    }
  }

  try {
    const promises = [];
    if (googleContext.state.googlePersonalToken) {
      promises.push(fetchEmailsForAccount(googleContext.state.googlePersonalToken, 'personal', googleContext.state.googlePersonalEmail));
    }
    if (googleContext.state.googleWorkToken && !googleContext.state.settings.oooActive) {
      promises.push(fetchEmailsForAccount(googleContext.state.googleWorkToken, 'work', googleContext.state.googleWorkEmail));
    }

    const results = await Promise.all(promises);
    const allEmails = results.flat();

    // Sort by internalDate (newest first)
    allEmails.sort((a, b) => {
      const aDate = parseInt(a.internalDate) || 0;
      const bDate = parseInt(b.internalDate) || 0;
      return bDate - aDate;
    });

    if (emailsBadge) {
      if (allEmails.length > 0) {
        emailsBadge.textContent = allEmails.length;
        emailsBadge.classList.remove('hidden');
      } else {
        emailsBadge.classList.add('hidden');
      }
    }

    if (allEmails.length === 0) {
      container.innerHTML = `<p class="empty-msg">${translations[googleContext.state.lang]['no-emails']}</p>`;
      return;
    }

    container.innerHTML = allEmails.slice(0, 5).map(msg => {
      const headers = msg.payload.headers;
      const subjectHeader = headers.find(h => h.name.toLowerCase() === 'subject');
      const fromHeader = headers.find(h => h.name.toLowerCase() === 'from');
      const subject = subjectHeader ? subjectHeader.value : '(No Subject)';
      const from = fromHeader ? fromHeader.value.split('<')[0].trim() : 'Unknown';
      const snippet = msg.snippet;

      const badgeClass = msg.accountType === 'personal' ? 'personal' : 'work';
      const badgeLabel = translations[googleContext.state.lang][`badge-${msg.accountType}`] || msg.accountType;

      let gmailLink = `https://mail.google.com/mail/#inbox/${msg.threadId}`;
      if (msg.accountEmail) {
        gmailLink = `https://mail.google.com/mail/?authuser=${encodeURIComponent(msg.accountEmail)}#inbox/${msg.threadId}`;
      }

      return `
        <a href="${googleContext.escapeHtml(gmailLink)}" target="_blank" rel="noopener noreferrer" class="integration-item ${badgeClass}" data-tooltip="Subject: ${googleContext.escapeHtml(subject)}\nFrom: ${googleContext.escapeHtml(from)}\nSnippet: ${googleContext.escapeHtml(snippet)}">
          <span class="item-title">${googleContext.escapeHtml(subject)}</span>
          <div class="item-meta">
            <span>${googleContext.escapeHtml(from)}</span>
            <span class="item-badge ${badgeClass}">${googleContext.escapeHtml(badgeLabel)}</span>
          </div>
        </a>
      `;
    }).join('');

  } catch (err) {
    console.error("Gmail Loading Error:", err);
    container.innerHTML = `<p class="empty-msg" style="color:var(--danger)">Gmail Loading Error (${err.message || 'Error'})</p>`;
  }
}

export async function fetchGoogleTasks() {
  const oldToday = document.getElementById('gtasks-today');
  if (oldToday) oldToday.remove();
  const oldWeek = document.getElementById('gtasks-week');
  if (oldWeek) oldWeek.remove();

  const showToday = googleContext.state.settings.showGoogleTasksToday !== false;
  const showWeek = googleContext.state.settings.showGoogleTasksWeek !== false;

  if (!showToday && !showWeek) {
    return;
  }

  function showPlaceholder(messageHTML) {
    const dict = translations[googleContext.state.lang] || translations.en;
    if (showToday) {
      let gTodayCard = document.getElementById('gtasks-today');
      if (!gTodayCard) {
        gTodayCard = document.createElement('div');
        gTodayCard.id = 'gtasks-today';
        gTodayCard.className = 'section-card';
        const colContent = document.querySelector('#col-today .col-content');
        if (colContent) colContent.appendChild(gTodayCard);
      }
      gTodayCard.innerHTML = `
        <h3 class="card-subtitle">
          <span style="display: inline-flex; align-items: center; gap: 0.4rem;">
            <span>${dict['google-tasks-today'] || 'Tasks · Today'}</span>
            <button type="button" class="card-action-btn btn-open-gtasks" data-tooltip="${dict['google-open-tasks'] || 'Open Google Tasks'}" aria-label="Open Google Tasks">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </span>
          <span class="header-status-indicators" id="google-gtasks-today-status-indicators"></span>
        </h3>
        <div class="integration-list">
          ${messageHTML}
        </div>
      `;
    }

    if (showWeek) {
      let gWeekCard = document.getElementById('gtasks-week');
      if (!gWeekCard) {
        gWeekCard = document.createElement('div');
        gWeekCard.id = 'gtasks-week';
        gWeekCard.className = 'section-card';
        const colContent = document.querySelector('#col-week .col-content');
        if (colContent) colContent.appendChild(gWeekCard);
      }
      gWeekCard.innerHTML = `
        <h3 class="card-subtitle">
          <span style="display: inline-flex; align-items: center; gap: 0.4rem;">
            <span>${dict['google-tasks-week'] || 'Tasks · This Week'}</span>
            <button type="button" class="card-action-btn btn-open-gtasks" data-tooltip="${dict['google-open-tasks'] || 'Open Google Tasks'}" aria-label="Open Google Tasks">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </span>
          <span class="header-status-indicators" id="google-gtasks-week-status-indicators"></span>
        </h3>
        <div class="integration-list">
          ${messageHTML}
        </div>
      `;
    }
    updateGoogleAuthStatus();
  }

  if (!googleContext.state.googlePersonalToken && !googleContext.state.googleWorkToken) {
    const dict = translations[googleContext.state.lang] || translations.en;
    const configLinkText = dict['google-config-tasks'] || 'Configure Google Tasks';
    const msgHTML = `<p class="empty-msg" style="margin: 0.5rem 0;"><a href="#" onclick="event.preventDefault(); window.openSettingsGoogleTab();" style="color: var(--accent); text-decoration: underline; font-weight: 500;">${configLinkText}</a></p>`;
    showPlaceholder(msgHTML);
    return;
  }

  let errors = [];

  async function fetchTasksForAccount(token, type) {
    if (!token) return [];
    try {
      const tasksRes = await fetch('https://www.googleapis.com/tasks/v1/lists/@default/tasks?showCompleted=false', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!tasksRes.ok) {
        if (tasksRes.status === 401) {
          handleInvalidToken(type);
        }
        throw new Error(`HTTP ${tasksRes.status}`);
      }
      const tasksData = await tasksRes.json();
      const items = tasksData.items || [];
      return items.map(t => ({ ...t, accountType: type }));
    } catch (e) {
      console.warn(`Direct fetch from @default failed for ${type}, trying lists fallback...`, e);
      try {
        const listsRes = await fetch('https://www.googleapis.com/tasks/v1/users/@me/lists', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!listsRes.ok) throw new Error(`Fallback HTTP ${listsRes.status}`);
        const listsData = await listsRes.json();
        if (!listsData.items || listsData.items.length === 0) return [];

        const listId = listsData.items[0].id;
        const tasksRes = await fetch(`https://www.googleapis.com/tasks/v1/lists/${listId}/tasks?showCompleted=false`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!tasksRes.ok) throw new Error(`Fallback Tasks HTTP ${tasksRes.status}`);
        const tasksData = await tasksRes.json();
        const items = tasksData.items || [];
        return items.map(t => ({ ...t, accountType: type }));
      } catch (fallbackError) {
        errors.push(`${type} account: ${fallbackError.message}`);
        googleContext.state.googleErrors = googleContext.state.googleErrors || {};
        googleContext.state.googleErrors[type] = fallbackError.message;
        updateGoogleAuthStatus();
        return [];
      }
    }
  }

  try {
    const promises = [];
    if (googleContext.state.googlePersonalToken) {
      promises.push(fetchTasksForAccount(googleContext.state.googlePersonalToken, 'personal'));
    }
    if (googleContext.state.googleWorkToken && !googleContext.state.settings.oooActive) {
      promises.push(fetchTasksForAccount(googleContext.state.googleWorkToken, 'work'));
    }

    const results = await Promise.all(promises);
    const gTasks = results.flat();

    // Check if we had errors and update status indicators
    if (errors.length > 0 && gTasks.length === 0) {
      console.warn("Google Tasks fetch failed:", errors.join(' | '));
      updateGoogleAuthStatus();
      return;
    }

    if (gTasks.length === 0) return;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayTime = todayStart.getTime();

    const weekEnd = new Date(todayStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const weekEndTime = weekEnd.getTime();

    const todayGTasks = [];
    const weekGTasks = [];
    const showOverdue = googleContext.state.settings.showGoogleTasksOverdue !== false;

    gTasks.forEach(t => {
      if (!t.title || t.title.trim() === '') return;

      const isOverdue = t.due && new Date(t.due).getTime() < todayTime;
      if (isOverdue && !showOverdue) return;

      if (!t.due) {
        weekGTasks.push(t);
        return;
      }
      
      const dueTime = new Date(t.due).getTime();
      if (dueTime <= todayTime + 24 * 60 * 60 * 1000 - 1) {
        todayGTasks.push(t);
      } else if (dueTime <= weekEndTime) {
        weekGTasks.push(t);
      } else {
        weekGTasks.push(t);
      }
    });

    const sortGoogleTasksList = (taskList) => {
      taskList.sort((a, b) => {
        const aOverdue = a.due && new Date(a.due).getTime() < todayTime;
        const bOverdue = b.due && new Date(b.due).getTime() < todayTime;
        if (aOverdue && !bOverdue) return -1;
        if (!aOverdue && bOverdue) return 1;

        const hasDueA = !!a.due;
        const hasDueB = !!b.due;
        if (hasDueA && !hasDueB) return -1;
        if (!hasDueA && hasDueB) return 1;

        if (hasDueA && hasDueB) {
          const dueA = new Date(a.due).getTime();
          const dueB = new Date(b.due).getTime();
          if (dueA !== dueB) {
            return dueA - dueB;
          }
        }

        const updatedA = a.updated ? new Date(a.updated).getTime() : 0;
        const updatedB = b.updated ? new Date(b.updated).getTime() : 0;
        return updatedB - updatedA;
      });
    };

    sortGoogleTasksList(todayGTasks);
    sortGoogleTasksList(weekGTasks);

    function getTaskTimeText(task) {
      if (!task.due) return '';
      const hasTime = !task.due.endsWith('T00:00:00.000Z') && !task.due.endsWith('T00:00:00Z') && task.due.includes('T');
      if (!hasTime) {
        return '';
      }
      const d = new Date(task.due);
      return d.toLocaleTimeString(getLocale(googleContext.state.lang), {
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    function checkTaskRecurring(task) {
      return !!(task.recurrence || task.recurring);
    }

    const dict = translations[googleContext.state.lang] || translations.en;
    if (showToday && todayGTasks.length > 0) {
      let gTodayCard = document.getElementById('gtasks-today');
      if (!gTodayCard) {
        gTodayCard = document.createElement('div');
        gTodayCard.id = 'gtasks-today';
        gTodayCard.className = 'section-card';
        const colContent = document.querySelector('#col-today .col-content');
        if (colContent) colContent.appendChild(gTodayCard);
      }
      gTodayCard.innerHTML = `
        <h3 class="card-subtitle">
          <span style="display: inline-flex; align-items: center; gap: 0.4rem;">
            <span>${dict['google-tasks-today'] || 'Tasks · Today'}</span>
            <button type="button" class="card-action-btn btn-open-gtasks" data-tooltip="${dict['google-open-tasks'] || 'Open Google Tasks'}" aria-label="Open Google Tasks">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </span>
          <span class="header-status-indicators" id="google-gtasks-today-status-indicators"></span>
        </h3>
        <div class="integration-list">
          ${todayGTasks.map(t => {
            const badgeClass = t.accountType === 'personal' ? 'personal' : 'work';
            const badgeLabel = (translations[googleContext.state.lang] || translations.en)[`badge-${t.accountType}`] || t.accountType;
            const isOverdue = t.due && new Date(t.due).getTime() < todayTime;
            const dueLabel = isOverdue ? (dict['badge-overdue'] || 'Overdue') : '';
            const timeText = getTaskTimeText(t);
            const isRecurring = checkTaskRecurring(t);
            const recurringClass = isRecurring ? 'recurring' : '';
            const repeatIcon = isRecurring 
              ? `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.65; display: inline-block; vertical-align: middle; margin-right: 0.25rem; flex-shrink: 0;"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>` 
              : '';
            const tooltipText = t.title + (isOverdue ? ` (${dueLabel})` : '') + (timeText ? `\n${timeText}` : '') + (isRecurring ? (dict['google-recurring-suffix'] || ' (Recurring)') : '');
            
            const email = t.accountType === 'personal' ? googleContext.state.googlePersonalEmail : googleContext.state.googleWorkEmail;
            const tasksLink = email 
              ? `https://tasks.google.com/?authuser=${encodeURIComponent(email)}` 
              : 'https://tasks.google.com/';

            return `
              <a href="${googleContext.escapeHtml(tasksLink)}" target="_blank" rel="noopener noreferrer" class="integration-item one-line ${recurringClass}" data-tooltip="${googleContext.escapeHtml(tooltipText)}">
                <div style="display: flex; align-items: center; gap: 0.4rem; min-width: 0; flex: 1;">
                  ${isOverdue ? `<span class="event-overdue-badge" style="margin-left: 0; flex-shrink: 0; padding: 0.05rem 0.25rem; font-size: 0.6rem;">${dueLabel}</span>` : ''}
                  ${repeatIcon}
                  <span class="item-title">${googleContext.escapeHtml(t.title)}</span>
                </div>
                <span class="item-badge ${badgeClass}">${googleContext.escapeHtml(badgeLabel)}</span>
              </a>
            `;
          }).join('')}
        </div>
      `;
    }

    if (showWeek && weekGTasks.length > 0) {
      let gWeekCard = document.getElementById('gtasks-week');
      if (!gWeekCard) {
        gWeekCard = document.createElement('div');
        gWeekCard.id = 'gtasks-week';
        gWeekCard.className = 'section-card';
        const colContent = document.querySelector('#col-week .col-content');
        if (colContent) colContent.appendChild(gWeekCard);
      }
      gWeekCard.innerHTML = `
        <h3 class="card-subtitle">
          <span style="display: inline-flex; align-items: center; gap: 0.4rem;">
            <span>${dict['google-tasks-week'] || 'Tasks · This Week'}</span>
            <button type="button" class="card-action-btn btn-open-gtasks" data-tooltip="${dict['google-open-tasks'] || 'Open Google Tasks'}" aria-label="Open Google Tasks">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </span>
          <span class="header-status-indicators" id="google-gtasks-week-status-indicators"></span>
        </h3>
        <div class="integration-list">
          ${weekGTasks.map(t => {
            const badgeClass = t.accountType === 'personal' ? 'personal' : 'work';
            const badgeLabel = (translations[googleContext.state.lang] || translations.en)[`badge-${t.accountType}`] || t.accountType;
            const timeText = getTaskTimeText(t);
            const dateText = t.due ? googleContext.formatDateShort(t.due.split('T')[0]) : '';
            const isRecurring = checkTaskRecurring(t);
            const recurringClass = isRecurring ? 'recurring' : '';
            const repeatIcon = isRecurring 
              ? `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.65; display: inline-block; vertical-align: middle; margin-right: 0.25rem; flex-shrink: 0;"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>` 
              : '';
            const tooltipText = t.title + (t.due ? `\n${dateText}` : '') + (isRecurring ? (dict['google-recurring-suffix'] || ' (Recurring)') : '');
            
            const email = t.accountType === 'personal' ? googleContext.state.googlePersonalEmail : googleContext.state.googleWorkEmail;
            const tasksLink = email 
              ? `https://tasks.google.com/?authuser=${encodeURIComponent(email)}` 
              : 'https://tasks.google.com/';

            return `
              <a href="${googleContext.escapeHtml(tasksLink)}" target="_blank" rel="noopener noreferrer" class="integration-item one-line ${recurringClass}" data-tooltip="${googleContext.escapeHtml(tooltipText)}">
                <div style="display: flex; align-items: center; gap: 0.4rem; min-width: 0; flex: 1;">
                  ${repeatIcon}
                  <span class="item-title">${googleContext.escapeHtml(t.title)}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.4rem; flex-shrink: 0;">
                  ${dateText ? `<span style="font-size: 0.72rem; color: var(--text-secondary);">${googleContext.escapeHtml(dateText)}</span>` : ''}
                  <span class="item-badge ${badgeClass}">${googleContext.escapeHtml(badgeLabel)}</span>
                </div>
              </a>
            `;
          }).join('')}
        </div>
      `;
    }

    updateGoogleAuthStatus();
  } catch (err) {
    console.error("Error fetching Google Tasks", err);
    googleContext.state.googleErrors = googleContext.state.googleErrors || {};
    googleContext.state.googleErrors.tasks = err.message || 'Tasks error';
    updateGoogleAuthStatus();
  }
}

export async function fetchGoogleCalendar() {
  const todayEventsContainer = document.getElementById('google-events-container');
  const weeklyEventsContainer = document.getElementById('weekly-events-container');
  const weeklyBadge = document.getElementById('weekly-count-badge');
  if (weeklyBadge) {
    weeklyBadge.classList.add('hidden');
  }

  const dict = translations[googleContext.state.lang] || translations.en;

  if (!googleContext.state.googlePersonalToken && !googleContext.state.googleWorkToken) {
    const configLinkText = dict['google-config-calendar'] || 'Configure Google Calendar';
    const msgHTML = `<p class="empty-msg" style="margin: 0.5rem 0;"><a href="#" onclick="event.preventDefault(); window.openSettingsGoogleTab();" style="color: var(--accent); text-decoration: underline; font-weight: 500;">${configLinkText}</a></p>`;
    todayEventsContainer.innerHTML = msgHTML;
    weeklyEventsContainer.innerHTML = msgHTML;
    return;
  }

  const timeMin = new Date().toISOString();
  const timeMax = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days ahead

  async function fetchEventsForAccount(token, type) {
    if (!token) return [];
    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      if (res.status === 401) {
        handleInvalidToken(type);
      }
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    const items = data.items || [];
    return items.map(item => ({ ...item, accountType: type }));
  }

  try {
    const promises = [];
    if (googleContext.state.googlePersonalToken) {
      promises.push(
        fetchEventsForAccount(googleContext.state.googlePersonalToken, 'personal')
          .catch(err => {
            console.error("Error fetching personal calendar:", err);
            googleContext.state.googleErrors = googleContext.state.googleErrors || {};
            googleContext.state.googleErrors.personal = err.message || 'Calendar error';
            updateGoogleAuthStatus();
            return [];
          })
      );
    }
    if (googleContext.state.googleWorkToken && !googleContext.state.settings.oooActive) {
      promises.push(
        fetchEventsForAccount(googleContext.state.googleWorkToken, 'work')
          .catch(err => {
            console.error("Error fetching work calendar:", err);
            googleContext.state.googleErrors = googleContext.state.googleErrors || {};
            googleContext.state.googleErrors.work = err.message || 'Calendar error';
            updateGoogleAuthStatus();
            return [];
          })
      );
    }

    const results = await Promise.all(promises);
    const allEvents = results.flat();

    // Sort all events by start time
    allEvents.sort((a, b) => {
      const aStart = a.start.dateTime || a.start.date;
      const bStart = b.start.dateTime || b.start.date;
      return aStart.localeCompare(bStart);
    });

    if (allEvents.length === 0) {
      todayEventsContainer.innerHTML = `<p class="empty-msg">${translations[googleContext.state.lang]['no-events']}</p>`;
      weeklyEventsContainer.innerHTML = `<p class="empty-msg">${translations[googleContext.state.lang]['no-weekly-events']}</p>`;
      return;
    }

    const todayStr = googleContext.getLocalDateString(new Date());
    const todayEvents = [];
    const weeklyGroups = {}; // relative date string -> list of event HTMLs

    allEvents.forEach(evt => {
      const startStr = evt.start.dateTime || evt.start.date;
      const isToday = startStr.startsWith(todayStr);
      
      const badgeClass = evt.accountType === 'personal' ? 'personal' : 'work';
      const badgeLabel = translations[googleContext.state.lang][`badge-${evt.accountType}`] || evt.accountType;

      let eventLink = evt.htmlLink || 'https://calendar.google.com/calendar/r';
      const email = evt.accountType === 'personal' ? googleContext.state.googlePersonalEmail : googleContext.state.googleWorkEmail;
      if (email) {
        const separator = eventLink.includes('?') ? '&' : '?';
        eventLink = `${eventLink}${separator}authuser=${encodeURIComponent(email)}`;
      }

      const timeStr = googleContext.formatEventTime(evt);
      const isRecurring = !!evt.recurringEventId;
      const recurringClass = isRecurring ? 'recurring' : '';
      const repeatIcon = isRecurring 
        ? `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.65; display: inline-block; vertical-align: middle; margin-right: 0.25rem;"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>` 
        : '';

      const evtDateObj = new Date(startStr.split('T')[0] + 'T00:00:00');
      const dateText = evtDateObj.toLocaleDateString(getLocale(googleContext.state.lang), { day: 'numeric', month: 'long' });
      const tooltipText = evt.summary + `\n${dateText}\nTime: ${timeStr}` + (isRecurring ? (dict['google-recurring-suffix'] || ' (Recurring)') : '');

      const eventHTML = `
        <a href="${googleContext.escapeHtml(eventLink)}" target="_blank" rel="noopener noreferrer" class="integration-item ${badgeClass} ${recurringClass}" data-tooltip="${googleContext.escapeHtml(tooltipText)}">
          <span class="item-title">${googleContext.escapeHtml(evt.summary)}</span>
          <div class="item-meta">
            <span>${repeatIcon}${googleContext.escapeHtml(timeStr)}</span>
            <span class="item-badge ${badgeClass}">${googleContext.escapeHtml(badgeLabel)}</span>
          </div>
        </a>
      `;

      if (isToday) {
        todayEvents.push(eventHTML);
      } else {
        const dateVal = evt.start.dateTime || evt.start.date;
        const relativeLabel = getRelativeDateLabel(dateVal);
        if (!weeklyGroups[relativeLabel]) {
          weeklyGroups[relativeLabel] = [];
        }
        weeklyGroups[relativeLabel].push(eventHTML);
      }
    });

    const weeklyHTML = [];
    let totalWeeklyCount = 0;
    Object.keys(weeklyGroups).forEach(label => {
      weeklyHTML.push(`<div class="schedule-group-header">${googleContext.escapeHtml(label)}</div>`);
      weeklyHTML.push(...weeklyGroups[label]);
      totalWeeklyCount += weeklyGroups[label].length;
    });

    if (weeklyBadge) {
      if (totalWeeklyCount > 0) {
        weeklyBadge.textContent = totalWeeklyCount;
        weeklyBadge.classList.remove('hidden');
      } else {
        weeklyBadge.classList.add('hidden');
      }
    }

    const todayBadge = document.getElementById('events-count-badge');
    if (todayBadge) {
      if (todayEvents.length > 0) {
        todayBadge.textContent = todayEvents.length;
        todayBadge.classList.remove('hidden');
      } else {
        todayBadge.classList.add('hidden');
      }
    }

    todayEventsContainer.innerHTML = todayEvents.length > 0 ? todayEvents.join('') : `<p class="empty-msg">${translations[googleContext.state.lang]['no-events']}</p>`;
    weeklyEventsContainer.innerHTML = weeklyHTML.length > 0 ? weeklyHTML.join('') : `<p class="empty-msg">${translations[googleContext.state.lang]['no-weekly-events']}</p>`;

  } catch (err) {
    console.error("Failed to load calendars", err);
    todayEventsContainer.innerHTML = `<p class="empty-msg" style="color:var(--danger)">Calendar Loading Error</p>`;
    weeklyEventsContainer.innerHTML = `<p class="empty-msg" style="color:var(--danger)">Calendar Loading Error</p>`;
  }
}
