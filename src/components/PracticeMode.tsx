import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { KeyboardVisualization } from './KeyboardVisualization'

type DrillType = 'home-row' | 'top-row' | 'bottom-row' | 'weak-keys'

const DRILLS: Record<DrillType, string[]> = {
  'home-row': ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
  'top-row': ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  'bottom-row': ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.'],
  'weak-keys': [],
}

interface PracticeModeProps {
  weakKeys: Record<string, number>
}

export function PracticeMode({ weakKeys }: PracticeModeProps) {
  const [drill, setDrill] = useState<DrillType>('home-row')
  const [text, setText] = useState('')
  const [typed, setTyped] = useState('')
  const [errors, setErrors] = useState<Record<string, number>>({})
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const drillKeys = useMemo(() => {
    if (drill === 'weak-keys') {
      const keys = Object.entries(weakKeys)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([k]) => k)
      return keys.length > 0 ? keys : DRILLS['home-row']
    }
    return DRILLS[drill]
  }, [drill, weakKeys])

  const generateDrillText = useCallback((keys: string[]) => {
    const words: string[] = []
    for (let i = 0; i < 30; i++) {
      const wordLen = 3 + Math.floor(Math.random() * 4)
      let word = ''
      for (let j = 0; j < wordLen; j++) {
        word += keys[Math.floor(Math.random() * keys.length)]
      }
      words.push(word)
    }
    return words.join(' ')
  }, [])

  useEffect(() => {
    setText(generateDrillText(drillKeys))
    setTyped('')
    setErrors({})
  }, [drillKeys, generateDrillText])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setTyped(val)

    const newErrors: Record<string, number> = {}
    for (let i = 0; i < val.length && i < text.length; i++) {
      if (val[i] !== text[i]) {
        const key = text[i]
        newErrors[key] = (newErrors[key] || 0) + 1
      }
    }
    setErrors(newErrors)

    if (val.length >= text.length) {
      setText(generateDrillText(drillKeys))
      setTyped('')
      setErrors({})
    }
  }, [text, drillKeys, generateDrillText])

  const activeKey = typed.length < text.length ? text[typed.length] : undefined

  return (
    <div className="space-y-8">
      {/* Drill selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {(Object.keys(DRILLS) as DrillType[]).map(d => (
          <button
            key={d}
            onClick={() => setDrill(d)}
            className="px-4 py-2 rounded-lg text-sm capitalize transition-all"
            style={{
              backgroundColor: drill === d ? 'var(--accent)' : 'var(--bg-secondary)',
              color: drill === d ? '#1a1a2e' : 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              fontWeight: drill === d ? 700 : 400,
            }}
          >
            {d.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Practice text area */}
      <div
        className="relative rounded-xl p-6 text-lg leading-relaxed cursor-text overflow-y-auto"
        style={{
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-color)',
          maxHeight: '180px',
          minHeight: '100px',
          fontFamily: 'var(--font-family-mono)',
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {text.split('').map((char, i) => {
          let color = 'var(--text-muted)'
          if (i < typed.length) {
            color = typed[i] === text[i] ? 'var(--correct-color)' : 'var(--error-color)'
          }
          const isCursor = i === typed.length
          return (
            <span key={i} style={{ position: 'relative' }}>
              {isCursor && (
                <span
                  className="caret"
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
              <span style={{ color, transition: 'color 0.1s' }}>{char}</span>
            </span>
          )
        })}
      </div>

      <textarea
        ref={inputRef}
        value={typed}
        onChange={handleChange}
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        className="absolute opacity-0 pointer-events-none"
        style={{ position: 'fixed', left: '-9999px' }}
        aria-label="Practice typing here"
      />

      {/* Keyboard */}
      <KeyboardVisualization errorKeys={errors} activeKey={activeKey} />

      {/* Info */}
      <div
        className="text-center text-sm space-y-1"
        style={{ color: 'var(--text-muted)' }}
      >
        <p>Practice will auto-refresh when you reach the end.</p>
        <p>Focus on accuracy over speed — correct muscle memory is key.</p>
      </div>
    </div>
  )
}
