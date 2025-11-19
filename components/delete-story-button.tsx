'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteStory } from '@/app/actions/stories'

interface DeleteStoryButtonProps {
  storyId: string
}

export function DeleteStoryButton({ storyId }: DeleteStoryButtonProps) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    const result = await deleteStory(storyId)
    if (result.success) {
      router.refresh()
    }
    setDeleting(false)
    setConfirming(false)
  }

  if (confirming) {
    return (
      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {deleting ? 'Deleting...' : 'Confirm'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-3 py-1 bg-white/90 backdrop-blur-sm border border-primary-300 text-primary-700 rounded text-sm hover:bg-primary-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="px-3 py-1 bg-white/90 backdrop-blur-sm border border-primary-300 text-red-600 rounded text-sm hover:bg-red-50 transition-colors"
    >
      Delete
    </button>
  )
}





