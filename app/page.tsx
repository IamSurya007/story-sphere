import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center space-y-8">
        <h1 className="text-6xl font-serif text-primary-900 mb-4">
          StorySphere
        </h1>
        <p className="text-xl text-primary-700 max-w-2xl mx-auto leading-relaxed">
          A calm, private space for your thoughts, stories, and reflections.
          No likes, no comments, no pressure—just you and your words.
        </p>
    

        {session ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link
              href="/write"
              className="px-8 py-4 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors text-lg font-medium shadow-sm"
            >
              Start Writing
            </Link>
            <Link
              href="/me"
              className="px-8 py-4 bg-white border-2 border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors text-lg font-medium"
            >
              View My Journal
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors text-lg font-medium shadow-sm"
            >
              Get Started
            </Link>
            <Link
              href="/auth/signin"
              className="px-8 py-4 border-2 border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors text-lg"
            >
              Sign In
            </Link>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-primary-200">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-primary-900">
              Private & Secure
            </h3>
            <p className="text-primary-600">
              Your stories are yours alone. Choose what to keep private and
              what to share anonymously.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-primary-900">
              No Distractions
            </h3>
            <p className="text-primary-600">
              A minimal, calm interface designed for reflection and
              self-expression, not engagement metrics.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-primary-900">
              Your Space
            </h3>
            <p className="text-primary-600">
              Write freely, organize with tags, and explore stories from others
              in the community feed.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

