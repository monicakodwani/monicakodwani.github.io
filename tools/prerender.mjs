/*
 * Bakes the publications list (plus lede and footer) from content/*.json
 * into publications.html, between the prerender markers, so the page works
 * without JavaScript. Plain Node, no dependencies.
 *
 * Run from the repository root after editing publications.json,
 * portfolio.json, or site.json:
 *
 *   node tools/prerender.mjs
 *
 * The generated markup mirrors the renderers in assets/js/site.js
 * (which skip containers carrying data-prerendered).
 */
import { readFileSync, writeFileSync } from "node:fs";

const read = (f) => JSON.parse(readFileSync(`content/${f}`, "utf8"));
const publications = read("publications.json");
const portfolio = read("portfolio.json");
const site = read("site.json").site;
const contact = read("contact.json");

const esc = (s) =>
  s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

const extLink = (url, label, cls = "text-link") =>
  `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`;

const highlight = (authors) =>
  esc(authors).replaceAll("Monica Kodwani", '<strong class="author-highlight">Monica Kodwani</strong>');

/* ---- publications list (mirrors renderPublications) ---- */

const groups = [];
for (const p of publications) {
  let g = groups.find((x) => x.year === p.year);
  if (!g) {
    g = { year: p.year, entries: [] };
    groups.push(g);
  }
  g.entries.push(p);
}

const listHtml = groups
  .map((group) => {
    const entries = group.entries
      .map((p) => {
        const venueText = p.issuePages ? `${p.venueFull}, ${p.issuePages}` : p.venueFull;
        const status = p.status ? ` · <span class="pub-status">${esc(p.status)}</span>` : "";
        const links =
          p.links && p.links.length
            ? `\n        <ul class="pub-links">${p.links
                .map((l) => `<li>${extLink(l.url, l.label)}</li>`)
                .join("")}</ul>`
            : "";
        return `      <article class="publication" id="${p.id}">
        <h2 class="pub-title">${esc(p.title)}</h2>
        <p class="pub-authors">${highlight(p.authors)}</p>
        <p class="pub-venue">${esc(venueText)}${status}</p>
        <p class="pub-summary">${esc(p.summary)}</p>${links}
      </article>`;
      })
      .join("\n");
    return `    <section class="pub-year-group" aria-label="Publications from ${esc(group.year)}">
      <p class="pub-year">${esc(group.year)}</p>
      <div class="pub-entries">
${entries}
      </div>
    </section>`;
  })
  .join("\n");

/* ---- footer (mirrors renderFooter) ---- */

const footerLinks = [
  `<li><a class="" href="mailto:${esc(contact.email)}">${esc(contact.email)}</a></li>`,
  ...contact.links.map((l) => `<li>${extLink(l.url, l.label, "")}</li>`),
].join("");

const footerHtml = `      <div class="footer-identity">
        <p class="footer-name">Monica Kodwani</p>
        <p class="footer-note">${esc(site.footerNote)}</p>
        <p class="footer-meta">${esc(site.location)} · Last updated: ${esc(site.lastUpdated)}</p>
      </div>
      <ul class="footer-links">${footerLinks}</ul>`;

/* ---- splice into publications.html ---- */

const replaceBetween = (html, start, end, replacement) => {
  const a = html.indexOf(start);
  const b = html.indexOf(end);
  if (a === -1 || b === -1) {
    throw new Error(`Markers not found: ${start}`);
  }
  return html.slice(0, a + start.length) + "\n" + replacement + "\n    " + html.slice(b);
};

let page = readFileSync("publications.html", "utf8");
page = page.replace(
  /(<p class="page-lede" id="page-lede">)[^<]*(<\/p>)/,
  `$1${esc(portfolio.publicationsPage.lede)}$2`
);
page = replaceBetween(page, "<!-- prerender:publications:start -->", "<!-- prerender:publications:end -->", listHtml);
page = replaceBetween(page, "<!-- prerender:footer:start -->", "<!-- prerender:footer:end -->", footerHtml);
writeFileSync("publications.html", page);
console.log(`prerendered ${publications.length} publications in ${groups.length} year groups`);

/* ---- version-stamp asset references ----
   A single stamp ties each page to the exact CSS/JS/JSON it was written
   against, so a redeploy can never pair fresh HTML with a stale cached
   script (or vice versa). Run this script before every commit. */

const stamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 12);
const vq = (s) => s.replace(/(assets\/(?:css\/site\.css|js\/site\.js|js\/theme-init\.js))(\?v=\d+)?/g, `$1?v=${stamp}`);

for (const file of ["index.html", "projects.html", "publications.html", "cv.html", "404.html"]) {
  let doc = vq(readFileSync(file, "utf8"));
  if (doc.includes('name="site-version"')) {
    doc = doc.replace(/(<meta name="site-version" content=")\d*(")/, `$1${stamp}$2`);
  } else {
    doc = doc.replace('<meta charset="utf-8">', `<meta charset="utf-8">\n  <meta name="site-version" content="${stamp}">`);
  }
  writeFileSync(file, doc);
}

let siteJs = readFileSync("assets/js/site.js", "utf8");
siteJs = siteJs.replace(/\.\/(data|theme)\.js(\?v=\d+)?/g, `./$1.js?v=${stamp}`);
writeFileSync("assets/js/site.js", siteJs);
console.log(`stamped assets with version ${stamp}`);
