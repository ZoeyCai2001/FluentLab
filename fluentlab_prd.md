# Product Requirements Document
# FluentLab: English Learning Companion for AI Researchers

**Version:** 0.2  
**Status:** Draft  
**Final Product Name:** FluentLab  
**Target User:** AI theory PhD candidate  
**Primary Goal:** Daily English fluency + academic English fluency  
**Product Type:** Personalized AI-powered English learning website  

---

## 1. Product Overview

### 1.1 Product Name

**FluentLab**

FluentLab is a one-stop personalized English learning platform for researchers who need to improve daily communication, listening, speaking, academic discussion, and research writing.

The name combines two ideas:

- **Fluent**: the product’s goal is practical fluency, not only grammar knowledge or vocabulary memorization.
- **Lab**: the product is designed like a training lab for systematic, measurable, and iterative English improvement, especially for academic users and researchers.

FluentLab should feel more like a personalized English training system than a traditional course website.

### 1.2 Product Goal

The goal of FluentLab is to help an AI theory PhD candidate systematically improve English for two real-world goals:

1. **Daily English fluency**  
   The learner should become fluent enough to live in an English-speaking country, handle daily conversations, understand spoken English, and express personal needs naturally.

2. **Academic English fluency**  
   The learner should become comfortable in academic settings, including attending research meetings, discussing papers, asking questions in seminars, presenting research ideas, attending courses, and writing research-related English.

FluentLab should work as a **one-stop English learning center**. It may direct the learner to external resources, but the daily practice plan, learning materials, exercises, feedback, tracking, and review should be organized inside this platform.

---

## 2. User Background

### 2.1 Primary User Profile

The primary learner is:

- A PhD candidate majoring in AI theory.
- Strong in mathematical reasoning and academic paper reading.
- Familiar with technical English in papers.
- Weak in practical English usage.
- Needs improvement in listening, speaking, daily reading, and independent writing.
- Has not written papers fully by himself for a long time because AI tools are now very powerful.
- Needs structured daily practice and feedback.

### 2.2 Key Learning Contradiction

The learner may be able to understand academic papers but still struggle with real English communication.

This means the system should not treat “paper reading ability” as equivalent to “English fluency.”

The learner may have:

- Strong passive academic vocabulary.
- Weak active speaking vocabulary.
- Weak listening comprehension.
- Limited daily expression patterns.
- Weak spontaneous sentence construction.
- Low confidence in conversations.
- Limited experience writing full paragraphs without AI assistance.

The product should therefore distinguish between:

1. Academic reading ability.
2. Daily listening ability.
3. Daily speaking ability.
4. Academic speaking ability.
5. Independent writing ability.
6. Vocabulary activation ability.

---

## 3. Core Product Value

FluentLab should not be a simple collection of English learning links. Its value comes from four main capabilities.

### 3.1 One-Stop Learning Center

The website should collect daily learning tasks, materials, practice tools, feedback, and progress tracking in one place.

The learner should not need to decide every day:

- What article to read.
- What audio to listen to.
- What video to watch.
- What words to learn.
- What topic to speak about.
- What writing task to complete.

The system should prepare the daily workload.

### 3.2 Customized Teacher

The system should act as a personalized teacher.

It should adjust difficulty based on:

- The learner’s vocabulary level.
- Listening performance.
- Speaking fluency.
- Writing mistakes.
- Academic needs.
- Feedback from the learner.
- Completion history.
- Error history.

The system should recommend suitable:

- Words.
- Articles.
- Audio clips.
- Videos.
- Speaking topics.
- Writing assignments.
- Review tasks.

### 3.3 Daily Planner

The system should generate a concrete daily study plan.

Example daily plan:

- Read 3 short articles.
- Listen to 4 audio clips.
- Watch 1 short video.
- Practice 3 speaking topics.
- Learn 15 words or expressions.
- Write 1 short paragraph.
- Review yesterday’s mistakes.

The plan should include all required content directly inside the platform or provide clear links to external content.

### 3.4 Overall English Teacher

The product should train all major English capacities:

- Listening.
- Speaking.
- Reading.
- Writing.
- Vocabulary.
- Pronunciation.
- Daily communication.
- Academic communication.
- Research presentation.
- Meeting participation.
- Paper writing.

Different capacities require different methods. The system should not use the same type of exercise for every skill.

