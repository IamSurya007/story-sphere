import Link from 'next/link'

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const errorMessage =
    searchParams.error === 'CredentialsSignin'
      ? 'Invalid email or password'
      : searchParams.error === 'OAuthSignin'
      ? 'OAuth sign-in error'
      : searchParams.error === 'OAuthCallback'
      ? 'OAuth callback error'
      : searchParams.error === 'OAuthCreateAccount'
      ? 'Could not create OAuth account'
      : searchParams.error === 'EmailCreateAccount'
      ? 'Could not create email account'
      : searchParams.error === 'Callback'
      ? 'Callback error'
      : searchParams.error === 'OAuthAccountNotLinked'
      ? 'Email already in use with a different provider'
      : searchParams.error === 'EmailSignin'
      ? 'Check your email for the sign-in link'
      : searchParams.error === 'CredentialsSignin'
      ? 'Sign in failed. Check your credentials.'
      : searchParams.error === 'SessionRequired'
      ? 'Please sign in to access this page'
      : 'An error occurred during authentication'

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-serif text-primary-900">Authentication Error</h1>
        <p className="text-primary-600">{errorMessage}</p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/signin"
            className="px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors font-medium shadow-sm"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="px-6 py-3 border border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}

