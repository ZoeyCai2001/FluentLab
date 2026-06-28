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
    title: "Listen to a short daily English audio",
    module: "Listening Corner",
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
    title: "Read and summarize a daily news digest",
    module: "Reading Digest",
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

export const dailyListeningSets = [
  {
    title: "Daily listening set: campus and apartment logistics",
    items: [
      {
        id: "repair-window",
        title: "Apartment repair appointment",
        transcript:
          "Hi, this is Maya in apartment 4B. The kitchen sink has been leaking since last night. I put a bowl under it, but the water is still dripping every few seconds. Could someone come by this afternoon? I have class until two thirty, so any time after three would work. If today is too busy, tomorrow morning before ten is also okay.",
        questions: [
          {
            id: "repair-problem",
            prompt: "What problem does Maya report?",
            options: ["The sink is leaking.", "The heater is broken.", "The door lock is stuck."],
            answer: "The sink is leaking.",
          },
          {
            id: "repair-time",
            prompt: "When is Maya available today?",
            options: ["Before ten.", "After three.", "At two thirty."],
            answer: "After three.",
          },
        ],
      },
      {
        id: "seminar-room",
        title: "Seminar room change",
        transcript:
          "Quick update for everyone attending the theory seminar. Today's speaker will still start at four, but the room has changed from 210 to 318 because the projector in 210 stopped working. Please arrive a few minutes early, since the new room is on the opposite side of the building.",
        questions: [
          {
            id: "seminar-room-question",
            prompt: "What changed?",
            options: ["The speaker changed.", "The room changed.", "The seminar was canceled."],
            answer: "The room changed.",
          },
          {
            id: "seminar-room-number",
            prompt: "Where should people go?",
            options: ["Room 210.", "Room 318.", "The library."],
            answer: "Room 318.",
          },
        ],
      },
      {
        id: "office-hours",
        title: "Office-hour reschedule",
        transcript:
          "Professor Lin asked me to let you know that office hours are moving from Wednesday morning to Thursday afternoon this week. If you wanted to discuss the homework proof, please send a short summary of your question before noon on Thursday.",
        questions: [
          {
            id: "office-day",
            prompt: "When are office hours this week?",
            options: ["Wednesday morning.", "Thursday afternoon.", "Friday evening."],
            answer: "Thursday afternoon.",
          },
          {
            id: "office-request",
            prompt: "What should students send before noon?",
            options: ["A proof summary.", "A slide deck.", "A payment receipt."],
            answer: "A proof summary.",
          },
        ],
      },
      {
        id: "package-desk",
        title: "Package pickup notice",
        transcript:
          "You have a package waiting at the front desk. The desk closes at six tonight, and you will need to show your student ID. If you cannot pick it up today, the staff can keep it until Monday afternoon.",
        questions: [
          {
            id: "package-place",
            prompt: "Where is the package?",
            options: ["At the front desk.", "In the mailroom locker.", "At the library."],
            answer: "At the front desk.",
          },
          {
            id: "package-id",
            prompt: "What does the listener need?",
            options: ["A passport.", "A student ID.", "A printed form."],
            answer: "A student ID.",
          },
        ],
      },
      {
        id: "group-meeting",
        title: "Group meeting update",
        transcript:
          "For tomorrow's group meeting, please prepare a two-minute update instead of slides. Focus on one result, one problem you are stuck on, and one thing you plan to try next. We will spend the remaining time on discussion.",
        questions: [
          {
            id: "meeting-format",
            prompt: "What should people prepare?",
            options: ["A poster.", "A two-minute update.", "A full slide deck."],
            answer: "A two-minute update.",
          },
          {
            id: "meeting-focus",
            prompt: "What should the update include?",
            options: ["One result, one problem, and one next step.", "Only finished results.", "A list of references."],
            answer: "One result, one problem, and one next step.",
          },
        ],
      },
    ],
  },
  {
    title: "Daily listening set: research communication",
    items: [
      {
        id: "paper-claim",
        title: "Paper claim clarification",
        transcript:
          "I think the main claim of the paper is narrower than it first appears. The theorem does not say every optimizer generalizes well. It says that under a stability condition, a certain family of algorithms has a smaller generalization gap.",
        questions: [
          {
            id: "claim-scope",
            prompt: "How does the speaker describe the claim?",
            options: ["Broader than expected.", "Narrower than expected.", "Unrelated to optimization."],
            answer: "Narrower than expected.",
          },
          {
            id: "claim-condition",
            prompt: "What condition is mentioned?",
            options: ["A stability condition.", "A memory limit.", "A hardware condition."],
            answer: "A stability condition.",
          },
        ],
      },
      {
        id: "advisor-feedback",
        title: "Advisor feedback",
        transcript:
          "Your motivation paragraph is moving in the right direction, but the first sentence is still too general. Start with the practical gap, then explain why the current theoretical bound fails to explain it.",
        questions: [
          {
            id: "advisor-issue",
            prompt: "What is too general?",
            options: ["The first sentence.", "The experiment table.", "The conclusion."],
            answer: "The first sentence.",
          },
          {
            id: "advisor-start",
            prompt: "What should the writer start with?",
            options: ["The practical gap.", "A long citation list.", "A personal story."],
            answer: "The practical gap.",
          },
        ],
      },
      {
        id: "lab-demo",
        title: "Lab demo timing",
        transcript:
          "The demo will take about ten minutes if the server is already running. Please start the environment before the meeting, because installing dependencies during the demo usually wastes time.",
        questions: [
          {
            id: "demo-length",
            prompt: "How long will the demo take if ready?",
            options: ["About five minutes.", "About ten minutes.", "About thirty minutes."],
            answer: "About ten minutes.",
          },
          {
            id: "demo-warning",
            prompt: "What usually wastes time?",
            options: ["Installing dependencies during the demo.", "Opening the slides.", "Asking one question."],
            answer: "Installing dependencies during the demo.",
          },
        ],
      },
      {
        id: "conference-registration",
        title: "Conference registration",
        transcript:
          "Early registration closes this Friday at midnight. Students can request a reduced fee, but the form requires a short letter from an advisor and proof of enrollment.",
        questions: [
          {
            id: "registration-deadline",
            prompt: "When does early registration close?",
            options: ["Friday at midnight.", "Monday morning.", "Next month."],
            answer: "Friday at midnight.",
          },
          {
            id: "registration-documents",
            prompt: "What does the reduced-fee form require?",
            options: ["A visa copy and photo.", "An advisor letter and proof of enrollment.", "A published paper."],
            answer: "An advisor letter and proof of enrollment.",
          },
        ],
      },
      {
        id: "library-renewal",
        title: "Library renewal",
        transcript:
          "Your borrowed book has been renewed for another two weeks. After that, it cannot be renewed again because another student has requested it. Please return it by the new due date to avoid a late fee.",
        questions: [
          {
            id: "renewal-length",
            prompt: "How long was the book renewed?",
            options: ["One week.", "Two weeks.", "One month."],
            answer: "Two weeks.",
          },
          {
            id: "renewal-limit",
            prompt: "Why can it not be renewed again?",
            options: ["Another student requested it.", "The library is closing.", "The book is damaged."],
            answer: "Another student requested it.",
          },
        ],
      },
    ],
  },
];

