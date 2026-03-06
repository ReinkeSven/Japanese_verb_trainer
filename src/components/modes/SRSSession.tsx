import { useState, useMemo } from 'react';
import type { Verb, SRSRating } from '../../types';
import { getStabilityLabel } from '../../utils/srs';
import { useSRS } from '../../hooks/useSRS';
import Button from '../ui/Button';
import styles from './SRSSession.module.css';

interface SRSSessionProps {
  verbs: Verb[];
}

export default function SRSSession({ verbs }: SRSSessionProps) {
  const verbIds = useMemo(() => verbs.map(v => v.id), [verbs]);
  const { dueCards, review } = useSRS(verbIds);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);

  const queue = useMemo(() => [...dueCards], [dueCards]);

  if (queue.length === 0 || sessionDone) {
    return (
      <div className={styles.done}>
        <div className={styles.doneIcon}>🌸</div>
        <h2>Session complete!</h2>
        <p>All due cards reviewed. Check back tomorrow for more.</p>
      </div>
    );
  }

  const currentCard = queue[currentIdx];
  if (!currentCard) return null;

  const currentVerb = verbs.find(v => v.id === currentCard.verbId);
  if (!currentVerb) return null;

  const stability = getStabilityLabel(currentCard);

  function handleRate(rating: SRSRating) {
    review(currentCard.verbId, rating);
    const next = currentIdx + 1;
    if (next >= queue.length) {
      setSessionDone(true);
    } else {
      setCurrentIdx(next);
      setFlipped(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.meta}>
        <span className={styles.counter}>{currentIdx + 1} / {queue.length}</span>
        <span className={`${styles.stability} ${styles[stability.toLowerCase()]}`}>{stability}</span>
      </div>

      {/* Card */}
      <div className={`${styles.card} ${flipped ? styles.flipped : ''}`}>
        <span className={styles.jlptBadge}>{currentVerb.jlpt}</span>

        <div className={styles.front}>
          <div className={styles.kanji}>{currentVerb.kanji}</div>
          <div className={styles.kana}>{currentVerb.kana}</div>
          {!flipped && (
            <Button onClick={() => setFlipped(true)} size="lg">Show Answer</Button>
          )}
        </div>

        {flipped && (
          <div className={styles.answer}>
            <div className={styles.meaning}>{currentVerb.meaning}</div>
            <div className={styles.verbType}>
              {currentVerb.type === 'ichidan' && 'Ichidan (ru-verb)'}
              {currentVerb.type === 'godan' && `Godan (u-verb, ～${currentVerb.ending})`}
              {currentVerb.type === 'irregular' && 'Irregular'}
            </div>
            {currentVerb.examples[0] && (
              <div className={styles.example}>
                <p className={styles.exJa}>{currentVerb.examples[0].japanese}</p>
                <p className={styles.exEn}>{currentVerb.examples[0].english}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rating buttons */}
      {flipped && (
        <div className={styles.ratingButtons}>
          <button className={`${styles.rateBtn} ${styles.again}`} onClick={() => handleRate('again')}>
            <span className={styles.rateLabel}>Again</span>
            <span className={styles.rateHint}>Forgot</span>
          </button>
          <button className={`${styles.rateBtn} ${styles.hard}`} onClick={() => handleRate('hard')}>
            <span className={styles.rateLabel}>Hard</span>
            <span className={styles.rateHint}>Struggled</span>
          </button>
          <button className={`${styles.rateBtn} ${styles.good}`} onClick={() => handleRate('good')}>
            <span className={styles.rateLabel}>Good</span>
            <span className={styles.rateHint}>Got it</span>
          </button>
          <button className={`${styles.rateBtn} ${styles.easy}`} onClick={() => handleRate('easy')}>
            <span className={styles.rateLabel}>Easy</span>
            <span className={styles.rateHint}>Perfect</span>
          </button>
        </div>
      )}

      {/* Progress bar */}
      <div className={styles.progress}>
        <div className={styles.progressFill} style={{ width: `${(currentIdx / queue.length) * 100}%` }} />
      </div>
    </div>
  );
}
