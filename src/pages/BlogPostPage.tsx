import { useParams, useNavigate } from 'react-router-dom'
import { SEOHead } from '../components/SEOHead'
import { BLOG_POSTS } from '../data/blogPosts'

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
      <SEOHead
        title={`${post.title} | DoAide Type Blog`}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
      />
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
                <p key={j} className="mb-3">{p}</p>
              ))}
            </div>
          ))}
        </div>

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
