import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import type { ThemeName } from '../types'

const THEMES: { value: ThemeName; label: string }[] = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'retro', label: 'Retro' },
  { value: 'ocean', label: 'Ocean' },
]

const NAV_ITEMS = [
  { path: '/', label: 'Test' },
  { path: '/practice', label: 'Practice' },
  { path: '/tools', label: 'Tools' },
  { path: '/blog', label: 'Blog' },
  { path: '/history', label: 'History' },
]

interface HeaderProps {
  theme: ThemeName
  onThemeChange: (t: ThemeName) => void
  soundEnabled: boolean
  onSoundToggle: () => void
}

export function Header({ theme, onThemeChange, soundEnabled, onSoundToggle }: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <header
      className="flex items-center justify-between px-4 sm:px-6 py-3 border-b relative"
      style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}
    >
      <div
        className="flex items-center gap-2 cursor-pointer select-none"
        onClick={() => navigate('/')}
      >
        <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          DoAide
        </span>
        <span className="text-lg font-bold italic" style={{ color: '#F0B429' }}>
          Type
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-1">
        {NAV_ITEMS.map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="px-3 py-1.5 rounded-md text-sm transition-colors"
            style={{
              color: isActive(item.path) ? 'var(--accent)' : 'var(--text-secondary)',
              backgroundColor: isActive(item.path) ? 'var(--bg-tertiary)' : 'transparent',
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <button
          onClick={onSoundToggle}
          className="p-1.5 rounded-md text-sm transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          title={soundEnabled ? 'Mute' : 'Unmute'}
        >
          {soundEnabled ? '\u{1F50A}' : '\u{1F507}'}
        </button>

        <select
          value={theme}
          onChange={e => onThemeChange(e.target.value as ThemeName)}
          className="px-2 py-1 rounded-md text-sm border-none outline-none cursor-pointer"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-secondary)',
          }}
        >
          {THEMES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        <button
          className="md:hidden p-1.5 rounded-md text-sm"
          style={{ color: 'var(--text-secondary)' }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div
          className="absolute top-full left-0 right-0 md:hidden z-50 border-b"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
        >
          {NAV_ITEMS.map(item => (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setMenuOpen(false) }}
              className="block w-full text-left px-6 py-3 text-sm transition-colors"
              style={{
                color: isActive(item.path) ? 'var(--accent)' : 'var(--text-secondary)',
                backgroundColor: isActive(item.path) ? 'var(--bg-tertiary)' : 'transparent',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  )
}
