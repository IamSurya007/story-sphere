# Quick Fix: DATABASE_URL Error

## The Problem
Next.js can't find your `DATABASE_URL` environment variable.

## Solution (3 Steps)

### Step 1: Create .env file in project root

Create a file named `.env` (not `.env.txt` or `.env.example`) in the root of your project:

**Location:** `C:\Surya\Story Sphere\.env`

### Step 2: Add this content (replace with your actual database URL):

```env
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here-generate-with-openssl-rand-base64-32
```

**Important:**
- No quotes around the URL
- No spaces around the `=` sign
- Replace `user`, `password`, `host`, `database` with your actual values

**Example:**
```env
DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/storysphere?schema=public
```

### Step 3: Restart your dev server

1. **Stop** the server (press `Ctrl+C` in the terminal)
2. **Start** it again:
   ```bash
   npm run dev
   ```

**⚠️ CRITICAL:** Next.js only loads environment variables when it starts. You MUST restart after creating/modifying `.env`!

## Verify It Works

After restarting, try:
```bash
npx prisma db push
```

If this works, your DATABASE_URL is correctly set!

## Still Not Working?

1. **Check file name:** Must be exactly `.env` (not `.env.txt`)
2. **Check location:** Must be in root directory (same folder as `package.json`)
3. **Check format:** No quotes, no spaces around `=`
4. **Restart server:** Always restart after changing `.env`

## Get Your Database URL

- **Supabase:** Project Settings → Database → Connection String
- **Neon:** Dashboard → Copy connection string  
- **Railway:** PostgreSQL service → Connect → Copy connection string
- **Local:** `postgresql://postgres:password@localhost:5432/storysphere?schema=public`





