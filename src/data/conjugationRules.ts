/**
 * Explanations for every conjugation form.
 * Each entry describes:
 *   - title    : Short name displayed in the UI
 *   - when     : When / why to use this form
 *   - formation: How to build it (per verb class)
 *   - examples : One short before/after example
 */

import type { ConjugationForm } from '../types';

export interface ConjugationRuleExplanation {
  title: string;
  when: string;
  formation: {
    ichidan: string;
    godan: string;
    irregular: string;
  };
  examples: Array<{ japanese: string; english: string }>;
}

export const CONJUGATION_RULES: Record<ConjugationForm, ConjugationRuleExplanation> = {

  // ── Polite forms ──────────────────────────────────────────────────────────

  masu: {
    title: 'Polite Present (〜ます)',
    when: 'Used in polite/formal speech for present or future actions. The default form when speaking to strangers, colleagues, or superiors.',
    formation: {
      ichidan: 'Drop る → add ます　例: 食べる → 食べます',
      godan:   'Change the final kana to the い-row → add ます　例: 書く → 書きます',
      irregular: 'する → します、来る → きます',
    },
    examples: [
      { japanese: '毎日コーヒーを飲みます。', english: 'I drink coffee every day.' },
    ],
  },

  masuNeg: {
    title: 'Polite Negative (〜ません)',
    when: 'Polite negative for present/future. Used to deny an action or state formally.',
    formation: {
      ichidan: 'Drop る → add ません　例: 食べる → 食べません',
      godan:   'い-row stem → add ません　例: 書く → 書きません',
      irregular: 'する → しません、来る → きません',
    },
    examples: [
      { japanese: 'お酒を飲みません。', english: 'I don\'t drink alcohol.' },
    ],
  },

  masuPast: {
    title: 'Polite Past (〜ました)',
    when: 'Polite affirmative past tense. Used to describe completed actions in formal speech.',
    formation: {
      ichidan: 'Drop る → add ました　例: 食べる → 食べました',
      godan:   'い-row stem → add ました　例: 書く → 書きました',
      irregular: 'する → しました、来る → きました',
    },
    examples: [
      { japanese: '昨日映画を見ました。', english: 'I watched a movie yesterday.' },
    ],
  },

  masuPastNeg: {
    title: 'Polite Past Negative (〜ませんでした)',
    when: 'Polite negative past. Used to say you did NOT do something (formally).',
    formation: {
      ichidan: 'Drop る → add ませんでした　例: 食べる → 食べませんでした',
      godan:   'い-row stem → add ませんでした　例: 書く → 書きませんでした',
      irregular: 'する → しませんでした、来る → きませんでした',
    },
    examples: [
      { japanese: '今日は学校へ行きませんでした。', english: 'I didn\'t go to school today.' },
    ],
  },

  // ── Plain forms ───────────────────────────────────────────────────────────

  te: {
    title: 'Te-form (〜て / 〜で)',
    when: 'Multi-purpose connector form. Used to: link sequential actions ("and then"), make requests (〜てください), form continuous aspect (〜ている), express permission/prohibition, and as a base for many compound forms.',
    formation: {
      ichidan: 'Drop る → add て　例: 食べる → 食べて',
      godan:   'Euphonic change (音便): く→いて, ぐ→いで, す→して, つ/る/う→って, ぬ/ぶ/む→んで　例: 書く → 書いて、飲む → 飲んで　※Exception: 行く → 行って',
      irregular: 'する → して、来る → きて',
    },
    examples: [
      { japanese: '食べて、寝ます。', english: 'I eat and then sleep.' },
      { japanese: '窓を開けてください。', english: 'Please open the window.' },
    ],
  },

  ta: {
    title: 'Plain Past (〜た / 〜だ)',
    when: 'Casual/plain past tense. Used in informal speech, writing, and subordinate clauses. Also used to express completed events in relative clauses.',
    formation: {
      ichidan: 'Drop る → add た　例: 食べる → 食べた',
      godan:   'Same root as te-form but with た/だ: く→いた, ぐ→いだ, す→した, つ/る/う→った, ぬ/ぶ/む→んだ　例: 書く → 書いた',
      irregular: 'する → した、来る → きた',
    },
    examples: [
      { japanese: '昨日パンを食べた。', english: 'I ate bread yesterday.' },
    ],
  },

  nai: {
    title: 'Plain Negative (〜ない)',
    when: 'Casual/plain negative for present/future. Used in informal speech, written language, and as a base for further negative conjugations (なかった, なければ, etc.).',
    formation: {
      ichidan: 'Drop る → add ない　例: 食べる → 食べない',
      godan:   'Change to the あ-row → add ない　例: 書く → 書かない　※Exception: う-verbs: う → わ → 買う → 買わない',
      irregular: 'する → しない、来る → こない',
    },
    examples: [
      { japanese: '肉を食べない。', english: 'I don\'t eat meat.' },
    ],
  },

  ba: {
    title: 'Conditional (〜ば)',
    when: 'Expresses a condition: "if A, then B". Often used for advice, general truths, and hypotheticals. The result clause tends to express something desirable or instructional.',
    formation: {
      ichidan: 'Drop る → add れば　例: 食べる → 食べれば',
      godan:   'Change to え-row → add ば　例: 書く → 書けば、飲む → 飲めば',
      irregular: 'する → すれば、来る → くれば',
    },
    examples: [
      { japanese: '早く起きれば、間に合う。', english: 'If you wake up early, you\'ll make it in time.' },
    ],
  },

  volitional: {
    title: 'Volitional (〜よう / 〜おう)',
    when: 'Expresses intention or invitation: "let\'s…" or "shall we…". In plain speech, also used for first-person intentions ("I\'ll…"). Commonly seen in written language.',
    formation: {
      ichidan: 'Drop る → add よう　例: 食べる → 食べよう',
      godan:   'Change to お-row → add う　例: 書く → 書こう、飲む → 飲もう',
      irregular: 'する → しよう、来る → こよう',
    },
    examples: [
      { japanese: '一緒に食べよう！', english: 'Let\'s eat together!' },
    ],
  },

  potential: {
    title: 'Potential (〜られる / 〜える)',
    when: 'Expresses ability or possibility: "can do", "be able to do". The potential form takes object particle が instead of を in formal/standard usage.',
    formation: {
      ichidan: 'Drop る → add られる　例: 食べる → 食べられる',
      godan:   'Change to え-row → add る　例: 書く → 書ける、飲む → 飲める',
      irregular: 'する → できる、来る → こられる',
    },
    examples: [
      { japanese: '漢字が読めますか？', english: 'Can you read kanji?' },
    ],
  },

  passive: {
    title: 'Passive (〜られる / 〜あれる)',
    when: 'Expresses that the subject is acted upon. Used for: direct passive ("was V-ed"), adversative passive (something inconvenient happened to the subject), or honorific expressions.',
    formation: {
      ichidan: 'Drop る → add られる　例: 食べる → 食べられる',
      godan:   'Change to あ-row → add れる　例: 書く → 書かれる、飲む → 飲まれる',
      irregular: 'する → される、来る → こられる',
    },
    examples: [
      { japanese: '先生に褒められた。', english: 'I was praised by the teacher.' },
      { japanese: '雨に降られた。', english: 'I was caught in the rain (adversative).' },
    ],
  },

  causative: {
    title: 'Causative (〜させる / 〜あせる)',
    when: 'Expresses causing or letting someone do something. Can mean "make someone do" (coercive) or "let someone do" (permissive) depending on context.',
    formation: {
      ichidan: 'Drop る → add させる　例: 食べる → 食べさせる',
      godan:   'Change to あ-row → add せる　例: 書く → 書かせる、飲む → 飲ませる',
      irregular: 'する → させる、来る → こさせる',
    },
    examples: [
      { japanese: '子供に野菜を食べさせた。', english: 'I made the child eat vegetables.' },
      { japanese: '自由にやらせてください。', english: 'Please let me do it freely.' },
    ],
  },

  imperative: {
    title: 'Imperative (命令形)',
    when: 'Direct command form. Considered blunt or rude in most contexts; primarily used among close friends, in emergencies, or in written instructions/signs. For polite requests, use 〜てください instead.',
    formation: {
      ichidan: 'Drop る → add ろ (or よ in literary/formal)　例: 食べる → 食べろ',
      godan:   'Change to え-row (no suffix)　例: 書く → 書け、飲む → 飲め',
      irregular: 'する → しろ、来る → こい',
    },
    examples: [
      { japanese: '静かにしろ！', english: 'Be quiet! (blunt command)' },
      { japanese: '早く来い！', english: 'Come quickly!' },
    ],
  },

  // ── Compound forms ────────────────────────────────────────────────────────

  teiru: {
    title: 'Continuous / Resultant State (〜ている)',
    when: 'Formed from [te-form] + いる. Has two main uses: (1) ongoing action right now – "is doing X"; (2) resultant state – the effects of a completed action persist, e.g. 結婚している = "is married" (married and still married). Context determines which meaning applies.',
    formation: {
      ichidan: '[base] + ている　例: 食べる → 食べている',
      godan:   '[te-form] + いる　例: 書く → 書いている、飲む → 飲んでいる',
      irregular: 'する → している、来る → きている',
    },
    examples: [
      { japanese: '今、ご飯を食べている。', english: 'I am eating right now.' },
      { japanese: '彼女は結婚している。', english: 'She is married (resultant state).' },
    ],
  },

  tai: {
    title: 'Desiderative (〜たい)',
    when: 'Expresses the speaker\'s desire to do something: "want to do X". Used only for first-person desires in statements, or second-person in questions. For third-person desire, use 〜たがっている instead. 〜たい conjugates like an い-adjective (たくない, たかった).',
    formation: {
      ichidan: '[base] + たい　例: 食べる → 食べたい',
      godan:   '[い-stem] + たい　例: 書く → 書きたい、飲む → 飲みたい',
      irregular: 'する → したい、来る → きたい',
    },
    examples: [
      { japanese: '寿司が食べたい。', english: 'I want to eat sushi.' },
      { japanese: '日本へ行きたいですか？', english: 'Do you want to go to Japan?' },
    ],
  },

  teshimau: {
    title: 'Completive / Regret (〜てしまう)',
    when: 'Formed from [te-form] + しまう. Expresses: (1) an action completed fully/irreversibly; (2) an unintended or regrettable action – "ended up doing", "accidentally did". Colloquially contracted to 〜ちゃう (unvoiced te-form) or 〜じゃう (voiced で-form).',
    formation: {
      ichidan: '[te-form] + しまう　例: 食べる → 食べてしまう',
      godan:   '[te-form] + しまう　例: 書く → 書いてしまう、飲む → 飲んでしまう',
      irregular: 'する → してしまう、来る → きてしまう',
    },
    examples: [
      { japanese: 'ケーキを全部食べてしまった。', english: 'I ended up eating all the cake.' },
      { japanese: '財布を忘れてしまった。', english: 'I accidentally forgot my wallet.' },
    ],
  },

  temo: {
    title: 'Concessive (〜ても / 〜でも)',
    when: 'Formed from [te-form] + も. Expresses concession: "even if…", "even though…", "no matter how much…". The result clause typically shows that the expected outcome does NOT follow. Used frequently in conditions and hypotheticals.',
    formation: {
      ichidan: '[te-form] + も　例: 食べる → 食べても',
      godan:   '[te-form] + も　例: 書く → 書いても、飲む → 飲んでも',
      irregular: 'する → しても、来る → きても',
    },
    examples: [
      { japanese: '食べても太らない。', english: 'Even if I eat, I don\'t gain weight.' },
      { japanese: '雨が降っても行きます。', english: 'Even if it rains, I will go.' },
    ],
  },
};
