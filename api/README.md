# API — Backend

The REST API for the Student Clearance Management System. Built with **Node.js**, **Express 5**, and **TypeScript** (ESM), with **Prisma ORM** over **SQLite**.

## Stack

| Concern | Choice |
| --- | --- |
| Runtime | Node.js (ESM) |
| Framework | Express 5 |
| Language | TypeScript |
| ORM / database | Prisma + SQLite |
| Authentication | Passport.js (local + JWT strategies) |
| Tokens | JSON Web Tokens |
| Validation | zod |
| File uploads | multer (disk storage) |
| API docs | swagger-jsdoc + swagger-ui-express |
| Rate limiting | express-rate-limit |

## Getting started

```bash
npm install
```

Create a `.env` file:

```
Keys are defined in .env.example file
```

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Prisma connection string (SQLite file path) |
| `JWT_SECRET` | Secret used to sign and verify JWTs |
| `PORT` | Port the server listens on (default `3000`) |
| `CORS_ORIGIN` | Comma-separated list of allowed origins |
| `NODE_ENV` | `production` enables `trust proxy` for correct client IPs behind a reverse proxy |

Set up the database and seed it:

```bash
npx prisma migrate dev   # or: npx prisma db push
npm run seed             # or: npx prisma db seed
```

Run it:

```bash
npm run dev     # tsx watch — auto-reloads on change
npm run build   # tsc — compiles to dist/
npm run start   # node dist/index.js
```

### Demo accounts

The seed creates users with password `password123`:

| Email | Role |
| --- | --- |
| `student@portal.test` | student |
| `academic@portal.test` | academic |
| `bursary@portal.test` | bursary |
| `department@portal.test` | department |
| `csdepartment@portal.test` | department (Computer Science) |

<!--| `super@portal.test` | superAdmin |-->


## Auth & authorization

- **Login** — `POST /auth/login` with `{ email, password }` (Passport **local strategy**) returns the user and a JWT.
- **Verification** — every other route runs through `authenticate` (Passport **JWT strategy** reading `Authorization: Bearer <token>`).
- **Role guard** — `authorize('superAdmin')`, `authorize('academic', 'bursary', 'department')`, etc. restrict routes by role; `denyRole('superAdmin')` excludes a role.

Roles: `student`, `superAdmin`, `academic`, `bursary`, `department`.

## Endpoints

All routes are mounted under `/api`. Interactive docs are served at **`/api/docs`** (Swagger UI).

| Module | Method | Path | Access |
| --- | --- | --- | --- |
| Health | GET | `/health` | public |
| Auth | POST | `/auth/login` | public (rate limited) |
| Auth | GET | `/auth/me` | any authenticated user |
| Users | GET | `/users` | superAdmin |
| Users | GET | `/users/:id` | superAdmin |
| Users | POST | `/users` | superAdmin (rate limited) |
| Users | PATCH | `/users/:id` | superAdmin |
| Users | DELETE | `/users/:id` | superAdmin |
| Reports | POST | `/reports` | all roles except superAdmin (rate limited) |
| Reports | GET | `/reports` | superAdmin |
| Reports | PATCH | `/reports/:id` | superAdmin |
| Reports | DELETE | `/reports/:id` | superAdmin |
| Departments | GET | `/departments` | superAdmin |
| Departments | POST | `/departments` | superAdmin |
| Departments | DELETE | `/departments/:id` | superAdmin |
| Audit logs | GET | `/audit-logs` | superAdmin |
| Audit logs | DELETE | `/audit-logs` | superAdmin |
| Activities | GET | `/activities` | any authenticated user |
| Activities | DELETE | `/activities` | superAdmin |
| Documents | POST | `/documents` | student (file upload, rate limited) |
| Documents | GET | `/documents` | student (own documents) |
| Documents | GET | `/documents/inbox` | academic / bursary / department |
| Documents | GET | `/documents/:id` | any authenticated user |
| Documents | PATCH | `/documents/:id/review` | academic / bursary / department |
| Documents | DELETE | `/documents/:id` | academic / bursary / department |
| Clearance | GET | `/clearance/me` | student |
| Clearance | GET | `/clearance` | academic / bursary / department |
| Clearance | PATCH | `/clearance/:studentId/clear` | academic / bursary / department |
| Metrics | GET | `/metrics` | any authenticated user |

