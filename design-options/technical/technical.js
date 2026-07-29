/* Option B — Technical Research Systems: page rendering. */

import {
  loadPortfolioContent,
  el,
  clearChildren,
  highlightAuthor,
  showLoadError
} from "../shared/data.js";
import { initThemeToggle, initMobileNav } from "../shared/theme.js";

function pad(index) {
  return String(index + 1).padStart(2, "0");
}

/* <dt class="spec-label">LABEL</dt><dd>…</dd> pair appended to a <dl>. */
function specRow(dl, label, value) {
  if (!value) {
    return null;
  }
  dl.appendChild(el("dt", "spec-label", label));
  const dd = el("dd");
  if (typeof value === "string") {
    dd.textContent = value;
  } else {
    dd.appendChild(value);
  }
  dl.appendChild(dd);
  return dd;
}

function chipSet(items) {
  const wrap = el("div", "chip-set");
  items.forEach((item) => wrap.appendChild(el("span", "chip", item)));
  return wrap;
}

function externalize(anchor, url) {
  anchor.href = url;
  if (/^https?:/.test(url)) {
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
  }
}

/* "FAccT 2026" label for a publication id, if it exists in the data. */
function pubLabel(publications, id) {
  const pub = publications.find((entry) => entry.id === id);
  return pub ? `${pub.venue} ${pub.year}` : "";
}

/* ---------- Footer (all pages) ---------- */

function renderFooter(content) {
  const footer = document.querySelector("[data-footer]");
  if (!footer) {
    return;
  }
  clearChildren(footer);

  footer.appendChild(el("p", "footer-name", content.site.site.name));
  footer.appendChild(el("p", "", content.site.site.footerNote));
  footer.appendChild(el("p", "", content.site.site.location));
  footer.appendChild(el("p", "meta-line", `Last updated: ${content.site.site.lastUpdated}`));

  const links = el("ul", "footer-links");
  const emailItem = el("li");
  const emailLink = el("a", "", content.contact.email);
  emailLink.href = `mailto:${content.contact.email}`;
  emailItem.appendChild(emailLink);
  links.appendChild(emailItem);
  content.contact.links.forEach((link) => {
    const item = el("li");
    const anchor = el("a", "", link.label);
    externalize(anchor, link.url);
    item.appendChild(anchor);
    links.appendChild(item);
  });
  footer.appendChild(links);

  const note = el("p", "preview-note", "Design preview — not the production site. ");
  const hub = el("a", "", "All design previews");
  hub.href = "../index.html";
  note.appendChild(hub);
  footer.appendChild(note);
}

/* ---------- Home ---------- */

function renderHome(content) {
  const { portfolio, projects, contact, site } = content;

  document.querySelector("[data-hero-role]").textContent = portfolio.hero.roleLine;
  document.querySelector("[data-hero-lede]").textContent = portfolio.hero.lede;
  document.querySelector("[data-hero-context]").textContent = portfolio.hero.context;

  const linkList = document.querySelector("[data-profile-links]");
  clearChildren(linkList);
  contact.links.forEach((link) => {
    const item = el("li");
    const anchor = el("a", "", link.label);
    externalize(anchor, link.url);
    item.appendChild(anchor);
    linkList.appendChild(item);
  });
  const emailItem = el("li");
  const emailLink = el("a", "", "Email");
  emailLink.href = `mailto:${contact.email}`;
  emailItem.appendChild(emailLink);
  linkList.appendChild(emailItem);

  /* "At a glance" panel — real data only. */
  const glance = document.querySelector("[data-glance]");
  clearChildren(glance);
  specRow(glance, "Focus", site.site.tagline);
  const auditStudy = projects.find((p) => p.id === "how-people-audit");
  if (auditStudy && auditStudy.scale) {
    specRow(glance, "Scale", auditStudy.scale);
  }
  const platform = projects.find((p) => p.id === "auditing-infrastructure");
  if (platform && platform.status) {
    specRow(glance, "Platform", platform.status);
  }

  const grid = document.querySelector("[data-research-profile]");
  clearChildren(grid);
  portfolio.researchProfile.forEach((entry) => {
    const cell = el("div", "profile-cell panel");
    cell.appendChild(el("h3", "", entry.label));
    cell.appendChild(el("p", "", entry.value));
    grid.appendChild(cell);
  });

  const workList = document.querySelector("[data-selected-work]");
  clearChildren(workList);
  projects.forEach((project) => {
    const row = el("article", "work-row panel panel--accent-top");
    const top = el("div", "work-row-top");
    top.appendChild(el("span", "chip", project.category));
    top.appendChild(el("span", "meta-line", project.scale || project.status));
    row.appendChild(top);

    const heading = el("h3");
    const titleLink = el("a", "", project.title);
    titleLink.href = `projects.html#${project.id}`;
    heading.appendChild(titleLink);
    row.appendChild(heading);

    row.appendChild(el("p", "", project.oneLiner));

    const caseLink = el("a", "case-link", "Case study →");
    caseLink.href = `projects.html#${project.id}`;
    caseLink.setAttribute("aria-label", `Case study: ${project.title}`);
    row.appendChild(caseLink);
    workList.appendChild(row);
  });
}

