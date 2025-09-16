# Development Plan

This roadmap outlines how to move from an empty repository to a fully playable historical overlap game that runs on GitHub Pages.

## Phase 1 — Project Scaffolding
- [ ] Set up basic project structure described in `ARCHITECTURE.md`.
- [ ] Create `index.html` with a focusable terminal-style container and placeholder text.
- [ ] Add `styles/main.css` with minimal dark theme styling and responsive typography.
- [ ] Implement `src/game.js` with a simple loop that displays static mocked data to validate UI interactions.
- [ ] Add automated formatting/linting (Prettier + ESLint) configured to work with static hosting.

## Phase 2 — Data Infrastructure
- [ ] Create empty `data/events.json` following the schema in `DATA_MODEL.md`.
- [ ] Implement `data-store.js` utilities:
  - Fetch JSON files relative to the site root (compatible with GitHub Pages).
  - Normalize dates into comparable numeric ranges.
  - Provide helper functions to pull random combinations of overlapping + outlier items.
- [ ] Write unit tests for overlap logic to ensure correctness before data is populated.

## Phase 3 — Gameplay Loop
- [ ] Render four items per round with touch-friendly buttons.
- [ ] Highlight selection, validate correctness, and show brief explanation containing the correct timeline.
- [ ] Track score, streak, and lifetime stats in memory and persist via `localStorage`.
- [ ] Add subtle transitions/delays so the player can read the answer before the next round loads.
- [ ] Provide accessibility affordances: keyboard navigation, ARIA live regions for feedback, high-contrast mode.

## Phase 4 — Polish & Deployment
- [ ] Add settings controls (mute sounds, toggle animations, reset score).
- [ ] Include analytics hooks (optional) respecting user privacy.
- [ ] Create a GitHub Actions workflow to lint/test and deploy to GitHub Pages.
- [ ] Document deployment steps and maintenance notes in the README.
- [ ] Populate initial dataset with a curated set of events and people.

## Ongoing Considerations
- Keep bundle size minimal (<100 KB gzipped) for fast mobile loads.
- Treat dataset contributions like code: validate format via JSON schema or tests.
- Consider progressive enhancement: the game should remain usable even if JavaScript is slow; provide loading states and error fallbacks.
- Collect playtest feedback to iterate on difficulty balancing and UI clarity.
