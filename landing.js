// ============================================================================
// CHAKRAVYUH AI VIBE CODING CHALLENGE - SMART ENTC LEARNING PLATFORM
// Landing Page Interactions: Hero Circuit, Counters, Nav & Ripples
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Animated Background
  if (window.BackgroundEngine) {
    window.BackgroundEngine.init();
  }

  // 2. Initialize Navigation Scroll Behavior
  initNavbarScroll();

  // 3. Initialize Mobile Navigation Drawer
  initMobileNav();

  // 4. Initialize Sound Effects Toggle
  initSoundToggle();

  // 5. Initialize Hero Interactive Circuit Preview
  initHeroCircuitPreview();

  // 6. Initialize Animated Statistics Counters
  initStatsCounters();

  // 7. Initialize Button Ripple Effects
  initButtonRipples();
});

// Navbar background change on scroll
function initNavbarScroll() {
  const navbar = document.querySelector('.site-navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// Mobile Drawer Toggle
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-nav-toggle-btn');
  const drawer = document.getElementById('mobile-drawer-menu');
  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    drawer.classList.toggle('open');
    if (window.AudioEngine) window.AudioEngine.playClick();
  });

  // Close drawer when link clicked
  drawer.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      if (window.AudioEngine) window.AudioEngine.playClick();
    });
  });
}

// Audio mute toggle button
function initSoundToggle() {
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    if (!window.AudioEngine) return;
    const isMuted = window.AudioEngine.toggleMute();
    soundBtn.classList.toggle('active', !isMuted);
    soundBtn.title = isMuted ? "Sound FX: Muted" : "Sound FX: Enabled";
    soundBtn.innerHTML = isMuted 
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
    
    if (!isMuted) window.AudioEngine.playClick();
  });
}

// Hero Interactive Live Circuit Preview
function initHeroCircuitPreview() {
  const switchBtn = document.getElementById('hero-switch-toggle');
  const wire1 = document.getElementById('hero-wire-1');
  const wire2 = document.getElementById('hero-wire-2');
  const led = document.getElementById('hero-led');
  const statusDmm = document.getElementById('hero-dmm-val');
  const switchLabel = document.getElementById('hero-switch-state-text');

  if (!switchBtn || !led) return;

  let isClosed = true;

  switchBtn.addEventListener('click', () => {
    isClosed = !isClosed;

    if (isClosed) {
      switchBtn.classList.add('active');
      if (wire1) wire1.classList.add('energized');
      if (wire2) wire2.classList.add('energized');
      led.classList.add('glowing');
      led.textContent = '💡';
      if (statusDmm) statusDmm.textContent = '5.00 V @ 18.2 mA';
      if (switchLabel) switchLabel.textContent = 'ON (CLOSED)';
      if (window.AudioEngine) window.AudioEngine.playSwitch();
    } else {
      switchBtn.classList.remove('active');
      if (wire1) wire1.classList.remove('energized');
      if (wire2) wire2.classList.remove('energized');
      led.classList.remove('glowing');
      led.textContent = '⚫';
      if (statusDmm) statusDmm.textContent = '0.00 V / 0.0 mA';
      if (switchLabel) switchLabel.textContent = 'OFF (OPEN)';
      if (window.AudioEngine) window.AudioEngine.playSwitch();
    }
  });
}

// Animated Statistics Numbers
function initStatsCounters() {
  const counters = document.querySelectorAll('.stat-counter-number');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        animateNumber(el, target, suffix, 1600);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(counter => observer.observe(counter));
}

function animateNumber(element, target, suffix, duration) {
  let start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic easing
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(easeOut * target);

    element.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target + suffix;
    }
  }

  requestAnimationFrame(update);
}

// Button Click Ripple Effect
function initButtonRipples() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;

    if (window.AudioEngine) window.AudioEngine.playClick();

    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple-wave';
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
}

