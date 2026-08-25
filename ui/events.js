import { state } from "../utils/state.js";
import { translations, getLocale } from "../locales/index.js";
import { escapeHtml, formatDateShort, getLocalDateString, openModalAccessible } from "../utils/helpers.js";
import { saveSettings } from "../services/storage.js";
import { confirmDeleteState } from "./todos.js";

export function renderCountdowns() {
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
    updateUpcomingEventBanner();
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

    const dict = translations[state.lang] || translations.en;

    if (isOverdue) {
      daysLabel = dict["badge-overdue"] || "Overdue";
      badgeHTML = `<span class="event-overdue-badge" style="margin-left: 0;">${daysLabel}</span>`;
      
      const timeDiff = todayMs - eventDateThisYear.getTime();
      const daysAgo = Math.floor(timeDiff / (1000 * 3600 * 24));
      relativeText = daysAgo === 1
        ? (dict["time-yesterday"] || "yesterday")
        : (dict["time-days-ago"] || "{n} days ago").replace("{n}", daysAgo);
    } else {
      const diffTime = eventDateThisYear.getTime() - todayMs;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let badgeClass = '';
      if (diffDays === 0) {
        daysLabel = dict["task-today"] || "Today";
        badgeClass = 'countdown-badge-amber';
        relativeText = (dict["task-today"] || "today").toLowerCase();
      } else if (diffDays === 1) {
        daysLabel = dict["task-tomorrow"] || "Tomorrow";
        badgeClass = 'countdown-badge-red';
        relativeText = (dict["task-tomorrow"] || "tomorrow").toLowerCase();
      } else if (diffDays < 7) {
        daysLabel = (dict["badge-in-days"] || "In {n} d").replace("{n}", diffDays);
        badgeClass = 'countdown-badge-red';
        relativeText = (dict["time-in-days"] || "in {n} days").replace("{n}", diffDays);
      } else if (diffDays < 31) {
        daysLabel = (dict["badge-in-days"] || "In {n} d").replace("{n}", diffDays);
        badgeClass = 'countdown-badge-amber';
        relativeText = (dict["time-in-days"] || "in {n} days").replace("{n}", diffDays);
      } else {
        daysLabel = (dict["badge-in-days"] || "In {n} d").replace("{n}", diffDays);
        badgeClass = 'countdown-badge-neutral';
        relativeText = (dict["time-in-days"] || "in {n} days").replace("{n}", diffDays);
        isFarFuture = true;
      }
      badgeHTML = `<span class="countdown-badge ${badgeClass}">${daysLabel}</span>`;
    }

    const titleClass = 'countdown-title';
    const formattedDate = formatDateShort(getLocalDateString(eventDateThisYear), state.lang);
    const fullMonthDate = eventDateThisYear.toLocaleDateString(getLocale(state.lang), { day: 'numeric', month: 'long' });
    const tooltipText = evt.name + `\n${fullMonthDate} (${relativeText})`;

    const editCountdownLabel = (dict["edit-event-action"] || "Edit event") + ": " + evt.name;
    const deleteCountdownLabel = (dict["delete-event-action"] || "Delete event") + ": " + evt.name;

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
        <button class="btn-item-action edit-countdown-btn" data-id="${evt.id}" title="${dict["btn-edit"] || "Edit"}" aria-label="${escapeHtml(editCountdownLabel)}">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
        </button>
        <button class="btn-item-action delete-countdown-btn" data-id="${evt.id}" title="${dict["btn-delete"] || "Delete"}" aria-label="${escapeHtml(deleteCountdownLabel)}">
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

  updateUpcomingEventBanner();
}

