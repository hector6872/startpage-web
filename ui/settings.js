import { state } from "../utils/state.js";
import { getLocale, t } from "../locales/index.js";
import { applyPrimaryColor, applyAccountColors, applyTheme, updateSwatchActiveState, updateAccountSwatchActiveState } from "./theme.js";
import { updateOooBadges, updateOrganizerVisibility, updateNotesBadge, updateWorldClock, updateTimeAndGreeting } from "./shortcuts.js";
import { renderTodos, addTodo, updateTodo, showClearCompletedConfirmation, confirmDeleteState, setActiveFilter } from "./todos.js";
import { renderCountdowns, updateUpcomingEventBanner, addCountdown, renderSettingsEventsList } from "./events.js";
import { loadWeather } from "../services/weather.js";
import { loadWikipediaContent } from "../services/wikipedia.js";
import { fetchAllPRs, testGitConnection, updateGitStatusIndicators } from "../services/git.js";
import { fetchJira, testJiraConnection, updateJiraStatusIndicators, sanitizeJiraHost } from "../services/jira.js";
import { initGoogleOAuth, updateGoogleAuthStatus, getGoogleTokenClient, setGoogleLoginTarget, fetchGoogleData, fetchGoogleCalendar, fetchGmail, fetchGoogleTasks, initiateGoogleAuth } from "../services/google.js";
import { saveSettings, saveTodos, writeDataToFile, readDataFromFile, exportStateToFile, saveFileHandle, setFileHandle, fileHandle, mergeSettingsWithLocalSecrets, clearFileHandle, checkOooExpiration } from "../services/storage.js";
import { openModalAccessible, trapFocusInDialog, showInputErrorFeedback, ensureHttpUrl, lastActiveElementBeforeModal } from "../utils/helpers.js";

export function translatePage() {
  // Translate standard content elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  // Translate input placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.setAttribute('placeholder', t(key));
  });

  // Translate titles
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    el.setAttribute('title', t(key));
  });

  // Update UI lang toggle button text if exists
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.textContent = state.lang.toUpperCase();
  }

  // Update layout settings list if initialized
  renderLayoutSettings();
}

// DateTime / Greeting System

