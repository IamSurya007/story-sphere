import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { StoryCard } from '@/components/story-card'
import Link from 'next/link'

export default async function PublicStoriesPage({
  searchParams,
}: {
  searchParams: { tag?: string; search?: string }
}) {
  const session = await getServerSession(authOptions)

  const where: any = {
    visibility: 'PUBLIC',
  }

  if (searchParams.tag) {
    where.tags = {
      has: searchParams.tag,
    }
  }

  if (searchParams.search) {
    where.OR = [
      { title: { contains: searchParams.search, mode: 'insensitive' } },
      { content: { contains: searchParams.search, mode: 'insensitive' } },
    ]
  }

  const stories = await prisma.story.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 50, // Limit to recent 50 stories
  })

  // Get all unique tags from public stories
  const allTags = Array.from(
    new Set(stories.flatMap((story) => story.tags))
  ).sort()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-serif text-primary-900 mb-2">
          Community Stories
        </h1>
        <p className="text-primary-600">
          Anonymous stories shared by the community
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        <form method="GET" className="flex gap-4">
          <input
            type="text"
            name="search"
            defaultValue={searchParams.search}
            placeholder="Search stories..."
            className="flex-1 px-4 py-2 bg-white border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none text-primary-900 placeholder:text-primary-400"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
          >
            Search
          </button>
        </form>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Link
              href="/stories"
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                !searchParams.tag
                  ? 'bg-accent-600 text-white'
                  : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
              }`}
            >
              All
            </Link>
            {allTags.map((tag) => (
              <Link
                key={tag}
                href={`/stories?tag=${encodeURIComponent(tag)}`}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  searchParams.tag === tag
                    ? 'bg-primary-700 text-white'
                    : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                }`}
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Stories List */}
      {stories.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-primary-600 text-lg mb-4">
            {searchParams.search || searchParams.tag
              ? 'No stories found matching your criteria'
              : 'No public stories yet. Be the first to share!'}
          </p>
          {session && (
            <Link
              href="/write"
              className="inline-block px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors font-medium shadow-sm"
            >
              Write a Story
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} showAuthor={false} />
          ))}
        </div>
      )}
    </div>
  )
}

