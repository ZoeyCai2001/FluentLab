from __future__ import annotations

from datetime import date
from enum import StrEnum
from typing import Literal

from pydantic import BaseModel, Field, HttpUrl


class Skill(StrEnum):
    LISTENING = "Listening"
    SPEAKING = "Speaking"
    READING = "Reading"
    WRITING = "Writing"
    VOCABULARY = "Vocabulary"
    ACADEMIC = "Academic"
    DAILY = "Daily"


class TaskStatus(StrEnum):
    TODO = "todo"
    DONE = "done"


class LearnerProfile(BaseModel):
    learner_type: str = "AI theory PhD candidate"
    daily_english_goal: str = "Live and communicate in an English-speaking country"
    academic_english_goal: str = "Meetings, seminars, research discussion, and writing"
    listening_level: str = "unknown"
    speaking_level: str = "unknown"
    reading_level: str = "academic reading strong"
    writing_level: str = "weak independent writing"
    vocabulary_level: str = "strong passive academic vocabulary, weak active daily vocabulary"
    preferred_topics: list[str] = Field(default_factory=list)
    weaknesses: list[str] = Field(default_factory=list)


class UserSettings(BaseModel):
    daily_study_target_minutes: int = Field(default=60, ge=15, le=240)
    chinese_explanations: Literal["optional", "enabled", "hidden"] = "optional"
    local_only: bool = True
    speech_to_text_provider: str = "whisper.cpp"
    llm_provider: str = "kimi"


class LearningTask(BaseModel):
    id: str
    title: str
    module: str
    skill: Skill
    difficulty: Literal["A2", "B1", "B2", "C1"]
    minutes: int = Field(ge=1, le=180)
    status: TaskStatus = TaskStatus.TODO
    goal: str
    output: str


class DailyPlan(BaseModel):
    id: str
    plan_date: date
    target_minutes: int
    total_estimated_minutes: int
    completion_rate: float = Field(ge=0, le=1)
    focus: list[Skill]
    tasks: list[LearningTask]


class VocabularyItem(BaseModel):
    id: str
    phrase: str
    meaning: str
    item_type: Literal["Word", "Phrase"] = "Phrase"
    context: Literal["Daily", "Academic", "Writing", "Speaking"]
    example: str
    review_due: str


class Mistake(BaseModel):
    id: str
    skill: Skill
    original: str
    correction: str
    note: str
    status: Literal["new", "reviewing", "improved"]


class ResourceItem(BaseModel):
    id: str
    title: str
    source: str
    type: Literal["Video", "Article", "Podcast", "Lecture", "Tool"]
    skill: Skill
    url: HttpUrl


class ProgressPoint(BaseModel):
    label: str
    minutes: int = Field(ge=0)
    completed: int = Field(ge=0)


class AppState(BaseModel):
    profile: LearnerProfile
    settings: UserSettings
    daily_plan: DailyPlan
    vocabulary: list[VocabularyItem]
    mistakes: list[Mistake]
    resources: list[ResourceItem]
    progress: list[ProgressPoint]


class TaskStatusUpdate(BaseModel):
    status: TaskStatus


class SpeakingPolishRequest(BaseModel):
    topic: str = Field(min_length=3)
    transcript: str = Field(min_length=1)


class SpeakingPolishResponse(BaseModel):
    polished_version: str
    feedback: list[str]
    useful_expressions: list[str]
    recurring_mistakes: list[Mistake]


class WritingFeedbackRequest(BaseModel):
    prompt: str = Field(min_length=3)
    draft: str = Field(min_length=1)


class WritingFeedbackResponse(BaseModel):
    priority_feedback: list[str]
    revised_version: str
    reusable_phrases: list[str]
    extracted_mistakes: list[Mistake]
