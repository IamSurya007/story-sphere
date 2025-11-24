import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

export default async function StoryDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  const story = await prisma.story.findUnique({
    where: { id: params.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  if (!story) {
    notFound()
  }

  // Check if user can view this story
  if (story.visibility === 'PRIVATE' && story.userId !== session?.user?.id) {
    redirect('/')
  }

  const isOwner = session?.user?.id === story.userId

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <article className="bg-white border border-primary-200 rounded-lg p-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {story.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {story.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/${isOwner ? 'me' : 'stories'}?tag=${encodeURIComponent(tag)}`}
                      className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm hover:bg-primary-200 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <span className="text-sm text-primary-500">
              {formatDistanceToNow(new Date(story.createdAt), { addSuffix: true })}
            </span>
          </div>

          <h1 className="text-4xl font-serif text-primary-900 mb-4">
            {story.title}
          </h1>

          {isOwner && (
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-xs ${
                  story.visibility === 'PUBLIC'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {story.visibility === 'PUBLIC' ? 'Public' : 'Private'}
              </span>
              <Link
                href={`/write/${story.id}`}
                className="px-3 py-1 bg-primary-100 text-primary-700 rounded text-sm hover:bg-primary-200 transition-colors"
              >
                Edit
              </Link>
            </div>
          )}
        </div>

        {story.imageUrls.length > 0 && (
          <div className="mb-8 space-y-4">
            {story.imageUrls.map((url, index) => (
              <Image
                key={index}
                src={url}
                alt={`${story.title} - Image ${index + 1}`}
                width={800}
                height={400}
                className="w-full h-auto rounded-lg"
              />
            ))}
          </div>
        )}

        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-wrap text-primary-700 leading-relaxed font-serif text-lg">
            {story.content}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-primary-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-primary-500">
              {story.visibility === 'PUBLIC' && !isOwner && (
                <span>Shared anonymously</span>
              )}
              {isOwner && (
                <span>Your story</span>
              )}
            </div>
            <Link
              href={isOwner ? '/me' : '/stories'}
              className="text-primary-600 hover:text-primary-900 transition-colors"
            >
              ← Back
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}






