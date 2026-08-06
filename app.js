// Internationalization (i18n) Dictionary
const translations = {
  en: {
    "col-today": "Today",
    "col-week": "This Week",
    "col-work": "Work",
    "col-tasks": "Workspace",
    "tasks-card-title": "My Tasks",
    "calendar-events": "Events & Meetings",
    "urgent-emails": "Urgent Emails (Gmail)",
    "pending-prs": "Pull Requests",
    "weekly-schedule": "Weekly Schedule",
    "jira-tasks": "Jira Assigned Tasks",
    "todo-placeholder": "Add a new task...",
    "countdown-placeholder": "Event title...",
    "col-countdowns": "My Events",
    "countdown-empty": "No events configured.",
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
    "label-show-countdowns": "Show Events",
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
    "google-login-personal": "Log In (Personal)",
    "google-login-work": "Log In (Work)",
    "google-status-personal": "Personal Account:",
    "google-status-work": "Work Account:",
    "google-color": "Account Color:",
    "badge-personal": "Personal",
    "badge-work": "Work",
    "github-settings": "GitHub Configuration",
    "label-token": "Personal Access Token (PAT)",
    "label-username": "GitHub Username",
    "bitbucket-settings": "Bitbucket Configuration",
    "label-workspace": "Workspace ID",
    "label-bb-username": "Atlassian Account Email",
    "label-bb-token": "API Token",
    "jira-cors-warning": "Note: Jira API requires CORS. Ensure you use a browser extension to bypass CORS (e.g. 'Allow CORS' extension) when running locally.",
    "label-jira-host": "Jira Host URL",
    "label-jira-email": "Atlassian Account Email",
    "label-jira-token": "Jira API Token",
    "save-settings": "Save Settings",
    "edit-task-title": "Edit Task",
    "edit-event-title-modal": "Edit Event",
    "add-countdown-title": "Add New Event",
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
    "col-work": "Trabajo",
    "col-tasks": "Espacio de Trabajo",
    "tasks-card-title": "Mis Tareas",
    "calendar-events": "Eventos y Reuniones",
    "urgent-emails": "Correos Urgentes (Gmail)",
    "pending-prs": "Pull Requests",
    "weekly-schedule": "Agenda Semanal",
    "jira-tasks": "Tareas de Jira",
    "todo-placeholder": "Añadir nueva tarea...",
    "countdown-placeholder": "Nombre del evento...",
    "col-countdowns": "Mis Eventos",
    "countdown-empty": "No hay eventos configurados.",
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
    "label-show-countdowns": "Mostrar Eventos",
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
    "google-login-personal": "Iniciar Sesión (Personal)",
    "google-login-work": "Iniciar Sesión (Trabajo)",
    "google-status-personal": "Cuenta Personal:",
    "google-status-work": "Cuenta de Trabajo:",
    "google-color": "Color de Cuenta:",
    "badge-personal": "Personal",
    "badge-work": "Trabajo",
    "github-settings": "Configuración de GitHub",
    "label-token": "Token de Acceso Personal (PAT)",
    "label-username": "Usuario de GitHub",
    "bitbucket-settings": "Configuración de Bitbucket",
    "label-workspace": "ID del Espacio de Trabajo",
    "label-bb-username": "Email de Cuenta Atlassian",
    "label-bb-token": "Token de API",
    "jira-cors-warning": "Nota: La API de Jira requiere CORS. Asegúrate de usar una extensión del navegador para omitir CORS (como 'Allow CORS') al ejecutarlo localmente.",
    "label-jira-host": "URL del Servidor Jira",
    "label-jira-email": "Correo de Atlassian",
    "label-jira-token": "Token de API de Jira",
    "save-settings": "Guardar Configuración",
    "edit-task-title": "Editar Tarea",
    "edit-event-title-modal": "Editar Evento",
    "add-countdown-title": "Añadir nuevo evento",
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
  googlePersonalToken: sessionStorage.getItem('google_personal_token') || null,
  googleWorkToken: sessionStorage.getItem('google_work_token') || null,
  googlePersonalEmail: sessionStorage.getItem('google_personal_email') || null,
  googleWorkEmail: sessionStorage.getItem('google_work_email') || null,
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
    jiraToken: '',
    oooActive: false,
    oooUntil: null,
    hideJiraOoo: false,
    hideGithubOoo: false,
    hideBitbucketOoo: false,
    hideGitlabOoo: false,
    gitlabHost: 'https://gitlab.com',
    gitlabToken: '',
    gitlabUsername: ''
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

  // Check Out of Office (OOO) expiration
  if (state.settings.oooActive && state.settings.oooUntil) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const oooUntilDate = new Date(state.settings.oooUntil + 'T00:00:00');
    if (today >= oooUntilDate) {
      state.settings.oooActive = false;
      state.settings.oooUntil = null;
      localStorage.setItem('dashboard_settings', JSON.stringify(state.settings));
    }
  }

  updateOooBadges();

  applyPrimaryColor(state.settings.primaryColor);
  applyAccountColors();

  const storedTodos = localStorage.getItem('todos');
  if (storedTodos) {
    state.todos = JSON.parse(storedTodos);
  }

  // Countdowns are now customEvents from settings, no local countdowns needed

  // Initialize file sync if enabled
  if (state.settings.storageMode === 'file') {
    await initializeFileSync();
  }

  // Clean up completed todos older than 7 days upon loading
  await cleanupOldCompletedTodos();

  // Initialize organizer visibility settings
  updateOrganizerVisibility();
}

