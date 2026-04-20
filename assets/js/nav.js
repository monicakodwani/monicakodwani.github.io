function getCurrentPageName() {
  if (document.body.dataset.page === "404") {
    return "";
  }

  const parts = window.location.pathname.split("/").filter(Boolean);
  const lastPart = parts[parts.length - 1];

  if (!lastPart || !lastPart.includes(".")) {
    return "index.html";
  }

  return lastPart;
}

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

function getPreferredTheme() {
  const storedTheme = getStoredTheme();

  if (storedTheme) {
    return storedTheme;
  }

  if (!window.matchMedia) {
    return "light";
  }

  return window.matchMedia(DARK_MODE_QUERY).matches ? "dark" : "light";
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
    // The visual toggle should still work when storage is unavailable.
  }
}

function updateThemeToggleLabel(button) {
  const theme = document.documentElement.dataset.theme || "light";
  const nextTheme = theme === "dark" ? "light" : "dark";
  const label = `Switch to ${nextTheme} mode`;
  const text = button.querySelector("[data-theme-toggle-text]");

  button.setAttribute("aria-label", label);
  button.setAttribute("title", label);
  button.setAttribute("aria-pressed", String(theme === "dark"));

  if (text) {
    text.textContent = label;
  }
}

function initializeThemeToggle() {
  const button = document.querySelector("[data-theme-toggle]");

  if (!button) {
    return;
  }

  applyTheme(getPreferredTheme());
  updateThemeToggleLabel(button);

  button.addEventListener("click", () => {
    const currentTheme = document.documentElement.dataset.theme || "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    storeTheme(nextTheme);
    updateThemeToggleLabel(button);
  });

  if (window.matchMedia) {
    const mediaQuery = window.matchMedia(DARK_MODE_QUERY);
    const handleSystemThemeChange = (event) => {
      if (!getStoredTheme()) {
        applyTheme(event.matches ? "dark" : "light");
        updateThemeToggleLabel(button);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleSystemThemeChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleSystemThemeChange);
    }
  }
}

function initializeMobileNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-site-nav]");

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLElement && event.target.closest("a")) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

export function initializeNavigation(site) {
  const brand = document.querySelector("[data-site-brand]");
  const navList = document.querySelector("[data-nav-list]");

  if (brand) {
    brand.textContent = site.site.name;
  }

  if (navList) {
    const currentPage = getCurrentPageName();

    site.navigation.forEach((item) => {
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.className = "nav-link";
      link.href = item.href;
      link.textContent = item.label;

      if (currentPage && item.href === currentPage) {
        link.setAttribute("aria-current", "page");
      }

      listItem.appendChild(link);
      navList.appendChild(listItem);
    });
  }

  initializeThemeToggle();
  initializeMobileNav();
}
