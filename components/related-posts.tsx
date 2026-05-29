import PostPreview from './post-preview'
import type Author from '../interfaces/author'

type RelatedPost = {
  slug: string
  title: string
  coverImage: string
  date: string
  excerpt: string
  tags?: string[]
  author?: Author
}

type Props = {
  posts: RelatedPost[]
}

const RelatedPosts = ({ posts }: Props) => {
  return (
    <section>
      <h2 className="mb-8 text-4xl md:text-5xl font-bold tracking-tighter leading-tight">
        Artículos relacionados
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 lg:gap-x-32 gap-y-20 md:gap-y-32 mb-32">
        {posts.map((post) => (
          <PostPreview
            key={post.slug}
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author || { name: '', picture: '' }}
            slug={post.slug}
            excerpt={post.excerpt}
            tags={post.tags}
          />
        ))}
      </div>
    </section>
  )
}

export default RelatedPosts
