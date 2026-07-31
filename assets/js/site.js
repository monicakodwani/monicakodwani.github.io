/*
 * Production site renderers.
 * Fills the static page skeletons with content from content/*.json
 * (loaded via ./data.js). One render function per page, keyed off
 * document.body.dataset.page.
 */
import {
  loadPortfolioContent,
  el,
  clearChildren,
  highlightAuthor,
  showLoadError
} from "./data.js";
import { initThemeToggle, initMobileNav } from "./theme.js";

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

function findProject(content, id) {
  return content.projects.find((project) => project.id === id);
}

/* Readable badge label from the project's explicit `maturity` field */
const MATURITY_LABELS = {
  "published": "Published",
  "open-source": "Open source",
  "analysis": "Analysis underway",
  "recruiting": "Recruitment pending",
  "in-progress": "In progress"
};

function statusBadge(project) {
  return MATURITY_LABELS[project.maturity] || MATURITY_LABELS["in-progress"];
}

/* Default case-study section headings; projects override via `headings` */
const DEFAULT_HEADINGS = {
  problem: "The question",
  findings: "What we learned",
  whyItMatters: "Why it matters",
  built: "What I built",
  questions: "Questions",
  role: "My role",
  status: "Current status"
};

function headingFor(project, key) {
  return (project.headings && project.headings[key]) || DEFAULT_HEADINGS[key];
}

