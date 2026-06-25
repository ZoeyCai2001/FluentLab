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
