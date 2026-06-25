from __future__ import annotations

import re

from ..models import Mistake, SpeakingPolishResponse, WritingFeedbackResponse


def polish_speaking(topic: str, transcript: str) -> SpeakingPolishResponse:
    clean = _normalize_spaces(transcript)
    polished = _polish_research_language(clean)

    if len(polished.split()) < 24:
        polished = (
            f"On the topic of {topic.lower()}, I would explain the context first, "
            f"then state the main point clearly, give one concrete example, and close "
            f"with what I still want to understand better. {polished}"
        )

    return SpeakingPolishResponse(
        polished_version=polished,
        feedback=[
            "State the main point earlier so the listener can follow the structure.",
            "Replace vague phrases with concrete academic nouns.",
            "Use one closing sentence to summarize what you want the listener to remember.",
        ],
        useful_expressions=[
            "My research focuses on...",
            "The key technical challenge is...",
            "One reason this matters is...",
            "A possible limitation is...",
        ],
        recurring_mistakes=[
            Mistake(
                id="speaking-vague-research",
                skill="Speaking",
                original="My research is about making theory better.",
                correction="My research studies how to develop sharper theoretical guarantees.",
                note="Replace broad phrases with the object, method, and goal of the work.",
                status="new",
            )
        ],
    )


def review_writing(prompt: str, draft: str) -> WritingFeedbackResponse:
    clean = _normalize_spaces(draft)
    revised = _polish_research_language(clean)

    if "matters" not in revised.lower() and "important" not in revised.lower():
        revised = f"{revised} This matters because clearer theory can make learning algorithms easier to trust, compare, and improve."

    return WritingFeedbackResponse(
        priority_feedback=[
            "Make the motivation explicit before describing the technical work.",
            "Use more precise nouns than problem, thing, or better.",
            "Keep one paragraph focused on one research claim.",
        ],
        revised_version=revised,
        reusable_phrases=[
            "This problem matters because...",
            "The central difficulty is...",
            "This perspective suggests that...",
        ],
        extracted_mistakes=[
            Mistake(
                id="writing-vague-theory",
                skill="Writing",
                original="make theory better",
                correction="develop sharper theoretical guarantees",
                note=f"The writing prompt asks for motivation: {prompt}",
                status="new",
            )
        ],
    )


def _normalize_spaces(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def _polish_research_language(text: str) -> str:
    replacements = {
        "My research is about": "My research focuses on",
        "my research is about": "my research focuses on",
        "make theory better": "develop sharper theoretical guarantees",
        "making theory better": "developing sharper theoretical guarantees",
        "the theory is not always clear": "existing theory does not always explain the observed behavior",
        "current bounds are sometimes loose": "many existing bounds are too loose to explain real behavior",
        "I want to understand": "I aim to understand",
        "very important": "important",
    }

    polished = text
    for source, target in replacements.items():
        polished = polished.replace(source, target)

    if polished and polished[-1] not in ".!?":
        polished = f"{polished}."

    return polished
