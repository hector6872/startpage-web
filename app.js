import {
  setupGoogleContext,
  googleTokenClient,
  googleLoginTarget,
  setGoogleLoginTarget,
  getGoogleTokenClient,
  fetchGoogleUserEmail,
  initGoogleOAuth,
  refreshGoogleToken,
  handleInvalidToken,
  checkAndFetchGoogleEmails,
  updateGoogleAuthStatus,
  fetchGoogleData,
  fetchGoogleCalendar,
  fetchGmail,
  fetchGoogleTasks
} from "./services/google.js";
import { translations, quotesDb, getLocale } from './locales/index.js';
import {
  getDB,
  saveFileHandle,
  getFileHandle,
  clearFileHandle,
  verifyPermission,
  SENSITIVE_SETTING_KEYS,
  sanitizeSettingsForSync,
  mergeSettingsWithLocalSecrets
} from './services/storage.js';
import { fetchJira as fetchJiraService } from './services/jira.js';
import {
  updateGitStatusIndicators as gitUpdateIndicators,
  fetchAllPRs as gitFetchAllPRs
} from './services/git.js';

// Application State
let state = {
  lang: 'en',
  theme: 'system',
  todos: [],
  countdowns: [],
  googleClientToken: localStorage.getItem('google_access_token') || sessionStorage.getItem('google_access_token') || null,
  googlePersonalToken: localStorage.getItem('google_personal_token') || sessionStorage.getItem('google_personal_token') || null,
  googleWorkToken: localStorage.getItem('google_work_token') || sessionStorage.getItem('google_work_token') || null,
  googlePersonalEmail: localStorage.getItem('google_personal_email') || sessionStorage.getItem('google_personal_email') || null,
  googleWorkEmail: localStorage.getItem('google_work_email') || sessionStorage.getItem('google_work_email') || null,
  githubStatus: 'disconnected',
  githubError: '',
  bitbucketStatus: 'disconnected',
  bitbucketError: '',
  gitlabStatus: 'disconnected',
  gitlabError: '',
  settings: {
    lang: 'en',
    theme: 'system',
    primaryColor: 'blue',
    city: '',
    weatherUrl: 'https://weather.com',
    worldClockTz: '',
    worldClockLabel: '',
    worldClockUrl: 'https://time.is',
    notes: '',
    financeUrl: 'https://www.google.com/finance/beta/quote/.INX:INDEXSP?window=1M',
    timerUrl: 'https://www.google.com/search?q=countdown+timer',
    stopwatchUrl: 'https://www.google.com/search?q=stopwatch',
    showWeather: true,
    showWorldClock: true,
    showWikipedia: true,
    wikipediaType: 'news',
    storageMode: 'local', // local or file
    googleClientId: '',
    githubToken: '',
    githubUsername: '',
    bitbucketWorkspace: '',
    bitbucketUsername: '',
    bitbucketToken: '',
    jiraHost: '',
    jiraEmail: '',
    jiraToken: '',
    oooActive: false,
    oooUntil: null,
    hideJiraOoo: false,
    hideGithubOoo: false,
    hideBitbucketOoo: false,
    hideGitlabOoo: false,
    gitlabHost: 'https://gitlab.com',
    gitlabToken: '',
    gitlabUsername: ''
  }
};

// File Sync state variables
let fileHandle = null;

async function writeDataToFile() {
  if (state.settings.storageMode !== 'file' || !fileHandle) return;
  try {
    const hasPermission = await verifyPermission(fileHandle, true);
    if (!hasPermission) return;
    const writable = await fileHandle.createWritable();
    const dataToSave = {
      todos: state.todos,
      settings: sanitizeSettingsForSync(state.settings)
    };
    await writable.write(JSON.stringify(dataToSave, null, 2));
    await writable.close();
  } catch (err) {
    console.error("Error writing file:", err);
  }
}

async function readDataFromFile() {
  if (!fileHandle) return null;
  try {
    const hasPermission = await verifyPermission(fileHandle, false);
    if (!hasPermission) return null;
    const file = await fileHandle.getFile();
    const contents = await file.text();
    if (!contents.trim()) return null;
    return JSON.parse(contents);
  } catch (err) {
    console.error("Error reading file:", err);
    return null;
  }
}

async function initializeFileSync() {
  if (state.settings.storageMode !== 'file') {
    const el = document.getElementById('file-sync-settings');
    if (el) el.classList.add('hidden');
    return;
  }

  const el = document.getElementById('file-sync-settings');
  if (el) el.classList.remove('hidden');

  try {
    fileHandle = await getFileHandle();
    if (fileHandle) {
      const nameEl = document.getElementById('sync-file-name');
      if (nameEl) nameEl.textContent = fileHandle.name;
      
      // Read data and apply it
      const fileData = await readDataFromFile();
      if (fileData) {
        if (fileData.todos) state.todos = fileData.todos;
        if (fileData.settings) {
          state.settings = mergeSettingsWithLocalSecrets(fileData.settings, state.settings);
        }
        if (state.settings.lang) state.lang = state.settings.lang;
        if (state.settings.theme) state.theme = state.settings.theme;
        if (state.settings.primaryColor) applyPrimaryColor(state.settings.primaryColor);
        
        // Cache to localStorage
        localStorage.setItem('todos', JSON.stringify(state.todos));
        localStorage.setItem('dashboard_settings', JSON.stringify(state.settings));
        localStorage.setItem('theme', state.theme);
        
        // Refresh views
        applyTheme();
        renderTodos();
        renderCountdowns();
        updateUpcomingEventBanner();
        updateNotesBadge();
        updateOrganizerVisibility();
        translatePage();
        updateTimeAndGreeting();
        loadWeather();
        fetchAllPRs();
        fetchJira();
      }
    } else {
      const nameEl = document.getElementById('sync-file-name');
      if (nameEl) nameEl.textContent = (translations[state.lang] || translations.en)['no-file-selected'];
    }
  } catch (err) {
    console.error("Failed to restore file sync:", err);
    const nameEl = document.getElementById('sync-file-name');
    if (nameEl) nameEl.textContent = "Error: Permission denied";
  }
}

// Export state to a JSON file (sanitized)
function exportStateToFile() {
  const dataToSave = {
    todos: state.todos,
    settings: sanitizeSettingsForSync(state.settings)
  };
  const blob = new Blob([JSON.stringify(dataToSave, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dashboard-data-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import state from a JSON file
function importStateFromFile(file) {
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.todos) state.todos = data.todos;
      if (data.settings) {
        state.settings = mergeSettingsWithLocalSecrets(data.settings, state.settings);
      }
      if (state.settings.primaryColor) applyPrimaryColor(state.settings.primaryColor);
      
      await saveSettings();
      renderTodos();
      renderCountdowns();
      updateUpcomingEventBanner();
      updateNotesBadge();
      updateOrganizerVisibility();
      translatePage();
      updateTimeAndGreeting();
      loadWeather();
      
      fetchAllPRs();
      fetchJira();
      
      alert(state.lang === 'es' ? 'Datos importados con éxito.' : 'Data imported successfully.');
    } catch (err) {
      alert(state.lang === 'es' ? 'Archivo inválido.' : 'Invalid file.');
    }
  };
  reader.readAsText(file);
}

// Load settings and todos from localStorage
async function loadState() {
  const storedSettings = localStorage.getItem('dashboard_settings');
  if (storedSettings) {
    state.settings = { ...state.settings, ...JSON.parse(storedSettings) };
  }
  state.settings.customEvents = state.settings.customEvents || [];
  state.settings.primaryColor = state.settings.primaryColor || 'blue';
  state.settings.weatherUrl = state.settings.weatherUrl || 'https://weather.com';
  state.settings.worldClockUrl = state.settings.worldClockUrl || 'https://time.is';
  state.lang = state.settings.lang || 'en';
  state.theme = state.settings.theme || localStorage.getItem('theme') || 'system';

  // Check Out of Office (OOO) expiration
  if (state.settings.oooActive && state.settings.oooUntil) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const oooUntilDate = new Date(state.settings.oooUntil + 'T00:00:00');
    if (today >= oooUntilDate) {
      state.settings.oooActive = false;
      state.settings.oooUntil = null;
      localStorage.setItem('dashboard_settings', JSON.stringify(state.settings));
    }
  }

  updateOooBadges();

  applyPrimaryColor(state.settings.primaryColor);
  applyAccountColors();

  const storedTodos = localStorage.getItem('todos');
  if (storedTodos) {
    state.todos = JSON.parse(storedTodos);
  }

  // Countdowns are now customEvents from settings, no local countdowns needed

  // Initialize file sync if enabled
  if (state.settings.storageMode === 'file') {
    await initializeFileSync();
  }

  // Clean up completed todos older than 7 days upon loading
  await cleanupOldCompletedTodos();

  // Initialize organizer visibility settings
  updateOrganizerVisibility();
}

function updateOooBadges() {
  const active = state.settings.oooActive === true;
  const badgeToday = document.getElementById('ooo-badge-today');
  const badgeWeek = document.getElementById('ooo-badge-week');
  const badgeWork = document.getElementById('ooo-badge-work');
  if (badgeToday) badgeToday.classList.toggle('hidden', !active);
  if (badgeWeek) badgeWeek.classList.toggle('hidden', !active);
  if (badgeWork) badgeWork.classList.toggle('hidden', !active);
}

async function cleanupOldCompletedTodos() {
  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  let changed = false;
  state.todos = state.todos.filter(todo => {
    if (todo.completed) {
      if (!todo.completedAt) {
        todo.completedAt = new Date().toISOString();
        changed = true;
        return true;
      }
      const completedTime = new Date(todo.completedAt).getTime();
      if (completedTime < sevenDaysAgo) {
        changed = true;
        return false;
      }
    }
    return true;
  });
  if (changed) {
    await saveTodos();
  }
}

// Save settings to localStorage
async function saveSettings() {
  state.settings.theme = state.theme;
  localStorage.setItem('dashboard_settings', JSON.stringify(state.settings));
  localStorage.setItem('theme', state.theme);
  updateNotesBadge();

  if (state.settings.storageMode === 'file') {
    await writeDataToFile();
  }
}