function updateOooBadges() {
  const active = state.settings.oooActive === true;
  const badgeToday = document.getElementById('ooo-badge-today');
  const badgeWeek = document.getElementById('ooo-badge-week');
  const badgeWork = document.getElementById('ooo-badge-work');
  if (badgeToday) badgeToday.classList.toggle('hidden', !active);
  if (badgeWeek) badgeWeek.classList.toggle('hidden', !active);
  if (badgeWork) badgeWork.classList.toggle('hidden', !active);
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

  if (todayEvents.length > 0) {
    const names = todayEvents.map(e => e.name).join(', ');
    const labelText = state.lang === 'es' 
      ? `🎉 Hoy: ¡${names}! 🎂`
      : `🎉 Today: ${names}! 🎂`;
    activeChipsHTML += `<div class="event-banner today">${escapeHtml(labelText)}</div>`;
    
    const remainingCount = events.length - todayEvents.length;
    if (remainingCount > 0) {
      const moreText = state.lang === 'es' ? `+${remainingCount} más` : `+${remainingCount} more`;
      activeChipsHTML += `<div class="event-banner more-chip">${escapeHtml(moreText)}</div>`;
    }
  } else if (pastEvents.length > 0) {
    pastEvents.sort((a, b) => a.daysAgo - b.daysAgo);
    const closestPast = pastEvents[0];
    const labelText = state.lang === 'es'
      ? `⚠️ Evento pasado: ${closestPast.name} (hace ${closestPast.daysAgo} ${closestPast.daysAgo === 1 ? 'día' : 'días'})`
      : `⚠️ Past event: ${closestPast.name} (${closestPast.daysAgo} ${closestPast.daysAgo === 1 ? 'day' : 'days'} ago)`;
    activeChipsHTML += `<div class="event-banner past-warning">${escapeHtml(labelText)}</div>`;
    
    const remainingCount = events.length - 1;
    if (remainingCount > 0) {
      const moreText = state.lang === 'es' ? `+${remainingCount} más` : `+${remainingCount} more`;
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
    if (state.lang === 'es') {
      timeText = closest.daysLeft === 1 ? 'mañana' : `en ${closest.daysLeft} días`;
    } else {
      timeText = closest.daysLeft === 1 ? 'tomorrow' : `in ${closest.daysLeft} days`;
    }
    const labelText = `${icon} ${closest.name} (${timeText})`;
    activeChipsHTML += `<div class="event-banner ${bannerClass}">${escapeHtml(labelText)}</div>`;
    
    const remainingCount = upcomingEvents.length - 1;
    if (remainingCount > 0) {
      const moreText = state.lang === 'es' ? `+${remainingCount} más` : `+${remainingCount} more`;
      activeChipsHTML += `<div class="event-banner more-chip">${escapeHtml(moreText)}</div>`;
    }
  }

  container.innerHTML = activeChipsHTML;
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentYear = today.getFullYear();

  sortedEvents.forEach((evt) => {
    const li = document.createElement('li');
    
    const infoDiv = document.createElement('div');
    infoDiv.className = 'event-item-info';
    
    const nameSpan = document.createElement('span');
    nameSpan.className = 'event-item-name';
    nameSpan.textContent = evt.name;
    
    const dateRow = document.createElement('div');
    dateRow.style.display = 'flex';
    dateRow.style.alignItems = 'center';
    dateRow.style.gap = '0.5rem';
    
    const dateSpan = document.createElement('span');
    dateSpan.className = 'event-item-date';
    const [y, m, d] = evt.date.split('-');
    const dateObj = new Date(y, parseInt(m, 10) - 1, d);
    dateSpan.textContent = dateObj.toLocaleDateString(state.lang === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'short' });
    
    dateRow.appendChild(dateSpan);
    
    const eventDateThisYear = new Date(currentYear, parseInt(m, 10) - 1, parseInt(d, 10));
    const isOverdue = eventDateThisYear < today && !(today.getMonth() === parseInt(m, 10) - 1 && today.getDate() === parseInt(d, 10));
    if (isOverdue) {
      const overdueBadge = document.createElement('span');
      overdueBadge.className = 'event-overdue-badge';
      overdueBadge.textContent = state.lang === 'es' ? 'Vencido' : 'Overdue';
      dateRow.appendChild(overdueBadge);
    }

    infoDiv.appendChild(nameSpan);
    infoDiv.appendChild(dateRow);
    
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
  let fullGreeting = greetingText;
  if (state.settings.oooActive) {
    const oooEmojis = ['🏝️', '🏖️', '🍹', '🌊', '⛺', '🌴'];
    const emoji = oooEmojis[(now.getDate() + now.getMonth()) % oooEmojis.length];
    fullGreeting = `${greetingText} ${emoji}`;
  }
  document.getElementById('greeting').textContent = `${fullGreeting}`;

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

// Personal & Work Custom Colors Management
function applyAccountColors() {
  const isDark = document.documentElement.classList.contains('dark');
  const colorMap = {
    blue: isDark ? '#60a5fa' : '#1e70e0',
    indigo: '#6366f1',
    purple: isDark ? '#a78bfa' : '#7c3aed',
    pink: '#ec4899',
    red: '#ef4444',
    orange: '#f97316',
    green: '#10b981',
    teal: '#06b6d4',
    slate: '#64748b',
    black: isDark ? '#e4e4e7' : '#18181b'
  };

  const personal = state.settings.personalColor || 'blue';
  const work = state.settings.workColor || 'black';

  document.documentElement.style.setProperty('--personal-color', colorMap[personal] || colorMap.blue);
  document.documentElement.style.setProperty('--work-color', colorMap[work] || colorMap.black);
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

function updateAccountSwatchActiveState(containerId, selectedColor) {
  const swatches = document.querySelectorAll(`#${containerId} .color-swatch-btn`);
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
  
  applyAccountColors();
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

  const pendingCount = state.todos.filter(todo => !todo.completed).length;
  const pendingBtn = document.querySelector('.filter-btn[data-filter="pending"]');
  if (pendingBtn) {
    const baseText = translations[state.lang]['filter-pending'] || 'Pending';
    if (pendingCount > 0) {
      pendingBtn.innerHTML = `${baseText} <span class="filter-badge">${pendingCount}</span>`;
    } else {
      pendingBtn.textContent = baseText;
    }
  }
  
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
  }
  if (dashboardGrid) {
    dashboardGrid.classList.toggle('two-cols', colTasksHidden);
  }
}

// ------------------------------------------------------------
// COUNTDOWNS
// ------------------------------------------------------------

function renderCountdowns() {
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

    if (isOverdue) {
      daysLabel = state.lang === 'es' ? 'Vencido' : 'Overdue';
      badgeHTML = `<span class="event-overdue-badge" style="margin-left: 0;">${daysLabel}</span>`;
      
      const timeDiff = todayMs - eventDateThisYear.getTime();
      const daysAgo = Math.floor(timeDiff / (1000 * 3600 * 24));
      relativeText = state.lang === 'es'
        ? `hace ${daysAgo} ${daysAgo === 1 ? 'día' : 'días'}`
        : `${daysAgo} ${daysAgo === 1 ? 'day' : 'days'} ago`;
    } else {
      const diffTime = eventDateThisYear.getTime() - todayMs;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let badgeClass = '';
      if (diffDays === 0) {
        daysLabel = state.lang === 'es' ? 'Hoy' : 'Today';
        badgeClass = 'countdown-badge-amber'; // Header banner today colors (orange/yellow)
        relativeText = state.lang === 'es' ? 'hoy' : 'today';
      } else if (diffDays < 7) {
        daysLabel = state.lang === 'es' ? `En ${diffDays} d` : `In ${diffDays} d`;
        badgeClass = 'countdown-badge-red'; // Header banner soon colors (<7 days: red)
        relativeText = state.lang === 'es' ? `en ${diffDays} días` : `in ${diffDays} days`;
      } else if (diffDays < 31) {
        daysLabel = state.lang === 'es' ? `En ${diffDays} d` : `In ${diffDays} d`;
        badgeClass = 'countdown-badge-amber'; // Header banner today colors (7 to 30 days: orange/yellow)
        relativeText = state.lang === 'es' ? `en ${diffDays} días` : `in ${diffDays} days`;
      } else {
        daysLabel = state.lang === 'es' ? `En ${diffDays} d` : `In ${diffDays} d`;
        badgeClass = 'countdown-badge-neutral'; // Header banner upcoming colors (31+ days: neutral)
        relativeText = state.lang === 'es' ? `en ${diffDays} días` : `in ${diffDays} days`;
        isFarFuture = true;
      }
      badgeHTML = `<span class="countdown-badge ${badgeClass}">${daysLabel}</span>`;
    }

    const titleClass = 'countdown-title'; // Overdue events do not get line-through strikethrough
    const formattedDate = eventDateThisYear.toLocaleDateString(state.lang === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'short' });
    const fullMonthDate = eventDateThisYear.toLocaleDateString(state.lang === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'long' });
    const tooltipText = evt.name + `\n${fullMonthDate} (${relativeText})`;

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
        <button class="btn-item-action edit-countdown-btn" data-id="${evt.id}" title="${state.lang === 'es' ? 'Editar' : 'Edit'}">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
        </button>
        <button class="btn-item-action delete-countdown-btn" data-id="${evt.id}" title="${state.lang === 'es' ? 'Eliminar' : 'Delete'}">
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
}

async function addCountdown(name, date) {
  state.settings.customEvents = state.settings.customEvents || [];
  state.settings.customEvents.push({ id: Date.now().toString(), name, date });
  await saveSettings();
  renderCountdowns();
  renderSettingsEventsList();
  updateUpcomingEventBanner();
}

let countdownIdToDelete = null;

function deleteCountdown(id) {
  countdownIdToDelete = id;
  const events = state.settings.customEvents || [];
  const countdown = events.find(c => c.id === id);
  if (!countdown) return;

  const modal = document.getElementById('confirm-delete-modal');
  if (modal) {
    const dict = translations[state.lang];
    confirmActionType = 'delete-countdown';
    modal.querySelector('[data-i18n="confirm-delete-title"]').textContent = state.lang === 'es' ? 'Eliminar Evento' : 'Delete Event';
    const descEl = modal.querySelector('[data-i18n="confirm-delete-desc"]');
    if (descEl) {
      descEl.innerHTML = state.lang === 'es'
        ? `¿Estás seguro de que quieres eliminar el evento: <strong>"${escapeHtml(countdown.name)}"</strong>?`
        : `Are you sure you want to delete the event: <strong>"${escapeHtml(countdown.name)}"</strong>?`;
    }
    modal.querySelector('[data-i18n="cancel-btn"]').textContent = dict['cancel-btn'];
    modal.querySelector('[data-i18n="delete-btn"]').textContent = dict['delete-btn'];
    modal.showModal();
  }
}

function openEditEventModal(evt) {
  const modal = document.getElementById('edit-event-modal');
  if (!modal) return;
  document.getElementById('edit-event-id').value = evt.id;
  document.getElementById('edit-event-name-input').value = evt.name;
  document.getElementById('edit-event-date-input').value = evt.date;
  modal.showModal();
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
  const jiraBadge = document.getElementById('jira-count-badge');
  if (jiraBadge) {
    jiraBadge.classList.add('hidden');
  }

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

    if (jiraBadge) {
      if (data.issues && data.issues.length > 0) {
        jiraBadge.textContent = data.issues.length;
        jiraBadge.classList.remove('hidden');
      } else {
        jiraBadge.classList.add('hidden');
      }
    }

    if (!data.issues || data.issues.length === 0) {
      container.innerHTML = `<p class="empty-msg">${translations[state.lang]['no-jira-tasks']}</p>`;
      return;
    }

    container.innerHTML = data.issues.map(issue => {
      const summary = issue.fields.summary;
      const key = issue.key;
      const url = `${domain}/browse/${key}`;
      const priority = issue.fields.priority ? issue.fields.priority.name : 'medium';
      const titleText = `[${key}] ${summary}`;
      const statusText = issue.fields.status.name;
      return `
        <a href="${url}" target="_blank" class="integration-item" data-tooltip="${escapeHtml(titleText)}\nStatus: ${escapeHtml(statusText)}\nPriority: ${escapeHtml(priority)}">
          <span class="item-title">[${key}] ${escapeHtml(summary)}</span>
          <div class="item-meta">
            <span>${escapeHtml(statusText)}</span>
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
async function fetchAllPRs() {
  const container = document.getElementById('prs-container');
  const prsBadge = document.getElementById('prs-count-badge');
  if (prsBadge) prsBadge.classList.add('hidden');
  
  if (state.settings.showGit === false) {
    return;
  }

  let gitHiddenByOoo = false;
  const hasGithub = !!(state.settings.githubToken && state.settings.githubUsername);
  const hasBitbucket = !!(state.settings.bitbucketToken && state.settings.bitbucketUsername && state.settings.bitbucketWorkspace);
  const hasGitlab = !!(state.settings.gitlabToken && state.settings.gitlabUsername);
  
  if (state.settings.oooActive && (hasGithub || hasBitbucket || hasGitlab)) {
    const activeGithub = hasGithub && !state.settings.hideGithubOoo;
    const activeBitbucket = hasBitbucket && !state.settings.hideBitbucketOoo;
    const activeGitlab = hasGitlab && !state.settings.hideGitlabOoo;
    if (!activeGithub && !activeBitbucket && !activeGitlab) {
      gitHiddenByOoo = true;
    }
  }

  if (gitHiddenByOoo) {
    container.innerHTML = `<p class="empty-msg">${state.lang === 'es' ? 'Out of Office Activo' : 'Out of Office Active'}</p>`;
    return;
  }

  if (!hasGithub && !hasBitbucket && !hasGitlab) {
    const configLinkText = state.lang === 'es' ? 'Configurar integración de Git' : 'Configure Git Integration';
    container.innerHTML = `<p class="empty-msg" style="margin: 0.5rem 0;"><a href="#" onclick="event.preventDefault(); window.openSettingsGitTab();" style="color: var(--accent); text-decoration: underline; font-weight: 500;">${configLinkText}</a></p>`;
    return;
  }

  let prList = [];

  // GitHub Fetch
  if (hasGithub && !(state.settings.oooActive && state.settings.hideGithubOoo)) {
    try {
      const qReview = encodeURIComponent(`is:pr is:open review-requested:${state.settings.githubUsername}`);
      const qAssign = encodeURIComponent(`is:pr is:open assignee:${state.settings.githubUsername}`);
      
      const headers = {
        'Authorization': `token ${state.settings.githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      };

      const [resReview, resAssign] = await Promise.all([
        fetch(`https://api.github.com/search/issues?q=${qReview}&per_page=5`, { headers }).then(r => r.ok ? r.json() : { items: [] }),
        fetch(`https://api.github.com/search/issues?q=${qAssign}&per_page=5`, { headers }).then(r => r.ok ? r.json() : { items: [] })
      ]);

      const itemsMap = new Map();
      (resReview.items || []).forEach(item => itemsMap.set(item.id, item));
      (resAssign.items || []).forEach(item => itemsMap.set(item.id, item));

      itemsMap.forEach(pr => {
        const repo = pr.repository_url.split('/').slice(-1)[0];
        prList.push({
          title: pr.title,
          url: pr.html_url,
          repo: repo,
          number: pr.number,
          source: 'GitHub'
        });
      });
    } catch (e) {
      console.error("Error fetching GitHub PRs:", e);
    }
  }

  // Bitbucket Fetch
  if (hasBitbucket && !(state.settings.oooActive && state.settings.hideBitbucketOoo)) {
    try {
      const token = state.settings.bitbucketToken;
      const username = state.settings.bitbucketUsername;
      const isBasic = token.startsWith('ATAT') || token.startsWith('ATBB') || (username && username.includes('@'));
      const authHeader = isBasic ? 'Basic ' + btoa(`${username}:${token}`) : `Bearer ${token}`;

      // 1. Get the 10 most recently updated repositories in the workspace
      const reposRes = await fetch(`https://api.bitbucket.org/2.0/repositories/${state.settings.bitbucketWorkspace}?pagelen=10&sort=-updated_on`, {
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json'
        }
      });
      if (reposRes.ok) {
        const reposData = await reposRes.json();
        const repos = reposData.values || [];

        // 2. Fetch open pull requests for all repositories in parallel
        const prPromises = repos.map(async (repo) => {
          try {
            const prsRes = await fetch(`https://api.bitbucket.org/2.0/repositories/${state.settings.bitbucketWorkspace}/${repo.slug}/pullrequests?state=OPEN`, {
              headers: {
                'Authorization': authHeader,
                'Accept': 'application/json'
              }
            });
            if (prsRes.ok) {
              const prsData = await prsRes.json();
              return prsData.values || [];
            }
            return [];
          } catch (e) {
            console.error(`Error fetching PRs for ${repo.slug}:`, e);
            return [];
          }
        });

        const allRepoPRs = await Promise.all(prPromises);
        const openPRs = allRepoPRs.flat();

        // 3. Filter and map PRs (Author, Reviewer, or has open tasks/comments that block it)
        openPRs.forEach(pr => {
          const isAuthor = pr.author && (pr.author.nickname === state.settings.bitbucketUsername || pr.author.username === state.settings.bitbucketUsername);
          const isReviewer = pr.reviewers && pr.reviewers.some(r => r.nickname === state.settings.bitbucketUsername || r.username === state.settings.bitbucketUsername);
          const hasOpenTasks = pr.task_count > 0;

          if (isAuthor || isReviewer || hasOpenTasks) {
            let statusLabel = '';
            if (isReviewer) {
              const hasApproved = pr.participants && pr.participants.some(p => p.approved && (p.user.nickname === state.settings.bitbucketUsername || p.user.username === state.settings.bitbucketUsername));
              statusLabel = hasApproved ? (state.lang === 'es' ? 'Aprobado' : 'Approved') : (state.lang === 'es' ? 'Revisar' : 'Needs Review');
            } else if (isAuthor) {
              statusLabel = state.lang === 'es' ? 'Autor' : 'Author';
            }
            
            if (hasOpenTasks) {
              statusLabel += (statusLabel ? ' | ' : '') + (state.lang === 'es' ? 'Tareas pendientes' : 'Tasks open');
            }

            prList.push({
              title: `[Bitbucket] ${pr.title}${statusLabel ? ` (${statusLabel})` : ''}`,
              url: pr.links.html.href,
              repo: pr.source.repository.name,
              number: pr.id,
              source: 'Bitbucket'
            });
          }
        });
      }
    } catch (e) {
      console.error("Error fetching Bitbucket PRs:", e);
    }
  }

  // GitLab Fetch
  if (hasGitlab && !(state.settings.oooActive && state.settings.hideGitlabOoo)) {
    try {
      const host = (state.settings.gitlabHost || 'https://gitlab.com').replace(/\/$/, "");
      const token = state.settings.gitlabToken;
      const username = state.settings.gitlabUsername;
      
      const assigneeUrl = `${host}/api/v4/merge_requests?state=opened&assignee_username=${encodeURIComponent(username)}`;
      const reviewerUrl = `${host}/api/v4/merge_requests?state=opened&reviewer_username=${encodeURIComponent(username)}`;
      
      const headers = { 'PRIVATE-TOKEN': token };
      
      const [res1, res2] = await Promise.all([
        fetch(assigneeUrl, { headers }).then(r => r.ok ? r.json() : []),
        fetch(reviewerUrl, { headers }).then(r => r.ok ? r.json() : [])
      ]);
      
      const uniqueMRs = new Map();
      [...res1, ...res2].forEach(mr => {
        uniqueMRs.set(mr.id, mr);
      });

      uniqueMRs.forEach(mr => {
        let repo = String(mr.project_id);
        try {
          const pathParts = mr.web_url.split('/');
          const idx = pathParts.indexOf('-');
          if (idx !== -1) {
            repo = pathParts.slice(3, idx).join('/');
          }
        } catch (e) {}

        prList.push({
          title: `[GitLab] ${mr.title}`,
          url: mr.web_url,
          repo: repo,
          number: mr.iid,
          source: 'GitLab'
        });
      });
    } catch (e) {
      console.error("Error fetching GitLab MRs:", e);
    }
  }

  // Render PRs
  if (prList.length === 0) {
    container.innerHTML = `<p class="empty-msg">${translations[state.lang]['no-prs']}</p>`;
    if (prsBadge) prsBadge.classList.add('hidden');
    return;
  }

  container.innerHTML = prList.map(pr => {
    return `
      <a href="${pr.url}" target="_blank" class="integration-item" data-tooltip="${escapeHtml(pr.title)}\nSource: ${pr.source}\nRepo: ${escapeHtml(pr.repo)}\nPR/MR: #${pr.number}">
        <span class="item-title">${escapeHtml(pr.title)}</span>
        <div class="item-meta">
          <span>${escapeHtml(pr.repo)}</span>
          <span class="item-badge">#${pr.number}</span>
        </div>
      </a>
    `;
  }).join('');

  if (prsBadge && prList.length > 0) {
    prsBadge.textContent = prList.length;
    prsBadge.classList.remove('hidden');
  }
}

