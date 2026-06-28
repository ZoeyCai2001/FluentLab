"use client";

import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  Circle,
  FileText,
  Gauge,
  Headphones,
  Library,
  Mic,
  Newspaper,
  NotebookTabs,
  Play,
  RefreshCcw,
  RotateCw,
  Settings,
  Sparkles,
  Square,
  Volume2,
  Wand2,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  addMistake,
  clearStoredAuthToken,
  getAuthStatus,
  getHealth,
  getMistakes,
  getResources,
  getSettings,
  getStoredAuthToken,
  getTodayPlan,
  getVocabulary,
  getWeeklyProgress,
  login,
  polishSpeaking,
  reviewWriting,
  updateSettings,
  updateTaskStatus,
} from "@/lib/api";
import type { CSSProperties } from "react";
import {
  initialTasks,
  getDailyListeningPractice,
  mistakes as fallbackMistakes,
  progress as fallbackProgress,
  getDailyReadingDigest,
  resources as fallbackResources,
  getDailySpeakingTopics,
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

type BrowserSpeechRecognitionResult = {
  isFinal: boolean;
  0?: {
    transcript: string;
  };
};

type BrowserSpeechRecognitionEvent = Event & {
  results: {
    length: number;
    [index: number]: BrowserSpeechRecognitionResult;
  };
};

type BrowserSpeechRecognitionErrorEvent = Event & {
  error?: string;
};

type BrowserSpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: (() => void) | null;
  onerror: ((event: BrowserSpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
  start: () => void;
  stop: () => void;
};

type BrowserSpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition?: BrowserSpeechRecognitionConstructor;
    webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
  }
}

type View =
  | "dashboard"
  | "listening"
  | "speaking"
  | "writing"
  | "reading"
  | "vocabulary"
  | "mistakes"
  | "resources"
  | "settings";

type NavItem = {
  id: View;
  label: string;
  icon: LucideIcon;
};

