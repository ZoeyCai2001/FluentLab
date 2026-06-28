import type {
  DailyPlan,
  LearningTask,
  Mistake,
  ProgressPoint,
  ResourceItem,
  SpeakingPolish,
  TaskStatus,
  UserSettings,
  VocabularyItem,
  WeeklyProgress,
  WritingFeedback,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_FLUENTLAB_API_URL ?? "http://127.0.0.1:8001";
const AUTH_TOKEN_KEY = "fluentlab-auth-token";

type ApiTask = Omit<LearningTask, "status"> & {
  status: TaskStatus;
};

type ApiDailyPlan = {
  id: string;
  plan_date: string;
  target_minutes: number;
  total_estimated_minutes: number;
  completion_rate: number;
  focus: DailyPlan["focus"];
  tasks: ApiTask[];
};

type ApiSettings = {
  daily_study_target_minutes: number;
  chinese_explanations: UserSettings["chineseExplanations"];
  local_only: boolean;
  speech_to_text_provider: string;
  llm_provider: string;
};

type ApiVocabulary = Omit<VocabularyItem, "reviewDue" | "itemType"> & {
  item_type?: VocabularyItem["itemType"];
  review_due: string;
};

type ApiWeeklyProgress = {
  points: ProgressPoint[];
  total_minutes: number;
  completed_tasks: number;
  recommended_focus: WeeklyProgress["recommendedFocus"];
};

type ApiSpeakingPolish = {
  polished_version: string;
  feedback: string[];
  useful_expressions: string[];
  recurring_mistakes: Mistake[];
};

type ApiWritingFeedback = {
  priority_feedback: string[];
  revised_version: string;
  reusable_phrases: string[];
  extracted_mistakes: Mistake[];
};

export function getStoredAuthToken(): string {
  if (typeof window === "undefined") {
    return "";
  }
  return window.localStorage.getItem(AUTH_TOKEN_KEY) ?? "";
}

export function clearStoredAuthToken() {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

export async function getAuthStatus(): Promise<boolean> {
  const result = await request<{ auth_required: boolean }>("/api/auth/status", {}, { skipAuth: true });
  return result.auth_required;
}

export async function login(password: string): Promise<string> {
  const result = await request<{ token: string }>(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ password }),
    },
    { skipAuth: true },
  );
  if (typeof window !== "undefined") {
    window.localStorage.setItem(AUTH_TOKEN_KEY, result.token);
  }
  return result.token;
}

export async function getHealth(): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/health`, { cache: "no-store" });
  return response.ok;
}

export async function getTodayPlan(): Promise<DailyPlan> {
  return mapPlan(await request<ApiDailyPlan>("/api/plans/today"));
}

export async function updateTaskStatus(taskId: string, status: TaskStatus): Promise<DailyPlan> {
  return mapPlan(
    await request<ApiDailyPlan>(`/api/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  );
}

export async function getSettings(): Promise<UserSettings> {
  return mapSettings(await request<ApiSettings>("/api/settings"));
}

export async function updateSettings(settings: UserSettings): Promise<UserSettings> {
  return mapSettings(
    await request<ApiSettings>("/api/settings", {
      method: "PUT",
      body: JSON.stringify(unmapSettings(settings)),
    }),
  );
}

export async function getVocabulary(): Promise<VocabularyItem[]> {
  const items = await request<ApiVocabulary[]>("/api/vocabulary");
  return items.map((item) => ({
    ...item,
    itemType: item.item_type ?? "Phrase",
    reviewDue: item.review_due,
  }));
}

export async function getMistakes(): Promise<Mistake[]> {
  return request<Mistake[]>("/api/mistakes");
}

export async function addMistake(mistake: Mistake): Promise<Mistake[]> {
  return request<Mistake[]>("/api/mistakes", {
    method: "POST",
    body: JSON.stringify(mistake),
  });
}

export async function getResources(): Promise<ResourceItem[]> {
  return request<ResourceItem[]>("/api/resources");
}

export async function getWeeklyProgress(): Promise<WeeklyProgress> {
  const result = await request<ApiWeeklyProgress>("/api/progress/weekly");
  return {
    points: result.points,
    totalMinutes: result.total_minutes,
    completedTasks: result.completed_tasks,
    recommendedFocus: result.recommended_focus,
  };
}

export async function polishSpeaking(topic: string, transcript: string): Promise<SpeakingPolish> {
  const result = await request<ApiSpeakingPolish>("/api/speaking/polish", {
    method: "POST",
    body: JSON.stringify({ topic, transcript }),
  });

  return {
    polishedVersion: result.polished_version,
    feedback: result.feedback,
    usefulExpressions: result.useful_expressions,
    recurringMistakes: result.recurring_mistakes,
  };
}

export async function reviewWriting(prompt: string, draft: string): Promise<WritingFeedback> {
  const result = await request<ApiWritingFeedback>("/api/writing/feedback", {
    method: "POST",
    body: JSON.stringify({ prompt, draft }),
  });

  return {
    priorityFeedback: result.priority_feedback,
    revisedVersion: result.revised_version,
    reusablePhrases: result.reusable_phrases,
    extractedMistakes: result.extracted_mistakes,
  };
}

async function request<T>(
  path: string,
  init?: RequestInit,
  options: { skipAuth?: boolean } = {},
): Promise<T> {
  const token = options.skipAuth ? "" : getStoredAuthToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "x-fluentlab-token": token } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`FluentLab API ${response.status}: ${path}`);
  }

  return response.json() as Promise<T>;
}

function mapPlan(plan: ApiDailyPlan): DailyPlan {
  return {
    id: plan.id,
    planDate: plan.plan_date,
    targetMinutes: plan.target_minutes,
    totalEstimatedMinutes: plan.total_estimated_minutes,
    completionRate: plan.completion_rate,
    focus: plan.focus,
    tasks: plan.tasks,
  };
}

function mapSettings(settings: ApiSettings): UserSettings {
  return {
    dailyStudyTargetMinutes: settings.daily_study_target_minutes,
    chineseExplanations: settings.chinese_explanations,
    localOnly: settings.local_only,
    speechToTextProvider: settings.speech_to_text_provider,
    llmProvider: settings.llm_provider,
  };
}

function unmapSettings(settings: UserSettings): ApiSettings {
  return {
    daily_study_target_minutes: settings.dailyStudyTargetMinutes,
    chinese_explanations: settings.chineseExplanations,
    local_only: settings.localOnly,
    speech_to_text_provider: settings.speechToTextProvider,
    llm_provider: settings.llmProvider,
  };
}
