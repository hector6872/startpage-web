// Internationalization (i18n) Dictionary
const translations = {
  en: {
    "col-today": "Today",
    "col-week": "This Week",
    "col-tasks": "Workspace",
    "tasks-card-title": "My Tasks",
    "calendar-events": "Events & Meetings",
    "urgent-emails": "Urgent Emails (Gmail)",
    "pending-prs": "Pull Requests",
    "weekly-schedule": "Weekly Schedule",
    "jira-tasks": "Jira Assigned Tasks",
    "todo-placeholder": "Add a new task...",
    "countdown-placeholder": "Countdown title...",
    "col-countdowns": "My Countdowns",
    "countdown-empty": "No countdowns yet.",
    "priority-low": "Low",
    "priority-medium": "Medium",
    "priority-high": "High",
    "add-btn": "Add",
    "filter-all": "All",
    "filter-pending": "Pending",
    "filter-completed": "Completed",
    "settings-title": "Dashboard Settings",
    "tab-general": "General",
    "tab-google": "Google APIs",
    "tab-git": "Git Integrations",
    "tab-jira": "Jira Cloud",
    "tab-storage": "Storage",
    "label-language": "Language",
    "label-primary-color": "Primary Color",
    "color-blue": "Blue",
    "color-indigo": "Indigo",
    "color-purple": "Purple",
    "color-pink": "Pink",
    "color-red": "Red",
    "color-orange": "Orange",
    "color-green": "Green",
    "color-teal": "Teal",
    "color-slate": "Slate Gray",
    "color-black": "Black / Onyx",
    "label-theme": "Default Theme",
    "theme-system": "System Default",
    "theme-light": "Light",
    "theme-dark": "Dark",
    "label-world-clock-tz": "World Clock Timezone",
    "label-world-clock-label": "World Clock Label",
    "world-clock-sub": "World Time",
    "label-show-weather": "Show Weather Widget",
    "label-show-world-clock": "Show World Clock Widget",
    "label-show-countdowns": "Show Countdowns",
    "label-show-tasks": "Show Tasks",
    "label-city": "Weather City",
    "label-weather-url": "Weather Web URL (Optional)",
    "weather-url-placeholder": "e.g. https://weather.com or leave empty for Google Weather",
    "label-world-clock-url": "World Clock Web URL (Optional)",
    "clock-url-placeholder": "e.g. https://time.is or leave empty for Google Time",
    "label-finance-url": "Finance Web URL",
    "finance-url-placeholder": "e.g. https://www.google.com/finance/beta/quote/.INX:INDEXSP?window=1M",
    "label-timer-url": "Timer Web URL",
    "timer-url-placeholder": "e.g. https://www.google.com/search?q=countdown+timer",
    "label-stopwatch-url": "Stopwatch Web URL",
    "stopwatch-url-placeholder": "e.g. https://www.google.com/search?q=stopwatch",
    "notes-btn-title": "Notes",
    "notes-modal-title": "Quick Notes",
    "notes-placeholder": "Write your notes here...",
    "clear-notes-btn": "Clear Notes",
    "close-btn": "Close",
    "finance-btn-title": "Finance",
    "timer-btn-title": "Timer",
    "stopwatch-btn-title": "Stopwatch",
    "tab-shortcuts": "Shortcuts",
    "shortcuts-card-title": "Quick Action Shortcuts",
    "city-desc": "Leave empty for automatic geolocation.",
    "google-desc": "Requires a Google Cloud Console project with OAuth credentials. Remember to add your local origin (e.g. http://localhost:5173) under Authorized JavaScript Origins.",
    "label-client-id": "Google OAuth Client ID",
    "google-status": "Authentication:",
    "disconnected": "Disconnected",
    "connected": "Connected",
    "google-login": "Log In with Google",
    "google-logout": "Log Out",
    "github-settings": "GitHub Configuration",
    "label-token": "Personal Access Token (PAT)",
    "label-username": "GitHub Username",
    "bitbucket-settings": "Bitbucket Configuration",
    "label-workspace": "Workspace ID",
    "label-bb-username": "Bitbucket Username",
    "label-bb-token": "App Password / Token",
    "jira-cors-warning": "Note: Jira API requires CORS. Ensure you use a browser extension to bypass CORS (e.g. 'Allow CORS' extension) when running locally.",
    "label-jira-host": "Jira Host URL",
    "label-jira-email": "Atlassian Account Email",
    "label-jira-token": "Jira API Token",
    "save-settings": "Save Settings",
    "edit-task-title": "Edit Task",
    "add-countdown-title": "Add New Countdown",
    "add-task-title-modal": "Add New Task",
    "label-task-text": "Task Name",
    "label-due-date": "Due Date",
    "label-priority": "Priority",
    "cancel-btn": "Cancel",
    "delete-btn": "Delete",
    "clear-completed-btn": "Clear All",
    "save-btn": "Save Changes",
    "no-events": "No events scheduled.",
    "no-emails": "No unread emails.",
    "no-prs": "No pending PRs.",
    "no-weekly-events": "No events this week.",
    "no-jira-tasks": "No Jira tasks assigned.",
    "task-overdue": "Overdue",
    "task-today": "Today",
    "task-tomorrow": "Tomorrow",
    "greeting-morning": "Good morning",
    "greeting-afternoon": "Good afternoon",
    "greeting-evening": "Good evening",
    "weather-loading": "Loading weather...",
    "weather-error": "Weather unavailable",
    "weather-unconfigured": "Location not set.",
    "weather-configure-btn": "Configure",
    "timezone-unconfigured": "No timezone selected",
    "world-clock-unconfigured": "Timezone not set.",
    "world-clock-same-time": "Same time",
    "world-clock-title": "World Clock",
    "focus-card-title": "Current Focus",
    "confirm-delete-title": "Delete Task",
    "confirm-delete-desc": "Are you sure you want to delete this task?",
    "completed-tasks-note": "Only tasks completed within the last 7 days are displayed.",
    "quote-loading": "Loading quote...",
    "status-unconfigured": "Unconfigured",
    "storage-desc": "Configure where your data is stored. You can select a JSON file in your Google Drive or local sync folder to share tasks across devices.",
    "label-storage-mode": "Storage Mode",
    "storage-local": "Browser Local Storage only",
    "storage-file": "Local JSON File Sync (Auto-Sync)",
    "label-sync-file": "Sync File",
    "no-file-selected": "No file selected.",
    "btn-select-file": "Select File...",
    "label-backup": "Manual Backup (Import/Export)",
    "btn-export": "Export JSON",
    "btn-import": "Import JSON",
    "file-unsupported": "File System Access API is not supported in this browser. Using manual backup instead.",
    "file-read-error": "Failed to read the selected file.",
    "file-write-error": "Failed to write data to file.",
    "weather-rain": "Rain expected: {prob}%",
    "weather-snow": "Snow expected: {prob}%",
    "weather-storm": "Storms expected: {prob}%",
    "weather-no-precip": "No precip. next 24h",
    "weather-feels-like": "Feels like: {temp}°C"
  },
  es: {
    "col-today": "Hoy",
    "col-week": "Esta Semana",
    "col-tasks": "Espacio de Trabajo",
    "tasks-card-title": "Mis Tareas",
    "calendar-events": "Eventos y Reuniones",
    "urgent-emails": "Correos Urgentes (Gmail)",
    "pending-prs": "Pull Requests",
    "weekly-schedule": "Agenda Semanal",
    "jira-tasks": "Tareas de Jira",
    "todo-placeholder": "Añadir nueva tarea...",
    "countdown-placeholder": "Título del countdown...",
    "col-countdowns": "Mis Countdowns",
    "countdown-empty": "Sin countdowns todavía.",
    "priority-low": "Baja",
    "priority-medium": "Media",
    "priority-high": "Alta",
    "add-btn": "Añadir",
    "filter-all": "Todas",
    "filter-pending": "Pendientes",
    "filter-completed": "Completadas",
    "settings-title": "Configuración del Panel",
    "tab-general": "General",
    "tab-google": "APIs de Google",
    "tab-git": "Integración Git",
    "tab-jira": "Jira Cloud",
    "tab-storage": "Almacenamiento",
    "label-language": "Idioma",
    "label-primary-color": "Color Primario",
    "color-blue": "Azul",
    "color-indigo": "Índigo",
    "color-purple": "Púrpura",
    "color-pink": "Rosa",
    "color-red": "Rojo",
    "color-orange": "Naranja",
    "color-green": "Verde",
    "color-teal": "Turquesa",
    "color-slate": "Gris Pizarra",
    "color-black": "Negro / Ónice",
    "label-theme": "Tema Predeterminado",
    "theme-system": "Predeterminado del Sistema",
    "theme-light": "Claro",
    "theme-dark": "Oscuro",
    "label-world-clock-tz": "Zona Horaria del Reloj Mundial",
    "label-world-clock-label": "Etiqueta del Reloj Mundial",
    "world-clock-sub": "Hora Mundial",
    "label-show-weather": "Mostrar Clima",
    "label-show-world-clock": "Mostrar Reloj Mundial",
    "label-show-countdowns": "Mostrar Countdowns",
    "label-show-tasks": "Mostrar Tareas",
    "label-city": "Ciudad para el clima",
    "label-weather-url": "URL de la web del clima (Opcional)",
    "weather-url-placeholder": "ej. https://eltiempo.es o dejar vacío para Google Clima",
    "label-world-clock-url": "URL de la web del reloj (Opcional)",
    "clock-url-placeholder": "ej. https://time.is o dejar vacío para Google Hora",
    "label-finance-url": "URL de Finanzas / Bolsa",
    "finance-url-placeholder": "ej. https://www.google.com/finance/beta/quote/.INX:INDEXSP?window=1M",
    "label-timer-url": "URL del Temporizador",
    "timer-url-placeholder": "ej. https://www.google.com/search?q=countdown+timer",
    "label-stopwatch-url": "URL del Cronómetro",
    "stopwatch-url-placeholder": "ej. https://www.google.com/search?q=stopwatch",
    "notes-btn-title": "Notas",
    "notes-modal-title": "Notas Rápidas",
    "notes-placeholder": "Escribe tus notas aquí...",
    "clear-notes-btn": "Vaciar",
    "close-btn": "Cerrar",
    "finance-btn-title": "Finanzas",
    "timer-btn-title": "Temporizador",
    "stopwatch-btn-title": "Cronómetro",
    "tab-shortcuts": "Atajos",
    "shortcuts-card-title": "Atajos de Acción Rápida",
    "city-desc": "Déjalo vacío para usar la geolocalización automática del navegador.",
    "google-desc": "Requiere un proyecto en Google Cloud Console con credenciales OAuth. Recuerda añadir tu origen local (ej. http://localhost:5173) en los orígenes de JavaScript autorizados.",
    "label-client-id": "Cliente ID de Google OAuth",
    "google-status": "Autenticación:",
    "disconnected": "Desconectado",
    "connected": "Conectado",
    "google-login": "Iniciar Sesión con Google",
    "google-logout": "Cerrar Sesión",
    "github-settings": "Configuración de GitHub",
    "label-token": "Token de Acceso Personal (PAT)",
    "label-username": "Usuario de GitHub",
    "bitbucket-settings": "Configuración de Bitbucket",
    "label-workspace": "ID del Espacio de Trabajo",
    "label-bb-username": "Usuario de Bitbucket",
    "label-bb-token": "Contraseña de App / Token",
    "jira-cors-warning": "Nota: La API de Jira requiere CORS. Asegúrate de usar una extensión del navegador para omitir CORS (como 'Allow CORS') al ejecutarlo localmente.",
    "label-jira-host": "URL del Servidor Jira",
    "label-jira-email": "Correo de Atlassian",
    "label-jira-token": "Token de API de Jira",
    "save-settings": "Guardar Configuración",
    "edit-task-title": "Editar Tarea",
    "add-countdown-title": "Añadir nuevo countdown",
    "add-task-title-modal": "Añadir nueva tarea",
    "label-task-text": "Nombre de la Tarea",
    "label-due-date": "Fecha de Vencimiento",
    "label-priority": "Prioridad",
    "cancel-btn": "Cancelar",
    "delete-btn": "Eliminar",
    "clear-completed-btn": "Limpiar todas",
    "save-btn": "Guardar Cambios",
    "no-events": "No hay eventos programados.",
    "no-emails": "No hay correos sin leer.",
    "no-prs": "No hay PRs pendientes.",
    "no-weekly-events": "No hay eventos esta semana.",
    "no-jira-tasks": "No hay tareas de Jira asignadas.",
    "task-overdue": "Vencida",
    "task-today": "Hoy",
    "task-tomorrow": "Mañana",
    "greeting-morning": "Buenos días",
    "greeting-afternoon": "Buenas tardes",
    "greeting-evening": "Buenas noches",
    "weather-loading": "Cargando clima...",
    "weather-error": "Clima no disponible",
    "weather-unconfigured": "Ubicación sin configurar.",
    "weather-configure-btn": "Configurar",
    "timezone-unconfigured": "Sin zona horaria",
    "world-clock-unconfigured": "Zona horaria sin configurar.",
    "world-clock-same-time": "Misma hora",
    "world-clock-title": "Reloj Mundial",
    "focus-card-title": "Tarea en Enfoque",
    "confirm-delete-title": "Confirmar Eliminación",
    "confirm-delete-desc": "¿Estás seguro de que quieres eliminar esta tarea?",
    "completed-tasks-note": "Solo se mostrarán las completadas en los últimos 7 días.",
    "quote-loading": "Cargando frase...",
    "status-unconfigured": "Sin configurar",
    "storage-desc": "Configura dónde se guardan tus datos. Puedes seleccionar un archivo JSON en tu Google Drive o carpeta local sincronizada para compartir tareas entre dispositivos.",
    "label-storage-mode": "Modo de Almacenamiento",
    "storage-local": "Solo memoria local del navegador (LocalStorage)",
    "storage-file": "Sincronización con archivo JSON (Google Drive / Dropbox)",
    "label-sync-file": "Archivo de Sincronización",
    "no-file-selected": "Ningún archivo seleccionado.",
    "btn-select-file": "Seleccionar archivo...",
    "label-backup": "Copia de Seguridad Manual (Importar/Exportar)",
    "btn-export": "Exportar JSON",
    "btn-import": "Importar JSON",
    "file-unsupported": "La API de Acceso a Archivos no está soportada en este navegador. Utiliza la copia manual en su lugar.",
    "file-read-error": "Error al leer el archivo seleccionado.",
    "file-write-error": "Error al escribir datos en el archivo.",
    "weather-rain": "Lluvia esperada: {prob}%",
    "weather-snow": "Nieve esperada: {prob}%",
    "weather-storm": "Tormentas esperadas: {prob}%",
    "weather-no-precip": "Sin precip. próximas 24h",
    "weather-feels-like": "Sensación: {temp}°C"
  }
};

