import { describe, it, expect } from 'vitest'
import { BLOG_POSTS } from '../data/blogPosts'

describe('Blog Posts data', () => {
  it('has at least 3 posts', () => {
    expect(BLOG_POSTS.length).toBeGreaterThanOrEqual(3)
  })

  it('all posts have required fields', () => {
    BLOG_POSTS.forEach(post => {
      expect(post.slug).toBeTruthy()
      expect(post.title).toBeTruthy()
      expect(post.date).toBeTruthy()
      expect(post.excerpt).toBeTruthy()
      expect(post.sections.length).toBeGreaterThan(0)
    })
  })

  it('slugs are unique', () => {
    const slugs = BLOG_POSTS.map(p => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('slugs are URL-safe', () => {
    BLOG_POSTS.forEach(post => {
      expect(post.slug).toMatch(/^[a-z0-9-]+$/)
    })
  })

  it('each section has at least one paragraph', () => {
    BLOG_POSTS.forEach(post => {
      post.sections.forEach(section => {
        expect(section.paragraphs.length).toBeGreaterThan(0)
      })
    })
  })
})
