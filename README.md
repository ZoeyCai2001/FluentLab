# FluentLab

FluentLab is a personalized English learning companion for AI researchers. It focuses on daily fluency, academic speaking, independent writing, listening practice, vocabulary activation, and mistake-based review.

The project is currently in the technical design phase. The source PRD is in `fluentlab_prd.md`, and the initial technical design is in `docs/technical_design.md`.

## Design Principles

- Build the daily plan as the center of the product.
- Separate skill levels instead of using one global English score.
- Require active output for reading, listening, vocabulary, speaking, and writing tasks.
- Save recurring mistakes and use them to drive review.
- Keep AI feedback specific, short, actionable, and supportive of independent practice.

## Initial Stack Direction

- Frontend: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui.
- Backend: FastAPI, PostgreSQL, Redis, scheduled jobs.
- AI services: LLM feedback/planning, speech-to-text, text-to-speech, embeddings later.

## Local Development

Install dependencies:

```bash
npm install
```

Run the frontend:

```bash
npm run dev
```

Set up the backend:

```bash
python3 -m venv .venv
.venv/bin/pip install -r backend/requirements.txt
```

Run the backend:

```bash
npm run api:dev
```

The frontend reads the backend from:

```bash
NEXT_PUBLIC_FLUENTLAB_API_URL=http://127.0.0.1:8001
```

When deployed to Vercel as a single project, leave `NEXT_PUBLIC_FLUENTLAB_API_URL` empty so the frontend calls the same-origin `/api` backend.
The Vercel backend uses `/tmp` for JSON persistence, so saved progress can reset after serverless cold starts. Use a hosted database before treating the deployed version as durable.

## Private Login

For the two-person private version, set a shared password on the backend:

```bash
FLUENTLAB_SHARED_PASSWORD=choose-a-password
FLUENTLAB_AUTH_TOKEN=choose-a-long-random-token
```

`FLUENTLAB_AUTH_TOKEN` should stay stable in production so browser sessions survive backend restarts. If `FLUENTLAB_SHARED_PASSWORD` is empty, the API stays open for local development.

When deploying the frontend and backend separately, allow the frontend origin in the backend:

```bash
CORS_ORIGINS=https://your-vercel-app.vercel.app
```

Then set this on the frontend deployment:

```bash
NEXT_PUBLIC_FLUENTLAB_API_URL=https://your-backend-service.onrender.com
```

Quality checks:

```bash
npm run lint
npm run typecheck
npm run build
npm audit --omit=dev
npm run api:test
```

The first app slice uses local seed data. The backend now provides the first local API surface with JSON-file persistence. Kimi and whisper.cpp integration will be wired into the existing service boundaries in later milestones.
