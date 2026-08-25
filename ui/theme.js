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

export function applyPrimaryColor(colorName = "blue") {
  const validColors = ["blue", "indigo", "purple", "pink", "red", "orange", "green", "teal", "slate", "black"];
  const color = validColors.includes(colorName) ? colorName : "blue";
  document.documentElement.setAttribute("data-accent", color);
}

export function applyAccountColors(state = defaultState) {
  const isDark = document.documentElement.classList.contains("dark");
  const colorMap = {
    blue: isDark ? "#60a5fa" : "#1e70e0",
    indigo: "#6366f1",
    purple: isDark ? "#a78bfa" : "#7c3aed",
    pink: "#ec4899",
    red: "#ef4444",
    orange: "#f97316",
    green: "#10b981",
    teal: "#06b6d4",
    slate: "#64748b",
    black: isDark ? "#e4e4e7" : "#18181b"
  };

  const st = state || defaultState;
  const personal = st.settings?.personalColor || "blue";
  const work = st.settings?.workColor || "black";

  document.documentElement.style.setProperty("--personal-color", colorMap[personal] || colorMap.blue);
  document.documentElement.style.setProperty("--work-color", colorMap[work] || colorMap.black);
}

export function updateSwatchActiveState(selectedColor) {
  const swatches = document.querySelectorAll("#color-picker-swatches .color-swatch-btn");
  swatches.forEach(btn => {
    if (btn.getAttribute("data-color") === selectedColor) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

export function updateAccountSwatchActiveState(containerId, selectedColor) {
  const swatches = document.querySelectorAll(`#${containerId} .color-swatch-btn`);
  swatches.forEach(btn => {
    if (btn.getAttribute("data-color") === selectedColor) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

export function applyTheme(state = defaultState) {
  const st = state || defaultState;
  const html = document.documentElement;
  html.classList.remove("dark", "light");
  
  const theme = st.theme || st.settings?.theme || "system";
  if (theme === "dark") {
    html.classList.add("dark");
  } else if (theme === "light") {
    html.classList.add("light");
  } else {
    const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (isSystemDark) {
      html.classList.add("dark");
    }
  }
  
  applyAccountColors(st);
}
