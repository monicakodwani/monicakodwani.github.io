/*
 * Option C — Human-Centered Warm Minimalism.
 * Renders all factual content from the shared JSON via ../shared/data.js.
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
  const a = el("a", className || "", text);
  a.href = href;
  if (external) {
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  }
  return a;
}

function isExternal(url) {
  return /^https?:\/\//.test(url);
}

/* Renders the GitHub / LinkedIn / Google Scholar (+ optional Email) link list. */
function renderProfileLinks(listElement, contact, includeEmail) {
  if (!listElement) {
    return;
  }
  clearChildren(listElement);
  if (includeEmail) {
    const li = el("li");
    li.appendChild(link("mailto:" + contact.email, "Email", "text-link"));
    listElement.appendChild(li);
  }
  contact.links.forEach((item) => {
    const li = el("li");
    li.appendChild(link(item.url, item.label, "text-link", true));
    listElement.appendChild(li);
  });
}

function renderFooter(content) {
  const footer = document.getElementById("site-footer");
  if (!footer) {
    return;
  }
  clearChildren(footer);

  const { site } = content.site;
  const identity = el("div", "footer-identity");
  identity.appendChild(el("p", "footer-name", "Monica Kodwani"));
  identity.appendChild(el("p", "footer-note", site.footerNote));
  identity.appendChild(el("p", "footer-meta", site.location));
  identity.appendChild(el("p", "footer-meta", "Last updated: " + site.lastUpdated));
  footer.appendChild(identity);

  const links = el("ul", "footer-links");
  const emailItem = el("li");
  emailItem.appendChild(link("mailto:" + content.contact.email, content.contact.email, "text-link"));
  links.appendChild(emailItem);
  content.contact.links.forEach((item) => {
    const li = el("li");
    li.appendChild(link(item.url, item.label, "text-link", true));
    links.appendChild(li);
  });
  footer.appendChild(links);
}

/* ---------- home ---------- */

function renderHome(content) {
  const { hero } = content.portfolio;
  document.getElementById("hero-role").textContent = hero.roleLine;
  document.getElementById("hero-lede").textContent = hero.lede;
  document.getElementById("hero-context").textContent = hero.context;
  renderProfileLinks(document.getElementById("hero-links"), content.contact, true);

  const profileGrid = document.getElementById("research-profile");
  clearChildren(profileGrid);
  content.portfolio.researchProfile.forEach((item) => {
    const card = el("div", "profile-card");
    card.appendChild(el("h3", "profile-label", item.label));
    card.appendChild(el("p", "profile-value", item.value));
    profileGrid.appendChild(card);
  });

  const workGrid = document.getElementById("selected-work");
  clearChildren(workGrid);
  content.projects.forEach((project) => {
    const card = el("article", "work-card");
    card.appendChild(el("p", "chip chip-category", project.category));

    const title = el("h3", "work-title");
    title.appendChild(link("projects.html#" + project.id, project.title));
    card.appendChild(title);

    card.appendChild(el("p", "work-oneliner", project.oneLiner));
    const meta = project.scale || project.status;
    if (meta) {
      card.appendChild(el("p", "work-meta", meta));
    }
    const more = el("p", "work-more");
    more.appendChild(link("projects.html#" + project.id, "Read more →", "text-link"));
    card.appendChild(more);
    workGrid.appendChild(card);
  });
}

/* ---------- projects ---------- */

function proseBlock(heading, text) {
  const block = el("div", "prose-block");
  block.appendChild(el("h3", "prose-heading", heading));
  block.appendChild(el("p", "", text));
  return block;
}

function listBlock(heading, items, listClass) {
  const block = el("div", "prose-block");
  block.appendChild(el("h3", "prose-heading", heading));
  const list = el("ul", listClass || "warm-list");
  items.forEach((item) => list.appendChild(el("li", "", item)));
  block.appendChild(list);
  return block;
}

