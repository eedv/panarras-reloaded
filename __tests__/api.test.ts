import { getPostSlugs, getPostBySlug, getAllPosts } from '../lib/api'

describe('getPostSlugs', () => {
  it('returns all post slugs as an array', () => {
    const slugs = getPostSlugs()
    expect(Array.isArray(slugs)).toBe(true)
    expect(slugs.length).toBeGreaterThan(0)
    slugs.forEach((slug) => {
      expect(typeof slug).toBe('string')
    })
  })
})

describe('getPostBySlug', () => {
  it('returns a post with the requested fields', () => {
    const slugs = getPostSlugs()
    const first = slugs[0]
    const post = getPostBySlug(first, ['title', 'slug', 'date', 'tags'])

    expect(post).toHaveProperty('title')
    expect(post).toHaveProperty('slug')
    expect(post).toHaveProperty('date')
    expect(post).toHaveProperty('tags')
    expect(Array.isArray(post.tags)).toBe(true)
  })

  it('returns only requested fields', () => {
    const slugs = getPostSlugs()
    const post = getPostBySlug(slugs[0], ['slug'])
    expect(Object.keys(post)).toEqual(['slug'])
  })

  it('throws for non-existent slug', () => {
    expect(() => getPostBySlug('non-existent-slug', ['slug'])).toThrow()
  })
})

describe('getAllPosts', () => {
  it('returns all posts sorted by date descending', () => {
    const posts = getAllPosts(['slug', 'date'])
    expect(posts.length).toBeGreaterThan(0)

    for (let i = 1; i < posts.length; i++) {
      const prev = new Date(posts[i - 1].date).getTime()
      const curr = new Date(posts[i].date).getTime()
      if (!isNaN(prev) && !isNaN(curr)) {
        expect(prev).toBeGreaterThanOrEqual(curr)
      }
      // Skip comparison if either date is unparseable
    }
  })

  it('returns the requested fields for all posts', () => {
    const posts = getAllPosts(['title', 'slug'])
    posts.forEach((post) => {
      expect(post).toHaveProperty('title')
      expect(post).toHaveProperty('slug')
      expect(post).not.toHaveProperty('date')
    })
  })
})
