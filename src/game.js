import { fetchTimelineItems, createRound, describeIntersection } from './data-store.js';
import {
  initUI,
  renderRound,
  markSelection,
  revealAnswer,
  lockChoices,
  updateScoreboard,
  setFeedback,
  showError,
} from './ui.js';
import { getState, recordResult } from './state.js';

let items = [];
let currentRound = null;
let awaitingSelection = false;

function startNextRound() {
  try {
    currentRound = createRound(items);
  } catch (error) {
    showError(error.message);
    console.error(error);
    return;
  }

  const overlapDescription = describeIntersection(currentRound.intersection);
  const state = getState();
  renderRound({ options: currentRound.options, overlapDescription });
  updateScoreboard({
    round: state.round + 1,
    score: state.score,
    streak: state.streak,
  });
  setFeedback('Tap or press 1-4 to choose the imposter.');
  awaitingSelection = true;
}

function handleSelection(choiceId) {
  if (!awaitingSelection || !currentRound) return;
  awaitingSelection = false;

  markSelection(choiceId);

  const selectedOption = currentRound.options.find((option) => option.id === choiceId);
  const correctOption = currentRound.options.find((option) => option.id === currentRound.answerId);
  const correct = choiceId === currentRound.answerId;

  const resultState = recordResult({ correct });
  updateScoreboard(resultState);

  const overlapDescription = describeIntersection(currentRound.intersection);

  let message = '';
  if (correct) {
    message = `Correct! ${correctOption.name} sits just outside the ${overlapDescription} overlap. ${correctOption.blurb}`;
  } else {
    message = `Not quite. ${correctOption.name} was the outlier beyond the ${overlapDescription} window. ${correctOption.blurb}`;
  }

  revealAnswer({
    correctId: correctOption.id,
    incorrectId: correct ? null : selectedOption?.id ?? null,
    blurb: message,
  });
  lockChoices();
}

async function initialise() {
  initUI({
    onSelect: handleSelection,
    onNext: () => {
      if (!awaitingSelection) {
        startNextRound();
      }
    },
  });

  const initialState = getState();
  updateScoreboard({
    round: initialState.round + 1,
    score: initialState.score,
    streak: initialState.streak,
  });

  try {
    items = await fetchTimelineItems();
    startNextRound();
  } catch (error) {
    console.error(error);
    showError(error.message);
  }
}

initialise();
