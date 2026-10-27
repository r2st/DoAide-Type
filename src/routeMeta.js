/**
 * SEO metadata for every indexable route. Shared by the useSEO hook (wired in
 * App) and scripts/prerender-routes.mjs (static HTML, sitemap, serve.json),
 * so keep it plain JS with no JSX or browser-only imports. /history shows the
 * visitor's own results and is deliberately absent.
 *
 * blogPosts.ts holds only type annotations, which Node (22.18+) strips when
 * the prerender script imports it.
 */

import { BLOG_POSTS } from './data/blogPosts.ts'

export const SITE = {
  name: 'DoAide Type',
  baseUrl: 'https://type.doaide.com',
  ogImage: 'https://type.doaide.com/og-type.png',
}

const ORG = { '@type': 'Organization', name: 'DoAide', url: 'https://doaide.com' }

// Fit "<title> | DoAide Type" into ~70 chars; long titles go without it.
const withSuffix = (title) => (`${title} | DoAide Type`.length <= 70 ? `${title} | DoAide Type` : title)

// "October 8, 2026" -> "2026-10-08", read at noon UTC so no timezone shifts the day.
const isoDate = (label) => new Date(`${label} 12:00 UTC`).toISOString().slice(0, 10)

const tool = (path, h1, title, description) => ({ path, h1, title: withSuffix(title), description, kind: 'tool' })

export const routes = [
  {
    path: '/',
    kind: 'home',
    h1: 'Typing Speed Test',
    title: 'DoAide Type — Free Typing Speed Test (WPM & Accuracy)',
    description:
      'Test your typing speed in words per minute with live accuracy, a keyboard map of your mistakes and history. Free typing test, no login.',
  },
  tool('/practice', 'Practice Mode', 'Typing Practice — Drill Your Weakest Keys',
    'Practice typing with drills built from the keys you miss most, and watch your accuracy improve. Free online typing practice.'),
  {
    path: '/tools',
    kind: 'page',
    h1: 'Free Text & Typing Tools',
    title: withSuffix('Free Text & Typing Tools'),
    description:
      'Free online text tools: typing speed test, word counter, character counter, text case converter, and lorem ipsum generator. No login required.',
  },
  tool('/word-counter', 'Word Counter', 'Word Counter — Words, Characters & Sentences',
    'Instantly count words, characters, sentences, and paragraphs. Free online word counter with reading time estimate — no login required.'),
  tool('/character-counter', 'Character Counter', 'Character Counter — Twitter, Instagram & SEO Limits',
    'Count characters with platform limits for Twitter, Instagram, LinkedIn, YouTube and SEO meta tags. Free character counter, no login.'),
  tool('/case-converter', 'Text Case Converter', 'Text Case Converter — UPPER, lower, Title, camelCase',
    'Convert text between UPPER CASE, lower case, Title Case, camelCase, snake_case, kebab-case and more. Free online case converter.'),
  tool('/lorem-ipsum', 'Lorem Ipsum Generator', 'Lorem Ipsum Generator — Paragraphs & Words',
    'Generate lorem ipsum placeholder text by paragraphs, sentences, or words. Free dummy text generator — no login required.'),
  {
    path: '/blog',
    kind: 'blog',
    h1: 'Blog',
    title: withSuffix('Blog — Typing Tips, Text Tools & Productivity'),
    description:
      'Learn to type faster, write better, and boost productivity. Tips on typing speed, text formatting, and developer tools.',
  },
  ...BLOG_POSTS.map((p) => ({
    path: `/blog/${p.slug}`,
    kind: 'post',
    h1: p.title,
    title: withSuffix(p.title),
    description: p.excerpt,
    published: isoDate(p.date),
    faqs: p.faqs,
  })),
]

export const canonicalFor = (path) => `${SITE.baseUrl}${path}`

export const metaForPath = (path) => routes.find((r) => r.path === path)

export function jsonLdFor(route) {
  const url = canonicalFor(route.path)
  let main
  switch (route.kind) {
    case 'home':
    case 'tool':
      main = {
        '@type': 'WebApplication',
        name: route.kind === 'home' ? SITE.name : route.h1,
        url,
        description: route.description,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        author: ORG,
      }
      break
    case 'post':
      main = {
        '@type': 'BlogPosting',
        headline: route.h1,
        description: route.description,
        url,
        mainEntityOfPage: url,
        datePublished: route.published,
        author: ORG,
        publisher: ORG,
      }
      break
    default:
      main = {
        '@type': route.kind === 'blog' ? 'Blog' : 'WebPage',
        name: route.h1,
        url,
        description: route.description,
        isPartOf: { '@type': 'WebSite', name: SITE.name, url: canonicalFor('/') },
      }
  }
  const graph = [main]
  if (route.faqs?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: route.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}
