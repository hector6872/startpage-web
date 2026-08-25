import { state as defaultState, state } from "../utils/state.js";
import { safeFetch as defaultSafeFetch, escapeHtml as defaultEscapeHtml, safeFetch, escapeHtml } from "../utils/helpers.js";
import { translations } from "../locales/index.js";
import { saveSettings } from "./storage.js";
import { translatePage } from "../ui/settings.js";

// General helper to encode Jira Basic Auth
export function getJiraAuthHeader(settings) {
  if (!settings || !settings.jiraEmail || !settings.jiraToken) return null;
  return "Basic " + btoa(`${settings.jiraEmail}:${settings.jiraToken}`);
}

// Cooldown tracker for successful Jira connection tests (60 seconds)
function startJiraTestCooldown(button) {
  let remaining = 60;
  button.disabled = true;

  const dict = translations[state.lang] || translations.en;
  const originalText = dict['btn-connect'] || 'Connect';
  
  const interval = setInterval(() => {
    remaining--;
    if (remaining <= 0) {
      clearInterval(interval);
      button.disabled = false;
      button.textContent = originalText;
      button.setAttribute('data-i18n', 'btn-connect');
      if (typeof translatePage === 'function') translatePage();
    } else {
      button.textContent = `${originalText} (${remaining}s)`;
    }
  }, 1000);
  
  button.dataset.cooldownInterval = interval;
}

// Test Jira connection validator
export async function testJiraConnection(button) {
  const dict = translations[state.lang] || translations.en;
  const originalText = dict['btn-connect'] || 'Connect';
  button.textContent = dict['btn-connecting'] || 'Connecting...';
  button.disabled = true;

  let success = false;
  let errorMsg = '';

  try {
    let host = document.getElementById('jira-host').value.trim().replace(/\/$/, "");
    if (host && !host.startsWith('http://') && !host.startsWith('https://')) {
      host = 'https://' + host;
    }
    host = host.replace(/\/jira\/?$/, '').replace(/\/secure.*$/, '');
    const email = document.getElementById('jira-email').value.trim();
    const token = document.getElementById('jira-token').value.trim();
    if (!host || !email || !token) {
      throw new Error(dict['git-fill-fields'] || 'Fill all fields');
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
    button.textContent = dict['btn-connected'] || 'Connected!';
    button.style.backgroundColor = 'rgba(39, 174, 96, 0.1)';
    button.style.color = '#27ae60';
    button.style.borderColor = '#27ae60';
    
    startJiraTestCooldown(button);
    fetchJira(state, safeFetch, escapeHtml);
  } else {
    button.textContent = dict['btn-failed'] || 'Failed';
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
    
    fetchJira(state, safeFetch, escapeHtml);
  }
}

// Update Jira status indicators (dots and warning icon)
export function updateJiraStatusIndicators(state = defaultState, escapeHtml = defaultEscapeHtml) {
  const dict = translations[state.lang] || translations.en;
  const isConfigured = !!(state.settings.jiraHost && state.settings.jiraEmail && state.settings.jiraToken);
  const status = state.jiraStatus || (isConfigured ? 'connected' : 'disconnected');
  const errorMsg = state.jiraError || '';

  const jiraWarningTooltip = errorMsg ? `Jira Error: ${errorMsg}` : (dict['status-error-connecting'] || 'Failed to connect to some services');
  const jiraWarningIconHTML = `<span class="status-warning-icon" data-tooltip="${escapeHtml(jiraWarningTooltip)}" onclick="event.stopPropagation(); window.openSettingsJiraTab();">⚠️</span>`;

  let tooltip = 'Jira: ';
  if (status === 'disconnected') {
    tooltip += dict['git-disconnected'] || 'Disconnected';
  } else if (status === 'connected') {
    tooltip += dict['git-connected'] || 'Connected';
  } else {
    tooltip += (dict['git-error-prefix'] || 'Error: ') + errorMsg;
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
}

// Fetch Jira Tasks
export async function fetchJira(state = defaultState, safeFetch = defaultSafeFetch, escapeHtml = defaultEscapeHtml) {
  const container = document.getElementById("jira-container");
  if (!container) return;
  
  const jiraBadge = document.getElementById("jira-count-badge");
  if (jiraBadge) {
    jiraBadge.classList.add("hidden");
  }

  let host = (state.settings.jiraHost || "").trim().replace(/\/$/, "");
  if (host && !host.startsWith("http://") && !host.startsWith("https://")) {
    host = "https://" + host;
  }
  // Sanitize host in case user entered a specific subpath like /jira or /secure
  host = host.replace(/\/jira\/?$/, "").replace(/\/secure.*$/, "");

  if (!host || !state.settings.jiraEmail || !state.settings.jiraToken) {
    state.jiraStatus = 'disconnected';
    state.jiraError = '';
    updateJiraStatusIndicators(state, escapeHtml);
    container.innerHTML = `<p class="empty-msg">${translations[state.lang]["status-unconfigured"]}</p>`;
    return;
  }

  try {
    const jql = "assignee = currentUser() AND statusCategory != Done ORDER BY updated DESC";
    const authHeaders = {
      "Authorization": getJiraAuthHeader(state.settings),
      "Accept": "application/json"
    };
    const fieldsParam = encodeURIComponent("summary,status,priority,updated");

    // 1. Standard Jira Cloud GET /rest/api/3/search
    let response = await safeFetch(`${host}/rest/api/3/search?jql=${encodeURIComponent(jql)}&maxResults=50&fields=${fieldsParam}`, {
      headers: authHeaders
    });

    // If authentication error, abort immediately - do not loop retry
    if (response.status === 401 || response.status === 403) {
      throw new Error(`Authentication failed (${response.status} ${response.status === 403 ? 'Forbidden' : 'Unauthorized'})`);
    }

    // 2. Standard Jira Cloud POST /rest/api/3/search
    if (!response.ok && response.status !== 401 && response.status !== 403) {
      response = await safeFetch(`${host}/rest/api/3/search`, {
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
      if (response.status === 401 || response.status === 403) {
        throw new Error(`Authentication failed (${response.status} ${response.status === 403 ? 'Forbidden' : 'Unauthorized'})`);
      }
    }

    // 3. Jira Server / DC GET /rest/api/2/search (only if 404)
    if (!response.ok && response.status === 404) {
      response = await safeFetch(`${host}/rest/api/2/search?jql=${encodeURIComponent(jql)}&maxResults=50&fields=${fieldsParam}`, {
        headers: authHeaders
      });
      if (response.status === 401 || response.status === 403) {
        throw new Error(`Authentication failed (${response.status} ${response.status === 403 ? 'Forbidden' : 'Unauthorized'})`);
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
        const dict = translations[state.lang] || translations.en;
        jiraBadge.setAttribute("data-tooltip", (dict["jira-assigned-tasks"] || "{n} assigned tasks in Jira").replace("{n}", totalCount));
        jiraBadge.classList.remove("hidden");
      } else {
        jiraBadge.classList.add("hidden");
      }
    }

    if (!data.issues || data.issues.length === 0) {
      container.innerHTML = `<p class="empty-msg">${translations[state.lang]["no-jira-tasks"]}</p>`;
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
    container.innerHTML = `<p class="empty-msg">${translations[state.lang]["no-jira-tasks"] || "No active Jira issues assigned."}</p>`;
  }
}
