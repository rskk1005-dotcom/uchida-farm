/**
 * 内田農場 — main.js
 * Custom cursor / Loader / Header scroll / Burger / Scroll reveal / Parallax / Form
 */

'use strict';

/* ─────────────────────────────────────────────
   1. LOADER
───────────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('js-loader');
  if (!loader) return;

  const done = () => {
    loader.classList.add('is-gone');
    // Trigger hero fade-items
    document.querySelectorAll('.fade-item').forEach((el) => {
      const delay = parseInt(el.dataset.delay || 0, 10);
      setTimeout(() => el.classList.add('is-visible'), delay);
    });
  };

  if (document.readyState === 'complete') {
    setTimeout(done, 600);
  } else {
    window.addEventListener('load', () => setTimeout(done, 600));
  }
})();


/* ─────────────────────────────────────────────
   2. CUSTOM CURSOR
───────────────────────────────────────────── */
(function initCursor() {
  const cursor = document.getElementById('js-cursor');
  const ring   = document.getElementById('js-ring');
  if (!cursor || !ring) return;

  // Only on pointer devices
  if (!window.matchMedia('(hover: hover)').matches) return;

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  // Ring follows with lerp
  (function loopRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loopRing);
  })();

  // Hover enlargement
  const interactives = 'a, button, select, input, textarea, label';
  document.querySelectorAll(interactives).forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor--hover');
      ring.classList.add('cursor-ring--hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor--hover');
      ring.classList.remove('cursor-ring--hover');
    });
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    ring.style.opacity   = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    ring.style.opacity   = '1';
  });
})();


/* ─────────────────────────────────────────────
   3. HEADER — scroll state + active link
───────────────────────────────────────────── */
(function initHeader() {
  const header = document.getElementById('js-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Highlight active section link
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.header__link, .drawer__link');

  const linkObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach((l) => {
            l.classList.toggle('is-active', l.getAttribute('href') === '#' + id);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((s) => linkObserver.observe(s));
})();


/* ─────────────────────────────────────────────
   4. BURGER / MOBILE DRAWER
───────────────────────────────────────────── */
(function initBurger() {
  const burger  = document.getElementById('js-burger');
  const drawer  = document.getElementById('js-drawer');
  const links   = document.querySelectorAll('.drawer__link');
  if (!burger || !drawer) return;

  const toggle = () => {
    const open = burger.classList.toggle('open');
    drawer.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    drawer.setAttribute('aria-hidden', !open);
  };

  burger.addEventListener('click', toggle);
  links.forEach((l) => l.addEventListener('click', () => {
    burger.classList.remove('open');
    drawer.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
  }));
})();


/* ─────────────────────────────────────────────
   5. SCROLL REVEAL — IntersectionObserver
───────────────────────────────────────────── */
(function initReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  // Stagger siblings in the same parent
  const staggerParents = ['.commitment__list', '.products__entries', '.about__stats'];
  staggerParents.forEach((sel) => {
    const parent = document.querySelector(sel);
    if (!parent) return;
    parent.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el, i) => {
      el.style.transitionDelay = (i * 0.08) + 's';
    });
  });

  targets.forEach((el) => observer.observe(el));
})();


/* ─────────────────────────────────────────────
   6. PARALLAX — subtle depth on scroll
───────────────────────────────────────────── */
(function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const hero  = document.querySelector('.hero__art');
  const stmt  = document.querySelector('.statement__quote');

  let ticking = false;

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const sy = window.scrollY;

        // Hero art — slow upward drift
        if (hero) {
          hero.style.transform = `translateY(${sy * 0.22}px)`;
        }

        // Statement quote — gentle float
        if (stmt) {
          const rect = stmt.getBoundingClientRect();
          const vh   = window.innerHeight;
          if (rect.top < vh && rect.bottom > 0) {
            const progress = (vh - rect.top) / (vh + rect.height);
            stmt.style.transform = `translateY(${(progress - 0.5) * -28}px)`;
          }
        }

        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ─────────────────────────────────────────────
   7. PRODUCT ART — hover scale is CSS-only;
      add slight tilt on mouse move
───────────────────────────────────────────── */
(function initProductTilt() {
  if (!window.matchMedia('(hover: hover)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.p-entry__art').forEach((art) => {
    art.addEventListener('mousemove', (e) => {
      const r  = art.getBoundingClientRect();
      const dx = ((e.clientX - r.left) / r.width  - 0.5) * 6;
      const dy = ((e.clientY - r.top)  / r.height - 0.5) * 6;
      art.querySelector('svg').style.transform = `scale(1.04) rotate3d(${-dy},${dx},0,${Math.sqrt(dx*dx+dy*dy)*0.5}deg)`;
    });
    art.addEventListener('mouseleave', () => {
      art.querySelector('svg').style.transform = '';
    });
  });
})();


/* ─────────────────────────────────────────────
   8. SMOOTH SCROLL — override for browsers
      that don't support scroll-behavior natively
───────────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ─────────────────────────────────────────────
   9. NUMBER COUNTER — animate stats on reveal
───────────────────────────────────────────── */
(function initCounters() {
  const stats = document.querySelectorAll('.stat-item__num');
  if (!stats.length) return;

  const animate = (el) => {
    const raw    = el.textContent.trim();
    const isYear = raw.includes('1998');
    if (isYear) return; // don't animate year

    // Extract numeric part and suffix (like "ha", empty)
    const match  = raw.match(/^([\d.]+)(.*)$/);
    if (!match) return;

    const target = parseFloat(match[1]);
    const suffix = el.innerHTML.replace(match[1], ''); // preserve <em> etc.
    const start  = 0;
    const dur    = 1400;
    const t0     = performance.now();

    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      // easeOutExpo
      const ease = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      const val  = start + (target - start) * ease;
      // Preserve decimals if original has them
      el.innerHTML = (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach((el) => observer.observe(el));
})();


/* ─────────────────────────────────────────────
   10. CONTACT FORM
───────────────────────────────────────────── */
(function initForm() {
  const form   = document.getElementById('js-form');
  const submit = document.getElementById('js-submit');
  const thanks = document.getElementById('js-thanks');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const name  = form.querySelector('#f-name').value.trim();
    const email = form.querySelector('#f-email').value.trim();
    const msg   = form.querySelector('#f-msg').value.trim();

    if (!name || !email || !msg) {
      thanks.textContent = '必須項目を入力してください。';
      thanks.style.color = 'rgba(220,180,140,.8)';
      return;
    }

    // Simulate send
    submit.classList.add('sent');
    submit.querySelector('.c-submit__label').textContent = '送信完了';
    thanks.textContent = 'お問い合わせありがとうございます。農場より3営業日以内にご連絡いたします。';
    thanks.style.color = 'rgba(194,186,170,.65)';

    // Reset after delay (demo only)
    setTimeout(() => {
      form.reset();
      submit.classList.remove('sent');
      submit.querySelector('.c-submit__label').textContent = '送信する';
    }, 8000);
  });
})();
