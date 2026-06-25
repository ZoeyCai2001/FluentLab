# FluentLab Technical Design

**Status:** Draft  
**Date:** 2026-06-25  
**Source:** `fluentlab_prd.md`  
**Product:** FluentLab, an English learning companion for AI researchers

## 1. Purpose

This document translates the PRD into an implementation-oriented design. It defines the MVP architecture, data boundaries, core user flows, AI service contracts, and delivery phases.

The first implementation goal is not to build a large course platform. The first goal is to build a daily learning operating system that tells the learner what to practice today, captures output, gives feedback, and uses mistakes to shape the next plan.

## 2. Product Shape

FluentLab should feel like a focused learning workspace, not a marketing site or generic course catalog. The primary screen is the Home Dashboard, centered on today's plan and current weak areas.

Primary MVP surfaces:

1. Home Dashboard
2. Onboarding and Diagnostic
3. Daily Plan
4. Reading Hub
5. Listening Lab
6. Speaking Room
7. Writing Studio
8. Vocabulary Bank
9. Mistake Notebook
10. Progress Report
11. Resource Center
12. Settings

## 3. MVP Architecture

### 3.1 Recommended System

```text
Browser
  |
  v
Next.js Web App
  |
  +-- Server actions / API client
  |
  v
FastAPI Backend
  |
  +-- PostgreSQL
  +-- Redis
  +-- Background scheduler
  +-- Object storage for audio later
  |
  v
AI Service Layer
  +-- LLM provider
  +-- Speech-to-text provider
  +-- Text-to-speech provider
  +-- Embeddings provider later
```

### 3.2 Development Sequence

Use a staged implementation so the project becomes useful early.

Phase A: Frontend shell and mock learning data.

- Build the main dashboard and daily plan UI.
- Use typed local seed data.
- Include module pages with realistic task states.
- No authentication, database, or external AI dependency yet.

Phase B: Backend domain API.

- Add FastAPI with domain models.
- Persist learner profile, daily plans, tasks, attempts, mistakes, and reports.
- Keep frontend API calls behind a small client module so the mock backend can be replaced cleanly.

Phase C: AI-assisted feedback.

- Add LLM feedback for writing, speaking transcripts, daily planner generation, and weekly review.
- Store prompts and model responses as structured records.
- Add safety checks for overcorrection, vague feedback, and excessive rewriting.

Phase D: Speech workflows.

- Add browser audio recording.
- Upload speaking attempts.
- Run speech-to-text.
- Generate speaking feedback from transcript plus task metadata.

Phase E: Personalization.

- Add difficulty adaptation, review scheduling, weak-skill detection, and content recommendations.

## 4. Frontend Design

### 4.1 Framework

Use Next.js with React and TypeScript. Tailwind CSS and shadcn/ui are a good fit for dense learning-workspace UI.

### 4.2 Information Architecture

Use a persistent app shell:

- Left navigation for modules.
- Top area for date, streak, daily target, and profile controls.
- Main content panel for selected workflow.
- Right context panel where useful for mistakes, recommended review, or task metadata.

### 4.3 Key Components

Core components:

- `AppShell`
- `SidebarNav`
- `SkillBalance`
- `DailyPlanList`
- `TaskCard`
- `TaskStatusControl`
- `FeedbackButtons`
- `MistakeList`
- `CalendarHeatmap`
- `ProgressTrend`
- `PromptPanel`
- `WritingEditor`
- `ConversationPractice`
- `VocabularyCard`

### 4.4 Visual Direction

The app should be calm, work-focused, and efficient. Avoid a large landing page. The first screen should immediately answer: "What should I learn today?"

Suggested design traits:

- Compact navigation.
- Clear task hierarchy.
- Skill color accents used sparingly.
- High readability for long prompts and feedback.
- Dense but comfortable dashboard panels.
- Strong empty states for new users.

## 5. Backend Design

### 5.1 Service Responsibilities

FastAPI owns:

- User and learner profile persistence.
- Diagnostic result storage.
- Daily plan generation and task lifecycle.
- Content item management.
- Practice attempt submission.
- Mistake notebook and review scheduling.
- Weekly report generation.
- AI service orchestration.

The frontend owns:

- UI state and form interactions.
- Audio recording controls.
- Rich text editing for writing practice.
- Rendering progress, calendar, and reports.

### 5.2 API Modules

Initial API route groups:

- `/profiles`
- `/diagnostics`
- `/plans`
- `/tasks`
- `/content`
- `/attempts`
- `/mistakes`
- `/reports`
- `/resources`
- `/ai`

### 5.3 Background Jobs

Scheduled jobs:

- Generate tomorrow's plan.
- Update review queues.
- Create weekly report.
- Recompute skill trends.
- Refresh external resource metadata later.

## 6. Data Model

### 6.1 Main Entities

```text
User
LearnerProfile
DiagnosticSession
DiagnosticAnswer
DailyPlan
LearningTask
ContentItem
PracticeAttempt
SpeakingRecord
WritingDraft
VocabularyItem
Mistake
TaskFeedback
ProgressSnapshot
WeeklyReport
Resource
```

### 6.2 LearnerProfile

```text
id
user_id
learner_type
daily_english_goal
academic_english_goal
listening_level
speaking_level
reading_level
writing_level
vocabulary_level
academic_english_level
daily_english_level
preferred_topics
weaknesses
learning_time_per_day
created_at
updated_at
```

### 6.3 DailyPlan

```text
id
user_id
date
total_estimated_minutes
target_skills
status
completion_rate
generated_reason
created_at
updated_at
```

