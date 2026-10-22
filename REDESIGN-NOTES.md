# Redesign Notes — July 2026

A design and editorial pass over the production site. The goal: keep the warm
cream/terracotta palette, but make the site read as an editorial research
portfolio — typography, whitespace, and thin rules doing the work that
rounded cards and pills used to do — and show the systems Monica builds, not
just say she builds them.

## What changed

### Cards and pills, reduced deliberately
The previous pass styled nearly everything as a rounded, bordered, or tinted
container: nav pills, pill buttons, four "What I work on" cards, four
identical project cards, publication cards, a CV panel. All four pages read
as one reusable template. Now:

- Navigation is plain text links; the current page gets weight plus an
  accent underline (never color alone).
- Primary buttons are slightly rounded rectangles; secondary actions are
  underlined text links.
- Sections open with a thin rule and a small-caps label instead of a box.
- Tinted panels appear in exactly two places, both carrying evidence: the
  featured study's pull-quote on the homepage and the findings block in a
  case study.
- The only pill left is a small status badge (Published / Open source / In
  progress) on project case studies.

### Homepage hierarchy
The homepage previously gave all four projects identical card treatment. Now
it descends in visual weight: hero → how I work (Study / Build / Apply, three
ruled columns replacing the four-card grid) → the auditing platform as the
largest feature with a real interface image and a Survey → Chat → Audit →
Export workflow strip → the auditing/trust study with a serif pull-finding →
two in-progress projects as text teasers → a short job-search note → footer.

### Projects page
Was: four long identical cards. Now: an editorial case-study layout — a
compact text index ("On this page"), then numbered case studies with a thin
top rule, a left rail of compact facts (status, scale, methods, stack,
publications, links; sticky on desktop, a two-column block above the prose on
mobile), and a main column whose section labels vary by project ("Why the
platform exists" / "What we tested" / "Why histories matter" / "What we are
asking" — stored per-project in `content/projects.json` under `headings`).
Published and in-progress projects render differently: findings panels and
publication links for published work; research questions and an explicit
"Current status" section for work still in the field. No empty sections.

### Publications page
Was: rounded cards with chip rows. Now: a bibliography — entries grouped by
year with the year as a serif marker in a narrow left column, thin rules
between entries, serif titles, Monica's name bolded in the author list, full
venue names in italic, plain-language summaries, text links. "Preprint" is
plain bold text, not a pill. Topic tags are retained in the JSON but no
longer displayed (not enough entries to justify filtering).

### CV page and footer
The CV panel became an open block: heading, one line, a primary button, an
email text link, a thin divider, a short summary. The footer is a simple
two-column band: identity + descriptor + location/updated on the left, text
links on the right.

### Typography and portrait
Serif display (ui-serif/Georgia stack) for Monica's name, page headings,
project titles, and pull-quotes; system sans for body, nav, and metadata.
The portrait is now a 4:5 crop (CSS only — the original file is untouched)
sitting on an offset tinted block instead of inside a rounded card, larger on
desktop, portrait-first and modest on mobile.

### Visual evidence
- `assets/images/projects/audit-annotation.png` — a frame from the auditing
  platform's own tutorial video (`public/tutorial-marking.mov` in the public
  gwusec/GenAI-Auditing repository), showing turn-level highlight-to-mark on
  a chatbot reply. It uses the tutorial's placeholder text; no participant
  data. The live demo currently boots to a backend-settings screen (no LLM
  connected), so a better full-interface screenshot needs Monica to run the
  system locally with a model attached — worth replacing when available.
- A Survey → Chat → Audit → Export workflow strip built as an ordered list
  (accessible by structure; arrows are decorative).
- `assets/images/og/social-card.png` — a 1200×630 branded social-preview
  card (name, role line, palette) replacing the portrait as the og:image.

## Copy rewrites
- Hero: "Human-centered AI researcher" + "I study what people notice, miss,
  trust, and disclose when they use generative AI. I also build the study
  tools behind that work: chat interfaces, annotation workflows, and privacy
  dashboards." (replaces the "evaluate, trust, audit, and govern … at scale"
  sentence).
- "What I work on" (four boxed categories) → "How I work": Study / Build /
  Apply, written as plain sentences.
