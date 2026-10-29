// ============================================================================
// CHAKRAVYUH AI VIBE CODING CHALLENGE - SMART ENTC LEARNING PLATFORM
// Futuristic Animated Background: Circuit Traces & AI Particle Grid Engine
// ============================================================================

window.BackgroundEngine = (function () {
  let canvas, ctx;
  let width, height;
  let particles = [];
  let nodes = [];
  let traces = [];
  let pulses = [];
  let mouse = { x: -1000, y: -1000, radius: 120 };
  let animId = null;
  let isRunning = true;

  const CONFIG = {
    particleCount: 50,
    nodeCount: 28,
    pulseSpeed: 1.8,
    colors: {
      trace: 'rgba(56, 189, 248, 0.08)',
      traceActive: 'rgba(56, 189, 248, 0.35)',
      node: 'rgba(0, 242, 254, 0.4)',
      nodeGlow: 'rgba(0, 242, 254, 0.2)',
      nodePurple: 'rgba(168, 85, 247, 0.45)',
      particle: 'rgba(129, 140, 248, 0.35)',
      pulse: '#00f2fe'
    }
  };

  function init() {
    canvas = document.getElementById('circuit-bg-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    resize();
    createNetwork();
    bindEvents();
    loop();
  }

  function resize() {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createNetwork() {
    nodes = [];
    traces = [];
    particles = [];
    pulses = [];

    // Create circuit nodes aligned roughly to a flexible grid
    const cols = Math.floor(width / 160) + 1;
    const rows = Math.floor(height / 160) + 1;

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        // Jitter grid points to look like PCB component vias
        const jitterX = (Math.random() - 0.5) * 60;
        const jitterY = (Math.random() - 0.5) * 60;
        const x = c * 160 + 80 + jitterX;
        const y = r * 160 + 80 + jitterY;

        nodes.push({
          x: x,
          y: y,
          size: Math.random() > 0.8 ? 4 : 2.5,
          color: Math.random() > 0.4 ? CONFIG.colors.node : CONFIG.colors.nodePurple,
          pulseAngle: Math.random() * Math.PI * 2,
          neighbors: []
        });
      }
    }

    // Connect adjacent nodes with orthogonal (PCB style 90° or 45°) circuit traces
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const dist = Math.hypot(dx, dy);

        if (dist < 220 && Math.random() > 0.4) {
          nodes[i].neighbors.push(j);
          // Midpoint dog-leg for realistic PCB trace bends
          const midX = nodes[i].x + dx * 0.5;
          const midY = nodes[i].y;

          traces.push({
            p1: nodes[i],
            p2: { x: midX, y: midY },
            p3: nodes[j],
            dist: dist
          });

          // Seed random data pulses along traces
          if (Math.random() > 0.65) {
            pulses.push({
              traceIndex: traces.length - 1,
              progress: Math.random(),
              speed: (0.003 + Math.random() * 0.004)
            });
          }
        }
      }
    }

    // Floating ambient AI quantum particles
    for (let i = 0; i < CONFIG.particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2
      });
    }
  }

  function bindEvents() {
    window.addEventListener('resize', () => {
      resize();
      createNetwork();
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    // Pause when document hidden to conserve battery
    document.addEventListener('visibilitychange', () => {
      isRunning = !document.hidden;
      if (isRunning) loop();
    });
  }

  function loop() {
    if (!isRunning) return;
    draw();
    animId = requestAnimationFrame(loop);
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw PCB traces
    for (let i = 0; i < traces.length; i++) {
      const t = traces[i];
      // Check proximity to mouse
      const mouseDist = Math.hypot((t.p1.x + t.p3.x) / 2 - mouse.x, (t.p1.y + t.p3.y) / 2 - mouse.y);
      const isNearMouse = mouseDist < mouse.radius;

      ctx.beginPath();
      ctx.moveTo(t.p1.x, t.p1.y);
      ctx.lineTo(t.p2.x, t.p2.y);
      ctx.lineTo(t.p3.x, t.p3.y);
      ctx.strokeStyle = isNearMouse ? CONFIG.colors.traceActive : CONFIG.colors.trace;
      ctx.lineWidth = isNearMouse ? 1.6 : 1.0;
      ctx.stroke();
    }

    // 2. Draw Traveling Data Pulses (current flow)
    for (let i = 0; i < pulses.length; i++) {
      const p = pulses[i];
      p.progress += p.speed;
      if (p.progress > 1) p.progress = 0;

      const t = traces[p.traceIndex];
      if (!t) continue;

      let px, py;
      if (p.progress < 0.5) {
        // First segment (p1 to p2)
        const sub = p.progress * 2;
        px = t.p1.x + (t.p2.x - t.p1.x) * sub;
        py = t.p1.y + (t.p2.y - t.p1.y) * sub;
      } else {
        // Second segment (p2 to p3)
        const sub = (p.progress - 0.5) * 2;
        px = t.p2.x + (t.p3.x - t.p2.x) * sub;
        py = t.p2.y + (t.p3.y - t.p2.y) * sub;
      }

      ctx.beginPath();
      ctx.arc(px, py, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = CONFIG.colors.pulse;
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // 3. Draw Via Nodes
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.pulseAngle += 0.03;
      const pulseSize = n.size + Math.sin(n.pulseAngle) * 0.8;

      // Glow halo
      ctx.beginPath();
      ctx.arc(n.x, n.y, pulseSize * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = CONFIG.colors.nodeGlow;
      ctx.fill();

      // Core pad
      ctx.beginPath();
      ctx.arc(n.x, n.y, pulseSize, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.fill();
    }

    // 4. Draw Floating AI Quantum Particles
    for (let i = 0; i < particles.length; i++) {
      const pt = particles[i];
      pt.x += pt.vx;
      pt.y += pt.vy;

      if (pt.x < 0) pt.x = width;
      if (pt.x > width) pt.x = 0;
      if (pt.y < 0) pt.y = height;
      if (pt.y > height) pt.y = 0;

      // Subtle mouse repulsion
      const mdx = pt.x - mouse.x;
      const mdy = pt.y - mouse.y;
      const mDist = Math.hypot(mdx, mdy);
      if (mDist < 100) {
        pt.x += (mdx / mDist) * 2;
        pt.y += (mdy / mDist) * 2;
      }

      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(129, 140, 248, ${pt.alpha})`;
      ctx.fill();
    }
  }

  return {
    init: init
  };
})();

