// ============================================================================
// CHAKRAVYUH AI VIBE CODING CHALLENGE - SMART ENTC LEARNING PLATFORM
// AI Assistant Controller: CircuitBot AI - Neural Engineering Mentor
// ============================================================================

window.CircuitBot = (function () {
  const STORAGE_KEY = 'entc_circuitbot_history_v1';
  let activeCategory = 'all'; // 'all', 'hardware', 'firmware', 'telecom', 'troubleshoot'
  let isSpeaking = false;
  let isThinking = false;
  let recognition = null;
  let isListening = false;

  // --------------------------------------------------------------------------
  // KNOWLEDGE BASE (Curated for ENTC Engineering Curriculum)
  // --------------------------------------------------------------------------
  const KNOWLEDGE_BASE = {
    'logic_gates': {
      title: 'Digital Logic Gates Fundamentals',
      category: 'hardware',
      triggers: ['logic gate', 'logic gates', 'explain logic gates', 'and gate', 'or gate', 'not gate', 'xor gate', 'nand', 'nor'],
      response: `### 🔀 Digital Logic Gates: The Building Blocks of Computing

Logic gates are physical electronic circuits that perform **Boolean algebra operations** using binary electrical voltage signals:
- **Logic 0 (LOW):** $0.0\\text{ V} \\text{ to } 0.8\\text{ V}$ (Ground)
- **Logic 1 (HIGH):** $2.4\\text{ V} \\text{ to } 5.0\\text{ V}$ (VCC)

---

#### 1. Truth Tables of Core Logic Gates

| Gate Type | Boolean Expression | Output is HIGH (1) when... | Standard IC |
|:---|:---|:---|:---|
| **AND** | $Y = A \\cdot B$ | Both inputs $A$ AND $B$ are $1$ | 74LS08 |
| **OR** | $Y = A + B$ | Either $A$ OR $B$ (or both) are $1$ | 74LS32 |
| **NOT** | $Y = \\bar{A}$ | Input is $0$ (Logical Inverter) | 74LS04 |
| **XOR** | $Y = A \\oplus B$ | Inputs are DIFFERENT (Parity Checker) | 74LS86 |
| **NAND** | $Y = \\overline{A \\cdot B}$ | Any input is $0$ (Universal Gate) | 74LS00 |
| **NOR** | $Y = \\overline{A + B}$ | Both inputs are $0$ (Universal Gate) | 74LS02 |

---

#### 2. Why Are NAND and NOR Called "Universal Gates"?
You can build **ANY digital circuit** (adders, flip-flops, multiplexers, ALUs, memory) using solely NAND gates or solely NOR gates. 
*Example: Connecting both inputs of a NAND gate together creates a NOT gate ($A \\cdot A = A \\rightarrow \\bar{A}$).*

> 💡 **Quick Experiment Tip:** You can test live AND, OR, NOT, and XOR gates in real-time on our Virtual Lab!`,
      followups: [
        { label: '⚡ Test in Virtual Lab', action: 'lab_and' },
        { label: 'Difference between TTL and CMOS?', query: 'Difference between TTL and CMOS logic' },
        { label: 'How to build Half Adder with XOR?', query: 'How to build Half Adder using XOR and AND gate' }
      ]
    },

    'arduino': {
      title: 'Arduino Architecture & Embedded Prototyping',
      category: 'firmware',
      triggers: ['arduino', 'what is arduino', 'arduino uno', 'atmega328p', 'microcontroller basics'],
      response: `### ⚡ What is Arduino?

**Arduino** is an open-source embedded electronics prototyping platform consisting of physical programmable microcontrollers (hardware) and a unified C/C++ development environment (IDE).

---

#### 1. Hardware Architecture (Arduino Uno R3)
- **Core Microcontroller:** ATmega328P (8-bit AVR RISC architecture)
- **Clock Speed:** 16 MHz crystal oscillator ($62.5\\text{ ns}$ per clock tick)
- **Operating Voltage:** $5.0\\text{ V}$ ($7-12\\text{ V}$ input on DC barrel jack)
- **Memory Structure:**
  - **32 KB Flash:** Stores your compiled program code
  - **2 KB SRAM:** Volatile runtime variables & stack
  - **1 KB EEPROM:** Non-volatile memory for configuration values
- **I/O Capabilities:**
  - 14 Digital Pins (Pins 3, 5, 6, 9, 10, 11 support hardware PWM)
  - 6 Analog Inputs (Pins A0 to A5 with 10-bit Successive Approximation ADC)

---

#### 2. Core Firmware Structure

\`\`\`cpp
// 1. Setup runs once when MCU boots or resets
void setup() {
  pinMode(13, OUTPUT);      // Configure Pin 13 as digital output
  Serial.begin(9600);       // Initialize UART serial console
  Serial.println("System Initialized!");
}

// 2. Loop runs continuously forever
void loop() {
  digitalWrite(13, HIGH);   // Send +5V to LED
  delay(1000);              // Wait 1 second (1000 ms)
  digitalWrite(13, LOW);    // Send 0V to LED
  delay(1000);              // Wait 1 second
}
\`\`\`

> 💡 **Pro-Tip:** Never use long \`delay()\` in production firmware because it blocks the CPU. Use \`millis()\` timing for non-blocking state machines!`,
      followups: [
        { label: 'How does PWM work?', query: 'Explain PWM pulse width modulation in Arduino' },
        { label: 'Difference between Arduino and ESP32?', query: 'Difference between Arduino Uno and ESP32' },
        { label: 'Troubleshoot LED circuit', query: 'Troubleshoot LED circuit' }
      ]
    },

    'iot': {
      title: 'Internet of Things (IoT) Architecture & Protocols',
      category: 'telecom',
      triggers: ['iot', 'explain iot', 'internet of things', 'mqtt', 'esp8266', 'esp32 iot'],
      response: `### 📡 Internet of Things (IoT) Demystified

The **Internet of Things (IoT)** connects physical devices (sensors, actuators, controllers) to local networks and cloud servers, enabling autonomous data collection, real-time telemetry, and remote automation.

---

#### 1. The 4-Layer IoT Architectural Stack

1. **Perception / Edge Layer:** Sensors (LM35 temp, DHT11 humidity, PIR motion) and actuators (relays, motors) interfaced to microcontrollers.
2. **Network / Transport Layer:** Transmits data using Wi-Fi (802.11 b/g/n), Bluetooth BLE, LoRaWAN (up to 15 km range), Zigbee, or NB-IoT.
3. **Middleware / Broker Layer:** Cloud servers running MQTT brokers (Eclipse Mosquitto, HiveMQ, AWS IoT Core) or HTTP REST endpoints.
4. **Application / Analytics Layer:** Student dashboards, smartphone apps, database logging, and AI predictive maintenance.

---

#### 2. Key Protocol Comparison: MQTT vs HTTP

| Metric | MQTT (Message Queuing Telemetry Transport) | HTTP / REST API |
|:---|:---|:---|
| **Paradigm** | Publish / Subscribe via central Broker | Client / Server Request-Response |
| **Header Size** | Minimal ($\approx 2\\text{ bytes}$) | Large ($\approx 200-800\\text{ bytes}$) |
| **Power Consumption** | Extremely low (perfect for batteries) | High (requires frequent connection handshakes) |
| **Quality of Service** | QoS 0 (At most once), QoS 1, QoS 2 | Standard TCP ACK |
| **Best Used For** | Real-time sensor feeds, IoT telemetry | Web pages, file downloads, bulk batches |

> 💡 **Industry Standard:** 90% of industrial IoT networks rely on MQTT over TCP port 1883 or encrypted port 8883 (TLS/SSL).`,
      followups: [
        { label: 'Difference between UART and SPI', query: 'Difference between UART and SPI' },
        { label: 'What is LoRaWAN?', query: 'Explain LoRaWAN architecture and range' },
        { label: 'View IoT Projects', action: 'view_projects' }
      ]
    },

    'uart_spi': {
      title: 'Serial Communication: UART vs SPI vs I2C',
      category: 'telecom',
      triggers: ['uart and spi', 'difference between uart and spi', 'uart vs spi', 'spi vs i2c', 'serial protocols'],
      response: `### 🔄 Serial Protocols: UART vs SPI vs I2C

Microcontrollers constantly need to exchange data with peripheral sensors, displays, and coprocessors. Here is how the three dominant embedded serial protocols compare:

---

#### 1. In-Depth Comparison Table

| Parameter | UART (Asynchronous) | SPI (Serial Peripheral Interface) | I2C (Inter-Integrated Circuit) |
|:---|:---|:---|:---|
| **Wire Count** | 2 Wires (TX, RX) | 4 Wires (MOSI, MISO, SCK, CS) | 2 Wires (SDA, SCL) |
| **Clocking** | Asynchronous (Shared Baud Rate) | Synchronous (Shared Master SCK) | Synchronous (Shared Master SCL) |
| **Transmission Speed** | Moderate ($9600\\text{ bps to } 2\\text{ Mbps}$) | Very Fast ($10\\text{ Mbps to } 50+\\text{ Mbps}$) | Standard ($100\\text{ kbps to } 3.4\\text{ Mbps}$) |
| **Bus Topology** | Point-to-Point (Only 2 devices) | 1 Master to Many Slaves (via CS pins) | Multi-Master, Multi-Slave (7-bit address) |
| **Complexity** | Simple, hardware FIFO buffers | High pin count, but ultra-low CPU overhead | Requires pull-up resistors ($4.7\\text{ k}\\Omega$) |
| **Ideal Devices** | GPS modules, Bluetooth HC-05, PC terminal | High-res TFT displays, SD cards, Flash | OLED screens, Real-Time Clocks, IMUs |

---

#### 2. Key Takeaway Rule of Thumb
- Use **UART** when communicating with a computer terminal or an external radio modem where only 2 wires are practical.
- Use **SPI** when speed is paramount (e.g. streaming graphical frames to an LCD or logging high-speed sensor samples to an SD card).
- Use **I2C** when conserving microcontroller I/O pins while talking to multiple onboard sensors.`,
      followups: [
        { label: 'Explain I2C Pull-Up Resistors', query: 'Why does I2C need pull-up resistors?' },
        { label: 'What is Baud Rate?', query: 'What is Baud Rate and how to calculate frame error?' },
        { label: 'What is Arduino?', query: 'What is Arduino?' }
      ]
    },

    'troubleshoot_led': {
      title: 'Interactive LED Circuit Troubleshooting Guide',
      category: 'troubleshoot',
      triggers: ['troubleshoot led', 'troubleshoot led circuit', 'led not working', 'fix led circuit', 'led blown'],
      response: `### 🔧 5-Step LED Circuit Troubleshooting Flowchart

If your LED is not lighting up, follow this diagnostic checklist in order:

---

#### Step 1: Check Diode Polarity (Cathode vs Anode)
LEDs are semiconductor diodes that only conduct current in the forward direction:
- **Anode (+):** The longer lead or the lead connected to the smaller internal triangular anvil. Connect to the **positive voltage / GPIO pin**.
- **Cathode (-):** The shorter lead or the flat edge on the plastic epoxy lens rim. Connect to **Ground (0V)**.
*If reversed, the diode simply blocks current. Flip the LED 180°.*

---

#### Step 2: Verify Series Resistor Calculation (Ohm's Law)
Never connect an LED directly to 5V without a current-limiting resistor!
$$R = \\frac{V_{supply} - V_{forward}}{I_{target}}$$
- For a standard **Cyan/Red LED** ($V_f \\approx 2.0\\text{ V}$, $I = 18\\text{ mA}$):
$$R = \\frac{5.0\\text{ V} - 2.0\\text{ V}}{0.018\\text{ A}} = 166.7\\ \\Omega \\longrightarrow \\text{Use } 220\\ \\Omega$$
*If the resistor is too high (e.g., $100\\text{ k}\\Omega$), the LED will be too dim to see.*
*If the resistor is $< 47\\ \\Omega$, the LED will overheat and burn out within seconds.*

---

#### Step 3: Multimeter Voltage Rail Test
1. Set digital multimeter to **DC Voltage (20V range)**.
2. Place the black probe on GND and the red probe on the power rail.
3. If voltage reads $0.0\\text{ V}$, check your breadboard split power rails (many breadboards have a break in the middle of the bus line).

---

#### Step 4: Verify Firmware Pin Configuration
If driving the LED from an Arduino or MCU pin:
\`\`\`cpp
// You MUST set pin mode to OUTPUT in setup()!
// If left as default INPUT, pin impedance is 100 Megohms, yielding only ~0.05 mA.
pinMode(13, OUTPUT);
digitalWrite(13, HIGH);
\`\`\`

---

#### Step 5: Test Diode for Permanent Thermal Burnout
Turn the multimeter dial to the **Diode Test symbol (▶|)**:
- Connect Red to Anode, Black to Cathode.
- A functional LED will faintly glow and the multimeter will display forward voltage ($\approx 1.8\\text{V} - 2.8\\text{V}$).
- If it displays **OL (Open Loop)** in both directions, the internal bonding wire has melted. Replace the LED.`,
      followups: [
        { label: '⚡ Test in Virtual Lab', action: 'lab_led' },
        { label: 'Check Component Pricing (₹ INR)', action: 'view_pricing' },
        { label: 'Explain Ohm\'s Law Simply', query: 'Explain Ohms Law simply with examples' }
      ]
    },

    'sensors': {
      title: 'Sensors & Transducers Made Simple',
      category: 'hardware',
      triggers: ['sensors', 'explain sensors simply', 'what is a sensor', 'transducer', 'analog vs digital sensor'],
      response: `### 🌡️ Sensors & Transducers Explained Simply

A **sensor (transducer)** is an electronic organ for machines: it detects a physical environmental property (temperature, light, motion, pressure, sound) and converts it into a measurable electrical signal (voltage, resistance, or digital bytes).

---

#### 1. Core Sensors Used in ENTC Labs

1. **LM35DZ Centigrade Temperature Sensor:**
   - **How it works:** Contains an internal silicon bandgap temperature sensor.
   - **Output:** Calibrated linear voltage of $+10.0\\text{ mV} / ^\\circ\\text{C}$.
   - *Example: At $25.0^\\circ\\text{C}$ room temp, output pin reads $0.250\\text{ V}$. At $50^\\circ\\text{C}$, it reads $0.500\\text{ V}$.*

2. **LDR (Light Dependent Resistor):**
   - **How it works:** Cadmium-Sulfide photoresistor. Photons strike the semiconductor, releasing free electrons.
   - **Resistance:** Drops from $> 1\\text{ M}\\Omega$ in total darkness down to $< 500\\ \\Omega$ in bright sunlight.
   - *Must be paired with a $10\\text{ k}\\Omega$ resistor in a voltage divider to read as a voltage on an analog pin!*

3. **HC-SR501 PIR Motion Detector:**
   - **How it works:** Senses thermal infrared radiation ($9.4\\ \\mu\\text{m}$) emitted by warm human bodies.
   - **Output:** Latches a digital HIGH ($3.3\\text{ V}$) pulse when motion crosses its faceted Fresnel lens.

4. **HC-SR04 Ultrasonic Sonar:**
   - **How it works:** Emits a $40\\text{ kHz}$ ultrasonic burst and measures echo return time ($t$).
   - **Formula:** $\\text{Distance (cm)} = \\frac{t \\times 0.0343\\text{ cm/}\\mu\\text{s}}{2}$

---

#### 2. Analog vs Digital Sensors

| Property | Analog Sensor (LM35, LDR, Potentiometer) | Digital Sensor (DHT11, BME280, MPU6050) |
|:---|:---|:---|
| **Signal Type** | Continuous voltage ($0.0\\text{ V} \\text{ to } 5.0\\text{ V}$) | Serial bit packets (I2C, SPI, 1-Wire) |
| **MCU Pin** | Requires ADC pin (e.g. Arduino A0) | Requires Digital GPIO / Bus pins |
| **Noise Immunity** | Sensitive to wire length and EMI | High (checksum error detection) |

> 💡 **Experiment with Live Sensors:** Open the Virtual Lab to drag the temperature and ambient lux sliders!`,
      followups: [
        { label: '⚡ Test LM35 in Virtual Lab', action: 'lab_lm35' },
        { label: '⚡ Test LDR in Virtual Lab', action: 'lab_ldr' },
        { label: 'Difference between Active & Passive Sensors?', query: 'Difference between Active and Passive sensors' }
      ]
    },

    'nyquist': {
      title: 'Nyquist-Shannon Sampling Theorem',
      category: 'telecom',
      triggers: ['nyquist', 'sampling theorem', 'aliasing', 'nyquist rate', 'dsp sampling'],
      response: `### 📈 Nyquist-Shannon Sampling Theorem

The fundamental law bridging continuous analog reality (voice, radio signals, sound waves) to the discrete digital world of computers:

---

#### 1. The Core Principle
To perfectly capture and reconstruct a continuous analog band-limited signal without **aliasing distortion**, the sampling frequency ($f_s$) must be **at least twice** the highest frequency component ($f_{max}$) present in the signal:

$$f_s \\ge 2 \\cdot f_{max}$$

- **Nyquist Rate:** Exactly $2 \\cdot f_{max}$
- **Nyquist Frequency (Folding Frequency):** $\\frac{f_s}{2}$

---

#### 2. Practical Real-World Example: CD Audio
- The maximum frequency the human ear can detect is approximately $20\\text{ kHz}$ ($f_{max} = 20,000\\text{ Hz}$).
- By Nyquist theorem: $f_s \\ge 2 \\times 20,000 = 40,000\\text{ Hz}$.
- Audio engineers selected **$44.1\\text{ kHz}$** (allowing room for real-world analog anti-aliasing reconstruction filters).

---

#### 3. What Happens If You Undersample? ($f_s < 2 f_{max}$)
High frequencies "fold over" into the low-frequency spectrum, creating ghost frequencies and permanent audio harshness / image distortion known as **Aliasing**.
*Solution: Always insert an analog low-pass Anti-Aliasing Filter before the ADC!*`,
      followups: [
        { label: 'Explain Fourier Transform (FFT)', query: 'Explain Fast Fourier Transform simply' },
        { label: 'What is Shannon Channel Capacity?', query: 'Explain Shannon Hartley theorem for channel capacity' },
        { label: 'Explain Logic Gates', query: 'Explain Logic Gates' }
      ]
    },

    'timer555': {
      title: 'NE555 Timer in Astable & Monostable Mode',
      category: 'hardware',
      triggers: ['555 timer', 'ne555', 'astable multivibrator', 'timer ic', '555 pinout'],
      response: `### ⏱️ NE555 Timer IC: The Legendary Clock Engine

The **NE555** is the most widely produced integrated circuit in electronics history, capable of operating in Astable (oscillator), Monostable (one-shot timer), and Bistable (flip-flop) modes.

---

#### 1. Internal Working Principle
Inside the 8-pin DIP package:
- **Resistor Ladder:** Three $5\\text{ k}\\Omega$ resistors divide $V_{CC}$ into reference levels of $\\frac{1}{3}V_{CC}$ and $\\frac{2}{3}V_{CC}$.
- **Dual Comparators:** Comparator 1 monitors Threshold (Pin 6); Comparator 2 monitors Trigger (Pin 2).
- **SR Flip-Flop:** Drives the high-current totem-pole output stage (Pin 3 can source or sink up to $200\\text{ mA}$) and controls the discharge transistor (Pin 7).

---

#### 2. Astable Mode (Continuous Square Wave Oscillator)
Connect resistor $R_A$ between $V_{CC}$ and Pin 7, $R_B$ between Pin 7 and Pin 6/2, and capacitor $C$ to Ground:
$$T_{HIGH} = 0.693 \\cdot (R_A + R_B) \\cdot C$$
$$T_{LOW} = 0.693 \\cdot R_B \\cdot C$$
$$\\text{Frequency: } f = \\frac{1.44}{(R_A + 2 R_B) \\cdot C}$$

> 💡 **Classic Application:** Connect Pin 3 to a piezoelectric buzzer or flashing LED for a metronome or siren generator!`,
      followups: [
        { label: 'Check 555 Timer Pricing (₹15)', action: 'view_pricing' },
        { label: 'Explain Logic Gates', query: 'Explain Logic Gates' },
        { label: 'What is Arduino?', query: 'What is Arduino?' }
      ]
    }
  };

  // --------------------------------------------------------------------------
  // INITIALIZATION
  // --------------------------------------------------------------------------
  function init() {
    renderInterface();
    bindEvents();
    initSpeechRecognition();
  }

  function getHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  function saveHistory(messages) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {}
  }

  function clearHistory() {
    localStorage.removeItem(STORAGE_KEY);
    renderInterface();
    if (window.AudioEngine) window.AudioEngine.playClick();
  }

  // --------------------------------------------------------------------------
  // UI RENDERER
  // --------------------------------------------------------------------------
  function renderInterface() {
    const stream = document.getElementById('ai-messages-list');
    if (!stream) return;

    const history = getHistory();
    if (history && history.length > 0) {
      stream.innerHTML = history.map(m => renderBubble(m.sender, m.text, m.followups)).join('');
    } else {
      // Welcome Message
      const welcome = {
        sender: 'bot',
        text: `### 🤖 Welcome to CircuitBot AI!

I am your dedicated **ENTC Engineering AI Mentor**, specialized in:
- **Digital Logic & Microprocessors** (Boolean algebra, 7400 series ICs, state machines)
- **Embedded Systems & Firmware** (ATmega328P, Arduino C++, register operations, timers)
- **IoT & Wireless Telecommunications** (MQTT, ESP8266/ESP32, modulation, protocols)
- **Circuit Troubleshooting & Component Pinouts** (Ohm's law, diagnostics, oscilloscope analysis)

Tap any prompt pill below or type your hardware question to get started!`,
        followups: [
          { label: '🔀 Explain Logic Gates', query: 'Explain Logic Gates' },
          { label: '⚡ What is Arduino?', query: 'What is Arduino?' },
          { label: '📡 Explain IoT', query: 'Explain IoT' },
          { label: '🔄 UART vs SPI', query: 'Difference between UART and SPI' },
          { label: '🔧 Troubleshoot LED circuit', query: 'Troubleshoot LED circuit' },
          { label: '🌡️ Explain sensors simply', query: 'Explain sensors simply' }
        ]
      };
      stream.innerHTML = renderBubble(welcome.sender, welcome.text, welcome.followups);
      saveHistory([welcome]);
    }

    scrollToBottom();
  }

  function renderBubble(sender, markdown, followups) {
    const isBot = sender === 'bot';
    const htmlContent = formatMarkdown(markdown);

    return `
      <div class="ai-msg-bubble ${isBot ? 'msg-bot' : 'msg-user'}">
        <div class="msg-avatar ${isBot ? '' : 'user-avatar'}">
          ${isBot ? '🤖' : '👨‍💻'}
        </div>
        <div class="msg-content-body">
          <div class="msg-author">
            <span>${isBot ? 'CircuitBot AI' : 'Engineering Student'}</span>
            ${isBot ? '<span class="badge-bot">ENTC SPECIALIST</span>' : ''}
          </div>
          <div class="msg-text-markdown">
            ${htmlContent}
          </div>
          ${isBot && followups && followups.length > 0 ? `
            <div class="msg-chips-wrap">
              ${followups.map(f => `
                <button class="followup-chip" data-query="${f.query || ''}" data-action="${f.action || ''}">
                  ${f.label}
                </button>
              `).join('')}
            </div>
          ` : ''}
          ${isBot ? `
            <div class="d-flex align-center gap-2 mt-2 pt-2 border-top border-glass text-xs text-dim">
              <button class="btn btn-xs btn-outline-glass text-muted btn-tts" title="Read Aloud with Voice Synthesis">
                🔊 Listen
              </button>
              <button class="btn btn-xs btn-outline-glass text-muted btn-copy-msg" title="Copy text to clipboard">
                📋 Copy
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // MARKDOWN & LATEX TO CLEAN HTML FORMATTER
  // --------------------------------------------------------------------------
  function formatMarkdown(text) {
    if (!text) return '';

    let out = text.replace(/[&<>"']/g, (character) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character]);

    // Convert code blocks
    out = out.replace(/```([a-zA-Z0-9]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      const cleanCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<div class="ai-code-block"><div class="text-xs font-mono text-dim mb-1" style="text-transform:uppercase;">${lang || 'Code'}</div><pre><code>${cleanCode}</code></pre></div>`;
    });

    // Convert inline code
    out = out.replace(/`([^`]+)`/g, '<code class="ai-inline-code">$1</code>');

    // Convert Headings
    out = out.replace(/^### (.*$)/gim, '<h3 class="ai-h3">$1</h3>');
    out = out.replace(/^#### (.*$)/gim, '<h4 class="ai-h4">$1</h4>');

    // Convert blockquotes
    out = out.replace(/^> (.*$)/gim, '<div class="ai-quote">$1</div>');

    // Convert Markdown Tables
    out = out.replace(/\|(.+)\|\n\|[-:| ]+\|\n((?:\|.+\|\n?)+)/g, (match, header, body) => {
      const headers = header.split('|').filter(h => h.trim()).map(h => `<th>${h.trim()}</th>`).join('');
      const rows = body.trim().split('\n').map(row => {
        const cells = row.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('');
        return `<tr>${cells}</tr>`;
      }).join('');
      return `<table class="ai-table"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
    });

    // Convert Bold & Italic
    out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Convert math expressions ($...$) to clean Unicode mathematical typography
    out = out.replace(/\$\$([\s\S]*?)\$\$/g, (m, math) => {
      return `<div class="font-mono text-cyan p-2 my-2" style="background:rgba(0,242,254,0.06); border-radius:8px; text-align:center; font-size:1.05rem;">${cleanMath(math)}</div>`;
    });
    out = out.replace(/\$([^$\n]+)\$/g, (m, math) => {
      return `<span class="font-mono text-cyan">${cleanMath(math)}</span>`;
    });

    // Convert line breaks and bullet lists
    out = out.replace(/^\- (.*$)/gim, '<li style="margin-left: 1.25rem; margin-bottom: 0.35rem;">$1</li>');
    out = out.replace(/\n\n/g, '<br><br>');

    return out;
  }

  function cleanMath(raw) {
    return raw
      .replace(/\\cdot/g, ' · ')
      .replace(/\\times/g, ' × ')
      .replace(/\\ge/g, ' ≥ ')
      .replace(/\\le/g, ' ≤ ')
      .replace(/\\approx/g, ' ≈ ')
      .replace(/\\oplus/g, ' ⊕ ')
      .replace(/\\overline{([^}]+)}/g, '$1̅')
      .replace(/\\bar{([^}]+)}/g, '$1̅')
      .replace(/\\frac{([^}]+)}{([^}]+)}/g, '($1 / $2)')
      .replace(/\\mu/g, 'μ')
      .replace(/\\Omega/g, 'Ω')
      .replace(/\\text{([^}]+)}/g, '$1')
      .replace(/\\longrightarrow/g, ' ➔ ')
      .replace(/\\rightarrow/g, ' → ')
      .replace(/\\/g, '');
  }

  // --------------------------------------------------------------------------
  // AI QUERY RESOLVER
  // --------------------------------------------------------------------------
  function resolveQuery(rawPrompt) {
    const prompt = rawPrompt.toLowerCase().trim();

    // Match exact triggers
    for (const key in KNOWLEDGE_BASE) {
      const entry = KNOWLEDGE_BASE[key];
      for (const trigger of entry.triggers) {
        if (prompt.includes(trigger)) {
          return entry;
        }
      }
    }

    // Secondary semantic checks
    if (prompt.includes('led') || prompt.includes('resistor') || prompt.includes('burnout')) {
      return KNOWLEDGE_BASE['troubleshoot_led'];
    }
    if (prompt.includes('sensor') || prompt.includes('transducer') || prompt.includes('lm35') || prompt.includes('ldr')) {
      return KNOWLEDGE_BASE['sensors'];
    }
    if (prompt.includes('gate') || prompt.includes('boolean') || prompt.includes('truth table')) {
      return KNOWLEDGE_BASE['logic_gates'];
    }
    if (prompt.includes('arduino') || prompt.includes('mcu') || prompt.includes('code') || prompt.includes('firmware')) {
      return KNOWLEDGE_BASE['arduino'];
    }
    if (prompt.includes('iot') || prompt.includes('cloud') || prompt.includes('mqtt') || prompt.includes('wireless')) {
      return KNOWLEDGE_BASE['iot'];
    }
    if (prompt.includes('uart') || prompt.includes('spi') || prompt.includes('i2c') || prompt.includes('baud')) {
      return KNOWLEDGE_BASE['uart_spi'];
    }
    if (prompt.includes('sampling') || prompt.includes('nyquist') || prompt.includes('frequency') || prompt.includes('aliasing')) {
      return KNOWLEDGE_BASE['nyquist'];
    }
    if (prompt.includes('555') || prompt.includes('timer') || prompt.includes('oscillator')) {
      return KNOWLEDGE_BASE['timer555'];
    }

    // Intelligent Fallback with broad ENTC domain knowledge
    return {
      title: 'ENTC Engineering Guidance',
      category: 'hardware',
      response: `### 🔍 Analysis of: "${rawPrompt}"

In Electronics & Telecommunication Engineering, this relates to **circuit theory and signal interfacing**:

- **Signal Integrity:** Ensure power rails are decoupled with a $100\\text{ nF}$ ceramic capacitor close to IC power pins to filter high-frequency switching noise.
- **Impedance Matching:** Transmission lines require matched load impedances ($Z_0 \\approx 50\\ \\Omega$) to eliminate reflected standing waves ($SWR = 1.0$).
- **Microcontroller Pin Safety:** Keep maximum current per pin $\\le 20\\text{ mA}$ ($40\\text{ mA}$ absolute limit). Use transistor drivers (2N2222 or MOSFET) for inductive relays and motors.

*Would you like to explore a detailed simulation, inspect component pricing, or review diagnostic steps?*`,
      followups: [
        { label: '🔀 Explain Logic Gates', query: 'Explain Logic Gates' },
        { label: '⚡ What is Arduino?', query: 'What is Arduino?' },
        { label: '🔧 Troubleshoot LED circuit', query: 'Troubleshoot LED circuit' },
        { label: '💰 View Component Pricing', action: 'view_pricing' }
      ]
    };
  }

  // --------------------------------------------------------------------------
  // USER SUBMIT HANDLER & STREAMING TYPEWRITER
  // --------------------------------------------------------------------------
  function submitPrompt(text) {
    if (!text || isThinking) return;

    const stream = document.getElementById('ai-messages-list');
    const input = document.getElementById('ai-input-box');
    if (input) input.value = '';

    // Append user message
    const userMsg = { sender: 'user', text: text, followups: [] };
    const curHistory = getHistory() || [];
    curHistory.push(userMsg);
    saveHistory(curHistory);

    if (stream) {
      stream.innerHTML += renderBubble('user', text, []);
      scrollToBottom();
    }

    if (window.AudioEngine) window.AudioEngine.playClick();

    // Show Typing Indicator
    isThinking = true;
    showTypingIndicator();

    setTimeout(() => {
      removeTypingIndicator();
      const botAnswer = resolveQuery(text);
      
      const botMsg = {
        sender: 'bot',
        text: botAnswer.response,
        followups: botAnswer.followups || []
      };

      curHistory.push(botMsg);
      saveHistory(curHistory);

      if (stream) {
        stream.innerHTML += renderBubble('bot', botAnswer.response, botAnswer.followups);
        scrollToBottom();
      }

      if (window.AudioEngine) window.AudioEngine.playSuccess();
      isThinking = false;
    }, 650);
  }

  function showTypingIndicator() {
    const stream = document.getElementById('ai-messages-list');
    if (!stream) return;

    const ind = document.createElement('div');
    ind.id = 'ai-typing-indicator';
    ind.className = 'ai-msg-bubble msg-bot';
    ind.innerHTML = `
      <div class="msg-avatar">🤖</div>
      <div class="msg-content-body">
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    stream.appendChild(ind);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const ind = document.getElementById('ai-typing-indicator');
    if (ind) ind.remove();
  }

  function scrollToBottom() {
    const stream = document.getElementById('ai-messages-list');
    if (stream) {
      stream.scrollTop = stream.scrollHeight;
    }
  }

  // --------------------------------------------------------------------------
  // SPEECH SYNTHESIS (VOICE READ-ALOUD)
  // --------------------------------------------------------------------------
  function speakText(text) {
    if (!('speechSynthesis' in window)) {
      alert('Speech Synthesis is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      isSpeaking = false;
      return;
    }

    // Strip markdown formatting for speech
    const cleanSpeech = text
      .replace(/[*#`_\\$]/g, '')
      .replace(/\|.+?\|/g, '')
      .replace(/https?:\/\/\S+/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onstart = () => { isSpeaking = true; };
    utterance.onend = () => { isSpeaking = false; };
    utterance.onerror = () => { isSpeaking = false; };

    window.speechSynthesis.speak(utterance);
  }

  // --------------------------------------------------------------------------
  // SPEECH RECOGNITION (VOICE INPUT MIC)
  // --------------------------------------------------------------------------
  function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        const input = document.getElementById('ai-input-box');
        if (input) input.value = transcript;
        submitPrompt(transcript);
        setMicActive(false);
      };

      recognition.onerror = () => {
        setMicActive(false);
      };

      recognition.onend = () => {
        setMicActive(false);
      };
    }
  }

  function toggleVoiceInput() {
    if (!recognition) {
      alert('Voice dictation is supported in Chrome, Edge, and modern Chromium browsers.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setMicActive(false);
    } else {
      try {
        recognition.start();
        setMicActive(true);
      } catch (e) {
        setMicActive(false);
      }
    }
  }

  function setMicActive(active) {
    isListening = active;
    const btn = document.getElementById('ai-mic-btn');
    if (btn) {
      btn.classList.toggle('active', active);
      btn.style.color = active ? '#ef4444' : '';
      btn.style.boxShadow = active ? '0 0 20px #ef4444' : '';
    }
  }

  // --------------------------------------------------------------------------
  // EVENT BINDINGS
  // --------------------------------------------------------------------------
  function bindEvents() {
    // Form submit
    const form = document.getElementById('ai-chat-form');
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const input = document.getElementById('ai-input-box');
        if (input && input.value.trim()) {
          submitPrompt(input.value.trim());
        }
      };
    }

    // Top prompt pill clicks
    document.querySelectorAll('.ai-prompt-chip').forEach(chip => {
      chip.onclick = () => {
        const query = chip.getAttribute('data-query') || chip.innerText.trim();
        submitPrompt(query);
      };
    });

    // Delegated clicks inside messages (Followup chips, TTS, Copy)
    document.addEventListener('click', (e) => {
      // Followup chip click
      const chip = e.target.closest('.followup-chip');
      if (chip) {
        const query = chip.getAttribute('data-query');
        const action = chip.getAttribute('data-action');

        if (action === 'lab_and') {
          window.location.href = 'lab.html';
        } else if (action === 'lab_led') {
          window.location.href = 'lab.html';
        } else if (action === 'lab_lm35') {
          window.location.href = 'lab.html';
        } else if (action === 'lab_ldr') {
          window.location.href = 'lab.html';
        } else if (action === 'view_pricing') {
          window.location.href = 'progress.html';
        } else if (query) {
          submitPrompt(query);
        }
        return;
      }

      // TTS read aloud
      const ttsBtn = e.target.closest('.btn-tts');
      if (ttsBtn) {
        const bubble = ttsBtn.closest('.msg-content-body');
        if (bubble) {
          const text = bubble.querySelector('.msg-text-markdown').innerText;
          speakText(text);
          ttsBtn.innerText = isSpeaking ? '⏹ Stop' : '🔊 Listen';
        }
        return;
      }

      // Copy message
      const copyBtn = e.target.closest('.btn-copy-msg');
      if (copyBtn) {
        const bubble = copyBtn.closest('.msg-content-body');
        if (bubble) {
          const text = bubble.querySelector('.msg-text-markdown').innerText;
          navigator.clipboard.writeText(text).then(() => {
            copyBtn.innerText = '✓ Copied!';
            setTimeout(() => { copyBtn.innerText = '📋 Copy'; }, 2000);
          });
        }
        return;
      }
    });

    // Clear chat history button
    const clearBtn = document.getElementById('ai-clear-chat-btn');
    if (clearBtn) {
      clearBtn.onclick = clearHistory;
    }

    // Voice dictation mic button
    const micBtn = document.getElementById('ai-mic-btn');
    if (micBtn) {
      micBtn.onclick = toggleVoiceInput;
    }
  }

  return {
    init: init,
    submitPrompt: submitPrompt,
    clearHistory: clearHistory
  };
})();

