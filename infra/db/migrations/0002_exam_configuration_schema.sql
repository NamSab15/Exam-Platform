-- =============================================================================
-- Migration: 0002_exam_configuration_schema.sql
-- Team 3 — Exam Configuration Service
-- Tables: exams_* (per shared schema convention)
-- FRs: FR-031 through FR-048
-- =============================================================================

-- -----------------------------------------------------------------------
-- ENUM TYPES
-- -----------------------------------------------------------------------

CREATE TYPE question_selection_mode AS ENUM ('manual', 'random');

CREATE TYPE candidate_access_mode AS ENUM ('email_list', 'csv_upload', 'invite_link');

CREATE TYPE candidate_status AS ENUM ('pending', 'accepted', 'completed');

CREATE TYPE proctoring_level AS ENUM ('none', 'ai_only', 'ai_human', 'human_only');

CREATE TYPE recording_mode AS ENUM ('none', 'webcam_only', 'screen_only', 'both');

CREATE TYPE result_release_mode AS ENUM ('immediate', 'scheduled', 'never');

CREATE TYPE score_display_mode AS ENUM ('total_only', 'section_breakdown', 'per_question');

-- -----------------------------------------------------------------------
-- exams_configuration (FR-031, FR-034, FR-035, FR-036, FR-037)
-- -----------------------------------------------------------------------
CREATE TABLE exams_configuration (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id               VARCHAR(255) NOT NULL,
    exam_id                 UUID NOT NULL,

    -- FR-031: Core exam fields
    title                   VARCHAR(500) NOT NULL,
    description             TEXT,
    instructions            TEXT,           -- rich text stored as sanitised HTML
    total_duration_minutes  INTEGER NOT NULL CHECK (total_duration_minutes > 0),
    total_marks             NUMERIC(10, 2) NOT NULL CHECK (total_marks > 0),
    passing_marks           NUMERIC(10, 2) NOT NULL CHECK (passing_marks >= 0),
    window_start            TIMESTAMPTZ,    -- UTC scheduling window start
    window_end              TIMESTAMPTZ,    -- UTC scheduling window end

    -- FR-034: Randomisation options
    shuffle_questions       BOOLEAN NOT NULL DEFAULT FALSE,
    shuffle_options         BOOLEAN NOT NULL DEFAULT FALSE,

    -- FR-035: Attempts & cooldown
    max_attempts            INTEGER NOT NULL DEFAULT 1 CHECK (max_attempts >= 1),
    cooldown_minutes        INTEGER NOT NULL DEFAULT 0 CHECK (cooldown_minutes >= 0),

    -- FR-036: Navigation lock
    navigation_locked       BOOLEAN NOT NULL DEFAULT FALSE,

    -- FR-037: Negative marking (global; overridable per section)
    negative_marking_pct    NUMERIC(5, 2) CHECK (negative_marking_pct >= 0 AND negative_marking_pct <= 100),

    -- FR-045: Lock flag — set true when first candidate starts
    is_locked               BOOLEAN NOT NULL DEFAULT FALSE,

    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT exams_config_marks_check CHECK (passing_marks <= total_marks),
    CONSTRAINT exams_config_window_check CHECK (window_end IS NULL OR window_start IS NULL OR window_end > window_start),
    UNIQUE (tenant_id, exam_id)
);

CREATE INDEX ix_exams_configuration_tenant_id ON exams_configuration (tenant_id);
CREATE INDEX ix_exams_configuration_exam_id   ON exams_configuration (exam_id);

