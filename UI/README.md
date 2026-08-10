# UI — Frontend

The web application for the Student Clearance Management System. Built as a single-page application (SPA) in **React 19** with **TypeScript**, bundled by **Vite**.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | React 19 |
| Language | TypeScript |
| Build tool | Vite 8 |
| Routing | TanStack Router |
| Styling | Tailwind CSS v4 |
| UI primitives | Radix UI (headless) + custom components |
| Icons | lucide-react |
| Animation | framer-motion |
| HTTP | axios |
| Forms | react-hook-form |
| Package manager | npm |

## Routing

Routing is handled by **TanStack Router** using file-based routing:

- Route files live in `src/routes/` (`login.tsx`, `document-viewer.tsx`, `_authenticated/...`).
- The TanStack Router Vite plugin (see `vite.config.ts`) generates the route tree and code-splits every route automatically.
- Routes nested under `src/routes/_authenticated/` are protected by an auth layout that redirects unauthenticated users to `/login`.
- Each role has its own route group, e.g. `student.dashboard.tsx`, `academic-unit.document.tsx`, `superadmin.users.tsx`.

## Authentication

Auth is managed by a custom **`AuthContext`** (`src/contexts/auth-context.tsx`) rather than a library:

- **Login** — calls `POST /auth/login`, stores the returned JWT in `localStorage` (`auth_token`) and the user object in `auth_user`.
- **Hydration** — on app load, if a token exists, it fetches `GET /auth/me` to restore the session and refresh the stored user.
- **Logout** — clears the token and user from `localStorage`.
- **Request interceptor** (`src/utils/axios.ts`) — attaches `Authorization: Bearer <token>` to every request and sets JSON content type (skipped for `FormData` uploads).
- **Response interceptor** — on a `401`, clears auth and redirects to `/login`.

## Data layer

- A single axios client (`src/utils/axios.ts`) configured with the base URL from `VITE_API_URL`.
- Typed API modules in `src/lib/api/` — one per resource: `auth`, `users`, `reports`, `departments`, `audit-logs`, `activities`, `documents`, `clearance`, `metrics`.
- `src/lib/api/client.ts` provides `unwrap()` to normalize the API `{ status, data, meta }` envelope and `errorMessage()` for friendly error strings.
- `src/lib/api/mappers.ts` maps raw API types to the domain types the UI consumes.
- `src/hooks/use-async.ts` — a small hook wrapping the request/loading/error/refetch lifecycle used across pages.
- Document files are viewed via `assetUrl()` (`src/utils/axios.ts`), which resolves stored `/uploads/...` paths against the API origin.

## Design language

The UI uses a consistent design system:

- **Tailwind CSS v4** with custom design tokens defined in `src/globals.css` (brand colors, the `gradient-primary` treatment, dark/light variables).
- **Custom theme** — a `ThemeContext` (`src/contexts/theme-context.tsx`) toggles `dark`/`light` classes on the document root and persists the choice to `localStorage`.
- **Radix UI primitives** wrapped in `src/components/ui/` — `dialog`, `dropdown-menu`, `select`, `switch`, `tooltip`, `scroll-area`, `checkbox`, `avatar`, and more, styled with Tailwind.
- **Utility helpers** — `cn()` in `src/lib/utils.ts` combines `clsx` + `tailwind-merge`; `class-variance-authority` powers the `Button` variants (`gradient`, `destructive`, `outline`, …).
- **Motion** — `framer-motion` for entrance animations, table rows, and transitions.
- **Icons** — lucide-react.
- A dedicated **landing page** (`src/components/landing/`) with its own `landing.css` presents the product to visitors before login.

## Project structure

```
src/
├── components/
│   ├── ui/            # design-system primitives (button, card, dialog, …)
│   ├── layout/        # dashboard shell, sidebar, topbar, profile page
│   ├── dashboard/     # role dashboards, activity feed, metric cards
│   ├── unit/          # shared pages for academic/bursary/department units
│   ├── landing/       # public marketing/landing page sections
│   └── auth/          # login form
├── contexts/          # AuthContext, ThemeContext
├── hooks/             # use-async, use-sidebar
├── lib/
│   ├── api/           # typed API client modules, mappers, types
│   └── utils.ts       # cn() helper
├── routes/            # TanStack Router file-based routes
└── utils/             # axios client, assetUrl, auth token helpers
```

## Environment

`VITE_API_URL` — base URL of the API (defaults to `http://localhost:3300/api`).

```bash
cp .env.example .env
# .env
VITE_API_URL=http://localhost:3000/api
```

## Scripts

```bash
npm run dev       # start the Vite dev server
npm run build     # type-check (tsc -b) and build for production
npm run lint      # run oxlint
npm run preview   # preview the production build
```
