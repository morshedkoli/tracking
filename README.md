# Finance Tracker

A modern financial tracking application built with Next.js, TypeScript, and Prisma.

## Features

- 💰 Track income and expenses
- 📊 Financial overview dashboard
- 🔄 Manage receivables and payables
- 🔒 Secure authentication
- 📱 Responsive design

## Tech Stack

- **Frontend:** Next.js, TypeScript, TailwindCSS
- **Backend:** Next.js API Routes
- **Database:** MongoDB with Prisma ORM
- **Authentication:** NextAuth.js

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/finance-tracker.git
cd finance-tracker
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```
Fill in your environment variables in the `.env` file

4. Generate Prisma client
```bash
npx prisma generate
```

5. Run the development server
```bash
npm run dev
```

## Deployment on Vercel

1. Create a Vercel account if you haven't already
2. Install Vercel CLI: `npm i -g vercel`
3. Configure your environment variables in Vercel:
   - Go to your project settings
   - Add the following environment variables:
     - `DATABASE_URL`
     - `JWT_SECRET`
     - `NEXTAUTH_SECRET`
     - `NEXTAUTH_URL`
4. Deploy using Vercel CLI:
```bash
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Update documentation when adding new features
- Add appropriate error handling

## License

MIT