export const dailyReadingDigestSets = [
  {
    title: "Daily reading: why benchmark design shapes AI progress",
    source: "FluentLab research digest",
    level: "B2-C1",
    text:
      "Modern AI systems are often compared through benchmark scores, but the design of those benchmarks can quietly shape the direction of research. A benchmark is not a neutral mirror of ability. It defines which behaviors are rewarded, which failures are hidden, and which trade-offs become visible to researchers. If a benchmark mostly asks short factual questions, a model that retrieves isolated facts may look stronger than a model that handles a messy multi-step task. If a benchmark accepts only one final answer, it may ignore whether the system asked a necessary clarification question, noticed an ambiguous instruction, or recovered from a bad intermediate step.\n\nThis matters because users rarely interact with AI systems through clean one-shot prompts. They ask for help across a workflow: reading a document, comparing options, revising a plan, checking assumptions, and explaining uncertainty. In that setting, the quality of the final response depends on process-level behavior. A useful system should know when evidence is thin, when a request conflicts with earlier constraints, and when the safest answer is to slow down rather than pretend to be certain. These abilities are difficult to measure with a single accuracy number.\n\nA better evaluation culture would publish more than leaderboards. It would include failure cases, human judgments about clarity and usefulness, and tasks that require several turns of interaction. It would also distinguish between narrow competence and robust assistance. Narrow competence can be impressive, but robust assistance is what determines whether a system helps people make better decisions. For researchers, the practical lesson is that evaluation should be treated as part of the scientific claim, not as a decorative table at the end of a paper.",
  },
  {
    title: "Daily reading: the hidden cost of unclear research writing",
    source: "FluentLab academic digest",
    level: "B2-C1",
    text:
      "Unclear research writing is not merely a style problem. It changes how ideas travel. When a paper hides its main claim behind vague motivation, overloaded notation, or a long chain of implicit assumptions, readers spend their limited attention reconstructing the basic argument instead of evaluating the contribution. This is especially costly in theoretical machine learning, where a result often depends on the exact relationship between assumptions, definitions, and guarantees.\n\nClear writing does not mean simplifying every technical point. It means giving the reader enough structure to know where they are. A strong introduction usually answers four questions early: what phenomenon is being studied, why existing explanations are insufficient, what the new result changes, and which assumptions make the result possible. Without that structure, even a correct theorem may feel less important than it is. Readers may remember the difficulty of the presentation rather than the value of the idea.\n\nThere is also an ethical dimension to clarity. Research communities rely on shared understanding. If only a small group can decode a result, then fewer people can challenge it, extend it, or apply it responsibly. Clear writing lowers the cost of criticism and makes collaboration easier. For a young researcher, this means revision is not a cosmetic final step. It is part of the research process itself: a way of testing whether the idea has been understood deeply enough to be explained to someone else.",
  },
];

