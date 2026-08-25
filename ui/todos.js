import { state } from "../utils/state.js";
import { translations, getLocale } from "../locales/index.js";
import { escapeHtml, formatDateShort, getLocalDateString, openModalAccessible, closeModalAccessible } from "../utils/helpers.js";
import { saveTodos } from "../services/storage.js";
import { syncDashboardColumns } from "./shortcuts.js";

export let activeFilter = "pending";

export function setActiveFilter(filter) {
  activeFilter = filter;
}

export const confirmDeleteState = {
  actionType: null,
  todoId: null,
  countdownId: null
};

export function renderTodos() {
  const todoList = document.getElementById("todo-list");
  if (!todoList) return;
  todoList.innerHTML = "";

  const pendingCount = state.todos.filter(todo => !todo.completed).length;
  const pendingBtn = document.querySelector('.filter-btn[data-filter="pending"]');
  if (pendingBtn) {
    const baseText = translations[state.lang]["filter-pending"] || "Pending";
    if (pendingCount > 0) {
      pendingBtn.innerHTML = `${baseText} <span class="filter-badge">${pendingCount}</span>`;
    } else {
      pendingBtn.textContent = baseText;
    }
  }
  
  const filteredTodos = state.todos.filter(todo => {
    if (activeFilter === "pending") return !todo.completed;
    if (activeFilter === "completed") {
      if (!todo.completed) return false;
      if (!todo.completedAt) return true;
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      return new Date(todo.completedAt).getTime() >= sevenDaysAgo;
    }
    return true;
  });

  filteredTodos.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
    const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
    if (dateA !== dateB) return dateB - dateA;
    const priorityWeights = { high: 3, medium: 2, low: 1 };
    if (priorityWeights[b.priority] !== priorityWeights[a.priority]) {
      return priorityWeights[b.priority] - priorityWeights[a.priority];
    }
    return Number(a.id) - Number(b.id);
  });

  if (filteredTodos.length === 0) {
    const emptyMsg = document.createElement("p");
    emptyMsg.className = "empty-msg";
    emptyMsg.textContent = state.lang === "es" ? "No hay tareas." : "No tasks.";
    todoList.appendChild(emptyMsg);
    renderFocusCard();
    syncDashboardColumns();
    updateTodoCountBadges();
    return;
  }

  filteredTodos.forEach(todo => {
    const li = document.createElement("li");
    li.className = `todo-item ${todo.completed ? "completed" : ""} ${todo.isFocused ? "focused" : ""}`;
    
    let dateBadgeHTML = "";
    if (todo.dueDate) {
      const todayStr = getLocalDateString(new Date());
      const due = new Date(todo.dueDate + "T00:00:00");
      const today = new Date(todayStr + "T00:00:00");
      const timeDiff = due.getTime() - today.getTime();
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      let badgeClass = "";
      let badgeText = "";
      const dict = translations[state.lang] || translations.en;

      if (todo.completed) {
        badgeText = formatDateShort(todo.dueDate, state.lang);
      } else if (diffDays < 0) {
        badgeClass = "overdue";
        badgeText = `${dict["task-overdue"]} (${formatDateShort(todo.dueDate, state.lang)})`;
      } else if (diffDays === 0) {
        badgeText = dict["task-today"];
      } else if (diffDays === 1) {
        badgeText = dict["task-tomorrow"];
      } else {
        badgeText = formatDateShort(todo.dueDate, state.lang);
      }

      dateBadgeHTML = `
        <span class="todo-date-badge ${badgeClass}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          ${badgeText}
        </span>`;
    }

    let completedBadgeHTML = "";
    if (todo.completed && todo.completedAt) {
      const compDate = new Date(todo.completedAt);
      const formattedCompDate = formatDateShort(getLocalDateString(compDate), state.lang);
      completedBadgeHTML = `
        <span class="todo-completed-badge" title="${compDate.toLocaleString()}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          ${state.lang === "es" ? "Completada el" : "Completed on"} ${formattedCompDate}
        </span>`;
    }

    const escapedText = escapeHtml(todo.text);
    const checkLabel = (state.lang === "es" ? "Marcar tarea como completada: " : "Mark task as complete: ") + todo.text;
    const focusLabel = (state.lang === "es" ? "Trabajar en esta tarea: " : "Focus on this task: ") + todo.text;
    const editLabel = (state.lang === "es" ? "Editar tarea: " : "Edit task: ") + todo.text;
    const deleteLabel = (state.lang === "es" ? "Eliminar tarea: " : "Delete task: ") + todo.text;

    li.innerHTML = `
      <div class="todo-item-left">
        <input type="checkbox" class="todo-checkbox" ${todo.completed ? "checked" : ""} data-id="${todo.id}" aria-label="${escapeHtml(checkLabel)}">
        <div class="todo-item-details">
          <span class="todo-text">${escapedText}</span>
          <div class="todo-meta">
            <span class="todo-priority-badge priority-${todo.priority}">${translations[state.lang]["priority-" + todo.priority]}</span>
            ${dateBadgeHTML}
          </div>
          ${completedBadgeHTML}
        </div>
      </div>
      <div class="todo-actions">
        ${!todo.completed ? `
        <button class="btn-item-action focus-btn ${todo.isFocused ? "active" : ""}" data-id="${todo.id}" title="${state.lang === "es" ? "Trabajando en esta tarea" : "Focus on this task"}" aria-label="${escapeHtml(focusLabel)}">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
        ` : ""}
        <button class="btn-item-action edit-btn" data-id="${todo.id}" title="${state.lang === "es" ? "Editar" : "Edit"}" aria-label="${escapeHtml(editLabel)}">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
        </button>
        <button class="btn-item-action delete-btn" data-id="${todo.id}" title="${state.lang === "es" ? "Eliminar" : "Delete"}" aria-label="${escapeHtml(deleteLabel)}">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      </div>
    `;

    li.querySelector(".todo-checkbox").addEventListener("change", () => toggleTodo(todo.id));
    if (!todo.completed) {
      li.querySelector(".focus-btn").addEventListener("click", () => toggleFocusTodo(todo.id));
    }
    li.querySelector(".edit-btn").addEventListener("click", () => openEditModal(todo));
    li.querySelector(".delete-btn").addEventListener("click", () => deleteTodo(todo.id));

    todoList.appendChild(li);
  });

  renderFocusCard();
  syncDashboardColumns();
  updateTodoCountBadges();
}

