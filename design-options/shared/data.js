/*
 * Shared content loading for the design previews.
 *
 * All three design options render the same structured content from
 * ../../content/*.json. Paths are relative to the option pages
 * (design-options/<option>/*.html), which keeps the previews working both
 * on GitHub Pages and through `python3 -m http.server` with no <base> tag.
 */

const CONTENT_ROOT = "../../content/";
const cache = new Map();

export function loadJson(fileName) {
  if (cache.has(fileName)) {
    return cache.get(fileName);
  }

  const promise = fetch(CONTENT_ROOT + fileName).then((response) => {
    if (!response.ok) {
      throw new Error(`Could not load ${CONTENT_ROOT}${fileName} (HTTP ${response.status})`);
    }
    return response.json();
  });

  cache.set(fileName, promise);
  return promise;
}

/* Loads every content file the previews use, in parallel. */
export async function loadPortfolioContent() {
  const [site, profile, contact, portfolio, projects, publications] = await Promise.all([
    loadJson("site.json"),
    loadJson("profile.json"),
    loadJson("contact.json"),
    loadJson("portfolio.json"),
    loadJson("projects.json"),
    loadJson("publications.json")
  ]);

  return { site, profile, contact, portfolio, projects, publications };
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
 * wrapped in <strong class="author-highlight"> so each design can style it.
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

  const strong = el("strong", "", "This preview could not load its content. ");
  const text = document.createTextNode(
    "The design previews read shared JSON files with fetch(), which requires a local server. " +
      "From the repository root, run: python3 -m http.server 8000 — then open " +
      "http://localhost:8000/design-options/"
  );

  callout.appendChild(strong);
  callout.appendChild(text);
  document.body.prepend(callout);
}
