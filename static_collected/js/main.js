/* ==========================================================
   landing-page-solar-system.js
   - Scroll reveal (replays on scroll up/down)
   - Optional: adjust initial hash scroll for fixed header
   - Optional: smooth scroll for [data-scroll-to] anchors
   ========================================================== */
// Reveal-on-scroll for Pylon section


/* ===== CONFIG ===== */
const SOLAR = {
  revealSelector: '.reveal-solar-system',
  inViewClass: 'in-view-solar-system',
  headerSelector: '.header',
  anchorSelector: '[data-scroll-to]'
};

/* ===== Helpers ===== */
function getHeaderOffset() {
  const header = document.querySelector(SOLAR.headerSelector);
  return header ? header.offsetHeight : 0;
}

function smoothScrollTo(targetSelector) {
  if (!targetSelector || !targetSelector.startsWith('#')) return;
  const target = document.querySelector(targetSelector);
  if (!target) return;

  const y = target.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset();
  window.scrollTo({ top: y, behavior: 'smooth' });
}

/* ===== Scroll Reveal that re-triggers on leave ===== */
(function initScrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.querySelectorAll(SOLAR.revealSelector).forEach(el => el.classList.add(SOLAR.inViewClass));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      if (entry.isIntersecting) {
        el.classList.add(SOLAR.inViewClass);
      } else {
        // Remove when leaving viewport so it can animate again on return
        el.classList.remove(SOLAR.inViewClass);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(SOLAR.revealSelector).forEach(el => io.observe(el));
})();

/* ===== Smooth in-page scrolling for elements with [data-scroll-to] ===== */
(function initSmoothAnchors() {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest(SOLAR.anchorSelector);
    if (!trigger) return;

    const href = trigger.getAttribute('href');
    const dataTarget = trigger.getAttribute('data-target');
    const targetSelector = dataTarget || href;

    if (targetSelector && targetSelector.startsWith('#')) {
      e.preventDefault();
      smoothScrollTo(targetSelector);
    }
  });

  // If the page loads with a hash, fix initial position for fixed header
  window.addEventListener('load', () => {
    if (window.location.hash) {
      // Wait a tick so layout is ready
      setTimeout(() => smoothScrollTo(window.location.hash), 0);
    }
  });
})();

/* ==========================================================
   Logos pager (dots) + continuous marquee coexist (robust)
   ========================================================== */
(function initLogosPager() {
  const wrap = document.querySelector('.logos-wrap-solar-system');
  const track = document.getElementById('logos-track-solar-system');
  const dotsWrap = document.getElementById('dots-solar-system');
  if (!wrap || !track || !dotsWrap) return;

  const dots = Array.from(dotsWrap.querySelectorAll('.dot-solar-system'));
  const RESUME_DELAY = 3500; // ms after click before continuous scroll resumes
  let resumeTimer = null;

  // set active dot helper
  function setActiveDot(idx) {
    dots.forEach((d, i) => d.classList.toggle('is-active-solar-system', i === idx));
  }
  setActiveDot(0);

  // compute page width (use visible viewport of the logos)
  function pageWidth() { return wrap.clientWidth; }

  // Fully disable CSS animation and let us control transform
  function enterManualMode() {
    track.classList.add('manual-solar-system');
    track.style.animationPlayState = 'paused';
  }

  // Resume CSS animation from the start smoothly
  function resumeContinuous() {
    // remove manual transform + class and restart animation cleanly
    track.style.transform = '';
    track.classList.remove('manual-solar-system');

    // Restart the CSS animation reliably (toggle to 'none' then back)
    const prevAnim = getComputedStyle(track).animation;
    track.style.animation = 'none';
    // force reflow
    // eslint-disable-next-line no-unused-expressions
    track.offsetHeight;
    // restore whatever animation was in CSS
    track.style.animation = prevAnim;
    track.style.animationPlayState = 'running';
  }

  // Jump to page n by translating the track
  function goToPage(n) {
    const idx = Math.max(0, Math.min(n, dots.length - 1));
    setActiveDot(idx);

    enterManualMode();

    const offset = -idx * pageWidth();
    track.style.transform = `translateX(${offset}px)`;

    // schedule resume
    window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(resumeContinuous, RESUME_DELAY);
  }

  // Click handlers on dots
  dots.forEach(d => {
    d.addEventListener('click', () => {
      const n = parseInt(d.getAttribute('data-page') || '0', 10);
      goToPage(n);
    });
  });

  // Maintain the same page on resize while paused
  const ro = new ResizeObserver(() => {
    const active = dots.findIndex(el => el.classList.contains('is-active-solar-system'));
    if (active > -1 && track.classList.contains('manual-solar-system')) {
      track.style.transform = `translateX(${-active * pageWidth()}px)`;
    }
  });
  ro.observe(wwrap = wrap); // observe container width changes

  // Also pause marquee on hover (optional, keeps prior UX)
  wrap.addEventListener('mouseenter', () => {
    if (!track.classList.contains('manual-solar-system')) {
      track.style.animationPlayState = 'paused';
    }
  });
  wrap.addEventListener('mouseleave', () => {
    if (!track.classList.contains('manual-solar-system')) {
      track.style.animationPlayState = 'running';
    }
  });
})();


