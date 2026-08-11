# Portfolio site — starting template

A space-themed personal site, split into a conventional structure, ready to publish with GitHub Pages.

```
portfolio-site/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── img/          (drop your headshot / project screenshots here)
```

## Deploy it

1. Create a new GitHub repo named exactly `qgarton.github.io` (replace `qgarton` with your actual GitHub username if different — using this exact naming pattern gives you a site at the root domain, e.g. `https://qgarton.github.io`, with no extra path).
   - Alternative: use any repo name and enable Pages on it — your site will live at `https://qgarton.github.io/repo-name/` instead.
2. Push the whole folder's contents to the root of that repo (`main` branch).
3. In the repo, go to **Settings → Pages**, set Source to "Deploy from a branch," branch `main`, folder `/ (root)`. Save.
4. Give it a minute or two — your site goes live at the URL GitHub shows on that same settings page.

No dependencies, no build tools. Fonts load from Google Fonts over a CDN link in `index.html`; everything else is plain HTML/CSS/JS.

## Things to fill in before publishing

Search the files for `[bracketed text]` or the `.todo` styling (dashed underline, violet color) — these are the placeholders:

- **Name spelling** — I used "Quaid Garton" based on your GitHub handle `qgarton`; confirm/correct in `index.html`'s `<title>`, nav brand, hero `<h1>`, and footer.
- **Location** in the hero quick-facts line.
- **Résumé link** — nav button currently points to `#`.
- **LinkedIn URL** — three places (nav, hero, contact section) currently point to `#`.
- **Email address** — currently `you@example.com` in two `mailto:` links.
- **Star Tracker project card** — status, org/team size, description, tags, and repo/writeup link are all placeholders.
- **Rocket Launch Controller (MiSSE) project card** — same, plus your specific role at MiSSE.
- **Headshot** — the About section has a placeholder box labeled `[headshot]`. Drop an image into `img/`, then replace the placeholder `<div class="portrait">` in `index.html` with an `<img src="img/your-photo.jpg" alt="Quaid Garton">`.

## If you want to add a 4th (or 5th) project later

Copy one `<article class="card">...</article>` block under `#projects` in `index.html`, edit the content, and it'll drop into the grid automatically — no CSS changes needed.