const fetchGitHub = fetchAllPRs;
const fetchBitbucket = fetchAllPRs;
const fetchGitLab = fetchAllPRs;
function showInputErrorFeedback(inputEl, errorMessage) {
  if (inputEl.classList.contains('invalid-field')) return;
  inputEl.classList.add('invalid-field');
  inputEl.focus();

  let errorEl = inputEl.nextElementSibling;
  if (!errorEl || !errorEl.classList.contains('field-error-msg')) {
    errorEl = document.createElement('span');
    errorEl.className = 'field-error-msg';
    errorEl.style.color = 'var(--danger)';
    errorEl.style.fontSize = '0.75rem';
    errorEl.style.marginTop = '0.25rem';
    errorEl.style.display = 'block';
    inputEl.parentNode.insertBefore(errorEl, inputEl.nextSibling);
  }
  errorEl.textContent = errorMessage;

  setTimeout(() => {
    inputEl.classList.remove('invalid-field');
    errorEl.remove();
  }, 2500);
}

function openSettingsGoogleTab() {
  const toggle = document.getElementById('settings-toggle');
  if (toggle) {
    toggle.click();
    setTimeout(() => {
      const googleBtn = document.querySelector('.tab-btn[data-tab="tab-google"]');
      if (googleBtn) googleBtn.click();
    }, 50);
  }
}
window.openSettingsGoogleTab = openSettingsGoogleTab;

