# Task Tracker

A task management app where users can create, edit, and delete tasks with due dates and status tracking. Authenticated via Google sign-in — all tasks are private and scoped to the logged-in user. Built with Next.js, Tailwind CSS, Firebase Auth, and Firestore.

**Live app:** https://task-tracker-297868129457.us-central1.run.app

---

## Prerequisites

- Node.js 20+
- A Firebase project with:
  - Authentication → Google sign-in enabled
  - Firestore database created
- A Google Cloud project (same as Firebase) for deployment

---

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy the example env file and fill in your values
cp .env.local.example .env.local

# 3. Start the dev server
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Firebase project config — found in Firebase Console → Project Settings → Your Apps
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Optional: Firestore database name (defaults to "(default)")
NEXT_PUBLIC_FIRESTORE_DATABASE=
```

To get these values: Firebase Console → Project Settings → General → Your apps → Web app → SDK setup and configuration.

---

## Running Tests

```bash
# E2E tests (requires a running app — defaults to the live URL)
npx playwright test

# Run against local dev server
BASE_URL=http://localhost:3000 npx playwright test

# Smoke tests only
BASE_URL=http://localhost:3000 npx playwright test e2e/smoke.spec.ts
```

Tests require Playwright browsers installed:

```bash
npx playwright install chromium
```

---

## Firestore Security Rules

Deploy the included rules before going to production:

```bash
firebase deploy --only firestore:rules
```