function updateNotesBadge() {
  const badge = document.getElementById('notes-badge');
  if (!badge) return;
  const hasNotes = state.settings.notes && state.settings.notes.trim().length > 0;
  if (hasNotes) {
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

function updateUpcomingEventBanner() {
  const container = document.getElementById('events-banner-container');
  if (!container) return;
  
  if (state.settings.showCountdowns === false) {
    container.classList.add('hidden');
    container.innerHTML = '';
    return;
  }
  container.classList.remove('hidden');
  container.innerHTML = '';

  const events = state.settings.customEvents || [];
  if (events.length === 0) {
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentYear = today.getFullYear();

  let todayEvents = [];
  let pastEvents = [];
  let upcomingEvents = [];

  events.forEach(evt => {
    const [year, monthStr, dayStr] = evt.date.split('-');
    const month = parseInt(monthStr, 10) - 1;
    const day = parseInt(dayStr, 10);

    // Calculate occurrence in current year
    let eventDateThisYear = new Date(currentYear, month, day);
    
    if (today.getMonth() === month && today.getDate() === day) {
      todayEvents.push(evt);
    } else if (eventDateThisYear < today) {
      const timeDiff = today.getTime() - eventDateThisYear.getTime();
      const daysAgo = Math.floor(timeDiff / (1000 * 3600 * 24));
      pastEvents.push({
        ...evt,
        daysAgo
      });
      
      // Also calculate next year's upcoming occurrence
      let nextYearEvent = new Date(eventDateThisYear);
      nextYearEvent.setFullYear(currentYear + 1);
      const nextDiff = nextYearEvent.getTime() - today.getTime();
      const daysLeft = Math.ceil(nextDiff / (1000 * 3600 * 24));
      upcomingEvents.push({
        ...evt,
        daysLeft
      });
    } else {
      const timeDiff = eventDateThisYear.getTime() - today.getTime();
      const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
      upcomingEvents.push({
        ...evt,
        daysLeft
      });
    }
  });

  let activeChipsHTML = '';

  if (todayEvents.length > 0) {
    const names = todayEvents.map(e => e.name).join(', ');
    const labelText = state.lang === 'es' 
      ? `🎉 Hoy: ¡${names}! 🎂`
      : `🎉 Today: ${names}! 🎂`;
    activeChipsHTML += `<div class="event-banner today">${escapeHtml(labelText)}</div>`;
    
    const remainingCount = events.length - todayEvents.length;
    if (remainingCount > 0) {
      const moreText = state.lang === 'es' ? `+${remainingCount} más` : `+${remainingCount} more`;
      activeChipsHTML += `<div class="event-banner more-chip">${escapeHtml(moreText)}</div>`;
    }
  } else if (pastEvents.length > 0) {
    pastEvents.sort((a, b) => a.daysAgo - b.daysAgo);
    const closestPast = pastEvents[0];
    const timeAgoText = closestPast.daysAgo === 1
      ? (state.lang === 'es' ? 'ayer' : 'yesterday')
      : (state.lang === 'es' ? `hace ${closestPast.daysAgo} días` : `${closestPast.daysAgo} days ago`);
    const labelText = state.lang === 'es'
      ? `⚠️ Evento pasado: ${closestPast.name} (${timeAgoText})`
      : `⚠️ Past event: ${closestPast.name} (${timeAgoText})`;
    activeChipsHTML += `<div class="event-banner past-warning">${escapeHtml(labelText)}</div>`;
    
    const remainingCount = events.length - 1;
    if (remainingCount > 0) {
      const moreText = state.lang === 'es' ? `+${remainingCount} más` : `+${remainingCount} more`;
      activeChipsHTML += `<div class="event-banner more-chip">${escapeHtml(moreText)}</div>`;
    }
  } else if (upcomingEvents.length > 0) {
    upcomingEvents.sort((a, b) => a.daysLeft - b.daysLeft);
    const closest = upcomingEvents[0];
    let bannerClass = 'upcoming';
    if (closest.daysLeft < 7) {
      bannerClass = 'soon';
    } else if (closest.daysLeft < 31) {
      bannerClass = 'today';
    }
    
    const isBirthday = closest.name.toLowerCase().includes('birthday') || closest.name.toLowerCase().includes('cumpleaños');
    const icon = isBirthday ? '🎈' : '📅';
    
    let timeText = '';
    if (state.lang === 'es') {
      timeText = closest.daysLeft === 1 ? 'mañana' : `en ${closest.daysLeft} días`;
    } else {
      timeText = closest.daysLeft === 1 ? 'tomorrow' : `in ${closest.daysLeft} days`;
    }
    const labelText = `${icon} ${closest.name} (${timeText})`;
    activeChipsHTML += `<div class="event-banner ${bannerClass}">${escapeHtml(labelText)}</div>`;
    
    const remainingCount = upcomingEvents.length - 1;
    if (remainingCount > 0) {
      const moreText = state.lang === 'es' ? `+${remainingCount} más` : `+${remainingCount} more`;
      activeChipsHTML += `<div class="event-banner more-chip">${escapeHtml(moreText)}</div>`;
    }
  }

  container.innerHTML = activeChipsHTML;
}

function renderSettingsEventsList() {
  const listEl = document.getElementById('settings-events-list');
  if (!listEl) return;
  listEl.innerHTML = '';

  const events = state.settings.customEvents || [];
  if (events.length === 0) {
    const emptyMsg = document.createElement('li');
    emptyMsg.style.color = 'var(--text-secondary)';
    emptyMsg.style.fontSize = '0.8rem';
    emptyMsg.style.justifyContent = 'center';
    emptyMsg.textContent = state.lang === 'es' ? 'No hay acontecimientos.' : 'No events configured.';
    listEl.appendChild(emptyMsg);
    return;
  }

  // Sort events chronologically (January -> December)
  const sortedEvents = [...events].sort((a, b) => {
    const [, mA, dA] = a.date.split('-').map(Number);
    const [, mB, dB] = b.date.split('-').map(Number);
    if (mA !== mB) return mA - mB;
    return dA - dB;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentYear = today.getFullYear();

  sortedEvents.forEach((evt) => {
    const li = document.createElement('li');
    
    const infoDiv = document.createElement('div');
    infoDiv.className = 'event-item-info';
    
    const nameSpan = document.createElement('span');
    nameSpan.className = 'event-item-name';
    nameSpan.textContent = evt.name;
    
    const dateRow = document.createElement('div');
    dateRow.style.display = 'flex';
    dateRow.style.alignItems = 'center';
    dateRow.style.gap = '0.5rem';
    
    const dateSpan = document.createElement('span');
    dateSpan.className = 'event-item-date';
    const [y, m, d] = evt.date.split('-');
    const dateObj = new Date(y, parseInt(m, 10) - 1, d);
    dateSpan.textContent = dateObj.toLocaleDateString(getLocale(state.lang), { day: 'numeric', month: 'short' });
    
    dateRow.appendChild(dateSpan);
    
    const eventDateThisYear = new Date(currentYear, parseInt(m, 10) - 1, parseInt(d, 10));
    const isOverdue = eventDateThisYear < today && !(today.getMonth() === parseInt(m, 10) - 1 && today.getDate() === parseInt(d, 10));
    if (isOverdue) {
      const overdueBadge = document.createElement('span');
      overdueBadge.className = 'event-overdue-badge';
      overdueBadge.textContent = state.lang === 'es' ? 'Vencido' : 'Overdue';
      dateRow.appendChild(overdueBadge);
    }

    infoDiv.appendChild(nameSpan);
    infoDiv.appendChild(dateRow);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn-delete-event';
    deleteBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
    `;
    deleteBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      // Filter out by ID instead of index
      state.settings.customEvents = state.settings.customEvents.filter(item => item.id !== evt.id);
      await saveSettings();
      renderSettingsEventsList();
      updateUpcomingEventBanner();
    });
    
    li.appendChild(infoDiv);
    li.appendChild(deleteBtn);
    listEl.appendChild(li);
  });
}

// i18n Translation Engine
function translatePage() {
  const dictionary = translations[state.lang] || translations['en'];
  
  // Translate standard content elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dictionary[key]) {
      el.textContent = dictionary[key];
    }
  });

  // Translate input placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dictionary[key]) {
      el.setAttribute('placeholder', dictionary[key]);
    }
  });

  // Translate titles
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (dictionary[key]) {
      el.setAttribute('title', dictionary[key]);
    }
  });

  // Update UI lang toggle button text if exists
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.textContent = state.lang.toUpperCase();
  }
}

// DateTime / Greeting System
function updateTimeAndGreeting() {
  const now = new Date();
  
  // Format Clock
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  // Format Date
  const dateOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const locale = getLocale(state.lang);
  document.getElementById('current-date').textContent = now.toLocaleDateString(locale, dateOptions);

  // Greeting
  const hour = now.getHours();
  let greetingKey = 'greeting-morning';
  if (hour >= 12 && hour < 19) {
    greetingKey = 'greeting-afternoon';
  } else if (hour >= 19 || hour < 6) {
    greetingKey = 'greeting-evening';
  }
  const greetingText = translations[state.lang][greetingKey];
  let fullGreeting = greetingText;
  if (state.settings.oooActive) {
    const oooEmojis = ['🏝️', '🏖️', '🍹', '🌊', '⛺', '🌴'];
    const emoji = oooEmojis[(now.getDate() + now.getMonth()) % oooEmojis.length];
    fullGreeting = `${greetingText} ${emoji}`;
  }
  document.getElementById('greeting').textContent = `${fullGreeting}`;

  // Update World Clock
  updateWorldClock();

  // Update Upcoming Event Banner
  updateUpcomingEventBanner();
}

// World Clock System
function getTzDifference(targetTz) {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: targetTz,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    });
    
    const parts = formatter.formatToParts(now);
    const p = {};
    for (const part of parts) {
      if (part.type !== 'literal') {
        p[part.type] = parseInt(part.value, 10);
      }
    }
    const targetHour = (p.hour || 0) % 24;
    
    const localMs = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
    const targetMs = Date.UTC(p.year, p.month - 1, p.day, targetHour, p.minute);
    
    const diffMinutes = Math.round((targetMs - localMs) / (1000 * 60));
    const diffHours = Math.round(diffMinutes / 60);
    
    const localDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetDate = new Date(p.year, p.month - 1, p.day);
    const dayDiffDays = Math.round((targetDate - localDate) / (1000 * 3600 * 24));
    
    return { diffHours, dayDiffDays };
  } catch (e) {
    console.error("Error computing tz difference:", e);
    return { diffHours: 0, dayDiffDays: 0 };
  }
}

function updateWorldClock() {
  const widget = document.getElementById('world-clock-widget');
  if (state.settings.showWorldClock === false) {
    widget.classList.add('hidden');
    return;
  }
  
  widget.classList.remove('hidden');
  const dict = translations[state.lang];

  if (!state.settings.worldClockTz) {
    widget.classList.add('unconfigured');
    widget.removeAttribute('title');
    const clockLabelEl = widget.querySelector('.clock-label');
    if (clockLabelEl) clockLabelEl.removeAttribute('title');
    const unconfEl = widget.querySelector('.clock-unconfigured-text');
    if (unconfEl) unconfEl.textContent = dict['world-clock-unconfigured'];
    return;
  }
  widget.classList.remove('unconfigured');

  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat(getLocale(state.lang), {
      timeZone: state.settings.worldClockTz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    widget.querySelector('.clock-time').textContent = formatter.format(now);
    
    // Label logic: custom label if set, otherwise cities without acronyms. Tooltip is ALWAYS the full timezone string.
    let customLabel = state.settings.worldClockLabel ? state.settings.worldClockLabel.trim() : '';
    let optionText = '';
    
    if (state.settings.worldClockTz) {
      const tzSelect = document.getElementById('settings-world-clock-tz');
      if (tzSelect) {
        const option = tzSelect.querySelector(`option[value="${state.settings.worldClockTz}"]`);
        if (option && option.textContent) {
          optionText = option.textContent.trim();
        }
      }
      if (!optionText) {
        optionText = state.settings.worldClockTz.split('/').pop().replace(/_/g, ' ');
      }
    }

    const fullTooltip = optionText;
    let labelText = customLabel;
    if (!labelText) {
      labelText = optionText.replace(/\s*\([^)]*\)/g, '').trim();
    }
    
    widget.title = fullTooltip;
    const clockLabelEl = widget.querySelector('.clock-label');
    if (clockLabelEl) {
      clockLabelEl.textContent = labelText;
      clockLabelEl.title = fullTooltip;
    }
    
    // Calculate and update time difference text & day/night icon below clock time
    const diffInfo = getTzDifference(state.settings.worldClockTz);
    const diffEl = widget.querySelector('.clock-diff');
    if (diffEl) {
      // Determine if it's day or night in target timezone (6:00 to 19:59 is day)
      let targetHour = 12;
      try {
        const hourFormatter = new Intl.DateTimeFormat('en-US', {
          timeZone: state.settings.worldClockTz,
          hour: 'numeric',
          hour12: false
        });
        targetHour = parseInt(hourFormatter.format(now), 10);
      } catch (err) {
        targetHour = now.getHours();
      }
      const isDaytime = targetHour >= 6 && targetHour < 20;

      const sunSvg = `<svg class="clock-daynight-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #f59e0b; display: inline-block; vertical-align: -1px; margin-left: 4px;"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
      const moonSvg = `<svg class="clock-daynight-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #818cf8; display: inline-block; vertical-align: -1px; margin-left: 4px;"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
      const dayNightIcon = isDaytime ? sunSvg : moonSvg;

      if (diffInfo.diffHours === 0 && diffInfo.dayDiffDays === 0) {
        const sameTimeStr = dict['world-clock-same-time'] || (state.lang === 'es' ? 'Misma hora' : 'Same time');
        diffEl.innerHTML = `${sameTimeStr} ${dayNightIcon}`;
      } else {
        let diffStr = '';
        const absDiff = Math.abs(diffInfo.diffHours);
        if (state.lang === 'es') {
          const hLabel = absDiff === 1 ? 'hora' : 'horas';
          diffStr = diffInfo.diffHours > 0 ? `+${diffInfo.diffHours} ${hLabel}` : `${diffInfo.diffHours} ${hLabel}`;
        } else {
          const hLabel = absDiff === 1 ? 'hour' : 'hours';
          diffStr = diffInfo.diffHours > 0 ? `+${diffInfo.diffHours} ${hLabel}` : `${diffInfo.diffHours} ${hLabel}`;
        }

        let dayStr = '';
        if (diffInfo.dayDiffDays === 1) {
          dayStr = state.lang === 'es' ? ' (mañana)' : ' (tomorrow)';
        } else if (diffInfo.dayDiffDays === -1) {
          dayStr = state.lang === 'es' ? ' (ayer)' : ' (yesterday)';
        } else if (diffInfo.dayDiffDays > 1) {
          dayStr = ` (+${diffInfo.dayDiffDays}d)`;
        } else if (diffInfo.dayDiffDays < -1) {
          dayStr = ` (${diffInfo.dayDiffDays}d)`;
        }

        diffEl.innerHTML = `${diffStr}${dayStr} ${dayNightIcon}`;
      }
    }
  } catch (e) {
    console.error("Error updating world clock:", e);
    widget.classList.add('hidden');
  }
}

// Primary Color Accent Management
function applyPrimaryColor(colorName = 'blue') {
  const validColors = ['blue', 'indigo', 'purple', 'pink', 'red', 'orange', 'green', 'teal', 'slate', 'black'];
  const color = validColors.includes(colorName) ? colorName : 'blue';
  document.documentElement.setAttribute('data-accent', color);
}

// Personal & Work Custom Colors Management
function applyAccountColors() {
  const isDark = document.documentElement.classList.contains('dark');
  const colorMap = {
    blue: isDark ? '#60a5fa' : '#1e70e0',
    indigo: '#6366f1',
    purple: isDark ? '#a78bfa' : '#7c3aed',
    pink: '#ec4899',
    red: '#ef4444',
    orange: '#f97316',
    green: '#10b981',
    teal: '#06b6d4',
    slate: '#64748b',
    black: isDark ? '#e4e4e7' : '#18181b'
  };

  const personal = state.settings.personalColor || 'blue';
  const work = state.settings.workColor || 'black';

  document.documentElement.style.setProperty('--personal-color', colorMap[personal] || colorMap.blue);
  document.documentElement.style.setProperty('--work-color', colorMap[work] || colorMap.black);
}

function updateSwatchActiveState(selectedColor) {
  const swatches = document.querySelectorAll('#color-picker-swatches .color-swatch-btn');
  swatches.forEach(btn => {
    if (btn.getAttribute('data-color') === selectedColor) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function updateAccountSwatchActiveState(containerId, selectedColor) {
  const swatches = document.querySelectorAll(`#${containerId} .color-swatch-btn`);
  swatches.forEach(btn => {
    if (btn.getAttribute('data-color') === selectedColor) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Theme management
function applyTheme() {
  const html = document.documentElement;
  html.classList.remove('dark', 'light');
  
  if (state.theme === 'dark') {
    html.classList.add('dark');
  } else if (state.theme === 'light') {
    html.classList.add('light');
  } else {
    // System Theme detection
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isSystemDark) {
      html.classList.add('dark');
    }
  }
  
  applyAccountColors();
}

// Theme switch action
async function toggleTheme() {
  if (state.theme === 'system') {
    state.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'light' : 'dark';
  } else {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
  }
  await saveSettings();
  applyTheme();
}

function toSentenceCase(str) {
  if (!str) return '';
  const lower = str.toLowerCase();
  return lower.replace(/(^\s*|[.!?]\s+)([a-z])/g, (match, separator, char) => separator + char.toUpperCase());
}

// Wikipedia & Dynamic Content System
let wikiFeaturedCache = {};
let wikiOnThisDayCache = {};
let wikiTopReadIndex = 0;
let wikiNewsIndex = 0;
let wikiOnThisDayIndex = 0;
let currentQuoteData = null;

function formatViewsCount(num) {
  if (!num) return '';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
}

async function loadWikipediaContent() {
  const quoteWidget = document.getElementById('quote-widget');
  if (!quoteWidget) return;

  if (state.settings.showWikipedia === false) {
    quoteWidget.classList.add('hidden');
    return;
  }
  quoteWidget.classList.remove('hidden');

  const type = state.settings.wikipediaType || 'news';
  const lang = state.lang === 'es' ? 'es' : 'en';
  const dict = translations[state.lang] || translations.en;
  const container = quoteWidget.querySelector('.quote-container');
  if (!container) return;

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  if (type === 'quote') {
    renderQuoteMode();
  } else if (type === 'topread') {
    await renderTopReadMode();
  } else if (type === 'news') {
    await renderNewsMode();
  } else if (type === 'onthisday') {
    await renderOnThisDayMode();
  }

  function renderQuoteMode() {
    if (currentQuoteData) {
      displayQuote(currentQuoteData.text, currentQuoteData.author);
      return;
    }
    container.innerHTML = `<span class="quote-text">${dict['quote-loading']}</span>`;
    fetch('https://dummyjson.com/quotes/random')
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        if (state.lang === 'es') {
          useLocalQuote();
        } else {
          currentQuoteData = { text: data.quote, author: data.author };
          displayQuote(currentQuoteData.text, currentQuoteData.author);
        }
      })
      .catch(() => {
        useLocalQuote();
      });

    function useLocalQuote() {
      const list = quotesDb[state.lang] || quotesDb['en'];
      const item = list[Math.floor(Math.random() * list.length)];
      currentQuoteData = { text: item.text, author: item.author };
      displayQuote(item.text, item.author);
    }
  }

  function displayQuote(text, author) {
    const cleanAuthor = author ? author.replace(/^[\s–—-]+/, '').trim() : '';
    const wikiLang = state.lang === 'es' ? 'es' : 'en';
    const authorUrl = cleanAuthor ? `https://${wikiLang}.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(cleanAuthor)}` : '';
    const authorTitle = state.lang === 'es' ? `Ver ${cleanAuthor} en Wikipedia` : `View ${cleanAuthor} on Wikipedia`;
    const badgeTooltip = state.lang === 'es' ? 'Cambiar contenido en Configuración' : 'Change content in Settings';
    
    container.innerHTML = `
      <span class="wiki-badge" data-tooltip="${badgeTooltip}" onclick="window.openSettingsWikipediaTab()" title="${badgeTooltip}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v2h-2zm0-10h2v8h-2z"/></svg>
        ${dict['wiki-badge-quote'] || 'Quote'}
      </span>
      <div class="wiki-nav-controls">
        <button id="copy-quote-btn" class="wiki-nav-btn copy-quote-btn" title="Copy quote" aria-label="Copy quote">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
        <button id="refresh-quote-btn" class="wiki-nav-btn" title="${dict['wiki-refresh'] || 'Shuffle'}" aria-label="Shuffle quote">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
        </button>
      </div>
      <span class="quote-text">"${toSentenceCase(text)}"</span>
      ${cleanAuthor ? `<span class="quote-sep"> – </span><a class="quote-author wiki-link" href="${authorUrl}" target="_blank" rel="noopener noreferrer" title="${authorTitle}">${cleanAuthor}</a>` : ''}
    `;

    const copyBtn = container.querySelector('#copy-quote-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const textToCopy = cleanAuthor ? `"${text}" – ${cleanAuthor}` : `"${text}"`;
        navigator.clipboard.writeText(textToCopy).then(() => {
          const originalSVG = copyBtn.innerHTML;
          copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
          copyBtn.classList.add('copied');
          setTimeout(() => {
            copyBtn.innerHTML = originalSVG;
            copyBtn.classList.remove('copied');
          }, 2000);
        });
      });
    }

    const refreshBtn = container.querySelector('#refresh-quote-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        currentQuoteData = null;
        renderQuoteMode();
      });
    }
  }

  async function fetchFeaturedFeed(feedLang) {
    const key = `${feedLang}-${year}-${month}-${day}`;
    if (wikiFeaturedCache[key]) return wikiFeaturedCache[key];

    try {
      const res = await fetch(`https://${feedLang}.wikipedia.org/api/rest_v1/feed/featured/${year}/${month}/${day}`);
      if (res.ok) {
        const data = await res.json();
        wikiFeaturedCache[key] = data;
        return data;
      }
    } catch (e) {
      console.warn('Failed to fetch Wikipedia featured feed for', feedLang, e);
    }
    return null;
  }

  async function renderTopReadMode() {
    container.innerHTML = `<span class="quote-text">${dict['wiki-loading']}</span>`;
    let data = await fetchFeaturedFeed(lang);
    if (!data || !data.mostread || !data.mostread.articles || data.mostread.articles.length === 0) {
      if (lang !== 'en') {
        data = await fetchFeaturedFeed('en');
      }
    }

    if (!data || !data.mostread || !data.mostread.articles || data.mostread.articles.length === 0) {
      container.innerHTML = `<span class="quote-text">${dict['wiki-error']}</span>`;
      return;
    }

    const articles = data.mostread.articles.filter(a => 
      !a.title.includes('Special:') && 
      !a.title.includes('Wikipedia:') && 
      !a.title.includes('Main_Page') && 
      !a.title.includes('Portada')
    );

    if (articles.length === 0) {
      container.innerHTML = `<span class="quote-text">${dict['wiki-error']}</span>`;
      return;
    }

    if (wikiTopReadIndex >= articles.length) wikiTopReadIndex = 0;
    if (wikiTopReadIndex < 0) wikiTopReadIndex = articles.length - 1;

    const cur = articles[wikiTopReadIndex];
    const pageUrl = cur.content_urls?.desktop?.page || `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(cur.title)}`;
    const displayTitle = cur.displaytitle ? cur.displaytitle.replace(/<[^>]+>/g, '') : cur.title.replace(/_/g, ' ');
    const viewsStr = formatViewsCount(cur.views);
    const badgeTooltip = state.lang === 'es' ? 'Cambiar contenido en Configuración' : 'Change content in Settings';

    container.innerHTML = `
      <span class="wiki-badge" data-tooltip="${badgeTooltip}" onclick="window.openSettingsWikipediaTab()" title="${badgeTooltip}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 6l-9.5 9.5-5-5L1 18"></path><path d="M17 6h6v6"></path></svg>
        ${dict['wiki-badge-topread'] || 'Top Read'} #${wikiTopReadIndex + 1}
      </span>
      <div class="wiki-nav-controls">
        <button id="wiki-prev-btn" class="wiki-nav-btn" title="${dict['wiki-prev']}" aria-label="Previous">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button id="wiki-next-btn" class="wiki-nav-btn" title="${dict['wiki-next']}" aria-label="Next">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
      <a class="wiki-link" href="${pageUrl}" target="_blank" rel="noopener noreferrer" title="${cur.extract || displayTitle}">${displayTitle}</a>
      ${viewsStr ? `<span class="wiki-views-badge">👁️ ${viewsStr} ${dict['wiki-views']}</span>` : ''}
    `;

    container.querySelector('#wiki-prev-btn')?.addEventListener('click', () => {
      wikiTopReadIndex--;
      renderTopReadMode();
    });
    container.querySelector('#wiki-next-btn')?.addEventListener('click', () => {
      wikiTopReadIndex++;
      renderTopReadMode();
    });
  }

  function formatNewsHtml(cur, feedLang) {
    let rawHtml = cur.story || '';
    const linksMap = new Map();

    if (Array.isArray(cur.links)) {
      cur.links.forEach(item => {
        const title = item.title ? item.title.replace(/_/g, ' ') : '';
        const url = item.content_urls?.desktop?.page || `https://${feedLang}.wikipedia.org/wiki/${encodeURIComponent(item.title || title)}`;
        if (title) {
          linksMap.set(title.toLowerCase(), { title, url, extract: item.extract || '' });
        }
        if (item.displaytitle) {
          const cleanDisplay = item.displaytitle.replace(/<[^>]+>/g, '');
          linksMap.set(cleanDisplay.toLowerCase(), { title: cleanDisplay, url, extract: item.extract || '' });
        }
      });
    }

    const temp = document.createElement('div');
    temp.innerHTML = rawHtml;

    // Convert existing <a> tags into working Wikipedia / Google search links
    const aTags = temp.querySelectorAll('a');
    if (aTags.length > 0) {
      aTags.forEach(a => {
        a.className = 'wiki-link';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        const text = a.textContent.trim();
        let href = a.getAttribute('href') || '';
        const matched = linksMap.get(text.toLowerCase());

        if (matched) {
          a.href = matched.url;
          if (matched.extract) a.title = matched.extract;
        } else if (href.startsWith('/wiki/') || href.startsWith('./')) {
          const rawTitle = href.replace(/^(\/wiki\/|\.\/)/, '');
          a.href = `https://${feedLang}.wikipedia.org/wiki/${rawTitle}`;
        } else if (href.startsWith('http')) {
          a.href = href;
        } else if (text) {
          a.href = `https://${feedLang}.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(text)}`;
        } else {
          a.href = `https://www.google.com/search?q=${encodeURIComponent(cur.story?.replace(/<[^>]+>/g, '') || '')}`;
        }
      });
    }

    // Convert bold <b> / <strong> tags to clickable links if they correspond to articles
    const bTags = temp.querySelectorAll('b, strong');
    bTags.forEach(b => {
      if (b.closest('a')) return;
      const text = b.textContent.trim();
      const matched = linksMap.get(text.toLowerCase());
      const a = document.createElement('a');
      a.className = 'wiki-link';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.innerHTML = b.innerHTML;

      if (matched) {
        a.href = matched.url;
        if (matched.extract) a.title = matched.extract;
      } else if (text) {
        a.href = `https://${feedLang}.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(text)}`;
      } else {
        a.href = `https://www.google.com/search?q=${encodeURIComponent(text)}`;
      }
      b.replaceWith(a);
    });

    let resultHtml = temp.innerHTML;

    // Check if there are any clickable links in the rendered output
    if (!resultHtml.includes('<a class="wiki-link"')) {
      const cleanStory = cur.story ? cur.story.replace(/<[^>]+>/g, '').trim() : '';
      if (cleanStory) {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(cleanStory)}`;
        resultHtml = `<a class="wiki-link" href="${searchUrl}" target="_blank" rel="noopener noreferrer" title="Buscar en Google">${resultHtml}</a>`;
      }
    }

    // Append extra article links from cur.links if they were not already mentioned in the text
    if (Array.isArray(cur.links)) {
      cur.links.forEach(item => {
        const title = item.displaytitle ? item.displaytitle.replace(/<[^>]+>/g, '') : (item.title ? item.title.replace(/_/g, ' ') : '');
        const url = item.content_urls?.desktop?.page || `https://${feedLang}.wikipedia.org/wiki/${encodeURIComponent(item.title || title)}`;
        if (title && !resultHtml.includes(url) && !resultHtml.toLowerCase().includes(title.toLowerCase())) {
          resultHtml += ` <a class="wiki-link" href="${url}" target="_blank" rel="noopener noreferrer" title="${item.extract || title}">↗ ${title}</a>`;
        }
      });
    }

    return resultHtml;
  }

  async function renderNewsMode() {
    container.innerHTML = `<span class="quote-text">${dict['wiki-loading']}</span>`;
    let data = await fetchFeaturedFeed(lang);
    if (!data || !data.news || data.news.length === 0) {
      if (lang !== 'en') {
        data = await fetchFeaturedFeed('en');
      }
    }

    if (!data || !data.news || data.news.length === 0) {
      container.innerHTML = `<span class="quote-text">${dict['wiki-error']}</span>`;
      return;
    }

    const newsItems = data.news;
    if (wikiNewsIndex >= newsItems.length) wikiNewsIndex = 0;
    if (wikiNewsIndex < 0) wikiNewsIndex = newsItems.length - 1;

    const cur = newsItems[wikiNewsIndex];
    const storyHtml = formatNewsHtml(cur, lang);
    const badgeTooltip = state.lang === 'es' ? 'Cambiar contenido en Configuración' : 'Change content in Settings';

    container.innerHTML = `
      <span class="wiki-badge" data-tooltip="${badgeTooltip}" onclick="window.openSettingsWikipediaTab()" title="${badgeTooltip}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path><path d="M18 14h-8"></path><path d="M15 18h-5"></path><path d="M10 6h8v4h-8V6Z"></path></svg>
        ${dict['wiki-badge-news'] || 'In the News'}
      </span>
      <div class="wiki-nav-controls">
        <button id="wiki-prev-btn" class="wiki-nav-btn" title="${dict['wiki-prev']}" aria-label="Previous">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button id="wiki-next-btn" class="wiki-nav-btn" title="${dict['wiki-next']}" aria-label="Next">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
      <span>${storyHtml}</span>
    `;

    container.querySelector('#wiki-prev-btn')?.addEventListener('click', () => {
      wikiNewsIndex--;
      renderNewsMode();
    });
    container.querySelector('#wiki-next-btn')?.addEventListener('click', () => {
      wikiNewsIndex++;
      renderNewsMode();
    });
  }

  async function renderOnThisDayMode() {
    container.innerHTML = `<span class="quote-text">${dict['wiki-loading']}</span>`;
    const cacheKey = `${lang}-${month}-${day}`;
    let events = wikiOnThisDayCache[cacheKey];

    if (!events) {
      try {
        const res = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/feed/onthisday/selected/${month}/${day}`);
        if (res.ok) {
          const resData = await res.json();
          events = resData.selected || resData.events || [];
        }
      } catch (e) {
        console.warn('Failed to fetch onthisday for', lang, e);
      }

      if ((!events || events.length === 0) && lang !== 'en') {
        try {
          const res = await fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/selected/${month}/${day}`);
          if (res.ok) {
            const resData = await res.json();
            events = resData.selected || resData.events || [];
          }
        } catch (e) {
          console.warn('Failed to fetch English onthisday', e);
        }
      }

      if (events && events.length > 0) {
        wikiOnThisDayCache[cacheKey] = events;
      }
    }

    if (!events || events.length === 0) {
      container.innerHTML = `<span class="quote-text">${dict['wiki-error']}</span>`;
      return;
    }

    if (wikiOnThisDayIndex >= events.length) wikiOnThisDayIndex = 0;
    if (wikiOnThisDayIndex < 0) wikiOnThisDayIndex = events.length - 1;

    const cur = events[wikiOnThisDayIndex];
    let pageLinkHtml = '';
    if (cur.pages && cur.pages.length > 0) {
      cur.pages.slice(0, 3).forEach(p => {
        const pageUrl = p.content_urls?.desktop?.page || `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(p.title)}`;
        const pageTitle = p.titles?.normalized || p.title.replace(/_/g, ' ');
        pageLinkHtml += ` <a class="wiki-link" href="${pageUrl}" target="_blank" rel="noopener noreferrer" title="${p.extract || pageTitle}">↗ ${pageTitle}</a>`;
      });
    } else if (cur.text) {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent((cur.year ? cur.year + ' ' : '') + cur.text)}`;
      pageLinkHtml = ` <a class="wiki-link" href="${searchUrl}" target="_blank" rel="noopener noreferrer" title="Buscar en Google">↗ Google</a>`;
    }

    const badgeTooltip = state.lang === 'es' ? 'Cambiar contenido en Configuración' : 'Change content in Settings';

    container.innerHTML = `
      <span class="wiki-badge" data-tooltip="${badgeTooltip}" onclick="window.openSettingsWikipediaTab()" title="${badgeTooltip}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        ${dict['wiki-badge-onthisday'] || 'On This Day'}
      </span>
      <div class="wiki-nav-controls">
        <button id="wiki-prev-btn" class="wiki-nav-btn" title="${dict['wiki-prev']}" aria-label="Previous">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button id="wiki-next-btn" class="wiki-nav-btn" title="${dict['wiki-next']}" aria-label="Next">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
      ${cur.year ? `<span class="wiki-year-badge">${cur.year}</span>` : ''}
      <span>${cur.text}</span>
      ${pageLinkHtml}
    `;

    container.querySelector('#wiki-prev-btn')?.addEventListener('click', () => {
      wikiOnThisDayIndex--;
      renderOnThisDayMode();
    });
    container.querySelector('#wiki-next-btn')?.addEventListener('click', () => {
      wikiOnThisDayIndex++;
      renderOnThisDayMode();
    });
  }
}

function loadQuote() {
  loadWikipediaContent();
}

// Weather System (Open-Meteo)
async function loadWeather() {
  const weatherWidget = document.getElementById('weather-widget');
  if (state.settings.showWeather === false) {
    weatherWidget.classList.add('hidden');
    return;
  }
  weatherWidget.classList.remove('hidden');
  weatherWidget.classList.add('loading');

  const dict = translations[state.lang];

  try {
    let lat, lon, cityName = 'Madrid';
    
    if (state.settings.city) {
      cityName = state.settings.city;
      // Geocoding city name via Open-Meteo
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=${state.lang}`);
      const geoData = await geoRes.json();
      if (geoData.results && geoData.results.length > 0) {
        lat = geoData.results[0].latitude;
        lon = geoData.results[0].longitude;
        cityName = geoData.results[0].name;
      } else {
        throw new Error("City not found");
      }
    } else {
      const err = new Error("Unconfigured");
      err.isUnconfigured = true;
      throw err;
    }

    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code&hourly=precipitation_probability,weathercode`);
    const weatherData = await weatherRes.json();
    
    if (weatherData.current) {
      weatherWidget.classList.remove('unconfigured');
      const temp = Math.round(weatherData.current.temperature_2m);
      const apparentTemp = Math.round(weatherData.current.apparent_temperature);
      const code = weatherData.current.weather_code;
      const desc = getWeatherDesc(code);
      
      weatherWidget.querySelector('.weather-temp').textContent = `${temp}°C`;
      weatherWidget.querySelector('.weather-feels').textContent = dict['weather-feels-like'].replace('{temp}', apparentTemp);
      weatherWidget.querySelector('.weather-desc').textContent = desc;
      weatherWidget.querySelector('.weather-loc').textContent = cityName;

      // Calculate precipitation in next 24h
      let precipHTML = '';
      if (weatherData.hourly && weatherData.hourly.precipitation_probability && weatherData.hourly.weathercode) {
        const currentHourStr = weatherData.current.time;
        const startIndex = weatherData.hourly.time.indexOf(currentHourStr);
        const start = startIndex !== -1 ? startIndex : 0;
        const next24Probs = weatherData.hourly.precipitation_probability.slice(start, start + 24);
        const next24Codes = weatherData.hourly.weathercode.slice(start, start + 24);
        const maxProb = Math.max(...next24Probs);

        // Only show precipitation expected badge if probability is at least 20%
        if (maxProb >= 20) {
          let hasStorm = false;
          let hasSnow = false;
          for (let i = 0; i < next24Codes.length; i++) {
            if (next24Probs[i] >= 20) {
              const c = next24Codes[i];
              if (c >= 95 && c <= 99) hasStorm = true;
              else if ((c >= 71 && c <= 77) || (c >= 85 && c <= 86)) hasSnow = true;
            }
          }

          let typeKey = 'weather-rain';
          let icon = '☔';
          if (hasStorm) {
            typeKey = 'weather-storm';
            icon = '⛈️';
          } else if (hasSnow) {
            typeKey = 'weather-snow';
            icon = '❄️';
          }

          const label = dict[typeKey].replace('{prob}', maxProb);
          precipHTML = `<span class="weather-precip-badge" title="${label}">${icon} ${label}</span>`;
        } else {
          precipHTML = `<span class="weather-precip-badge none" title="${dict['weather-no-precip']}">☀️ ${dict['weather-no-precip']}</span>`;
        }
      }
      weatherWidget.querySelector('.weather-precip').innerHTML = precipHTML;
      weatherWidget.classList.remove('loading');
    }
  } catch (err) {
    weatherWidget.classList.add('unconfigured');
    weatherWidget.querySelector('.weather-unconfigured-text').textContent = err.isUnconfigured
      ? dict['weather-unconfigured']
      : dict['weather-error'];
    weatherWidget.classList.remove('loading');
  }
}

// Map WMO codes to human readable weather
function getWeatherDesc(code) {
  const codes = {
    0: { en: "Clear sky", es: "Cielo despejado" },
    1: { en: "Mainly clear", es: "Mayormente despejado" },
    2: { en: "Partly cloudy", es: "Parcialmente nublado" },
    3: { en: "Overcast", es: "Cubierto" },
    45: { en: "Fog", es: "Niebla" },
    48: { en: "Fog", es: "Niebla" },
    51: { en: "Light drizzle", es: "Llovizna ligera" },
    53: { en: "Moderate drizzle", es: "Llovizna moderada" },
    55: { en: "Dense drizzle", es: "Llovizna densa" },
    61: { en: "Slight rain", es: "Lluvia ligera" },
    63: { en: "Moderate rain", es: "Lluvia moderada" },
    65: { en: "Heavy rain", es: "Lluvia fuerte" },
    71: { en: "Slight snow", es: "Nieve ligera" },
    73: { en: "Moderate snow", es: "Nieve moderada" },
    75: { en: "Heavy snow", es: "Nieve fuerte" },
    77: { en: "Snow grains", es: "Granizo suave" },
    80: { en: "Slight rain showers", es: "Chubascos de lluvia leves" },
    81: { en: "Moderate rain showers", es: "Chubascos de lluvia moderados" },
    82: { en: "Violent rain showers", es: "Chubascos de lluvia violentos" },
    95: { en: "Thunderstorm", es: "Tormenta" },
    96: { en: "Thunderstorm with hail", es: "Tormenta con granizo" },
    99: { en: "Thunderstorm with heavy hail", es: "Tormenta con granizo fuerte" }
  };
  return (codes[code] ? codes[code][state.lang] : codes[0][state.lang]);
}

// -------------------------------------------------------------
// TODO LIST SYSTEM (CRUD)
// -------------------------------------------------------------
let activeFilter = 'pending';

function renderTodos() {
  const todoList = document.getElementById('todo-list');
  todoList.innerHTML = '';

  const pendingCount = state.todos.filter(todo => !todo.completed).length;
  const pendingBtn = document.querySelector('.filter-btn[data-filter="pending"]');
  if (pendingBtn) {
    const baseText = translations[state.lang]['filter-pending'] || 'Pending';
    if (pendingCount > 0) {
      pendingBtn.innerHTML = `${baseText} <span class="filter-badge">${pendingCount}</span>`;
    } else {
      pendingBtn.textContent = baseText;
    }
  }
  
  const filteredTodos = state.todos.filter(todo => {
    if (activeFilter === 'pending') return !todo.completed;
    if (activeFilter === 'completed') {
      if (!todo.completed) return false;
      if (!todo.completedAt) return true;
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      return new Date(todo.completedAt).getTime() >= sevenDaysAgo;
    }
    return true;
  });

  // Sort: Incomplete first, then by due date (descending), then by priority (high -> medium -> low), then by creation date (ascending)
  filteredTodos.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    
    // 1. Due date descending (no due date goes to the bottom of the dates)
    const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
    const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
    if (dateA !== dateB) {
      return dateB - dateA;
    }
    
    // 2. Priority descending
    const priorityWeights = { high: 3, medium: 2, low: 1 };
    if (priorityWeights[b.priority] !== priorityWeights[a.priority]) {
      return priorityWeights[b.priority] - priorityWeights[a.priority];
    }
    
    // 3. Creation date ascending (older/earlier timestamp first)
    return Number(a.id) - Number(b.id);
  });

  if (filteredTodos.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.className = 'empty-msg';
    emptyMsg.textContent = state.lang === 'es' ? 'No hay tareas.' : 'No tasks.';
    todoList.appendChild(emptyMsg);
    return;
  }

  filteredTodos.forEach(todo => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''} ${todo.isFocused ? 'focused' : ''}`;
    
    // Check if task is overdue
    let dateBadgeHTML = '';
    if (todo.dueDate) {
      const todayStr = getLocalDateString(new Date());
      const due = new Date(todo.dueDate + 'T00:00:00');
      const today = new Date(todayStr + 'T00:00:00');
      const timeDiff = due.getTime() - today.getTime();
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      let badgeClass = '';
      let badgeText = '';

      const dict = translations[state.lang];

      if (todo.completed) {
        // Just format normally
        badgeText = formatDateShort(todo.dueDate);
      } else if (diffDays < 0) {
        badgeClass = 'overdue';
        badgeText = `${dict['task-overdue']} (${formatDateShort(todo.dueDate)})`;
      } else if (diffDays === 0) {
        badgeText = dict['task-today'];
      } else if (diffDays === 1) {
        badgeText = dict['task-tomorrow'];
      } else {
        badgeText = formatDateShort(todo.dueDate);
      }

      dateBadgeHTML = `
        <span class="todo-date-badge ${badgeClass}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          ${badgeText}
        </span>`;
    }

    let completedBadgeHTML = '';
    if (todo.completed && todo.completedAt) {
      const compDate = new Date(todo.completedAt);
      const formattedCompDate = formatDateShort(getLocalDateString(compDate));
      completedBadgeHTML = `
        <span class="todo-completed-badge" title="${compDate.toLocaleString()}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          ${state.lang === 'es' ? 'Completada el' : 'Completed on'} ${formattedCompDate}
        </span>`;
    }

    const escapedText = escapeHtml(todo.text);
    const checkLabel = (state.lang === 'es' ? 'Marcar tarea como completada: ' : 'Mark task as complete: ') + todo.text;
    const focusLabel = (state.lang === 'es' ? 'Trabajar en esta tarea: ' : 'Focus on this task: ') + todo.text;
    const editLabel = (state.lang === 'es' ? 'Editar tarea: ' : 'Edit task: ') + todo.text;
    const deleteLabel = (state.lang === 'es' ? 'Eliminar tarea: ' : 'Delete task: ') + todo.text;

    li.innerHTML = `
      <div class="todo-item-left">
        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} data-id="${todo.id}" aria-label="${escapeHtml(checkLabel)}">
        <div class="todo-item-details">
          <span class="todo-text">${escapedText}</span>
          <div class="todo-meta">
            <span class="todo-priority-badge priority-${todo.priority}">${translations[state.lang]['priority-' + todo.priority]}</span>
            ${dateBadgeHTML}
          </div>
          ${completedBadgeHTML}
        </div>
      </div>
      <div class="todo-actions">
        ${!todo.completed ? `
        <button class="btn-item-action focus-btn ${todo.isFocused ? 'active' : ''}" data-id="${todo.id}" title="${state.lang === 'es' ? 'Trabajando en esta tarea' : 'Focus on this task'}" aria-label="${escapeHtml(focusLabel)}">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
        ` : ''}
        <button class="btn-item-action edit-btn" data-id="${todo.id}" title="${state.lang === 'es' ? 'Editar' : 'Edit'}" aria-label="${escapeHtml(editLabel)}">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
        </button>
        <button class="btn-item-action delete-btn" data-id="${todo.id}" title="${state.lang === 'es' ? 'Eliminar' : 'Delete'}" aria-label="${escapeHtml(deleteLabel)}">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      </div>
    `;

    // Listeners for checkbox and buttons
    li.querySelector('.todo-checkbox').addEventListener('change', (e) => {
      toggleTodo(todo.id);
    });

    if (!todo.completed) {
      li.querySelector('.focus-btn').addEventListener('click', () => {
        toggleFocusTodo(todo.id);
      });
    }

    li.querySelector('.edit-btn').addEventListener('click', () => {
      openEditModal(todo);
    });

    li.querySelector('.delete-btn').addEventListener('click', () => {
      deleteTodo(todo.id);
    });

    todoList.appendChild(li);
  });

  // Update todo focus card
  const focusedTodo = state.todos.find(todo => todo.isFocused && !todo.completed);
  const focusCard = document.getElementById('todo-focus-card');
  const focusContainer = document.getElementById('focus-card-item-container');
  if (focusCard && focusContainer) {
    if (focusedTodo) {
      focusContainer.innerHTML = '';
      
      let dateBadgeHTML = '';
      if (focusedTodo.dueDate) {
        const todayStr = getLocalDateString(new Date());
        const due = new Date(focusedTodo.dueDate + 'T00:00:00');
        const today = new Date(todayStr + 'T00:00:00');
        const timeDiff = due.getTime() - today.getTime();
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        let badgeClass = '';
        let badgeText = '';
        const dict = translations[state.lang];

        if (diffDays < 0) {
          badgeClass = 'overdue';
          badgeText = `${dict['task-overdue']} (${formatDateShort(focusedTodo.dueDate)})`;
        } else if (diffDays === 0) {
          badgeText = dict['task-today'];
        } else if (diffDays === 1) {
          badgeText = dict['task-tomorrow'];
        } else {
          badgeText = formatDateShort(focusedTodo.dueDate);
        }

        dateBadgeHTML = `
          <span class="todo-date-badge ${badgeClass}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            ${badgeText}
          </span>`;
      }

      const focusCheckLabel = (state.lang === 'es' ? 'Marcar tarea como completada: ' : 'Mark task as complete: ') + focusedTodo.text;
      const focusClearLabel = (state.lang === 'es' ? 'Quitar del enfoque: ' : 'Clear focus: ') + focusedTodo.text;
      const focusEditLabel = (state.lang === 'es' ? 'Editar tarea enfocada: ' : 'Edit focused task: ') + focusedTodo.text;
      const focusDeleteLabel = (state.lang === 'es' ? 'Eliminar tarea enfocada: ' : 'Delete focused task: ') + focusedTodo.text;

      const focusItemDiv = document.createElement('div');
      focusItemDiv.className = 'todo-item borderless-todo-item';
      focusItemDiv.innerHTML = `
        <div class="todo-item-left">
          <input type="checkbox" class="todo-checkbox" data-id="${focusedTodo.id}" aria-label="${escapeHtml(focusCheckLabel)}">
          <div class="todo-item-details">
            <span class="todo-text">${escapeHtml(focusedTodo.text)}</span>
            <div class="todo-meta">
              <span class="todo-priority-badge priority-${focusedTodo.priority}">${translations[state.lang]['priority-' + focusedTodo.priority]}</span>
              ${dateBadgeHTML}
            </div>
          </div>
        </div>
        <div class="todo-actions">
          <button class="btn-item-action focus-btn active" data-id="${focusedTodo.id}" title="${state.lang === 'es' ? 'Quitar del enfoque' : 'Clear focus'}" aria-label="${escapeHtml(focusClearLabel)}">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
          <button class="btn-item-action edit-btn" data-id="${focusedTodo.id}" title="${state.lang === 'es' ? 'Editar' : 'Edit'}" aria-label="${escapeHtml(focusEditLabel)}">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          </button>
          <button class="btn-item-action delete-btn" data-id="${focusedTodo.id}" title="${state.lang === 'es' ? 'Eliminar' : 'Delete'}" aria-label="${escapeHtml(focusDeleteLabel)}">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      `;

      focusItemDiv.querySelector('.todo-checkbox').addEventListener('change', () => {
        toggleTodo(focusedTodo.id);
      });
      focusItemDiv.querySelector('.focus-btn').addEventListener('click', () => {
        toggleFocusTodo(focusedTodo.id);
      });
      focusItemDiv.querySelector('.edit-btn').addEventListener('click', () => {
        openEditModal(focusedTodo);
      });
      focusItemDiv.querySelector('.delete-btn').addEventListener('click', () => {
        deleteTodo(focusedTodo.id);
      });

      focusContainer.appendChild(focusItemDiv);
      focusCard.classList.remove('hidden');
    } else {
      focusCard.classList.add('hidden');
      focusContainer.innerHTML = '';
    }
  }

  // Update Clear Completed button
  const clearBtn = document.getElementById('btn-clear-completed');
  if (clearBtn) {
    const hasCompleted = state.todos.some(todo => todo.completed);
    if (activeFilter === 'completed' && hasCompleted) {
      clearBtn.textContent = translations[state.lang]['clear-completed-btn'];
      clearBtn.classList.remove('hidden');
    } else {
      clearBtn.classList.add('hidden');
    }
  }

  // Update Completed Tasks Note
  const completedNote = document.getElementById('completed-tasks-note');
  if (completedNote) {
    if (activeFilter === 'completed') {
      completedNote.textContent = translations[state.lang]['completed-tasks-note'];
      completedNote.classList.remove('hidden');
    } else {
      completedNote.classList.add('hidden');
    }
  }

  // Re-sync dashboard columns so they reflect task items
  syncDashboardColumns();
}

