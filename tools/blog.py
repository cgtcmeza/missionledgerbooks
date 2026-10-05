#!/usr/bin/env python3
"""Mission Ledger Books — blog helper.  Plain Python 3, nothing to install.

How the monthly blog works
--------------------------
1. DRAFT   A draft is written to  blog-drafts/<slug>.html  . That folder is git-ignored,
           so a draft can NEVER go live by accident. Open the file in a browser to read it.
2. APPROVE Happy with it?  Run  publish  (below). Not happy? Ask Claude to change it, or delete it.
3. PUBLISH Moves the draft to  blog/<slug>.html , adds it to  blog/posts.json  (that is what
           fills the blog page and the home page), adds it to sitemap.xml, and commits it.
           Add --push to also send it live (Cloudflare redeploys in about 30 seconds).

Commands (run from the site folder):
  python3 tools/blog.py draft --slug 2026-11-year-end-prep --title "Year-end prep" \\
          --category "Bookkeeping Basics" --excerpt "One sentence for the card." --body body.html
  python3 tools/blog.py list
  python3 tools/blog.py publish 2026-11-year-end-prep          # commit only
  python3 tools/blog.py publish 2026-11-year-end-prep --push   # commit and go live

--body is a file of plain article HTML (<p>, <h2>, <ul>, <ol>, <blockquote>, <a>). Use --body -
to read it from standard input instead.
"""
import argparse
import datetime
import html
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / "tools" / "post-template.html"
DRAFTS = ROOT / "blog-drafts"
BLOG = ROOT / "blog"
MANIFEST = BLOG / "posts.json"
SITEMAP = ROOT / "sitemap.xml"
SITE = "https://missionledgerbooks.com"
META_RE = re.compile(r"<!-- mlb-post (\{.*?\}) -->", re.S)
SLUG_RE = re.compile(r"^[a-z0-9][a-z0-9-]*$")


def fail(msg):
    print("Error: " + msg, file=sys.stderr)
    sys.exit(1)


def pretty_date(iso):
    d = datetime.date.fromisoformat(iso)
    return d.strftime("%b ") + str(d.day) + d.strftime(", %Y")


def read_manifest():
    if MANIFEST.exists():
        return json.loads(MANIFEST.read_text(encoding="utf-8"))
    return []


