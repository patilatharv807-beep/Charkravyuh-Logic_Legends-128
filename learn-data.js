// ============================================================================
// CHAKRAVYUH AI VIBE CODING CHALLENGE - SMART ENTC LEARNING PLATFORM
// Curriculum & Topic Data: Clean, Simple & Beginner-Friendly Equations
// ============================================================================

window.ENTC_LEARN_DATA = [
  {
    id: "digital-electronics",
    title: "Digital Electronics",
    category: "Hardware & Logic",
    level: "Beginner to Intermediate",
    duration: "45 mins",
    icon: "cpu",
    accent: "#00f2fe",
    gradient: "from-cyan-500 to-blue-600",
    tags: ["Binary Logic", "Boolean Algebra", "K-Maps", "Flip-Flops"],
    summary: "Master binary systems, Boolean algebra, Karnaugh maps (K-Maps), flip-flops, and sequential digital circuits.",
    overview: "Digital electronics forms the foundation of modern computing. While analog systems process continuously varying voltages vulnerable to electrical noise, digital circuits operate on two discrete voltage thresholds: Logic 0 (LOW, 0V) and Logic 1 (HIGH, 3.3V or 5V). By connecting semiconductor MOSFET transistors, engineers build microprocessors, memory registers, and arithmetic units.",
    keyConcepts: [
      {
        title: "Binary Logic & Voltage Margins",
        desc: "In 5V TTL systems, voltages between 0V–0.8V represent Logic 0, and 2.0V–5.0V represent Logic 1. The gap in between protects signals from random electrical noise."
      },
      {
        title: "Boolean Algebra & Gate Minimization",
        desc: "Boolean algebra lets engineers simplify complex logic circuits into fewer physical transistors, reducing chip cost, power draw, and heat."
      },
      {
        title: "Karnaugh Maps (K-Maps)",
        desc: "A simple visual grid method used to group adjacent 1s in Gray code order, eliminating redundant gate terms without complex algebra."
      },
      {
        title: "Combinational vs Sequential Logic",
        desc: "Combinational circuits (Adders, Multiplexers) depend only on current inputs. Sequential circuits (Flip-Flops, Counters) have memory loops driven by a clock pulse."
      }
    ],
    formulae: [
      { 
        name: "De Morgan's Theorem 1", 
        formula: "NOT(A AND B) = (NOT A) OR (NOT B)",
        plain: "(A · B)' = A' + B'",
        meaning: "A NAND gate is logically equivalent to an OR gate with inverted inputs."
      },
      { 
        name: "De Morgan's Theorem 2", 
        formula: "NOT(A OR B) = (NOT A) AND (NOT B)",
        plain: "(A + B)' = A' · B'",
        meaning: "A NOR gate is logically equivalent to an AND gate with inverted inputs."
      },
      { 
        name: "D Flip-Flop Memory", 
        formula: "Q(next) = D",
        plain: "Next State = Input D at Clock Edge",
        meaning: "Stores 1 bit of memory: output latches to input D whenever clock pulses."
      },
      { 
        name: "K-Map Cell Capacity", 
        formula: "Total Cells = 2ⁿ",
        plain: "Cells = 2 raised to number of inputs (n)",
        meaning: "A 4-variable logic circuit needs a 2⁴ = 16-cell grid."
      }
    ],
    interactiveType: "binary-converter",
    realWorldApps: [
      { name: "ALU in Computer CPUs", desc: "Performs billions of binary additions, bit shifts, and comparisons per second in Intel, AMD, and smartphone chips." },
      { name: "Hardware Cryptography Engines", desc: "XOR feedback registers executing hardware-accelerated AES-256 encryption in bank cards and payment terminals." },
      { name: "FPGAs & ASIC Chips", desc: "Reconfigurable digital gate matrices accelerating machine learning vision in autonomous electric cars." }
    ],
    quiz: [
      {
        q: "What is the simplified form of A + A'B according to Boolean algebra rules?",
        options: ["A + B", "A · B", "A'", "B'"],
        answer: 0,
        explanation: "By Distributive Law: A + A'B = (A + A')(A + B) = 1 · (A + B) = A + B."
      },
      {
        q: "Which sequential element changes its state precisely on the clock edge transition rather than a voltage level?",
        options: ["Flip-Flop", "Latch", "Multiplexer", "Encoder"],
        answer: 0,
        explanation: "A Flip-Flop is synchronous and edge-triggered (rising or falling clock edge), whereas a basic latch is asynchronous and level-sensitive."
      },
      {
        q: "How many cells are present in a 4-variable Karnaugh Map (K-Map)?",
        options: ["8", "16", "32", "64"],
        answer: 1,
        explanation: "For n input variables, a K-Map contains 2^n cells. For 4 variables (A, B, C, D), 2^4 = 16 cells arranged in a 4x4 matrix."
      }
    ]
  },
  {
    id: "logic-gates",
    title: "Logic Gates",
    category: "Core Electronics",
    level: "Beginner",
    duration: "30 mins",
    icon: "git-merge",
    accent: "#a855f7",
    gradient: "from-purple-500 to-indigo-600",
    tags: ["AND / OR / NOT", "NAND / NOR", "XOR Parity", "CMOS Logic"],
    summary: "Explore fundamental logic gates, truth tables, universal gate implementations, and propagation delay characteristics.",
    overview: "Logic gates are the basic semiconductor building blocks of digital integrated circuits. Constructed with pairs of PMOS and NMOS transistors, gates evaluate basic logical conditions. NAND and NOR gates are recognized as 'Universal Gates' because every computer component—from an adder to a full processor—can be built using only NAND or only NOR gates.",
    keyConcepts: [
      {
        title: "AND, OR, and NOT Gates",
        desc: "AND outputs 1 only when BOTH inputs are 1. OR outputs 1 when ANY input is 1. NOT (Inverter) simply flips 1 to 0, and 0 to 1."
      },
      {
        title: "Universal Gates: NAND & NOR",
        desc: "NAND = NOT(AND) and NOR = NOT(OR). These are cheaper to manufacture in silicon and can build any other gate."
      },
      {
        title: "Exclusive-OR (XOR) Gate",
        desc: "XOR outputs 1 when inputs are DIFFERENT (odd parity). Used extensively in binary addition and data error detection."
      },
      {
        title: "Propagation Delay",
        desc: "The microscopic fraction of a nanosecond it takes for the electrical output to change after an input switches."
      }
    ],
    formulae: [
      { 
        name: "AND Gate Logic", 
        formula: "Output Y = A · B",
        plain: "HIGH only when A = 1 AND B = 1",
        meaning: "Like two electrical switches wired in series: both must be ON."
      },
      { 
        name: "OR Gate Logic", 
        formula: "Output Y = A + B",
        plain: "HIGH if A = 1 OR B = 1 (or both)",
        meaning: "Like two electrical switches wired in parallel: either one powers the circuit."
      },
      { 
        name: "XOR (Exclusive OR)", 
        formula: "Output Y = A ⊕ B",
        plain: "HIGH when inputs are DIFFERENT (0,1 or 1,0)",
        meaning: "Detects mismatches between two data lines; outputs 0 when inputs match."
      },
      { 
        name: "NAND Universal Logic", 
        formula: "Output Y = NOT(A · B)",
        plain: "LOW only when BOTH inputs are 1; otherwise HIGH",
        meaning: "The most widely used logic gate in modern microchips."
      }
    ],
    interactiveType: "gate-tester",
    realWorldApps: [
      { name: "Safety Interlock Systems", desc: "NAND/AND gate logic ensures factory stamping presses operate only when safety doors are closed AND both operator buttons are pressed." },
      { name: "Memory Address Decoders", desc: "Decodes binary address bus lines to select individual storage cells in computer RAM." },
      { name: "Parity Bit Checking", desc: "XOR gate trees calculating parity bits to detect bit-flip transmission errors in space communications." }
    ],
    quiz: [
      {
        q: "Why are NAND and NOR gates classified as 'Universal Gates'?",
        options: [
          "They can be used to construct any other Boolean function or gate",
          "They operate without any DC electrical power",
          "They can only process analog sine waves",
          "They do not use semiconductor transistors"
        ],
        answer: 0,
        explanation: "Universal gates can replicate NOT, AND, OR, XOR, and all complex combinational circuits without requiring any other gate types."
      },
      {
        q: "What is the output of a 2-input XOR gate when both inputs A and B are HIGH (1)?",
        options: ["0 (LOW)", "1 (HIGH)", "High-Impedance", "Undefined"],
        answer: 0,
        explanation: "XOR produces 1 only when inputs differ. When A=1 and B=1, they are identical, producing output Y = 0."
      },
      {
        q: "In CMOS integrated circuit design, why are NAND gates preferred over NOR gates?",
        options: [
          "Electrons have higher carrier mobility than holes, making series NMOS faster",
          "NAND gates consume 10x more power",
          "NOR gates cannot operate below 100°C",
          "NAND gates require zero silicon area"
        ],
        answer: 0,
        explanation: "In CMOS NAND, NMOS transistors are in series. Because electron mobility in NMOS is 2-3x higher than hole mobility in PMOS, NAND provides lower on-resistance and faster propagation delay."
      }
    ]
  },
  {
    id: "arduino",
    title: "Arduino & Prototyping",
    category: "Embedded Systems",
    level: "Beginner to Intermediate",
    duration: "40 mins",
    icon: "terminal",
    accent: "#06b6d4",
    gradient: "from-cyan-400 to-teal-500",
    tags: ["ATmega328P", "GPIO Registers", "PWM Signals", "10-bit ADC"],
    summary: "Understand microcontroller architecture, ATmega328P, GPIO pinouts, PWM signals, and analog-to-digital conversion.",
    overview: "Arduino simplified hardware prototyping by combining the Atmel AVR ATmega328P microcontroller with an open-source C/C++ runtime. Students learn how microcontrollers sense the physical world: reading analog voltages with a 10-bit Analog-to-Digital Converter (ADC) and controlling motor speed and LED brightness using Pulse Width Modulation (PWM).",
    keyConcepts: [
      {
        title: "ATmega328P Microcontroller Core",
        desc: "8-bit AVR RISC processor running at 16 MHz with 32 KB Flash memory for code, 2 KB SRAM for variables, and 1 KB EEPROM."
      },
      {
        title: "Digital Pins & Pull-Up Resistors",
        desc: "Pins can be set as INPUT or OUTPUT. Enabling INPUT_PULLUP connects an internal 20kΩ resistor to +5V, preventing electrical floating states."
      },
      {
        title: "10-bit ADC (Analog Input)",
        desc: "Pins A0–A5 convert 0V to 5V analog signals into numbers from 0 to 1023 (about 4.88 millivolts per step)."
      },
      {
        title: "PWM (Pulse Width Modulation)",
        desc: "Simulates variable analog voltages by switching digital pins rapidly at ~490 Hz. Duty cycle (0 to 255) controls motor speed or LED brightness."
      }
    ],
    formulae: [
      { 
        name: "ADC Voltage Conversion", 
        formula: "Voltage = (ADC Value × 5.0V) / 1024",
        plain: "Voltage = Reading × 0.00488 Volts",
        meaning: "Converts the raw 0–1023 sensor number from pin A0 into actual physical Volts."
      },
      { 
        name: "PWM Average Output Voltage", 
        formula: "V(avg) = 5.0V × (Duty Cycle / 255)",
        plain: "For analogWrite(9, 127): V(avg) ≈ 2.5 Volts (50%)",
        meaning: "A 50% duty cycle delivers half power to motors or LEDs."
      },
      { 
        name: "LED Current-Limiting Resistor", 
        formula: "Resistor (R) = (Vcc - Vf) / I(led)",
        plain: "R = (5V - 2V) / 0.015A = 200 Ω (Use 220 Ω)",
        meaning: "Mandatory resistor required in series with an LED so it does not burn out."
      },
      { 
        name: "ADC Resolution Step Size", 
        formula: "Step = Vref / 2ⁿ",
        plain: "Step = 5.0V / 1024 steps ≈ 4.88 mV per step",
        meaning: "Smallest voltage difference the Arduino Uno can detect."
      }
    ],
    interactiveType: "arduino-pin-inspector",
    realWorldApps: [
      { name: "Drone Motor Speed Controllers", desc: "Adjusts quadcopter motor speed hundreds of times per second using PWM signals from PID stabilization loops." },
      { name: "Automated Climate Control", desc: "Monitors humidity and temperature sensors to trigger heating elements and ventilation fans." },
      { name: "Robotic Arm Servo Controllers", desc: "Sends 50Hz PWM position signals to servos for pick-and-place industrial robotics." }
    ],
    quiz: [
      {
        q: "What is the voltage resolution of the Arduino Uno's 10-bit ADC with a 5.0V reference?",
        options: ["~4.88 mV", "~1.22 mV", "~9.76 mV", "~19.5 mV"],
        answer: 0,
        explanation: "5.0V / 1024 discrete steps ≈ 0.0048828 Volts ≈ 4.88 mV per step."
      },
      {
        q: "If analogWrite(9, 127) is executed in Arduino C++, what is the resulting PWM duty cycle?",
        options: ["~50%", "~25%", "~75%", "~100%"],
        answer: 0,
        explanation: "Arduino PWM registers span 0 to 255. 127 / 255 ≈ 49.8% (approximately 50% duty cycle)."
      },
      {
        q: "Why is a series current-limiting resistor mandatory when driving an LED from an Arduino digital pin?",
        options: [
          "To prevent forward current from exceeding the 40mA absolute maximum pin rating and destroying both the LED and MCU",
          "To speed up the velocity of light emission",
          "To convert direct current into alternating current",
          "To invert the polarity of the MCU clock"
        ],
        answer: 0,
        explanation: "LEDs have exponential current-voltage curves. Without a current-limiting resistor, current surges uncontrollably, burning the LED junction and damaging the MCU output driver."
      }
    ]
  },
  {
    id: "sensors",
    title: "Sensors & Transducers",
    category: "Instrumentation",
    level: "Intermediate",
    duration: "45 mins",
    icon: "activity",
    accent: "#38bdf8",
    gradient: "from-sky-400 to-blue-500",
    tags: ["Transducers", "Wheatstone Bridge", "LDR & NTC", "Ultrasonic"],
    summary: "Understand active and passive transducers, thermistors, LDRs, ultrasonic distance sensors, Hall effect, and MEMS accelerometers.",
    overview: "A sensor or transducer converts real-world physical conditions (temperature, light, pressure, motion, distance) into measurable electrical signals (voltage, resistance, or digital pulses). Electronics engineers must understand sensor sensitivity, response curves, and how to use voltage dividers and op-amps to measure them accurately.",
    keyConcepts: [
      {
        title: "Active vs Passive Sensors",
        desc: "Active sensors (Solar cells, Piezoelectric crystals) produce their own voltage. Passive sensors (LDR, Thermistors, Strain gauges) require an external power supply to measure."
      },
      {
        title: "Temperature: LM35 vs Thermistor",
        desc: "LM35 provides an easy, linear output of exactly 10 millivolts per degree Celsius (25°C = 250mV). NTC thermistors change resistance in an exponential curve."
      },
      {
        title: "LDR (Light Dependent Resistor)",
        desc: "Made of Cadmium Sulfide. In darkness, resistance is high (>500kΩ). Under bright light, photons free electrons, dropping resistance to under 200Ω."
      },
      {
        title: "Ultrasonic Distance Measurement",
        desc: "The sensor emits a high-frequency 40 kHz sound chirp and measures the time it takes for the echo to bounce back from an object."
      }
    ],
    formulae: [
      { 
        name: "LM35 Temperature Formula", 
        formula: "Temperature (°C) = Voltage (mV) / 10",
        plain: "Example: 250 mV Reading = 25.0 °C",
        meaning: "Every 10 millivolts measured equals exactly 1 degree Celsius."
      },
      { 
        name: "Ultrasonic Distance Formula", 
        formula: "Distance (cm) = (Time in µs × 0.0343) / 2",
        plain: "Distance = (Echo Time × Speed of Sound) / 2",
        meaning: "Divides by 2 because the sound wave travels out to the target and back again."
      },
      { 
        name: "Voltage Divider for Sensor", 
        formula: "Vout = Vin × (R2 / (R1 + R2))",
        plain: "Vout = 5V × (Fixed Resistor / (Sensor R + Fixed R))",
        meaning: "Converts changing sensor resistance into a measurable voltage for Arduino ADC."
      },
      { 
        name: "Wheatstone Bridge Balance", 
        formula: "R1 / R2 = R3 / Rx",
        plain: "Bridge is balanced (Vout = 0V) when ratios match",
        meaning: "Allows detecting tiny fractions of an Ohm change in strain gauges."
      }
    ],
    interactiveType: "sensor-visualizer",
    realWorldApps: [
      { name: "Car Airbag Crash Sensors", desc: "MEMS accelerometers detecting violent sudden deceleration in under 15 milliseconds to deploy safety airbags." },
      { name: "Smartphone Screen Auto-Brightness", desc: "Ambient light sensors adjusting OLED brightness based on room lighting to save battery life." },
      { name: "Medical Pulse Oximeters", desc: "Red and Infrared LEDs measuring light absorption through your fingertip to calculate blood oxygen levels." }
    ],
    quiz: [
      {
        q: "If an HC-SR04 ultrasonic sensor measures an echo return time of 500 microseconds, what is the distance to the obstacle?",
        options: ["8.57 cm", "17.15 cm", "34.3 cm", "4.28 cm"],
        answer: 0,
        explanation: "Distance = (time × speed) / 2 = (500e-6 s × 34300 cm/s) / 2 = 17.15 / 2 = 8.575 cm."
      },
      {
        q: "What happens to the electrical resistance of an NTC thermistor as temperature increases?",
        options: ["Decreases", "Increases", "Remains constant", "Oscillates randomly"],
        answer: 0,
        explanation: "NTC stands for Negative Temperature Coefficient. As thermal energy increases, more charge carriers are freed, causing resistance to decrease."
      },
      {
        q: "Which circuit topology is standardly used to convert minute resistance changes of a strain gauge into a measurable voltage?",
        options: ["Wheatstone Bridge", "Schmitt Trigger", "Bridge Rectifier", "H-Bridge"],
        answer: 0,
        explanation: "A balanced Wheatstone bridge converts minute delta-R resistance fluctuations into proportional millivolt differential voltages suitable for op-amp amplification."
      }
    ]
  },
  {
    id: "iot",
    title: "Internet of Things (IoT)",
    category: "Connected Systems",
    level: "Intermediate to Advanced",
    duration: "50 mins",
    icon: "wifi",
    accent: "#818cf8",
    gradient: "from-indigo-500 to-purple-600",
    tags: ["4-Layer Architecture", "MQTT vs HTTP", "ESP32 Wi-Fi/BLE", "Edge Computing"],
    summary: "Explore 4-layer IoT architecture, MQTT and HTTP protocols, ESP32 Wi-Fi/BLE, cloud brokers, and edge telemetry.",
    overview: "The Internet of Things connects physical hardware to the internet, allowing autonomous monitoring, cloud telemetry, and remote control. Engineers build systems from low-power battery nodes to edge microchips (ESP32) that send lightweight MQTT packets to cloud platforms like AWS IoT, ThingSpeak, or Adafruit IO.",
    keyConcepts: [
      {
        title: "4-Layer IoT Architecture",
        desc: "Sensors (Perception) → Wireless Networks (Wi-Fi, LoRa, Cellular) → Cloud Message Broker (Middleware) → Dashboards & Mobile Apps (Application)."
      },
      {
        title: "MQTT vs HTTP Protocol",
        desc: "HTTP uses heavy headers (~800 bytes). MQTT uses a lightweight Publish/Subscribe model with tiny 2-byte headers, saving battery and mobile bandwidth."
      },
      {
        title: "ESP32 Microcontroller",
        desc: "Dual-core 32-bit chip running at 240 MHz with built-in Wi-Fi and Bluetooth, deep sleep modes (10µA), and hardware cryptographic security."
      },
      {
        title: "Edge AI & TinyML",
        desc: "Running compressed machine learning models directly on the microchip to detect anomalies without sending raw sensor streams to the cloud."
      }
    ],
    formulae: [
      { 
        name: "Battery Runtime Estimate", 
        formula: "Hours = Battery Capacity (mAh) / Average Current (mA)",
        plain: "Example: 2000 mAh Battery / 5 mA Draw = 400 Hours (~16 Days)",
        meaning: "Deep sleep cycles can extend remote sensor battery life to multiple years."
      },
      { 
        name: "Shannon Channel Capacity", 
        formula: "Max Data Rate (bps) = Bandwidth × log₂(1 + SNR)",
        plain: "Speed Limit of any communication channel",
        meaning: "Tells the maximum theoretical data transmission speed for a given signal-to-noise ratio."
      },
      { 
        name: "MQTT Packet Overhead", 
        formula: "Fixed Header = 2 Bytes",
        plain: "MQTT Header (2 Bytes) vs HTTP Header (500–1000 Bytes)",
        meaning: "MQTT is up to 50x lighter than HTTP, ideal for constrained battery nodes."
      },
      { 
        name: "Wireless Path Loss (FSPL)", 
        formula: "Signal Loss increases with Distance² and Frequency²",
        plain: "Loss (dB) = 20 log₁₀(d) + 20 log₁₀(f) + 32.44",
        meaning: "Higher frequencies (like 5GHz) drop off much faster than lower frequencies (like 868MHz LoRa)."
      }
    ],
    interactiveType: "mqtt-broker-visualizer",
    realWorldApps: [
      { name: "Smart City Streetlights", desc: "Thousands of LED streetlamps linked via cellular IoT dimming automatically when streets are empty." },
      { name: "Smart Agriculture Irrigation", desc: "Soil moisture nodes sending LoRaWAN telemetry to trigger solar-powered water valves only when soil is dry." },
      { name: "Industrial Machine Monitoring", desc: "Vibration sensors on factory motors detecting bearing wear before catastrophic failures occur." }
    ],
    quiz: [
      {
        q: "What makes the MQTT protocol vastly superior to HTTP for low-power battery-operated IoT sensor nodes?",
        options: [
          "Publish/subscribe architecture with compact 2-byte packet headers and persistent keep-alives",
          "Requires 100Mbps Ethernet cables to operate",
          "Only transmits uncompressed 4K video",
          "Does not support data security"
        ],
        answer: 0,
        explanation: "MQTT was designed for remote pipelines over satellite links. Its minimal 2-byte header footprint and pub/sub model conserve crucial battery power and bandwidth."
      },
      {
        q: "Which wireless protocol is specifically optimized for long-range (up to 15km) low-bandwidth telemetry on batteries that last years?",
        options: ["LoRa / LoRaWAN", "Wi-Fi 802.11ac", "NFC", "Bluetooth Classic"],
        answer: 0,
        explanation: "LoRa (Long Range) uses Chirp Spread Spectrum modulation to transmit sensor payloads over 10-15km line-of-sight with ultra-low current consumption."
      },
      {
        q: "What is the primary role of an MQTT Broker in an IoT telemetry network?",
        options: [
          "Receives messages from publishers and routes them to subscribed clients based on topics",
          "Performs high-speed 3D graphics rendering",
          "Converts analog voltages to binary bytes",
          "Supplies 5V electrical power wirelessly to the microcontrollers"
        ],
        answer: 0,
        explanation: "The broker acts as the central router: publishers send messages to a topic, and the broker dispatches them to all clients subscribed to that topic."
      }
    ]
  },
  {
    id: "communication-systems",
    title: "Communication Systems",
    category: "Telecommunications",
    level: "Intermediate to Advanced",
    duration: "55 mins",
    icon: "radio",
    accent: "#ec4899",
    gradient: "from-pink-500 to-rose-600",
    tags: ["Modulation (AM/FM/QAM)", "Nyquist Theorem", "5G NR & MIMO", "Antennas"],
    summary: "Deep dive into analog & digital modulation (AM, FM, BPSK, QAM), sampling theorem, antenna radiation, and 5G cellular networks.",
    overview: "Telecommunications is about transmitting information across distances through wires, optical fiber, or open air. Low-frequency signals (like human voice or audio) cannot travel far through the air directly because antennas would need to be kilometers long! Modulation shifts information onto high-frequency radio carrier waves, allowing smartphones, Wi-Fi, and satellites to communicate clearly.",
    keyConcepts: [
      {
        title: "Why Carrier Modulation Matters",
        desc: "An antenna must be roughly 1/4 the wavelength of the signal. Modulating audio onto a 1 GHz radio wave shrinks the antenna from 25 kilometers down to just 7.5 centimeters!"
      },
      {
        title: "AM vs FM Modulation",
        desc: "AM modulates carrier amplitude (height); easily corrupted by static noise. FM modulates frequency (speed of wave); offers high fidelity and noise immunity."
      },
      {
        title: "Digital Modulation: QAM",
        desc: "Quadrature Amplitude Modulation modulates both wave amplitude and phase at the same time, packing multiple data bits into each transmitted symbol."
      },
      {
        title: "5G & Massive MIMO",
        desc: "Uses antenna arrays of 64+ elements to steer narrow radio beams directly at moving smartphones instead of broadcasting in all directions."
      }
    ],
    formulae: [
      { 
        name: "Wavelength & Frequency Relation", 
        formula: "Wavelength (λ) = Speed of Light (c) / Frequency (f)",
        plain: "λ = (3 × 10⁸ m/s) / Frequency in Hz",
        meaning: "Higher frequencies have shorter wavelengths, allowing much smaller phone antennas."
      },
      { 
        name: "Nyquist Minimum Sampling Rate", 
        formula: "Sampling Rate (fs) ≥ 2 × Maximum Frequency (fmax)",
        plain: "fs ≥ 2 × fmax",
        meaning: "To digitize 20 kHz human audio without distortion, you must sample at least 40,000 times per second."
      },
      { 
        name: "AM Modulation Index", 
        formula: "Modulation Index (μ) = (Vmax - Vmin) / (Vmax + Vmin)",
        plain: "μ = Message Peak Voltage / Carrier Peak Voltage",
        meaning: "Must stay between 0 and 1. If μ > 1 (overmodulation), the audio signal clips and distorts."
      },
      { 
        name: "Carson's Rule for FM Bandwidth", 
        formula: "Bandwidth = 2 × (Frequency Deviation + Message Frequency)",
        plain: "BW = 2 × (Δf + fm)",
        meaning: "Calculates the total radio spectrum required to transmit an FM radio channel."
      }
    ],
    interactiveType: "wave-modulation-visualizer",
    realWorldApps: [
      { name: "5G Cellular Tower Beamforming", desc: "Steering focused radio energy directly to users to multiply mobile data speeds in crowded stadiums." },
      { name: "Satellite Internet (Starlink)", desc: "Electronically steered phased antenna arrays communicating gigabits of internet data with low Earth orbit satellites." },
      { name: "Fiber Optic Backbones", desc: "Transmitting 80+ distinct colors of laser light simultaneously down a single hair-thin glass fiber." }
    ],
    quiz: [
      {
        q: "According to the Nyquist Sampling Theorem, what is the minimum sampling frequency required for an audio signal with highest frequency 20 kHz?",
        options: ["40 kHz", "20 kHz", "10 kHz", "80 kHz"],
        answer: 0,
        explanation: "Nyquist criterion states fs >= 2 * fmax. For 20 kHz, fs >= 2 * 20 kHz = 40 kHz (which is why CDs use 44.1 kHz)."
      },
      {
        q: "Why does Frequency Modulation (FM) exhibit vastly superior noise immunity compared to Amplitude Modulation (AM)?",
        options: [
          "Most environmental noise affects amplitude, and FM receivers use limiters to strip amplitude variations",
          "FM signals travel faster than the speed of light",
          "FM requires no electrical power at the transmitter",
          "FM frequencies are blocked by the ozone layer"
        ],
        answer: 0,
        explanation: "Atmospheric noise, lightning, and motor sparks alter signal amplitude. An FM receiver clips off amplitude spikes without losing frequency information."
      },
      {
        q: "What is the theoretical wavelength of a 300 MHz radio wave traveling through free space?",
        options: ["1.0 meter", "0.1 meter", "10 meters", "3.0 meters"],
        answer: 0,
        explanation: "λ = c / f = (3 × 10^8 m/s) / (300 × 10^6 Hz) = 1.0 meter."
      }
    ]
  },
  {
    id: "microcontrollers",
    title: "Microcontrollers & Architectures",
    category: "Computer Engineering",
    level: "Intermediate to Advanced",
    duration: "50 mins",
    icon: "sliders",
    accent: "#10b981",
    gradient: "from-emerald-400 to-teal-600",
    tags: ["Harvard vs Von Neumann", "ISRs & Timers", "DMA Controller", "ARM Cortex-M"],
    summary: "Compare Von Neumann vs Harvard architectures, 8051, ARM Cortex-M, interrupts, DMA controllers, and RTOS fundamentals.",
    overview: "A microcontroller is a complete computer on a single silicon chip: CPU, RAM, Flash program storage, timers, ADC converters, and communication ports all in one package. Unlike desktop CPUs that require motherboards and external RAM, microcontrollers are optimized for real-time control of physical devices: cars, pacemakers, microwaves, and drones.",
    keyConcepts: [
      {
        title: "Harvard vs Von Neumann Memory",
        desc: "Von Neumann shares a single memory bus for code and data (creating a speed bottleneck). Harvard has separate buses, allowing the CPU to read instructions and data at the same time."
      },
      {
        title: "Hardware Interrupts (ISRs)",
        desc: "When urgent events occur (e.g. an emergency stop button pressed), the CPU immediately pauses its main task, handles the event instantly, and resumes."
      },
      {
        title: "DMA (Direct Memory Access)",
        desc: "Transfers large chunks of sensor or audio data directly into RAM without wasting CPU processing cycles."
      },
      {
        title: "RTOS (Real-Time Operating System)",
        desc: "Guarantees that critical software tasks will finish before strict time deadlines, used in automotive and aviation computers."
      }
    ],
    formulae: [
      { 
        name: "Hardware Timer Frequency", 
        formula: "Timer Rate = CPU Clock / (Prescaler × (1 + Compare Register))",
        plain: "Example: 16 MHz Clock / (64 × 250) = 1,000 Hz (1 ms tick)",
        meaning: "Controls how fast hardware timers trigger periodic tasks."
      },
      { 
        name: "Serial Baud Rate Formula", 
        formula: "Baud Rate = Clock Frequency / (16 × (Register + 1))",
        plain: "Sets serial communication speed (e.g. 9600, 115200 bps)",
        meaning: "Matches timing between Arduino and PC so serial characters are not garbled."
      },
      { 
        name: "Interrupt Latency", 
        formula: "Latency = Pipeline Flush Time + Context Save Time",
        plain: "Time between an external pin trigger and code executing",
        meaning: "Usually sub-microsecond in modern ARM Cortex-M microcontrollers."
      },
      { 
        name: "Clock Period Formula", 
        formula: "Cycle Time (T) = 1 / Frequency (f)",
        plain: "For 16 MHz: 1 / (16 × 10⁶) = 62.5 nanoseconds per cycle",
        meaning: "Each instruction on Arduino takes 62.5 nanoseconds."
      }
    ],
    interactiveType: "mcu-bus-visualizer",
    realWorldApps: [
      { name: "Automotive Engine Control Units (ECU)", desc: "Microcontrollers calculating fuel injection and spark timing on every single engine revolution." },
      { name: "Medical Cardiac Pacemakers", desc: "Ultra-low-power microchips monitoring heartbeats and delivering microamp electrical pacing pulses." },
      { name: "Commercial Aircraft Autopilots", desc: "Triple-redundant embedded processors stabilizing aircraft control surfaces safely." }
    ],
    quiz: [
      {
        q: "What is the primary operational advantage of Harvard architecture over Von Neumann?",
        options: [
          "Simultaneous instruction fetch and data read/write via separate memory buses",
          "Uses fewer silicon transistors",
          "Operates without requiring a clock crystal",
          "Can only store numbers in base-10"
        ],
        answer: 0,
        explanation: "Harvard architecture eliminates the Von Neumann memory bus bottleneck by providing independent instruction and data buses."
      },
      {
        q: "Why should an Interrupt Service Routine (ISR) be kept as short and fast as possible?",
        options: [
          "To avoid blocking other critical interrupts and prevent timing jitter in real-time tasks",
          "Because the MCU automatically reboots after 5 lines of code",
          "To save disk space on the hard drive",
          "Because ISRs cannot execute addition"
        ],
        answer: 0,
        explanation: "Prolonged ISRs block lower-priority interrupts and can compromise hard real-time execution deadlines."
      },
      {
        q: "Which hardware peripheral transfers high-speed ADC or SPI buffers directly into SRAM without consuming CPU instruction cycles?",
        options: ["DMA (Direct Memory Access)", "ALU", "Watchdog Timer", "EEPROM"],
        answer: 0,
        explanation: "DMA offloads memory copying duties from the CPU, allowing the processor to compute math or sleep while peripherals fill memory buffers."
      }
    ]
  },
  {
    id: "signal-processing",
    title: "Digital Signal Processing (DSP)",
    category: "Signal Processing",
    level: "Advanced",
    duration: "55 mins",
    icon: "bar-chart-2",
    accent: "#f59e0b",
    gradient: "from-amber-400 to-orange-600",
    tags: ["FFT / DFT", "FIR vs IIR Filters", "Z-Transform", "Spectral Analysis"],
    summary: "Master the Discrete Fourier Transform (DFT/FFT), FIR & IIR digital filter design, Z-transform, and audio/video noise filtering.",
    overview: "Digital Signal Processing processes real-world signals (audio, radio, medical scans) digitally to remove background noise, extract hidden frequencies, and compress files. Using algorithms like the Fast Fourier Transform (FFT), DSP powers noise-canceling headphones, speech recognition, radar tracking, and MP3 music compression.",
    keyConcepts: [
      {
        title: "Time Domain vs Frequency Domain",
        desc: "An oscilloscope shows signals as voltage over time. The Fourier Transform breaks complex sounds down into their pure sine wave frequencies (like seeing individual musical notes in a chord)."
      },
      {
        title: "Fast Fourier Transform (FFT)",
        desc: "An algorithm that speeds up frequency calculations by over 100x, allowing phones and headphones to analyze audio in real time."
      },
      {
        title: "FIR vs IIR Digital Filters",
        desc: "FIR (Finite Impulse Response) filters are always stable and never distort phase. IIR filters require fewer calculations but have internal feedback loops."
      },
      {
        title: "Aliasing Distortion",
        desc: "Sampling an analog wave too slowly creates false ghost frequencies. An analog low-pass filter must clean the signal before digitizing."
      }
    ],
    formulae: [
      { 
        name: "Nyquist Folding Frequency", 
        formula: "Folding Limit = Sampling Rate / 2",
        plain: "f(Nyquist) = fs / 2",
        meaning: "Any frequency above half the sampling rate folds over into false audio distortion (aliasing)."
      },
      { 
        name: "FFT Speedup Ratio", 
        formula: "Speedup = N² / (N × log₂ N)",
        plain: "For N = 1024 points: 1,000,000 steps reduced to 10,000 steps!",
        meaning: "Enables real-time spectral frequency analysis on low-cost processors."
      },
      { 
        name: "FIR Digital Filter Output", 
        formula: "y[n] = Sum of (Filter Weights × Past Inputs)",
        plain: "Calculates smoothed, noise-free output points",
        meaning: "Removes high-frequency hiss or low-frequency hum from audio streams."
      },
      { 
        name: "Signal-to-Noise Ratio (SNR)", 
        formula: "SNR (dB) = 10 × log₁₀(Signal Power / Noise Power)",
        plain: "Higher dB means cleaner, clearer audio or video",
        meaning: "A 60 dB SNR delivers clear high-fidelity audio."
      }
    ],
    interactiveType: "fft-spectral-visualizer",
    realWorldApps: [
      { name: "Active Noise-Canceling Headphones", desc: "Listens to background environmental airplane noise and generates an inverted anti-sound wave to cancel it out." },
      { name: "MRI Medical Brain Scans", desc: "Using 2D Inverse Fourier transforms to turn raw magnetic resonance radio echoes into sharp 3D brain images." },
      { name: "Radar Speed Guns", desc: "Measuring Doppler frequency shifts to calculate vehicle speed instantly." }
    ],
    quiz: [
      {
        q: "What computational complexity reduction does the Fast Fourier Transform (FFT) achieve over direct DFT for N sample points?",
        options: ["From O(N^2) to O(N log2 N)", "From O(N^3) to O(N)", "From O(2^N) to O(N^2)", "No reduction; it is identical"],
        answer: 0,
        explanation: "For N = 1024, N^2 = 1,048,576 operations. FFT requires N log2 N = 1024 × 10 = 10,240 operations—over 100x faster!"
      },
      {
        q: "What fundamental property is guaranteed by a symmetric Finite Impulse Response (FIR) digital filter?",
        options: ["Strictly Linear Phase Response", "Zero electrical delay", "Infinite gain at DC", "Non-causality"],
        answer: 0,
        explanation: "Symmetric FIR filters possess strictly linear phase, ensuring all frequency components experience equal time delay without phase distortion."
      },
      {
        q: "What occurs if an analog signal with components at 30 kHz is sampled at only 40 kHz without an anti-aliasing filter?",
        options: [
          "Aliasing occurs; the 30 kHz component folds down and appears as an artifact at 10 kHz",
          "The ADC explodes from overvoltage",
          "The signal becomes infinitely loud",
          "Nothing, sampling rate doesn't matter"
        ],
        answer: 0,
        explanation: "By Nyquist, f_Nyquist = 40/2 = 20 kHz. The 30 kHz frequency folds over across the Nyquist folding frequency: |40 - 30| = 10 kHz alias."
      }
    ]
  }
];
