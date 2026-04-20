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
  Publications page. Publication entries are plain HTML blocks with comments so they are easy to duplicate and edit.
- `cv.html`
  CV page. The PDF path is controlled by `content/site.json`.
- `404.html`
  Missing-page fallback.
- `content/site.json`
  Site title, footer text, navigation, and CV PDF path.
- `content/profile.json`
  Name, role, institution, location, short bio, and CV quick facts.
- `content/contact.json`
  Email and external profile links.
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
- Update navigation or CV path: edit `content/site.json`
- Update publications: edit `publications.html`
- Replace CV: replace `docs/resume.pdf`
- Replace profile image: replace `assets/images/profile/portrait-placeholder.svg`

## Add A Publication

Open `publications.html`.

Each paper is one clearly separated block:

```html
<article class="publication-card" id="unique-paper-id">
  <h2>Paper Title</h2>
  <p class="publication-authors">Author list</p>
  <p class="publication-meta">
    <span>Venue Year</span>
    <span class="badge">Optional status</span>
  </p>
  <p>Short abstract or description.</p>
  <div class="publication-links">
    <a class="text-link" href="https://example.com">PDF</a>
  </div>
</article>
```

Copy an existing block, paste it where the paper should appear, and edit the fields.

## GitHub Pages Deployment

1. Put the site files at the root of a GitHub repository.
2. Push the repository.
3. In GitHub, open `Settings -> Pages`.
4. Choose `Deploy from a branch`.
5. Select `main` and `/`.
6. Save.

The relative links and base-path helper are written to work on both local servers and GitHub Pages.
