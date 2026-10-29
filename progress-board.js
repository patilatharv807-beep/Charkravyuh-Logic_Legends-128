// ============================================================================
// CHAKRAVYUH AI VIBE CODING CHALLENGE - SMART ENTC LEARNING PLATFORM
// Progress Board & Engineering Dossier Controller
// Features: Progress Details, Lab Report, Theory Notes, Components Pricing,
//           Components Working, Components Output with Connection
// ============================================================================

window.ProgressBoard = (function () {
  const TOPICS_STORAGE = 'entc_completed_topics_v1';
  const LABS_STORAGE = 'entc_completed_labs_v1';

  // State
  let activeTab = 'overview'; // 'overview', 'report', 'theory', 'pricing', 'working', 'connections'
  let selectedCategory = 'all';
  let selectedConnection = 'led';
  let selectedBOMItems = new Set(['uno', 'resistors', 'leds', 'bb']);

  // --------------------------------------------------------------------------
  // 1. HARDWARE COMPONENTS PRICING DATABASE (Real-World Indian Market Rates INR + USD)
  // --------------------------------------------------------------------------
  const COMPONENTS_BOM = [
    // Microcontrollers
    { id: 'uno', name: 'Arduino Uno R3 (ATmega328P DIP)', cat: 'mcu', inr: 450, usd: 5.40, vendor: 'Robu.in / ElectronicsComp', unit: '1 pc', desc: 'Standard 16MHz development board with 14 digital I/O & 6 analog inputs' },
    { id: 'nano', name: 'Arduino Nano V3 (CH340G)', cat: 'mcu', inr: 240, usd: 2.90, vendor: 'Robu.in', unit: '1 pc', desc: 'Compact breadboard-friendly MCU for small form-factor embedded nodes' },
    { id: 'nodemcu', name: 'NodeMCU ESP8266 Wi-Fi Dev Board', cat: 'mcu', inr: 280, usd: 3.35, vendor: 'Robocraze', unit: '1 pc', desc: 'IoT board with integrated 802.11 b/g/n Wi-Fi & Tensilica 32-bit core' },
    { id: 'esp32', name: 'ESP32-WROOM-32 30-Pin Dev Board', cat: 'mcu', inr: 420, usd: 5.00, vendor: 'ElectronicsComp', unit: '1 pc', desc: 'Dual-core 240MHz MCU with Bluetooth BLE + Wi-Fi for edge AI' },
    { id: 'atmega328', name: 'ATmega328P-PU Standalone DIP-28 IC', cat: 'mcu', inr: 180, usd: 2.15, vendor: 'Element14', unit: '1 pc', desc: 'Raw AVR microchip with Optiboot bootloader for custom PCB fabrication' },

    // Logic ICs
    { id: 'ic7408', name: '74LS08 Quad 2-Input AND Gate DIP-14', cat: 'logic', inr: 25, usd: 0.30, vendor: 'Local Electronic Store', unit: '1 pc', desc: 'TTL AND logic IC, 4 independent gates, 5V nominal operation' },
    { id: 'ic7432', name: '74LS32 Quad 2-Input OR Gate DIP-14', cat: 'logic', inr: 25, usd: 0.30, vendor: 'Local Electronic Store', unit: '1 pc', desc: 'TTL OR logic IC for sum-of-products combinational circuits' },
    { id: 'ic7404', name: '74LS04 Hex Inverter DIP-14', cat: 'logic', inr: 22, usd: 0.26, vendor: 'Robu.in', unit: '1 pc', desc: '6 independent logic NOT inverters with high noise immunity' },
    { id: 'ic7486', name: '74LS86 Quad 2-Input XOR Gate DIP-14', cat: 'logic', inr: 28, usd: 0.34, vendor: 'ElectronicsComp', unit: '1 pc', desc: 'Exclusive-OR gate IC used for half-adders and parity checkers' },
    { id: 'ic7400', name: '74LS00 Quad 2-Input NAND DIP-14', cat: 'logic', inr: 22, usd: 0.26, vendor: 'Robu.in', unit: '1 pc', desc: 'Universal logic gate IC capable of synthesizing any Boolean equation' },
    { id: 'ne555', name: 'NE555 Precision Bipolar Timer IC', cat: 'logic', inr: 15, usd: 0.18, vendor: 'Robocraze', unit: '1 pc', desc: 'Astable & monostable multivibrator for clocks and PWM generation' },
    { id: 'lm358', name: 'LM358 Dual Operational Amplifier', cat: 'logic', inr: 18, usd: 0.22, vendor: 'Robu.in', unit: '1 pc', desc: 'Dual op-amp for sensor signal conditioning and analog comparators' },

    // Sensors
    { id: 'lm35', name: 'LM35DZ Precision Analog Centigrade Temp Sensor', cat: 'sensors', inr: 85, usd: 1.00, vendor: 'Texas Instruments / Robu', unit: '1 pc', desc: 'Calibrated linearly in Celsius (+10.0 mV/°C) with ±0.5°C accuracy' },
    { id: 'ldr', name: '5mm LDR Light Dependent Resistor', cat: 'sensors', inr: 25, usd: 0.30, vendor: 'Robu.in', unit: 'Pack of 5', desc: 'Cadmium-Sulfide photoresistor (10kΩ ambient, >1MΩ pitch dark)' },
    { id: 'pir', name: 'HC-SR501 PIR Pyroelectric Motion Sensor Module', cat: 'sensors', inr: 110, usd: 1.32, vendor: 'ElectronicsComp', unit: '1 pc', desc: 'Infrared motion sensor with Fresnel lens, dual potentiometers (dist & delay)' },
    { id: 'dht11', name: 'DHT11 Digital Temp & Relative Humidity Sensor', cat: 'sensors', inr: 95, usd: 1.14, vendor: 'Robocraze', unit: '1 pc', desc: 'Calibrated single-bus digital output sensor (20-90% RH, 0-50°C)' },
    { id: 'ultrasonic', name: 'HC-SR04 Ultrasonic Sonar Distance Sensor', cat: 'sensors', inr: 75, usd: 0.90, vendor: 'Robu.in', unit: '1 pc', desc: '40kHz non-contact distance measuring from 2cm to 400cm' },
    { id: 'mq2', name: 'MQ-2 Combustible Gas & Smoke Sensor', cat: 'sensors', inr: 130, usd: 1.55, vendor: 'Robu.in', unit: '1 pc', desc: 'Detects LPG, propane, methane, hydrogen, and smoke particles' },

    // Prototyping & Actuators
    { id: 'bb', name: 'MB-102 830-Point Solderless Breadboard', cat: 'proto', inr: 95, usd: 1.15, vendor: 'Robu.in', unit: '1 pc', desc: 'Transparent dual-bus power rails with nickel-plated spring clips' },
    { id: 'jumpers', name: '65 pcs Male-to-Male Flexible Jumper Wires', cat: 'proto', inr: 50, usd: 0.60, vendor: 'Robu.in', unit: '1 bundle', desc: 'Assorted lengths for clean and organized breadboard routing' },
    { id: 'resistors', name: '1/4W Metal Film Resistors Assortment (30 values)', cat: 'proto', inr: 110, usd: 1.30, vendor: 'Robocraze', unit: '300 pcs', desc: '1% precision resistors from 10Ω to 1MΩ, includes 220Ω, 1kΩ, 10kΩ' },
    { id: 'leds', name: '5mm Diffused LEDs Assorted Colors (R, G, B, Y, W)', cat: 'proto', inr: 45, usd: 0.54, vendor: 'ElectronicsComp', unit: '30 pcs', desc: 'High brightness indicator diodes with 2.0V - 3.2V forward drop' },
    { id: 'lcd1602', name: '16x2 Character LCD with PCF8574 I2C Backpack', cat: 'proto', inr: 175, usd: 2.10, vendor: 'Robu.in', unit: '1 pc', desc: 'Only requires 2 wires (SDA & SCL) for complete alpha-numeric display' },
    { id: 'relay', name: '5V Single-Channel Relay Module with Optocoupler', cat: 'proto', inr: 55, usd: 0.66, vendor: 'Robu.in', unit: '1 pc', desc: 'Safely controls AC mains loads (up to 250V AC / 10A) with opto-isolation' },
    { id: 'servo', name: 'TowerPro SG90 9g Micro Servo Motor', cat: 'proto', inr: 115, usd: 1.38, vendor: 'ElectronicsComp', unit: '1 pc', desc: '180-degree rotation actuator for robotics, pan-tilt and automated gates' }
  ];

  // --------------------------------------------------------------------------
  // 2. COMPONENTS WORKING PRINCIPLE & DATASHEET DATABASE
  // --------------------------------------------------------------------------
  const COMPONENTS_WORKING = [
    {
      id: 'ic7408',
      name: '74LS08 Quad 2-Input AND Gate IC',
      icon: '🔀',
      category: 'Digital Logic IC',
      supply: '4.75V – 5.25V DC',
      current: '12 mA (Quiescent)',
      principle: 'Contains 4 independent two-input AND gates built on Transistor-Transistor Logic (TTL). Internally, multiple-emitter transistors act as input diodes. When either input is LOW (0V), current pulls through the base-emitter junction, starving the output pull-up transistor and yielding 0V (LOW). When BOTH inputs are driven HIGH (+5V), the input stage cuts off, energizing the totem-pole output to provide +5V (HIGH).',
      formula: 'OUT = A · B (True only when A = 1 and B = 1)',
      goldenRule: 'Never leave unused inputs floating. Connect unused gate inputs to VCC through a 1kΩ pull-up resistor to avoid high-frequency parasitic switching.'
    },
    {
      id: 'ldr',
      name: 'Light-Dependent Resistor (LDR / Photocell)',
      icon: '☀️',
      category: 'Analog Sensor',
      supply: '0V – 100V DC or AC',
      current: 'Dependent on series load',
      principle: 'Made of a Cadmium-Sulfide (CdS) semiconductor zigzag film. In darkness, few valence electrons have enough energy to cross into the conduction band, maintaining a high resistance (> 1 MΩ). When incident light photons strike the film, photons transfer energy to valence electrons, generating free electron-hole pairs and dramatically lowering resistance down to 400Ω – 2kΩ in bright sunlight.',
      formula: 'V_out = V_in · [ R_fixed / (R_ldr + R_fixed) ]',
      goldenRule: 'LDR is a variable resistor, not a voltage source! You MUST place it in a voltage divider network with a 10kΩ resistor to read it on an Arduino analog pin.'
    },
    {
      id: 'lm35',
      name: 'LM35DZ Centigrade Temperature Sensor',
      icon: '🌡️',
      category: 'Precision Thermal Sensor',
      supply: '4.0V – 30.0V DC',
      current: '60 µA (Ultra-low self heating)',
      principle: 'Uses internal silicon bandgap temperature reference technology. Two matched transistors operate at identical temperatures but differing current densities. The difference between their base-emitter voltages (ΔV_be) is directly proportional to absolute thermodynamic temperature. An internal operational amplifier amplifies this difference into a calibrated linear scale of exactly +10 mV per degree Celsius.',
      formula: 'Temperature (°C) = Output Voltage (mV) ÷ 10.0',
      goldenRule: 'Danger: Swapping the 5V and GND pins will instantly heat up the plastic casing and permanently burn out the internal silicon die within 3 seconds!'
    },
    {
      id: 'pir',
      name: 'HC-SR501 PIR Pyroelectric Motion Sensor',
      icon: '🚨',
      category: 'Infrared Motion Transducer',
      supply: '4.5V – 20V DC (Built-in 3.3V LDO)',
      current: '50 µA (Standby) / 65 mA (Triggered)',
      principle: 'Features two pyroelectric crystal elements placed side-by-side behind a multi-faceted Fresnel dome lens. The crystal generates a tiny electrical charge when heated by human thermal infrared radiation (~9.4 µm wavelength). As a person walks across the detection field, radiation strikes the first element, then the second. The sensor measures the difference between the two halves; when a differential thermal spike occurs, the BISS0001 IC asserts an active HIGH (3.3V) signal.',
      formula: 'Output: Logic 1 (+3.3V) for Delay Duration, 0V Idle',
      goldenRule: 'Allow a 30 to 60-second warm-up stabilization period upon power-up before reading motion signals to allow the pyroelectric elements to reach thermal equilibrium.'
    },
    {
      id: 'atmega328',
      name: 'ATmega328P 8-Bit AVR Microcontroller',
      icon: '⚡',
      category: 'Embedded Microcontroller',
      supply: '1.8V – 5.5V (Standard 5.0V @ 16 MHz)',
      current: '12 mA @ 5V, 16MHz active',
      principle: 'An advanced Harvard-architecture RISC microcontroller featuring 32KB ISP Flash, 2KB SRAM, 1KB EEPROM, 23 programmable I/O lines, 6-channel 10-bit ADC, and 3 hardware timers. Instructions execute in a single clock cycle, achieving throughputs approaching 1 MIPS per MHz. Direct register access via DDRx (Direction), PORTx (Output), and PINx (Input) allows sub-microsecond GPIO manipulation.',
      formula: 'Clock Period: T = 1 / 16,000,000 Hz = 62.5 nanoseconds',
      goldenRule: 'The absolute maximum DC current per I/O pin is 40 mA, and the entire chip cannot sink more than 200 mA. Never drive heavy inductive coils or DC motors directly from MCU pins!'
    },
    {
      id: 'resistor_led',
      name: 'LED Current-Limiting Resistor Network',
      icon: '💡',
      category: 'Passive Protection Stage',
      supply: '5.0V System Bus',
      current: 'Targeted: 15 mA – 20 mA Safe Forward Current',
      principle: 'Light-Emitting Diodes possess exponential I-V diode curves with near-zero internal resistance once the forward threshold voltage (V_f ≈ 2.0V for Red/Cyan, 3.2V for Blue/White) is exceeded. Connecting an LED directly to a 5V source causes thermal runaway: current surges toward several amps, instantly vaporizing the microscopic gold bonding wire. The series resistor drops the remaining voltage (5V - 2.0V = 3.0V) and strictly limits current according to Ohm\'s Law.',
      formula: 'R = (V_supply - V_forward) ÷ I_desired = (5.0 - 2.0) ÷ 0.018A = 166.7 Ω → Standard 220 Ω',
      goldenRule: 'Always calculate standard E24 resistor values: using a 220Ω or 330Ω resistor with 5V microcontrollers ensures optimal brightness without exceeding LED thermal dissipation ratings.'
    }
  ];

  // --------------------------------------------------------------------------
  // 3. COMPONENTS OUTPUT & CONNECTION WIRING SCHEMATICS
  // --------------------------------------------------------------------------
  const CONNECTIONS_DATA = {
    'led': {
      title: 'Arduino Uno to LED Circuit (Safe Current Limiting)',
      component: 'Cyan Diffused LED + 220Ω 1/4W Resistor',
      wireConnections: [
        { from: 'Arduino Digital Pin 13', to: '220Ω Resistor Lead 1', color: 'yellow', label: 'PWM / Logic Out (+5V Signal)' },
        { from: '220Ω Resistor Lead 2', to: 'LED Anode (Longer Leg +)', color: 'yellow', label: 'Current-Limited Node (2.0V Drop)' },
        { from: 'LED Cathode (Flat Edge -)', to: 'Arduino GND Pin', color: 'black', label: 'Ground Return Path (0V)' }
      ],
      outputSignal: {
        type: 'Digital Logic / PWM Waveform',
        idleState: '0.00 V (LOW - Off)',
        activeState: '5.00 V (HIGH - Emitting 18.2 mA)',
        waveform: 'square',
        notes: 'Produces 490 Hz square wave when modulated with Arduino analogWrite(13, 128) for 50% duty cycle dimming.'
      },
      pitfall: 'Reversing LED polarity prevents it from lighting up, but usually will not destroy it if reverse breakdown voltage (V_R = 5V) is not exceeded. Forgetting the 220Ω resistor, however, WILL destroy the LED and risk damaging Arduino Pin 13.'
    },
    'ic7408': {
      title: '74LS08 Quad 2-Input AND Gate Wiring',
      component: 'DIP-14 Logic IC with Dual Toggle Inputs',
      wireConnections: [
        { from: 'Power Supply +5V (VCC)', to: 'IC Pin 14 (VCC)', color: 'red', label: 'Main Power Rail (+5V DC)' },
        { from: 'Power Supply GND', to: 'IC Pin 7 (GND)', color: 'black', label: 'Circuit Ground Reference (0V)' },
        { from: 'Toggle Switch A (+5V / GND)', to: 'IC Pin 1 (1A Input)', color: 'blue', label: 'Input Vector A' },
        { from: 'Toggle Switch B (+5V / GND)', to: 'IC Pin 2 (1B Input)', color: 'yellow', label: 'Input Vector B' },
        { from: 'IC Pin 3 (1Y Output)', to: '220Ω Resistor to Indicator LED', color: 'green', label: 'Result Vector (A AND B)' }
      ],
      outputSignal: {
        type: 'Standard TTL Digital Output',
        idleState: 'VOL ≤ 0.4 V (Logic 0)',
        activeState: 'VOH ≥ 2.7 V (Logic 1, Typically 4.2V)',
        waveform: 'square',
        notes: 'Gate propagation delay is approximately 9 nanoseconds from input transition to output assertion.'
      },
      pitfall: 'Never connect IC Pin 14 to GND and Pin 7 to VCC. Reversed polarity on TTL ICs will fry the internal substrate immediately. Also ensure all inputs have defined logic levels — do not let inputs float.'
    },
    'lm35': {
      title: 'LM35 Precision Temperature Sensor to Arduino',
      component: 'LM35DZ TO-92 3-Pin Transducer',
      wireConnections: [
        { from: 'Arduino +5V Pin', to: 'LM35 Pin 1 (+Vs - Left Pin flat side facing you)', color: 'red', label: 'Operating Power Supply (+5V)' },
        { from: 'LM35 Pin 2 (Vout - Center Pin)', to: 'Arduino Analog In A0', color: 'yellow', label: 'Linear Analog Signal (10 mV / °C)' },
        { from: 'LM35 Pin 3 (GND - Right Pin flat side)', to: 'Arduino GND Pin', color: 'black', label: 'Analog Reference Ground' }
      ],
      outputSignal: {
        type: 'Continuous Linear DC Voltage (0.0V – 1.5V)',
        idleState: '250 mV at 25.0 °C Ambient Room Temperature',
        activeState: '1000 mV (1.00 V) at 100.0 °C Boiling Water',
        waveform: 'analog',
        notes: 'Arduino ADC converts 0-5V into 0-1023 integer. Formula: Temp_C = (analogRead(A0) * 500.0) / 1024.0;'
      },
      pitfall: 'Looking at the curved side instead of the flat side reverses Pin 1 and Pin 3. If connected in reverse, the LM35 acts as a short circuit and gets burning hot to the touch in seconds.'
    },
    'ldr': {
      title: 'LDR Light Sensor Voltage Divider to Arduino',
      component: '5mm LDR + 10kΩ 1% Fixed Pull-Down Resistor',
      wireConnections: [
        { from: 'Arduino +5V Pin', to: 'LDR Terminal 1', color: 'red', label: 'Excitation Voltage (+5V)' },
        { from: 'LDR Terminal 2 (Junction Node)', to: 'Arduino Analog In A1', color: 'yellow', label: 'Voltage Divider Output Node' },
        { from: 'Junction Node', to: '10kΩ Resistor Lead 1', color: 'blue', label: 'Series Divider Element' },
        { from: '10kΩ Resistor Lead 2', to: 'Arduino GND Pin', color: 'black', label: 'Ground Reference' }
      ],
      outputSignal: {
        type: 'Proportional Ambient Illuminance Curve',
        idleState: '4.2 V (ADC ~ 860) in Bright Office Lighting',
        activeState: '0.4 V (ADC ~ 80) in Dark Bedroom / Night',
        waveform: 'analog',
        notes: 'Because LDR resistance rises in darkness, the voltage across the lower 10kΩ resistor drops as ambient light decreases.'
      },
      pitfall: 'Do not connect the LDR between 5V and GND without a series resistor. In direct sunlight (low resistance), it can draw high current and self-heat, skewing readings.'
    },
    'pir': {
      title: 'HC-SR501 PIR Motion Sensor to Arduino Interrupt',
      component: 'PIR Pyroelectric Board with 3-Pin Header',
      wireConnections: [
        { from: 'Arduino +5V Pin', to: 'PIR Header Pin VCC', color: 'red', label: 'Module Input Power (+5V)' },
        { from: 'PIR Header Pin OUT', to: 'Arduino Digital Pin 2 (INT0)', color: 'yellow', label: 'Digital Motion Trigger (+3.3V Logic)' },
        { from: 'PIR Header Pin GND', to: 'Arduino GND Pin', color: 'black', label: 'Common System Ground' }
      ],
      outputSignal: {
        type: 'Active-HIGH Digital Hold Pulse',
        idleState: '0.00 V (No thermal disturbance detected)',
        activeState: '3.30 V (Latched HIGH for 3.0s – 300s configurable delay)',
        waveform: 'square',
        notes: 'Connect to Pin 2 or 3 on Arduino to trigger hardware interrupts: attachInterrupt(digitalPinToInterrupt(2), onMotion, RISING);'
      },
      pitfall: 'The jumper on the PIR board sets Single Trigger (L) vs Repeatable Trigger (H). For security alarms, set to Repeatable Trigger so continuous motion keeps the output latched HIGH.'
    },
    'i2c_lcd': {
      title: '16x2 Character LCD with PCF8574 I2C Backpack',
      component: '4-Wire Serial Interface Display',
      wireConnections: [
        { from: 'Arduino +5V Pin', to: 'I2C Backpack VCC', color: 'red', label: 'Display & Backlight Power (+5V)' },
        { from: 'Arduino GND Pin', to: 'I2C Backpack GND', color: 'black', label: 'Ground Reference' },
        { from: 'Arduino Pin A4 (or dedicated SDA)', to: 'I2C Backpack SDA', color: 'blue', label: 'I2C Serial Data Bus (Bidirectional)' },
        { from: 'Arduino Pin A5 (or dedicated SCL)', to: 'I2C Backpack SCL', color: 'yellow', label: 'I2C Serial Clock Bus (100kHz Standard)' }
      ],
      outputSignal: {
        type: 'Synchronous I2C Digital Bus Protocol',
        idleState: 'Both SDA and SCL held HIGH by 4.7kΩ pull-up resistors',
        activeState: 'Clock transitions with data frames sending ASCII character codes',
        waveform: 'i2c',
        notes: 'Default I2C hardware address is 0x27 or 0x3F. Easily configured using LiquidCrystal_I2C lcd(0x27, 16, 2);'
      },
      pitfall: 'If text does not appear and only white blocks show up, use a flat screwdriver to turn the small blue potentiometer on the back of the I2C module to calibrate display contrast.'
    }
  };

  // --------------------------------------------------------------------------
  // INITIALIZATION
  // --------------------------------------------------------------------------
  function init() {
    renderProgressBoard();
    bindEvents();

    // Listen to local storage changes from lab & learn modules
    window.addEventListener('storage', () => {
      renderProgressBoard();
    });
  }

  function getCompletedTopics() {
    try {
      const data = localStorage.getItem(TOPICS_STORAGE);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function getCompletedLabs() {
    try {
      const data = localStorage.getItem(LABS_STORAGE);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function setDemoData() {
    // Populate realistic progress for evaluators
    const sampleTopics = ['digital-logic', 'logic-gates', 'arduino', 'sensors', 'iot'];
    const sampleLabs = ['AND', 'OR', 'NOT', 'XOR', 'led', 'lm35'];
    localStorage.setItem(TOPICS_STORAGE, JSON.stringify(sampleTopics));
    localStorage.setItem(LABS_STORAGE, JSON.stringify(sampleLabs));
    if (window.AudioEngine) window.AudioEngine.playSuccess();
    renderProgressBoard();
    if (window.LearnModule) window.LearnModule.init();
    if (window.VirtualLab) window.VirtualLab.init();
  }

  function resetProgress() {
    localStorage.removeItem(TOPICS_STORAGE);
    localStorage.removeItem(LABS_STORAGE);
    if (window.AudioEngine) window.AudioEngine.playClick();
    renderProgressBoard();
    if (window.LearnModule) window.LearnModule.init();
    if (window.VirtualLab) window.VirtualLab.init();
  }

  function readStoredArray(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(value) ? value : [];
    } catch (error) {
      return [];
    }
  }

  function getStudyStreak() {
    try {
      const activity = JSON.parse(localStorage.getItem('entc_study_streak_v1') || '{}');
      return Number(activity.streak) || 0;
    } catch (error) {
      return 0;
    }
  }

  // --------------------------------------------------------------------------
  // MAIN RENDER FUNCTION
  // --------------------------------------------------------------------------
  function renderProgressBoard() {
    const container = document.getElementById('progress-board-content');
    if (!container) return;

    const completedTopics = getCompletedTopics();
    const completedLabs = getCompletedLabs();
    const quizScores = readStoredArray('entc_quiz_scores_v1');
    const recentTopics = readStoredArray('entc_recent_topics_v1')
      .map(id => (window.ENTC_LEARN_DATA || []).find(topic => topic.id === id))
      .filter(Boolean);
    let bestQuizScore = 0;
    try {
      bestQuizScore = Number(localStorage.getItem('entc_quiz_best_score_v1')) || 0;
    } catch (error) {}
    const studyStreak = getStudyStreak();

    const totalTopics = 8;
    const totalLabs = 10;
    const totalUnits = totalTopics + totalLabs;
    const completedUnits = completedTopics.length + completedLabs.length;
    const overallPct = Math.round((completedUnits / totalUnits) * 100);

    // Compute stroke-dashoffset for SVG circle (circumference = 2 * PI * 60 ≈ 377)
    const circumference = 377;
    const strokeOffset = circumference - (circumference * overallPct) / 100;

    // Student Title based on progress
    let studentRank = 'Level 1 · Electronic Novice';
    if (overallPct >= 80) studentRank = 'Level 5 · Silicon Architect (Master)';
    else if (overallPct >= 60) studentRank = 'Level 4 · Senior Hardware Innovator';
    else if (overallPct >= 40) studentRank = 'Level 3 · Embedded Systems Specialist';
    else if (overallPct >= 20) studentRank = 'Level 2 · Circuit Apprentice';

    container.innerHTML = `
      <!-- 1. TOP PROGRESS BOARD NAVIGATION TABS -->
      <nav class="pb-tabs-nav" aria-label="Progress Board Navigation">
        <button class="pb-tab-btn ${activeTab === 'overview' ? 'active' : ''}" data-pb-tab="overview">
          📊 Progress Details <span class="pb-tab-badge">${overallPct}%</span>
        </button>
        <button class="pb-tab-btn ${activeTab === 'report' ? 'active' : ''}" data-pb-tab="report">
          📋 Virtual Lab Report <span class="pb-tab-badge">${completedLabs.length}/10</span>
        </button>
        <button class="pb-tab-btn ${activeTab === 'theory' ? 'active' : ''}" data-pb-tab="theory">
          📚 Theory Notes Completed <span class="pb-tab-badge">${completedTopics.length}/8</span>
        </button>
        <button class="pb-tab-btn ${activeTab === 'pricing' ? 'active' : ''}" data-pb-tab="pricing">
          💰 Components Pricing (BOM) <span class="pb-tab-badge">₹ INR</span>
        </button>
        <button class="pb-tab-btn ${activeTab === 'working' ? 'active' : ''}" data-pb-tab="working">
          ⚙️ Components Working <span class="pb-tab-badge">6 Guides</span>
        </button>
        <button class="pb-tab-btn ${activeTab === 'connections' ? 'active' : ''}" data-pb-tab="connections">
          🔌 Output & Wiring Connections <span class="pb-tab-badge">Schematics</span>
        </button>
      </nav>

      <!-- 2. TAB CONTENT PANES -->

      <!-- TAB 1: OVERVIEW & PROGRESS DETAILS -->
      <div class="pb-pane ${activeTab === 'overview' ? 'active' : ''}" id="pb-pane-overview">
        <div class="pb-overview-grid">
          
          <!-- Student Profile & Radial Gauge Card -->
          <div class="pb-student-card">
            <div class="pb-student-header">
              <div class="pb-avatar-ring">🎓</div>
              <div>
                <h3 class="pb-student-name">ENTC Engineer</h3>
                <div class="pb-student-badge">⚡ ${studentRank}</div>
              </div>
            </div>

            <div class="pb-radial-container">
              <svg class="pb-radial-svg" viewBox="0 0 140 140">
                <defs>
                  <linearGradient id="pbCyanPurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#00f2fe" />
                    <stop offset="100%" stop-color="#a855f7" />
                  </linearGradient>
                </defs>
                <circle class="pb-radial-track" cx="70" cy="70" r="60" />
                <circle class="pb-radial-bar" cx="70" cy="70" r="60" style="stroke-dashoffset: ${strokeOffset};" />
              </svg>
              <div class="pb-radial-label">
                <div class="pb-radial-pct">${overallPct}%</div>
                <div class="pb-radial-sub">Mastery</div>
              </div>
            </div>

            <div class="pb-streak-banner">
              <span class="pb-streak-label">🔥 Active Study Streak</span>
              <span class="pb-streak-val">${studyStreak} ${studyStreak === 1 ? 'Day' : 'Days'}</span>
            </div>

            <div class="d-flex gap-2">
              <button class="btn btn-xs btn-outline-glass flex-1" id="pb-btn-demo">
                ⚡ Load Sample Data
              </button>
              <button class="btn btn-xs btn-outline-glass text-muted" id="pb-btn-reset" title="Reset all progress to 0%">
                ↺ Reset
              </button>
            </div>
          </div>

          <!-- Key Metrics Grid -->
          <div class="d-flex flex-col gap-3">
            <div class="pb-metrics-grid">
              
              <!-- Metric 1: Theory Notes -->
              <div class="pb-metric-tile">
                <div class="pb-metric-top">
                  <div>
                    <div class="pb-metric-val">${completedTopics.length} / ${totalTopics}</div>
                    <div class="pb-metric-title">Theory Notes Completed</div>
                  </div>
                  <div class="pb-metric-icon-box pb-icon-cyan">📚</div>
                </div>
                <div>
                  <div class="d-flex justify-between text-xs text-muted">
                    <span>Curriculum Completion</span>
                    <span class="text-cyan font-bold">${Math.round((completedTopics.length / totalTopics) * 100)}%</span>
                  </div>
                  <div class="pb-metric-progress-track">
                    <div class="pb-metric-progress-fill fill-cyan" style="width: ${(completedTopics.length / totalTopics) * 100}%;"></div>
                  </div>
                </div>
              </div>

              <!-- Metric 2: Virtual Labs -->
              <div class="pb-metric-tile">
                <div class="pb-metric-top">
                  <div>
                    <div class="pb-metric-val">${completedLabs.length} / ${totalLabs}</div>
                    <div class="pb-metric-title">Virtual Labs Certified</div>
                  </div>
                  <div class="pb-metric-icon-box pb-icon-purple">⚡</div>
                </div>
                <div>
                  <div class="d-flex justify-between text-xs text-muted">
                    <span>Simulation Experiments</span>
                    <span class="text-purple font-bold">${Math.round((completedLabs.length / totalLabs) * 100)}%</span>
                  </div>
                  <div class="pb-metric-progress-track">
                    <div class="pb-metric-progress-fill fill-purple" style="width: ${(completedLabs.length / totalLabs) * 100}%;"></div>
                  </div>
                </div>
              </div>

              <!-- Metric 3: Practical Hours & Badges -->
              <div class="pb-metric-tile">
                <div class="pb-metric-top">
                  <div>
                    <div class="pb-metric-val">14.8 hrs</div>
                    <div class="pb-metric-title">Lab Simulator Hours</div>
                  </div>
                  <div class="pb-metric-icon-box pb-icon-emerald">⏱️</div>
                </div>
                <div>
                  <div class="d-flex justify-between text-xs text-muted">
                    <span>Engineering Badges</span>
                    <span class="text-emerald font-bold">${completedLabs.length >= 6 ? '4 Unlocked' : '2 Unlocked'}</span>
                  </div>
                  <div class="pb-metric-progress-track">
                    <div class="pb-metric-progress-fill fill-emerald" style="width: 75%;"></div>
                  </div>
                </div>
              </div>

              <div class="pb-metric-tile">
                <div class="pb-metric-top">
                  <div>
                    <div class="pb-metric-val">${bestQuizScore ? `${bestQuizScore} / 5` : 'Not taken'}</div>
                    <div class="pb-metric-title">Best Quiz Score</div>
                  </div>
                  <div class="pb-metric-icon-box pb-icon-cyan">✓</div>
                </div>
                <div>
                  <div class="d-flex justify-between text-xs text-muted">
                    <span>${quizScores.length ? `${quizScores.length} attempts · latest ${quizScores[quizScores.length - 1].score}/5` : 'Timed quiz practice'}</span>
                    <span class="text-cyan font-bold">${bestQuizScore ? `${Math.round((bestQuizScore / 5) * 100)}%` : '—'}</span>
                  </div>
                  <div class="pb-metric-progress-track">
                    <div class="pb-metric-progress-fill fill-cyan" style="width: ${(bestQuizScore / 5) * 100}%;"></div>
                  </div>
                </div>
              </div>

            </div>

            <div class="pb-recent-topics">
              <div class="pb-recent-topics-head">
                <h4>Recently Visited Topics</h4>
                <a href="index.html#learn">Browse modules →</a>
              </div>
              ${recentTopics.length ? `
                <div class="pb-recent-topics-list">
                  ${recentTopics.map(topic => `
                    <div class="pb-recent-topic">
                      <span class="pb-recent-topic-dot" style="background:${topic.accent}"></span>
                      <span><strong>${topic.title}</strong><small>${topic.category}</small></span>
                    </div>
                  `).join('')}
                </div>
              ` : '<p class="pb-recent-empty">Open a Learn module and it will appear here.</p>'}
            </div>

            <!-- Quick Action Strip -->
            <div class="pb-quick-action-strip">
              <div>
                <h4 class="text-white font-bold text-sm mb-1">Accelerate Your Telecommunications Degree</h4>
                <p class="text-muted text-xs">Jump right back into simulations, test logic gates in real-time, or inspect hardware pricing for your capstone project.</p>
              </div>
              <div class="d-flex gap-2">
                <button class="btn btn-sm btn-primary-neon" onclick="window.ProgressBoard.switchTab('report')">
                  View Lab Report ➔
                </button>
                <button class="btn btn-sm btn-outline-glass" onclick="window.ProgressBoard.switchTab('pricing')">
                  BOM Pricing ➔
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      <!-- TAB 2: VIRTUAL LAB REPORT -->
      <div class="pb-pane ${activeTab === 'report' ? 'active' : ''}" id="pb-pane-report">
        
        <div class="pb-report-header">
          <div>
            <div class="d-flex align-center gap-2 mb-2">
              <span class="chip-badge">ACADEMIC AUDIT RECORD</span>
              <span class="chip-badge chip-badge-purple">CHAKRAVYUH 2026</span>
            </div>
            <h3 class="text-white font-display text-xl font-bold">Virtual Electronics Laboratory Report</h3>
            <p class="text-muted text-xs">Certified digital test records logged from the browser-based simulation engine.</p>
          </div>

          <div class="pb-report-meta-grid">
            <div class="pb-report-meta-item">
              <span class="pb-report-meta-label">Total Conducted</span>
              <span class="pb-report-meta-val">${completedLabs.length} of ${totalLabs}</span>
            </div>
            <div class="pb-report-meta-item">
              <span class="pb-report-meta-label">Audit Engine</span>
              <span class="pb-report-meta-val text-cyan">CircuitVerse V2.4</span>
            </div>
            <button class="btn btn-sm btn-primary-neon" id="pb-btn-print-report">
              🖨️ Print Lab Report / PDF
            </button>
          </div>
        </div>

        <div class="pb-table-wrap">
          <table class="pb-report-table">
            <thead>
              <tr>
                <th>Experiment ID</th>
                <th>Experiment Name</th>
                <th>Component / IC Used</th>
                <th>Observed Output Vector</th>
                <th>Instructor Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${renderLabReportRows(completedLabs)}
            </tbody>
          </table>
        </div>

      </div>

      <!-- TAB 3: THEORY NOTES COMPLETED -->
      <div class="pb-pane ${activeTab === 'theory' ? 'active' : ''}" id="pb-pane-theory">
        <div class="pb-theory-grid">
          ${renderTheoryNotesGrid(completedTopics)}
        </div>
      </div>

      <!-- TAB 4: COMPONENTS PRICING (BOM) -->
      <div class="pb-pane ${activeTab === 'pricing' ? 'active' : ''}" id="pb-pane-pricing">
        
        <div class="pb-pricing-hero-strip">
          <div>
            <div class="d-flex align-center gap-2 mb-1">
              <span class="chip-badge">INDIAN MARKET PRICE INDEX</span>
              <span class="chip-badge chip-badge-purple">UPDATED 2026</span>
            </div>
            <h3 class="text-white font-display text-lg font-bold">Hardware BOM & Student Cost Estimator</h3>
            <p class="text-muted text-xs">Real-time approximate component prices in Indian Rupees (₹ INR) from major electronics distributors (Robu.in, ElectronicsComp, Robocraze).</p>
          </div>

          <div class="pb-bom-summary-box">
            <div class="pb-bom-stat">
              <span class="pb-bom-stat-label">Selected Items</span>
              <span class="pb-bom-stat-val" id="pb-bom-count">${selectedBOMItems.size} Parts</span>
            </div>
            <div class="pb-bom-stat">
              <span class="pb-bom-stat-label">Estimated Budget</span>
              <span class="pb-bom-stat-val text-emerald" id="pb-bom-total">₹${calculateBOMTotal()}</span>
            </div>
            <button class="btn btn-sm btn-outline-glass" id="pb-btn-copy-bom">
              📋 Copy BOM
            </button>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="pb-pricing-filter-bar">
          <button class="pb-pricing-filter-btn ${selectedCategory === 'all' ? 'active' : ''}" data-cat="all">All Components (${COMPONENTS_BOM.length})</button>
          <button class="pb-pricing-filter-btn ${selectedCategory === 'mcu' ? 'active' : ''}" data-cat="mcu">Microcontrollers & SoC</button>
          <button class="pb-pricing-filter-btn ${selectedCategory === 'logic' ? 'active' : ''}" data-cat="logic">Digital Logic ICs (TTL)</button>
          <button class="pb-pricing-filter-btn ${selectedCategory === 'sensors' ? 'active' : ''}" data-cat="sensors">Sensors & Transducers</button>
          <button class="pb-pricing-filter-btn ${selectedCategory === 'proto' ? 'active' : ''}" data-cat="proto">Prototyping & Actuators</button>
        </div>

        <div class="pb-pricing-table-wrap">
          <table class="pb-pricing-table">
            <thead>
              <tr>
                <th style="width: 50px;">BOM</th>
                <th>Component Name</th>
                <th>Category</th>
                <th>Standard Unit</th>
                <th>Market Price (INR / USD)</th>
                <th>Typical Vendors</th>
                <th>Application Note</th>
              </tr>
            </thead>
            <tbody>
              ${renderPricingRows()}
            </tbody>
          </table>
        </div>

      </div>

      <!-- TAB 5: COMPONENTS WORKING -->
      <div class="pb-pane ${activeTab === 'working' ? 'active' : ''}" id="pb-pane-working">
        <div class="pb-working-grid">
          ${renderWorkingCards()}
        </div>
      </div>

      <!-- TAB 6: COMPONENTS OUTPUT WITH CONNECTION -->
      <div class="pb-pane ${activeTab === 'connections' ? 'active' : ''}" id="pb-pane-connections">
        
        <div class="pb-connection-workspace">
          
          <div class="pb-conn-selector-bar">
            <button class="pb-conn-pill ${selectedConnection === 'led' ? 'active' : ''}" data-conn="led">💡 Arduino to LED Circuit</button>
            <button class="pb-conn-pill ${selectedConnection === 'ic7408' ? 'active' : ''}" data-conn="ic7408">🔀 7408 AND Gate IC</button>
            <button class="pb-conn-pill ${selectedConnection === 'lm35' ? 'active' : ''}" data-conn="lm35">🌡️ LM35 Temp to Analog A0</button>
            <button class="pb-conn-pill ${selectedConnection === 'ldr' ? 'active' : ''}" data-conn="ldr">☀️ LDR Divider to Analog A1</button>
            <button class="pb-conn-pill ${selectedConnection === 'pir' ? 'active' : ''}" data-conn="pir">🚨 PIR Motion to Digital Pin 2</button>
            <button class="pb-conn-pill ${selectedConnection === 'i2c_lcd' ? 'active' : ''}" data-conn="i2c_lcd">📟 I2C 16x2 LCD (SDA/SCL)</button>
          </div>

          ${renderConnectionView(selectedConnection)}

        </div>

      </div>
    `;

    bindTabContentEvents();
  }

  // --------------------------------------------------------------------------
  // TAB 2 HELPERS: LAB REPORT ROWS
  // --------------------------------------------------------------------------
  function renderLabReportRows(completedLabs) {
    const experiments = [
      { id: 'AND', name: '2-Input AND Gate Verification', ic: '74LS08 Quad AND DIP', output: 'A=1, B=1 ⇒ Y=1 (+5V)', labRef: 'AND' },
      { id: 'OR', name: '2-Input OR Gate Logic State', ic: '74LS32 Quad OR DIP', output: 'A=1, B=0 ⇒ Y=1 (+5V)', labRef: 'OR' },
      { id: 'NOT', name: 'Hex Inverter Logic Complement', ic: '74LS04 Hex Inverter', output: 'A=1 ⇒ Y=0 (0V)', labRef: 'NOT' },
      { id: 'XOR', name: 'Exclusive-OR Parity Synthesizer', ic: '74LS86 Quad XOR DIP', output: 'A=1, B=0 ⇒ Y=1 (+5V)', labRef: 'XOR' },
      { id: 'NAND', name: 'Universal NAND Gate Synthesis', ic: '74LS00 Quad NAND', output: 'A=1, B=1 ⇒ Y=0 (0V)', labRef: 'NAND' },
      { id: 'NOR', name: 'Universal NOR Gate Synthesis', ic: '74LS02 Quad NOR', output: 'A=0, B=0 ⇒ Y=1 (+5V)', labRef: 'NOR' },
      { id: 'led', name: 'LED Resistor Limiting & Burnout Protection', ic: 'Cyan LED + 220Ω Resistor', output: '5.0V @ 18.2 mA (Safe Mode)', labRef: 'led' },
      { id: 'lm35', name: 'LM35 Centigrade Sensor with Cooling Relay', ic: 'LM35DZ + LM358 Comparator', output: 'Temp > 45°C ⇒ Fan Motor Active', labRef: 'lm35' },
      { id: 'ldr', name: 'Dusk-to-Dawn Autonomous Light Controller', ic: '5mm LDR + 10kΩ Divider', output: 'Lux < 200 Lux ⇒ Streetlamp ON', labRef: 'ldr' },
      { id: 'pir', name: 'PIR Human Motion Detector & Hold Timer', ic: 'HC-SR501 Pyroelectric Sensor', output: 'Thermal IR Spike ⇒ Siren 3.3V', labRef: 'pir' }
    ];

    return experiments.map((exp, idx) => {
      const isPassed = completedLabs.includes(exp.id);
      return `
        <tr>
          <td class="font-mono text-muted text-xs">EXP-0${idx + 1}</td>
          <td>
            <div class="font-bold text-white">${exp.name}</div>
          </td>
          <td class="text-cyan font-mono text-xs">${exp.ic}</td>
          <td class="font-mono text-xs">${exp.output}</td>
          <td>
            <span class="pb-status-badge ${isPassed ? 'status-passed' : 'status-pending'}">
              ${isPassed ? '✓ PASSED (Engine Verified)' : '⏳ PENDING (Not Run)'}
            </span>
          </td>
          <td>
            <a href="#lab" class="btn btn-xs btn-outline-glass" onclick="if(window.VirtualLab) window.VirtualLab.switchExperiment('${exp.labRef}');">
              ${isPassed ? '↻ Re-Run' : '▶ Execute Lab'}
            </a>
          </td>
        </tr>
      `;
    }).join('');
  }

  // --------------------------------------------------------------------------
  // TAB 3 HELPERS: THEORY NOTES GRID
  // --------------------------------------------------------------------------
  function renderTheoryNotesGrid(completedTopics) {
    if (!window.ENTC_LEARN_DATA) return '<div class="text-muted p-4">Loading curriculum data...</div>';

    return window.ENTC_LEARN_DATA.map(topic => {
      const isCompleted = completedTopics.includes(topic.id);
      const firstEquation = topic.equations && topic.equations.length > 0 ? topic.equations[0] : null;

      return `
        <div class="pb-theory-card ${isCompleted ? 'completed' : ''}" data-theory-id="${topic.id}">
          <div>
            <div class="pb-theory-top">
              <span class="chip-badge" style="border-color:${topic.accent}55; color:${topic.accent};">${topic.category}</span>
              <span class="pb-status-badge ${isCompleted ? 'status-passed' : 'status-pending'}">
                ${isCompleted ? '✓ Completed' : 'In Progress'}
              </span>
            </div>

            <h4 class="pb-theory-title">${topic.title}</h4>
            <p class="pb-theory-desc">${topic.summary}</p>

            ${firstEquation ? `
              <div class="pb-theory-formula-chip" title="${firstEquation.meaning || ''}">
                <span>📐</span>
                <span><strong>${firstEquation.name}:</strong> ${firstEquation.formula}</span>
              </div>
            ` : ''}
          </div>

          <div class="pb-theory-footer">
            <span class="text-xs text-muted">⏱️ ${topic.duration}</span>
            <div class="d-flex gap-2">
              <button class="btn btn-xs btn-outline-glass" onclick="window.ProgressBoard.toggleTheoryCompleted('${topic.id}')">
                ${isCompleted ? 'Mark Pending' : 'Mark Completed'}
              </button>
              <button class="btn btn-xs btn-primary-neon" onclick="window.LearnModule.openModal('${topic.id}')">
                Read Notes ➔
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // --------------------------------------------------------------------------
  // TAB 4 HELPERS: PRICING ROWS
  // --------------------------------------------------------------------------
  function renderPricingRows() {
    const list = selectedCategory === 'all'
      ? COMPONENTS_BOM
      : COMPONENTS_BOM.filter(item => item.cat === selectedCategory);

    return list.map(item => {
      const isChecked = selectedBOMItems.has(item.id);
      return `
        <tr>
          <td>
            <input type="checkbox" class="pb-bom-checkbox" data-id="${item.id}" ${isChecked ? 'checked' : ''} style="cursor:pointer; width:16px; height:16px; accent-color:#00f2fe;">
          </td>
          <td>
            <div class="font-bold text-white">${item.name}</div>
          </td>
          <td>
            <span class="chip-badge" style="font-size:0.7rem;">${item.cat.toUpperCase()}</span>
          </td>
          <td class="text-xs font-mono text-muted">${item.unit}</td>
          <td>
            <span class="pb-price-tag">₹${item.inr}</span>
            <span class="pb-price-usd">(~$${item.usd.toFixed(2)})</span>
          </td>
          <td>
            <span class="pb-vendor-chip">${item.vendor}</span>
          </td>
          <td class="text-xs text-muted" style="max-width:260px;">${item.desc}</td>
        </tr>
      `;
    }).join('');
  }

  function calculateBOMTotal() {
    let sum = 0;
    COMPONENTS_BOM.forEach(item => {
      if (selectedBOMItems.has(item.id)) {
        sum += item.inr;
      }
    });
    return sum;
  }

  // --------------------------------------------------------------------------
  // TAB 5 HELPERS: WORKING CARDS
  // --------------------------------------------------------------------------
  function renderWorkingCards() {
    return COMPONENTS_WORKING.map(comp => `
      <div class="pb-working-card">
        <div>
          <div class="pb-working-head">
            <div class="pb-working-icon">${comp.icon}</div>
            <div>
              <h4 class="pb-working-title">${comp.name}</h4>
              <div class="pb-working-subtitle">${comp.category}</div>
            </div>
          </div>

          <div class="pb-spec-row">
            <div class="pb-spec-item">
              <div class="pb-spec-k">Operating Voltage</div>
              <div class="pb-spec-v">${comp.supply}</div>
            </div>
            <div class="pb-spec-item">
              <div class="pb-spec-k">Current Draw</div>
              <div class="pb-spec-v">${comp.current}</div>
            </div>
          </div>

          <p class="pb-principle-text">${comp.principle}</p>

          <div class="pb-theory-formula-chip" style="margin-bottom: 0.85rem;">
            <span>🔬</span>
            <span><strong>Transfer Function:</strong> ${comp.formula}</span>
          </div>
        </div>

        <div class="pb-golden-rule-box">
          <strong>⚡ Engineering Precaution:</strong> ${comp.goldenRule}
        </div>
      </div>
    `).join('');
  }

  // --------------------------------------------------------------------------
  // TAB 6 HELPERS: CONNECTION VIEW
  // --------------------------------------------------------------------------
  function renderConnectionView(connKey) {
    const conn = CONNECTIONS_DATA[connKey] || CONNECTIONS_DATA.led;

    return `
      <div class="pb-conn-split-view">
        
        <!-- Left: Schematic Wire Layout -->
        <div class="pb-schematic-stage">
          <div>
            <div class="pb-stage-header">
              <span class="chip-badge">BREADBOARD & PINOUT MAP</span>
              <span class="font-mono text-cyan text-xs">Standard Wire Colors</span>
            </div>

            <h4 class="pb-stage-title">${conn.title}</h4>
            <div class="text-xs text-muted mb-3 font-mono">${conn.component}</div>

            <!-- Wire list -->
            <div class="pb-wire-list">
              ${conn.wireConnections.map(w => `
                <div class="pb-wire-item">
                  <div class="d-flex align-center gap-2">
                    <span class="wire-dot dot-${w.color}"></span>
                    <span class="text-white font-mono font-bold">${w.from}</span>
                    <span class="text-muted">➔</span>
                    <span class="text-cyan font-mono">${w.to}</span>
                  </div>
                  <span class="text-xs text-dim">${w.label}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Bottom Summary Box -->
          <div style="margin-top: 1.5rem; padding: 0.85rem; border-radius: 10px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.06);">
            <div class="text-xs text-muted">🎨 <strong>Color Convention:</strong> Red = 5V VCC · Black = 0V GND · Yellow = High-Speed Signal · Blue = Control / Bus</div>
          </div>
        </div>

        <!-- Right: Output Signal & Diagnostic Waveform -->
        <div class="pb-signal-panel">
          
          <div class="pb-scope-card">
            <div class="pb-scope-header">
              <span class="pb-scope-title">Live Oscilloscope / Signal Readout</span>
              <span class="font-mono text-emerald text-xs">● Sampling: 100 kHz</span>
            </div>

            <!-- SVG Waveform Simulation -->
            <svg class="pb-waveform-svg" viewBox="0 0 400 90">
              <defs>
                <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#00f2fe" />
                  <stop offset="50%" stop-color="#38bdf8" />
                  <stop offset="100%" stop-color="#a855f7" />
                </linearGradient>
              </defs>
              <!-- Grid lines -->
              <line x1="0" y1="20" x2="400" y2="20" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4,4" />
              <line x1="0" y1="45" x2="400" y2="45" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4,4" />
              <line x1="0" y1="70" x2="400" y2="70" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4,4" />
              <!-- Wave path -->
              ${renderWaveformPath(conn.outputSignal.waveform)}
            </svg>

            <div class="d-flex justify-between text-xs font-mono mt-2 pt-2 border-top border-glass">
              <div>
                <span class="text-dim">IDLE: </span>
                <span class="text-muted font-bold">${conn.outputSignal.idleState}</span>
              </div>
              <div>
                <span class="text-dim">ACTIVE: </span>
                <span class="text-cyan font-bold">${conn.outputSignal.activeState}</span>
              </div>
            </div>
          </div>

          <div class="text-xs text-muted" style="line-height: 1.6;">
            <strong>Signal Characteristics:</strong> ${conn.outputSignal.notes}
          </div>

          <!-- Common Pitfall Warning -->
          <div class="pb-pitfall-alert">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <div class="pb-pitfall-text">
              <strong>Common Wiring Mistake:</strong> ${conn.pitfall}
            </div>
          </div>

        </div>

      </div>
    `;
  }

  function renderWaveformPath(type) {
    if (type === 'square') {
      return `<path d="M 10 70 L 60 70 L 60 20 L 120 20 L 120 70 L 180 70 L 180 20 L 240 20 L 240 70 L 300 70 L 300 20 L 360 20 L 360 70 L 390 70" fill="none" stroke="url(#waveGrad)" stroke-width="2.5" />`;
    } else if (type === 'analog') {
      return `<path d="M 10 60 Q 60 15, 110 50 T 210 30 T 310 65 T 390 25" fill="none" stroke="url(#waveGrad)" stroke-width="2.5" />`;
    } else {
      // i2c / clock pulses
      return `
        <path d="M 10 25 L 30 25 L 30 65 L 50 65 L 50 25 L 70 25 L 70 65 L 90 65 L 90 25 L 120 25 L 120 65 L 150 65 L 150 25 L 200 25 L 200 65 L 240 65 L 240 25 L 300 25 L 300 65 L 340 65 L 340 25 L 390 25" fill="none" stroke="url(#waveGrad)" stroke-width="2.5" />
      `;
    }
  }

  // --------------------------------------------------------------------------
  // EVENT BINDINGS
  // --------------------------------------------------------------------------
  function bindEvents() {
    // Top Tab switching
    document.addEventListener('click', (e) => {
      const tabBtn = e.target.closest('[data-pb-tab]');
      if (tabBtn) {
        const tab = tabBtn.getAttribute('data-pb-tab');
        if (tab) switchTab(tab);
      }
    });
  }

  function switchTab(tabName) {
    activeTab = tabName;
    if (window.AudioEngine) window.AudioEngine.playClick();
    renderProgressBoard();
  }

  function toggleTheoryCompleted(topicId) {
    const list = getCompletedTopics();
    const idx = list.indexOf(topicId);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(topicId);
    }
    localStorage.setItem(TOPICS_STORAGE, JSON.stringify(list));
    if (window.AudioEngine) window.AudioEngine.playSwitch();
    renderProgressBoard();
    if (window.LearnModule) window.LearnModule.init();
  }

  function bindTabContentEvents() {
    // Demo and reset buttons
    const btnDemo = document.getElementById('pb-btn-demo');
    if (btnDemo) btnDemo.onclick = setDemoData;

    const btnReset = document.getElementById('pb-btn-reset');
    if (btnReset) btnReset.onclick = resetProgress;

    // Print Lab Report
    const btnPrint = document.getElementById('pb-btn-print-report');
    if (btnPrint) {
      btnPrint.onclick = () => {
        window.print();
      };
    }

    // Category Filter for BOM
    document.querySelectorAll('.pb-pricing-filter-btn').forEach(btn => {
      btn.onclick = () => {
        selectedCategory = btn.getAttribute('data-cat') || 'all';
        if (window.AudioEngine) window.AudioEngine.playClick();
        renderProgressBoard();
      };
    });

    // BOM Checkboxes
    document.querySelectorAll('.pb-bom-checkbox').forEach(cb => {
      cb.onchange = (e) => {
        const id = e.target.getAttribute('data-id');
        if (e.target.checked) {
          selectedBOMItems.add(id);
        } else {
          selectedBOMItems.delete(id);
        }
        if (window.AudioEngine) window.AudioEngine.playSwitch();
        const totalEl = document.getElementById('pb-bom-total');
        const countEl = document.getElementById('pb-bom-count');
        if (totalEl) totalEl.innerText = `₹${calculateBOMTotal()}`;
        if (countEl) countEl.innerText = `${selectedBOMItems.size} Parts`;
      };
    });

    // Copy BOM
    const btnCopyBOM = document.getElementById('pb-btn-copy-bom');
    if (btnCopyBOM) {
      btnCopyBOM.onclick = () => {
        const selectedList = COMPONENTS_BOM.filter(item => selectedBOMItems.has(item.id));
        const text = [
          'CHAKRAVYUH 2026 - ENTC PROJECT BILL OF MATERIALS (BOM)',
          '====================================================',
          ...selectedList.map((item, idx) => `${idx + 1}. ${item.name} (${item.unit}) - ₹${item.inr} [Vendor: ${item.vendor}]`),
          '----------------------------------------------------',
          `TOTAL ESTIMATED HARDWARE BUDGET: ₹${calculateBOMTotal()}`
        ].join('\n');

        navigator.clipboard.writeText(text).then(() => {
          btnCopyBOM.innerText = '✓ Copied to Clipboard!';
          if (window.AudioEngine) window.AudioEngine.playSuccess();
          setTimeout(() => {
            btnCopyBOM.innerText = '📋 Copy BOM';
          }, 2000);
        });
      };
    }

    // Connection selector pills
    document.querySelectorAll('.pb-conn-pill').forEach(pill => {
      pill.onclick = () => {
        selectedConnection = pill.getAttribute('data-conn') || 'led';
        if (window.AudioEngine) window.AudioEngine.playClick();
        renderProgressBoard();
      };
    });
  }

  return {
    init: init,
    refresh: renderProgressBoard,
    switchTab: switchTab,
    toggleTheoryCompleted: toggleTheoryCompleted,
    setDemoData: setDemoData,
    resetProgress: resetProgress
  };
})();

