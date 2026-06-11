
/* ── Three.js Particle Field ─────────────────────────────── */
(function() {
  const canvas = document.getElementById('hero-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  /* Particles */
  const count = window.innerWidth < 768 ? 900 : 2200;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  const palette = [
    new THREE.Color('#1D1A39'),
    new THREE.Color('#451952'),
    new THREE.Color('#662549'),
    new THREE.Color('#AF445A'),
    new THREE.Color('#F59F59'),
    new THREE.Color('#E8BCB9'),
  ];

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3]     = (Math.random() - 0.5) * 80;
    positions[i3 + 1] = (Math.random() - 0.5) * 50;
    positions[i3 + 2] = (Math.random() - 0.5) * 40;
    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i3] = c.r; colors[i3+1] = c.g; colors[i3+2] = c.b;
    sizes[i] = Math.random() * 2.5 + 0.5;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

  // Expose for theme toggle
  window._particleGeometry = geometry;

  const material = new THREE.PointsMaterial({
    size: 0.18, vertexColors: true,
    transparent: true, opacity: 0.72,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  /* Mouse parallax */
  let mouse = { x: 0, y: 0 };
  document.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 0.8;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 0.5;
  });

  /* Animate */
  let clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    particles.rotation.y = t * 0.018 + mouse.x * 0.5;
    particles.rotation.x = t * 0.009 + mouse.y * 0.3;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

/* ── Cursor ──────────────────────────────────────────────── */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
  rx += (e.clientX - rx) * 0.15;
  ry += (e.clientY - ry) * 0.15;
  ring.style.left = e.clientX + 'px';
  ring.style.top  = e.clientY + 'px';
});
document.querySelectorAll('a, button, .skill-pill, .project-card, .cert-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '22px'; cursor.style.height = '22px';
    ring.style.width = '52px'; ring.style.height = '52px';
    ring.style.borderColor = 'rgba(245,159,89,0.7)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '12px'; cursor.style.height = '12px';
    ring.style.width = '36px'; ring.style.height = '36px';
    ring.style.borderColor = 'rgba(245,159,89,0.5)';
  });
});

/* ── Nav scroll ──────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── Mobile menu ─────────────────────────────────────────── */
const hamburger   = document.getElementById('hamburgerBtn');
const mobileMenu  = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
hamburger.addEventListener('click',   () => mobileMenu.classList.add('open'));
mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ── Reveal on scroll ────────────────────────────────────── */
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12 });
reveals.forEach(el => revealObs.observe(el));

/* ── Skill bars animate on scroll ───────────────────────── */
const barObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const fills = e.target.querySelectorAll('.skill-bar-fill');
      fills.forEach(fill => {
        fill.style.width = fill.dataset.width + '%';
      });
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.skill-bars').forEach(el => barObs.observe(el));

/* ── Back to top ─────────────────────────────────────────── */
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

/* ── Theme Toggle ─────────────────────────────────────────── */
const themeToggleBtn = document.getElementById('themeToggle');
const root = document.documentElement;

// Light theme particle palette
const lightPalette = [
  new THREE.Color('#447F98'),
  new THREE.Color('#629BB5'),
  new THREE.Color('#B9D8E1'),
  new THREE.Color('#DADEE1'),
  new THREE.Color('#D6EBF3'),
  new THREE.Color('#2E6B85'),
];
// Dark theme particle palette
const darkPalette = [
  new THREE.Color('#1D1A39'),
  new THREE.Color('#451952'),
  new THREE.Color('#662549'),
  new THREE.Color('#AF445A'),
  new THREE.Color('#F59F59'),
  new THREE.Color('#E8BCB9'),
];

// Check saved preference
const savedTheme = localStorage.getItem('palak-theme') || 'dark';
if (savedTheme === 'light') {
  root.setAttribute('data-theme', 'light');
  applyParticlePalette(lightPalette);
}

function applyParticlePalette(palette) {
  if (!window._particleGeometry) return;
  const geo = window._particleGeometry;
  const colAttr = geo.getAttribute('color');
  const count = colAttr.count;
  for (let i = 0; i < count; i++) {
    const c = palette[Math.floor(Math.random() * palette.length)];
    colAttr.setXYZ(i, c.r, c.g, c.b);
  }
  colAttr.needsUpdate = true;
}

themeToggleBtn.addEventListener('click', () => {
  const isLight = root.getAttribute('data-theme') === 'light';
  if (isLight) {
    root.removeAttribute('data-theme');
    localStorage.setItem('palak-theme', 'dark');
    applyParticlePalette(darkPalette);
  } else {
    root.setAttribute('data-theme', 'light');
    localStorage.setItem('palak-theme', 'light');
    applyParticlePalette(lightPalette);
  }
  // Brief spin animation
  themeToggleBtn.style.transform = 'rotate(360deg) scale(1.15)';
  setTimeout(() => { themeToggleBtn.style.transform = 'scale(1)'; }, 450);
});

/* ── Typed tagline ───────────────────────────────────────── */
const taglines = [
  'Building Intelligent Systems',
  'Designing AI Experiences',
  'Engineering the Future',
  'Turning Ideas into Reality',
];
let tIdx = 0, cIdx = 0, deleting = false;
const typed = document.querySelector('.hero-title span');
function typeLoop() {
  const word = taglines[tIdx];
  if (!deleting) {
    typed.textContent = word.slice(0, ++cIdx);
    if (cIdx === word.length) { deleting = true; setTimeout(typeLoop, 2000); return; }
  } else {
    typed.textContent = word.slice(0, --cIdx);
    if (cIdx === 0) { deleting = false; tIdx = (tIdx + 1) % taglines.length; }
  }
  setTimeout(typeLoop, deleting ? 45 : 80);
}
setTimeout(typeLoop, 2000);

/* ── Certificate Modals ───────────────────────────────────── */
function openCertModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCertModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}
// Close on overlay click
document.querySelectorAll('.cert-modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', function(e) {
    if (e.target === this) {
      this.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
});
// Close on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.cert-modal-overlay.open').forEach(m => {
      m.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
});

