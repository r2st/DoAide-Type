import { useCallback, useEffect, useState } from 'react'
import type { Difficulty, TestMode, TestResult, TimeDuration } from '../types'
import { useTypingTest } from '../hooks/useTypingTest'
import { useSound } from '../hooks/useSound'
import { TypingArea } from '../components/TypingArea'
import { ModeSelector } from '../components/ModeSelector'
import { ResultsCard } from '../components/ResultsCard'
import { KeyboardVisualization } from '../components/KeyboardVisualization'
import { saveResult, getPersonalBest } from '../utils/storage'

interface TestPageProps {
  soundEnabled: boolean
}

export function TestPage({ soundEnabled }: TestPageProps) {
  const [mode, setMode] = useState<TestMode>('words')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [duration, setDuration] = useState<TimeDuration>(60)
  const [customText, setCustomText] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [lastResult, setLastResult] = useState<TestResult | null>(null)
  const [personalBest, setPersonalBest] = useState<number | null>(null)

  const { playKeyPress, playError, playFinish } = useSound(soundEnabled)

  const {
    text,
    typed,
    status,
    timeLeft,
    currentWpm,
    currentAccuracy,
    errors,
    handleInput,
    reset,
    getResult,
  } = useTypingTest(mode, difficulty, duration, customText)

  useEffect(() => {
    const pb = getPersonalBest()
    if (pb) setPersonalBest(pb.wpm)
  }, [])

  useEffect(() => {
    if (status === 'finished') {
      playFinish()
      const result = getResult()
      if (result) {
        saveResult(result)
        setLastResult(result)
        const pb = getPersonalBest()
        if (pb) setPersonalBest(pb.wpm)
      }
    }
  }, [status, getResult, playFinish])

  const handleRestart = useCallback(() => {
    setLastResult(null)
    reset()
  }, [reset])

  const handleModeChange = useCallback((m: TestMode) => {
    setMode(m)
    setShowCustomInput(m === 'custom')
    setLastResult(null)
  }, [])

  const handleDifficultyChange = useCallback((d: Difficulty) => {
    setDifficulty(d)
    setLastResult(null)
  }, [])

  const handleDurationChange = useCallback((t: TimeDuration) => {
    setDuration(t)
    setLastResult(null)
  }, [])

  const errorKeys: Record<string, number> = {}
  errors.forEach(i => {
    if (i < text.length) {
      const key = text[i]
      errorKeys[key] = (errorKeys[key] || 0) + 1
    }
  })

  if (lastResult) {
    return (
      <div className="px-4 py-8 space-y-6">
        <ResultsCard
          result={lastResult}
          personalBest={personalBest}
          onRestart={handleRestart}
        />
      </div>
    )
  }

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Mode selector (only when idle) */}
      {status === 'idle' && (
        <ModeSelector
          mode={mode}
          difficulty={difficulty}
          duration={duration}
          onModeChange={handleModeChange}
          onDifficultyChange={handleDifficultyChange}
          onDurationChange={handleDurationChange}
        />
      )}

      {/* Custom text input */}
      {showCustomInput && status === 'idle' && (
        <div className="max-w-4xl mx-auto">
          <textarea
            value={customText}
            onChange={e => setCustomText(e.target.value)}
            placeholder="Paste your custom text here..."
            className="w-full rounded-xl p-4 text-sm resize-none outline-none"
            style={{
              backgroundColor: 'var(--bg-input)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              minHeight: '80px',
            }}
          />
        </div>
      )}

      {/* Typing area */}
      <TypingArea
        text={text}
        typed={typed}
        errors={errors}
        status={status}
        timeLeft={timeLeft}
        currentWpm={currentWpm}
        currentAccuracy={currentAccuracy}
        onInput={handleInput}
        onKeySound={playKeyPress}
        onErrorSound={playError}
      />

      {/* Restart button (only when running) */}
      {status === 'running' && (
        <div className="flex justify-center">
          <button
            onClick={handleRestart}
            className="px-4 py-2 rounded-lg text-sm transition-colors"
            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
          >
            Restart (Esc)
          </button>
        </div>
      )}

      {/* Keyboard visualization */}
      {status === 'running' && (
        <KeyboardVisualization
          errorKeys={errorKeys}
          activeKey={typed.length < text.length ? text[typed.length] : undefined}
        />
      )}

      {/* Leaderboard guide */}
      {status === 'idle' && (
        <div
          className="max-w-2xl mx-auto rounded-xl p-6"
          style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
        >
          <h3 className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            Typing Speed Ranks
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {[
              { range: '120+ WPM', label: 'Pro', color: '#F0B429' },
              { range: '90-120 WPM', label: 'Expert', color: '#a855f7' },
              { range: '70-90 WPM', label: 'Fast', color: '#3b82f6' },
              { range: '50-70 WPM', label: 'Above Average', color: '#22c55e' },
              { range: '30-50 WPM', label: 'Average', color: '#eab308' },
              { range: '<30 WPM', label: 'Beginner', color: '#6b7280' },
            ].map(r => (
              <div
                key={r.label}
                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{ backgroundColor: 'var(--bg-tertiary)' }}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                <span style={{ color: r.color, fontWeight: 700 }}>{r.label}</span>
                <span style={{ color: 'var(--text-muted)' }}>{r.range}</span>
              </div>
            ))}
          </div>
          {personalBest && (
            <div className="mt-4 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
              Your personal best: <span className="font-bold" style={{ color: 'var(--accent)' }}>{personalBest} WPM</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
