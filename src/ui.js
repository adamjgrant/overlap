const promptText = document.getElementById('prompt-text');
const choicesContainer = document.getElementById('choices');
const feedbackText = document.getElementById('feedback-text');
const roundCounter = document.getElementById('round-counter');
const scoreCounter = document.getElementById('score-counter');
const streakCounter = document.getElementById('streak-counter');
const nextButton = document.getElementById('next-round');

let selectHandler = null;
let nextHandler = null;

function clearChoices() {
  choicesContainer.innerHTML = '';
}

function createChoiceElement(option) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'terminal__choice';
  button.dataset.choiceId = option.id;
  button.setAttribute('role', 'listitem');
  button.setAttribute('aria-pressed', 'false');
  button.innerHTML = `
    <span class="terminal__choice-label">${option.label}</span>
    <span class="terminal__choice-name">${option.name}</span>
    <span class="terminal__choice-category">${option.category}</span>
    <span class="terminal__choice-dates">${option.yearRange}</span>
  `;
  return button;
}

export function initUI({ onSelect, onNext }) {
  selectHandler = onSelect;
  nextHandler = onNext;

  choicesContainer.addEventListener('click', (event) => {
    const target = event.target.closest('[data-choice-id]');
    if (!target || target.disabled) return;
    if (selectHandler) {
      selectHandler(target.dataset.choiceId);
    }
  });

  choicesContainer.addEventListener('keydown', (event) => {
    if (event.key >= '1' && event.key <= '4') {
      const index = Number(event.key) - 1;
      const button = choicesContainer.querySelectorAll('[data-choice-id]')[index];
      if (button && !button.disabled) {
        button.click();
        event.preventDefault();
      }
    }
  });

  nextButton.addEventListener('click', () => {
    if (nextHandler) nextHandler();
  });
}

export function renderRound({ options, overlapDescription }) {
  promptText.textContent = `Three entries overlap between ${overlapDescription}. Which one is the imposter?`;
  clearChoices();
  const fragment = document.createDocumentFragment();
  options.forEach((option) => {
    const element = createChoiceElement(option);
    fragment.appendChild(element);
  });
  choicesContainer.appendChild(fragment);
  feedbackText.textContent = '';
  nextButton.hidden = true;
  nextButton.disabled = true;
  focusFirstChoice();
}

function focusFirstChoice() {
  const first = choicesContainer.querySelector('[data-choice-id]');
  if (first) {
    first.focus({ preventScroll: true });
  }
}

export function markSelection(choiceId) {
  choicesContainer.querySelectorAll('[data-choice-id]').forEach((element) => {
    const isSelected = element.dataset.choiceId === choiceId;
    element.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
  });
}

export function revealAnswer({ correctId, incorrectId, blurb }) {
  const correct = choicesContainer.querySelector(`[data-choice-id="${correctId}"]`);
  if (correct) {
    correct.classList.add('terminal__choice--correct');
  }
  if (incorrectId) {
    const incorrect = choicesContainer.querySelector(`[data-choice-id="${incorrectId}"]`);
    if (incorrect) {
      incorrect.classList.add('terminal__choice--incorrect');
    }
  }
  if (blurb) {
    feedbackText.textContent = blurb;
  }
}

export function lockChoices() {
  choicesContainer.querySelectorAll('[data-choice-id]').forEach((element) => {
    element.disabled = true;
  });
  nextButton.hidden = false;
  nextButton.disabled = false;
  nextButton.focus({ preventScroll: true });
}

export function updateScoreboard({ round, score, streak }) {
  roundCounter.textContent = String(round);
  scoreCounter.textContent = String(score);
  streakCounter.textContent = String(streak);
}

export function setFeedback(message) {
  feedbackText.textContent = message;
}

export function showError(message) {
  promptText.textContent = 'An error occurred while loading the game.';
  setFeedback(message);
  clearChoices();
  nextButton.hidden = true;
}
