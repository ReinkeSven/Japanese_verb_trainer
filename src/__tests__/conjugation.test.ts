import { describe, it, expect } from 'vitest';
import { conjugate } from '../utils/conjugation';
import type { Verb } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makeVerb = (partial: Partial<Verb> & Pick<Verb, 'kana' | 'type'>): Verb => {
  const defaults: Verb = {
    id: 'test',
    kanji: partial.kana,
    kana: partial.kana,
    romaji: '',
    meaning: '',
    jlpt: 'N5',
    examples: [],
    type: partial.type,
  };
  return { ...defaults, ...partial };
};

// ─── Ichidan (ru-verbs) ───────────────────────────────────────────────────────

describe('Ichidan (ru-verb) conjugation', () => {
  const taberu = makeVerb({ kana: 'たべる', type: 'ichidan' }); // 食べる

  it('polite present: たべます', () => {
    expect(conjugate(taberu, 'masu')).toBe('たべます');
  });
  it('polite negative: たべません', () => {
    expect(conjugate(taberu, 'masuNeg')).toBe('たべません');
  });
  it('polite past: たべました', () => {
    expect(conjugate(taberu, 'masuPast')).toBe('たべました');
  });
  it('polite past negative: たべませんでした', () => {
    expect(conjugate(taberu, 'masuPastNeg')).toBe('たべませんでした');
  });
  it('te-form: たべて', () => {
    expect(conjugate(taberu, 'te')).toBe('たべて');
  });
  it('plain past: たべた', () => {
    expect(conjugate(taberu, 'ta')).toBe('たべた');
  });
  it('plain negative: たべない', () => {
    expect(conjugate(taberu, 'nai')).toBe('たべない');
  });
  it('conditional: たべれば', () => {
    expect(conjugate(taberu, 'ba')).toBe('たべれば');
  });
  it('volitional: たべよう', () => {
    expect(conjugate(taberu, 'volitional')).toBe('たべよう');
  });
  it('potential: たべられる', () => {
    expect(conjugate(taberu, 'potential')).toBe('たべられる');
  });
  it('passive: たべられる', () => {
    expect(conjugate(taberu, 'passive')).toBe('たべられる');
  });
  it('causative: たべさせる', () => {
    expect(conjugate(taberu, 'causative')).toBe('たべさせる');
  });
  it('imperative: たべろ', () => {
    expect(conjugate(taberu, 'imperative')).toBe('たべろ');
  });
});

// ─── Godan — く ending ────────────────────────────────────────────────────────

describe('Godan く-verb conjugation (かく)', () => {
  const kaku = makeVerb({ kana: 'かく', type: 'godan', ending: 'く' });

  it('masu: かきます', () => expect(conjugate(kaku, 'masu')).toBe('かきます'));
  it('nai: かかない', () => expect(conjugate(kaku, 'nai')).toBe('かかない'));
  it('te: かいて', () => expect(conjugate(kaku, 'te')).toBe('かいて'));
  it('ta: かいた', () => expect(conjugate(kaku, 'ta')).toBe('かいた'));
  it('ba: かけば', () => expect(conjugate(kaku, 'ba')).toBe('かけば'));
  it('volitional: かこう', () => expect(conjugate(kaku, 'volitional')).toBe('かこう'));
  it('potential: かける', () => expect(conjugate(kaku, 'potential')).toBe('かける'));
  it('passive: かかれる', () => expect(conjugate(kaku, 'passive')).toBe('かかれる'));
  it('causative: かかせる', () => expect(conjugate(kaku, 'causative')).toBe('かかせる'));
  it('imperative: かけ', () => expect(conjugate(kaku, 'imperative')).toBe('かけ'));
});

// ─── Godan — ぐ ending ────────────────────────────────────────────────────────

describe('Godan ぐ-verb conjugation (およぐ)', () => {
  const oyogu = makeVerb({ kana: 'およぐ', type: 'godan', ending: 'ぐ' });

  it('masu: およぎます', () => expect(conjugate(oyogu, 'masu')).toBe('およぎます'));
  it('te: およいで', () => expect(conjugate(oyogu, 'te')).toBe('およいで'));
  it('ta: およいだ', () => expect(conjugate(oyogu, 'ta')).toBe('およいだ'));
  it('nai: およがない', () => expect(conjugate(oyogu, 'nai')).toBe('およがない'));
});

