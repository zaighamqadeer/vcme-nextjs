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

// These are now fetched from the backend for security
export const CHAPTERS: Chapter[] = [];
export const PROMPT_ENGINEERING_CHAPTERS: Chapter[] = [];
export const FULLSTACK_VIBE_CHAPTERS: Chapter[] = [];
export const AI_AGENTS_CHAPTERS: Chapter[] = [];

export const COURSES_MAP: Record<string, any[]> = {
  'vibe-coding-101': CHAPTERS,
  'prompt-engineering-pro': PROMPT_ENGINEERING_CHAPTERS,
  'fullstack-vibe': FULLSTACK_VIBE_CHAPTERS,
  'advanced-ai-agents': AI_AGENTS_CHAPTERS
};
