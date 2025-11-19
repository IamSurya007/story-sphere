# StorySphere Setup Guide

This guide will help you set up StorySphere from scratch.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Supabase, Neon, or Railway)
- AWS account with S3 bucket (optional, for image uploads)
- Google OAuth credentials (optional, for Google sign-in)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Fill in the following variables:

### Required Variables

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
```

### Optional Variables

```env
# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AWS S3 (optional, for image uploads)
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET_NAME="your-bucket-name"
AWS_CLOUDFRONT_URL="https://your-cloudfront-domain.cloudfront.net"
```

### Generate NextAuth Secret

```bash
openssl rand -base64 32
```

## Step 3: Set Up Database

1. **Create a PostgreSQL database** on Supabase, Neon, or Railway
2. **Copy the connection string** to your `.env` file
3. **Push the schema** to your database:

```bash
npx prisma generate
npx prisma db push
```

## Step 4: Set Up AWS S3 (Optional)

If you want to enable image uploads:

1. **Create an S3 bucket** in AWS
2. **Configure CORS** on your bucket:
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
3. **Create an IAM user** with S3 permissions
4. **Add credentials** to your `.env` file
5. **(Optional) Set up CloudFront** for CDN

## Step 5: Set Up Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env`

## Step 6: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 7: Deploy to Vercel

1. **Push your code** to GitHub
2. **Import project** in Vercel
3. **Add environment variables** in Vercel dashboard
4. **Deploy**

### Vercel Environment Variables

Make sure to add all your `.env` variables in the Vercel dashboard:
- `DATABASE_URL`
- `NEXTAUTH_URL` (your production URL)
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID` (if using Google OAuth)
- `GOOGLE_CLIENT_SECRET` (if using Google OAuth)
- AWS credentials (if using S3)

### Update Google OAuth Redirect URI

Add your production URL to Google OAuth:
`https://your-domain.vercel.app/api/auth/callback/google`

## Troubleshooting

### Database Connection Issues

- Verify your `DATABASE_URL` is correct
- Check if your database allows connections from your IP
- For Supabase/Neon, ensure connection pooling is configured correctly

### NextAuth Issues

- Make sure `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your deployment URL
- Check that callback URLs are correctly configured

### Image Upload Issues

- Verify AWS credentials are correct
- Check S3 bucket permissions
- Ensure CORS is configured on your bucket
- Verify bucket name and region are correct

## Project Structure

```
storysphere/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (signin, signup)
│   ├── api/               # API routes
│   ├── me/                # Personal journal
│   ├── stories/           # Public feed
│   ├── story/[id]/        # Story detail
│   └── write/             # Story creation/edit
├── components/            # React components
├── lib/                   # Utilities
│   ├── auth.ts           # NextAuth config
│   ├── db.ts             # Prisma client
│   └── s3.ts             # AWS S3 utilities
├── prisma/               # Database schema
└── types/                # TypeScript types
```

## Next Steps

- Customize the design in `tailwind.config.ts`
- Add more features as needed
- Set up monitoring and analytics
- Configure email notifications (optional)





