// ── THEME TOGGLE ──
const html = document.documentElement;
const toggle = document.getElementById('themeToggle');
const saved = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', saved);

toggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ── CUSTOM CURSOR ──
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursorTrail');
let mx = 0, my = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});
// Lag trail
setInterval(() => {
  if (trail) {
    trail.style.left = mx + 'px';
    trail.style.top  = my + 'px';
  }
}, 60);

// ── NAV SCROLL ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ── MOBILE MENU ──
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => mobileMenu.classList.remove('open'))
);

// ── TYPED TEXT ──
const phrases = ['Building ML-powered tools.', 'Python & Linux enthusiast.', 'IIT Jodhpur · Batch of 2028.', 'Turning data into insights.'];
let pi = 0, ci = 0, del = false;
const typed = document.getElementById('typedText');
function type() {
  const cur = phrases[pi];
  typed.textContent = del ? cur.slice(0, ci--) : cur.slice(0, ci++);
  if (!del && ci > cur.length) { del = true; setTimeout(type, 1600); return; }
  if (del && ci < 0) { del = false; pi = (pi + 1) % phrases.length; ci = 0; }
  setTimeout(type, del ? 40 : 85);
}
type();

// ── COUNT-UP ──
function countUp(el, target, dur = 1400) {
  const start = performance.now();
  const run = now => {
    const p = Math.min((now - start) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(e * target);
    if (p < 1) requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
}

// ── INTERSECTION OBSERVER ──
const revealTargets = document.querySelectorAll(
  '.project-row, .skill-group, .info-item, .contact-row, .edu-card, .about-chips, .about-info-row, .hero-right'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    io.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

revealTargets.forEach(el => io.observe(el));

// Stagger project rows
document.querySelectorAll('.project-row').forEach((row, i) => {
  row.style.transitionDelay = `${i * 60}ms`;
});

// ── COUNT-UP FOR STATS ──
document.querySelectorAll('[data-count]').forEach(el => {
  const statIo = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      countUp(el, parseInt(el.dataset.count));
      statIo.unobserve(el);
    }
  }, { threshold: 0.5 });
  statIo.observe(el);
});

// ── AVATAR TILT ──
const frame = document.querySelector('[data-tilt]');
if (frame) {
  frame.addEventListener('mousemove', e => {
    const r = frame.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 10;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 10;
    frame.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg)`;
  });
  frame.addEventListener('mouseleave', () => { frame.style.transform = ''; });
}

// ── ACTIVE NAV ──
const sections = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a');
const secIo = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAs.forEach(a => a.style.color = '');
      const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (a) a.style.color = 'var(--text)';
    }
  });
}, { threshold: 0.45 });
sections.forEach(s => secIo.observe(s));

// ── CERTIFICATES GALLERY ──
(async () => {
  const gallery  = document.getElementById('certsGallery');
  const lightbox = document.getElementById('certLightbox');
  const lbImg    = document.getElementById('certLightboxImg');
  const lbName   = document.getElementById('certLightboxName');
  const lbDl     = document.getElementById('certLightboxDl');
  const lbClose  = document.getElementById('certLightboxClose');
  const lbBack   = document.getElementById('certLightboxBackdrop');

  function openLightbox(src, name) {
    lbImg.src = src;
    lbImg.alt = name;
    lbName.textContent = name;
    lbDl.href = src;
    lbDl.download = src.split('/').pop();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    // Clear src after transition so it doesn't flash on next open
    setTimeout(() => { lbImg.src = ''; }, 350);
  }
  lbClose.addEventListener('click', closeLightbox);
  lbBack.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  try {
    const res = await fetch('cert_exp/manifest.json');
    if (!res.ok) throw new Error('manifest not found');
    const certs = await res.json();

    if (!certs.length) {
      gallery.innerHTML = '<p class="certs-loading">No certificates found.</p>';
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'certs-grid';

    certs.forEach((cert, i) => {
      const src  = `cert_exp/${cert.file}`;
      const name = cert.name;

      const card = document.createElement('div');
      card.className = 'cert-card reveal';
      card.style.transitionDelay = `${i * 70}ms`;

      card.innerHTML = `
        <div class="cert-card-img-wrap">
          <img class="cert-card-img" src="${src}" alt="${name}" loading="lazy" />
        </div>
        <div class="cert-card-footer">
          <span class="cert-card-name">${name}</span>
          <a class="cert-card-dl" href="${src}" download="${cert.file}"
             title="Download" aria-label="Download ${name}">↓ DL</a>
        </div>
      `;

      // Click on image area → lightbox; click on DL → native download (stop propagation)
      card.querySelector('.cert-card-img-wrap').addEventListener('click', () => openLightbox(src, name));
      card.querySelector('.cert-card-dl').addEventListener('click', e => e.stopPropagation());

      grid.appendChild(card);
    });

    gallery.innerHTML = '';
    gallery.appendChild(grid);

    // Hook new cards into reveal observer
    grid.querySelectorAll('.cert-card').forEach(el => io.observe(el));

  } catch (err) {
    gallery.innerHTML = `<p class="certs-loading">Could not load certificates. (${err.message})</p>`;
    console.warn('Certs:', err);
  }
})();
