/**
 * TDD tests for new conjugation forms:
 *   - teiru   : -te iru  (continuous/progressive/resultant state)
 *   - tai     : -tai     (desiderative – want to)
 *   - teshimau: -te shimau (accidental/regrettable completion)
 *   - temo    : -te mo   (concessive – even if / even though)
 *
 * Additionally tests the ございます irregular verb.
 *
 * Tests are written BEFORE the implementation (TDD).
 * Run:  npm test -- conjugation_new_forms
 */

import { describe, it, expect } from 'vitest';
import { conjugate } from '../utils/conjugation';
import type { Verb } from '../types';

// ─── Helper ───────────────────────────────────────────────────────────────────

const makeVerb = (partial: Partial<Verb> & Pick<Verb, 'kana' | 'type'>): Verb => ({
  id: 'test',
  kanji: partial.kana,
  romaji: '',
  meaning: '',
  jlpt: 'N5',
  examples: [],
  ...partial,
});

// ─── -te iru (teiru) ─────────────────────────────────────────────────────────
// Formation: [te-form] + いる
// Expresses: ongoing action ("is doing") or resultant state ("is in the state of having done")

describe('-te iru (teiru) – ichidan', () => {
  const taberu = makeVerb({ kana: 'たべる', type: 'ichidan' }); // 食べる

  it('たべる → たべている', () => {
    expect(conjugate(taberu, 'teiru')).toBe('たべている');
  });
});

describe('-te iru (teiru) – godan く', () => {
  const kaku = makeVerb({ kana: 'かく', type: 'godan', ending: 'く' }); // 書く

  it('かく → かいている', () => {
    expect(conjugate(kaku, 'teiru')).toBe('かいている');
  });
});

describe('-te iru (teiru) – godan む', () => {
  const nomu = makeVerb({ kana: 'のむ', type: 'godan', ending: 'む' }); // 飲む

  it('のむ → のんでいる', () => {
    expect(conjugate(nomu, 'teiru')).toBe('のんでいる');
  });
});

describe('-te iru (teiru) – godan う', () => {
  const kau = makeVerb({ kana: 'かう', type: 'godan', ending: 'う' }); // 買う

  it('かう → かっている', () => {
    expect(conjugate(kau, 'teiru')).toBe('かっている');
  });
});

describe('-te iru (teiru) – irregular する', () => {
  const suru = makeVerb({ kana: 'する', type: 'irregular' });

  it('する → している', () => {
    expect(conjugate(suru, 'teiru')).toBe('している');
  });
});

describe('-te iru (teiru) – irregular 来る', () => {
  const kuru = makeVerb({ kana: 'くる', type: 'irregular' });

  it('くる → きている', () => {
    expect(conjugate(kuru, 'teiru')).toBe('きている');
  });
});

describe('-te iru (teiru) – compound suru', () => {
  const benkyou = makeVerb({ kana: 'べんきょうする', type: 'irregular' });

  it('べんきょうする → べんきょうしている', () => {
    expect(conjugate(benkyou, 'teiru')).toBe('べんきょうしている');
  });
});

// ─── -tai (desiderative) ─────────────────────────────────────────────────────
// Formation: [i-stem / masu-stem] + たい
// Expresses: desire to do something ("want to…")

describe('-tai (desiderative) – ichidan', () => {
  const taberu = makeVerb({ kana: 'たべる', type: 'ichidan' });

  it('たべる → たべたい', () => {
    expect(conjugate(taberu, 'tai')).toBe('たべたい');
  });
});

describe('-tai (desiderative) – ichidan みる', () => {
  const miru = makeVerb({ kana: 'みる', type: 'ichidan' });

  it('みる → みたい', () => {
    expect(conjugate(miru, 'tai')).toBe('みたい');
  });
});

describe('-tai (desiderative) – godan く', () => {
  const kaku = makeVerb({ kana: 'かく', type: 'godan', ending: 'く' });

  it('かく → かきたい', () => {
    expect(conjugate(kaku, 'tai')).toBe('かきたい');
  });
});

describe('-tai (desiderative) – godan む', () => {
  const nomu = makeVerb({ kana: 'のむ', type: 'godan', ending: 'む' });

  it('のむ → のみたい', () => {
    expect(conjugate(nomu, 'tai')).toBe('のみたい');
  });
});

describe('-tai (desiderative) – godan う', () => {
  const kau = makeVerb({ kana: 'かう', type: 'godan', ending: 'う' });

  it('かう → かいたい', () => {
    expect(conjugate(kau, 'tai')).toBe('かいたい');
  });
});

describe('-tai (desiderative) – irregular する', () => {
  const suru = makeVerb({ kana: 'する', type: 'irregular' });

  it('する → したい', () => {
    expect(conjugate(suru, 'tai')).toBe('したい');
  });
});

describe('-tai (desiderative) – irregular 来る', () => {
  const kuru = makeVerb({ kana: 'くる', type: 'irregular' });

  it('くる → きたい', () => {
    expect(conjugate(kuru, 'tai')).toBe('きたい');
  });
});