// Curated Quotes Database (High quality fallback & offline support)
const quotesDb = {
  en: [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Simplify, then add lightness.", author: "Colin Chapman" },
    { text: "Focus is a matter of deciding what things you're not going to do.", author: "John Carmack" },
    { text: "Have no fear of perfection - you'll never reach it.", author: "Salvador Dalí" },
    { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
    { text: "Make it simple, but significant.", author: "Don Draper" },
    { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
    { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
    { text: "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.", author: "Antoine de Saint-Exupéry" }
  ],
  es: [
    { text: "La única forma de hacer un gran trabajo es amar lo que haces.", author: "Steve Jobs" },
    { text: "Simplifica, luego añade ligereza.", author: "Colin Chapman" },
    { text: "El enfoque consiste en decidir qué cosas no vas a hacer.", author: "John Carmack" },
    { text: "No temas a la perfección, nunca la alcanzarás.", author: "Salvador Dalí" },
    { text: "La simplicidad es la sofisticación suprema.", author: "Leonardo da Vinci" },
    { text: "Hazlo simple, pero significativo.", author: "Don Draper" },
    { text: "Hecho es mejor que perfecto.", author: "Sheryl Sandberg" },
    { text: "El mejor mensaje de error es el que nunca aparece.", author: "Thomas Fuchs" },
    { text: "La perfección se logra no cuando no hay nada más que añadir, sino cuando no queda nada más que quitar.", author: "Antoine de Saint-Exupéry" }
  ]
};

// Application State
let state = {
  lang: 'en',
  theme: 'system',
  todos: [],
  countdowns: [],
  googleClientToken: sessionStorage.getItem('google_access_token') || null,
  settings: {
    lang: 'en',
    theme: 'system',
    primaryColor: 'blue',
    city: '',
    weatherUrl: '',
    worldClockTz: 'Europe/London',
    worldClockLabel: '',
    worldClockUrl: '',
    notes: '',
    financeUrl: 'https://www.google.com/finance/beta/quote/.INX:INDEXSP?window=1M',
    timerUrl: 'https://www.google.com/search?q=countdown+timer',
    stopwatchUrl: 'https://www.google.com/search?q=stopwatch',
    showWeather: true,
    showWorldClock: true,
    storageMode: 'local', // local or file
    googleClientId: '',
    githubToken: '',
    githubUsername: '',
    bitbucketWorkspace: '',
    bitbucketUsername: '',
    bitbucketToken: '',
    jiraHost: '',
    jiraEmail: '',
    jiraToken: ''
  }
};

// -------------------------------------------------------------
// INDEXEDDB FILE HANDLE PERSISTENCE
// -------------------------------------------------------------
const DB_NAME = 'dashboard-db';
const STORE_NAME = 'file-handles';

function getDB() {
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

async function saveFileHandle(handle) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(handle, 'sync-file');
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function getFileHandle() {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get('sync-file');
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = () => reject(request.error);
  });
}

async function clearFileHandle() {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete('sync-file');
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// File Sync state variables
let fileHandle = null;

async function verifyPermission(handle, readWrite) {
  const options = {};
  if (readWrite) {
    options.mode = 'readwrite';
  }
  try {
    if ((await handle.queryPermission(options)) === 'granted') {
      return true;
    }
    if ((await handle.requestPermission(options)) === 'granted') {
      return true;
    }
  } catch (e) {
    console.error("Error requesting file permission", e);
  }
  return false;
}

async function writeDataToFile() {
  if (state.settings.storageMode !== 'file' || !fileHandle) return;
  try {
    const hasPermission = await verifyPermission(fileHandle, true);
    if (!hasPermission) return;
    const writable = await fileHandle.createWritable();
    const dataToSave = {
      todos: state.todos,
      settings: state.settings
    };
    await writable.write(JSON.stringify(dataToSave, null, 2));
    await writable.close();
  } catch (err) {
    console.error("Error writing file:", err);
  }
}

async function readDataFromFile() {
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

async function initializeFileSync() {
  if (state.settings.storageMode !== 'file') {
    const el = document.getElementById('file-sync-settings');
    if (el) el.classList.add('hidden');
    return;
  }

  const el = document.getElementById('file-sync-settings');
  if (el) el.classList.remove('hidden');

  try {
    fileHandle = await getFileHandle();
    if (fileHandle) {
      const nameEl = document.getElementById('sync-file-name');
      if (nameEl) nameEl.textContent = fileHandle.name;
      
      // Read data and apply it
      const fileData = await readDataFromFile();
      if (fileData) {
        if (fileData.todos) state.todos = fileData.todos;
        if (fileData.settings) {
          state.settings = { ...state.settings, ...fileData.settings, storageMode: 'file' };
        }
        if (state.settings.lang) state.lang = state.settings.lang;
        if (state.settings.theme) state.theme = state.settings.theme;
        if (state.settings.primaryColor) applyPrimaryColor(state.settings.primaryColor);
        
        // Cache to localStorage
        localStorage.setItem('todos', JSON.stringify(state.todos));
        localStorage.setItem('dashboard_settings', JSON.stringify(state.settings));
        localStorage.setItem('theme', state.theme);
        
        // Refresh views
        applyTheme();
        renderTodos();
        translatePage();
        updateTimeAndGreeting();
        loadWeather();
        fetchGitHub();
        fetchBitbucket();
        fetchJira();
      }
    } else {
      const nameEl = document.getElementById('sync-file-name');
      if (nameEl) nameEl.textContent = translations[state.lang]['no-file-selected'];
    }
  } catch (err) {
    console.error("Failed to restore file sync:", err);
    const nameEl = document.getElementById('sync-file-name');
    if (nameEl) nameEl.textContent = "Error: Permission denied";
  }
}

// Export state to a JSON file
function exportStateToFile() {
  const dataToSave = {
    todos: state.todos,
    settings: state.settings
  };
  const blob = new Blob([JSON.stringify(dataToSave, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dashboard-data-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import state from a JSON file
function importStateFromFile(file) {
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.todos) state.todos = data.todos;
      if (data.settings) state.settings = { ...state.settings, ...data.settings };
      if (state.settings.primaryColor) applyPrimaryColor(state.settings.primaryColor);
      
      await saveSettings();
      renderTodos();
      translatePage();
      updateTimeAndGreeting();
      loadWeather();
      
      fetchGitHub();
      fetchBitbucket();
      fetchJira();
      
      alert(state.lang === 'es' ? 'Datos importados con éxito.' : 'Data imported successfully.');
    } catch (err) {
      alert(state.lang === 'es' ? 'Archivo inválido.' : 'Invalid file.');
    }
  };
  reader.readAsText(file);
}

// Load settings and todos from localStorage
async function loadState() {
  const storedSettings = localStorage.getItem('dashboard_settings');
  if (storedSettings) {
    state.settings = { ...state.settings, ...JSON.parse(storedSettings) };
  }
  state.settings.customEvents = state.settings.customEvents || [];
  state.settings.primaryColor = state.settings.primaryColor || 'blue';
  state.lang = state.settings.lang || 'en';
  state.theme = state.settings.theme || localStorage.getItem('theme') || 'system';

  applyPrimaryColor(state.settings.primaryColor);

  const storedTodos = localStorage.getItem('todos');
  if (storedTodos) {
    state.todos = JSON.parse(storedTodos);
  }

  const storedCountdowns = localStorage.getItem('countdowns');
  if (storedCountdowns) {
    state.countdowns = JSON.parse(storedCountdowns);
  }

  // Initialize file sync if enabled
  if (state.settings.storageMode === 'file') {
    await initializeFileSync();
  }

  // Clean up completed todos older than 7 days upon loading
  await cleanupOldCompletedTodos();

  // Initialize organizer visibility settings
  updateOrganizerVisibility();
}

async function cleanupOldCompletedTodos() {
  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  let changed = false;
  state.todos = state.todos.filter(todo => {
    if (todo.completed) {
      if (!todo.completedAt) {
        todo.completedAt = new Date().toISOString();
        changed = true;
        return true;
      }
      const completedTime = new Date(todo.completedAt).getTime();
      if (completedTime < sevenDaysAgo) {
        changed = true;
        return false;
      }
    }
    return true;
  });
  if (changed) {
    await saveTodos();
  }
}

// Save settings to localStorage
async function saveSettings() {
  state.settings.theme = state.theme;
  localStorage.setItem('dashboard_settings', JSON.stringify(state.settings));
  localStorage.setItem('theme', state.theme);
  updateNotesBadge();

  if (state.settings.storageMode === 'file') {
    await writeDataToFile();
  }
}

function updateNotesBadge() {
  const badge = document.getElementById('notes-badge');
  if (!badge) return;
  const hasNotes = state.settings.notes && state.settings.notes.trim().length > 0;
  if (hasNotes) {
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

function updateUpcomingEventBanner() {
  const banner = document.getElementById('upcoming-event');
  if (!banner) return;

  const events = state.settings.customEvents || [];
  if (events.length === 0) {
    banner.classList.add('hidden');
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentYear = today.getFullYear();

  let todayEvents = [];
  let upcomingEvents = [];

  events.forEach(evt => {
    const [year, monthStr, dayStr] = evt.date.split('-');
    const month = parseInt(monthStr, 10) - 1;
    const day = parseInt(dayStr, 10);

    // Calculate occurrence in current year
    let eventDateThisYear = new Date(currentYear, month, day);
    
    if (today.getMonth() === month && today.getDate() === day) {
      todayEvents.push(evt);
    } else {
      if (eventDateThisYear < today) {
        eventDateThisYear.setFullYear(currentYear + 1);
      }
      const timeDiff = eventDateThisYear.getTime() - today.getTime();
      const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
      upcomingEvents.push({
        ...evt,
        daysLeft
      });
    }
  });

  if (todayEvents.length > 0) {
    banner.className = 'event-banner today';
    const names = todayEvents.map(e => e.name).join(', ');
    const labelText = state.lang === 'es' 
      ? `🎉 Hoy: ¡${names}! 🎂`
      : `🎉 Today: ${names}! 🎂`;
    banner.textContent = labelText;
  } else if (upcomingEvents.length > 0) {
    upcomingEvents.sort((a, b) => a.daysLeft - b.daysLeft);
    const closest = upcomingEvents[0];
    if (closest.daysLeft < 7) {
      banner.className = 'event-banner soon';
    } else if (closest.daysLeft < 31) {
      banner.className = 'event-banner today';
    } else {
      banner.className = 'event-banner upcoming';
    }
    
    const isBirthday = closest.name.toLowerCase().includes('birthday') || closest.name.toLowerCase().includes('cumpleaños');
    const icon = isBirthday ? '🎈' : '📅';
    
    let timeText = '';
    if (state.lang === 'es') {
      timeText = closest.daysLeft === 1 ? 'mañana' : `en ${closest.daysLeft} días`;
    } else {
      timeText = closest.daysLeft === 1 ? 'tomorrow' : `in ${closest.daysLeft} days`;
    }
    const labelText = `${icon} ${closest.name} (${timeText})`;
    
    banner.textContent = labelText;
  } else {
    banner.classList.add('hidden');
  }
}

function renderSettingsEventsList() {
  const listEl = document.getElementById('settings-events-list');
  if (!listEl) return;
  listEl.innerHTML = '';

  const events = state.settings.customEvents || [];
  if (events.length === 0) {
    const emptyMsg = document.createElement('li');
    emptyMsg.style.color = 'var(--text-secondary)';
    emptyMsg.style.fontSize = '0.8rem';
    emptyMsg.style.justifyContent = 'center';
    emptyMsg.textContent = state.lang === 'es' ? 'No hay acontecimientos.' : 'No events configured.';
    listEl.appendChild(emptyMsg);
    return;
  }

  // Sort events chronologically (January -> December)
  const sortedEvents = [...events].sort((a, b) => {
    const [, mA, dA] = a.date.split('-').map(Number);
    const [, mB, dB] = b.date.split('-').map(Number);
    if (mA !== mB) return mA - mB;
    return dA - dB;
  });

  sortedEvents.forEach((evt) => {
    const li = document.createElement('li');
    
    const infoDiv = document.createElement('div');
    infoDiv.className = 'event-item-info';
    
    const nameSpan = document.createElement('span');
    nameSpan.className = 'event-item-name';
    nameSpan.textContent = evt.name;
    
    const dateSpan = document.createElement('span');
    dateSpan.className = 'event-item-date';
    const [y, m, d] = evt.date.split('-');
    const dateObj = new Date(y, parseInt(m, 10) - 1, d);
    dateSpan.textContent = dateObj.toLocaleDateString(state.lang === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'short' });
    
    infoDiv.appendChild(nameSpan);
    infoDiv.appendChild(dateSpan);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn-delete-event';
    deleteBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
    `;
    deleteBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      // Filter out by ID instead of index
      state.settings.customEvents = state.settings.customEvents.filter(item => item.id !== evt.id);
      await saveSettings();
      renderSettingsEventsList();
      updateUpcomingEventBanner();
    });
    
    li.appendChild(infoDiv);
    li.appendChild(deleteBtn);
    listEl.appendChild(li);
  });
}

// i18n Translation Engine
function translatePage() {
  const dictionary = translations[state.lang] || translations['en'];
  
  // Translate standard content elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dictionary[key]) {
      el.textContent = dictionary[key];
    }
  });

  // Translate input placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dictionary[key]) {
      el.setAttribute('placeholder', dictionary[key]);
    }
  });

  // Translate titles
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (dictionary[key]) {
      el.setAttribute('title', dictionary[key]);
    }
  });

  // Update UI lang toggle button text if exists
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.textContent = state.lang.toUpperCase();
  }
}

// DateTime / Greeting System
function updateTimeAndGreeting() {
  const now = new Date();
  
  // Format Clock
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  // Format Date
  const dateOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const locale = state.lang === 'es' ? 'es-ES' : 'en-US';
  document.getElementById('current-date').textContent = now.toLocaleDateString(locale, dateOptions);

  // Greeting
  const hour = now.getHours();
  let greetingKey = 'greeting-morning';
  if (hour >= 12 && hour < 19) {
    greetingKey = 'greeting-afternoon';
  } else if (hour >= 19 || hour < 6) {
    greetingKey = 'greeting-evening';
  }
  const greetingText = translations[state.lang][greetingKey];
  document.getElementById('greeting').textContent = `${greetingText}`;

  // Update World Clock
  updateWorldClock();

  // Update Upcoming Event Banner
  updateUpcomingEventBanner();
}

// World Clock System
function getTzDifference(targetTz) {
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

function updateWorldClock() {
  const widget = document.getElementById('world-clock-widget');
  if (state.settings.showWorldClock === false) {
    widget.classList.add('hidden');
    return;
  }
  
  widget.classList.remove('hidden');
  const dict = translations[state.lang];

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
    const formatter = new Intl.DateTimeFormat(state.lang === 'es' ? 'es-ES' : 'en-US', {
      timeZone: state.settings.worldClockTz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    widget.querySelector('.clock-time').textContent = formatter.format(now);
    
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

// Primary Color Accent Management
function applyPrimaryColor(colorName = 'blue') {
  const validColors = ['blue', 'indigo', 'purple', 'pink', 'red', 'orange', 'green', 'teal', 'slate', 'black'];
  const color = validColors.includes(colorName) ? colorName : 'blue';
  document.documentElement.setAttribute('data-accent', color);
}

function updateSwatchActiveState(selectedColor) {
  const swatches = document.querySelectorAll('#color-picker-swatches .color-swatch-btn');
  swatches.forEach(btn => {
    if (btn.getAttribute('data-color') === selectedColor) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Theme management
function applyTheme() {
  const html = document.documentElement;
  html.classList.remove('dark', 'light');
  
  if (state.theme === 'dark') {
    html.classList.add('dark');
  } else if (state.theme === 'light') {
    html.classList.add('light');
  } else {
    // System Theme detection
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isSystemDark) {
      html.classList.add('dark');
    }
  }
}

// Theme switch action
async function toggleTheme() {
  if (state.theme === 'system') {
    state.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'light' : 'dark';
  } else {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
  }
  await saveSettings();
  applyTheme();
}

function toSentenceCase(str) {
  if (!str) return '';
  const lower = str.toLowerCase();
  return lower.replace(/(^\s*|[.!?]\s+)([a-z])/g, (match, separator, char) => separator + char.toUpperCase());
}

// Quotes System
function loadQuote() {
  const dictionary = translations[state.lang];
  const quoteWidget = document.getElementById('quote-widget');
  quoteWidget.querySelector('.quote-text').textContent = dictionary['quote-loading'];
  const authorEl = quoteWidget.querySelector('.quote-author');
  if (authorEl) {
    authorEl.textContent = '';
    authorEl.removeAttribute('href');
  }

  // Attempt to fetch from public API, fallback to curated local list
  fetch('https://dummyjson.com/quotes/random')
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(data => {
      // API provides quotes in English. If page is in Spanish, translate or use local
      if (state.lang === 'es') {
        useLocalQuote();
      } else {
        updateQuoteDisplay(data.quote, data.author);
      }
    })
    .catch(() => {
      useLocalQuote();
    });

  function useLocalQuote() {
    const list = quotesDb[state.lang] || quotesDb['en'];
    const randomQuote = list[Math.floor(Math.random() * list.length)];
    updateQuoteDisplay(randomQuote.text, randomQuote.author);
  }

  function updateQuoteDisplay(text, author) {
    const quoteTextEl = quoteWidget.querySelector('.quote-text');
    const quoteSepEl = quoteWidget.querySelector('.quote-sep');
    quoteTextEl.textContent = `"${toSentenceCase(text)}"`;
    if (author && authorEl) {
      const cleanAuthor = author.replace(/^[\s–—-]+/, '').trim();
      const wikiLang = state.lang === 'es' ? 'es' : 'en';
      if (quoteSepEl) quoteSepEl.style.display = 'inline';
      authorEl.href = `https://${wikiLang}.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(cleanAuthor)}`;
      authorEl.textContent = cleanAuthor;
      authorEl.title = state.lang === 'es' ? `Ver ${cleanAuthor} en Wikipedia` : `View ${cleanAuthor} on Wikipedia`;
      authorEl.style.display = 'inline';
    } else if (authorEl) {
      if (quoteSepEl) quoteSepEl.style.display = 'none';
      authorEl.textContent = '';
      authorEl.style.display = 'none';
    }
  }
}

// Weather System (Open-Meteo)
async function loadWeather() {
  const weatherWidget = document.getElementById('weather-widget');
  if (state.settings.showWeather === false) {
    weatherWidget.classList.add('hidden');
    return;
  }
  weatherWidget.classList.remove('hidden');
  weatherWidget.classList.add('loading');

  const dict = translations[state.lang];

  try {
    let lat, lon, cityName = 'Madrid';
    
    if (state.settings.city) {
      cityName = state.settings.city;
      // Geocoding city name via Open-Meteo
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=${state.lang}`);
      const geoData = await geoRes.json();
      if (geoData.results && geoData.results.length > 0) {
        lat = geoData.results[0].latitude;
        lon = geoData.results[0].longitude;
        cityName = geoData.results[0].name;
      } else {
        throw new Error("City not found");
      }
    } else {
      const err = new Error("Unconfigured");
      err.isUnconfigured = true;
      throw err;
    }

    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code&hourly=precipitation_probability,weathercode`);
    const weatherData = await weatherRes.json();
    
    if (weatherData.current) {
      weatherWidget.classList.remove('unconfigured');
      const temp = Math.round(weatherData.current.temperature_2m);
      const apparentTemp = Math.round(weatherData.current.apparent_temperature);
      const code = weatherData.current.weather_code;
      const desc = getWeatherDesc(code);
      
      weatherWidget.querySelector('.weather-temp').textContent = `${temp}°C`;
      weatherWidget.querySelector('.weather-feels').textContent = dict['weather-feels-like'].replace('{temp}', apparentTemp);
      weatherWidget.querySelector('.weather-desc').textContent = desc;
      weatherWidget.querySelector('.weather-loc').textContent = cityName;

      // Calculate precipitation in next 24h
      let precipHTML = '';
      if (weatherData.hourly && weatherData.hourly.precipitation_probability && weatherData.hourly.weathercode) {
        const currentHourStr = weatherData.current.time;
        const startIndex = weatherData.hourly.time.indexOf(currentHourStr);
        const start = startIndex !== -1 ? startIndex : 0;
        const next24Probs = weatherData.hourly.precipitation_probability.slice(start, start + 24);
        const next24Codes = weatherData.hourly.weathercode.slice(start, start + 24);
        const maxProb = Math.max(...next24Probs);

        // Only show precipitation expected badge if probability is at least 20%
        if (maxProb >= 20) {
          let hasStorm = false;
          let hasSnow = false;
          for (let i = 0; i < next24Codes.length; i++) {
            if (next24Probs[i] >= 20) {
              const c = next24Codes[i];
              if (c >= 95 && c <= 99) hasStorm = true;
              else if ((c >= 71 && c <= 77) || (c >= 85 && c <= 86)) hasSnow = true;
            }
          }

          let typeKey = 'weather-rain';
          let icon = '☔';
          if (hasStorm) {
            typeKey = 'weather-storm';
            icon = '⛈️';
          } else if (hasSnow) {
            typeKey = 'weather-snow';
            icon = '❄️';
          }

          const label = dict[typeKey].replace('{prob}', maxProb);
          precipHTML = `<span class="weather-precip-badge" title="${label}">${icon} ${label}</span>`;
        } else {
          precipHTML = `<span class="weather-precip-badge none" title="${dict['weather-no-precip']}">☀️ ${dict['weather-no-precip']}</span>`;
        }
      }
      weatherWidget.querySelector('.weather-precip').innerHTML = precipHTML;
      weatherWidget.classList.remove('loading');
    }
  } catch (err) {
    weatherWidget.classList.add('unconfigured');
    weatherWidget.querySelector('.weather-unconfigured-text').textContent = err.isUnconfigured
      ? dict['weather-unconfigured']
      : dict['weather-error'];
    weatherWidget.classList.remove('loading');
  }
}

// Map WMO codes to human readable weather
function getWeatherDesc(code) {
  const codes = {
    0: { en: "Clear sky", es: "Cielo despejado" },
    1: { en: "Mainly clear", es: "Mayormente despejado" },
    2: { en: "Partly cloudy", es: "Parcialmente nublado" },
    3: { en: "Overcast", es: "Cubierto" },
    45: { en: "Fog", es: "Niebla" },
    48: { en: "Fog", es: "Niebla" },
    51: { en: "Light drizzle", es: "Llovizna ligera" },
    53: { en: "Moderate drizzle", es: "Llovizna moderada" },
    55: { en: "Dense drizzle", es: "Llovizna densa" },
    61: { en: "Slight rain", es: "Lluvia ligera" },
    63: { en: "Moderate rain", es: "Lluvia moderada" },
    65: { en: "Heavy rain", es: "Lluvia fuerte" },
    71: { en: "Slight snow", es: "Nieve ligera" },
    73: { en: "Moderate snow", es: "Nieve moderada" },
    75: { en: "Heavy snow", es: "Nieve fuerte" },
    77: { en: "Snow grains", es: "Granizo suave" },
    80: { en: "Slight rain showers", es: "Chubascos de lluvia leves" },
    81: { en: "Moderate rain showers", es: "Chubascos de lluvia moderados" },
    82: { en: "Violent rain showers", es: "Chubascos de lluvia violentos" },
    95: { en: "Thunderstorm", es: "Tormenta" },
    96: { en: "Thunderstorm with hail", es: "Tormenta con granizo" },
    99: { en: "Thunderstorm with heavy hail", es: "Tormenta con granizo fuerte" }
  };
  return (codes[code] ? codes[code][state.lang] : codes[0][state.lang]);
}

// -------------------------------------------------------------
// TODO LIST SYSTEM (CRUD)
// -------------------------------------------------------------
let activeFilter = 'pending';

function renderTodos() {
  const todoList = document.getElementById('todo-list');
  todoList.innerHTML = '';
  
  const filteredTodos = state.todos.filter(todo => {
    if (activeFilter === 'pending') return !todo.completed;
    if (activeFilter === 'completed') {
      if (!todo.completed) return false;
      if (!todo.completedAt) return true;
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      return new Date(todo.completedAt).getTime() >= sevenDaysAgo;
    }
    return true;
  });

  // Sort: Incomplete first, then by due date (descending), then by priority (high -> medium -> low), then by creation date (ascending)
  filteredTodos.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    
    // 1. Due date descending (no due date goes to the bottom of the dates)
    const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
    const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
    if (dateA !== dateB) {
      return dateB - dateA;
    }
    
    // 2. Priority descending
    const priorityWeights = { high: 3, medium: 2, low: 1 };
    if (priorityWeights[b.priority] !== priorityWeights[a.priority]) {
      return priorityWeights[b.priority] - priorityWeights[a.priority];
    }
    
    // 3. Creation date ascending (older/earlier timestamp first)
    return Number(a.id) - Number(b.id);
  });

  if (filteredTodos.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.className = 'empty-msg';
    emptyMsg.textContent = state.lang === 'es' ? 'No hay tareas.' : 'No tasks.';
    todoList.appendChild(emptyMsg);
    return;
  }

  filteredTodos.forEach(todo => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''} ${todo.isFocused ? 'focused' : ''}`;
    
    // Check if task is overdue
    let dateBadgeHTML = '';
    if (todo.dueDate) {
      const todayStr = getLocalDateString(new Date());
      const due = new Date(todo.dueDate + 'T00:00:00');
      const today = new Date(todayStr + 'T00:00:00');
      const timeDiff = due.getTime() - today.getTime();
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      let badgeClass = '';
      let badgeText = '';

      const dict = translations[state.lang];

      if (todo.completed) {
        // Just format normally
        badgeText = formatDateShort(todo.dueDate);
      } else if (diffDays < 0) {
        badgeClass = 'overdue';
        badgeText = `${dict['task-overdue']} (${formatDateShort(todo.dueDate)})`;
      } else if (diffDays === 0) {
        badgeText = dict['task-today'];
      } else if (diffDays === 1) {
        badgeText = dict['task-tomorrow'];
      } else {
        badgeText = formatDateShort(todo.dueDate);
      }

      dateBadgeHTML = `
        <span class="todo-date-badge ${badgeClass}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          ${badgeText}
        </span>`;
    }

    let completedBadgeHTML = '';
    if (todo.completed && todo.completedAt) {
      const compDate = new Date(todo.completedAt);
      const formattedCompDate = formatDateShort(getLocalDateString(compDate));
      completedBadgeHTML = `
        <span class="todo-completed-badge" title="${compDate.toLocaleString()}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          ${state.lang === 'es' ? 'Completada el' : 'Completed on'} ${formattedCompDate}
        </span>`;
    }

    li.innerHTML = `
      <div class="todo-item-left">
        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} data-id="${todo.id}">
        <div class="todo-item-details">
          <span class="todo-text">${escapeHtml(todo.text)}</span>
          <div class="todo-meta">
            <span class="todo-priority-badge priority-${todo.priority}">${translations[state.lang]['priority-' + todo.priority]}</span>
            ${dateBadgeHTML}
          </div>
          ${completedBadgeHTML}
        </div>
      </div>
      <div class="todo-actions">
        ${!todo.completed ? `
        <button class="btn-item-action focus-btn ${todo.isFocused ? 'active' : ''}" data-id="${todo.id}" title="${state.lang === 'es' ? 'Trabajando en esta tarea' : 'Focus on this task'}">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
        ` : ''}
        <button class="btn-item-action edit-btn" data-id="${todo.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
        </button>
        <button class="btn-item-action delete-btn" data-id="${todo.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      </div>
    `;

    // Listeners for checkbox and buttons
    li.querySelector('.todo-checkbox').addEventListener('change', (e) => {
      toggleTodo(todo.id);
    });

    if (!todo.completed) {
      li.querySelector('.focus-btn').addEventListener('click', () => {
        toggleFocusTodo(todo.id);
      });
    }

    li.querySelector('.edit-btn').addEventListener('click', () => {
      openEditModal(todo);
    });

    li.querySelector('.delete-btn').addEventListener('click', () => {
      deleteTodo(todo.id);
    });

    todoList.appendChild(li);
  });

  // Update todo focus card
  const focusedTodo = state.todos.find(todo => todo.isFocused && !todo.completed);
  const focusCard = document.getElementById('todo-focus-card');
  const focusContainer = document.getElementById('focus-card-item-container');
  if (focusCard && focusContainer) {
    if (focusedTodo) {
      focusContainer.innerHTML = '';
      
      let dateBadgeHTML = '';
      if (focusedTodo.dueDate) {
        const todayStr = getLocalDateString(new Date());
        const due = new Date(focusedTodo.dueDate + 'T00:00:00');
        const today = new Date(todayStr + 'T00:00:00');
        const timeDiff = due.getTime() - today.getTime();
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        let badgeClass = '';
        let badgeText = '';
        const dict = translations[state.lang];

        if (diffDays < 0) {
          badgeClass = 'overdue';
          badgeText = `${dict['task-overdue']} (${formatDateShort(focusedTodo.dueDate)})`;
        } else if (diffDays === 0) {
          badgeText = dict['task-today'];
        } else if (diffDays === 1) {
          badgeText = dict['task-tomorrow'];
        } else {
          badgeText = formatDateShort(focusedTodo.dueDate);
        }

        dateBadgeHTML = `
          <span class="todo-date-badge ${badgeClass}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            ${badgeText}
          </span>`;
      }

      const focusItemDiv = document.createElement('div');
      focusItemDiv.className = 'todo-item borderless-todo-item';
      focusItemDiv.innerHTML = `
        <div class="todo-item-left">
          <input type="checkbox" class="todo-checkbox" data-id="${focusedTodo.id}">
          <div class="todo-item-details">
            <span class="todo-text">${escapeHtml(focusedTodo.text)}</span>
            <div class="todo-meta">
              <span class="todo-priority-badge priority-${focusedTodo.priority}">${translations[state.lang]['priority-' + focusedTodo.priority]}</span>
              ${dateBadgeHTML}
            </div>
          </div>
        </div>
        <div class="todo-actions">
          <button class="btn-item-action focus-btn active" data-id="${focusedTodo.id}" title="${state.lang === 'es' ? 'Quitar del enfoque' : 'Clear focus'}">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
          <button class="btn-item-action edit-btn" data-id="${focusedTodo.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          </button>
          <button class="btn-item-action delete-btn" data-id="${focusedTodo.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      `;

      focusItemDiv.querySelector('.todo-checkbox').addEventListener('change', () => {
        toggleTodo(focusedTodo.id);
      });
      focusItemDiv.querySelector('.focus-btn').addEventListener('click', () => {
        toggleFocusTodo(focusedTodo.id);
      });
      focusItemDiv.querySelector('.edit-btn').addEventListener('click', () => {
        openEditModal(focusedTodo);
      });
      focusItemDiv.querySelector('.delete-btn').addEventListener('click', () => {
        deleteTodo(focusedTodo.id);
      });

      focusContainer.appendChild(focusItemDiv);
      focusCard.classList.remove('hidden');
    } else {
      focusCard.classList.add('hidden');
      focusContainer.innerHTML = '';
    }
  }

  // Update Clear Completed button
  const clearBtn = document.getElementById('btn-clear-completed');
  if (clearBtn) {
    const hasCompleted = state.todos.some(todo => todo.completed);
    if (activeFilter === 'completed' && hasCompleted) {
      clearBtn.textContent = translations[state.lang]['clear-completed-btn'];
      clearBtn.classList.remove('hidden');
    } else {
      clearBtn.classList.add('hidden');
    }
  }

  // Update Completed Tasks Note
  const completedNote = document.getElementById('completed-tasks-note');
  if (completedNote) {
    if (activeFilter === 'completed') {
      completedNote.textContent = translations[state.lang]['completed-tasks-note'];
      completedNote.classList.remove('hidden');
    } else {
      completedNote.classList.add('hidden');
    }
  }

  // Re-sync dashboard columns so they reflect task items
  syncDashboardColumns();
}

async function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(state.todos));
  if (state.settings.storageMode === 'file') {
    await writeDataToFile();
  }
}

