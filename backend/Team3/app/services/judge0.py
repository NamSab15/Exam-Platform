import asyncio
import logging
from typing import Optional, Tuple
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)


class Judge0Service:
    """
    Async HTTP service wrapper for communicating with Judge0 compiler API.
    """

    def __init__(
        self,
        base_url: str = settings.JUDGE0_API_URL,
        api_key: Optional[str] = settings.JUDGE0_API_KEY,
    ):
        self.base_url = base_url.rstrip("/")
        headers = {}
        if api_key:
            # Supports both standalone X-Auth-Token and RapidAPI headers
            headers["X-Auth-Token"] = api_key
            headers["X-RapidAPI-Key"] = api_key
        self.headers = headers

    async def submit_code(
        self, source_code: str, language_id: int, stdin: Optional[str] = None
    ) -> Tuple[Optional[str], Optional[str], Optional[float]]:
        """
        Submits code to Judge0, polls for the result until complete,
        and returns (stdout, stderr, execution_time).
        """
        payload = {
            "source_code": source_code,
            "language_id": language_id,
            "stdin": stdin,
        }

        # Set connection and read timeouts
        timeout = httpx.Timeout(10.0, connect=5.0)

        async with httpx.AsyncClient(
            headers=self.headers, timeout=timeout
        ) as client:
            try:
                # 1. POST submission to Judge0
                response = await client.post(
                    f"{self.base_url}/submissions", json=payload
                )
                response.raise_for_status()
                token = response.json().get("token")
                if not token:
                    raise ValueError(
                        "Judge0 API did not return a submission token"
                    )

                # 2. Poll for execution results (up to 10 attempts)
                max_polls = 10
                poll_interval = 1.0

                for attempt in range(max_polls):
                    await asyncio.sleep(poll_interval)
                    status_response = await client.get(
                        f"{self.base_url}/submissions/{token}?fields=stdout,stderr,time,status"
                    )
                    status_response.raise_for_status()
                    data = status_response.json()
                    status_id = data.get("status", {}).get("id")

                    # Status IDs: 1 = In Queue, 2 = Processing
                    if status_id not in (1, 2):
                        stdout = data.get("stdout")
                        stderr = data.get("stderr")
                        execution_time = data.get("time")

                        if execution_time is not None:
                            execution_time = float(execution_time)

                        return stdout, stderr, execution_time

                logger.error(
                    f"Judge0 compilation polling timed out for token: {token}"
                )
                raise TimeoutError("Polling timed out waiting for execution")

            except httpx.TimeoutException as e:
                logger.error(f"Network timeout contacting Judge0 API: {e}")
                raise
            except httpx.HTTPStatusError as e:
                logger.error(
                    f"Judge0 API error status {e.response.status_code}: {e.response.text}"
                )
                raise
            except Exception as e:
                logger.error(f"Error during code execution submission: {e}")
                raise
