import { useState, useMemo, useCallback } from 'react'
import { SEOHead } from '../components/SEOHead'

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'habitant', 'morbi',
  'tristique', 'senectus', 'netus', 'malesuada', 'fames', 'ac', 'turpis', 'egestas',
  'pellentesque', 'dapibus', 'efficitur', 'maecenas', 'fermentum', 'mattis',
]

const CLASSIC_FIRST = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

type GenerateType = 'paragraphs' | 'sentences' | 'words'

function randomWord(): string {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]
}

function generateSentence(minWords: number = 8, maxWords: number = 16): string {
  const len = minWords + Math.floor(Math.random() * (maxWords - minWords + 1))
  const words = Array.from({ length: len }, randomWord)
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
  return words.join(' ') + '.'
}

function generateParagraph(sentenceCount: number = 5): string {
  return Array.from({ length: sentenceCount }, () => generateSentence()).join(' ')
}

function generate(type: GenerateType, count: number, startClassic: boolean): string {
  if (type === 'words') {
    const words = Array.from({ length: count }, randomWord)
    if (startClassic && words.length >= 2) {
      words[0] = 'lorem'
      words[1] = 'ipsum'
    }
    return words.join(' ')
  }
  if (type === 'sentences') {
    const sentences = Array.from({ length: count }, () => generateSentence())
    if (startClassic) sentences[0] = CLASSIC_FIRST
    return sentences.join(' ')
  }
  const paragraphs = Array.from({ length: count }, () => generateParagraph())
  if (startClassic) {
    paragraphs[0] = CLASSIC_FIRST + ' ' + generateParagraph(4)
  }
  return paragraphs.join('\n\n')
}

export function LoremIpsumPage() {
  const [type, setType] = useState<GenerateType>('paragraphs')
  const [count, setCount] = useState(3)
  const [startClassic, setStartClassic] = useState(true)
  const [seed, setSeed] = useState(0)

  const output = useMemo(() => generate(type, count, startClassic), [type, count, startClassic, seed])

  const regenerate = useCallback(() => setSeed(s => s + 1), [])

  return (
    <>
      <SEOHead
        title="Free Lorem Ipsum Generator — Paragraphs, Sentences & Words | DoAide Type"
        description="Generate lorem ipsum placeholder text by paragraphs, sentences, or words. Free dummy text generator — no login required."
        path="/lorem-ipsum"
      />
      <div className="px-4 py-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2 text-center" style={{ color: 'var(--text-primary)' }}>
          Lorem Ipsum Generator
        </h1>
        <p className="text-sm mb-6 text-center" style={{ color: 'var(--text-muted)' }}>
          Generate placeholder text for designs and mockups
        </p>

        <div
          className="rounded-xl p-4 mb-6 flex flex-wrap items-center gap-4"
          style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
        >
          <div className="flex items-center gap-2">
            <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>Generate</label>
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={e => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              className="w-16 px-2 py-1 rounded-md text-sm text-center outline-none"
              style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            />
          </div>

          <div className="flex gap-1">
            {(['paragraphs', 'sentences', 'words'] as const).map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className="px-3 py-1 rounded-md text-sm transition-colors capitalize"
                style={{
                  backgroundColor: type === t ? 'var(--accent)' : 'var(--bg-tertiary)',
                  color: type === t ? '#000' : 'var(--text-secondary)',
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
            <input
              type="checkbox"
              checked={startClassic}
              onChange={e => setStartClassic(e.target.checked)}
              className="accent-[var(--accent)]"
            />
            Start with "Lorem ipsum..."
          </label>
        </div>

        <div
          className="rounded-xl p-4 text-sm whitespace-pre-wrap"
          style={{
            backgroundColor: 'var(--bg-input)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            minHeight: '200px',
          }}
        >
          {output}
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => navigator.clipboard.writeText(output)}
            className="px-4 py-2 rounded-lg text-sm transition-colors"
            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
          >
            Copy
          </button>
          <button
            onClick={regenerate}
            className="px-4 py-2 rounded-lg text-sm transition-colors"
            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
          >
            Regenerate
          </button>
        </div>
      </div>
    </>
  )
}