---

## 4. Learning Objectives

### 4.1 Daily English Communication

The learner should be able to:

- Introduce himself naturally.
- Talk about daily life.
- Ask for help.
- Make appointments.
- Order food.
- Talk with classmates or colleagues.
- Handle transportation, housing, shopping, banking, healthcare, and administrative conversations.
- Understand common spoken expressions.
- Respond quickly in conversation.
- Speak with acceptable fluency, even if not perfect.

### 4.2 Academic Communication

The learner should be able to:

- Attend research meetings.
- Ask questions after talks.
- Explain his research direction.
- Discuss papers.
- Present research ideas.
- Respond to questions.
- Join group discussions.
- Attend English lectures.
- Understand seminar-style speech.
- Summarize academic content orally.

### 4.3 Academic Writing

The learner should be able to:

- Write research summaries.
- Write paper introductions.
- Describe mathematical ideas clearly.
- Explain motivation and contribution.
- Write related work paragraphs.
- Write emails to professors or collaborators.
- Revise AI-generated drafts critically.
- Produce independent first drafts without relying fully on AI.

### 4.4 Listening

The learner should be able to understand:

- Daily conversations.
- Short educational videos.
- Academic lectures.
- Research presentations.
- Meeting discussions.
- Different accents gradually.

### 4.5 Speaking

The learner should be able to:

- Speak spontaneously.
- Express opinions.
- Explain technical ideas.
- Ask clarification questions.
- Participate in small talk.
- Give short academic presentations.
- Discuss papers verbally.

---

## 5. Product Scope

### 5.1 In Scope for MVP

The MVP should include:

- User onboarding and English level diagnosis.
- Personalized learning profile.
- Daily learning planner.
- Reading practice module.
- Listening practice module.
- Speaking practice module.
- Writing practice module.
- Vocabulary and expression module.
- Academic English module.
- Daily English module.
- Progress tracking.
- Sign-in calendar.
- LLM-based feedback.
- Content recommendation.
- External resource collection.
- Mistake notebook.
- Weekly review.

### 5.2 Out of Scope for MVP

The MVP should not include:

- Large-scale social networking.
- Live human teacher marketplace.
- Full mobile app.
- Payment system.
- Public course marketplace.
- Official IELTS/TOEFL scoring guarantee.
- Fully automated certification.
- Real-time multiplayer classrooms.
- Complex gamification.
- Custom model training.

---

## 6. Core Modules

The product should contain the following core modules.

### 6.1 Home Dashboard

The home dashboard should show:

- Today’s learning plan.
- Completion progress.
- Current streak.
- Daily target time.
- Skill balance:
  - listening
  - speaking
  - reading
  - writing
  - vocabulary
- Recent mistakes.
- Recommended review items.
- Weekly progress summary.

The dashboard should answer one question:

> What should I learn today?

---

### 6.2 Personalized Learning Profile

The system should maintain a dynamic learner profile.

#### 6.2.1 Profile Fields

The profile should include:

```json
{
  "learner_type": "AI theory PhD candidate",
  "daily_english_goal": "live and communicate in English-speaking country",
  "academic_english_goal": "meetings, seminars, research discussion, writing",
  "reading_strength": "academic papers",
  "listening_level": "unknown",
  "speaking_level": "unknown",
  "writing_level": "weak independent writing",
  "vocabulary_profile": {
    "academic_passive_vocabulary": "strong",
    "daily_active_vocabulary": "weak",
    "spoken_expressions": "weak"
  },
  "preferred_topics": [
    "AI theory",
    "machine learning",
    "optimization",
    "research life",
    "daily life abroad"
  ],
  "weaknesses": [
    "listening",
    "speaking",
    "independent writing",
    "daily expressions"
  ]
}
```

#### 6.2.2 Initial Diagnostic Test

The onboarding process should include:

1. Vocabulary self-assessment.
2. Short listening test.
3. Short reading test.
4. Speaking test:
   - self-introduction
   - explain research direction
   - answer daily-life question
5. Writing test:
   - write a daily-life paragraph
   - write a research summary paragraph
6. Learning goal questionnaire.

The system should estimate the learner’s level separately for each skill.

The system should not assign only one global English level, because the learner’s skill levels may be highly uneven.

---

### 6.3 Daily Planner

