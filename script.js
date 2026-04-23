// ── CURSOR GLOW ──
const glow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});

// ── NAV SCROLL ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ── MOBILE MENU ──
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => mobileMenu.classList.remove('open'))
);

// ── TYPED TEXT ──
const phrases = [
  'Building ML-powered tools.',
  'Python & Linux enthusiast.',
  'IIT Jodhpur, Batch of 2028.',
  'Turning data into insights.',
];
let pi = 0, ci = 0, deleting = false;
const el = document.getElementById('typedText');
function type() {
  const cur = phrases[pi];
  el.textContent = deleting ? cur.slice(0, ci--) : cur.slice(0, ci++);
  if (!deleting && ci > cur.length) { deleting = true; setTimeout(type, 1400); return; }
  if (deleting && ci < 0) { deleting = false; pi = (pi + 1) % phrases.length; ci = 0; }
  setTimeout(type, deleting ? 45 : 80);
}
type();

// ── COUNT-UP ──
function countUp(el, target, duration = 1600) {
  const start = performance.now();
  const update = now => {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(ease * target);
    if (p < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// ── INTERSECTION OBSERVER ──
const revealEls = document.querySelectorAll('.section, .project-card, .skill-category, .info-card, .contact-card, .timeline-card');
revealEls.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    io.unobserve(entry.target);
    // Trigger skill bars
    entry.target.querySelectorAll('.pill-fill').forEach(bar => bar.classList.add('animated'));
    // Trigger count-up on stat numbers
    entry.target.querySelectorAll('[data-count]').forEach(el => {
      countUp(el, parseInt(el.dataset.count));
    });
  });
}, { threshold: 0.1 });

revealEls.forEach(el => io.observe(el));

// Also observe hero stats individually
document.querySelectorAll('[data-count]').forEach(el => {
  const statIo = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      countUp(el, parseInt(el.dataset.count));
      statIo.unobserve(el);
    }
  }, { threshold: 0.5 });
  statIo.observe(el);
});

// ── TILT ON AVATAR ──
const avatar = document.querySelector('[data-tilt]');
if (avatar) {
  avatar.addEventListener('mousemove', e => {
    const r = avatar.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 15;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 15;
    avatar.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg)`;
  });
  avatar.addEventListener('mouseleave', () => {
    avatar.style.transform = '';
  });
}

// ── ACTIVE NAV HIGHLIGHT ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const sectIo = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.5 });
sections.forEach(s => sectIo.observe(s));
