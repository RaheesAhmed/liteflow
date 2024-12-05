import { prisma } from '@liteflow/db'
import { PostCard } from './post-card'

interface PostListProps {
  userId: string
}

// Server Component
export async function PostList({ userId }: PostListProps) {
  const posts = await prisma.post.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: 'desc' },
    include: { author: true }
  })

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No posts yet</h3>
        <p className="mt-2 text-sm text-gray-600">
          Get started by creating your first post
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
} 