describe('-tai (desiderative) – compound suru', () => {
  const benkyou = makeVerb({ kana: 'べんきょうする', type: 'irregular' });

  it('べんきょうする → べんきょうしたい', () => {
    expect(conjugate(benkyou, 'tai')).toBe('べんきょうしたい');
  });
});

// ─── -te shimau (teshimau) ───────────────────────────────────────────────────
// Formation: [te-form] + しまう
// Expresses: an action completed (often with regret or unexpectedness):
//   "ended up doing", "accidentally did", "did completely"

describe('-te shimau (teshimau) – ichidan', () => {
  const taberu = makeVerb({ kana: 'たべる', type: 'ichidan' });

  it('たべる → たべてしまう', () => {
    expect(conjugate(taberu, 'teshimau')).toBe('たべてしまう');
  });
});

describe('-te shimau (teshimau) – godan く', () => {
  const kaku = makeVerb({ kana: 'かく', type: 'godan', ending: 'く' });

  it('かく → かいてしまう', () => {
    expect(conjugate(kaku, 'teshimau')).toBe('かいてしまう');
  });
});

describe('-te shimau (teshimau) – godan む', () => {
  const nomu = makeVerb({ kana: 'のむ', type: 'godan', ending: 'む' });

  it('のむ → のんでしまう', () => {
    expect(conjugate(nomu, 'teshimau')).toBe('のんでしまう');
  });
});

describe('-te shimau (teshimau) – godan ぐ', () => {
  const oyogu = makeVerb({ kana: 'およぐ', type: 'godan', ending: 'ぐ' });

  it('およぐ → およいでしまう', () => {
    expect(conjugate(oyogu, 'teshimau')).toBe('およいでしまう');
  });
});

describe('-te shimau (teshimau) – irregular する', () => {
  const suru = makeVerb({ kana: 'する', type: 'irregular' });

  it('する → してしまう', () => {
    expect(conjugate(suru, 'teshimau')).toBe('してしまう');
  });
});

describe('-te shimau (teshimau) – irregular 来る', () => {
  const kuru = makeVerb({ kana: 'くる', type: 'irregular' });

  it('くる → きてしまう', () => {
    expect(conjugate(kuru, 'teshimau')).toBe('きてしまう');
  });
});

// ─── -te mo (temo) ───────────────────────────────────────────────────────────
// Formation: [te-form] + も
// Expresses: concession – "even if …", "even though …"
//   e.g. たべても太らない = Even if I eat, I don't gain weight.

describe('-te mo (temo) – ichidan', () => {
  const taberu = makeVerb({ kana: 'たべる', type: 'ichidan' });

  it('たべる → たべても', () => {
    expect(conjugate(taberu, 'temo')).toBe('たべても');
  });
});

describe('-te mo (temo) – godan く', () => {
  const kaku = makeVerb({ kana: 'かく', type: 'godan', ending: 'く' });

  it('かく → かいても', () => {
    expect(conjugate(kaku, 'temo')).toBe('かいても');
  });
});

describe('-te mo (temo) – godan む', () => {
  const nomu = makeVerb({ kana: 'のむ', type: 'godan', ending: 'む' });

  it('のむ → のんでも', () => {
    expect(conjugate(nomu, 'temo')).toBe('のんでも');
  });
});

describe('-te mo (temo) – godan ぐ (voiced ending → でも)', () => {
  const oyogu = makeVerb({ kana: 'およぐ', type: 'godan', ending: 'ぐ' });

  it('およぐ → およいでも', () => {
    expect(conjugate(oyogu, 'temo')).toBe('およいでも');
  });
});

describe('-te mo (temo) – irregular する', () => {
  const suru = makeVerb({ kana: 'する', type: 'irregular' });

  it('する → しても', () => {
    expect(conjugate(suru, 'temo')).toBe('しても');
  });
});

describe('-te mo (temo) – irregular 来る', () => {
  const kuru = makeVerb({ kana: 'くる', type: 'irregular' });

  it('くる → きても', () => {
    expect(conjugate(kuru, 'temo')).toBe('きても');
  });
});

// ─── ございます (honorific irregular) ─────────────────────────────────────────
// ございます is a defective honorific verb (keigo form of ある).
// It is only used in polite speech; plain-form conjugations are not in common use.

describe('Irregular ございます – polite forms', () => {
  const gozaru = makeVerb({ kana: 'ございます', type: 'irregular' });

  it('masu: ございます', () => expect(conjugate(gozaru, 'masu')).toBe('ございます'));
  it('masuNeg: ございません', () => expect(conjugate(gozaru, 'masuNeg')).toBe('ございません'));
  it('masuPast: ございました', () => expect(conjugate(gozaru, 'masuPast')).toBe('ございました'));
  it('masuPastNeg: ございませんでした', () =>
    expect(conjugate(gozaru, 'masuPastNeg')).toBe('ございませんでした'));
  it('te: ございまして', () => expect(conjugate(gozaru, 'te')).toBe('ございまして'));
  it('ta: ございました', () => expect(conjugate(gozaru, 'ta')).toBe('ございました'));
});
