"""
AccessService — FR-038, FR-039, FR-040
Manages candidate access control: email lists, CSV uploads, invite links, passphrases.
All times stored in UTC; timezone_label is metadata for display only.
"""
import csv
import hashlib
import io
import secrets
import uuid
from typing import List, Tuple

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ExamNotFoundError, InvalidCSVError, DuplicateCandidateError
from app.models.exams_candidate_access import CandidateAccessMode, ExamCandidateAccess
from app.models.exams_configuration import ExamConfiguration
from app.models.exams_invited_candidate import CandidateStatus, ExamInvitedCandidate
from app.schemas.candidate_access import CandidateAccessCreate


class AccessService:
    def __init__(self, db: AsyncSession, tenant_id: str):
        self.db = db
        self.tenant_id = tenant_id

    # ── Access config ──────────────────────────────────────────────────────────

    async def configure_access(
        self, exam_id: uuid.UUID, payload: CandidateAccessCreate
    ) -> ExamCandidateAccess:
        """FR-038: Create or update the access config for an exam."""
        config = await self._get_exam_config_or_404(exam_id)

        result = await self.db.execute(
            select(ExamCandidateAccess).where(
                ExamCandidateAccess.exam_id == exam_id,
                ExamCandidateAccess.tenant_id == self.tenant_id,
            )
        )
        access = result.scalar_one_or_none()

        if access:
            access.access_mode = payload.access_mode
            if payload.timezone_label is not None:
                access.timezone_label = payload.timezone_label
        else:
            access = ExamCandidateAccess(
                tenant_id=self.tenant_id,
                exam_id=exam_id,
                configuration_id=config.id,
                access_mode=payload.access_mode,
                timezone_label=payload.timezone_label,
            )
            self.db.add(access)

        await self.db.commit()
        await self.db.refresh(access)
        return access

    async def get_access_config(self, exam_id: uuid.UUID) -> ExamCandidateAccess:
        return await self._get_access_or_404(exam_id)

    # ── Candidates by email ────────────────────────────────────────────────────

    async def add_candidates_by_email(
        self, exam_id: uuid.UUID, emails: List[str]
    ) -> Tuple[int, int, List[str]]:
        """FR-038: Bulk-add individual email addresses. Returns (added, skipped, added_emails)."""
        access = await self._get_access_or_404(exam_id)
        added, skipped, added_emails = 0, 0, []

        for email in emails:
            email = email.strip().lower()
            # Check for existing
            existing = await self.db.execute(
                select(ExamInvitedCandidate).where(
                    ExamInvitedCandidate.access_config_id == access.id,
                    ExamInvitedCandidate.email == email,
                )
            )
            if existing.scalar_one_or_none():
                skipped += 1
                continue

            candidate = ExamInvitedCandidate(
                tenant_id=self.tenant_id,
                access_config_id=access.id,
                email=email,
                status=CandidateStatus.PENDING,
            )
            self.db.add(candidate)
            added += 1
            added_emails.append(email)

        await self.db.commit()
        return added, skipped, added_emails

    async def add_candidates_by_csv(
        self, exam_id: uuid.UUID, csv_content: str
    ) -> Tuple[int, int, List[str]]:
        """FR-038: Parse a CSV file of emails and bulk-add."""
        try:
            reader = csv.DictReader(io.StringIO(csv_content))
            # Accept 'email' or 'Email' column
            emails = []
            for row in reader:
                email_col = next(
                    (k for k in row if k.strip().lower() == "email"), None
                )
                if not email_col:
                    raise InvalidCSVError(
                        "CSV must contain an 'email' column header."
                    )
                emails.append(row[email_col].strip())
        except (csv.Error, StopIteration) as e:
            raise InvalidCSVError(f"CSV parsing failed: {e}") from e

        return await self.add_candidates_by_email(exam_id, emails)

    async def list_candidates(
        self, exam_id: uuid.UUID
    ) -> List[ExamInvitedCandidate]:
        access = await self._get_access_or_404(exam_id)
        result = await self.db.execute(
            select(ExamInvitedCandidate).where(
                ExamInvitedCandidate.access_config_id == access.id
            )
        )
        return list(result.scalars().all())

    # ── Invite link ────────────────────────────────────────────────────────────

    async def generate_invite_link(self, exam_id: uuid.UUID) -> str:
        """FR-039: Generate a random token for the invite link."""
        access = await self._get_access_or_404(exam_id)
        token = secrets.token_urlsafe(32)
        access.invite_link_token = token
        await self.db.commit()
        return token

    async def set_passphrase(self, exam_id: uuid.UUID, passphrase: str) -> None:
        """FR-039: Hash and store the passphrase for the invite link."""
        access = await self._get_access_or_404(exam_id)
        # Use SHA-256 for simplicity (bcrypt can be swapped in when passlib is available)
        access.invite_passphrase_hash = hashlib.sha256(passphrase.encode()).hexdigest()
        await self.db.commit()

    async def verify_passphrase(self, exam_id: uuid.UUID, passphrase: str) -> bool:
        """FR-039: Returns True if the passphrase matches the stored hash."""
        access = await self._get_access_or_404(exam_id)
        if not access.invite_passphrase_hash:
            return True  # No passphrase set — open invite
        candidate_hash = hashlib.sha256(passphrase.encode()).hexdigest()
        return candidate_hash == access.invite_passphrase_hash

    # ── Helpers ────────────────────────────────────────────────────────────────

    async def _get_exam_config_or_404(self, exam_id: uuid.UUID) -> ExamConfiguration:
        result = await self.db.execute(
            select(ExamConfiguration).where(
                ExamConfiguration.exam_id == exam_id,
                ExamConfiguration.tenant_id == self.tenant_id,
            )
        )
        config = result.scalar_one_or_none()
        if not config:
            raise ExamNotFoundError(f"Exam configuration for exam {exam_id} not found.")
        return config

    async def _get_access_or_404(self, exam_id: uuid.UUID) -> ExamCandidateAccess:
        result = await self.db.execute(
            select(ExamCandidateAccess).where(
                ExamCandidateAccess.exam_id == exam_id,
                ExamCandidateAccess.tenant_id == self.tenant_id,
            )
        )
        access = result.scalar_one_or_none()
        if not access:
            raise ExamNotFoundError(
                f"Access configuration for exam {exam_id} not found. Configure access first."
            )
        return access
