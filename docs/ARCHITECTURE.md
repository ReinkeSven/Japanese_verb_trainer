# Architecture

## Overview

The Japanese Verb Trainer is a client-side single-page application (SPA) built with React + Vite. All data is bundled statically and persisted in `localStorage` — no server required.

## Data Flow

```
verbs.json          (static dataset)
    │
    ▼
Study page          (selects verb pool by JLPT level)
    │
    ├──► Flashcard          (show/hide, correct/incorrect)
    ├──► MultipleChoice     (generate 4 options from pool)
    ├──► ConjugationQuiz    (pick random form, type answer)
    └──► SRSSession         (queue due cards via SM-2)
            │
            ▼
        useSRS hook
            │
            ▼
        progressStore       (read/write localStorage)
```

## Key Modules

### `src/utils/conjugation.ts`
Pure functions; no side effects. `conjugate(verb, form)` is the main entry point.
Tested exhaustively in `src/__tests__/conjugation.test.ts` (86 test cases).

### `src/utils/srs.ts`
Pure SM-2 implementation. `reviewCard(card, rating)` returns a new card — immutable update pattern.
Tested in `src/__tests__/srs.test.ts` (25 test cases).

### `src/store/progressStore.ts`
Thin localStorage adapter. All reads/writes go through typed helpers.
No React dependency — usable from utilities and hooks alike.

### `src/hooks/`
- `useProgress` — wraps progressStore, exposes React state for re-render
- `useSRS` — initialises SRS cards for a verb set, exposes due queue

## Design Decisions

- **No external state library** — React `useState` + localStorage is sufficient for this scale.
- **CSS Modules** — scoped styles prevent leakage; design tokens in `index.css` `:root`.
- **Pure utility functions** — conjugation and SRS logic is decoupled from React for easy testing.
- **Static JSON dataset** — avoids network dependency; verbs can be updated by editing one file.