#### 6.3.1 Core Requirement

The system should generate a concrete daily plan.

The learner should see a clear list of tasks every day.

Example:

```text
Today's Plan

1. Vocabulary
   - Learn 12 daily expressions.
   - Review 8 academic expressions.

2. Listening
   - Listen to 2 daily conversation clips.
   - Listen to 1 short academic talk clip.
   - Complete dictation for 1 clip.

3. Speaking
   - Practice 2 daily conversation topics.
   - Practice 1 academic explanation topic.

4. Reading
   - Read 1 daily English article.
   - Read 1 academic blog or paper abstract.

5. Writing
   - Write 1 daily-life paragraph.
   - Rewrite 1 research motivation paragraph.

6. Review
   - Review yesterday's speaking mistakes.
   - Review 10 saved expressions.
```

#### 6.3.2 Daily Goal Types

Each daily task should have a measurable goal.

Examples:

- Read 3 articles.
- Listen to 4 audio clips.
- Talk about 3 topics.
- Learn 15 words or expressions.
- Write 150 words.
- Revise 1 paragraph.
- Shadow 1 audio clip.
- Complete 1 academic speaking task.

#### 6.3.3 Planner Inputs

The planner should use:

- Target goals.
- Current skill profile.
- Recent mistakes.
- Completion history.
- User feedback.
- Available time.
- Topic preference.
- Difficulty level.
- Review schedule.

#### 6.3.4 Plan Adaptation

The system should adapt future plans based on:

- Completed tasks.
- Skipped tasks.
- Low-score exercises.
- Repeated mistakes.
- User feedback:
  - too easy
  - too hard
  - boring
  - useful
  - not useful
- Learning streak.
- Weak skill detection.

#### 6.3.5 Sign-In Calendar

The system should include a sign-in calendar.

It should show:

- Completed days.
- Missed days.
- Partial completion days.
- Streak count.
- Weekly completion rate.
- Monthly completion rate.
- Skill coverage distribution.

A completed day should require meaningful learning, not simply opening the website.

---

### 6.4 Reading Module

#### 6.4.1 Goal

Improve both daily reading and academic reading fluency.

Although the learner can read academic papers, he may still need practice in:

- Reading natural non-academic English.
- Understanding idioms and daily expressions.
- Reading news, essays, and conversations.
- Reading academic blogs and research explanations faster.
- Summarizing reading content in English.

#### 6.4.2 Reading Content Types

The system should provide:

1. Daily-life articles.
2. News articles.
3. Short essays.
4. Academic blog posts.
5. Research paper abstracts.
6. Paper introductions.
7. Lecture notes.
8. Technical blog posts.
9. Conversation transcripts.
10. Emails and administrative texts.

#### 6.4.3 Reading Exercise Types

For each reading item, the system should provide:

- Key vocabulary.
- Expression explanation.
- Comprehension questions.
- Main idea summary.
- Sentence rewriting.
- Useful phrase extraction.
- Oral summary task.
- Written summary task.

#### 6.4.4 Difficulty Control

The system should classify reading materials by:

- CEFR level.
- Word difficulty.
- Sentence complexity.
- Topic familiarity.
- Academic density.
- Idiom density.
- Length.
- Required background knowledge.

The learner should receive texts slightly above his current level.

#### 6.4.5 Reading Output

After reading, the learner should produce at least one output:

- Answer questions.
- Summarize in English.
- Record a spoken summary.
- Extract useful expressions.
- Rewrite difficult sentences.

Reading should not remain passive.

---

### 6.5 Listening Module

#### 6.5.1 Goal

Improve real listening comprehension for daily life and academic settings.

Listening is likely one of the learner’s core weaknesses. The system should train listening separately from reading.

#### 6.5.2 Listening Content Types

The system should provide:

1. Daily conversations.
2. Short podcasts.
3. YouTube educational clips.
4. Academic lecture clips.
5. Research talk clips.
6. Meeting discussion simulations.
7. Q&A after presentations.
8. Different accents:
   - American English
   - British English
   - international academic English
   - non-native but fluent English

#### 6.5.3 Listening Exercise Types

The system should include:

1. **Gist listening**
   - Understand the main idea.

2. **Detail listening**
   - Answer specific questions.

3. **Dictation**
   - Type what was heard.

