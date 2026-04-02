import React from 'react';
import { motion } from 'motion/react';
import { Lock, PlayCircle, CheckCircle2, Rocket } from 'lucide-react';
import { COURSES } from '../data/courses';
import { Header } from './Header';

interface CoursesPageProps {
  hearts: number;
  hp: number;
  level: number;
  hasFinished?: boolean;
  completedCourses?: string[];
  isPro?: boolean;
  onSelectCourse: (courseId: string) => void;
  onBack: () => void;
  onSignup?: () => void;
  onGoPro?: () => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ hearts, hp, level, hasFinished, completedCourses, isPro, onSelectCourse, onBack, onSignup, onGoPro }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col font-sans transition-colors duration-300">
      <Header hearts={hearts} hp={hp} level={level} onLogoClick={onBack} onSignup={onSignup} onGoPro={onGoPro} />
      
      <main className="flex-1 overflow-y-auto py-24 px-4 sm:px-6 lg:px-8 relative">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-500/10 dark:bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white mb-4"
            >
              Course Catalog
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-600 dark:text-slate-300 font-medium"
            >
              Choose your next learning adventure.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {COURSES.map((course, index) => {
              let isAvailable = false;
              let isLocked = true;
              let lockedMessage = 'Complete previous course to unlock';

              if (course.id === 'vibe-coding') {
                isAvailable = true;
                isLocked = false;
              } else if (course.id === 'advanced-ai-agents') {
                const hasPrereq = !!completedCourses?.includes('vibe-coding') || !!hasFinished;
                isAvailable = hasPrereq && !!isPro;
                isLocked = !isAvailable;
                lockedMessage = !hasPrereq ? 'Complete Vibe Coding Masterclass to unlock' : 'Pro Required';
              } else if (course.id === 'prompt-engineering-pro') {
                const hasPrereq = !!completedCourses?.includes('advanced-ai-agents');
                isAvailable = hasPrereq && !!isPro;
                isLocked = !isAvailable;
                lockedMessage = !hasPrereq ? 'Complete Building AI Agents to unlock' : 'Pro Required';
              } else if (course.id === 'fullstack-vibe') {
                const hasPrereq = !!completedCourses?.includes('prompt-engineering-pro');
                isAvailable = hasPrereq && !!isPro;
                isLocked = !isAvailable;
                lockedMessage = !hasPrereq ? 'Complete Prompt Engineering Pro to unlock' : 'Pro Required';
              }
              
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={isAvailable ? { scale: 1.02, y: -4 } : {}}
                  className={`neo-brutal p-6 sm:p-8 bg-white dark:bg-slate-900 transition-all duration-300 relative overflow-hidden flex flex-col h-full ${
                    isAvailable 
                      ? 'cursor-pointer border-slate-200 dark:border-slate-700 hover:border-violet-500 dark:hover:border-violet-400' 
                      : 'opacity-80 border-slate-200 dark:border-slate-800'
                  }`}
                  onClick={() => isAvailable && onSelectCourse(course.id)}
                >
                  {isLocked && (
                    <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-[2px] z-20 flex items-center justify-center">
                      <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center gap-2 shadow-lg max-w-[90%] text-center">
                        <Lock className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                        <span className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider truncate">{lockedMessage}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-6 relative z-10">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center shadow-lg`}>
                      <course.icon className="w-7 h-7 text-white" />
                    </div>
                    {isAvailable && (completedCourses?.includes(course.id) || (course.id === 'vibe-coding' && hasFinished)) && (
                      <div className="flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight relative z-10">
                    {course.title}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-8 flex-1 relative z-10">
                    {course.description}
                  </p>

                  {isAvailable && (
                    <div className="relative z-10 flex items-center text-violet-600 dark:text-violet-400 font-bold group">
                      <PlayCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      {completedCourses?.includes(course.id) || (course.id === 'vibe-coding' && hasFinished) ? 'Review Course' : 'Continue Course'}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {!isPro && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="neo-brutal p-8 bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Rocket className="w-32 h-32 rotate-12" />
              </div>
              <h3 className="text-3xl font-black mb-4 relative z-10 tracking-tight">Unlock Everything for $10</h3>
              <p className="text-violet-100 font-medium mb-8 max-w-lg mx-auto relative z-10">
                Get lifetime access to all courses, infinite hearts, and exclusive project blueprints. One-time payment, forever vibes.
              </p>
              <button
                onClick={onGoPro}
                className="bg-white text-violet-600 px-8 py-4 rounded-xl font-black text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all relative z-10"
              >
                Upgrade to Pro
              </button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};
