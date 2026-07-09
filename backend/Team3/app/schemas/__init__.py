from app.schemas.session import SessionCreate, SessionResponse
from app.schemas.autosave import AutosavePayload
from app.schemas.judge0 import Judge0ExecutionRequest
from app.schemas.result import ExamResultResponse

# Exam Configuration schemas (FR-031–FR-048)
from app.schemas.exam_config import (
    ExamConfigCreate,
    ExamConfigUpdate,
    ExamConfigResponse,
    LockStatusResponse,
)
from app.schemas.exam_section import (
    SectionCreate,
    SectionUpdate,
    SectionResponse,
    QuestionSelectionCreate,
    QuestionInSectionResponse,
)
from app.schemas.candidate_access import (
    CandidateAccessCreate,
    CandidateAccessResponse,
    InviteLinkResponse,
    PassphraseSet,
    PassphraseVerify,
    PassphraseVerifyResponse,
    CandidateEmailAdd,
    InvitedCandidateResponse,
    CandidateBulkAddResponse,
)
from app.schemas.proctoring import (
    ProctoringConfigCreate,
    ProctoringConfigUpdate,
    ProctoringConfigResponse,
    ProctoringFlagUpdate,
    ProctoringFlagResponse,
)
from app.schemas.result_release import (
    ResultReleaseCreate,
    ResultReleaseUpdate,
    ResultReleaseResponse,
)

__all__ = [
    # Session / exam-taking
    "SessionCreate",
    "SessionResponse",
    "AutosavePayload",
    "Judge0ExecutionRequest",
    "ExamResultResponse",
    # Exam Configuration
    "ExamConfigCreate",
    "ExamConfigUpdate",
    "ExamConfigResponse",
    "LockStatusResponse",
    "SectionCreate",
    "SectionUpdate",
    "SectionResponse",
    "QuestionSelectionCreate",
    "QuestionInSectionResponse",
    "CandidateAccessCreate",
    "CandidateAccessResponse",
    "InviteLinkResponse",
    "PassphraseSet",
    "PassphraseVerify",
    "PassphraseVerifyResponse",
    "CandidateEmailAdd",
    "InvitedCandidateResponse",
    "CandidateBulkAddResponse",
    "ProctoringConfigCreate",
    "ProctoringConfigUpdate",
    "ProctoringConfigResponse",
    "ProctoringFlagUpdate",
    "ProctoringFlagResponse",
    "ResultReleaseCreate",
    "ResultReleaseUpdate",
    "ResultReleaseResponse",
]
