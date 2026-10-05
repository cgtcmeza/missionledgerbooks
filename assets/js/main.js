/* =====================================================================
   MISSION LEDGER BOOKS — main.js
   Small, dependency-free interactions: mobile nav toggle, header state
   on scroll, and lightweight scroll-reveal. Keep it fast and readable.
   ===================================================================== */
(function () {
  'use strict';

  /* ---- Mobile nav toggle -------------------------------------------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close the menu when a link is tapped
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape for keyboard users
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });
  }

  /* ---- Header state + scroll-progress bar --------------------------- */
  var header = document.querySelector('.site-header');
  var reduceMotion = window.matchMedia &&
                     window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var progress = null;
  if (!reduceMotion) {
    progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progress);
  }

  var ticking = false;
  function onScroll() {
    if (header) {
      if (window.scrollY > 8) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    }
    if (progress) {
      var h = document.documentElement;
      var max = (h.scrollHeight - h.clientHeight) || 1;
      progress.style.width = Math.min(100, (window.scrollY / max) * 100) + '%';
    }
    ticking = false;
  }
  function requestScroll() {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }
  onScroll();
  window.addEventListener('scroll', requestScroll, { passive: true });
  window.addEventListener('resize', requestScroll);

  /* ---- Scroll-reveal ------------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---- Count-up for stat numbers ------------------------------------ */
  /* Any element with [data-count] animates from 0 to its number the
     first time it scrolls into view. A [data-suffix]/[data-prefix]
     keeps symbols like % or + or $ intact. Skipped for reduced motion. */
  var reduce = window.matchMedia &&
               window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var counters = document.querySelectorAll('[data-count]');

  function runCount(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = (el.getAttribute('data-decimals') | 0);
    var dur = 1400, start = null;

    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);           // easeOutCubic
      var val = (target * eased).toFixed(decimals);
      el.textContent = prefix + Number(val).toLocaleString('en-US', {
        minimumFractionDigits: decimals, maximumFractionDigits: decimals
      }) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if (counters.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      counters.forEach(function (el) {
        var prefix = el.getAttribute('data-prefix') || '';
        var suffix = el.getAttribute('data-suffix') || '';
        el.textContent = prefix + Number(el.getAttribute('data-count')).toLocaleString('en-US') + suffix;
      });
    } else {
      var cObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { runCount(entry.target); cObs.unobserve(entry.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { cObs.observe(el); });
    }
  }

  /* ---- Hero scroll-exit (parallax fade as you scroll past) ---------- */
  var heroFades = document.querySelectorAll('.js-hero-fade');
  if (heroFades.length && !reduceMotion) {
    var fadeUpdate = function () {
      var vh = window.innerHeight || 800;
      var y = window.scrollY || window.pageYOffset || 0;
      var p = Math.min(1, y / (vh * 0.75));
      var op = String(1 - p);
      var tf = 'translateY(' + (p * -60) + 'px)';
      for (var i = 0; i < heroFades.length; i++) {
        heroFades[i].style.opacity = op;
        heroFades[i].style.transform = tf;
      }
    };
    fadeUpdate();
    window.addEventListener('scroll', fadeUpdate, { passive: true });
  }

  /* ---- Animated check-off for checklists ---------------------------- */
  var lists = document.querySelectorAll('.checklist');
  if (lists.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      lists.forEach(function (l) { l.classList.add('checklist--animate', 'is-checked'); });
    } else {
      lists.forEach(function (l) { l.classList.add('checklist--animate'); });
      var listObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('is-checked'); listObs.unobserve(e.target); }
        });
      }, { threshold: 0.2 });
      lists.forEach(function (l) { listObs.observe(l); });
    }
  }

  /* ---- Founder photo: show the "MD" monogram if the file is missing -- */
  document.querySelectorAll('.founder-photo img').forEach(function (img) {
    function drop() { img.remove(); }
    if (img.complete && img.naturalWidth === 0) drop();
    else img.addEventListener('error', drop);
  });

  /* ---- Blog list ------------------------------------------------------ */
  /* Any <div data-blog-list> is filled from blog/posts.json (newest first).
       data-src   where posts.json lives      (default blog/posts.json)
       data-base  folder the post pages are in (default blog/)
       data-limit show only the latest N       (optional)
     To publish a post, add it to posts.json — the site does the rest. */
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
              'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  function mk(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }
  function prettyDate(iso) {
    var d = new Date(iso + 'T12:00:00');
    return isNaN(d) ? iso : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  document.querySelectorAll('[data-blog-list]').forEach(function (box) {
    var src = box.getAttribute('data-src') || 'blog/posts.json';
    var base = box.getAttribute('data-base') || 'blog/';
    var limit = parseInt(box.getAttribute('data-limit'), 10) || 0;

    function message(text) { box.innerHTML = ''; box.appendChild(mk('p', 'post-empty', text)); }

    fetch(src)
      .then(function (r) { if (!r.ok) throw new Error('posts.json ' + r.status); return r.json(); })
      .then(function (posts) {
        posts = posts.slice().sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
        if (limit) posts = posts.slice(0, limit);
        if (!posts.length) { message('New articles are on the way — check back soon.'); return; }
        box.innerHTML = '';
        posts.forEach(function (p) {
          var a = mk('a', 'card card--hover post-card');
          a.href = base + p.slug + '.html';
          a.appendChild(mk('span', 'post-card__cat', p.category));
          a.appendChild(mk('h3', 'h3', p.title));
          a.appendChild(mk('p', '', p.excerpt));
          var meta = mk('span', 'post-card__meta');
          var t = mk('time', '', prettyDate(p.date));
          t.setAttribute('datetime', p.date);
          meta.appendChild(t);
          meta.appendChild(document.createTextNode(' · ' + p.minutes + ' min read'));
          a.appendChild(meta);
          var more = mk('span', 'post-card__more', 'Read article');
          more.insertAdjacentHTML('beforeend', ARROW);   // fixed icon markup, not post data
          a.appendChild(more);
          box.appendChild(a);
        });
      })
      .catch(function () { message('Our articles couldn’t load just now — please refresh in a moment.'); });
  });

  /* ---- Subscribe form (Web3Forms, no page reload) ---------------------- */
  document.querySelectorAll('form[data-subscribe]').forEach(function (form) {
    var status = form.querySelector('.form__status');
    var btn = form.querySelector('button[type="submit"]');
    function say(msg, cls) {
      if (!status) return;
      status.textContent = msg;
      status.className = 'form__status' + (cls ? ' ' + cls : '');
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      if (data.get('botcheck')) return;               // honeypot tripped: quietly ignore
      btn.disabled = true;
      say('Subscribing…');
      fetch(form.action, { method: 'POST', headers: { 'Accept': 'application/json' }, body: data })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (!j || !j.success) throw new Error('rejected');
          form.reset();
          say('You’re in! Watch your inbox for the next note.', 'is-ok');
        })
        .catch(function () {
          say('That didn’t go through — please try again or email hello@missionledgerbooks.com.', 'is-error');
        })
        .then(function () { btn.disabled = false; });
    });
  });

  /* ---- Footer year --------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
