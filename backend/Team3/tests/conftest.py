from collections.abc import AsyncGenerator, Generator
from unittest.mock import AsyncMock

import pytest
from httpx import ASGITransport, AsyncClient

from exams.dependencies import get_db_session
from exams.main import app


@pytest.fixture(autouse=True)
def mock_db_session() -> Generator[AsyncMock, None, None]:
    mock_session = AsyncMock()
    mock_session.execute = AsyncMock()

    async def _get_db_session() -> AsyncGenerator[AsyncMock, None]:
        yield mock_session

    app.dependency_overrides[get_db_session] = _get_db_session
    yield mock_session
    app.dependency_overrides.clear()


@pytest.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as async_client:
        yield async_client
