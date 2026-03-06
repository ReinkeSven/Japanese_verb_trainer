/**
 * Japanese Verb Conjugation Engine
 *
 * Handles conjugation for all three verb classes:
 *   - Ichidan (一段, ru-verbs)
 *   - Godan   (五段, u-verbs)
 *   - Irregular (する / 来る and suru-compound verbs)
 *
 * Reference:
 *   Godan te/ta forms follow the "i-onbin / u-onbin" euphonic change rules.
 */

import type { Verb, ConjugationForm, ConjugationResult } from '../types';

// ─── Godan stem helpers ───────────────────────────────────────────────────────

/**
 * Maps the final kana of a godan verb to its various stem vowel grades.
 */
const GODAN_TABLE: Record<
  string,
  { i: string; a: string; e: string; o: string; te: string; ta: string }
> = {
  く: { i: 'き', a: 'か', e: 'け', o: 'こ', te: 'いて', ta: 'いた' },
  ぐ: { i: 'ぎ', a: 'が', e: 'げ', o: 'ご', te: 'いで', ta: 'いだ' },
  す: { i: 'し', a: 'さ', e: 'せ', o: 'そ', te: 'して', ta: 'した' },
  つ: { i: 'ち', a: 'た', e: 'て', o: 'と', te: 'って', ta: 'った' },
  ぬ: { i: 'に', a: 'な', e: 'ね', o: 'の', te: 'んで', ta: 'んだ' },
  ぶ: { i: 'び', a: 'ば', e: 'べ', o: 'ぼ', te: 'んで', ta: 'んだ' },
  む: { i: 'み', a: 'ま', e: 'め', o: 'も', te: 'んで', ta: 'んだ' },
  る: { i: 'り', a: 'ら', e: 'れ', o: 'ろ', te: 'って', ta: 'った' },
  う: { i: 'い', a: 'わ', e: 'え', o: 'お', te: 'って', ta: 'った' },
};

/** Strip the trailing kana character. */
const stem = (kana: string) => kana.slice(0, -1);

/** Return the ending kana character. */
const ending = (kana: string) => kana.slice(-1);

// ─── Ichidan conjugation ──────────────────────────────────────────────────────

function conjugateIchidan(kana: string, form: ConjugationForm): string {
  const base = stem(kana); // remove る

  switch (form) {
    case 'masu':        return base + 'ます';
    case 'masuNeg':     return base + 'ません';
    case 'masuPast':    return base + 'ました';
    case 'masuPastNeg': return base + 'ませんでした';
    case 'te':          return base + 'て';
    case 'ta':          return base + 'た';
    case 'nai':         return base + 'ない';
    case 'ba':          return base + 'れば';
    case 'volitional':  return base + 'よう';
    case 'potential':   return base + 'られる';
    case 'passive':     return base + 'られる';
    case 'causative':   return base + 'させる';
    case 'imperative':  return base + 'ろ';
  }
}

// ─── Godan conjugation ────────────────────────────────────────────────────────

function conjugateGodan(verb: Verb, form: ConjugationForm): string {
  const kana = verb.kana;
  const end = ending(kana);
  const base = stem(kana);
  const g = GODAN_TABLE[end];

  if (!g) throw new Error(`Unknown godan ending: ${end} for verb ${kana}`);

  // 行く (iku) has an irregular te/ta form: いって / いった
  const isIku = kana === 'いく' && end === 'く';

  switch (form) {
    case 'masu':        return base + g.i + 'ます';
    case 'masuNeg':     return base + g.i + 'ません';
    case 'masuPast':    return base + g.i + 'ました';
    case 'masuPastNeg': return base + g.i + 'ませんでした';
    case 'te':          return isIku ? base + 'って' : base + g.te;
    case 'ta':          return isIku ? base + 'った' : base + g.ta;
    case 'nai':         return base + g.a + 'ない';
    case 'ba':          return base + g.e + 'ば';
    case 'volitional':  return base + g.o + 'う';
    case 'potential':   return base + g.e + 'る';
    case 'passive':     return base + g.a + 'れる';
    case 'causative':   return base + g.a + 'せる';
    case 'imperative':  return base + g.e;
  }
}

// ─── Irregular conjugation ────────────────────────────────────────────────────

/**
 * Handles する and 来る, plus suru-compound verbs (e.g. 勉強する).
 * Compound suru verbs are detected by checking if the kana ends with "する".
 */
function conjugateIrregular(verb: Verb, form: ConjugationForm): string {
  const kana = verb.kana;

  // ── 来る (くる) ──
  if (kana === 'くる') {
    switch (form) {
      case 'masu':        return 'きます';
      case 'masuNeg':     return 'きません';
      case 'masuPast':    return 'きました';
      case 'masuPastNeg': return 'きませんでした';
      case 'te':          return 'きて';
      case 'ta':          return 'きた';
      case 'nai':         return 'こない';
      case 'ba':          return 'くれば';
      case 'volitional':  return 'こよう';
      case 'potential':   return 'こられる';
      case 'passive':     return 'こられる';
      case 'causative':   return 'こさせる';
      case 'imperative':  return 'こい';
    }
  }

  // ── する / compound suru (e.g. べんきょうする) ──
  const isSuru = kana === 'する' || kana.endsWith('する');
  if (isSuru) {
    const prefix = kana === 'する' ? '' : kana.slice(0, -2); // e.g. "べんきょう"
    switch (form) {
      case 'masu':        return prefix + 'します';
      case 'masuNeg':     return prefix + 'しません';
      case 'masuPast':    return prefix + 'しました';
      case 'masuPastNeg': return prefix + 'しませんでした';
      case 'te':          return prefix + 'して';
      case 'ta':          return prefix + 'した';
      case 'nai':         return prefix + 'しない';
      case 'ba':          return prefix + 'すれば';
      case 'volitional':  return prefix + 'しよう';
      case 'potential':   return prefix + 'できる';
      case 'passive':     return prefix + 'される';
      case 'causative':   return prefix + 'させる';
      case 'imperative':  return prefix + 'しろ';
    }
  }

  throw new Error(`Unhandled irregular verb: ${kana}`);
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Human-readable labels for each conjugation form. */
export const FORM_LABELS: Record<ConjugationForm, string> = {
  masu:         'Polite Present',
  masuNeg:      'Polite Negative',
  masuPast:     'Polite Past',
  masuPastNeg:  'Polite Past Negative',
  te:           'Te-form',
  ta:           'Plain Past',
  nai:          'Plain Negative',
  ba:           'Conditional (ば)',
  volitional:   'Volitional (よう)',
  potential:    'Potential',
  passive:      'Passive',
  causative:    'Causative',
  imperative:   'Imperative',
};

export const ALL_FORMS: ConjugationForm[] = Object.keys(FORM_LABELS) as ConjugationForm[];

/**
 * Conjugate a verb into the given form.
 * Returns the conjugated Japanese string.
 */
export function conjugate(verb: Verb, form: ConjugationForm): string {
  switch (verb.type) {
    case 'ichidan':   return conjugateIchidan(verb.kana, form);
    case 'godan':     return conjugateGodan(verb, form);
    case 'irregular': return conjugateIrregular(verb, form);
  }
}

/**
 * Returns all conjugations for a verb as an array of ConjugationResult objects.
 */
export function getAllConjugations(verb: Verb): ConjugationResult[] {
  return ALL_FORMS.map((form) => ({
    form,
    label: FORM_LABELS[form],
    japanese: conjugate(verb, form),
    romaji: '', // Romaji generation is out of scope; left empty for UI display
  }));
}
