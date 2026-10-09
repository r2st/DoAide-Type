import { useState, useCallback } from 'react'
import { SEOHead } from '../components/SEOHead'

type CaseType = 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'pascal' | 'snake' | 'kebab' | 'toggle'

function toTitleCase(s: string): string {
  return s.replace(/\b\w/g, c => c.toUpperCase())
}

function toSentenceCase(s: string): string {
  return s.toLowerCase().replace(/(^\s*|[.!?]\s+)(\w)/g, (_, p, c) => p + c.toUpperCase())
}

function toCamelCase(s: string): string {
  return s.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()).replace(/^[A-Z]/, c => c.toLowerCase())
}

function toPascalCase(s: string): string {
  const camel = toCamelCase(s)
  return camel.charAt(0).toUpperCase() + camel.slice(1)
}

function toSnakeCase(s: string): string {
  return s.replace(/([a-z])([A-Z])/g, '$1_$2').replace(/[\s\-]+/g, '_').toLowerCase()
}

function toKebabCase(s: string): string {
  return s.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase()
}

function toToggleCase(s: string): string {
  return s.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('')
}

const CASES: { type: CaseType; label: string; example: string }[] = [
  { type: 'upper', label: 'UPPER CASE', example: 'HELLO WORLD' },
  { type: 'lower', label: 'lower case', example: 'hello world' },
  { type: 'title', label: 'Title Case', example: 'Hello World' },
  { type: 'sentence', label: 'Sentence case', example: 'Hello world' },
  { type: 'camel', label: 'camelCase', example: 'helloWorld' },
  { type: 'pascal', label: 'PascalCase', example: 'HelloWorld' },
  { type: 'snake', label: 'snake_case', example: 'hello_world' },
  { type: 'kebab', label: 'kebab-case', example: 'hello-world' },
  { type: 'toggle', label: 'tOGGLE cASE', example: 'hELLO wORLD' },
]

function convert(text: string, type: CaseType): string {
  switch (type) {
    case 'upper': return text.toUpperCase()
    case 'lower': return text.toLowerCase()
    case 'title': return toTitleCase(text)
    case 'sentence': return toSentenceCase(text)
    case 'camel': return toCamelCase(text)
    case 'pascal': return toPascalCase(text)
    case 'snake': return toSnakeCase(text)
    case 'kebab': return toKebabCase(text)
    case 'toggle': return toToggleCase(text)
  }
}

export function CaseConverterPage() {
  const [text, setText] = useState('')
  const [output, setOutput] = useState('')
  const [activeCase, setActiveCase] = useState<CaseType | null>(null)

  const handleConvert = useCallback((type: CaseType) => {
    setActiveCase(type)
    setOutput(convert(text, type))
  }, [text])

  return (
    <>
      <SEOHead
        title="Free Text Case Converter — UPPER, lower, Title, camelCase & More | DoAide Type"
        description="Convert text between UPPER CASE, lower case, Title Case, camelCase, snake_case, kebab-case, and more. Free online case converter — no login required."
        path="/case-converter"
      />
      <div className="px-4 py-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2 text-center" style={{ color: 'var(--text-primary)' }}>
          Text Case Converter
        </h1>
        <p className="text-sm mb-6 text-center" style={{ color: 'var(--text-muted)' }}>
          Convert text between different cases instantly
        </p>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type or paste text to convert..."
          className="w-full rounded-xl p-4 text-sm resize-none outline-none"
          style={{
            backgroundColor: 'var(--bg-input)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            minHeight: '120px',
          }}
        />

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 my-4">
          {CASES.map(c => (
            <button
              key={c.type}
              onClick={() => handleConvert(c.type)}
              className="px-3 py-2 rounded-lg text-xs transition-colors"
              style={{
                backgroundColor: activeCase === c.type ? 'var(--accent)' : 'var(--bg-tertiary)',
                color: activeCase === c.type ? '#000' : 'var(--text-secondary)',
              }}
              title={c.example}
            >
              {c.label}
            </button>
          ))}
        </div>

        {output && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>Result</span>
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                className="px-3 py-1 rounded-md text-xs transition-colors"
                style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
              >
                Copy
              </button>
            </div>
            <div
              className="rounded-xl p-4 text-sm whitespace-pre-wrap break-all"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                minHeight: '80px',
              }}
            >
              {output}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