async function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(state.todos));
  if (state.settings.storageMode === 'file') {
    await writeDataToFile();
  }
}

function updateOrganizerVisibility() {
  const showCountdowns = state.settings.showCountdowns !== false;
  const showTasks = state.settings.showTasks !== false;
  
  let showJira = state.settings.showJira !== false;
  if (state.settings.oooActive && state.settings.hideJiraOoo) {
    showJira = false;
  }

  let showGit = state.settings.showGit !== false;

  const showWork = showGit || showJira;

  const prsCard = document.getElementById('prs-card');
  const jiraCard = document.getElementById('jira-card');
  const workTitle = document.getElementById('work-section-title');
  const workContent = document.getElementById('work-section-content');

  if (prsCard) prsCard.classList.toggle('hidden', !showGit);
  if (jiraCard) jiraCard.classList.toggle('hidden', !showJira);
  if (workTitle) workTitle.classList.toggle('hidden', !showWork);
  if (workContent) workContent.classList.toggle('hidden', !showWork);

  const countdownHeader = document.getElementById('countdown-section-header');
  const countdownCard = document.querySelector('.countdown-wrapper');
  if (countdownHeader) countdownHeader.classList.toggle('hidden', !showCountdowns);
  if (countdownCard) countdownCard.classList.toggle('hidden', !showCountdowns);

  const tasksHeader = document.getElementById('tasks-section-header');
  const mainTasksCard = document.getElementById('main-tasks-card');
  const focusCard = document.getElementById('todo-focus-card');
  
  if (tasksHeader) tasksHeader.classList.toggle('hidden', !showTasks);
  if (mainTasksCard) mainTasksCard.classList.toggle('hidden', !showTasks);
  if (focusCard) {
    if (!showTasks) {
      focusCard.classList.add('hidden');
    } else {
      const focusedTodo = state.todos.find(todo => todo.isFocused && !todo.completed);
      focusCard.classList.toggle('hidden', !focusedTodo);
    }
  }

  const colTasks = document.getElementById('col-tasks');
  const dashboardGrid = document.querySelector('.dashboard-grid');
  const colTasksHidden = !showCountdowns && !showTasks && !showWork;
  if (colTasks) {
    colTasks.classList.toggle('hidden', colTasksHidden);

    // If section-header is the first visible header in col-tasks, remove top margin so it aligns cleanly with other column titles
    const allSectionHeaders = colTasks.querySelectorAll('.section-header');
    allSectionHeaders.forEach(sh => sh.style.marginTop = '');

    const firstVisibleHeader = colTasks.querySelector('.col-title:not(.hidden), .section-header:not(.hidden)');
    if (firstVisibleHeader && firstVisibleHeader.classList.contains('section-header')) {
      firstVisibleHeader.style.marginTop = '0';
    }
  }
  if (dashboardGrid) {
    dashboardGrid.classList.toggle('two-cols', colTasksHidden);
  }

  // Update World Clock and Weather widgets visibility
  updateWorldClock();
  const weatherWidget = document.getElementById('weather-widget');
  if (weatherWidget) {
    weatherWidget.classList.toggle('hidden', state.settings.showWeather === false);
  }
}

