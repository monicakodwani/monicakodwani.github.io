/*
 * Content loading for the production site.
 *
 * All factual content lives in content/*.json. Paths are resolved relative
 * to THIS module file (import.meta.url), so pages anywhere in the repository
 * can import it and always reach the repository-root content/ directory —
 * both on GitHub Pages and through `python3 -m http.server`.
 */

const CONTENT_ROOT = new URL("../../content/", import.meta.url);
const cache = new Map();

export function loadJson(fileName) {
  if (cache.has(fileName)) {
    return cache.get(fileName);
  }

  const url = new URL(fileName, CONTENT_ROOT);
  const promise = fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(`Could not load ${url.pathname} (HTTP ${response.status})`);
    }
    return response.json();
  });

  cache.set(fileName, promise);
  return promise;
}

/* Loads every content file the site uses, in parallel.
   (profile.json exists for the archived design previews; production
   renderers don't read it, so it isn't fetched here.) */
export async function loadPortfolioContent() {
  const [site, contact, portfolio, projects, publications] = await Promise.all([
    loadJson("site.json"),
    loadJson("contact.json"),
    loadJson("portfolio.json"),
    loadJson("projects.json"),
    loadJson("publications.json")
  ]);

  return { site, contact, portfolio, projects, publications };
}

export function el(tagName, className, textContent) {
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
    element.replaceChildren();
  }
}

/*
 * Returns the author string as a DocumentFragment with the given name
 * wrapped in <strong class="author-highlight"> for styling.
 */
export function highlightAuthor(authors, name = "Monica Kodwani") {
  const fragment = document.createDocumentFragment();
  const pieces = authors.split(name);

  pieces.forEach((piece, index) => {
    fragment.appendChild(document.createTextNode(piece));
    if (index < pieces.length - 1) {
      fragment.appendChild(el("strong", "author-highlight", name));
    }
  });

  return fragment;
}

/*
 * Shown when fetch() fails — usually because the page was opened from the
 * filesystem instead of a local server. Never fails silently.
 */
export function showLoadError(error) {
  console.error(error);

  const callout = el("div", "load-error");
  callout.setAttribute("role", "alert");

  const strong = el("strong", "", "This page could not load its content. ");
  const text = document.createTextNode(
    "The site reads shared JSON files with fetch(), which requires a local server. " +
      "From the repository root, run: python3 -m http.server 8000 — then open " +
      "http://localhost:8000"
  );

  callout.appendChild(strong);
  callout.appendChild(text);
  document.body.prepend(callout);
}
