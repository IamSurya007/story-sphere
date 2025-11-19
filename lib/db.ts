import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}



// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is not set. Please create a .env file in the root directory with:\n' +
    'DATABASE_URL=postgresql://user:password@host:5432/database?schema=public\n\n' +
    'After creating/updating .env, restart your dev server with: npm run dev'
  )
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

