export type TestMode = 'words' | 'sentences' | 'code' | 'numbers' | 'custom'
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert'
export type TimeDuration = 15 | 30 | 60 | 120
export type ThemeName = 'dark' | 'light' | 'retro' | 'ocean'

export interface TestResult {
  id: string
  wpm: number
  rawWpm: number
  accuracy: number
  correctChars: number
  incorrectChars: number
  totalChars: number
  mode: TestMode
  difficulty: Difficulty
  duration: TimeDuration
  timestamp: number
  wpmOverTime: WpmDataPoint[]
  errorKeys: Record<string, number>
}

export interface WpmDataPoint {
  time: number
  wpm: number
  raw: number
}

export interface TypingState {
  status: 'idle' | 'running' | 'finished'
  currentIndex: number
  correctChars: number
  incorrectChars: number
  startTime: number | null
  timeLeft: number
  wpmHistory: WpmDataPoint[]
  input: string
  errors: Set<number>
}

export interface PersonalBest {
  wpm: number
  accuracy: number
  date: number
}

export const RANK_LABELS: { min: number; label: string; color: string }[] = [
  { min: 120, label: 'Pro', color: '#F0B429' },
  { min: 90, label: 'Expert', color: '#a855f7' },
  { min: 70, label: 'Fast', color: '#3b82f6' },
  { min: 50, label: 'Above Average', color: '#22c55e' },
  { min: 30, label: 'Average', color: '#eab308' },
  { min: 0, label: 'Beginner', color: '#6b7280' },
]

export function getRank(wpm: number) {
  return RANK_LABELS.find(r => wpm >= r.min) ?? RANK_LABELS[RANK_LABELS.length - 1]
}