// ------------------------------------------------------------
// COUNTDOWNS
// ------------------------------------------------------------

function renderCountdowns() {
  const list = document.getElementById('countdown-list');
  const emptyEl = document.getElementById('countdown-empty');
  if (!list) return;

  list.innerHTML = '';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMs = today.getTime();
  const currentYear = today.getFullYear();

  const events = state.settings.customEvents || [];
  if (events.length === 0) {
    if (emptyEl) emptyEl.classList.remove('hidden');
    return;
  }
  if (emptyEl) emptyEl.classList.add('hidden');

  // Sort events chronologically (January -> December)
  const sorted = [...events].sort((a, b) => {
    const [, mA, dA] = a.date.split('-').map(Number);
    const [, mB, dB] = b.date.split('-').map(Number);
    if (mA !== mB) return mA - mB;
    return dA - dB;
  });

  sorted.forEach(evt => {
    const [, m, d] = evt.date.split('-');
    const eventDateThisYear = new Date(currentYear, parseInt(m, 10) - 1, parseInt(d, 10));
    
    // Check if the event is overdue (passed this year already)
    const isOverdue = eventDateThisYear < today && !(today.getMonth() === parseInt(m, 10) - 1 && today.getDate() === parseInt(d, 10));
    
    let daysLabel = '';
    let badgeHTML = '';
    let relativeText = '';
    let isFarFuture = false;

    if (isOverdue) {
      daysLabel = state.lang === 'es' ? 'Vencido' : 'Overdue';
      badgeHTML = `<span class="event-overdue-badge" style="margin-left: 0;">${daysLabel}</span>`;
      
      const timeDiff = todayMs - eventDateThisYear.getTime();
      const daysAgo = Math.floor(timeDiff / (1000 * 3600 * 24));
      relativeText = daysAgo === 1
        ? (state.lang === 'es' ? 'ayer' : 'yesterday')
        : (state.lang === 'es' ? `hace ${daysAgo} días` : `${daysAgo} days ago`);
    } else {
      const diffTime = eventDateThisYear.getTime() - todayMs;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let badgeClass = '';
      if (diffDays === 0) {
        daysLabel = state.lang === 'es' ? 'Hoy' : 'Today';
        badgeClass = 'countdown-badge-amber'; // Header banner today colors (orange/yellow)
        relativeText = state.lang === 'es' ? 'hoy' : 'today';
      } else if (diffDays === 1) {
        daysLabel = state.lang === 'es' ? 'Mañana' : 'Tomorrow';
        badgeClass = 'countdown-badge-red';
        relativeText = state.lang === 'es' ? 'mañana' : 'tomorrow';
      } else if (diffDays < 7) {
        daysLabel = state.lang === 'es' ? `En ${diffDays} d` : `In ${diffDays} d`;
        badgeClass = 'countdown-badge-red'; // Header banner soon colors (<7 days: red)
        relativeText = state.lang === 'es' ? `en ${diffDays} días` : `in ${diffDays} days`;
      } else if (diffDays < 31) {
        daysLabel = state.lang === 'es' ? `En ${diffDays} d` : `In ${diffDays} d`;
        badgeClass = 'countdown-badge-amber'; // Header banner today colors (7 to 30 days: orange/yellow)
        relativeText = state.lang === 'es' ? `en ${diffDays} días` : `in ${diffDays} days`;
      } else {
        daysLabel = state.lang === 'es' ? `En ${diffDays} d` : `In ${diffDays} d`;
        badgeClass = 'countdown-badge-neutral'; // Header banner upcoming colors (31+ days: neutral)
        relativeText = state.lang === 'es' ? `en ${diffDays} días` : `in ${diffDays} days`;
        isFarFuture = true;
      }
      badgeHTML = `<span class="countdown-badge ${badgeClass}">${daysLabel}</span>`;
    }

    const titleClass = 'countdown-title'; // Overdue events do not get line-through strikethrough
    const formattedDate = formatDateShort(getLocalDateString(eventDateThisYear));
    const fullMonthDate = eventDateThisYear.toLocaleDateString(getLocale(state.lang), { day: 'numeric', month: 'long' });
    const tooltipText = evt.name + `\n${fullMonthDate} (${relativeText})`;

    const editCountdownLabel = (state.lang === 'es' ? 'Editar evento: ' : 'Edit event: ') + evt.name;
    const deleteCountdownLabel = (state.lang === 'es' ? 'Eliminar evento: ' : 'Delete event: ') + evt.name;

    const li = document.createElement('li');
    li.className = 'countdown-item';
    if (isFarFuture) {
      li.classList.add('far-future');
    }
    li.setAttribute('data-tooltip', tooltipText);
    li.innerHTML = `
      <div class="todo-item-left">
        <div class="todo-item-details">
          <span class="${titleClass}">${escapeHtml(evt.name)}</span>
          <span class="countdown-date" style="margin-top: 0.15rem; display: block;">${formattedDate}</span>
        </div>
      </div>
      <div class="todo-actions countdown-actions">
        ${badgeHTML}
        <button class="btn-item-action edit-countdown-btn" data-id="${evt.id}" title="${state.lang === 'es' ? 'Editar' : 'Edit'}" aria-label="${escapeHtml(editCountdownLabel)}">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
        </button>
        <button class="btn-item-action delete-countdown-btn" data-id="${evt.id}" title="${state.lang === 'es' ? 'Eliminar' : 'Delete'}" aria-label="${escapeHtml(deleteCountdownLabel)}">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    `;

    li.querySelector('.edit-countdown-btn').addEventListener('click', () => {
      openEditEventModal(evt);
    });

    li.querySelector('.delete-countdown-btn').addEventListener('click', () => {
      deleteCountdown(evt.id);
    });

    list.appendChild(li);
  });
}

// -------------------------------------------------------------
// ACCESSIBLE FOCUS & MODAL DIALOG MANAGEMENT
// -------------------------------------------------------------
let lastActiveElementBeforeModal = null;

function getFocusableElements(container) {
  if (!container) return [];
  return Array.from(container.querySelectorAll(
    'button:not([disabled]):not([tabindex="-1"]), [href]:not([tabindex="-1"]), input:not([disabled]):not([type="hidden"]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"]):not([disabled])'
  )).filter(el => {
    return el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0;
  });
}

function openModalAccessible(dialog, initialFocusTarget = null) {
  if (!dialog) return;
  lastActiveElementBeforeModal = document.activeElement;
  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
  }
  setTimeout(() => {
    if (initialFocusTarget && typeof initialFocusTarget.focus === 'function') {
      initialFocusTarget.focus();
    } else {
      const focusables = getFocusableElements(dialog);
      if (focusables.length > 0) {
        focusables[0].focus();
      }
    }
  }, 40);
}

function trapFocusInDialog(e, dialog) {
  if (e.key !== 'Tab' || !dialog || !dialog.open) return;
  const focusables = getFocusableElements(dialog);
  if (focusables.length === 0) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === first || !dialog.contains(document.activeElement)) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last || !dialog.contains(document.activeElement)) {
      e.preventDefault();
      first.focus();
    }
  }
}

async function addCountdown(name, date) {
  state.settings.customEvents = state.settings.customEvents || [];
  state.settings.customEvents.push({ id: Date.now().toString(), name, date });
  await saveSettings();
  renderCountdowns();
  renderSettingsEventsList();
  updateUpcomingEventBanner();
}

let countdownIdToDelete = null;

