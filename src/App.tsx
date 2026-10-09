import { useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { useTheme } from './hooks/useTheme'
import { TestPage } from './pages/TestPage'
import { PracticePage } from './pages/PracticePage'
import { HistoryPage } from './pages/HistoryPage'
import { ToolsPage } from './pages/ToolsPage'
import { WordCounterPage } from './pages/WordCounterPage'
import { CharacterCounterPage } from './pages/CharacterCounterPage'
import { CaseConverterPage } from './pages/CaseConverterPage'
import { LoremIpsumPage } from './pages/LoremIpsumPage'
import { BlogPage } from './pages/BlogPage'
import { BlogPostPage } from './pages/BlogPostPage'
import { getSoundEnabled, setSoundEnabled } from './utils/storage'

export default function App() {
  const { theme, setTheme } = useTheme()
  const [soundEnabled, setSoundState] = useState(getSoundEnabled)

  const handleSoundToggle = useCallback(() => {
    setSoundState(prev => {
      const next = !prev
      setSoundEnabled(next)
      return next
    })
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        document.dispatchEvent(new CustomEvent('typing-restart'))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Header
          theme={theme}
          onThemeChange={setTheme}
          soundEnabled={soundEnabled}
          onSoundToggle={handleSoundToggle}
        />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<TestPage soundEnabled={soundEnabled} />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/word-counter" element={<WordCounterPage />} />
            <Route path="/character-counter" element={<CharacterCounterPage />} />
            <Route path="/case-converter" element={<CaseConverterPage />} />
            <Route path="/lorem-ipsum" element={<LoremIpsumPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
          </Routes>
        </main>
        <footer
          className="text-center py-4 text-xs"
          style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)' }}
        >
          <span style={{ color: 'var(--text-secondary)' }}>DoAide</span>{' '}
          <span className="italic" style={{ color: '#F0B429' }}>Type</span>{' '}
          — Free typing &amp; text tools &middot; type.doaide.com
        </footer>
      </div>
    </BrowserRouter>
  )
}
