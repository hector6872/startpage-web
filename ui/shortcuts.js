import { state } from "../utils/state.js";
import { translations, getLocale } from "../locales/index.js";
import { escapeHtml, formatDateShort, getLocalDateString } from "../utils/helpers.js";

export function updateTimeAndGreeting() {
  const now = new Date();
  
  // Format Clock
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const timeEl = document.getElementById('current-time');
  if (timeEl) timeEl.textContent = `${hours}:${minutes}`;
  
  // Format Date
  const dateOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const locale = getLocale(state.lang);
  const dateEl = document.getElementById('current-date');
  if (dateEl) dateEl.textContent = now.toLocaleDateString(locale, dateOptions);

  // Greeting
  const hour = now.getHours();
  let greetingKey = 'greeting-morning';
  if (hour >= 12 && hour < 19) {
    greetingKey = 'greeting-afternoon';
  } else if (hour >= 19 || hour < 6) {
    greetingKey = 'greeting-evening';
  }
  const greetingText = (translations[state.lang] || translations.en)[greetingKey];
  let fullGreeting = greetingText;
  if (state.settings.oooActive) {
    const oooEmojis = ['🏝️', '🏖️', '🍹', '🌊', '⛺', '🌴'];
    const emoji = oooEmojis[(now.getDate() + now.getMonth()) % oooEmojis.length];
    fullGreeting = `${greetingText} ${emoji}`;
  }
  const greetingEl = document.getElementById('greeting');
  if (greetingEl) greetingEl.textContent = `${fullGreeting}`;

  // Update World Clock
  updateWorldClock();
}

// World Clock System
export function getTzDifference(targetTz) {
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

export function updateWorldClock() {
  const widget = document.getElementById('world-clock-widget');
  if (!widget) return;

  if (state.settings.showWorldClock === false) {
    widget.classList.add('hidden');
    return;
  }
  
  widget.classList.remove('hidden');
  const dict = translations[state.lang] || translations.en;

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
    const timeEl = widget.querySelector('.clock-time');
    if (timeEl) timeEl.textContent = formatter.format(now);
    
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

export function updateNotesBadge() {
  const badge = document.getElementById("notes-badge");
  if (!badge) return;
  const hasNotes = state.settings.notes && state.settings.notes.trim().length > 0;
  if (hasNotes) {
    badge.classList.remove("hidden");
  } else {
    badge.classList.add("hidden");
  }
}

export function updateOooBadges() {
  const active = state.settings.oooActive === true;
  const badgeToday = document.getElementById("ooo-badge-today");
  const badgeWeek = document.getElementById("ooo-badge-week");
  const badgeWork = document.getElementById("ooo-badge-work");
  if (badgeToday) badgeToday.classList.toggle("hidden", !active);
  if (badgeWeek) badgeWeek.classList.toggle("hidden", !active);
  if (badgeWork) badgeWork.classList.toggle("hidden", !active);
}

export function updateOrganizerVisibility() {
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

  // Update World Clock, Weather, Wikipedia and Gmail widgets visibility
  updateWorldClock();
  const weatherWidget = document.getElementById('weather-widget');
  if (weatherWidget) {
    weatherWidget.classList.toggle('hidden', state.settings.showWeather === false);
  }
  const wikiWidget = document.getElementById('quote-widget');
  if (wikiWidget) {
    wikiWidget.classList.toggle('hidden', state.settings.showWikipedia === false);
  }
  const gmailCard = document.getElementById('gmail-card');
  if (gmailCard) {
    gmailCard.classList.toggle('hidden', state.settings.showGoogleEmails === false);
  }
}

export function syncDashboardColumns() {
  const localTodaySection = document.getElementById("local-today-events");
  if (localTodaySection) localTodaySection.remove();
  
  const localWeekSection = document.getElementById("local-week-events");
  if (localWeekSection) localWeekSection.remove();

  const todayStr = getLocalDateString(new Date());
  
  const todayTasks = state.todos.filter(todo => !todo.completed && todo.dueDate === todayStr);
  
  const next7Days = [];
  for (let i = 1; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    next7Days.push(getLocalDateString(d));
  }
  const weekTasks = state.todos.filter(todo => !todo.completed && next7Days.includes(todo.dueDate));

  if (todayTasks.length > 0) {
    const container = document.querySelector("#col-today .col-content");
    if (container) {
      const card = document.createElement("div");
      card.id = "local-today-events";
      card.className = "section-card";
      card.innerHTML = `
        <h3 class="card-subtitle">${state.lang === "es" ? "Tareas de Hoy" : "Today's Tasks"}</h3>
        <div class="integration-list">
          ${todayTasks.map(t => `
            <div class="integration-item urgent">
              <span class="item-title">${escapeHtml(t.text)}</span>
              <div class="item-meta">
                <span class="item-badge priority-${t.priority}">${translations[state.lang]["priority-" + t.priority]}</span>
              </div>
            </div>
          `).join("")}
        </div>
      `;
      container.insertBefore(card, container.firstChild);
    }
  }

  if (weekTasks.length > 0) {
    const container = document.querySelector("#col-week .col-content");
    if (container) {
      const card = document.createElement("div");
      card.id = "local-week-events";
      card.className = "section-card";
      card.innerHTML = `
        <h3 class="card-subtitle">${state.lang === "es" ? "Tareas de esta Semana" : "This Week's Tasks"}</h3>
        <div class="integration-list">
          ${weekTasks.map(t => `
            <div class="integration-item">
              <span class="item-title">${escapeHtml(t.text)}</span>
              <div class="item-meta">
                <span>${formatDateShort(t.dueDate, state.lang)}</span>
                <span class="item-badge priority-${t.priority}">${translations[state.lang]["priority-" + t.priority]}</span>
              </div>
            </div>
          `).join("")}
        </div>
      `;
      container.insertBefore(card, container.firstChild);
    }
  }
}
