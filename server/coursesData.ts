export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'quiz' | 'task';
  content: string;
  options?: string[];
  correctAnswer?: string;
  taskPrompt?: string;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  isTeaser?: boolean;
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'ch0',
    title: 'Intro to Vibe Coding',
    description: 'Discover what vibe coding is, why it matters, and how it changes who gets to build software.',
    isTeaser: true, // Free for everyone
    lessons: [
      {
        id: 'l0-1',
        title: 'What is Vibe Coding?',
        description: 'Section 1',
        type: 'info',
        content: `### Welcome to Vibe Coding 🌊\n\nVibe coding is a new way of building software — you describe what you want in plain English, and AI writes the code for you.\n\nInstead of memorising syntax and typing code line by line, you focus on **what** you want to create, not **how** to write it.\n\nThink of it like having a brilliant developer sitting next to you who understands plain English, never gets tired, and can build almost anything you describe — instantly.\n\nThis course will teach you how to work with that developer effectively.`
      },
      {
        id: 'l0-1q',
        title: 'The Core Idea',
        description: 'Quiz 1',
        type: 'quiz',
        content: 'What is the core idea behind vibe coding?',
        options: [
          'Writing code while listening to music',
          'Describing what you want in plain language and letting AI build it',
          'A new programming language called Vibe',
          'Coding with your feelings instead of logic'
        ],
        correctAnswer: 'Describing what you want in plain language and letting AI build it'
      },
      {
        id: 'l0-2',
        title: 'The AI Stack',
        description: 'Section 2',
        type: 'info',
        content: `### The Modern AI Stack 🛠️\n\nTo be a successful vibe coder, you need to understand the tools at your disposal:\n\n1. **LLMs (Large Language Models)**: The "brain" (e.g., Gemini, GPT-4).\n2. **IDEs (Integrated Development Environments)**: Where you "vibe" (e.g., Cursor, VS Code).\n3. **Prompting**: How you communicate your vision.\n\nYou don't need to be an expert in any of these yet. We'll build that expertise together.`
      },
      {
        id: 'l0-2t',
        title: 'Your First Vibe',
        description: 'Practice 1',
        type: 'task',
        content: 'Try describing a simple app. For example: "A simple to-do list app with a purple theme and a button to add tasks."',
        taskPrompt: 'The user should describe a simple web application idea. Evaluate if the description is clear enough for an AI to start building. It should mention at least one feature and a basic design preference.'
      }
    ]
  },
  {
    id: 'ch1',
    title: 'The Vibe Mindset',
    description: 'Learn how to think like a vibe coder and break down complex problems.',
    lessons: [
      {
        id: 'l1-1',
        title: 'Thinking in Components',
        description: 'Section 1',
        type: 'info',
        content: 'Vibe coding works best when you break your app into small, manageable components...'
      }
    ]
  }
];

export const PROMPT_ENGINEERING_CHAPTERS: Chapter[] = [
  {
    id: 'pe-ch1',
    title: 'The Art of the Prompt',
    description: 'Learn the core principles of effective prompting.',
    lessons: [
      {
        id: 'pe-l1-1',
        title: 'Context is King',
        description: 'Section 1',
        type: 'info',
        content: 'Context is everything in prompting...'
      }
    ]
  }
];

export const FULLSTACK_VIBE_CHAPTERS: Chapter[] = [
  {
    id: 'fs-ch1',
    title: 'Fullstack Fundamentals',
    description: 'Understanding the full stack.',
    lessons: [
      {
        id: 'fs-l1-1',
        title: 'What is Fullstack?',
        description: 'Section 1',
        type: 'info',
        content: 'Fullstack means both frontend and backend...'
      }
    ]
  }
];

export const AI_AGENTS_CHAPTERS: Chapter[] = [
  {
    id: 'ai-ch1',
    title: 'Intro to AI Agents',
    description: 'What are agents?',
    lessons: [
      {
        id: 'ai-l1-1',
        title: 'What is an Agent?',
        description: 'Section 1',
        type: 'info',
        content: 'An agent is an AI that can use tools...'
      }
    ]
  }
];

export const COURSES_MAP: Record<string, Chapter[]> = {
  'vibe-coding': CHAPTERS,
  'prompt-engineering-pro': PROMPT_ENGINEERING_CHAPTERS,
  'fullstack-vibe': FULLSTACK_VIBE_CHAPTERS,
  'advanced-ai-agents': AI_AGENTS_CHAPTERS
};