function deleteCountdown(id) {
  countdownIdToDelete = id;
  const events = state.settings.customEvents || [];
  const countdown = events.find(c => c.id === id);
  if (!countdown) return;

  const modal = document.getElementById('confirm-delete-modal');
  if (modal) {
    const dict = translations[state.lang];
    confirmActionType = 'delete-countdown';
    modal.querySelector('[data-i18n="confirm-delete-title"]').textContent = state.lang === 'es' ? 'Eliminar Evento' : 'Delete Event';
    const descEl = modal.querySelector('[data-i18n="confirm-delete-desc"]');
    if (descEl) {
      descEl.innerHTML = state.lang === 'es'
        ? `¿Estás seguro de que quieres eliminar el evento: <strong>"${escapeHtml(countdown.name)}"</strong>?`
        : `Are you sure you want to delete the event: <strong>"${escapeHtml(countdown.name)}"</strong>?`;
    }
    modal.querySelector('[data-i18n="cancel-btn"]').textContent = dict['cancel-btn'];
    modal.querySelector('[data-i18n="delete-btn"]').textContent = dict['delete-btn'];
    openModalAccessible(modal, document.getElementById('btn-cancel-delete'));
  }
}

function openEditEventModal(evt) {
  const modal = document.getElementById('edit-event-modal');
  if (!modal) return;
  document.getElementById('edit-event-id').value = evt.id;
  document.getElementById('edit-event-name-input').value = evt.name;
  document.getElementById('edit-event-date-input').value = evt.date;
  openModalAccessible(modal, document.getElementById('edit-event-name-input'));
}

async function addTodo(text, dueDate, priority) {
  const newTodo = {
    id: Date.now().toString(),
    text,
    completed: false,
    dueDate: dueDate || null,
    priority: priority || 'medium'
  };
  state.todos.push(newTodo);
  await saveTodos();
  renderTodos();
  renderFocusCard();
  updateTodoCountBadges();
}

async function toggleTodo(id) {
  state.todos = state.todos.map(todo => {
    if (todo.id === id) {
      const isNowCompleted = !todo.completed;
      return { 
        ...todo, 
        completed: isNowCompleted,
        completedAt: isNowCompleted ? new Date().toISOString() : null,
        isFocused: isNowCompleted ? false : todo.isFocused // Clear focus if completed
      };
    }
    return todo;
  });
  await saveTodos();
  renderTodos();
}

async function toggleFocusTodo(id) {
  state.todos = state.todos.map(todo => {
    if (todo.id === id) {
      return { ...todo, isFocused: !todo.isFocused };
    }
    return { ...todo, isFocused: false };
  });
  await saveTodos();
  renderTodos();
}

let confirmActionType = null;
let todoIdToDelete = null;

function showClearCompletedConfirmation() {
  confirmActionType = 'clear-completed';
  const modal = document.getElementById('confirm-delete-modal');
  if (modal) {
    const dict = translations[state.lang];
    modal.querySelector('[data-i18n="confirm-delete-title"]').textContent = state.lang === 'es' ? 'Limpiar Tareas' : 'Clear Tasks';
    
    const descEl = modal.querySelector('[data-i18n="confirm-delete-desc"]');
    if (descEl) {
      descEl.innerHTML = state.lang === 'es' 
        ? '¿Estás seguro de que quieres eliminar todas las tareas completadas?' 
        : 'Are you sure you want to delete all completed tasks?';
    }
    
    modal.querySelector('[data-i18n="cancel-btn"]').textContent = dict['cancel-btn'];
    modal.querySelector('[data-i18n="delete-btn"]').textContent = state.lang === 'es' ? 'Eliminar todas' : 'Delete all';
    modal.showModal();
  }
}

function deleteTodo(id) {
  confirmActionType = 'delete-single';
  todoIdToDelete = id;
  const todo = state.todos.find(t => t.id === id);
  if (!todo) return;

  const modal = document.getElementById('confirm-delete-modal');
  if (modal) {
    const dict = translations[state.lang];
    modal.querySelector('[data-i18n="confirm-delete-title"]').textContent = dict['confirm-delete-title'];
    
    const descEl = modal.querySelector('[data-i18n="confirm-delete-desc"]');
    if (descEl) {
      if (state.lang === 'es') {
        descEl.innerHTML = `¿Estás seguro de que quieres eliminar la tarea: <strong>"${escapeHtml(todo.text)}"</strong>?`;
      } else {
        descEl.innerHTML = `Are you sure you want to delete the task: <strong>"${escapeHtml(todo.text)}"</strong>?`;
      }
    }

    modal.querySelector('[data-i18n="cancel-btn"]').textContent = dict['cancel-btn'];
    modal.querySelector('[data-i18n="delete-btn"]').textContent = dict['delete-btn'];
    modal.showModal();
  }
}

async function updateTodo(id, newText, newDueDate, newPriority) {
  state.todos = state.todos.map(todo => {
    if (todo.id === id) {
      return { ...todo, text: newText, dueDate: newDueDate || null, priority: newPriority };
    }
    return todo;
  });
  await saveTodos();
  renderTodos();
}

// -------------------------------------------------------------
// DASHBOARD SYNC & INTEGRATIONS
// -------------------------------------------------------------
function syncDashboardColumns() {
  // Clear any existing local task rows from Hoy/Esta Semana columns
  const localTodaySection = document.getElementById('local-today-events');
  if (localTodaySection) localTodaySection.remove();
  
  const localWeekSection = document.getElementById('local-week-events');
  if (localWeekSection) localWeekSection.remove();

  const todayStr = getLocalDateString(new Date());
  
  // Tasks for Today
  const todayTasks = state.todos.filter(todo => !todo.completed && todo.dueDate === todayStr);
  
  // Tasks for This Week (Next 7 days, excluding today)
  const next7Days = [];
  for (let i = 1; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    next7Days.push(getLocalDateString(d));
  }
  const weekTasks = state.todos.filter(todo => !todo.completed && next7Days.includes(todo.dueDate));

  // Insert Local Tasks into Today column content
  if (todayTasks.length > 0) {
    const container = document.querySelector('#col-today .col-content');
    const card = document.createElement('div');
    card.id = 'local-today-events';
    card.className = 'section-card';
    card.innerHTML = `
      <h3 class="card-subtitle">${state.lang === 'es' ? 'Tareas de Hoy' : 'Today\'s Tasks'}</h3>
      <div class="integration-list">
        ${todayTasks.map(t => `
          <div class="integration-item urgent">
            <span class="item-title">${escapeHtml(t.text)}</span>
            <div class="item-meta">
              <span class="item-badge priority-${t.priority}">${translations[state.lang]['priority-' + t.priority]}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    container.insertBefore(card, container.firstChild);
  }

  // Insert Local Tasks into This Week column content
  if (weekTasks.length > 0) {
    const container = document.querySelector('#col-week .col-content');
    const card = document.createElement('div');
    card.id = 'local-week-events';
    card.className = 'section-card';
    card.innerHTML = `
      <h3 class="card-subtitle">${state.lang === 'es' ? 'Tareas de esta Semana' : 'This Week\'s Tasks'}</h3>
      <div class="integration-list">
        ${weekTasks.map(t => `
          <div class="integration-item">
            <span class="item-title">${escapeHtml(t.text)}</span>
            <div class="item-meta">
              <span>${formatDateShort(t.dueDate)}</span>
              <span class="item-badge priority-${t.priority}">${translations[state.lang]['priority-' + t.priority]}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    container.insertBefore(card, container.firstChild);
  }
}

// -------------------------------------------------------------
// EXTERNAL SERVICES INTEGRATIONS
// Universal Fetch Helper (with transparent CORS proxy for Jira & Gmail)
async function safeFetch(url, options = {}) {
  const isJira = url.includes('/rest/api/3/') || url.includes('/rest/api/2/');
  const isGmail = url.includes('gmail.googleapis.com');
  
  if (isJira || isGmail) {
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
    try {
      const res = await fetch(proxyUrl, options);
      // If the proxy is active and returns a response, or if it gave a valid JSON error from target API
      const contentType = res.headers.get('content-type') || '';
      if (res.status !== 404 || contentType.includes('application/json')) {
        return res;
      }
      // If the proxy route itself returned 404 (e.g. static hosting without /api/proxy function), fallback to direct fetch
      return await fetch(url, options);
    } catch (e) {
      return fetch(url, options);
    }
  }

  try {
    const res = await fetch(url, options);
    return res;
  } catch (err) {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      try {
        const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
        return await fetch(proxyUrl, options);
      } catch (proxyErr) {
        throw err;
      }
    }
    throw err;
  }
}

// Fetch Jira Tasks (delegated to services/jira.js)
async function fetchJira() {
  return fetchJiraService(state, safeFetch, escapeHtml);
}

// Git Status and PR aggregation (delegated to services/git.js)
function updateGitStatusIndicators() {
  return gitUpdateIndicators(state, escapeHtml);
}

// Cooldown tracker for successful connection tests (60 seconds)
function startTestCooldown(provider, button) {
  state.lastSuccessGit = state.lastSuccessGit || {};
  state.lastSuccessGit[provider] = Date.now();

  let remaining = 60;
  button.disabled = true;

  const originalText = state.lang === 'es' ? 'Conectar' : 'Connect';
  
  const interval = setInterval(() => {
    remaining--;
    if (remaining <= 0) {
      clearInterval(interval);
      button.disabled = false;
      button.textContent = originalText;
      button.setAttribute('data-i18n', 'connect-btn');
      if (typeof translatePage === 'function') translatePage();
    } else {
      button.textContent = `${originalText} (${remaining}s)`;
    }
  }, 1000);
  
  button.dataset.cooldownInterval = interval;
}

// Test connection endpoint validator using inputs currently in the settings form
async function testGitConnection(provider, button) {
  const originalText = state.lang === 'es' ? 'Conectar' : 'Connect';
  button.textContent = state.lang === 'es' ? 'Conectando...' : 'Connecting...';
  button.disabled = true;

  let success = false;
  let errorMsg = '';

  try {
    if (provider === 'github') {
      const token = document.getElementById('github-token').value.trim();
      if (!token) {
        throw new Error(state.lang === 'es' ? 'Introduce el token' : 'Please enter token');
      }

      const headers = {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      };
      const res = await fetch(`https://api.github.com/user`, { headers });
      if (res.ok) {
        success = true;
      } else {
        throw new Error(`${res.status} ${res.statusText}`);
      }
    } else if (provider === 'bitbucket') {
      const workspace = document.getElementById('bitbucket-workspace').value.trim();
      const email = document.getElementById('bitbucket-username').value.trim();
      const token = document.getElementById('bitbucket-token').value.trim();
      if (!workspace || !email || !token) {
        throw new Error(state.lang === 'es' ? 'Rellena todos los campos' : 'Fill all fields');
      }

      const auth = btoa(`${email}:${token}`);
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.bitbucket.org/2.0/user`, {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Accept': 'application/json'
          }
        }),
        fetch(`https://api.bitbucket.org/2.0/repositories/${workspace}?pagelen=1`, {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Accept': 'application/json'
          }
        })
      ]);
      if (!userRes.ok) {
        if (userRes.status === 403) {
          throw new Error(state.lang === 'es' ? 'El token necesita el permiso Account: Read' : 'Token lacks Account: Read scope');
        }
        throw new Error(`${userRes.status} ${userRes.statusText}`);
      }
      if (!reposRes.ok) {
        throw new Error(`${reposRes.status} ${reposRes.statusText}`);
      }
      success = true;
    } else if (provider === 'gitlab') {
      let host = document.getElementById('gitlab-host').value.trim() || 'https://gitlab.com';
      host = host.replace(/\/$/, "");
      const token = document.getElementById('gitlab-token').value.trim();
      if (!token) {
        throw new Error(state.lang === 'es' ? 'Introduce el token' : 'Please enter token');
      }

      const headers = { 'PRIVATE-TOKEN': token };
      const res = await fetch(`${host}/api/v4/user`, { headers });
      if (res.ok) {
        success = true;
      } else {
        throw new Error(`${res.status} ${res.statusText}`);
      }
    } else if (provider === 'jira') {
      let host = document.getElementById('jira-host').value.trim().replace(/\/$/, "");
      if (host && !host.startsWith('http://') && !host.startsWith('https://')) {
        host = 'https://' + host;
      }
      host = host.replace(/\/jira\/?$/, '').replace(/\/secure.*$/, '');
      const email = document.getElementById('jira-email').value.trim();
      const token = document.getElementById('jira-token').value.trim();
      if (!host || !email || !token) {
        throw new Error(state.lang === 'es' ? 'Rellena todos los campos' : 'Fill all fields');
      }

      const auth = btoa(`${email}:${token}`);
      let res = await safeFetch(`${host}/rest/api/3/myself`, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Accept': 'application/json'
        }
      });
      if (!res.ok) {
        res = await safeFetch(`${host}/rest/api/2/myself`, {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Accept': 'application/json'
          }
        });
      }
      if (res.ok) {
        success = true;
        state.settings.jiraHost = host;
        state.settings.jiraEmail = email;
        state.settings.jiraToken = token;
        await saveSettings();
      } else {
        throw new Error(`${res.status} ${res.statusText}`);
      }
    }
  } catch (e) {
    errorMsg = e.message || String(e);
  }

  // Update State Status and Error Message
  if (success) {
    if (provider === 'github') { state.githubStatus = 'connected'; state.githubError = ''; }
    if (provider === 'bitbucket') { state.bitbucketStatus = 'connected'; state.bitbucketError = ''; }
    if (provider === 'gitlab') { state.gitlabStatus = 'connected'; state.gitlabError = ''; }
    if (provider === 'jira') { state.jiraStatus = 'connected'; state.jiraError = ''; }
  } else {
    if (provider === 'github') { state.githubStatus = 'error'; state.githubError = errorMsg; }
    if (provider === 'bitbucket') { state.bitbucketStatus = 'error'; state.bitbucketError = errorMsg; }
    if (provider === 'gitlab') { state.gitlabStatus = 'error'; state.gitlabError = errorMsg; }
    if (provider === 'jira') { state.jiraStatus = 'error'; state.jiraError = errorMsg; }
  }

  // Update Settings dot status and tooltips reactively
  updateGitStatusIndicators();

  if (success) {
    button.textContent = state.lang === 'es' ? '¡Conectado!' : 'Connected!';
    button.style.backgroundColor = 'rgba(39, 174, 96, 0.1)';
    button.style.color = '#27ae60';
    button.style.borderColor = '#27ae60';
    
    // Start 1 minute cooldown
    startTestCooldown(provider, button);
    
    // Refresh main PRs list
    fetchAllPRs();
  } else {
    button.textContent = state.lang === 'es' ? 'Error' : 'Failed';
    button.style.backgroundColor = 'rgba(235, 87, 87, 0.1)';
    button.style.color = '#eb5757';
    button.style.borderColor = '#eb5757';
    
    const originalTexti18n = button.getAttribute('data-i18n');
    setTimeout(() => {
      button.disabled = false;
      button.textContent = originalText;
      button.style.backgroundColor = '';
      button.style.color = '';
      button.style.borderColor = '';
      if (originalTexti18n) button.setAttribute('data-i18n', originalTexti18n);
    }, 3000);
    
    fetchAllPRs();
  }
}

// Fetch Git PRs (delegated to services/git.js)
async function fetchAllPRs() {
  return gitFetchAllPRs(state, safeFetch, escapeHtml, formatDateShort, getLocale);
}

const fetchGitHub = fetchAllPRs;
const fetchBitbucket = fetchAllPRs;
const fetchGitLab = fetchAllPRs;

function showInputErrorFeedback(inputEl, errorMessage) {
  if (inputEl.classList.contains('invalid-field')) return;
  inputEl.classList.add('invalid-field');
  inputEl.focus();

  let errorEl = inputEl.nextElementSibling;
  if (!errorEl || !errorEl.classList.contains('field-error-msg')) {
    errorEl = document.createElement('span');
    errorEl.className = 'field-error-msg';
    errorEl.style.color = 'var(--danger)';
    errorEl.style.fontSize = '0.75rem';
    errorEl.style.marginTop = '0.25rem';
    errorEl.style.display = 'block';
    inputEl.parentNode.insertBefore(errorEl, inputEl.nextSibling);
  }
  errorEl.textContent = errorMessage;

  setTimeout(() => {
    inputEl.classList.remove('invalid-field');
    errorEl.remove();
  }, 2500);
}

function openSettingsGoogleTab() {
  const toggle = document.getElementById('settings-toggle');
  if (toggle) {
    toggle.click();
    setTimeout(() => {
      const googleBtn = document.querySelector('.tab-btn[data-tab="tab-google"]');
      if (googleBtn) googleBtn.click();
    }, 50);
  }
}
window.openSettingsGoogleTab = openSettingsGoogleTab;

function openSettingsGitTab() {
  const toggle = document.getElementById('settings-toggle');
  if (toggle) {
    toggle.click();
    setTimeout(() => {
      const gitBtn = document.querySelector('.tab-btn[data-tab="tab-git"]');
      if (gitBtn) gitBtn.click();
    }, 50);
  }
}
window.openSettingsGitTab = openSettingsGitTab;

function openSettingsWikipediaTab() {
  const toggle = document.getElementById('settings-toggle');
  if (toggle) {
    toggle.click();
    setTimeout(() => {
      const generalBtn = document.querySelector('.tab-btn[data-tab="tab-general"]');
      if (generalBtn) generalBtn.click();
      setTimeout(() => {
        const wikiGroup = document.getElementById('wikipedia-settings-group') || document.getElementById('settings-show-wikipedia');
        if (wikiGroup) {
          wikiGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const selectEl = document.getElementById('settings-wikipedia-type');
          if (selectEl) {
            selectEl.focus();
            selectEl.style.outline = '2px solid var(--accent)';
            setTimeout(() => { selectEl.style.outline = ''; }, 2000);
          }
        }
      }, 120);
    }, 50);
  }
}
window.openSettingsWikipediaTab = openSettingsWikipediaTab;

// Google APIs Integrations (delegated to services/google.js)
setupGoogleContext({
  state,
  safeFetch,
  escapeHtml,
  formatDateShort,
  formatEventTime,
  getLocalDateString
});