/* ==========================================================
   Count-up animation for Impact stats
   ========================================================== */
(function initImpactCounters() {
  const items = document.querySelectorAll('.stat-value-solar-system-impact');
  if (!items.length) return;

  function countTo(el) {
    const end = parseFloat(el.getAttribute('data-count-to')) || 0;
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400; // ms (slow & smooth)
    const startTime = performance.now();

    function tick(now) {
      const p = Math.min(1, (now - startTime) / duration);
      // easeOutCubic for a nice finish
      const eased = 1 - Math.pow(1 - p, 3);
      let val = end * eased;

      // If the end has decimals, keep one decimal, else integer
      const hasDecimal = String(end).includes('.');
      el.textContent = prefix + (hasDecimal ? val.toFixed(1) : Math.round(val)) + suffix;

      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + (hasDecimal ? end.toFixed(1) : Math.round(end)) + suffix;
    }
    requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      if (entry.isIntersecting) {
        // start counting when visible
        countTo(el);
      } else {
        // reset so it can play again on re-enter
        el.textContent = (el.getAttribute('data-prefix') || '') + '0' + (el.getAttribute('data-suffix') || '');
      }
    });
  }, { threshold: 0.35 });

  items.forEach(el => {
    // initialize to 0 with prefix/suffix
    el.textContent = (el.getAttribute('data-prefix') || '') + '0' + (el.getAttribute('data-suffix') || '');
    io.observe(el);
  });
})();
/* ==========================================================
   Solutions: "View All Solutions" toggle
   ========================================================== */
(function initSolutionsToggle() {
  const grid = document.getElementById('solutions-grid-solar-system-solution');
  const btn = document.getElementById('solutions-toggle-btn-solar-system-solution');
  if (!grid || !btn) return;

  function setState(expanded) {
    grid.classList.toggle('is-collapsed-solar-system-solution', !expanded);
    btn.setAttribute('aria-expanded', String(expanded));
    btn.textContent = expanded ? 'View Fewer' : 'View All Solutions';

    // Nudge IntersectionObserver so reveal animations can trigger for newly shown cards
    window.requestAnimationFrame(() => {
      window.dispatchEvent(new Event('scroll'));
    });
  }

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    setState(!expanded);
  });

  // default collapsed on load
  setState(false);
})();
/* ==========================================================
   Solar App: lightweight tilt/parallax for media cards
   Targets elements with [data-tilt]
   ========================================================== */
