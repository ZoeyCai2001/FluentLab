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

