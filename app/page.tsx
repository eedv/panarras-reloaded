import { getAllPosts } from '../lib/api'
import { getAllTagsFromPosts } from '../lib/tags'
import HomeContent from './home-content'

export default function HomePage() {
  const allPosts = getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'excerpt',
    'tags',
  ])
  const allTags = getAllTagsFromPosts(allPosts)

  const posts = allPosts.map((p) => ({
    slug: p.slug as string,
    title: p.title as string,
    date: p.date as string,
    coverImage: p.coverImage as string,
    author: p.author as { name: string; picture: string },
    excerpt: (p.excerpt as string) || '',
    tags: p.tags as string[] | undefined,
  }))

  return <HomeContent allPosts={posts} allTags={allTags} />
}
