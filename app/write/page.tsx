import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { WriteStoryForm } from '@/components/write-story-form'

export default async function WritePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-serif text-primary-900 mb-2">
          Write Your Story
        </h1>
        <p className="text-primary-600">
          Share your thoughts, experiences, and reflections
        </p>
      </div>

      <WriteStoryForm />
    </div>
  )
}





