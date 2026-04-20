const cache = new Map();

async function fetchResource(path, type) {
  if (cache.has(path)) {
    return cache.get(path);
  }

  const promise = fetch(path).then((response) => {
    if (!response.ok) {
      throw new Error(`Could not load ${path}`);
    }

    return type === "json" ? response.json() : response.text();
  });

  cache.set(path, promise);
  return promise;
}

export function loadJson(path) {
  return fetchResource(path, "json");
}

export function loadText(path) {
  return fetchResource(path, "text");
}

export async function loadSiteShell() {
  const headerTarget = document.querySelector("#site-header");
  const footerTarget = document.querySelector("#site-footer");

  if (headerTarget) {
    headerTarget.innerHTML = await loadText("components/header.html");
  }

  const navSlot = document.querySelector("[data-nav-slot]");
  if (navSlot) {
    navSlot.innerHTML = await loadText("components/nav.html");
  }

  if (footerTarget) {
    footerTarget.innerHTML = await loadText("components/footer.html");
  }
}

export async function loadContentBundle() {
  const [site, profile, contact, featuredProject, publications] = await Promise.all([
    loadJson("content/site.json"),
    loadJson("content/profile.json"),
    loadJson("content/contact.json"),
    loadJson("content/featured-project.json"),
    loadJson("content/publications.json")
  ]);

  return { site, profile, contact, featuredProject, publications };
}

export function createElement(tagName, className, textContent) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (textContent) {
    element.textContent = textContent;
  }

  return element;
}

export function clearChildren(element) {
  if (element) {
    element.innerHTML = "";
  }
}

export function createCallout(message) {
  const callout = createElement("div", "callout");
  callout.innerHTML = message;
  return callout;
}