4. **Shadowing**
   - Repeat immediately after the speaker.

5. **Retelling**
   - Explain the audio in the learner’s own words.

6. **Vocabulary recognition**
   - Identify key phrases from audio.

7. **Accent adaptation**
   - Listen to the same idea from different speakers.

#### 6.5.4 Listening Difficulty Control

The system should adjust:

- Audio speed.
- Accent difficulty.
- Length.
- Topic familiarity.
- Transcript availability.
- Number of replays.
- Background noise level, later if needed.

#### 6.5.5 Transcript Policy

Each audio item should support three modes:

1. No transcript first.
2. Transcript after attempt.
3. Bilingual or annotated transcript after completion.

The learner should not read the transcript before listening unless the task is designed that way.

---

### 6.6 Speaking Module

#### 6.6.1 Goal

Improve fluency, confidence, pronunciation, and spontaneous expression.

The system should train both:

1. Daily speaking.
2. Academic speaking.

#### 6.6.2 Speaking Practice Types

The system should include:

1. **Daily conversation role-play**
   Examples:
   - introduce yourself
   - order food
   - ask for directions
   - talk to a landlord
   - talk to a doctor
   - small talk with classmates

2. **Academic discussion role-play**
   Examples:
   - explain your research area
   - ask a question after a talk
   - discuss a paper
   - respond to advisor feedback
   - defend a research choice
   - summarize a theorem

3. **Prompted monologue**
   Examples:
   - speak for 1 minute about your day
   - explain one paper you read
   - describe your research problem
   - explain why a method is interesting

4. **Shadowing**
   Repeat after native or fluent speech.

5. **Pronunciation drills**
   Practice difficult sounds, stress, rhythm, and intonation.

6. **Fluency drills**
   Speak under time constraints without overthinking.

#### 6.6.3 Speaking Feedback

The system should provide feedback on:

- Fluency.
- Grammar.
- Vocabulary usage.
- Pronunciation.
- Sentence naturalness.
- Filler words.
- Repeated patterns.
- Clarity.
- Academic appropriateness.

Example feedback:

```json
{
  "fluency_score": 0.68,
  "grammar_score": 0.74,
  "vocabulary_score": 0.71,
  "pronunciation_score": 0.63,
  "main_issues": [
    "Frequent pauses before verbs",
    "Overuse of 'very important'",
    "Unnatural phrase: 'promote my research'"
  ],
  "better_expressions": [
    "present my research",
    "explain my research idea",
    "discuss my research with others"
  ],
  "next_practice": [
    "Practice explaining your research in 90 seconds",
    "Practice asking two questions after a seminar"
  ]
}
```

#### 6.6.4 Academic Speaking Templates

The system should teach reusable academic expressions.

Examples:

- “My research focuses on...”
- “The main motivation is...”
- “The key technical challenge is...”
- “This result suggests that...”
- “Could you clarify what you mean by...?”
- “I am wondering whether this assumption can be relaxed.”
- “How does this compare with...?”
- “One possible limitation is...”

---

### 6.7 Writing Module

#### 6.7.1 Goal

Rebuild the learner’s independent writing ability.

Because AI tools are powerful, the learner may have reduced practice writing by himself. The system should encourage active writing before AI revision.

#### 6.7.2 Writing Practice Types

The system should provide:

1. Daily-life writing:
   - diary
   - email
   - message
   - short opinion
   - personal introduction

2. Academic writing:
   - paper summary
   - research motivation
   - related work paragraph
   - method explanation
   - theorem explanation
   - experiment description
   - presentation script
   - email to professor
   - response to reviewer, later if needed

3. AI-assisted revision:
   - first write independently
   - then receive feedback
   - then revise
   - then compare with model answer

#### 6.7.3 Writing Workflow

The writing module should follow this workflow:

1. The system gives a writing prompt.
2. The learner writes without AI help.
3. The system analyzes the writing.
4. The system gives feedback.
5. The learner revises.
6. The system compares the two versions.
7. The system saves recurring mistakes.

#### 6.7.4 Writing Feedback Dimensions

The system should evaluate:

- Grammar.
- Word choice.
- Sentence structure.
- Logical flow.
- Academic tone.
- Conciseness.
- Clarity.
- Naturalness.
- Repetition.
- Overuse of AI-like phrases.
- Field-specific expression.

