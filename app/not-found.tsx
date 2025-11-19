import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-serif text-primary-900 mb-4">404</h1>
      <p className="text-xl text-primary-600 mb-8">
        The page you're looking for doesn't exist.
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors font-medium shadow-sm"
      >
        Go Home
      </Link>
    </div>
  )
}