### 6.4 LearningTask

```text
id
daily_plan_id
content_id
skill_type
module
title
difficulty
estimated_minutes
instructions
expected_output_type
status
score
feedback_summary
created_at
updated_at
```

### 6.5 PracticeAttempt

```text
id
user_id
task_id
attempt_type
input_text
audio_url
transcript
score_json
feedback_json
completed_at
created_at
```

### 6.6 Mistake

```text
id
user_id
skill_type
category
original_text
corrected_text
explanation
example_json
review_status
next_review_date
source_attempt_id
created_at
updated_at
```

## 7. Planner Logic

The planner should generate a daily plan from:

- Learner profile
- Skill levels
- Recent completion history
- Recent mistakes
- Weak skills
- Preferred topics
- Available daily study time
- Review due dates
- User feedback labels

Initial deterministic planner:

1. Reserve time for due review.
2. Prioritize weak active-output skills: listening, speaking, writing, vocabulary activation.
3. Include at least one daily English task and one academic English task.
4. Keep each task measurable.
5. Avoid assigning more than the learner's daily target time.
6. Record why each task was selected.

Later AI planner:

1. Backend prepares a structured planner context.
2. LLM returns a validated JSON plan.
3. Backend validates task count, skill coverage, difficulty, and time budget.
4. Backend stores both the plan and generation metadata.

## 8. AI Service Design

### 8.1 AI Boundaries

AI should generate drafts of learning content, feedback, and recommendations. The application should own validation, persistence, scheduling, and user-visible state.

### 8.2 Prompt Types

Prompt families:

- Daily planner
- Writing feedback
- Speaking role-play
- Speaking transcript feedback
- Vocabulary card generation
- Reading comprehension generation
- Listening transcript exercise generation
- Mistake extraction
- Weekly report generation

### 8.3 Response Contracts

AI responses should be requested as structured JSON when they affect app state. Store:

- prompt version
- model
- input context hash
- raw response
- parsed response
- validation status

### 8.4 Feedback Style Rules

Feedback must be:

- Specific
- Actionable
- Short enough to use immediately
- Focused on priority mistakes
- Paired with better expressions
- Careful not to erase the learner's independent voice

## 9. Speaking Workflow

MVP speaking can start with text responses and browser recording UI. Full feedback needs speech-to-text.

Target flow:

1. User opens a speaking task.
2. App shows scenario and speaking goal.
3. User records an answer.
4. Frontend uploads audio.
5. Backend stores audio and requests transcription.
6. LLM evaluates transcript and task context.
7. System saves scores, feedback, useful expressions, and mistakes.
8. User can retry the task.

## 10. Writing Workflow

Writing must protect independent practice.

Target flow:

1. App shows prompt and constraints.
2. User writes first draft without AI help.
3. Backend evaluates the draft.
4. App shows priority feedback, corrections, and reusable phrases.
5. User writes a revision.
6. Backend compares draft and revision.
7. Recurring mistakes are saved to the notebook.

## 11. Recommendation Logic

Use the PRD scoring formula as the long-term content ranking model:

```text
content_score =
  0.25 * skill_gap_match
+ 0.20 * goal_relevance
+ 0.15 * difficulty_fit
+ 0.15 * topic_interest
+ 0.10 * novelty
+ 0.10 * review_priority
+ 0.05 * user_feedback
```

For the first implementation, compute this with simple normalized fields. Later, embeddings and historical performance can improve topic similarity and difficulty fit.

## 12. Security and Privacy

Sensitive data:

- Speaking audio
- Transcripts
- Writing drafts
- Learning profile
- Mistake history
- AI interaction logs

MVP requirements:

- Do not expose private attempts across users.
- Keep API keys only on the server.
- Avoid logging full private user writing in infrastructure logs.
- Store uploaded audio with private access.
- Add deletion capability before broader use.

## 13. Testing Strategy

Frontend:

- Component tests for task cards, planner state, feedback controls, and notebook rendering.
- Playwright checks for dashboard, daily plan, writing workflow, and responsive layout.

Backend:

- Unit tests for planner, recommendation scoring, review scheduling, and skill trend computation.
- API tests for task lifecycle, attempt submission, and mistake creation.
- Contract tests for AI response parsing and validation.

## 14. Implementation Milestones

Milestone 1: Design foundation.

- Commit PRD.
- Add technical design.
- Add process log.
- Initialize GitHub remote.

Milestone 2: Frontend MVP shell.

- Create Next.js app.
- Build app shell, navigation, dashboard, daily plan, and mock task data.
- Add module placeholder pages with realistic workflows.

Milestone 3: Practice workflows with mock feedback.

- Writing Studio with draft/revision state.
- Speaking Room with recording UI or text fallback.
- Mistake Notebook with seeded examples.
- Progress Report with mock analytics.

Milestone 4: Backend MVP.

- Add FastAPI service.
- Add database schema.
- Persist plans, tasks, attempts, mistakes, and reports.

Milestone 5: AI integration.

- Add structured LLM feedback for writing.
- Add planner generation behind validation.
- Add speech-to-text for speaking attempts.

## 15. Open Questions

1. Should the first real product support one learner only or multi-user accounts from the beginning?
2. Which LLM provider should be used for planning and feedback?
3. Which speech-to-text provider should be used for speaking practice?
4. Should Chinese explanations be included by default or only on request?
5. Should initial content be hand-authored seed content or AI-generated with review?
6. Should the app optimize for local-only use first or deployable cloud infrastructure first?