function updateOrganizerVisibility() {
  const showCountdowns = state.settings.showCountdowns !== false;
  const showTasks = state.settings.showTasks !== false;

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
  const bothHidden = !showCountdowns && !showTasks;
  if (colTasks) {
    colTasks.classList.toggle('hidden', bothHidden);
  }
  if (dashboardGrid) {
    dashboardGrid.classList.toggle('two-cols', bothHidden);
  }
}

// ------------------------------------------------------------
// COUNTDOWNS
// ------------------------------------------------------------

async function saveCountdowns() {
  localStorage.setItem('countdowns', JSON.stringify(state.countdowns));
}

function renderCountdowns() {
  const list = document.getElementById('countdown-list');
  const emptyEl = document.getElementById('countdown-empty');
  if (!list) return;

  list.innerHTML = '';

  const todayStr = getLocalDateString(new Date());
  const todayMs = new Date(todayStr + 'T00:00:00').getTime();

  if (state.countdowns.length === 0) {
    if (emptyEl) emptyEl.classList.remove('hidden');
    return;
  }
  if (emptyEl) emptyEl.classList.add('hidden');

  // Sort by target date ascending
  const sorted = [...state.countdowns].sort((a, b) => a.targetDate.localeCompare(b.targetDate));

  sorted.forEach(countdown => {
    const targetMs = new Date(countdown.targetDate + 'T00:00:00').getTime();
    const diffDays = Math.ceil((targetMs - todayMs) / (1000 * 60 * 60 * 24));

    let daysLabel, badgeClass;
    if (diffDays < 0) {
      daysLabel = state.lang === 'es' ? `Hace ${Math.abs(diffDays)} días` : `${Math.abs(diffDays)} days ago`;
      badgeClass = 'countdown-badge-past';
    } else if (diffDays === 0) {
      daysLabel = state.lang === 'es' ? '¡Hoy!' : 'Today!';
      badgeClass = 'countdown-badge-red';
    } else if (diffDays === 1) {
      daysLabel = state.lang === 'es' ? 'Mañana' : 'Tomorrow';
      badgeClass = 'countdown-badge-red';
    } else if (diffDays < 7) {
      daysLabel = state.lang === 'es' ? `En ${diffDays} días` : `In ${diffDays} days`;
      badgeClass = 'countdown-badge-red';
    } else if (diffDays < 31) {
      daysLabel = state.lang === 'es' ? `En ${diffDays} días` : `In ${diffDays} days`;
      badgeClass = 'countdown-badge-amber';
    } else {
      daysLabel = state.lang === 'es' ? `En ${diffDays} días` : `In ${diffDays} days`;
      badgeClass = 'countdown-badge-neutral';
    }

    const isPast = diffDays < 0;
    const titleClass = isPast ? 'countdown-title countdown-title-past' : 'countdown-title';

    const li = document.createElement('li');
    li.className = 'countdown-item';
    li.innerHTML = `
      <div class="todo-item-left">
        <div class="todo-item-details">
          <span class="${titleClass}">${escapeHtml(countdown.title)}</span>
          <span class="countdown-date" style="margin-top: 0.15rem; display: block;">${formatDateShort(countdown.targetDate)}</span>
        </div>
      </div>
      <div class="todo-actions countdown-actions">
        <span class="countdown-badge ${badgeClass}">${daysLabel}</span>
        <button class="btn-item-action delete-countdown-btn" data-id="${countdown.id}" title="${state.lang === 'es' ? 'Eliminar' : 'Delete'}">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      </div>
    `;

    li.querySelector('.delete-countdown-btn').addEventListener('click', () => {
      deleteCountdown(countdown.id);
    });

    list.appendChild(li);
  });
}

