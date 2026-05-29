import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Container from '../../components/container'
import PostBody from '../../components/post-body'
import Header from '../../components/header'
import PostHeader from '../../components/post-header'
import Layout from '../../components/layout'
import { getPostBySlug, getAllPosts } from '../../lib/api'
import PostTitle from '../../components/post-title'
import Head from 'next/head'
import { SITE_NAME, SITE_URL } from '../../lib/constants'
import markdownToHtml from '../../lib/markdownToHtml'
import type PostType from '../../interfaces/post'
import { getTagsFromSlug } from '../../lib/tags'
import RelatedPosts from '../../components/related-posts'
import TableOfContents from '../../components/table-of-contents'

type Props = {
  post: PostType
  relatedPosts: PostType[]
  toc: { id: string; text: string; level: number }[]
}

export default function Post({ post, relatedPosts, toc }: Props) {
  const router = useRouter()
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }
  return (
    <Layout>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article className="mb-32">
              <Head>
                <title>
                  {post.title} | {SITE_NAME}
                </title>
                <meta name="description" content={post.excerpt} />
                <link rel="canonical" href={`${SITE_URL}/posts/${post.slug}`} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.excerpt} />
                <meta property="og:type" content="article" />
                <meta property="og:locale" content="es_ES" />
                <meta property="og:url" content={`${SITE_URL}/posts/${post.slug}`} />
                <meta property="og:image" content={post.ogImage?.url || `${SITE_URL}/assets/blog/${post.coverImage}`} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={post.title} />
                <meta name="twitter:description" content={post.excerpt} />
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                      '@context': 'https://schema.org',
                      '@type': 'Article',
                      headline: post.title,
                      description: post.excerpt,
                      image: post.ogImage?.url || `${SITE_URL}/assets/blog/${post.coverImage}`,
                      datePublished: post.date,
                      author: {
                        '@type': 'Person',
                        name: post.author?.name || 'Panarras',
                      },
                    }),
                  }}
                />
              </Head>
              <PostHeader
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                author={post.author}
                tags={post.tags}
              />
              <div className="max-w-3xl mx-auto lg:grid lg:grid-cols-[1fr_200px] lg:gap-8">
                <PostBody content={post.content} />
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
            </article>
            {relatedPosts.length > 0 && (
              <RelatedPosts posts={relatedPosts} />
            )}
          </>
        )}
      </Container>
    </Layout>
  )
}

type Params = {
  params: {
    slug: string
  }
}

export async function getStaticProps({ params }: Params) {
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
  const content = await markdownToHtml(post.content || '')

  const allPosts = getAllPosts(['slug', 'title', 'coverImage', 'date', 'excerpt', 'tags'])
  const currentTags = getTagsFromSlug(params.slug)
  const relatedPosts = allPosts
    .filter((p) => p.slug !== params.slug)
    .map((p) => ({
      ...p,
      tags: getTagsFromSlug(p.slug),
    }))
    .filter((p) => p.tags?.some((t: string) => currentTags.includes(t)))
    .slice(0, 4)

  const headingRegex = /<h([23])\s+id="([^"]+)"[^>]*>([^<]+)<\/h[23]>/g
  const toc: { id: string; text: string; level: number }[] = []
  let match
  while ((match = headingRegex.exec(content)) !== null) {
    toc.push({ level: parseInt(match[1]), id: match[2], text: match[3] })
  }

  return {
    props: {
      post: {
        ...post,
        content,
        tags: getTagsFromSlug(params.slug),
      },
      relatedPosts,
      toc,
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug'])

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}
