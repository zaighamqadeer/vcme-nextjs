import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Lock, PlayCircle, Rocket } from 'lucide-react';
import type { Chapter } from '../data/lessons';

interface ChapterMapProps {
  chapters: Chapter[];
  currentChapterIndex: number;
  currentLessonIndex: number;
  hasFinished?: boolean;
  isPro?: boolean;
  onSelectChapter: (index: number) => void;
  onGoPro?: () => void;
}

export const ChapterMap: React.FC<ChapterMapProps> = ({
  chapters,
  currentChapterIndex,
  currentLessonIndex,
  hasFinished,
  isPro,
  onSelectChapter,
  onGoPro,
}) => {
  return (
    <div className="max-w-4xl mx-auto py-32 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-500/10 dark:bg-violet-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen" />

      <div className="text-center mb-24 relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white mb-6"
        >
          {hasFinished ? "Mission Accomplished!" : "Your Mission Map"}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-slate-600 dark:text-slate-300 font-medium"
        >
          {hasFinished ? "You've mastered Vibe Coding. Revisit any level!" : "Complete levels to become a coding wizard!"}
        </motion.p>
      </div>

      <div className="relative z-10">
        {/* Vertical Line */}
        <div className="absolute left-8 top-8 bottom-8 w-2 md:left-1/2 md:-translate-x-1/2 bg-slate-200 dark:bg-slate-800 rounded-full">
          {/* Animated progress line */}
          <motion.div 
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-violet-500 to-fuchsia-500 rounded-full shadow-sm"
            initial={{ height: 0 }}
            animate={{ height: hasFinished ? '100%' : `${(currentChapterIndex / (chapters.length - 1)) * 100}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {/* Glowing tip */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-slate-900 border-4 border-fuchsia-500 rounded-full shadow-[0_0_10px_rgba(217,70,239,0.5)]" />
          </motion.div>
        </div>

        <div className="space-y-16">
          {chapters.map((chapter, index) => {
            const isCompleted = hasFinished || index < currentChapterIndex;
            const isCurrent = !hasFinished && index === currentChapterIndex;
            const isLocked = !hasFinished && index > currentChapterIndex;

            return (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'
                }`}
              >
                {/* Horizontal Connector */}
                <div className={`absolute top-1/2 -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-800 w-16 z-0 ${
                  index % 2 === 0 ? 'left-8 md:left-1/2' : 'left-8 md:left-auto md:right-1/2'
                }`}>
                  {(isCompleted || isCurrent) && (
                    <motion.div 
                      className={`absolute top-0 h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-sm ${
                        index % 2 === 0 ? 'left-0' : 'left-0 md:left-auto md:right-0'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
                    />
                  )}
                </div>

                {/* Center Node */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex h-16 w-16 items-center justify-center rounded-full border-4 border-slate-50 dark:border-slate-950 bg-white dark:bg-slate-900 z-10 transition-all duration-300">
                  {isCurrent && (
                    <motion.div 
                      className="absolute inset-0 rounded-full border-4 border-fuchsia-500"
                      animate={{ scale: [1, 1.4], opacity: [0.8, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                    />
                  )}
                  {isCompleted ? (
                    <div className="w-full h-full rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center border-2 border-violet-300 dark:border-violet-700">
                      <CheckCircle2 className="h-8 w-8 text-violet-600 dark:text-violet-400" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-fuchsia-500/30">
                      <Rocket className="h-7 w-7 text-white" />
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-slate-200 dark:border-slate-700">
                      <Lock className="h-6 w-6 text-slate-400 dark:text-slate-500" />
                    </div>
                  )}
                </div>

                {/* Content Card */}
                <motion.div
                  className={`ml-24 md:ml-0 md:w-1/2 ${
                    index % 2 === 0 ? 'md:pl-16' : 'md:pr-16'
                  }`}
                  whileHover={!isLocked ? { scale: 1.02, y: -5 } : {}}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div
                    className={`neo-brutal p-8 bg-white dark:bg-slate-900 transition-all duration-500 relative overflow-hidden ${
                      isCurrent
                        ? 'border-violet-500 dark:border-violet-400 cursor-pointer'
                        : isCompleted
                        ? 'cursor-pointer'
                        : 'opacity-50 grayscale cursor-not-allowed border-slate-200 dark:border-slate-800 shadow-none hover:shadow-none hover:translate-x-0 hover:translate-y-0'
                    }`}
                    onClick={() => {
                      if (!isLocked) {
                        onSelectChapter(index);
                      }
                    }}
                  >
                    {/* Subtle gradient background for current chapter */}
                    {isCurrent && (
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 pointer-events-none" />
                    )}

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className={`text-sm font-black tracking-widest uppercase ${
                            isCurrent ? 'text-violet-600 dark:text-violet-400' : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          Level {index + 1}
                        </span>
                        {isCurrent && (
                          <span className="flex items-center text-xs font-bold text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 px-3 py-1 rounded-full shadow-sm">
                            In Progress
                          </span>
                        )}
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                        {chapter.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                        {chapter.description}
                      </p>
                      
                      {/* Progress indicator for current chapter */}
                      {isCurrent && (
                        <div className="mt-8">
                          <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
                            <span>Mission Progress</span>
                            <span className="text-violet-600 dark:text-violet-400">{currentLessonIndex} / {chapter.lessons.length}</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500" 
                              initial={{ width: 0 }}
                              animate={{ width: `${(currentLessonIndex / chapter.lessons.length) * 100}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {!isPro && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-24 neo-brutal p-8 bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white text-center relative overflow-hidden"
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
    </div>
  );
};
