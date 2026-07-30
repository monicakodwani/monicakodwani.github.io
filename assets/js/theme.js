/*
 * Theme toggle and mobile navigation behavior shared by the design previews.
 * Mirrors the production site's behavior: system preference by default,
 * manual override persisted in localStorage under "mk-theme".
 */

const THEME_STORAGE_KEY = "mk-theme";
const DARK_MODE_QUERY = "(prefers-color-scheme: dark)";

function getStoredTheme() {
  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return storedTheme === "dark" || storedTheme === "light" ? storedTheme : "";
  } catch (error) {
    return "";
  }
}

function applyTheme(theme) {
  const safeTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = safeTheme;
  return safeTheme;
}

function storeTheme(theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    // The toggle still works for this visit when storage is unavailable.
  }
}

function updateToggleLabel(button) {
  const theme = document.documentElement.dataset.theme || "light";
  const nextTheme = theme === "dark" ? "light" : "dark";
  const label = `Switch to ${nextTheme} mode`;

  button.setAttribute("aria-label", label);
  button.setAttribute("title", label);
  button.setAttribute("aria-pressed", String(theme === "dark"));

  const text = button.querySelector("[data-theme-toggle-text]");
  if (text) {
    text.textContent = label;
  }
}

export function initThemeToggle(button) {
  if (!button) {
    return;
  }

  updateToggleLabel(button);

  button.addEventListener("click", () => {
    const currentTheme = document.documentElement.dataset.theme || "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    storeTheme(nextTheme);
    updateToggleLabel(button);
  });

  if (window.matchMedia) {
    const mediaQuery = window.matchMedia(DARK_MODE_QUERY);
    const followSystem = (event) => {
      if (!getStoredTheme()) {
        applyTheme(event.matches ? "dark" : "light");
        updateToggleLabel(button);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", followSystem);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(followSystem);
    }
  }
}

export function initMobileNav(toggle, nav) {
  if (!toggle || !nav) {
    return;
  }

  const closeNav = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLElement && event.target.closest("a")) {
      closeNav();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      closeNav();
      toggle.focus();
    }
  });
}