function getDailyIndex(now: Date, length: number) {
  const start = new Date(now.getFullYear(), 0, 0);
  const dayIndex = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  return dayIndex % length;
}

export function getDailyListeningPractice(now = new Date()) {
  return dailyListeningSets[getDailyIndex(now, dailyListeningSets.length)];
}

export function getDailyReadingDigest(now = new Date()) {
  return dailyReadingDigestSets[getDailyIndex(now, dailyReadingDigestSets.length)];
}

export const vocabulary: VocabularyItem[] = [
  {
    id: "clarify",
    phrase: "Could you clarify what you mean by...",
    meaning: "Ask someone to explain a point more clearly.",
    itemType: "Phrase",
    context: "Academic",
    example: "Could you clarify what you mean by a weaker assumption?",
    reviewDue: "Today",
  },
  {
    id: "getting-used",
    phrase: "I am still getting used to...",
    meaning: "Describe something that is becoming familiar but still difficult.",
    itemType: "Phrase",
    context: "Daily",
    example: "I am still getting used to speaking up in group meetings.",
    reviewDue: "Today",
  },
  {
    id: "key-challenge",
    phrase: "The key technical challenge is...",
    meaning: "Introduce the main hard part of a research problem.",
    itemType: "Phrase",
    context: "Speaking",
    example: "The key technical challenge is controlling the generalization gap.",
    reviewDue: "Tomorrow",
  },
  {
    id: "suggests-that",
    phrase: "This result suggests that...",
    meaning: "Explain what a result may imply.",
    itemType: "Phrase",
    context: "Writing",
    example: "This result suggests that the bound can be improved under smoothness.",
    reviewDue: "Friday",
  },
  {
    id: "to-put-it-another-way",
    phrase: "To put it another way...",
    meaning: "Restate an idea more clearly.",
    itemType: "Phrase",
    context: "Speaking",
    example: "To put it another way, the assumption controls how noisy the gradients can be.",
    reviewDue: "Today",
  },
  {
    id: "from-my-understanding",
    phrase: "From my understanding...",
    meaning: "Give your interpretation while leaving room for correction.",
    itemType: "Phrase",
    context: "Academic",
    example: "From my understanding, the theorem applies only when the loss is smooth.",
    reviewDue: "Today",
  },
  {
    id: "i-ran-into",
    phrase: "I ran into...",
    meaning: "Say that you met a problem or difficulty.",
    itemType: "Phrase",
    context: "Daily",
    example: "I ran into an issue with the package installation.",
    reviewDue: "Tomorrow",
  },
  {
    id: "what-i-found-interesting",
    phrase: "What I found interesting was...",
    meaning: "Introduce a point that caught your attention.",
    itemType: "Phrase",
    context: "Speaking",
    example: "What I found interesting was the gap between the bound and the experiment.",
    reviewDue: "Tomorrow",
  },
  {
    id: "could-we-schedule",
    phrase: "Could we schedule a time to...",
    meaning: "Politely ask to arrange a meeting or service.",
    itemType: "Phrase",
    context: "Daily",
    example: "Could we schedule a time to check the leaking sink?",
    reviewDue: "Friday",
  },
  {
    id: "i-would-like-to-follow-up",
    phrase: "I would like to follow up on...",
    meaning: "Return to a previous topic professionally.",
    itemType: "Phrase",
    context: "Writing",
    example: "I would like to follow up on the question about stability.",
    reviewDue: "Friday",
  },
  {
    id: "the-main-takeaway",
    phrase: "The main takeaway is...",
    meaning: "Summarize the most important point.",
    itemType: "Phrase",
    context: "Academic",
    example: "The main takeaway is that the regularizer changes the sample complexity.",
    reviewDue: "Saturday",
  },
  {
    id: "assumption",
    phrase: "assumption",
    meaning: "Something accepted as true before making an argument.",
    itemType: "Word",
    context: "Academic",
    example: "The proof depends on a stronger smoothness assumption.",
    reviewDue: "Today",
  },
  {
    id: "bound",
    phrase: "bound",
    meaning: "A limit that a value does not pass.",
    itemType: "Word",
    context: "Academic",
    example: "The new bound is tighter for small datasets.",
    reviewDue: "Today",
  },
  {
    id: "leak",
    phrase: "leak",
    meaning: "A small unwanted flow of water, gas, or information.",
    itemType: "Word",
    context: "Daily",
    example: "There is a leak under the kitchen sink.",
    reviewDue: "Today",
  },
  {
    id: "appointment",
    phrase: "appointment",
    meaning: "An arranged time to meet someone or receive a service.",
    itemType: "Word",
    context: "Daily",
    example: "The repair appointment is after three.",
    reviewDue: "Tomorrow",
  },
  {
    id: "uncertainty",
    phrase: "uncertainty",
    meaning: "A state of not being completely sure.",
    itemType: "Word",
    context: "Academic",
    example: "The model should admit uncertainty when the evidence is weak.",
    reviewDue: "Tomorrow",
  },
  {
    id: "workflow",
    phrase: "workflow",
    meaning: "A sequence of steps used to finish a task.",
    itemType: "Word",
    context: "Writing",
    example: "The evaluation should test the whole workflow.",
    reviewDue: "Tomorrow",
  },
  {
    id: "realistic",
    phrase: "realistic",
    meaning: "Close to real situations or practical needs.",
    itemType: "Word",
    context: "Writing",
    example: "The benchmark should include realistic user tasks.",
    reviewDue: "Friday",
  },
  {
    id: "recover",
    phrase: "recover",
    meaning: "To return to a better state after a mistake or problem.",
    itemType: "Word",
    context: "Daily",
    example: "A useful assistant should recover from a wrong first answer.",
    reviewDue: "Friday",
  },
  {
    id: "narrow",
    phrase: "narrow",
    meaning: "Limited in range or scope.",
    itemType: "Word",
    context: "Academic",
    example: "The old benchmark measures a narrow skill.",
    reviewDue: "Saturday",
  },
  {
    id: "feedback",
    phrase: "feedback",
    meaning: "Comments that help someone improve.",
    itemType: "Word",
    context: "Speaking",
    example: "Expert feedback makes the evaluation more useful.",
    reviewDue: "Saturday",
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
    title: "MIT OCW lecture: Introduction to Machine Learning",
    source: "MIT OCW",
    type: "Lecture",
    skill: "Listening",
    url: "https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/resources/lecture-1-introduction/",
  },
  {
    id: "ted-ed-sleep",
    title: "TED-Ed lesson: The benefits of a good night's sleep",
    source: "TED-Ed",
    type: "Video",
    skill: "Listening",
    url: "https://ed.ted.com/lessons/the-benefits-of-a-good-night-s-sleep-shai-marcu",
  },
  {
    id: "voa-lesson-welcome",
    title: "VOA Let's Learn English: Welcome",
    source: "VOA Learning English",
    type: "Video",
    skill: "Listening",
    url: "https://learningenglish.voanews.com/a/lets-learn-english-level-1-lesson-1-welcome/3179879.html",
  },
  {
    id: "arxiv-abstracts",
    title: "arXiv CS recent abstracts",
    source: "arXiv",
    type: "Article",
    skill: "Reading",
    url: "https://arxiv.org/list/cs/recent",
  },
  {
    id: "news-in-levels",
    title: "Daily leveled news for reading summaries",
    source: "News in Levels",
    type: "Article",
    skill: "Reading",
    url: "https://www.newsinlevels.com/",
  },
  {
    id: "conversation-science",
    title: "Readable research and science articles",
    source: "The Conversation",
    type: "Article",
    skill: "Reading",
    url: "https://theconversation.com/us",
  },
  {
    id: "youglish",
    title: "Expression pronunciation examples",
    source: "YouGlish",
    type: "Tool",
    skill: "Speaking",
    url: "https://youglish.com",
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

export const dailySpeakingTopicSets = [
  [
    "Explain your current research problem to a new lab member who knows machine learning but not learning theory. Include the problem, why it matters, and one concrete example.",
    "Call your apartment manager about a kitchen sink leak. Explain when it started, what you already tried, and two times when you are available.",
    "Summarize a paper you read this week for a one-minute group meeting update. Include the motivation, method, and one limitation.",
    "Ask a seminar speaker about one theorem assumption. State the assumption, why it seems strong, and ask whether it can be weakened.",
  ],
  [
    "Introduce yourself to a visiting professor after a seminar. Mention your research area, one recent question you are studying, and why you enjoyed the talk.",
    "Explain why your research problem matters to a first-year PhD student. Use one simple analogy and one technical sentence.",
    "Describe a delayed package problem to customer service. Give the order context, the problem, and the action you want.",
    "Give a short weekly update to your advisor. Mention what you finished, what is blocked, and what you will try next.",
  ],
  [
    "Compare two assumptions from recent papers. Explain which one is stronger, why it matters, and what changes in the result.",
    "Describe your ideal research routine to a new classmate. Include deep work time, meetings, reading, and recovery.",
    "Ask a polite follow-up question after a confusing talk. First summarize what you understood, then ask for the missing step.",
    "Explain the intuition of one theorem without formulas. Use a concrete example and one sentence about the proof idea.",
  ],
];

export function getDailySpeakingTopics(now = new Date()) {
  const start = new Date(now.getFullYear(), 0, 0);
  const dayIndex = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  return dailySpeakingTopicSets[dayIndex % dailySpeakingTopicSets.length];
}
