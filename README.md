# GoTogether - Full-Stack Social Media App

GoTogether is a full-stack social media platform inspired by Twitter and Facebook, built using cutting-edge technologies like Next.js 15, Lucia for authentication, Prisma for database management, and more. This app includes features such as infinite scrolling feeds, real-time direct messaging, likes, comments, and notifications.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [Additional Resources](#additional-resources)

## Features

- **Next.js 15**: Server actions and server components for modern React development.
- **TanStack React Query**: Efficient data fetching and state management.
- **Optimistic Updates**: Faster user experience with instant feedback.
- **Infinite Scrolling**: Smooth content loading with infinite feeds.
- **File Uploads**: Drag & drop and copy-paste support for uploading files using UploadThing.
- **Like and Follow Systems**: Engage users with likes, follows, and a robust notification system.
- **Direct Messaging**: Real-time direct messages powered by Stream Chat.
- **Bookmarks**: Save favorite posts for later.
- **Authentication**: Secure login with Lucia, supporting both username/password and Google OAuth2.
- **Postgres DB with Prisma**: Scalable and efficient database management with Prisma ORM.
- **Hashtags & Mentions**: Enhance user interaction with hashtags and mentions.
- **Full-text Search**: Quickly find content across the platform.
- **Mobile-Responsive Layout**: Optimized for all devices with Tailwind CSS and Shadcn UI components.
- **Dark & Light Themes**: User preference for dark, light, or system theme.
- **Real-time Form Validation**: Smooth user experience with React Hook Form and Zod validation.
- **Rich Text Editor**: Create posts using the TipTap editor.
- **Vercel Deployment**: Easy deployment and cron jobs for orphaned uploads.

## Technologies Used

- **Framework**: [Next.js 15](https://nextjs.org/)
- **UI Components**: [Shadcn UI](https://shadcn.dev/) and Tailwind CSS
- **State Management**: [TanStack React Query](https://tanstack.com/query/latest)
- **Authentication**: [Lucia](https://lucia.dev/) with Prisma adapter
- **Database**: [Postgres](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **File Uploads**: [UploadThing](https://uploadthing.com/)
- **Direct Messaging**: [Stream Chat](https://getstream.io/)
- **Theming**: [Next Themes](https://github.com/pacocoursey/next-themes)
- **Real-Time Validation**: [React Hook Form](https://react-hook-form.com/) and [Zod](https://zod.dev/)
- **Rich Text Editor**: [TipTap](https://tiptap.dev/)
- **Deployment**: [Vercel](https://vercel.com/)
- **Cron Jobs**: Vercel cron

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js 18.x or later
- NPM 9.x or later
- PostgreSQL 14.x or later

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/gotogether.git
   cd gotogether
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

### Database Setup

1. **Install Prisma CLI:**

   ```bash
   npm install prisma --save-dev
   ```

2. **Set up your environment variables:**

   - This project uses environment variables for configuration. A template file `.env.example` is provided in the root directory.
   - Copy this file to a new file named `.env`:
     ```bash
     cp .env.example .env
     ```
   - **Important**: Open the `.env` file and fill in the required values for your local development environment. This includes:
     - `DATABASE_URL`: Your PostgreSQL connection string. For local development, it might look like `postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/gotogether?schema=public`. If using Docker, the hostname might be `db` (e.g., `postgresql://user:password@db:5432/gotogether`).
     - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: Your Google OAuth credentials.
     - `UPLOADTHING_SECRET` and `NEXT_PUBLIC_UPLOADTHING_APP_ID`: Your UploadThing credentials.
     - URLs for backend services (`NEXT_PUBLIC_BACKEND_URL`, `NEXT_PUBLIC_GO_BACKEND_URL`) if they differ from the defaults.
     - Keycloak URLs if you are using a custom Keycloak instance.
   - The `.env` file is already listed in `.gitignore` and should not be committed to your repository.

3. **Run Prisma migrations:**

   ```bash
   npx prisma migrate dev --name init
   ```

4. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

### Running the Application

1. **Start the development server:**

   ```bash
   npm run dev
   ```

2. **Open your browser:**
   Navigate to `http://localhost:3000`.

## Deployment

Deploy your application on Vercel:

1. **Sign up on [Vercel](https://vercel.com/).**
2. **Link your GitHub repository to Vercel.**
3. **Set up environment variables in Vercel for your database and other settings.**
4. **Deploy the app.**

For setting up a cron job on Vercel to handle tasks like deleting orphaned uploads:

- Follow the [Vercel cron job documentation](https://vercel.com/docs/cron-jobs).

## Additional Resources

- [Lucia Documentation](https://lucia.dev/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [TanStack React Query Documentation](https://tanstack.com/query/latest/docs/react)
- [Stream Chat Documentation](https://getstream.io/docs/chat/)
- [Next.js Documentation](https://nextjs.org/docs)
