# Monica Kodwani — Personal Website

Static academic and professional website for GitHub Pages. No framework, no
build step, no npm dependencies: plain HTML, CSS, vanilla JavaScript modules,
and JSON content files loaded with `fetch()`.

The production pages at the repository root use the **Human-Centered Warm
Minimalism** design (Option C of three explored directions). The other two
directions remain as working previews under `design-options/`. See
[DESIGN-OPTIONS.md](DESIGN-OPTIONS.md) for the full comparison and for how a
different option could be promoted later.

## Production pages

- `index.html` — hero, research profile, selected work
- `projects.html` — research case studies rendered from `content/projects.json`
- `publications.html` — publication list rendered from
  `content/publications.json`
- `cv.html` — CV download page
- `404.html` — static missing-page fallback (root-absolute paths, no
  JavaScript, since GitHub Pages serves it at arbitrary URLs)

## Production assets

- `assets/css/site.css` — all styling, light and dark themes (palette
  variables at the top of the file)
- `assets/js/site.js` — page renderers (home, projects, publications, CV)
- `assets/js/data.js` — JSON content loading and small DOM helpers
- `assets/js/theme.js` — theme toggle and mobile navigation behavior
- `assets/js/theme-init.js` — early theme loader that prevents a flash of
  the wrong theme
- `assets/images/profile/headshot-monica.jpg` — portrait
- `docs/resume.pdf` — the CV PDF

## Design previews

- `design-options/index.html` — comparison hub for all three directions
- `design-options/editorial/` — Option A: Editorial Research Portfolio
- `design-options/technical/` — Option B: Technical Research Systems
- `design-options/warm/` — Option C (the design now in production)
- `design-options/shared/` — data loading and theme behavior used by the
  previews

## Content model

All factual content lives in `content/` and is shared by the production site
and every preview, so a single edit updates everything:

- `content/site.json` — site name, footer text, navigation labels, CV PDF
  path, "last updated" date
- `content/profile.json` — name, role, institution, location, short bio
- `content/contact.json` — email and external profile links
- `content/portfolio.json` — hero copy, research-profile entries, page
  intros
- `content/projects.json` — structured case-study data for the research
  projects
- `content/publications.json` — publication entries (title, authors, venue,
  year, status, topics, summary, links)

See [EDITING-GUIDE.md](EDITING-GUIDE.md) for field-by-field editing help.

## Run locally

The site loads JSON content with `fetch()`, so preview it through a local
server from the repository root:

```bash
python3 -m http.server 8000
```

Then open:

- Production site: [http://localhost:8000](http://localhost:8000)
- Design previews: [http://localhost:8000/design-options/](http://localhost:8000/design-options/)

## Common edits

- Hero or research profile text: `content/portfolio.json`
- Projects and case studies: `content/projects.json`
- Publications: `content/publications.json`
- Email or profile links: `content/contact.json`
- Footer note, location, or "last updated": `content/site.json`
- Replace CV: overwrite `docs/resume.pdf`
- Replace portrait: overwrite `assets/images/profile/headshot-monica.jpg`
- Colors and themes: variables at the top of `assets/css/site.css`

## Theme

Light and dark mode follow the visitor's system preference, can be toggled
manually, and persist the choice in `localStorage` under the key `mk-theme`.
The production site and all previews share that key.

## Deployment

`.github/workflows/pages.yml` deploys the repository to GitHub Pages on every
push to `master`. The public site is served at
[https://monicakodwani.github.io/](https://monicakodwani.github.io/). Work on
other branches does not affect the live site until merged into `master`.
