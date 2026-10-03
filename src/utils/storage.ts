import type { PersonalBest, TestResult, ThemeName } from '../types'

const RESULTS_KEY = 'doaide-type-results'
const PB_KEY = 'doaide-type-pb'
const THEME_KEY = 'doaide-type-theme'
const SOUND_KEY = 'doaide-type-sound'

export function saveResult(result: TestResult): void {
  const results = getResults()
  results.unshift(result)
  if (results.length > 100) results.length = 100
  localStorage.setItem(RESULTS_KEY, JSON.stringify(results))

  const pb = getPersonalBest()
  if (!pb || result.wpm > pb.wpm) {
    localStorage.setItem(PB_KEY, JSON.stringify({
      wpm: result.wpm,
      accuracy: result.accuracy,
      date: result.timestamp,
    }))
  }
}

export function getResults(): TestResult[] {
  try {
    return JSON.parse(localStorage.getItem(RESULTS_KEY) || '[]')
  } catch {
    return []
  }
}

export function getPersonalBest(): PersonalBest | null {
  try {
    const data = localStorage.getItem(PB_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function clearHistory(): void {
  localStorage.removeItem(RESULTS_KEY)
  localStorage.removeItem(PB_KEY)
}

export function getTheme(): ThemeName {
  try {
    return (localStorage.getItem(THEME_KEY) as ThemeName) || 'dark'
  } catch {
    return 'dark'
  }
}

export function setTheme(theme: ThemeName): void {
  localStorage.setItem(THEME_KEY, theme)
  document.documentElement.setAttribute('data-theme', theme)
}

export function getSoundEnabled(): boolean {
  try {
    return localStorage.getItem(SOUND_KEY) !== 'false'
  } catch {
    return true
  }
}

export function setSoundEnabled(enabled: boolean): void {
  localStorage.setItem(SOUND_KEY, String(enabled))
}
