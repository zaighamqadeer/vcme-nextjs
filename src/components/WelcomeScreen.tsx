import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, Sparkles, ArrowRight, Zap, LogIn, BookOpen, 
  Heart, Coffee, Brain, Code, Database, CreditCard, CheckCircle2, 
  TrendingUp, Terminal, Shield, Star, Play, ShieldCheck
} from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';

interface WelcomeScreenProps {
  onStart: () => void;
  onResume?: () => void;
  onViewPrivacy: () => void;
  onViewTerms: () => void;
  onSignup: () => void;
  hasProgress?: boolean;
  isPro?: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onResume, onViewPrivacy, onViewTerms, onSignup, hasProgress, isPro }) => {
  const { user } = useFirebase();
  const words = ["apps", "SaaS", "tools", "ideas"];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const dynamicText = words[wordIndex];

  const handleStart = () => {
    if (user) {
      if (hasProgress && onResume) {
        onResume();
      } else {
        onStart();
      }
    } else {
      onSignup();
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-50 flex flex-col font-sans selection:bg-violet-500/30">
      {/* Navbar */}
      <header className="w-full px-6 py-4 flex items-center justify-between max-w-7xl mx-auto z-50 relative">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)] group-hover:scale-110 transition-transform">
            <Rocket className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-xl tracking-tight text-white">
            just<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">vibecode</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <button onClick={onStart} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Curriculum</button>
          {!user ? (
            <button 
              onClick={onSignup}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-sm font-semibold text-white transition-all backdrop-blur-sm"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          ) : (
            <button 
              onClick={handleStart}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-sm font-bold text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4" />
              {hasProgress ? 'Resume' : 'Start'}
            </button>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-24 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-bold text-violet-300 tracking-wide uppercase">The Future of Coding is Here</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tighter mb-8">
            Stop learning to code. <br className="hidden md:block" />
            Start building <br className="md:hidden" />
            <span className="inline-flex items-center justify-center relative w-[280px] md:w-[400px] h-[1.2em] align-bottom overflow-hidden text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={dynamicText}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.5, ease: "circOut" }}
                  className="absolute inset-0 text-left md:text-center"
                >
                  {dynamicText}.
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 leading-relaxed mb-12 max-w-2xl mx-auto font-medium">
            The traditional way of coding is dead. Master <strong className="text-white font-bold">Vibe Coding</strong> and deploy full-stack AI applications in hours, not months. Zero experience required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button
              onClick={handleStart}
              className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-3 px-8 py-5 bg-white text-slate-950 font-black text-lg rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)]"
            >
              {hasProgress ? 'Resume Learning' : 'Start Building for Free'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            {!isPro && (
              <div className="flex items-center gap-3 text-sm font-medium text-slate-400">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-[#0B0F19] bg-slate-800 flex items-center justify-center overflow-hidden`}>
                      <img src={`https://picsum.photos/seed/user${i}/32/32`} alt="User" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col items-start">
                  <div className="flex text-amber-400">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                  </div>
                  <span>Join 10,000+ learners</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </main>

      {/* The "Coffee" Pitch (Hidden for Pro users) */}
      {!isPro && (
        <section className="w-full py-24 px-6 bg-[#111827] relative border-y border-white/5">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
                The best ROI of your career.
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Skip the $15,000 coding bootcamps. For less than the price of your morning coffee run, you get lifetime access to skills that pay thousands.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
              {/* Coffee */}
              <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-slate-900/50 border border-slate-800 w-full md:w-72 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="w-20 h-20 bg-amber-900/30 rounded-full flex items-center justify-center mb-6">
                  <Coffee className="w-10 h-10 text-amber-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">2 Lattes</h3>
                <p className="text-4xl font-black text-slate-500 mb-4">$10</p>
                <ul className="text-slate-400 space-y-2 text-sm font-medium text-left w-full">
                  <li className="flex items-center gap-2"><span className="text-red-500">✕</span> Gone in 20 minutes</li>
                  <li className="flex items-center gap-2"><span className="text-red-500">✕</span> Zero return on investment</li>
                  <li className="flex items-center gap-2"><span className="text-red-500">✕</span> Just caffeine</li>
                </ul>
              </div>

              <div className="text-3xl font-black text-slate-700 italic">VS</div>

              {/* Pro Access */}
              <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-gradient-to-b from-violet-900/40 to-slate-900/80 border border-violet-500/30 w-full md:w-80 shadow-[0_0_50px_-12px_rgba(139,92,246,0.3)] transform md:scale-110">
                <div className="absolute -top-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                  Lifetime Access
                </div>
                <div className="w-20 h-20 bg-violet-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(139,92,246,0.4)]">
                  <Brain className="w-10 h-10 text-violet-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Pro Mastery</h3>
                <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-4">$10</p>
                <ul className="text-slate-300 space-y-3 text-sm font-medium text-left w-full">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Build apps forever</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> High-income skills</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Infinite practice hearts</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> All future updates</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Skills Showcase */}
      <section className="w-full py-24 px-6 bg-[#0B0F19]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
              What you'll actually learn.
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              We don't teach theory. We teach you how to build, deploy, and monetize real products using the modern AI stack.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Terminal, title: "AI Prompt Engineering", desc: "Master the art of talking to AI. Learn to write prompts that generate production-ready code on the first try.", color: "text-blue-400", bg: "bg-blue-500/10" },
              { icon: Code, title: "React & Tailwind CSS", desc: "Build beautiful, responsive user interfaces instantly. Understand component architecture and modern styling.", color: "text-cyan-400", bg: "bg-cyan-500/10" },
              { icon: Database, title: "Firebase Backend", desc: "Set up databases, authentication, and secure rules without writing complex backend boilerplate.", color: "text-amber-400", bg: "bg-amber-500/10" },
              { icon: CreditCard, title: "Stripe Monetization", desc: "Turn your ideas into businesses. Integrate payment gateways, subscriptions, and webhooks securely.", color: "text-indigo-400", bg: "bg-indigo-500/10" },
              { icon: Brain, title: "AI Agents Integration", desc: "Add intelligence to your apps. Connect Gemini, OpenAI, and build autonomous agents that do work for your users.", color: "text-fuchsia-400", bg: "bg-fuchsia-500/10" },
              { icon: Rocket, title: "Deployment & Hosting", desc: "Take your app from localhost to the world. Learn CI/CD, hosting, and how to share your creations instantly.", color: "text-emerald-400", bg: "bg-emerald-500/10" },
            ].map((skill, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:bg-slate-800/50 transition-colors group">
                <div className={`w-14 h-14 rounded-2xl ${skill.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <skill.icon className={`w-7 h-7 ${skill.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{skill.title}</h3>
                <p className="text-slate-400 leading-relaxed">{skill.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-24 px-6 bg-[#0B0F19] relative border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
              Don't just take our word for it.
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Join thousands of others who have transformed their careers and businesses with Vibe Coding.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Sarah J.", role: "Product Manager", text: "I had zero coding experience. Within 2 weeks, I built and launched a SaaS tool that my team uses daily. The ROI is insane." },
              { name: "Michael T.", role: "Freelance Designer", text: "The AI agent masterclass alone is worth 10x the price. I'm now charging clients $5k+ for custom AI integrations." },
              { name: "Elena R.", role: "Startup Founder", text: "I was quoted $20k to build my MVP. I bought this course for $10 and built it myself in a weekend. Best investment ever." }
            ].map((t, i) => (
              <div key={i} className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 relative hover:bg-slate-800/50 transition-colors flex flex-col">
                <div className="flex text-amber-400 mb-4">
                  {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-slate-300 mb-6 text-lg leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden shrink-0">
                    <img src={`https://picsum.photos/seed/testimonial${i+10}/40/40`} alt={t.name} referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{t.name}</h4>
                    <p className="text-slate-500 text-sm">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-24 px-6 bg-[#111827] border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "Do I need prior coding experience?", a: "Absolutely not. Vibe Coding is designed for complete beginners. If you can write an email, you can build an app with our AI-first approach." },
              { q: "Is it really a one-time payment?", a: "Yes. You pay $10 once and get lifetime access to the current curriculum and all future updates. No monthly subscriptions." },
              { q: "What kind of apps will I be able to build?", a: "You'll learn to build full-stack web applications with authentication, databases, payment processing, and AI integrations." },
              { q: "How long does it take to complete?", a: "Most students build their first working app within 48 hours. The entire mastery curriculum takes about 2-3 weeks of part-time learning." }
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
                <h3 className="text-xl font-bold text-white mb-2">{faq.q}</h3>
                <p className="text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section (Hidden for Pro users) */}
      {!isPro && (
        <section className="w-full bg-[#111827] py-24 px-6 border-t border-white/5 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-violet-600/10 blur-[100px] pointer-events-none" />
          
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                Ready to become a <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Vibe Coder?</span>
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                No subscriptions. No hidden fees. Just one payment for lifetime access to the ultimate AI coding curriculum.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">
              {/* Free Plan */}
              <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 flex flex-col h-full">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Free Explorer</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-white">$0</span>
                  </div>
                  <p className="text-slate-500 mt-2">Perfect for testing the waters.</p>
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  <li className="flex items-center gap-3 text-slate-300 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-slate-600" />
                    <span>Basic Vibe Coding Intro</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-300 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-slate-600" />
                    <span>5 Hearts (Refill daily)</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-600 font-medium">
                    <span className="w-5 h-5 flex items-center justify-center text-xs">✕</span>
                    <span>Advanced Full-Stack Course</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-600 font-medium">
                    <span className="w-5 h-5 flex items-center justify-center text-xs">✕</span>
                    <span>AI Agent Masterclass</span>
                  </li>
                </ul>
                <button 
                  onClick={onSignup}
                  className="w-full py-4 px-6 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors"
                >
                  Start for Free
                </button>
              </div>

              {/* Pro Plan */}
              <div className="relative bg-gradient-to-b from-violet-900/80 to-slate-900 p-1 rounded-3xl shadow-[0_0_80px_-20px_rgba(139,92,246,0.4)] transform md:scale-105 z-10">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-lg whitespace-nowrap">
                  Most Popular
                </div>
                <div className="bg-[#0B0F19] p-8 rounded-[22px] h-full flex flex-col">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                      Pro Lifetime <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
                    </h3>
                    <div className="flex items-baseline gap-3">
                      <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">$10</span>
                      <span className="text-2xl text-slate-500 line-through font-bold">$99</span>
                    </div>
                    <p className="text-emerald-400 font-bold mt-3 flex items-center gap-2">
                      <Shield className="w-4 h-4" /> One-time payment. Yours forever.
                    </p>
                  </div>
                  <ul className="space-y-4 mb-10 flex-1">
                    <li className="flex items-center gap-3 text-white font-bold">
                      <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                      <span>Infinite Practice Hearts</span>
                    </li>
                    <li className="flex items-center gap-3 text-white font-bold">
                      <Rocket className="w-5 h-5 text-violet-400 fill-violet-400" />
                      <span>Full-Stack App Course</span>
                    </li>
                    <li className="flex items-center gap-3 text-white font-bold">
                      <Brain className="w-5 h-5 text-fuchsia-400 fill-fuchsia-400" />
                      <span>AI Agent Masterclass</span>
                    </li>
                    <li className="flex items-center gap-3 text-white font-bold">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                      <span>All Future Content Updates</span>
                    </li>
                  </ul>
                  <button 
                    onClick={handleStart}
                    className="w-full py-5 px-6 rounded-xl bg-white text-slate-950 font-black text-lg hover:scale-[1.02] hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)] transition-all duration-300"
                  >
                    Claim Lifetime Access
                  </button>
                  <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                    <div>
                      <h4 className="text-emerald-400 font-bold text-sm">100% Risk-Free Guarantee</h4>
                      <p className="text-slate-400 text-xs mt-1">If you don't build a working app in 30 days, we'll refund you. No questions asked.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="w-full border-t border-white/10 py-12 px-6 bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-white tracking-tight">
              just<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">vibecode</span>
            </span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-medium text-slate-400">
            <button onClick={onViewPrivacy} className="hover:text-white transition-colors">Privacy Policy</button>
            <button onClick={onViewTerms} className="hover:text-white transition-colors">Terms of Service</button>
            <a href="mailto:support@vibecode.com" className="hover:text-white transition-colors">Support</a>
          </div>

          <p className="text-sm text-slate-500 font-medium">
            © 2026 justvibecode. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
