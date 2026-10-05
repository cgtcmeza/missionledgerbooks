# Go-Live Checklist — Mission Ledger Books

Everything in the code is ready. These are the only remaining human steps, in order.
Check them off as you go.

---

## 0. Before you start — things only you can do (do these first)
- [ ] **Add Michelle's photo.** Save the photo from Pam's Aug 19 email (`IMG_20240418_183050~2.jpg`)
      and give it to Claude — it crops/compresses it to `assets/img/michelle-dodd.jpg`. Until then the
      site shows a clean "MD" placeholder in that spot.
- [ ] **Read the 3 starter blog posts** in `blog/` (they were drafted by Claude as examples — Michelle
      should approve the wording before launch). Dates say Oct 5, 2026; adjust if you launch later.
- [ ] **GoDaddy → before you move the domain:** the current live site is the old GoDaddy Website
      Builder site. Moving the domain replaces it. Export anything you want to keep first:
      GoDaddy **Subscribe** list (email signups), **Bookings**, and any **contact form** history.
      The new site has no booking calendar or customer accounts (the old "Sign In / Create Account /
      Bookings" links go away); Michelle's phone/email are on every page instead.
      If Michelle has **email on this domain through GoDaddy**, keep those MX records when you add the
      site to Cloudflare (step 3 below) or her email stops arriving.

## 1. Turn on the contact form (2 min)
The form is fully built; it just needs a free key so submissions reach your inbox.

- [ ] Go to <https://web3forms.com>, enter the email where you want inquiries delivered, and they'll
      email you an **Access Key** (a long code). No password/account to manage.
- [ ] In `contact.html`, find `YOUR_WEB3FORMS_ACCESS_KEY` and paste your key in its place.
- [ ] Do the same in `index.html`, `blog.html`, `tools/post-template.html` and every file in `blog/`
      (this key also powers the Subscribe box).
- [ ] Save, then `git add -A && git commit -m "Add Web3Forms key" && git push`.

*(Easiest: send Claude the key and it replaces it in every file at once.)*

## 2. Deploy on Cloudflare Pages (5 min)
- [ ] <https://dash.cloudflare.com> → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
- [ ] Authorize GitHub and select the **`missionledgerbooks`** repo (private is fine).
- [ ] Build settings — **Framework preset: None · Build command: (blank) · Build output directory: `/`**
- [ ] **Save and Deploy.** Open the `*.pages.dev` link and confirm the site looks right.

## 3. Bring the domain onto Cloudflare (5 min)
- [ ] Cloudflare dashboard → **Add a site** → `missionledgerbooks.com` → **Free** plan.
- [ ] Review the DNS records it imports. **If you use email on this domain, confirm the MX
      records are present** so email keeps working.
- [ ] Copy the **two nameservers** Cloudflare gives you.

## 4. Point GoDaddy to Cloudflare (2 min + wait)
- [ ] GoDaddy → **My Products** → domain → **DNS** → **Nameservers** → **Change** →
      **Enter my own nameservers** → paste Cloudflare's two → save.
- [ ] Wait for Cloudflare's "domain is active" email (usually < 1 hour).

## 5. Attach the domain to the site (2 min)
- [ ] Cloudflare → your **missionledgerbooks** Pages project → **Custom domains** → **Set up a domain**.
- [ ] Add `missionledgerbooks.com`, then add `www.missionledgerbooks.com`.
- [ ] SSL is issued automatically — visit `https://missionledgerbooks.com` to confirm you're live.

## 6. Optional polish (whenever)
- [ ] Add real **Facebook / LinkedIn** links (removed for launch — send them to Claude to re-add).
- [ ] Confirm the **email** `hello@missionledgerbooks.com` inbox exists (or swap in your real address).
- [ ] Confirm the **pricing** figures ($350 / $650 / Custom).
- [ ] Submit `sitemap.xml` in **Google Search Console** for faster indexing.

---

### After launch, updating the site is always:
```
git add -A && git commit -m "what changed" && git push
```
Cloudflare rebuilds and the change is live in ~30 seconds.
