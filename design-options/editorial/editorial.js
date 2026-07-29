/*
 * Editorial design preview — renders shared JSON content into the page
 * skeleton. One module serves all four pages; document.body.dataset.page
 * selects which renderer runs.
 */

import {
  loadPortfolioContent,
  el,
  clearChildren,
  highlightAuthor,
  showLoadError
} from "../shared/data.js";
import { initThemeToggle, initMobileNav } from "../shared/theme.js";

/* ---------- small helpers ---------- */

function link(href, text, className, external) {
  const anchor = el("a", className, text);
  anchor.href = href;
  if (external) {
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
  }
  return anchor;
}

function isExternal(url) {
  return /^https?:\/\//.test(url);
}

/* Fills a <ul> with profile links (GitHub / LinkedIn / Google Scholar) plus an email link. */
function renderProfileLinks(list, contact, includeEmail) {
  if (!list) {
    return;
  }
  clearChildren(list);
  contact.links.forEach((profile) => {
    const item = el("li");
    item.appendChild(link(profile.url, profile.label, "profile-link", true));
    list.appendChild(item);
  });
  if (includeEmail) {
    const item = el("li");
    item.appendChild(link("mailto:" + contact.email, "Email", "profile-link"));
    list.appendChild(item);
  }
}

/* ---------- footer (every page) ---------- */

function renderFooter(content) {
  const footer = document.getElementById("site-footer");
  if (!footer) {
    return;
  }
  clearChildren(footer);

  const identity = el("div", "footer-identity");
  identity.appendChild(el("p", "footer-name", content.site.site.name));
  identity.appendChild(el("p", "footer-note", content.site.site.footerNote));
  identity.appendChild(el("p", "footer-meta", content.site.site.location));
  identity.appendChild(
    el("p", "footer-meta", "Last updated: " + content.site.site.lastUpdated)
  );
  footer.appendChild(identity);

  const linksBlock = el("div", "footer-links");
  const contactList = el("ul", "footer-link-list");
  const emailItem = el("li");
  emailItem.appendChild(
    link("mailto:" + content.contact.email, content.contact.email)
  );
  contactList.appendChild(emailItem);
  content.contact.links.forEach((profile) => {
    const item = el("li");
    item.appendChild(link(profile.url, profile.label, "", true));
    contactList.appendChild(item);
  });
  linksBlock.appendChild(contactList);
  footer.appendChild(linksBlock);
}

/* ---------- home ---------- */

function renderHome(content) {
  const hero = content.portfolio.hero;
  document.getElementById("hero-kicker").textContent = hero.roleLine;
  document.getElementById("hero-lede").textContent = hero.lede;
  document.getElementById("hero-context").textContent = hero.context;
  document.getElementById("portrait-caption").textContent =
    content.profile.role + " · " + content.profile.location;

  renderProfileLinks(
    document.getElementById("hero-profile-links"),
    content.contact,
    true
  );

  const profileList = document.getElementById("research-profile-list");
  clearChildren(profileList);
  content.portfolio.researchProfile.forEach((entry) => {
    const row = el("div", "profile-row");
    row.appendChild(el("dt", "", entry.label));
    row.appendChild(el("dd", "", entry.value));
    profileList.appendChild(row);
  });

  const workList = document.getElementById("selected-work-list");
  clearChildren(workList);
  content.projects.forEach((project, index) => {
    const item = el("li", "work-item");
    const number = el("p", "work-number", String(index + 1).padStart(2, "0"));
    number.setAttribute("aria-hidden", "true");
    item.appendChild(number);

    const body = el("div", "work-body");
    body.appendChild(el("p", "kicker", project.category));
    const heading = el("h3", "work-title");
    heading.appendChild(link("projects.html#" + project.id, project.title));
    body.appendChild(heading);
    body.appendChild(el("p", "work-oneliner", project.oneLiner));
    const scaleLine = project.scale || project.status;
    if (scaleLine) {
      body.appendChild(el("p", "work-scale", scaleLine));
    }
    item.appendChild(body);
    workList.appendChild(item);
  });
}