async function addCountdown(title, targetDate) {
  state.countdowns.push({ id: Date.now().toString(), title, targetDate });
  await saveCountdowns();
  renderCountdowns();
}

let countdownIdToDelete = null;

function deleteCountdown(id) {
  countdownIdToDelete = id;
  const countdown = state.countdowns.find(c => c.id === id);
  if (!countdown) return;

  const modal = document.getElementById('confirm-delete-modal');
  if (modal) {
    const dict = translations[state.lang];
    confirmActionType = 'delete-countdown';
    modal.querySelector('[data-i18n="confirm-delete-title"]').textContent = state.lang === 'es' ? 'Eliminar Countdown' : 'Delete Countdown';
    const descEl = modal.querySelector('[data-i18n="confirm-delete-desc"]');
    if (descEl) {
      descEl.innerHTML = state.lang === 'es'
        ? `¿Estás seguro de que quieres eliminar el countdown: <strong>"${escapeHtml(countdown.title)}"</strong>?`
        : `Are you sure you want to delete the countdown: <strong>"${escapeHtml(countdown.title)}"</strong>?`;
    }
    modal.querySelector('[data-i18n="cancel-btn"]').textContent = dict['cancel-btn'];
    modal.querySelector('[data-i18n="delete-btn"]').textContent = dict['delete-btn'];
    modal.showModal();
  }
}

