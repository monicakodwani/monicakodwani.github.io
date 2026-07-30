(function () {
  try {
    var storedTheme = window.localStorage.getItem("mk-theme");
    if (storedTheme !== "dark" && storedTheme !== "light") {
      storedTheme = "";
    }
    var systemPrefersDark =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    var preferredTheme = storedTheme || (systemPrefersDark ? "dark" : "light");
    document.documentElement.dataset.theme = preferredTheme;
  } catch (error) {
    document.documentElement.dataset.theme = "light";
  }
})();