function openSettingsGitTab() {
  const toggle = document.getElementById('settings-toggle');
  if (toggle) {
    toggle.click();
    setTimeout(() => {
      const gitBtn = document.querySelector('.tab-btn[data-tab="tab-git"]');
      if (gitBtn) gitBtn.click();
    }, 50);
  }
}
window.openSettingsGitTab = openSettingsGitTab;

// Google APIs Integrations (Gmail, Tasks, Calendar)
let googleTokenClient;
let googleLoginTarget = 'personal';

async function fetchGoogleUserEmail(token) {
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      return data.email;
    }
  } catch (e) {
    console.error("Failed to fetch user email", e);
  }
  return null;
}

function initGoogleOAuth() {
  updateGoogleAuthStatus();

  if (!state.googlePersonalToken && !state.googleWorkToken) {
    fetchGoogleCalendar();
    fetchGmail();
    fetchGoogleTasks();
  }

  if (typeof google === 'undefined' || !state.settings.googleClientId) {
    return;
  }

  googleTokenClient = google.accounts.oauth2.initTokenClient({
    client_id: state.settings.googleClientId,
    scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/tasks.readonly https://www.googleapis.com/auth/calendar.readonly',
    callback: async (response) => {
      if (response.error) {
        console.error(response.error);
        return;
      }
      
      const token = response.access_token;
      
      if (googleLoginTarget === 'personal') {
        state.googlePersonalToken = token;
        sessionStorage.setItem('google_personal_token', token);
        const email = await fetchGoogleUserEmail(token);
        if (email) {
          state.googlePersonalEmail = email;
          sessionStorage.setItem('google_personal_email', email);
        }
      } else {
        state.googleWorkToken = token;
        sessionStorage.setItem('google_work_token', token);
        const email = await fetchGoogleUserEmail(token);
        if (email) {
          state.googleWorkEmail = email;
          sessionStorage.setItem('google_work_email', email);
        }
      }
      
      // Keep googleClientToken for backward compatibility
      state.googleClientToken = state.googlePersonalToken || state.googleWorkToken;
      sessionStorage.setItem('google_access_token', state.googleClientToken || '');
      
      isRefreshingToken[googleLoginTarget] = false;
      updateGoogleAuthStatus();
      await fetchGoogleData();
    }
  });

  checkAndFetchGoogleEmails();
  
  updateGoogleAuthStatus();
  if (state.googlePersonalToken || state.googleWorkToken) {
    fetchGoogleData();
  } else {
    fetchGoogleCalendar();
    fetchGmail();
    fetchGoogleTasks();
  }
}

let isRefreshingToken = { personal: false, work: false };

function refreshGoogleToken(accountType) {
  if (isRefreshingToken[accountType]) return;
  if (typeof google === 'undefined' || !googleTokenClient) {
    console.warn("Google Client not initialized for refresh");
    return;
  }
  
  console.log(`Attempting silent token refresh for ${accountType}...`);
  isRefreshingToken[accountType] = true;
  googleLoginTarget = accountType;
  const emailHint = accountType === 'personal' ? state.googlePersonalEmail : state.googleWorkEmail;
  
  try {
    googleTokenClient.requestAccessToken({
      hint: emailHint || '',
      prompt: 'none'
    });
    setTimeout(() => { isRefreshingToken[accountType] = false; }, 8000);
  } catch (e) {
    console.error("Silent refresh failed", e);
    isRefreshingToken[accountType] = false;
  }
}

function handleInvalidToken(accountType) {
  console.warn(`Token expired (401) for ${accountType} account. Clearing token.`);
  if (accountType === 'personal') {
    state.googlePersonalToken = null;
    sessionStorage.removeItem('google_personal_token');
  } else {
    state.googleWorkToken = null;
    sessionStorage.removeItem('google_work_token');
  }
  state.googleClientToken = state.googlePersonalToken || state.googleWorkToken;
  sessionStorage.setItem('google_access_token', state.googleClientToken || '');
  
  updateGoogleAuthStatus();
}

async function checkAndFetchGoogleEmails() {
  let changed = false;
  if (state.googlePersonalToken && !state.googlePersonalEmail) {
    const email = await fetchGoogleUserEmail(state.googlePersonalToken);
    if (email) {
      state.googlePersonalEmail = email;
      sessionStorage.setItem('google_personal_email', email);
      changed = true;
    }
  }
  if (state.googleWorkToken && !state.googleWorkEmail) {
    const email = await fetchGoogleUserEmail(state.googleWorkToken);
    if (email) {
      state.googleWorkEmail = email;
      sessionStorage.setItem('google_work_email', email);
      changed = true;
    }
  }
  if (changed) {
    updateGoogleAuthStatus();
  }
}

function updateGoogleAuthStatus() {
  const dict = translations[state.lang];
  
  // Personal account status
  const personalStatusEl = document.getElementById('google-auth-status-personal');
  const personalLoginBtn = document.getElementById('google-login-btn-personal');
  const personalLogoutBtn = document.getElementById('google-logout-btn-personal');
  
  if (personalStatusEl && personalLoginBtn && personalLogoutBtn) {
    if (state.googlePersonalToken) {
      const emailStr = state.googlePersonalEmail ? ` (${state.googlePersonalEmail})` : '';
      personalStatusEl.textContent = `${dict['connected']}${emailStr}`;
      personalStatusEl.className = "auth-status connected";
      personalLoginBtn.classList.add('hidden');
      personalLogoutBtn.classList.remove('hidden');
    } else {
      personalStatusEl.textContent = dict['disconnected'];
      personalStatusEl.className = "auth-status disconnected";
      personalLoginBtn.classList.remove('hidden');
      personalLogoutBtn.classList.add('hidden');
    }
  }
  
  // Work account status
  const workStatusEl = document.getElementById('google-auth-status-work');
  const workLoginBtn = document.getElementById('google-login-btn-work');
  const workLogoutBtn = document.getElementById('google-logout-btn-work');
  
  if (workStatusEl && workLoginBtn && workLogoutBtn) {
    if (state.googleWorkToken) {
      const emailStr = state.googleWorkEmail ? ` (${state.googleWorkEmail})` : '';
      workStatusEl.textContent = `${dict['connected']}${emailStr}`;
      workStatusEl.className = "auth-status connected";
      workLoginBtn.classList.add('hidden');
      workLogoutBtn.classList.remove('hidden');
    } else {
      workStatusEl.textContent = dict['disconnected'];
      workStatusEl.className = "auth-status disconnected";
      workLoginBtn.classList.remove('hidden');
      workLogoutBtn.classList.add('hidden');
    }
  }

  // Update header status indicators (dots) for Events, Emails, and Weekly Schedule
  const personalClass = state.googlePersonalToken ? 'personal' : 'disconnected';
  const personalTooltip = state.googlePersonalToken 
    ? `${state.lang === 'es' ? 'Personal: Conectado' : 'Personal: Connected'} (${state.googlePersonalEmail || 'Google'})`
    : (state.lang === 'es' ? 'Personal: Desconectado' : 'Personal: Disconnected');
    
  const workClass = state.googleWorkToken ? 'work' : 'disconnected';
  const workTooltip = state.googleWorkToken 
    ? `${state.lang === 'es' ? 'Trabajo: Conectado' : 'Work: Connected'} (${state.googleWorkEmail || 'Google'})`
    : (state.lang === 'es' ? 'Trabajo: Desconectado' : 'Work: Disconnected');

  const indicatorsHTML = `
    <span class="status-dot ${personalClass}" title="${escapeHtml(personalTooltip)}"></span>
    <span class="status-dot ${workClass}" title="${escapeHtml(workTooltip)}"></span>
  `;

  const evInd = document.getElementById('google-events-status-indicators');
  const emInd = document.getElementById('google-emails-status-indicators');
  const wkInd = document.getElementById('google-weekly-status-indicators');

  if (evInd) evInd.innerHTML = indicatorsHTML;
  if (emInd) emInd.innerHTML = indicatorsHTML;
  if (wkInd) wkInd.innerHTML = indicatorsHTML;

  const settingsDotPers = document.getElementById('google-settings-dot-personal');
  const settingsDotWork = document.getElementById('google-settings-dot-work');

  if (settingsDotPers) {
    settingsDotPers.className = `status-dot ${personalClass}`;
  }
  if (settingsDotWork) {
    settingsDotWork.className = `status-dot ${workClass}`;
  }
}

