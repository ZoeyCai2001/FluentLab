from __future__ import annotations

from pathlib import Path

from fastapi.testclient import TestClient

from backend.app.main import create_app


def make_client(tmp_path: Path) -> TestClient:
    app = create_app(data_path=tmp_path / "state.json")
    return TestClient(app)


def test_health(tmp_path: Path) -> None:
    client = make_client(tmp_path)

    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_today_plan_and_task_update_persist(tmp_path: Path) -> None:
    client = make_client(tmp_path)

    plan = client.get("/api/plans/today").json()
    task_id = plan["tasks"][0]["id"]

    update = client.patch(f"/api/tasks/{task_id}", json={"status": "done"})

    assert update.status_code == 200
    assert update.json()["tasks"][0]["status"] == "done"
    assert update.json()["completion_rate"] > 0

    reloaded = client.get("/api/plans/today")
    assert reloaded.json()["tasks"][0]["status"] == "done"


def test_settings_update_changes_plan_target(tmp_path: Path) -> None:
    client = make_client(tmp_path)

    response = client.put(
        "/api/settings",
        json={
            "daily_study_target_minutes": 75,
            "chinese_explanations": "optional",
            "local_only": True,
            "speech_to_text_provider": "whisper.cpp",
            "llm_provider": "kimi",
        },
    )

    assert response.status_code == 200
    assert response.json()["daily_study_target_minutes"] == 75
    assert client.get("/api/plans/today").json()["target_minutes"] == 75


def test_speaking_polish_returns_read_after_version(tmp_path: Path) -> None:
    client = make_client(tmp_path)

    response = client.post(
        "/api/speaking/polish",
        json={
            "topic": "Explain your research direction",
            "transcript": "My research is about learning theory and current bounds are sometimes loose",
        },
    )

    payload = response.json()
    assert response.status_code == 200
    assert "My research focuses on" in payload["polished_version"]
    assert payload["useful_expressions"]


def test_writing_feedback_returns_revision(tmp_path: Path) -> None:
    client = make_client(tmp_path)

    response = client.post(
        "/api/writing/feedback",
        json={
            "prompt": "Explain why your research matters.",
            "draft": "My research is about making theory better",
        },
    )

    payload = response.json()
    assert response.status_code == 200
    assert "developing sharper theoretical guarantees" in payload["revised_version"]
    assert payload["priority_feedback"]


def test_vocabulary_can_create_mistake_review_item(tmp_path: Path) -> None:
    client = make_client(tmp_path)

    response = client.post(
        "/api/mistakes",
        json={
            "id": "vocab-key-challenge",
            "skill": "Vocabulary",
            "original": "The key technical challenge is...",
            "correction": "The key technical challenge is controlling the generalization gap.",
            "note": "Marked as hard from Vocabulary Bank.",
            "status": "new",
        },
    )

    assert response.status_code == 200
    assert any(item["id"] == "vocab-key-challenge" for item in response.json())


def test_vocabulary_bank_has_words_and_phrases(tmp_path: Path) -> None:
    client = make_client(tmp_path)

    response = client.get("/api/vocabulary")
    items = response.json()

    assert response.status_code == 200
    assert sum(1 for item in items if item["item_type"] == "Phrase") >= 10
    assert sum(1 for item in items if item["item_type"] == "Word") >= 10


def test_listening_resources_are_exact_picks(tmp_path: Path) -> None:
    client = make_client(tmp_path)

    response = client.get("/api/resources")
    listening = [item for item in response.json() if item["skill"] == "Listening"]
    urls = {item["url"] for item in listening}

    assert response.status_code == 200
    assert "https://ed.ted.com/lessons" not in urls
    assert "https://www.nasa.gov/podcasts/" not in urls
    assert any("lecture-1-introduction" in url for url in urls)
    assert any("lets-learn-english-level-1-lesson-1-welcome" in url for url in urls)
