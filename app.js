const quizQuestions = [
  {
    question: "Which planet in our solar system has the most confirmed moons?",
    answers: ["Earth", "Saturn", "Mars", "Mercury"],
    correctIndex: 1,
    explanation:
      "Saturn currently leads the moon count, with many small moons discovered through modern surveys.",
  },
  {
    question: "What does HTML stand for?",
    answers: [
      "HyperText Markup Language",
      "High Transfer Machine Language",
      "Hyperlink Text Management Logic",
      "Home Tool Markup Library",
    ],
    correctIndex: 0,
    explanation:
      "HTML is the markup language browsers use to structure text, images, forms, and links on web pages.",
  },
  {
    question: "Which civilization built Machu Picchu?",
    answers: ["Maya", "Inca", "Aztec", "Olmec"],
    correctIndex: 1,
    explanation:
      "Machu Picchu was built by the Inca in the Andes Mountains of present-day Peru.",
  },
  {
    question: "In mathematics, what is the value of pi rounded to two decimals?",
    answers: ["2.72", "3.14", "1.62", "4.13"],
    correctIndex: 1,
    explanation:
      "Pi begins 3.14159, so it rounds to 3.14 when kept to two decimal places.",
  },
  {
    question: "Which process allows plants to convert sunlight into chemical energy?",
    answers: ["Fermentation", "Photosynthesis", "Respiration", "Transpiration"],
    correctIndex: 1,
    explanation:
      "Photosynthesis uses sunlight, carbon dioxide, and water to produce sugars and oxygen.",
  },
  {
    question: "Which data format is commonly used for sending structured data in web apps?",
    answers: ["JSON", "MP3", "PNG", "WAV"],
    correctIndex: 0,
    explanation:
      "JSON is lightweight, readable, and widely used for structured data exchange between apps and servers.",
  },
];

const QUESTION_TIME = 60;

const app = document.querySelector("#app");
const title = document.querySelector("#screen-title");
const scorePill = document.querySelector("#score-pill");
const scoreValue = document.querySelector("#score-value");

const state = {
  screen: "intro",
  currentQuestionIndex: 0,
  score: 0,
  selectedAnswerIndex: null,
  answered: false,
  timeLeft: QUESTION_TIME,
  timerId: null,
  results: [],
};

function updateScore() {
  scoreValue.textContent = state.score;
  scorePill.hidden = state.screen === "intro";
}

function setTitle(text) {
  title.textContent = text;
}

