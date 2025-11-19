'use server'

import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function signUp(formData: FormData) {
  try {
    const rawData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    // Validate input
    const validatedData = signUpSchema.parse(rawData)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return { error: 'User with this email already exists' }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    // Create user
    await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      },
    })

    return { success: true }
  } catch (error) {
    // Log error for debugging
    console.error('SignUp Error:', error)
    
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    
    // Check for database errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2002') {
        return { error: 'User with this email already exists' }
      }
    }
    
    // Return more descriptive error message
    const errorMessage = error instanceof Error ? error.message : 'Failed to create account'
    return { error: errorMessage }
  }
}


