# Database Migrations

This folder manages the shared database schema for the Xebia Exam Platform.

## How to add a migration

All database schema modifications are defined as raw SQL migrations under `infra/db/migrations/`.

1. Create a new `.sql` file in `infra/db/migrations/` prefixed with a sequential three-digit number:
   - `001_initial_accounts.sql`
   - `002_questions_exams.sql`
   - etc.

2. Write the raw DDL and DML in that file.

3. Make sure table names are prefixed according to your team scope:
   - `accounts_*` - Team 1
   - `questions_*`, `exams_*` - Team 2
   - `exam_sessions_*`, `answers_*` - Team 3
   - `proctoring_*`, `incidents_*`, `trust_scores_*`, `certificates_*` - Team 4

## How to run migrations

Migrations are run automatically during deployment and can be executed locally:
```bash
uv run python infra/db/migrate.py
```