async function addTodo(text, dueDate, priority) {
  const newTodo = {
    id: Date.now().toString(),
    text,
    completed: false,
    dueDate: dueDate || null,
    priority: priority || 'medium'
  };
  state.todos.push(newTodo);
  await saveTodos();
  renderTodos();
}

async function toggleTodo(id) {
  state.todos = state.todos.map(todo => {
    if (todo.id === id) {
      const nextCompleted = !todo.completed;
      return { 
        ...todo, 
        completed: nextCompleted,
        completedAt: nextCompleted ? new Date().toISOString() : null,
        isFocused: nextCompleted ? false : todo.isFocused 
      };
    }
    return todo;
  });
  await saveTodos();
  renderTodos();
}

async function toggleFocusTodo(id) {
  state.todos = state.todos.map(todo => {
    if (todo.id === id) {
      return { ...todo, isFocused: !todo.isFocused };
    }
    return { ...todo, isFocused: false };
  });
  await saveTodos();
  renderTodos();
}

let confirmActionType = null;
let todoIdToDelete = null;

function showClearCompletedConfirmation() {
  confirmActionType = 'clear-completed';
  const modal = document.getElementById('confirm-delete-modal');
  if (modal) {
    const dict = translations[state.lang];
    modal.querySelector('[data-i18n="confirm-delete-title"]').textContent = state.lang === 'es' ? 'Limpiar Tareas' : 'Clear Tasks';
    
    const descEl = modal.querySelector('[data-i18n="confirm-delete-desc"]');
    if (descEl) {
      descEl.innerHTML = state.lang === 'es' 
        ? '¿Estás seguro de que quieres eliminar todas las tareas completadas?' 
        : 'Are you sure you want to delete all completed tasks?';
    }
    
    modal.querySelector('[data-i18n="cancel-btn"]').textContent = dict['cancel-btn'];
    modal.querySelector('[data-i18n="delete-btn"]').textContent = state.lang === 'es' ? 'Eliminar todas' : 'Delete all';
    modal.showModal();
  }
}

function deleteTodo(id) {
  confirmActionType = 'delete-single';
  todoIdToDelete = id;
  const todo = state.todos.find(t => t.id === id);
  if (!todo) return;

  const modal = document.getElementById('confirm-delete-modal');
  if (modal) {
    const dict = translations[state.lang];
    modal.querySelector('[data-i18n="confirm-delete-title"]').textContent = dict['confirm-delete-title'];
    
    const descEl = modal.querySelector('[data-i18n="confirm-delete-desc"]');
    if (descEl) {
      if (state.lang === 'es') {
        descEl.innerHTML = `¿Estás seguro de que quieres eliminar la tarea: <strong>"${escapeHtml(todo.text)}"</strong>?`;
      } else {
        descEl.innerHTML = `Are you sure you want to delete the task: <strong>"${escapeHtml(todo.text)}"</strong>?`;
      }
    }

    modal.querySelector('[data-i18n="cancel-btn"]').textContent = dict['cancel-btn'];
    modal.querySelector('[data-i18n="delete-btn"]').textContent = dict['delete-btn'];
    modal.showModal();
  }
}