/* Email + GitHub / LinkedIn / Google Scholar as plain text links */
function renderProfileLinks(listElement, contact) {
  if (!listElement) {
    return;
  }
  clearChildren(listElement);

  const emailItem = el("li");
  emailItem.appendChild(link("mailto:" + contact.email, "Email"));
  listElement.appendChild(emailItem);

  contact.links.forEach((item) => {
    const li = el("li");
    li.appendChild(link(item.url, item.label, "", true));
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
  identity.appendChild(
    el("p", "footer-meta", site.location + " · Last updated: " + site.lastUpdated)
  );
  footer.appendChild(identity);

  const links = el("ul", "footer-links");
  const emailItem = el("li");
  emailItem.appendChild(link("mailto:" + content.contact.email, content.contact.email));
  links.appendChild(emailItem);
  content.contact.links.forEach((item) => {
    const li = el("li");
    li.appendChild(link(item.url, item.label, "", true));
    links.appendChild(li);
  });
  footer.appendChild(links);
}

/* ---------- home ---------- */

function renderHero(content) {
  const { hero } = content.portfolio;
  document.getElementById("hero-role").textContent = hero.roleLine;
  document.getElementById("hero-lede").textContent = hero.lede;
  document.getElementById("hero-context").textContent = hero.context;
  renderProfileLinks(document.getElementById("hero-links"), content.contact);
}

function renderResearchApproach(content) {
  const container = document.getElementById("research-approach");
  clearChildren(container);
  content.portfolio.researchApproach.forEach((paragraph) => {
    container.appendChild(el("p", "", paragraph));
  });
}

function renderFeaturedPlatform(content) {
  const project = findProject(content, "auditing-infrastructure");
  const target = document.getElementById("featured-platform");
  if (!project || !target) {
    return;
  }
  clearChildren(target);

  const title = el("h3", "feature-title");
  title.appendChild(link("projects.html#" + project.id, project.title));
  target.appendChild(title);

  target.appendChild(el("p", "feature-summary", project.teaser || project.summary));
  target.appendChild(el("p", "feature-evidence", project.scale + "."));

  const actions = el("div", "cta-row");
  actions.appendChild(
    link("projects.html#" + project.id, "Read the case study", "btn btn-primary")
  );
  target.appendChild(actions);

  const extra = el("ul", "link-row");
  project.links.forEach((item) => {
    const li = el("li");
    li.appendChild(link(item.url, item.label, "text-link", isExternal(item.url)));
    extra.appendChild(li);
  });
  target.appendChild(extra);
}

function renderFeaturedStudy(content) {
  const project = findProject(content, "how-people-audit");
  const target = document.getElementById("featured-study");
  if (!project || !target) {
    return;
  }
  clearChildren(target);

  const title = el("h3", "feature-title");
  title.appendChild(link("projects.html#" + project.id, project.title));
  target.appendChild(title);

  target.appendChild(el("p", "feature-summary", project.teaser || project.summary));

  /* The strongest finding, phrased for the home page in projects.json */
  if (project.pullQuote) {
    const pull = el("div", "feature-pull");
    pull.appendChild(el("p", "", project.pullQuote));
    pull.appendChild(el("p", "feature-stat", project.scale));
    target.appendChild(pull);
  }

  const links = el("ul", "link-row");
  const caseLink = el("li");
  caseLink.appendChild(
    link("projects.html#" + project.id, "Read the case study", "text-link")
  );
  links.appendChild(caseLink);
  project.links
    .filter((item) => item.type === "primary")
    .forEach((item) => {
      const li = el("li");
      li.appendChild(link(item.url, item.label, "text-link", true));
      links.appendChild(li);
    });
  target.appendChild(links);
}

function renderSupportingWork(content) {
  const grid = document.getElementById("supporting-work");
  clearChildren(grid);

  /* The homepage list lives in portfolio.json, not in code */
  (content.portfolio.homeSupportingProjects || []).forEach((id) => {
    const project = findProject(content, id);
    if (!project) {
      return;
    }
    const item = el("article", "support-item");
    item.appendChild(el("p", "kicker kicker--muted", project.category));

    const title = el("h3", "support-title");
    title.appendChild(link("projects.html#" + project.id, project.title));
    item.appendChild(title);

    item.appendChild(el("p", "", project.oneLiner));
    item.appendChild(el("p", "support-status", project.status));
    grid.appendChild(item);
  });
}

function renderClosing(content) {
  const target = document.getElementById("closing-text");
  if (target) {
    target.textContent = content.portfolio.jobSearch.text;
  }

  const links = document.getElementById("closing-links");
  clearChildren(links);
  const linkedIn = content.contact.links.find((item) => item.label === "LinkedIn");
  const entries = [
    ["mailto:" + content.contact.email, "Email", false],
    [linkedIn ? linkedIn.url : "", "LinkedIn", true],
    [content.site.site.cvPath, "View CV", false],
    ["projects.html", "Projects", false]
  ];
  entries.forEach(([href, label, external]) => {
    if (!href) {
      return;
    }
    const li = el("li");
    li.appendChild(link(href, label, "text-link", external));
    links.appendChild(li);
  });
}

function renderHome(content) {
  renderHero(content);
  renderResearchApproach(content);
  renderFeaturedPlatform(content);
  renderFeaturedStudy(content);
  renderSupportingWork(content);
  renderClosing(content);
}

/* ---------- projects ---------- */

function renderWorkIndex(content) {
  const index = document.getElementById("work-index");
  clearChildren(index);
  index.appendChild(el("span", "kicker kicker--muted", "On this page"));
  content.projects.forEach((project, i) => {
    if (i > 0) {
      const sep = el("span", "sep", "·");
      sep.setAttribute("aria-hidden", "true");
      index.appendChild(sep);
    }
    index.appendChild(link("#" + project.id, project.shortTitle || project.title));
  });
}

function railEntry(rail, label, value) {
  if (!value) {
    return;
  }
  const wrap = el("div");
  wrap.appendChild(el("dt", "", label));
  const dd = el("dd");
  if (typeof value === "string") {
    dd.textContent = value;
  } else {
    dd.appendChild(value);
  }
  wrap.appendChild(dd);
  rail.appendChild(wrap);
}

function caseSection(project, key, body) {
  const section = el("div", "case-section");
  section.appendChild(el("h3", "", headingFor(project, key)));
  section.appendChild(body);
  return section;
}

function caseList(items) {
  const list = el("ul");
  items.forEach((item) => list.appendChild(el("li", "", item)));
  return list;
}

function renderCaseStudy(content, project, index) {
  const article = el("article", "case-study");
  article.id = project.id;

  const header = el("header", "case-header");
  header.appendChild(el("span", "case-number", String(index + 1).padStart(2, "0")));
  header.appendChild(el("span", "kicker kicker--muted", project.category));
  header.appendChild(el("span", "badge", statusBadge(project)));
  article.appendChild(header);

  article.appendChild(el("h2", "case-title", project.title));

  const columns = el("div", "case-columns");

  /* Left rail: compact facts */
  const rail = el("dl", "case-rail");
  railEntry(rail, "Status", project.status);
  railEntry(rail, "Scale", project.scale);
  railEntry(rail, "Methods", (project.methods || []).join(", "));
  railEntry(rail, "Stack", project.stack);
  railEntry(rail, "Collaboration", project.collaborators);

  if (project.publications && project.publications.length > 0) {
    const list = el("div");
    project.publications.forEach((pubId) => {
      const publication = content.publications.find((p) => p.id === pubId);
      if (!publication) {
        return;
      }
      const line = el("div");
      line.appendChild(
        link("publications.html#" + pubId, publication.venue + " " + publication.year)
      );
      list.appendChild(line);
    });
    railEntry(rail, "Publications", list);
  }

  /* Rail links: external secondary links, minus any URL already carried by a
     linked publication (papers and artifacts live on the publications page).
     Primary links render as the case study's closing button instead. */
  const publicationUrls = new Set();
  (project.publications || []).forEach((pubId) => {
    const publication = content.publications.find((p) => p.id === pubId);
    if (publication) {
      (publication.links || []).forEach((item) => publicationUrls.add(item.url));
    }
  });
  const external = (project.links || []).filter(
    (item) =>
      isExternal(item.url) &&
      item.type !== "primary" &&
      !publicationUrls.has(item.url)
  );
  if (external.length > 0) {
    const list = el("div");
    external.forEach((item) => {
      const line = el("div");
      const anchor = link(item.url, item.label, "", true);
      const arrow = el("span", "", " ↗");
      arrow.setAttribute("aria-hidden", "true");
      anchor.appendChild(arrow);
      line.appendChild(anchor);
      list.appendChild(line);
    });
    railEntry(rail, "Links", list);
  }
  columns.appendChild(rail);

  /* Main column: summary + sections, varied by what the project has */
  const main = el("div", "case-main");
  main.appendChild(el("p", "case-summary", project.summary));

  if (project.problem) {
    main.appendChild(caseSection(project, "problem", el("p", "", project.problem)));
  }

  if (project.findings && project.findings.length > 0) {
    const findings = el("div", "case-findings");
    findings.appendChild(el("h3", "", headingFor(project, "findings")));
    findings.appendChild(caseList(project.findings));
    main.appendChild(findings);
  }

  if (project.whyItMatters) {
    main.appendChild(
      caseSection(project, "whyItMatters", el("p", "", project.whyItMatters))
    );
  }

  if (project.built && project.built.length > 0) {
    main.appendChild(caseSection(project, "built", caseList(project.built)));
  }

  if (project.questions && project.questions.length > 0) {
    main.appendChild(caseSection(project, "questions", caseList(project.questions)));
  }

  if (project.role) {
    main.appendChild(caseSection(project, "role", el("p", "", project.role)));
  }

  /* In-progress projects state their status in prose; published ones don't
     repeat it (the rail and badge already carry it) */
  if (project.statusNote) {
    main.appendChild(
      caseSection(
        project,
        "status",
        el("p", "", project.status + ". " + project.statusNote)
      )
    );
  }

  const primaryLinks = (project.links || []).filter((item) => item.type === "primary");
  if (primaryLinks.length > 0) {
    const row = el("div", "cta-row case-links");
    primaryLinks.forEach((item) => {
      row.appendChild(
        link(item.url, item.label, "btn btn-secondary", isExternal(item.url))
      );
    });
    main.appendChild(row);
  }

  columns.appendChild(main);
  article.appendChild(columns);
  return article;
}

function renderProjects(content) {
  document.getElementById("page-lede").textContent = content.portfolio.projectsPage.lede;
  renderWorkIndex(content);

  const container = document.getElementById("projects-list");
  clearChildren(container);
  content.projects.forEach((project, index) => {
    container.appendChild(renderCaseStudy(content, project, index));
  });
}

/* ---------- publications ---------- */

function renderPublications(content) {
  document.getElementById("page-lede").textContent =
    content.portfolio.publicationsPage.lede;

  const container = document.getElementById("publications-list");
  clearChildren(container);

  /* Group by year, keeping the JSON's order of years and entries */
  const groups = [];
  content.publications.forEach((publication) => {
    let group = groups.find((g) => g.year === publication.year);
    if (!group) {
      group = { year: publication.year, entries: [] };
      groups.push(group);
    }
    group.entries.push(publication);
  });

  groups.forEach((group) => {
    const section = el("section", "pub-year-group");
    section.setAttribute("aria-label", "Publications from " + group.year);
    section.appendChild(el("p", "pub-year", group.year));

    const entries = el("div", "pub-entries");
    group.entries.forEach((publication) => {
      const article = el("article", "publication");
      article.id = publication.id;

      article.appendChild(el("h2", "pub-title", publication.title));

      const authors = el("p", "pub-authors");
      authors.appendChild(highlightAuthor(publication.authors));
      article.appendChild(authors);

      /* Optional issue/pages, e.g. "…Enhancing Technologies, 2026(4), 906–926" */
      const venueText = publication.issuePages
        ? publication.venueFull + ", " + publication.issuePages
        : publication.venueFull;
      const venue = el("p", "pub-venue", venueText);
      if (publication.status) {
        venue.appendChild(document.createTextNode(" · "));
        venue.appendChild(el("span", "pub-status", publication.status));
      }
      article.appendChild(venue);

      article.appendChild(el("p", "pub-summary", publication.summary));

      if (publication.links && publication.links.length > 0) {
        const links = el("ul", "pub-links");
        publication.links.forEach((item) => {
          const li = el("li");
          li.appendChild(link(item.url, item.label, "text-link", isExternal(item.url)));
          links.appendChild(li);
        });
        article.appendChild(links);
      }

      entries.appendChild(article);
    });

    section.appendChild(entries);
    container.appendChild(section);
  });
}

/* ---------- cv ---------- */

function renderCv(content) {
  document.getElementById("page-lede").textContent = content.portfolio.cvPage.lede;
  document.getElementById("cv-summary").textContent = content.portfolio.cvPage.summary;
  document.getElementById("cv-open").href = content.site.site.cvPath;
  document.getElementById("cv-email").href = "mailto:" + content.contact.email;
  renderProfileLinks(document.getElementById("cv-links"), content.contact);
}

/* ---------- boot ---------- */

document.addEventListener("DOMContentLoaded", async () => {
  /* Header controls are wired before any fetch, so navigation and the theme
     toggle keep working even if the content JSON fails to load */
  initThemeToggle(document.getElementById("theme-toggle"));
  initMobileNav(
    document.querySelector(".menu-toggle"),
    document.getElementById("site-nav")
  );

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
  } catch (error) {
    showLoadError(error);
  }
});
