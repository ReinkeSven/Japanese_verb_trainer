import { Link } from 'react-router-dom';
import { getOverallStats } from '../store/progressStore';
import styles from './Home.module.css';

const FEATURES = [
  { icon: '🃏', title: 'Flashcards', desc: 'Drill vocabulary with tap-to-reveal cards.' },
  { icon: '✍️', title: 'Conjugation Quiz', desc: 'Type conjugated forms and check your answer.' },
  { icon: '🔵', title: 'Multiple Choice', desc: 'Pick the right meaning or conjugation from 4 options.' },
  { icon: '📅', title: 'Spaced Repetition', desc: 'SM-2 algorithm schedules reviews for long-term retention.' },
];

const LEVELS = [
  { level: 'N5', color: '#16a34a', desc: 'Most common verbs — a great starting point.' },
  { level: 'N4', color: '#2563eb', desc: 'Everyday verbs used in daily conversation.' },
  { level: 'N3', color: '#7c3aed', desc: 'Intermediate verbs for fluent reading.' },
  { level: 'N2', color: '#d97706', desc: 'Business-level vocabulary and formal forms.' },
  { level: 'N1', color: '#dc2626', desc: 'Advanced, literary, and nuanced verbs.' },
];

export default function Home() {
  const stats = getOverallStats();

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroJa}>日本語動詞</div>
        <h1 className={styles.heroTitle}>Japanese Verb Trainer</h1>
        <p className={styles.heroSub}>
          Master Japanese verbs for all JLPT levels — vocabulary, meaning, and conjugation.
        </p>
        <div className={styles.heroActions}>
          <Link to="/study" className={styles.ctaPrimary}>Start Studying</Link>
          <Link to="/progress" className={styles.ctaSecondary}>View Progress</Link>
        </div>
        {stats.totalSeen > 0 && (
          <div className={styles.statsPill}>
            📊 {stats.verbsStudied} verbs studied · {stats.accuracy}% accuracy
          </div>
        )}
      </section>

      {/* Decorative divider */}
      <div className={styles.wave} aria-hidden="true">〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜</div>

      {/* Study modes */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Study Modes</h2>
        <div className={styles.featureGrid}>
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} className={styles.featureCard}>
              <span className={styles.featureIcon}>{icon}</span>
              <h3 className={styles.featureTitle}>{title}</h3>
              <p className={styles.featureDesc}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* JLPT levels */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>JLPT Levels</h2>
        <div className={styles.levelGrid}>
          {LEVELS.map(({ level, color, desc }) => (
            <div key={level} className={styles.levelCard} style={{ '--accent': color } as React.CSSProperties}>
              <span className={styles.levelBadge}>{level}</span>
              <p className={styles.levelDesc}>{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
