import { useState, useMemo } from 'react'
import { SEOHead } from '../components/SEOHead'

export function WordCounterPage() {
  const [text, setText] = useState('')

  const stats = useMemo(() => {
    const trimmed = text.trim()
    const words = trimmed ? trimmed.split(/\s+/).length : 0
    const chars = text.length
    const charsNoSpaces = text.replace(/\s/g, '').length
    const sentences = trimmed ? (trimmed.match(/[.!?]+/g) || []).length || (trimmed.length > 0 ? 1 : 0) : 0
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter(p => p.trim()).length : 0
    const readingTime = Math.max(1, Math.ceil(words / 225))
    const speakingTime = Math.max(1, Math.ceil(words / 150))
    return { words, chars, charsNoSpaces, sentences, paragraphs, readingTime, speakingTime }
  }, [text])

  const statCards = [
    { label: 'Words', value: stats.words },
    { label: 'Characters', value: stats.chars },
    { label: 'No Spaces', value: stats.charsNoSpaces },
    { label: 'Sentences', value: stats.sentences },
    { label: 'Paragraphs', value: stats.paragraphs },
    { label: 'Reading Time', value: `${stats.readingTime} min` },
    { label: 'Speaking Time', value: `${stats.speakingTime} min` },
  ]

  return (
    <>
      <SEOHead
        title="Free Word Counter — Count Words, Characters & Sentences | DoAide Type"
        description="Instantly count words, characters, sentences, and paragraphs. Free online word counter with reading time estimate — no login required."
        path="/word-counter"
      />
      <div className="px-4 py-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2 text-center" style={{ color: 'var(--text-primary)' }}>
          Word Counter
        </h1>
        <p className="text-sm mb-6 text-center" style={{ color: 'var(--text-muted)' }}>
          Paste or type text to count words, characters, sentences &amp; more
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-6">
          {statCards.map(s => (
            <div
              key={s.label}
              className="rounded-lg p-3 text-center"
              style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
            >
              <div className="text-lg font-bold" style={{ color: 'var(--accent)' }}>{s.value}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Start typing or paste your text here..."
          className="w-full rounded-xl p-4 text-sm resize-none outline-none"
          style={{
            backgroundColor: 'var(--bg-input)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            minHeight: '300px',
          }}
        />

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setText('')}
            className="px-4 py-2 rounded-lg text-sm transition-colors"
            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
          >
            Clear
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(text)}
            className="px-4 py-2 rounded-lg text-sm transition-colors"
            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
          >
            Copy
          </button>
        </div>
      </div>
    </>
  )
}
