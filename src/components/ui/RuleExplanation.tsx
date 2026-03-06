import { useState } from 'react';
import type { ConjugationForm } from '../../types';
import { CONJUGATION_RULES } from '../../data/conjugationRules';
import styles from './RuleExplanation.module.css';

interface RuleExplanationProps {
  form: ConjugationForm;
}

export default function RuleExplanation({ form }: RuleExplanationProps) {
  const [open, setOpen] = useState(false);
  const rule = CONJUGATION_RULES[form];
  if (!rule) return null;

  return (
    <div>
      <button className={styles.toggle} onClick={() => setOpen(o => !o)}>
        {open ? 'Hide' : 'Show'} grammar explanation
      </button>

      {open && (
        <div className={styles.box}>
          <p className={styles.title}>{rule.title}</p>

          <div className={styles.section}>
            <div className={styles.sectionLabel}>When to use</div>
            <p className={styles.when}>{rule.when}</p>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionLabel}>Formation</div>
            <table className={styles.formationTable}>
              <tbody>
                <tr>
                  <td>Ichidan</td>
                  <td>{rule.formation.ichidan}</td>
                </tr>
                <tr>
                  <td>Godan</td>
                  <td>{rule.formation.godan}</td>
                </tr>
                <tr>
                  <td>Irregular</td>
                  <td>{rule.formation.irregular}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionLabel}>Examples</div>
            <ul className={styles.examples}>
              {rule.examples.map((ex, i) => (
                <li key={i}>
                  <span className={styles.jp} lang="ja">{ex.japanese}</span>{' '}
                  <span className={styles.en}>— {ex.english}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