// ─── Godan — す ending ────────────────────────────────────────────────────────

describe('Godan す-verb conjugation (はなす)', () => {
  const hanasu = makeVerb({ kana: 'はなす', type: 'godan', ending: 'す' });

  it('masu: はなします', () => expect(conjugate(hanasu, 'masu')).toBe('はなします'));
  it('te: はなして', () => expect(conjugate(hanasu, 'te')).toBe('はなして'));
  it('ta: はなした', () => expect(conjugate(hanasu, 'ta')).toBe('はなした'));
  it('nai: はなさない', () => expect(conjugate(hanasu, 'nai')).toBe('はなさない'));
  it('ba: はなせば', () => expect(conjugate(hanasu, 'ba')).toBe('はなせば'));
  it('potential: はなせる', () => expect(conjugate(hanasu, 'potential')).toBe('はなせる'));
});

// ─── Godan — つ ending ────────────────────────────────────────────────────────

describe('Godan つ-verb conjugation (まつ)', () => {
  const matsu = makeVerb({ kana: 'まつ', type: 'godan', ending: 'つ' });

  it('masu: まちます', () => expect(conjugate(matsu, 'masu')).toBe('まちます'));
  it('te: まって', () => expect(conjugate(matsu, 'te')).toBe('まって'));
  it('ta: まった', () => expect(conjugate(matsu, 'ta')).toBe('まった'));
  it('nai: またない', () => expect(conjugate(matsu, 'nai')).toBe('またない'));
});

// ─── Godan — ぬ ending ────────────────────────────────────────────────────────

describe('Godan ぬ-verb conjugation (しぬ)', () => {
  const shinu = makeVerb({ kana: 'しぬ', type: 'godan', ending: 'ぬ' });

  it('masu: しにます', () => expect(conjugate(shinu, 'masu')).toBe('しにます'));
  it('te: しんで', () => expect(conjugate(shinu, 'te')).toBe('しんで'));
  it('ta: しんだ', () => expect(conjugate(shinu, 'ta')).toBe('しんだ'));
  it('nai: しなない', () => expect(conjugate(shinu, 'nai')).toBe('しなない'));
});

// ─── Godan — ぶ ending ────────────────────────────────────────────────────────

describe('Godan ぶ-verb conjugation (とぶ)', () => {
  const tobu = makeVerb({ kana: 'とぶ', type: 'godan', ending: 'ぶ' });

  it('masu: とびます', () => expect(conjugate(tobu, 'masu')).toBe('とびます'));
  it('te: とんで', () => expect(conjugate(tobu, 'te')).toBe('とんで'));
  it('ta: とんだ', () => expect(conjugate(tobu, 'ta')).toBe('とんだ'));
});

// ─── Godan — む ending ────────────────────────────────────────────────────────

describe('Godan む-verb conjugation (のむ)', () => {
  const nomu = makeVerb({ kana: 'のむ', type: 'godan', ending: 'む' });

  it('masu: のみます', () => expect(conjugate(nomu, 'masu')).toBe('のみます'));
  it('te: のんで', () => expect(conjugate(nomu, 'te')).toBe('のんで'));
  it('ta: のんだ', () => expect(conjugate(nomu, 'ta')).toBe('のんだ'));
  it('nai: のまない', () => expect(conjugate(nomu, 'nai')).toBe('のまない'));
});

// ─── Godan — る ending (not ichidan!) ─────────────────────────────────────────

describe('Godan る-verb conjugation (はしる)', () => {
  const hashiru = makeVerb({ kana: 'はしる', type: 'godan', ending: 'る' });

  it('masu: はしります', () => expect(conjugate(hashiru, 'masu')).toBe('はしります'));
  it('te: はしって', () => expect(conjugate(hashiru, 'te')).toBe('はしって'));
  it('ta: はしった', () => expect(conjugate(hashiru, 'ta')).toBe('はしった'));
  it('nai: はしらない', () => expect(conjugate(hashiru, 'nai')).toBe('はしらない'));
  it('ba: はしれば', () => expect(conjugate(hashiru, 'ba')).toBe('はしれば'));
  it('potential: はしれる', () => expect(conjugate(hashiru, 'potential')).toBe('はしれる'));
});

