from typing import Optional
from pydantic import BaseModel, Field


class Judge0ExecutionRequest(BaseModel):
    """
    Schema for code execution request payloads targeting Judge0 compiler.
    """

    source_code: str = Field(..., description="The source code to be executed.")
    language_id: int = Field(..., description="Judge0 programming language ID.")
    stdin: Optional[str] = Field(None, description="Standard input for the program.")
