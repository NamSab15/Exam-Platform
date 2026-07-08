# Xebia Exam Platform - Shared Core Library

Contains shared configuration, logging, and database utilities for the Xebia Exam Platform services.

## Installation

In your service's `pyproject.toml`, run:
```bash
uv add git+https://gitlab.com/xebia-exam-platform/group-a/shared.git#subdirectory=packages/core
```

For local development:
```toml
[tool.uv.sources]
xebia-core = { path = "../shared/packages/core", editable = true }
```

## Logging Usage

Call `configure_logging` inside your FastAPI lifespan:
```python
from xebia_core.logging import configure_logging

configure_logging(service_name="your-service-name", version="1.0.0", json_logs=False)
```

## Database Usage

Create your async engine and session factory on startup:
```python
from xebia_core.database import create_db_engine, dispose_db_engine

create_db_engine(database_url=settings.DATABASE_URL)
```
