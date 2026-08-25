import { state } from "./utils/state.js";
import { safeFetch, escapeHtml, formatDateShort, formatEventTime, getLocalDateString } from "./utils/helpers.js";
import { loadState } from "./services/storage.js";
import { setupGoogleContext, initGoogleOAuth } from "./services/google.js";
import { setupWikiContext, loadWikipediaContent } from "./services/wikipedia.js";
import { setupWeatherContext, loadWeather } from "./services/weather.js";
import { fetchAllPRs } from "./services/git.js";
import { fetchJira } from "./services/jira.js";
import { applyTheme } from "./ui/theme.js";
import { renderTodos } from "./ui/todos.js";
import { renderCountdowns } from "./ui/events.js";
import { updateTimeAndGreeting, updateNotesBadge, updateOrganizerVisibility, updateOooBadges } from "./ui/shortcuts.js";
import { translatePage, setupEventListeners } from "./ui/settings.js";

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
    getLocalDateString
  });
  setupWikiContext({ state });
  setupWeatherContext({ state });

  // Load state and apply visual theme & language
  await loadState(state);
  applyTheme(state);
  translatePage();
  updateTimeAndGreeting();
  updateOooBadges();
  updateOrganizerVisibility();

  // Attach event listeners
  setupEventListeners();

  // Real-time clock tick
  setInterval(updateTimeAndGreeting, 60000);

  // Load weather and dynamic content (quotes/wikipedia)
  loadWeather();
  loadWikipediaContent();

  // Render initial tasks and countdowns
  renderTodos();
  renderCountdowns();
  updateNotesBadge();

  // Fetch API data for configured integrations
  fetchAllPRs();
  fetchJira(state, safeFetch, escapeHtml);

  // Load Google Auth and render setup links
  setTimeout(() => initGoogleOAuth(state, safeFetch, escapeHtml, formatDateShort, formatEventTime, getLocalDateString), 1000);
}

// Start application
window.addEventListener("DOMContentLoaded", init);
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (state.theme === "system") applyTheme(state);
});
