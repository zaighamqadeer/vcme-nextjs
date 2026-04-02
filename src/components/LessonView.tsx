import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Send,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  HelpCircle,
  Code2,
  Heart,
  Rocket,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Lesson } from '../data/lessons';
import { getVibeFeedback, getHint } from '../services/gemini';

interface LessonViewProps {
  lesson: Lesson;
  onComplete: (success: boolean) => void;
  onBack: () => void;
  hearts: number;
  isPro?: boolean;
}

const TYPE_META = {
  info: { label: 'Reading', icon: BookOpen },
  quiz: { label: 'Quiz', icon: HelpCircle },
  task: { label: 'Practice', icon: Code2 },
} as const;

const TYPE_COLORS = {
  info: 'indigo',
  quiz: 'emerald',
  task: 'sky',
} as const;

export const LessonView: React.FC<LessonViewProps> = ({ lesson, onComplete, onBack, hearts, isPro }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [taskInput, setTaskInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string; rating?: number } | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    setSelectedOption(null);
    setTaskInput('');
    setFeedback(null);
    setCurrentSlide(0);
    setFailedAttempts(0);
    setHint(null);
  }, [lesson.id]);

  const slides = lesson.content.split('\n\n').filter(s => s.trim().length > 0);
  const isLastSlide = currentSlide === slides.length - 1;
  const typeMeta = TYPE_META[lesson.type];
  const typeColor = TYPE_COLORS[lesson.type];

  const colorClasses = {
    indigo: { bg: 'bg-indigo-50 dark:bg-indigo-950', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-950', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800' },
    sky: { bg: 'bg-sky-50 dark:bg-sky-950', text: 'text-sky-700 dark:text-sky-300', border: 'border-sky-200 dark:border-sky-800' },
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (lesson.type === 'info') {
      setIsSubmitting(true);
      try {
        await onComplete(true);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (lesson.type === 'quiz') {
      if (!selectedOption) return;
      const isCorrect = selectedOption === lesson.correctAnswer;
      setFeedback({
        isCorrect,
        message: isCorrect
          ? 'Correct. Well done.'
          : 'Not quite. Review the material and try again.',
      });
      if (!isCorrect) {
        onComplete(false);
      }
      return;
    }

    if (lesson.type === 'task') {
      if (!taskInput.trim()) return;
      setIsSubmitting(true);
      try {
        const response = await getVibeFeedback(lesson.taskPrompt || '', taskInput);
        setFeedback({ isCorrect: response.pass, message: response.feedback, rating: response.rating });
        if (!response.pass) {
          const newFailedCount = failedAttempts + 1;
          setFailedAttempts(newFailedCount);
          if (newFailedCount >= 2) {
            const aiHint = await getHint(lesson.taskPrompt || '', taskInput);
            setHint(aiHint || "Try to be more specific about the features you want!");
          }
          onComplete(false);
        } else {
          setFailedAttempts(0);
          setHint(null);
        }
      } catch {
        setFeedback({ isCorrect: false, message: 'Something went wrong. Please try again.' });
        onComplete(false);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleContinue = async () => {
    if (isSubmitting) return;

    if (feedback?.isCorrect) {
      setIsSubmitting(true);
      try {
        await onComplete(true);
        setSelectedOption(null);
        setTaskInput('');
        setFeedback(null);
        setCurrentSlide(0);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setFeedback(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">

      {/* ── Top Bar ─────────────────────────────────────── */}
      <header className="relative flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800">
          <motion.div 
            className="h-full bg-indigo-600 dark:bg-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Back to Map"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={onBack}
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-slate-900 dark:text-white tracking-tight hidden xs:block">
              just<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">vibecode</span>
            </span>
          </div>
          <div className={`hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${colorClasses[typeColor].bg} ${colorClasses[typeColor].text}`}>
            <typeMeta.icon className="w-3.5 h-3.5" />
            {typeMeta.label}
          </div>
        </div>

        <div className="flex-1 text-center px-4">
          <h1 className="font-semibold text-slate-900 dark:text-white text-sm md:text-base truncate">{lesson.title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-pink-50 dark:bg-pink-900/20 px-2.5 py-1 rounded-full border border-pink-200 dark:border-pink-800/50">
            <Heart className={`w-4 h-4 ${hearts > 0 || isPro ? 'fill-pink-500 text-pink-500' : 'text-slate-300 dark:text-slate-600 fill-transparent'}`} />
            <span className="text-pink-700 dark:text-pink-400 font-bold text-xs">{isPro ? '∞' : hearts}</span>
          </div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums hidden xs:block">
            {currentSlide + 1} / {slides.length}
          </div>
        </div>
      </header>

      {/* ── Main Content ────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 max-w-3xl mx-auto w-full">

        {/* Slide Card */}
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
        >
          <div className="p-8 md:p-10 prose prose-slate dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {slides[currentSlide]}
            </ReactMarkdown>
          </div>
        </motion.div>

        {/* Dot Navigation */}
        {slides.length > 1 && (
          <div className="flex items-center gap-2 mt-6">
            <button
              onClick={() => setCurrentSlide(s => Math.max(0, s - 1))}
              disabled={currentSlide === 0}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    idx === currentSlide
                      ? 'w-6 bg-indigo-600 dark:bg-indigo-400'
                      : 'w-1.5 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentSlide(s => Math.min(slides.length - 1, s + 1))}
              disabled={currentSlide === slides.length - 1}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── Quiz Options ─────────────────────────────────── */}
        <AnimatePresence>
          {isLastSlide && lesson.type === 'quiz' && lesson.options && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full mt-8 space-y-3"
            >
              {lesson.options.map((option, index) => {
                const isSelected = selectedOption === option;
                const isCorrectOption = feedback && option === lesson.correctAnswer;
                const isWrongSelected = feedback && isSelected && !isCorrectOption;

                const letter = String.fromCharCode(65 + index); // A, B, C, D

                let optionClass = 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600';
                if (isCorrectOption) optionClass = 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950';
                if (isWrongSelected) optionClass = 'border-red-400 bg-red-50 dark:bg-red-950';

                return (
                  <motion.button
                    key={option}
                    whileHover={!feedback ? { scale: 1.01 } : {}}
                    whileTap={!feedback ? { scale: 0.99 } : {}}
                    animate={
                      isCorrectOption ? { scale: [1, 1.02, 1], transition: { duration: 0.4 } } :
                      isWrongSelected ? { x: [-4, 4, -4, 4, 0], transition: { duration: 0.4 } } :
                      isSelected ? { borderColor: 'var(--color-indigo-500)', scale: 1.01 } :
                      { scale: 1, x: 0 }
                    }
                    onClick={() => !feedback && setSelectedOption(option)}
                    disabled={!!feedback}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 bg-white dark:bg-slate-900 text-left transition-all ${optionClass} ${!!feedback ? 'cursor-default' : 'cursor-pointer'} ${isSelected && !feedback ? 'border-indigo-500 ring-2 ring-indigo-500/10' : ''}`}
                  >
                    <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      isCorrectOption ? 'bg-emerald-500 text-white' :
                      isWrongSelected  ? 'bg-red-500 text-white' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {isCorrectOption ? <CheckCircle2 className="w-4 h-4" /> :
                       isWrongSelected  ? <XCircle className="w-4 h-4" /> : letter}
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 text-sm font-medium">{option}</span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Task Input ───────────────────────────────────── */}
        <AnimatePresence>
          {isLastSlide && lesson.type === 'task' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full mt-8"
            >
              <textarea
                value={taskInput}
                onChange={e => setTaskInput(e.target.value)}
                placeholder="Paste your code or prompt here..."
                rows={6}
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-sm font-mono placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-600 transition-colors"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Feedback Banner ───────────────────────────────── */}
        <AnimatePresence>
          {feedback && (
            <div className="w-full">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`w-full mt-6 p-4 rounded-xl border flex items-start gap-3 ${
                  feedback.isCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800'
                    : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
                }`}
              >
                <div className={`flex-shrink-0 mt-0.5 ${feedback.isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {feedback.isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${feedback.isCorrect ? 'text-emerald-800 dark:text-emerald-200' : 'text-red-800 dark:text-red-200'}`}>
                    {feedback.isCorrect ? 'Great work.' : 'Not quite there.'}
                  </p>
                  <p className={`text-sm mt-1 ${feedback.isCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>
                    {feedback.message}
                  </p>
                  {feedback.rating && (
                    <div className="flex items-center gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <div key={star} className={`w-2 h-2 rounded-full ${star <= feedback.rating! ? 'bg-amber-400' : 'bg-slate-300 dark:bg-slate-600'}`} />
                      ))}
                      <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">{feedback.rating}/5</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {hint && !feedback.isCorrect && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full mt-4 p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 flex items-start gap-3"
                >
                  <div className="flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-amber-800 dark:text-amber-200">AI Mentor Suggestion</p>
                    <p className="text-sm mt-1 text-amber-700 dark:text-amber-300 italic">
                      "{hint}"
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>

        {/* ── Action Bar ───────────────────────────────────── */}
        <div className="flex items-center gap-3 mt-8">
          {!feedback ? (
            <>
              <button
                onClick={isLastSlide ? handleSubmit : () => setCurrentSlide(s => s + 1)}
                disabled={
                  isLastSlide && (
                    (lesson.type === 'quiz' && !selectedOption) ||
                    (lesson.type === 'task' && !taskInput.trim()) ||
                    isSubmitting
                  )
                }
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 text-sm"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Evaluating...
                  </>
                ) : !isLastSlide ? (
                  <>Next <ArrowRight className="w-4 h-4" /></>
                ) : lesson.type === 'info' ? (
                  <>Continue <ArrowRight className="w-4 h-4" /></>
                ) : (
                  <>Submit <Send className="w-4 h-4" /></>
                )}
              </button>
            </>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleContinue}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 text-sm"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Continuing...
                  </>
                ) : (
                  <>
                    {feedback.isCorrect ? 'Next Lesson' : 'Try Again'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {failedAttempts >= 2 && !feedback.isCorrect && (
                <button
                  onClick={() => onComplete(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 text-sm"
                >
                  Skip Lesson
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
