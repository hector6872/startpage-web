import { state as defaultState } from "../utils/state.js";
import { safeFetch as defaultSafeFetch, escapeHtml as defaultEscapeHtml } from "../utils/helpers.js";
import { translations } from "../locales/index.js";

// General helper to encode Jira Basic Auth
export function getJiraAuthHeader(settings) {
  if (!settings || !settings.jiraEmail || !settings.jiraToken) return null;
  return "Basic " + btoa(`${settings.jiraEmail}:${settings.jiraToken}`);
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

    // 2. Standard Jira Cloud POST /rest/api/3/search
    if (!response.ok) {
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
    }

    // 3. Jira Server / DC GET /rest/api/2/search
    if (!response.ok) {
      response = await safeFetch(`${host}/rest/api/2/search?jql=${encodeURIComponent(jql)}&maxResults=50&fields=${fieldsParam}`, {
        headers: authHeaders
      });
    }

    // 4. Jira Server / DC POST /rest/api/2/search
    if (!response.ok) {
      response = await safeFetch(`${host}/rest/api/2/search`, {
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
    }

    // 5. Alternate Jira Cloud /rest/api/3/search/jql
    if (!response.ok) {
      response = await safeFetch(`${host}/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}&maxResults=50&fields=${fieldsParam}`, {
        headers: authHeaders
      });
    }

    // 6. Simplified JQL fallback if statusCategory is not supported
    if (!response.ok) {
      const simpleJql = "assignee = currentUser() ORDER BY updated DESC";
      response = await safeFetch(`${host}/rest/api/3/search?jql=${encodeURIComponent(simpleJql)}&maxResults=50&fields=${fieldsParam}`, {
        headers: authHeaders
      });
      if (!response.ok) {
        response = await safeFetch(`${host}/rest/api/2/search?jql=${encodeURIComponent(simpleJql)}&maxResults=50&fields=${fieldsParam}`, {
          headers: authHeaders
        });
      }
    }

    if (!response.ok) {
      const errBody = await response.text().catch(() => "");
      console.error("Jira API Error Response:", response.status, errBody);
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const totalCount = typeof data.total === "number" ? data.total : (data.issues ? data.issues.length : 0);

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
    container.innerHTML = `<p class="empty-msg" style="color:var(--danger)">API Error (${error.message || "Error"})` + `</p>`;
  }
}
