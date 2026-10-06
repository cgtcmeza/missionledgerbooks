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
| `index.html` | Home — hero, services overview, who we serve, how it works, founder, pricing teaser, latest blog posts + Subscribe (no reviews until real ones exist) |
| `services.html` | Detailed services + nonprofit specialty + what's included |
| `pricing.html` | Three flat-fee plans + pricing FAQ |
| `about.html` | Story, founder (Michelle Dodd + photo), values, and approach |
| `faq.html` | Common questions, grouped |
| `blog.html` | The blog — every article, newest first (filled from `blog/posts.json`) + Subscribe |
| `blog/*.html` | Individual articles |
| `contact.html` | Contact card — Michelle's email, phone, location and hours (no form) |

## Project structure

```
Mission Ledger Books/
├── index.html
├── services.html
├── pricing.html
├── about.html
├── faq.html
├── blog.html
├── contact.html
├── blog/                  ← published articles + posts.json (the list of posts)
├── blog-drafts/           ← monthly drafts waiting for approval (git-ignored, never public)
├── tools/                 ← blog.py (draft / publish helper) + post-template.html
├── assets/
│   ├── css/styles.css     ← ALL styling; design tokens live in :root at the top
│   ├── js/main.js         ← nav toggle, header scroll state, scroll-reveal, count-up
│   └── img/               ← logo/photos (brand mark is inline SVG; Michelle's photo = michelle-dodd.jpg)
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

## The monthly blog (auto-drafted, you approve)

A scheduled Claude task writes **one draft article on the 1st of every month** into
`blog-drafts/` (git-ignored, so a draft can never go live by accident). You read it, then say
**"publish the [month] blog post"** — or run it yourself:

```
python3 tools/blog.py list                          # what's published / waiting
python3 tools/blog.py publish 2026-11-your-slug --push   # approve → live in ~30 seconds
```

`publish` moves the draft into `blog/`, adds it to `blog/posts.json` (this is what fills the blog
page and the "From the Blog" section on the home page), adds it to `sitemap.xml`, and commits.
Want changes first? Ask Claude to edit the draft, or just delete it. To write one by hand:
`python3 tools/blog.py draft --slug … --title … --category … --excerpt … --body mybody.html`
(`tools/blog.py` has the full instructions at the top). Articles use the same template, header
and footer as every page (`tools/post-template.html`).

## Before going live — fill in these placeholders

1. **Subscribe box:** right now it's an "Email to subscribe" button that emails Michelle. For a real sign-up form, get a free
   Web3Forms key (<https://web3forms.com>) and swap the button block for the form in `tools/subscribe-form.html`
   (index.html, blog.html, tools/post-template.html, blog/*.html) — easiest is to send the key to Claude.
2. **Email address:** `michelle@missionledgerbooks.com` is Michelle's address, used site-wide (contact
   card, footer, search-engine data). Confirm it's right; to change it, find-and-replace it everywhere.
3. **Social links:** replace `[FACEBOOK URL]` and `[LINKEDIN URL]` in every footer, or remove
   the icons if there are no profiles yet.
4. **Pricing:** the plan prices ($450 / $850 / Custom) are sensible starting points — confirm or
   adjust in `pricing.html` and the home-page teaser in `index.html`.
5. **Phone:** `(314) 397-8863` is wired throughout (`tel:+13143978863`). Update if it changes.

## Deploy (Cloudflare Pages)

1. Push this folder to a GitHub repo (suggested name: `missionledgerbooks`).
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick the repo.
3. Build settings: **Framework preset = None, Build command = (blank), Build output directory = `/`.**
4. Review on the `*.pages.dev` preview URL, then add the custom domain `missionledgerbooks.com`
   (and `www`) under Custom domains. Auto-SSL.

Update loop: edit → `git add -A && git commit -m "..."` → `git push` → live in ~30 seconds.