#### 6.7.5 Academic Writing Templates

The system should include templates for:

- Research motivation.
- Problem statement.
- Contribution list.
- Related work comparison.
- Method overview.
- Theorem explanation.
- Limitation discussion.
- Future work.
- Academic email.

---

### 6.8 Vocabulary and Expression Module

#### 6.8.1 Goal

Move vocabulary from passive recognition to active usage.

The learner may know many academic words but fail to use them naturally in speech and writing.

The system should focus on:

- Daily expressions.
- Academic expressions.
- Collocations.
- Sentence patterns.
- Speaking-ready phrases.
- Writing-ready phrases.

#### 6.8.2 Vocabulary Types

The system should classify vocabulary into:

1. Daily words.
2. Daily phrases.
3. Academic vocabulary.
4. Research presentation phrases.
5. Meeting phrases.
6. Writing collocations.
7. Field-specific AI/ML expressions.
8. Idioms and informal expressions.

#### 6.8.3 Learning Method

Each word or phrase should include:

- Meaning.
- Example sentence.
- Chinese explanation if needed.
- Usage context.
- Common collocations.
- Similar expressions.
- Speaking example.
- Writing example.
- Practice sentence.
- Review schedule.

#### 6.8.4 Active Recall

The learner should practice:

- English-to-meaning.
- Meaning-to-English.
- Fill in the blank.
- Sentence construction.
- Speaking with the phrase.
- Writing with the phrase.

---

### 6.9 Academic English Module

#### 6.9.1 Goal

Help the learner function in academic environments.

The module should cover:

- Seminars.
- Group meetings.
- Reading groups.
- Advisor meetings.
- Paper discussions.
- Research presentations.
- Course participation.
- Academic writing.

#### 6.9.2 Academic Scenarios

The system should provide scenario-based practice.

Examples:

1. Explain your research direction to a new colleague.
2. Ask a question after a seminar.
3. Challenge an assumption politely.
4. Summarize a paper in 2 minutes.
5. Discuss a theorem.
6. Explain why a proof technique matters.
7. Present a research idea in a group meeting.
8. Respond when you do not understand a speaker.
9. Discuss future work.
10. Write a concise research update email.

#### 6.9.3 AI Theory-Specific Content

Since the learner studies AI theory, the system should include academic content related to:

- Machine learning theory.
- Optimization.
- Generalization.
- Statistical learning theory.
- Reinforcement learning theory.
- Large language model theory.
- Agent research.
- Probability and statistics.
- Convex analysis.
- Algorithms.

The system should use familiar topics to reduce cognitive load when practicing English production.

---

### 6.10 Daily English Module

#### 6.10.1 Goal

Help the learner live comfortably in an English-speaking country.

#### 6.10.2 Scenario Categories

The system should include:

1. Housing.
2. Food.
3. Transportation.
4. Shopping.
5. Healthcare.
6. Banking.
7. University administration.
8. Social life.
9. Travel.
10. Emergencies.
11. Phone calls.
12. Emails and messages.
13. Small talk.
14. Conflict resolution.

#### 6.10.3 Exercise Types

Each scenario should include:

- Useful expressions.
- Listening dialogue.
- Role-play.
- Speaking response.
- Short writing task.
- Cultural note.
- Review quiz.

---

## 7. Personalization Logic

### 7.1 Difficulty Adaptation

The system should estimate difficulty separately for:

- Listening.
- Speaking.
- Reading.
- Writing.
- Vocabulary.
- Academic English.
- Daily English.

The system should adapt using:

- Correctness.
- Completion time.
- Number of replays.
- Speaking hesitation.
- Writing error rate.
- User self-rating.
- Manual feedback.

### 7.2 Feedback Inputs

The learner should be able to label each item:

- Too easy.
- Too hard.
- Useful.
- Not useful.
- Boring.
- Want more like this.
- Want less like this.
- Already know this.
- Need review.

### 7.3 Recommendation Logic

The system should recommend content based on:

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

### 7.4 Skill Gap Detection

The system should identify patterns such as:

- Good reading, weak listening.
- Good comprehension, weak output.
- Knows words but cannot use them.
- Can write with AI but not independently.
- Can explain research in Chinese but not English.
- Can read papers but cannot discuss them orally.

---

## 8. Content Requirements

