import { useCallback, useEffect, useState } from 'react'
import type { ThemeName } from '../types'
import { getTheme, setTheme as persistTheme } from '../utils/storage'

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeName>(getTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const setTheme = useCallback((t: ThemeName) => {
    setThemeState(t)
    persistTheme(t)
  }, [])

  return { theme, setTheme }
}
