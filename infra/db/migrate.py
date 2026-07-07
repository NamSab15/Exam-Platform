# pyright: ignore
import asyncio
import os
import sys

import asyncpg
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
MIGRATIONS_DIR = os.path.join(os.path.dirname(__file__), "migrations")


async def run_migrations() -> None:
    if not DATABASE_URL:
        print("DATABASE_URL is not set. Skipping migrations.", file=sys.stderr)
        sys.exit(1)

    print("Connecting to database to run migrations...")
    try:
        conn = await asyncpg.connect(DATABASE_URL)
    except Exception as e:
        print(f"Failed to connect to database: {e}", file=sys.stderr)
        sys.exit(1)

    try:
        # Create migrations table if not exists
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS schema_migrations (
                version TEXT PRIMARY KEY,
                applied_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
            );
        """)

        # Get all migration files
        files = sorted([f for f in os.listdir(MIGRATIONS_DIR) if f.endswith(".sql")])

        # Get already applied migrations
        rows = await conn.fetch("SELECT version FROM schema_migrations;")
        applied = {r["version"] for r in rows}

        applied_count = 0
        for filename in files:
            if filename in applied:
                continue

            print(f"Applying migration: {filename}...")
            filepath = os.path.join(MIGRATIONS_DIR, filename)
            with open(filepath, encoding="utf-8") as f:
                sql = f.read()

            # Execute the migration in a transaction
            async with conn.transaction():
                await conn.execute(sql)
                await conn.execute("INSERT INTO schema_migrations (version) VALUES ($1);", filename)
            print(f"Successfully applied {filename}.")
            applied_count += 1

        if applied_count == 0:
            print("All migrations are already up-to-date!")
        else:
            print(f"Applied {applied_count} migrations successfully!")
    except Exception as e:
        print(f"Migration failed: {e}", file=sys.stderr)
        sys.exit(1)
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(run_migrations())