### 8.1 Internal Content

The system should generate or store:

- Daily conversation scripts.
- Role-play topics.
- Academic speaking prompts.
- Writing prompts.
- Vocabulary cards.
- Grammar mini-lessons.
- Review quizzes.
- Learning plans.
- Feedback reports.

### 8.2 External Content

The system may direct the learner to:

- YouTube videos.
- Podcasts.
- Academic talks.
- University lectures.
- Blog posts.
- News articles.
- Paper abstracts.
- Online dictionaries.
- Pronunciation tools.
- Grammar references.

However, the platform should organize these resources into daily tasks so the learner does not need to search manually.

### 8.3 Content Selection Principles

Content should be:

- Relevant to the learner’s goals.
- Slightly above the learner’s current level.
- Balanced across skills.
- Practical.
- Reusable in real life.
- Connected to output tasks.
- Reviewed over time.

---

## 9. LLM Requirements

### 9.1 LLM Roles

The LLM should act as:

1. Planner.
2. Teacher.
3. Speaking partner.
4. Writing evaluator.
5. Vocabulary coach.
6. Academic discussion partner.
7. Daily conversation partner.
8. Error analyst.
9. Content generator.
10. Progress reviewer.

### 9.2 LLM Feedback Style

Feedback should be:

- Specific.
- Actionable.
- Not too long.
- Focused on repeated mistakes.
- Honest.
- Separated by skill dimension.
- Paired with correction examples.

### 9.3 LLM Safety and Accuracy

The LLM should not:

- Overcorrect acceptable expressions.
- Force unnatural native-speaker style.
- Make the learner dependent on AI rewriting.
- Replace independent writing practice.
- Give vague praise only.
- Provide overly complex expressions too early.

### 9.4 Example Speaking Partner Prompt

```text
You are an English speaking partner for an AI theory PhD student.
The learner wants to improve academic communication and daily fluency.

Task:
Conduct a 5-minute role-play conversation.

Scenario:
The learner is meeting a professor after a seminar and wants to ask about the assumptions behind a theorem.

Rules:
- Ask one question at a time.
- Keep language at the learner's current level.
- After the conversation, provide feedback on fluency, grammar, vocabulary, and academic naturalness.
```

### 9.5 Example Writing Feedback Prompt

```text
You are an academic English writing coach.

The learner first writes independently.
Analyze the text without completely rewriting it at first.

Return:
1. Main idea clarity
2. Grammar issues
3. Word choice issues
4. Sentence structure issues
5. Academic tone issues
6. Three priority improvements
7. A lightly revised version
8. A stronger academic version
9. Phrases the learner should reuse
```

---

## 10. Progress Tracking

### 10.1 Skill Dashboard

The system should show progress in:

- Listening.
- Speaking.
- Reading.
- Writing.
- Vocabulary.
- Daily communication.
- Academic communication.

Each skill should have:

- Current level.
- Recent trend.
- Completed tasks.
- Weaknesses.
- Recommended next actions.

### 10.2 Mistake Notebook

The system should automatically collect:

- Grammar mistakes.
- Pronunciation issues.
- Unnatural expressions.
- Misused words.
- Repeated speaking problems.
- Listening errors.
- Writing weaknesses.

Each mistake should include:

- Original sentence.
- Correction.
- Explanation.
- Similar examples.
- Review task.
- Status:
  - new
  - reviewing
  - improved
  - mastered

### 10.3 Weekly Report

Each week, the system should generate:

- Total study time.
- Completed tasks.
- Skill coverage.
- Top improvements.
- Repeated mistakes.
- Recommended focus for next week.
- Suggested adjustment to daily plan.

---

## 11. UI Requirements

### 11.1 Main Pages

The website should include:

1. Home Dashboard.
2. Daily Plan.
3. Listening Lab.
4. Speaking Room.
5. Reading Hub.
6. Writing Studio.
7. Vocabulary Bank.
8. Academic English.
9. Daily English.
10. Mistake Notebook.
11. Progress Report.
12. Resource Center.
13. Settings.

### 11.2 Daily Plan Page

The Daily Plan page should show:

- Today’s tasks.
- Estimated time.
- Skill category.
- Difficulty.
- Completion checkbox.
- Start button.
- Feedback button.
- “Too easy / too hard” button.
- Review section.

