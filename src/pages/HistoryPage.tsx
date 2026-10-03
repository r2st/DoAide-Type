import { useCallback, useState } from 'react'
import { StatsHistory } from '../components/StatsHistory'
import { getResults, clearHistory } from '../utils/storage'
import type { TestResult } from '../types'

export function HistoryPage() {
  const [results, setResults] = useState<TestResult[]>(getResults)

  const handleClear = useCallback(() => {
    clearHistory()
    setResults([])
  }, [])

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <h1
        className="text-2xl font-bold mb-8 text-center"
        style={{ color: 'var(--text-primary)' }}
      >
        Your Typing History
      </h1>
      <StatsHistory results={results} onClearHistory={handleClear} />
    </div>
  )
}