async function fetchGoogleData() {
  const token = state.googlePersonalToken || state.googleWorkToken;
  if (!token) return;

  state.googleClientToken = token;

  // Run in parallel
  fetchGmail();
  fetchGoogleTasks();
  fetchGoogleCalendar();
}

async function fetchGmail() {
  const gmailCard = document.getElementById('gmail-card');
  if (state.settings.showGoogleEmails === false) {
    if (gmailCard) gmailCard.classList.add('hidden');
    return;
  }
  if (gmailCard) gmailCard.classList.remove('hidden');

  const container = document.getElementById('gmail-container');
  const emailsBadge = document.getElementById('emails-count-badge');
  if (emailsBadge) {
    emailsBadge.classList.add('hidden');
  }

  if (!state.googlePersonalToken && !state.googleWorkToken) {
    const configLinkText = state.lang === 'es' ? 'Configurar Gmail' : 'Configure Gmail';
    container.innerHTML = `<p class="empty-msg" style="margin: 0.5rem 0;"><a href="#" onclick="event.preventDefault(); window.openSettingsGoogleTab();" style="color: var(--accent); text-decoration: underline; font-weight: 500;">${configLinkText}</a></p>`;
    return;
  }

  async function fetchEmailsForAccount(token, type, email) {
    if (!token) return [];
    try {
      const res = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages?q=is:unread%20in:inbox&maxResults=5', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        if (res.status === 401) {
          handleInvalidToken(type);
        }
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      if (!data.messages || data.messages.length === 0) return [];

      const detailsPromises = data.messages.map(msg =>
        fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        })
      );
      const details = await Promise.all(detailsPromises);
      return details.map(item => ({ ...item, accountType: type, accountEmail: email }));
    } catch (e) {
      console.error(`Error fetching Gmail for ${type}:`, e);
      return [];
    }
  }

  try {
    const promises = [];
    if (state.googlePersonalToken) {
      promises.push(fetchEmailsForAccount(state.googlePersonalToken, 'personal', state.googlePersonalEmail));
    }
    if (state.googleWorkToken && !state.settings.oooActive) {
      promises.push(fetchEmailsForAccount(state.googleWorkToken, 'work', state.googleWorkEmail));
    }

    const results = await Promise.all(promises);
    const allEmails = results.flat();

    // Sort by internalDate (newest first)
    allEmails.sort((a, b) => {
      const aDate = parseInt(a.internalDate) || 0;
      const bDate = parseInt(b.internalDate) || 0;
      return bDate - aDate;
    });

    if (emailsBadge) {
      if (allEmails.length > 0) {
        emailsBadge.textContent = allEmails.length;
        emailsBadge.classList.remove('hidden');
      } else {
        emailsBadge.classList.add('hidden');
      }
    }

    if (allEmails.length === 0) {
      container.innerHTML = `<p class="empty-msg">${translations[state.lang]['no-emails']}</p>`;
      return;
    }

    container.innerHTML = allEmails.slice(0, 5).map(msg => {
      const headers = msg.payload.headers;
      const subjectHeader = headers.find(h => h.name.toLowerCase() === 'subject');
      const fromHeader = headers.find(h => h.name.toLowerCase() === 'from');
      const subject = subjectHeader ? subjectHeader.value : '(No Subject)';
      const from = fromHeader ? fromHeader.value.split('<')[0].trim() : 'Unknown';
      const snippet = msg.snippet;

      const badgeClass = msg.accountType === 'personal' ? 'personal' : 'work';
      const badgeLabel = translations[state.lang][`badge-${msg.accountType}`] || msg.accountType;

      let gmailLink = `https://mail.google.com/mail/#inbox/${msg.threadId}`;
      if (msg.accountEmail) {
        gmailLink = `https://mail.google.com/mail/?authuser=${encodeURIComponent(msg.accountEmail)}#inbox/${msg.threadId}`;
      }

      return `
        <a href="${escapeHtml(gmailLink)}" target="_blank" rel="noopener noreferrer" class="integration-item ${badgeClass}" data-tooltip="Subject: ${escapeHtml(subject)}\nFrom: ${escapeHtml(from)}\nSnippet: ${escapeHtml(snippet)}">
          <span class="item-title">${escapeHtml(subject)}</span>
          <div class="item-meta">
            <span>${escapeHtml(from)}</span>
            <span class="item-badge ${badgeClass}">${escapeHtml(badgeLabel)}</span>
          </div>
        </a>
      `;
    }).join('');

  } catch (err) {
    console.error("Gmail Loading Error:", err);
    container.innerHTML = `<p class="empty-msg" style="color:var(--danger)">Gmail Loading Error (${err.message || 'Error'})</p>`;
  }
}

