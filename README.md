# Student Clearance Management System

## Architecture

The project is split into two applications that talk to each other over a REST API.

```
                     ┌────────────────────────────────────────────┐
                     │                 Browser                     │
                     │         UI/  (React web application)        │
                     └────────────────────┬───────────────────────┘
                                          │  HTTPS (JSON + JWT)
                     ┌────────────────────▼───────────────────────┐
                     │          api/  (REST API - Express)         │
                     │                                            │
                     │   Authentication (login / JWT tokens)      │
                     │   Documents, Clearance, Reports, Users      │
                     │   Activity feed + audit logs                │
                     │   Rate limiting + error handling            │
                     └────────────────────┬───────────────────────┘
                                          │  SQL
                     ┌────────────────────▼───────────────────────┐
                     │        Database (SQLite via Prisma)         │
                     └────────────────────────────────────────────┘
```

- **Frontend (`UI/`)** — the web interface users see. A React single-page application.
- **Backend (`api/`)** — the API that stores data and enforces rules. It handles login, documents, clearance, users, reports, activity, and auditing.
- **Database** — all data lives in a SQLite database, managed with the Prisma toolkit.
- **Authentication** — users log in with an email and password. The API then issues a secure token (JWT) that the frontend presents on every request to prove who the user is.

## Running the Project

You will need **Node.js** installed on your machine.

### 1. Start the backend

```bash
cd api
npm install
# create a .env file with the keys below
npx prisma migrate dev  # or: npx prisma db push
npm run seed            # or: npx prisma db seed
npm run dev
```

The API runs on the port set by `PORT` (default `3000`).

Environment keys for `api/.env`:

```
DATABASE_URL=file:./mydatabase.db
JWT_SECRET=your-secret-key
PORT=3000
CORS_ORIGIN=URL

# Email delivery (optional in dev — codes log to console when unset)
RESEND_API_KEY=
EMAIL_FROM=ClearPath <onboarding@resend.dev>

# OTP storage (optional in dev — falls back to in-memory store when unset)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

### 2. Start the frontend

```bash
cd UI
npm install
cp .env.example .env    # then set VITE_API_URL to your API address
npm run dev
```

The app opens in your browser (Vite's default URL is `http://localhost:5173`).

`VITE_API_URL` in `UI/.env` should point at the API, e.g.:

```
VITE_API_URL=http://localhost:3000/api
```

### Demo accounts

The database seed includes ready-made accounts, all with the password `password123`:

| Email | Role |
| --- | --- |
| `super@portal.test` | Superadmin |
| `student@portal.test` | Student |
| `academic@portal.test` | Academic unit |
| `bursary@portal.test` | Bursary unit |
| `department@portal.test` | Department unit |
| `csdepartment@portal.test` | Department unit (CS) |

### Useful commands

```bash
# Backend
cd api
npm run dev     # start the API with auto-reload
npm run build   # compile TypeScript
npm run start   # run the compiled API

# Frontend
cd UI
npm run dev     # start the development server
npm run build   # build for production
npm run lint    # run the linter
```

## Tags

`clearance` · `university` · `student-portal` · `admin-dashboard` · `document-workflow` · `react` · `typescript` · `express` · `prisma` · `sqlite` · `jwt-auth`
