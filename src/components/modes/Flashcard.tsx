import { useState } from 'react';
import type { Verb } from '../../types';
import Button from '../ui/Button';
import styles from './Flashcard.module.css';

interface FlashcardProps {
  verb: Verb;
  onCorrect: () => void;
  onIncorrect: () => void;
  onNext: () => void;
}

export default function Flashcard({ verb, onCorrect, onIncorrect, onNext }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);
  const [answered, setAnswered] = useState<'correct' | 'incorrect' | null>(null);

  function handleFlip() {
    setFlipped(true);
  }

  function handleAnswer(correct: boolean) {
    setAnswered(correct ? 'correct' : 'incorrect');
    if (correct) onCorrect();
    else onIncorrect();
  }

  function handleNext() {
    setFlipped(false);
    setAnswered(null);
    onNext();
  }

  return (
    <div className={styles.wrapper}>
      {/* Card */}
      <div
        className={`${styles.card} ${flipped ? styles.flipped : ''} ${answered ? styles[answered] : ''}`}
        onClick={!flipped ? handleFlip : undefined}
        role={!flipped ? 'button' : undefined}
        tabIndex={!flipped ? 0 : undefined}
        onKeyDown={!flipped ? (e) => e.key === 'Enter' && handleFlip() : undefined}
        aria-label={!flipped ? 'Reveal meaning' : undefined}
      >
        {/* Front */}
        <div className={styles.front}>
          <span className={styles.jlptBadge}>{verb.jlpt}</span>
          <div className={styles.kanji}>{verb.kanji}</div>
          <div className={styles.kana}>{verb.kana}</div>
          <p className={styles.hint}>Tap to reveal</p>
        </div>

        {/* Back */}
        {flipped && (
          <div className={styles.back}>
            <span className={styles.jlptBadge}>{verb.jlpt}</span>
            <div className={styles.kanji}>{verb.kanji}</div>
            <div className={styles.kana}>{verb.kana}</div>
            <div className={styles.meaning}>{verb.meaning}</div>
            <div className={styles.verbType}>
              {verb.type === 'ichidan' && 'Ichidan (ru-verb)'}
              {verb.type === 'godan' && `Godan (u-verb, ～${verb.ending})`}
              {verb.type === 'irregular' && 'Irregular'}
            </div>
            {verb.examples[0] && (
              <div className={styles.example}>
                <p className={styles.exJa}>{verb.examples[0].japanese}</p>
                <p className={styles.exEn}>{verb.examples[0].english}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className={styles.actions}>
        {!flipped && (
          <Button onClick={handleFlip} size="lg">Reveal</Button>
        )}
        {flipped && !answered && (
          <>
            <Button variant="danger" onClick={() => handleAnswer(false)}>Didn't know</Button>
            <Button variant="primary" onClick={() => handleAnswer(true)}>Knew it</Button>
          </>
        )}
        {answered && (
          <Button onClick={handleNext} size="lg">Next →</Button>
        )}
      </div>
    </div>
  );
}
