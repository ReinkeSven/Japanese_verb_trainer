import { useState, useCallback } from 'react';
import {
  getProgress,
  recordAnswer as storeRecordAnswer,
  getOverallStats,
  type OverallStats,
} from '../store/progressStore';
import type { VerbProgress } from '../types';

export function useProgress() {
  const [progress, setProgress] = useState<Record<string, VerbProgress>>(getProgress);
  const [stats, setStats] = useState<OverallStats>(getOverallStats);

  const recordAnswer = useCallback((verbId: string, correct: boolean) => {
    storeRecordAnswer(verbId, correct);
    setProgress(getProgress());
    setStats(getOverallStats());
  }, []);

  return { progress, stats, recordAnswer };
}
