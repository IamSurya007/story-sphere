'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

export function Navigation() {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  if (status === 'loading') {
    return (
      <nav className="border-b border-primary-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-serif text-primary-800">
              StorySphere
            </Link>
            <div className="h-6 w-20 bg-primary-100 rounded animate-pulse" />
          </div>
        </div>
      </nav>
    )
  }

  if (!session) {
    return (
      <nav className="border-b border-primary-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-serif text-primary-800">
              StorySphere
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/auth/signin"
                className="text-primary-700 hover:text-primary-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors font-medium shadow-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="border-b border-primary-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif text-primary-800">
            StorySphere
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/write"
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive('/write')
                  ? 'bg-primary-100 text-primary-900'
                  : 'text-primary-700 hover:text-primary-900'
              }`}
            >
              Write
            </Link>
            <Link
              href="/me"
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive('/me')
                  ? 'bg-primary-100 text-primary-900'
                  : 'text-primary-700 hover:text-primary-900'
              }`}
            >
              My Journal
            </Link>
            <Link
              href="/stories"
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive('/stories')
                  ? 'bg-primary-100 text-primary-900'
                  : 'text-primary-700 hover:text-primary-900'
              }`}
            >
              Community
            </Link>
            <button
              onClick={() => signOut()}
              className="text-primary-600 hover:text-primary-900 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

