/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'story-spehere-uploads.s3.us-east-1.amazonaws.com',
      'your-cloudfront-domain.cloudfront.net',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudfront.net',
      },
    ],
  },
}

module.exports = nextConfig





