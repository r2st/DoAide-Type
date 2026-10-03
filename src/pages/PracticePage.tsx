import { useMemo } from 'react'
import { PracticeMode } from '../components/PracticeMode'
import { getResults } from '../utils/storage'

export function PracticePage() {
  const weakKeys = useMemo(() => {
    const results = getResults()
    const aggregated: Record<string, number> = {}
    results.forEach(r => {
      Object.entries(r.errorKeys).forEach(([key, count]) => {
        aggregated[key] = (aggregated[key] || 0) + count
      })
    })
    return aggregated
  }, [])

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <h1
        className="text-2xl font-bold mb-2 text-center"
        style={{ color: 'var(--text-primary)' }}
      >
        Practice Mode
      </h1>
      <p
        className="text-sm mb-8 text-center"
        style={{ color: 'var(--text-muted)' }}
      >
        Improve your weak spots with focused drills
      </p>
      <PracticeMode weakKeys={weakKeys} />
    </div>
  )
}
