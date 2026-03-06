import { useState, useRef, useEffect } from 'react';
import type { ConjugationQuestion } from '../../types';
import { getAllConjugations } from '../../utils/conjugation';
import Button from '../ui/Button';
import RuleExplanation from '../ui/RuleExplanation';
import styles from './ConjugationQuiz.module.css';

interface ConjugationQuizProps {
  question: ConjugationQuestion;
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
}

export default function ConjugationQuiz({ question, onAnswer, onNext }: ConjugationQuizProps) {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const normalise = (s: string) => s.trim().replace(/\s+/g, '');
  const isCorrect = normalise(input) === normalise(question.correctAnswer);

  useEffect(() => {
    if (!submitted) inputRef.current?.focus();
  }, [question, submitted]);

  function handleSubmit() {
    if (!input.trim()) return;
    setSubmitted(true);
    onAnswer(isCorrect);
  }

  function handleNext() {
    setInput('');
    setSubmitted(false);
    setShowTable(false);
    onNext();
  }

  const allForms = getAllConjugations(question.verb);

  return (
    <div className={styles.wrapper}>
      {/* Prompt */}
      <div className={styles.promptCard}>
        <span className={styles.jlptBadge}>{question.verb.jlpt}</span>
        <div className={styles.kanji}>{question.verb.kanji}</div>
        <div className={styles.kana}>{question.verb.kana}</div>
        <p className={styles.formLabel}>
          What is the <strong>{question.formLabel}</strong>?
        </p>
      </div>

      {/* Input */}
      <div className={styles.inputGroup}>
        <input
          ref={inputRef}
          className={`${styles.input} ${submitted ? (isCorrect ? styles.inputCorrect : styles.inputWrong) : ''}`}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !submitted) handleSubmit(); }}
          placeholder="Type the conjugation…"
          disabled={submitted}
          lang="ja"
        />
        {!submitted && (
          <Button onClick={handleSubmit} disabled={!input.trim()}>Check</Button>
        )}
      </div>

      {/* Feedback */}
      {submitted && (
        <div className={`${styles.feedback} ${isCorrect ? styles.feedbackCorrect : styles.feedbackWrong}`}>
          {isCorrect ? (
            <span>✓ Correct! <strong>{question.correctAnswer}</strong></span>
          ) : (
            <span>✗ Correct answer: <strong>{question.correctAnswer}</strong></span>
          )}
        </div>
      )}

      {/* Grammar rule explanation */}
      {submitted && <RuleExplanation form={question.form} />}

      {/* Full conjugation table toggle */}
      {submitted && (
        <button className={styles.tableToggle} onClick={() => setShowTable(t => !t)}>
          {showTable ? 'Hide' : 'Show'} full conjugation table
        </button>
      )}

      {showTable && (
        <div className={styles.table}>
          <table>
            <thead>
              <tr><th>Form</th><th>Japanese</th></tr>
            </thead>
            <tbody>
              {allForms.map(f => (
                <tr key={f.form} className={f.form === question.form ? styles.highlightRow : ''}>
                  <td>{f.label}</td>
                  <td lang="ja">{f.japanese}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {submitted && (
        <Button onClick={handleNext}>Next →</Button>
      )}
    </div>
  );
}
