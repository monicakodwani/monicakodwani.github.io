# Design Options

Three complete design directions were built for this site. All three render
the same shared content from `content/*.json`, so they differ only in layout,
typography, and visual character — never in facts.

**Current status: Option C (Human-Centered Warm Minimalism) is the
production design.** The pages at the repository root use it. Options A and B
remain fully working previews under `design-options/` in case the decision is
revisited.

Compare them side by side at
[http://localhost:8000/design-options/](http://localhost:8000/design-options/)
(after `python3 -m http.server 8000` from the repository root).

## Option A — Editorial Research Portfolio

- **Preview:** `design-options/editorial/index.html`
- **Files:** `design-options/editorial/` — four HTML pages plus
  `editorial.css` and `editorial.js`
- **Idea:** a calm, literary layout in the manner of a well-set research
  feature. Large serif headings (Iowan Old Style / Palatino / Georgia stack),
  narrow reading columns, thin hairline rules instead of cards, small
  uppercase labels, numbered case studies with an offset metadata rail, and a
  refined deep-green palette on warm paper.
- **Intended impression:** senior, considered, at home in both a university
  department and a research lab.
- **Strengths:** strongest typographic identity; publications page reads
  like a serious academic record; ages well.
- **Tradeoffs:** the most reserved of the three; systems-building work is
  presented quietly, which undersells the engineering side for
  research-engineer roles.

## Option B — Technical Research Systems

- **Preview:** `design-options/technical/index.html`
- **Files:** `design-options/technical/` — four HTML pages plus
  `technical.css` and `technical.js`
- **Idea:** a structured, modular layout that foregrounds the systems behind
  the research. Bordered panels, numbered section headers, monospace
  metadata labels (ROLE / SCALE / METHODS / STATUS), spec-sheet case studies
  with a metadata rail, an "At a glance" hero panel, and a cool palette with
  a single deep-blue accent. Publications include an accessible topic filter.
- **Intended impression:** someone who builds research infrastructure and
  treats studies as engineered systems.
- **Strengths:** best fit for research-engineering and human-data
  infrastructure roles; project metadata is extremely scannable.
- **Tradeoffs:** the most "product-spec" of the three; least warm; serif-free
  typography reads less traditionally academic.

## Option C — Human-Centered Warm Minimalism (production)

- **Live pages:** `index.html`, `projects.html`, `publications.html`,
  `cv.html`, `404.html` at the repository root
- **Preview copy kept at:** `design-options/warm/`
- **Idea:** warm, personal, minimal. Soft warm-neutral backgrounds, a
  terracotta accent, rounded-but-adult shapes, a larger portrait, pill
  buttons, tinted section bands, and story-style case studies ("The
  question", "My role", "What I built", "What we learned", "Where it
  stands").
- **Intended impression:** a human-centered researcher who is approachable
  and precise — comfortable with product teams as well as academics.
- **Strengths:** most direct first-person voice; friendly without being
  casual; case studies read as narratives rather than spec sheets.
- **Tradeoffs:** less overtly "systems-engineer" than Option B; less
  typographically formal than Option A.

## How the promotion was done (and how to switch)

The warm option was promoted by copying its four pages to the repository
root and adjusting paths — the design directories themselves were not
changed:

- Root pages (`index.html`, `projects.html`, `publications.html`,
  `cv.html`) are the warm pages with root-relative asset paths, `noindex`
  removed, canonical URLs added, and the preview footer note removed.
- `assets/css/site.css` is a copy of `design-options/warm/warm.css`.
- `assets/js/site.js` is `design-options/warm/warm.js` with imports pointed
  at `assets/js/data.js` and `assets/js/theme.js`.
- `assets/js/data.js` resolves `content/` relative to the module file
  (`import.meta.url`), so it works from any page location.
- `404.html` is a static warm-styled page with root-absolute paths (GitHub
  Pages serves it at arbitrary URLs) and no JavaScript dependency.
- The previous design's files were removed: `assets/css/{variables,base,
  layout,components,pages}.css`, `assets/js/{main,data-loader,nav}.js`,
  `components/`, and `content/featured-project.json` (its links live on in
  `content/projects.json`). They remain in git history.

To promote a different option later, repeat the same steps with that
option's CSS/JS/pages: copy its four pages to the root, rewrite
`../../` asset paths and `../shared/` module paths, drop `noindex`, add
canonicals, replace `assets/css/site.css` and the renderers in
`assets/js/site.js`, and re-check the static `404.html` styling still makes
sense for the new palette.

## Theme behavior (all options)

Light and dark themes follow the system preference, can be toggled manually,
and persist under the `localStorage` key `mk-theme`, shared across the
production site and every preview. The early loader
(`assets/js/theme-init.js` at the root, `design-options/shared/theme-init.js`
for previews) runs before stylesheets to avoid a flash of the wrong theme.
