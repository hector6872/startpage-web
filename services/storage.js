import { translations } from "../locales/index.js";
import { applyPrimaryColor, applyTheme } from "../ui/theme.js";

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
  "jiraToken"
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

export async function writeDataToFile(state) {
  if (state.settings.storageMode !== "file" || !fileHandle) return;
  try {
    const hasPermission = await verifyPermission(fileHandle, true);
    if (!hasPermission) return;
    const writable = await fileHandle.createWritable();
    const dataToSave = {
      todos: state.todos,
      settings: sanitizeSettingsForSync(state.settings)
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

export async function saveSettings(state) {
  localStorage.setItem("dashboard_settings", JSON.stringify(state.settings));
  localStorage.setItem("theme", state.theme);
  await writeDataToFile(state);
}

export async function saveTodos(state) {
  localStorage.setItem("todos", JSON.stringify(state.todos));
  await writeDataToFile(state);
}

export function exportStateToFile(state) {
  const dataToSave = {
    todos: state.todos,
    settings: sanitizeSettingsForSync(state.settings)
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

export async function loadState(state) {
  const storedSettings = localStorage.getItem("dashboard_settings");
  if (storedSettings) {
    state.settings = { ...state.settings, ...JSON.parse(storedSettings) };
  }
  state.settings.customEvents = state.settings.customEvents || [];
  state.settings.primaryColor = state.settings.primaryColor || "blue";
  state.lang = state.settings.lang || "en";
  state.theme = state.settings.theme || localStorage.getItem("theme") || "system";

  // Check OOO expiration
  if (state.settings.oooActive && state.settings.oooUntil) {
    const returnTime = new Date(state.settings.oooUntil).getTime();
    if (Date.now() >= returnTime) {
      state.settings.oooActive = false;
      state.settings.oooUntil = null;
      state.settings.oooReturnDate = "";
      state.settings.oooReturnTime = "09:00";
      localStorage.setItem("dashboard_settings", JSON.stringify(state.settings));
    }
  }

  const storedTodos = localStorage.getItem("todos");
  if (storedTodos) {
    try {
      state.todos = JSON.parse(storedTodos);
      cleanupOldCompletedTodos(state);
    } catch (e) {
      state.todos = [];
    }
  }
}

export async function cleanupOldCompletedTodos(state) {
  if (!state.todos || !Array.isArray(state.todos)) return;
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  const originalLength = state.todos.length;
  state.todos = state.todos.filter(todo => {
    if (!todo.completed) return true;
    if (!todo.completedAt) return true;
    return new Date(todo.completedAt).getTime() >= thirtyDaysAgo;
  });
  if (state.todos.length !== originalLength) {
    await saveTodos(state);
  }
}
