import Link from 'next/link'
import Image from 'next/image'
import type { Story } from '@prisma/client'
import { formatDistanceToNow } from 'date-fns'

interface StoryCardProps {
  story: Story
  showAuthor?: boolean
}

export function StoryCard({ story, showAuthor = true }: StoryCardProps) {
  return (
    <Link
      href={`/story/${story.id}`}
      className="block p-6 bg-white border border-primary-200 rounded-lg hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <h2 className="text-2xl font-serif text-primary-900">{story.title}</h2>
        <span className="text-sm text-primary-500 whitespace-nowrap ml-4">
          {formatDistanceToNow(new Date(story.createdAt), { addSuffix: true })}
        </span>
      </div>

      <p className="text-primary-700 mb-4 leading-relaxed line-clamp-3">
        {story.content}
      </p>

      {story.imageUrls.length > 0 && (
        <div className="mb-4">
          <Image
            src={story.imageUrls[0]}
            alt={story.title}
            width={400}
            height={200}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}

      {story.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {story.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-primary-100 text-primary-600 rounded text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-primary-500">
        <span>
          {story.visibility === 'PUBLIC' ? 'Public' : 'Private'}
        </span>
        {showAuthor && (
          <span className="text-primary-400">Anonymous</span>
        )}
      </div>
    </Link>
  )
}

