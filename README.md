# Exam Configuration Service

**Owning team:** Team 3 — Taking the Exam
**Project:** Xebia Exam Platform

This service will implement **BRD Section 4.3 — Exam Configuration**: the APIs and screens that let a Tenant Admin or Exam Creator set up an exam, control candidate access, configure proctoring rules, and define how results are released. Scope is limited to **Must Have** requirements.

---

## 1. What this service does

| Area | Capability |
|---|---|
| Exam Setup | Title, description, instructions, duration, total/passing marks, scheduling window, sections, question selection (manual or random by tag/difficulty), question/option randomisation, attempts & cooldown, navigation lock, negative marking |
| Candidate Access Control | Assign by email / CSV / invite link, optional passphrase, UTC storage with local-timezone display |
| Proctoring Configuration | Proctoring level (None / AI Only / AI + Human / Human Only), per-flag enable/disable, recording mode, sensitivity thresholds; configuration locks once the first candidate starts the exam |
| Result Release | Immediate / scheduled / manual release, score display granularity, manual override release, certificate issuance toggle |

**Consumes:** Accounts & Setup API (role/permission checks)
**Consumed by:** the exam-taking flow and Watching & Reports

---

## 2. Tech stack

- **Backend:** Python 3.11+, FastAPI
- **Database:** PostgreSQL 15+
- **Frontend:** Next.js (App Router), TypeScript
- **API documentation:** OpenAPI 3.0, auto-generated from code

---

## 3. Repository structure

```
exam-configuration-service/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/            # FastAPI routers
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # business logic
│   │   └── db/             # session, migrations (Alembic)
│   ├── tests/
│   ├── requirements.txt
│   └── alembic/
├── frontend/
│   ├── app/
│   ├── components/
│   └── package.json
└── README.md
```

---

## 4. Running locally

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Access to the Accounts service for auth checks

### Database

```bash
createdb exam_configuration_db
```

### Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
alembic upgrade head

uvicorn app.main:app --reload --port 8001
```

Backend: `http://localhost:8001`
Interactive API docs: `http://localhost:8001/docs`
OpenAPI 3.0 spec: `http://localhost:8001/openapi.json`

### Frontend (Next.js)

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Frontend: `http://localhost:3000`

---

## 5. Environment variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `ACCOUNTS_API_BASE_URL` | Base URL of the Accounts & Setup service, used to validate the caller's role |
| `JWT_PUBLIC_KEY` / `KEYCLOAK_REALM_URL` | Used to verify tokens issued by Keycloak |
| `ENV` | `local` / `staging` / `production` |
| `ALLOWED_ORIGINS` | CORS origins allowed to call this API |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | URL of this service's API |
| `NEXT_PUBLIC_ACCOUNTS_BASE_URL` | URL of the Accounts service for login redirect |

---

## 6. API reference

The full API reference is published in the OpenAPI 3.0 standard, auto-generated from code.

- Local: `http://localhost:8001/openapi.json`
- Published reference: TBD

### Key endpoints

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/exams/{exam_id}/configuration` | Create or update exam setup |
| `GET` | `/exams/{exam_id}/configuration` | Retrieve current exam configuration |
| `POST` | `/exams/{exam_id}/access` | Configure candidate access rules |
| `POST` | `/exams/{exam_id}/proctoring` | Configure proctoring level, flags, recording, sensitivity |
| `POST` | `/exams/{exam_id}/result-release` | Configure result release rules and certificate issuance |
| `GET` | `/exams/{exam_id}/lock-status` | Returns whether configuration is locked |

Once any candidate starts the exam, exam setup, marks, and proctoring settings become read-only.

---

## 7. Deployment

| Item | Value |
|---|---|
| Hosting | Always-on cloud server |
| Live URL | TBD |
| Staging URL | TBD |

---

## 8. Scope

This build covers Must Have requirements from BRD Section 4.3 only:
- Exam Setup
- Candidate Access Control
- Proctoring Configuration
- Result Release

Should Have items (exam duplication, IP whitelisting, geo-restriction, per-candidate manual release override, human proctor assignment) are out of scope for this phase.
---

# Team 1 — Accounts & Setup (Frontend)

Frontend prototype for the **Accounts & Setup** module. Implements a complete, multi-screen tenant onboarding and user management flow.

## Screens

All screens are located under `frontend/app/`:

| Route | Screen | Description |
|---|---|---|
| `/login` | Sign In | Email/password auth + Google/Microsoft SSO + SAML notice |
| `/reset-password` | Set Password | First-login password reset with live validation rules |
| `/onboarding/step-1` | Org Details | Organisation name, tenant slug, plan tier, contact email |
| `/onboarding/step-2` | Branding | Logo upload (drag & drop), colour picker, display name, tagline |
| `/onboarding/step-3` | Timezone & Notifications | Timezone, date format, notification toggles, sender email |
| `/onboarding/step-4` | Invite Users | Dynamic row builder (up to 10), CSV bulk import shortcut |
| `/onboarding/step-5` | Review & Confirm | Summary cards with edit links, success banner |
| `/users` | User Management | Data table with filters, bulk CSV import with validation preview |
| `/demo` | Demo Flow | All screens linked — primary buttons auto-advance |
| `/onboarding/preview` | Preview | All onboarding steps rendered on one page |

## Demo Mode (`/demo`)

Visit `/demo` to run the full presentation flow. Clicking primary action buttons (Sign in → Set password → Next → Complete setup) automatically advances to the next screen. Each page accepts an optional `onNext` prop — when visited standalone, buttons behave normally.

## Design System

All styling is driven by `frontend/styles/tokens.css`:

- **Brand colours**: Tranquil Velvet (`#6C1D5F`), Emerald, CTA Orange
- **Semantic aliases**: `--color-primary`, `--color-error`, `--color-success`, `--color-warning`
- **Typography**: Inter, 6-step size scale (11px–28px)
- **Spacing**: 4px base, 8 levels (4px–48px)
- **Tenant-overridable**: `--color-tenant-primary` and `--tenant-logo-url` (BRD §4.1.1)

Tokens are mapped to Tailwind v4 utilities via `globals.css @theme`.

## Running the Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Open [http://localhost:3000/demo](http://localhost:3000/demo) to see the full flow.

