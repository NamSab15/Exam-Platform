from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncEngine, async_sessionmaker, create_async_engine
from sqlmodel.ext.asyncio.session import AsyncSession

_async_engine: AsyncEngine | None = None
_async_session_maker: async_sessionmaker[AsyncSession] | None = None

def get_engine() -> AsyncEngine:
    if _async_engine is None:
        raise RuntimeError("Database engine not initialized. Call create_db_engine() first.")
    return _async_engine

def create_db_engine(database_url: str) -> None:
    global _async_engine, _async_session_maker
    if _async_engine is not None:
        return

    _async_engine = create_async_engine(
        database_url,
        echo=False,
        future=True,
    )
    _async_session_maker = async_sessionmaker(
        bind=_async_engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )

async def dispose_db_engine() -> None:
    global _async_engine, _async_session_maker
    if _async_engine is not None:
        await _async_engine.dispose()
        _async_engine = None
        _async_session_maker = None

async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    if _async_session_maker is None:
        raise RuntimeError(
            "Database session factory not initialized. Call create_db_engine() first."
        )
    async with _async_session_maker() as session:
        yield session
