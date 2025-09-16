# Architecture Overview

## Goals
- Deliver a fully client-side historical deduction game that runs without any server-side dependencies.
- Ensure compatibility with GitHub Pages hosting; all assets must be static files.
- Keep the interface lightweight and responsive so it is usable on both desktop and mobile browsers.
- Maintain an extensible content "database" that can be updated without code changes.

## High-Level Structure
```
overlap/
├── index.html         # Entry point served by GitHub Pages
├── assets/            # Static assets such as fonts and sounds (optional)
├── data/              # JSON data files used as the content database
├── src/
│   ├── game.js        # Core game loop and UI bindings
│   ├── data-store.js  # Data fetching and random selection helpers
│   ├── ui.js          # Rendering and terminal-style interaction helpers
│   └── state.js       # Score tracking and persistence (localStorage)
├── styles/
│   └── main.css       # Minimal terminal-inspired styles
└── docs/              # Project documentation
```

All files will be shipped as static assets so the site can be deployed by copying the repository to the `gh-pages` branch or enabling Pages from the `main` branch.

## Runtime Flow
1. `index.html` loads the compiled (or raw) JavaScript modules via `<script type="module">` so bundling is optional.
2. `data-store.js` fetches the JSON data (hosted locally in `data/events.json`). Because GitHub Pages serves static files, the fetch will be a relative HTTP request that works without CORS issues.
3. The game loop requests four records at a time: three with overlapping date ranges and one outlier. Logic resides in `game.js` with helper utilities for determining overlaps.
4. The UI renders to a single focusable container styled to mimic a terminal. Keyboard events (arrow keys/number keys) and pointer taps trigger selections.
5. `state.js` maintains the score and streak information and persists it to `localStorage` so the game can continue indefinitely between sessions.
6. When the player answers, the UI briefly displays the correct timeline information before loading the next prompt.

## GitHub Pages Considerations
- Avoid dynamic imports that rely on a build pipeline. Stick to ES modules or use a very small bundler step that outputs files into `/dist`.
- All fetches must be relative paths (`./data/events.json`) to avoid mixed content issues.
- If using any fonts or sounds, include them locally rather than pulling from external CDNs to reduce failure points.
- Provide a `404.html` that mirrors `index.html` if client-side routing is added (not currently required).

## Extensibility
- Future data files can be split by theme (e.g., `data/science.json`, `data/politics.json`). A manifest file can describe which datasets to load.
- Game modules should be written so they can accept injected data arrays, enabling unit tests without network requests.
- Consider adding seed-based randomness later to facilitate shared challenges.

## Testing Strategy
- Unit tests for overlap logic and date parsing can run in a Node + Jest environment.
- Integration tests with Playwright or Cypress can verify interactive behavior in headless browsers.
- Continuous deployment via GitHub Actions can build (if necessary) and deploy to GitHub Pages after tests pass.
