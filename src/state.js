const STORAGE_KEY = 'overlap-state-v1';

const defaultState = () => ({
  round: 0,
  score: 0,
  streak: 0,
  bestStreak: 0,
});

function isStorageAvailable() {
  try {
    const key = '__storage_test__';
    window.localStorage.setItem(key, '1');
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    return false;
  }
}

const storageEnabled = isStorageAvailable();

function loadPersistedState() {
  if (!storageEnabled) return defaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return { ...defaultState(), ...parsed };
  } catch (error) {
    console.warn('Failed to parse saved state, resetting.', error);
    return defaultState();
  }
}

let state = loadPersistedState();

function persist() {
  if (!storageEnabled) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Unable to persist game state.', error);
  }
}

export function getState() {
  return { ...state };
}

export function recordResult({ correct }) {
  state = {
    ...state,
    round: state.round + 1,
    score: Math.max(0, state.score + (correct ? 1 : -1)),
    streak: correct ? state.streak + 1 : 0,
  };
  if (state.streak > state.bestStreak) {
    state.bestStreak = state.streak;
  }
  persist();
  return getState();
}

export function resetState() {
  state = defaultState();
  persist();
  return getState();
}
