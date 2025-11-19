# StorySphere

A private journaling and storytelling platform focused on reflection, emotional well-being, and self-expression.

## Features

- 🔐 Authentication with Email/Password or Google
- ✍️ Write and manage your stories
- 🔒 Private stories (only you can see)
- 🌍 Public anonymous stories (shared in community feed)
- 🏷️ Tag and search stories
- 📸 Image uploads via AWS S3
- 🎨 Minimal, calm, distraction-free UI

## Tech Stack

- **Frontend**: Next.js 14+ App Router, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes & Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js
- **Storage**: AWS S3 + CloudFront
- **Deployment**: Vercel + Supabase/Neon/Railway

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Fill in your database URL, NextAuth secret, and AWS credentials.

3. **Set up the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## Environment Variables

See `.env.example` for all required environment variables.

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages
│   ├── api/               # API routes
│   ├── write/             # Story creation page
│   ├── me/                # Personal journal
│   ├── stories/           # Public feed
│   └── story/[id]/        # Story detail
├── components/            # React components
├── lib/                   # Utilities
│   ├── auth.ts           # NextAuth config
│   ├── db.ts             # Prisma client
│   └── s3.ts             # AWS S3 utilities
└── prisma/               # Database schema
```

## License

MIT





