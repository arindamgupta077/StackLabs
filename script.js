/* ==========================================================
   STACKLABS – script.js
   Handles: cursor, nav, hero canvas, reveal animations,
            counter, skill bars, smooth scroll, mobile menu,
            service card glow, form submit
   ========================================================== */

(function () {
  'use strict';

  /* Mobile detection — used across multiple sections */
  const isMobileDevice = window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 768;

  /* ──────────────────────────────────────────
     0. GSAP + SCROLLTRIGGER  (premium animations)
  ────────────────────────────────────────── */
  (function initGSAP() {
    if (typeof gsap === 'undefined') return; // CDN not loaded
    gsap.registerPlugin(ScrollTrigger);

    // ── Hero entrance timeline ──────────────────────────────
    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.15 });
    heroTl
      .from('.hero-badge',    { y: 28, opacity: 0, duration: 0.85 })
      .from('.hero-line',     { y: 100, opacity: 0, stagger: 0.15, duration: 1.1 }, '-=0.5')
      .from('.hero-subtitle', { y: 32,  opacity: 0, duration: 0.9  }, '-=0.7')
      .from('.hero-actions',  { y: 28,  opacity: 0, duration: 0.85 }, '-=0.65')
      .from('.hero-stack',    { y: 22,  opacity: 0, duration: 0.75 }, '-=0.55')
      .from('.hero-scroll',   { opacity: 0,          duration: 0.6  }, '-=0.3');

    // ── Generic scroll reveals ──────────────────────────────
    gsap.utils.toArray('.reveal-up').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 70 },
        { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
      );
    });
    gsap.utils.toArray('.reveal-left').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, x: -70 },
        { opacity: 1, x: 0, duration: 1.05, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true } }
      );
    });
    gsap.utils.toArray('.reveal-right').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, x: 70 },
        { opacity: 1, x: 0, duration: 1.05, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true } }
      );
    });
    gsap.utils.toArray('.reveal-fade').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0 },
        { opacity: 1, duration: 0.9, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
      );
    });

    // ── Section header staged reveals ──────────────────────
    gsap.utils.toArray('.section-header').forEach(el => {
      const tag   = el.querySelector('.section-tag');
      const title = el.querySelector('.section-title');
      const sub   = el.querySelector('.section-subtitle');
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 86%', once: true } });
      if (tag)   tl.from(tag,   { opacity: 0, y: 18, duration: 0.55, ease: 'power3.out' });
      if (title) tl.from(title, { opacity: 0, y: 46, duration: 0.9,  ease: 'power3.out' }, '-=0.3');
      if (sub)   tl.from(sub,   { opacity: 0, y: 22, duration: 0.75, ease: 'power3.out' }, '-=0.5');
    });

    // ── Card grid stagger batches ───────────────────────────
    [
      { sel: '.service-card',  s: 0.09 },
      { sel: '.pkg-card',      s: 0.13 },
      { sel: '.project-card',  s: 0.12 },
      { sel: '.testi-card',    s: 0.11 },
      { sel: '.maint-card',    s: 0.11 },
      { sel: '.stat-card',     s: 0.09 },
      { sel: '.addon-item',    s: 0.05 },
    ].forEach(({ sel, s }) => {
      ScrollTrigger.batch(sel, {
        onEnter: batch => gsap.fromTo(batch,
          { opacity: 0, y: 64, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, stagger: s, duration: 0.88, ease: 'power3.out', overwrite: true }
        ),
        start: 'top 91%',
        once: true,
      });
    });

    // Process steps stagger with spring
    ScrollTrigger.batch('.process-step', {
      onEnter: batch => gsap.fromTo(batch,
        { opacity: 0, y: 50, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.07, duration: 0.8, ease: 'back.out(1.3)', overwrite: true }
      ),
      start: 'top 92%',
      once: true,
    });

    // ── Hero orbs — GSAP scrub parallax (desktop only) ─────
    if (!isMobileDevice) {
      gsap.to('.orb-1', { y: -160, x: -20, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 } });
      gsap.to('.orb-2', { y: -100, x: 30,  ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.6 } });
      gsap.to('.orb-3', { y: -60, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 2 } });
      gsap.to('.hero-container', { y: 80, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
    }

    // ── CTA orbs parallax ───────────────────────────────────
    gsap.to('.cta-orb-l', { x: -70, y: 50, ease: 'none',
      scrollTrigger: { trigger: '.cta-section', start: 'top bottom', end: 'bottom top', scrub: 2 } });
    gsap.to('.cta-orb-r', { x: 70, y: -50, ease: 'none',
      scrollTrigger: { trigger: '.cta-section', start: 'top bottom', end: 'bottom top', scrub: 2 } });

    // ── About visual — clip-path reveal (desktop only)
    // NOTE: must NOT apply clip-path to .about-img-wrap or .about-visual
    // because float cards extend outside those bounds with negative offsets.
    // On mobile skip clip-path entirely — the 10MB GIF is heavy enough without
    // also starting fully clipped which can leave it permanently invisible.
    if (!isMobileDevice && CSS.supports('clip-path', 'inset(0 0% 0 0 round 24px)')) {
      gsap.fromTo('.about-img-placeholder',
        { clipPath: 'inset(0 100% 0 0 round 24px)' },
        { clipPath: 'inset(0 0% 0 0 round 24px)', duration: 1.25, ease: 'power4.inOut',
          scrollTrigger: { trigger: '.about', start: 'top 75%', once: true } }
      );
    } else if (isMobileDevice) {
      gsap.fromTo('.about-img-placeholder',
        { opacity: 0 },
        { opacity: 1, duration: 0.9, ease: 'power2.out',
          scrollTrigger: { trigger: '.about', start: 'top 82%', once: true } }
      );
    }

    // Float cards spring-in
    gsap.fromTo(['.card-tl', '.card-br'],
      { opacity: 0, scale: 0.82, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 1.0, ease: 'back.out(1.5)', stagger: 0.22,
        scrollTrigger: { trigger: '.about-visual', start: 'top 80%', once: true } }
    );

    // About float cards subtle parallax while scrolling
    gsap.utils.toArray('.about-float-card').forEach((card, i) => {
      gsap.to(card, { y: i === 0 ? -28 : 28, ease: 'none',
        scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: 1.5 } });
    });

    // ── Skill bars ──────────────────────────────────────────
    document.querySelectorAll('.skill-bar[data-w]').forEach(bar => {
      gsap.fromTo(bar, { width: '0%' },
        { width: bar.dataset.w + '%', duration: 1.5, ease: 'power3.out',
          scrollTrigger: { trigger: bar, start: 'top 88%', once: true } }
      );
    });

    // ── Counter animation ───────────────────────────────────
    document.querySelectorAll('.stat-number[data-target]').forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target, duration: 2.4, ease: 'power2.out',
        onUpdate() { el.textContent = Math.round(obj.val); },
        onComplete() { el.textContent = target; },
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });

    // ── Featured package card — spring entrance ─────────────
    gsap.fromTo('.pkg-featured',
      { scale: 0.88, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.15, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: '.pkg-featured', start: 'top 85%', once: true } }
    );

    // ── Addons grid stagger ─────────────────────────────────
    gsap.fromTo('.addons-wrap',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out',
        scrollTrigger: { trigger: '.addons-wrap', start: 'top 88%', once: true } }
    );

  })();

  /* ──────────────────────────────────────────
     1. CUSTOM CURSOR
  ────────────────────────────────────────── */
  const cursor         = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursorFollower');

  let mouseX = -200, mouseY = -200;
  let followerX = -200, followerY = -200;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover effect on interactive elements
  const hoverTargets = document.querySelectorAll(
    'a, button, .service-card, .pkg-card, .project-card, .testi-card, .maint-card, .addon-item'
  );
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => cursorFollower.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursorFollower.classList.remove('hovered'));
  });


  /* ──────────────────────────────────────────
     2. NAVIGATION SCROLL BEHAVIOUR
  ────────────────────────────────────────── */
  const nav = document.getElementById('nav');

  function updateNav() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();


  /* ──────────────────────────────────────────
     3. MOBILE MENU TOGGLE
  ────────────────────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  function closeMenu() {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navOverlay.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navOverlay.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navOverlay.addEventListener('click', closeMenu);

  // Close menu on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });


  /* ──────────────────────────────────────────
     4. SMOOTH SCROLL (with nav offset)
  ────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH   = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      const top    = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ──────────────────────────────────────────
     5. HERO CANVAS – PARTICLE NETWORK
  ────────────────────────────────────────── */
  const canvas = document.getElementById('heroCanvas');
  const ctx    = canvas.getContext('2d');

  let W, H, particles = [], animId;

  const PARTICLE_COUNT   = isMobileDevice ? 30 : 80;
  const CONNECTION_DIST  = isMobileDevice ? 100 : 150;
  const PARTICLE_SPEED   = 0.35;
  const COLORS           = ['#7c5cfc', '#9b7ffe', '#00d4ff', '#a78bfa'];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function randomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  function createParticle() {
    return {
      x:    Math.random() * W,
      y:    Math.random() * H,
      r:    Math.random() * 2 + 1,
      vx:   (Math.random() - 0.5) * PARTICLE_SPEED * 2,
      vy:   (Math.random() - 0.5) * PARTICLE_SPEED * 2,
      col:  randomColor(),
      alph: Math.random() * 0.5 + 0.3
    };
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const opacity = (1 - dist / CONNECTION_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124,92,252,${opacity})`;
          ctx.lineWidth   = 0.8;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.col + Math.round(p.alph * 255).toString(16).padStart(2, '0');
      ctx.fill();
    });
  }

  function updateParticles() {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      p.x = Math.max(0, Math.min(W, p.x));
      p.y = Math.max(0, Math.min(H, p.y));
    });
  }

  function loopCanvas() {
    drawParticles();
    updateParticles();
    animId = requestAnimationFrame(loopCanvas);
  }

  function initCanvas() {
    resize();
    initParticles();
    if (animId) cancelAnimationFrame(animId);
    loopCanvas();
  }

  window.addEventListener('resize', () => {
    resize();
    initParticles();
  }, { passive: true });

  initCanvas();

  // Mouse interaction — attract particles slightly
  let mx = null, my = null;
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mx = e.clientX - rect.left;
    my = e.clientY - rect.top;
  }, { passive: true });
  canvas.addEventListener('mouseleave', () => { mx = null; my = null; });

  // Override update to include mouse attraction
  function updateParticlesWithMouse() {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (mx !== null) {
        const dx   = mx - p.x;
        const dy   = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.x += (dx / dist) * 0.4;
          p.y += (dy / dist) * 0.4;
        }
      }
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      p.x = Math.max(0, Math.min(W, p.x));
      p.y = Math.max(0, Math.min(H, p.y));
    });
  }

  // Replace updateParticles with enhanced version
  function loopCanvasFull() {
    drawParticles();
    updateParticlesWithMouse();
    requestAnimationFrame(loopCanvasFull);
  }
  cancelAnimationFrame(animId);
  loopCanvasFull();


  /* ──────────────────────────────────────────
     6. SCROLL ANIMATIONS — handled by GSAP
        ScrollTrigger (see section 0 above)
  ────────────────────────────────────────── */


  /* ──────────────────────────────────────────
     7. COUNTER ANIMATION — handled by GSAP
        (see section 0 above)
  ────────────────────────────────────────── */


  /* ──────────────────────────────────────────
     8. SKILL BARS — handled by GSAP
        (see section 0 above)
  ────────────────────────────────────────── */


  /* ──────────────────────────────────────────
     9. SERVICE CARD MOUSE-GLOW EFFECT
  ────────────────────────────────────────── */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x    = ((e.clientX - rect.left) / rect.width)  * 100;
      const y    = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });


  /* ──────────────────────────────────────────
     10. HERO PARALLAX — handled by GSAP
         ScrollTrigger scrub (see section 0 above)
  ────────────────────────────────────────── */


  /* ──────────────────────────────────────────
     11. ACTIVE NAV LINK HIGHLIGHTING
  ────────────────────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link:not(.nav-cta)');

  function highlightNav() {
    const scrollPos = window.scrollY + 80;
    let current = '';
    sections.forEach(section => {
      if (section.offsetTop <= scrollPos) {
        current = '#' + section.id;
      }
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === current);
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();


  /* ──────────────────────────────────────────
     12. CONTACT FORM – CLIENT-SIDE HANDLING
  ────────────────────────────────────────── */

  function handleForm(form, submitBtn, successMsg) {
    if (!form || !submitBtn || !successMsg) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const name  = form.querySelector('[name="name"]');
      const phone = form.querySelector('[name="phone"]');
      const email = form.querySelector('[name="email"]');
      let valid   = true;

      [name, phone, email].forEach(inp => { inp.style.borderColor = ''; });

      if (!name.value.trim())  { name.style.borderColor  = '#ff6b6b'; valid = false; }
      if (!phone.value.trim()) { phone.style.borderColor = '#ff6b6b'; valid = false; }
      if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.style.borderColor = '#ff6b6b'; valid = false;
      }
      if (!valid) return;

      const btnText = submitBtn.querySelector('.btn-text');
      const btnArr  = submitBtn.querySelector('.btn-arr');
      const btnDots = submitBtn.querySelector('.btn-dots');

      btnText.textContent  = 'Sending...';
      btnArr.style.display = 'none';
      btnDots.hidden       = false;
      submitBtn.disabled   = true;

      setTimeout(() => {
        btnText.textContent  = 'Send Message';
        btnArr.style.display = '';
        btnDots.hidden       = true;
        submitBtn.disabled   = false;
        form.reset();
        successMsg.hidden = false;
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => { successMsg.hidden = true; }, 6000);
      }, 1800);
    });

    form.querySelectorAll('input, textarea').forEach(inp => {
      inp.addEventListener('input', () => { inp.style.borderColor = ''; });
    });
  }

  // Section contact form
  handleForm(
    document.getElementById('contactForm'),
    document.getElementById('submitBtn'),
    document.getElementById('formSuccess')
  );

  /* ──────────────────────────────────────────
     13. CONTACT MODAL
  ────────────────────────────────────────── */
  const contactModal  = document.getElementById('contactModal');
  const modalCloseBtn = document.getElementById('modalClose');
  const modalTriggers = document.querySelectorAll('[data-modal="contact"]');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', e => e.preventDefault());
  });

  function openContactModal(serviceValue) {
    if (serviceValue) {
      const sel = document.getElementById('mfservice');
      if (sel) sel.value = serviceValue;
    }
    contactModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      const first = contactModal.querySelector('input');
      if (first) first.focus();
    }, 450);
  }

  function closeContactModal() {
    contactModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  modalTriggers.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      openContactModal(btn.dataset.service || '');
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeContactModal);

  if (contactModal) {
    contactModal.addEventListener('click', e => {
      if (e.target === contactModal) closeContactModal();
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && contactModal && contactModal.classList.contains('open')) {
      closeContactModal();
    }
  });

  // Modal form
  handleForm(
    document.getElementById('modalContactForm'),
    document.getElementById('mSubmitBtn'),
    document.getElementById('mFormSuccess')
  );


  /* ──────────────────────────────────────────
     13. STAGGER ANIMATIONS — handled by GSAP
         ScrollTrigger.batch (see section 0 above)
  ────────────────────────────────────────── */


  /* ──────────────────────────────────────────
     14. 3D CARD TILT (GSAP quickSetter)
  ────────────────────────────────────────── */
  document.querySelectorAll('.pkg-card, .testi-card, .service-card').forEach(card => {
    if (typeof gsap !== 'undefined') {
      const setRotX = gsap.quickSetter(card, 'rotateX', 'deg');
      const setRotY = gsap.quickSetter(card, 'rotateY', 'deg');
      const setTY   = gsap.quickSetter(card, 'y', 'px');
      card.style.transformPerspective = '900px';
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const dx = (e.clientX - rect.left) / rect.width  - 0.5;
        const dy = (e.clientY - rect.top)  / rect.height - 0.5;
        setRotY(dx * 10);
        setRotX(dy * -8);
        setTY(-6);
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, y: 0, duration: 0.6, ease: 'power3.out' });
      });
    } else {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cx   = rect.left + rect.width  / 2;
        const cy   = rect.top  + rect.height / 2;
        const rotX = ((e.clientY - cy) / (rect.height / 2)) * -5;
        const rotY = ((e.clientX - cx) / (rect.width  / 2)) *  5;
        card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    }
  });


  /* ──────────────────────────────────────────
     15. SCROLL PROGRESS INDICATOR (top bar)
  ────────────────────────────────────────── */
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 3px;
    background: linear-gradient(90deg, #7c5cfc, #00d4ff);
    z-index: 9998; width: 0%; transition: width 0.1s linear;
    border-radius: 0 2px 2px 0;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = ((scrolled / total) * 100) + '%';
  }, { passive: true });


  /* ──────────────────────────────────────────
     16. NAV ACTIVE STYLE (CSS complement)
  ────────────────────────────────────────── */
  const style = document.createElement('style');
  style.textContent = `
    .nav-link.active {
      color: var(--text-1) !important;
      background: rgba(255,255,255,0.05);
    }
  `;
  document.head.appendChild(style);


  /* ──────────────────────────────────────────
     17. HERO TYPING EFFECT (subtitle highlight)
  ────────────────────────────────────────── */
  const words  = ['Lead Generation', 'Booking Systems', 'Admin Dashboards', 'Web Applications', 'E-Commerce'];
  let   wi     = 0;
  let   ci     = 0;
  let   typing = true;

  const typingTarget = document.createElement('span');
  typingTarget.style.cssText = `
    color: var(--purple-2);
    border-right: 2px solid var(--purple);
    padding-right: 2px;
  `;

  const heroSubEl = document.querySelector('.hero-subtitle');
  if (heroSubEl) {
    const original = heroSubEl.innerHTML;
    heroSubEl.innerHTML = original + ' <br class="desktop-break"/>Specialising in ' + typingTarget.outerHTML;
    const typer = heroSubEl.querySelector('span');

    function type() {
      if (typing) {
        if (ci < words[wi].length) {
          typer.textContent = words[wi].slice(0, ++ci);
          setTimeout(type, 80);
        } else {
          typing = false;
          setTimeout(type, 1800);
        }
      } else {
        if (ci > 0) {
          typer.textContent = words[wi].slice(0, --ci);
          setTimeout(type, 40);
        } else {
          typing = true;
          wi     = (wi + 1) % words.length;
          setTimeout(type, 400);
        }
      }
    }
    setTimeout(type, 2500);
  }


  /* ──────────────────────────────────────────
     18. HERO BADGE FLOAT ANIMATION (GSAP yoyo)
  ────────────────────────────────────────── */
  const badge = document.querySelector('.hero-badge');
  if (badge && typeof gsap !== 'undefined') {
    gsap.fromTo(badge, { y: -5 }, { y: -13, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  } else if (badge) {
    let t = 0;
    (function floatBadge() {
      t += 0.02;
      badge.style.transform = `translateY(${-9 + Math.sin(t) * 4}px)`;
      requestAnimationFrame(floatBadge);
    })();
  }


  /* ──────────────────────────────────────────
     19. STAT CARDS – HOVER GLOW
  ────────────────────────────────────────── */
  document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.background = 'rgba(124,92,252,0.05)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });


  /* ──────────────────────────────────────────
     20. FOOTER YEAR (always current)
  ────────────────────────────────────────── */
  const yearEl = document.querySelector('.footer-bottom span:first-child');
  if (yearEl) {
    yearEl.textContent = yearEl.textContent.replace(/\d{4}/, new Date().getFullYear());
  }


  /* ──────────────────────────────────────────
     INIT COMPLETE LOG
  ────────────────────────────────────────── */
  console.log('%cStackLabs ⚡ Loaded', 'color:#7c5cfc;font-size:14px;font-weight:700;');

})();
