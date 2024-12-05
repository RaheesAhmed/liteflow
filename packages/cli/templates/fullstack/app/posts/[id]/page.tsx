import { Suspense } from 'react'
import { notFound } from '@liteflow/core'
import { auth } from '@liteflow/auth'
import { prisma } from '@liteflow/db'
import { PostDetail } from './post-detail'
import { PostSkeleton } from '@/components/skeletons'
import { BackButton } from '@/components/ui/back-button'

// Generate static params for static pages
export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { id: true }
  })
  
  return posts.map((post) => ({
    id: post.id
  }))
}

// Metadata for SEO
export async function generateMetadata({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    select: { title: true, content: true }
  })

  if (!post) return { title: 'Post Not Found' }

  return {
    title: post.title,
    description: post.content?.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.content?.slice(0, 160)
    }
  }
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const session = await auth()
  const post = await prisma.post.findUnique({
    where: {
      id: params.id,
      OR: [
        { published: true },
        { authorId: session?.user.id }
      ]
    },
    include: { author: true }
  })

  if (!post) {
    notFound()
  }

  const isAuthor = session?.user.id === post.authorId

  return (
    <div className="container max-w-4xl py-8">
      <BackButton href="/posts" className="mb-8">
        Back to Posts
      </BackButton>

      <Suspense fallback={<PostSkeleton />}>
        <PostDetail post={post} isAuthor={isAuthor} />
      </Suspense>
    </div>
  )
} 