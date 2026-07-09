from typing import Any, Dict
from pydantic import BaseModel, Field


class AutosavePayload(BaseModel):
    """
    Schema for validating candidate auto-save payloads.
    Accepts a dictionary of question IDs mapped to code snippets or response answers.
    """

    answers: Dict[str, Any] = Field(
        ...,
        description="Key-value mapping where keys are question IDs and values represent current code or responses.",
    )
