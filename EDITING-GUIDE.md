# Editing Guide

This site is intentionally small and edited mostly through JSON files in
`content/`. Those files feed the production pages at the repository root and
the design previews under `design-options/`, so one edit updates everything.

## Preview locally

From the repository root:

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) for the production site
and [http://localhost:8000/design-options/](http://localhost:8000/design-options/)
for the design previews. Edit, save, refresh. (If a change to a JSON file
doesn't appear, do a hard refresh — the browser sometimes caches the JSON
for a few minutes.)

JSON rules that always apply: double quotes around text, commas between
fields, no trailing comma after the last field. If a page shows a loading
error, the most likely cause is a JSON syntax slip — run:

```bash
python3 -m json.tool content/projects.json
```

(or whichever file you touched) to find the exact line.

## Edit the homepage hero and research approach

Open `content/portfolio.json`:

- `hero.roleLine` — the line under your name
- `hero.lede` — the first-person introduction sentence
- `hero.context` — the "PhD candidate…" line
- `researchApproach` — the two "Research approach" paragraphs
- `homeSupportingProjects` — project ids shown under "More selected work"
- `projectsPage.lede`, `publicationsPage.lede`, `cvPage.lede`,
  `cvPage.summary` — the intro text on those pages

## Edit projects and case studies

Open `content/projects.json`. Each project is one object; empty strings and
empty arrays are simply skipped by the pages:

- `id` — used for links like `projects.html#auditing-infrastructure`; do not
  change casually
- `category` — short label, e.g. "Research infrastructure"
- `title`, `shortTitle` (in-page index), `oneLiner`, `summary`
- `teaser` — shorter homepage version of the summary (featured projects)
- `pullQuote` — the homepage pull-finding (featured study only)
- `problem` — motivation paragraph
- `whyItMatters` — optional context paragraph
- `headings` — optional per-project section-title overrides, e.g.
  `{"problem": "What we tested"}`
- `role` — what you personally did (first person)
- `built` — list of system capabilities
- `questions` — list of research questions
- `findings` — list of results; leave empty until results are real
- `methods` — short labels shown in the left rail
- `stack`, `scale`, `status`, `statusNote`, `collaborators` — rail facts
- `maturity` — explicit badge value: `published`, `open-source`,
  `analysis`, `recruiting`, or `in-progress`
- `publications` — publication `id`s from `content/publications.json`,
  rendered as venue links automatically
- `links` — objects with `label`, `url`, `type` (`"primary"` renders as the
  closing button; secondary external links appear in the rail unless a
  linked publication already carries the same URL)

## Edit publications

Open `content/publications.json`. Each entry:

- `id` — anchor target; projects reference it via their `publications` field
- `title`, `authors` (plain comma-separated string; your name is bolded
  automatically), `venue`, `venueFull`, `year`
- `status` — e.g. "To appear" or "Preprint"; empty string hides the badge
- `topics` — small labels; keep to the existing set ("Generative AI
  evaluation", "Measurement & methods", "Privacy transparency") or update
  the set deliberately
- `summary` — one short plain-language paragraph
- `links` — `label` + `url`; use an empty array when there is no link yet

To add a paper: copy an existing object, give it a new `id`, edit the
fields.

## Edit contact links

`content/contact.json` — `email` plus the GitHub / LinkedIn / Google Scholar
links. Remove a link by deleting its whole object.

## Edit the footer, location, or CV path

`content/site.json` — `footerNote`, `location`, `lastUpdated` (shown in
every footer; update it when you publish meaningful changes), and `cvPath`
(currently `docs/resume.pdf`).

## Replace the CV or portrait

- CV: overwrite `docs/resume.pdf` (keep the filename, or update `cvPath` in
  `content/site.json`).
- Portrait: overwrite `assets/images/profile/headshot-monica.jpg`. Pages
  crop it with CSS; the file itself is never modified.

## Edit colors and themes

Production: the palette lives in CSS variables at the top of
`assets/css/site.css` — `:root` for light, `:root[data-theme="dark"]` for
dark. Each design preview keeps its own palette at the top of its CSS file
(`design-options/editorial/editorial.css`,
`design-options/technical/technical.css`, `design-options/warm/warm.css`).

## Page structure (when text lives in HTML)

The static page skeletons are the root HTML files themselves. Headings such
as "Research approach", "Featured project", and "More selected work" are in
`index.html`; the 404 page text is in `404.html`. The renderers that fill in
JSON-driven parts are in `assets/js/site.js`.

## The design previews

The three previews share rendering infrastructure in
`design-options/shared/` (`data.js`, `theme.js`, `theme-init.js`). Layout
and styling live in each option's own directory. See
[DESIGN-OPTIONS.md](DESIGN-OPTIONS.md) for what each option is trying to do
and how the warm option was promoted to production.
