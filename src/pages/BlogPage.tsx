import { useNavigate } from 'react-router-dom'
import { SEOHead } from '../components/SEOHead'
import { BLOG_POSTS } from '../data/blogPosts'

export function BlogPage() {
  const navigate = useNavigate()

  return (
    <>
      <SEOHead
        title="Blog — Typing Tips, Text Tools & Productivity | DoAide Type"
        description="Learn to type faster, write better, and boost productivity. Tips on typing speed, text formatting, and developer tools."
        path="/blog"
      />
      <div className="px-4 py-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2 text-center" style={{ color: 'var(--text-primary)' }}>
          Blog
        </h1>
        <p className="text-sm mb-8 text-center" style={{ color: 'var(--text-muted)' }}>
          Tips on typing speed, text tools, and productivity
        </p>

        <div className="space-y-6">
          {BLOG_POSTS.map(post => (
            <article
              key={post.slug}
              className="rounded-xl p-6 cursor-pointer transition-colors"
              style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
              onClick={() => navigate(`/blog/${post.slug}`)}
            >
              <time className="text-xs" style={{ color: 'var(--text-muted)' }}>{post.date}</time>
              <h2 className="text-lg font-bold mt-1 mb-2" style={{ color: 'var(--text-primary)' }}>
                {post.title}
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {post.excerpt}
              </p>
              <span className="inline-block mt-3 text-xs font-bold" style={{ color: 'var(--accent)' }}>
                Read more &rarr;
              </span>
            </article>
          ))}
        </div>
      </div>
    </>
  )
}