/* ---------- Projects ---------- */

function proseBlock(heading, value) {
  const block = el("div", "prose-block");
  block.appendChild(el("h3", "", heading));
  if (Array.isArray(value)) {
    const list = el("ul");
    value.forEach((item) => list.appendChild(el("li", "", item)));
    block.appendChild(list);
  } else {
    block.appendChild(el("p", "", value));
  }
  return block;
}

function renderProjects(content) {
  const { portfolio, projects, publications } = content;
  document.querySelector("[data-page-lede]").textContent = portfolio.projectsPage.lede;

  const container = document.querySelector("[data-projects]");
  clearChildren(container);

  projects.forEach((project, index) => {
    const article = el("article", "project");
    article.id = project.id;

    const header = el("header", "project-header");
    header.appendChild(el("span", "section-index", pad(index)));
    header.appendChild(el("span", "chip", project.category));
    if (project.status) {
      header.appendChild(el("span", "badge", project.status));
    }
    article.appendChild(header);
    article.appendChild(el("h2", "", project.title));

    const body = el("div", "project-body");
    const prose = el("div", "project-prose");
    if (project.summary) {
      prose.appendChild(proseBlock("Summary", project.summary));
    }
    if (project.problem) {
      prose.appendChild(proseBlock("The problem", project.problem));
    }
    if (project.whyItMatters) {
      prose.appendChild(proseBlock("Why it matters", project.whyItMatters));
    }
    if (project.built && project.built.length) {
      prose.appendChild(proseBlock("What I built", project.built));
    }
    if (project.questions && project.questions.length) {
      prose.appendChild(proseBlock("Questions this work asks", project.questions));
    }
    if (project.findings && project.findings.length) {
      prose.appendChild(proseBlock("What we learned", project.findings));
    }
    if (project.statusNote) {
      prose.appendChild(el("p", "status-note", project.statusNote));
    }
    body.appendChild(prose);

    const rail = el("aside", "meta-rail panel panel--accent-top");
    rail.setAttribute("aria-label", `${project.title} details`);
    const dl = el("dl");
    specRow(dl, "Role", project.role);
    specRow(dl, "Scale", project.scale);
    if (project.methods && project.methods.length) {
      specRow(dl, "Methods", chipSet(project.methods));
    }
    specRow(dl, "Stack", project.stack);
    specRow(dl, "Status", project.status);
    specRow(dl, "Collaborators", project.collaborators);

    const linkItems = [];
    (project.links || []).forEach((link) => {
      const item = el("li");
      const anchor = el("a", link.type === "primary" ? "link--primary" : "", link.label);
      externalize(anchor, link.url);
      item.appendChild(anchor);
      linkItems.push(item);
    });
    (project.publications || []).forEach((pubId) => {
      const label = pubLabel(publications, pubId);
      if (!label) {
        return;
      }
      const item = el("li");
      const anchor = el("a", "", `Publication: ${label}`);
      anchor.href = `publications.html#${pubId}`;
      item.appendChild(anchor);
      linkItems.push(item);
    });
    if (linkItems.length) {
      const list = el("ul", "link-list");
      linkItems.forEach((item) => list.appendChild(item));
      specRow(dl, "Links", list);
    }

    rail.appendChild(dl);
    body.appendChild(rail);
    article.appendChild(body);
    container.appendChild(article);
  });
}

