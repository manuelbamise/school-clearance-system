# Student Clearance Management System

A web portal that moves the student clearance process online — students submit their documents through the portal, the right university units review and approve them, and every step of the way is tracked and visible.

## The Problem

Before a student can finish (graduate, transfer, or withdraw), they must be "cleared" — that is, confirmed to have no outstanding obligations with different units of the institution. Traditionally this means:

- Physically walking from office to office (academic unit, bursary, department) with paper documents.
- Standing in long queues and waiting on handwritten signatures and stamps.
- Having no way to know which unit has approved and which is still pending.
- Keeping no reliable record of who did what, when, or why.

The result is a slow, frustrating, and hard-to-audit process for students and staff alike.

## What This Project Does

This system replaces the paper trail with a single web application where:

- **Students** submit their documents online and watch their clearance progress unit by unit in real time.
- **Unit staff** (academic, bursary, department) receive those documents in their inbox, open them, and approve or reject them digitally — with a reason when rejected.
- **Everyone** gets a dashboard tailored to their role, showing the numbers that matter.
- **A superadmin** manages users and departments, resolves reports, reviews an audit log of every action taken, and sees a live activity feed.

Clearance status is tracked per unit, so a student can always see exactly what has been cleared and what still needs attention.

## Who Uses It

| Role | What they can do |
| --- | --- |
| **Student** | Upload documents, track clearance status per unit, submit reports |
| **Academic unit** | Review and approve/reject student documents sent to academic affairs |
| **Bursary unit** | Review and approve/reject documents sent to the bursary |
| **Department unit** | Review and approve/reject documents for their own department |
| **Superadmin** | Manage users and departments, view audit logs and activity feeds, resolve reports, clear logs |

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
| `student@portal.test` | Student |
| `academic@portal.test` | Academic unit |
| `bursary@portal.test` | Bursary unit |
| `department@portal.test` | Department unit |

<!--| `super@portal.test` | Superadmin |-->


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