// ─── Godan — う ending ────────────────────────────────────────────────────────

describe('Godan う-verb conjugation (かう)', () => {
  const kau = makeVerb({ kana: 'かう', type: 'godan', ending: 'う' });

  it('masu: かいます', () => expect(conjugate(kau, 'masu')).toBe('かいます'));
  it('te: かって', () => expect(conjugate(kau, 'te')).toBe('かって'));
  it('ta: かった', () => expect(conjugate(kau, 'ta')).toBe('かった'));
  it('nai: かわない', () => expect(conjugate(kau, 'nai')).toBe('かわない'));
});

// ─── Irregular exception: 行く te-form ───────────────────────────────────────

describe('Godan irregular exception: 行く (いく)', () => {
  const iku = makeVerb({ kana: 'いく', type: 'godan', ending: 'く' });

  it('te: いって (not いいて)', () => expect(conjugate(iku, 'te')).toBe('いって'));
  it('ta: いった (not いいた)', () => expect(conjugate(iku, 'ta')).toBe('いった'));
  it('masu: いきます (regular)', () => expect(conjugate(iku, 'masu')).toBe('いきます'));
});

// ─── Irregular: する ─────────────────────────────────────────────────────────

describe('Irregular する conjugation', () => {
  const suru = makeVerb({ kana: 'する', type: 'irregular' });

  it('masu: します', () => expect(conjugate(suru, 'masu')).toBe('します'));
  it('masuNeg: しません', () => expect(conjugate(suru, 'masuNeg')).toBe('しません'));
  it('masuPast: しました', () => expect(conjugate(suru, 'masuPast')).toBe('しました'));
  it('te: して', () => expect(conjugate(suru, 'te')).toBe('して'));
  it('ta: した', () => expect(conjugate(suru, 'ta')).toBe('した'));
  it('nai: しない', () => expect(conjugate(suru, 'nai')).toBe('しない'));
  it('ba: すれば', () => expect(conjugate(suru, 'ba')).toBe('すれば'));
  it('volitional: しよう', () => expect(conjugate(suru, 'volitional')).toBe('しよう'));
  it('potential: できる', () => expect(conjugate(suru, 'potential')).toBe('できる'));
  it('passive: される', () => expect(conjugate(suru, 'passive')).toBe('される'));
  it('causative: させる', () => expect(conjugate(suru, 'causative')).toBe('させる'));
  it('imperative: しろ', () => expect(conjugate(suru, 'imperative')).toBe('しろ'));
});

// ─── Irregular: compound suru (べんきょうする) ───────────────────────────────

describe('Compound suru verb (べんきょうする)', () => {
  const benkyou = makeVerb({ kana: 'べんきょうする', type: 'irregular' });

  it('masu: べんきょうします', () => expect(conjugate(benkyou, 'masu')).toBe('べんきょうします'));
  it('te: べんきょうして', () => expect(conjugate(benkyou, 'te')).toBe('べんきょうして'));
  it('nai: べんきょうしない', () => expect(conjugate(benkyou, 'nai')).toBe('べんきょうしない'));
  it('potential: べんきょうできる', () => expect(conjugate(benkyou, 'potential')).toBe('べんきょうできる'));
});

// ─── Irregular: 来る (くる) ──────────────────────────────────────────────────

describe('Irregular 来る (くる) conjugation', () => {
  const kuru = makeVerb({ kana: 'くる', type: 'irregular' });

  it('masu: きます', () => expect(conjugate(kuru, 'masu')).toBe('きます'));
  it('masuNeg: きません', () => expect(conjugate(kuru, 'masuNeg')).toBe('きません'));
  it('te: きて', () => expect(conjugate(kuru, 'te')).toBe('きて'));
  it('ta: きた', () => expect(conjugate(kuru, 'ta')).toBe('きた'));
  it('nai: こない', () => expect(conjugate(kuru, 'nai')).toBe('こない'));
  it('ba: くれば', () => expect(conjugate(kuru, 'ba')).toBe('くれば'));
  it('volitional: こよう', () => expect(conjugate(kuru, 'volitional')).toBe('こよう'));
  it('potential: こられる', () => expect(conjugate(kuru, 'potential')).toBe('こられる'));
  it('imperative: こい', () => expect(conjugate(kuru, 'imperative')).toBe('こい'));
});
