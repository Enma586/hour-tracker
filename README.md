# Tracker

Personal productivity and finance tracking dashboard. Log work hours, track expenses, set savings goals, and monitor weekly performance against targets.

## Features

- **Time Logging** — Record hours worked per day with automatic date association. Entries are overwritten per day, not accumulated.
- **Weekly Overview** — View total hours logged for the current week (Monday to Sunday) with progress toward a configurable weekly goal.
- **Expense Tracking** — Log expenses by name, amount, and category. Each expense deducts from the accumulated balance.
- **Savings Goals** — Create goals with categories, target amounts, and optional target dates. Add funds to goals, which also deduct from the balance.
- **Auto Payout** — Every Friday at 6:00 PM, the previous week's earnings are automatically added to the total balance. The balance is editable only during the Friday 6:00 PM to midnight window.
- **Activity Calendar** — Visual month grid showing logged hours per day. Click any day to select it for data entry or goal target dates.
- **Custom Date Selection** — A compact inline calendar component is used for picking target dates, consistent with the dashboard's visual style.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 6 + @vitejs/plugin-react + @tailwindcss/vite |
| Styling | Tailwind CSS v4 with custom glassmorphic design system |
| Routing | react-router-dom v7 (lazy routes) |
| State / Server | @tanstack/react-query v5 |
| Forms | react-hook-form + zod |
| Icons | lucide-react |
| Dates | date-fns |
| Database | Firebase Firestore |
| Utilities | clsx + tailwind-merge |

## Getting Started

### Prerequisites

- Node.js 20+
- A Firebase project with Firestore enabled

### Environment Variables

Copy `.env` to `.env.local` and fill in your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_APP_NAME=Tracker
VITE_DEFAULT_HOURLY_RATE=0
```

### Installation

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
npm run preview
```

### Firestore Rules

For development, set Firestore security rules to allow read/write:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## Project Structure

```
src/
├── main.tsx                    # Entry point
├── App.tsx                     # Providers and routing
├── index.css                   # Tailwind v4 + custom design tokens
├── lib/
│   ├── config.ts               # Environment variable validation (zod)
│   ├── firebase.ts             # Firebase initialization
│   ├── utils.ts                # cn() helper + formatCurrency
│   └── query-client.ts         # TanStack Query configuration
├── features/tracker/
│   ├── types/                  # Domain types and DTOs
│   ├── services/               # Firestore CRUD operations
│   ├── hooks/                  # React Query hooks per resource
│   ├── components/             # UI components (cards, forms, calendar)
│   └── pages/                  # Route-level page component
├── components/
│   ├── ui/                     # Base input/button components
│   └── feedback/               # Loading, error, empty states
└── routes/                     # Router configuration
```

## Deployment

The project is pre-configured for both Cloudflare Pages and Vercel.

### Cloudflare Pages

- Framework preset: Vite
- Build command: `npm run build`
- Build output: `dist`

### Vercel

- Framework preset: Vite
- Build command: `npm run build`
- Output: `dist`

Set the required `VITE_*` environment variables in the platform dashboard.
