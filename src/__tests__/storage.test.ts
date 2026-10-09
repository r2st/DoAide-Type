import { describe, it, expect, beforeEach } from 'vitest'

const RESULTS_KEY = 'doaide-type-results'
const PB_KEY = 'doaide-type-pb'

function getResults(): any[] {
  try {
    return JSON.parse(localStorage.getItem(RESULTS_KEY) || '[]')
  } catch {
    return []
  }
}

function saveResult(result: any): void {
  const results = getResults()
  results.unshift(result)
  if (results.length > 100) results.length = 100
  localStorage.setItem(RESULTS_KEY, JSON.stringify(results))
  const pb = getPersonalBest()
  if (!pb || result.wpm > pb.wpm) {
    localStorage.setItem(PB_KEY, JSON.stringify({ wpm: result.wpm, accuracy: result.accuracy, date: result.timestamp }))
  }
}

function getPersonalBest(): any | null {
  try {
    const data = localStorage.getItem(PB_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

function clearHistory(): void {
  localStorage.removeItem(RESULTS_KEY)
  localStorage.removeItem(PB_KEY)
}

describe('Storage utilities', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns empty array when no results stored', () => {
    expect(getResults()).toEqual([])
  })

  it('saves and retrieves results', () => {
    saveResult({ wpm: 60, accuracy: 95, timestamp: Date.now() })
    expect(getResults()).toHaveLength(1)
    expect(getResults()[0].wpm).toBe(60)
  })

  it('tracks personal best', () => {
    saveResult({ wpm: 50, accuracy: 90, timestamp: Date.now() })
    saveResult({ wpm: 70, accuracy: 95, timestamp: Date.now() })
    expect(getPersonalBest()!.wpm).toBe(70)
  })

  it('does not downgrade personal best', () => {
    saveResult({ wpm: 70, accuracy: 95, timestamp: Date.now() })
    saveResult({ wpm: 40, accuracy: 99, timestamp: Date.now() })
    expect(getPersonalBest()!.wpm).toBe(70)
  })

  it('clears history', () => {
    saveResult({ wpm: 60, accuracy: 95, timestamp: Date.now() })
    clearHistory()
    expect(getResults()).toEqual([])
    expect(getPersonalBest()).toBeNull()
  })

  it('limits results to 100', () => {
    for (let i = 0; i < 110; i++) {
      saveResult({ wpm: i, accuracy: 95, timestamp: Date.now() })
    }
    expect(getResults()).toHaveLength(100)
  })
})
