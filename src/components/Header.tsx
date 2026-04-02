import React from 'react';
import { Heart, Shield, LogOut, User as UserIcon, Rocket, BookOpen } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';

interface HeaderProps {
  hearts: number;
  hp: number;
  level: number;
  onLogoClick?: () => void;
  onCoursesClick?: () => void;
  onSignup?: () => void;
  onGoPro?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ hearts, hp, level, onLogoClick, onCoursesClick, onSignup, onGoPro }) => {
  const { user, profile, logout } = useFirebase();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-8">
          {/* Logo/Brand */}
          <div 
            className="flex items-center gap-2 group cursor-pointer"
            onClick={onLogoClick}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform">
              <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="font-black text-xl sm:text-2xl tracking-tight hidden sm:block text-slate-900 dark:text-white">
              just<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">vibecode</span>
            </span>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          {onCoursesClick && (
            <button 
              onClick={onCoursesClick}
              className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors mr-2"
            >
              <BookOpen className="w-4 h-4" />
              Courses
            </button>
          )}

          {/* Stats */}
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2 bg-violet-100 dark:bg-violet-900/30 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-violet-200 dark:border-violet-800">
              <span className="text-violet-700 dark:text-violet-300 font-black text-xs sm:text-sm">LVL {level}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-pink-50 dark:bg-pink-900/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-pink-200 dark:border-pink-800/50">
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${hearts > 0 || profile?.isPro ? 'fill-pink-500 text-pink-500' : 'text-slate-300 dark:text-slate-600 fill-transparent'}`} />
              <span className="text-pink-700 dark:text-pink-400 font-bold text-sm">
                {profile?.isPro ? '∞' : hearts}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/50">
              <Shield className="w-4 h-4 text-emerald-500" />
              <div className="w-24 h-2 bg-emerald-200 dark:bg-emerald-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 shadow-sm transition-all duration-500 ease-out"
                  style={{ width: `${hp}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3 sm:gap-4">
              {!profile?.isPro && (
                <button 
                  onClick={onGoPro}
                  className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-bold text-xs border border-amber-200 dark:border-amber-800 hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  Go Pro
                </button>
              )}
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="flex items-center justify-end gap-1.5">
                    {profile?.isPro && (
                      <span className="text-[10px] font-black bg-gradient-to-r from-amber-400 to-orange-500 text-white px-1.5 py-0.5 rounded-sm uppercase tracking-wider shadow-sm">
                        Pro
                      </span>
                    )}
                    <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{user.displayName}</div>
                  </div>
                  <div className="text-xs text-violet-600 dark:text-violet-400 font-bold">{profile?.xp || 0} XP</div>
                </div>
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'User'} 
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-violet-200 dark:border-violet-800 shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center">
                    <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 dark:text-slate-400" />
                  </div>
                )}
              </div>
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors rounded-full hover:bg-pink-50 dark:hover:bg-pink-900/20"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onSignup}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm sm:text-base"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
