export const ACCENT_COLORS = {
  blue: "#3b82f6",
  indigo: "#6366f1",
  purple: "#a855f7",
  pink: "#ec4899",
  rose: "#f43f5e",
  red: "#ef4444",
  orange: "#f97316",
  amber: "#f59e0b",
  yellow: "#eab308",
  emerald: "#10b981",
  teal: "#14b8a6",
  cyan: "#06b6d4",
  sky: "#0284c7",
  slate: "#64748b",
  zinc: "#71717a"
};

export const ACCOUNT_COLORS = {
  blue: "#3b82f6",
  black: "#18181b",
  purple: "#8b5cf6",
  green: "#10b981",
  red: "#ef4444",
  orange: "#f97316"
};

export function applyTheme(state) {
  const html = document.documentElement;
  html.classList.remove("dark", "light");
  
  if (state.theme === "dark") {
    html.classList.add("dark");
  } else if (state.theme === "light") {
    html.classList.add("light");
  } else {
    const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (isSystemDark) {
      html.classList.add("dark");
    }
  }
  
  applyAccountColors(state);
}

export function applyPrimaryColor(color) {
  const root = document.documentElement;
  const hex = ACCENT_COLORS[color] || ACCENT_COLORS.blue;
  root.style.setProperty("--accent", hex);
}

export function applyAccountColors(state) {
  const personal = state.settings.personalColor || "blue";
  const work = state.settings.workColor || "black";
  const root = document.documentElement;
  
  root.style.setProperty("--google-personal", ACCOUNT_COLORS[personal] || ACCOUNT_COLORS.blue);
  root.style.setProperty("--google-work", ACCOUNT_COLORS[work] || ACCOUNT_COLORS.black);
}

export function updateSwatchActiveState(currentColor) {
  document.querySelectorAll(".color-swatch").forEach(swatch => {
    swatch.classList.toggle("active", swatch.dataset.color === currentColor);
  });
}

export function updateAccountSwatchActiveState(containerId, selectedColor) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.querySelectorAll(".account-swatch").forEach(swatch => {
    swatch.classList.toggle("active", swatch.dataset.color === selectedColor);
  });
}
