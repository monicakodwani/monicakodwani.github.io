/*
 * Early theme bootstrap for the design previews.
 * Runs before first paint so there is no flash of the wrong theme.
 * Uses the same storage key as the production site ("mk-theme") so the
 * visitor's choice carries across the previews and the live pages.
 */
(function () {
  try {
    var storedTheme = window.localStorage.getItem("mk-theme");
    var systemPrefersDark =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    var preferredTheme = storedTheme || (systemPrefersDark ? "dark" : "light");
    document.documentElement.dataset.theme = preferredTheme;
  } catch (error) {
    document.documentElement.dataset.theme = "light";
  }
})();