- Project summaries rewritten around concrete subjects ("We asked 254
  people…"), findings phrased as events rather than abstractions, and the
  packaged topic-list sentences removed from page intros.
- Footer descriptor: "PhD research at The George Washington University on
  how people audit and trust generative AI." A keyword-list descriptor
  ("Human-centered AI research, evaluation tools, privacy, and usable
  security.") was drafted first but replaced after an editorial review pass
  flagged it as the packaged-noun pattern this redesign removes — worth
  Monica's confirmation, since it also drops the privacy/security keywords
  from the footer.
- A post-redesign review pass tightened more copy: the projects-page lede no
  longer claims all four projects pair a question with software (the
  workplace study doesn't); the home teasers for both featured projects now
  differ from their case-study openings; the home pull-quote ("Hunting for
  problems usually left participants trusting the chatbot more — even when
  the hunt turned up little.") now lives in content/projects.json as
  `pullQuote`; the closing section reads "I'm looking for research and
  research-engineering roles. If your team evaluates AI systems with real
  users — or needs the tooling to do it — I'd like to talk."

## Content corrections
- FAccT 2026 paper: "To appear" removed; link now points to the verified DOI
  `https://doi.org/10.1145/3805689.3806751` (resolves to the ACM DL entry;
  confirmed via doi.org redirect on 2026-07-29).
- Project status: "Published at FAccT 2026, SOUPS 2025, and ConPro 2025".
- `content/profile.json`: trimmed to name/pronouns/role/institution/location;
  the stale "PhD student in usable security and privacy" bio and the unused
  `shortBio`/`quickFacts` fields were removed (nothing rendered them).
- `content/site.json`: removed unused `roleLine` and `navigation` (nav is
  static HTML since the warm promotion); tagline/description updated to the
  current framing.
- `content/portfolio.json`: `researchProfile` is kept ONLY because the
  archived design previews under `design-options/` still render it; the
  production site no longer uses it.

## Wording that still needs Monica's confirmation
- "I led the interactive study — 254 participants, 551 conversations — and
  designed and deployed the chat, survey, and annotation system it ran on."
  The "led" claim matches her CV ("Led a 250-participant study…"); confirm
  she wants it stated this strongly, and that co-authors agree.
- "React, Node.js, and MongoDB" as the platform stack (from the public
  TRAILS repo README).
- The featured-study pull line: "Probing frequently increased trust in the
  chatbot — even when it was limited or unsuccessful."
- The job-search line and its placement ("I am exploring research and
  research-engineering roles…") — including whether to add timing.

## Visuals that could still be improved
- Replace the tutorial-frame image with a real (non-participant) screenshot
  of the full study interface once one can be produced from a locally
  running instance.
- Optionally add a dashboard visual for the interaction-history study when
  the system is far enough along.

---

# Design feedback pass — October 2026

Responding to external design feedback ("sections all feel the same",
"headings too small", "statuses don't read as tags", "AI-template beige",
"publications should work without JavaScript") plus a set of example pages.

## What changed

- **Display face.** Fraunces (variable, SIL OFL, self-hosted in
  `assets/fonts/fraunces/` — no external font requests) now carries the
  name, page/section headings, project and publication titles, numerals,
  and pull moments. Body stays system sans; micro-labels move to the
  system mono stack.
- **Real section headings.** The homepage's 12px label-as-heading pattern
  is gone: each section opens with a mono-numbered overline ("02 /
  Featured project") and, where the section needs one, a ~30px serif
  heading. Full-width document rules removed; scale does the separating.
- **Hero.** Role line and PhD context are co-located; a quiet "Currently
  looking" line links to the closing section; the name is slightly
  smaller in Fraunces.
- **Status pills.** Project maturity renders as small mono pills with
  muted status tints (published / open source / analysis / recruitment
  pending), AA-checked in both themes. The long dot-separated status
  strings left the homepage.
- **Custom visuals.** The homepage screenshot was replaced by two honest,
  palette-native figures: a four-step flow (Survey → Chat → Audit →
  Export, grounded in the platform's real capabilities) and a 254-dot
  SVG matrix (one dot per participant). The interface screenshot moved
  into the auditing case study on the projects page (new `image` field
  in `content/projects.json`).
- **Projects page.** Numbered table-of-contents (two columns, top-down —
  the sticky variant was considered and deferred), 27px serif case
  numerals, category taglines removed from case headers, and the role
  paragraph restyled as a labeled "my part" inset.
- **Publications without JavaScript.** `tools/prerender.mjs` (plain
  Node, run manually — no build pipeline) bakes the publication list,
  lede, and footer into `publications.html`; `site.js` skips containers
  marked `data-prerendered`.
- **Dark mode.** Surfaces neutralized to charcoal so the terracotta/
  apricot accent carries the warmth.
- Social card regenerated in Fraunces.

## Deliberately not adopted from the example pages

Hiding projects behind a one-at-a-time index with tabs; question-style
headlines replacing project titles; the fictional interactive demo
panel; "Let's talk" CTA copy; a tilted portrait; Google-hosted webfonts.