async function fetchGoogleTasks() {
  const oldToday = document.getElementById('gtasks-today');
  if (oldToday) oldToday.remove();
  const oldWeek = document.getElementById('gtasks-week');
  if (oldWeek) oldWeek.remove();

  if (state.settings.showGoogleTasks === false) {
    return;
  }

  function showPlaceholder(messageHTML) {
    let gTodayCard = document.getElementById('gtasks-today');
    if (!gTodayCard) {
      gTodayCard = document.createElement('div');
      gTodayCard.id = 'gtasks-today';
      gTodayCard.className = 'section-card';
      const colContent = document.querySelector('#col-today .col-content');
      if (colContent) colContent.appendChild(gTodayCard);
    }
    gTodayCard.innerHTML = `
      <h3 class="card-subtitle">Google Tasks (Hoy)</h3>
      <div class="integration-list">
        ${messageHTML}
      </div>
    `;

    let gWeekCard = document.getElementById('gtasks-week');
    if (!gWeekCard) {
      gWeekCard = document.createElement('div');
      gWeekCard.id = 'gtasks-week';
      gWeekCard.className = 'section-card';
      const colContent = document.querySelector('#col-week .col-content');
      if (colContent) colContent.appendChild(gWeekCard);
    }
    gWeekCard.innerHTML = `
      <h3 class="card-subtitle">Google Tasks (Semana)</h3>
      <div class="integration-list">
        ${messageHTML}
      </div>
    `;
  }

  if (!state.googlePersonalToken && !state.googleWorkToken) {
    const configLinkText = state.lang === 'es' ? 'Configurar Google Tasks' : 'Configure Google Tasks';
    const msgHTML = `<p class="empty-msg" style="margin: 0.5rem 0;"><a href="#" onclick="event.preventDefault(); window.openSettingsGoogleTab();" style="color: var(--accent); text-decoration: underline; font-weight: 500;">${configLinkText}</a></p>`;
    showPlaceholder(msgHTML);
    return;
  }

  let errors = [];

  async function fetchTasksForAccount(token, type) {
    if (!token) return [];
    try {
      const tasksRes = await fetch('https://www.googleapis.com/tasks/v1/lists/@default/tasks?showCompleted=false', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!tasksRes.ok) {
        if (tasksRes.status === 401) {
          handleInvalidToken(type);
        }
        throw new Error(`HTTP ${tasksRes.status}`);
      }
      const tasksData = await tasksRes.json();
      const items = tasksData.items || [];
      return items.map(t => ({ ...t, accountType: type }));
    } catch (e) {
      console.warn(`Direct fetch from @default failed for ${type}, trying lists fallback...`, e);
      try {
        const listsRes = await fetch('https://www.googleapis.com/tasks/v1/users/@me/lists', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!listsRes.ok) throw new Error(`Fallback HTTP ${listsRes.status}`);
        const listsData = await listsRes.json();
        if (!listsData.items || listsData.items.length === 0) return [];

        const listId = listsData.items[0].id;
        const tasksRes = await fetch(`https://www.googleapis.com/tasks/v1/lists/${listId}/tasks?showCompleted=false`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!tasksRes.ok) throw new Error(`Fallback Tasks HTTP ${tasksRes.status}`);
        const tasksData = await tasksRes.json();
        const items = tasksData.items || [];
        return items.map(t => ({ ...t, accountType: type }));
      } catch (fallbackError) {
        errors.push(`${type} account: ${fallbackError.message}`);
        return [];
      }
    }
  }

  try {
    const promises = [];
    if (state.googlePersonalToken) {
      promises.push(fetchTasksForAccount(state.googlePersonalToken, 'personal'));
    }
    if (state.googleWorkToken && !state.settings.oooActive) {
      promises.push(fetchTasksForAccount(state.googleWorkToken, 'work'));
    }

    const results = await Promise.all(promises);
    const gTasks = results.flat();

    // Check if we had errors and no tasks were successfully loaded
    if (errors.length > 0 && gTasks.length === 0) {
      console.warn("Google Tasks fetch failed:", errors.join(' | '));
      const errorText = state.lang === 'es' ? 'Error al cargar Google Tasks' : 'Error loading Google Tasks';
      const configLinkText = state.lang === 'es' ? 'Configurar Google Tasks' : 'Configure Google Tasks';
      const msgHTML = `
        <p class="empty-msg" style="color: var(--danger); margin-bottom: 0.25rem;">${errorText}</p>
        <p class="empty-msg" style="margin: 0.25rem 0;"><a href="#" onclick="event.preventDefault(); window.openSettingsGoogleTab();" style="color: var(--accent); text-decoration: underline; font-weight: 500;">${configLinkText}</a></p>
      `;
      showPlaceholder(msgHTML);
      return;
    }

    if (gTasks.length === 0) return;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayTime = todayStart.getTime();

    const weekEnd = new Date(todayStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const weekEndTime = weekEnd.getTime();

    const todayGTasks = [];
    const weekGTasks = [];

    gTasks.forEach(t => {
      if (!t.title || t.title.trim() === '') return;
      if (!t.due) {
        weekGTasks.push(t);
        return;
      }
      
      const dueTime = new Date(t.due).getTime();
      if (dueTime <= todayTime + 24 * 60 * 60 * 1000 - 1) {
        todayGTasks.push(t);
      } else if (dueTime <= weekEndTime) {
        weekGTasks.push(t);
      } else {
        weekGTasks.push(t);
      }
    });

    todayGTasks.sort((a, b) => {
      const aOverdue = a.due && new Date(a.due).getTime() < todayTime;
      const bOverdue = b.due && new Date(b.due).getTime() < todayTime;
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;
      return 0;
    });

    function getTaskTimeText(task) {
      if (!task.due) return '';
      const hasTime = !task.due.endsWith('T00:00:00.000Z') && !task.due.endsWith('T00:00:00Z') && task.due.includes('T');
      if (!hasTime) {
        return '';
      }
      const d = new Date(task.due);
      return d.toLocaleTimeString(state.lang === 'es' ? 'es-ES' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    function checkTaskRecurring(task) {
      return !!(task.recurrence || task.recurring);
    }

    if (todayGTasks.length > 0) {
      let gTodayCard = document.getElementById('gtasks-today');
      if (!gTodayCard) {
        gTodayCard = document.createElement('div');
        gTodayCard.id = 'gtasks-today';
        gTodayCard.className = 'section-card';
        const colContent = document.querySelector('#col-today .col-content');
        if (colContent) colContent.appendChild(gTodayCard);
      }
      gTodayCard.innerHTML = `
        <h3 class="card-subtitle">Google Tasks (Hoy)</h3>
        <div class="integration-list">
          ${todayGTasks.map(t => {
            const badgeClass = t.accountType === 'personal' ? 'personal' : 'work';
            const badgeLabel = translations[state.lang][`badge-${t.accountType}`] || t.accountType;
            const isOverdue = t.due && new Date(t.due).getTime() < todayTime;
            const dueLabel = isOverdue ? (state.lang === 'es' ? 'Vencido' : 'Overdue') : '';
            const timeText = getTaskTimeText(t);
            const isRecurring = checkTaskRecurring(t);
            const recurringClass = isRecurring ? 'recurring' : '';
            const repeatIcon = isRecurring 
              ? `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.65; display: inline-block; vertical-align: middle; margin-right: 0.25rem; flex-shrink: 0;"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>` 
              : '';
            const tooltipText = t.title + (isOverdue ? ` (${dueLabel})` : '') + (timeText ? `\n${timeText}` : '') + (isRecurring ? (state.lang === 'es' ? ' (Recurrente)' : ' (Recurring)') : '');
            
            const email = t.accountType === 'personal' ? state.googlePersonalEmail : state.googleWorkEmail;
            const tasksLink = email 
              ? `https://tasks.google.com/?authuser=${encodeURIComponent(email)}` 
              : 'https://tasks.google.com/';

            return `
              <a href="${escapeHtml(tasksLink)}" target="_blank" rel="noopener noreferrer" class="integration-item one-line ${recurringClass}" data-tooltip="${escapeHtml(tooltipText)}">
                <div style="display: flex; align-items: center; gap: 0.4rem; min-width: 0; flex: 1;">
                  ${isOverdue ? `<span class="event-overdue-badge" style="margin-left: 0; flex-shrink: 0; padding: 0.05rem 0.25rem; font-size: 0.6rem;">${dueLabel}</span>` : ''}
                  ${repeatIcon}
                  <span class="item-title">${escapeHtml(t.title)}</span>
                </div>
                <span class="item-badge ${badgeClass}">${escapeHtml(badgeLabel)}</span>
              </a>
            `;
          }).join('')}
        </div>
      `;
    }

    if (weekGTasks.length > 0) {
      let gWeekCard = document.getElementById('gtasks-week');
      if (!gWeekCard) {
        gWeekCard = document.createElement('div');
        gWeekCard.id = 'gtasks-week';
        gWeekCard.className = 'section-card';
        const colContent = document.querySelector('#col-week .col-content');
        if (colContent) colContent.appendChild(gWeekCard);
      }
      gWeekCard.innerHTML = `
        <h3 class="card-subtitle">Google Tasks (Semana)</h3>
        <div class="integration-list">
          ${weekGTasks.map(t => {
            const badgeClass = t.accountType === 'personal' ? 'personal' : 'work';
            const badgeLabel = translations[state.lang][`badge-${t.accountType}`] || t.accountType;
            const timeText = getTaskTimeText(t);
            const dateText = t.due ? new Date(t.due.split('T')[0] + 'T00:00:00').toLocaleDateString(state.lang === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'long' }) : '';
            const isRecurring = checkTaskRecurring(t);
            const recurringClass = isRecurring ? 'recurring' : '';
            const repeatIcon = isRecurring 
              ? `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.65; display: inline-block; vertical-align: middle; margin-right: 0.25rem; flex-shrink: 0;"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>` 
              : '';
            const tooltipText = t.title + (t.due ? `\n${dateText}` : '') + (isRecurring ? (state.lang === 'es' ? ' (Recurrente)' : ' (Recurring)') : '');
            
            const email = t.accountType === 'personal' ? state.googlePersonalEmail : state.googleWorkEmail;
            const tasksLink = email 
              ? `https://tasks.google.com/?authuser=${encodeURIComponent(email)}` 
              : 'https://tasks.google.com/';

            return `
              <a href="${escapeHtml(tasksLink)}" target="_blank" rel="noopener noreferrer" class="integration-item one-line ${recurringClass}" data-tooltip="${escapeHtml(tooltipText)}">
                <div style="display: flex; align-items: center; gap: 0.4rem; min-width: 0; flex: 1;">
                  ${repeatIcon}
                  <span class="item-title">${escapeHtml(t.title)}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.4rem; flex-shrink: 0;">
                  ${dateText ? `<span style="font-size: 0.72rem; color: var(--text-secondary);">${escapeHtml(dateText)}</span>` : ''}
                  <span class="item-badge ${badgeClass}">${escapeHtml(badgeLabel)}</span>
                </div>
              </a>
            `;
          }).join('')}
        </div>
      `;
    }

  } catch (err) {
    console.error("Error fetching Google Tasks", err);
    const errorText = state.lang === 'es' ? 'Error al cargar Google Tasks' : 'Error loading Google Tasks';
    const configLinkText = state.lang === 'es' ? 'Configurar Google Tasks' : 'Configure Google Tasks';
    const msgHTML = `
      <p class="empty-msg" style="color: var(--danger); margin-bottom: 0.25rem;">${errorText} (${err.message || 'Error'})</p>
      <p class="empty-msg" style="margin: 0.25rem 0;"><a href="#" onclick="event.preventDefault(); window.openSettingsGoogleTab();" style="color: var(--accent); text-decoration: underline; font-weight: 500;">${configLinkText}</a></p>
    `;
    if (typeof showPlaceholder === 'function') {
      showPlaceholder(msgHTML);
    }
  }
}

async function fetchGoogleCalendar() {
  const todayEventsContainer = document.getElementById('google-events-container');
  const weeklyEventsContainer = document.getElementById('weekly-events-container');
  const weeklyBadge = document.getElementById('weekly-count-badge');
  if (weeklyBadge) {
    weeklyBadge.classList.add('hidden');
  }

  if (!state.googlePersonalToken && !state.googleWorkToken) {
    const configLinkText = state.lang === 'es' ? 'Configurar Google Calendar' : 'Configure Google Calendar';
    const msgHTML = `<p class="empty-msg" style="margin: 0.5rem 0;"><a href="#" onclick="event.preventDefault(); window.openSettingsGoogleTab();" style="color: var(--accent); text-decoration: underline; font-weight: 500;">${configLinkText}</a></p>`;
    todayEventsContainer.innerHTML = msgHTML;
    weeklyEventsContainer.innerHTML = msgHTML;
    return;
  }

  const timeMin = new Date().toISOString();
  const timeMax = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days ahead

  async function fetchEventsForAccount(token, type) {
    if (!token) return [];
    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      if (res.status === 401) {
        handleInvalidToken(type);
      }
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    const items = data.items || [];
    return items.map(item => ({ ...item, accountType: type }));
  }

  try {
    const promises = [];
    if (state.googlePersonalToken) {
      promises.push(
        fetchEventsForAccount(state.googlePersonalToken, 'personal')
          .catch(err => {
            console.error("Error fetching personal calendar:", err);
            return [];
          })
      );
    }
    if (state.googleWorkToken && !state.settings.oooActive) {
      promises.push(
        fetchEventsForAccount(state.googleWorkToken, 'work')
          .catch(err => {
            console.error("Error fetching work calendar:", err);
            return [];
          })
      );
    }

    const results = await Promise.all(promises);
    const allEvents = results.flat();

    // Sort all events by start time
    allEvents.sort((a, b) => {
      const aStart = a.start.dateTime || a.start.date;
      const bStart = b.start.dateTime || b.start.date;
      return aStart.localeCompare(bStart);
    });

    if (allEvents.length === 0) {
      todayEventsContainer.innerHTML = `<p class="empty-msg">${translations[state.lang]['no-events']}</p>`;
      weeklyEventsContainer.innerHTML = `<p class="empty-msg">${translations[state.lang]['no-weekly-events']}</p>`;
      return;
    }

    const todayStr = getLocalDateString(new Date());
    const todayEvents = [];
    const weeklyGroups = {}; // relative date string -> list of event HTMLs

    allEvents.forEach(evt => {
      const startStr = evt.start.dateTime || evt.start.date;
      const isToday = startStr.startsWith(todayStr);
      
      const badgeClass = evt.accountType === 'personal' ? 'personal' : 'work';
      const badgeLabel = translations[state.lang][`badge-${evt.accountType}`] || evt.accountType;

      let eventLink = evt.htmlLink || 'https://calendar.google.com/calendar/r';
      const email = evt.accountType === 'personal' ? state.googlePersonalEmail : state.googleWorkEmail;
      if (email) {
        const separator = eventLink.includes('?') ? '&' : '?';
        eventLink = `${eventLink}${separator}authuser=${encodeURIComponent(email)}`;
      }

      const timeStr = formatEventTime(evt);
      const isRecurring = !!evt.recurringEventId;
      const recurringClass = isRecurring ? 'recurring' : '';
      const repeatIcon = isRecurring 
        ? `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.65; display: inline-block; vertical-align: middle; margin-right: 0.25rem;"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>` 
        : '';

      const evtDateObj = new Date(startStr.split('T')[0] + 'T00:00:00');
      const dateText = evtDateObj.toLocaleDateString(state.lang === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'long' });
      const tooltipText = evt.summary + `\n${dateText}\nTime: ${timeStr}` + (isRecurring ? (state.lang === 'es' ? ' (Recurrente)' : ' (Recurring)') : '');

      const eventHTML = `
        <a href="${escapeHtml(eventLink)}" target="_blank" rel="noopener noreferrer" class="integration-item ${badgeClass} ${recurringClass}" data-tooltip="${escapeHtml(tooltipText)}">
          <span class="item-title">${escapeHtml(evt.summary)}</span>
          <div class="item-meta">
            <span>${repeatIcon}${escapeHtml(timeStr)}</span>
            <span class="item-badge ${badgeClass}">${escapeHtml(badgeLabel)}</span>
          </div>
        </a>
      `;

      if (isToday) {
        todayEvents.push(eventHTML);
      } else {
        const dateVal = evt.start.dateTime || evt.start.date;
        const relativeLabel = getRelativeDateLabel(dateVal);
        if (!weeklyGroups[relativeLabel]) {
          weeklyGroups[relativeLabel] = [];
        }
        weeklyGroups[relativeLabel].push(eventHTML);
      }
    });

    const weeklyHTML = [];
    let totalWeeklyCount = 0;
    Object.keys(weeklyGroups).forEach(label => {
      weeklyHTML.push(`<div class="schedule-group-header">${escapeHtml(label)}</div>`);
      weeklyHTML.push(...weeklyGroups[label]);
      totalWeeklyCount += weeklyGroups[label].length;
    });

    if (weeklyBadge) {
      if (totalWeeklyCount > 0) {
        weeklyBadge.textContent = totalWeeklyCount;
        weeklyBadge.classList.remove('hidden');
      } else {
        weeklyBadge.classList.add('hidden');
      }
    }

    const todayBadge = document.getElementById('events-count-badge');
    if (todayBadge) {
      if (todayEvents.length > 0) {
        todayBadge.textContent = todayEvents.length;
        todayBadge.classList.remove('hidden');
      } else {
        todayBadge.classList.add('hidden');
      }
    }

    todayEventsContainer.innerHTML = todayEvents.length > 0 ? todayEvents.join('') : `<p class="empty-msg">${translations[state.lang]['no-events']}</p>`;
    weeklyEventsContainer.innerHTML = weeklyHTML.length > 0 ? weeklyHTML.join('') : `<p class="empty-msg">${translations[state.lang]['no-weekly-events']}</p>`;

  } catch (err) {
    console.error("Failed to load calendars", err);
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

  // Google Account color swatches click handlers
  const personalSwatches = document.querySelectorAll('#google-color-personal-swatches .color-swatch-btn');
  personalSwatches.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedColor = btn.getAttribute('data-color');
      const hiddenInput = document.getElementById('google-color-personal');
      if (hiddenInput) hiddenInput.value = selectedColor;
      updateAccountSwatchActiveState('google-color-personal-swatches', selectedColor);
    });
  });

  const workSwatches = document.querySelectorAll('#google-color-work-swatches .color-swatch-btn');
  workSwatches.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedColor = btn.getAttribute('data-color');
      const hiddenInput = document.getElementById('google-color-work');
      if (hiddenInput) hiddenInput.value = selectedColor;
      updateAccountSwatchActiveState('google-color-work-swatches', selectedColor);
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
      if (confirmActionType === 'hide-events') {
        const cb = document.getElementById('settings-show-countdowns');
        if (cb) cb.checked = true;
      }
      confirmDeleteModal.close();
      todoIdToDelete = null;
      confirmActionType = null;
    });
    
    document.getElementById('close-delete-modal').addEventListener('click', () => {
      if (confirmActionType === 'hide-events') {
        const cb = document.getElementById('settings-show-countdowns');
        if (cb) cb.checked = true;
      }
      confirmDeleteModal.close();
      todoIdToDelete = null;
      countdownIdToDelete = null;
      confirmActionType = null;
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
        state.settings.customEvents = (state.settings.customEvents || []).filter(c => c.id !== countdownIdToDelete);
        await saveSettings();
        renderCountdowns();
        renderSettingsEventsList();
        updateUpcomingEventBanner();
        confirmDeleteModal.close();
        countdownIdToDelete = null;
        confirmActionType = null;
      } else if (confirmActionType === 'hide-events') {
        confirmDeleteModal.close();
        confirmActionType = null;
      }
    });
  }

  // Handle immediate change on show-events switch
  const showEventsCheckbox = document.getElementById('settings-show-countdowns');
  if (showEventsCheckbox) {
    showEventsCheckbox.addEventListener('change', () => {
      if (!showEventsCheckbox.checked && (state.settings.customEvents && state.settings.customEvents.length > 0)) {
        confirmActionType = 'hide-events';
        confirmDeleteModal.querySelector('[data-i18n="confirm-delete-title"]').textContent = state.lang === 'es' ? 'Ocultar Eventos' : 'Hide Events';
        const descEl = confirmDeleteModal.querySelector('[data-i18n="confirm-delete-desc"]');
        if (descEl) {
          descEl.innerHTML = state.lang === 'es'
            ? 'Tienes eventos configurados (pendientes o vencidos). ¿Seguro que quieres ocultar la sección de Eventos?'
            : 'You have configured events (pending or overdue). Are you sure you want to hide the Events section?';
        }
        const dict = translations[state.lang];
        confirmDeleteModal.querySelector('[data-i18n="cancel-btn"]').textContent = dict['cancel-btn'];
        confirmDeleteModal.querySelector('[data-i18n="delete-btn"]').textContent = state.lang === 'es' ? 'Confirmar' : 'Confirm';
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
      
      state.settings.customEvents = (state.settings.customEvents || []).map(evt => {
        if (evt.id === id) {
          return { ...evt, name, date };
        }
        return evt;
      });
      await saveSettings();
      renderCountdowns();
      renderSettingsEventsList();
      updateUpcomingEventBanner();
      editEventModal.close();
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

  // Click OOO badge to open settings at Google tab
  const oooBadges = document.querySelectorAll('.ooo-badge');
  oooBadges.forEach(b => {
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      const toggleBtn = document.getElementById('settings-toggle');
      if (toggleBtn) {
        toggleBtn.click();
        const googleTab = document.querySelector('.tab-btn[data-tab="tab-google"]');
        if (googleTab) googleTab.click();
      }
    });
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
          oooDateInput.value = `${yyyy}-${mm}-${dd}`;
        }
        if (oooDateModal) oooDateModal.showModal();
      } else {
        const display = document.getElementById('ooo-date-display');
        if (display) display.classList.add('hidden');
      }
    });
  }

  if (oooForm && oooDateModal) {
    oooForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = oooDateInput.value;
      if (!val) return;
      
      if (oooActiveSwitch) {
        oooActiveSwitch.setAttribute('data-until', val);
      }

      const display = document.getElementById('ooo-date-display');
      const text = document.getElementById('ooo-return-date-text');
      if (display) display.classList.remove('hidden');
      if (text) text.textContent = new Date(val + 'T00:00:00').toLocaleDateString(state.lang === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
      
      oooDateModal.close();
    });
  }

  const cancelOooBtn = document.getElementById('btn-cancel-ooo');
  const closeOooModalBtn = document.getElementById('close-ooo-modal');
  if (cancelOooBtn && oooDateModal) {
    cancelOooBtn.addEventListener('click', () => {
      if (oooActiveSwitch) oooActiveSwitch.checked = false;
      oooDateModal.close();
    });
  }
  if (closeOooModalBtn && oooDateModal) {
    closeOooModalBtn.addEventListener('click', () => {
      if (oooActiveSwitch) oooActiveSwitch.checked = false;
      oooDateModal.close();
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
    document.getElementById('settings-show-google-emails').checked = state.settings.showGoogleEmails !== false;
    document.getElementById('settings-show-google-tasks').checked = state.settings.showGoogleTasks !== false;
    document.getElementById('settings-show-git').checked = state.settings.showGit !== false;
    document.getElementById('settings-show-jira').checked = state.settings.showJira !== false;
    
    toggleWeatherInputs();
    toggleClockInputs();
    
    document.getElementById('settings-storage-mode').value = state.settings.storageMode || 'local';
    document.getElementById('google-client-id').value = state.settings.googleClientId;
    
    const personalCol = state.settings.personalColor || 'blue';
    const workCol = state.settings.workColor || 'black';
    document.getElementById('google-color-personal').value = personalCol;
    document.getElementById('google-color-work').value = workCol;
    updateAccountSwatchActiveState('google-color-personal-swatches', personalCol);
    updateAccountSwatchActiveState('google-color-work-swatches', workCol);

    document.getElementById('github-token').value = state.settings.githubToken || '';
    document.getElementById('github-username').value = state.settings.githubUsername || '';
    document.getElementById('settings-github-ooo-hide').checked = state.settings.hideGithubOoo === true;

    document.getElementById('bitbucket-workspace').value = state.settings.bitbucketWorkspace || '';
    document.getElementById('bitbucket-username').value = state.settings.bitbucketUsername || '';
    document.getElementById('bitbucket-token').value = state.settings.bitbucketToken || '';
    document.getElementById('settings-bitbucket-ooo-hide').checked = state.settings.hideBitbucketOoo === true;

    document.getElementById('gitlab-host').value = state.settings.gitlabHost || 'https://gitlab.com';
    document.getElementById('gitlab-token').value = state.settings.gitlabToken || '';
    document.getElementById('gitlab-username').value = state.settings.gitlabUsername || '';
    document.getElementById('settings-gitlab-ooo-hide').checked = state.settings.hideGitlabOoo === true;

    document.getElementById('jira-host').value = state.settings.jiraHost || '';
    document.getElementById('jira-email').value = state.settings.jiraEmail || '';
    document.getElementById('jira-token').value = state.settings.jiraToken || '';
    document.getElementById('settings-jira-ooo-hide').checked = state.settings.hideJiraOoo === true;

    const oooActiveInput = document.getElementById('settings-ooo-active');
    if (oooActiveInput) {
      oooActiveInput.checked = state.settings.oooActive === true;
      const display = document.getElementById('ooo-date-display');
      const text = document.getElementById('ooo-return-date-text');
      if (state.settings.oooActive && state.settings.oooUntil) {
        if (display) display.classList.remove('hidden');
        if (text) text.textContent = new Date(state.settings.oooUntil + 'T00:00:00').toLocaleDateString(state.lang === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
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

      // Scroll the selected tab into view inside the tab bar container
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
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
    state.settings.personalColor = document.getElementById('google-color-personal').value;
    state.settings.workColor = document.getElementById('google-color-work').value;
    applyAccountColors();
    state.settings.githubToken = document.getElementById('github-token').value.trim();
    state.settings.githubUsername = document.getElementById('github-username').value.trim();
    state.settings.hideGithubOoo = document.getElementById('settings-github-ooo-hide').checked;

    state.settings.bitbucketWorkspace = document.getElementById('bitbucket-workspace').value.trim();
    state.settings.bitbucketUsername = document.getElementById('bitbucket-username').value.trim();
    state.settings.bitbucketToken = document.getElementById('bitbucket-token').value.trim();
    state.settings.hideBitbucketOoo = document.getElementById('settings-bitbucket-ooo-hide').checked;

    state.settings.gitlabHost = document.getElementById('gitlab-host').value.trim();
    state.settings.gitlabToken = document.getElementById('gitlab-token').value.trim();
    state.settings.gitlabUsername = document.getElementById('gitlab-username').value.trim();
    state.settings.hideGitlabOoo = document.getElementById('settings-gitlab-ooo-hide').checked;

    state.settings.jiraHost = document.getElementById('jira-host').value.trim();
    state.settings.jiraEmail = document.getElementById('jira-email').value.trim();
    state.settings.jiraToken = document.getElementById('jira-token').value.trim();
    state.settings.hideJiraOoo = document.getElementById('settings-jira-ooo-hide').checked;

    const oooActive = document.getElementById('settings-ooo-active').checked;
    const oooUntil = document.getElementById('settings-ooo-active').getAttribute('data-until') || state.settings.oooUntil;
    state.settings.oooActive = oooActive;
    state.settings.oooUntil = oooActive ? oooUntil : null;

    updateOooBadges();

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
    state.settings.showGoogleEmails = document.getElementById('settings-show-google-emails').checked;
    state.settings.showGoogleTasks = document.getElementById('settings-show-google-tasks').checked;
    state.settings.showGit = document.getElementById('settings-show-git').checked;
    state.settings.showJira = document.getElementById('settings-show-jira').checked;

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
    fetchGmail();
    fetchGoogleTasks();
    fetchGoogleCalendar();

    if (state.settings.googleClientId) {
      initGoogleOAuth();
    }

    settingsModal.close();
  });

  // Google OAuth Personal Login Action
  const loginBtnPersonal = document.getElementById('google-login-btn-personal');
  loginBtnPersonal.addEventListener('click', () => {
    if (!state.settings.googleClientId) {
      const clientIdInput = document.getElementById('google-client-id');
      const msg = state.lang === 'es' ? 'Por favor, introduce tu Google Client ID.' : 'Please enter your Google Client ID.';
      showInputErrorFeedback(clientIdInput, msg);
      return;
    }
    googleLoginTarget = 'personal';
    if (googleTokenClient) {
      googleTokenClient.requestAccessToken({ prompt: 'select_account' });
    } else {
      initGoogleOAuth();
      googleTokenClient.requestAccessToken({ prompt: 'select_account' });
    }
  });

  // Google OAuth Work Login Action
  const loginBtnWork = document.getElementById('google-login-btn-work');
  loginBtnWork.addEventListener('click', () => {
    if (!state.settings.googleClientId) {
      const clientIdInput = document.getElementById('google-client-id');
      const msg = state.lang === 'es' ? 'Por favor, introduce tu Google Client ID.' : 'Please enter your Google Client ID.';
      showInputErrorFeedback(clientIdInput, msg);
      return;
    }
    googleLoginTarget = 'work';
    if (googleTokenClient) {
      googleTokenClient.requestAccessToken({ prompt: 'select_account' });
    } else {
      initGoogleOAuth();
      googleTokenClient.requestAccessToken({ prompt: 'select_account' });
    }
  });

  // Google OAuth Personal Logout Action
  document.getElementById('google-logout-btn-personal').addEventListener('click', () => {
    if (state.googlePersonalToken) {
      google.accounts.oauth2.revokeToken(state.googlePersonalToken, () => {});
    }
    state.googlePersonalToken = null;
    state.googlePersonalEmail = null;
    sessionStorage.removeItem('google_personal_token');
    sessionStorage.removeItem('google_personal_email');
    
    // Sync legacy/compatibility tokens
    state.googleClientToken = state.googleWorkToken;
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
    if (state.googleWorkToken) {
      google.accounts.oauth2.revokeToken(state.googleWorkToken, () => {});
    }
    state.googleWorkToken = null;
    state.googleWorkEmail = null;
    sessionStorage.removeItem('google_work_token');
    sessionStorage.removeItem('google_work_email');
    
    // Sync legacy/compatibility tokens
    state.googleClientToken = state.googlePersonalToken;
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
    const textInput = document.getElementById('edit-task-text');
    const text = textInput.value.trim();
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

function getRelativeDateLabel(dateVal) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const target = new Date(dateVal);
  target.setHours(0, 0, 0, 0);
  
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return state.lang === 'es' ? 'Hoy' : 'Today';
  } else if (diffDays === 1) {
    return state.lang === 'es' ? 'Mañana' : 'Tomorrow';
  } else if (diffDays === 2) {
    return state.lang === 'es' ? 'Pasado mañana' : 'Day after tomorrow';
  } else {
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    const formatted = target.toLocaleDateString(state.lang === 'es' ? 'es-ES' : 'en-US', options);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }
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

  // Load Google Auth and render setup links
  setTimeout(initGoogleOAuth, 1000);
}

// Start application
window.addEventListener('DOMContentLoaded', init);
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (state.theme === 'system') applyTheme();
});