type DailyListeningPractice = ReturnType<typeof getDailyListeningPractice>;
type DailyReadingDigest = ReturnType<typeof getDailyReadingDigest>;

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Gauge },
  { id: "listening", label: "Listening Corner", icon: Headphones },
  { id: "speaking", label: "Speaking Room", icon: Mic },
  { id: "writing", label: "Writing Studio", icon: FileText },
  { id: "reading", label: "Reading Digest", icon: Newspaper },
  { id: "vocabulary", label: "Vocabulary Bank", icon: BookOpen },
  { id: "mistakes", label: "Mistake Notebook", icon: NotebookTabs },
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
  listening: {
    eyebrow: "Listening",
    title: "Listening Corner",
    copy: "Open audio and video practice for daily life, academic talks, dictation, and shadowing.",
  },
  speaking: {
    eyebrow: "Speaking",
    title: "3-Minute Speaking Room",
    copy: "Pick a topic, record a monologue, review the transcript, and read after a polished version.",
  },
  writing: {
    eyebrow: "Writing",
    title: "Writing Studio",
    copy: "Write first, then polish the draft with focused feedback and reusable expressions.",
  },
  reading: {
    eyebrow: "Reading",
    title: "Reading Digest",
    copy: "Daily news, short articles, and digest-style reading with active summary practice.",
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

function pickNaturalVoice(voices: SpeechSynthesisVoice[]) {
  const googleUsEnglish = voices.find((voice) => voice.name.toLowerCase() === "google us english");
  if (googleUsEnglish) {
    return googleUsEnglish;
  }

  const preferred = [
    "Google US English",
    "Samantha",
    "Alex",
    "Ava",
    "Allison",
    "Susan",
    "Victoria",
    "Karen",
    "Daniel",
    "Microsoft Aria",
    "Microsoft Jenny",
  ];

  return (
    voices.find((voice) => preferred.some((name) => voice.name.toLowerCase().includes(name.toLowerCase()))) ??
    voices.find((voice) => voice.localService && voice.lang.toLowerCase().startsWith("en-us")) ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith("en"))
  );
}

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
  const [isSyncing, setIsSyncing] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [authRequired, setAuthRequired] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const dailySpeakingTopics = useMemo(() => getDailySpeakingTopics(), []);
  const [selectedTopic, setSelectedTopic] = useState(dailySpeakingTopics[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState(sampleTranscript);
  const [showPolish, setShowPolish] = useState(true);
  const [polishedVersion, setPolishedVersion] = useState(polishedSpeech);
  const [speakingFeedback, setSpeakingFeedback] = useState<string[]>([]);
  const [speakingExpressions, setSpeakingExpressions] = useState<string[]>([]);
  const [isPolishing, setIsPolishing] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(false);
  const [transcriptionStatus, setTranscriptionStatus] = useState("Speech-to-text ready");
  const [draft, setDraft] = useState(
    "My research is about understanding why machine learning algorithms work. This problem is important because many methods perform well, but the theory is not always clear. I want to study conditions that can explain generalization better.",
  );
  const [revision, setRevision] = useState(
    "My research studies why machine learning algorithms generalize well beyond their training data. This problem matters because many practical methods perform strongly, while existing theory often gives bounds that are too loose to explain their behavior. I want to identify conditions that lead to sharper and more useful guarantees.",
  );
  const [writingFeedback, setWritingFeedback] = useState<string[]>([]);
  const [writingPhrases, setWritingPhrases] = useState<string[]>([]);
  const [isReviewingWriting, setIsReviewingWriting] = useState(false);
  const [listeningAnswers, setListeningAnswers] = useState<Record<string, string>>({});
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState("");
  const [speakingStatus, setSpeakingStatus] = useState("Backend polish ready");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const transcriptRef = useRef(transcript);

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
  const dailyListeningPractice = useMemo(() => getDailyListeningPractice(), []);
  const dailyReadingDigest = useMemo(() => getDailyReadingDigest(), []);
  const todayLabel = useMemo(
    () => new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short" }).format(new Date()),
    [],
  );

  const loadBackendData = useCallback(async () => {
    if (authRequired && !authToken) {
      setIsSyncing(false);
      return;
    }

    setIsSyncing(true);
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

      setApiLive(health);
      setApiMessage("Backend API live");
      setTasks(plan.tasks);
      setSettings(apiSettings);
      setVocabularyItems(apiVocabulary);
      setMistakeItems(apiMistakes);
      setResourceItems(apiResources);
      setProgressPoints(weeklyProgress.points);
    } catch (error) {
      console.error(error);
      if (authRequired && error instanceof Error && error.message.includes("401")) {
        clearStoredAuthToken();
        setAuthToken("");
        setLoginMessage("Session expired. Please log in again.");
        setApiMessage("Login required");
        return;
      }
      setApiLive(false);
      setApiMessage("Backend offline, using local fallback data");
    } finally {
      setIsSyncing(false);
    }
  }, [authRequired, authToken]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const required = await getAuthStatus();
        const token = getStoredAuthToken();
        setAuthRequired(required);
        setAuthToken(token);
        setLoginMessage(required && !token ? "Enter the shared FluentLab password." : "");
      } catch (error) {
        console.error(error);
        setAuthRequired(false);
        setLoginMessage("Could not check login status. Using local fallback if needed.");
      } finally {
        setAuthChecked(true);
      }
    };

    void checkAuth();
  }, []);

  useEffect(() => {
    if (authChecked && (!authRequired || authToken)) {
      void loadBackendData();
    }
  }, [loadBackendData]);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    setSpeechRecognitionSupported(Boolean(window.SpeechRecognition ?? window.webkitSpeechRecognition));

    return () => {
      recognitionRef.current?.stop();
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith("en"));
      setAvailableVoices(voices);
      setSelectedVoiceURI((current) => current || pickNaturalVoice(voices)?.voiceURI || voices[0]?.voiceURI || "");
    };

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
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
      setTranscriptionStatus("Microphone unavailable");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    chunksRef.current = [];
    transcriptRef.current = "";
    setTranscript("");
    setShowPolish(false);
    setSpeakingFeedback([]);
    setSpeakingExpressions([]);
    setTranscriptionStatus("Recording");

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
      if (transcriptRef.current.trim()) {
        setTranscriptionStatus("Transcript captured");
      } else {
        setTranscriptionStatus("No transcript captured; edit manually");
      }
    };

    mediaRecorderRef.current = recorder;
    recorder.start();
    startBrowserTranscription();
    setIsRecording(true);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    setIsTranscribing(false);
  };

  const startBrowserTranscription = () => {
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!Recognition) {
      setTranscriptionStatus("Browser speech-to-text unavailable");
      return;
    }

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const text = Array.from({ length: event.results.length }, (_, index) => event.results[index]?.[0]?.transcript ?? "")
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

      if (text) {
        setTranscript(text);
        setTranscriptionStatus("Live transcript active");
      }
    };
    recognition.onerror = (event) => {
      setIsTranscribing(false);
      setTranscriptionStatus(event.error ? `Speech-to-text error: ${event.error}` : "Speech-to-text stopped");
    };
    recognition.onend = () => {
      setIsTranscribing(false);
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
      setIsTranscribing(true);
      setTranscriptionStatus("Listening for speech");
    } catch (error) {
      console.error(error);
      setIsTranscribing(false);
      setTranscriptionStatus("Speech-to-text could not start");
    }
  };

  const speakPolishedVersion = () => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    const voice = pickNaturalVoice(availableVoices);
    const utterance = new SpeechSynthesisUtterance(polishedVersion);
    utterance.lang = "en-US";
    utterance.voice = voice ?? null;
    utterance.rate = 0.92;
    utterance.pitch = 1.02;
    window.speechSynthesis.speak(utterance);
  };

  const playListeningPractice = (text: string) => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    const voice = availableVoices.find((item) => item.voiceURI === selectedVoiceURI) ?? pickNaturalVoice(availableVoices);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.voice = voice ?? null;
    utterance.rate = 0.9;
    utterance.pitch = 1.02;
    window.speechSynthesis.speak(utterance);
  };

  const requestSpeakingPolish = async () => {
    const cleanTranscript = transcript.trim();
    if (!cleanTranscript) {
      setSpeakingStatus("Add or record a transcript before polishing");
      setShowPolish(false);
      return;
    }

    setIsPolishing(true);
    setSpeakingStatus("Polishing with backend...");
    try {
      const result = await polishSpeaking(selectedTopic, cleanTranscript);
      setPolishedVersion(result.polishedVersion);
      setSpeakingFeedback(result.feedback);
      setSpeakingExpressions(result.usefulExpressions);
      setShowPolish(true);
      setApiLive(true);
      setApiMessage("Backend API live");
      setSpeakingStatus("Polish complete");
    } catch (error) {
      console.error(error);
      setApiLive(false);
      setApiMessage("Could not request backend speaking polish");
      setSpeakingStatus("Backend polish failed");
      setShowPolish(false);
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

  const markVocabularyForReview = async (item: VocabularyItem) => {
    const mistake: Mistake = {
      id: `vocab-${item.id}`,
      skill: "Vocabulary",
      original: item.phrase,
      correction: item.example,
      note: `Marked as hard from Vocabulary Bank. Meaning: ${item.meaning}`,
      status: "new",
    };

    setMistakeItems((current) => {
      if (current.some((existing) => existing.id === mistake.id)) {
        return current;
      }
      return [...current, mistake];
    });

    try {
      const saved = await addMistake(mistake);
      setMistakeItems(saved);
      setApiLive(true);
      setApiMessage("Backend API live");
    } catch (error) {
      console.error(error);
      setApiLive(false);
      setApiMessage("Could not save vocabulary review item");
    }
  };

  const submitLogin = async () => {
    setIsLoggingIn(true);
    setLoginMessage("Checking password...");
    try {
      const token = await login(loginPassword);
      setAuthToken(token);
      setLoginPassword("");
      setLoginMessage("");
      setApiMessage("Backend API live");
      setApiLive(true);
    } catch (error) {
      console.error(error);
      clearStoredAuthToken();
      setAuthToken("");
      setLoginMessage("Incorrect password. Try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = () => {
    clearStoredAuthToken();
    setAuthToken("");
    setApiLive(false);
    setApiMessage("Logged out");
    setLoginMessage("Enter the shared FluentLab password.");
  };

  const getTaskView = (task: LearningTask): View => {
    if (task.skill === "Listening") {
      return "listening";
    }
    if (task.skill === "Speaking") {
      return "speaking";
    }
    if (task.skill === "Writing") {
      return "writing";
    }
    if (task.skill === "Reading") {
      return "reading";
    }
    if (task.skill === "Vocabulary") {
      return "vocabulary";
    }
    return "dashboard";
  };

  if (!authChecked) {
    return <LoginView mode="checking" />;
  }

  if (authRequired && !authToken) {
    return (
      <LoginView
        isLoggingIn={isLoggingIn}
        message={loginMessage}
        mode="login"
        password={loginPassword}
        onPasswordChange={setLoginPassword}
        onSubmit={submitLogin}
      />
    );
  }

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
              {todayLabel}
            </span>
            <span className="pill">
              <Sparkles size={15} aria-hidden="true" />
              4-day streak
            </span>
            <span className={`pill ${apiLive ? "api-live" : "api-offline"}`}>
              {apiMessage}
            </span>
            <button className="secondary-button" type="button" onClick={() => void loadBackendData()}>
              <RotateCw size={15} aria-hidden="true" />
              {isSyncing ? "Syncing" : "Sync API"}
            </button>
            {authRequired && (
              <button className="secondary-button" type="button" onClick={logout}>
                Log out
              </button>
            )}
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
            progress={progressPoints}
            onStartTask={(task) => setActiveView(getTaskView(task))}
            onToggleTask={toggleTask}
          />
        )}

        {activeView === "listening" && (
          <ListeningView
            answers={listeningAnswers}
            availableVoices={availableVoices}
            practice={dailyListeningPractice}
            onAnswerChange={(id, value) =>
              setListeningAnswers((current) => ({ ...current, [id]: value }))
            }
            onCompleteTask={(taskId) => void toggleTask(taskId)}
            onPlayAudio={playListeningPractice}
            onVoiceChange={setSelectedVoiceURI}
            resources={resourceItems}
            selectedVoiceURI={selectedVoiceURI}
            tasks={tasks.filter((task) => task.skill === "Listening")}
          />
        )}

        {activeView === "speaking" && (
          <SpeakingView
            audioUrl={audioUrl}
            feedback={speakingFeedback}
            isRecording={isRecording}
            isPolishing={isPolishing}
            isTranscribing={isTranscribing}
            onPolish={requestSpeakingPolish}
            onSelectTopic={setSelectedTopic}
            onSpeak={speakPolishedVersion}
            onStart={startRecording}
            onStop={stopRecording}
            polishedVisible={showPolish}
            polishedVersion={polishedVersion}
            selectedTopic={selectedTopic}
            speakingStatus={speakingStatus}
            speechRecognitionSupported={speechRecognitionSupported}
            topics={dailySpeakingTopics}
            transcript={transcript}
            transcriptionStatus={transcriptionStatus}
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

        {activeView === "reading" && (
          <ReadingView
            digest={dailyReadingDigest}
            onCompleteTask={(taskId) => void toggleTask(taskId)}
            resources={resourceItems}
            tasks={tasks.filter((task) => task.skill === "Reading")}
          />
        )}
        {activeView === "vocabulary" && (
          <VocabularyView
            mistakes={mistakeItems}
            vocabulary={vocabularyItems}
            onNeedReview={markVocabularyForReview}
          />
        )}
        {activeView === "mistakes" && <MistakesView mistakes={mistakeItems} />}
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

        {activeView !== "dashboard" && (
          <div className="page-footer-actions">
            <button className="secondary-button" type="button" onClick={() => setActiveView("dashboard")}>
              <ArrowLeft size={16} aria-hidden="true" />
              Back to Dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function LoginView({
  isLoggingIn = false,
  message = "",
  mode,
  password = "",
  onPasswordChange,
  onSubmit,
}: {
  isLoggingIn?: boolean;
  message?: string;
  mode: "checking" | "login";
  password?: string;
  onPasswordChange?: (value: string) => void;
  onSubmit?: () => void | Promise<void>;
}) {
  return (
    <main className="login-shell">
      <section className="login-panel">
        <div className="brand-mark">FL</div>
        <div>
          <p className="eyebrow">Private Beta</p>
          <h1 className="login-title">FluentLab</h1>
          <p className="page-copy">A shared English learning workspace for Zoey and Haihan.</p>
        </div>

        {mode === "checking" ? (
          <p className="task-detail">Checking login status...</p>
        ) : (
          <form
            className="form-grid"
            onSubmit={(event) => {
              event.preventDefault();
              void onSubmit?.();
            }}
          >
            <div className="field">
              <label htmlFor="login-password">Shared password</label>
              <input
                autoComplete="current-password"
                autoFocus
                className="input"
                id="login-password"
                onChange={(event) => onPasswordChange?.(event.target.value)}
                placeholder="Enter password"
                type="password"
                value={password}
              />
            </div>
            <button className="primary-button" disabled={isLoggingIn || password.trim().length === 0} type="submit">
              {isLoggingIn ? "Logging in" : "Log in"}
            </button>
            {message && <p className="task-detail">{message}</p>}
          </form>
        )}
      </section>
    </main>
  );
}

function DashboardView({
  completedMinutes,
  completedTasks,
  dailyTarget,
  planProgress,
  progress,
  skillMinutes,
  tasks,
  totalMinutes,
  onStartTask,
  onToggleTask,
}: {
  completedMinutes: number;
  completedTasks: number;
  dailyTarget: number;
  planProgress: number;
  progress: ProgressPoint[];
  skillMinutes: Partial<Record<Skill, number>>;
  tasks: LearningTask[];
  totalMinutes: number;
  onStartTask: (task: LearningTask) => void;
  onToggleTask: (taskId: string) => void | Promise<void>;
}) {
  const allTasksDone = tasks.length > 0 && completedTasks === tasks.length;
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (!allTasksDone) {
      setShowCelebration(false);
      return;
    }

    setShowCelebration(true);
    const timer = window.setTimeout(() => setShowCelebration(false), 5000);
    return () => window.clearTimeout(timer);
  }, [allTasksDone]);

  return (
    <div>
      {showCelebration && <Celebration />}
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
            <span className="tag">{totalMinutes} minutes</span>
          </div>
          <div className="panel-body">
            <TaskList tasks={tasks} onStartTask={onStartTask} onToggleTask={onToggleTask} />
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
        </div>
      </div>

      <div className="dashboard-progress">
        <ProgressView progress={progress} />
      </div>
    </div>
  );
}

function ListeningView({
  answers,
  availableVoices,
  onAnswerChange,
  onCompleteTask,
  onPlayAudio,
  onVoiceChange,
  practice,
  resources,
  selectedVoiceURI,
  tasks,
}: {
  answers: Record<string, string>;
  availableVoices: SpeechSynthesisVoice[];
  onAnswerChange: (id: string, value: string) => void;
  onCompleteTask: (taskId: string) => void;
  onPlayAudio: (text: string) => void;
  onVoiceChange: (voiceURI: string) => void;
  practice: DailyListeningPractice;
  resources: ResourceItem[];
  selectedVoiceURI: string;
  tasks: LearningTask[];
}) {
  const listeningResources = resources.filter((resource) => resource.skill === "Listening");
  const task = tasks[0];

  return (
    <div className="stack">
      <section className="panel">
        <div className="panel-header">
          <h3 className="panel-title">{task?.title ?? "Today's Listening Work"}</h3>
          <span className={`tag ${task?.status === "done" ? "skill-Daily" : "skill-Listening"}`}>
            {task?.status === "done" ? "done" : "active task"}
          </span>
        </div>
        <div className="panel-body stack">
          <div className="settings-row listening-controls">
            <div>
              <strong>{practice.title}</strong>
              <p className="task-detail">Five short audios rotate by day. Google US English is selected by default when available.</p>
            </div>
            <select
              aria-label="Listening voice"
              className="select"
              value={selectedVoiceURI}
              onChange={(event) => onVoiceChange(event.target.value)}
            >
              {availableVoices.length === 0 && <option value="">Default browser voice</option>}
              {availableVoices.map((voice) => (
                <option key={voice.voiceURI} value={voice.voiceURI}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>

          {practice.items.map((item, index) => (
            <article className="resource-item listening-card" key={item.id}>
            <div className="task-meta">
              <span className="tag skill-Listening">Audio {index + 1}</span>
              <span className="tag">{task?.minutes ?? 12}m</span>
            </div>
            <h3 className="task-title">{item.title}</h3>
            <p>{task?.goal}</p>
            <button className="primary-button" type="button" onClick={() => onPlayAudio(item.transcript)}>
              <Volume2 size={16} aria-hidden="true" />
              Play audio
            </button>

            <div className="choice-grid" role="group" aria-label={`${item.title} questions`}>
              {item.questions.map((question) => (
                <fieldset className="choice-field" key={question.id}>
                  <legend>{question.prompt}</legend>
                  {question.options.map((option) => (
                    <label className="choice-option" key={option}>
                      <input
                        checked={answers[question.id] === option}
                        name={question.id}
                        onChange={() => onAnswerChange(question.id, option)}
                        type="radio"
                      />
                      {option}
                    </label>
                  ))}
                  {answers[question.id] && (
                    <p className={answers[question.id] === question.answer ? "answer-correct" : "answer-wrong"}>
                      {answers[question.id] === question.answer ? "Correct" : `Answer: ${question.answer}`}
                    </p>
                  )}
                </fieldset>
              ))}
            </div>

            <details className="text-box compact-box">
              <summary>Transcript</summary>
              <p>{item.transcript}</p>
            </details>
            </article>
          ))}

          <div className="task-meta">
            <span className="tag">
              {Object.keys(answers).length}/{practice.items.reduce((sum, item) => sum + item.questions.length, 0)} selected
            </span>
            {task && (
              <button
                className="primary-button"
                type="button"
                onClick={() => onCompleteTask(task.id)}
              >
                <Check size={16} aria-hidden="true" />
                {task.status === "done" ? "Mark unfinished" : "Finish listening task"}
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Picked Listening Sources</h3>
          <span className="tag">exact links</span>
        </div>
        <div className="panel-body two-column">
          {listeningResources.map((item) => (
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
    </div>
  );
}

function ReadingView({
  digest,
  onCompleteTask,
  resources,
  tasks,
}: {
  digest: DailyReadingDigest;
  onCompleteTask: (taskId: string) => void;
  resources: ResourceItem[];
  tasks: LearningTask[];
}) {
  const readingResources = resources.filter((resource) => resource.skill === "Reading");
  const task = tasks[0];

  return (
    <div className="stack">
      <section className="panel">
        <div className="panel-header">
          <h3 className="panel-title">{digest.title}</h3>
          <span className={`tag ${task?.status === "done" ? "skill-Daily" : "skill-Reading"}`}>
            {task?.status === "done" ? "done" : "active task"}
          </span>
        </div>
        <div className="panel-body stack">
          <div className="text-box digest-box">
            <div className="task-meta">
              <span className="tag skill-Reading">{digest.source}</span>
              <span className="tag">{digest.level}</span>
              <span className="tag">{task?.minutes ?? 10}m</span>
            </div>
            {digest.text.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {task && (
            <button
              className="primary-button"
              type="button"
              onClick={() => onCompleteTask(task.id)}
            >
              <Check size={16} aria-hidden="true" />
              {task.status === "done" ? "Mark unfinished" : "Finish reading task"}
            </button>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Daily Reading Sources</h3>
          <span className="tag">news/digest</span>
        </div>
        <div className="panel-body two-column">
          {readingResources.map((item) => (
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

    </div>
  );
}

function SpeakingView({
  audioUrl,
  feedback,
  isRecording,
  isPolishing,
  isTranscribing,
  onPolish,
  onSelectTopic,
  onSpeak,
  onStart,
  onStop,
  polishedVisible,
  polishedVersion,
  selectedTopic,
  speakingStatus,
  speechRecognitionSupported,
  topics,
  transcript,
  transcriptionStatus,
  usefulExpressions,
  onTranscriptChange,
}: {
  audioUrl: string | null;
  feedback: string[];
  isRecording: boolean;
  isPolishing: boolean;
  isTranscribing: boolean;
  onPolish: () => void | Promise<void>;
  onSelectTopic: (topic: string) => void;
  onSpeak: () => void;
  onStart: () => void;
  onStop: () => void;
  polishedVisible: boolean;
  polishedVersion: string;
  selectedTopic: string;
  speakingStatus: string;
  speechRecognitionSupported: boolean;
  topics: string[];
  transcript: string;
  transcriptionStatus: string;
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
              {topics.map((topic) => (
                <option key={topic}>{topic}</option>
              ))}
            </select>
          </div>

          <div className="recording-meter">
            <div>
              <strong>
                {isRecording ? (isTranscribing ? "Recording + transcribing" : "Recording") : "Ready"}
              </strong>
              <p className="task-detail">
                {speechRecognitionSupported ? transcriptionStatus : "Manual transcript fallback"}
              </p>
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
            <div className="stack">
              <audio controls src={audioUrl} aria-label="Recorded speaking attempt">
                <track kind="captions" />
              </audio>
              <p className="task-detail">{transcriptionStatus}</p>
            </div>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Transcript and Polish</h3>
          <div className="top-actions">
            <span className={`tag ${isTranscribing ? "skill-Speaking" : ""}`}>{transcriptionStatus}</span>
            <button
              className="secondary-button"
              disabled={isPolishing || transcript.trim().length === 0}
              type="button"
              onClick={() => void onPolish()}
            >
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
            <div className="text-box">
              {polishedVisible ? polishedVersion : "Add a transcript, then press Polish to create a better version."}
            </div>
            <p className="task-detail">{speakingStatus}</p>
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
            {isReviewing ? "Polishing" : "Polish"}
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

function VocabularyView({
  mistakes,
  vocabulary,
  onNeedReview,
}: {
  mistakes: Mistake[];
  vocabulary: VocabularyItem[];
  onNeedReview: (item: VocabularyItem) => void | Promise<void>;
}) {
  const words = vocabulary.filter((item) => item.itemType === "Word");
  const phrases = vocabulary.filter((item) => item.itemType === "Phrase");
  const reviewIds = new Set(mistakes.map((item) => item.id));

  return (
    <div className="stack">
      <VocabularySection
        items={phrases}
        reviewIds={reviewIds}
        title="Daily Phrases"
        onNeedReview={onNeedReview}
      />
      <VocabularySection
        items={words}
        reviewIds={reviewIds}
        title="Daily Words"
        onNeedReview={onNeedReview}
      />
    </div>
  );
}

function VocabularySection({
  items,
  reviewIds,
  title,
  onNeedReview,
}: {
  items: VocabularyItem[];
  reviewIds: Set<string>;
  title: string;
  onNeedReview: (item: VocabularyItem) => void | Promise<void>;
}) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h3 className="panel-title">{title}</h3>
        <span className="tag">{items.length} cards</span>
      </div>
      <div className="panel-body two-column">
        {items.map((item) => {
          const reviewId = `vocab-${item.id}`;
          const saved = reviewIds.has(reviewId);

          return (
            <article className="vocab-item" key={item.id}>
              <span className={`tag skill-${item.context === "Daily" ? "Daily" : "Academic"}`}>
                {item.context}
              </span>
              <h3 className="task-title">{item.phrase}</h3>
              <p>{item.meaning}</p>
              <p>{item.example}</p>
              <div className="task-meta">
                <span className="tag">Review: {item.reviewDue}</span>
                <button
                  className="secondary-button"
                  disabled={saved}
                  type="button"
                  onClick={() => void onNeedReview(item)}
                >
                  {saved ? "In notebook" : "Need review"}
                </button>
              </div>
            </article>
          );
        })}
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

function Celebration() {
  return (
    <div className="celebration" aria-hidden="true">
      {Array.from({ length: 18 }, (_, index) => (
        <span key={index} style={{ "--i": index } as CSSProperties} />
      ))}
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
  onStartTask,
  tasks,
  onToggleTask,
}: {
  expanded?: boolean;
  onStartTask: (task: LearningTask) => void;
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

          <button className="secondary-button" type="button" onClick={() => onStartTask(task)}>
            <Play size={16} aria-hidden="true" />
            Start
          </button>
        </article>
      ))}
    </div>
  );
}