function clearTimer() {
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function startTimer() {
  clearTimer();
  state.timeLeft = QUESTION_TIME;
  state.timerId = setInterval(() => {
    state.timeLeft -= 1;
    const timer = document.querySelector("#timer");

    if (timer) {
      timer.textContent = `${state.timeLeft}s`;
    }

    if (state.timeLeft <= 0) {
      handleTimeout();
    }
  }, 1000);
}

function startQuiz() {
  clearTimer();
  state.screen = "quiz";
  state.currentQuestionIndex = 0;
  state.score = 0;
  state.selectedAnswerIndex = null;
  state.answered = false;
  state.results = [];
  renderQuestion();
}

function handleAnswer(answerIndex) {
  if (state.answered) {
    return;
  }

  clearTimer();
  const question = quizQuestions[state.currentQuestionIndex];
  const isCorrect = answerIndex === question.correctIndex;

  state.answered = true;
  state.selectedAnswerIndex = answerIndex;

  if (isCorrect) {
    state.score += 1;
  }

  state.results.push({
    question: question.question,
    selectedAnswer: question.answers[answerIndex],
    correctAnswer: question.answers[question.correctIndex],
    explanation: question.explanation,
    status: isCorrect ? "correct" : "incorrect",
  });

  renderQuestion();
}

function handleTimeout() {
  if (state.answered) {
    return;
  }

  clearTimer();
  const question = quizQuestions[state.currentQuestionIndex];

  state.answered = true;
  state.selectedAnswerIndex = null;
  state.score -= 1;
  state.results.push({
    question: question.question,
    selectedAnswer: "No answer selected",
    correctAnswer: question.answers[question.correctIndex],
    explanation: question.explanation,
    status: "timeout",
  });

  renderQuestion();
  setTimeout(goToNextQuestion, 900);
}

function goToNextQuestion() {
  clearTimer();

  if (state.currentQuestionIndex >= quizQuestions.length - 1) {
    renderResults();
    return;
  }

  state.currentQuestionIndex += 1;
  state.selectedAnswerIndex = null;
  state.answered = false;
  renderQuestion();
}

function getAnswerClass(answerIndex, question) {
  if (!state.answered) {
    return "";
  }

  if (answerIndex === question.correctIndex) {
    return "correct";
  }

  if (answerIndex === state.selectedAnswerIndex) {
    return "incorrect";
  }

  return "";
}

function renderIntro() {
  state.screen = "intro";
  clearTimer();
  setTitle("Ready for a quick challenge?");
  updateScore();

  app.innerHTML = `
    <div class="content intro-grid">
      <div class="intro-copy">
        <h2>Test a mix of science, history, math, and web basics.</h2>
        <p>
          You will answer ${quizQuestions.length} multiple-choice questions. Each card gives instant
          feedback, reveals the correct answer, and tracks your score as you go.
        </p>
        <ul class="rule-list">
          <li>Correct answers add 1 point.</li>
          <li>Wrong answers reveal the right choice without changing your score.</li>
          <li>Each question has 60 seconds. If time runs out, the quiz skips ahead and subtracts 1 point.</li>
        </ul>
        <button class="primary-button" type="button" id="start-button">Start Quiz</button>
      </div>
      <div class="stat-stack" aria-label="Quiz details">
        <div class="stat-box">
          <span class="stat-number">${quizQuestions.length}</span>
          <span class="stat-label">Questions</span>
        </div>
        <div class="stat-box">
          <span class="stat-number">${QUESTION_TIME}s</span>
          <span class="stat-label">Per question</span>
        </div>
        <div class="stat-box">
          <span class="stat-number">+1</span>
          <span class="stat-label">For every correct answer</span>
        </div>
      </div>
    </div>
  `;

  document.querySelector("#start-button").addEventListener("click", startQuiz);
}

function renderQuestion() {
  state.screen = "quiz";
  const question = quizQuestions[state.currentQuestionIndex];
  const questionNumber = state.currentQuestionIndex + 1;
  const progress = Math.round((questionNumber / quizQuestions.length) * 100);

  setTitle(`Question ${questionNumber} of ${quizQuestions.length}`);
  updateScore();

  app.innerHTML = `
    <div class="content question-card">
      <div class="question-header">
        <div>
          <p class="progress">Question ${questionNumber} of ${quizQuestions.length}</p>
          <div class="progress-track" aria-hidden="true">
            <div class="progress-fill" style="width: ${progress}%"></div>
          </div>
        </div>
        <div class="timer" aria-label="Time left">Time: <span id="timer">${state.timeLeft}s</span></div>
      </div>

      <section class="question-card" aria-labelledby="question-text">
        <h2 id="question-text">${question.question}</h2>
        <div class="answer-grid">
          ${question.answers
            .map(
              (answer, index) => `
                <button
                  class="answer-button ${getAnswerClass(index, question)}"
                  type="button"
                  data-answer-index="${index}"
                  ${state.answered ? "disabled" : ""}
                >
                  ${answer}
                </button>
              `,
            )
            .join("")}
        </div>
      </section>

      <div class="feedback ${state.answered ? "" : "hidden"}" id="feedback">
        ${state.answered ? getFeedbackMarkup(question) : ""}
      </div>

      <div class="question-actions">
        <button
          class="primary-button ${state.answered ? "" : "hidden"}"
          type="button"
          id="next-button"
        >
          ${state.currentQuestionIndex === quizQuestions.length - 1 ? "See Results" : "Next Question"}
        </button>
      </div>
    </div>
  `;

  document.querySelectorAll(".answer-button").forEach((button) => {
    button.addEventListener("click", () => {
      handleAnswer(Number(button.dataset.answerIndex));
    });
  });

  const nextButton = document.querySelector("#next-button");
  if (nextButton) {
    nextButton.addEventListener("click", goToNextQuestion);
  }

  if (!state.answered) {
    startTimer();
  }
}

function getFeedbackMarkup(question) {
  const result = state.results[state.results.length - 1];

  if (result.status === "correct") {
    return `
      <strong>Correct.</strong>
      ${question.explanation}
    `;
  }

  return `
    <strong>${result.status === "timeout" ? "Time is up." : "Not quite."}</strong>
    The correct answer was <strong>${question.answers[question.correctIndex]}</strong>. ${question.explanation}
  `;
}

function renderResults() {
  state.screen = "results";
  clearTimer();
  setTitle("Quiz complete");
  updateScore();

  const correctCount = state.results.filter((result) => result.status === "correct").length;
  const missedCount = state.results.length - correctCount;

  app.innerHTML = `
    <div class="content">
      <h2>Your final score is ${state.score}</h2>
      <p class="results-copy">
        Here is how each question went. Timed-out questions subtract 1 point, while incorrect
        answers simply record the correct answer for review.
      </p>

      <div class="results-summary" aria-label="Score summary">
        <div class="result-card">
          <strong>${state.score}</strong>
          Final score
        </div>
        <div class="result-card">
          <strong>${correctCount}</strong>
          Correct
        </div>
        <div class="result-card">
          <strong>${missedCount}</strong>
          Missed or timed out
        </div>
      </div>

      <div class="results-list">
        ${state.results.map(getResultMarkup).join("")}
      </div>

      <div class="result-actions">
        <button class="secondary-button" type="button" id="review-button">Back to Start</button>
        <button class="primary-button" type="button" id="restart-button">Try Again</button>
      </div>
    </div>
  `;

  document.querySelector("#review-button").addEventListener("click", renderIntro);
  document.querySelector("#restart-button").addEventListener("click", startQuiz);
}

function getResultMarkup(result, index) {
  const statusLabel =
    result.status === "correct"
      ? "Correct"
      : result.status === "timeout"
        ? "Timed out"
        : "Incorrect";

  return `
    <article class="review-item ${result.status}">
      <div class="review-meta">Question ${index + 1} - ${statusLabel}</div>
      <h3>${result.question}</h3>
      <p class="review-answer"><strong>Your answer:</strong> ${result.selectedAnswer}</p>
      <p class="review-answer"><strong>Correct answer:</strong> ${result.correctAnswer}</p>
      <p class="review-answer">${result.explanation}</p>
    </article>
  `;
}

renderIntro();