-- -----------------------------------------------------------------------
-- exams_sections (FR-032)
-- -----------------------------------------------------------------------
CREATE TABLE exams_sections (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id               VARCHAR(255) NOT NULL,
    exam_id                 UUID NOT NULL,
    configuration_id        UUID NOT NULL REFERENCES exams_configuration (id) ON DELETE CASCADE,

    title                   VARCHAR(500) NOT NULL,
    instructions            TEXT,
    time_limit_minutes      INTEGER CHECK (time_limit_minutes > 0),   -- NULL = no section limit
    negative_marking_pct    NUMERIC(5, 2) CHECK (negative_marking_pct >= 0 AND negative_marking_pct <= 100), -- FR-037 per-section
    order_index             INTEGER NOT NULL DEFAULT 0,

    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ix_exams_sections_tenant_id ON exams_sections (tenant_id);
CREATE INDEX ix_exams_sections_exam_id   ON exams_sections (exam_id);

-- -----------------------------------------------------------------------
-- exams_section_questions (FR-033)
-- -----------------------------------------------------------------------
CREATE TABLE exams_section_questions (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id               VARCHAR(255) NOT NULL,
    section_id              UUID NOT NULL REFERENCES exams_sections (id) ON DELETE CASCADE,

    selection_mode          question_selection_mode NOT NULL,

    -- Manual selection: question_id is set
    question_id             UUID,           -- soft ref to Team 2's questions table

    -- Random draw: pool criteria
    random_pool_tag         VARCHAR(255),
    random_pool_difficulty  VARCHAR(100),
    random_count            INTEGER CHECK (random_count > 0),

    order_index             INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT section_question_mode_check CHECK (
        (selection_mode = 'manual' AND question_id IS NOT NULL AND random_count IS NULL)
        OR
        (selection_mode = 'random' AND question_id IS NULL AND random_count IS NOT NULL)
    )
);

CREATE INDEX ix_exams_section_questions_tenant_id  ON exams_section_questions (tenant_id);
CREATE INDEX ix_exams_section_questions_section_id ON exams_section_questions (section_id);

-- -----------------------------------------------------------------------
-- exams_candidate_access (FR-038, FR-039, FR-040)
-- -----------------------------------------------------------------------
CREATE TABLE exams_candidate_access (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id               VARCHAR(255) NOT NULL,
    exam_id                 UUID NOT NULL,
    configuration_id        UUID NOT NULL UNIQUE REFERENCES exams_configuration (id) ON DELETE CASCADE,

    access_mode             candidate_access_mode NOT NULL,

    -- FR-039: Invite link & passphrase
    invite_link_token       VARCHAR(128) UNIQUE,
    invite_passphrase_hash  VARCHAR(255),   -- bcrypt hash; NULL = no passphrase required

    -- FR-040: Timezone display label (stored for display only; all times are UTC)
    timezone_label          VARCHAR(100),

    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (tenant_id, exam_id)
);

CREATE INDEX ix_exams_candidate_access_tenant_id ON exams_candidate_access (tenant_id);
CREATE INDEX ix_exams_candidate_access_exam_id   ON exams_candidate_access (exam_id);

-- -----------------------------------------------------------------------
-- exams_invited_candidates (FR-038)
-- -----------------------------------------------------------------------
CREATE TABLE exams_invited_candidates (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id               VARCHAR(255) NOT NULL,
    access_config_id        UUID NOT NULL REFERENCES exams_candidate_access (id) ON DELETE CASCADE,

    email                   VARCHAR(320) NOT NULL,
    status                  candidate_status NOT NULL DEFAULT 'pending',

    invited_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (access_config_id, email)
);

CREATE INDEX ix_exams_invited_candidates_tenant_id        ON exams_invited_candidates (tenant_id);
CREATE INDEX ix_exams_invited_candidates_access_config_id ON exams_invited_candidates (access_config_id);
CREATE INDEX ix_exams_invited_candidates_email            ON exams_invited_candidates (email);

-- -----------------------------------------------------------------------
-- exams_proctoring_config (FR-041, FR-043, FR-045)
-- -----------------------------------------------------------------------
CREATE TABLE exams_proctoring_config (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id               VARCHAR(255) NOT NULL,
    exam_id                 UUID NOT NULL,
    configuration_id        UUID NOT NULL UNIQUE REFERENCES exams_configuration (id) ON DELETE CASCADE,

    -- FR-041: Proctoring level
    level                   proctoring_level NOT NULL DEFAULT 'none',

    -- FR-043: Recording options
    recording_mode          recording_mode NOT NULL DEFAULT 'none',

    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (tenant_id, exam_id)
);

CREATE INDEX ix_exams_proctoring_config_tenant_id ON exams_proctoring_config (tenant_id);
CREATE INDEX ix_exams_proctoring_config_exam_id   ON exams_proctoring_config (exam_id);

-- -----------------------------------------------------------------------
-- exams_proctoring_flags (FR-042, FR-044)
-- -----------------------------------------------------------------------
CREATE TABLE exams_proctoring_flags (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id                   VARCHAR(255) NOT NULL,
    proctoring_config_id        UUID NOT NULL REFERENCES exams_proctoring_config (id) ON DELETE CASCADE,

    flag_type                   VARCHAR(100) NOT NULL,  -- e.g. 'face_not_visible', 'tab_switch'
    enabled                     BOOLEAN NOT NULL DEFAULT TRUE,

    -- FR-044: Sensitivity thresholds (event counts)
    warning_threshold           INTEGER NOT NULL DEFAULT 3  CHECK (warning_threshold >= 1),
    notification_threshold      INTEGER NOT NULL DEFAULT 5  CHECK (notification_threshold >= 1),
    termination_threshold       INTEGER NOT NULL DEFAULT 10 CHECK (termination_threshold >= 1),

    UNIQUE (proctoring_config_id, flag_type),

    CONSTRAINT threshold_order_check CHECK (
        warning_threshold <= notification_threshold
        AND notification_threshold <= termination_threshold
    )
);

CREATE INDEX ix_exams_proctoring_flags_tenant_id            ON exams_proctoring_flags (tenant_id);
CREATE INDEX ix_exams_proctoring_flags_proctoring_config_id ON exams_proctoring_flags (proctoring_config_id);

-- -----------------------------------------------------------------------
-- exams_result_release (FR-046, FR-047, FR-048)
-- -----------------------------------------------------------------------
CREATE TABLE exams_result_release (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id               VARCHAR(255) NOT NULL,
    exam_id                 UUID NOT NULL,
    configuration_id        UUID NOT NULL UNIQUE REFERENCES exams_configuration (id) ON DELETE CASCADE,

    -- FR-046: Release mode
    release_mode            result_release_mode NOT NULL DEFAULT 'immediate',
    release_at              TIMESTAMPTZ,    -- required when release_mode = 'scheduled'

    -- FR-047: Score display granularity
    score_display           score_display_mode NOT NULL DEFAULT 'total_only',

    -- FR-048: Certificate issuance
    certificate_enabled     BOOLEAN NOT NULL DEFAULT FALSE,

    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (tenant_id, exam_id),

    CONSTRAINT result_release_scheduled_check CHECK (
        release_mode != 'scheduled' OR release_at IS NOT NULL
    )
);

CREATE INDEX ix_exams_result_release_tenant_id ON exams_result_release (tenant_id);
CREATE INDEX ix_exams_result_release_exam_id   ON exams_result_release (exam_id);
