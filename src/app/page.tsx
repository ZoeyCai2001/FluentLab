"use client";

import {
  BarChart3,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  Circle,
  ClipboardList,
  FileText,
  Gauge,
  Library,
  Mic,
  NotebookTabs,
  Play,
  RefreshCcw,
  Settings,
  Sparkles,
  Square,
  Volume2,
  Wand2,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getHealth,
  getMistakes,
  getResources,
  getSettings,
  getTodayPlan,
  getVocabulary,
  getWeeklyProgress,
  polishSpeaking,
  reviewWriting,
  updateSettings,
  updateTaskStatus,
} from "@/lib/api";
import {
  initialTasks,
  mistakes as fallbackMistakes,
  progress as fallbackProgress,
  resources as fallbackResources,
  speakingTopics,
  vocabulary as fallbackVocabulary,
} from "@/lib/seed-data";
import type {
  LearningTask,
  Mistake,
  ProgressPoint,
  ResourceItem,
  Skill,
  UserSettings,
  VocabularyItem,
} from "@/lib/types";

type View =
  | "dashboard"
  | "daily-plan"
  | "speaking"
  | "writing"
  | "vocabulary"
  | "mistakes"
  | "progress"
  | "resources"
  | "settings";

type NavItem = {
  id: View;
  label: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Gauge },
  { id: "daily-plan", label: "Daily Plan", icon: ClipboardList },
  { id: "speaking", label: "Speaking Room", icon: Mic },
  { id: "writing", label: "Writing Studio", icon: FileText },
  { id: "vocabulary", label: "Vocabulary Bank", icon: BookOpen },
  { id: "mistakes", label: "Mistake Notebook", icon: NotebookTabs },
  { id: "progress", label: "Progress Report", icon: BarChart3 },
  { id: "resources", label: "Resource Center", icon: Library },
  { id: "settings", label: "Settings", icon: Settings },
];

const skillTargets: Record<Skill, number> = {
  Listening: 44,
  Speaking: 38,
  Reading: 72,
  Writing: 41,
  Vocabulary: 56,
  Academic: 66,
  Daily: 49,
};

const pageMeta: Record<View, { eyebrow: string; title: string; copy: string }> = {
  dashboard: {
    eyebrow: "Today",
    title: "What should I learn today?",
    copy: "A 60-minute plan balanced around active speaking, listening, writing, vocabulary, and academic output.",
  },
  "daily-plan": {
    eyebrow: "Plan",
    title: "Daily Learning Plan",
    copy: "Each task has a measurable output so learning does not stay passive.",
  },
  speaking: {
    eyebrow: "Speaking",
    title: "3-Minute Speaking Room",
    copy: "Pick a topic, record a monologue, review the transcript, and read after a polished version.",
  },
  writing: {
    eyebrow: "Writing",
    title: "Writing Studio",
    copy: "Write first, then compare a focused revision against the original draft.",
  },
  vocabulary: {
    eyebrow: "Vocabulary",
    title: "Vocabulary Bank",
    copy: "Practice reusable phrases that can move from passive recognition into active speech and writing.",
  },
  mistakes: {
    eyebrow: "Review",
    title: "Mistake Notebook",
    copy: "Recurring mistakes are saved as review items with corrections and next actions.",
  },
  progress: {
    eyebrow: "Progress",
    title: "Weekly Progress",
    copy: "Track study time, task completion, streak, and skill balance.",
  },
  resources: {
    eyebrow: "Sources",
    title: "Free Resource Center",
    copy: "Open and free sources are organized into learning tasks instead of left as loose links.",
  },
  settings: {
    eyebrow: "Profile",
    title: "Learning Settings",
    copy: "Single-user local settings for the first FluentLab build.",
  },
};

const sampleTranscript =
  "My research is about learning theory. I want to understand why some algorithms generalize well. The main problem is that current bounds are sometimes loose. I am interested in assumptions that make the theory more practical.";

