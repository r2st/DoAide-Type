interface KeyboardVisualizationProps {
  errorKeys: Record<string, number>
  activeKey?: string
}

const ROWS = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
]

const FINGER_MAP: Record<string, string> = {
  '`': 'left-pinky', '1': 'left-pinky', '2': 'left-ring', '3': 'left-middle', '4': 'left-index', '5': 'left-index',
  '6': 'right-index', '7': 'right-index', '8': 'right-middle', '9': 'right-ring', '0': 'right-pinky', '-': 'right-pinky', '=': 'right-pinky',
  'q': 'left-pinky', 'w': 'left-ring', 'e': 'left-middle', 'r': 'left-index', 't': 'left-index',
  'y': 'right-index', 'u': 'right-index', 'i': 'right-middle', 'o': 'right-ring', 'p': 'right-pinky', '[': 'right-pinky', ']': 'right-pinky', '\\': 'right-pinky',
  'a': 'left-pinky', 's': 'left-ring', 'd': 'left-middle', 'f': 'left-index', 'g': 'left-index',
  'h': 'right-index', 'j': 'right-index', 'k': 'right-middle', 'l': 'right-ring', ';': 'right-pinky', "'": 'right-pinky',
  'z': 'left-pinky', 'x': 'left-ring', 'c': 'left-middle', 'v': 'left-index', 'b': 'left-index',
  'n': 'right-index', 'm': 'right-index', ',': 'right-middle', '.': 'right-ring', '/': 'right-pinky',
}

const FINGER_COLORS: Record<string, string> = {
  'left-pinky': '#ef4444',
  'left-ring': '#f97316',
  'left-middle': '#eab308',
  'left-index': '#22c55e',
  'right-index': '#3b82f6',
  'right-middle': '#8b5cf6',
  'right-ring': '#ec4899',
  'right-pinky': '#f43f5e',
}

const HOME_ROW = new Set(['a', 's', 'd', 'f', 'j', 'k', 'l', ';'])

export function KeyboardVisualization({ errorKeys, activeKey }: KeyboardVisualizationProps) {
  const maxErrors = Math.max(1, ...Object.values(errorKeys))

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="space-y-1">
        {ROWS.map((row, ri) => (
          <div key={ri} className="flex justify-center gap-1" style={{ paddingLeft: `${ri * 16}px` }}>
            {row.map(key => {
              const errors = errorKeys[key] || 0
              const errorIntensity = errors / maxErrors
              const finger = FINGER_MAP[key]
              const fingerColor = FINGER_COLORS[finger] || '#888'
              const isHome = HOME_ROW.has(key)
              const isActive = activeKey?.toLowerCase() === key

              let bg = 'var(--bg-tertiary)'
              if (errors > 0) {
                bg = `rgba(239, 68, 68, ${0.2 + errorIntensity * 0.5})`
              } else if (isActive) {
                bg = fingerColor + '44'
              }

              return (
                <div
                  key={key}
                  className="relative flex items-center justify-center rounded-md text-xs font-mono transition-all select-none"
                  style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: bg,
                    color: errors > 0 ? 'var(--error-color)' : 'var(--text-secondary)',
                    border: isActive
                      ? `2px solid ${fingerColor}`
                      : '1px solid var(--border-color)',
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: isActive ? `0 0 8px ${fingerColor}44` : 'none',
                  }}
                  title={`${finger} finger${errors > 0 ? ` — ${errors} errors` : ''}`}
                >
                  {key}
                  {isHome && (
                    <div
                      className="absolute bottom-1 w-2 h-0.5 rounded-full"
                      style={{ backgroundColor: fingerColor }}
                    />
                  )}
                  {errors > 0 && (
                    <div
                      className="absolute -top-1 -right-1 text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold"
                      style={{ backgroundColor: 'var(--error-color)', color: 'white' }}
                    >
                      {errors}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
        {/* Space bar */}
        <div className="flex justify-center" style={{ paddingLeft: '64px' }}>
          <div
            className="rounded-md flex items-center justify-center text-xs"
            style={{
              width: '260px',
              height: '36px',
              backgroundColor: activeKey === ' ' ? 'var(--accent)22' : 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
            }}
          >
            space
          </div>
        </div>
      </div>

      {/* Finger legend */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {Object.entries(FINGER_COLORS).map(([finger, color]) => (
          <div key={finger} className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            {finger.replace('-', ' ')}
          </div>
        ))}
      </div>
    </div>
  )
}
