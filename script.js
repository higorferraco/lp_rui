/* ============================================================
   RUI BAROMEU — O CONSTRUTOR DE SONHOS
   Landing Page Premium | Scripts v2
   ============================================================ */

(function () {
  'use strict';

  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const IS_TOUCH       = window.matchMedia('(hover: none)').matches;
  const IS_DESKTOP     = window.matchMedia('(min-width: 1025px)').matches;

  /* ── 1. Scroll Reveal (Intersection Observer) ──── */
  function initScrollReveal() {
    const selector = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
  }

  /* ── 2. Navbar Scroll Behavior ──────────────────── */
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let ticking = false;

    function updateNavbar() {
      navbar.classList.toggle('scrolled', window.scrollY > 80);
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── 3. Smooth Scroll for Anchor Links ──────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - navbarHeight - 20,
          behavior: 'smooth'
        });
      });
    });
  }

  /* ── 4. Parallax Hero Image ─────────────────────── */
  function initParallax() {
    if (!IS_DESKTOP || REDUCED_MOTION) return;
    const heroImage = document.querySelector('.hero__bg-image');
    if (!heroImage) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const heroHeight = document.querySelector('.hero')?.offsetHeight || 900;
          if (scrollY < heroHeight) {
            heroImage.style.transform = `translateY(${scrollY * 0.22}px) scale(1.05)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── 5. Custom Cursor ───────────────────────────── */
  function initCustomCursor() {
    if (!IS_DESKTOP || REDUCED_MOTION) return;

    const dot  = document.getElementById('cursorDot');
    const glow = document.getElementById('cursorGlow');
    if (!dot || !glow) return;

    let dotX = 0, dotY = 0;
    let glowX = 0, glowY = 0;
    let mouseX = 0, mouseY = 0;
    let raf;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function animateCursor() {
      // Dot snaps quickly
      dotX += (mouseX - dotX) * 0.55;
      dotY += (mouseY - dotY) * 0.55;

      // Glow lags behind for a trailing feel
      glowX += (mouseX - glowX) * 0.12;
      glowY += (mouseY - glowY) * 0.12;

      dot.style.left  = dotX  + 'px';
      dot.style.top   = dotY  + 'px';
      glow.style.left = glowX + 'px';
      glow.style.top  = glowY + 'px';

      raf = requestAnimationFrame(animateCursor);
    }
    raf = requestAnimationFrame(animateCursor);

    // Hover state on interactive elements
    const hoverTargets = 'a, button, .reason-card, .highlight-item, .for-whom__item, .credit-item';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) {
        dot.classList.add('is-hovering');
        glow.classList.add('is-hovering');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) {
        dot.classList.remove('is-hovering');
        glow.classList.remove('is-hovering');
      }
    });

    // Hide when cursor leaves window
    document.addEventListener('mouseleave', () => {
      dot.style.opacity  = '0';
      glow.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity  = '1';
      glow.style.opacity = '1';
    });
  }

  /* ── 6. Ambient Glow Mouse Follow ──────────────── */
  function initAmbientGlow() {
    const glow = document.querySelector('.ambient-glow--hero');
    if (!glow || !IS_DESKTOP || REDUCED_MOTION) return;

    let glowRaf;
    document.querySelector('.hero')?.addEventListener('mousemove', (e) => {
      if (glowRaf) cancelAnimationFrame(glowRaf);
      glowRaf = requestAnimationFrame(() => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - 350;
        const y = e.clientY - rect.top  - 350;
        glow.style.transform = `translate(${x * 0.07}px, ${y * 0.07}px)`;
      });
    });
  }

  /* ── 7. 3D Card Tilt + Shine ────────────────────── */
  function initCardTilt() {
    if (IS_TOUCH || REDUCED_MOTION) return;

    const cards = document.querySelectorAll('.reason-card');
    const MAX_TILT = 8; // degrees

    cards.forEach((card) => {
      const shine = card.querySelector('.reason-card__shine');

      card.addEventListener('mousemove', (e) => {
        const rect  = card.getBoundingClientRect();
        const cx    = rect.left + rect.width  / 2;
        const cy    = rect.top  + rect.height / 2;
        const dx    = e.clientX - cx;
        const dy    = e.clientY - cy;
        const tiltX = -(dy / (rect.height / 2)) * MAX_TILT;
        const tiltY =  (dx / (rect.width  / 2)) * MAX_TILT;

        card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(6px)`;

        // Shine position (percentage inside card)
        if (shine) {
          const pctX = ((e.clientX - rect.left) / rect.width)  * 100;
          const pctY = ((e.clientY - rect.top)  / rect.height) * 100;
          shine.style.setProperty('--shine-x', pctX + '%');
          shine.style.setProperty('--shine-y', pctY + '%');
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.6s var(--ease-out-expo), border-color 0.4s, box-shadow 0.4s';
        setTimeout(() => { card.style.transition = ''; }, 650);
      });
    });
  }

  /* ── 8. Magnetic Buttons ───────────────────────── */
  function initMagneticButtons() {
    if (IS_TOUCH || REDUCED_MOTION) return;

    const buttons = document.querySelectorAll('.btn--primary, .btn--secondary');
    const STRENGTH = 0.3;

    buttons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width  / 2);
        const dy = e.clientY - (rect.top  + rect.height / 2);
        btn.style.transform = `translate(${dx * STRENGTH}px, ${dy * STRENGTH - 3}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform  = '';
        btn.style.transition = 'transform 0.5s var(--ease-out-expo), background 0.4s, box-shadow 0.4s';
        setTimeout(() => { btn.style.transition = ''; }, 520);
      });
    });
  }

  /* ── 9. Book Mockup 3D Mouse Follow ─────────────── */
  function initBookMockup3D() {
    if (IS_TOUCH || REDUCED_MOTION) return;

    const mockup  = document.querySelector('.book-preview__mockup');
    const section = document.querySelector('.book-preview');
    if (!mockup || !section) return;

    const MAX = 6;

    section.addEventListener('mousemove', (e) => {
      const rect  = mockup.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const tiltX = -((e.clientY - cy) / (rect.height / 2)) * MAX;
      const tiltY =  ((e.clientX - cx) / (rect.width  / 2)) * MAX;
      mockup.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-10px)`;
    });

    section.addEventListener('mouseleave', () => {
      mockup.style.transform  = '';
      mockup.style.transition = 'transform 1s var(--ease-out-expo)';
      setTimeout(() => { mockup.style.transition = ''; }, 1050);
    });
  }

  /* ── 10. Staggered number reveal in reason cards ── */
  function initNumberReveal() {
    if (REDUCED_MOTION) return;

    const numbers = document.querySelectorAll('.reason-card__number');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Animate opacity from 0.12 → 0.12 (just a small pulse to draw eye)
          const el = entry.target;
          el.style.transition = 'opacity 0.6s var(--ease-out-expo)';
          el.style.opacity = '0.28';
          setTimeout(() => {
            el.style.opacity = '';
            el.style.transition = '';
          }, 700);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    numbers.forEach((n) => observer.observe(n));
  }

  /* ── 11. Page Ready ─────────────────────────────── */
  function initPageReady() {
    document.body.classList.add('page-loaded');
  }

  /* ── Init ────────────────────────────────────────── */
  function init() {
    initScrollReveal();
    initNavbar();
    initSmoothScroll();
    initParallax();
    initCustomCursor();
    initAmbientGlow();
    initCardTilt();
    initMagneticButtons();
    initBookMockup3D();
    initNumberReveal();
    initPageReady();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
