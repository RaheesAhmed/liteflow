import { z } from 'zod'
import { auth } from '@liteflow/auth'
import { prisma } from '@liteflow/db'

// Validation schema
const postSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1),
  published: z.boolean().default(false)
})

// GET /api/posts
export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const posts = await prisma.post.findMany({
      where: { authorId: session.user.id },
      orderBy: { createdAt: 'desc' },
      include: { author: true }
    })

    return Response.json(posts)
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return Response.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

// POST /api/posts
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const result = postSchema.safeParse(body)
    
    if (!result.success) {
      return Response.json(
        { error: 'Invalid input', details: result.error.format() },
        { status: 400 }
      )
    }

    const post = await prisma.post.create({
      data: {
        ...result.data,
        authorId: session.user.id
      }
    })

    return Response.json(post, { status: 201 })
  } catch (error) {
    console.error('Failed to create post:', error)
    return Response.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}

// PATCH /api/posts
export async function PATCH(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const result = postSchema.extend({
      id: z.string()
    }).safeParse(body)
    
    if (!result.success) {
      return Response.json(
        { error: 'Invalid input', details: result.error.format() },
        { status: 400 }
      )
    }

    const { id, ...data } = result.data
    const post = await prisma.post.update({
      where: {
        id,
        authorId: session.user.id // Ensure user owns the post
      },
      data
    })

    return Response.json(post)
  } catch (error) {
    console.error('Failed to update post:', error)
    return Response.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}

// DELETE /api/posts
export async function DELETE(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await request.json()
    if (!id) {
      return Response.json(
        { error: 'Missing post ID' },
        { status: 400 }
      )
    }

    await prisma.post.delete({
      where: {
        id,
        authorId: session.user.id // Ensure user owns the post
      }
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    console.error('Failed to delete post:', error)
    return Response.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
} 