export function updateTodoCountBadges() {
  const pendingCount = state.todos.filter(t => !t.completed).length;
  const countBadge = document.getElementById("tasks-count-badge");
  if (countBadge) {
    if (pendingCount > 0) {
      countBadge.textContent = pendingCount;
      countBadge.classList.remove("hidden");
    } else {
      countBadge.classList.add("hidden");
    }
  }
}

export function renderFocusCard() {
  const focusedTodo = state.todos.find(todo => todo.isFocused && !todo.completed);
  const focusCard = document.getElementById("todo-focus-card");
  const focusContainer = document.getElementById("focus-card-item-container");
  if (focusCard && focusContainer) {
    if (focusedTodo) {
      focusContainer.innerHTML = "";
      
      let dateBadgeHTML = "";
      if (focusedTodo.dueDate) {
        const todayStr = getLocalDateString(new Date());
        const due = new Date(focusedTodo.dueDate + "T00:00:00");
        const today = new Date(todayStr + "T00:00:00");
        const timeDiff = due.getTime() - today.getTime();
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        let badgeClass = "";
        let badgeText = "";
        const dict = translations[state.lang] || translations.en;

        if (diffDays < 0) {
          badgeClass = "overdue";
          badgeText = `${dict["task-overdue"]} (${formatDateShort(focusedTodo.dueDate, state.lang)})`;
        } else if (diffDays === 0) {
          badgeText = dict["task-today"];
        } else if (diffDays === 1) {
          badgeText = dict["task-tomorrow"];
        } else {
          badgeText = formatDateShort(focusedTodo.dueDate, state.lang);
        }

        dateBadgeHTML = `
          <span class="todo-date-badge ${badgeClass}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            ${badgeText}
          </span>`;
      }

      focusContainer.innerHTML = `
        <div class="focus-card-left">
          <input type="checkbox" class="todo-checkbox" data-id="${focusedTodo.id}">
          <div class="todo-item-details">
            <span class="todo-text">${escapeHtml(focusedTodo.text)}</span>
            <div class="todo-meta">
              <span class="todo-priority-badge priority-${focusedTodo.priority}">${translations[state.lang]["priority-" + focusedTodo.priority]}</span>
              ${dateBadgeHTML}
            </div>
          </div>
        </div>
        <div class="todo-actions">
          <button class="btn-item-action focus-btn active" data-id="${focusedTodo.id}" title="${state.lang === "es" ? "Dejar de trabajar en esta tarea" : "Stop focusing"}">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
        </div>
      `;

      focusContainer.querySelector(".todo-checkbox").addEventListener("change", () => toggleTodo(focusedTodo.id));
      focusContainer.querySelector(".focus-btn").addEventListener("click", () => toggleFocusTodo(focusedTodo.id));
      focusCard.classList.remove("hidden");
    } else {
      focusCard.classList.add("hidden");
      focusContainer.innerHTML = "";
    }
  }
}

