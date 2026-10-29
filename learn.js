// ============================================================================
// CHAKRAVYUH AI VIBE CODING CHALLENGE - SMART ENTC LEARNING PLATFORM
// Learn Module Controller: Topic Cards, Modal Viewer & Interactive Visualizers
// ============================================================================

window.LearnModule = (function () {
  let activeTopic = null;
  const STORAGE_KEY = 'entc_completed_topics_v1';
  const RECENT_STORAGE_KEY = 'entc_recent_topics_v1';

  function init() {
    renderTopicCards();
    bindModalEvents();
  }

  function getCompletedTopics() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function markTopicCompleted(id) {
    const list = getCompletedTopics();
    if (!list.includes(id)) {
      list.push(id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      renderTopicCards();
      if (window.AudioEngine) window.AudioEngine.playSuccess();
    }
  }

  function isTopicCompleted(id) {
    return getCompletedTopics().includes(id);
  }

  function trackTopicVisit(id) {
    let recent = [];
    try {
      const saved = JSON.parse(localStorage.getItem(RECENT_STORAGE_KEY) || '[]');
      if (Array.isArray(saved)) recent = saved;
    } catch (e) {}
    const updated = [id, ...recent.filter(topicId => topicId !== id)].slice(0, 5);
    try {
      localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
    if (window.ProgressBoard && window.ProgressBoard.refresh) window.ProgressBoard.refresh();
  }

  // 1. Render the 8 Topic Cards Grid
  function renderTopicCards() {
    const container = document.getElementById('learn-topics-grid');
    if (!container || !window.ENTC_LEARN_DATA) return;

    container.innerHTML = window.ENTC_LEARN_DATA.map((topic, index) => {
      const completed = isTopicCompleted(topic.id);
      return `
        <div class="topic-card ${completed ? 'completed' : ''}" data-topic-id="${topic.id}" data-index="${index}">
          <div>
            <div class="topic-card-top">
              <div class="topic-icon-wrap" style="border-color: ${topic.accent}44; box-shadow: 0 0 16px ${topic.accent}33;">
                <span>${getTopicIcon(topic.icon)}</span>
              </div>
              <span class="topic-completed-badge">✓ COMPLETED</span>
            </div>
            
            <div class="topic-category-tag" style="color: ${topic.accent}">${topic.category}</div>
            <h3 class="topic-card-title">${topic.title}</h3>
            <p class="topic-card-desc">${topic.summary}</p>
            
            <div class="topic-tags-row">
              ${topic.tags.map(tag => `<span class="topic-tag-chip">${tag}</span>`).join('')}
            </div>
          </div>

          <div class="topic-card-footer">
            <span class="topic-duration">⏱️ ${topic.duration}</span>
            <span class="topic-cta-link" style="color: ${topic.accent}">Explore Module ➔</span>
          </div>
        </div>
      `;
    }).join('');

    // Bind card click handlers
    container.querySelectorAll('.topic-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-topic-id');
        openTopicModal(id);
      });
    });
  }

  function getTopicIcon(iconName) {
    const icons = {
      'cpu': '⚡',
      'git-merge': '🔀',
      'terminal': '📟',
      'activity': '📊',
      'wifi': '📡',
      'radio': '📻',
      'sliders': '🎛️',
      'bar-chart-2': '📈'
    };
    return icons[iconName] || '💡';
  }

  // 2. Open Topic Modal
  function openTopicModal(topicId) {
    const topic = window.ENTC_LEARN_DATA.find(t => t.id === topicId);
    if (!topic) return;

    activeTopic = topic;
    const modal = document.getElementById('learn-modal');
    if (!modal) return;
    trackTopicVisit(topicId);

    // Populate Modal Header
    document.getElementById('modal-topic-category').textContent = topic.category;
    document.getElementById('modal-topic-category').style.color = topic.accent;
    document.getElementById('modal-topic-level').textContent = topic.level;
    document.getElementById('modal-topic-title').textContent = topic.title;

    // Reset Tabs: default to tab 1 (Concepts)
    switchTab('concepts');

    // Populate Tab 1: Concepts & Formulas
    renderConceptsTab(topic);

    // Populate Tab 2: Interactive Visualizer
    renderInteractiveTab(topic);

    // Populate Tab 3: Real-World Applications
    renderRealWorldTab(topic);

    // Populate Tab 4: Mini-Quiz
    renderMiniQuizTab(topic);

    // Update Mark Completed Button
    const completeBtn = document.getElementById('btn-mark-topic-complete');
    if (completeBtn) {
      const completed = isTopicCompleted(topic.id);
      completeBtn.innerHTML = completed ? '✓ Module Completed' : 'Mark Module as Completed';
      completeBtn.className = completed ? 'btn btn-sm btn-emerald' : 'btn btn-sm btn-primary-neon';
      completeBtn.onclick = () => {
        markTopicCompleted(topic.id);
        completeBtn.innerHTML = '✓ Module Completed';
        completeBtn.className = 'btn btn-sm btn-emerald';
      };
    }

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if (window.AudioEngine) window.AudioEngine.playClick();
  }

  function closeTopicModal() {
    const modal = document.getElementById('learn-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
      if (window.AudioEngine) window.AudioEngine.playClick();
    }
  }

  function bindModalEvents() {
    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeTopicModal);

    const modal = document.getElementById('learn-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeTopicModal();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeTopicModal();
    });

    document.querySelectorAll('.modal-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');
        switchTab(tabName);
      });
    });
  }

  function switchTab(tabName) {
    document.querySelectorAll('.modal-tab-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === tabName);
    });

    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.toggle('active', pane.id === `tab-${tabName}`);
    });

    if (window.AudioEngine) window.AudioEngine.playClick();
  }

  // --------------------------------------------------------------------------
  // Tab 1: Theory & Concepts (Simple, Clear & Understandable!)
  // --------------------------------------------------------------------------
  function renderConceptsTab(topic) {
    const container = document.getElementById('tab-concepts');
    if (!container) return;

    container.innerHTML = `
      <div class="overview-text-block">
        <p>${topic.overview}</p>
      </div>

      <h4 class="formulas-heading"><i class="tag-icon">🔑</i> Key Engineering Concepts</h4>
      <div class="concepts-grid">
        ${topic.keyConcepts.map(c => `
          <div class="concept-card">
            <h5 class="concept-title">${c.title}</h5>
            <p class="concept-desc">${c.desc}</p>
          </div>
        `).join('')}
      </div>

      <h4 class="formulas-heading mt-4"><i class="tag-icon">📐</i> Essential Equations & Characteristics</h4>
      <div class="formulas-grid">
        ${topic.formulae.map(f => `
          <div class="formula-card">
            <div class="formula-name">${f.name}</div>
            <div class="formula-math text-cyan font-bold" style="font-size: 1.1rem; margin: 0.3rem 0;">${f.formula}</div>
            ${f.meaning ? `<div class="text-xs text-muted mt-1" style="line-height: 1.4;"><strong class="text-white">What it means:</strong> ${f.meaning}</div>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // Tab 2: Interactive Visualizer & Diagram
  // --------------------------------------------------------------------------
  function renderInteractiveTab(topic) {
    const container = document.getElementById('tab-diagram');
    if (!container) return;

    if (topic.id === 'digital-electronics') {
      renderBinaryConverterVisualizer(container);
    } else if (topic.id === 'logic-gates') {
      renderLogicGateInteractive(container);
    } else if (topic.id === 'arduino') {
      renderArduinoPinInspector(container);
    } else if (topic.id === 'communication-systems') {
      renderWaveModulationVisualizer(container);
    } else if (topic.id === 'iot') {
      renderIotMqttVisualizer(container);
    } else if (topic.id === 'signal-processing') {
      renderFftSpectralVisualizer(container);
    } else if (topic.id === 'sensors') {
      renderSensorCurveVisualizer(container);
    } else {
      renderMcuBusVisualizer(container);
    }
  }

  function renderBinaryConverterVisualizer(container) {
    let bits = [0, 0, 1, 0, 1, 0, 1, 1]; // default 43

    function updateDisplay() {
      let decimal = 0;
      for (let i = 0; i < 8; i++) {
        if (bits[i] === 1) decimal += Math.pow(2, 7 - i);
      }
      const hex = '0x' + decimal.toString(16).toUpperCase().padStart(2, '0');

      container.innerHTML = `
        <div class="interactive-stage-container">
          <h4 class="text-white font-bold text-lg mb-1">Interactive 8-Bit Binary Register</h4>
          <p class="text-xs text-muted mb-4">Click any bit switch to toggle between 0 (0V) and 1 (5V) logic states:</p>

          <div class="binary-bits-row">
            ${bits.map((b, idx) => {
              const weight = Math.pow(2, 7 - idx);
              return `
                <div class="bit-toggle-box">
                  <span class="bit-weight-label font-mono">2^${7-idx}</span>
                  <button class="bit-val-btn ${b === 1 ? 'active' : ''}" data-bit="${idx}">${b}</button>
                  <span class="text-xs text-muted font-mono">${weight}</span>
                </div>
              `;
            }).join('')}
          </div>

          <div class="d-flex align-center gap-3 flex-wrap justify-center mt-3">
            <div class="conversion-readout-pill">
              DECIMAL: <span class="text-white">${decimal}</span>
            </div>
            <div class="conversion-readout-pill" style="border-color: rgba(168, 85, 247, 0.4); color: #c084fc;">
              HEX: <span class="text-white">${hex}</span>
            </div>
          </div>

          <div class="diagram-controls-bar">
            <button class="btn btn-xs btn-outline-glass" id="btn-invert-bits">Invert All Bits (1's Complement)</button>
            <button class="btn btn-xs btn-outline-glass" id="btn-reset-bits">Reset to 0x00</button>
          </div>
        </div>
      `;

      container.querySelectorAll('.bit-val-btn').forEach(btn => {
        btn.onclick = () => {
          const idx = parseInt(btn.getAttribute('data-bit'), 10);
          bits[idx] = bits[idx] === 1 ? 0 : 1;
          if (window.AudioEngine) window.AudioEngine.playClick();
          updateDisplay();
        };
      });

      const invertBtn = container.querySelector('#btn-invert-bits');
      if (invertBtn) {
        invertBtn.onclick = () => {
          bits = bits.map(b => b === 1 ? 0 : 1);
          if (window.AudioEngine) window.AudioEngine.playClick();
          updateDisplay();
        };
      }

      const resetBtn = container.querySelector('#btn-reset-bits');
      if (resetBtn) {
        resetBtn.onclick = () => {
          bits = [0, 0, 0, 0, 0, 0, 0, 0];
          if (window.AudioEngine) window.AudioEngine.playClick();
          updateDisplay();
        };
      }
    }

    updateDisplay();
  }

  function renderLogicGateInteractive(container) {
    let gate = 'NAND';
    let inA = 1, inB = 1;

    function render() {
      let out = 0;
      if (gate === 'NAND') out = !(inA && inB) ? 1 : 0;
      else if (gate === 'NOR') out = !(inA || inB) ? 1 : 0;
      else if (gate === 'XOR') out = (inA !== inB) ? 1 : 0;
      else if (gate === 'XNOR') out = (inA === inB) ? 1 : 0;

      container.innerHTML = `
        <div class="interactive-stage-container">
          <h4 class="text-white font-bold text-lg mb-1">Universal & Advanced Gate Simulator</h4>
          <p class="text-xs text-muted mb-3">Select gate type and toggle input voltages:</p>

          <div class="d-flex gap-2 mb-4">
            ${['NAND', 'NOR', 'XOR', 'XNOR'].map(g => `
              <button class="btn btn-xs ${gate === g ? 'btn-primary-neon' : 'btn-outline-glass'}" data-gate="${g}">${g}</button>
            `).join('')}
          </div>

          <div class="d-flex align-center gap-4 my-2">
            <div class="d-flex flex-col gap-2">
              <button class="btn btn-sm ${inA ? 'btn-cyan' : 'btn-outline-glass'}" id="gate-in-a">Input A: ${inA} (${inA ? '5V' : '0V'})</button>
              <button class="btn btn-sm ${inB ? 'btn-cyan' : 'btn-outline-glass'}" id="gate-in-b">Input B: ${inB} (${inB ? '5V' : '0V'})</button>
            </div>

            <div class="font-mono text-2xl text-muted">➔ [ ${gate} ] ➔</div>

            <div class="conversion-readout-pill ${out ? 'border-cyan' : ''}">
              OUTPUT Y: <strong class="${out ? 'text-cyan' : 'text-gray'}">${out} (${out ? 'HIGH' : 'LOW'})</strong>
            </div>
          </div>

          <div class="mt-4 text-xs text-muted">
            Direct Link: Want a full virtual breadboard? <a href="lab.html">Open Virtual Electronics Lab ⚡</a>
          </div>
        </div>
      `;

      container.querySelectorAll('[data-gate]').forEach(btn => {
        btn.onclick = () => {
          gate = btn.getAttribute('data-gate');
          if (window.AudioEngine) window.AudioEngine.playClick();
          render();
        };
      });

      const btnA = container.querySelector('#gate-in-a');
      const btnB = container.querySelector('#gate-in-b');
      if (btnA) btnA.onclick = () => { inA = inA ? 0 : 1; if (window.AudioEngine) window.AudioEngine.playClick(); render(); };
      if (btnB) btnB.onclick = () => { inB = inB ? 0 : 1; if (window.AudioEngine) window.AudioEngine.playClick(); render(); };
    }

    render();
  }

  function renderArduinoPinInspector(container) {
    const pins = [
      { name: "Pin 13 (SCK / LED)", type: "Digital / SPI Clock / Built-in LED" },
      { name: "Pin 11 (MOSI / PWM)", type: "SPI Master Out / 8-bit Timer PWM" },
      { name: "Pin 9 (~PWM)", type: "16-bit Timer1 PWM Output" },
      { name: "Pin 3 (~PWM / INT1)", type: "Hardware Interrupt 1 / PWM" },
      { name: "Pin 2 (INT0)", type: "External Hardware Interrupt 0" },
      { name: "Pin 0/1 (RX/TX)", type: "Hardware USART Serial" },
      { name: "A0–A5 (ADC Channels)", type: "10-bit Successive Approximation ADC" },
      { name: "A4/A5 (SDA/SCL)", type: "Hardware I2C / TWI Two-Wire Bus" }
    ];

    container.innerHTML = `
      <div class="interactive-stage-container">
        <h4 class="text-white font-bold text-lg mb-1">ATmega328P Pinout & Peripheral Multiplexer</h4>
        <p class="text-xs text-muted mb-3">Hover or click any pin to inspect its hardware capability:</p>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; width: 100%; max-width: 650px;">
          ${pins.map(p => `
            <div class="glass-card p-3" style="cursor: pointer;">
              <div class="font-mono font-bold text-cyan text-sm">${p.name}</div>
              <div class="text-xs text-muted mt-1">${p.type}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderWaveModulationVisualizer(container) {
    container.innerHTML = `
      <div class="interactive-stage-container">
        <h4 class="text-white font-bold text-lg mb-1">AM & FM Carrier Wave Synthesizer</h4>
        <p class="text-xs text-muted mb-3">High-frequency RF carrier modulated by a low-frequency baseband audio signal:</p>

        <svg viewBox="0 0 500 120" style="width: 100%; max-width: 500px; height: 120px; background: rgba(0,0,0,0.3); border-radius: 10px; border: 1px solid rgba(56, 189, 248, 0.2);">
          <path d="M 0 60 Q 25 10, 50 60 T 100 60 T 150 60 T 200 60 T 250 60 T 300 60 T 350 60 T 400 60 T 450 60 T 500 60" fill="none" stroke="#00f2fe" stroke-width="2">
            <animate attributeName="d" dur="3s" repeatCount="indefinite" values="
              M 0 60 Q 25 10, 50 60 T 100 60 T 150 60 T 200 60 T 250 60 T 300 60 T 350 60 T 400 60 T 450 60 T 500 60;
              M 0 60 Q 25 35, 50 60 T 100 60 T 150 60 T 200 60 T 250 60 T 300 60 T 350 60 T 400 60 T 450 60 T 500 60;
              M 0 60 Q 25 10, 50 60 T 100 60 T 150 60 T 200 60 T 250 60 T 300 60 T 350 60 T 400 60 T 450 60 T 500 60;
            " />
          </path>
        </svg>

        <div class="d-flex gap-4 mt-3 text-xs font-mono">
          <span class="text-cyan">Carrier Frequency: 100 MHz (FM Radio)</span>
          <span class="text-purple">Modulation Index: µ = 0.85 (Optimal)</span>
        </div>
      </div>
    `;
  }

  function renderIotMqttVisualizer(container) {
    container.innerHTML = `
      <div class="interactive-stage-container">
        <h4 class="text-white font-bold text-lg mb-1">MQTT 4-Layer Pub/Sub Telemetry Flow</h4>
        <div class="d-flex align-center justify-between flex-wrap gap-2 my-4" style="width: 100%; max-width: 600px;">
          <div class="glass-card text-center p-3 flex-1">
            <div class="text-xl">📡</div>
            <div class="font-bold text-xs mt-1 text-cyan">Publisher</div>
            <div class="text-xs text-muted">ESP32 Temp Node</div>
          </div>
          <div class="text-cyan font-mono">➔ Topic ➔</div>
          <div class="glass-card text-center p-3 flex-1" style="border-color: rgba(168, 85, 247, 0.4);">
            <div class="text-xl">☁️</div>
            <div class="font-bold text-xs mt-1 text-purple">MQTT Broker</div>
            <div class="text-xs text-muted">EMQX / AWS IoT</div>
          </div>
          <div class="text-cyan font-mono">➔ Dispatch ➔</div>
          <div class="glass-card text-center p-3 flex-1">
            <div class="text-xl">📱</div>
            <div class="font-bold text-xs mt-1 text-emerald">Subscriber</div>
            <div class="text-xs text-muted">Grafana App</div>
          </div>
        </div>
      </div>
    `;
  }

  function renderFftSpectralVisualizer(container) {
    container.innerHTML = `
      <div class="interactive-stage-container">
        <h4 class="text-white font-bold text-lg mb-1">Time Domain ➔ Fast Fourier Transform (FFT)</h4>
        <p class="text-xs text-muted mb-3">Decomposing a composite acoustic sound into pure frequency bars:</p>
        <div class="d-flex align-center gap-2 justify-center my-3" style="height: 100px;">
          ${[30, 85, 45, 10, 60, 95, 20, 75, 40, 15, 65, 90].map((h, i) => `
            <div style="width: 18px; height: ${h}%; background: linear-gradient(to top, #38bdf8, #a855f7); border-radius: 4px; box-shadow: 0 0 10px rgba(56, 189, 248, 0.4);"></div>
          `).join('')}
        </div>
        <div class="text-xs text-muted font-mono">Frequencies: 50Hz (Bass), 440Hz (Mid/Voice), 5kHz (Treble)</div>
      </div>
    `;
  }

  function renderSensorCurveVisualizer(container) {
    container.innerHTML = `
      <div class="interactive-stage-container">
        <h4 class="text-white font-bold text-lg mb-1">LM35 Linear Transfer Characteristic</h4>
        <p class="text-xs text-muted mb-3">Every 10 mV = 1°C Temperature:</p>
        <div class="font-mono text-cyan text-sm p-3 bg-dark-glass rounded mb-2">
          -10°C = -100 mV &nbsp;|&nbsp; 0°C = 0 mV &nbsp;|&nbsp; 25°C = 250 mV &nbsp;|&nbsp; 100°C = 1000 mV (1.0V)
        </div>
        <p class="text-xs text-muted">Linear output makes analog reading easy without complex Steinhart-Hart calculations.</p>
      </div>
    `;
  }

  function renderMcuBusVisualizer(container) {
    container.innerHTML = `
      <div class="interactive-stage-container">
        <h4 class="text-white font-bold text-lg mb-1">Harvard Dual-Bus Core Architecture</h4>
        <div class="d-flex gap-3 justify-center my-3" style="width: 100%; max-width: 550px;">
          <div class="glass-card text-center p-3 flex-1">
            <div class="text-lg">📜</div>
            <div class="font-bold text-xs text-cyan">Flash Memory</div>
            <div class="text-xs text-muted">Instruction Bus</div>
          </div>
          <div class="glass-card text-center p-3 flex-1" style="border-color: rgba(0, 242, 254, 0.4);">
            <div class="text-lg">⚙️</div>
            <div class="font-bold text-xs text-white">CPU Core & ALU</div>
            <div class="text-xs text-muted">Simultaneous Fetch</div>
          </div>
          <div class="glass-card text-center p-3 flex-1">
            <div class="text-lg">💾</div>
            <div class="font-bold text-xs text-purple">SRAM & Heap</div>
            <div class="text-xs text-muted">Data Bus</div>
          </div>
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // Tab 3: Real World Applications
  // --------------------------------------------------------------------------
  function renderRealWorldTab(topic) {
    const container = document.getElementById('tab-realworld');
    if (!container) return;

    container.innerHTML = `
      <div class="realworld-apps-grid">
        ${topic.realWorldApps.map(app => `
          <div class="rw-app-card">
            <div class="rw-app-icon">🚀</div>
            <div>
              <h5 class="rw-app-name">${app.name}</h5>
              <p class="rw-app-desc">${app.desc}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // Tab 4: Interactive Short Mini-Quiz
  // --------------------------------------------------------------------------
  function renderMiniQuizTab(topic) {
    const container = document.getElementById('tab-quiz');
    if (!container) return;

    let answeredCount = 0;
    let correctCount = 0;

    container.innerHTML = `
      <div class="mini-quiz-wrap">
        ${topic.quiz.map((q, qIndex) => `
          <div class="quiz-question-card" id="quiz-card-${qIndex}">
            <div class="quiz-q-header">Question ${qIndex + 1} of ${topic.quiz.length}</div>
            <div class="quiz-q-title">${q.q}</div>
            
            <div class="quiz-options-list">
              ${q.options.map((opt, optIndex) => `
                <button class="quiz-opt-btn" data-qid="${qIndex}" data-opt="${optIndex}">
                  <span class="font-mono text-cyan font-bold">${String.fromCharCode(65 + optIndex)}.</span>
                  <span>${opt}</span>
                </button>
              `).join('')}
            </div>

            <div class="quiz-feedback-box hidden" id="quiz-fb-${qIndex}">
              <strong>💡 Explanation:</strong> ${q.explanation}
            </div>
          </div>
        `).join('')}

        <div class="quiz-score-banner hidden" id="module-quiz-score-banner" style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 12px; padding: 1.25rem; text-align: center;">
          <h4 class="text-white font-bold" id="quiz-result-score-text">Quiz Score: 3 / 3 (100%)</h4>
          <p class="text-xs text-muted mt-1">Excellent understanding of this topic! Progress has been registered.</p>
        </div>
      </div>
    `;

    container.querySelectorAll('.quiz-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const qId = parseInt(btn.getAttribute('data-qid'), 10);
        const optId = parseInt(btn.getAttribute('data-opt'), 10);
        const question = topic.quiz[qId];

        const card = document.getElementById(`quiz-card-${qId}`);
        card.querySelectorAll('.quiz-opt-btn').forEach(b => b.disabled = true);

        const isCorrect = optId === question.answer;
        if (isCorrect) {
          btn.classList.add('correct');
          correctCount++;
          if (window.AudioEngine) window.AudioEngine.playSuccess();
        } else {
          btn.classList.add('incorrect');
          card.querySelectorAll('.quiz-opt-btn')[question.answer].classList.add('correct');
          if (window.AudioEngine) window.AudioEngine.playBuzzer();
        }

        const fb = document.getElementById(`quiz-fb-${qId}`);
        if (fb) fb.classList.remove('hidden');

        answeredCount++;

        if (answeredCount === topic.quiz.length) {
          const scoreBanner = document.getElementById('module-quiz-score-banner');
          const scoreText = document.getElementById('quiz-result-score-text');
          if (scoreBanner && scoreText) {
            scoreBanner.classList.remove('hidden');
            scoreText.textContent = `Module Mastery Score: ${correctCount} / ${topic.quiz.length} (${Math.round((correctCount / topic.quiz.length) * 100)}%)`;
            if (correctCount >= 2) {
              markTopicCompleted(topic.id);
            }
          }
        }
      });
    });
  }

  return {
    init: init,
    openModal: openTopicModal,
    closeModal: closeTopicModal
  };
})();
