/**
 * Comprehensive validation tests for the verb dataset (src/data/verbs.json).
 *
 * These tests verify:
 *   1. Structural integrity of every verb entry
 *   2. Godan endings match the last kana character
 *   3. Ichidan verbs end in る
 *   4. Irregular verbs are する / 来る or known honorifics
 *   5. No duplicate IDs
 *   6. Every verb can be conjugated in ALL forms without throwing
 *   7. Conjugated forms are non-empty strings
 *   8. Each verb has at least one example sentence
 */

import { describe, it, expect } from 'vitest';
import verbs from '../data/verbs.json';
import { conjugate, ALL_FORMS } from '../utils/conjugation';
import type { Verb } from '../types';

const VERB_LIST = verbs as Verb[];

// ─── Structural tests ──────────────────────────────────────────────────────────

describe('Verb dataset – structural integrity', () => {
  it('has at least 100 verbs', () => {
    expect(VERB_LIST.length).toBeGreaterThanOrEqual(100);
  });

  it('every verb has required fields', () => {
    for (const v of VERB_LIST) {
      expect(v.id,      `${v.id}: missing id`).toBeTruthy();
      expect(v.kanji,   `${v.id}: missing kanji`).toBeTruthy();
      expect(v.kana,    `${v.id}: missing kana`).toBeTruthy();
      expect(v.romaji,  `${v.id}: missing romaji`).toBeTruthy();
      expect(v.meaning, `${v.id}: missing meaning`).toBeTruthy();
      expect(v.jlpt,    `${v.id}: missing jlpt`).toMatch(/^N[1-5]$/);
      expect(v.type,    `${v.id}: unknown type`).toMatch(/^(ichidan|godan|irregular)$/);
    }
  });

  it('has no duplicate IDs', () => {
    const ids = VERB_LIST.map(v => v.id);
    const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(duplicates, `Duplicate IDs: ${duplicates.join(', ')}`).toHaveLength(0);
  });

  it('every verb has at least one example sentence', () => {
    for (const v of VERB_LIST) {
      expect(v.examples.length, `${v.id}: no examples`).toBeGreaterThanOrEqual(1);
    }
  });

  it('example sentences have japanese, romaji, and english', () => {
    for (const v of VERB_LIST) {
      for (const ex of v.examples) {
        expect(ex.japanese, `${v.id}: example missing japanese`).toBeTruthy();
        expect(ex.romaji,   `${v.id}: example missing romaji`).toBeTruthy();
        expect(ex.english,  `${v.id}: example missing english`).toBeTruthy();
      }
    }
  });
});

// ─── Type-specific tests ───────────────────────────────────────────────────────

describe('Verb dataset – godan verbs', () => {
  const godanVerbs = VERB_LIST.filter(v => v.type === 'godan');
  const validEndings = ['く', 'ぐ', 'す', 'つ', 'ぬ', 'ぶ', 'む', 'る', 'う'];

  it('all godan verbs have an ending field', () => {
    for (const v of godanVerbs) {
      expect(v.ending, `${v.id}: godan verb missing ending`).toBeTruthy();
    }
  });

  it('godan ending matches final kana character', () => {
    for (const v of godanVerbs) {
      expect(v.ending, `${v.id}: ending '${v.ending}' != kana[-1] '${v.kana.slice(-1)}'`)
        .toBe(v.kana.slice(-1));
    }
  });

  it('godan endings are in the valid set', () => {
    for (const v of godanVerbs) {
      expect(validEndings, `${v.id}: unrecognised ending '${v.ending}'`)
        .toContain(v.ending);
    }
  });
});

describe('Verb dataset – ichidan verbs', () => {
  it('all ichidan verbs end in る', () => {
    for (const v of VERB_LIST.filter(v => v.type === 'ichidan')) {
      expect(v.kana.endsWith('る'), `${v.id} (${v.kana}): ichidan verb does not end in る`)
        .toBe(true);
    }
  });
});

describe('Verb dataset – irregular verbs', () => {
  it('irregular verbs are する, 来る, suru-compounds, or known defectives', () => {
    const knownDefective = ['ございます'];
    for (const v of VERB_LIST.filter(v => v.type === 'irregular')) {
      const valid =
        v.kana === 'する' ||
        v.kana === 'くる' ||
        v.kana.endsWith('する') ||
        v.kana.endsWith('くる') ||
        knownDefective.includes(v.kana);
      expect(valid, `${v.id} (${v.kana}): unexpected irregular verb`).toBe(true);
    }
  });
});

// ─── Conjugation smoke tests ───────────────────────────────────────────────────

describe('Every verb conjugates in all forms without throwing', () => {
  for (const v of VERB_LIST) {
    it(`${v.id} (${v.kana}) – all ${ALL_FORMS.length} forms`, () => {
      for (const form of ALL_FORMS) {
        let result: string;
        expect(
          () => { result = conjugate(v, form); },
          `${v.id}: conjugate(${form}) threw an error`
        ).not.toThrow();
        expect(
          result!,
          `${v.id}: conjugate(${form}) returned empty string`
        ).toBeTruthy();
      }
    });
  }
});

// ─── Spot-check known conjugations ────────────────────────────────────────────

describe('Spot-check specific verb conjugations', () => {
  const find = (id: string) => VERB_LIST.find(v => v.id === id)!;

  it('食べる (taberu) – polite present', () => {
    expect(conjugate(find('taberu'), 'masu')).toBe('たべます');
  });

  it('書く (kaku) – te-form with く→いて', () => {
    expect(conjugate(find('kaku'), 'te')).toBe('かいて');
  });

  it('行く (iku) – irregular te-form (いって, not いいて)', () => {
    expect(conjugate(find('iku'), 'te')).toBe('いって');
  });

  it('来る (kuru) – plain negative', () => {
    expect(conjugate(find('kuru'), 'nai')).toBe('こない');
  });

  it('帰る (kaeru_go) – is godan type', () => {
    const kaeru = find('kaeru_go');
    expect(kaeru.type).toBe('godan');
    expect(conjugate(kaeru, 'masu')).toBe('かえります');
  });

  it('変える (kaeru) – is ichidan type', () => {
    const kaeru = find('kaeru');
    expect(kaeru.type).toBe('ichidan');
    expect(conjugate(kaeru, 'masu')).toBe('かえます');
  });

  it('勉強する (benkyousuru) – compound suru potential', () => {
    const v = VERB_LIST.find(v => v.kana === 'べんきょうする')!;
    expect(conjugate(v, 'potential')).toBe('べんきょうできる');
  });

  it('飲む (nomu) – teiru form', () => {
    expect(conjugate(find('nomu'), 'teiru')).toBe('のんでいる');
  });

  it('食べる (taberu) – tai form', () => {
    expect(conjugate(find('taberu'), 'tai')).toBe('たべたい');
  });

  it('書く (kaku) – teshimau form', () => {
    expect(conjugate(find('kaku'), 'teshimau')).toBe('かいてしまう');
  });

  it('食べる (taberu) – temo form', () => {
    expect(conjugate(find('taberu'), 'temo')).toBe('たべても');
  });
});
