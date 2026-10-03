import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { TestResult } from '../types'
import { getRank } from '../types'

interface StatsHistoryProps {
  results: TestResult[]
  onClearHistory: () => void
}

export function StatsHistory({ results, onClearHistory }: StatsHistoryProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
        <div className="text-4xl mb-4">⌨️</div>
        <p className="text-lg">No test history yet</p>
        <p className="text-sm mt-1">Complete a typing test to see your stats here</p>
      </div>
    )
  }

  const chartData = results
    .slice(0, 50)
    .reverse()
    .map((r, i) => ({
      test: i + 1,
      wpm: r.wpm,
      accuracy: r.accuracy,
      date: new Date(r.timestamp).toLocaleDateString(),
    }))

  const avgWpm = Math.round(results.reduce((s, r) => s + r.wpm, 0) / results.length)
  const avgAcc = Math.round(results.reduce((s, r) => s + r.accuracy, 0) / results.length)
  const bestWpm = Math.max(...results.map(r => r.wpm))
  const totalTests = results.length

  return (
    <div className="space-y-8">
      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard label="Average WPM" value={String(avgWpm)} color="var(--accent)" />
        <SummaryCard label="Best WPM" value={String(bestWpm)} color="var(--correct-color)" />
        <SummaryCard label="Avg Accuracy" value={`${avgAcc}%`} color="var(--text-primary)" />
        <SummaryCard label="Total Tests" value={String(totalTests)} color="var(--text-primary)" />
      </div>

      {/* WPM over tests chart */}
      {chartData.length > 1 && (
        <div
          className="rounded-xl p-6"
          style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
        >
          <h3 className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            WPM Progress
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <defs>
                <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="test"
                tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                stroke="var(--border-color)"
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                stroke="var(--border-color)"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                }}
                formatter={(value) => [`${value} WPM`, 'WPM']}
                labelFormatter={l => `Test #${l}`}
              />
              <Area
                type="monotone"
                dataKey="wpm"
                stroke="var(--accent)"
                fill="url(#histGrad)"
                strokeWidth={2}
                dot={{ fill: 'var(--accent)', r: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent results */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <h3 className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Recent Tests
          </h3>
          <button
            onClick={onClearHistory}
            className="text-xs px-3 py-1 rounded-md transition-colors"
            style={{ color: 'var(--error-color)', backgroundColor: 'var(--bg-tertiary)' }}
          >
            Clear History
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderTop: '1px solid var(--border-color)' }}>
                <th className="px-4 py-3 text-left font-medium" style={{ color: 'var(--text-muted)' }}>Date</th>
                <th className="px-4 py-3 text-right font-medium" style={{ color: 'var(--text-muted)' }}>WPM</th>
                <th className="px-4 py-3 text-right font-medium" style={{ color: 'var(--text-muted)' }}>Accuracy</th>
                <th className="px-4 py-3 text-right font-medium" style={{ color: 'var(--text-muted)' }}>Mode</th>
                <th className="px-4 py-3 text-right font-medium" style={{ color: 'var(--text-muted)' }}>Rank</th>
              </tr>
            </thead>
            <tbody>
              {results.slice(0, 20).map(r => {
                const rank = getRank(r.wpm)
                return (
                  <tr
                    key={r.id}
                    style={{ borderTop: '1px solid var(--border-color)' }}
                  >
                    <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>
                      {new Date(r.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-bold tabular-nums" style={{ color: 'var(--accent)' }}>
                      {r.wpm}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums" style={{ color: r.accuracy >= 95 ? 'var(--correct-color)' : 'var(--text-secondary)' }}>
                      {r.accuracy}%
                    </td>
                    <td className="px-4 py-3 text-right capitalize" style={{ color: 'var(--text-muted)' }}>
                      {r.mode}
                    </td>
                    <td className="px-4 py-3 text-right font-bold" style={{ color: rank.color }}>
                      {rank.label}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      className="rounded-xl p-4 text-center"
      style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
    >
      <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
      <div className="text-2xl font-bold tabular-nums" style={{ color }}>{value}</div>
    </div>
  )
}
