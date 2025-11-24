# StorySphere

A calm, private journaling platform designed for reflection, emotional well-being, and anonymous sharing. StorySphere strips away likes, comments, and follower counts so users can focus on writing meaningful stories without social pressure.

---

## ✨ Features

- **Authentication**: Email/password (NextAuth Credentials) + Google OAuth
- **Writing experience**: Minimal editor with tags, visibility controls, and optional image uploads
- **My Journal**: Personal timeline with search + tag filters
- **Community Feed**: Public (anonymous) stories shared by everyone
- **Story detail pages**: Clean reading experience with optional imagery
- **Server Actions**: Story creation, editing, deletion, and image uploads are handled via server actions
- **AWS S3 support**: Image uploads with optional CloudFront CDN
- **Safe defaults**: Private by default, explicit public sharing

---

## 🧱 Tech Stack

| Layer      | Technology |
| ---------- | ---------- |
| Framework  | Next.js 14 (App Router, Server Components) |
| Language   | TypeScript |
| Styling    | TailwindCSS (custom warm palette) |
| Auth       | NextAuth.js (Credentials + Google) |
| Database   | PostgreSQL (Prisma ORM) |
| Storage    | AWS S3 (+ CloudFront CDN) |
| Hosting    | Vercel (frontend + API) + Supabase/Neon/Railway for Postgres |

---

## 📁 Project Structure

```
storysphere/
├── app/
│   ├── (auth)/auth/...        # Sign in / Sign up / error
│   ├── actions/               # Server Actions (stories + auth)
│   ├── api/                   # NextAuth + Upload endpoints
│   ├── me/                    # Personal journal
│   ├── stories/               # Community feed
│   ├── story/[id]/            # Story detail page
│   ├── write/                 # Create/edit story pages
│   ├── layout.tsx             # Root layout + providers
│   └── page.tsx               # Landing page
├── components/                # UI components
├── lib/                       # Prisma client, NextAuth config, S3 helper
├── prisma/                    # Prisma schema
├── types/                     # NextAuth type augmentation
├── SETUP.md                   # Detailed setup instructions
├── ENV_SETUP.md               # Env variable walkthrough
├── TROUBLESHOOTING.md         # Common fixes
├── QUICK_FIX.md               # Short fix-it notes
└── check-env.js               # Script to verify env vars
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+
- PostgreSQL database (local, Supabase, Neon, Railway, etc.)
- AWS S3 bucket (optional but required for image uploads)
- Google OAuth credentials (optional, for Google login)

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy the example file and fill it in:
```bash
cp .env.example .env
```

**Important:** values must not be wrapped in quotes. Example:
```env
DATABASE_URL=postgresql://user:password@host:5432/db?schema=public
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
```

Use `ENV_SETUP.md` for a detailed walkthrough. After editing `.env`, restart the dev server.

Quick verification:
```bash
npm run check-env
```

### 4. Database
```bash
npx prisma generate
npx prisma db push
```

### 5. Development server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

---

## 🔐 Environment Variables

| Variable | Required | Description |
| -------- | -------- | ----------- |
| `DATABASE_URL` | ✅ | Connection string for PostgreSQL |
| `NEXTAUTH_URL` | ✅ | Base URL (http://localhost:3000 in dev) |
| `NEXTAUTH_SECRET` | ✅ | Random secret (use `openssl rand -base64 32`) |
| `GOOGLE_CLIENT_ID` | Optional | Enable Google login |
| `GOOGLE_CLIENT_SECRET` | Optional | Google login secret |
| `AWS_ACCESS_KEY_ID` | Optional | Enable S3 uploads |
| `AWS_SECRET_ACCESS_KEY` | Optional | S3 secret |
| `AWS_REGION` | Optional | AWS region (default `us-east-1`) |
| `AWS_S3_BUCKET_NAME` | Optional | Bucket for uploads |
| `AWS_CLOUDFRONT_URL` | Optional | CDN URL (fallbacks to S3 URL) |

More details in `ENV_SETUP.md`.

---

## 🧪 Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Prisma schema → database |
| `npm run db:generate` | Re-generate Prisma client |
| `npm run db:studio` | Launch Prisma Studio |
| `npm run check-env` | Print status of required env vars |

---

## 🌩️ Image Uploads
Image uploads require the AWS variables above. If they’re omitted, the UI gracefully disables uploading, allowing text-only stories.

**S3 Setup steps (summary):**
1. Create bucket (`story-sphere-*`)
2. Configure CORS (see `SETUP.md`)
3. Create IAM user with `s3:PutObject` / `s3:GetObject`
4. Optional: front with CloudFront for faster delivery

---

## 🔐 Authentication Notes

- Credentials provider uses Prisma to fetch users and bcrypt to validate passwords
- Google provider optional; enable by setting `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET`
- Middleware protects `/me` and `/write`
- All sensitive server logic runs on the Node runtime (`runtime = 'nodejs'`) to ensure Prisma works

---

## 🛠️ Troubleshooting

Common issues and fixes are documented:
- `TROUBLESHOOTING.md` – deep dive into env issues, Prisma errors, NextAuth quirks
- `FIX_ENV_ERROR.md` – “DATABASE_URL not found” quick fix
- `QUICK_FIX.md` – TL;DR version
- `check-env.js` – verify variables before starting the server

Remember: every time you change `.env`, restart the dev server (`Ctrl+C`, then `npm run dev`).

---

## 📦 Deployment Tips

1. Push code to GitHub, connect repo to Vercel
2. Set all environment variables in Vercel dashboard (same as `.env`)
3. Add production OAuth callback URL to Google console: `https://your-domain.vercel.app/api/auth/callback/google`
4. Point `NEXTAUTH_URL` to the deployed domain
5. Use a managed Postgres provider (Supabase/Neon/Railway)

---

## 📄 License

MIT – see [LICENSE](LICENSE) if provided. Feel free to adapt StorySphere for your own personal journaling or storytelling projects.






