/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'your-s3-bucket.s3.amazonaws.com',
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





