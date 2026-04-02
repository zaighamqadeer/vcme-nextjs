import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { LessonView } from './components/LessonView';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ChapterMap } from './components/ChapterMap';
import { PrivacyPolicy } from './components/legal/PrivacyPolicy';
import { TermsOfService } from './components/legal/TermsOfService';
import { CookieConsent } from './components/CookieConsent';
import { useFirebase } from './context/FirebaseContext';
import { auth } from './firebase';
import { Trophy, Heart, ArrowRight, Rocket } from 'lucide-react';
import { CoursesPage } from './components/CoursesPage';

import { SignupPage } from './components/SignupPage';
import { PricingPage } from './components/PricingPage';

export default function App() {
  const { user, profile, loading, updateProfile } = useFirebase();
  const [view, setView] = React.useState<'welcome' | 'courses' | 'map' | 'lesson' | 'privacy' | 'terms' | 'signup' | 'pricing'>('welcome');
  const [selectedCourseId, setSelectedCourseId] = React.useState<string>('vibe-coding');
  const [currentChapterIndex, setCurrentChapterIndex] = React.useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = React.useState(0);
  const [hearts, setHearts] = React.useState(5);
  const [hp, setHp] = React.useState(100);
  const [level, setLevel] = React.useState(1);
  const [isFinished, setIsFinished] = React.useState(false);

  const [chapters, setChapters] = useState<any[]>([]);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [loadingCourse, setLoadingCourse] = useState(false);
  const [loadingLesson, setLoadingLesson] = useState(false);
  const [paymentSuccessTab, setPaymentSuccessTab] = useState(false);

  // Fetch chapters
  useEffect(() => {
    const fetchChapters = async () => {
      setLoadingCourse(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://vcmeserver-git-366135769212.europe-west1.run.app';
        const res = await fetch(`${apiUrl}/api/courses/${selectedCourseId}/chapters`);
        const data = await res.json();
        setChapters(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCourse(false);
      }
    };
    fetchChapters();
  }, [selectedCourseId]);

  // Fetch current lesson
  useEffect(() => {
    const fetchLesson = async () => {
      if (chapters.length === 0) return;
      if (loading) return; // Wait for auth state to resolve

      setLoadingLesson(true);
      try {
        const token = await user?.getIdToken();
        const headers: Record<string, string> = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://vcmeserver-git-366135769212.europe-west1.run.app';
        const res = await fetch(`${apiUrl}/api/courses/${selectedCourseId}/chapters/${currentChapterIndex}/lessons/${currentLessonIndex}`, {
          headers
        });
        if (!res.ok) {
          if (res.status === 401) {
            console.error("Unauthorized to fetch lesson. Please log in.");
            setView('signup');
            return;
          }
          throw new Error(`Failed to fetch lesson: ${res.statusText}`);
        }
        const data = await res.json();
        setCurrentLesson(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingLesson(false);
      }
    };
    fetchLesson();
  }, [selectedCourseId, currentChapterIndex, currentLessonIndex, chapters, user, loading]);

  // Sync with Firebase profile when it changes
  useEffect(() => {
    if (profile) {
      setCurrentChapterIndex(profile.currentChapterIndex || 0);
      setCurrentLessonIndex(profile.currentLessonIndex || 0);
      setHearts(profile.hearts ?? 5);
      setHp(profile.hp ?? 100);
      setLevel(profile.level || 1);
      if (profile.selectedCourseId) {
        setSelectedCourseId(profile.selectedCourseId);
      }
    }
  }, [profile]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    if (urlParams.get('payment_success') === 'true') {
      setPaymentSuccessTab(true);
      
      const verifySession = async () => {
        if (!user || !sessionId) return;
        try {
          const token = await user.getIdToken();
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://vcmeserver-git-366135769212.europe-west1.run.app';
          const res = await fetch(`${apiUrl}/api/verify-checkout-session`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ sessionId })
          });
          const data = await res.json();
          if (data.success && data.isPro) {
            // Force local update so the UI updates immediately
            updateProfile({ isPro: true, hearts: 999 });
          }
        } catch (err) {
          console.error("Failed to verify session:", err);
        }
      };

      verifySession().then(() => {
        // Attempt to close the window automatically after verification
        setTimeout(() => {
          window.close();
        }, 3000);
      });
      
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [user]);

  const currentChapter = chapters[currentChapterIndex] || null;

  const handleLessonComplete = async (success: boolean) => {
    console.log('Lesson complete called:', { success, currentChapterIndex, currentLessonIndex });
    if (!currentChapter || !currentLesson) return;

    let nextChapter = currentChapterIndex;
    let nextLesson = currentLessonIndex;
    let nextHearts = hearts;
    let nextHp = hp;
    let nextLevel = level;
    let gainedXp = 0;
    let nextCompletedCourses = profile?.completedCourses || [];

    if (success) {
      if (currentLesson.type === 'info') gainedXp = 5;
      else if (currentLesson.type === 'quiz') gainedXp = 10;
      else if (currentLesson.type === 'task') gainedXp = 30;

      if (currentLessonIndex < currentChapter.lessons.length - 1) {
        nextLesson = currentLessonIndex + 1;
        console.log('Advancing to next lesson:', nextLesson);
      } else {
        // Chapter complete
        if (currentChapterIndex < chapters.length - 1) {
          nextChapter = currentChapterIndex + 1;
          nextLesson = 0;
          nextLevel = level + 1;
          console.log('Advancing to next chapter:', nextChapter);
          setView('map'); // Go back to map after chapter
        } else {
          console.log('Course complete!');
          // Course complete
          if (!nextCompletedCourses.includes(selectedCourseId)) {
            nextCompletedCourses = [...nextCompletedCourses, selectedCourseId];
          }
          
          if (selectedCourseId === 'vibe-coding') {
            setView('courses'); // Go back to courses to unlock next one
          } else if (selectedCourseId === 'advanced-ai-agents') {
            setView('courses');
          } else if (selectedCourseId === 'prompt-engineering-pro') {
            setView('courses');
          } else {
            setView('map');
          }
        }
      }
    } else {
      // Pro users don't lose hearts
      if (!profile?.isPro) {
        nextHearts = Math.max(0, hearts - 1);
        nextHp = Math.max(0, hp - 20);
      }
    }

    const isNowFinished = isFinished || (success && selectedCourseId === 'fullstack-vibe' && currentChapterIndex === chapters.length - 1 && currentLessonIndex === currentChapter.lessons.length - 1);

    // Prepare updates with new values
    const updates: any = {
      currentChapterIndex: nextChapter,
      currentLessonIndex: nextLesson,
      hearts: nextHearts,
      hp: nextHp,
      level: nextLevel,
      xp: (profile?.xp || 0) + gainedXp,
      hasFinished: isNowFinished,
      completedCourses: nextCompletedCourses
    };

    if (isNowFinished) setIsFinished(true);

    // Update local state immediately for responsiveness
    setCurrentChapterIndex(nextChapter);
    setCurrentLessonIndex(nextLesson);
    setHearts(nextHearts);
    setHp(nextHp);
    setLevel(nextLevel);

    if (success) {
      const currentCompleted = profile?.completedLessons || [];
      if (!currentCompleted.includes(currentLesson.id)) {
        updates.completedLessons = [...currentCompleted, currentLesson.id];
      }
    }

    // Sync to Firebase or Local Storage via context
    await updateProfile(updates);
  };

  const handleSelectChapter = (index: number) => {
    setCurrentChapterIndex(index);
    // If it's the current chapter, resume from the saved lesson index
    if (index === profile?.currentChapterIndex) {
      setCurrentLessonIndex(profile.currentLessonIndex);
    } else {
      setCurrentLessonIndex(0);
    }
    setView('lesson');
  };

  const handleSelectCourse = (id: string) => {
    if (id !== selectedCourseId) {
      setCurrentChapterIndex(0);
      setCurrentLessonIndex(0);
      updateProfile({ selectedCourseId: id, currentChapterIndex: 0, currentLessonIndex: 0 });
    }
    setSelectedCourseId(id);
    setView('map');
  };

  useEffect(() => {
    if (view === 'pricing' && profile?.isPro) {
      setView('courses');
    }
  }, [view, profile?.isPro]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-800 border-t-violet-600 dark:border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (paymentSuccessTab) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full neo-brutal bg-white dark:bg-slate-900 p-12"
        >
          <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-emerald-500 shadow-sm">
            <Trophy className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Payment Successful!</h1>
          <p className="text-slate-600 dark:text-slate-300 mb-10 text-lg font-medium">Your account has been upgraded to Pro. You can close this tab and return to the original window.</p>
          <button
            onClick={() => window.close()}
            className="glow-button w-full"
          >
            Close Tab
          </button>
        </motion.div>
      </div>
    );
  }

  if (view === 'welcome') {
    return (
      <>
        <WelcomeScreen 
          onStart={() => setView(profile?.isPro ? 'courses' : 'pricing')} 
          onResume={() => setView('lesson')}
          onViewPrivacy={() => setView('privacy')}
          onViewTerms={() => setView('terms')}
          onSignup={() => setView('signup')}
          hasProgress={!!profile && !!profile.uid && profile.uid !== 'guest'}
          isPro={profile?.isPro}
        />
        <CookieConsent />
      </>
    );
  }

  if (view === 'privacy') {
    return <PrivacyPolicy onBack={() => setView('welcome')} />;
  }

  if (view === 'terms') {
    return <TermsOfService onBack={() => setView('welcome')} />;
  }

  if (view === 'signup') {
    return <SignupPage onBack={() => setView('welcome')} onSuccess={() => setView('pricing')} />;
  }

  if (view === 'pricing') {
    if (profile?.isPro) {
      return null;
    }
    return <PricingPage onBack={() => setView('welcome')} onSuccess={() => setView('courses')} />;
  }

  if (view === 'courses') {
    return (
      <CoursesPage
        hearts={hearts}
        hp={hp}
        level={level}
        hasFinished={profile?.hasFinished}
        completedCourses={profile?.completedCourses}
        isPro={profile?.isPro}
        onSelectCourse={handleSelectCourse}
        onBack={() => setView('welcome')}
        onSignup={() => setView('signup')}
        onGoPro={() => setView('pricing')}
      />
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md w-full neo-brutal bg-white dark:bg-slate-900 p-12"
        >
          <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-emerald-500 shadow-sm">
            <Trophy className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">You did it!</h1>
          <p className="text-slate-600 dark:text-slate-300 mb-10 text-lg font-medium">You've completed all available courses. You are now a certified Vibe Coder!</p>
          <button
            onClick={() => {
              const resetData = {
                currentChapterIndex: 0,
                currentLessonIndex: 0,
                hearts: 5,
                hp: 100,
                level: 1,
                selectedCourseId: 'vibe-coding'
              };
              setCurrentChapterIndex(0);
              setCurrentLessonIndex(0);
              setIsFinished(false);
              setHearts(5);
              setHp(100);
              setLevel(1);
              setSelectedCourseId('vibe-coding');
              setView('courses');
              updateProfile(resetData);
            }}
            className="glow-button w-full"
          >
            View Courses
          </button>
        </motion.div>
      </div>
    );
  }

  if (loadingCourse || chapters.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-800 border-t-violet-600 dark:border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (view === 'map') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col font-sans transition-colors duration-300">
        <Header hearts={hearts} hp={hp} level={level} onLogoClick={() => setView('welcome')} onCoursesClick={() => setView('courses')} onSignup={() => setView('signup')} onGoPro={() => setView('pricing')} />
        <main className="flex-1 overflow-y-auto">
          <ChapterMap
            chapters={chapters}
            currentChapterIndex={currentChapterIndex}
            currentLessonIndex={currentLessonIndex}
            hasFinished={profile?.hasFinished}
            isPro={profile?.isPro}
            onSelectChapter={handleSelectChapter}
            onGoPro={() => setView('pricing')}
          />
        </main>
      </div>
    );
  }

  if (loadingLesson || !currentLesson) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-800 border-t-violet-600 dark:border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="font-sans transition-colors duration-300">
      <AnimatePresence mode="wait">
        <LessonView
          key={currentLesson.id}
          lesson={currentLesson}
          onComplete={handleLessonComplete}
          onBack={() => setView('map')}
          hearts={hearts}
          isPro={profile?.isPro}
        />
      </AnimatePresence>

      {hearts === 0 && (
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="neo-brutal p-12 max-w-md w-full text-center bg-white dark:bg-slate-900 border-red-500 dark:border-red-500"
          >
            <div className="w-24 h-24 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-red-500 shadow-sm">
              <Heart className="w-12 h-12 text-red-500 dark:text-red-400 fill-red-500 dark:fill-red-400" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Out of Hearts!</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-10 font-medium text-xl leading-relaxed">Don't worry! Mistakes help us learn. Take a breather and try again.</p>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  setHearts(5);
                  setHp(100);
                  setView('map');
                  updateProfile({ hearts: 5, hp: 100 });
                }}
                className="glow-button w-full"
              >
                Return to Map
              </button>
              <button
                onClick={() => {
                  setHearts(5);
                  setHp(100);
                  setView('pricing');
                }}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2"
              >
                <Rocket className="w-5 h-5" />
                Go Pro for Infinite Hearts
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

