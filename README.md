# Personal Injury Site

Alvoratech is a static personal injury law practice website design demonstration.
The attorney profile, testimonials, results, achievements, and office location are
fictional. Contact details intentionally use `********` placeholders. The
consultation form is client-side only and does not transmit or store information.

## Run locally

Open `index.html` in a browser, or serve this directory with a local web server:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy

The site is plain HTML, CSS, and JavaScript with no build step. Every push to
`main` runs the GitHub Actions workflow in `.github/workflows/pages.yml` and
publishes the project root to GitHub Pages. The site will be available at
`https://alabamacashing.github.io/personalinjurysite/`.

GitHub Pages must use **GitHub Actions** as its build and deployment source in
the repository's Pages settings. Vercel can also be used as a separate hosting
target.
