'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createStory, updateStory, uploadStoryImage } from '@/app/actions/stories'
import Image from 'next/image'
import type { Story } from '@prisma/client'

interface WriteStoryFormProps {
  story?: Story
}

export function WriteStoryForm({ story }: WriteStoryFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState(story?.title || '')
  const [content, setContent] = useState(story?.content || '')
  const [tags, setTags] = useState<string[]>(story?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [visibility, setVisibility] = useState<'PRIVATE' | 'PUBLIC'>(
    story?.visibility || 'PRIVATE'
  )
  const [imageUrls, setImageUrls] = useState<string[]>(story?.imageUrls || [])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      const newTag = tagInput.trim().toLowerCase()
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag])
      }
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const result = await uploadStoryImage(formData)

      if (result.error) {
        setError(result.error)
      } else if (result.imageUrl) {
        setImageUrls([...imageUrls, result.imageUrl])
      }
    } catch (err) {
      setError('Failed to upload image')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = (urlToRemove: string) => {
    setImageUrls(imageUrls.filter((url) => url !== urlToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('content', content)
      formData.append('tags', JSON.stringify(tags))
      formData.append('visibility', visibility)
      formData.append('imageUrls', JSON.stringify(imageUrls))

      const result = story
        ? await updateStory(story.id, formData)
        : await createStory(formData)

      if (result.error) {
        setError(result.error)
      } else {
        router.push('/me')
        router.refresh()
      }
    } catch (err) {
      setError('Failed to save story')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-primary-700 mb-2"
        >
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-3 text-xl bg-white border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition-all text-primary-900 placeholder:text-primary-400"
          placeholder="Give your story a title..."
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-primary-700 mb-2"
        >
          Your Story
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={20}
          className="w-full px-4 py-3 bg-white border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition-all resize-none font-serif text-lg leading-relaxed text-primary-900 placeholder:text-primary-400"
          placeholder="Write your story here..."
        />
      </div>

      <div>
        <label
          htmlFor="tags"
          className="block text-sm font-medium text-primary-700 mb-2"
        >
          Tags
        </label>
        <input
          id="tags"
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          className="w-full px-4 py-3 bg-white border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition-all text-primary-900 placeholder:text-primary-400"
          placeholder="Add tags (press Enter to add)"
        />
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-primary-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-primary-700 mb-2">
          Images
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="inline-block px-4 py-2 border-2 border-dashed border-primary-300 rounded-lg cursor-pointer hover:bg-primary-50 transition-colors text-primary-700"
        >
          {uploading ? 'Uploading...' : 'Add Image'}
        </label>
        {imageUrls.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {imageUrls.map((url) => (
              <div key={url} className="relative group">
                <Image
                  src={url}
                  alt="Story image"
                  width={200}
                  height={200}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(url)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-primary-700 mb-2">
          Visibility
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="visibility"
              value="PRIVATE"
              checked={visibility === 'PRIVATE'}
              onChange={(e) => setVisibility(e.target.value as 'PRIVATE')}
              className="w-4 h-4 text-accent-600 focus:ring-accent-500"
            />
            <div>
              <div className="font-medium text-primary-900">Private</div>
              <div className="text-sm text-primary-600">
                Only you can see this story
              </div>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="visibility"
              value="PUBLIC"
              checked={visibility === 'PUBLIC'}
              onChange={(e) => setVisibility(e.target.value as 'PUBLIC')}
              className="w-4 h-4 text-accent-600 focus:ring-accent-500"
            />
            <div>
              <div className="font-medium text-primary-900">Public (Anonymous)</div>
              <div className="text-sm text-primary-600">
                Share in community feed without revealing your identity
              </div>
            </div>
          </label>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
        >
          {saving ? 'Saving...' : story ? 'Update Story' : 'Publish Story'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 bg-white border border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

