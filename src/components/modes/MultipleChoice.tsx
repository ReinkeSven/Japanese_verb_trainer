import { useState } from 'react';
import type { MultipleChoiceQuestion } from '../../types';
import Button from '../ui/Button';
import styles from './MultipleChoice.module.css';

interface MultipleChoiceProps {
  question: MultipleChoiceQuestion;
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
}

export default function MultipleChoice({ question, onAnswer, onNext }: MultipleChoiceProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const isCorrect = selected === question.correctAnswer;

  function handleSelect(option: string) {
    if (selected) return; // already answered
    setSelected(option);
    onAnswer(option === question.correctAnswer);
  }

  function handleNext() {
    setSelected(null);
    onNext();
  }

  return (
    <div className={styles.wrapper}>
      {/* Question */}
      <div className={styles.questionCard}>
        <span className={styles.jlptBadge}>{question.verb.jlpt}</span>
        <div className={styles.kanji}>{question.verb.kanji}</div>
        <div className={styles.kana}>{question.verb.kana}</div>
        <p className={styles.prompt}>{question.prompt}</p>
      </div>

      {/* Options */}
      <div className={styles.options}>
        {question.options.map((opt) => {
          let state: 'idle' | 'correct' | 'wrong' | 'missed' = 'idle';
          if (selected) {
            if (opt === question.correctAnswer) state = 'correct';
            else if (opt === selected) state = 'wrong';
          }
          return (
            <button
              key={opt}
              className={`${styles.option} ${styles[state]}`}
              onClick={() => handleSelect(opt)}
              disabled={!!selected}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className={`${styles.feedback} ${isCorrect ? styles.feedbackCorrect : styles.feedbackWrong}`}>
          {isCorrect ? '✓ Correct!' : `✗ The answer was: ${question.correctAnswer}`}
        </div>
      )}

      {selected && (
        <Button onClick={handleNext}>Next →</Button>
      )}
    </div>
  );
}
