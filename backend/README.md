# FluentLab Backend

FastAPI backend for the local-first FluentLab MVP.

## Run Locally

Create and use a virtual environment from the repository root:

```bash
python3 -m venv .venv
.venv/bin/pip install -r backend/requirements.txt
```

Start the API:

```bash
.venv/bin/uvicorn backend.app.main:app --reload --reload-dir backend/app --host 127.0.0.1 --port 8001
```

The root `npm run api:dev` command uses the same port and limits reload watching to `backend/app`, so local dependency folders do not trigger repeated backend restarts.

Run tests:

```bash
.venv/bin/pytest backend/tests
```

## Scope

This backend uses a local JSON state file for the first MVP. It exposes profile, settings, daily plan, task status, vocabulary, mistakes, progress, resources, speaking polish, and writing feedback endpoints.

Kimi and `whisper.cpp` are intentionally service boundaries in this slice. The current endpoints return deterministic local feedback so the frontend can integrate safely before external AI and local transcription are wired in.
