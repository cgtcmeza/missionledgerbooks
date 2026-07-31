# Mission Ledger Books

Marketing website for **Mission Ledger Books** — clear, professional bookkeeping for
nonprofits and small-to-midsize businesses.

Live site: <https://missionledgerbooks.com>

## What this is

A plain **static HTML/CSS/JS** site — no build step, no framework. Every file can be opened
directly in a browser by double-clicking. Deployed via Cloudflare Pages connected to GitHub;
every `git push` updates the live site automatically.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — hero, services overview, who we serve, how it works, testimonial, pricing teaser, FAQ |
| `services.html` | Detailed services + nonprofit specialty + what's included |
| `pricing.html` | Three flat-fee plans + pricing FAQ |
| `about.html` | Story, values, and approach |
| `contact.html` | Contact form (Web3Forms) + direct contact details |
| `thank-you.html` | Post-submit confirmation page |

## Project structure

```
Mission Ledger Books/
├── index.html
├── services.html
├── pricing.html
├── about.html
├── contact.html
├── thank-you.html
├── assets/
│   ├── css/styles.css     ← ALL styling; design tokens live in :root at the top
│   ├── js/main.js         ← nav toggle, header scroll state, scroll-reveal, count-up
│   └── img/               ← logo/photos (brand mark is currently inline SVG)
├── robots.txt
├── sitemap.xml
├── CLAUDE.md              ← house rules for how this site is built
├── README.md
└── .gitignore
```

## Design system

- **Single source of truth:** every color, font, and spacing value is a CSS variable in the
  `:root {}` block at the top of `assets/css/styles.css`. Change a token there and it updates
  everywhere. Never hardcode a hex value elsewhere.
- **Palette:** warm ivory paper, deep navy ink, forest-green accent, brass-gold detail.
- **Type:** Fraunces (display serif) + Inter (body), loaded from Google Fonts.
- **Shared header & footer** are byte-for-byte identical on every page (only the active nav
  link's `aria-current="page"` differs).

## Before going live — fill in these placeholders

1. **Contact form (Web3Forms):** in `contact.html`, replace `YOUR_WEB3FORMS_ACCESS_KEY` with a
   free access key from <https://web3forms.com>. The form redirects to `thank-you.html` on success.
2. **Email address:** `hello@missionledgerbooks.com` is used site-wide — set up this inbox (or
   swap in the real address via find-and-replace).
3. **Social links:** replace `[FACEBOOK URL]` and `[LINKEDIN URL]` in every footer, or remove
   the icons if there are no profiles yet.
4. **Pricing:** the plan prices ($350 / $650 / Custom) are sensible starting points — confirm or
   adjust in `pricing.html` and the home-page teaser in `index.html`.
5. **Phone:** `(314) 397-8863` is wired throughout (`tel:+13143978863`). Update if it changes.

## Deploy (Cloudflare Pages)

1. Push this folder to a GitHub repo (suggested name: `missionledgerbooks`).
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick the repo.
3. Build settings: **Framework preset = None, Build command = (blank), Build output directory = `/`.**
4. Review on the `*.pages.dev` preview URL, then add the custom domain `missionledgerbooks.com`
   (and `www`) under Custom domains. Auto-SSL.

Update loop: edit → `git add -A && git commit -m "..."` → `git push` → live in ~30 seconds.
