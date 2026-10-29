// ============================================================================
// CHAKRAVYUH AI VIBE CODING CHALLENGE - SMART ENTC LEARNING PLATFORM
// Virtual Electronics Lab Controller: CircuitVerse AI Dual-Panel Workbench
// ============================================================================

window.VirtualLab = (function () {
  const STORAGE_KEY = 'entc_completed_labs_v1';

  // Global state for experiments
  const state = {
    selectedExperiment: 'AND', // 'AND', 'OR', 'NOT', 'XOR', 'NAND', 'NOR', 'led', 'lm35', 'ldr', 'pir'
    activeSubTab: 'circuit',   // 'circuit', 'truth-table', 'explain'

    // Logic Gates
    gates: {
      inA: 1,
      inB: 1
    },

    // LED Circuit
    led: {
      power: true,
      voltage: 5.0,
      resistance: 220,
      color: 'cyan',
      isBlown: false
    },

    // LM35 Sensor
    lm35: {
      temp: 35,
      threshold: 45
    },

    // LDR Sensor
    ldr: {
      lux: 150,
      threshold: 250
    },

    // PIR Sensor
    pir: {
      motionActive: false,
      delaySec: 5,
      remainingTime: 0,
      timerId: null
    }
  };

  const TIPS = {
    'AND': 'Tip: AND gate outputs HIGH only when both Input A and Input B are simultaneously 1.',
    'OR': 'Tip: In OR gate logic, any single input being HIGH turns the output HIGH.',
    'NOT': 'Tip: NOT is a single-input inverter. Notice Input B is disabled in this mode.',
    'XOR': 'Tip: try XOR with both inputs HIGH, then switch one input LOW to see parity change.',
    'NAND': 'Tip: NAND is a Universal Gate — its output is the exact inverted complement of AND.',
    'NOR': 'Tip: NOR outputs 1 only when BOTH inputs are 0.',
    'led': 'Tip: Decrease resistor below 47Ω at 12V to observe LED over-current protection trip!',
    'lm35': 'Tip: Drag temperature above the 45°C comparator threshold to trip the cooling fan.',
    'ldr': 'Tip: Lower ambient light below 200 Lux (dusk) to trigger the autonomous streetlamp.',
    'pir': 'Tip: Click Simulate Motion to trigger the dual pyroelectric elements and sound the alarm.'
  };

  const GATE_SYMBOLS = {
    'AND': '&',
    'OR': '≥1',
    'NOT': '1',
    'XOR': '=1',
    'NAND': '&',
    'NOR': '≥1'
  };

  function init() {
    const requestedExperiment = new URLSearchParams(window.location.search).get('experiment');
    const availableExperiments = ['AND', 'OR', 'NOT', 'XOR', 'NAND', 'NOR', 'led', 'lm35', 'ldr', 'pir'];
    if (availableExperiments.includes(requestedExperiment)) {
      state.selectedExperiment = requestedExperiment;
    }
    renderWorkbench();
    bindGlobalEvents();
  }

  function getCompletedLabs() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function markLabCompleted(expId) {
    const list = getCompletedLabs();
    if (!list.includes(expId)) {
      list.push(expId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      if (window.AudioEngine) window.AudioEngine.playSuccess();
      renderWorkbench();
    }
  }

  function isLabCompleted(expId) {
    return getCompletedLabs().includes(expId);
  }

  function switchExperiment(expId) {
    state.selectedExperiment = expId;
    renderWorkbench();
    if (window.AudioEngine) window.AudioEngine.playClick();
  }

  function switchSubTab(tabName) {
    state.activeSubTab = tabName;
    renderWorkbench();
    if (window.AudioEngine) window.AudioEngine.playClick();
  }

  // --------------------------------------------------------------------------
  // MAIN RENDER WORKBENCH
  // --------------------------------------------------------------------------
  function renderWorkbench() {
    const leftPanel = document.getElementById('lab-canvas-container');
    const rightPanel = document.getElementById('lab-controls-container');

    // Update active pill in top selector if present
    document.querySelectorAll('.lab-exp-pill').forEach(pill => {
      pill.classList.toggle('active', pill.getAttribute('data-lab') === state.selectedExperiment);
    });

    if (!leftPanel || !rightPanel) return;

    // Check if it's a logic gate or a sensor/circuit
    const isGate = ['AND', 'OR', 'NOT', 'XOR', 'NAND', 'NOR'].includes(state.selectedExperiment);

    if (isGate) {
      renderLogicGateLeft(leftPanel);
      renderLogicGateRight(rightPanel);
    } else if (state.selectedExperiment === 'led') {
      renderLedExperiment(leftPanel, rightPanel);
    } else if (state.selectedExperiment === 'lm35') {
      renderLm35Experiment(leftPanel, rightPanel);
    } else if (state.selectedExperiment === 'ldr') {
      renderLdrExperiment(leftPanel, rightPanel);
    } else if (state.selectedExperiment === 'pir') {
      renderPirExperiment(leftPanel, rightPanel);
    }
  }

  // --------------------------------------------------------------------------
  // 1. LOGIC GATES (AND, OR, NOT, XOR, NAND, NOR) - Matches Reference Image Exactly!
  // --------------------------------------------------------------------------
  function calculateGateOutput() {
    const { inA, inB } = state.gates;
    const exp = state.selectedExperiment;

    if (exp === 'AND') return (inA && inB) ? 1 : 0;
    if (exp === 'OR') return (inA || inB) ? 1 : 0;
    if (exp === 'NOT') return inA ? 0 : 1;
    if (exp === 'XOR') return (inA !== inB) ? 1 : 0;
    if (exp === 'NAND') return !(inA && inB) ? 1 : 0;
    if (exp === 'NOR') return !(inA || inB) ? 1 : 0;
    return 0;
  }

  function renderLogicGateLeft(container) {
    const exp = state.selectedExperiment;
    const isNot = exp === 'NOT';
    const isCompleted = isLabCompleted(exp);

    container.innerHTML = `
      <div class="cv-panel-left">
        <div>
          <div class="cv-panel-tag">LAB CONTROLS</div>
          <h3 class="cv-panel-heading">Configure your experiment</h3>

          <div class="cv-controls-body">
            <!-- Dropdown Selector -->
            <div class="cv-field-group">
              <label class="cv-field-label">Logic gate</label>
              <select class="cv-select-box" id="cv-gate-select">
                <option value="AND" ${exp === 'AND' ? 'selected' : ''}>AND</option>
                <option value="OR" ${exp === 'OR' ? 'selected' : ''}>OR</option>
                <option value="NOT" ${exp === 'NOT' ? 'selected' : ''}>NOT</option>
                <option value="XOR" ${exp === 'XOR' ? 'selected' : ''}>XOR</option>
                <option value="NAND" ${exp === 'NAND' ? 'selected' : ''}>NAND (Universal)</option>
                <option value="NOR" ${exp === 'NOR' ? 'selected' : ''}>NOR (Universal)</option>
              </select>
            </div>

            <!-- Input A Toggle -->
            <div class="cv-toggle-row">
              <div class="cv-toggle-info">
                <span>Input A</span>
                <span class="${state.gates.inA ? 'cv-toggle-val-high' : 'cv-toggle-val-low'}">
                  ${state.gates.inA} · ${state.gates.inA ? 'HIGH' : 'LOW'}
                </span>
              </div>
              <label class="cv-switch">
                <input type="checkbox" id="cv-toggle-a" ${state.gates.inA ? 'checked' : ''}>
                <span class="cv-slider-track"></span>
              </label>
            </div>

            <!-- Input B Toggle (Disabled for NOT gate) -->
            ${!isNot ? `
              <div class="cv-toggle-row">
                <div class="cv-toggle-info">
                  <span>Input B</span>
                  <span class="${state.gates.inB ? 'cv-toggle-val-high' : 'cv-toggle-val-low'}">
                    ${state.gates.inB} · ${state.gates.inB ? 'HIGH' : 'LOW'}
                  </span>
                </div>
                <label class="cv-switch">
                  <input type="checkbox" id="cv-toggle-b" ${state.gates.inB ? 'checked' : ''}>
                  <span class="cv-slider-track"></span>
                </label>
              </div>
            ` : `
              <div class="cv-toggle-row" style="opacity: 0.45;">
                <div class="cv-toggle-info">
                  <span>Input B (Not applicable for inverter)</span>
                </div>
              </div>
            `}

            <!-- Helpful tip -->
            <p class="cv-tip-text">${TIPS[exp] || TIPS.AND}</p>
          </div>
        </div>

        <!-- Complete Button -->
        <button class="cv-complete-btn ${isCompleted ? 'completed' : ''}" id="cv-btn-complete">
          ${isCompleted ? '✓ Lab Experiment Completed' : '✓ Complete lab experiment'}
        </button>
      </div>
    `;

    // Bind event handlers
    const select = container.querySelector('#cv-gate-select');
    if (select) {
      select.onchange = (e) => switchExperiment(e.target.value);
    }

    const toggleA = container.querySelector('#cv-toggle-a');
    if (toggleA) {
      toggleA.onchange = (e) => {
        state.gates.inA = e.target.checked ? 1 : 0;
        if (window.AudioEngine) window.AudioEngine.playSwitch();
        renderWorkbench();
      };
    }

    const toggleB = container.querySelector('#cv-toggle-b');
    if (toggleB) {
      toggleB.onchange = (e) => {
        state.gates.inB = e.target.checked ? 1 : 0;
        if (window.AudioEngine) window.AudioEngine.playSwitch();
        renderWorkbench();
      };
    }

    const completeBtn = container.querySelector('#cv-btn-complete');
    if (completeBtn) {
      completeBtn.onclick = () => {
        markLabCompleted(exp);
      };
    }
  }

  function renderLogicGateRight(container) {
    const exp = state.selectedExperiment;
    const isNot = exp === 'NOT';
    const output = calculateGateOutput();
    const symbol = GATE_SYMBOLS[exp] || '&';

    let subviewHtml = '';

    if (state.activeSubTab === 'circuit') {
      subviewHtml = `
        <div class="cv-stage-box">
          <span class="cv-stage-tag">LIVE CIRCUIT SIMULATION</span>

          <div class="cv-schematic-row">
            <!-- Left Input Wires -->
            <div class="cv-wires-col-left">
              <div class="cv-wire-branch">
                <span class="text-xs text-muted font-mono">A</span>
                <span class="cv-bit-indicator font-mono ${state.gates.inA ? 'text-cyan' : 'text-gray'}">${state.gates.inA}</span>
                <div class="cv-wire-line ${state.gates.inA ? 'energized' : 'low'}"></div>
              </div>

              ${!isNot ? `
                <div class="cv-wire-branch">
                  <span class="text-xs text-muted font-mono">B</span>
                  <span class="cv-bit-indicator font-mono ${state.gates.inB ? 'text-cyan' : 'text-gray'}">${state.gates.inB}</span>
                  <div class="cv-wire-line ${state.gates.inB ? 'energized' : 'low'}"></div>
                </div>
              ` : ''}
            </div>

            <!-- Central Gate Symbol -->
            <div class="cv-center-symbol">
              <span>${symbol}</span>
            </div>

            <!-- Right Output Wire -->
            <div class="cv-wires-col-right">
              <div class="cv-wire-line ${output ? 'energized' : 'low'}"></div>
              <span class="text-xs text-muted font-mono">OUT</span>
              <span class="cv-bit-indicator font-mono ${output ? 'text-cyan' : 'text-gray'}">${output}</span>
            </div>
          </div>

          <!-- Big Capsule Output Badge -->
          <div class="cv-output-pill ${output ? 'cv-out-high' : 'cv-out-low'}">
            OUTPUT · ${output ? 'HIGH (1)' : 'LOW (0)'}
          </div>

          <div class="cv-footer-disclaimer">
            Educational logic model · not a physical circuit
          </div>
        </div>
      `;
    } else if (state.activeSubTab === 'truth-table') {
      // Truth table view
      let rows = [];
      if (isNot) {
        rows = [
          { a: 0, out: 1 },
          { a: 1, out: 0 }
        ];
      } else {
        rows = [
          { a: 0, b: 0, out: getGateLogicOutput(exp, 0, 0) },
          { a: 0, b: 1, out: getGateLogicOutput(exp, 0, 1) },
          { a: 1, b: 0, out: getGateLogicOutput(exp, 1, 0) },
          { a: 1, b: 1, out: getGateLogicOutput(exp, 1, 1) }
        ];
      }

      subviewHtml = `
        <div class="cv-stage-box" style="align-items: stretch; justify-content: flex-start;">
          <span class="cv-stage-tag">${exp} GATE · ALL INPUT COMBINATIONS</span>
          <div class="truth-table-current mt-4">
            <strong>Current inputs:</strong>
            A = ${state.gates.inA}${!isNot ? `, B = ${state.gates.inB}` : ''}
            <span class="truth-table-result">Output Y = ${output} (${output ? 'HIGH' : 'LOW'})</span>
          </div>
          <p class="truth-table-help">Each row shows the output for one possible input combination. The highlighted row matches the inputs currently selected in the lab.</p>
          <div class="truth-table-scroll">
          <table class="truth-table" aria-label="${exp} gate truth table">
            <thead>
              <tr>
                <th scope="col">Input A</th>
                ${!isNot ? '<th scope="col">Input B</th>' : ''}
                <th scope="col">Output Y</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map(r => {
                const isCurrent = isNot
                  ? (r.a === state.gates.inA)
                  : (r.a === state.gates.inA && r.b === state.gates.inB);
                return `
                  <tr class="${isCurrent ? 'row-active' : ''}">
                    <td><span class="tt-badge ${r.a ? 'tt-1' : 'tt-0'}">${r.a}</span></td>
                    ${!isNot ? `<td><span class="tt-badge ${r.b ? 'tt-1' : 'tt-0'}">${r.b}</span></td>` : ''}
                    <td><span class="tt-badge ${r.out ? 'tt-out-1' : 'tt-out-0'}">${r.out}</span></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          </div>
          <p class="truth-table-legend"><span aria-hidden="true">●</span> Highlighted row = current input combination</p>
        </div>
      `;
    } else if (state.activeSubTab === 'explain') {
      subviewHtml = `
        <div class="cv-stage-box" style="align-items: flex-start; justify-content: flex-start;">
          <span class="cv-stage-tag">EXPLAIN OUTPUT: ${exp} LOGIC</span>
          <div class="cv-subview-container mt-4">
            <div class="cv-explain-card">
              <div class="cv-explain-title">Current State Analysis:</div>
              <div class="cv-explain-body">
                Input A is set to <strong>${state.gates.inA} (${state.gates.inA ? '5V HIGH' : '0V LOW'})</strong>.
                ${!isNot ? `Input B is set to <strong>${state.gates.inB} (${state.gates.inB ? '5V HIGH' : '0V LOW'})</strong>.` : ''}
                According to the ${exp} Boolean equation <code>${getBooleanFormula(exp)}</code>, the output evaluates to <strong class="${output ? 'text-emerald' : 'text-gray'}">LOGIC ${output}</strong>.
              </div>
            </div>

            <div class="cv-explain-card">
              <div class="cv-explain-title">Semiconductor Physics (CMOS):</div>
              <div class="cv-explain-body">
                ${getCmosExplanation(exp, output)}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="cv-panel-right">
        <!-- Sub-nav Tabs -->
        <div class="cv-tabs-bar">
          <button class="cv-subtab-btn ${state.activeSubTab === 'circuit' ? 'active' : ''}" data-subtab="circuit">Circuit view</button>
          <button class="cv-subtab-btn ${state.activeSubTab === 'truth-table' ? 'active' : ''}" data-subtab="truth-table">Truth table</button>
          <button class="cv-subtab-btn ${state.activeSubTab === 'explain' ? 'active' : ''}" data-subtab="explain">Explain output</button>
        </div>

        <!-- Rendered Subview -->
        ${subviewHtml}
      </div>
    `;

    // Bind subtab clicks
    container.querySelectorAll('.cv-subtab-btn').forEach(btn => {
      btn.onclick = () => switchSubTab(btn.getAttribute('data-subtab'));
    });
  }

  function getGateLogicOutput(gate, a, b) {
    if (gate === 'AND') return (a && b) ? 1 : 0;
    if (gate === 'OR') return (a || b) ? 1 : 0;
    if (gate === 'XOR') return (a !== b) ? 1 : 0;
    if (gate === 'NAND') return !(a && b) ? 1 : 0;
    if (gate === 'NOR') return !(a || b) ? 1 : 0;
    return 0;
  }

  function getBooleanFormula(gate) {
    if (gate === 'AND') return 'Y = A · B';
    if (gate === 'OR') return 'Y = A + B';
    if (gate === 'NOT') return "Y = A'";
    if (gate === 'XOR') return "Y = A ⊕ B = A'B + AB'";
    if (gate === 'NAND') return "Y = (A · B)'";
    if (gate === 'NOR') return "Y = (A + B)'";
    return '';
  }

  function getCmosExplanation(gate, out) {
    if (gate === 'AND') {
      return out
        ? "Both series NMOS pull-down transistors conduct, and the integrated inverter flips the intermediate NAND voltage to 5V (VDD)."
        : "At least one series NMOS transistor is cut off, keeping the output pulled down to 0V.";
    }
    if (gate === 'OR') {
      return out
        ? "At least one parallel NMOS transistor is conducting to form a low-impedance path to VDD via the internal CMOS inverter."
        : "Both parallel branches are off, keeping the output clamped to Ground (0V).";
    }
    if (gate === 'NOT') {
      return out
        ? "PMOS pull-up transistor is fully saturated (conducting), charging the output node directly to +5V VDD."
        : "NMOS pull-down transistor is turned ON by the 5V gate charge, draining the output node directly to 0V Ground.";
    }
    return "XOR uses a transmission gate architecture to check for unequal bit potential between lines.";
  }

  // --------------------------------------------------------------------------
  // 2. LED CIRCUIT EXPERIMENT (Adapted to Dual Panel)
  // --------------------------------------------------------------------------
  function renderLedExperiment(leftPanel, rightPanel) {
    const s = state.led;
    const vf = 3.0; // Cyan forward drop
    let currentMa = 0;
    if (s.power && s.voltage > vf) {
      currentMa = Math.round(((s.voltage - vf) / s.resistance) * 1000 * 10) / 10;
      s.isBlown = currentMa > 40;
    } else {
      s.isBlown = false;
    }

    leftPanel.innerHTML = `
      <div class="cv-panel-left">
        <div>
          <div class="cv-panel-tag">LAB CONTROLS</div>
          <h3 class="cv-panel-heading">LED Circuit & Ohm's Law</h3>

          <div class="cv-controls-body">
            <div class="cv-field-group">
              <label class="cv-field-label">Active Experiment</label>
              <select class="cv-select-box" id="cv-exp-select">
                <option value="AND">Logic Gates (AND/OR/NOT/XOR)</option>
                <option value="led" selected>LED Circuit & Ohm's Law</option>
                <option value="lm35">Temperature Sensor (LM35)</option>
                <option value="ldr">LDR Dusk-to-Dawn Light</option>
                <option value="pir">PIR Motion Detector</option>
              </select>
            </div>

            <div class="cv-toggle-row">
              <div class="cv-toggle-info">
                <span>DC Power Rail:</span>
                <span class="${s.power ? 'cv-toggle-val-high' : 'cv-toggle-val-low'}">${s.power ? 'ACTIVE (ON)' : 'DISCONNECTED'}</span>
              </div>
              <label class="cv-switch">
                <input type="checkbox" id="cv-led-power" ${s.power ? 'checked' : ''}>
                <span class="cv-slider-track"></span>
              </label>
            </div>

            <div class="cv-field-group">
              <label class="cv-field-label d-flex justify-between">
                <span>DC Voltage:</span>
                <span class="text-cyan font-mono">${s.voltage.toFixed(1)} V</span>
              </label>
              <input type="range" class="form-range" id="cv-slider-v" min="0" max="12" step="0.2" value="${s.voltage}" ${s.isBlown ? 'disabled' : ''}>
            </div>

            <div class="cv-field-group">
              <label class="cv-field-label">Current Limiting Resistor</label>
              <div class="resistor-btn-group">
                ${[47, 100, 220, 330, 470, 1000].map(r => `
                  <button class="res-preset-btn ${s.resistance === r ? 'active' : ''}" data-r="${r}">${r}Ω</button>
                `).join('')}
              </div>
            </div>

            <p class="cv-tip-text">Ohm's Law: I = (Vin - Vf) / R. Keep current below 30mA for optimal diode longevity.</p>
          </div>
        </div>

        <button class="cv-complete-btn" id="cv-btn-complete">✓ Complete lab experiment</button>
      </div>
    `;

    rightPanel.innerHTML = `
      <div class="cv-panel-right">
        <div class="cv-tabs-bar">
          <button class="cv-subtab-btn active">Live Workbench</button>
        </div>

        <div class="cv-stage-box">
          <span class="cv-stage-tag">CIRCUIT READOUT: ${s.power ? (s.voltage > vf ? vf.toFixed(2) + 'V @ ' + currentMa + 'mA' : s.voltage.toFixed(2) + 'V (Cutoff)') : '0V / 0mA'}</span>

          <div style="font-size: 5rem; margin: 2rem 0; filter: drop-shadow(0 0 ${s.power && currentMa > 0 && !s.isBlown ? '35px #00f2fe' : '0px transparent'});">
            ${s.isBlown ? '💥' : (s.power && currentMa > 0 ? '💡' : '⚫')}
          </div>

          <div class="cv-output-pill ${s.isBlown ? 'cv-out-low text-red' : (s.power && currentMa > 0 ? 'cv-out-high' : 'cv-out-low')}">
            ${s.isBlown ? 'DIODE BLOWN (>40mA)' : (s.power && currentMa > 0 ? `CONDUCTING (${currentMa} mA)` : 'DIODE OFF')}
          </div>

          ${s.isBlown ? '<button class="btn btn-xs btn-outline-glass mt-3" id="cv-btn-reset-led">Replace LED Diode</button>' : ''}
        </div>
      </div>
    `;

    // Bind LED controls
    leftPanel.querySelector('#cv-exp-select').onchange = (e) => switchExperiment(e.target.value);
    leftPanel.querySelector('#cv-led-power').onchange = (e) => {
      s.power = e.target.checked;
      if (window.AudioEngine) window.AudioEngine.playSwitch();
      renderWorkbench();
    };
    leftPanel.querySelector('#cv-slider-v').oninput = (e) => {
      s.voltage = parseFloat(e.target.value);
      renderWorkbench();
    };
    leftPanel.querySelectorAll('.res-preset-btn').forEach(b => {
      b.onclick = () => {
        s.resistance = parseInt(b.getAttribute('data-r'), 10);
        if (window.AudioEngine) window.AudioEngine.playClick();
        renderWorkbench();
      };
    });
    leftPanel.querySelector('#cv-btn-complete').onclick = () => markLabCompleted('led');

    const resetBtn = rightPanel.querySelector('#cv-btn-reset-led');
    if (resetBtn) {
      resetBtn.onclick = () => {
        s.isBlown = false;
        s.voltage = 5.0;
        s.resistance = 220;
        if (window.AudioEngine) window.AudioEngine.playSuccess();
        renderWorkbench();
      };
    }
  }

  // --------------------------------------------------------------------------
  // 3. LM35 TEMP SENSOR EXPERIMENT
  // --------------------------------------------------------------------------
  function renderLm35Experiment(leftPanel, rightPanel) {
    const s = state.lm35;
    const vMv = s.temp * 10;
    const fanOn = s.temp >= s.threshold;

    leftPanel.innerHTML = `
      <div class="cv-panel-left">
        <div>
          <div class="cv-panel-tag">LAB CONTROLS</div>
          <h3 class="cv-panel-heading">LM35 Temperature Sensor</h3>

          <div class="cv-controls-body">
            <div class="cv-field-group">
              <label class="cv-field-label">Active Experiment</label>
              <select class="cv-select-box" id="cv-exp-select">
                <option value="AND">Logic Gates (AND/OR/NOT/XOR)</option>
                <option value="led">LED Circuit & Ohm's Law</option>
                <option value="lm35" selected>Temperature Sensor (LM35)</option>
                <option value="ldr">LDR Dusk-to-Dawn Light</option>
                <option value="pir">PIR Motion Detector</option>
              </select>
            </div>

            <div class="cv-field-group">
              <label class="cv-field-label d-flex justify-between">
                <span>Chamber Temperature:</span>
                <span class="text-cyan font-mono">${s.temp} °C</span>
              </label>
              <input type="range" class="form-range" id="cv-slider-temp" min="-10" max="100" value="${s.temp}">
            </div>

            <div class="cv-field-group">
              <label class="cv-field-label d-flex justify-between">
                <span>Cooling Fan Threshold:</span>
                <span class="text-purple font-mono">${s.threshold} °C</span>
              </label>
              <input type="range" class="form-range" id="cv-slider-thresh" min="20" max="80" value="${s.threshold}">
            </div>

            <p class="cv-tip-text">Transfer function: Vout = T × 10mV/°C. Fan activates when Temperature ≥ Threshold.</p>
          </div>
        </div>

        <button class="cv-complete-btn" id="cv-btn-complete">✓ Complete lab experiment</button>
      </div>
    `;

    rightPanel.innerHTML = `
      <div class="cv-panel-right">
        <div class="cv-tabs-bar">
          <button class="cv-subtab-btn active">Active Actuator View</button>
        </div>

        <div class="cv-stage-box">
          <span class="cv-stage-tag">ANALOG OUTPUT: ${vMv} mV (${(vMv/1000).toFixed(3)} V)</span>

          <div class="fan-housing ${fanOn ? 'spinning' : ''}" style="margin: 2rem 0; width: 100px; height: 100px;">
            <div class="fan-blade blade-1"></div>
            <div class="fan-blade blade-2"></div>
            <div class="fan-blade blade-3"></div>
            <div class="fan-blade blade-4"></div>
            <div class="fan-hub"></div>
          </div>

          <div class="cv-output-pill ${fanOn ? 'cv-out-high' : 'cv-out-low'}">
            ${fanOn ? `COOLING FAN ACTIVE (${s.temp}°C ≥ ${s.threshold}°C)` : `FAN STANDBY (${s.temp}°C < ${s.threshold}°C)`}
          </div>
        </div>
      </div>
    `;

    leftPanel.querySelector('#cv-exp-select').onchange = (e) => switchExperiment(e.target.value);
    leftPanel.querySelector('#cv-slider-temp').oninput = (e) => {
      s.temp = parseInt(e.target.value, 10);
      renderWorkbench();
    };
    leftPanel.querySelector('#cv-slider-thresh').oninput = (e) => {
      s.threshold = parseInt(e.target.value, 10);
      renderWorkbench();
    };
    leftPanel.querySelector('#cv-btn-complete').onclick = () => markLabCompleted('lm35');
  }

  // --------------------------------------------------------------------------
  // 4. LDR LIGHT SENSOR EXPERIMENT
  // --------------------------------------------------------------------------
  function renderLdrExperiment(leftPanel, rightPanel) {
    const s = state.ldr;
    const rLdr = Math.round(500000 / (1 + Math.pow(s.lux / 8, 0.85)));
    const vOut = (5.0 * 10000) / (rLdr + 10000);
    const lit = s.lux <= s.threshold;

    leftPanel.innerHTML = `
      <div class="cv-panel-left">
        <div>
          <div class="cv-panel-tag">LAB CONTROLS</div>
          <h3 class="cv-panel-heading">LDR Dusk-to-Dawn Lamp</h3>

          <div class="cv-controls-body">
            <div class="cv-field-group">
              <label class="cv-field-label">Active Experiment</label>
              <select class="cv-select-box" id="cv-exp-select">
                <option value="AND">Logic Gates (AND/OR/NOT/XOR)</option>
                <option value="led">LED Circuit & Ohm's Law</option>
                <option value="lm35">Temperature Sensor (LM35)</option>
                <option value="ldr" selected>LDR Dusk-to-Dawn Light</option>
                <option value="pir">PIR Motion Detector</option>
              </select>
            </div>

            <div class="cv-field-group">
              <label class="cv-field-label d-flex justify-between">
                <span>Ambient Sunlight (Lux):</span>
                <span class="text-amber font-mono">${s.lux} Lux</span>
              </label>
              <input type="range" class="form-range" id="cv-slider-lux" min="0" max="1500" value="${s.lux}">
            </div>

            <div class="cv-field-group">
              <label class="cv-field-label d-flex justify-between">
                <span>Dusk Trigger Threshold:</span>
                <span class="text-cyan font-mono">${s.threshold} Lux</span>
              </label>
              <input type="range" class="form-range" id="cv-slider-lthresh" min="50" max="600" value="${s.threshold}">
            </div>

            <p class="cv-tip-text">CdS photoresistor resistance rises in the dark, shifting voltage divider output to turn the lamp on.</p>
          </div>
        </div>

        <button class="cv-complete-btn" id="cv-btn-complete">✓ Complete lab experiment</button>
      </div>
    `;

    rightPanel.innerHTML = `
      <div class="cv-panel-right">
        <div class="cv-tabs-bar">
          <button class="cv-subtab-btn active">Streetlight Visualizer</button>
        </div>

        <div class="cv-stage-box">
          <span class="cv-stage-tag">DIVIDER VOUT: ${vOut.toFixed(2)} V | RLDR: ${(rLdr/1000).toFixed(1)} kΩ</span>

          <div style="font-size: 4.5rem; margin: 2rem 0;">
            ${lit ? '🏮' : '☀️'}
          </div>

          <div class="cv-output-pill ${lit ? 'cv-out-high' : 'cv-out-low'}">
            ${lit ? `STREETLIGHT LIT (DUSK: ${s.lux} Lux)` : `STREETLIGHT OFF (DAYLIGHT: ${s.lux} Lux)`}
          </div>
        </div>
      </div>
    `;

    leftPanel.querySelector('#cv-exp-select').onchange = (e) => switchExperiment(e.target.value);
    leftPanel.querySelector('#cv-slider-lux').oninput = (e) => {
      s.lux = parseInt(e.target.value, 10);
      renderWorkbench();
    };
    leftPanel.querySelector('#cv-slider-lthresh').oninput = (e) => {
      s.threshold = parseInt(e.target.value, 10);
      renderWorkbench();
    };
    leftPanel.querySelector('#cv-btn-complete').onclick = () => markLabCompleted('ldr');
  }

  // --------------------------------------------------------------------------
  // 5. PIR MOTION SENSOR EXPERIMENT
  // --------------------------------------------------------------------------
  function renderPirExperiment(leftPanel, rightPanel) {
    const s = state.pir;

    leftPanel.innerHTML = `
      <div class="cv-panel-left">
        <div>
          <div class="cv-panel-tag">LAB CONTROLS</div>
          <h3 class="cv-panel-heading">PIR Infrared Motion Sensor</h3>

          <div class="cv-controls-body">
            <div class="cv-field-group">
              <label class="cv-field-label">Active Experiment</label>
              <select class="cv-select-box" id="cv-exp-select">
                <option value="AND">Logic Gates (AND/OR/NOT/XOR)</option>
                <option value="led">LED Circuit & Ohm's Law</option>
                <option value="lm35">Temperature Sensor (LM35)</option>
                <option value="ldr">LDR Dusk-to-Dawn Light</option>
                <option value="pir" selected>PIR Motion Detector</option>
              </select>
            </div>

            <button class="btn btn-red btn-block text-base py-3" id="cv-btn-pir-motion">
              🏃‍♂️ Simulate Person Walking By
            </button>

            <div class="cv-field-group mt-2">
              <label class="cv-field-label d-flex justify-between">
                <span>Hold Time Delay:</span>
                <span class="text-cyan font-mono">${s.delaySec} Seconds</span>
              </label>
              <input type="range" class="form-range" id="cv-slider-delay" min="3" max="15" value="${s.delaySec}">
            </div>

            <p class="cv-tip-text">Dual pyroelectric crystals detect moving thermal heat bodies and latch the output HIGH.</p>
          </div>
        </div>

        <button class="cv-complete-btn" id="cv-btn-complete">✓ Complete lab experiment</button>
      </div>
    `;

    rightPanel.innerHTML = `
      <div class="cv-panel-right">
        <div class="cv-tabs-bar">
          <button class="cv-subtab-btn active">Security Alarm View</button>
        </div>

        <div class="cv-stage-box">
          <span class="cv-stage-tag">DIGITAL OUTPUT: ${s.motionActive ? '3.3V HIGH' : '0.0V LOW'}</span>

          <div class="siren-beacon ${s.motionActive ? 'strobing' : ''}" style="margin: 2rem 0; width: 90px; height: 90px; font-size: 3rem;">
            ${s.motionActive ? '🚨' : '🛡️'}
          </div>

          <div class="cv-output-pill ${s.motionActive ? 'cv-out-high text-red' : 'cv-out-low'}">
            ${s.motionActive ? `INTRUSION ALARM ACTIVE (${s.remainingTime}s)` : 'SYSTEM ARMED & LISTENING'}
          </div>
        </div>
      </div>
    `;

    leftPanel.querySelector('#cv-exp-select').onchange = (e) => switchExperiment(e.target.value);
    leftPanel.querySelector('#cv-slider-delay').oninput = (e) => {
      s.delaySec = parseInt(e.target.value, 10);
      renderWorkbench();
    };

    leftPanel.querySelector('#cv-btn-pir-motion').onclick = () => {
      if (s.timerId) clearInterval(s.timerId);
      s.motionActive = true;
      s.remainingTime = s.delaySec;
      if (window.AudioEngine) window.AudioEngine.playBuzzer();
      renderWorkbench();

      s.timerId = setInterval(() => {
        s.remainingTime--;
        if (s.remainingTime <= 0) {
          clearInterval(s.timerId);
          s.timerId = null;
          s.motionActive = false;
        }
        renderWorkbench();
      }, 1000);
    };

    leftPanel.querySelector('#cv-btn-complete').onclick = () => markLabCompleted('pir');
  }

  function bindGlobalEvents() {
    // Experiment Pills in Top Selector Bar
    document.querySelectorAll('.lab-exp-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const labId = pill.getAttribute('data-lab');
        if (labId) switchExperiment(labId);
      });
    });
  }

  return {
    init: init,
    switchExperiment: switchExperiment
  };
})();
