Study Loop - A Learning & Knowledge Sharing Platform
=== 

#### Study Loop is an open knowledge-sharing platform designed for learners to share, bookmark, and review educational resources while engaging in discussions. Built with Next.js 15, React 19, TypeScript, TailwindCSS, and integrated with Auth.js for OAuth & Credentials authentication.
https://study-loop.vercel.app/

## Features
🎯 Learning Resource Sharing

    Users can post educational resources (articles, videos, books, etc.).
    Categorization allow for easy searching.

🔍 Resource Search & Bookmarking

    Quick search by entering keywords.
    Bookmark favorite learning resources for later access.

💬 Discussion & Ratings

    Comment on learning resources and exchange knowledge.
    Rate resources to help others find quality content.

🔑 User Authentication

    Supports Google & GitHub OAuth login.
    Also supports Credentials (Email/Password) authentication.
    Uses Auth.js with JWT for authentication.

## Tech Stack
| Next.js 15 | Framework with App Router for SSR & API handling |
| :-- | :-- |
| React 19 | UI architecture |
| TypeScript  | Static typing for better reliability |
| TailwindCSS | Utility-first CSS framework |
| Auth.js | Authentication with OAuth & Credentials |
| Prisma ORM | Database connection with MongoDB |
| MongoDB | NoSQL database for users, posts, comments, etc. |
| Zod | Schema validation for forms |
| React Hook Form | Form management with improved performance |
| ShadCN UI | Modern UI components |

## UI/UX Design

* Fully responsive (Mobile & Desktop)
* Dark mode support
* Clean & modern UI with ShadCN UI components

## Getting Started
    DATABASE_URL=mongodb+srv://your-mongo-url
    AUTH_SECRET=your-auth-secret
    AUTH_GITHUB_ID=your-github-client-id
    AUTH_GITHUB_SECRET=your-github-client-secret
    AUTH_GOOGLE_ID=your-google-client-id
    AUTH_GOOGLE_SECRET=your-google-client-secret
    
### 👤 Demo Account

To test **Study Loop** without signing up,  use this demo account:

- **Email**: `demo@example.com`
- **Password**: `demopassword`