const polishedSpeech =
  "My research focuses on learning theory, especially why some algorithms generalize well in practice. The main challenge is that many existing bounds are still too loose to explain real behavior. I am interested in identifying assumptions that make the theory sharper, more interpretable, and closer to practical machine learning systems.";

const writingPrompt =
  "Write 120 words explaining why your current research problem matters. Start without AI help, then revise from feedback.";

export default function Home() {
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [tasks, setTasks] = useState<LearningTask[]>(initialTasks);
  const [settings, setSettings] = useState<UserSettings>({
    dailyStudyTargetMinutes: 60,
    chineseExplanations: "optional",
    localOnly: true,
    speechToTextProvider: "whisper.cpp",
    llmProvider: "kimi",
  });
  const [vocabularyItems, setVocabularyItems] = useState<VocabularyItem[]>(fallbackVocabulary);
  const [mistakeItems, setMistakeItems] = useState<Mistake[]>(fallbackMistakes);
  const [resourceItems, setResourceItems] = useState<ResourceItem[]>(fallbackResources);
  const [progressPoints, setProgressPoints] = useState<ProgressPoint[]>(fallbackProgress);
  const [apiLive, setApiLive] = useState(false);
  const [apiMessage, setApiMessage] = useState("Loading backend data...");
  const [selectedTopic, setSelectedTopic] = useState(speakingTopics[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState(sampleTranscript);
  const [showPolish, setShowPolish] = useState(true);
  const [polishedVersion, setPolishedVersion] = useState(polishedSpeech);
  const [speakingFeedback, setSpeakingFeedback] = useState<string[]>([]);
  const [speakingExpressions, setSpeakingExpressions] = useState<string[]>([]);
  const [isPolishing, setIsPolishing] = useState(false);
  const [draft, setDraft] = useState(
    "My research is about understanding why machine learning algorithms work. This problem is important because many methods perform well, but the theory is not always clear. I want to study conditions that can explain generalization better.",
  );
  const [revision, setRevision] = useState(
    "My research studies why machine learning algorithms generalize well beyond their training data. This problem matters because many practical methods perform strongly, while existing theory often gives bounds that are too loose to explain their behavior. I want to identify conditions that lead to sharper and more useful guarantees.",
  );
  const [writingFeedback, setWritingFeedback] = useState<string[]>([]);
  const [writingPhrases, setWritingPhrases] = useState<string[]>([]);
  const [isReviewingWriting, setIsReviewingWriting] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const dailyTarget = settings.dailyStudyTargetMinutes;
  const chineseOptional = settings.chineseExplanations !== "hidden";
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const completedMinutes = tasks
    .filter((task) => task.status === "done")
    .reduce((sum, task) => sum + task.minutes, 0);
  const totalMinutes = tasks.reduce((sum, task) => sum + task.minutes, 0);
  const planProgress = Math.round((completedTasks / tasks.length) * 100);

  const skillMinutes = useMemo(() => {
    return tasks.reduce(
      (acc, task) => {
        acc[task.skill] = (acc[task.skill] ?? 0) + task.minutes;
        return acc;
      },
      {} as Partial<Record<Skill, number>>,
    );
  }, [tasks]);

  const meta = pageMeta[activeView];

  useEffect(() => {
    let cancelled = false;

    async function loadBackendData() {
      try {
        const [health, plan, apiSettings, apiVocabulary, apiMistakes, apiResources, weeklyProgress] =
          await Promise.all([
            getHealth(),
            getTodayPlan(),
            getSettings(),
            getVocabulary(),
            getMistakes(),
            getResources(),
            getWeeklyProgress(),
          ]);

        if (cancelled) {
          return;
        }

        setApiLive(health);
        setApiMessage("Backend API live");
        setTasks(plan.tasks);
        setSettings(apiSettings);
        setVocabularyItems(apiVocabulary);
        setMistakeItems(apiMistakes);
        setResourceItems(apiResources);
        setProgressPoints(weeklyProgress.points);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(error);
        setApiLive(false);
        setApiMessage("Backend offline, using local fallback data");
      }
    }

    void loadBackendData();

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleTask = async (taskId: string) => {
    const currentTask = tasks.find((task) => task.id === taskId);
    if (!currentTask) {
      return;
    }

    const nextStatus = currentTask.status === "done" ? "todo" : "done";

    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? { ...task, status: nextStatus }
          : task,
      ),
    );

    try {
      const plan = await updateTaskStatus(taskId, nextStatus);
      setTasks(plan.tasks);
      setApiLive(true);
      setApiMessage("Backend API live");
    } catch (error) {
      console.error(error);
      setApiLive(false);
      setApiMessage("Could not save task status to backend");
    }
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    chunksRef.current = [];
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      setAudioUrl(URL.createObjectURL(blob));
      stream.getTracks().forEach((track) => track.stop());
    };

    mediaRecorderRef.current = recorder;
    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const speakPolishedVersion = () => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(polishedVersion);
    utterance.lang = "en-US";
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  };

  const requestSpeakingPolish = async () => {
    setIsPolishing(true);
    try {
      const result = await polishSpeaking(selectedTopic, transcript);
      setPolishedVersion(result.polishedVersion);
      setSpeakingFeedback(result.feedback);
      setSpeakingExpressions(result.usefulExpressions);
      setShowPolish(true);
      setApiLive(true);
      setApiMessage("Backend API live");
    } catch (error) {
      console.error(error);
      setApiLive(false);
      setApiMessage("Could not request backend speaking polish");
      setShowPolish(true);
    } finally {
      setIsPolishing(false);
    }
  };

  const requestWritingFeedback = async () => {
    setIsReviewingWriting(true);
    try {
      const result = await reviewWriting(writingPrompt, draft);
      setRevision(result.revisedVersion);
      setWritingFeedback(result.priorityFeedback);
      setWritingPhrases(result.reusablePhrases);
      setApiLive(true);
      setApiMessage("Backend API live");
    } catch (error) {
      console.error(error);
      setApiLive(false);
      setApiMessage("Could not request backend writing feedback");
    } finally {
      setIsReviewingWriting(false);
    }
  };

  const saveSettings = async (nextSettings: UserSettings) => {
    setSettings(nextSettings);
    try {
      const saved = await updateSettings(nextSettings);
      setSettings(saved);
      setApiLive(true);
      setApiMessage("Backend API live");
    } catch (error) {
      console.error(error);
      setApiLive(false);
      setApiMessage("Could not save settings to backend");
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">FL</div>
          <div>
            <h1 className="brand-title">FluentLab</h1>
            <p className="brand-subtitle">English training system</p>
          </div>
        </div>

        <nav className="nav-list" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-button ${activeView === item.id ? "active" : ""}`}
                onClick={() => setActiveView(item.id)}
                type="button"
              >
                <Icon size={17} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">{meta.eyebrow}</p>
            <h2 className="page-title">{meta.title}</h2>
            <p className="page-copy">{meta.copy}</p>
          </div>
          <div className="top-actions">
            <span className="pill">
              <CalendarDays size={15} aria-hidden="true" />
              Jun 25
            </span>
            <span className="pill">
              <Sparkles size={15} aria-hidden="true" />
              4-day streak
            </span>
            <span className={`pill ${apiLive ? "api-live" : "api-offline"}`}>
              {apiMessage}
            </span>
          </div>
        </header>

        {activeView === "dashboard" && (
          <DashboardView
            completedMinutes={completedMinutes}
            completedTasks={completedTasks}
            dailyTarget={dailyTarget}
            planProgress={planProgress}
            skillMinutes={skillMinutes}
            tasks={tasks}
            totalMinutes={totalMinutes}
            mistakes={mistakeItems}
            onOpenPlan={() => setActiveView("daily-plan")}
            onToggleTask={toggleTask}
          />
        )}

        {activeView === "daily-plan" && (
          <DailyPlanView tasks={tasks} onToggleTask={toggleTask} />
        )}

        {activeView === "speaking" && (
          <SpeakingView
            audioUrl={audioUrl}
            feedback={speakingFeedback}
            isRecording={isRecording}
            isPolishing={isPolishing}
            onPolish={requestSpeakingPolish}
            onSelectTopic={setSelectedTopic}
            onSpeak={speakPolishedVersion}
            onStart={startRecording}
            onStop={stopRecording}
            polishedVisible={showPolish}
            polishedVersion={polishedVersion}
            selectedTopic={selectedTopic}
            transcript={transcript}
            usefulExpressions={speakingExpressions}
            onTranscriptChange={setTranscript}
          />
        )}

        {activeView === "writing" && (
          <WritingView
            draft={draft}
            feedback={writingFeedback}
            isReviewing={isReviewingWriting}
            onDraftChange={setDraft}
            onReview={requestWritingFeedback}
            onRevisionChange={setRevision}
            reusablePhrases={writingPhrases}
            revision={revision}
          />
        )}

        {activeView === "vocabulary" && <VocabularyView vocabulary={vocabularyItems} />}
        {activeView === "mistakes" && <MistakesView mistakes={mistakeItems} />}
        {activeView === "progress" && <ProgressView progress={progressPoints} />}
        {activeView === "resources" && <ResourcesView resources={resourceItems} />}
        {activeView === "settings" && (
          <SettingsView
            chineseOptional={chineseOptional}
            dailyTarget={dailyTarget}
            llmProvider={settings.llmProvider}
            speechToTextProvider={settings.speechToTextProvider}
            onChineseOptionalChange={(value) =>
              void saveSettings({
                ...settings,
                chineseExplanations: value ? "optional" : "hidden",
              })
            }
            onDailyTargetChange={(value) =>
              void saveSettings({ ...settings, dailyStudyTargetMinutes: value })
            }
          />
        )}
      </main>
    </div>
  );
}

function DashboardView({
  completedMinutes,
  completedTasks,
  dailyTarget,
  planProgress,
  skillMinutes,
  tasks,
  totalMinutes,
  mistakes,
  onOpenPlan,
  onToggleTask,
}: {
  completedMinutes: number;
  completedTasks: number;
  dailyTarget: number;
  planProgress: number;
  skillMinutes: Partial<Record<Skill, number>>;
  tasks: LearningTask[];
  totalMinutes: number;
  mistakes: Mistake[];
  onOpenPlan: () => void;
  onToggleTask: (taskId: string) => void | Promise<void>;
}) {
  return (
    <div>
      <section className="metric-grid" aria-label="Daily summary">
        <Metric label="Done today" value={`${completedTasks}/${tasks.length}`} />
        <Metric label="Study minutes" value={`${completedMinutes}/${dailyTarget}`} />
        <Metric label="Plan load" value={`${totalMinutes}m`} />
        <Metric label="Completion" value={`${planProgress}%`} />
      </section>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Today&apos;s Plan</h3>
            <button className="secondary-button" type="button" onClick={onOpenPlan}>
              Open <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
          <div className="panel-body">
            <TaskList tasks={tasks} onToggleTask={onToggleTask} />
          </div>
        </section>

        <div className="stack">
          <section className="panel">
            <div className="panel-header">
              <h3 className="panel-title">Skill Balance</h3>
              <span className="tag">minutes</span>
            </div>
            <div className="panel-body">
              <div className="skill-bars">
                {Object.entries(skillTargets).map(([skill, target]) => (
                  <SkillBar
                    key={skill}
                    label={skill}
                    value={skillMinutes[skill as Skill] ?? 0}
                    max={target}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h3 className="panel-title">Review Queue</h3>
              <span className="tag">{mistakes.length} items</span>
            </div>
            <div className="panel-body stack">
              {mistakes.slice(0, 2).map((item) => (
                <div className="mistake-item" key={item.id}>
                  <span className={`tag skill-${item.skill}`}>{item.skill}</span>
                  <p>{item.correction}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function DailyPlanView({
  tasks,
  onToggleTask,
}: {
  tasks: LearningTask[];
  onToggleTask: (taskId: string) => void | Promise<void>;
}) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h3 className="panel-title">Task Queue</h3>
        <span className="tag">{tasks.reduce((sum, task) => sum + task.minutes, 0)} minutes</span>
      </div>
      <div className="panel-body">
        <TaskList tasks={tasks} onToggleTask={onToggleTask} expanded />
      </div>
    </section>
  );
}

function SpeakingView({
  audioUrl,
  feedback,
  isRecording,
  isPolishing,
  onPolish,
  onSelectTopic,
  onSpeak,
  onStart,
  onStop,
  polishedVisible,
  polishedVersion,
  selectedTopic,
  transcript,
  usefulExpressions,
  onTranscriptChange,
}: {
  audioUrl: string | null;
  feedback: string[];
  isRecording: boolean;
  isPolishing: boolean;
  onPolish: () => void | Promise<void>;
  onSelectTopic: (topic: string) => void;
  onSpeak: () => void;
  onStart: () => void;
  onStop: () => void;
  polishedVisible: boolean;
  polishedVersion: string;
  selectedTopic: string;
  transcript: string;
  usefulExpressions: string[];
  onTranscriptChange: (value: string) => void;
}) {
  return (
    <div className="speech-stage">
      <section className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Monologue Topic</h3>
          <span className="tag skill-Speaking">3 minutes</span>
        </div>
        <div className="panel-body form-grid">
          <div className="field">
            <label htmlFor="topic">Topic</label>
            <select
              className="select"
              id="topic"
              value={selectedTopic}
              onChange={(event) => onSelectTopic(event.target.value)}
            >
              {speakingTopics.map((topic) => (
                <option key={topic}>{topic}</option>
              ))}
            </select>
          </div>

          <div className="recording-meter">
            <div>
              <strong>{isRecording ? "Recording" : "Ready"}</strong>
              <p className="task-detail">Target structure: context, main point, one example, closing sentence.</p>
            </div>
            <div className="meter-dots" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((dot) => (
                <span className={`meter-dot ${isRecording && dot < 3 ? "active" : ""}`} key={dot} />
              ))}
            </div>
            {isRecording ? (
              <button className="primary-button" type="button" onClick={onStop}>
                <Square size={16} aria-hidden="true" />
                Stop
              </button>
            ) : (
              <button className="primary-button" type="button" onClick={onStart}>
                <Mic size={16} aria-hidden="true" />
                Record
              </button>
            )}
          </div>

          {audioUrl && (
            <audio controls src={audioUrl} aria-label="Recorded speaking attempt">
              <track kind="captions" />
            </audio>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Transcript and Polish</h3>
          <div className="top-actions">
            <button className="secondary-button" type="button" onClick={() => void onPolish()}>
              <Wand2 size={16} aria-hidden="true" />
              {isPolishing ? "Polishing" : "Polish"}
            </button>
            <button className="secondary-button" type="button" onClick={onSpeak}>
              <Volume2 size={16} aria-hidden="true" />
              Read
            </button>
          </div>
        </div>
        <div className="panel-body compare-grid">
          <div className="field">
            <label htmlFor="transcript">Original transcript</label>
            <textarea
              className="textarea"
              id="transcript"
              value={transcript}
              onChange={(event) => onTranscriptChange(event.target.value)}
            />
          </div>
          <div className="field">
            <label>Polished version</label>
            <div className="text-box">{polishedVisible ? polishedVersion : "Submit a transcript to create a polished version."}</div>
          </div>
        </div>
      </section>

      {(feedback.length > 0 || usefulExpressions.length > 0) && (
        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Backend Feedback</h3>
            <span className="tag">FastAPI</span>
          </div>
          <div className="panel-body two-column">
            <div className="mistake-item">
              <h3 className="task-title">Priority feedback</h3>
              {feedback.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
            <div className="mistake-item">
              <h3 className="task-title">Useful expressions</h3>
              {usefulExpressions.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function WritingView({
  draft,
  feedback,
  isReviewing,
  onDraftChange,
  onReview,
  onRevisionChange,
  reusablePhrases,
  revision,
}: {
  draft: string;
  feedback: string[];
  isReviewing: boolean;
  onDraftChange: (value: string) => void;
  onReview: () => void | Promise<void>;
  onRevisionChange: (value: string) => void;
  reusablePhrases: string[];
  revision: string;
}) {
  return (
    <div className="stack">
      <section className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Prompt</h3>
          <span className="tag skill-Writing">120 words</span>
        </div>
        <div className="panel-body">
          <p className="page-copy">{writingPrompt}</p>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Draft and Revision</h3>
          <button className="secondary-button" type="button" onClick={() => void onReview()}>
            <RefreshCcw size={16} aria-hidden="true" />
            {isReviewing ? "Reviewing" : "Review"}
          </button>
        </div>
        <div className="panel-body compare-grid">
          <div className="field">
            <label htmlFor="draft">First draft</label>
            <textarea
              className="textarea"
              id="draft"
              value={draft}
              onChange={(event) => onDraftChange(event.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="revision">Revision</label>
            <textarea
              className="textarea"
              id="revision"
              value={revision}
              onChange={(event) => onRevisionChange(event.target.value)}
            />
          </div>
        </div>
      </section>

      {(feedback.length > 0 || reusablePhrases.length > 0) && (
        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Backend Writing Feedback</h3>
            <span className="tag">FastAPI</span>
          </div>
          <div className="panel-body two-column">
            <div className="mistake-item">
              <h3 className="task-title">Priority feedback</h3>
              {feedback.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
            <div className="mistake-item">
              <h3 className="task-title">Reusable phrases</h3>
              {reusablePhrases.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function VocabularyView({ vocabulary }: { vocabulary: VocabularyItem[] }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h3 className="panel-title">Review Cards</h3>
        <span className="tag">{vocabulary.length} phrases</span>
      </div>
      <div className="panel-body two-column">
        {vocabulary.map((item) => (
          <article className="vocab-item" key={item.id}>
            <span className={`tag skill-${item.context === "Daily" ? "Daily" : "Academic"}`}>
              {item.context}
            </span>
            <h3 className="task-title">{item.phrase}</h3>
            <p>{item.meaning}</p>
            <p>{item.example}</p>
            <span className="tag">Review: {item.reviewDue}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function MistakesView({ mistakes }: { mistakes: Mistake[] }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h3 className="panel-title">Saved Mistakes</h3>
        <span className="tag">{mistakes.length} active</span>
      </div>
      <div className="panel-body stack">
        {mistakes.map((item) => (
          <article className="mistake-item" key={item.id}>
            <div className="task-meta">
              <span className={`tag skill-${item.skill}`}>{item.skill}</span>
              <span className="tag">{item.status}</span>
            </div>
            <p>
              <strong>Original:</strong> {item.original}
            </p>
            <p>
              <strong>Better:</strong> {item.correction}
            </p>
            <p>{item.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProgressView({ progress }: { progress: ProgressPoint[] }) {
  const maxMinutes = Math.max(...progress.map((point) => point.minutes), 1);

  return (
    <div className="two-column">
      <section className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Study Minutes</h3>
          <span className="tag">week</span>
        </div>
        <div className="panel-body">
          <div className="mini-chart">
            {progress.map((point) => (
              <div className="chart-column" key={point.label}>
                <div
                  className="chart-bar"
                  style={{ height: `${Math.max(6, (point.minutes / maxMinutes) * 150)}px` }}
                  title={`${point.minutes} minutes`}
                />
                <span className="chart-label">{point.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Sign-In Calendar</h3>
          <span className="tag">June</span>
        </div>
        <div className="panel-body">
          <div className="calendar-grid">
            {progress.map((point) => (
              <div className="calendar-day" key={point.label}>
                <strong>{point.label}</strong>
                <span className={`tag ${point.completed ? "skill-Daily" : ""}`}>
                  {point.completed ? `${point.completed} done` : "open"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ResourcesView({ resources }: { resources: ResourceItem[] }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h3 className="panel-title">Free and Open Sources</h3>
        <span className="tag">{resources.length} saved</span>
      </div>
      <div className="panel-body two-column">
        {resources.map((item) => (
          <article className="resource-item" key={item.id}>
            <div className="task-meta">
              <span className={`tag skill-${item.skill}`}>{item.skill}</span>
              <span className="tag">{item.type}</span>
            </div>
            <h3 className="task-title">{item.title}</h3>
            <p>{item.source}</p>
            <a className="secondary-button" href={item.url} target="_blank" rel="noreferrer">
              Open <ChevronRight size={16} aria-hidden="true" />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

function SettingsView({
  chineseOptional,
  dailyTarget,
  llmProvider,
  onChineseOptionalChange,
  onDailyTargetChange,
  speechToTextProvider,
}: {
  chineseOptional: boolean;
  dailyTarget: number;
  llmProvider: string;
  onChineseOptionalChange: (value: boolean) => void;
  onDailyTargetChange: (value: number) => void;
  speechToTextProvider: string;
}) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h3 className="panel-title">Local Profile</h3>
          <span className="tag">single-user</span>
      </div>
      <div className="panel-body">
        <div className="settings-row">
          <div>
            <strong>Daily target</strong>
            <p className="task-detail">Current target: {dailyTarget} minutes</p>
          </div>
          <input
            aria-label="Daily study target"
            className="input"
            max="120"
            min="30"
            onChange={(event) => onDailyTargetChange(Number(event.target.value))}
            step="5"
            style={{ maxWidth: 180 }}
            type="number"
            value={dailyTarget}
          />
        </div>

        <div className="settings-row">
          <div>
            <strong>Chinese explanations</strong>
            <p className="task-detail">Optional support for difficult expressions.</p>
          </div>
          <label className="toggle">
            <input
              checked={chineseOptional}
              onChange={(event) => onChineseOptionalChange(event.target.checked)}
              type="checkbox"
            />
            Enabled
          </label>
        </div>

        <div className="settings-row">
          <div>
            <strong>Product LLM</strong>
            <p className="task-detail">Kimi, loaded from local environment variables.</p>
          </div>
          <span className="tag">{llmProvider}</span>
        </div>

        <div className="settings-row">
          <div>
            <strong>Speech-to-text</strong>
            <p className="task-detail">Local Whisper transcription through whisper.cpp.</p>
          </div>
          <span className="tag">{speechToTextProvider}</span>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
    </div>
  );
}

function SkillBar({ label, max, value }: { label: string; max: number; value: number }) {
  const width = Math.min(100, Math.round((value / max) * 100));

  return (
    <div className="skill-row">
      <div className="skill-row-header">
        <span>{label}</span>
        <span>{value}m</span>
      </div>
      <div className="bar" aria-label={`${label} balance`}>
        <div className="bar-fill" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function TaskList({
  expanded = false,
  tasks,
  onToggleTask,
}: {
  expanded?: boolean;
  tasks: LearningTask[];
  onToggleTask: (taskId: string) => void | Promise<void>;
}) {
  return (
    <div className="task-list">
      {tasks.map((task) => (
        <article className="task-card" key={task.id}>
          <button
            aria-label={`Mark ${task.title} ${task.status === "done" ? "incomplete" : "complete"}`}
            className={`task-check ${task.status === "done" ? "done" : ""}`}
            onClick={() => void onToggleTask(task.id)}
            type="button"
          >
            {task.status === "done" ? <Check size={17} /> : <Circle size={15} />}
          </button>

          <div>
            <h3 className="task-title">{task.title}</h3>
            <div className="task-meta">
              <span className={`tag skill-${task.skill}`}>{task.skill}</span>
              <span className="tag">{task.module}</span>
              <span className="tag">{task.difficulty}</span>
              <span className="tag">{task.minutes}m</span>
            </div>
            <p className="task-detail">{task.goal}</p>
            {expanded && <p className="task-detail">Output: {task.output}</p>}
          </div>

          <button className="secondary-button" type="button">
            <Play size={16} aria-hidden="true" />
            Start
          </button>
        </article>
      ))}
    </div>
  );
}
