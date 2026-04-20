import {
  clearChildren,
  createCallout,
  createElement,
  loadContentBundle,
  loadSiteShell
} from "./data-loader.js";
import { initializeNavigation } from "./nav.js";

function setText(selector, value) {
  const element = document.querySelector(selector);

  if (element && value) {
    element.textContent = value;
  }
}

function renderSiteChrome(content) {
  const { site } = content;

  setText("[data-footer-name]", site.site.name);
  setText("[data-footer-note]", site.site.footerNote);
  setText("[data-footer-location]", site.site.location);
  setText("[data-footer-updated]", `Last updated: ${site.site.lastUpdated}`);

  const cvLink = document.querySelector("[data-cv-link]");
  if (cvLink) {
    cvLink.href = site.site.cvPath;
  }
}

function renderHome(content) {
  const { profile, contact } = content;

  setText("[data-home-name]", profile.name);
  setText("[data-home-role]", profile.role);
  setText("[data-home-bio]", profile.shortBio);
  setText("[data-home-institution]", profile.institution);
  setText("[data-home-location]", `${profile.location}`);
  setText("[data-home-email]", contact.email);

  const emailLink = document.querySelector("[data-home-email-link]");
  if (emailLink) {
    emailLink.href = `mailto:${contact.email}`;
  }

  const links = document.querySelector("[data-home-links]");
  clearChildren(links);

  contact.links.forEach((item) => {
    const listItem = document.createElement("li");
    const link = createElement("a", "text-link", item.label);
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noreferrer";
    listItem.appendChild(link);
    links.appendChild(listItem);
  });
}

function renderCv(content) {
  const { profile } = content;
  const facts = document.querySelector("[data-cv-facts]");
  clearChildren(facts);

  profile.quickFacts.forEach((fact) => {
    facts.appendChild(createElement("dt", "", fact.label));
    facts.appendChild(createElement("dd", "", fact.value));
  });
}

function render404() {
  const heading = document.querySelector(".hero-404 h1");
  if (heading) {
    heading.textContent = "This page does not exist here";
  }

  const lead = document.querySelector(".hero-404 .page-lead");
  if (lead) {
    lead.textContent = "The link may be old, incomplete, or pointed to a page that was removed.";
  }
}

function renderPage(content) {
  const page = document.body.dataset.page;

  if (page === "home") {
    renderHome(content);
    return;
  }

  if (page === "cv") {
    renderCv(content);
    return;
  }

  if (page === "404") {
    render404();
  }
}

function showLocalServerHint(error) {
  const message = `
    <strong>Heads up:</strong> this site loads shared components and JSON content with <code>fetch()</code>.
    If you opened the HTML file directly, it needs a local server instead.
    Run <code>python3 -m http.server 8000</code> inside the site folder and then open <code>http://localhost:8000</code>.
  `;

  document.body.prepend(createCallout(message));
  console.error(error);
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadSiteShell();
    const content = await loadContentBundle();
    initializeNavigation(content.site);
    renderSiteChrome(content);
    renderPage(content);
  } catch (error) {
    showLocalServerHint(error);
  }
});
