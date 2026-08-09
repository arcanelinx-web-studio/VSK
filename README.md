# VSK Electro-Mech Solutions Website

Production website source for **VSK Electro-Mech Solutions**, Bengaluru.

## Production rule

Do **not** deploy the repository root.

The repository contains the original project archive under `assets-source/`, including large photographs, videos and working documents that are intentionally kept separate from the public website.

Build the public package with:

```bash
python scripts/site/build_dist.py
```

Deploy **only the contents of `dist/`**.

The build copies the live HTML/CSS/JavaScript, optimized `media/`, security/crawler files and the two customer-facing PDF downloads. It rewrites the PDF URLs to clean public paths and fails if an `assets-source/` reference leaks into the production package.

## Hosting configuration

For a static host that supports a build command:

- **Build command:** `python scripts/site/build_dist.py`
- **Output directory:** `dist`
- **Node.js runtime:** not required

For conventional shared hosting, run the build locally or use the GitHub Actions `vsk-static-site` artifact and upload the contents of the generated package to the web root.

## Repository structure

- `index.html` — main website
- `404.html` — custom not-found page
- `styles*.css` — visual and responsive layers
- `script.js`, `motion.js`, `ux-v2.js` — interactions, real-machine motion and production UX
- `media/` — generated web-optimized images and videos
- `assets-source/` — original VSK source archive; **never deploy directly**
- `scripts/media/` — media optimization and wiring
- `scripts/site/` — production polish, package build and deployment validation
- `_headers` — security and caching policy for compatible static hosts
- `robots.txt` — crawler policy

## Automated checks

`Validate production site` runs on changes to `main` and pull requests. It:

1. validates local resources, production media paths and security headers;
2. checks the SEO/structured-data and enquiry UX baseline;
3. builds the isolated `dist/` package;
4. validates that the raw source archive and camera formats are excluded;
5. uploads a deploy-ready `vsk-static-site` artifact for main-branch runs.

`Build production media` regenerates web derivatives from selected source photographs/videos and reapplies the production page wiring.

## Domain finalization

Canonical URL, sitemap URL and absolute social-preview image URL should be added only after the final public VSK domain is confirmed. This avoids publishing incorrect search-engine ownership signals during development.
