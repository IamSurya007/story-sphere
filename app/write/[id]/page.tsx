import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { WriteStoryForm } from '@/components/write-story-form'

export default async function EditStoryPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const story = await prisma.story.findUnique({
    where: { id: params.id },
  })

  if (!story || story.userId !== session.user.id) {
    redirect('/me')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-serif text-primary-900 mb-2">
          Edit Your Story
        </h1>
        <p className="text-primary-600">
          Update your story
        </p>
      </div>

      <WriteStoryForm story={story} />
    </div>
  )
}





