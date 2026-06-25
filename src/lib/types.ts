export type Skill =
  | "Listening"
  | "Speaking"
  | "Reading"
  | "Writing"
  | "Vocabulary"
  | "Academic"
  | "Daily";

export type TaskStatus = "todo" | "done";

export type LearningTask = {
  id: string;
  title: string;
  module: string;
  skill: Skill;
  difficulty: "A2" | "B1" | "B2" | "C1";
  minutes: number;
  status: TaskStatus;
  goal: string;
  output: string;
};

export type DailyPlan = {
  id: string;
  planDate: string;
  targetMinutes: number;
  totalEstimatedMinutes: number;
  completionRate: number;
  focus: Skill[];
  tasks: LearningTask[];
};

export type UserSettings = {
  dailyStudyTargetMinutes: number;
  chineseExplanations: "optional" | "enabled" | "hidden";
  localOnly: boolean;
  speechToTextProvider: string;
  llmProvider: string;
};

export type Mistake = {
  id: string;
  skill: Skill;
  original: string;
  correction: string;
  note: string;
  status: "new" | "reviewing" | "improved";
};

export type VocabularyItem = {
  id: string;
  phrase: string;
  meaning: string;
  itemType: "Word" | "Phrase";
  context: "Daily" | "Academic" | "Writing" | "Speaking";
  example: string;
  reviewDue: string;
};

export type ResourceItem = {
  id: string;
  title: string;
  source: string;
  type: "Video" | "Article" | "Podcast" | "Lecture" | "Tool";
  skill: Skill;
  url: string;
};

export type ProgressPoint = {
  label: string;
  minutes: number;
  completed: number;
};

export type WeeklyProgress = {
  points: ProgressPoint[];
  totalMinutes: number;
  completedTasks: number;
  recommendedFocus: Skill[];
};

export type SpeakingPolish = {
  polishedVersion: string;
  feedback: string[];
  usefulExpressions: string[];
  recurringMistakes: Mistake[];
};

export type WritingFeedback = {
  priorityFeedback: string[];
  revisedVersion: string;
  reusablePhrases: string[];
  extractedMistakes: Mistake[];
};
