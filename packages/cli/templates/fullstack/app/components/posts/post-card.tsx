'use client'

import { Post, User } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'

interface PostCardProps {
  post: Post & {
    author: User
  }
}

export function PostCard({ post }: PostCardProps) {
  return (
    <div className="p-6 rounded-lg border hover:border-blue-500 transition-colors">
      <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
      <p className="text-gray-600 line-clamp-2">{post.content}</p>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img
            src={post.author.image || '/default-avatar.png'}
            alt={post.author.name || 'Author'}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-gray-500">
            {formatDate(post.createdAt)}
          </span>
        </div>
        <Button variant="ghost" href={`/posts/${post.id}`}>
          Read more
        </Button>
      </div>
    </div>
  )
} 