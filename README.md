# Overlap

A minimalist, terminal-inspired browser game where three of four historical events or people share an overlapping time period—and you have to spot the impostor. The project is being built to run entirely as a static site, making it ideal for deployment on GitHub Pages.

## Project Status
The terminal-inspired shell of the game is now in place, complete with a lightweight gameplay loop, score tracking, and a sample
dataset. Rounds are built entirely client-side from static JSON so the experience still works on GitHub Pages.

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
1. Expand the UI polish and add accessibility refinements (ARIA live regions, reduced motion mode).
2. Grow the data helpers to support difficulty tuning and future dataset packs.
3. Layer in richer feedback (timeline visualizations, streak celebrations) and persistent settings.
4. Curate and verify a larger historical dataset with citations.

Contributions are welcome—please coordinate on documentation first to ensure new features align with the static hosting strategy.
