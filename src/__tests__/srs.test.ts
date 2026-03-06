import { describe, it, expect } from 'vitest';
import { createCard, reviewCard, isDue, getDueCards, addDays, today, getStabilityLabel } from '../utils/srs';
import type { SRSCard } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeCard(overrides: Partial<SRSCard> = {}): SRSCard {
  return {
    verbId: 'taberu',
    repetitions: 0,
    interval: 1,
    easeFactor: 2.5,
    dueDate: '2024-01-01',
    lastReviewed: null,
    ...overrides,
  };
}

// ─── Date utilities ───────────────────────────────────────────────────────────

describe('addDays', () => {
  it('adds days correctly', () => {
    expect(addDays('2024-01-01', 5)).toBe('2024-01-06');
  });
  it('handles month boundaries', () => {
    expect(addDays('2024-01-31', 1)).toBe('2024-02-01');
  });
  it('handles zero days', () => {
    expect(addDays('2024-06-15', 0)).toBe('2024-06-15');
  });
});

describe('today', () => {
  it('returns a string matching YYYY-MM-DD format', () => {
    expect(today()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

// ─── isDue ────────────────────────────────────────────────────────────────────

describe('isDue', () => {
  it('returns true for past due date', () => {
    const card = makeCard({ dueDate: '2000-01-01' });
    expect(isDue(card)).toBe(true);
  });
  it('returns true for today', () => {
    const card = makeCard({ dueDate: today() });
    expect(isDue(card)).toBe(true);
  });
  it('returns false for future date', () => {
    const card = makeCard({ dueDate: '2099-12-31' });
    expect(isDue(card)).toBe(false);
  });
});

// ─── createCard ───────────────────────────────────────────────────────────────

describe('createCard', () => {
  it('creates a card with correct initial values', () => {
    const card = createCard('nomu');
    expect(card.verbId).toBe('nomu');
    expect(card.repetitions).toBe(0);
    expect(card.interval).toBe(1);
    expect(card.easeFactor).toBe(2.5);
    expect(card.lastReviewed).toBeNull();
    expect(card.dueDate).toBe(today());
  });
});

// ─── reviewCard ───────────────────────────────────────────────────────────────

describe('reviewCard — first review', () => {
  const base = makeCard({ dueDate: today() });

  it('"again" resets repetitions to 0 and interval to 1', () => {
    const result = reviewCard(base, 'again');
    expect(result.repetitions).toBe(0);
    expect(result.interval).toBe(1);
  });

  it('"good" sets interval to 1 (first step) and increments repetitions', () => {
    const result = reviewCard(base, 'good');
    expect(result.repetitions).toBe(1);
    expect(result.interval).toBe(1);
  });

  it('"easy" also increments repetitions', () => {
    const result = reviewCard(base, 'easy');
    expect(result.repetitions).toBe(1);
  });

  it('lastReviewed is updated to today', () => {
    const result = reviewCard(base, 'good');
    expect(result.lastReviewed).toBe(today());
  });
});

describe('reviewCard — second review', () => {
  // Simulate a card that has been reviewed once correctly
  const card = makeCard({ repetitions: 1, interval: 1, dueDate: today() });

  it('"good" sets interval to 6 (second step)', () => {
    const result = reviewCard(card, 'good');
    expect(result.interval).toBe(6);
    expect(result.repetitions).toBe(2);
  });
});

describe('reviewCard — subsequent reviews', () => {
  it('interval grows with each "good" review (SM-2 multiplication)', () => {
    const card = makeCard({ repetitions: 2, interval: 6, easeFactor: 2.5, dueDate: today() });
    const result = reviewCard(card, 'good');
    expect(result.interval).toBe(Math.round(6 * 2.5)); // 15
  });

  it('"hard" (quality=2) decreases ease factor', () => {
    const card = makeCard({ repetitions: 2, interval: 6, easeFactor: 2.5, dueDate: today() });
    const result = reviewCard(card, 'hard');
    expect(result.easeFactor).toBeLessThan(2.5);
  });

  it('"easy" (quality=5) increases ease factor', () => {
    const card = makeCard({ repetitions: 2, interval: 6, easeFactor: 2.5, dueDate: today() });
    const result = reviewCard(card, 'easy');
    expect(result.easeFactor).toBeGreaterThan(2.5);
  });

  it('ease factor never drops below 1.3', () => {
    let card = makeCard({ repetitions: 2, interval: 6, easeFactor: 1.31, dueDate: today() });
    card = reviewCard(card, 'again');
    card = reviewCard(card, 'hard');
    expect(card.easeFactor).toBeGreaterThanOrEqual(1.3);
  });
});

describe('reviewCard — failure resets progress', () => {
  it('"again" on a mature card resets repetitions and interval', () => {
    const card = makeCard({ repetitions: 5, interval: 30, easeFactor: 2.5, dueDate: today() });
    const result = reviewCard(card, 'again');
    expect(result.repetitions).toBe(0);
    expect(result.interval).toBe(1);
  });
});

// ─── getDueCards ──────────────────────────────────────────────────────────────

describe('getDueCards', () => {
  it('returns only cards due today or earlier', () => {
    const cards: SRSCard[] = [
      makeCard({ verbId: 'a', dueDate: '2000-01-01' }), // due
      makeCard({ verbId: 'b', dueDate: today() }),       // due
      makeCard({ verbId: 'c', dueDate: '2099-12-31' }),  // not due
    ];
    const due = getDueCards(cards);
    expect(due).toHaveLength(2);
    expect(due.map(c => c.verbId)).toContain('a');
    expect(due.map(c => c.verbId)).toContain('b');
  });

  it('returns empty array when no cards are due', () => {
    const cards = [makeCard({ dueDate: '2099-12-31' })];
    expect(getDueCards(cards)).toHaveLength(0);
  });
});

// ─── getStabilityLabel ────────────────────────────────────────────────────────

describe('getStabilityLabel', () => {
  it('returns "New" for unreviewed card', () => {
    expect(getStabilityLabel(makeCard({ lastReviewed: null }))).toBe('New');
  });
  it('returns "Learning" for interval ≤ 1', () => {
    expect(getStabilityLabel(makeCard({ lastReviewed: '2024-01-01', interval: 1 }))).toBe('Learning');
  });
  it('returns "Young" for interval 2–7', () => {
    expect(getStabilityLabel(makeCard({ lastReviewed: '2024-01-01', interval: 7 }))).toBe('Young');
  });
  it('returns "Mature" for interval 8–21', () => {
    expect(getStabilityLabel(makeCard({ lastReviewed: '2024-01-01', interval: 21 }))).toBe('Mature');
  });
  it('returns "Mastered" for interval > 21', () => {
    expect(getStabilityLabel(makeCard({ lastReviewed: '2024-01-01', interval: 22 }))).toBe('Mastered');
  });
});