def write_manifest(posts):
    MANIFEST.write_text(json.dumps(posts, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


# --------------------------------------------------------------------------
def cmd_draft(a):
    if not SLUG_RE.match(a.slug):
        fail("slug must be lowercase letters, numbers and dashes, e.g. 2026-11-year-end-prep")
    date = a.date or datetime.date.today().isoformat()
    try:
        datetime.date.fromisoformat(date)
    except ValueError:
        fail("--date must look like 2026-11-01")

    body = sys.stdin.read() if a.body == "-" else Path(a.body).read_text(encoding="utf-8")
    body = body.strip("\n")
    words = len(re.sub(r"<[^>]+>", " ", body).split())
    minutes = max(1, round(words / 200))
    indented = "\n".join(("          " + line) if line.strip() else "" for line in body.splitlines())

    meta = {"slug": a.slug, "title": a.title, "date": date,
            "category": a.category, "excerpt": a.excerpt, "minutes": minutes}
    fields = {
        "META_JSON": json.dumps(meta, ensure_ascii=False).replace("--", "- -"),
        "TITLE": html.escape(a.title),
        "TITLE_JSON": json.dumps(a.title, ensure_ascii=False),
        "DESCRIPTION": html.escape(a.excerpt, quote=True),
        "DESCRIPTION_JSON": json.dumps(a.excerpt, ensure_ascii=False),
        "SLUG": a.slug,
        "DATE": date,
        "DATE_PRETTY": pretty_date(date),
        "CATEGORY": html.escape(a.category),
        "MINUTES": str(minutes),
        "BODY": indented,
    }
    page = TEMPLATE.read_text(encoding="utf-8")
    for key, val in fields.items():
        page = page.replace("{{" + key + "}}", val)
    if "{{" in page:
        fail("template still has unfilled {{placeholders}}")

    DRAFTS.mkdir(exist_ok=True)
    out = DRAFTS / (a.slug + ".html")
    out.write_text(page, encoding="utf-8")
    print("Draft saved:  " + str(out.relative_to(ROOT)))
    print("Preview it:   open \"" + str(out) + "\"")
    print("When approved: python3 tools/blog.py publish " + a.slug + " --push")


def cmd_list(_a):
    print("Published (blog/posts.json):")
    for p in read_manifest():
        print("  {date}  {slug}  —  {title}".format(**p))
    print("\nDrafts waiting for approval (blog-drafts/):")
    drafts = sorted(DRAFTS.glob("*.html")) if DRAFTS.exists() else []
    for d in drafts:
        print("  " + d.stem)
    if not drafts:
        print("  (none)")


def cmd_publish(a):
    src = DRAFTS / (a.slug + ".html")
    dest = BLOG / (a.slug + ".html")
    if not src.exists():
        fail("no draft named " + a.slug + " in blog-drafts/  (try:  python3 tools/blog.py list)")
    if dest.exists():
        fail(str(dest.relative_to(ROOT)) + " already exists — pick a different slug")
    m = META_RE.search(src.read_text(encoding="utf-8"))
    if not m:
        fail("draft is missing its <!-- mlb-post {...} --> line")
    meta = json.loads(m.group(1))

    BLOG.mkdir(exist_ok=True)
    src.rename(dest)

    posts = [p for p in read_manifest() if p["slug"] != meta["slug"]]
    posts.insert(0, meta)
    write_manifest(posts)

    url = "{}/blog/{}.html".format(SITE, meta["slug"])
    sm = SITEMAP.read_text(encoding="utf-8")
    if url not in sm:
        entry = ("  <url>\n    <loc>{}</loc>\n    <lastmod>{}</lastmod>\n"
                 "    <changefreq>yearly</changefreq>\n    <priority>0.6</priority>\n  </url>\n").format(url, meta["date"])
        SITEMAP.write_text(sm.replace("</urlset>", entry + "</urlset>"), encoding="utf-8")

    print("Published:    blog/" + meta["slug"] + ".html  (added to posts.json and sitemap.xml)")
    if a.no_commit:
        print("Not committed (--no-commit). Commit and push it yourself when ready.")
        return
    run = lambda *cmd: subprocess.run(cmd, cwd=str(ROOT), check=True)
    run("git", "add", "-A")
    run("git", "commit", "-m", "Publish blog post: " + meta["title"])
    if a.push:
        run("git", "push")
        print("Pushed — it will be live on missionledgerbooks.com in about 30 seconds.")
    else:
        print("Committed locally. To go live:  git push")


# --------------------------------------------------------------------------
def main():
    ap = argparse.ArgumentParser(description="Mission Ledger Books blog helper (see the top of this file).")
    sub = ap.add_subparsers(dest="cmd", required=True)

    d = sub.add_parser("draft", help="create a private draft from a body file")
    d.add_argument("--slug", required=True)
    d.add_argument("--title", required=True)
    d.add_argument("--category", required=True)
    d.add_argument("--excerpt", required=True, help="one sentence, shown on the blog card and in Google")
    d.add_argument("--body", required=True, help="path to the article HTML, or - for stdin")
    d.add_argument("--date", help="YYYY-MM-DD (default: today)")
    d.set_defaults(fn=cmd_draft)

    l = sub.add_parser("list", help="show published posts and waiting drafts")
    l.set_defaults(fn=cmd_list)

    p = sub.add_parser("publish", help="approve a draft: move it into /blog and commit")
    p.add_argument("slug")
    p.add_argument("--push", action="store_true", help="also git push (goes live)")
    p.add_argument("--no-commit", action="store_true", help="move and register the post but skip git")
    p.set_defaults(fn=cmd_publish)

    args = ap.parse_args()
    args.fn(args)


if __name__ == "__main__":
    main()
