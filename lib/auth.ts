import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './db'
import bcrypt from 'bcryptjs' 

// Check if Google OAuth is properly configured
export const isGoogleOAuthConfigured = 
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CLIENT_ID !== '' &&
  process.env.GOOGLE_CLIENT_SECRET !== '' &&
  process.env.GOOGLE_CLIENT_SECRET.length > 10 // Basic validation - real secrets are much longer



// Build providers array conditionally
const credentialsProvider = CredentialsProvider({
  name: 'credentials',
  credentials: {
    email: { label: 'Email', type: 'email' },
    password: { label: 'Password', type: 'password' },
  },
  async authorize(credentials) {
    try {
      alert('Authorize called'); // Debugging line
      console.log('[Auth] Authorizing user with credentials:', credentials)
      if (!credentials?.email || !credentials?.password) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[Auth] Missing credentials')
        }
        return null
      }

      const user = await prisma.user.findUnique({
        where: { email: credentials.email },
      })

      if (!user) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[Auth] User not found:', credentials.email)
        }
        return null
      }

      if (!user.password) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[Auth] User has no password (OAuth user):', credentials.email)
        }
        return null
      }

      const isPasswordValid = await bcrypt.compare(
        credentials.password,
        user.password
      )

      if (!isPasswordValid) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[Auth] Invalid password for user:', credentials.email)
        }
        return null
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      }
    } catch (error) {
      console.error('[Auth] Authorization error:', error);
      return null
    }
  },
})

const providers =  [
      credentialsProvider,
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ]

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}