/* ---------- projects ---------- */

/* Prose block with a small-caps heading, used for problem / role / etc. */
function proseBlock(headingText, bodyText) {
  const block = el("div", "prose-block");
  block.appendChild(el("h3", "prose-heading", headingText));
  block.appendChild(el("p", "", bodyText));
  return block;
}

function listBlock(headingText, items, listClass) {
  const block = el("div", "prose-block");
  block.appendChild(el("h3", "prose-heading", headingText));
  const list = el("ul", listClass);
  items.forEach((item) => {
    list.appendChild(el("li", "", item));
  });
  block.appendChild(list);
  return block;
}

function metaEntry(label, value) {
  const entry = el("div", "meta-entry");
  entry.appendChild(el("dt", "", label));
  const definition = el("dd");
  if (value instanceof Node) {
    definition.appendChild(value);
  } else {
    definition.textContent = value;
  }
  entry.appendChild(definition);
  return entry;
}

function renderProjects(content) {
  document.getElementById("projects-lede").textContent =
    content.portfolio.projectsPage.lede;

  const publicationById = new Map(
    content.publications.map((publication) => [publication.id, publication])
  );

  const container = document.getElementById("projects-list");
  clearChildren(container);

  content.projects.forEach((project, index) => {
    const article = el("article", "case-study");
    article.id = project.id;

    /* Opener row on a hairline: number, category, status. */
    const opener = el("div", "case-opener");
    const number = el("p", "case-number", String(index + 1).padStart(2, "0"));
    number.setAttribute("aria-hidden", "true");
    opener.appendChild(number);
    opener.appendChild(el("p", "kicker", project.category));
    if (project.status) {
      opener.appendChild(el("p", "case-status", project.status));
    }
    article.appendChild(opener);

    article.appendChild(el("h2", "case-title", project.title));

    const columns = el("div", "case-columns");
    const prose = el("div", "case-prose");

    if (project.summary) {
      prose.appendChild(el("p", "case-summary", project.summary));
    }

    /* One large pull-stat, only on the auditing study. */
    if (project.id === "how-people-audit" && project.scale) {
      prose.appendChild(el("p", "pull-stat", project.scale));
    }

    if (project.problem) {
      const heading =
        project.id === "workplace-ai-governance" || project.questions
          ? "Research question"
          : "The problem";
      prose.appendChild(proseBlock(heading, project.problem));
    }
    if (project.whyItMatters) {
      prose.appendChild(proseBlock("Why it matters", project.whyItMatters));
    }
    if (project.role) {
      prose.appendChild(proseBlock("My role", project.role));
    }
    if (project.built && project.built.length > 0) {
      prose.appendChild(listBlock("What I built", project.built, "built-list"));
    }
    if (project.questions && project.questions.length > 0) {
      prose.appendChild(
        listBlock("Questions this work asks", project.questions, "findings-list")
      );
    }
    if (project.findings && project.findings.length > 0) {
      prose.appendChild(
        listBlock("What we learned", project.findings, "findings-list")
      );
    }
    if (project.statusNote) {
      prose.appendChild(el("p", "status-note", project.statusNote));
    }
    columns.appendChild(prose);

    /* Meta rail: small-caps labelled facts. */
    const rail = el("aside", "case-meta");
    const meta = el("dl", "meta-list");

    if (project.methods && project.methods.length > 0) {
      const chips = el("ul", "method-list");
      project.methods.forEach((method) => {
        chips.appendChild(el("li", "", method));
      });
      meta.appendChild(metaEntry("Methods", chips));
    }
    if (project.stack) {
      meta.appendChild(metaEntry("Stack", project.stack));
    }
    if (project.scale) {
      meta.appendChild(metaEntry("Scale", project.scale));
    }
    if (project.status) {
      meta.appendChild(metaEntry("Status", project.status));
    }
    if (project.collaborators) {
      meta.appendChild(metaEntry("Collaborators", project.collaborators));
    }

    if (project.publications && project.publications.length > 0) {
      const pubList = el("ul", "meta-link-list");
      project.publications.forEach((publicationId) => {
        const publication = publicationById.get(publicationId);
        if (!publication) {
          return;
        }
        const item = el("li");
        item.appendChild(
          link(
            "publications.html#" + publicationId,
            publication.venue + " " + publication.year
          )
        );
        pubList.appendChild(item);
      });
      meta.appendChild(metaEntry("Publications", pubList));
    }

    if (project.links && project.links.length > 0) {
      const linkList = el("ul", "meta-link-list");
      project.links.forEach((entry) => {
        const item = el("li");
        item.appendChild(
          link(
            entry.url,
            entry.label,
            entry.type === "primary" ? "case-link-primary" : "case-link-secondary",
            isExternal(entry.url)
          )
        );
        linkList.appendChild(item);
      });
      meta.appendChild(metaEntry("Links", linkList));
    }

    rail.appendChild(meta);
    columns.appendChild(rail);
    article.appendChild(columns);
    container.appendChild(article);
  });
}

