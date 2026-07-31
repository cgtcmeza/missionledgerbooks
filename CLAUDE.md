# CLAUDE.md — Standing House Rules (Mission Ledger Books)

You are my build partner for this static HTML website. I run several businesses and want the
*same clean organization* on every one so I can manage them all myself. Follow these conventions
exactly.

## 1. Machine organization
- All my websites live under one parent folder: `~/Desktop/Sites/`
- This business lives in `~/Desktop/Sites/Mission Ledger Books/`.
- One business = one folder = one GitHub repo = one Cloudflare Pages project.

## 2. Project structure — plain static files, no build step, no framework
```
Mission Ledger Books/
├── index.html · services.html · pricing.html · about.html · contact.html · thank-you.html
├── assets/css/styles.css   (ALL styling lives here)
├── assets/js/main.js       (nav toggle, header state, scroll-reveal, count-up)
├── assets/img/             (logo + photos)
├── robots.txt · sitemap.xml
├── CLAUDE.md · README.md · .gitignore
```

## 3. Single source of truth for design
- **Every color, font, and spacing value is a CSS variable** defined once in the `:root {}` block
  at the top of `styles.css`. Never hardcode a hex value anywhere else.
- Change a token and it must propagate everywhere automatically.
- **Any design decision made on one page becomes the site-wide standard.** Buttons, cards, and
  spacing must match across every page — do not let pages drift.

## 4. Shared header & footer
- The nav header and footer are **byte-for-byte identical** on every page (the only allowed
  difference is `aria-current="page"` on the active nav link).
- When the header or footer changes, update it on *all six* pages in the same pass.

## 5. Brand & voice
- **Name:** Mission Ledger Books. **Tagline:** clear, professional bookkeeping for nonprofits and
  small-to-midsize businesses. **Motto:** “No job is too small or too big.”
- **Palette:** ivory paper `--paper`, navy ink `--navy`, forest green `--green`, brass gold `--gold`.
- **Type:** Fraunces (display serif) + Inter (body).
- **Voice:** warm, clear, trustworthy, jargon-free. We are bookkeepers, not tax preparers — we
  coordinate with the client's CPA but do not file returns (keep this accurate in copy).
- **Contact:** phone (314) 397-8863 → `tel:+13143978863`; email `hello@missionledgerbooks.com`;
  St. Louis, MO; by appointment Mon–Fri; serves clients nationwide/remotely.

## 6. My working style
- I work **iteratively and visually.** Build one thing, show me, I react in plain language, you
  implement precisely.
- Keep the code clean and semantic — I may hand it back to you months later.
- Explain what you're doing in plain language. Assume I'm not a developer but can follow clear steps.

## 7. Open placeholders to fill before launch
- `YOUR_WEB3FORMS_ACCESS_KEY` in `contact.html` (get a free key at web3forms.com).
- `[FACEBOOK URL]` and `[LINKEDIN URL]` in every footer.
- Confirm pricing figures and the `hello@missionledgerbooks.com` inbox.

## 8. Version control (Git + GitHub)
1. `git init`, sensible `.gitignore` (ignore `.DS_Store`, `node_modules/`, etc.).
2. Commit after each meaningful change with a short clear message.
3. GitHub repo suggested name: `missionledgerbooks` (repo names can't have spaces).
4. Rhythm: `git add -A && git commit -m "..."` then `git push`. Every push updates the live site.

## 9. Deployment (Cloudflare Pages + custom domain)
1. Cloudflare → Workers & Pages → Create → Pages → Connect to Git → pick the repo.
2. Static settings: **Framework preset = None, Build command = (blank), Build output directory = `/`.**
3. Review on the `*.pages.dev` preview, then add custom domain `missionledgerbooks.com` (+ `www`).
- Update loop: edit → `git push` → live in ~30 seconds.