### 11.3 Speaking Room

The Speaking Room should support:

- Audio recording.
- Role-play chat.
- Speaking prompt.
- Transcription.
- Feedback.
- Re-practice.
- Saved useful expressions.

### 11.4 Writing Studio

The Writing Studio should support:

- Prompt.
- Draft editor.
- Submit for feedback.
- Revision editor.
- Version comparison.
- Saved phrases.
- Mistake extraction.

### 11.5 Sign-In Calendar

The sign-in calendar should show:

- Daily completion status.
- Streak.
- Partial days.
- Missed days.
- Monthly view.
- Skill distribution.

---

## 12. Technical Architecture

### 12.1 Frontend

Recommended stack:

- Next.js.
- React.
- TypeScript.
- Tailwind CSS.
- shadcn/ui.

### 12.2 Backend

Recommended stack:

- Python FastAPI.
- PostgreSQL.
- Redis.
- Background scheduler.
- LLM API integration.
- Speech-to-text API.
- Text-to-speech API.

### 12.3 Database

Main tables:

- users
- learner_profiles
- daily_plans
- tasks
- content_items
- practice_attempts
- speaking_records
- writing_drafts
- vocabulary_items
- mistakes
- feedback
- progress_reports
- sign_in_calendar
- resources

### 12.4 AI Services

Possible AI services:

- LLM API for feedback, planning, and content generation.
- Speech-to-text for speaking practice.
- Text-to-speech for listening materials.
- Embeddings for content recommendation.
- Optional pronunciation scoring API.

### 12.5 Compute Requirements

The project can be developed on a MacBook with M3 chip.

For MVP:

- No local large model is required.
- LLM API is recommended.
- Speech-to-text and text-to-speech APIs are recommended.
- Local database is enough for development.

---

## 13. Data Model

### 13.1 Learner Profile

```text
LearnerProfile {
  id
  user_id
  background
  goals
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
}
```

### 13.2 Daily Plan

```text
DailyPlan {
  id
  user_id
  date
  total_estimated_minutes
  target_skills
  status
  completion_rate
  created_at
}
```

### 13.3 Learning Task

```text
LearningTask {
  id
  daily_plan_id
  skill_type
  title
  content_id
  difficulty
  estimated_minutes
  instructions
  status
  score
  feedback
}
```

### 13.4 Content Item

```text
ContentItem {
  id
  content_type
  title
  source
  url
  text
  audio_url
  video_url
  transcript
  difficulty
  topics
  skill_targets
  created_at
}
```

### 13.5 Practice Attempt

```text
PracticeAttempt {
  id
  user_id
  task_id
  input_text
  audio_file
  transcript
  score
  feedback
  mistakes
  completed_at
}
```

### 13.6 Mistake

```text
Mistake {
  id
  user_id
  skill_type
  original_text
  corrected_text
  explanation
  category
  review_status
  next_review_date
  created_at
}
```

---

## 14. MVP Feature List

### 14.1 Must Have

- Learner onboarding.
- Initial diagnostic test.
- Personalized learning profile.
- Daily planner.
- Sign-in calendar.
- Reading module.
- Listening module.
- Speaking module with recording.
- Writing module with feedback.
- Vocabulary module.
- Academic English scenarios.
- Daily English scenarios.
- Mistake notebook.
- Weekly progress report.

### 14.2 Should Have

- Speech-to-text.
- Text-to-speech.
- Role-play conversation.
- Adaptive difficulty.
- External resource center.
- Review schedule.
- Writing version comparison.
- Academic paper discussion practice.

### 14.3 Could Have

- Pronunciation scoring.
- Browser extension.
- Mobile version.
- WeChat reminders.
- Calendar integration.
- Friend/teacher sharing.
- Export progress report.
- Custom academic paper upload.

### 14.4 Won’t Have in MVP

- Human teacher marketplace.
- Payment system.
- Public course platform.
- Complex social features.
- Official exam scoring guarantee.

---

## 15. Roadmap

### Phase 0: Learning Design

Goal: Define learning framework.

Tasks:

- Define target skill categories.
- Define diagnostic test.
- Define daily planner logic.
- Define content difficulty levels.
- Define feedback format.
- Define first set of academic and daily scenarios.

Deliverable:

- Learning framework document.

### Phase 1: MVP Backend