export async function addTodo(text, dueDate, priority) {
  if (!text) return;
  const newTodo = {
    id: Date.now().toString(),
    text,
    completed: false,
    dueDate: dueDate || null,
    priority: priority || "medium",
    isFocused: false
  };
  state.todos.unshift(newTodo);
  await saveTodos(state);
  renderTodos();
}

export async function toggleTodo(id) {
  const todo = state.todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    todo.completedAt = todo.completed ? new Date().toISOString() : null;
    if (todo.completed) todo.isFocused = false;
    await saveTodos(state);
    renderTodos();
  }
}

export async function toggleFocusTodo(id) {
  const todo = state.todos.find(t => t.id === id);
  if (todo) {
    const nextState = !todo.isFocused;
    state.todos.forEach(t => { t.isFocused = false; });
    todo.isFocused = nextState;
    await saveTodos(state);
    renderTodos();
  }
}

export function deleteTodo(id) {
  confirmDeleteState.actionType = "delete-single";
  confirmDeleteState.todoId = id;
  const todo = state.todos.find(t => t.id === id);
  if (!todo) return;

  const modal = document.getElementById("confirm-delete-modal");
  if (modal) {
    const dict = translations[state.lang];
    modal.querySelector('[data-i18n="confirm-delete-title"]').textContent = dict["confirm-delete-title"];
    const descEl = modal.querySelector('[data-i18n="confirm-delete-desc"]');
    if (descEl) {
      descEl.innerHTML = state.lang === "es"
        ? `¿Estás seguro de que quieres eliminar la tarea: <strong>"${escapeHtml(todo.text)}"</strong>?`
        : `Are you sure you want to delete the task: <strong>"${escapeHtml(todo.text)}"</strong>?`;
    }
    modal.querySelector('[data-i18n="cancel-btn"]').textContent = dict["cancel-btn"];
    modal.querySelector('[data-i18n="delete-btn"]').textContent = dict["delete-btn"];
    openModalAccessible(modal, document.getElementById("btn-cancel-delete"));
  }
}

export function showClearCompletedConfirmation() {
  confirmDeleteState.actionType = "clear-completed";
  const modal = document.getElementById("confirm-delete-modal");
  if (modal) {
    const dict = translations[state.lang];
    modal.querySelector('[data-i18n="confirm-delete-title"]').textContent = state.lang === "es" ? "Limpiar Tareas" : "Clear Tasks";
    const descEl = modal.querySelector('[data-i18n="confirm-delete-desc"]');
    if (descEl) {
      descEl.innerHTML = state.lang === "es"
        ? "¿Estás seguro de que quieres eliminar todas las tareas completadas?"
        : "Are you sure you want to delete all completed tasks?";
    }
    modal.querySelector('[data-i18n="cancel-btn"]').textContent = dict["cancel-btn"];
    modal.querySelector('[data-i18n="delete-btn"]').textContent = state.lang === "es" ? "Eliminar todas" : "Delete all";
    openModalAccessible(modal, document.getElementById("btn-cancel-delete"));
  }
}

export async function updateTodo(id, newText, newDueDate, newPriority) {
  const todo = state.todos.find(t => t.id === id);
  if (todo) {
    todo.text = newText;
    todo.dueDate = newDueDate || null;
    todo.priority = newPriority || "medium";
    await saveTodos(state);
    renderTodos();
  }
}

export function openEditModal(todo) {
  const modal = document.getElementById("edit-modal");
  if (!modal) return;
  document.getElementById("edit-task-id").value = todo.id;
  document.getElementById("edit-todo-input").value = todo.text;
  document.getElementById("edit-todo-date").value = todo.dueDate || "";
  document.getElementById("edit-todo-priority").value = todo.priority || "medium";
  openModalAccessible(modal, document.getElementById("edit-todo-input"));
}
