from __future__ import annotations

from datetime import date

from .models import (
    AppState,
    DailyPlan,
    LearnerProfile,
    LearningTask,
    Mistake,
    ProgressPoint,
    ResourceItem,
    UserSettings,
    VocabularyItem,
)


def build_seed_state(today: date | None = None) -> AppState:
    plan_date = today or date.today()
    tasks = [
        LearningTask(
            id="vocab-daily",
            title="Activate 10 daily expressions",
            module="Vocabulary",
            skill="Vocabulary",
            difficulty="B1",
            minutes=10,
            goal="Use each phrase in a short spoken sentence.",
            output="10 original example sentences",
        ),
        LearningTask(
            id="listen-housing",
            title="Listen to an apartment repair dialogue",
            module="Listening Lab",
            skill="Listening",
            difficulty="B1",
            minutes=12,
            goal="Catch the problem, request, and appointment time before reading the transcript.",
            output="3 detail answers",
        ),
        LearningTask(
            id="speak-research",
            title="Explain your research direction",
            module="Speaking Room",
            skill="Speaking",
            difficulty="B2",
            minutes=18,
            goal="Speak for about 3 minutes with a clear problem, motivation, and challenge.",
            output="Recording, transcript, polished version",
        ),
        LearningTask(
            id="read-abstract",
            title="Read and summarize an AI theory abstract",
            module="Reading Hub",
            skill="Reading",
            difficulty="B2",
            minutes=10,
            goal="Find the research question, method, and claimed contribution.",
            output="3-sentence summary",
        ),
        LearningTask(
            id="write-research",
            title="Write a research motivation paragraph",
            module="Writing Studio",
            skill="Writing",
            difficulty="B2",
            minutes=10,
            goal="Write first without AI, then revise from focused feedback.",
            output="120-word draft and revision",
        ),
    ]

    return AppState(
        profile=LearnerProfile(
            preferred_topics=[
                "AI theory",
                "machine learning",
                "optimization",
                "research life",
                "daily life abroad",
            ],
            weaknesses=[
                "listening",
                "speaking",
                "independent writing",
                "daily expressions",
            ],
        ),
        settings=UserSettings(),
        daily_plan=DailyPlan(
            id=f"daily-{plan_date.isoformat()}",
            plan_date=plan_date,
            target_minutes=60,
            total_estimated_minutes=sum(task.minutes for task in tasks),
            completion_rate=0,
            focus=["Speaking", "Listening", "Writing", "Vocabulary"],
            tasks=tasks,
        ),
        vocabulary=[
            VocabularyItem(
                id="clarify",
                phrase="Could you clarify what you mean by...",
                meaning="Ask someone to explain a point more clearly.",
                context="Academic",
                example="Could you clarify what you mean by a weaker assumption?",
                review_due="Today",
            ),
            VocabularyItem(
                id="getting-used",
                phrase="I am still getting used to...",
                meaning="Describe something that is becoming familiar but still difficult.",
                context="Daily",
                example="I am still getting used to speaking up in group meetings.",
                review_due="Today",
            ),
            VocabularyItem(
                id="key-challenge",
                phrase="The key technical challenge is...",
                meaning="Introduce the main hard part of a research problem.",
                context="Speaking",
                example="The key technical challenge is controlling the generalization gap.",
                review_due="Tomorrow",
            ),
        ],
        mistakes=[
            Mistake(
                id="promote-research",
                skill="Speaking",
                original="I want to promote my research to my advisor.",
                correction="I want to present my research to my advisor.",
                note="Use present, explain, or discuss for research ideas. Promote sounds like marketing.",
                status="reviewing",
            ),
            Mistake(
                id="research-about",
                skill="Writing",
                original="My research is about how to make theory better.",
                correction="My research studies how to develop sharper theoretical guarantees for learning algorithms.",
                note="Replace vague academic nouns with the exact object and goal.",
                status="improved",
            ),
        ],
        resources=[
            ResourceItem(
                id="mit-lecture",
                title="MIT OpenCourseWare lecture segments",
                source="MIT OCW",
                type="Lecture",
                skill="Listening",
                url="https://ocw.mit.edu",
            ),
            ResourceItem(
                id="arxiv-abstracts",
                title="Recent paper abstracts for summary practice",
                source="arXiv",
                type="Article",
                skill="Reading",
                url="https://arxiv.org",
            ),
        ],
        progress=[
            ProgressPoint(label="Mon", minutes=46, completed=4),
            ProgressPoint(label="Tue", minutes=62, completed=5),
            ProgressPoint(label="Wed", minutes=35, completed=3),
            ProgressPoint(label="Thu", minutes=58, completed=4),
            ProgressPoint(label="Fri", minutes=0, completed=0),
            ProgressPoint(label="Sat", minutes=0, completed=0),
            ProgressPoint(label="Sun", minutes=0, completed=0),
        ],
    )