function renderProjects(content) {
  document.getElementById("page-lede").textContent = content.portfolio.projectsPage.lede;

  const container = document.getElementById("projects-list");
  clearChildren(container);

  content.projects.forEach((project) => {
    const article = el("article", "case-study");
    article.id = project.id;

    const header = el("header", "case-header");
    header.appendChild(el("p", "chip chip-category", project.category));
    header.appendChild(el("h2", "case-title", project.title));
    article.appendChild(header);

    if (project.summary) {
      article.appendChild(el("p", "case-summary", project.summary));
    }
    if (project.problem) {
      article.appendChild(proseBlock("The question", project.problem));
    }
    if (project.whyItMatters) {
      article.appendChild(proseBlock("Why it matters", project.whyItMatters));
    }
    if (project.role) {
      article.appendChild(proseBlock("My role", project.role));
    }
    if (project.built && project.built.length > 0) {
      article.appendChild(listBlock("What I built", project.built));
    }
    if (project.questions && project.questions.length > 0) {
      article.appendChild(listBlock("Questions this work asks", project.questions));
    }
    if (project.findings && project.findings.length > 0) {
      const panel = el("div", "findings-panel");
      panel.appendChild(el("h3", "prose-heading", "What we learned"));
      const list = el("ul", "warm-list");
      project.findings.forEach((finding) => list.appendChild(el("li", "", finding)));
      panel.appendChild(list);
      article.appendChild(panel);
    }
    if (project.methods && project.methods.length > 0) {
      const block = el("div", "prose-block");
      block.appendChild(el("h3", "prose-heading", "Methods"));
      const chips = el("ul", "chip-list");
      project.methods.forEach((method) => chips.appendChild(el("li", "chip", method)));
      block.appendChild(chips);
      article.appendChild(block);
    }

    const facts = el("dl", "case-facts");
    const addFact = (label, value) => {
      if (!value) {
        return;
      }
      const pair = el("div", "case-fact");
      pair.appendChild(el("dt", "", label));
      pair.appendChild(el("dd", "", value));
      facts.appendChild(pair);
    };
    addFact("Stack", project.stack);
    addFact("Scale", project.scale);
    addFact(
      "Where it stands",
      [project.status, project.statusNote].filter(Boolean).join(" — ")
    );
    addFact("Collaborators", project.collaborators);
    if (facts.childElementCount > 0) {
      article.appendChild(facts);
    }

    if (project.publications && project.publications.length > 0) {
      const block = el("div", "prose-block");
      block.appendChild(el("h3", "prose-heading", "Publications from this work"));
      const list = el("ul", "chip-list");
      project.publications.forEach((pubId) => {
        const publication = content.publications.find((p) => p.id === pubId);
        if (!publication) {
          return;
        }
        const li = el("li");
        li.appendChild(
          link(
            "publications.html#" + pubId,
            publication.venue + " " + publication.year,
            "chip chip-link"
          )
        );
        list.appendChild(li);
      });
      block.appendChild(list);
      article.appendChild(block);
    }

    if (project.links && project.links.length > 0) {
      const row = el("div", "cta-row case-links");
      project.links.forEach((item) => {
        const className =
          item.type === "primary" ? "btn btn-primary" : "btn btn-secondary";
        row.appendChild(link(item.url, item.label, className, isExternal(item.url)));
      });
      article.appendChild(row);
    }

    container.appendChild(article);
  });
}

/* ---------- publications ---------- */

function renderPublications(content) {
  document.getElementById("page-lede").textContent = content.portfolio.publicationsPage.lede;

  const container = document.getElementById("publications-list");
  clearChildren(container);

  content.publications.forEach((publication) => {
    const article = el("article", "publication");
    article.id = publication.id;

    const meta = el("p", "pub-meta");
    const venueChip = el("span", "chip chip-venue", publication.venue + " " + publication.year);
    venueChip.title = publication.venueFull;
    meta.appendChild(venueChip);
    if (publication.status) {
      meta.appendChild(el("span", "chip chip-status", publication.status));
    }
    publication.topics.forEach((topic) => {
      meta.appendChild(el("span", "chip chip-topic", topic));
    });
    article.appendChild(meta);

    article.appendChild(el("h2", "pub-title", publication.title));

    const authors = el("p", "pub-authors");
    authors.appendChild(highlightAuthor(publication.authors));
    article.appendChild(authors);

    article.appendChild(el("p", "pub-venue-full", publication.venueFull));
    article.appendChild(el("p", "pub-summary", publication.summary));

    if (publication.links && publication.links.length > 0) {
      const row = el("p", "pub-links");
      publication.links.forEach((item) => {
        row.appendChild(link(item.url, item.label, "text-link", isExternal(item.url)));
      });
      article.appendChild(row);
    }

    container.appendChild(article);
  });
}

/* ---------- cv ---------- */

function renderCv(content) {
  document.getElementById("page-lede").textContent = content.portfolio.cvPage.lede;
  document.getElementById("cv-summary").textContent = content.portfolio.cvPage.summary;
  document.getElementById("cv-open").href = "../../" + content.site.site.cvPath;
  document.getElementById("cv-email").href = "mailto:" + content.contact.email;
  renderProfileLinks(document.getElementById("cv-links"), content.contact, false);
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
    initThemeToggle(document.getElementById("theme-toggle"));
    initMobileNav(
      document.querySelector(".menu-toggle"),
      document.getElementById("site-nav")
    );
  } catch (error) {
    showLoadError(error);
  }
});