async function updateTodo(id, newText, newDueDate, newPriority) {
  state.todos = state.todos.map(todo => {
    if (todo.id === id) {
      return { ...todo, text: newText, dueDate: newDueDate || null, priority: newPriority };
    }
    return todo;
  });
  await saveTodos();
  renderTodos();
}

// -------------------------------------------------------------
// DASHBOARD SYNC & INTEGRATIONS
// -------------------------------------------------------------
function syncDashboardColumns() {
  // Clear any existing local task rows from Hoy/Esta Semana columns
  const localTodaySection = document.getElementById('local-today-events');
  if (localTodaySection) localTodaySection.remove();
  
  const localWeekSection = document.getElementById('local-week-events');
  if (localWeekSection) localWeekSection.remove();

  const todayStr = getLocalDateString(new Date());
  
  // Tasks for Today
  const todayTasks = state.todos.filter(todo => !todo.completed && todo.dueDate === todayStr);
  
  // Tasks for This Week (Next 7 days, excluding today)
  const next7Days = [];
  for (let i = 1; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    next7Days.push(getLocalDateString(d));
  }
  const weekTasks = state.todos.filter(todo => !todo.completed && next7Days.includes(todo.dueDate));

  // Insert Local Tasks into Today column content
  if (todayTasks.length > 0) {
    const container = document.querySelector('#col-today .col-content');
    const card = document.createElement('div');
    card.id = 'local-today-events';
    card.className = 'section-card';
    card.innerHTML = `
      <h3 class="card-subtitle">${state.lang === 'es' ? 'Tareas de Hoy' : 'Today\'s Tasks'}</h3>
      <div class="integration-list">
        ${todayTasks.map(t => `
          <div class="integration-item urgent">
            <span class="item-title">${escapeHtml(t.text)}</span>
            <div class="item-meta">
              <span class="item-badge priority-${t.priority}">${translations[state.lang]['priority-' + t.priority]}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    container.insertBefore(card, container.firstChild);
  }

  // Insert Local Tasks into This Week column content
  if (weekTasks.length > 0) {
    const container = document.querySelector('#col-week .col-content');
    const card = document.createElement('div');
    card.id = 'local-week-events';
    card.className = 'section-card';
    card.innerHTML = `
      <h3 class="card-subtitle">${state.lang === 'es' ? 'Tareas de esta Semana' : 'This Week\'s Tasks'}</h3>
      <div class="integration-list">
        ${weekTasks.map(t => `
          <div class="integration-item">
            <span class="item-title">${escapeHtml(t.text)}</span>
            <div class="item-meta">
              <span>${formatDateShort(t.dueDate)}</span>
              <span class="item-badge priority-${t.priority}">${translations[state.lang]['priority-' + t.priority]}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    container.insertBefore(card, container.firstChild);
  }
}

// -------------------------------------------------------------
// EXTERNAL SERVICES INTEGRATIONS
// -------------------------------------------------------------

// General helper to encode Jira Basic Auth
function getJiraAuthHeader() {
  if (!state.settings.jiraEmail || !state.settings.jiraToken) return null;
  return 'Basic ' + btoa(`${state.settings.jiraEmail}:${state.settings.jiraToken}`);
}

// Fetch Jira Tasks
async function fetchJira() {
  const container = document.getElementById('jira-container');
  if (!state.settings.jiraHost || !state.settings.jiraEmail || !state.settings.jiraToken) {
    container.innerHTML = `<p class="empty-msg">${translations[state.lang]['status-unconfigured']}</p>`;
    return;
  }

  try {
    const domain = state.settings.jiraHost.replace(/\/$/, "");
    const jql = encodeURIComponent("assignee = currentUser() AND statusCategory != Done");
    const response = await fetch(`${domain}/rest/api/3/search?jql=${jql}&maxResults=5`, {
      headers: {
        'Authorization': getJiraAuthHeader(),
        'Accept': 'application/json'
      }
    });

    if (!response.ok) throw new Error();
    const data = await response.json();

    if (!data.issues || data.issues.length === 0) {
      container.innerHTML = `<p class="empty-msg">${translations[state.lang]['no-jira-tasks']}</p>`;
      return;
    }

    container.innerHTML = data.issues.map(issue => {
      const summary = issue.fields.summary;
      const key = issue.key;
      const url = `${domain}/browse/${key}`;
      const priority = issue.fields.priority ? issue.fields.priority.name : 'medium';
      return `
        <a href="${url}" target="_blank" class="integration-item">
          <span class="item-title">[${key}] ${escapeHtml(summary)}</span>
          <div class="item-meta">
            <span>${escapeHtml(issue.fields.status.name)}</span>
            <span class="item-badge">${escapeHtml(priority)}</span>
          </div>
        </a>
      `;
    }).join('');

  } catch (error) {
    container.innerHTML = `<p class="empty-msg" style="color:var(--danger)">API Error / CORS Blocked</p>`;
  }
}

