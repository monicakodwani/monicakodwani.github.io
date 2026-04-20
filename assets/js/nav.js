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

function getStoredTheme() {
  return window.localStorage.getItem("mk-theme");
}

function getPreferredTheme() {
  const storedTheme = getStoredTheme();

  if (storedTheme) {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}

function updateThemeToggleLabel(button) {
  const theme = document.documentElement.dataset.theme || "light";
  const nextTheme = theme === "dark" ? "light" : "dark";
  button.textContent = theme === "dark" ? "Light" : "Dark";
  button.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
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
    window.localStorage.setItem("mk-theme", nextTheme);
    updateThemeToggleLabel(button);
  });
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
