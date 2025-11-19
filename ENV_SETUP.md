# Environment Variables Setup Guide

## Quick Start

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Fill in the required variables** (see below)

3. **Restart your development server**

## Required Variables

### 1. Database (REQUIRED)
```env
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
```

**How to get it:**
- **Supabase**: Go to Project Settings → Database → Connection String (use "URI" format)
- **Neon**: Go to Dashboard → Copy connection string
- **Railway**: Go to your PostgreSQL service → Connect → Copy connection string
- **Local PostgreSQL**: `postgresql://postgres:password@localhost:5432/storysphere?schema=public`

### 2. NextAuth URL (REQUIRED)
```env
NEXTAUTH_URL="http://localhost:3000"
```

- **Local development**: `http://localhost:3000`
- **Production**: Your production URL (e.g., `https://your-app.vercel.app`)

### 3. NextAuth Secret (REQUIRED)
```env
NEXTAUTH_SECRET="your-secret-key-here"
```

**How to generate:**
```bash
# On Mac/Linux:
openssl rand -base64 32

# On Windows (PowerShell):
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Or use online generator:
# https://generate-secret.vercel.app/32
```

## Optional Variables

### Google OAuth (Optional - for Google Sign In)

```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

**Setup Steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: "Web application"
6. Authorized redirect URIs:
   - Local: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.com/api/auth/callback/google`
7. Copy Client ID and Client Secret to `.env`

**Note:** If you don't set these, Google sign-in will be disabled (email/password will still work).

### AWS S3 (Optional - for Image Uploads)

```env
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET_NAME="your-bucket-name"
AWS_CLOUDFRONT_URL="https://your-cloudfront-domain.cloudfront.net"
```

**Setup Steps:**
1. **Create S3 Bucket:**
   - Go to AWS S3 Console
   - Create a new bucket
   - Enable public access (or configure bucket policy)
   - Copy bucket name to `AWS_S3_BUCKET_NAME`

2. **Create IAM User:**
   - Go to AWS IAM Console
   - Create a new user with programmatic access
   - Attach policy: `AmazonS3FullAccess` (or create custom policy)
   - Copy Access Key ID and Secret Access Key to `.env`

3. **Configure CORS** (on your S3 bucket):
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedOrigins": ["*"],
       "ExposeHeaders": []
     }
   ]
   ```

4. **CloudFront (Optional):**
   - Create CloudFront distribution pointing to your S3 bucket
   - Copy distribution URL to `AWS_CLOUDFRONT_URL`
   - If not set, images will use direct S3 URLs

**Note:** If you don't set these, image uploads will be disabled (text-only stories will still work).

## Example .env File

```env
# Required
DATABASE_URL="postgresql://user:password@db.example.com:5432/storysphere?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="abc123xyz456..."

# Optional - Google OAuth
GOOGLE_CLIENT_ID="123456789-abc.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abc123xyz"

# Optional - AWS S3
AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
AWS_REGION="us-east-1"
AWS_S3_BUCKET_NAME="my-storysphere-images"
AWS_CLOUDFRONT_URL="https://d1234567890.cloudfront.net"
```

## Verification

After setting up your `.env` file:

1. **Check database connection:**
   ```bash
   npx prisma db push
   ```

2. **Start the dev server:**
   ```bash
   npm run dev
   ```

3. **Test authentication:**
   - Try signing up with email/password
   - If Google OAuth is configured, try Google sign-in
   - If S3 is configured, try uploading an image when writing a story

## Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Check if your database allows connections from your IP
- For cloud providers, check firewall/network settings

### NextAuth Issues
- Ensure `NEXTAUTH_SECRET` is set and not empty
- Verify `NEXTAUTH_URL` matches your actual URL
- Check browser console for errors

### S3 Upload Issues
- Verify AWS credentials are correct
- Check S3 bucket permissions
- Ensure CORS is configured correctly
- Verify bucket name and region match

### Google OAuth Issues
- Verify redirect URI matches exactly (including http/https)
- Check that Google+ API is enabled
- Ensure client ID and secret are correct