(function initSolarAppTilt() {
  const els = document.querySelectorAll('[data-tilt]');
  if (!els.length) return;

  const MAX_TILT = 8;         // degrees
  const MAX_TRANS = 10;       // px translate for parallax feel
  const EASE = 'cubic-bezier(.2,.65,.2,1)';

  function applyTilt(el, e) {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const rotX = (+dy * MAX_TILT).toFixed(2);
    const rotY = (-dx * MAX_TILT).toFixed(2);
    const tx = (-dx * MAX_TRANS).toFixed(2);
    const ty = (-dy * MAX_TRANS).toFixed(2);

    el.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translate(${tx}px, ${ty}px)`;
    el.style.transition = 'transform .08s';
  }

  function resetTilt(el) {
    el.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translate(0,0)';
    el.style.transition = `transform .5s ${EASE}`;
  }

  els.forEach(el => {
    el.addEventListener('pointermove', (e) => applyTilt(el, e));
    el.addEventListener('pointerleave', () => resetTilt(el));
    el.addEventListener('pointerdown', () => resetTilt(el)); // prevent sticky tilt on touch
  });
})();


/* ==========================================================
   Projects carousel: arrows scroll by one full "page"
   ========================================================== */
(function initProjectsCarousel() {
  const viewport = document.getElementById('projects-viewport-solar-system-projects');
  const prevBtn = document.querySelector('.prev-solar-system-projects');
  const nextBtn = document.querySelector('.next-solar-system-projects');
  if (!viewport || !prevBtn || !nextBtn) return;

  function updateButtons() {
    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    const atStart = viewport.scrollLeft <= 0;
    const atEnd = viewport.scrollLeft >= maxScroll - 1;
    prevBtn.disabled = atStart;
    nextBtn.disabled = atEnd;
  }

  function scrollPage(dir) {
    const distance = viewport.clientWidth; // page = visible width
    viewport.scrollBy({ left: dir * distance, behavior: 'smooth' });
    // optimistic button state; will correct on 'scroll' event
    setTimeout(updateButtons, 350);
  }

  prevBtn.addEventListener('click', () => scrollPage(-1));
  nextBtn.addEventListener('click', () => scrollPage(1));

  // keep buttons in sync
  viewport.addEventListener('scroll', () => {
    // debounced update
    window.clearTimeout(viewport._btnTimer);
    viewport._btnTimer = setTimeout(updateButtons, 80);
  });
  window.addEventListener('resize', updateButtons);

  // init
  updateButtons();
})();
// 
/* ==========================================================
   Types tabs: click/keyboard + hash support
   ========================================================== */
(function initSolarTypes() {
  const tabs = Array.from(document.querySelectorAll('.tab-btn-solar-system-types'));
  const panels = {
    'on-grid': document.getElementById('panel-on-grid-solar-system-types'),
    'off-grid': document.getElementById('panel-off-grid-solar-system-types'),
    'hybrid': document.getElementById('panel-hybrid-solar-system-types')
  };
  if (!tabs.length) return;

  function activate(type) {
    // tabs
    tabs.forEach(btn => {
      const isActive = btn.dataset.type === type;
      btn.classList.toggle('is-active-solar-system-types', isActive);
      btn.setAttribute('aria-selected', String(isActive));
      // tabindex for roving focus
      btn.setAttribute('tabindex', isActive ? '0' : '-1');
    });
    // panels
    Object.entries(panels).forEach(([key, el]) => {
      const show = key === type;
      if (!el) return;
      el.classList.toggle('is-active-solar-system-types', show);
      el.hidden = !show;
      if (show) {
        // restart small fade-in animation
        el.style.animation = 'none'; el.offsetHeight; el.style.animation = '';
      }
    });
  }

  // Click
  tabs.forEach(btn => btn.addEventListener('click', () => activate(btn.dataset.type)));

  // Keyboard: left/right arrows
  document.querySelector('.tabs-solar-system-types')?.addEventListener('keydown', (e) => {
    const idx = tabs.findIndex(b => b.classList.contains('is-active-solar-system-types'));
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      const next = (idx + dir + tabs.length) % tabs.length;
      tabs[next].focus();
      tabs[next].click();
    }
  });

  // Hash support e.g. #hybrid
  function fromHash() {
    const h = (location.hash || '').replace('#', '').toLowerCase();
    if (['on-grid', 'off-grid', 'hybrid'].includes(h)) activate(h);
  }
  window.addEventListener('hashchange', fromHash);

  // init
  activate('on-grid');
  fromHash();
})();
/* ==========================================================
   Scoped tabs for all .section-types-solar-system-types
   (no global getElementById; supports multiple instances)
   ========================================================== */
(function initAllSolarTypeTabs() {
  document.querySelectorAll('.section-types-solar-system-types').forEach(section => {
    const tabsWrap = section.querySelector('.tabs-solar-system-types');
    if (!tabsWrap) return;

    const tabs = Array.from(section.querySelectorAll('.tab-btn-solar-system-types'));
    const panels = Array.from(section.querySelectorAll('.panel-solar-system-types'));
    if (!tabs.length || !panels.length) return;

    function activate(btn) {
      // Tabs state
      tabs.forEach(t => {
        const isActive = t === btn;
        t.classList.toggle('is-active-solar-system-types', isActive);
        t.setAttribute('aria-selected', String(isActive));
        t.setAttribute('tabindex', isActive ? '0' : '-1');
      });

      // Panels state (scoped within this section)
      const targetId = btn.getAttribute('aria-controls');
      panels.forEach(p => {
        const show = p.id === targetId;
        p.hidden = !show;
        p.classList.toggle('is-active-solar-system-types', show);
        if (show) { p.style.animation = 'none'; p.offsetHeight; p.style.animation = ''; }
      });
    }

    // Click to activate
    tabs.forEach(btn => btn.addEventListener('click', () => activate(btn)));

    // Keyboard: Left/Right arrows within this tablist
    tabsWrap.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const current = tabs.findIndex(t => t.classList.contains('is-active-solar-system-types'));
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      const next = (current + dir + tabs.length) % tabs.length;
      tabs[next].focus();
      activate(tabs[next]);
    });

    // Init: use the one marked active or the first
    activate(tabs.find(t => t.classList.contains('is-active-solar-system-types')) || tabs[0]);
  });
})();

/* IntersectionObserver reveal - shows elements when they enter the viewport,
   hides them again when they leave (works on scroll down and up). */
(function () {
  const els = document.querySelectorAll('.reveal-up');
  if (!('IntersectionObserver' in window) || !els.length) {
    els.forEach(el => el.classList.add('is-visible-mobility'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible-mobility');
      } else {
        entry.target.classList.remove('is-visible-mobility');
      }
    });
  }, { threshold: 0.18 });

  els.forEach(el => io.observe(el));
})();

document.querySelectorAll('.image-card-pylon').forEach((card) => {
  card.classList.add('fade-in-image-pylon');
});

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.-gemini-tab');
  const contents = document.querySelectorAll('.-gemini-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and contents
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      // Add active class to the clicked tab
      tab.classList.add('active');

      // Find the corresponding content using the data-tab attribute
      const tabId = tab.getAttribute('data-tab');
      const content = document.getElementById(`${tabId}-content`);

      // Add active class to the content
      if (content) {
        content.classList.add('active');
      }
    });
  });

  // Set the default active tab and content on page load
  const defaultTab = document.querySelector('.-gemini-tab[data-tab="mission"]');
  const defaultContent = document.getElementById('mission-content');

  if (defaultTab && defaultContent) {
    defaultTab.classList.add('active');
    defaultContent.classList.add('active');
  }
});

(function () {
  const grid = document.getElementById('grid-neplan-card-with-animation');
  if (!grid) return;
  const cards = grid.querySelectorAll('.card-neplan-card-with-animation');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('show-neplan-card-with-animation');
      } else {
        // remove so it replays when scrolling back (LIFO feel)
        e.target.classList.remove('show-neplan-card-with-animation');
      }
    });
  }, { threshold: 0.18 });

  cards.forEach(c => io.observe(c));
})();


(() => {
  const SELECTOR = '.reveal-left, .reveal-right, .reveal-up, .reveal-down';

  // Apply per-element delay from data attribute if provided
  document.querySelectorAll(SELECTOR).forEach(el => {
    const d = el.getAttribute('data-reveal-delay');
    if (d) el.style.setProperty('--reveal-delay', /^\d+$/.test(d) ? `${d}ms` : d);
  });

  // Auto-stagger children inside a .reveal-group
  document.querySelectorAll('.reveal-group[data-reveal-stagger]').forEach(group => {
    const step = parseInt(group.dataset.revealStagger, 10) || 120; // ms
    let i = 0;
    group.querySelectorAll(SELECTOR).forEach(el => {
      el.style.setProperty('--reveal-delay', `${i * step}ms`);
      i++;
    });
  });

  // Observe and toggle visibility (replays when scrolling back unless .reveal-once)
  const io = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) target.classList.add('is-visible');
      else if (!target.classList.contains('reveal-once'))
        target.classList.remove('is-visible');
    });
  }, { threshold: 0.18 });

  document.querySelectorAll(SELECTOR).forEach(el => io.observe(el));
})();

// Slow reveal on scroll (up/down/left/right)
(() => {
  const targets = document.querySelectorAll(
    '.reveal-top-solar-system1-why-us, .reveal-up-solar-system1-why-us, .reveal-right-solar-system1-why-us, .reveal-left-solar-system1-why-us'
  );

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('reveal-in-solar-system1-why-us');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18 });

  targets.forEach((el) => io.observe(el));
})();
// CEC

// Reveal on scroll
(() => {
  const targets = document.querySelectorAll(
    '.reveal-top-solar-system-csc-products, .reveal-left-solar-system-csc-products, .reveal-right-solar-system-csc-products, .reveal-up-solar-system-csc-products'
  );
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        e.target.classList.add('reveal-in-solar-system-csc-products');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18 });
  targets.forEach(el => io.observe(el));
})();

// --- Doc gating (view vs. download request) ---
(() => {
  const modal = document.getElementById('csc-modal');
  const form  = document.getElementById('csc-form');
  const close = modal.querySelector('.modal-close-csc-solar-system-csc-products');
  const docNameInput = document.getElementById('csc-doc-name');
  const successPane  = document.getElementById('csc-success');
  const successEmail = document.getElementById('csc-success-email');
  const successDoc   = document.getElementById('csc-success-doc');

  // Open viewer in a new tab (no download)
  document.querySelectorAll('.view-doc-csc-solar-system-csc-products').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const url = a.dataset.url;
      if (!url) return;
      window.open(url, '_blank', 'noopener'); // new tab, viewer handles download UI
    });
  });

  // Open modal for download request
  document.querySelectorAll('.request-download-csc-solar-system-csc-products').forEach(btn => {
    btn.addEventListener('click', () => {
      docNameInput.value = btn.dataset.doc || '';
      modal.setAttribute('aria-hidden', 'false');
      successPane.hidden = true;
      form.hidden = false;
      form.reset();
      setTimeout(() => document.getElementById('csc-name')?.focus(), 50);
    });
  });

  // Close modal
  function closeModal(){ modal.setAttribute('aria-hidden', 'true'); }
  close.addEventListener('click', closeModal);
  modal.querySelector('.modal-backdrop-csc-solar-system-csc-products')
       .addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // Simple email validator
  const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  // Handle submit (simulate a send; integrate backend later)
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name  = (document.getElementById('csc-name')?.value || '').trim();
    const email = (document.getElementById('csc-email')?.value || '').trim();
    if (!name || !validEmail(email)){
      alert('Please enter a valid name and email.');
      return;
    }

    // Simulate success UI
    form.hidden = true;
    successPane.hidden = false;
    successEmail.textContent = email;
    successDoc.textContent = docNameInput.value || 'your document';

    // TODO: POST to your backend to email the document link securely.
  });
})();
(function(){
  const els = document.querySelectorAll('.reveal-solar');
  if(!('IntersectionObserver' in window) || !els.length) return els.forEach(el=>el.classList.add('is-visible-solar'));

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible-solar');
        io.unobserve(entry.target);
      }
    });
  }, {root:null, rootMargin:'0px 0px -10% 0px', threshold:0.15});

  els.forEach(el=>io.observe(el));
})();