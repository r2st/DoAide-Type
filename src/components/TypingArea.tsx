import { useCallback, useEffect, useRef } from 'react'

interface TypingAreaProps {
  text: string
  typed: string
  errors: Set<number>
  status: 'idle' | 'running' | 'finished'
  timeLeft: number
  currentWpm: number
  currentAccuracy: number
  onInput: (value: string) => void
  onKeySound: () => void
  onErrorSound: () => void
}

export function TypingArea({
  text,
  typed,
  errors,
  status,
  timeLeft,
  currentWpm,
  currentAccuracy,
  onInput,
  onKeySound,
  onErrorSound,
}: TypingAreaProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const textDisplayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status !== 'finished') {
      inputRef.current?.focus()
    }
  }, [status])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (status === 'finished') {
        e.preventDefault()
        return
      }

      if (e.key === 'Tab') {
        e.preventDefault()
        onInput(typed + '  ')
        return
      }
    },
    [status, typed, onInput],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (status === 'finished') return
      const newVal = e.target.value

      if (newVal.length > typed.length) {
        const lastChar = newVal[newVal.length - 1]
        const expectedChar = text[newVal.length - 1]
        if (lastChar === expectedChar) {
          onKeySound()
        } else {
          onErrorSound()
        }
      } else {
        onKeySound()
      }

      onInput(newVal)
    },
    [status, typed, text, onInput, onKeySound, onErrorSound],
  )

  useEffect(() => {
    if (textDisplayRef.current) {
      const cursor = textDisplayRef.current.querySelector('.active-cursor')
      if (cursor) {
        cursor.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }
    }
  }, [typed])

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Stats bar */}
      <div
        className="flex items-center justify-between mb-4 px-4 py-2 rounded-lg text-sm"
        style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
      >
        <div className="flex items-center gap-6">
          <span>
            <span style={{ color: 'var(--text-muted)' }}>WPM </span>
            <span className="text-lg font-bold" style={{ color: 'var(--accent)' }}>
              {status === 'idle' ? '—' : currentWpm}
            </span>
          </span>
          <span>
            <span style={{ color: 'var(--text-muted)' }}>ACC </span>
            <span className="text-lg font-bold" style={{ color: currentAccuracy >= 95 ? 'var(--correct-color)' : currentAccuracy >= 80 ? 'var(--accent)' : 'var(--error-color)' }}>
              {status === 'idle' ? '—' : `${currentAccuracy}%`}
            </span>
          </span>
        </div>
        <div
          className="text-2xl font-bold tabular-nums"
          style={{ color: timeLeft <= 10 && status === 'running' ? 'var(--error-color)' : 'var(--accent)' }}
        >
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Text display */}
      <div
        ref={textDisplayRef}
        className="relative rounded-xl p-6 sm:p-8 text-lg sm:text-xl leading-relaxed overflow-y-auto cursor-text"
        style={{
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-color)',
          maxHeight: '300px',
          minHeight: '200px',
          fontFamily: 'var(--font-family-mono)',
          letterSpacing: '0.02em',
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {text.split('').map((char, i) => {
          let color = 'var(--text-muted)'
          let bg = 'transparent'

          if (i < typed.length) {
            if (errors.has(i)) {
              color = 'var(--error-color)'
              bg = 'rgba(239, 68, 68, 0.15)'
            } else {
              color = 'var(--correct-color)'
            }
          }

          const isCursor = i === typed.length && status !== 'finished'

          return (
            <span key={i} style={{ position: 'relative' }}>
              {isCursor && (
                <span
                  className="active-cursor caret"
                  style={{
                    position: 'absolute',
                    left: '-1px',
                    top: '0',
                    width: '2px',
                    height: '1.3em',
                    backgroundColor: 'var(--cursor-color)',
                    borderRadius: '1px',
                  }}
                />
              )}
              <span
                style={{
                  color,
                  backgroundColor: bg,
                  borderRadius: bg !== 'transparent' ? '2px' : undefined,
                  transition: 'color 0.1s',
                }}
              >
                {char}
              </span>
            </span>
          )
        })}
      </div>

      {/* Hidden input */}
      <textarea
        ref={inputRef}
        value={typed}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={status === 'finished'}
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        className="absolute opacity-0 pointer-events-none"
        style={{ position: 'fixed', left: '-9999px' }}
        aria-label="Type here"
      />

      {/* Hint */}
      {status === 'idle' && (
        <p
          className="mt-4 text-sm text-center"
          style={{ color: 'var(--text-muted)' }}
        >
          Start typing to begin the test
        </p>
      )}
    </div>
  )
}
