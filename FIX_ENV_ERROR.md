# 🔧 Fix: DATABASE_URL Not Found Error

## ✅ Your .env file exists! Here's how to fix it:

### Step 1: Check Your .env File Format

Open your `.env` file and make sure it looks like this:

```env
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
```

**Common mistakes to avoid:**
- ❌ `DATABASE_URL = "postgresql://..."` (spaces around =)
- ❌ `DATABASE_URL="postgresql://..."` (quotes)
- ❌ `database_url=postgresql://...` (wrong case)
- ✅ `DATABASE_URL=postgresql://...` (correct!)

### Step 2: Verify Your .env File

Run this command to check if your variables are set correctly:

```bash
npm run check-env
```

This will show you which variables are set and which are missing.

### Step 3: RESTART Your Dev Server ⚠️

**THIS IS THE MOST IMPORTANT STEP!**

Next.js only loads environment variables when it starts. You MUST restart:

1. **Stop** your dev server (press `Ctrl+C`)
2. **Start** it again:
   ```bash
   npm run dev
   ```

### Step 4: Test the Connection

After restarting, test if Prisma can connect:

```bash
npx prisma db push
```

If this works, your DATABASE_URL is correctly configured!

## Still Not Working?

### Check 1: File Location
Make sure `.env` is in the root directory:
```
C:\Surya\Story Sphere\.env  ← Should be here
```

### Check 2: File Name
Must be exactly `.env` (not `.env.txt` or `.env.local`)

### Check 3: No Hidden Characters
Try typing the DATABASE_URL manually instead of copy-pasting.

### Check 4: Restart Required
**Always restart the dev server after changing .env!**

## Quick Test

Run this to see if your variable is loaded:

```powershell
# In PowerShell
$env:DATABASE_URL
```

If it shows your database URL, it's loaded. If it's empty, restart your server.

## Example .env File

Here's a complete example (replace with your actual values):

```env
# Database Connection (REQUIRED)
DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/storysphere?schema=public

# NextAuth (REQUIRED)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=abc123xyz456def789ghi012jkl345mno678pqr901stu234vwx567yz

# Google OAuth (OPTIONAL - leave empty if not using)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# AWS S3 (OPTIONAL - leave empty if not using)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=
AWS_CLOUDFRONT_URL=
```

## Summary

1. ✅ Check `.env` file format (no quotes, no spaces around `=`)
2. ✅ Run `npm run check-env` to verify
3. ✅ **RESTART your dev server** (most important!)
4. ✅ Test with `npx prisma db push`

The error should be fixed after restarting! 🎉





