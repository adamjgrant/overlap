# Overlap

A minimalist, terminal-inspired browser game where three of four historical events or people share an overlapping time period—and you have to spot the impostor. The project is being built to run entirely as a static site, making it ideal for deployment on GitHub Pages.

## Project Status
We are currently documenting the architecture and development plan before implementing the interactive game. No game assets or logic have been committed yet.

## Key Requirements
- **Static hosting:** All code must run client-side so the game can be published via GitHub Pages without additional infrastructure.
- **Endless play:** Rounds continue indefinitely; the score increments for correct answers and decrements (or resets) for wrong answers.
- **Immediate feedback:** When a guess is incorrect, the correct answer and relevant timeline details briefly display before the next round.
- **Touch-friendly UI:** Despite the terminal aesthetic, controls must work well on both desktop and mobile browsers.
- **Extensible data store:** Historical events, people, and inventions are stored in JSON files that can be expanded without code changes.

## Documentation
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — High-level structure, runtime flow, and GitHub Pages considerations.
- [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) — JSON schema for the static content "database".
- [`docs/DEVELOPMENT_PLAN.md`](docs/DEVELOPMENT_PLAN.md) — Roadmap for bringing the game to life.

## Next Steps
1. Scaffold the static site with HTML, CSS, and vanilla JavaScript modules.
2. Implement data loading helpers that pull from `data/events.json` while running on GitHub Pages.
3. Build the gameplay loop, score tracking, and feedback UI.
4. Populate the dataset with verified historical entries.

Contributions are welcome—please coordinate on documentation first to ensure new features align with the static hosting strategy.
