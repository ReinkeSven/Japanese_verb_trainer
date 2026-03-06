import { useState, useCallback, useMemo } from 'react';
import { getSRSCards, getOrCreateCard, saveCard } from '../store/progressStore';
import { reviewCard, getDueCards } from '../utils/srs';
import type { SRSCard, SRSRating } from '../types';

export function useSRS(verbIds: string[]) {
  const [cards, setCards] = useState<Record<string, SRSCard>>(() => {
    const store = getSRSCards();
    // Ensure all verbs have cards
    verbIds.forEach(id => {
      if (!store[id]) store[id] = getOrCreateCard(id);
    });
    return store;
  });

  const dueCards = useMemo(
    () => getDueCards(verbIds.map(id => cards[id]).filter(Boolean)),
    [cards, verbIds],
  );

  const review = useCallback((verbId: string, rating: SRSRating) => {
    const card = cards[verbId] ?? getOrCreateCard(verbId);
    const updated = reviewCard(card, rating);
    saveCard(updated);
    setCards(prev => ({ ...prev, [verbId]: updated }));
  }, [cards]);

  return { cards, dueCards, review };
}
