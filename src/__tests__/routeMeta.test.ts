import { describe, it, expect } from 'vitest'
import { BLOG_POSTS } from '../data/blogPosts'
import { jsonLdFor, metaForPath, routes } from '../routeMeta'
import appSrc from '../App.tsx?raw'

describe('routeMeta', () => {
  it('has unique paths, titles and descriptions', () => {
    for (const key of ['path', 'title', 'description'] as const) {
      const values = routes.map((r) => r[key])
      expect(new Set(values).size).toBe(values.length)
    }
  })

  it('only lists routes the router serves, and never /history', () => {
    const served = new Set([...appSrc.matchAll(/<Route path="([^"]+)"/g)].map((m) => m[1]))
    for (const r of routes) expect(served.has(r.path) || r.path.startsWith('/blog/'), r.path).toBe(true)
    expect(metaForPath('/history')).toBeUndefined()
  })

  it('dates every post from its label and emits complete FAQs', () => {
    for (const p of BLOG_POSTS) {
      const graph = jsonLdFor(metaForPath(`/blog/${p.slug}`)!)['@graph'] as Record<string, any>[]
      expect(graph[0].datePublished).toMatch(/^2026-10-\d{2}$/)
      for (const q of graph.find((n) => n['@type'] === 'FAQPage')?.mainEntity ?? []) {
        expect(q.name && q.acceptedAnswer.text).toBeTruthy()
      }
    }
  })
})
