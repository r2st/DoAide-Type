import { useState, useMemo } from 'react'
import { SEOHead } from '../components/SEOHead'

const PLATFORM_LIMITS = [
  { name: 'Twitter/X', limit: 280 },
  { name: 'Instagram Bio', limit: 150 },
  { name: 'LinkedIn Post', limit: 3000 },
  { name: 'YouTube Title', limit: 100 },
  { name: 'Meta Title', limit: 60 },
  { name: 'Meta Description', limit: 160 },
  { name: 'SMS', limit: 160 },
]

export function CharacterCounterPage() {
  const [text, setText] = useState('')

  const stats = useMemo(() => {
    const chars = text.length
    const charsNoSpaces = text.replace(/\s/g, '').length
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const lines = text ? text.split('\n').length : 0
    const bytes = new TextEncoder().encode(text).length
    return { chars, charsNoSpaces, words, lines, bytes }
  }, [text])

  return (
    <>
      <SEOHead
        title="Free Character Counter — Count Characters for Twitter, SEO & More | DoAide Type"
        description="Count characters instantly with platform limits for Twitter, Instagram, LinkedIn, YouTube, and SEO meta tags. Free character counter — no login required."
        path="/character-counter"
      />
      <div className="px-4 py-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2 text-center" style={{ color: 'var(--text-primary)' }}>
          Character Counter
        </h1>
        <p className="text-sm mb-6 text-center" style={{ color: 'var(--text-muted)' }}>
          Count characters with live platform limit indicators
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-6">
          {[
            { label: 'Characters', value: stats.chars },
            { label: 'No Spaces', value: stats.charsNoSpaces },
            { label: 'Words', value: stats.words },
            { label: 'Lines', value: stats.lines },
            { label: 'Bytes (UTF-8)', value: stats.bytes },
          ].map(s => (
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
            minHeight: '200px',
          }}
        />

        <h2 className="text-lg font-bold mt-8 mb-4" style={{ color: 'var(--text-primary)' }}>
          Platform Limits
        </h2>
        <div className="space-y-2">
          {PLATFORM_LIMITS.map(p => {
            const pct = Math.min((stats.chars / p.limit) * 100, 100)
            const over = stats.chars > p.limit
            return (
              <div key={p.name} className="rounded-lg p-3" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: 'var(--text-secondary)' }}>{p.name}</span>
                  <span style={{ color: over ? 'var(--error-color)' : 'var(--text-muted)' }}>
                    {stats.chars}/{p.limit}
                  </span>
                </div>
                <div className="h-1.5 rounded-full" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: over ? 'var(--error-color)' : 'var(--accent)',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
