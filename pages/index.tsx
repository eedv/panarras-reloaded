import Container from '../components/container'
import MoreStories from '../components/more-stories'
import HeroPost from '../components/hero-post'
import Intro from '../components/intro'
import Header from '../components/header'
import Layout from '../components/layout'
import { getAllPosts } from '../lib/api'
import Head from 'next/head'
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '../lib/constants'
import Post from '../interfaces/post'
import { useState, useMemo } from 'react'

type Props = {
  allPosts: Post[]
  allTags: string[]
}

export default function Index({ allPosts, allTags }: Props) {
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
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q)
      )
    }
    return posts
  }, [allPosts, selectedTag, searchQuery])

  const heroPost = filteredPosts[0]
  const morePosts = filteredPosts.slice(1)

  return (
    <>
      <Layout>
        <Head>
          <title>{SITE_NAME}</title>
          <meta name="description" content={SITE_DESCRIPTION} />
          <link rel="canonical" href={SITE_URL} />
        </Head>
        <Container>
          <Header />
          <Intro />
          <div className="mb-8 flex flex-wrap gap-2 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  !selectedTag
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-neutral-300 hover:border-black'
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
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-neutral-300 hover:border-black'
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
              className="px-3 py-1 text-sm border border-neutral-300 rounded-full focus:outline-none focus:border-black transition-colors w-48"
            />
          </div>
          {heroPost && (
            <HeroPost
              title={heroPost.title}
              coverImage={heroPost.coverImage}
              date={heroPost.date}
              author={heroPost.author}
              slug={heroPost.slug}
              excerpt={heroPost.excerpt}
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
      </Layout>
    </>
  )
}

export const getStaticProps = async () => {
  const allPosts = getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'excerpt',
    'tags',
  ])

  const tagSet = new Set<string>()
  allPosts.forEach((p) => p.tags?.forEach((t: string) => tagSet.add(t)))
  const allTags = Array.from(tagSet).sort()

  return {
    props: { allPosts, allTags },
  }
}
