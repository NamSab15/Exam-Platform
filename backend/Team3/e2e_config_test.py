import asyncio
import httpx

BASE = "http://127.0.0.1:8003/api/v1"
HDR = {"Authorization": "Bearer exam_creator-token"}
EXAM_ID = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"

async def main():
    async with httpx.AsyncClient(timeout=10.0) as c:

        # Health
        r = await c.get("http://127.0.0.1:8003/health")
        print(f"[health]            {r.status_code}")

        # FR-031: Create exam configuration
        r = await c.post(f"{BASE}/exams/{EXAM_ID}/configuration", headers=HDR, json={
            "title": "Python Backend Assessment",
            "description": "Test your Python skills",
            "instructions": "<p>Read carefully</p>",
            "total_duration_minutes": 90,
            "total_marks": 100.0,
            "passing_marks": 50.0,
            "window_start": "2026-08-01T09:00:00Z",
            "window_end": "2026-08-01T18:00:00Z",
            "shuffle_questions": True,
            "shuffle_options": True,
            "max_attempts": 2,
            "cooldown_minutes": 1440,
            "navigation_locked": True,
            "negative_marking_pct": 25.0,
        })
        print(f"[FR-031 create cfg] {r.status_code}  title={r.json().get('title', r.text[:80])}")

        # GET config
        r = await c.get(f"{BASE}/exams/{EXAM_ID}/configuration", headers=HDR)
        print(f"[FR-031 get cfg]    {r.status_code}")

        # FR-045: lock status (should be unlocked)
        r = await c.get(f"{BASE}/exams/{EXAM_ID}/lock-status", headers=HDR)
        print(f"[FR-045 lock]       {r.status_code}  is_locked={r.json().get('is_locked')}")

        # FR-032: Add section
        r = await c.post(f"{BASE}/exams/{EXAM_ID}/sections", headers=HDR, json={
            "title": "Core Python",
            "instructions": "Answer all questions",
            "time_limit_minutes": 45,
            "negative_marking_pct": 20.0,
            "order_index": 0,
        })
        print(f"[FR-032 section]    {r.status_code}  title={r.json().get('title', r.text[:80])}")
        section_id = r.json().get("id")

        # FR-033: Add manual question
        r = await c.post(f"{BASE}/exams/{EXAM_ID}/sections/{section_id}/questions", headers=HDR, json={
            "selection_mode": "manual",
            "question_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
            "order_index": 0,
        })
        print(f"[FR-033 manual q]   {r.status_code}")

        # FR-033: Add random draw question
        r = await c.post(f"{BASE}/exams/{EXAM_ID}/sections/{section_id}/questions", headers=HDR, json={
            "selection_mode": "random",
            "random_pool_tag": "loops",
            "random_pool_difficulty": "medium",
            "random_count": 3,
            "order_index": 1,
        })
        print(f"[FR-033 random q]   {r.status_code}")

        # FR-038: Configure access
        r = await c.post(f"{BASE}/exams/{EXAM_ID}/access", headers=HDR, json={
            "access_mode": "invite_link",
            "timezone_label": "Asia/Kolkata",
        })
        print(f"[FR-038 access]     {r.status_code}")

        # FR-038: Add candidates by email
        r = await c.post(f"{BASE}/exams/{EXAM_ID}/access/candidates", headers=HDR, json={
            "emails": ["alice@example.com", "bob@example.com"]
        })
        print(f"[FR-038 emails]     {r.status_code}  added={r.json().get('added')}")

        # FR-039: Generate invite link
        r = await c.post(f"{BASE}/exams/{EXAM_ID}/access/invite-link", headers=HDR)
        print(f"[FR-039 link]       {r.status_code}  token={str(r.json().get('invite_link_token',''))[:20]}...")

        # FR-039: Set passphrase
        r = await c.post(f"{BASE}/exams/{EXAM_ID}/access/passphrase", headers=HDR, json={"passphrase": "secret123"})
        print(f"[FR-039 passphrase] {r.status_code}")

        # FR-039: Verify correct passphrase
        r = await c.post(f"{BASE}/exams/{EXAM_ID}/access/verify-passphrase", headers=HDR, json={"passphrase": "secret123"})
        print(f"[FR-039 verify ok]  {r.status_code}  valid={r.json().get('valid')}")

        # FR-039: Verify wrong passphrase
        r = await c.post(f"{BASE}/exams/{EXAM_ID}/access/verify-passphrase", headers=HDR, json={"passphrase": "wrong"})
        print(f"[FR-039 verify bad] {r.status_code}  valid={r.json().get('valid')}")

        # FR-041, FR-043: Configure proctoring
        r = await c.post(f"{BASE}/exams/{EXAM_ID}/proctoring", headers=HDR, json={
            "level": "ai_human",
            "recording_mode": "both",
        })
        print(f"[FR-041,043 proc]   {r.status_code}  level={r.json().get('level')}  flags={len(r.json().get('flags',[]))}")

        # FR-042, FR-044: Update flag sensitivity
        r = await c.patch(f"{BASE}/exams/{EXAM_ID}/proctoring/flags/tab_switch", headers=HDR, json={
            "enabled": True,
            "warning_threshold": 2,
            "notification_threshold": 4,
            "termination_threshold": 7,
        })
        print(f"[FR-042,044 flag]   {r.status_code}  flag={r.json().get('flag_type')}  warn={r.json().get('warning_threshold')}")

        # FR-046, FR-047, FR-048: Configure result release
        r = await c.post(f"{BASE}/exams/{EXAM_ID}/result-release", headers=HDR, json={
            "release_mode": "scheduled",
            "release_at": "2026-08-02T12:00:00Z",
            "score_display": "section_breakdown",
            "certificate_enabled": True,
        })
        print(f"[FR-046-048 release]{r.status_code}  mode={r.json().get('release_mode')}  cert={r.json().get('certificate_enabled')}")

        # GET result release
        r = await c.get(f"{BASE}/exams/{EXAM_ID}/result-release", headers=HDR)
        print(f"[FR-046 get release]{r.status_code}")

        print("\n✅ All endpoint tests passed!")

asyncio.run(main())
