/**
 * Progress Store — localStorage persistence layer
 *
 * Stores:
 *   - Per-verb learning progress (seen/correct counts)
 *   - SRS card states
 *   - User preferences (selected JLPT levels)
 */

import type { VerbProgress, SRSCard, JLPTLevel } from '../types';
import { createCard } from '../utils/srs';

const KEYS = {
  PROGRESS: 'jvt_progress',
  SRS_CARDS: 'jvt_srs_cards',
  LEVELS: 'jvt_levels',
} as const;

// ─── Generic helpers ──────────────────────────────────────────────────────────

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Verb progress ────────────────────────────────────────────────────────────

export function getProgress(): Record<string, VerbProgress> {
  return load<Record<string, VerbProgress>>(KEYS.PROGRESS, {});
}

export function recordAnswer(verbId: string, correct: boolean): void {
  const all = getProgress();
  const existing = all[verbId] ?? { verbId, seen: 0, correct: 0, lastMode: null };
  all[verbId] = {
    ...existing,
    seen: existing.seen + 1,
    correct: existing.correct + (correct ? 1 : 0),
  };
  save(KEYS.PROGRESS, all);
}

export function clearProgress(): void {
  localStorage.removeItem(KEYS.PROGRESS);
}

// ─── SRS cards ────────────────────────────────────────────────────────────────

export function getSRSCards(): Record<string, SRSCard> {
  return load<Record<string, SRSCard>>(KEYS.SRS_CARDS, {});
}

/** Returns the SRS card for a verb, creating it if it doesn't exist yet. */
export function getOrCreateCard(verbId: string): SRSCard {
  const cards = getSRSCards();
  if (!cards[verbId]) {
    cards[verbId] = createCard(verbId);
    save(KEYS.SRS_CARDS, cards);
  }
  return cards[verbId];
}

export function saveCard(card: SRSCard): void {
  const cards = getSRSCards();
  cards[card.verbId] = card;
  save(KEYS.SRS_CARDS, cards);
}

export function clearSRSCards(): void {
  localStorage.removeItem(KEYS.SRS_CARDS);
}

// ─── JLPT level preferences ───────────────────────────────────────────────────

const DEFAULT_LEVELS: JLPTLevel[] = ['N5'];

export function getSelectedLevels(): JLPTLevel[] {
  return load<JLPTLevel[]>(KEYS.LEVELS, DEFAULT_LEVELS);
}

export function saveSelectedLevels(levels: JLPTLevel[]): void {
  save(KEYS.LEVELS, levels);
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export interface OverallStats {
  totalSeen: number;
  totalCorrect: number;
  accuracy: number; // 0–100
  verbsStudied: number;
}

export function getOverallStats(): OverallStats {
  const progress = Object.values(getProgress());
  const totalSeen = progress.reduce((s, p) => s + p.seen, 0);
  const totalCorrect = progress.reduce((s, p) => s + p.correct, 0);
  return {
    totalSeen,
    totalCorrect,
    accuracy: totalSeen > 0 ? Math.round((totalCorrect / totalSeen) * 100) : 0,
    verbsStudied: progress.filter(p => p.seen > 0).length,
  };
}
