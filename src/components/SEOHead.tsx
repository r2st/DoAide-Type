import { useEffect } from 'react'

interface SEOHeadProps {
  title: string
  description: string
  path: string
}

export function SEOHead({ title, description, path }: SEOHeadProps) {
  useEffect(() => {
    document.title = title
    const setMeta = (name: string, content: string, attr: string = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        document.head.appendChild(el)
      }
      el.content = content
    }
    setMeta('description', description)
    setMeta('og:title', description, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:url', `https://type.doaide.com${path}`, 'property')

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = `https://type.doaide.com${path}`
  }, [title, description, path])

  return null
}