export function setupEventListeners() {
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

  const toggleShortcutsInputs = () => {
    const showEl = document.getElementById('settings-show-shortcuts');
    const show = showEl ? showEl.checked : true;
    const group = document.getElementById('shortcuts-settings-group');
    if (group) group.classList.toggle('collapsed', !show);
  };
  const showShortcutsEl = document.getElementById('settings-show-shortcuts');
  if (showShortcutsEl) {
    showShortcutsEl.addEventListener('change', () => {
      toggleShortcutsInputs();
      state.settings.showShortcuts = showShortcutsEl.checked;
      updateOrganizerVisibility();
      autoSaveSettingsForm();
    });
  }

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

  const toggleScheduleInputs = () => {
    const showEl = document.getElementById('settings-show-google-schedule');
    const show = showEl ? showEl.checked : true;
    const group = document.getElementById('google-schedule-suboptions');
    if (group) {
      group.style.opacity = show ? '1' : '0.4';
      group.style.pointerEvents = show ? 'auto' : 'none';
    }
  };
  const showScheduleEl = document.getElementById('settings-show-google-schedule');
  if (showScheduleEl) {
    showScheduleEl.addEventListener('change', () => {
      toggleScheduleInputs();
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
      if (provider === 'jira') {
        await testJiraConnection(btn);
      } else {
        await testGitConnection(provider, btn);
      }
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
      if (confirmDeleteState.actionType === 'hide-events') {
        const cb = document.getElementById('settings-show-countdowns');
        if (cb) cb.checked = true;
        autoSaveSettingsForm();
      }
      confirmDeleteModal.close();
      confirmDeleteState.todoId = null;
      confirmDeleteState.actionType = null;
    });
    
    document.getElementById('close-delete-modal').addEventListener('click', () => {
      if (confirmDeleteState.actionType === 'hide-events') {
        const cb = document.getElementById('settings-show-countdowns');
        if (cb) cb.checked = true;
        autoSaveSettingsForm();
      }
      confirmDeleteModal.close();
      confirmDeleteState.todoId = null;
      confirmDeleteState.countdownId = null;
      confirmDeleteState.actionType = null;
    });

    document.getElementById('btn-confirm-delete').addEventListener('click', async () => {
      if (confirmDeleteState.actionType === 'delete-single' && confirmDeleteState.todoId !== null) {
        state.todos = state.todos.filter(todo => todo.id !== confirmDeleteState.todoId);
        await saveTodos();
        renderTodos();
        confirmDeleteModal.close();
        confirmDeleteState.todoId = null;
        confirmDeleteState.actionType = null;
      } else if (confirmDeleteState.actionType === 'clear-completed') {
        state.todos = state.todos.filter(todo => !todo.completed);
        await saveTodos();
        renderTodos();
        confirmDeleteModal.close();
        confirmDeleteState.actionType = null;
      } else if (confirmDeleteState.actionType === 'delete-countdown' && confirmDeleteState.countdownId !== null) {
        state.settings.customEvents = (state.settings.customEvents || []).filter(c => c.id !== confirmDeleteState.countdownId);
        await saveSettings();
        renderCountdowns();
        renderSettingsEventsList();
        updateUpcomingEventBanner();
        confirmDeleteModal.close();
        confirmDeleteState.countdownId = null;
        confirmDeleteState.actionType = null;
      } else if (confirmDeleteState.actionType === 'hide-events') {
        confirmDeleteModal.close();
        confirmDeleteState.actionType = null;
        autoSaveSettingsForm();
      }
    });
  }

  // Handle immediate change on show-events switch
  const showEventsCheckbox = document.getElementById('settings-show-countdowns');
  if (showEventsCheckbox) {
    showEventsCheckbox.addEventListener('change', () => {
      if (!showEventsCheckbox.checked && (state.settings.customEvents && state.settings.customEvents.length > 0)) {
        confirmDeleteState.actionType = 'hide-events';
        confirmDeleteModal.querySelector('[data-i18n="confirm-delete-title"]').textContent = t('hide-events-title');
        const descEl = confirmDeleteModal.querySelector('[data-i18n="confirm-delete-desc"]');
        if (descEl) {
          descEl.innerHTML = t('hide-events-desc');
        }
        confirmDeleteModal.querySelector('[data-i18n="cancel-btn"]').textContent = t('cancel-btn');
        confirmDeleteModal.querySelector('[data-i18n="delete-btn"]').textContent = t('btn-confirm');
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

  // Click weather widget to open web page in new tab or open settings if unconfigured
  const weatherWidgetEl = document.getElementById('weather-widget');
  if (weatherWidgetEl) {
    weatherWidgetEl.addEventListener('click', (e) => {
      e.stopPropagation();
      const city = state.settings.city ? state.settings.city.trim() : '';
      if (!city) {
        document.getElementById('settings-toggle').click();
        const generalTab = document.querySelector('.tab-btn[data-tab="tab-general"]');
        if (generalTab) generalTab.click();
        const cityInput = document.getElementById('settings-city');
        if (cityInput) setTimeout(() => cityInput.focus(), 150);
        return;
      }

      let targetUrl = '';
      if (state.settings.weatherUrl && state.settings.weatherUrl.trim()) {
        targetUrl = ensureHttpUrl(state.settings.weatherUrl);
      } else {
        const langQuery = state.lang === 'es' ? 'tiempo' : 'weather';
        targetUrl = `https://www.google.com/search?q=${encodeURIComponent(langQuery + ' ' + city)}`;
      }
      if (targetUrl) {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
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

  // Click OOO badge to open settings at General tab
  const oooBadges = document.querySelectorAll('.ooo-badge');
  oooBadges.forEach(b => {
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      const toggleBtn = document.getElementById('settings-toggle');
      if (toggleBtn) {
        toggleBtn.click();
        const generalTab = document.querySelector('.tab-btn[data-tab="tab-general"]');
        if (generalTab) generalTab.click();
        const oooCard = document.querySelector('.ooo-settings-card');
        if (oooCard) {
          oooCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
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
          oooDateInput.value = state.settings.oooUntil || `${yyyy}-${mm}-${dd}`;
        }
        if (oooDateModal) openModalAccessible(oooDateModal, oooDateInput);
      } else {
        state.settings.oooActive = false;
        state.settings.oooUntil = null;
        oooActiveSwitch.removeAttribute('data-until');
        const display = document.getElementById('ooo-date-display');
        if (display) display.classList.add('hidden');
        autoSaveSettingsForm();
      }
    });
  }

  const oooDisplay = document.getElementById('ooo-date-display');
  if (oooDisplay) {
    oooDisplay.addEventListener('click', () => {
      if (state.settings.oooActive) {
        const today = new Date();
        today.setDate(today.getDate() + 1);
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        if (oooDateInput) {
          oooDateInput.min = `${yyyy}-${mm}-${dd}`;
          oooDateInput.value = state.settings.oooUntil || `${yyyy}-${mm}-${dd}`;
        }
        if (oooDateModal) openModalAccessible(oooDateModal, oooDateInput);
      }
    });
    oooDisplay.style.cursor = 'pointer';
    oooDisplay.title = 'Click to change return date';
  }

  if (oooForm && oooDateModal) {
    oooForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = oooDateInput.value;
      if (!val) return;
      
      if (oooActiveSwitch) {
        oooActiveSwitch.checked = true;
        oooActiveSwitch.setAttribute('data-until', val);
      }
      state.settings.oooActive = true;
      state.settings.oooUntil = val;

      const display = document.getElementById('ooo-date-display');
      const text = document.getElementById('ooo-return-date-text');
      if (display) display.classList.remove('hidden');
      if (text) text.textContent = new Date(val + 'T00:00:00').toLocaleDateString(getLocale(state.lang), { day: 'numeric', month: 'long', year: 'numeric' });
      
      oooDateModal.close();
      autoSaveSettingsForm();
    });
  }

  const cancelOooBtn = document.getElementById('btn-cancel-ooo');
  const closeOooModalBtn = document.getElementById('close-ooo-modal');
  if (cancelOooBtn && oooDateModal) {
    cancelOooBtn.addEventListener('click', () => {
      if (oooActiveSwitch && !state.settings.oooActive) oooActiveSwitch.checked = false;
      oooDateModal.close();
    });
  }
  if (closeOooModalBtn && oooDateModal) {
    closeOooModalBtn.addEventListener('click', () => {
      if (oooActiveSwitch && !state.settings.oooActive) oooActiveSwitch.checked = false;
      oooDateModal.close();
    });
  }

  // Settings Modal Open
  const settingsModal = document.getElementById('settings-modal');
  document.getElementById('settings-toggle').addEventListener('click', () => {
    checkOooExpiration(state);
    const modalBody = settingsModal ? settingsModal.querySelector('.modal-body') : null;
    if (modalBody) {
      modalBody.scrollTop = 0;
    }
    // Fill form fields with current settings
    document.getElementById('settings-lang').value = state.settings.lang;
    document.getElementById('settings-theme').value = state.settings.theme || 'system';
    const currentColor = state.settings.primaryColor || 'blue';
    const colorInput = document.getElementById('settings-primary-color');
    if (colorInput) colorInput.value = currentColor;
    updateSwatchActiveState(currentColor);

    document.getElementById('settings-city').value = state.settings.city;
    const weatherUrlInput = document.getElementById('settings-weather-url');
    if (weatherUrlInput) weatherUrlInput.value = state.settings.weatherUrl || '';
    document.getElementById('settings-world-clock-tz').value = state.settings.worldClockTz !== undefined ? state.settings.worldClockTz : '';
    document.getElementById('settings-world-clock-label').value = state.settings.worldClockLabel || '';
    const clockUrlInput = document.getElementById('settings-world-clock-url');
    if (clockUrlInput) clockUrlInput.value = state.settings.worldClockUrl || '';
    
    const financeUrlInput = document.getElementById('settings-finance-url');
    if (financeUrlInput) financeUrlInput.value = state.settings.financeUrl || '';
    const timerUrlInput = document.getElementById('settings-timer-url');
    if (timerUrlInput) timerUrlInput.value = state.settings.timerUrl || '';
    const stopwatchUrlInput = document.getElementById('settings-stopwatch-url');
    if (stopwatchUrlInput) stopwatchUrlInput.value = state.settings.stopwatchUrl || '';

    document.getElementById('settings-show-weather').checked = state.settings.showWeather !== false;
    document.getElementById('settings-show-world-clock').checked = state.settings.showWorldClock !== false;
    document.getElementById('settings-show-countdowns').checked = state.settings.showCountdowns !== false;
    document.getElementById('settings-show-tasks').checked = state.settings.showTasks !== false;
    const showShortcutsModalInput = document.getElementById('settings-show-shortcuts');
    if (showShortcutsModalInput) showShortcutsModalInput.checked = state.settings.showShortcuts !== false;
    const gScheduleEl = document.getElementById('settings-show-google-schedule');
    if (gScheduleEl) gScheduleEl.checked = state.settings.showGoogleSchedule !== false;
    const gRecurringEl = document.getElementById('settings-show-google-recurring-events');
    if (gRecurringEl) gRecurringEl.checked = state.settings.showGoogleRecurringEvents !== false;
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
    toggleShortcutsInputs();
    toggleWikipediaInputs();
    toggleScheduleInputs();
    
    document.getElementById('settings-storage-mode').value = state.settings.storageMode || 'local';
    document.getElementById('google-client-id').value = state.settings.googleClientId || '';
    const gClientSecretInput = document.getElementById('google-client-secret');
    if (gClientSecretInput) gClientSecretInput.value = state.settings.googleClientSecret || '';
    
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
      if (state.settings.oooActive && state.settings.oooUntil) {
        oooActiveInput.setAttribute('data-until', state.settings.oooUntil);
      } else {
        oooActiveInput.removeAttribute('data-until');
      }
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
        document.getElementById('sync-file-name').textContent = t('no-file-selected');
      }
    } else {
      document.getElementById('file-sync-settings').classList.add('hidden');
    }

    renderSettingsEventsList();
    renderLayoutSettings();
    updateGitStatusIndicators(state);
    updateJiraStatusIndicators(state);
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
      state.settings.theme = e.target.value;
      applyTheme(state);
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
    const modalBody = settingsModal.querySelector('.modal-body');
    if (modalBody) {
      modalBody.scrollTop = 0;
    }
    applyDashboardLayoutOrder(state);
    updateOrganizerVisibility();
    renderTodos();
    renderCountdowns();
    loadWeather();
    loadWikipediaContent();
    fetchAllPRs();
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
        document.getElementById('sync-file-name').textContent = t('no-file-selected');
      }
    } else {
      document.getElementById('file-sync-settings').classList.add('hidden');
    }
  });

  // Select File Button Handler
  document.getElementById('btn-select-file').addEventListener('click', async () => {
    if (!('showOpenFilePicker' in window)) {
      alert(t('file-unsupported'));
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
        setFileHandle(handle);
        await saveFileHandle(handle);
        document.getElementById('sync-file-name').textContent = handle.name;
        
        // Read file contents
        const fileData = await readDataFromFile();
        if (fileData) {
          // File has data, offer to load it or overwrite it
          const confirmLoad = confirm(t('confirm-load-file'));
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

    // Reset scroll position on tab switch
    const modalBody = settingsModal ? settingsModal.querySelector('.modal-body') : document.querySelector('#settings-modal .modal-body');
    if (modalBody) {
      modalBody.scrollTop = 0;
    }

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
        nameInput.setCustomValidity(t('form-required-field'));
        nameInput.reportValidity();
        nameInput.addEventListener('input', () => {
          nameInput.classList.remove('invalid-field');
          nameInput.setCustomValidity('');
        }, { once: true });
        return;
      }
      if (!dateInput.value) {
        dateInput.classList.add('invalid-field');
        dateInput.setCustomValidity(t('form-required-field'));
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
    const langEl = document.getElementById('settings-lang');
    if (langEl) state.settings.lang = langEl.value;
    const cityEl = document.getElementById('settings-city');
    if (cityEl) state.settings.city = cityEl.value.trim();
    const themeEl = document.getElementById('settings-theme');
    if (themeEl) {
      state.settings.theme = themeEl.value;
      state.theme = state.settings.theme;
    }
    const colorInput = document.getElementById('settings-primary-color');
    if (colorInput) {
      state.settings.primaryColor = colorInput.value;
      applyPrimaryColor(state.settings.primaryColor);
    }
    
    const storageModeEl = document.getElementById('settings-storage-mode');
    if (storageModeEl) {
      const newStorageMode = storageModeEl.value;
      if (newStorageMode !== 'file' && state.settings.storageMode === 'file') {
        setFileHandle(null);
        await clearFileHandle();
      }
      state.settings.storageMode = newStorageMode;
    }
    
    const gClientIdEl = document.getElementById('google-client-id');
    if (gClientIdEl) state.settings.googleClientId = gClientIdEl.value.trim();
    const gClientSecretEl = document.getElementById('google-client-secret');
    if (gClientSecretEl) state.settings.googleClientSecret = gClientSecretEl.value.trim();
    const gPersColEl = document.getElementById('google-color-personal');
    if (gPersColEl) state.settings.personalColor = gPersColEl.value;
    const gWorkColEl = document.getElementById('google-color-work');
    if (gWorkColEl) state.settings.workColor = gWorkColEl.value;
    applyAccountColors(state);

    const ghTokEl = document.getElementById('github-token');
    if (ghTokEl) state.settings.githubToken = ghTokEl.value.trim();
    const ghOooEl = document.getElementById('settings-github-ooo-hide');
    if (ghOooEl) state.settings.hideGithubOoo = ghOooEl.checked;

    const bbWsEl = document.getElementById('bitbucket-workspace');
    if (bbWsEl) state.settings.bitbucketWorkspace = bbWsEl.value.trim();
    const bbUserEl = document.getElementById('bitbucket-username');
    if (bbUserEl) state.settings.bitbucketUsername = bbUserEl.value.trim();
    const bbTokEl = document.getElementById('bitbucket-token');
    if (bbTokEl) state.settings.bitbucketToken = bbTokEl.value.trim();
    const bbOooEl = document.getElementById('settings-bitbucket-ooo-hide');
    if (bbOooEl) state.settings.hideBitbucketOoo = bbOooEl.checked;

    const glHostEl = document.getElementById('gitlab-host');
    if (glHostEl) state.settings.gitlabHost = glHostEl.value.trim();
    const glTokEl = document.getElementById('gitlab-token');
    if (glTokEl) state.settings.gitlabToken = glTokEl.value.trim();
    const glOooEl = document.getElementById('settings-gitlab-ooo-hide');
    if (glOooEl) state.settings.hideGitlabOoo = glOooEl.checked;

    const jiraHostEl = document.getElementById('jira-host');
    if (jiraHostEl) state.settings.jiraHost = sanitizeJiraHost(jiraHostEl.value);
    const jiraEmailEl = document.getElementById('jira-email');
    if (jiraEmailEl) state.settings.jiraEmail = jiraEmailEl.value.trim();
    const jiraTokEl = document.getElementById('jira-token');
    if (jiraTokEl) state.settings.jiraToken = jiraTokEl.value.trim();
    const jiraOooEl = document.getElementById('settings-jira-ooo-hide');
    if (jiraOooEl) state.settings.hideJiraOoo = jiraOooEl.checked;

    const oooActiveEl = document.getElementById('settings-ooo-active');
    if (oooActiveEl) {
      const oooActive = oooActiveEl.checked;
      const oooUntil = oooActiveEl.getAttribute('data-until') || state.settings.oooUntil;
      state.settings.oooActive = oooActive;
      state.settings.oooUntil = oooActive ? oooUntil : null;
    }

    updateOooBadges();

    const clockTzEl = document.getElementById('settings-world-clock-tz');
    if (clockTzEl) state.settings.worldClockTz = clockTzEl.value;
    const clockLabelEl = document.getElementById('settings-world-clock-label');
    if (clockLabelEl) state.settings.worldClockLabel = clockLabelEl.value.trim();
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

    const showWeatherEl = document.getElementById('settings-show-weather');
    if (showWeatherEl) state.settings.showWeather = showWeatherEl.checked;
    const showClockEl = document.getElementById('settings-show-world-clock');
    if (showClockEl) state.settings.showWorldClock = showClockEl.checked;
    const showCountdownsEl = document.getElementById('settings-show-countdowns');
    if (showCountdownsEl) state.settings.showCountdowns = showCountdownsEl.checked;
    const showTasksEl = document.getElementById('settings-show-tasks');
    if (showTasksEl) state.settings.showTasks = showTasksEl.checked;
    const showShortcutsEl = document.getElementById('settings-show-shortcuts');
    if (showShortcutsEl) state.settings.showShortcuts = showShortcutsEl.checked;
    const showScheduleEl = document.getElementById('settings-show-google-schedule');
    if (showScheduleEl) state.settings.showGoogleSchedule = showScheduleEl.checked;
    const showRecurringEl = document.getElementById('settings-show-google-recurring-events');
    if (showRecurringEl) state.settings.showGoogleRecurringEvents = showRecurringEl.checked;
    const showEmailsEl = document.getElementById('settings-show-google-emails');
    if (showEmailsEl) state.settings.showGoogleEmails = showEmailsEl.checked;
    const gTasksTodayElSave = document.getElementById('settings-show-google-tasks-today');
    if (gTasksTodayElSave) state.settings.showGoogleTasksToday = gTasksTodayElSave.checked;
    const gTasksWeekElSave = document.getElementById('settings-show-google-tasks-week');
    if (gTasksWeekElSave) state.settings.showGoogleTasksWeek = gTasksWeekElSave.checked;
    const gTasksOverdueElSave = document.getElementById('settings-show-google-tasks-overdue');
    if (gTasksOverdueElSave) state.settings.showGoogleTasksOverdue = gTasksOverdueElSave.checked;
    const showGitEl = document.getElementById('settings-show-git');
    if (showGitEl) state.settings.showGit = showGitEl.checked;
    const showJiraEl = document.getElementById('settings-show-jira');
    if (showJiraEl) state.settings.showJira = showJiraEl.checked;

    const showWikiSave = document.getElementById('settings-show-wikipedia');
    if (showWikiSave) state.settings.showWikipedia = showWikiSave.checked;
    const wikiTypeSave = document.getElementById('settings-wikipedia-type');
    if (wikiTypeSave) state.settings.wikipediaType = wikiTypeSave.value || 'news';

    const prevLang = state.lang;
    state.lang = state.settings.lang;

    await saveSettings(state);

    applyTheme(state);
    applyDashboardLayoutOrder(state);
    toggleWeatherInputs();
    toggleClockInputs();
    toggleShortcutsInputs();
    toggleWikipediaInputs();
    toggleScheduleInputs();
    updateWorldClock();
    updateOrganizerVisibility();
    updateUpcomingEventBanner();
    updateOooBadges();
    loadWeather();
    fetchGoogleTasks();
    fetchGoogleCalendar();
    updateTimeAndGreeting();

    if (prevLang !== state.lang) {
      translatePage();
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

  const jiraHostInput = document.getElementById('jira-host');
  if (jiraHostInput) {
    jiraHostInput.addEventListener('blur', () => {
      const clean = sanitizeJiraHost(jiraHostInput.value);
      if (clean && clean !== jiraHostInput.value) {
        jiraHostInput.value = clean;
      }
    });
  }

  // Reset connected state when provider inputs are edited
  const providerInputMap = {
    github: ['github-token'],
    bitbucket: ['bitbucket-workspace', 'bitbucket-username', 'bitbucket-token'],
    gitlab: ['gitlab-host', 'gitlab-token'],
    jira: ['jira-host', 'jira-email', 'jira-token']
  };

  Object.entries(providerInputMap).forEach(([provider, inputIds]) => {
    inputIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => {
          const btn = document.querySelector(`.test-conn-btn[data-provider="${provider}"]`);
          if (btn && !btn.dataset.cooldownInterval) {
            btn.disabled = false;
            btn.textContent = t('btn-connect');
            btn.setAttribute('data-i18n', 'btn-connect');
            btn.style.backgroundColor = '';
            btn.style.color = '';
            btn.style.borderColor = '';
            btn.style.cursor = '';
          }
          if (provider === 'github') state.githubStatus = 'disconnected';
          if (provider === 'bitbucket') state.bitbucketStatus = 'disconnected';
          if (provider === 'gitlab') state.gitlabStatus = 'disconnected';
          if (provider === 'jira') state.jiraStatus = 'disconnected';
          updateGitStatusIndicators(state);
          updateJiraStatusIndicators(state);
        });
      }
    });
  });

  // Google OAuth Personal Login Action
  const loginBtnPersonal = document.getElementById('google-login-btn-personal');
  loginBtnPersonal.addEventListener('click', () => {
    if (!state.settings.googleClientId) {
      const clientIdInput = document.getElementById('google-client-id');
      const msg = t('form-enter-google-id');
      showInputErrorFeedback(clientIdInput, msg);
      return;
    }
    initiateGoogleAuth('personal');
  });

  // Google OAuth Work Login Action
  const loginBtnWork = document.getElementById('google-login-btn-work');
  loginBtnWork.addEventListener('click', () => {
    if (!state.settings.googleClientId) {
      const clientIdInput = document.getElementById('google-client-id');
      const msg = t('form-enter-google-id');
      showInputErrorFeedback(clientIdInput, msg);
      return;
    }
    initiateGoogleAuth('work');
  });

  // Google OAuth Personal Logout Action
  document.getElementById('google-logout-btn-personal').addEventListener('click', () => {
    if (state.googlePersonalToken && typeof google !== 'undefined' && google?.accounts?.oauth2?.revoke) {
      try {
        google.accounts.oauth2.revoke(state.googlePersonalToken, () => {});
      } catch (e) {
        console.warn('Failed to revoke Google personal token', e);
      }
    }
    state.googlePersonalToken = null;
    state.googlePersonalEmail = null;
    if (state.googleErrors) {
      delete state.googleErrors.personal;
    }
    localStorage.removeItem('google_personal_token');
    localStorage.removeItem('google_personal_refresh_token');
    localStorage.removeItem('google_personal_email');
    localStorage.removeItem('google_personal_expiry');
    localStorage.removeItem('google_access_token');
    sessionStorage.removeItem('google_personal_token');
    sessionStorage.removeItem('google_personal_refresh_token');
    sessionStorage.removeItem('google_personal_email');
    sessionStorage.removeItem('google_personal_expiry');
    
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
    if (state.googleWorkToken && typeof google !== 'undefined' && google?.accounts?.oauth2?.revoke) {
      try {
        google.accounts.oauth2.revoke(state.googleWorkToken, () => {});
      } catch (e) {
        console.warn('Failed to revoke Google work token', e);
      }
    }
    state.googleWorkToken = null;
    state.googleWorkEmail = null;
    if (state.googleErrors) {
      delete state.googleErrors.work;
    }
    localStorage.removeItem('google_work_token');
    localStorage.removeItem('google_work_refresh_token');
    localStorage.removeItem('google_work_email');
    localStorage.removeItem('google_work_expiry');
    localStorage.removeItem('google_access_token');
    sessionStorage.removeItem('google_work_token');
    sessionStorage.removeItem('google_work_refresh_token');
    sessionStorage.removeItem('google_work_email');
    sessionStorage.removeItem('google_work_expiry');
    
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
      setActiveFilter(btn.getAttribute('data-filter'));
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

  // Reset Layout Order Button Handler
  const resetLayoutBtn = document.getElementById('btn-reset-layout');
  if (resetLayoutBtn) {
    resetLayoutBtn.addEventListener('click', async () => {
      state.settings.columnOrder = ["col-today", "col-week", "col-tasks"];
      state.settings.todayCardOrder = ["today-events-card", "gmail-card", "gtasks-today"];
      state.settings.weekCardOrder = ["weekly-events-card", "gtasks-week"];
      state.settings.workCardOrder = ["work-section", "countdown-section", "tasks-section"];
      state.settings.workSubCardOrder = ["prs-card", "jira-card"];
      applyDashboardLayoutOrder(state);
      renderLayoutSettings(state);
      await saveSettings(state);
    });
  }
}

export function openSettingsGoogleTab() {
  const toggle = document.getElementById("settings-toggle");
  if (toggle) {
    toggle.click();
    setTimeout(() => {
      const googleBtn = document.querySelector('.tab-btn[data-tab="tab-google"]');
      if (googleBtn) googleBtn.click();
    }, 50);
  }
}
window.openSettingsGoogleTab = openSettingsGoogleTab;

export function openSettingsGitTab() {
  const toggle = document.getElementById("settings-toggle");
  if (toggle) {
    toggle.click();
    setTimeout(() => {
      const gitBtn = document.querySelector('.tab-btn[data-tab="tab-git"]');
      if (gitBtn) gitBtn.click();
    }, 50);
  }
}
window.openSettingsGitTab = openSettingsGitTab;

export function openSettingsJiraTab() {
  const toggle = document.getElementById("settings-toggle");
  if (toggle) {
    toggle.click();
    setTimeout(() => {
      const jiraBtn = document.querySelector('.tab-btn[data-tab="tab-jira"]');
      if (jiraBtn) jiraBtn.click();
    }, 50);
  }
}
window.openSettingsJiraTab = openSettingsJiraTab;

export function openSettingsWikipediaTab() {
  const toggle = document.getElementById("settings-toggle");
  if (toggle) {
    toggle.click();
    setTimeout(() => {
      const generalBtn = document.querySelector('.tab-btn[data-tab="tab-general"]');
      if (generalBtn) generalBtn.click();
      setTimeout(() => {
        const wikiGroup = document.getElementById("wikipedia-settings-group") || document.getElementById("settings-show-wikipedia");
        if (wikiGroup) {
          wikiGroup.scrollIntoView({ behavior: "smooth", block: "center" });
          const selectEl = document.getElementById("settings-wikipedia-type");
          if (selectEl) {
            selectEl.focus();
            selectEl.style.outline = "2px solid var(--accent)";
            setTimeout(() => { selectEl.style.outline = ""; }, 2000);
          }
        }
      }, 120);
    }, 50);
  }
}
window.openSettingsWikipediaTab = openSettingsWikipediaTab;

export const LAYOUT_DEFINITIONS = {
  columns: {
    containerId: "layout-columns-list",
    stateKey: "columnOrder",
    defaultList: ["col-today", "col-week", "col-tasks"],
    items: {
      "col-today": {
        titleKey: "col-today",
        icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`
      },
      "col-week": {
        titleKey: "col-week",
        icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M16 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path><path d="M16 18h.01"></path></svg>`
      },
      "col-tasks": {
        titleKey: "col-tasks",
        icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>`
      }
    }
  },
  todayCards: {
    containerId: "layout-today-cards-list",
    stateKey: "todayCardOrder",
    defaultList: ["today-events-card", "gmail-card", "gtasks-today"],
    items: {
      "today-events-card": {
        titleKey: "calendar-events",
        icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`
      },
      "gmail-card": {
        titleKey: "urgent-emails",
        icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`
      },
      "gtasks-today": {
        titleKey: "layout-card-gtasks-today",
        icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>`
      }
    }
  },
  weekCards: {
    containerId: "layout-week-cards-list",
    stateKey: "weekCardOrder",
    defaultList: ["weekly-events-card", "gtasks-week"],
    items: {
      "weekly-events-card": {
        titleKey: "layout-card-events-week",
        icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M16 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path><path d="M16 18h.01"></path></svg>`
      },
      "gtasks-week": {
        titleKey: "layout-card-gtasks-week",
        icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>`
      }
    }
  },
  workSections: {
    containerId: "layout-work-cards-list",
    stateKey: "workCardOrder",
    defaultList: ["work-section", "countdown-section", "tasks-section"],
    items: {
      "work-section": {
        titleKey: "col-work",
        icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`
      },
      "countdown-section": {
        titleKey: "col-countdowns",
        icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`
      },
      "tasks-section": {
        titleKey: "tasks-card-title",
        icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>`
      }
    }
  },
  workSubCards: {
    containerId: "layout-work-subcards-list",
    stateKey: "workSubCardOrder",
    defaultList: ["prs-card", "jira-card"],
    items: {
      "prs-card": {
        titleKey: "pending-prs",
        icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M13 6h3a2 2 0 0 1 2 2v7"></path><line x1="6" y1="9" x2="6" y2="21"></line></svg>`
      },
      "jira-card": {
        titleKey: "jira-tasks",
        icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><line x1="9" y1="9" x2="9" y2="15"></line><line x1="15" y1="9" x2="15" y2="15"></line></svg>`
      }
    }
  }
};

export function applyDashboardLayoutOrder(st = state) {
  if (!st || !st.settings) return;
  const settings = st.settings;

  // 1. Column Order
  const colOrder = Array.isArray(settings.columnOrder) && settings.columnOrder.length
    ? settings.columnOrder
    : ["col-today", "col-week", "col-tasks"];
  colOrder.forEach((id, idx) => {
    const el = document.getElementById(id);
    if (el) el.style.order = idx;
  });

  // 2. Today Cards Order
  const todayOrder = Array.isArray(settings.todayCardOrder) && settings.todayCardOrder.length
    ? settings.todayCardOrder
    : ["today-events-card", "gmail-card", "gtasks-today"];
  todayOrder.forEach((id, idx) => {
    const el = document.getElementById(id);
    if (el) el.style.order = idx;
  });

  // 3. This Week Cards Order
  const weekOrder = Array.isArray(settings.weekCardOrder) && settings.weekCardOrder.length
    ? settings.weekCardOrder
    : ["weekly-events-card", "gtasks-week"];
  weekOrder.forEach((id, idx) => {
    const el = document.getElementById(id);
    if (el) el.style.order = idx;
  });

  // 4. Work & Tasks Sections Order
  const workOrder = Array.isArray(settings.workCardOrder) && settings.workCardOrder.length
    ? settings.workCardOrder
    : ["work-section", "countdown-section", "tasks-section"];
  workOrder.forEach((id, idx) => {
    const el = document.getElementById(id);
    if (el) el.style.order = idx;
  });

  // 5. Work Sub-cards (PRs & Jira)
  const workSubOrder = Array.isArray(settings.workSubCardOrder) && settings.workSubCardOrder.length
    ? settings.workSubCardOrder
    : ["prs-card", "jira-card"];
  workSubOrder.forEach((id, idx) => {
    const el = document.getElementById(id);
    if (el) el.style.order = idx;
  });
}

export function renderLayoutSettings(st = state) {
  if (!st || !st.settings) return;

  Object.keys(LAYOUT_DEFINITIONS).forEach(groupKey => {
    const group = LAYOUT_DEFINITIONS[groupKey];
    const container = document.getElementById(group.containerId);
    if (!container) return;

    let currentList = st.settings[group.stateKey];
    if (!Array.isArray(currentList) || !currentList.length) {
      currentList = [...group.defaultList];
      st.settings[group.stateKey] = currentList;
    } else {
      // Ensure any new default cards are included
      group.defaultList.forEach(itemId => {
        if (!currentList.includes(itemId)) currentList.push(itemId);
      });
      st.settings[group.stateKey] = currentList;
    }

    container.innerHTML = "";

    // Container dragover & drop handlers
    container.ondragover = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    };

    container.ondrop = async (e) => {
      e.preventDefault();
      const sourceId = e.dataTransfer.getData("text/plain");
      if (!sourceId) return;

      // Drop on container's empty space: move to end
      if (e.target === container) {
        let list = [...st.settings[group.stateKey]];
        const fromIdx = list.indexOf(sourceId);
        if (fromIdx !== -1) {
          list.splice(fromIdx, 1);
          list.push(sourceId);
          st.settings[group.stateKey] = list;
          applyDashboardLayoutOrder(st);
          renderLayoutSettings(st);
          await saveSettings(st);
        }
      }
    };

    currentList.forEach((itemId, index) => {
      const itemMeta = group.items[itemId];
      if (!itemMeta) return;

      const itemEl = document.createElement("div");
      itemEl.className = "layout-order-item";
      itemEl.setAttribute("data-id", itemId);
      itemEl.setAttribute("draggable", "true");

      const title = t(itemMeta.titleKey);

      itemEl.innerHTML = `
        <div class="layout-item-info">
          <span class="layout-item-icon">${itemMeta.icon}</span>
          <span class="layout-item-title">${title}</span>
          <span class="layout-item-badge">#${index + 1}</span>
        </div>
        <span class="layout-drag-handle" title="Arrastrar para ordenar" aria-label="Drag to reorder">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="5" r="1.2" fill="currentColor"></circle>
            <circle cx="15" cy="5" r="1.2" fill="currentColor"></circle>
            <circle cx="9" cy="12" r="1.2" fill="currentColor"></circle>
            <circle cx="15" cy="12" r="1.2" fill="currentColor"></circle>
            <circle cx="9" cy="19" r="1.2" fill="currentColor"></circle>
            <circle cx="15" cy="19" r="1.2" fill="currentColor"></circle>
          </svg>
        </span>
      `;

      // HTML5 Drag & Drop handlers on itemEl
      itemEl.addEventListener("dragstart", (e) => {
        itemEl.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", itemId);
      });

      itemEl.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = "move";
        const rect = itemEl.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        container.querySelectorAll(".layout-order-item").forEach(el => {
          if (el !== itemEl) el.classList.remove("drag-over-top", "drag-over-bottom");
        });
        if (e.clientY < midY) {
          itemEl.classList.add("drag-over-top");
          itemEl.classList.remove("drag-over-bottom");
        } else {
          itemEl.classList.add("drag-over-bottom");
          itemEl.classList.remove("drag-over-top");
        }
      });

      itemEl.addEventListener("dragleave", (e) => {
        if (!itemEl.contains(e.relatedTarget)) {
          itemEl.classList.remove("drag-over-top", "drag-over-bottom");
        }
      });

      itemEl.addEventListener("drop", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isTop = itemEl.classList.contains("drag-over-top");
        itemEl.classList.remove("drag-over-top", "drag-over-bottom");

        const sourceId = e.dataTransfer.getData("text/plain");
        if (!sourceId || sourceId === itemId) return;

        let list = [...st.settings[group.stateKey]];
        const fromIdx = list.indexOf(sourceId);
        if (fromIdx === -1) return;
        list.splice(fromIdx, 1);

        let toIdx = list.indexOf(itemId);
        if (!isTop) toIdx++;
        list.splice(toIdx, 0, sourceId);

        st.settings[group.stateKey] = list;
        applyDashboardLayoutOrder(st);
        renderLayoutSettings(st);
        await saveSettings(st);
      });

      itemEl.addEventListener("dragend", () => {
        container.querySelectorAll(".layout-order-item").forEach(el => {
          el.classList.remove("dragging", "drag-over-top", "drag-over-bottom");
        });
      });

      // Touch Drag & Drop for Mobile
      let touchTargetEl = null;

      itemEl.addEventListener("touchstart", () => {
        itemEl.classList.add("dragging");
      }, { passive: true });

      itemEl.addEventListener("touchmove", (e) => {
        if (!itemEl.classList.contains("dragging")) return;
        const touch = e.touches[0];
        if (!touch) return;
        const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY);
        const target = elementUnderTouch ? elementUnderTouch.closest(".layout-order-item") : null;

        container.querySelectorAll(".layout-order-item").forEach(el => {
          if (el !== target) el.classList.remove("drag-over-top", "drag-over-bottom");
        });

        if (target && target !== itemEl && container.contains(target)) {
          touchTargetEl = target;
          const rect = target.getBoundingClientRect();
          const midY = rect.top + rect.height / 2;
          if (touch.clientY < midY) {
            target.classList.add("drag-over-top");
            target.classList.remove("drag-over-bottom");
          } else {
            target.classList.add("drag-over-bottom");
            target.classList.remove("drag-over-top");
          }
        } else {
          touchTargetEl = null;
        }
      }, { passive: true });

      itemEl.addEventListener("touchend", async () => {
        if (!itemEl.classList.contains("dragging")) return;
        itemEl.classList.remove("dragging");

        if (touchTargetEl && touchTargetEl !== itemEl) {
          const targetId = touchTargetEl.getAttribute("data-id");
          const isTop = touchTargetEl.classList.contains("drag-over-top");
          touchTargetEl.classList.remove("drag-over-top", "drag-over-bottom");

          let list = [...st.settings[group.stateKey]];
          const fromIdx = list.indexOf(itemId);
          if (fromIdx !== -1) {
            list.splice(fromIdx, 1);
            let toIdx = list.indexOf(targetId);
            if (!isTop) toIdx++;
            list.splice(toIdx, 0, itemId);

            st.settings[group.stateKey] = list;
            applyDashboardLayoutOrder(st);
            renderLayoutSettings(st);
            await saveSettings(st);
          }
        }
        touchTargetEl = null;
        container.querySelectorAll(".layout-order-item").forEach(el => {
          el.classList.remove("drag-over-top", "drag-over-bottom", "dragging");
        });
      });

      container.appendChild(itemEl);
    });
  });
}

