import { state as defaultState, state } from "../utils/state.js";
import { safeFetch as defaultSafeFetch, escapeHtml as defaultEscapeHtml, safeFetch, escapeHtml } from "../utils/helpers.js";
import { t } from "../locales/index.js";
import { saveSettings } from "./storage.js";
import { translatePage } from "../ui/settings.js";

// General helper to sanitize Jira Host URL (strips trailing slash, /jira, /secure, /browse suffixes)
export function sanitizeJiraHost(host) {
  if (!host) return "";
  let trimmed = String(host).trim();
  if (!trimmed) return "";

  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    trimmed = "https://" + trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.hostname.endsWith(".atlassian.net")) {
      return parsed.origin;
    }
    const cleanedPath = parsed.pathname
      .replace(/\/jira(\/.*)?$/i, "")
      .replace(/\/secure(\/.*)?$/i, "")
      .replace(/\/browse(\/.*)?$/i, "")
      .replace(/\/+$/, "");
    return `${parsed.origin}${cleanedPath}`;
  } catch (e) {
    return trimmed
      .replace(/\/jira(\/.*)?$/i, "")
      .replace(/\/secure(\/.*)?$/i, "")
      .replace(/\/browse(\/.*)?$/i, "")
      .replace(/\/+$/, "");
  }
}

// General helper to encode Jira Basic Auth
export function getJiraAuthHeader(settings) {
  if (!settings || !settings.jiraEmail || !settings.jiraToken) return null;
  return "Basic " + btoa(`${settings.jiraEmail}:${settings.jiraToken}`);
}

// Cooldown tracker for failed Jira connection tests (30 seconds)
export function startJiraTestCooldown(button) {
  if (button.dataset.cooldownInterval) {
    clearInterval(parseInt(button.dataset.cooldownInterval, 10));
  }

  let remaining = 30;
  button.disabled = true;
  button.style.backgroundColor = 'rgba(235, 87, 87, 0.1)';
  button.style.color = '#eb5757';
  button.style.borderColor = '#eb5757';
  button.style.cursor = 'not-allowed';

  const originalText = t('btn-connect');
  button.textContent = `${originalText} (${remaining}s)`;
  
  const interval = setInterval(() => {
    remaining--;
    if (remaining <= 0) {
      clearInterval(interval);
      delete button.dataset.cooldownInterval;
      button.disabled = false;
      button.textContent = originalText;
      button.setAttribute('data-i18n', 'btn-connect');
      button.style.backgroundColor = '';
      button.style.color = '';
      button.style.borderColor = '';
      button.style.cursor = '';
      if (typeof translatePage === 'function') translatePage();
    } else {
      button.textContent = `${originalText} (${remaining}s)`;
    }
  }, 1000);
  
  button.dataset.cooldownInterval = String(interval);
}