Goal: Build core data and planning system.

Tasks:

- Build user profile.
- Build daily plan model.
- Build task model.
- Build content model.
- Build progress tracking.
- Build sign-in calendar.
- Connect LLM API.

Deliverable:

- Backend can generate and track daily learning plans.

### Phase 2: Learning Modules

Goal: Build core practice modules.

Tasks:

- Build reading practice.
- Build listening practice.
- Build speaking practice.
- Build writing practice.
- Build vocabulary practice.
- Build mistake notebook.

Deliverable:

- Learner can complete daily tasks inside the website.

### Phase 3: Personalization

Goal: Add adaptive teacher behavior.

Tasks:

- Add feedback buttons.
- Add difficulty adaptation.
- Add mistake-based review.
- Add weak-skill detection.
- Add weekly report.

Deliverable:

- The system adjusts future plans based on performance.

### Phase 4: Academic Specialization

Goal: Make the product especially useful for AI researchers.

Tasks:

- Add AI theory academic scenarios.
- Add paper discussion templates.
- Add research presentation practice.
- Add academic writing templates.
- Add paper abstract/intro practice.

Deliverable:

- Product supports academic English for AI research.

### Phase 5: Polish and Expansion

Goal: Improve usability and long-term retention.

Tasks:

- Improve UI.
- Add reminders.
- Add gamification.
- Add export.
- Add mobile-friendly layout.
- Add more external resources.

Deliverable:

- Product becomes useful for long-term daily learning.

---

## 16. Success Metrics

### 16.1 Engagement Metrics

- Daily active use.
- Weekly active use.
- Sign-in streak.
- Daily task completion rate.
- Weekly completion rate.
- Average study time per day.

### 16.2 Learning Metrics

- Listening comprehension score.
- Speaking fluency score.
- Writing quality score.
- Vocabulary retention rate.
- Number of mastered expressions.
- Reduction in repeated mistakes.
- Improvement in academic speaking tasks.
- Improvement in independent writing tasks.

### 16.3 Product Quality Metrics

- Percentage of tasks rated useful.
- Percentage of tasks rated too easy or too hard.
- Completion rate by skill.
- Frequency of planner adjustment.
- User retention after 1 month.

---

## 17. Example Daily Plan

# Today’s English Plan

## Vocabulary — 15 minutes

Learn 10 daily expressions:

1. I’m still getting used to...
2. Could you clarify what you mean by...?
3. I’m not sure I follow.
4. That makes sense.
5. I was wondering if...
6. It depends on...
7. From my perspective...
8. The main issue is...
9. Let me put it this way.
10. I’ll get back to you on that.

Review 5 academic expressions:

1. The key assumption is...
2. This result implies that...
3. The proof relies on...
4. A possible limitation is...
5. This can be generalized to...

## Listening — 25 minutes

1. Daily conversation: renting an apartment.
2. Academic clip: short explanation of generalization in machine learning.
3. Dictation: 60-second seminar Q&A clip.

## Speaking — 25 minutes

1. Role-play: introduce yourself to a new lab member.
2. Academic monologue: explain your research direction in 90 seconds.
3. Meeting practice: ask one clarification question about a theorem.

## Reading — 20 minutes

1. Read one daily-life article.
2. Read one AI research blog paragraph.
3. Summarize each in 3 sentences.

## Writing — 20 minutes

1. Write a 120-word paragraph: “What is my research about?”
2. Revise after feedback.
3. Save 3 reusable academic expressions.

## Review — 10 minutes

1. Review yesterday’s speaking mistakes.
2. Review 8 vocabulary cards.
3. Mark difficult items for tomorrow.

---

## 18. Final Recommendation

FluentLab should be designed as a personalized English coach rather than a generic English learning website.

The key product insight is that the learner is not a beginner. He is a high-level academic learner with uneven English ability:

- strong in academic reading,
- weak in listening and speaking,
- under-practiced in independent writing,
- and in need of real-world daily communication.

Therefore, the product should combine:

1. Daily English survival practice.
2. Academic speaking practice.
3. Independent writing training.
4. Listening-first exercises.
5. Vocabulary activation.
6. Personalized daily planning.
7. Mistake-based review.
8. AI-powered feedback.

The MVP should focus on daily consistency and personalized feedback, not on building a large course library.
