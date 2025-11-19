import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Check if AWS is configured
function isS3Configured(): boolean {
  return !!(
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_S3_BUCKET_NAME
  )
}

// Lazy initialization of S3 client
function getS3Client(): S3Client {
  if (!isS3Configured()) {
    throw new Error(
      'AWS S3 is not configured. Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_S3_BUCKET_NAME in your .env file.'
    )
  }

  return new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  })
}

/**
 * Upload an image file to S3 and return the CloudFront URL
 * Throws an error if AWS S3 is not configured
 */
export async function uploadImageToS3(
  file: File,
  userId: string
): Promise<string> {
  if (!isS3Configured()) {
    throw new Error(
      'Image upload is not available. AWS S3 is not configured. Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_S3_BUCKET_NAME in your .env file.'
    )
  }
  console.log('Uploading image to S3 for user:', userId)

  const s3Client = getS3Client()
  const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!

  const fileExtension = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`
  
  const buffer = Buffer.from(await file.arrayBuffer())
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: file.type,
  })

  await s3Client.send(command);

  if (process.env.AWS_CLOUDFRONT_URL) {
    const cloudFrontUrl = `${process.env.AWS_CLOUDFRONT_URL}/${fileName}`
    return cloudFrontUrl
  }
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${fileName}`
}

/**
 * Generate a presigned URL for direct client-side uploads (optional)
 */
export async function getPresignedUploadUrl(
  fileName: string,
  contentType: string,
  userId: string
): Promise<string> {
  if (!isS3Configured()) {
    throw new Error('AWS S3 is not configured')
  }

  const s3Client = getS3Client()
  const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!
  const key = `${userId}/${Date.now()}-${fileName}`
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
    ACL: 'public-read',
  })

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
  return url
}

/**
 * Check if S3 image upload is available
 */
export function isImageUploadAvailable(): boolean {
  return isS3Configured()
}


