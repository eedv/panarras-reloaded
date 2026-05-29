import { getAllPosts, getPostBySlug } from '../../../lib/api'
import { getTagsFromSlug } from '../../../lib/tags'
import markdownToHtml from '../../../lib/markdownToHtml'
import { SITE_NAME, SITE_URL } from '../../../lib/constants'
import PostBody from '../../../components/post-body'
import PostHeader from '../../../components/post-header'
import TableOfContents from '../../../components/table-of-contents'
import RelatedPosts from '../../../components/related-posts'
import Container from '../../../components/container'
import Header from '../../../components/header'

type Props = {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = getAllPosts(['slug'])
  return posts.map((post) => ({ slug: post.slug as string }))
}

export async function generateMetadata({ params }: Props) {
  const post = getPostBySlug(params.slug, ['title', 'excerpt', 'ogImage', 'coverImage'])
  if (!post?.title) return {}

  return {
    title: `${post.title as string} | ${SITE_NAME}`,
    description: post.excerpt as string,
    openGraph: {
      title: post.title as string,
      description: post.excerpt as string,
      type: 'article' as const,
      locale: 'es_ES',
      url: `${SITE_URL}/posts/${params.slug}`,
      images: [{ url: (post.ogImage as { url: string })?.url || `${SITE_URL}/assets/blog/${post.coverImage as string}` }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: post.title as string,
      description: post.excerpt as string,
    },
    alternates: {
      canonical: `${SITE_URL}/posts/${params.slug}`,
    },
    other: {
      'article:published_time': post.date as string,
    },
  }
}

export default async function PostPage({ params }: Props) {
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'ogImage',
    'coverImage',
    'excerpt',
    'tags',
  ])
  const content = await markdownToHtml((post.content as string) || '')

  const allPosts = getAllPosts(['slug', 'title', 'coverImage', 'date', 'excerpt', 'tags'])
  const currentTags = getTagsFromSlug(params.slug)
  const relatedPosts = allPosts
    .filter((p) => p.slug !== params.slug)
    .map((p) => ({
      slug: p.slug as string,
      title: p.title as string,
      coverImage: p.coverImage as string,
      date: p.date as string,
      excerpt: p.excerpt as string,
      tags: getTagsFromSlug(p.slug as string),
      author: p.author as { name: string; picture: string } | undefined,
    }))
    .filter((p) => p.tags?.some((t) => currentTags.includes(t)))
    .slice(0, 4)

  const headingRegex = /<h([23])\s+id="([^"]+)"[^>]*>([^<]+)<\/h[23]>/g
  const toc: { id: string; text: string; level: number }[] = []
  let match
  while ((match = headingRegex.exec(content)) !== null) {
    toc.push({ level: parseInt(match[1]), id: match[2], text: match[3] })
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title as string,
    description: post.excerpt as string,
    image: (post.ogImage as { url: string })?.url || `${SITE_URL}/assets/blog/${post.coverImage as string}`,
    datePublished: post.date as string,
    author: {
      '@type': 'Person',
      name: (post.author as { name: string })?.name || 'Panarras',
    },
  }

  return (
    <Container>
      <Header />
      <article className="mb-32">
        <PostHeader
          title={post.title as string}
          coverImage={post.coverImage as string}
          date={post.date as string}
          author={post.author as { name: string; picture: string }}
          tags={getTagsFromSlug(params.slug)}
        />
        <div className="max-w-3xl mx-auto lg:grid lg:grid-cols-[1fr_200px] lg:gap-8">
          <PostBody content={content} />
          {toc.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-8">
                <TableOfContents items={toc} />
              </div>
            </aside>
          )}
        </div>
        {toc.length > 0 && (
          <div className="max-w-3xl mx-auto lg:hidden mt-8">
            <TableOfContents items={toc} />
          </div>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </article>
      {relatedPosts.length > 0 && <RelatedPosts posts={relatedPosts} />}
    </Container>
  )
}
