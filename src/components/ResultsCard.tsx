import { useRef } from 'react'
import type { TestResult } from '../types'
import { getRank } from '../types'
import { downloadResultImage, shareToTwitter, shareToWhatsApp, copyShareLink } from '../utils/share'
import { WpmChart } from './WpmChart'

interface ResultsCardProps {
  result: TestResult
  personalBest: number | null
  onRestart: () => void
}

export function ResultsCard({ result, personalBest, onRestart }: ResultsCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const rank = getRank(result.wpm)
  const isNewPb = personalBest !== null && result.wpm >= personalBest

  const handleDownload = async () => {
    if (cardRef.current) {
      await downloadResultImage(cardRef.current)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Shareable card */}
      <div
        ref={cardRef}
        className="results-card rounded-2xl p-8 space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              DoAide
            </span>
            <span className="text-lg font-bold italic" style={{ color: '#F0B429' }}>
              Type
            </span>
          </div>
          {isNewPb && (
            <span
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: '#F0B429', color: '#1a1a2e' }}
            >
              NEW PERSONAL BEST!
            </span>
          )}
        </div>

        {/* Main WPM */}
        <div className="text-center py-4">
          <div
            className="text-7xl font-black tabular-nums"
            style={{ color: rank.color }}
          >
            {result.wpm}
          </div>
          <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            words per minute
          </div>
          <div
            className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-bold"
            style={{ backgroundColor: rank.color + '22', color: rank.color }}
          >
            {rank.label}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatBox label="Accuracy" value={`${result.accuracy}%`} color={result.accuracy >= 95 ? 'var(--correct-color)' : 'var(--accent)'} />
          <StatBox label="Raw WPM" value={String(result.rawWpm)} color="var(--text-primary)" />
          <StatBox label="Characters" value={`${result.correctChars}/${result.incorrectChars}`} color="var(--text-primary)" />
          <StatBox label="Time" value={`${result.duration}s`} color="var(--text-primary)" />
        </div>

        {/* WPM Graph */}
        {result.wpmOverTime.length > 1 && (
          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
              WPM over time
            </div>
            <WpmChart data={result.wpmOverTime} />
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
          type.doaide.com
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onRestart}
          className="px-6 py-2.5 rounded-lg font-bold text-sm transition-transform hover:scale-105"
          style={{ backgroundColor: 'var(--accent)', color: '#1a1a2e' }}
        >
          Try Again
        </button>
        <button
          onClick={handleDownload}
          className="px-4 py-2.5 rounded-lg text-sm transition-colors"
          style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
        >
          Save Image
        </button>
        <button
          onClick={() => shareToTwitter(result.wpm, result.accuracy)}
          className="px-4 py-2.5 rounded-lg text-sm transition-colors"
          style={{ backgroundColor: '#1DA1F2', color: 'white' }}
        >
          Tweet
        </button>
        <button
          onClick={() => shareToWhatsApp(result.wpm, result.accuracy)}
          className="px-4 py-2.5 rounded-lg text-sm transition-colors"
          style={{ backgroundColor: '#25D366', color: 'white' }}
        >
          WhatsApp
        </button>
        <button
          onClick={() => copyShareLink(result.wpm)}
          className="px-4 py-2.5 rounded-lg text-sm transition-colors"
          style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
        >
          Copy Link
        </button>
      </div>
    </div>
  )
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      className="rounded-lg p-3 text-center"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
        {label}
      </div>
      <div className="text-xl font-bold tabular-nums" style={{ color }}>
        {value}
      </div>
    </div>
  )
}
