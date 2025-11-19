# Troubleshooting: DATABASE_URL Not Found

## Quick Fixes

### 1. Verify .env File Exists and Location

Make sure you have a `.env` file in the **root directory** of your project (same level as `package.json`):

```
Story Sphere/
├── .env          ← Should be here!
├── package.json
├── prisma/
└── app/
```

### 2. Check .env File Format

Your `.env` file should look like this (no quotes around the URL, no spaces around `=`):

```env
DATABASE_URL=postgresql://user:password@host:port/database?schema=public
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
```

**Common mistakes:**
- ❌ `DATABASE_URL = "postgresql://..."` (spaces around =)
- ❌ `DATABASE_URL="postgresql://..."` (quotes)
- ✅ `DATABASE_URL=postgresql://...` (correct)

### 3. Restart Your Development Server

**IMPORTANT:** After creating or modifying `.env`, you MUST restart your dev server:

1. Stop the server (Ctrl+C)
2. Start it again: `npm run dev`

Next.js only loads environment variables when it starts!

### 4. Verify Variable Name

Make sure it's exactly `DATABASE_URL` (case-sensitive, no typos):

```env
DATABASE_URL=postgresql://...
```

Not:
- `DATABASE_URI`
- `DB_URL`
- `database_url`

### 5. Check for .env.local

If you have both `.env` and `.env.local`, `.env.local` takes precedence. Make sure your variable is in the right file.

## Step-by-Step Fix

1. **Create/Edit .env file in root:**
   ```bash
   # In your project root
   touch .env
   # or just create it manually
   ```

2. **Add your variables (no quotes, no spaces):**
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/dbname?schema=public
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
   ```

3. **Save the file**

4. **Stop your dev server** (if running)

5. **Restart:**
   ```bash
   npm run dev
   ```

6. **Test Prisma connection:**
   ```bash
   npx prisma db push
   ```

## Verify It's Working

Run this in your terminal to check if the variable is loaded:

```bash
# Windows PowerShell
$env:DATABASE_URL

# Windows CMD
echo %DATABASE_URL%

# Mac/Linux
echo $DATABASE_URL
```

If it's empty, the variable isn't loaded. Make sure:
- File is named `.env` (not `.env.txt` or `.env.example`)
- File is in the project root
- Server was restarted after creating/modifying the file

## Still Not Working?

1. **Check file encoding:** Make sure `.env` is saved as UTF-8 (not UTF-16 or other)

2. **Check for hidden characters:** Sometimes copy-paste adds hidden characters. Try typing it manually.

3. **Verify Prisma can see it:**
   ```bash
   npx prisma db push
   ```
   This should work if the variable is set correctly.

4. **Check Next.js logs:** Look at the terminal where `npm run dev` is running for any env-related errors.

## Example .env File

Here's a complete example:

```env
# Database (REQUIRED)
DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/storysphere?schema=public

# NextAuth (REQUIRED)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=abc123xyz456def789ghi012jkl345mno678pqr901stu234vwx567yz

# Google OAuth (OPTIONAL)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# AWS S3 (OPTIONAL)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=
AWS_CLOUDFRONT_URL=
```





