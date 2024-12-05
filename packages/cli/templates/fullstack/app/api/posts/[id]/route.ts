import { z } from 'zod'
import { auth } from '@liteflow/auth'
import { prisma } from '@liteflow/db'
import { ApiError } from '@liteflow/core'

// Validation schema
const postSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1),
  published: z.boolean().default(false)
})

// GET /api/posts/[id]
export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session) {
      throw new ApiError('Unauthorized', 401)
    }

    const post = await prisma.post.findUnique({
      where: {
        id: params.id,
        authorId: session.user.id
      },
      include: { author: true }
    })

    if (!post) {
      throw new ApiError('Post not found', 404)
    }

    return Response.json(post)
  } catch (error) {
    if (error instanceof ApiError) {
      return Response.json(
        { error: error.message },
        { status: error.status }
      )
    }
    
    console.error('Failed to fetch post:', error)
    return Response.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

// PATCH /api/posts/[id]
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session) {
      throw new ApiError('Unauthorized', 401)
    }

    const body = await request.json()
    const result = postSchema.safeParse(body)
    
    if (!result.success) {
      throw new ApiError('Invalid input', 400, result.error.format())
    }

    const post = await prisma.post.update({
      where: {
        id: params.id,
        authorId: session.user.id
      },
      data: result.data,
      include: { author: true }
    })

    return Response.json(post)
  } catch (error) {
    if (error instanceof ApiError) {
      return Response.json(
        { error: error.message, details: error.details },
        { status: error.status }
      )
    }
    
    console.error('Failed to update post:', error)
    return Response.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}

// DELETE /api/posts/[id]
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session) {
      throw new ApiError('Unauthorized', 401)
    }

    await prisma.post.delete({
      where: {
        id: params.id,
        authorId: session.user.id
      }
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    if (error instanceof ApiError) {
      return Response.json(
        { error: error.message },
        { status: error.status }
      )
    }
    
    console.error('Failed to delete post:', error)
    return Response.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
} 