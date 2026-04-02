import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Shield, BookOpen, Rocket } from 'lucide-react';

interface LegalPageProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<LegalPageProps> = ({ onBack }) => {
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
              <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Privacy Policy</h1>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Last updated: March 28, 2026
            </p>

            <h2>1. Introduction</h2>
            <p>
              Welcome to justvibecode. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.
            </p>

            <h2>2. Information We Collect</h2>
            <p>
              We collect personal information that you voluntarily provide to us when you register on the App, express an interest in obtaining information about us or our products and services, or otherwise when you contact us.
            </p>
            <ul>
              <li><strong>Personal Information Provided by You:</strong> We collect names; email addresses; passwords; and other similar information.</li>
              <li><strong>Authentication Data:</strong> We use Google Authentication to allow you to sign in. We receive your name and email address from Google.</li>
              <li><strong>Usage Data:</strong> We collect information about your progress in lessons, hearts, level, and XP to provide a personalized experience.</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>
              We use personal information collected via our App for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
            </p>

            <h2>4. Will Your Information Be Shared With Anyone?</h2>
            <p>
              We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
            </p>

            <h2>5. Cookies and Other Tracking Technologies</h2>
            <p>
              We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy.
            </p>

            <h2>6. How Long Do We Keep Your Information?</h2>
            <p>
              We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law.
            </p>

            <h2>7. How Do We Keep Your Information Safe?</h2>
            <p>
              We aim to protect your personal information through a system of organizational and technical security measures.
            </p>

            <h2>8. Your Privacy Rights</h2>
            <p>
              In some regions (like the EEA and UK), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability.
            </p>

            <h2>9. Contact Us</h2>
            <p>
              If you have questions or comments about this policy, you may email us at privacy@vibecode.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
