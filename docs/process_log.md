# FluentLab Process Log

This log keeps the design and development process in English, including key conversation context and decisions.

## 2026-06-25

User request:

> I have added a prd under this folder. Connect this project to: ZoeyCai2001/SignalLens.git / https://github.com/ZoeyCai2001/FluentLab.git. For the design and develop process, keep everything in english, include our conversation. Remember to commit your changes and push to remote. Make technical design first?

Assistant response and decision:

- Confirmed that technical design should come first.
- Found `fluentlab_prd.md` as the only project file.
- Found that the folder was not yet a Git repository.
- Chose the remote URL from the actual hyperlink: `https://github.com/ZoeyCai2001/FluentLab.git`.
- Created this process log so future design and development context remains in English.
- Created `docs/technical_design.md` as the first implementation-oriented design artifact before writing application code.

Initial milestone:

- Commit the PRD, README, technical design, and process log.
- Initialize Git.
- Add the GitHub remote.
- Push the initial design foundation.

Git status:

- Initialized the repository on branch `main`.
- Added `origin` as `https://github.com/ZoeyCai2001/FluentLab.git`.
- Created initial commit `3164a63` with message `Add FluentLab technical design foundation`.
- Attempted to push to GitHub, but the local environment did not have GitHub authentication configured for HTTPS or SSH.

LLM configuration update:

- User provided a Kimi API configuration for project features, not for the development process.
- Saved the real secret in local `.env`, which is ignored by Git.
- Added `.env.example` with non-secret Kimi variable names and default base URL/model.
- Documented Kimi as the initial product LLM provider in `docs/technical_design.md`.

Product decision update:

- User confirmed single-user first.
- User confirmed local-only first for the owner and one friend.
- User wants daily study target to be adjustable, with an initial default of 60 minutes.
- User wants Chinese explanations to be optional.
- User prefers free/open learning sources.
- User is comfortable using LLM-generated or LLM-assisted vocabulary content, saved into the app for review.
- Assistant researched speech options and recommended local-first speech: browser recording and TTS first, then `whisper.cpp` for local transcription, with Azure Speech as the first cloud fallback if needed.
- User selected the free/local `whisper.cpp` path.
- User defined the main speaking workflow: the app gives a topic, the learner speaks for about 3 minutes, the recording is transcribed, Kimi polishes it into a better version, and the learner reads after the polished version.

Implementation update:

- User asked assistant to start working on the project.
- Assistant created the first Next.js and TypeScript frontend MVP shell.
- Added seeded local data for daily tasks, vocabulary, mistakes, progress, resources, and speaking topics.
- Built interactive local views for Dashboard, Daily Plan, Speaking Room, Writing Studio, Vocabulary Bank, Mistake Notebook, Progress Report, Resource Center, and Settings.
- Speaking Room now supports browser recording, replay, manual transcript editing, a seeded polished version, and browser text-to-speech read-after practice.
- Added ESLint configuration, TypeScript config, package lockfile, and a PostCSS override to keep `npm audit --omit=dev` clean.
- Verified with `npm run lint`, `npm run typecheck`, `npm run build`, `npm audit --omit=dev`, and a localhost `200 OK` probe.

Backend implementation update:

- User approved the frontend and asked assistant to continue with the backend.
- Assistant added a FastAPI backend under `backend/`.
- Added local JSON state persistence for the local-first MVP.
- Added profile, settings, daily plan, task status, vocabulary, mistakes, resources, weekly progress, speaking polish, and writing feedback endpoints.
- Added deterministic local feedback services as the first implementation seam before Kimi and `whisper.cpp` are connected.
- Added pytest coverage for health, plan persistence, settings updates, speaking polish, and writing feedback.

Frontend-backend integration update:

- User noted that backend work was not visible from the browser and asked assistant to connect the frontend to the backend API.
- Assistant added a frontend API client for the FastAPI endpoints.
- Dashboard, Daily Plan, Vocabulary Bank, Mistake Notebook, Progress Report, Resource Center, and Settings now load backend data with local seed data as fallback.
- Task completion and settings updates now write through backend endpoints.
- Speaking polish and Writing Studio review buttons now call backend feedback endpoints and render backend-returned feedback.
- Frontend top bar now shows backend API status.
- Local backend dev port was standardized to `8001` because `8000` was already occupied on the user's machine.

Product structure refinement request:

- User asked to remove the separate Daily Plan page because the dashboard already contains the same task list.
- User asked to remove the separate Progress Report page and place progress at the bottom of Dashboard.
- User asked for module navigation to become Dashboard, Listening Corner, Speaking Room, Writing Studio, Reading Digest, Vocabulary Bank, Mistake Notebook, Resource Center, and Settings.
- User asked for every task Start button to navigate to the corresponding module.
- User asked to remove the Dashboard review queue, add progress report, and show a celebration effect when all daily tasks are checked.
- User asked Listening Corner to focus on open/free listening videos and audio.
- User asked Speaking Room to support daily-changing topics and acknowledged that recorded speech should later be transcribed to text.
- User asked Writing Studio to include a polish feature.
- User asked Reading Digest to provide resources such as news or daily digest text.
- User asked Vocabulary Bank to provide daily word and phrase learning, and to send hard-to-remember words or phrases to Mistake Notebook.
