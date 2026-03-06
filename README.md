# 日本語動詞 — Japanese Verb Trainer

A web application for learning and conjugating Japanese verbs across all JLPT levels (N5–N1).

## Features

| Mode | Description |
|------|-------------|
| **Flashcards** | Tap to reveal the English meaning; mark known/unknown |
| **Multiple Choice** | Pick the correct meaning from 4 options |
| **Conjugation Quiz** | Type a conjugated form (て-form, past, conditional, etc.) |
| **Spaced Repetition (SRS)** | SM-2 algorithm schedules cards for long-term retention |

- **120+ verbs** covering N5–N1, including godan, ichidan, and irregular verbs
- **13 conjugation forms**: polite present/past/negative, te-form, plain past, negative, conditional (ば), volitional (よう), potential, passive, causative, imperative
- **LocalStorage persistence** — no account required
- **Japan-inspired design**: washi-paper palette, Noto Serif JP, torii red accents

## Tech Stack

- **React 19 + Vite 7 + TypeScript**
- **React Router v7** for client-side routing
- **CSS Modules** for component-scoped styles
- **Vitest + Testing Library** for unit tests
- **GitHub Actions** CI: test → typecheck → build

## Getting Started

```bash
npm install
npm run dev        # Start dev server at http://localhost:5173
npm test           # Run unit tests
npm run build      # Production build
```

## Project Structure

```
src/
├── __tests__/          # Unit tests (conjugation, SRS)
├── components/
│   ├── layout/         # Header, navigation
│   ├── modes/          # Flashcard, MultipleChoice, ConjugationQuiz, SRSSession
│   └── ui/             # Button, Card, ProgressBar
├── data/
│   └── verbs.json      # Verb dataset (120+ entries)
├── hooks/              # useProgress, useSRS
├── pages/              # Home, Study, Progress
├── store/              # progressStore (localStorage adapter)
├── types/              # TypeScript types
└── utils/
    ├── conjugation.ts  # Conjugation engine
    └── srs.ts          # SM-2 SRS algorithm
```

## Conjugation Engine

Verbs are classified into three types:

| Type | Japanese | Example | Rule |
|------|----------|---------|------|
| `ichidan` | 一段動詞 | 食べる | Drop る, add suffix |
| `godan` | 五段動詞 | 飲む | 5-row vowel change |
| `irregular` | 不規則動詞 | する / 来る | Memorised forms |

The engine handles all godan sub-patterns (く/ぐ/す/つ/ぬ/ぶ/む/る/う endings) and the irregular 行く te-form (いく → いって).

## SRS Algorithm (SM-2)

Each card tracks:

- **repetitions** — consecutive correct reviews
- **interval** — days until next review
- **easeFactor** — starts at 2.5, adjusts per rating

User ratings map to SM-2 quality scores:

| Button | Quality | Meaning |
|--------|---------|---------|
| Again  | 1 | Forgot |
| Hard   | 2 | Struggled |
| Good   | 4 | Got it |
| Easy   | 5 | Perfect recall |

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes with clear messages
4. Ensure `npm test` passes
5. Open a pull request

## License

MIT
