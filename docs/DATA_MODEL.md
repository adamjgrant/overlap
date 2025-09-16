# Data Model Specification

The game relies on a small, file-based "database" that can be served as static JSON files on GitHub Pages. All content lives in the `data/` directory and is fetched at runtime.

## Entities

### TimelineItem
Represents any selectable item that can appear in a round.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | ✅ | Unique identifier. Use a slug-friendly format (`"world-war-ii"`). |
| `name` | `string` | ✅ | Display name shown to the player. |
| `type` | `"event_range" \| "event_single" \| "person"` | ✅ | Determines how dates are interpreted. |
| `start` | `string` | ✅ | ISO-like date (`YYYY`, `YYYY-MM`, or `YYYY-MM-DD`). For single-date events or people, this equals the key date (birth, invention, etc.). |
| `end` | `string \| null` | ✅ | Only meaningful for `event_range` or people (death). Must be `null` for `event_single`. |
| `blurb` | `string` | ✅ | Short sentence displayed when revealing the answer. |
| `sources` | `string[]` | ❌ | Optional citations for future use. |

### Dataset Manifest *(optional future enhancement)*
Allows chunking content into thematic packs.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | ✅ | Identifier for the dataset. |
| `name` | `string` | ✅ | Human-readable name. |
| `items` | `string[]` | ✅ | List of `TimelineItem.id` values contained in this dataset. |

## File Layout
```
data/
├── events.json        # Primary dataset consumed by the game
└── manifest.json      # Optional, lists multiple datasets
```

`events.json` contains an array of `TimelineItem` objects. Example:

```json
[
  {
    "id": "world-war-ii",
    "name": "World War II",
    "type": "event_range",
    "start": "1939-09-01",
    "end": "1945-09-02",
    "blurb": "The global conflict involving the vast majority of the world's nations."
  },
  {
    "id": "super-soaker",
    "name": "Invention of the Super Soaker",
    "type": "event_single",
    "start": "1989-01-01",
    "end": null,
    "blurb": "Lonnie Johnson patented the iconic pressurized water gun in 1989."
  }
]
```

## Date Handling
- Use ISO-8601-compatible strings so JavaScript's `Date` constructor or custom parsers can handle them reliably.
- When only the year is known, pad with `-01-01` for `start` and `-12-31` for `end` during normalization.
- People can use `start` for birth and `end` for death. When the death date is unknown, set `end` to `null` and treat them like a single-date event after their birth.

## Overlap Logic Expectations
- Convert `start` and `end` to numeric timestamps (e.g., milliseconds) after normalization.
- A `event_single` is considered to occur on a single day; treat `end = start` when comparing ranges.
- `event_range` overlaps if the ranges intersect: `max(startA, startB) <= min(endA, endB)`.
- A person overlaps any event that intersects their lifespan.

## Future Expansion
- Additional metadata (`region`, `tags`, `difficulty`) can guide filtering or theming.
- Localization fields (`name_localized`, `blurb_localized`) can support translations.
- If dataset size grows large, split into multiple JSON files and lazy-load as needed.
