import type { Difficulty, TestMode, TimeDuration } from '../types'

interface ModeSelectorProps {
  mode: TestMode
  difficulty: Difficulty
  duration: TimeDuration
  onModeChange: (m: TestMode) => void
  onDifficultyChange: (d: Difficulty) => void
  onDurationChange: (t: TimeDuration) => void
}

const MODES: { value: TestMode; label: string; icon: string }[] = [
  { value: 'words', label: 'Words', icon: 'Aa' },
  { value: 'sentences', label: 'Sentences', icon: '¶' },
  { value: 'code', label: 'Code', icon: '</>' },
  { value: 'numbers', label: 'Numbers', icon: '#' },
  { value: 'custom', label: 'Custom', icon: '✎' },
]

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
  { value: 'expert', label: 'Expert' },
]

const DURATIONS: TimeDuration[] = [15, 30, 60, 120]

export function ModeSelector({
  mode,
  difficulty,
  duration,
  onModeChange,
  onDifficultyChange,
  onDurationChange,
}: ModeSelectorProps) {
  return (
    <div
      className="flex flex-wrap items-center justify-center gap-6 py-4 px-4 rounded-xl"
      style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
    >
      {/* Mode */}
      <div className="flex items-center gap-1">
        {MODES.map(m => (
          <button
            key={m.value}
            onClick={() => onModeChange(m.value)}
            className="px-3 py-1.5 rounded-md text-xs transition-all"
            style={{
              backgroundColor: mode === m.value ? 'var(--accent)' : 'transparent',
              color: mode === m.value ? '#1a1a2e' : 'var(--text-secondary)',
              fontWeight: mode === m.value ? 700 : 400,
            }}
            title={m.label}
          >
            <span className="hidden sm:inline">{m.label}</span>
            <span className="sm:hidden">{m.icon}</span>
          </button>
        ))}
      </div>

      <div className="w-px h-6" style={{ backgroundColor: 'var(--border-color)' }} />

      {/* Difficulty (only for words mode) */}
      {mode === 'words' && (
        <>
          <div className="flex items-center gap-1">
            {DIFFICULTIES.map(d => (
              <button
                key={d.value}
                onClick={() => onDifficultyChange(d.value)}
                className="px-2 py-1.5 rounded-md text-xs transition-all"
                style={{
                  backgroundColor: difficulty === d.value ? 'var(--bg-tertiary)' : 'transparent',
                  color: difficulty === d.value ? 'var(--accent)' : 'var(--text-muted)',
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
          <div className="w-px h-6" style={{ backgroundColor: 'var(--border-color)' }} />
        </>
      )}

      {/* Duration */}
      <div className="flex items-center gap-1">
        {DURATIONS.map(d => (
          <button
            key={d}
            onClick={() => onDurationChange(d)}
            className="px-2 py-1.5 rounded-md text-xs transition-all tabular-nums"
            style={{
              backgroundColor: duration === d ? 'var(--bg-tertiary)' : 'transparent',
              color: duration === d ? 'var(--accent)' : 'var(--text-muted)',
            }}
          >
            {d}s
          </button>
        ))}
      </div>
    </div>
  )
}
