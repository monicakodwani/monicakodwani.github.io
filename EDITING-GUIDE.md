# Editing Guide

This site is intentionally small. The main pages are:

- Home: `index.html`
- Publications: `publications.html`
- CV: `cv.html`

## Preview Locally

```bash
cd /Users/monicakodwani/Documents/Playground/monica-kodwani-site
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000), make edits, save, and refresh.

## Edit Homepage Text

Open `content/profile.json`.

Most homepage fields come from:

- `name`
- `role`
- `institution`
- `location`
- `shortBio`

Keep JSON syntax valid: double quotes around text, commas between fields, and no trailing comma after the last field.

## Edit Contact Links

Open `content/contact.json`.

Update:

- `email`
- GitHub URL
- LinkedIn URL
- Google Scholar URL

To remove a profile link, delete its whole object from the `links` array.

## Edit Navigation Or CV Path

Open `content/site.json`.

The navigation currently contains only:

- Home
- Publications
- CV

The CV PDF path is:

```json
"cvPath": "docs/resume.pdf"
```

## Edit Light And Dark Mode Colors

Open `assets/css/variables.css`.

The light theme colors are in `:root`. The dark theme colors are in
`:root[data-theme="dark"]`. The moon/sun button itself lives in
`components/header.html`.

## Edit Publications

Open `publications.html`.

Each publication is one repeated block. The source includes comments for the fields:

- title
- authors
- venue / year / status
- abstract or short description
- links

To add a new paper:

1. Copy one full `<article class="publication-card">` block.
2. Paste it where the paper should appear.
3. Change the `id`.
4. Edit the title, authors, venue/year, description, and links.

If a paper has no link yet, leave the `publication-links` div empty.

## Replace The CV

Replace:

```text
docs/resume.pdf
```

Keep the filename `resume.pdf` unless you also update `content/site.json`.

## Replace The Profile Image

The current homepage image is:

```text
assets/images/profile/headshot-monica.jpg
```

Replace that file with a portrait or update the image path in `index.html`.
