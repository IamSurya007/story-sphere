import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { StoryCard } from '@/components/story-card'
import { deleteStory } from '@/app/actions/stories'
import { DeleteStoryButton } from '@/components/delete-story-button'

export default async function MyJournalPage({
  searchParams,
}: {
  searchParams: { tag?: string; search?: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const where: any = {
    userId: session.user.id,
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
  })

  // Get all unique tags from user's stories
  const allTags = Array.from(
    new Set(stories.flatMap((story) => story.tags))
  ).sort()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-serif text-primary-900 mb-2">
            My Journal
          </h1>
          <p className="text-primary-600">
            Your personal collection of stories and reflections
          </p>
        </div>
        <Link
          href="/write"
          className="px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors font-medium shadow-sm"
        >
          Write New Story
        </Link>
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
              href="/me"
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
                href={`/me?tag=${encodeURIComponent(tag)}`}
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
              : "You haven't written any stories yet"}
          </p>
          {!searchParams.search && !searchParams.tag && (
            <Link
              href="/write"
              className="inline-block px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors font-medium shadow-sm"
            >
              Write Your First Story
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {stories.map((story) => (
            <div key={story.id} className="relative">
              <StoryCard story={story} showAuthor={false} />
              <div className="absolute bottom-4 right-4 flex gap-2">
                <Link
                  href={`/write/${story.id}`}
                  className="px-3 py-1 bg-white/90 backdrop-blur-sm border border-primary-300 text-primary-700 rounded text-sm hover:bg-primary-50 transition-colors"
                >
                  Edit
                </Link>
                <DeleteStoryButton storyId={story.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

