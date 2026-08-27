import { state as defaultState } from "../utils/state.js";

const DB_NAME = "dashboard-db";
const STORE_NAME = "file-handles";

export function getDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

export async function saveFileHandle(handle) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(handle, "sync-file");
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getFileHandle() {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get("sync-file");
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = () => reject(request.error);
  });
}

export async function clearFileHandle() {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete("sync-file");
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function verifyPermission(handle, readWrite) {
  const options = {};
  if (readWrite) {
    options.mode = "readwrite";
  }
  try {
    if ((await handle.queryPermission(options)) === "granted") {
      return true;
    }
    if ((await handle.requestPermission(options)) === "granted") {
      return true;
    }
  } catch (e) {
    console.error("Error requesting file permission", e);
  }
  return false;
}

export const SENSITIVE_SETTING_KEYS = [
  "githubToken",
  "bitbucketToken",
  "gitlabToken",
  "jiraToken",
  "googleClientId",
  "googleClientSecret"
];

export function sanitizeSettingsForSync(settings) {
  const sanitized = { ...settings };
  for (const key of SENSITIVE_SETTING_KEYS) {
    delete sanitized[key];
  }
  return sanitized;
}

export function mergeSettingsWithLocalSecrets(fileSettings, currentSettings) {
  const merged = { ...currentSettings, ...fileSettings, storageMode: "file" };
  for (const key of SENSITIVE_SETTING_KEYS) {
    if (currentSettings[key] && !fileSettings[key]) {
      merged[key] = currentSettings[key];
    }
  }
  return merged;
}

export let fileHandle = null;
export function setFileHandle(handle) {
  fileHandle = handle;
}

export async function writeDataToFile(state = defaultState) {
  const st = state || defaultState;
  if (st.settings.storageMode !== "file" || !fileHandle) return;
  try {
    const hasPermission = await verifyPermission(fileHandle, true);
    if (!hasPermission) return;
    const writable = await fileHandle.createWritable();
    const dataToSave = {
      todos: st.todos,
      settings: sanitizeSettingsForSync(st.settings)
    };
    await writable.write(JSON.stringify(dataToSave, null, 2));
    await writable.close();
  } catch (err) {
    console.error("Error writing file:", err);
  }
}

export async function readDataFromFile() {
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

export async function saveSettings(state = defaultState) {
  const st = state || defaultState;
  localStorage.setItem("dashboard_settings", JSON.stringify(st.settings));
  localStorage.setItem("theme", st.theme || st.settings?.theme || "system");
  await writeDataToFile(st);
}

export async function saveTodos(state = defaultState) {
  const st = state || defaultState;
  localStorage.setItem("todos", JSON.stringify(st.todos));
  await writeDataToFile(st);
}

export function exportStateToFile(state = defaultState) {
  const st = state || defaultState;
  const dataToSave = {
    todos: st.todos,
    settings: sanitizeSettingsForSync(st.settings)
  };
  const blob = new Blob([JSON.stringify(dataToSave, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `dashboard-data-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function loadState(state = defaultState) {
  const st = state || defaultState;
  const storedSettings = localStorage.getItem("dashboard_settings");
  if (storedSettings) {
    try {
      st.settings = { ...st.settings, ...JSON.parse(storedSettings) };
    } catch (e) {
      console.warn("Failed to parse settings", e);
    }
  }
  function sanitizeOrderList(currentList, defaultList) {
    if (!Array.isArray(currentList) || !currentList.length) return [...defaultList];
    const validItems = currentList.filter(item => defaultList.includes(item));
    defaultList.forEach(item => {
      if (!validItems.includes(item)) validItems.push(item);
    });
    return validItems;
  }

  st.settings.customEvents = st.settings.customEvents || [];
  st.settings.primaryColor = st.settings.primaryColor || "blue";
  st.settings.columnOrder = sanitizeOrderList(st.settings.columnOrder, ["col-today", "col-week", "col-tasks"]);
  st.settings.todayCardOrder = sanitizeOrderList(st.settings.todayCardOrder, ["today-events-card", "gmail-card", "gtasks-today"]);
  st.settings.weekCardOrder = sanitizeOrderList(st.settings.weekCardOrder, ["weekly-events-card", "gtasks-week"]);
  st.settings.workCardOrder = sanitizeOrderList(st.settings.workCardOrder, ["work-section", "countdown-section", "tasks-section"]);
  st.settings.workSubCardOrder = sanitizeOrderList(st.settings.workSubCardOrder, ["prs-card", "jira-card"]);
  st.lang = st.settings.lang || "en";
  st.theme = st.settings.theme || localStorage.getItem("theme") || "system";

  // Check OOO expiration
  checkOooExpiration(st);

  const storedTodos = localStorage.getItem("todos");
  if (storedTodos) {
    try {
      st.todos = JSON.parse(storedTodos);
      cleanupOldCompletedTodos(st);
    } catch (e) {
      st.todos = [];
    }
  }
}

export async function cleanupOldCompletedTodos(state = defaultState) {
  const st = state || defaultState;
  if (!st.todos || !Array.isArray(st.todos)) return;
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  const originalLength = st.todos.length;
  st.todos = st.todos.filter(todo => {
    if (!todo.completed) return true;
    if (!todo.completedAt) return true;
    return new Date(todo.completedAt).getTime() >= thirtyDaysAgo;
  });
  if (st.todos.length !== originalLength) {
    await saveTodos(st);
  }
}

export function checkOooExpiration(state = defaultState) {
  const st = state || defaultState;
  if (st.settings?.oooActive && st.settings?.oooUntil) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    if (todayStr >= st.settings.oooUntil) {
      st.settings.oooActive = false;
      st.settings.oooUntil = null;
      st.settings.oooReturnDate = "";
      st.settings.oooReturnTime = "09:00";
      saveSettings(st);
      return true;
    }
  }
  return false;
}
