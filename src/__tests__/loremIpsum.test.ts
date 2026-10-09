import { describe, it, expect } from 'vitest'

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua',
]

function randomWord(): string {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]
}

function generateSentence(minWords: number = 8, maxWords: number = 16): string {
  const len = minWords + Math.floor(Math.random() * (maxWords - minWords + 1))
  const words = Array.from({ length: len }, randomWord)
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
  return words.join(' ') + '.'
}

describe('Lorem Ipsum Generator', () => {
  it('generates words from the word list', () => {
    for (let i = 0; i < 50; i++) {
      expect(LOREM_WORDS).toContain(randomWord())
    }
  })

  it('generates sentences starting with a capital letter', () => {
    const sentence = generateSentence()
    expect(sentence[0]).toBe(sentence[0].toUpperCase())
  })

  it('generates sentences ending with a period', () => {
    const sentence = generateSentence()
    expect(sentence.endsWith('.')).toBe(true)
  })

  it('generates sentences within word count bounds', () => {
    for (let i = 0; i < 20; i++) {
      const sentence = generateSentence(5, 10)
      const wordCount = sentence.replace('.', '').split(' ').length
      expect(wordCount).toBeGreaterThanOrEqual(5)
      expect(wordCount).toBeLessThanOrEqual(10)
    }
  })
})
