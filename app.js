import { state } from "./utils/state.js";
import { safeFetch, escapeHtml, formatDateShort, formatEventTime, getLocalDateString, getRelativeDateLabel } from "./utils/helpers.js";
import { loadState } from "./services/storage.js";
import { setupGoogleContext, initGoogleOAuth, fetchGmail, fetchGoogleTasks, fetchGoogleCalendar } from "./services/google.js";
import { setupWikiContext, loadWikipediaContent } from "./services/wikipedia.js";
import { setupWeatherContext, loadWeather } from "./services/weather.js";
import { fetchAllPRs } from "./services/git.js";
import { fetchJira } from "./services/jira.js";
import { applyTheme } from "./ui/theme.js";
import { renderTodos } from "./ui/todos.js";
import { renderCountdowns } from "./ui/events.js";
import { updateTimeAndGreeting, updateNotesBadge, updateOrganizerVisibility, updateOooBadges } from "./ui/shortcuts.js";
import { translatePage, setupEventListeners, applyDashboardLayoutOrder } from "./ui/settings.js";

// -------------------------------------------------------------
// 1. Refetch on Focus / Visibility (when switching back to tab)
// 2. Tiered intervals based on criticality (Stale-While-Revalidate)
// 3. Background pausing / Network & battery saving
// -------------------------------------------------------------

const TTL = {
  git: 5 * 60 * 1000,      // 5 min: GitHub, Bitbucket and GitLab PRs
  jira: 5 * 60 * 1000,     // 5 min: Jira tasks
  google: 5 * 60 * 1000,   // 5 min: Gmail, Google Tasks and Calendar
  weather: 30 * 60 * 1000  // 30 min: Weather forecast
};

const lastFetchTimes = {
  git: 0,
  jira: 0,
  google: 0,
  weather: 0
};

export function refreshDashboardIfStale(force = false) {
  // Pillar 3: Pause background polling when tab is hidden
  if (document.hidden && !force) {
    return;
  }

  const now = Date.now();

  // If Google had errors or tokens are missing, don't wait for the 5-minute TTL on user focus/visibility
  const hasGoogleError = !!(state.googleErrors && (state.googleErrors.personal || state.googleErrors.work || state.googleErrors.tasks));
  const hasPendingGoogleAccount = !!(
    (state.googlePersonalEmail || localStorage.getItem('google_personal_email') || localStorage.getItem('google_personal_refresh_token')) && !state.googlePersonalToken ||
    (state.googleWorkEmail || localStorage.getItem('google_work_email') || localStorage.getItem('google_work_refresh_token')) && !state.googleWorkToken
  );

  // Pillar 2: Tiered refresh based on criticality / TTL
  // Git PRs (GitHub, Bitbucket, GitLab)
  if (force || now - lastFetchTimes.git >= TTL.git) {
    lastFetchTimes.git = now;
    fetchAllPRs();
  }

  // Jira
  if (force || now - lastFetchTimes.jira >= TTL.jira) {
    lastFetchTimes.jira = now;
    fetchJira(state, safeFetch, escapeHtml);
  }

  // Google (Gmail, Tasks, Calendar)
  if (force || hasGoogleError || hasPendingGoogleAccount || now - lastFetchTimes.google >= TTL.google) {
    lastFetchTimes.google = now;
    fetchGmail();
    fetchGoogleTasks();
    fetchGoogleCalendar();
  }

  // Weather
  if (force || now - lastFetchTimes.weather >= TTL.weather) {
    lastFetchTimes.weather = now;
    loadWeather();
  }
}

// -------------------------------------------------------------
// APP INITIALIZATION
// -------------------------------------------------------------
async function init() {
  // Initialize service contexts
  setupGoogleContext({
    state,
    safeFetch,
    escapeHtml,
    formatDateShort,
    formatEventTime,
    getLocalDateString,
    getRelativeDateLabel
  });
  setupWikiContext({ state });
  setupWeatherContext({ state });

  // Load state and apply visual theme & language
  await loadState(state);
  applyTheme(state);
  applyDashboardLayoutOrder(state);
  translatePage();
  updateTimeAndGreeting();
  updateOooBadges();
  updateOrganizerVisibility();

  // Attach event listeners
  setupEventListeners();

  // Load dynamic content (quotes/wikipedia)
  loadWikipediaContent();

  // Render initial tasks and countdowns
  renderTodos();
  renderCountdowns();
  updateNotesBadge();

  // Initialize Google Auth (process OAuth redirects & proactive token refresh)
  await initGoogleOAuth();

  // Initial API data fetch
  refreshDashboardIfStale(true);

  // Pillar 1: Refetch on Visibility / Focus
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      updateTimeAndGreeting();
      updateOooBadges();
      refreshDashboardIfStale();
    }
  });

  window.addEventListener("focus", () => {
    updateTimeAndGreeting();
    refreshDashboardIfStale();
  });

  // Refetch immediately when coming back online (e.g. WiFi reconnect after laptop sleep / Chrome start)
  window.addEventListener("online", () => {
    refreshDashboardIfStale(true);
  });

  // Refetch when tab is restored from BFCache or thawed by Chrome Memory Saver
  window.addEventListener("pageshow", (e) => {
    updateTimeAndGreeting();
    updateOooBadges();
    refreshDashboardIfStale(e.persisted);
  });

  // Periodic ticker (every 30s updates local clock and evaluates expired TTLs)
  setInterval(() => {
    updateTimeAndGreeting();
    refreshDashboardIfStale();
  }, 30000);
}

// Start application
window.addEventListener("DOMContentLoaded", init);
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (state.theme === "system") applyTheme(state);
});
