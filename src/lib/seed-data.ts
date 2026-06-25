import type { LearningTask, Mistake, ProgressPoint, ResourceItem, VocabularyItem } from "./types";

export const initialTasks: LearningTask[] = [
  {
    id: "vocab-daily",
    title: "Activate 10 daily expressions",
    module: "Vocabulary",
    skill: "Vocabulary",
    difficulty: "B1",
    minutes: 10,
    status: "todo",
    goal: "Use each phrase in a short spoken sentence.",
    output: "10 original example sentences",
  },
  {
    id: "listen-housing",
    title: "Listen to an apartment repair dialogue",
    module: "Listening Lab",
    skill: "Listening",
    difficulty: "B1",
    minutes: 12,
    status: "todo",
    goal: "Catch the problem, request, and appointment time before reading the transcript.",
    output: "3 detail answers",
  },
  {
    id: "speak-research",
    title: "Explain your research direction",
    module: "Speaking Room",
    skill: "Speaking",
    difficulty: "B2",
    minutes: 18,
    status: "todo",
    goal: "Speak for about 3 minutes with a clear problem, motivation, and challenge.",
    output: "Recording, transcript, polished version",
  },
  {
    id: "read-abstract",
    title: "Read and summarize an AI theory abstract",
    module: "Reading Hub",
    skill: "Reading",
    difficulty: "B2",
    minutes: 10,
    status: "todo",
    goal: "Find the research question, method, and claimed contribution.",
    output: "3-sentence summary",
  },
  {
    id: "write-research",
    title: "Write a research motivation paragraph",
    module: "Writing Studio",
    skill: "Writing",
    difficulty: "B2",
    minutes: 10,
    status: "todo",
    goal: "Write first without AI, then revise from focused feedback.",
    output: "120-word draft and revision",
  },
];
export const vocabulary: VocabularyItem[] = [
  {
    id: "clarify",
    phrase: "Could you clarify what you mean by...",
    meaning: "Ask someone to explain a point more clearly.",
    context: "Academic",
    example: "Could you clarify what you mean by a weaker assumption?",
    reviewDue: "Today",
  },
  {
    id: "getting-used",
    phrase: "I am still getting used to...",
    meaning: "Describe something that is becoming familiar but still difficult.",
    context: "Daily",
    example: "I am still getting used to speaking up in group meetings.",
    reviewDue: "Today",
  },
  {
    id: "key-challenge",
    phrase: "The key technical challenge is...",
    meaning: "Introduce the main hard part of a research problem.",
    context: "Speaking",
    example: "The key technical challenge is controlling the generalization gap.",
    reviewDue: "Tomorrow",
  },
  {
    id: "suggests-that",
    phrase: "This result suggests that...",
    meaning: "Explain what a result may imply.",
    context: "Writing",
    example: "This result suggests that the bound can be improved under smoothness.",
    reviewDue: "Friday",
  },
];

export const mistakes: Mistake[] = [
  {
    id: "promote-research",
    skill: "Speaking",
    original: "I want to promote my research to my advisor.",
    correction: "I want to present my research to my advisor.",
    note: "Use present, explain, or discuss for research ideas. Promote sounds like marketing.",
    status: "reviewing",
  },
  {
    id: "listen-question",
    skill: "Listening",
    original: "Missed appointment time in housing dialogue.",
    correction: "Listen for time markers after repair or appointment verbs.",
    note: "Focus on phrases such as come by, available, schedule, and slot.",
    status: "new",
  },
  {
    id: "research-about",
    skill: "Writing",
    original: "My research is about how to make theory better.",
    correction: "My research studies how to develop sharper theoretical guarantees for learning algorithms.",
    note: "Replace vague academic nouns with the exact object and goal.",
    status: "improved",
  },
];

export const resources: ResourceItem[] = [
  {
    id: "mit-lecture",
    title: "MIT OpenCourseWare lecture segments",
    source: "MIT OCW",
    type: "Lecture",
    skill: "Listening",
    url: "https://ocw.mit.edu",
  },
  {
    id: "arxiv-abstracts",
    title: "Recent paper abstracts for summary practice",
    source: "arXiv",
    type: "Article",
    skill: "Reading",
    url: "https://arxiv.org",
  },
  {
    id: "youglish",
    title: "Expression pronunciation examples",
    source: "YouGlish",
    type: "Tool",
    skill: "Speaking",
    url: "https://youglish.com",
  },
  {
    id: "voa-learning",
    title: "Slow daily English listening",
    source: "VOA Learning English",
    type: "Podcast",
    skill: "Listening",
    url: "https://learningenglish.voanews.com",
  },
];

export const progress: ProgressPoint[] = [
  { label: "Mon", minutes: 46, completed: 4 },
  { label: "Tue", minutes: 62, completed: 5 },
  { label: "Wed", minutes: 35, completed: 3 },
  { label: "Thu", minutes: 58, completed: 4 },
  { label: "Fri", minutes: 0, completed: 0 },
  { label: "Sat", minutes: 0, completed: 0 },
  { label: "Sun", minutes: 0, completed: 0 },
];

export const speakingTopics = [
  "Explain your research direction to a new lab member.",
  "Describe a housing repair issue to a landlord.",
  "Summarize one paper you read this week.",
  "Ask a question after a seminar about a theorem assumption.",
];
