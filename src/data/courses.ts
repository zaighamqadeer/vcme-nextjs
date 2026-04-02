import { Rocket, Bot, Sparkles, Code2 } from 'lucide-react';

export const COURSES = [
  {
    id: 'vibe-coding',
    title: 'Vibe Coding Masterclass',
    description: 'Master AI-assisted coding through structured lessons. Write prompts, build projects, and ship real apps.',
    status: 'available',
    icon: Rocket,
    color: 'from-violet-500 to-fuchsia-500',
  },
  {
    id: 'advanced-ai-agents',
    title: 'Building AI Agents',
    description: 'Learn to build autonomous AI agents that can browse the web, execute code, and solve complex multi-step problems.',
    status: 'conditional', // Status depends on user progress
    icon: Bot,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'prompt-engineering-pro',
    title: 'Prompt Engineering Pro',
    description: 'Deep dive into advanced prompting techniques, context window management, and structured outputs.',
    status: 'coming-soon',
    icon: Sparkles,
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: 'fullstack-vibe',
    title: 'Full-Stack Vibe Coding',
    description: 'Take your vibe coding skills to the backend. Learn databases, authentication, and serverless deployments.',
    status: 'coming-soon',
    icon: Code2,
    color: 'from-emerald-400 to-teal-500',
  }
];