/* ---------- Publications ---------- */

function renderPublications(content) {
  const { portfolio, publications } = content;
  document.querySelector("[data-page-lede]").textContent = portfolio.publicationsPage.lede;

  const list = document.querySelector("[data-pub-list]");
  clearChildren(list);

  publications.forEach((pub) => {
    const row = el("article", "pub-row panel");
    row.id = pub.id;
    row.dataset.topics = pub.topics.join("|");

    row.appendChild(el("p", "pub-year", pub.year));

    const main = el("div", "pub-main");
    main.appendChild(el("h2", "", pub.title));

    const authors = el("p", "pub-authors");
    authors.appendChild(highlightAuthor(pub.authors));
    main.appendChild(authors);

    const tags = el("div", "pub-tags");
    const venue = el("span", "chip", pub.venue);
    venue.title = pub.venueFull;
    tags.appendChild(venue);
    if (pub.status) {
      tags.appendChild(el("span", "badge", pub.status));
    }
    pub.topics.forEach((topic) => tags.appendChild(el("span", "chip", topic)));
    main.appendChild(tags);

    main.appendChild(el("p", "pub-summary", pub.summary));

    if (pub.links && pub.links.length) {
      const links = el("div", "pub-links");
      pub.links.forEach((link) => {
        const anchor = el("a", "", link.label);
        externalize(anchor, link.url);
        links.appendChild(anchor);
      });
      main.appendChild(links);
    }

    row.appendChild(main);
    list.appendChild(row);
  });

  initTopicFilter(publications);
}

/* Topic filter: All + one button per topic present in the data. */
function initTopicFilter(publications) {
  const bar = document.querySelector("[data-filter-bar]");
  const live = document.querySelector("[data-filter-status]");
  const rows = Array.from(document.querySelectorAll(".pub-row"));
  const topics = [...new Set(publications.flatMap((pub) => pub.topics))];

  function applyFilter(topic) {
    let shown = 0;
    rows.forEach((row) => {
      const match = topic === "All" || row.dataset.topics.split("|").includes(topic);
      row.hidden = !match;
      if (match) {
        shown += 1;
      }
    });
    bar.querySelectorAll("button").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.topic === topic));
    });
    live.textContent = `Showing ${shown} of ${rows.length} publications`;
  }

  ["All", ...topics].forEach((topic) => {
    const button = el("button", "filter-btn", topic);
    button.type = "button";
    button.dataset.topic = topic;
    button.setAttribute("aria-pressed", String(topic === "All"));
    button.addEventListener("click", () => applyFilter(topic));
    bar.appendChild(button);
  });
  live.textContent = `Showing ${rows.length} of ${rows.length} publications`;
}

/* ---------- CV ---------- */

function renderCv(content) {
  const { portfolio, contact, site } = content;
  document.querySelector("[data-page-lede]").textContent = portfolio.cvPage.lede;
  document.querySelector("[data-cv-summary]").textContent = portfolio.cvPage.summary;

  const cvLink = document.querySelector("[data-cv-link]");
  cvLink.href = `../../${site.site.cvPath}`;

  const emailLink = document.querySelector("[data-email-link]");
  emailLink.href = `mailto:${contact.email}`;

  const linkList = document.querySelector("[data-profile-links]");
  clearChildren(linkList);
  contact.links.forEach((link) => {
    const item = el("li");
    const anchor = el("a", "", link.label);
    externalize(anchor, link.url);
    item.appendChild(anchor);
    linkList.appendChild(item);
  });
}

/* ---------- Boot ---------- */

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
