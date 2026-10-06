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
├── index.html · services.html · pricing.html · about.html · faq.html · blog.html · contact.html · 404.html
├── blog/                   (published articles + posts.json — the list that feeds blog.html and the home page)
├── blog-drafts/            (monthly drafts awaiting approval — GIT-IGNORED, never public)
├── tools/                  (blog.py helper + post-template.html)
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
- When the header or footer changes, update it on *every* page in the same pass (all root pages,
  `tools/post-template.html`, and every `blog/*.html`). Pages inside `blog/` use `../` before local
  links; otherwise the markup is identical.

## 5. Brand & voice
- **Name:** Mission Ledger Books. **Tagline:** clear, professional bookkeeping for nonprofits and
  small-to-midsize businesses. **Motto:** “No job is too small or too big.”
- **Palette:** ivory paper `--paper`, navy ink `--navy`, forest green `--green`, brass gold `--gold`.
- **Type:** Fraunces (display serif) + Inter (body).
- **Voice:** warm, clear, trustworthy, jargon-free. We are bookkeepers, not tax preparers — we
  coordinate with the client's CPA but do not file returns (keep this accurate in copy).
- **Founder:** Michelle Dodd, **Intuit-Certified in QuickBooks**, **20+ years** accounting/finance experience
  (AP/AR, general ledger, reconciliations, reporting, payroll). Full bio + systems strip on About.
  Systems she works across: QuickBooks, SAP Concur, BlackLine, Oracle NetSuite, Sage Intacct, MS Dynamics GP.
- **Contact:** phone (314) 397-8863 → `tel:+13143978863` (the same number is on the old GoDaddy site);
  email `michelle@missionledgerbooks.com` (Michelle's address, shown on the contact card — there is NO contact form);
  **Las Vegas, NV**; **by appointment Mon–Sat, Sunday closed** (matches the GoDaddy site); serves clients
  nationwide/remotely. Also offers personal bookkeeping (stated in the owner's own GoDaddy description).
- **Only real credentials:** "Intuit-Certified in QuickBooks" (per her bio — NOT "ProAdvisor" unless she
  confirms that term). Do NOT mention Xero anywhere (removed 2026-08-03 — not in her bio). Stats
  (20+ yrs, 98% retention, 100% on-time) confirmed accurate.
- **No client reviews on the site yet (removed 2026-10-05 — the old ones were invented placeholders).** Only add REAL, permitted
  reviews from Michelle's clients. Never add star ratings, fake names or unverifiable numbers. A reviews section can be restored
  from git history (commit fe49e40, `index.html` section "7. REVIEWS") and re-filled with real quotes.

## 6. My working style
- I work **iteratively and visually.** Build one thing, show me, I react in plain language, you
  implement precisely.
- Keep the code clean and semantic — I may hand it back to you months later.
- Explain what you're doing in plain language. Assume I'm not a developer but can follow clear steps.

## 7. Open placeholders to fill before launch
- **Subscribe is currently an "Email to subscribe" button** (mailto Michelle), because there is no Web3Forms key yet. When a key exists,
  swap the button block (`<div class="subscribe__form">`) for the form in `tools/subscribe-form.html` on index.html, blog.html,
  tools/post-template.html and every blog/*.html, and put the key in. Whoever owns the list must actually send the "new article" notes.
- Add real reviews when Michelle sends them (see section 5).
- `[FACEBOOK URL]` and `[LINKEDIN URL]` in every footer.
- Confirm pricing figures and the `michelle@missionledgerbooks.com` address with Michelle. Keep numbers to facts from her bio
  (20+ yrs, 6 systems) plus the owner-confirmed 98% retention / 100% on-time.

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

## 10. The blog — monthly, auto-drafted, owner-approved
- **Source of truth for the list of posts is `blog/posts.json`.** `blog.html` and the home page's
  "From the Blog" section render from it with JS (`assets/js/main.js`). Never hand-edit post cards.
- **Articles** are `blog/<slug>.html`, built from `tools/post-template.html` (same header/footer as every page).
- **Never publish without the owner's OK.** Each month a scheduled task runs
  `python3 tools/blog.py draft …` which writes `blog-drafts/<slug>.html`. That folder is git-ignored. The owner
  (Christian, or Michelle) reads it and says "publish it" → `python3 tools/blog.py publish <slug> --push`
  (moves it into `blog/`, updates `posts.json` + `sitemap.xml`, commits, pushes). `python3 tools/blog.py list` shows status.
- **Voice & safety for posts:** firm voice ("we"), warm, plain-English, evergreen. We are bookkeepers, NOT tax
  preparers — no tax/legal advice, no specific tax-rule or deadline claims unless certain; point to the CPA.
  No client stories, stats, testimonials or credentials that aren't already in section 5. Each post ~450-650 words,
  one idea, `<h2>` sections, a closing line that invites contact. The template already adds the "not tax advice" note.
- Don't repeat a topic already in `posts.json`. Use the 3 starter posts as the voice/format reference.

## 11. Status & history
- **LIVE since 2026-10-05.** missionledgerbooks.com (+ www) is served by Cloudflare Pages (project `missionledgerbooks`,
  GitHub `cgtcmeza/missionledgerbooks` `main`; every `git push` redeploys in ~30 s). Domain stays REGISTERED at GoDaddy;
  nameservers = `aisha.ns.cloudflare.com` + `howard.ns.cloudflare.com`. **Michelle's email is Microsoft 365 via GoDaddy** — the
  Cloudflare DNS records for it (MX, SPF/NETORGFT/_dmarc TXT, autodiscover/lyncdiscover/msoid/sip/email/selector1+2 CNAMEs,
  2 SRV) must all stay DNS-only (gray cloud) and must never be deleted. Old GoDaddy Website Builder site is replaced (its
  paid plan can be cancelled separately; do NOT cancel the domain or email products).
- Contact people: **Pam (Pamela Kendall, Christian's mom)** relays requests; **Michelle Dodd** is the business
  owner/founder (Pam's friend). Pam's Aug 19 2026 email (to ccmezaa@gmail.com) had 2 photos of Michelle; the
  April 2024 one (`IMG_20240418_183050~2.jpg`) was chosen for the site.
- Oct 2026 sweep: tightened section padding (`--section-pad-y`), fixed hero chip overlap + orphaned stat on phones,
  menu button now appears <=1080px (7 nav items), Contact hero made dark like other pages, About "approach"
  block made light (was dark-on-dark with the CTA), sitemap now lists faq/blog/posts.
- Oct 5 2026 (second pass): owner approved the April-2024 photo (now `assets/img/michelle-dodd.jpg`, 1000x1000,
  cropped head+shoulders, metadata stripped); contact FORM replaced by a contact card (email/phone/location/hours);
  `thank-you.html` deleted (nothing uses it now); email switched hello@ → michelle@ site-wide; hours changed to
  Mon–Sat to match GoDaddy; "Individuals / personal bookkeeping" added to Home + FAQ; footer column labels are
  `<p class="footer-title">` (no skipped heading levels). Owner will move the domain himself and said to leave
  Michelle's email/MX records for now.
- Oct 5 2026 (go-live fixes): removed the placeholder reviews + 5-star badge; replaced the invented "12+ hrs / 5-day / 0 surprises"
  stats with bio facts (20+ yrs, 6 systems); Subscribe form -> mailto button (no key); canonical, og:url and sitemap now use the
  extensionless URLs Cloudflare serves (`/about`, `/blog/<slug>` — Cloudflare 308-redirects `.html` to these); `tools/blog.py` writes
  the same style into sitemap.xml. Internal links may still say `.html` (they redirect).