// Fetch GitHub PRs
async function fetchGitHub() {
  const container = document.getElementById('prs-container');
  if (!state.settings.githubToken || !state.settings.githubUsername) {
    container.innerHTML = `<p class="empty-msg">${translations[state.lang]['status-unconfigured']}</p>`;
    return;
  }

  try {
    const q = encodeURIComponent(`is:pr is:open review-requested:${state.settings.githubUsername} assignee:${state.settings.githubUsername}`);
    const response = await fetch(`https://api.github.com/search/issues?q=${q}&per_page=5`, {
      headers: {
        'Authorization': `token ${state.settings.githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) throw new Error();
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      container.innerHTML = `<p class="empty-msg">${translations[state.lang]['no-prs']}</p>`;
      return;
    }

    container.innerHTML = data.items.map(pr => {
      const repo = pr.repository_url.split('/').slice(-1)[0];
      return `
        <a href="${pr.html_url}" target="_blank" class="integration-item">
          <span class="item-title">${escapeHtml(pr.title)}</span>
          <div class="item-meta">
            <span>${escapeHtml(repo)}</span>
            <span class="item-badge">#${pr.number}</span>
          </div>
        </a>
      `;
    }).join('');

  } catch (error) {
    container.innerHTML = `<p class="empty-msg" style="color:var(--danger)">GitHub Auth / Connection Error</p>`;
  }
}

// Fetch Bitbucket PRs
async function fetchBitbucket() {
  // If GitHub has loaded, let's append Bitbucket PRs to the same container, or clear it
  const container = document.getElementById('prs-container');
  
  if (!state.settings.bitbucketWorkspace || !state.settings.bitbucketToken || !state.settings.bitbucketUsername) {
    // If GitHub is also unconfigured, show unconfigured
    if (!state.settings.githubToken) {
      container.innerHTML = `<p class="empty-msg">${translations[state.lang]['status-unconfigured']}</p>`;
    }
    return;
  }

  try {
    const auth = btoa(`${state.settings.bitbucketUsername}:${state.settings.bitbucketToken}`);
    // Fetch pull requests for workspace
    const workspace = state.settings.bitbucketWorkspace;
    const response = await fetch(`https://api.bitbucket.org/2.0/pullrequests/${state.settings.bitbucketUsername}`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) throw new Error();
    const data = await response.json();

    const prs = data.values || [];
    if (prs.length === 0) return; // let GitHub messages remain

    // Append to existing HTML or replace if empty
    const currentHTML = container.innerHTML.includes('empty-msg') || container.innerHTML.includes('Unconfigured') ? '' : container.innerHTML;
    
    const bbHTML = prs.map(pr => {
      return `
        <a href="${pr.links.html.href}" target="_blank" class="integration-item">
          <span class="item-title">[Bitbucket] ${escapeHtml(pr.title)}</span>
          <div class="item-meta">
            <span>${escapeHtml(pr.source.repository.name)}</span>
            <span class="item-badge">#${pr.id}</span>
          </div>
        </a>
      `;
    }).join('');

    container.innerHTML = currentHTML + bbHTML;
  } catch (error) {
    // only write error if container was empty
    if (container.innerHTML.includes('empty-msg')) {
      container.innerHTML = `<p class="empty-msg" style="color:var(--danger)">Bitbucket Auth / Connection Error</p>`;
    }
  }
}

// Google APIs Integrations (Gmail, Tasks, Calendar)
let googleTokenClient;

function initGoogleOAuth() {
  if (typeof google === 'undefined' || !state.settings.googleClientId) {
    return;
  }

  googleTokenClient = google.accounts.oauth2.initTokenClient({
    client_id: state.settings.googleClientId,
    scope: 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/tasks.readonly https://www.googleapis.com/auth/calendar.readonly',
    callback: async (response) => {
      if (response.error) {
        console.error(response.error);
        return;
      }
      state.googleClientToken = response.access_token;
      sessionStorage.setItem('google_access_token', response.access_token);
      updateGoogleAuthStatus(true);
      await fetchGoogleData();
    }
  });

  if (state.googleClientToken) {
    updateGoogleAuthStatus(true);
    fetchGoogleData();
  }
}

function updateGoogleAuthStatus(connected) {
  const statusEl = document.getElementById('google-auth-status');
  const loginBtn = document.getElementById('google-login-btn');
  const logoutBtn = document.getElementById('google-logout-btn');
  const dict = translations[state.lang];

  if (connected) {
    statusEl.textContent = dict['connected'];
    statusEl.className = "auth-status connected";
    loginBtn.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
  } else {
    statusEl.textContent = dict['disconnected'];
    statusEl.className = "auth-status disconnected";
    loginBtn.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
  }
}

async function fetchGoogleData() {
  if (!state.googleClientToken) return;

  // Run in parallel
  fetchGmail();
  fetchGoogleTasks();
  fetchGoogleCalendar();
}

async function fetchGmail() {
  const container = document.getElementById('gmail-container');
  try {
    const res = await fetch('https://gmail.googleapis.com/v1/users/me/messages?q=is:unread&maxResults=5', {
      headers: { 'Authorization': `Bearer ${state.googleClientToken}` }
    });
    if (!res.ok) throw new Error();
    const data = await res.json();

    if (!data.messages || data.messages.length === 0) {
      container.innerHTML = `<p class="empty-msg">${translations[state.lang]['no-emails']}</p>`;
      return;
    }

    // Fetch details for each message
    const detailsPromises = data.messages.map(msg => 
      fetch(`https://gmail.googleapis.com/v1/users/me/messages/${msg.id}`, {
        headers: { 'Authorization': `Bearer ${state.googleClientToken}` }
      }).then(r => r.json())
    );

    const messagesDetails = await Promise.all(detailsPromises);
    
    container.innerHTML = messagesDetails.map(msg => {
      const headers = msg.payload.headers;
      const subjectHeader = headers.find(h => h.name.toLowerCase() === 'subject');
      const fromHeader = headers.find(h => h.name.toLowerCase() === 'from');
      const subject = subjectHeader ? subjectHeader.value : '(No Subject)';
      const from = fromHeader ? fromHeader.value.split('<')[0].trim() : 'Unknown';
      const snippet = msg.snippet;

      return `
        <div class="integration-item">
          <span class="item-title">${escapeHtml(subject)}</span>
          <div class="item-meta">
            <span>${escapeHtml(from)}</span>
            <span class="item-badge" title="${escapeHtml(snippet)}">Gmail</span>
          </div>
        </div>
      `;
    }).join('');

  } catch (err) {
    container.innerHTML = `<p class="empty-msg" style="color:var(--danger)">Gmail Loading Error</p>`;
  }
}

async function fetchGoogleTasks() {
  // We can merge Google Tasks into our standard ToDo list visually, or display them separately.
  // Let's merge them under Hoy / Esta Semana if they have dates, or list them.
  // For simplicity, let's fetch Google Tasks and show them as uncompleted items in Hoy / Esta semana.
  try {
    // 1. Get task lists
    const listsRes = await fetch('https://tasks.googleapis.com/v1/users/@me/lists', {
      headers: { 'Authorization': `Bearer ${state.googleClientToken}` }
    });
    if (!listsRes.ok) throw new Error();
    const listsData = await listsRes.json();
    if (!listsData.items || listsData.items.length === 0) return;

    // 2. Fetch tasks from primary list (first one usually)
    const listId = listsData.items[0].id;
    const tasksRes = await fetch(`https://tasks.googleapis.com/v1/lists/${listId}/tasks?showCompleted=false`, {
      headers: { 'Authorization': `Bearer ${state.googleClientToken}` }
    });
    const tasksData = await tasksRes.json();
    const gTasks = tasksData.items || [];

    // Store in global state or overlay on UI
    // We will render Google Tasks directly into the columns!
    const todayStr = getLocalDateString(new Date());
    const next7Days = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      next7Days.push(getLocalDateString(d));
    }

    const todayGTasks = gTasks.filter(t => t.due && t.due.startsWith(todayStr));
    const weekGTasks = gTasks.filter(t => t.due && next7Days.some(day => t.due.startsWith(day)));

    // Insert into DOM
    if (todayGTasks.length > 0) {
      // Find today list container or append
      let gTodayCard = document.getElementById('gtasks-today');
      if (!gTodayCard) {
        gTodayCard = document.createElement('div');
        gTodayCard.id = 'gtasks-today';
        gTodayCard.className = 'section-card';
        document.querySelector('#col-today .col-content').appendChild(gTodayCard);
      }
      gTodayCard.innerHTML = `
        <h3 class="card-subtitle">Google Tasks (Hoy)</h3>
        <div class="integration-list">
          ${todayGTasks.map(t => `
            <div class="integration-item urgent">
              <span class="item-title">${escapeHtml(t.title)}</span>
              <div class="item-meta">
                <span class="item-badge">Google</span>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (weekGTasks.length > 0) {
      let gWeekCard = document.getElementById('gtasks-week');
      if (!gWeekCard) {
        gWeekCard = document.createElement('div');
        gWeekCard.id = 'gtasks-week';
        gWeekCard.className = 'section-card';
        document.querySelector('#col-week .col-content').appendChild(gWeekCard);
      }
      gWeekCard.innerHTML = `
        <h3 class="card-subtitle">Google Tasks (Semana)</h3>
        <div class="integration-list">
          ${weekGTasks.map(t => `
            <div class="integration-item">
              <span class="item-title">${escapeHtml(t.title)}</span>
              <div class="item-meta">
                <span>${formatDateShort(t.due.split('T')[0])}</span>
                <span class="item-badge">Google</span>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

  } catch (err) {
    console.error("Error fetching Google Tasks", err);
  }
}

async function fetchGoogleCalendar() {
  const todayEventsContainer = document.getElementById('google-events-container');
  const weeklyEventsContainer = document.getElementById('weekly-events-container');

  try {
    const timeMin = new Date().toISOString();
    const timeMax = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days ahead

    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${state.googleClientToken}` }
    });
    if (!res.ok) throw new Error();
    const data = await res.json();

    const events = data.items || [];

    if (events.length === 0) {
      todayEventsContainer.innerHTML = `<p class="empty-msg">${translations[state.lang]['no-events']}</p>`;
      weeklyEventsContainer.innerHTML = `<p class="empty-msg">${translations[state.lang]['no-weekly-events']}</p>`;
      return;
    }

    const todayStr = getLocalDateString(new Date());

    const todayEvents = [];
    const weeklyEvents = [];

    events.forEach(evt => {
      const startStr = evt.start.dateTime || evt.start.date;
      const isToday = startStr.startsWith(todayStr);
      
      const eventHTML = `
        <div class="integration-item">
          <span class="item-title">${escapeHtml(evt.summary)}</span>
          <div class="item-meta">
            <span>${formatEventTime(evt)}</span>
            <span class="item-badge">Cal</span>
          </div>
        </div>
      `;

      if (isToday) {
        todayEvents.push(eventHTML);
      } else {
        weeklyEvents.push(eventHTML);
      }
    });

    todayEventsContainer.innerHTML = todayEvents.length > 0 ? todayEvents.join('') : `<p class="empty-msg">${translations[state.lang]['no-events']}</p>`;
    weeklyEventsContainer.innerHTML = weeklyEvents.length > 0 ? weeklyEvents.join('') : `<p class="empty-msg">${translations[state.lang]['no-weekly-events']}</p>`;

  } catch (err) {
    todayEventsContainer.innerHTML = `<p class="empty-msg" style="color:var(--danger)">Calendar Loading Error</p>`;
    weeklyEventsContainer.innerHTML = `<p class="empty-msg" style="color:var(--danger)">Calendar Loading Error</p>`;
  }
}

// -------------------------------------------------------------
// EVENT LISTENERS & MODALS SETUP
// -------------------------------------------------------------
function setupEventListeners() {
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

  // Color swatches click handlers
  const swatches = document.querySelectorAll('#color-picker-swatches .color-swatch-btn');
  swatches.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedColor = btn.getAttribute('data-color');
      const hiddenInput = document.getElementById('settings-primary-color');
      if (hiddenInput) hiddenInput.value = selectedColor;
      updateSwatchActiveState(selectedColor);
      applyPrimaryColor(selectedColor);
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

  // Click banner to open Events settings directly
  const eventBanner = document.getElementById('upcoming-event');
  if (eventBanner) {
    eventBanner.addEventListener('click', () => {
      document.getElementById('settings-toggle').click();
      const eventsTab = document.querySelector('.tab-btn[data-tab="tab-events"]');
      if (eventsTab) eventsTab.click();
    });
  }

  // Confirm Delete Modal Listeners
  const confirmDeleteModal = document.getElementById('confirm-delete-modal');
  if (confirmDeleteModal) {
    document.getElementById('btn-cancel-delete').addEventListener('click', () => {
      confirmDeleteModal.close();
      todoIdToDelete = null;
    });
    
    document.getElementById('close-delete-modal').addEventListener('click', () => {
      confirmDeleteModal.close();
      todoIdToDelete = null;
      countdownIdToDelete = null;
    });

    document.getElementById('btn-confirm-delete').addEventListener('click', async () => {
      if (confirmActionType === 'delete-single' && todoIdToDelete !== null) {
        state.todos = state.todos.filter(todo => todo.id !== todoIdToDelete);
        await saveTodos();
        renderTodos();
        confirmDeleteModal.close();
        todoIdToDelete = null;
        confirmActionType = null;
      } else if (confirmActionType === 'clear-completed') {
        state.todos = state.todos.filter(todo => !todo.completed);
        await saveTodos();
        renderTodos();
        confirmDeleteModal.close();
        confirmActionType = null;
      } else if (confirmActionType === 'delete-countdown' && countdownIdToDelete !== null) {
        state.countdowns = state.countdowns.filter(c => c.id !== countdownIdToDelete);
        await saveCountdowns();
        renderCountdowns();
        confirmDeleteModal.close();
        countdownIdToDelete = null;
        confirmActionType = null;
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
      addCountdownModal.showModal();
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
      addTaskModal.showModal();
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

  // Click weather widget to open web page in new tab
  const weatherWidgetEl = document.getElementById('weather-widget');
  if (weatherWidgetEl) {
    weatherWidgetEl.addEventListener('click', (e) => {
      e.stopPropagation();
      let targetUrl = '';
      if (state.settings.weatherUrl && state.settings.weatherUrl.trim()) {
        targetUrl = ensureHttpUrl(state.settings.weatherUrl);
      } else {
        const city = state.settings.city ? state.settings.city.trim() : '';
        const langQuery = state.lang === 'es' ? 'tiempo' : 'weather';
        if (city) {
          targetUrl = `https://www.google.com/search?q=${encodeURIComponent(langQuery + ' ' + city)}`;
        } else {
          targetUrl = `https://www.google.com/search?q=${encodeURIComponent(langQuery)}`;
        }
      }
      if (targetUrl) {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      } else {
        document.getElementById('settings-toggle').click();
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
      notesModal.showModal();
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

  // Settings Modal Open
  let isSettingsFormSaved = false;
  const settingsModal = document.getElementById('settings-modal');
  document.getElementById('settings-toggle').addEventListener('click', () => {
    isSettingsFormSaved = false;
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
    if (financeUrlInput) financeUrlInput.value = state.settings.financeUrl !== undefined ? state.settings.financeUrl : 'https://www.google.com/finance/beta/quote/.INX:INDEXSP?window=1M';
    const timerUrlInput = document.getElementById('settings-timer-url');
    if (timerUrlInput) timerUrlInput.value = state.settings.timerUrl !== undefined ? state.settings.timerUrl : 'https://www.google.com/search?q=countdown+timer';
    const stopwatchUrlInput = document.getElementById('settings-stopwatch-url');
    if (stopwatchUrlInput) stopwatchUrlInput.value = state.settings.stopwatchUrl !== undefined ? state.settings.stopwatchUrl : 'https://www.google.com/search?q=stopwatch';

    document.getElementById('settings-show-weather').checked = state.settings.showWeather !== false;
    document.getElementById('settings-show-world-clock').checked = state.settings.showWorldClock !== false;
    document.getElementById('settings-show-countdowns').checked = state.settings.showCountdowns !== false;
    document.getElementById('settings-show-tasks').checked = state.settings.showTasks !== false;
    
    toggleWeatherInputs();
    toggleClockInputs();
    
    document.getElementById('settings-storage-mode').value = state.settings.storageMode || 'local';
    document.getElementById('google-client-id').value = state.settings.googleClientId;
    document.getElementById('github-token').value = state.settings.githubToken;
    document.getElementById('github-username').value = state.settings.githubUsername;
    document.getElementById('bitbucket-workspace').value = state.settings.bitbucketWorkspace;
    document.getElementById('bitbucket-username').value = state.settings.bitbucketUsername;
    document.getElementById('bitbucket-token').value = state.settings.bitbucketToken;
    document.getElementById('jira-host').value = state.settings.jiraHost;
    document.getElementById('jira-email').value = state.settings.jiraEmail;
    document.getElementById('jira-token').value = state.settings.jiraToken;

    // Toggle sync details visibility depending on current storageMode
    if (state.settings.storageMode === 'file') {
      document.getElementById('file-sync-settings').classList.remove('hidden');
      if (fileHandle) {
        document.getElementById('sync-file-name').textContent = fileHandle.name;
      } else {
        document.getElementById('sync-file-name').textContent = translations[state.lang]['no-file-selected'];
      }
    } else {
      document.getElementById('file-sync-settings').classList.add('hidden');
    }

    renderSettingsEventsList();
    settingsModal.showModal();
  });

  // Live Preview Handlers for Language and Theme
  const settingsLangSelect = document.getElementById('settings-lang');
  if (settingsLangSelect) {
    settingsLangSelect.addEventListener('change', (e) => {
      state.lang = e.target.value;
      translatePage();
      updateTimeAndGreeting();
      loadWeather();
      loadQuote();
    });
  }

  const settingsThemeSelect = document.getElementById('settings-theme');
  if (settingsThemeSelect) {
    settingsThemeSelect.addEventListener('change', (e) => {
      state.theme = e.target.value;
      applyTheme();
    });
  }

  // Close Settings Modal
  document.getElementById('close-settings').addEventListener('click', () => {
    settingsModal.close();
  });

  settingsModal.addEventListener('close', () => {
    if (!isSettingsFormSaved) {
      // Revert Language
      state.lang = state.settings.lang || 'en';
      const langSelect = document.getElementById('settings-lang');
      if (langSelect) langSelect.value = state.lang;
      translatePage();
      updateTimeAndGreeting();
      loadWeather();
      loadQuote();

      // Revert Theme
      state.theme = state.settings.theme || 'system';
      const themeSelect = document.getElementById('settings-theme');
      if (themeSelect) themeSelect.value = state.theme;
      applyTheme();

      // Revert Primary Color
      const savedColor = state.settings.primaryColor || 'blue';
      applyPrimaryColor(savedColor);
      const colorInput = document.getElementById('settings-primary-color');
      if (colorInput) colorInput.value = savedColor;
      updateSwatchActiveState(savedColor);

      // Revert URLs
      const wUrlInput = document.getElementById('settings-weather-url');
      if (wUrlInput) wUrlInput.value = state.settings.weatherUrl || '';
      const cUrlInput = document.getElementById('settings-world-clock-url');
      if (cUrlInput) cUrlInput.value = state.settings.worldClockUrl || '';
    }
  });

  // Storage Mode Change Handler
  document.getElementById('settings-storage-mode').addEventListener('change', (e) => {
    if (e.target.value === 'file') {
      document.getElementById('file-sync-settings').classList.remove('hidden');
      if (fileHandle) {
        document.getElementById('sync-file-name').textContent = fileHandle.name;
      } else {
        document.getElementById('sync-file-name').textContent = translations[state.lang]['no-file-selected'];
      }
    } else {
      document.getElementById('file-sync-settings').classList.add('hidden');
    }
  });

  // Select File Button Handler
  document.getElementById('btn-select-file').addEventListener('click', async () => {
    if (!('showOpenFilePicker' in window)) {
      alert(translations[state.lang]['file-unsupported']);
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
        fileHandle = handle;
        await saveFileHandle(handle);
        document.getElementById('sync-file-name').textContent = handle.name;
        
        // Read file contents
        const fileData = await readDataFromFile();
        if (fileData) {
          // File has data, offer to load it or overwrite it
          const confirmLoad = confirm(
            state.lang === 'es' 
              ? 'El archivo seleccionado contiene datos. ¿Deseas cargarlos y reemplazar los datos actuales en el navegador?' 
              : 'The selected file contains data. Do you want to load it and overwrite current browser data?'
          );
          if (confirmLoad) {
            if (fileData.todos) state.todos = fileData.todos;
            if (fileData.settings) {
              state.settings = { ...state.settings, ...fileData.settings, storageMode: 'file' };
            }
            if (state.settings.primaryColor) applyPrimaryColor(state.settings.primaryColor);
            renderTodos();
            translatePage();
            updateTimeAndGreeting();
            loadWeather();
            fetchGitHub();
            fetchBitbucket();
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

  // Settings Tabs Switch
  const tabButtons = document.querySelectorAll('.settings-tabs .tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = btn.getAttribute('data-tab');
      
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
      document.getElementById(targetTab).classList.add('active');
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
        nameInput.setCustomValidity(state.lang === 'es' ? 'Por favor, rellene este campo.' : 'Please fill out this field.');
        nameInput.reportValidity();
        nameInput.addEventListener('input', () => {
          nameInput.classList.remove('invalid-field');
          nameInput.setCustomValidity('');
        }, { once: true });
        return;
      }
      if (!dateInput.value) {
        dateInput.classList.add('invalid-field');
        dateInput.setCustomValidity(state.lang === 'es' ? 'Por favor, rellene este campo.' : 'Please fill out this field.');
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

  // Save Settings Form
  document.getElementById('settings-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    isSettingsFormSaved = true;
    state.settings.lang = document.getElementById('settings-lang').value;
    state.settings.city = document.getElementById('settings-city').value.trim();
    state.settings.theme = document.getElementById('settings-theme').value;
    const colorInput = document.getElementById('settings-primary-color');
    if (colorInput) {
      state.settings.primaryColor = colorInput.value;
      applyPrimaryColor(state.settings.primaryColor);
    }
    
    state.theme = state.settings.theme;
    
    const newStorageMode = document.getElementById('settings-storage-mode').value;
    if (newStorageMode !== 'file') {
      fileHandle = null;
      await clearFileHandle();
    }
    state.settings.storageMode = newStorageMode;
    
    state.settings.googleClientId = document.getElementById('google-client-id').value.trim();
    state.settings.githubToken = document.getElementById('github-token').value.trim();
    state.settings.githubUsername = document.getElementById('github-username').value.trim();
    state.settings.bitbucketWorkspace = document.getElementById('bitbucket-workspace').value.trim();
    state.settings.bitbucketUsername = document.getElementById('bitbucket-username').value.trim();
    state.settings.bitbucketToken = document.getElementById('bitbucket-token').value.trim();
    state.settings.jiraHost = document.getElementById('jira-host').value.trim();
    state.settings.jiraEmail = document.getElementById('jira-email').value.trim();
    state.settings.jiraToken = document.getElementById('jira-token').value.trim();
    state.settings.worldClockTz = document.getElementById('settings-world-clock-tz').value;
    state.settings.worldClockLabel = document.getElementById('settings-world-clock-label').value.trim();
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
    state.settings.showWeather = document.getElementById('settings-show-weather').checked;
    state.settings.showWorldClock = document.getElementById('settings-show-world-clock').checked;
    state.settings.showCountdowns = document.getElementById('settings-show-countdowns').checked;
    state.settings.showTasks = document.getElementById('settings-show-tasks').checked;

    state.lang = state.settings.lang;

    await saveSettings();
    updateOrganizerVisibility();
    
    // If we just toggled file-sync on, let's initialize it
    if (state.settings.storageMode === 'file') {
      await initializeFileSync();
    }

    applyTheme();
    translatePage();
    updateTimeAndGreeting();
    loadWeather();
    
    // Refresh integrations
    fetchGitHub();
    fetchBitbucket();
    fetchJira();

    if (state.settings.googleClientId) {
      initGoogleOAuth();
    }

    settingsModal.close();
  });

  // Google OAuth Login Action
  document.getElementById('google-login-btn').addEventListener('click', () => {
    if (!state.settings.googleClientId) {
      alert(state.lang === 'es' ? 'Por favor, configura primero tu Google Client ID.' : 'Please configure your Google Client ID first.');
      return;
    }
    if (googleTokenClient) {
      googleTokenClient.requestAccessToken();
    } else {
      initGoogleOAuth();
      googleTokenClient.requestAccessToken();
    }
  });

  // Google OAuth Logout Action
  document.getElementById('google-logout-btn').addEventListener('click', () => {
    if (state.googleClientToken) {
      google.accounts.oauth2.revokeToken(state.googleClientToken, () => {});
    }
    state.googleClientToken = null;
    sessionStorage.removeItem('google_access_token');
    updateGoogleAuthStatus(false);
    
    // Clear Google components
    document.getElementById('google-events-container').innerHTML = `<p class="empty-msg">${translations[state.lang]['no-events']}</p>`;
    document.getElementById('gmail-container').innerHTML = `<p class="empty-msg">${translations[state.lang]['no-emails']}</p>`;
    document.getElementById('weekly-events-container').innerHTML = `<p class="empty-msg">${translations[state.lang]['no-weekly-events']}</p>`;
    const gT1 = document.getElementById('gtasks-today');
    const gT2 = document.getElementById('gtasks-week');
    if (gT1) gT1.remove();
    if (gT2) gT2.remove();
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
      activeFilter = btn.getAttribute('data-filter');
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
    const text = document.getElementById('edit-task-text').value.trim();
    const date = document.getElementById('edit-task-date').value;
    const priority = document.getElementById('edit-task-priority').value;

    updateTodo(id, text, date, priority);
    editModal.close();
  });
}

function openEditModal(todo) {
  document.getElementById('edit-task-id').value = todo.id;
  document.getElementById('edit-task-text').value = todo.text;
  document.getElementById('edit-task-date').value = todo.dueDate || '';
  document.getElementById('edit-task-priority').value = todo.priority;
  document.getElementById('edit-task-modal').showModal();
}

// -------------------------------------------------------------
// UTILITIES AND HELPERS
// -------------------------------------------------------------
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateShort(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const d = new Date(dateStr + 'T00:00:00');
  const locale = state.lang === 'es' ? 'es-ES' : 'en-US';
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
}

function formatEventTime(evt) {
  if (evt.start.date) {
    return state.lang === 'es' ? 'Todo el día' : 'All day';
  }
  const date = new Date(evt.start.dateTime);
  const options = { hour: '2-digit', minute: '2-digit', hour12: false };
  return date.toLocaleTimeString(state.lang === 'es' ? 'es-ES' : 'en-US', options);
}

// -------------------------------------------------------------
// APP INITIALIZATION
// -------------------------------------------------------------
async function init() {
  await loadState();
  applyTheme();
  translatePage();
  updateTimeAndGreeting();
  setupEventListeners();
  
  // Real-time Clock tick
  setInterval(updateTimeAndGreeting, 60000);

  // Load weather and quotes
  loadWeather();
  loadQuote();

  // Render initial tasks
  renderTodos();

  // Render initial countdowns
  renderCountdowns();
  updateNotesBadge();

  // Fetch API data for configured integrations
  fetchGitHub();
  fetchBitbucket();
  fetchJira();

  // If Client ID is present, wait and load Google Auth
  if (state.settings.googleClientId) {
    setTimeout(initGoogleOAuth, 1000);
  }
}

// Start application
window.addEventListener('DOMContentLoaded', init);
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (state.theme === 'system') applyTheme();
});
