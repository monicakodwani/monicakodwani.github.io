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
  const { profile, contact, featuredProject } = content;

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

  const facts = document.querySelector("[data-home-quick-facts]");
  clearChildren(facts);

  if (facts) {
    profile.quickFacts.forEach((fact) => {
      facts.appendChild(createElement("dt", "", fact.label));
      facts.appendChild(createElement("dd", "", fact.value));
    });
  }

  setText("[data-featured-project-title]", featuredProject.title);
  setText("[data-featured-project-summary]", featuredProject.summary);

  const projectLinks = document.querySelector("[data-featured-project-links]");
  clearChildren(projectLinks);

  if (projectLinks) {
    featuredProject.links.forEach((item) => {
      const linkClass =
        item.style === "primary" ? "button button-primary" : "button button-secondary";
      const link = createElement("a", linkClass, item.label);
      link.href = item.url;
      link.target = "_blank";
      link.rel = "noreferrer";
      projectLinks.appendChild(link);
    });
  }
}

function renderPublications(content) {
  const list = document.querySelector("[data-publication-list]");
  clearChildren(list);

  if (!list) {
    return;
  }

  content.publications.forEach((publication) => {
    const article = createElement("article", "publication-card");
    article.id = publication.id;

    article.appendChild(createElement("h2", "", publication.title));
    article.appendChild(createElement("p", "publication-authors", publication.authors));

    const meta = createElement("p", "publication-meta");
    const venue = [publication.venue, publication.year].filter(Boolean).join(" ");
    meta.appendChild(createElement("span", "", venue));

    if (publication.status) {
      meta.appendChild(createElement("span", "badge", publication.status));
    }

    article.appendChild(meta);

    if (publication.summary) {
      article.appendChild(createElement("p", "", publication.summary));
    }

    if (publication.links && publication.links.length > 0) {
      const links = createElement("div", "publication-links");

      publication.links.forEach((item) => {
        const link = createElement("a", "text-link", item.label);
        link.href = item.url;
        link.target = "_blank";
        link.rel = "noreferrer";
        links.appendChild(link);
      });

      article.appendChild(links);
    }

    list.appendChild(article);
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

  if (page === "publications") {
    renderPublications(content);
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