// -------------------------------------------------------------
// EVENT LISTENERS & MODALS SETUP
// -------------------------------------------------------------
function setupEventListeners() {
  // Copy Quote Event Listener
  const copyBtn = document.getElementById('copy-quote-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const quoteText = document.querySelector('#quote-widget .quote-text')?.textContent || '';
      const quoteSep = document.querySelector('#quote-widget .quote-sep')?.textContent || ' – ';
      const quoteAuthor = document.querySelector('#quote-widget .quote-author')?.textContent || '';
      const textToCopy = quoteAuthor ? `${quoteText}${quoteSep}${quoteAuthor}` : quoteText;
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        // Change icon temporarily to indicate success
        const originalSVG = copyBtn.innerHTML;
        copyBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.innerHTML = originalSVG;
          copyBtn.classList.remove('copied');
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy quote: ', err);
      });
    });
  }

  // Quick Action Helpers
  const composeEmail = () => {
    let emailUrl = 'https://mail.google.com/mail/?view=cm&fs=1';
    if (state.googleWorkEmail && state.settings.oooActive !== true) {
      emailUrl = `https://mail.google.com/mail/?authuser=${encodeURIComponent(state.googleWorkEmail)}&view=cm&fs=1`;
    } else if (state.googlePersonalEmail) {
      emailUrl = `https://mail.google.com/mail/?authuser=${encodeURIComponent(state.googlePersonalEmail)}&view=cm&fs=1`;
    }
    window.open(emailUrl, '_blank', 'noopener,noreferrer');
  };

  const createCalendarEvent = () => {
    let calUrl = 'https://calendar.google.com/calendar/r/eventedit';
    if (state.googleWorkEmail && state.settings.oooActive !== true) {
      calUrl = `https://calendar.google.com/calendar/r/eventedit?authuser=${encodeURIComponent(state.googleWorkEmail)}`;
    } else if (state.googlePersonalEmail) {
      calUrl = `https://calendar.google.com/calendar/r/eventedit?authuser=${encodeURIComponent(state.googlePersonalEmail)}`;
    }
    window.open(calUrl, '_blank', 'noopener,noreferrer');
  };

  const openGoogleTasks = () => {
    let tasksUrl = 'https://tasks.google.com/';
    if (state.googleWorkEmail && state.settings.oooActive !== true) {
      tasksUrl = `https://tasks.google.com/?authuser=${encodeURIComponent(state.googleWorkEmail)}`;
    } else if (state.googlePersonalEmail) {
      tasksUrl = `https://tasks.google.com/?authuser=${encodeURIComponent(state.googlePersonalEmail)}`;
    }
    window.open(tasksUrl, '_blank', 'noopener,noreferrer');
  };

  const openAddTaskModal = () => {
    const modal = document.getElementById('add-task-modal');
    openModalAccessible(modal, document.getElementById('todo-input'));
  };

  const openNotesModal = () => {
    const modal = document.getElementById('notes-modal');
    const notesTextarea = document.getElementById('notes-textarea');
    if (notesTextarea) {
      notesTextarea.value = state.settings.notes || '';
    }
    openModalAccessible(modal, notesTextarea);
  };

  // Header quick action button listeners
  const composeBtn = document.getElementById('btn-compose-email');
  if (composeBtn) composeBtn.addEventListener('click', composeEmail);

  const createEventTodayBtn = document.getElementById('btn-create-event-today');
  if (createEventTodayBtn) createEventTodayBtn.addEventListener('click', createCalendarEvent);

  const createEventWeekBtn = document.getElementById('btn-create-event-week');
  if (createEventWeekBtn) createEventWeekBtn.addEventListener('click', createCalendarEvent);

  // Delegation for Google Tasks '+' buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-open-gtasks');
    if (btn) {
      e.preventDefault();
      openGoogleTasks();
    }
  });

  // Global Keyboard Shortcuts (E: Compose Email, C: Create Event, T: Add Task, N: Quick Notes)
  window.addEventListener('keydown', (e) => {
    const target = e.target;
    const tagName = target ? target.tagName : '';
    const isInput = tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT' || (target && target.isContentEditable);
    if (isInput) return;

    if (e.metaKey || e.ctrlKey || e.altKey) return;

    const openModal = document.querySelector('dialog[open]');
    if (openModal) return;

    if (e.key === 'e' || e.key === 'E') {
      e.preventDefault();
      composeEmail();
    } else if (e.key === 'c' || e.key === 'C') {
      e.preventDefault();
      createCalendarEvent();
    } else if (e.key === 't' || e.key === 'T') {
      e.preventDefault();
      openAddTaskModal();
    } else if (e.key === 'n' || e.key === 'N') {
      e.preventDefault();
      openNotesModal();
    }
  });

  // Weather/Clock settings checkboxes visibility toggle
  const toggleWeatherInputs = () => {
    const show = document.getElementById('settings-show-weather').checked;
    document.getElementById('weather-city-group').classList.toggle('collapsed', !show);
  };
  document.getElementById('settings-show-weather').addEventListener('change', toggleWeatherInputs);

  const toggleClockInputs = () => {
    const show = document.getElementById('settings-show-world-clock').checked;
    document.getElementById('world-clock-settings-group').classList.toggle('collapsed', !show);
  };
  document.getElementById('settings-show-world-clock').addEventListener('change', toggleClockInputs);

  const toggleWikipediaInputs = () => {
    const showEl = document.getElementById('settings-show-wikipedia');
    const show = showEl ? showEl.checked : true;
    const group = document.getElementById('wikipedia-settings-group');
    if (group) group.classList.toggle('collapsed', !show);
  };
  const showWikiEl = document.getElementById('settings-show-wikipedia');
  if (showWikiEl) {
    showWikiEl.addEventListener('change', () => {
      toggleWikipediaInputs();
      state.settings.showWikipedia = showWikiEl.checked;
      loadWikipediaContent();
    });
  }

  const wikiTypeSelect = document.getElementById('settings-wikipedia-type');
  if (wikiTypeSelect) {
    wikiTypeSelect.addEventListener('change', () => {
      state.settings.wikipediaType = wikiTypeSelect.value;
      loadWikipediaContent();
    });
  }

  // Color swatches click handlers
  const swatches = document.querySelectorAll('#color-picker-swatches .color-swatch-btn');
  swatches.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedColor = btn.getAttribute('data-color');
      const hiddenInput = document.getElementById('settings-primary-color');
      if (hiddenInput) hiddenInput.value = selectedColor;
      updateSwatchActiveState(selectedColor);
      applyPrimaryColor(selectedColor);
      autoSaveSettingsForm();
    });
  });

  // Google Account color swatches click handlers
  const personalSwatches = document.querySelectorAll('#google-color-personal-swatches .color-swatch-btn');
  personalSwatches.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedColor = btn.getAttribute('data-color');
      const hiddenInput = document.getElementById('google-color-personal');
      if (hiddenInput) hiddenInput.value = selectedColor;
      updateAccountSwatchActiveState('google-color-personal-swatches', selectedColor);
      autoSaveSettingsForm();
    });
  });

  const workSwatches = document.querySelectorAll('#google-color-work-swatches .color-swatch-btn');
  workSwatches.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedColor = btn.getAttribute('data-color');
      const hiddenInput = document.getElementById('google-color-work');
      if (hiddenInput) hiddenInput.value = selectedColor;
      updateAccountSwatchActiveState('google-color-work-swatches', selectedColor);
      autoSaveSettingsForm();
    });
  });

  // Test connection button click handlers
  const testConnButtons = document.querySelectorAll('.test-conn-btn');
  testConnButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const provider = btn.getAttribute('data-provider');
      await testGitConnection(provider, btn);
    });
  });

  // Scroll to Top Listener
  const scrollToTopBtn = document.getElementById('scroll-to-top');
  if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 200) {
        scrollToTopBtn.classList.remove('hidden');
      } else {
        scrollToTopBtn.classList.add('hidden');
      }
    });

    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Dynamic immediate tooltip events
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('[data-tooltip]');
    if (!target) return;
    const text = target.getAttribute('data-tooltip');
    if (!text) return;
    
    const tooltip = document.getElementById('custom-tooltip');
    if (!tooltip) return;
    
    tooltip.textContent = text;
    tooltip.classList.remove('hidden');
    
    const rect = target.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top - 8}px`;
    
    // Force layout reflow
    tooltip.getBoundingClientRect();
    tooltip.classList.add('visible');
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('[data-tooltip]');
    if (!target) return;
    
    const tooltip = document.getElementById('custom-tooltip');
    if (tooltip) {
      tooltip.classList.remove('visible');
      tooltip.classList.add('hidden');
    }
  });

  // Click banner to scroll to My Events and highlight it
  const eventBanner = document.getElementById('events-banner-container');
  if (eventBanner) {
    eventBanner.addEventListener('click', (e) => {
      e.preventDefault();
      const targetHeader = document.getElementById('countdown-section-header');
      if (targetHeader) {
        targetHeader.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        const wrapper = document.querySelector('.countdown-wrapper');
        if (wrapper) {
          if (wrapper.classList.contains('section-flash-highlight')) {
            return;
          }
          wrapper.classList.add('section-flash-highlight');
          wrapper.onanimationend = () => {
            wrapper.classList.remove('section-flash-highlight');
          };
        }
      }
    });
  }

  // Confirm Delete Modal Listeners
  const confirmDeleteModal = document.getElementById('confirm-delete-modal');
  if (confirmDeleteModal) {
    document.getElementById('btn-cancel-delete').addEventListener('click', () => {
      if (confirmActionType === 'hide-events') {
        const cb = document.getElementById('settings-show-countdowns');
        if (cb) cb.checked = true;
        autoSaveSettingsForm();
      }
      confirmDeleteModal.close();
      todoIdToDelete = null;
      confirmActionType = null;
    });
    
    document.getElementById('close-delete-modal').addEventListener('click', () => {
      if (confirmActionType === 'hide-events') {
        const cb = document.getElementById('settings-show-countdowns');
        if (cb) cb.checked = true;
        autoSaveSettingsForm();
      }
      confirmDeleteModal.close();
      todoIdToDelete = null;
      countdownIdToDelete = null;
      confirmActionType = null;
    });

    document.getElementById('btn-confirm-delete').addEventListener('click', async () => {
      if (confirmActionType === 'delete-single' && todoIdToDelete !== null) {
        state.todos = state.todos.filter(todo => todo.id !== todoIdToDelete);
        await saveTodos();
        renderTodos();
        confirmDeleteModal.close();
        todoIdToDelete = null;
        confirmActionType = null;
      } else if (confirmActionType === 'clear-completed') {
        state.todos = state.todos.filter(todo => !todo.completed);
        await saveTodos();
        renderTodos();
        confirmDeleteModal.close();
        confirmActionType = null;
      } else if (confirmActionType === 'delete-countdown' && countdownIdToDelete !== null) {
        state.settings.customEvents = (state.settings.customEvents || []).filter(c => c.id !== countdownIdToDelete);
        await saveSettings();
        renderCountdowns();
        renderSettingsEventsList();
        updateUpcomingEventBanner();
        confirmDeleteModal.close();
        countdownIdToDelete = null;
        confirmActionType = null;
      } else if (confirmActionType === 'hide-events') {
        confirmDeleteModal.close();
        confirmActionType = null;
        autoSaveSettingsForm();
      }
    });
  }

  // Handle immediate change on show-events switch
  const showEventsCheckbox = document.getElementById('settings-show-countdowns');
  if (showEventsCheckbox) {
    showEventsCheckbox.addEventListener('change', () => {
      if (!showEventsCheckbox.checked && (state.settings.customEvents && state.settings.customEvents.length > 0)) {
        confirmActionType = 'hide-events';
        confirmDeleteModal.querySelector('[data-i18n="confirm-delete-title"]').textContent = state.lang === 'es' ? 'Ocultar Eventos' : 'Hide Events';
        const descEl = confirmDeleteModal.querySelector('[data-i18n="confirm-delete-desc"]');
        if (descEl) {
          descEl.innerHTML = state.lang === 'es'
            ? 'Tienes eventos configurados (pendientes o vencidos). ¿Seguro que quieres ocultar la sección de Eventos?'
            : 'You have configured events (pending or overdue). Are you sure you want to hide the Events section?';
        }
        const dict = translations[state.lang];
        confirmDeleteModal.querySelector('[data-i18n="cancel-btn"]').textContent = dict['cancel-btn'];
        confirmDeleteModal.querySelector('[data-i18n="delete-btn"]').textContent = state.lang === 'es' ? 'Confirmar' : 'Confirm';
        confirmDeleteModal.showModal();
      }
    });
  }

  // Clear Completed Tasks Click Listener
  const clearCompletedBtn = document.getElementById('btn-clear-completed');
  if (clearCompletedBtn) {
    clearCompletedBtn.addEventListener('click', () => {
      showClearCompletedConfirmation();
    });
  }

  // Add Countdown Modal Toggle
  const addCountdownModal = document.getElementById('add-countdown-modal');
  const showAddCountdownBtn = document.getElementById('btn-show-add-countdown');
  const closeAddCountdownBtn = document.getElementById('close-add-countdown-modal');
  const cancelAddCountdownBtn = document.getElementById('btn-cancel-add-countdown');

  if (showAddCountdownBtn && addCountdownModal) {
    showAddCountdownBtn.addEventListener('click', () => {
      openModalAccessible(addCountdownModal, document.getElementById('countdown-title-input'));
    });
  }
  if (closeAddCountdownBtn && addCountdownModal) {
    closeAddCountdownBtn.addEventListener('click', () => {
      addCountdownModal.close();
    });
  }
  if (cancelAddCountdownBtn && addCountdownModal) {
    cancelAddCountdownBtn.addEventListener('click', () => {
      addCountdownModal.close();
    });
  }

  // Add Task Modal Toggle
  const addTaskModal = document.getElementById('add-task-modal');
  const showAddTaskBtn = document.getElementById('btn-show-add-task');
  const closeAddTaskBtn = document.getElementById('close-add-task-modal');
  const cancelAddTaskBtn = document.getElementById('btn-cancel-add-task');

  if (showAddTaskBtn && addTaskModal) {
    showAddTaskBtn.addEventListener('click', () => {
      openModalAccessible(addTaskModal, document.getElementById('todo-input'));
    });
  }
  if (closeAddTaskBtn && addTaskModal) {
    closeAddTaskBtn.addEventListener('click', () => {
      addTaskModal.close();
    });
  }
  if (cancelAddTaskBtn && addTaskModal) {
    cancelAddTaskBtn.addEventListener('click', () => {
      addTaskModal.close();
    });
  }

  // Countdown Form
  const countdownForm = document.getElementById('countdown-form');
  if (countdownForm) {
    countdownForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const titleInput = document.getElementById('countdown-title-input');
      const dateInput = document.getElementById('countdown-date-input');
      const title = titleInput.value.trim();
      const date = dateInput.value;
      if (!title || !date) return;
      await addCountdown(title, date);
      titleInput.value = '';
      dateInput.value = '';
      if (addCountdownModal) addCountdownModal.close();
    });
  }

  // Edit Event Modal Close & Cancel & Submit
  const editEventModal = document.getElementById('edit-event-modal');
  const closeEditEventModalBtn = document.getElementById('close-edit-event-modal');
  const cancelEditEventBtn = document.getElementById('btn-cancel-edit-event');
  if (closeEditEventModalBtn && editEventModal) {
    closeEditEventModalBtn.addEventListener('click', () => editEventModal.close());
  }
  if (cancelEditEventBtn && editEventModal) {
    cancelEditEventBtn.addEventListener('click', () => editEventModal.close());
  }

  const editEventForm = document.getElementById('edit-event-form');
  if (editEventForm) {
    editEventForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('edit-event-id').value;
      const name = document.getElementById('edit-event-name-input').value.trim();
      const date = document.getElementById('edit-event-date-input').value;
      if (!name || !date) return;
      
      const events = state.settings.customEvents || [];
      const updated = events.map(c => c.id === id ? { ...c, name, date } : c);
      state.settings.customEvents = updated;
      await saveSettings();
      renderCountdowns();
      renderSettingsEventsList();
      updateUpcomingEventBanner();
      if (editEventModal) editEventModal.close();
    });
  }

  // Helper to ensure proper HTTP/HTTPS URL
  function ensureHttpUrl(url) {
    if (!url) return '';
    let trimmed = url.trim();
    if (!trimmed) return '';
    if (!/^https?:\/\//i.test(trimmed)) {
      trimmed = 'https://' + trimmed;
    }
    return trimmed;
  }

  // Click weather widget to open web page in new tab
  const weatherWidgetEl = document.getElementById('weather-widget');
  if (weatherWidgetEl) {
    weatherWidgetEl.addEventListener('click', (e) => {
      e.stopPropagation();
      let targetUrl = '';
      if (state.settings.weatherUrl && state.settings.weatherUrl.trim()) {
        targetUrl = ensureHttpUrl(state.settings.weatherUrl);
      } else {
        const city = state.settings.city ? state.settings.city.trim() : '';
        const langQuery = state.lang === 'es' ? 'tiempo' : 'weather';
        if (city) {
          targetUrl = `https://www.google.com/search?q=${encodeURIComponent(langQuery + ' ' + city)}`;
        } else {
          targetUrl = `https://www.google.com/search?q=${encodeURIComponent(langQuery)}`;
        }
      }
      if (targetUrl) {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      } else {
        document.getElementById('settings-toggle').click();
      }
    });
  }

  // Click world clock widget to open web page in new tab
  const clockWidgetEl = document.getElementById('world-clock-widget');
  if (clockWidgetEl) {
    clockWidgetEl.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!state.settings.worldClockTz && !state.settings.worldClockUrl) {
        document.getElementById('settings-toggle').click();
        const generalTab = document.querySelector('.tab-btn[data-tab="tab-general"]');
        if (generalTab) generalTab.click();
        const clockSelect = document.getElementById('settings-world-clock-tz');
        if (clockSelect) setTimeout(() => clockSelect.focus(), 150);
        return;
      }

      let targetUrl = '';
      if (state.settings.worldClockUrl && state.settings.worldClockUrl.trim()) {
        targetUrl = ensureHttpUrl(state.settings.worldClockUrl);
      } else {
        const tzCity = state.settings.worldClockTz ? state.settings.worldClockTz.split('/').pop().replace(/_/g, ' ') : '';
        const langQuery = state.lang === 'es' ? 'hora en' : 'time in';
        if (tzCity) {
          targetUrl = `https://www.google.com/search?q=${encodeURIComponent(langQuery + ' ' + tzCity)}`;
        } else {
          targetUrl = `https://www.google.com/search?q=${encodeURIComponent(langQuery)}`;
        }
      }
      if (targetUrl) {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      }
    });
  }

  // Click Notes button (header or floating) & Undo/Redo History
  const notesBtnEl = document.getElementById('notes-btn-header') || document.getElementById('notes-btn-floating');
  const notesModal = document.getElementById('notes-modal');
  const notesTextarea = document.getElementById('notes-textarea');
  const closeNotesModalBtn = document.getElementById('close-notes-modal');
  const closeNotesFooterBtn = document.getElementById('btn-close-notes-footer');
  const clearNotesBtn = document.getElementById('btn-clear-notes');

  let notesHistory = [];
  let notesHistoryIndex = -1;
  let historyDebounceTimeout = null;

  function pushNotesHistory(text) {
    if (notesHistoryIndex >= 0 && notesHistory[notesHistoryIndex] === text) return;
    notesHistory = notesHistory.slice(0, notesHistoryIndex + 1);
    notesHistory.push(text);
    notesHistoryIndex = notesHistory.length - 1;
  }

  if (notesBtnEl && notesModal) {
    notesBtnEl.addEventListener('click', (e) => {
      e.stopPropagation();
      if (notesTextarea) {
        notesTextarea.value = state.settings.notes || '';
        notesHistory = [notesTextarea.value];
        notesHistoryIndex = 0;
      }
      openModalAccessible(notesModal, notesTextarea);
    });
  }

  if (notesTextarea) {
    notesTextarea.addEventListener('input', () => {
      state.settings.notes = notesTextarea.value;
      saveSettings();
      updateNotesBadge();

      clearTimeout(historyDebounceTimeout);
      const val = notesTextarea.value;
      historyDebounceTimeout = setTimeout(() => {
        pushNotesHistory(val);
      }, 300);
    });

    notesTextarea.addEventListener('keydown', (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
      const key = e.key.toLowerCase();

      if (isCmdOrCtrl && key === 'z') {
        if (e.shiftKey) {
          // Redo (Cmd+Shift+Z)
          if (notesHistoryIndex < notesHistory.length - 1) {
            notesHistoryIndex++;
            notesTextarea.value = notesHistory[notesHistoryIndex];
            state.settings.notes = notesTextarea.value;
            saveSettings();
            updateNotesBadge();
          }
          e.preventDefault();
        } else {
          // Undo (Cmd+Z)
          if (notesHistoryIndex > 0) {
            notesHistoryIndex--;
            notesTextarea.value = notesHistory[notesHistoryIndex];
            state.settings.notes = notesTextarea.value;
            saveSettings();
            updateNotesBadge();
          }
          e.preventDefault();
        }
      } else if (isCmdOrCtrl && key === 'y') {
        // Redo (Ctrl+Y)
        if (notesHistoryIndex < notesHistory.length - 1) {
          notesHistoryIndex++;
          notesTextarea.value = notesHistory[notesHistoryIndex];
          state.settings.notes = notesTextarea.value;
          saveSettings();
          updateNotesBadge();
        }
        e.preventDefault();
      }
    });
  }

  if (clearNotesBtn) {
    clearNotesBtn.addEventListener('click', () => {
      if (notesTextarea) {
        notesTextarea.value = '';
        pushNotesHistory('');
      }
      state.settings.notes = '';
      saveSettings();
      updateNotesBadge();
    });
  }

  if (closeNotesModalBtn && notesModal) {
    closeNotesModalBtn.addEventListener('click', () => {
      notesModal.close();
    });
  }

  if (closeNotesFooterBtn && notesModal) {
    closeNotesFooterBtn.addEventListener('click', () => {
      notesModal.close();
    });
  }

  // Click Timer button (header or floating)
  const timerBtnEl = document.getElementById('timer-btn-header') || document.getElementById('timer-btn-floating');
  if (timerBtnEl) {
    timerBtnEl.addEventListener('click', (e) => {
      e.stopPropagation();
      let targetUrl = '';
      if (state.settings.timerUrl && state.settings.timerUrl.trim()) {
        targetUrl = ensureHttpUrl(state.settings.timerUrl);
      } else {
        targetUrl = 'https://www.google.com/search?q=countdown+timer';
      }
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // Click Finance button (header or floating)
  const financeBtnEl = document.getElementById('finance-btn-header') || document.getElementById('finance-btn-floating');
  if (financeBtnEl) {
    financeBtnEl.addEventListener('click', (e) => {
      e.stopPropagation();
      let targetUrl = '';
      if (state.settings.financeUrl && state.settings.financeUrl.trim()) {
        targetUrl = ensureHttpUrl(state.settings.financeUrl);
      } else {
        targetUrl = 'https://www.google.com/finance/beta/quote/.INX:INDEXSP?window=1M';
      }
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // Click Stopwatch button (header or floating)
  const stopwatchBtnEl = document.getElementById('stopwatch-btn-header') || document.getElementById('stopwatch-btn-floating');
  if (stopwatchBtnEl) {
    stopwatchBtnEl.addEventListener('click', (e) => {
      e.stopPropagation();
      let targetUrl = '';
      if (state.settings.stopwatchUrl && state.settings.stopwatchUrl.trim()) {
        targetUrl = ensureHttpUrl(state.settings.stopwatchUrl);
      } else {
        targetUrl = 'https://www.google.com/search?q=stopwatch';
      }
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // Click OOO badge to open settings at Google tab
  const oooBadges = document.querySelectorAll('.ooo-badge');
  oooBadges.forEach(b => {
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      const toggleBtn = document.getElementById('settings-toggle');
      if (toggleBtn) {
        toggleBtn.click();
        const googleTab = document.querySelector('.tab-btn[data-tab="tab-google"]');
        if (googleTab) googleTab.click();
      }
    });
  });

  // Accessible Keyboard Activations (Enter & Space) for widgets and OOO badges
  const accessibleClickables = [
    document.getElementById('events-banner-container'),
    document.getElementById('world-clock-widget'),
    document.getElementById('weather-widget'),
    ...document.querySelectorAll('.ooo-badge')
  ];

  accessibleClickables.forEach(el => {
    if (el) {
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          el.click();
        }
      });
    }
  });

  // OOO switch change handler
  const oooActiveSwitch = document.getElementById('settings-ooo-active');
  const oooDateModal = document.getElementById('ooo-date-modal');
  const oooForm = document.getElementById('ooo-form');
  const oooDateInput = document.getElementById('ooo-date-input');

  if (oooActiveSwitch) {
    oooActiveSwitch.addEventListener('change', () => {
      if (oooActiveSwitch.checked) {
        // Ask for a future date
        const today = new Date();
        today.setDate(today.getDate() + 1); // Minimum date: tomorrow
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        if (oooDateInput) {
          oooDateInput.min = `${yyyy}-${mm}-${dd}`;
          oooDateInput.value = `${yyyy}-${mm}-${dd}`;
        }
        if (oooDateModal) openModalAccessible(oooDateModal, oooDateInput);
      } else {
        const display = document.getElementById('ooo-date-display');
        if (display) display.classList.add('hidden');
      }
    });
  }

  if (oooForm && oooDateModal) {
    oooForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = oooDateInput.value;
      if (!val) return;
      
      if (oooActiveSwitch) {
        oooActiveSwitch.setAttribute('data-until', val);
      }

      const display = document.getElementById('ooo-date-display');
      const text = document.getElementById('ooo-return-date-text');
      if (display) display.classList.remove('hidden');
      if (text) text.textContent = new Date(val + 'T00:00:00').toLocaleDateString(getLocale(state.lang), { day: 'numeric', month: 'long', year: 'numeric' });
      
      oooDateModal.close();
    });
  }

  const cancelOooBtn = document.getElementById('btn-cancel-ooo');
  const closeOooModalBtn = document.getElementById('close-ooo-modal');
  if (cancelOooBtn && oooDateModal) {
    cancelOooBtn.addEventListener('click', () => {
      if (oooActiveSwitch) oooActiveSwitch.checked = false;
      oooDateModal.close();
    });
  }
  if (closeOooModalBtn && oooDateModal) {
    closeOooModalBtn.addEventListener('click', () => {
      if (oooActiveSwitch) oooActiveSwitch.checked = false;
      oooDateModal.close();
    });
  }

  // Settings Modal Open
  const settingsModal = document.getElementById('settings-modal');
  document.getElementById('settings-toggle').addEventListener('click', () => {
    // Fill form fields with current settings
    document.getElementById('settings-lang').value = state.settings.lang;
    document.getElementById('settings-theme').value = state.settings.theme || 'system';
    const currentColor = state.settings.primaryColor || 'blue';
    const colorInput = document.getElementById('settings-primary-color');
    if (colorInput) colorInput.value = currentColor;
    updateSwatchActiveState(currentColor);

    document.getElementById('settings-city').value = state.settings.city;
    const weatherUrlInput = document.getElementById('settings-weather-url');
    if (weatherUrlInput) weatherUrlInput.value = state.settings.weatherUrl !== undefined ? state.settings.weatherUrl : 'https://weather.com';
    document.getElementById('settings-world-clock-tz').value = state.settings.worldClockTz !== undefined ? state.settings.worldClockTz : '';
    document.getElementById('settings-world-clock-label').value = state.settings.worldClockLabel || '';
    const clockUrlInput = document.getElementById('settings-world-clock-url');
    if (clockUrlInput) clockUrlInput.value = state.settings.worldClockUrl !== undefined ? state.settings.worldClockUrl : 'https://time.is';
    
    const financeUrlInput = document.getElementById('settings-finance-url');
    if (financeUrlInput) financeUrlInput.value = state.settings.financeUrl !== undefined ? state.settings.financeUrl : 'https://www.google.com/finance/beta/quote/.INX:INDEXSP?window=1M';
    const timerUrlInput = document.getElementById('settings-timer-url');
    if (timerUrlInput) timerUrlInput.value = state.settings.timerUrl !== undefined ? state.settings.timerUrl : 'https://www.google.com/search?q=countdown+timer';
    const stopwatchUrlInput = document.getElementById('settings-stopwatch-url');
    if (stopwatchUrlInput) stopwatchUrlInput.value = state.settings.stopwatchUrl !== undefined ? state.settings.stopwatchUrl : 'https://www.google.com/search?q=stopwatch';

    document.getElementById('settings-show-weather').checked = state.settings.showWeather !== false;
    document.getElementById('settings-show-world-clock').checked = state.settings.showWorldClock !== false;
    document.getElementById('settings-show-countdowns').checked = state.settings.showCountdowns !== false;
    document.getElementById('settings-show-tasks').checked = state.settings.showTasks !== false;
    document.getElementById('settings-show-google-emails').checked = state.settings.showGoogleEmails !== false;
    const gTasksTodayEl = document.getElementById('settings-show-google-tasks-today');
    if (gTasksTodayEl) gTasksTodayEl.checked = state.settings.showGoogleTasksToday !== false;
    const gTasksWeekEl = document.getElementById('settings-show-google-tasks-week');
    if (gTasksWeekEl) gTasksWeekEl.checked = state.settings.showGoogleTasksWeek !== false;
    const gTasksOverdueEl = document.getElementById('settings-show-google-tasks-overdue');
    if (gTasksOverdueEl) gTasksOverdueEl.checked = state.settings.showGoogleTasksOverdue !== false;
    document.getElementById('settings-show-git').checked = state.settings.showGit !== false;
    document.getElementById('settings-show-jira').checked = state.settings.showJira !== false;
    
    const showWikiModalInput = document.getElementById('settings-show-wikipedia');
    if (showWikiModalInput) showWikiModalInput.checked = state.settings.showWikipedia !== false;
    const wikiTypeModalInput = document.getElementById('settings-wikipedia-type');
    if (wikiTypeModalInput) wikiTypeModalInput.value = state.settings.wikipediaType || 'news';

    toggleWeatherInputs();
    toggleClockInputs();
    toggleWikipediaInputs();
    
    document.getElementById('settings-storage-mode').value = state.settings.storageMode || 'local';
    document.getElementById('google-client-id').value = state.settings.googleClientId;
    
    const personalCol = state.settings.personalColor || 'blue';
    const workCol = state.settings.workColor || 'black';
    document.getElementById('google-color-personal').value = personalCol;
    document.getElementById('google-color-work').value = workCol;
    updateAccountSwatchActiveState('google-color-personal-swatches', personalCol);
    updateAccountSwatchActiveState('google-color-work-swatches', workCol);

    document.getElementById('github-token').value = state.settings.githubToken || '';
    document.getElementById('settings-github-ooo-hide').checked = state.settings.hideGithubOoo === true;

    document.getElementById('bitbucket-workspace').value = state.settings.bitbucketWorkspace || '';
    document.getElementById('bitbucket-username').value = state.settings.bitbucketUsername || '';
    document.getElementById('bitbucket-token').value = state.settings.bitbucketToken || '';
    document.getElementById('settings-bitbucket-ooo-hide').checked = state.settings.hideBitbucketOoo === true;

    document.getElementById('gitlab-host').value = state.settings.gitlabHost || 'https://gitlab.com';
    document.getElementById('gitlab-token').value = state.settings.gitlabToken || '';
    document.getElementById('settings-gitlab-ooo-hide').checked = state.settings.hideGitlabOoo === true;

    document.getElementById('jira-host').value = state.settings.jiraHost || '';
    document.getElementById('jira-email').value = state.settings.jiraEmail || '';
    document.getElementById('jira-token').value = state.settings.jiraToken || '';
    document.getElementById('settings-jira-ooo-hide').checked = state.settings.hideJiraOoo === true;

    const oooActiveInput = document.getElementById('settings-ooo-active');
    if (oooActiveInput) {
      oooActiveInput.checked = state.settings.oooActive === true;
      const display = document.getElementById('ooo-date-display');
      const text = document.getElementById('ooo-return-date-text');
      if (state.settings.oooActive && state.settings.oooUntil) {
        if (display) display.classList.remove('hidden');
        if (text) text.textContent = new Date(state.settings.oooUntil + 'T00:00:00').toLocaleDateString(getLocale(state.lang), { day: 'numeric', month: 'long', year: 'numeric' });
      } else {
        if (display) display.classList.add('hidden');
      }
    }

    // Toggle sync details visibility depending on current storageMode
    if (state.settings.storageMode === 'file') {
      document.getElementById('file-sync-settings').classList.remove('hidden');
      if (fileHandle) {
        document.getElementById('sync-file-name').textContent = fileHandle.name;
      } else {
        document.getElementById('sync-file-name').textContent = translations[state.lang]['no-file-selected'];
      }
    } else {
      document.getElementById('file-sync-settings').classList.add('hidden');
    }

    renderSettingsEventsList();
    openModalAccessible(settingsModal, document.querySelector('.settings-tabs .tab-btn.active'));
  });

  // Live Preview Handlers for Language and Theme
  const settingsLangSelect = document.getElementById('settings-lang');
  if (settingsLangSelect) {
    settingsLangSelect.addEventListener('change', (e) => {
      state.lang = e.target.value;
      translatePage();
      updateTimeAndGreeting();
      loadWeather();
      loadWikipediaContent();
    });
  }

  const settingsThemeSelect = document.getElementById('settings-theme');
  if (settingsThemeSelect) {
    settingsThemeSelect.addEventListener('change', (e) => {
      state.theme = e.target.value;
      applyTheme();
    });
  }

  // Close Settings Modal on X button or clicking outside (backdrop)
  document.getElementById('close-settings').addEventListener('click', () => {
    settingsModal.close();
  });

  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
      settingsModal.close();
    }
  });

  // Manage all dialogs: Backdrop clicks, Focus trap on Tab, Focus restore on close
  document.querySelectorAll('.modal-dialog').forEach(modal => {
    if (modal !== settingsModal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.close();
        }
      });
    }

    // Focus trapping within open modal dialog
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        trapFocusInDialog(e, modal);
      }
    });

    // Return focus to previous trigger when dialog closes
    modal.addEventListener('close', () => {
      if (lastActiveElementBeforeModal && typeof lastActiveElementBeforeModal.focus === 'function') {
        try {
          lastActiveElementBeforeModal.focus();
        } catch (err) {}
      }
    });
  });

  settingsModal.addEventListener('close', () => {
    updateOrganizerVisibility();
    renderTodos();
    renderCountdowns();
    loadWeather();
    loadWikipediaContent();
    fetchGitHub();
    fetchBitbucket();
    fetchJira();
    fetchGmail();
    fetchGoogleTasks();
    fetchGoogleCalendar();
    if (state.settings.googleClientId) {
      initGoogleOAuth();
    }
  });

  // Storage Mode Change Handler
  document.getElementById('settings-storage-mode').addEventListener('change', (e) => {
    if (e.target.value === 'file') {
      document.getElementById('file-sync-settings').classList.remove('hidden');
      if (fileHandle) {
        document.getElementById('sync-file-name').textContent = fileHandle.name;
      } else {
        document.getElementById('sync-file-name').textContent = translations[state.lang]['no-file-selected'];
      }
    } else {
      document.getElementById('file-sync-settings').classList.add('hidden');
    }
  });

  // Select File Button Handler
  document.getElementById('btn-select-file').addEventListener('click', async () => {
    if (!('showOpenFilePicker' in window)) {
      alert(translations[state.lang]['file-unsupported']);
      return;
    }
    try {
      const [handle] = await window.showOpenFilePicker({
        types: [{
          description: 'JSON Files',
          accept: {
            'application/json': ['.json']
          }
        }],
        multiple: false
      });
      if (handle) {
        fileHandle = handle;
        await saveFileHandle(handle);
        document.getElementById('sync-file-name').textContent = handle.name;
        
        // Read file contents
        const fileData = await readDataFromFile();
        if (fileData) {
          // File has data, offer to load it or overwrite it
          const confirmLoad = confirm(
            state.lang === 'es' 
              ? 'El archivo seleccionado contiene datos. ¿Deseas cargarlos y reemplazar los datos actuales en el navegador?' 
              : 'The selected file contains data. Do you want to load it and overwrite current browser data?'
          );
          if (confirmLoad) {
            if (fileData.todos) state.todos = fileData.todos;
            if (fileData.settings) {
              state.settings = mergeSettingsWithLocalSecrets(fileData.settings, state.settings);
            }
            if (state.settings.lang) state.lang = state.settings.lang;
            if (state.settings.theme) state.theme = state.settings.theme;
            if (state.settings.primaryColor) applyPrimaryColor(state.settings.primaryColor);
            
            await saveSettings();
            applyTheme();
            renderTodos();
            renderCountdowns();
            updateUpcomingEventBanner();
            updateNotesBadge();
            updateOrganizerVisibility();
            translatePage();
            updateTimeAndGreeting();
            loadWeather();
            fetchAllPRs();
            fetchJira();
          } else {
            // Overwrite file with current state
            await writeDataToFile();
          }
        } else {
          // File is empty, write current state
          await writeDataToFile();
        }
      }
    } catch (err) {
      console.error(err);
    }
  });

  // Backup handlers
  document.getElementById('btn-export-data').addEventListener('click', () => {
    exportStateToFile();
  });

  const importTrigger = document.getElementById('btn-import-trigger');
  const importInput = document.getElementById('file-import-input');
  
  importTrigger.addEventListener('click', () => {
    importInput.click();
  });

  importInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      importStateFromFile(file);
    }
  });

  // Settings Tabs Switch with WAI-ARIA arrow navigation & roving tabindex
  const tabButtons = Array.from(document.querySelectorAll('.settings-tabs .tab-btn'));
  
  function activateSettingsTab(targetBtn, shouldFocus = true) {
    if (!targetBtn) return;
    const targetTab = targetBtn.getAttribute('data-tab');
    
    tabButtons.forEach(btn => {
      const isActive = btn === targetBtn;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      btn.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    document.querySelectorAll('.tab-pane').forEach(pane => {
      const isTarget = pane.id === targetTab;
      pane.classList.toggle('active', isTarget);
    });

    // Scroll the selected tab into view inside the tab bar container
    targetBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    if (shouldFocus) {
      targetBtn.focus();
    }
  }

  tabButtons.forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      activateSettingsTab(btn, false);
    });

    btn.addEventListener('keydown', (e) => {
      let newIndex = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        newIndex = (index + 1) % tabButtons.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        newIndex = (index - 1 + tabButtons.length) % tabButtons.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        newIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        newIndex = tabButtons.length - 1;
      }

      if (newIndex >= 0) {
        activateSettingsTab(tabButtons[newIndex], true);
      }
    });
  });

  // Event tab Add Event handler
  const addEventBtn = document.getElementById('btn-add-event');
  if (addEventBtn) {
    addEventBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('event-name-input');
      const dateInput = document.getElementById('event-date-input');
      
      nameInput.classList.remove('invalid-field');
      dateInput.classList.remove('invalid-field');
      nameInput.setCustomValidity('');
      dateInput.setCustomValidity('');

      if (!nameInput.value.trim()) {
        nameInput.classList.add('invalid-field');
        nameInput.setCustomValidity(state.lang === 'es' ? 'Por favor, rellene este campo.' : 'Please fill out this field.');
        nameInput.reportValidity();
        nameInput.addEventListener('input', () => {
          nameInput.classList.remove('invalid-field');
          nameInput.setCustomValidity('');
        }, { once: true });
        return;
      }
      if (!dateInput.value) {
        dateInput.classList.add('invalid-field');
        dateInput.setCustomValidity(state.lang === 'es' ? 'Por favor, rellene este campo.' : 'Please fill out this field.');
        dateInput.reportValidity();
        dateInput.addEventListener('input', () => {
          dateInput.classList.remove('invalid-field');
          dateInput.setCustomValidity('');
        }, { once: true });
        return;
      }

      const name = nameInput.value.trim();
      const date = dateInput.value;
      
      state.settings.customEvents = state.settings.customEvents || [];
      state.settings.customEvents.push({
        id: Date.now().toString(),
        name,
        date
      });
      
      nameInput.value = '';
      dateInput.value = '';
      
      await saveSettings();
      renderSettingsEventsList();
      updateUpcomingEventBanner();
    });
  }

  // Auto-Save Settings Form
  let autoSaveTimeout = null;

  async function autoSaveSettingsForm() {
    state.settings.lang = document.getElementById('settings-lang').value;
    state.settings.city = document.getElementById('settings-city').value.trim();
    state.settings.theme = document.getElementById('settings-theme').value;
    const colorInput = document.getElementById('settings-primary-color');
    if (colorInput) {
      state.settings.primaryColor = colorInput.value;
      applyPrimaryColor(state.settings.primaryColor);
    }
    
    state.theme = state.settings.theme;
    
    const newStorageMode = document.getElementById('settings-storage-mode').value;
    if (newStorageMode !== 'file' && state.settings.storageMode === 'file') {
      fileHandle = null;
      await clearFileHandle();
    }
    state.settings.storageMode = newStorageMode;
    
    state.settings.googleClientId = document.getElementById('google-client-id').value.trim();
    state.settings.personalColor = document.getElementById('google-color-personal').value;
    state.settings.workColor = document.getElementById('google-color-work').value;
    applyAccountColors();
    state.settings.githubToken = document.getElementById('github-token').value.trim();
    state.settings.hideGithubOoo = document.getElementById('settings-github-ooo-hide').checked;

    state.settings.bitbucketWorkspace = document.getElementById('bitbucket-workspace').value.trim();
    state.settings.bitbucketUsername = document.getElementById('bitbucket-username').value.trim();
    state.settings.bitbucketToken = document.getElementById('bitbucket-token').value.trim();
    state.settings.hideBitbucketOoo = document.getElementById('settings-bitbucket-ooo-hide').checked;

    state.settings.gitlabHost = document.getElementById('gitlab-host').value.trim();
    state.settings.gitlabToken = document.getElementById('gitlab-token').value.trim();
    state.settings.hideGitlabOoo = document.getElementById('settings-gitlab-ooo-hide').checked;

    state.settings.jiraHost = document.getElementById('jira-host').value.trim();
    state.settings.jiraEmail = document.getElementById('jira-email').value.trim();
    state.settings.jiraToken = document.getElementById('jira-token').value.trim();
    state.settings.hideJiraOoo = document.getElementById('settings-jira-ooo-hide').checked;

    const oooActive = document.getElementById('settings-ooo-active').checked;
    const oooUntil = document.getElementById('settings-ooo-active').getAttribute('data-until') || state.settings.oooUntil;
    state.settings.oooActive = oooActive;
    state.settings.oooUntil = oooActive ? oooUntil : null;

    updateOooBadges();

    state.settings.worldClockTz = document.getElementById('settings-world-clock-tz').value;
    state.settings.worldClockLabel = document.getElementById('settings-world-clock-label').value.trim();
    const wUrlEl = document.getElementById('settings-weather-url');
    if (wUrlEl) state.settings.weatherUrl = wUrlEl.value.trim();
    const cUrlEl = document.getElementById('settings-world-clock-url');
    if (cUrlEl) state.settings.worldClockUrl = cUrlEl.value.trim();
    const finUrlEl = document.getElementById('settings-finance-url');
    if (finUrlEl) state.settings.financeUrl = finUrlEl.value.trim();
    const tUrlEl = document.getElementById('settings-timer-url');
    if (tUrlEl) state.settings.timerUrl = tUrlEl.value.trim();
    const swUrlEl = document.getElementById('settings-stopwatch-url');
    if (swUrlEl) state.settings.stopwatchUrl = swUrlEl.value.trim();
    state.settings.showWeather = document.getElementById('settings-show-weather').checked;
    state.settings.showWorldClock = document.getElementById('settings-show-world-clock').checked;
    state.settings.showCountdowns = document.getElementById('settings-show-countdowns').checked;
    state.settings.showTasks = document.getElementById('settings-show-tasks').checked;
    state.settings.showGoogleEmails = document.getElementById('settings-show-google-emails').checked;
    const gTasksTodayElSave = document.getElementById('settings-show-google-tasks-today');
    if (gTasksTodayElSave) state.settings.showGoogleTasksToday = gTasksTodayElSave.checked;
    const gTasksWeekElSave = document.getElementById('settings-show-google-tasks-week');
    if (gTasksWeekElSave) state.settings.showGoogleTasksWeek = gTasksWeekElSave.checked;
    const gTasksOverdueElSave = document.getElementById('settings-show-google-tasks-overdue');
    if (gTasksOverdueElSave) state.settings.showGoogleTasksOverdue = gTasksOverdueElSave.checked;
    state.settings.showGit = document.getElementById('settings-show-git').checked;
    state.settings.showJira = document.getElementById('settings-show-jira').checked;

    const showWikiSave = document.getElementById('settings-show-wikipedia');
    if (showWikiSave) state.settings.showWikipedia = showWikiSave.checked;
    const wikiTypeSave = document.getElementById('settings-wikipedia-type');
    if (wikiTypeSave) state.settings.wikipediaType = wikiTypeSave.value || 'news';

    const prevLang = state.lang;
    state.lang = state.settings.lang;

    await saveSettings();
    
    // If we just toggled file-sync on, let's initialize it
    if (state.settings.storageMode === 'file') {
      await initializeFileSync();
    }

    applyTheme();

    if (prevLang !== state.lang) {
      translatePage();
      updateTimeAndGreeting();
    }
  }

  const settingsForm = document.getElementById('settings-form');
  if (settingsForm) {
    settingsForm.addEventListener('change', () => {
      autoSaveSettingsForm();
    });

    settingsForm.addEventListener('input', () => {
      if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
      autoSaveTimeout = setTimeout(() => {
        autoSaveSettingsForm();
      }, 300);
    });

    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      autoSaveSettingsForm();
    });
  }

  // Google OAuth Personal Login Action
  const loginBtnPersonal = document.getElementById('google-login-btn-personal');
  loginBtnPersonal.addEventListener('click', () => {
    if (!state.settings.googleClientId) {
      const clientIdInput = document.getElementById('google-client-id');
      const msg = state.lang === 'es' ? 'Por favor, introduce tu Google Client ID.' : 'Please enter your Google Client ID.';
      showInputErrorFeedback(clientIdInput, msg);
      return;
    }
    setGoogleLoginTarget('personal');
    if (getGoogleTokenClient()) {
      getGoogleTokenClient().requestAccessToken({ prompt: 'select_account' });
    } else {
      initGoogleOAuth();
      getGoogleTokenClient().requestAccessToken({ prompt: 'select_account' });
    }
  });

  // Google OAuth Work Login Action
  const loginBtnWork = document.getElementById('google-login-btn-work');
  loginBtnWork.addEventListener('click', () => {
    if (!state.settings.googleClientId) {
      const clientIdInput = document.getElementById('google-client-id');
      const msg = state.lang === 'es' ? 'Por favor, introduce tu Google Client ID.' : 'Please enter your Google Client ID.';
      showInputErrorFeedback(clientIdInput, msg);
      return;
    }
    setGoogleLoginTarget('work');
    if (getGoogleTokenClient()) {
      getGoogleTokenClient().requestAccessToken({ prompt: 'select_account' });
    } else {
      initGoogleOAuth();
      getGoogleTokenClient().requestAccessToken({ prompt: 'select_account' });
    }
  });

  // Google OAuth Personal Logout Action
  document.getElementById('google-logout-btn-personal').addEventListener('click', () => {
    if (state.googlePersonalToken) {
      google.accounts.oauth2.revokeToken(state.googlePersonalToken, () => {});
    }
    state.googlePersonalToken = null;
    state.googlePersonalEmail = null;
    localStorage.removeItem('google_personal_token');
    localStorage.removeItem('google_personal_email');
    localStorage.removeItem('google_personal_expiry');
    sessionStorage.removeItem('google_personal_token');
    sessionStorage.removeItem('google_personal_email');
    
    // Sync legacy/compatibility tokens
    state.googleClientToken = state.googleWorkToken;
    localStorage.setItem('google_access_token', state.googleClientToken || '');
    sessionStorage.setItem('google_access_token', state.googleClientToken || '');
    
    updateGoogleAuthStatus();
    
    // Clear / Refetch Google components
    if (state.googleWorkToken) {
      fetchGoogleData();
    } else {
      fetchGoogleCalendar();
      fetchGmail();
      fetchGoogleTasks();
    }
  });

  // Google OAuth Work Logout Action
  document.getElementById('google-logout-btn-work').addEventListener('click', () => {
    if (state.googleWorkToken) {
      google.accounts.oauth2.revokeToken(state.googleWorkToken, () => {});
    }
    state.googleWorkToken = null;
    state.googleWorkEmail = null;
    localStorage.removeItem('google_work_token');
    localStorage.removeItem('google_work_email');
    localStorage.removeItem('google_work_expiry');
    sessionStorage.removeItem('google_work_token');
    sessionStorage.removeItem('google_work_email');
    
    // Sync legacy/compatibility tokens
    state.googleClientToken = state.googlePersonalToken;
    localStorage.setItem('google_access_token', state.googleClientToken || '');
    sessionStorage.setItem('google_access_token', state.googleClientToken || '');
    
    updateGoogleAuthStatus();
    
    // Clear / Refetch Google components
    if (state.googlePersonalToken) {
      fetchGoogleData();
    } else {
      fetchGoogleCalendar();
      fetchGmail();
      fetchGoogleTasks();
    }
  });

  // Todo Form Submit (Add Task)
  document.getElementById('todo-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('todo-input');
    const dateInput = document.getElementById('todo-date');
    const prioritySelect = document.getElementById('todo-priority');



    addTodo(input.value.trim(), dateInput.value, prioritySelect.value);

    // Reset Form
    input.value = '';
    dateInput.value = '';
    prioritySelect.value = 'medium';

    const addTaskModal = document.getElementById('add-task-modal');
    if (addTaskModal) addTaskModal.close();
  });

  // Todo Filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter');
      renderTodos();
    });
  });

  // Edit Task Form Close & Submit
  const editModal = document.getElementById('edit-task-modal');
  document.getElementById('close-edit-modal').addEventListener('click', () => editModal.close());
  document.getElementById('cancel-edit-btn').addEventListener('click', () => editModal.close());
  
  document.getElementById('edit-task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-task-id').value;
    const textInput = document.getElementById('edit-task-text');
    const text = textInput.value.trim();
    const date = document.getElementById('edit-task-date').value;
    const priority = document.getElementById('edit-task-priority').value;



    updateTodo(id, text, date, priority);
    editModal.close();
  });
}

