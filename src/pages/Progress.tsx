import { useMemo } from 'react';
import { getProgress, getOverallStats, getSRSCards, clearProgress, clearSRSCards } from '../store/progressStore';
import { getStabilityLabel } from '../utils/srs';
import ProgressBar from '../components/ui/ProgressBar';
import verbData from '../data/verbs.json';
import type { Verb, JLPTLevel } from '../types';
import styles from './Progress.module.css';

const verbs = verbData as Verb[];
const LEVELS: JLPTLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

export default function Progress() {
  const progress = getProgress();
  const stats = getOverallStats();
  const srsCards = getSRSCards();

  const byLevel = useMemo(() =>
    LEVELS.map(level => {
      const lvVerbs = verbs.filter(v => v.jlpt === level);
      const studied = lvVerbs.filter(v => progress[v.id]?.seen > 0);
      const totalCorrect = studied.reduce((s, v) => s + (progress[v.id]?.correct ?? 0), 0);
      const totalSeen = studied.reduce((s, v) => s + (progress[v.id]?.seen ?? 0), 0);
      return {
        level,
        total: lvVerbs.length,
        studied: studied.length,
        accuracy: totalSeen > 0 ? Math.round((totalCorrect / totalSeen) * 100) : 0,
      };
    }),
  [progress]);

  const studiedVerbs = useMemo(() =>
    verbs
      .filter(v => progress[v.id]?.seen > 0)
      .sort((a, b) => (progress[b.id]?.seen ?? 0) - (progress[a.id]?.seen ?? 0)),
  [progress]);

  function handleReset() {
    if (window.confirm('Reset all progress and SRS data? This cannot be undone.')) {
      clearProgress();
      clearSRSCards();
      window.location.reload();
    }
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>
        <span className={styles.pageTitleJa}>進捗</span> Progress
      </h1>

      {/* Overview stats */}
      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.verbsStudied}</span>
          <span className={styles.statLabel}>Verbs Studied</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.totalSeen}</span>
          <span className={styles.statLabel}>Total Reviews</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.accuracy}%</span>
          <span className={styles.statLabel}>Accuracy</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{Object.keys(srsCards).length}</span>
          <span className={styles.statLabel}>SRS Cards</span>
        </div>
      </section>

      {/* By JLPT level */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Progress by Level</h2>
        <div className={styles.levelProgress}>
          {byLevel.map(({ level, total, studied, accuracy }) => (
            <div key={level} className={styles.levelRow}>
              <span className={styles.levelLabel}>{level}</span>
              <div className={styles.levelBars}>
                <ProgressBar
                  value={total > 0 ? Math.round((studied / total) * 100) : 0}
                  label={`${studied}/${total} verbs`}
                />
                {studied > 0 && (
                  <ProgressBar value={accuracy} label="accuracy" />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SRS card statuses */}
      {Object.keys(srsCards).length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>SRS Card Status</h2>
          <div className={styles.srsGrid}>
            {(['New', 'Learning', 'Young', 'Mature', 'Mastered'] as const).map(label => {
              const count = Object.values(srsCards).filter(
                c => getStabilityLabel(c) === label,
              ).length;
              return (
                <div key={label} className={`${styles.srsCard} ${styles[label.toLowerCase()]}`}>
                  <span className={styles.srsCount}>{count}</span>
                  <span className={styles.srsLabel}>{label}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Verb table */}
      {studiedVerbs.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Studied Verbs</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.verbTable}>
              <thead>
                <tr>
                  <th>Verb</th>
                  <th>Meaning</th>
                  <th>JLPT</th>
                  <th>Seen</th>
                  <th>Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {studiedVerbs.map(v => {
                  const p = progress[v.id];
                  const acc = p.seen > 0 ? Math.round((p.correct / p.seen) * 100) : 0;
                  return (
                    <tr key={v.id}>
                      <td lang="ja">
                        <span className={styles.verbKanji}>{v.kanji}</span>
                        <span className={styles.verbKana}>{v.kana}</span>
                      </td>
                      <td>{v.meaning}</td>
                      <td><span className={styles.jlptTag}>{v.jlpt}</span></td>
                      <td>{p.seen}</td>
                      <td>
                        <span className={acc >= 80 ? styles.accGood : acc >= 50 ? styles.accMid : styles.accLow}>
                          {acc}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {stats.totalSeen === 0 && (
        <div className={styles.empty}>
          <p>No study data yet. <a href="/study">Start studying →</a></p>
        </div>
      )}

      {/* Reset */}
      <div className={styles.resetZone}>
        <button className={styles.resetBtn} onClick={handleReset}>Reset all progress</button>
      </div>
    </div>
  );
}
