# StackIt - Minimal Q&A Forum Platform

**Team:** Hustlers  
**Problem Statement:** StackIt – A Minimal Q&A Forum Platform (Sr. No. 2)

## Overview

StackIt is a modern, minimal question-and-answer platform built with Next.js 15, PostgreSQL, and Cloudinary. It provides a clean, intuitive interface for users to ask questions, provide answers, and engage in collaborative learning.

## Features

- 🔐 **Authentication System** - Secure user registration and login with NextAuth.js
- 📝 **Rich Text Editor** - TipTap-powered editor with image upload support
- 🗳️ **Voting System** - Upvote/downvote questions and answers
- 🏷️ **Tag Management** - Organize questions with relevant tags
- 📱 **Responsive Design** - Mobile-first design with Tailwind CSS
- 🔔 **Notifications** - Real-time notification system
- ☁️ **Cloud Storage** - Image uploads via Cloudinary
- 🐘 **PostgreSQL Database** - Robust data storage with Prisma ORM

## Tech Stack

- **Frontend:** Next.js 15.3.5, React 19, Tailwind CSS v4
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL (Render)
- **ORM:** Prisma
- **Authentication:** NextAuth.js v4
- **File Storage:** Cloudinary
- **Editor:** TipTap
- **Styling:** Tailwind CSS v4

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Cloudinary account

### Installation

1. Clone the repository
```bash
git clone https://github.com/Virajkoli/StackIt_-Team-Hustlers-_Odoo.git
cd StackIt_-Team-Hustlers-_Odoo/stackit
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create `.env.local` file with:
```env
# Database
DATABASE_URL="your_postgresql_connection_string"

# Cloudinary
CLOUD_NAME=your_cloud_name
API_KEY=your_api_key
API_SECRET=your_api_secret

# NextAuth
NEXTAUTH_SECRET="your_secret_key"
NEXTAUTH_URL="http://localhost:3000"
```

4. Set up database
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

5. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Schema

The application uses a PostgreSQL database with the following main entities:
- Users (authentication and profiles)
- Questions (with rich text content)
- Answers (with voting and acceptance)
- Tags (for categorization)
- Votes (upvote/downvote system)
- Notifications (user engagement)

## Project Structure

```
stackit/
├── app/                    # Next.js 13+ app directory
│   ├── api/               # API routes
│   ├── ask/               # Question creation page
│   ├── login/             # Authentication pages
│   ├── question/[id]/     # Dynamic question pages
│   └── register/          # User registration
├── components/            # Reusable React components
├── lib/                   # Utility functions and configurations
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:seed` - Seed database with sample data

## Contributing

This project was developed as part of a team competition. For contributions, please create a pull request with detailed description of changes.

## Team Hustlers

- **Repository:** [StackIt_-Team-Hustlers-_Odoo](https://github.com/Virajkoli/StackIt_-Team-Hustlers-_Odoo)
- **Problem Statement:** StackIt – A Minimal Q&A Forum Platform (Sr. No. 2) 