// Test Jira connection validator
export async function testJiraConnection(button) {
  const originalText = t('btn-connect');
  button.textContent = t('btn-connecting');
  button.disabled = true;

  let success = false;
  let errorMsg = '';

  try {
    const hostInputEl = document.getElementById('jira-host');
    let host = sanitizeJiraHost(hostInputEl ? hostInputEl.value : '');
    if (hostInputEl && host) {
      hostInputEl.value = host;
    }
    const email = document.getElementById('jira-email').value.trim();
    const token = document.getElementById('jira-token').value.trim();
    if (!host || !email || !token) {
      throw new Error(t('git-fill-fields'));
    }

    const auth = btoa(`${email}:${token}`);
    let res = await safeFetch(`${host}/rest/api/3/myself`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });

    if (res.status === 401 || res.status === 403) {
      throw new Error(`Authentication failed (${res.status} ${res.status === 403 ? 'Forbidden' : 'Unauthorized'})`);
    }

    // Fallback to /rest/api/2/ only if 404 (Jira Server/Data Center)
    if (!res.ok && res.status === 404) {
      res = await safeFetch(`${host}/rest/api/2/myself`, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Accept': 'application/json'
        }
      });
      if (res.status === 401 || res.status === 403) {
        throw new Error(`Authentication failed (${res.status} ${res.status === 403 ? 'Forbidden' : 'Unauthorized'})`);
      }
    }

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText || 'Error'}`);
    }

    const contentType = (res.headers.get("content-type") || "").toLowerCase();
    if (contentType.includes("text/html")) {
      throw new Error("Received HTML login page instead of Jira API response");
    }

    let userData;
    try {
      userData = await res.json();
    } catch (e) {
      throw new Error("Invalid JSON response from Jira");
    }

    if (userData && (userData.accountId || userData.name || userData.emailAddress || userData.displayName || userData.key)) {
      success = true;
      state.settings.jiraHost = host;
      state.settings.jiraEmail = email;
      state.settings.jiraToken = token;
      state.jiraStatus = 'connected';
      state.jiraError = '';
      await saveSettings(state);
    } else {
      throw new Error((userData && userData.errorMessages && userData.errorMessages.join(', ')) || "Invalid Jira credentials or response");
    }
  } catch (e) {
    errorMsg = e.message || String(e);
    state.jiraStatus = 'error';
    state.jiraError = errorMsg;
  }

  // Update Settings dot status and warning icon reactively
  updateJiraStatusIndicators(state, escapeHtml);

  if (success) {
    if (button.dataset.cooldownInterval) {
      clearInterval(parseInt(button.dataset.cooldownInterval, 10));
      delete button.dataset.cooldownInterval;
    }
    button.textContent = t('btn-connected');
    button.setAttribute('data-i18n', 'btn-connected');
    button.style.backgroundColor = 'rgba(39, 174, 96, 0.1)';
    button.style.color = '#27ae60';
    button.style.borderColor = '#27ae60';
    button.style.cursor = 'default';
    button.disabled = true;
    
    fetchJira(state, safeFetch, escapeHtml);
  } else {
    // 30s cooldown on failure
    startJiraTestCooldown(button);
    fetchJira(state, safeFetch, escapeHtml);
  }
}

// Update Jira status indicators (dots and warning icon)
export function updateJiraStatusIndicators(state = defaultState, escapeHtml = defaultEscapeHtml) {
  const isConfigured = !!(state.settings.jiraHost && state.settings.jiraEmail && state.settings.jiraToken);
  const status = state.jiraStatus || (isConfigured ? 'connected' : 'disconnected');
  const errorMsg = state.jiraError || '';

  const jiraWarningTooltip = errorMsg ? `${t('git-error-prefix')}${errorMsg}` : t('btn-failed');
  const jiraWarningIconHTML = `<span class="status-warning-icon" data-tooltip="${escapeHtml(jiraWarningTooltip)}" onclick="event.stopPropagation(); window.openSettingsJiraTab();">⚠️</span>`;

  let tooltip = 'Jira: ';
  if (status === 'disconnected') {
    tooltip += t('disconnected');
  } else if (status === 'connected') {
    tooltip += t('connected');
  } else {
    tooltip += t('git-error-prefix') + errorMsg;
  }

  const dotClass = status === 'connected' ? 'connected' : (status === 'error' ? 'error' : 'disconnected');

  // Header status indicator in dashboard
  const ind = document.getElementById('jira-status-indicators');
  if (ind) {
    if (status === 'error' || errorMsg) {
      ind.innerHTML = jiraWarningIconHTML;
    } else {
      ind.innerHTML = '';
    }
  }

  // Dot indicator in Settings modal
  const setDot = document.getElementById('settings-jira-dot');
  if (setDot) {
    setDot.className = `status-dot ${dotClass}`;
    setDot.title = tooltip;
  }

  // Update Jira Test Connection button in Settings modal
  const jiraBtn = document.querySelector('.test-conn-btn[data-provider="jira"]');
  if (jiraBtn) {
    if (status === 'connected') {
      if (jiraBtn.dataset.cooldownInterval) {
        clearInterval(parseInt(jiraBtn.dataset.cooldownInterval, 10));
        delete jiraBtn.dataset.cooldownInterval;
      }
      jiraBtn.textContent = t('btn-connected');
      jiraBtn.setAttribute('data-i18n', 'btn-connected');
      jiraBtn.disabled = true;
      jiraBtn.style.backgroundColor = 'rgba(39, 174, 96, 0.1)';
      jiraBtn.style.color = '#27ae60';
      jiraBtn.style.borderColor = '#27ae60';
      jiraBtn.style.cursor = 'default';
    } else if (!jiraBtn.dataset.cooldownInterval) {
      jiraBtn.disabled = false;
      jiraBtn.textContent = t('btn-connect');
      jiraBtn.setAttribute('data-i18n', 'btn-connect');
      jiraBtn.style.backgroundColor = '';
      jiraBtn.style.color = '';
      jiraBtn.style.borderColor = '';
      jiraBtn.style.cursor = '';
    }
  }
}

// Fetch Jira Tasks
export async function fetchJira(state = defaultState, safeFetch = defaultSafeFetch, escapeHtml = defaultEscapeHtml) {
  const container = document.getElementById("jira-container");
  if (!container) return;
  
  const jiraBadge = document.getElementById("jira-count-badge");
  if (jiraBadge) {
    jiraBadge.classList.add("hidden");
  }

  let host = sanitizeJiraHost(state.settings.jiraHost || "");

  if (!host || !state.settings.jiraEmail || !state.settings.jiraToken) {
    state.jiraStatus = 'disconnected';
    state.jiraError = '';
    updateJiraStatusIndicators(state, escapeHtml);
    container.innerHTML = `<p class="empty-msg" style="margin: 0.5rem 0;"><a href="#" onclick="event.preventDefault(); window.openSettingsJiraTab();" style="color: var(--accent); text-decoration: underline; font-weight: 500;">${t('jira-config-link')}</a></p>`;
    return;
  }

  try {
    const jql = "assignee = currentUser() AND statusCategory != Done ORDER BY updated DESC";
    const authHeaders = {
      "Authorization": getJiraAuthHeader(state.settings),
      "Accept": "application/json"
    };
    const fieldsParam = encodeURIComponent("summary,status,priority,updated");

    // 1. Primary: Standard Jira Cloud GET /rest/api/3/search/jql
    let response = await safeFetch(`${host}/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}&maxResults=50&fields=${fieldsParam}`, {
      headers: authHeaders
    });

    // 2. Fallback: Jira Cloud POST /rest/api/3/search/jql
    if (!response.ok && response.status !== 401) {
      const postRes = await safeFetch(`${host}/rest/api/3/search/jql`, {
        method: "POST",
        headers: {
          ...authHeaders,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          jql: jql,
          maxResults: 50,
          fields: ["summary", "status", "priority", "updated"]
        })
      });
      if (postRes.ok) {
        response = postRes;
      }
    }

    // 3. Fallback: Legacy Jira Cloud GET /rest/api/3/search
    if (!response.ok && response.status !== 401) {
      const legacyRes = await safeFetch(`${host}/rest/api/3/search?jql=${encodeURIComponent(jql)}&maxResults=50&fields=${fieldsParam}`, {
        headers: authHeaders
      });
      if (legacyRes.ok) {
        response = legacyRes;
      }
    }

    // 4. Fallback: Jira Server / Data Center GET /rest/api/2/search
    if (!response.ok && response.status !== 401) {
      const dcRes = await safeFetch(`${host}/rest/api/2/search?jql=${encodeURIComponent(jql)}&maxResults=50&fields=${fieldsParam}`, {
        headers: authHeaders
      });
      if (dcRes.ok) {
        response = dcRes;
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText || 'Error'}`);
    }

    const contentType = (response.headers.get("content-type") || "").toLowerCase();
    if (contentType.includes("text/html")) {
      throw new Error("Received HTML login page instead of Jira API response");
    }

    let data;
    try {
      data = await response.json();
    } catch (e) {
      throw new Error("Invalid JSON response from Jira");
    }

    if (data.errorMessages && data.errorMessages.length > 0) {
      throw new Error(data.errorMessages.join(", "));
    }
    if (data.errors && Object.keys(data.errors).length > 0) {
      throw new Error(Object.values(data.errors).join(", "));
    }
    if (!Array.isArray(data.issues)) {
      throw new Error("Invalid Jira response (no issues list)");
    }

    const totalCount = typeof data.total === "number" ? data.total : data.issues.length;

    state.jiraStatus = 'connected';
    state.jiraError = '';
    updateJiraStatusIndicators(state, escapeHtml);

    if (jiraBadge) {
      if (data.issues && data.issues.length > 0) {
        jiraBadge.textContent = totalCount > 5 ? "5+" : totalCount;
        jiraBadge.setAttribute("data-tooltip", t("jira-assigned-tasks", { n: totalCount }));
        jiraBadge.classList.remove("hidden");
      } else {
        jiraBadge.classList.add("hidden");
      }
    }

    if (!data.issues || data.issues.length === 0) {
      container.innerHTML = `<p class="empty-msg">${t("no-jira-tasks")}</p>`;
      return;
    }

    // Helper to calculate status category rank: 1: IN PROGRESS, 2: BLOCKED, 3: TO DO, 4: DONE
    const getStatusRank = (statusName) => {
      if (!statusName) return 3;
      const s = statusName.toLowerCase();
      if (s.includes("progress") || s.includes("review") || s.includes("pr") || s.includes("pull") || s.includes("develop") || s.includes("testing") || s.includes("qa") || s.includes("active")) return 1;
      if (s.includes("block") || s.includes("hold") || s.includes("wait") || s.includes("imped") || s.includes("paus")) return 2;
      if (s.includes("done") || s.includes("closed") || s.includes("resolved") || s.includes("complet")) return 4;
      return 3; // To Do / Open / Backlog
    };

    // Sort issues by Status Rank (In Progress -> Blocked -> To Do -> Done), then by updated timestamp DESC
    const sortedIssues = [...data.issues].sort((a, b) => {
      const rankA = getStatusRank(a.fields?.status?.name);
      const rankB = getStatusRank(b.fields?.status?.name);
      if (rankA !== rankB) {
        return rankA - rankB;
      }
      const timeA = a.fields?.updated ? new Date(a.fields.updated).getTime() : 0;
      const timeB = b.fields?.updated ? new Date(b.fields.updated).getTime() : 0;
      return timeB - timeA;
    });

    container.innerHTML = sortedIssues.slice(0, 5).map(issue => {
      const fields = issue.fields || {};
      const summary = fields.summary || issue.summary || "";
      const key = issue.key || "";
      const url = `${host}/browse/${key}`;
      const priorityName = (fields.priority && fields.priority.name) ? fields.priority.name : "Medium";
      const statusName = (fields.status && fields.status.name) ? fields.status.name : "";

      const pLower = priorityName.toLowerCase();
      let priorityClass = "medium";
      if (pLower.includes("highest") || pLower.includes("blocker") || pLower.includes("critical") || pLower.includes("urgent") || pLower.includes("p1")) priorityClass = "highest";
      else if (pLower.includes("high") || pLower.includes("major") || pLower.includes("p2")) priorityClass = "high";
      else if (pLower.includes("low") || pLower.includes("minor") || pLower.includes("trivial") || pLower.includes("lowest") || pLower.includes("p4") || pLower.includes("p5")) priorityClass = "low";

      const sLower = statusName.toLowerCase();
      let statusClass = "todo";
      if (sLower.includes("done") || sLower.includes("closed") || sLower.includes("resolved") || sLower.includes("complet")) statusClass = "done";
      else if (sLower.includes("progress") || sLower.includes("review") || sLower.includes("pr") || sLower.includes("pull") || sLower.includes("develop") || sLower.includes("testing") || sLower.includes("qa")) statusClass = "progress";
      else if (sLower.includes("block") || sLower.includes("hold") || sLower.includes("wait") || sLower.includes("imped")) statusClass = "blocked";

      const titleText = `[${key}] ${summary}`;

      return `
        <a href="${url}" target="_blank" class="integration-item" data-tooltip="${escapeHtml(titleText)}\nStatus: ${escapeHtml(statusName)}\nPriority: ${escapeHtml(priorityName)}">
          <span class="item-title">${escapeHtml(summary)}</span>
          <div class="item-meta">
            <span style="display: flex; align-items: center; gap: 0.35rem; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              <span class="jira-key-badge">${escapeHtml(key)}</span>
              <span class="jira-priority-badge ${priorityClass}">${escapeHtml(priorityName)}</span>
            </span>
            <span class="jira-status-badge ${statusClass}">${escapeHtml(statusName)}</span>
          </div>
        </a>
      `;
    }).join("");

  } catch (error) {
    console.error("Jira fetch error:", error);
    state.jiraStatus = 'error';
    state.jiraError = error.message || "Error";
    updateJiraStatusIndicators(state, escapeHtml);
    container.innerHTML = `<p class="empty-msg">${t("no-jira-tasks")}</p>`;
  }
}
