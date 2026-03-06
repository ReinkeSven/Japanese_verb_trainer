/**
 * Spaced Repetition System (SRS) — SM-2 variant
 *
 * Based on the SuperMemo SM-2 algorithm:
 * https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
 *
 * User-facing ratings map to SM-2 quality scores:
 *   again → 1  (complete fail)
 *   hard  → 2  (incorrect but remembered after hint)
 *   good  → 4  (correct with some effort)
 *   easy  → 5  (perfect recall)
 */

import type { SRSCard, SRSRating, SRSQuality } from '../types';

// ─── Constants ────────────────────────────────────────────────────────────────

const MIN_EASE_FACTOR = 1.3;
const INITIAL_EASE_FACTOR = 2.5;
const NEW_CARD_INTERVALS = [1, 6]; // days for first two correct reviews

// ─── Rating → Quality mapping ────────────────────────────────────────────────

const RATING_TO_QUALITY: Record<SRSRating, SRSQuality> = {
  again: 1,
  hard:  2,
  good:  4,
  easy:  5,
};

// ─── Date utilities ───────────────────────────────────────────────────────────

/** Returns today's date as an ISO string (YYYY-MM-DD). */
export function today(): string {
  return new Date().toISOString().split('T')[0];
}

/** Add `days` to a date string and return the new ISO date string. */
export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

/** Returns true if the card is due today or earlier. */
export function isDue(card: SRSCard): boolean {
  return card.dueDate <= today();
}

// ─── SM-2 Core ────────────────────────────────────────────────────────────────

/**
 * Apply the SM-2 algorithm to a card given a user rating.
 * Returns a new SRSCard with updated scheduling data.
 */
export function reviewCard(card: SRSCard, rating: SRSRating): SRSCard {
  const quality = RATING_TO_QUALITY[rating];
  const now = today();

  let { repetitions, interval, easeFactor } = card;

  if (quality < 3) {
    // Incorrect: reset to beginning
    repetitions = 0;
    interval = 1;
  } else {
    // Correct
    if (repetitions === 0) {
      interval = NEW_CARD_INTERVALS[0];
    } else if (repetitions === 1) {
      interval = NEW_CARD_INTERVALS[1];
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  // Update ease factor (SM-2 formula)
  easeFactor = Math.max(
    MIN_EASE_FACTOR,
    easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02),
  );

  return {
    ...card,
    repetitions,
    interval,
    easeFactor,
    dueDate: addDays(now, interval),
    lastReviewed: now,
  };
}

// ─── Card factory ─────────────────────────────────────────────────────────────

/** Create a brand-new SRS card for a verb (due today). */
export function createCard(verbId: string): SRSCard {
  return {
    verbId,
    repetitions: 0,
    interval: 1,
    easeFactor: INITIAL_EASE_FACTOR,
    dueDate: today(),
    lastReviewed: null,
  };
}

// ─── Session helpers ──────────────────────────────────────────────────────────

/** Filter an array of cards to those due today or earlier. */
export function getDueCards(cards: SRSCard[]): SRSCard[] {
  return cards.filter(isDue);
}

/**
 * Return a stability label for display purposes.
 * Based on the current interval.
 */
export function getStabilityLabel(card: SRSCard): string {
  if (card.lastReviewed === null) return 'New';
  if (card.interval <= 1)  return 'Learning';
  if (card.interval <= 7)  return 'Young';
  if (card.interval <= 21) return 'Mature';
  return 'Mastered';
}
