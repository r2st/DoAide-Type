import { useNavigate, useLocation } from 'react-router-dom'
import type { ThemeName } from '../types'

const THEMES: { value: ThemeName; label: string }[] = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'retro', label: 'Retro' },
  { value: 'ocean', label: 'Ocean' },
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

  const navItems = [
    { path: '/', label: 'Test' },
    { path: '/practice', label: 'Practice' },
    { path: '/history', label: 'History' },
  ]

  return (
    <header
      className="flex items-center justify-between px-4 sm:px-6 py-3 border-b"
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

      <nav className="hidden sm:flex items-center gap-1">
        {navItems.map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="px-3 py-1.5 rounded-md text-sm transition-colors"
            style={{
              color: location.pathname === item.path ? 'var(--accent)' : 'var(--text-secondary)',
              backgroundColor: location.pathname === item.path ? 'var(--bg-tertiary)' : 'transparent',
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
          {soundEnabled ? '🔊' : '🔇'}
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
      </div>
    </header>
  )
}
