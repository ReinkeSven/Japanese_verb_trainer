// ─── Verb Data ────────────────────────────────────────────────────────────────

export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

/** Grammatical verb class used to determine conjugation rules. */
export type VerbType =
  | 'ichidan' // ru-verbs (一段): 食べる, 見る
  | 'godan'   // u-verbs  (五段): 飲む, 書く
  | 'irregular'; // する / 来る

/** One example sentence attached to a verb entry. */
export interface VerbExample {
  japanese: string;
  romaji: string;
  english: string;
}

/** A single verb entry in the dataset. */
export interface Verb {
  id: string;
  kanji: string;       // e.g. "食べる"
  kana: string;        // e.g. "たべる"
  romaji: string;      // e.g. "taberu"
  meaning: string;     // English gloss
  jlpt: JLPTLevel;
  type: VerbType;
  ending?: string;     // Godan ending char: く/ぐ/す/つ/ぬ/ぶ/む/る/う
  examples: VerbExample[];
}

// ─── Conjugation ──────────────────────────────────────────────────────────────

/** All conjugation forms the app can quiz on. */
export type ConjugationForm =
  | 'masu'         // polite present       食べます
  | 'masuNeg'      // polite negative      食べません
  | 'masuPast'     // polite past          食べました
  | 'masuPastNeg'  // polite past neg      食べませんでした
  | 'te'           // te-form              食べて
  | 'ta'           // plain past           食べた
  | 'nai'          // plain negative       食べない
  | 'ba'           // conditional          食べれば
  | 'volitional'   // volitional           食べよう
  | 'potential'    // potential            食べられる
  | 'passive'      // passive              食べられる
  | 'causative'    // causative            食べさせる
  | 'imperative'   // imperative           食べろ
  | 'teiru'        // continuous/state     食べている
  | 'tai'          // desiderative         食べたい
  | 'teshimau'     // completive/regret    食べてしまう
  | 'temo';        // concessive           食べても

export interface ConjugationResult {
  form: ConjugationForm;
  label: string;       // Human-readable label, e.g. "Polite Present"
  japanese: string;    // The conjugated form in Japanese
  romaji: string;
}

// ─── SRS ─────────────────────────────────────────────────────────────────────

/** SM-2 quality rating: 0 = complete blackout, 5 = perfect. */
export type SRSQuality = 0 | 1 | 2 | 3 | 4 | 5;

/** Anki-style user-facing rating buttons. */
export type SRSRating = 'again' | 'hard' | 'good' | 'easy';

/** Per-card SRS state stored in localStorage. */
export interface SRSCard {
  verbId: string;
  repetitions: number;   // number of consecutive correct reviews
  interval: number;      // days until next review
  easeFactor: number;    // EF, starts at 2.5
  dueDate: string;       // ISO date string
  lastReviewed: string | null;
}

// ─── Progress / Store ─────────────────────────────────────────────────────────

export interface VerbProgress {
  verbId: string;
  seen: number;
  correct: number;
  lastMode: StudyMode | null;
}

export type StudyMode = 'flashcard' | 'conjugation' | 'multiple-choice' | 'srs';

export interface StudySession {
  mode: StudyMode;
  levels: JLPTLevel[];
  verbIds: string[];
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────

export interface MultipleChoiceQuestion {
  verb: Verb;
  /** What is being asked: meaning or a conjugation form */
  questionType: 'meaning' | ConjugationForm;
  prompt: string;
  correctAnswer: string;
  options: string[]; // 4 options including the correct one
}

export interface ConjugationQuestion {
  verb: Verb;
  form: ConjugationForm;
  formLabel: string;
  correctAnswer: string;
}
