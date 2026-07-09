from collections.abc import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from app.core.config import settings

# Create asynchronous SQLAlchemy 2.0 engine
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=True if settings.ENV == "local" else False,
    future=True,
    pool_pre_ping=True,
)

# Create asynchronous session maker
async_session_maker = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


# Dependency to get async DB session for FastAPI endpoints
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()