export function updateUpcomingEventBanner() {
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
  const dict = translations[state.lang] || translations.en;

  if (todayEvents.length > 0) {
    const names = todayEvents.map(e => e.name).join(', ');
    const labelText = `🎉 ${dict["task-today"] || "Today"}: ${names}! 🎂`;
    activeChipsHTML += `<div class="event-banner today">${escapeHtml(labelText)}</div>`;
    
    const remainingCount = events.length - todayEvents.length;
    if (remainingCount > 0) {
      const moreText = (dict["label-plus-more"] || "+{n} more").replace("{n}", remainingCount);
      activeChipsHTML += `<div class="event-banner more-chip">${escapeHtml(moreText)}</div>`;
    }
  } else if (pastEvents.length > 0) {
    pastEvents.sort((a, b) => a.daysAgo - b.daysAgo);
    const closestPast = pastEvents[0];
    const timeAgoText = closestPast.daysAgo === 1
      ? (dict["time-yesterday"] || "yesterday")
      : (dict["time-days-ago"] || "{n} days ago").replace("{n}", closestPast.daysAgo);
    const labelText = `⚠️ ${dict["badge-overdue"] || "Overdue"}: ${closestPast.name} (${timeAgoText})`;
    activeChipsHTML += `<div class="event-banner past-warning">${escapeHtml(labelText)}</div>`;
    
    const remainingCount = events.length - 1;
    if (remainingCount > 0) {
      const moreText = (dict["label-plus-more"] || "+{n} more").replace("{n}", remainingCount);
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
    if (closest.daysLeft === 1) {
      timeText = dict["task-tomorrow"] || "tomorrow";
    } else {
      timeText = (dict["time-in-days"] || "in {n} days").replace("{n}", closest.daysLeft);
    }
    const labelText = `${icon} ${closest.name} (${timeText})`;
    activeChipsHTML += `<div class="event-banner ${bannerClass}">${escapeHtml(labelText)}</div>`;
    
    const remainingCount = upcomingEvents.length - 1;
    if (remainingCount > 0) {
      const moreText = (dict["label-plus-more"] || "+{n} more").replace("{n}", remainingCount);
      activeChipsHTML += `<div class="event-banner more-chip">${escapeHtml(moreText)}</div>`;
    }
  }

  container.innerHTML = activeChipsHTML;
}

export async function addCountdown(name, date) {
  if (!name || !date) return;
  state.settings.customEvents = state.settings.customEvents || [];
  state.settings.customEvents.push({
    id: Date.now().toString(),
    name,
    date
  });
  await saveSettings(state);
  renderCountdowns();
  renderSettingsEventsList();
  updateUpcomingEventBanner();
}

export function deleteCountdown(id) {
  confirmDeleteState.actionType = "delete-countdown";
  confirmDeleteState.countdownId = id;
  const events = state.settings.customEvents || [];
  const countdown = events.find(c => c.id === id);
  if (!countdown) return;

  const modal = document.getElementById("confirm-delete-modal");
  if (modal) {
    const dict = translations[state.lang] || translations.en;
    modal.querySelector('[data-i18n="confirm-delete-title"]').textContent = dict["delete-event-title"] || "Delete Event";
    const descEl = modal.querySelector('[data-i18n="confirm-delete-desc"]');
    if (descEl) {
      const template = dict["delete-event-prompt-desc"] || "¿Estás seguro de que quieres eliminar el evento: <strong>\"{event}\"</strong>?";
      descEl.innerHTML = template.replace("{event}", escapeHtml(countdown.name));
    }
    modal.querySelector('[data-i18n="cancel-btn"]').textContent = dict["cancel-btn"];
    modal.querySelector('[data-i18n="delete-btn"]').textContent = dict["delete-btn"];
    openModalAccessible(modal, document.getElementById("btn-cancel-delete"));
  }
}

export function openEditEventModal(evt) {
  const modal = document.getElementById("edit-event-modal");
  if (!modal) return;
  document.getElementById("edit-event-id").value = evt.id;
  document.getElementById("edit-event-name-input").value = evt.name;
  document.getElementById("edit-event-date-input").value = evt.date;
  openModalAccessible(modal, document.getElementById("edit-event-name-input"));
}

export function renderSettingsEventsList() {
  const listEl = document.getElementById("settings-events-list");
  if (!listEl) return;
  listEl.innerHTML = "";
  const dict = translations[state.lang] || translations.en;

  const events = state.settings.customEvents || [];
  if (events.length === 0) {
    const emptyMsg = document.createElement("li");
    emptyMsg.style.color = "var(--text-secondary)";
    emptyMsg.style.fontSize = "0.8rem";
    emptyMsg.style.justifyContent = "center";
    emptyMsg.textContent = dict["no-events-configured"] || "No events configured.";
    listEl.appendChild(emptyMsg);
    return;
  }

  // Sort events chronologically (January -> December)
  const sortedEvents = [...events].sort((a, b) => {
    const [, mA, dA] = a.date.split("-").map(Number);
    const [, mB, dB] = b.date.split("-").map(Number);
    if (mA !== mB) return mA - mB;
    return dA - dB;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentYear = today.getFullYear();

  sortedEvents.forEach((evt) => {
    const li = document.createElement("li");
    
    const infoDiv = document.createElement("div");
    infoDiv.className = "event-item-info";
    
    const nameSpan = document.createElement("span");
    nameSpan.className = "event-item-name";
    nameSpan.textContent = evt.name;
    
    const dateRow = document.createElement("div");
    dateRow.style.display = "flex";
    dateRow.style.alignItems = "center";
    dateRow.style.gap = "0.5rem";
    
    const dateSpan = document.createElement("span");
    dateSpan.className = "event-item-date";
    const [y, m, d] = evt.date.split("-");
    const dateObj = new Date(y, parseInt(m, 10) - 1, d);
    dateSpan.textContent = dateObj.toLocaleDateString(getLocale(state.lang), { day: "numeric", month: "short" });
    
    dateRow.appendChild(dateSpan);
    
    const eventDateThisYear = new Date(currentYear, parseInt(m, 10) - 1, parseInt(d, 10));
    const isOverdue = eventDateThisYear < today && !(today.getMonth() === parseInt(m, 10) - 1 && today.getDate() === parseInt(d, 10));
    if (isOverdue) {
      const overdueBadge = document.createElement("span");
      overdueBadge.className = "event-overdue-badge";
      overdueBadge.textContent = dict["badge-overdue"] || "Overdue";
      dateRow.appendChild(overdueBadge);
    }

    infoDiv.appendChild(nameSpan);
    infoDiv.appendChild(dateRow);
    
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn-delete-event";
    deleteBtn.title = dict["btn-delete"] || "Delete";
    deleteBtn.setAttribute("aria-label", (dict["delete-event-action"] || "Delete event") + ": " + evt.name);
    deleteBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
    `;
    deleteBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      state.settings.customEvents = state.settings.customEvents.filter(item => item.id !== evt.id);
      await saveSettings(state);
      renderSettingsEventsList();
      updateUpcomingEventBanner();
      renderCountdowns();
    });
    
    li.appendChild(infoDiv);
    li.appendChild(deleteBtn);
    listEl.appendChild(li);
  });
}
