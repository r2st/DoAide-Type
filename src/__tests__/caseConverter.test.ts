import { describe, it, expect } from 'vitest'

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

describe('Case Converter', () => {
  const input = 'hello world'

  it('UPPER CASE', () => {
    expect(input.toUpperCase()).toBe('HELLO WORLD')
  })

  it('lower case', () => {
    expect('HELLO'.toLowerCase()).toBe('hello')
  })

  it('Title Case', () => {
    expect(toTitleCase(input)).toBe('Hello World')
  })

  it('Sentence case', () => {
    expect(toSentenceCase('hello world. foo bar.')).toBe('Hello world. Foo bar.')
  })

  it('camelCase', () => {
    expect(toCamelCase('hello world')).toBe('helloWorld')
    expect(toCamelCase('Hello World')).toBe('helloWorld')
  })

  it('PascalCase', () => {
    expect(toPascalCase('hello world')).toBe('HelloWorld')
  })

  it('snake_case', () => {
    expect(toSnakeCase('hello world')).toBe('hello_world')
    expect(toSnakeCase('helloWorld')).toBe('hello_world')
  })

  it('kebab-case', () => {
    expect(toKebabCase('hello world')).toBe('hello-world')
    expect(toKebabCase('helloWorld')).toBe('hello-world')
  })

  it('tOGGLE cASE', () => {
    expect(toToggleCase('Hello')).toBe('hELLO')
  })
})