function openEditModal(todo) {
  document.getElementById('edit-task-id').value = todo.id;
  document.getElementById('edit-task-text').value = todo.text;
  document.getElementById('edit-task-date').value = todo.dueDate || '';
  openModalAccessible(document.getElementById('edit-task-modal'), document.getElementById('edit-task-text'));
}

// -------------------------------------------------------------
// UTILITIES AND HELPERS
// -------------------------------------------------------------
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateShort(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const d = new Date(dateStr + 'T00:00:00');
  d.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = d.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return state.lang === 'es' ? 'Hoy' : 'Today';
  } else if (diffDays === 1) {
    return state.lang === 'es' ? 'Mañana' : 'Tomorrow';
  } else if (diffDays === -1) {
    return state.lang === 'es' ? 'Ayer' : 'Yesterday';
  }

  const locale = getLocale(state.lang);
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
}

function formatEventTime(evt) {
  if (evt.start.date) {
    return state.lang === 'es' ? 'Todo el día' : 'All day';
  }
  const date = new Date(evt.start.dateTime);
  const options = { hour: '2-digit', minute: '2-digit', hour12: false };
  return date.toLocaleTimeString(getLocale(state.lang), options);
}

function getRelativeDateLabel(dateVal) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const target = new Date(dateVal);
  target.setHours(0, 0, 0, 0);
  
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === -1) {
    return state.lang === 'es' ? 'Ayer' : 'Yesterday';
  } else if (diffDays === 0) {
    return state.lang === 'es' ? 'Hoy' : 'Today';
  } else if (diffDays === 1) {
    return state.lang === 'es' ? 'Mañana' : 'Tomorrow';
  } else if (diffDays === 2) {
    return state.lang === 'es' ? 'Pasado mañana' : 'Day after tomorrow';
  } else {
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    const formatted = target.toLocaleDateString(getLocale(state.lang), options);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }
}

// -------------------------------------------------------------
// APP INITIALIZATION
// -------------------------------------------------------------
async function init() {
  await loadState();
  applyTheme();
  translatePage();
  updateTimeAndGreeting();
  setupEventListeners();
  
  // Real-time Clock tick
  setInterval(updateTimeAndGreeting, 60000);

  // Load weather and quotes
  loadWeather();
  loadQuote();

  // Render initial tasks
  renderTodos();

  // Render initial countdowns
  renderCountdowns();
  updateNotesBadge();

  // Fetch API data for configured integrations
  fetchGitHub();
  fetchBitbucket();
  fetchJira();

  // Load Google Auth and render setup links
  setTimeout(initGoogleOAuth, 1000);
}

// Start application
window.addEventListener('DOMContentLoaded', init);
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (state.theme === 'system') applyTheme();
});
