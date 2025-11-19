'use server'

import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { uploadImageToS3 } from '@/lib/s3'

const createStorySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  tags: z.array(z.string()).default([]),
  visibility: z.enum(['PRIVATE', 'PUBLIC']),
  imageUrls: z.array(z.string()).default([]),
})

export async function createStory(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { error: 'Unauthorized' }
    }

    const rawData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      tags: JSON.parse((formData.get('tags') as string) || '[]'),
      visibility: formData.get('visibility') as 'PRIVATE' | 'PUBLIC',
      imageUrls: JSON.parse((formData.get('imageUrls') as string) || '[]'),
    }

    const validatedData = createStorySchema.parse(rawData)

    const story = await prisma.story.create({
      data: {
        userId: session.user.id,
        title: validatedData.title,
        content: validatedData.content,
        tags: validatedData.tags,
        visibility: validatedData.visibility,
        imageUrls: validatedData.imageUrls,
      },
    })

    revalidatePath('/me')
    revalidatePath('/stories')
    revalidatePath('/')

    return { success: true, storyId: story.id }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: 'Failed to create story' }
  }
}

export async function updateStory(storyId: string, formData: FormData) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { error: 'Unauthorized' }
    }

    // Verify ownership
    const existingStory = await prisma.story.findUnique({
      where: { id: storyId },
    })

    if (!existingStory || existingStory.userId !== session.user.id) {
      return { error: 'Unauthorized' }
    }

    const rawData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      tags: JSON.parse((formData.get('tags') as string) || '[]'),
      visibility: formData.get('visibility') as 'PRIVATE' | 'PUBLIC',
      imageUrls: JSON.parse((formData.get('imageUrls') as string) || '[]'),
    }

    const validatedData = createStorySchema.parse(rawData)

    await prisma.story.update({
      where: { id: storyId },
      data: {
        title: validatedData.title,
        content: validatedData.content,
        tags: validatedData.tags,
        visibility: validatedData.visibility,
        imageUrls: validatedData.imageUrls,
      },
    })

    revalidatePath('/me')
    revalidatePath('/stories')
    revalidatePath(`/story/${storyId}`)

    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: 'Failed to update story' }
  }
}

export async function deleteStory(storyId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { error: 'Unauthorized' }
    }

    // Verify ownership
    const existingStory = await prisma.story.findUnique({
      where: { id: storyId },
    })

    if (!existingStory || existingStory.userId !== session.user.id) {
      return { error: 'Unauthorized' }
    }

    await prisma.story.delete({
      where: { id: storyId },
    })

    revalidatePath('/me')
    revalidatePath('/stories')

    return { success: true }
  } catch (error) {
    return { error: 'Failed to delete story' }
  }
}

export async function uploadStoryImage(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { error: 'Unauthorized' }
    }

    const file = formData.get('file') as File
    if (!file) {
      return { error: 'No file provided' }
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { error: 'File must be an image' }
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { error: 'File size must be less than 5MB' }
    }

    const imageUrl = await uploadImageToS3(file, session.user.id)
    console.log('Image uploaded to URL:', imageUrl)

    return { success: true, imageUrl }
  } catch (error) {
    // Return the actual error message if it's an Error instance
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload image'
    return { error: errorMessage }
  }
}


