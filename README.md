# Monica Kodwani Academic Website

Minimal static academic website for GitHub Pages.

The site has three public pages:

- `index.html` — brief bio, photo, contact information, and profile links
- `publications.html` — editable publication list
- `cv.html` — CV download page

There is no build step, framework, or dependency install.

## Folder Map

- `index.html`
  Home page. Most profile text is loaded from `content/profile.json` and `content/contact.json`.
- `publications.html`
  Publications page. Publication entries are rendered from `content/publications.json`.
- `cv.html`
  CV page. The PDF path is controlled by `content/site.json`.
- `404.html`
  Missing-page fallback.
- `content/site.json`
  Site title, footer text, navigation, and CV PDF path.
- `content/profile.json`
  Name, role, institution, location, short bio, and quick facts.
- `content/contact.json`
  Email and external profile links.
- `content/featured-project.json`
  The featured project shown on the homepage.
- `content/publications.json`
  Publication entries shown on the Publications page.
- `assets/css/`
  Styling.
- `assets/js/`
  Small scripts for loading shared header/footer/navigation and JSON-backed profile/contact content.
- `assets/images/profile/`
  Profile image.
- `docs/resume.pdf`
  CV PDF.

## Run Locally

Because the site loads shared components and JSON files with `fetch()`, preview it through a local server:

```bash
cd /Users/monicakodwani/Documents/Playground/monica-kodwani-site
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000).

## Common Edits

- Update homepage bio: edit `content/profile.json`
- Update email or profile links: edit `content/contact.json`
- Update featured project: edit `content/featured-project.json`
- Update navigation or CV path: edit `content/site.json`
- Update publications: edit `content/publications.json`
- Replace CV: replace `docs/resume.pdf`
- Replace profile image: replace `assets/images/profile/headshot-monica.jpg`

## Add A Publication

Open `content/publications.json`.

Each paper is one clearly separated object:

```json
{
  "id": "unique-paper-id",
  "title": "Paper Title",
  "authors": "Author list",
  "venue": "Venue",
  "year": "2026",
  "status": "Optional status",
  "summary": "Short abstract or description.",
  "links": [
    {
      "label": "PDF",
      "url": "https://example.com"
    }
  ]
}
```

Copy an existing object, paste it where the paper should appear, and edit the fields.

## Featured Project

The homepage featured project is controlled by `content/featured-project.json`.
Use `"primary"` for the main project link and `"secondary"` for supporting links.

## Theme

Light and dark colors live in `assets/css/variables.css`. The early theme loader is `assets/js/theme-init.js`, and the moon/sun toggle markup is in `components/header.html`.

## GitHub Pages Deployment

This repository deploys through `.github/workflows/pages.yml`.

The public site is served at [https://monicakodwani.github.io/](https://monicakodwani.github.io/). Pushing the GitHub Pages branch triggers a new deployment.
