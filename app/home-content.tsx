'use client'

import { useState, useMemo } from 'react'
import Container from '../components/container'
import Header from '../components/header'
import Intro from '../components/intro'
import HeroPost from '../components/hero-post'
import MoreStories from '../components/more-stories'

type Post = {
  slug: string
  title: string
  date: string
  coverImage: string
  author: { name: string; picture: string }
  excerpt?: string
  tags?: string[]
}

type Props = {
  allPosts: Post[]
  allTags: string[]
}

export default function HomeContent({ allPosts, allTags }: Props) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = useMemo(() => {
    let posts = allPosts
    if (selectedTag) {
      posts = posts.filter((p) => p.tags?.includes(selectedTag))
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      posts = posts.filter(
        (p) =>
          (p.title || '').toLowerCase().includes(q) ||
          (p.excerpt || '').toLowerCase().includes(q)
      )
    }
    return posts
  }, [allPosts, selectedTag, searchQuery])

  const heroPost = filteredPosts[0]
  const morePosts = filteredPosts.slice(1)

  return (
    <div className="min-h-screen">
      <Container>
        <Header />
        <Intro />
        <div className="mb-8 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                !selectedTag
                  ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                  : 'bg-white text-black border-neutral-300 hover:border-black dark:bg-neutral-800 dark:text-white dark:border-neutral-600 dark:hover:border-white'
              }`}
            >
              Todas
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  selectedTag === tag
                    ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                    : 'bg-white text-black border-neutral-300 hover:border-black dark:bg-neutral-800 dark:text-white dark:border-neutral-600 dark:hover:border-white'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Buscar artículos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1 text-sm border border-neutral-300 rounded-full focus:outline-none focus:border-black transition-colors w-48 dark:bg-neutral-800 dark:text-white dark:border-neutral-600 dark:focus:border-white"
          />
        </div>
        {heroPost && (
          <HeroPost
            title={heroPost.title}
            coverImage={heroPost.coverImage}
            date={heroPost.date}
            author={heroPost.author}
            slug={heroPost.slug}
            excerpt={heroPost.excerpt || ''}
            tags={heroPost.tags}
          />
        )}
        {morePosts.length > 0 && <MoreStories posts={morePosts} />}
        {filteredPosts.length === 0 && (
          <p className="text-center text-neutral-500 my-20">
            No se encontraron artículos.
          </p>
        )}
      </Container>
    </div>
  )
}
