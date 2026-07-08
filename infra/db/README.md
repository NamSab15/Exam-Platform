# Database Migrations

This folder manages the shared database schema for the Xebia Exam Platform.

## 1. Schema Conventions

When writing migrations, make sure table names are prefixed according to your team scope:
*   `accounts_*` - Team 1
*   `questions_*`, `exams_*` - Team 2
*   `exam_sessions_*`, `answers_*` - Team 3
*   `proctoring_*`, `incidents_*`, `trust_scores_*`, `certificates_*` - Team 4

---

## 2. Developer Workflow: Creating & Applying Migrations

Follow these step-by-step instructions to create, apply, and share database migrations when working locally with a Docker database.

### Step 1: Spin up the Database
Start only the PostgreSQL database container:
```bash
docker compose -f shared/docker-compose.yml up db -d
```
*Note: The database container exposes port `5433` on your host machine to prevent conflicts with any local PostgreSQL instance running on `5432`.*

### Step 2: Create a New Migration File
Create a new `.sql` file in `shared/infra/db/migrations/` prefixed with a sequential three-digit number:
*   `0001_initial_schema.sql`
*   `0002_add_roles.sql`
*   `0003_your_new_migration.sql`

Write your raw DDL statements directly inside this file.

### Step 3: Apply the Migration Locally
You can apply your new migration SQL file to the running Docker database in one of two ways:

#### Option A: Using Docker (Recommended)
Run the `migrations` container standalone. Since the compose file mounts this local directory, it will automatically detect and apply your new SQL file:
```bash
docker compose -f shared/docker-compose.yml up migrations
```
*This starts the container, runs the migration runner, applies any pending SQL files, and shuts down.*

#### Option B: Using Local Python (Host Machine)
If you prefer running the python script directly from your host environment:
1. Ensure the required packages are installed in your virtual environment:
   ```bash
   pip install asyncpg python-dotenv
   ```
2. Execute the runner script, pointing it to host port `5433`:
   ```bash
   DATABASE_URL="postgresql+asyncpg://postgres:postgres@localhost:5433/xebia_exam_db" python shared/infra/db/migrate.py
   ```

### Step 4: Commit and Push
Once your local code changes are verified against the updated schema, commit and push the new migration file inside the **`shared`** repository:
```bash
cd shared
git add infra/db/migrations/0003_your_new_migration.sql
git commit -m "migration: add user configuration columns to accounts"
git push origin main
```
