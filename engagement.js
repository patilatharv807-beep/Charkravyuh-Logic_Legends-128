window.ENTCEngagement = (function () {
  const CHALLENGE_STORAGE_KEY = 'entc_completed_challenges_v1';
  const BEST_SCORE_KEY = 'entc_quiz_best_score_v1';
  const SCORE_HISTORY_KEY = 'entc_quiz_scores_v1';
  const STUDY_STREAK_KEY = 'entc_study_streak_v1';
  const QUIZ_DURATION = 5 * 60;
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
      const completeButton = card.querySelector('.challenge-complete-btn');
      const setComplete = (isComplete) => {
        card.classList.toggle('is-complete', isComplete);
        completeButton.textContent = isComplete ? 'Completed' : 'Mark complete';
        completeButton.setAttribute('aria-pressed', String(isComplete));
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
      completeButton.addEventListener('click', () => {
        const nextCompleted = readList(CHALLENGE_STORAGE_KEY);
        if (!nextCompleted.includes(id)) nextCompleted.push(id);
        writeValue(CHALLENGE_STORAGE_KEY, nextCompleted);
        setComplete(true);
      });
    });
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