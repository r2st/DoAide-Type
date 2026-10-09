import { describe, it, expect } from 'vitest'

function countStats(text: string) {
  const trimmed = text.trim()
  const words = trimmed ? trimmed.split(/\s+/).length : 0
  const chars = text.length
  const charsNoSpaces = text.replace(/\s/g, '').length
  const sentences = trimmed ? (trimmed.match(/[.!?]+/g) || []).length || (trimmed.length > 0 ? 1 : 0) : 0
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter(p => p.trim()).length : 0
  const readingTime = Math.max(1, Math.ceil(words / 225))
  const speakingTime = Math.max(1, Math.ceil(words / 150))
  return { words, chars, charsNoSpaces, sentences, paragraphs, readingTime, speakingTime }
}

describe('Word Counter Stats', () => {
  it('handles empty string', () => {
    const s = countStats('')
    expect(s.words).toBe(0)
    expect(s.chars).toBe(0)
    expect(s.sentences).toBe(0)
    expect(s.paragraphs).toBe(0)
  })

  it('counts words correctly', () => {
    expect(countStats('hello world').words).toBe(2)
    expect(countStats('  one  two  three  ').words).toBe(3)
  })

  it('counts characters with and without spaces', () => {
    const s = countStats('hi there')
    expect(s.chars).toBe(8)
    expect(s.charsNoSpaces).toBe(7)
  })

  it('counts sentences', () => {
    expect(countStats('Hello. World! How?').sentences).toBe(3)
    expect(countStats('No period').sentences).toBe(1)
  })

  it('counts paragraphs', () => {
    expect(countStats('Para one.\n\nPara two.').paragraphs).toBe(2)
    expect(countStats('Single para.').paragraphs).toBe(1)
  })

  it('estimates reading and speaking time', () => {
    const words450 = Array(450).fill('word').join(' ')
    const s = countStats(words450)
    expect(s.readingTime).toBe(2)
    expect(s.speakingTime).toBe(3)
  })
})
