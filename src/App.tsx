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
          className="text-center py-6 text-xs da-footer"
          style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)' }}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <a href="https://doaide.com" className="hover:underline" style={{ color: 'var(--text-secondary)' }}>DoAide</a>
              <a href="https://type.doaide.com" className="hover:underline" style={{ color: 'var(--text-secondary)' }}>Type</a>
            </div>
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs"
              style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--da-primary)' }}
            >
              A DoAide Product
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}