/* ---------- publications ---------- */

function renderPublications(content) {
  document.getElementById("publications-lede").textContent =
    content.portfolio.publicationsPage.lede;

  const container = document.getElementById("publications-list");
  clearChildren(container);

  content.publications.forEach((publication) => {
    const article = el("article", "publication");
    article.id = publication.id;

    const margin = el("div", "publication-margin");
    margin.appendChild(el("p", "publication-year", publication.year));
    const venue = el("p", "publication-venue", publication.venue);
    venue.title = publication.venueFull;
    margin.appendChild(venue);
    if (publication.status) {
      margin.appendChild(el("p", "publication-status", publication.status));
    }
    article.appendChild(margin);

    const body = el("div", "publication-body");
    body.appendChild(el("h2", "publication-title", publication.title));

    const authors = el("p", "publication-authors");
    authors.appendChild(highlightAuthor(publication.authors));
    body.appendChild(authors);

    body.appendChild(el("p", "publication-venue-full", publication.venueFull));

    if (publication.topics && publication.topics.length > 0) {
      const topics = el("ul", "topic-list");
      publication.topics.forEach((topic) => {
        topics.appendChild(el("li", "", topic));
      });
      body.appendChild(topics);
    }

    body.appendChild(el("p", "publication-summary", publication.summary));

    if (publication.links && publication.links.length > 0) {
      const links = el("ul", "publication-links");
      publication.links.forEach((entry) => {
        const item = el("li");
        item.appendChild(
          link(entry.url, entry.label, "text-link", isExternal(entry.url))
        );
        links.appendChild(item);
      });
      body.appendChild(links);
    }

    article.appendChild(body);
    container.appendChild(article);
  });
}

/* ---------- cv ---------- */

function renderCv(content) {
  document.getElementById("cv-lede").textContent = content.portfolio.cvPage.lede;
  document.getElementById("cv-summary").textContent =
    content.portfolio.cvPage.summary;
  document.getElementById("cv-open-link").href =
    "../../" + content.site.site.cvPath;
  document.getElementById("cv-email-link").href =
    "mailto:" + content.contact.email;
  renderProfileLinks(
    document.getElementById("cv-profile-links"),
    content.contact,
    false
  );
}

/* ---------- boot ---------- */

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const content = await loadPortfolioContent();
    const page = document.body.dataset.page;

    if (page === "home") {
      renderHome(content);
    } else if (page === "projects") {
      renderProjects(content);
    } else if (page === "publications") {
      renderPublications(content);
    } else if (page === "cv") {
      renderCv(content);
    }

    renderFooter(content);
    initThemeToggle(document.querySelector("[data-theme-toggle]"));
    initMobileNav(
      document.querySelector("[data-nav-toggle]"),
      document.querySelector("[data-site-nav]")
    );
  } catch (error) {
    showLoadError(error);
  }
});
