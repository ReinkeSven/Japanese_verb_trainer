import { useState, useMemo } from 'react';
import type { JLPTLevel, StudyMode, Verb, MultipleChoiceQuestion, ConjugationQuestion, ConjugationForm } from '../types';
import { ALL_FORMS, FORM_LABELS, conjugate } from '../utils/conjugation';
import { useProgress } from '../hooks/useProgress';
import verbData from '../data/verbs.json';
import Flashcard from '../components/modes/Flashcard';
import MultipleChoice from '../components/modes/MultipleChoice';
import ConjugationQuiz from '../components/modes/ConjugationQuiz';
import SRSSession from '../components/modes/SRSSession';
import styles from './Study.module.css';

const ALL_LEVELS: JLPTLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];
const MODES: { id: StudyMode; label: string; desc: string; icon: string }[] = [
  { id: 'flashcard',      label: 'Flashcards',      desc: 'Reveal meaning',       icon: '🃏' },
  { id: 'multiple-choice',label: 'Multiple Choice',  desc: 'Pick the answer',      icon: '🔵' },
  { id: 'conjugation',    label: 'Conjugation',      desc: 'Type the correct form', icon: '✍️' },
  { id: 'srs',            label: 'Spaced Repetition',desc: 'SM-2 review queue',    icon: '📅' },
];

const verbs = verbData as Verb[];

// ─── Question generators ──────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeMCQuestion(verb: Verb, pool: Verb[]): MultipleChoiceQuestion {
  const distractors = shuffle(pool.filter(v => v.id !== verb.id))
    .slice(0, 3)
    .map(v => v.meaning);
  const options = shuffle([verb.meaning, ...distractors]);
  return {
    verb,
    questionType: 'meaning',
    prompt: 'What does this verb mean?',
    correctAnswer: verb.meaning,
    options,
  };
}

function makeConjQuestion(verb: Verb): ConjugationQuestion {
  // Exclude forms that are identical for this verb type to reduce confusion
  const form: ConjugationForm = pickRandom(ALL_FORMS);
  return {
    verb,
    form,
    formLabel: FORM_LABELS[form],
    correctAnswer: conjugate(verb, form),
  };
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Study() {
  const [selectedLevels, setSelectedLevels] = useState<JLPTLevel[]>(['N5']);
  const [mode, setMode] = useState<StudyMode | null>(null);
  const [verbIndex, setVerbIndex] = useState(0);
  const [sessionVerbs, setSessionVerbs] = useState<Verb[]>([]);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });

  const { recordAnswer } = useProgress();

  const filteredVerbs = useMemo(
    () => verbs.filter(v => selectedLevels.includes(v.jlpt)),
    [selectedLevels],
  );

  function toggleLevel(level: JLPTLevel) {
    setSelectedLevels(prev =>
      prev.includes(level)
        ? prev.length > 1 ? prev.filter(l => l !== level) : prev
        : [...prev, level],
    );
  }

  function startSession(m: StudyMode) {
    const shuffled = shuffle(filteredVerbs);
    setSessionVerbs(shuffled);
    setVerbIndex(0);
    setSessionStats({ correct: 0, total: 0 });
    setMode(m);
  }

  function endSession() {
    setMode(null);
  }

  function nextVerb() {
    setVerbIndex(i => (i + 1) % sessionVerbs.length);
  }

  function handleAnswer(correct: boolean) {
    const verb = sessionVerbs[verbIndex];
    recordAnswer(verb.id, correct);
    setSessionStats(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
  }

  // ── Active session ────────────────────────────────────────────────────────

  if (mode && sessionVerbs.length > 0) {
    const verb = sessionVerbs[verbIndex];

    return (
      <div className={styles.sessionPage}>
        <div className={styles.sessionHeader}>
          <button className={styles.backBtn} onClick={endSession}>← Back</button>
          <div className={styles.sessionInfo}>
            <span className={styles.modeName}>
              {MODES.find(m2 => m2.id === mode)?.label}
            </span>
            <span className={styles.sessionStats}>
              {sessionStats.correct}/{sessionStats.total} correct
            </span>
          </div>
        </div>

        <div className={styles.sessionContent}>
          {mode === 'flashcard' && (
            <Flashcard
              key={verb.id + verbIndex}
              verb={verb}
              onCorrect={() => handleAnswer(true)}
              onIncorrect={() => handleAnswer(false)}
              onNext={nextVerb}
            />
          )}
          {mode === 'multiple-choice' && (
            <MultipleChoice
              key={verb.id + verbIndex}
              question={makeMCQuestion(verb, filteredVerbs)}
              onAnswer={handleAnswer}
              onNext={nextVerb}
            />
          )}
          {mode === 'conjugation' && (
            <ConjugationQuiz
              key={verb.id + verbIndex}
              question={makeConjQuestion(verb)}
              onAnswer={handleAnswer}
              onNext={nextVerb}
            />
          )}
          {mode === 'srs' && (
            <SRSSession verbs={sessionVerbs} />
          )}
        </div>
      </div>
    );
  }

  // ── Setup screen ──────────────────────────────────────────────────────────

  return (
    <div className={styles.setupPage}>
      <h1 className={styles.pageTitle}>
        <span className={styles.pageTitleJa}>学習</span> Study
      </h1>

      {/* Level picker */}
      <section className={styles.section}>
        <h2 className={styles.sectionLabel}>JLPT Level</h2>
        <div className={styles.levelPicker}>
          {ALL_LEVELS.map(level => (
            <button
              key={level}
              className={`${styles.levelBtn} ${selectedLevels.includes(level) ? styles.levelActive : ''}`}
              onClick={() => toggleLevel(level)}
            >
              {level}
            </button>
          ))}
        </div>
        <p className={styles.verbCount}>
          {filteredVerbs.length} verb{filteredVerbs.length !== 1 ? 's' : ''} available
        </p>
      </section>

      {/* Mode picker */}
      <section className={styles.section}>
        <h2 className={styles.sectionLabel}>Study Mode</h2>
        <div className={styles.modeGrid}>
          {MODES.map(({ id, label, desc, icon }) => (
            <button
              key={id}
              className={styles.modeCard}
              onClick={() => startSession(id)}
              disabled={filteredVerbs.length === 0}
            >
              <span className={styles.modeIcon}>{icon}</span>
              <span className={styles.modeLabel}>{label}</span>
              <span className={styles.modeDesc}>{desc}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
