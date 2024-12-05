import { Suspense } from 'react'
import { auth } from '@liteflow/auth'
import { PostList } from '@/components/posts/post-list'
import { Button } from '@/components/ui/button'
import { WelcomeHero } from '@/components/welcome-hero'

// Server Component
export default async function HomePage() {
  const session = await auth()

  if (!session) {
    return <WelcomeHero />
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {session.user.name}
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening in your projects
          </p>
        </div>
        <Button href="/posts/new">Create Post</Button>
      </div>

      <Suspense 
        fallback={
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 rounded-lg bg-gray-100 animate-pulse" />
            ))}
          </div>
        }
      >
        <PostList userId={session.user.id} />
      </Suspense>
    </div>
  )
} 