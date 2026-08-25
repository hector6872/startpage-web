// -------------------------------------------------------------
// INDEXEDDB FILE HANDLE PERSISTENCE & FILE SYSTEM SYNC
// -------------------------------------------------------------
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
  // Preserve local secrets if the file does not contain them
  for (const key of SENSITIVE_SETTING_KEYS) {
    if (currentSettings[key] && !fileSettings[key]) {
      merged[key] = currentSettings[key];
    }
  }
  return merged;
}