## Key flows

### Document lifecycle
1. A **student** uploads a document (`POST /documents`, multipart form with `name`, `unit`, `file`) — multer stores the file under `uploads/`.
2. The document is routed to the matching unit recipient (academic/bursary, or the department staff for the student's department).
3. Unit staff see it in their inbox and **approve or reject** it (`PATCH /documents/:id/review`); rejecting requires a reason.
4. Reviewed documents can be **deleted** (`DELETE /documents/:id`) — restricted to the recipient and only when status is `approved` or `rejected`. Deleting also removes the physical file from `uploads/`.

### Clearance
A student's clearance is a set of units (`academic`, `bursary`, `department`). Each unit can mark a student as cleared (`PATCH /clearance/:studentId/clear`); the student sees the per-unit status on `GET /clearance/me`.

### Activity feed & audit logs
- `activitiesService.log(...)` records every notable action into the **activities** feed (visible on dashboards).
- Most mutations also write an **audit log** entry with actor, action, reason, category, IP, and status.
- A superadmin can clear the audit log (`DELETE /audit-logs`) or the activity feed (`DELETE /activities`). Clearing the audit log records the clearing action itself in a single transaction — a fresh audit entry and activity entry survive the wipe.

### Dashboard metrics
`GET /metrics` returns the metric cards for the caller's role (student, academic, bursary, department, superAdmin), computed server-side and cached per user/period.

## Security

- **Rate limiting** (`src/middleware/rate-limit.middleware.ts`) — per-IP limits on the abuse-prone write endpoints, returning `429` with the app's standard error shape:
  - `POST /auth/login` — 10 per 15 minutes
  - `POST /users` — 30 per hour
  - `POST /reports` — 10 per hour
  - `POST /documents` — 20 per hour
- **CORS** — restricted to the origins in `CORS_ORIGIN`.
- **Central error handling** (`src/middleware/error.middleware.ts`) — maps zod validation errors (400), `AppError` (custom status), multer errors (400, e.g. 5MB file limit), and Prisma unique/not-found errors (409 / 404) to consistent JSON responses.
- **JWT** — signed with `JWT_SECRET`, expires after 7 days.

## Project structure

```
src/
├── index.ts                    # app setup, CORS, static uploads, /api mount
├── main.router.ts              # mounts all module routers under /api
├── swagger.ts                  # OpenAPI spec (hand-maintained)
├── auth/                       # login, /me, passport strategies, JWT helpers
├── users/                      # user CRUD (superAdmin)
├── reports/                    # report submission + admin resolution
├── departments/                # department CRUD (superAdmin)
├── audit-logs/                 # audit trail list + clear (superAdmin)
├── activities/                 # activity feed list + clear (superAdmin)
├── documents/                  # upload, inbox, review, delete
├── clearance/                  # per-unit clearance status + clear action
├── metrics/                    # role dashboard metric cards
├── middleware/
│   ├── auth.middleware.ts      # authenticate / authorize / denyRole
│   ├── error.middleware.ts     # centralized error handler
│   ├── rate-limit.middleware.ts# named rate limiters
│   └── upload.middleware.ts    # multer disk storage config
└── lib/
    ├── prisma.js               # Prisma client singleton
    └── AppError.js             # error class with status code
```

Each module follows the same shape: `*.router.ts` (route wiring + guards), `*.controller.ts` (request/response), `*.service.ts` (business logic + transactions), `*.validation.ts` (zod schemas).
