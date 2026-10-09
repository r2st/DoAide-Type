import { useNavigate } from 'react-router-dom'
import { SEOHead } from '../components/SEOHead'

const TOOLS = [
  {
    path: '/',
    title: 'Typing Speed Test',
    description: 'Measure your WPM, track accuracy, and improve your typing speed with multiple modes.',
    icon: '⌨',
  },
  {
    path: '/word-counter',
    title: 'Word Counter',
    description: 'Count words, characters, sentences, paragraphs, and estimate reading time.',
    icon: '#',
  },
  {
    path: '/character-counter',
    title: 'Character Counter',
    description: 'Count characters with live platform limits for Twitter, Instagram, LinkedIn, and SEO.',
    icon: 'Aa',
  },
  {
    path: '/case-converter',
    title: 'Text Case Converter',
    description: 'Convert between UPPER, lower, Title, camelCase, snake_case, kebab-case, and more.',
    icon: 'Ab',
  },
  {
    path: '/lorem-ipsum',
    title: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text by paragraphs, sentences, or words for your designs.',
    icon: '...',
  },
]

export function ToolsPage() {
  const navigate = useNavigate()

  return (
    <>
      <SEOHead
        title="Free Text & Typing Tools — Word Counter, Case Converter & More | DoAide Type"
        description="Free online text tools: typing speed test, word counter, character counter, text case converter, and lorem ipsum generator. No login required."
        path="/tools"
      />
      <div className="px-4 py-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2 text-center" style={{ color: 'var(--text-primary)' }}>
          Free Text &amp; Typing Tools
        </h1>
        <p className="text-sm mb-8 text-center" style={{ color: 'var(--text-muted)' }}>
          All tools are free, instant, and require no login
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {TOOLS.map(tool => (
            <button
              key={tool.path}
              onClick={() => navigate(tool.path)}
              className="text-left rounded-xl p-6 transition-colors"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl font-bold" style={{ color: 'var(--accent)' }}>{tool.icon}</span>
                <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{tool.title}</h2>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{tool.description}</p>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
