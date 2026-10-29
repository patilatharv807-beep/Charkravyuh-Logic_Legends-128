window.ENTCEngagement = (function () {
  const CHALLENGE_STORAGE_KEY = 'entc_completed_challenges_v1';
  const BEST_SCORE_KEY = 'entc_quiz_best_score_v1';
  const SCORE_HISTORY_KEY = 'entc_quiz_scores_v1';
  const STUDY_STREAK_KEY = 'entc_study_streak_v1';
  const QUIZ_DURATION = 5 * 60;
  const challengeChecks = {
    blink: {
      label: 'Arduino LED blink sketch',
      placeholder: '// Write your setup() and loop() code here',
      checks: [
        [/pinMode\s*\([^;]*,\s*OUTPUT\s*\)/i, 'Set the LED pin as an output with pinMode(..., OUTPUT).'],
        [/digitalWrite\s*\([^;]*,\s*HIGH\s*\)/i, 'Turn the LED on with digitalWrite(..., HIGH).'],
        [/digitalWrite\s*\([^;]*,\s*LOW\s*\)/i, 'Turn the LED off with digitalWrite(..., LOW).'],
        [/delay\s*\(\s*500\s*\)/i, 'Wait 500 milliseconds between LED changes.']
      ]
    },
    'arduino-basics': {
      label: 'Arduino push-button sketch',
      placeholder: '// Configure the button and LED, then read the button in loop()',
      checks: [
        [/pinMode\s*\([^;]*,\s*INPUT_PULLUP\s*\)/i, 'Configure the button with INPUT_PULLUP.'],
        [/digitalRead\s*\(/i, 'Read the button with digitalRead(...).'],
        [/digitalRead\s*\([^)]*\)\s*={2,3}\s*LOW/i, 'Check for LOW when the pull-up button is pressed.'],
        [/digitalWrite\s*\(/i, 'Use digitalWrite(...) to control the LED.']
      ]
    },
    'c-logic': {
      label: 'C function to count set bits',
      placeholder: '// Write countSetBits(unsigned char value) here',
      checks: [
        [/countSetBits\s*\(/i, 'Create a countSetBits function.'],
        [/while\s*\(\s*value\s*\)/i, 'Loop while value still contains set bits.'],
        [/value\s*&=\s*(?:\(\s*unsigned\s+char\s*\)\s*)?\(?\s*value\s*-\s*1/i, 'Clear one set bit using value &= value - 1.'],
        [/count\s*\+\+|(?:\+\+\s*count)/i, 'Increase the count each time a set bit is cleared.'],
        [/return\s+count\s*;/i, 'Return the final count.']
      ]
    },
    'embedded-timer': {
      label: 'Non-blocking Arduino timer',
      placeholder: '// Use millis() to toggle the LED without delay()',
      checks: [
        [/millis\s*\(\s*\)/i, 'Use millis() to read the current time.'],
        [/(?:now|currentTime)\s*-\s*(?:lastChange|previousMillis|lastTime)\s*>=\s*500|(?:lastChange|previousMillis|lastTime)\s*<=?\s*(?:now|currentTime)\s*-\s*500/i, 'Check that 500 ms have elapsed since the previous change.'],
        [/(?:ledOn|ledState|ledStateOn)\s*=\s*!\s*(?:ledOn|ledState|ledStateOn)/i, 'Toggle a stored LED state instead of using delay().'],
        [/digitalWrite\s*\(/i, 'Write the updated state to the LED.'],
        [/\bdelay\s*\(/i, 'Remove delay(); this challenge must remain non-blocking.', true]
      ]
    },
    'logic-builder': {
      label: '8-bit parity function',
      placeholder: '// Write hasOddParity(unsigned char value) here',
      checks: [
        [/hasOddParity\s*\(/i, 'Create a hasOddParity function.'],
        [/parity\s*\^=|parity\s*=\s*parity\s*\^/i, 'Use XOR to flip the parity for each set bit.'],
        [/(?:value\s*>>|1[uUlL]?\s*<<)/i, 'Inspect each bit using a shift.'],
        [/\b(?:8|8u|8U)\b/i, 'Check all 8 bits.'],
        [/return\s+parity\s*;/i, 'Return the computed parity.']
      ]
    }
  };

  const questions = [
    {
      prompt: 'A 5 V supply drives a 2 V LED at a target current of 15 mA. Which resistor is the closest standard value?',
      options: ['100 Ω', '220 Ω', '470 Ω', '1 kΩ'],
      answer: 1,
      explanation: 'R = (5 - 2) / 0.015 = 200 Ω. A 220 Ω standard resistor keeps the current safely below the target.'
    },
    {
      prompt: 'An AND gate receives A = 1 and B = 0. What is its output?',
      options: ['0 (LOW)', '1 (HIGH)', 'It alternates', 'There is no output'],
      answer: 0,
      explanation: 'An AND gate is HIGH only when both inputs are HIGH, so 1 AND 0 produces 0.'
    },
    {
      prompt: 'Which Arduino function configures a pin as an output?',
      options: ['digitalWrite()', 'analogRead()', 'pinMode(pin, OUTPUT)', 'Serial.begin()'],
      answer: 2,
      explanation: 'Call pinMode(pin, OUTPUT) in setup() before driving a pin with digitalWrite().' 
    },
    {
      prompt: 'Which protocol is typically the best fit for a low-overhead publish/subscribe sensor feed?',
      options: ['MQTT', 'VGA', 'I2S only', 'HDMI'],
      answer: 0,
      explanation: 'MQTT uses a broker-based publish/subscribe model and a compact header, making it common for IoT telemetry.'
    },
    {
      prompt: 'A sensor reading changes continuously with light intensity. Which input is normally used to measure it on an Arduino Uno?',
      options: ['A digital output pin', 'An analog input with ADC', 'The UART TX pin', 'The reset pin'],
      answer: 1,
      explanation: 'An analog sensor voltage is sampled by the ADC through an analog input such as A0.'
    }
  ];

  let questionIndex = 0;
  let score = 0;
  let secondsRemaining = QUIZ_DURATION;
  let timerId = null;
  let answerLocked = false;
  let quizFinished = false;

  function init() {
    recordDailyVisit();
    initChallenges();
    initQuiz();
    initGateMatch();
    initCircuitIdentification();
    initComponentSort();
  }

  function readList(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(value) ? value : [];
    } catch (error) {
      return [];
    }
  }

  function writeValue(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      return false;
    }
    return true;
  }

  function recordDailyVisit() {
    let activity = {};
    try {
      activity = JSON.parse(localStorage.getItem(STUDY_STREAK_KEY) || '{}');
    } catch (error) {
      activity = {};
    }

    const today = new Date().toISOString().slice(0, 10);
    if (activity.lastDate === today) return;
    const yesterday = new Date(Date.parse(`${today}T00:00:00Z`) - 86400000).toISOString().slice(0, 10);
    const streak = activity.lastDate === yesterday ? (Number(activity.streak) || 0) + 1 : 1;
    writeValue(STUDY_STREAK_KEY, { lastDate: today, streak });
    if (window.ProgressBoard && window.ProgressBoard.refresh) window.ProgressBoard.refresh();
  }

  function initChallenges() {
    const grid = document.getElementById('challenge-grid');
    if (!grid) return;

    const completed = readList(CHALLENGE_STORAGE_KEY);
    grid.querySelectorAll('.challenge-card').forEach((card) => {
      const id = card.dataset.challenge;
      const config = challengeChecks[id];
      const toggleButton = card.querySelector('.challenge-solve-toggle-btn');
      if (!config || !toggleButton) return;

      const setComplete = (isComplete) => {
        card.classList.toggle('is-complete', isComplete);
        toggleButton.textContent = isComplete ? 'Solved · edit answer' : 'Solve challenge';
      };

      setComplete(completed.includes(id));
      card.querySelector('.challenge-hint-btn').addEventListener('click', (event) => {
        const reveal = card.querySelector('[data-hint]');
        reveal.hidden = !reveal.hidden;
        event.currentTarget.textContent = reveal.hidden ? 'Show hint' : 'Hide hint';
      });
      card.querySelector('.challenge-solution-btn').addEventListener('click', (event) => {
        const reveal = card.querySelector('[data-solution]');
        reveal.hidden = !reveal.hidden;
        event.currentTarget.textContent = reveal.hidden ? 'Sample solution' : 'Hide solution';
      });

      const workspace = createChallengeWorkspace(card, id, config, setComplete);
      toggleButton.setAttribute('aria-expanded', 'false');
      toggleButton.addEventListener('click', () => {
        workspace.hidden = !workspace.hidden;
        toggleButton.setAttribute('aria-expanded', String(!workspace.hidden));
        toggleButton.textContent = workspace.hidden
          ? (readList(CHALLENGE_STORAGE_KEY).includes(id) ? 'Solved · edit answer' : 'Solve challenge')
          : 'Close editor';
        if (!workspace.hidden) workspace.querySelector('textarea').focus();
      });
    });
  }

  function createChallengeWorkspace(card, id, config, setComplete) {
    const workspace = document.createElement('section');
    workspace.className = 'challenge-workspace';
    workspace.hidden = true;
    workspace.setAttribute('aria-label', `${config.label} answer editor`);

    const label = document.createElement('label');
    label.className = 'challenge-editor-label';
    label.textContent = 'Your solution';

    const editor = document.createElement('textarea');
    editor.className = 'challenge-editor';
    editor.rows = 10;
    editor.maxLength = 12000;
    editor.spellcheck = false;
    editor.setAttribute('aria-label', `${config.label} code`);
    editor.placeholder = config.placeholder;

    const note = document.createElement('p');
    note.className = 'challenge-editor-note';
    note.textContent = 'Write your answer here. Check solution reviews the required steps; it does not compile or run your code.';

    const feedback = document.createElement('p');
    feedback.className = 'challenge-check-feedback';
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', 'polite');

    const actions = document.createElement('div');
    actions.className = 'challenge-editor-actions';

    const checkButton = document.createElement('button');
    checkButton.type = 'button';
    checkButton.className = 'btn btn-xs btn-primary-neon';
    checkButton.textContent = 'Check my solution';

    const clearButton = document.createElement('button');
    clearButton.type = 'button';
    clearButton.className = 'btn btn-xs btn-outline-glass';
    clearButton.textContent = 'Clear answer';

    const helpText = document.createElement('ul');
    helpText.className = 'challenge-checklist';
    config.checks.forEach(([, description, isForbidden]) => {
      const item = document.createElement('li');
      item.textContent = `${isForbidden ? 'Avoid' : 'Include'}: ${description}`;
      helpText.appendChild(item);
    });

    label.htmlFor = `challenge-answer-${id}`;
    editor.id = label.htmlFor;
    actions.append(checkButton, clearButton);
    workspace.append(label, editor, note, actions, feedback, helpText);

    const toggleButton = card.querySelector('.challenge-solve-toggle-btn');
    toggleButton.before(workspace);

    checkButton.addEventListener('click', () => {
      const source = editor.value;
      if (!source.trim()) {
        feedback.textContent = 'Write your solution in the editor first.';
        feedback.className = 'challenge-check-feedback is-incorrect';
        return;
      }

      const missedChecks = config.checks.filter(([pattern, , isForbidden]) => (
        isForbidden ? pattern.test(source) : !pattern.test(source)
      ));
      if (missedChecks.length) {
        feedback.textContent = `Not quite yet. ${missedChecks[0][1]}`;
        feedback.className = 'challenge-check-feedback is-incorrect';
        return;
      }

      const nextCompleted = readList(CHALLENGE_STORAGE_KEY);
      if (!nextCompleted.includes(id)) {
        nextCompleted.push(id);
        if (!writeValue(CHALLENGE_STORAGE_KEY, nextCompleted)) {
          feedback.textContent = 'Your solution looks good, but progress could not be saved in this browser.';
          feedback.className = 'challenge-check-feedback is-incorrect';
          return;
        }
      }
      setComplete(true);
      feedback.textContent = 'Nice work! Your solution includes the key steps for this challenge.';
      feedback.className = 'challenge-check-feedback is-correct';
      if (window.ProgressBoard && window.ProgressBoard.refresh) window.ProgressBoard.refresh();
    });

    clearButton.addEventListener('click', () => {
      editor.value = '';
      feedback.textContent = '';
      feedback.className = 'challenge-check-feedback';
      editor.focus();
    });

    return workspace;
  }

  function initQuiz() {
    const form = document.getElementById('quiz-form');
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      checkAnswer();
    });

    document.getElementById('quiz-next-btn').addEventListener('click', () => {
      if (questionIndex === questions.length - 1) {
        finishQuiz();
        return;
      }
      questionIndex += 1;
      answerLocked = false;
      renderQuestion();
    });

    renderQuestion();
    updateTimer();
    timerId = window.setInterval(() => {
      secondsRemaining -= 1;
      updateTimer();
      if (secondsRemaining <= 0) finishQuiz();
    }, 1000);
  }

  function renderQuestion() {
    const question = questions[questionIndex];
    const container = document.getElementById('quiz-question-container');
    const feedback = document.getElementById('quiz-feedback');
    document.getElementById('quiz-progress-label').textContent = `Question ${questionIndex + 1} of ${questions.length}`;
    document.getElementById('quiz-progress-bar').style.width = `${(questionIndex / questions.length) * 100}%`;
    document.getElementById('quiz-submit-btn').hidden = false;
    document.getElementById('quiz-next-btn').hidden = true;
    feedback.textContent = '';
    feedback.className = 'quiz-feedback';
    container.innerHTML = `<fieldset class="quiz-fieldset"><legend class="quiz-question">${question.prompt}</legend><div class="quiz-options">${question.options.map((option, index) => `<label class="quiz-option"><input type="radio" name="quiz-answer" value="${index}"><span>${option}</span></label>`).join('')}</div></fieldset>`;
  }

  function checkAnswer() {
    if (answerLocked || quizFinished) return;
    const selected = document.querySelector('input[name="quiz-answer"]:checked');
    const feedback = document.getElementById('quiz-feedback');
    if (!selected) {
      feedback.textContent = 'Choose an answer before checking.';
      feedback.className = 'quiz-feedback is-incorrect';
      return;
    }

    answerLocked = true;
    const question = questions[questionIndex];
    const isCorrect = Number(selected.value) === question.answer;
    if (isCorrect) score += 1;
    document.querySelectorAll('input[name="quiz-answer"]').forEach((input) => { input.disabled = true; });
    feedback.textContent = `${isCorrect ? 'Correct.' : 'Not quite.'} ${question.explanation}`;
    feedback.className = `quiz-feedback ${isCorrect ? 'is-correct' : 'is-incorrect'}`;
    document.getElementById('quiz-submit-btn').hidden = true;
    const nextButton = document.getElementById('quiz-next-btn');
    nextButton.hidden = false;
    nextButton.textContent = questionIndex === questions.length - 1 ? 'View results' : 'Next question';
  }

  function updateTimer() {
    const timer = document.getElementById('quiz-timer');
    if (!timer) return;
    const minutes = Math.floor(secondsRemaining / 60).toString().padStart(2, '0');
    const seconds = (secondsRemaining % 60).toString().padStart(2, '0');
    timer.textContent = `${minutes}:${seconds}`;
    timer.classList.toggle('is-low', secondsRemaining <= 60);
  }

  function finishQuiz() {
    if (quizFinished) return;
    quizFinished = true;
    window.clearInterval(timerId);
    document.getElementById('quiz-progress-label').textContent = 'Quiz complete';
    document.getElementById('quiz-progress-bar').style.width = '100%';
    document.getElementById('quiz-question-container').hidden = true;
    document.getElementById('quiz-submit-btn').hidden = true;
    document.getElementById('quiz-next-btn').hidden = true;
    document.getElementById('quiz-feedback').textContent = '';
    const result = document.getElementById('quiz-result');
    result.hidden = false;
    result.innerHTML = `<strong>Your score: ${score} / ${questions.length}</strong><p>${score === questions.length ? 'Excellent work. All concepts are landing.' : 'Review the explanations above in the Learn modules, then take another run.'}</p>`;
    const previousBest = Number(localStorage.getItem(BEST_SCORE_KEY) || 0);
    if (score > previousBest) writeValue(BEST_SCORE_KEY, score);
    const scoreHistory = readList(SCORE_HISTORY_KEY);
    scoreHistory.push({ score, total: questions.length, completedAt: new Date().toISOString() });
    writeValue(SCORE_HISTORY_KEY, scoreHistory.slice(-10));
    if (window.ProgressBoard && window.ProgressBoard.refresh) window.ProgressBoard.refresh();
  }

  function initGateMatch() {
    const checkButton = document.getElementById('gate-match-check');
    if (!checkButton) return;
    checkButton.addEventListener('click', () => {
      const answer = document.getElementById('gate-match-select').value;
      const feedback = document.getElementById('gate-match-feedback');
      if (!answer) {
        feedback.textContent = 'Choose a gate first.';
        feedback.className = 'is-incorrect';
        return;
      }
      const correct = answer === 'XOR';
      feedback.textContent = correct ? 'Correct. XOR is HIGH when the inputs differ.' : 'Try again: look for the gate that detects different input states.';
      feedback.className = correct ? 'is-correct' : 'is-incorrect';
    });
  }

  function initCircuitIdentification() {
    const checkButton = document.getElementById('circuit-id-check');
    if (!checkButton) return;
    checkButton.addEventListener('click', () => {
      const answer = document.getElementById('circuit-id-select').value;
      const feedback = document.getElementById('circuit-id-feedback');
      const correct = answer === 'led-indicator';
      feedback.textContent = !answer
        ? 'Choose a circuit purpose first.'
        : correct
          ? 'Correct. The resistor limits current through the LED.'
          : 'Not quite. The series resistor protects the LED from excess current.';
      feedback.className = correct ? 'is-correct' : 'is-incorrect';
    });
  }

  function initComponentSort() {
    const sorter = document.querySelector('.component-sorter');
    if (!sorter) return;
    let selectedComponent = '';
    const tokens = sorter.querySelectorAll('.component-token');
    const slots = sorter.querySelectorAll('.component-slot');
    const labels = {
      supply: '5 V supply',
      resistor: '220 Ω resistor',
      led: 'LED',
      ground: 'Ground'
    };

    function assignComponent(slot, component) {
      if (!labels[component]) return;
      slot.dataset.component = component;
      slot.textContent = `${Number(slot.dataset.slot) + 1} · ${labels[component]}`;
      slot.classList.add('is-filled');
    }

    tokens.forEach((token) => {
      token.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', token.dataset.component);
      });
      token.addEventListener('click', () => {
        selectedComponent = token.dataset.component;
        tokens.forEach((item) => item.classList.toggle('is-selected', item === token));
      });
    });

    slots.forEach((slot) => {
      slot.addEventListener('dragover', (event) => event.preventDefault());
      slot.addEventListener('drop', (event) => {
        event.preventDefault();
        assignComponent(slot, event.dataTransfer.getData('text/plain'));
      });
      slot.addEventListener('click', () => {
        if (selectedComponent) assignComponent(slot, selectedComponent);
      });
    });

    document.getElementById('component-sort-check').addEventListener('click', () => {
      const expected = ['supply', 'resistor', 'led', 'ground'];
      const current = Array.from(slots, (slot) => slot.dataset.component || '');
      const feedback = document.getElementById('component-sort-feedback');
      const complete = current.every((component) => component);
      const correct = complete && current.every((component, index) => component === expected[index]);
      feedback.textContent = !complete
        ? 'Place a component in each of the four slots.'
        : correct
          ? 'Correct path. The resistor is in series to limit LED current.'
          : 'Check the order: supply, current-limiting resistor, LED, then ground.';
      feedback.className = correct ? 'is-correct' : 'is-incorrect';
    });
  }

  return { init };
})();