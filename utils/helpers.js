import { translations, getLocale } from "../locales/index.js";

export function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function ensureHttpUrl(urlString) {
  if (!urlString) return "";
  let trimmed = urlString.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return "https://" + trimmed;
  }
  return trimmed;
}

export function getLocalDateString(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDateShort(dateStr, lang = "en") {
  if (!dateStr) return "";
  const parts = dateStr.split("T")[0].split("-");
  if (parts.length !== 3) return dateStr;
  const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  d.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = d.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return (translations[lang] || translations.en)["task-today"] || (lang === "es" ? "Hoy" : "Today");
  } else if (diffDays === 1) {
    return (translations[lang] || translations.en)["task-tomorrow"] || (lang === "es" ? "Mañana" : "Tomorrow");
  } else if (diffDays === -1) {
    return lang === "es" ? "Ayer" : "Yesterday";
  }

  const locale = getLocale(lang);
  return d.toLocaleDateString(locale, { day: "numeric", month: "short" });
}

export function formatEventTime(evt) {
  if (evt.isAllDay) return "All day";
  if (!evt.start) return "";
  const d = new Date(evt.start);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function getTzDifference(targetTz) {
  try {
    const now = new Date();
    const localIso = now.toLocaleString("en-US", { timeZoneName: "shortOffset" });
    const targetIso = now.toLocaleString("en-US", { timeZone: targetTz, timeZoneName: "shortOffset" });
    
    const localDate = new Date(now.toLocaleString("en-US"));
    const targetDate = new Date(now.toLocaleString("en-US", { timeZone: targetTz }));
    
    const diffMs = targetDate.getTime() - localDate.getTime();
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    
    let diffText = "";
    if (diffHours === 0) diffText = "Misma hora";
    else if (diffHours > 0) diffText = `+${diffHours}h`;
    else diffText = `${diffHours}h`;
    
    const dayDiff = targetDate.getDate() - localDate.getDate();
    let dayText = "Hoy";
    if (dayDiff === 1 || dayDiff < -20) dayText = "Mañana";
    else if (dayDiff === -1 || dayDiff > 20) dayText = "Ayer";
    
    return { diffText, dayText, diffHours };
  } catch (e) {
    return { diffText: "", dayText: "", diffHours: 0 };
  }
}

export async function safeFetch(url, options = {}) {
  const isJira = url.includes("/rest/api/3/") || url.includes("/rest/api/2/");
  const isGmail = url.includes("gmail.googleapis.com");
  
  if (isJira || isGmail) {
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
    try {
      const res = await fetch(proxyUrl, options);
      const contentType = res.headers.get("content-type") || "";
      if (res.status !== 404 || contentType.includes("application/json")) {
        return res;
      }
      return await fetch(url, options);
    } catch (e) {
      return fetch(url, options);
    }
  }

  try {
    const res = await fetch(url, options);
    return res;
  } catch (err) {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      try {
        const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
        return await fetch(proxyUrl, options);
      } catch (proxyErr) {
        throw err;
      }
    }
    throw err;
  }
}

export function openModalAccessible(dialogElement, focusTargetElement) {
  if (!dialogElement) return;
  if (typeof dialogElement.showModal === "function") {
    dialogElement.showModal();
  } else {
    dialogElement.setAttribute("open", "");
  }
  if (focusTargetElement && typeof focusTargetElement.focus === "function") {
    setTimeout(() => focusTargetElement.focus(), 50);
  }
}

export function closeModalAccessible(dialogElement) {
  if (!dialogElement) return;
  if (typeof dialogElement.close === "function") {
    dialogElement.close();
  } else {
    dialogElement.removeAttribute("open");
  }
}

export function trapFocusInDialog(e, dialogElement) {
  if (e.key !== "Tab" || !dialogElement.open) return;
  const focusables = dialogElement.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusables.length === 0) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    last.focus();
    e.preventDefault();
  } else if (!e.shiftKey && document.activeElement === last) {
    first.focus();
    e.preventDefault();
  }
}

export function showInputErrorFeedback(inputEl, errorMessage) {
  if (!inputEl) return;
  if (inputEl.classList.contains("invalid-field")) return;
  inputEl.classList.add("invalid-field");
  inputEl.focus();

  let errorEl = inputEl.nextElementSibling;
  if (!errorEl || !errorEl.classList.contains("field-error-msg")) {
    errorEl = document.createElement("span");
    errorEl.className = "field-error-msg";
    errorEl.style.color = "var(--danger)";
    errorEl.style.fontSize = "0.75rem";
    errorEl.style.marginTop = "0.25rem";
    errorEl.style.display = "block";
    inputEl.parentNode.insertBefore(errorEl, inputEl.nextSibling);
  }
  errorEl.textContent = errorMessage;

  setTimeout(() => {
    inputEl.classList.remove("invalid-field");
    errorEl.remove();
  }, 2500);
}

export function showActionFeedback(buttonEl, feedbackText) {
  if (!buttonEl) return;
  const originalText = buttonEl.textContent;
  buttonEl.textContent = feedbackText;
  buttonEl.classList.add("feedback-success");
  setTimeout(() => {
    buttonEl.textContent = originalText;
    buttonEl.classList.remove("feedback-success");
  }, 1500);
}
