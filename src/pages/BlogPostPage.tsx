import { useParams, useNavigate, Link } from 'react-router-dom'
import { BLOG_POSTS } from '../data/blogPosts'

function parseParagraph(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g
  let lastIndex = 0
  let match
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    const href = match[2]
    const label = match[1]
    if (href.startsWith('/')) {
      parts.push(
        <Link key={match.index} to={href} style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
          {label}
        </Link>
      )
    } else {
      parts.push(
        <a key={match.index} href={href} style={{ color: 'var(--accent)', textDecoration: 'underline' }} rel="noopener noreferrer">
          {label}
        </a>
      )
    }
    lastIndex = regex.lastIndex
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }
  return parts.length <= 1 ? (parts[0] ?? text) : <>{parts}</>
}

export function BlogPostPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const post = BLOG_POSTS.find(p => p.slug === slug)

  if (!post) {
    return (
      <div className="px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Post not found</h1>
        <button
          onClick={() => navigate('/blog')}
          className="px-4 py-2 rounded-lg text-sm"
          style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
        >
          Back to Blog
        </button>
      </div>
    )
  }

  return (
    <>
      <article className="px-4 py-8 max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/blog')}
          className="text-sm mb-6 inline-block"
          style={{ color: 'var(--accent)' }}
        >
          &larr; All posts
        </button>

        <time className="block text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{post.date}</time>
        <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
          {post.title}
        </h1>

        <div
          className="prose-custom space-y-4 text-sm leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {post.sections.map((section, i) => (
            <div key={i}>
              {section.heading && (
                <h2 className="text-lg font-bold mt-6 mb-3" style={{ color: 'var(--text-primary)' }}>
                  {section.heading}
                </h2>
              )}
              {section.paragraphs.map((p, j) => (
                <p key={j} className="mb-3">{parseParagraph(p)}</p>
              ))}
            </div>
          ))}
        </div>

        {post.faqs && post.faqs.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {post.faqs.map((faq, i) => (
                <details
                  key={i}
                  className="rounded-lg p-4"
                  style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
                >
                  <summary className="cursor-pointer font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {faq.question}
                  </summary>
                  <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        <div className="mt-12 pt-6" style={{ borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={() => navigate('/blog')}
            className="text-sm"
            style={{ color: 'var(--accent)' }}
          >
            &larr; All posts
          </button>
        </div>
      </article>
    </>
  )
}
