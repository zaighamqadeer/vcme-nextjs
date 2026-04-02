import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, FileText, BookOpen, Rocket } from 'lucide-react';

interface LegalPageProps {
  onBack: () => void;
}

export const TermsOfService: React.FC<LegalPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <header className="w-full px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={onBack}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white">
              just<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">vibecode</span>
            </span>
          </div>
          <button
            onClick={onBack}
            className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </header>

      <div className="flex-1 py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center">
              <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Terms of Service</h1>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Last updated: March 28, 2026
            </p>

            <h2>1. Agreement to Terms</h2>
            <p>
              These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and justvibecode ("we," "us" or "our"), concerning your access to and use of the justvibecode application.
            </p>

            <h2>2. Intellectual Property Rights</h2>
            <p>
              Unless otherwise indicated, the App is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the App (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us.
            </p>

            <h2>3. User Representations</h2>
            <p>
              By using the App, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary.
            </p>

            <h2>4. Prohibited Activities</h2>
            <p>
              You may not access or use the App for any purpose other than that for which we make the App available. The App may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
            </p>

            <h2>5. User Generated Contributions</h2>
            <p>
              The App may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and other functionality, and may provide you with the opportunity to create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and materials to us or on the App.
            </p>

            <h2>6. Term and Termination</h2>
            <p>
              These Terms of Service shall remain in full force and effect while you use the App. WITHOUT LIMITING ANY OTHER PROVISION OF THESE TERMS OF SERVICE, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE APP.
            </p>

            <h2>7. Governing Law</h2>
            <p>
              These Terms of Service and your use of the App are governed by and construed in accordance with the laws of the jurisdiction in which we operate.
            </p>

            <h2>8. Contact Us</h2>
            <p>
              In order to resolve a complaint regarding the App or to receive further information regarding use of the App, please contact us at terms@vibecode.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
