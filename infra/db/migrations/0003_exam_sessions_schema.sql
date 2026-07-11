-- =============================================================================
-- Migration: 0003_exam_sessions_schema.sql
-- Team 3 — Exam Sessions Service
-- Tables: exam_sessions, submissions, results, certificates
-- These are the exam-taking / runtime tables managed by Team 3's session service.
-- =============================================================================

-- -----------------------------------------------------------------------
-- ENUM TYPES
-- -----------------------------------------------------------------------

CREATE TYPE exam_session_status AS ENUM (
    'in_progress',
    'submitted',
    'auto_submitted'
);

-- -----------------------------------------------------------------------
-- exam_sessions
-- Tracks a single candidate's attempt at an exam.
-- exam_assignment_id is a soft reference to the assignment record
-- owned by the accounts/scheduling service (Team 1).
-- -----------------------------------------------------------------------
CREATE TABLE exam_sessions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           VARCHAR(255) NOT NULL,
    user_id             VARCHAR(255) NOT NULL,
    exam_assignment_id  UUID NOT NULL,

    start_time          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_time            TIMESTAMPTZ,

    status              exam_session_status NOT NULL DEFAULT 'in_progress',

    CONSTRAINT exam_sessions_end_after_start CHECK (
        end_time IS NULL OR end_time >= start_time
    )
);

CREATE INDEX ix_exam_sessions_tenant_id          ON exam_sessions (tenant_id);
CREATE INDEX ix_exam_sessions_user_id            ON exam_sessions (user_id);
CREATE INDEX ix_exam_sessions_exam_assignment_id ON exam_sessions (exam_assignment_id);

-- -----------------------------------------------------------------------
-- submissions
-- Stores per-question answer / code snapshot for an exam session.
-- question_id is a soft reference to Team 2's questions table.
-- autosave_data holds arbitrary JSON (e.g. selected option for MCQ,
-- or intermediate code state for programming questions).
-- language_id maps to Judge0 language identifiers.
-- -----------------------------------------------------------------------
CREATE TABLE submissions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       VARCHAR(255) NOT NULL,
    session_id      UUID NOT NULL REFERENCES exam_sessions (id) ON DELETE CASCADE,
    question_id     UUID NOT NULL,

    code_snippet    TEXT,
    language_id     INTEGER NOT NULL DEFAULT 0,
    autosave_data   JSONB,

    UNIQUE (session_id, question_id)
);

CREATE INDEX ix_submissions_tenant_id   ON submissions (tenant_id);
CREATE INDEX ix_submissions_session_id  ON submissions (session_id);
CREATE INDEX ix_submissions_question_id ON submissions (question_id);

-- -----------------------------------------------------------------------
-- results
-- One result record per exam session, written when the session is finalised.
-- total_score is a percentage (0.0 – 100.0).
-- -----------------------------------------------------------------------
CREATE TABLE results (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id   VARCHAR(255) NOT NULL,
    session_id  UUID NOT NULL UNIQUE REFERENCES exam_sessions (id) ON DELETE CASCADE,

    total_score DOUBLE PRECISION NOT NULL CHECK (total_score >= 0 AND total_score <= 100),
    passed      BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX ix_results_tenant_id  ON results (tenant_id);
CREATE INDEX ix_results_session_id ON results (session_id);

-- -----------------------------------------------------------------------
-- certificates
-- Issued when a candidate passes. certificate_number is globally unique
-- and used in the public verification URL.
-- -----------------------------------------------------------------------
CREATE TABLE certificates (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           VARCHAR(255) NOT NULL,
    session_id          UUID NOT NULL UNIQUE REFERENCES exam_sessions (id) ON DELETE CASCADE,

    certificate_number  VARCHAR(100) NOT NULL UNIQUE,
    verification_url    VARCHAR(512) NOT NULL
);

CREATE INDEX ix_certificates_tenant_id         ON certificates (tenant_id);
CREATE INDEX ix_certificates_session_id        ON certificates (session_id);
CREATE INDEX ix_certificates_certificate_number ON certificates (certificate_number);
