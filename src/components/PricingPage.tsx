import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Rocket, Zap, Shield, Heart, ArrowRight, ArrowLeft } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';

interface PricingPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onBack, onSuccess }) => {
  const { user, profile } = useFirebase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const token = await user.getIdToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://vcmeserver-git-366135769212.europe-west1.run.app';
      const response = await fetch(`${apiUrl}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.uid,
          email: user.email,
          baseUrl: window.location.origin,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.url) {
        // Stripe Checkout cannot be loaded inside an iframe. 
        // We must open it in a new tab or the top-level window.
        window.open(data.url, '_blank');
        // Also provide a manual link in case the popup is blocked
        setLoading(false);
        setError('Checkout opened in a new tab. If it didn\'t open, click the button again or check your popup blocker.');
      } else {
        throw new Error('No checkout URL received from server');
      }
    } catch (err: any) {
      console.error("Checkout Error:", err);
      setError(err.message || 'Payment initialization failed. Please ensure your Stripe keys are set in the Settings menu.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentLink = () => {
    if (!user) return;
    // Fallback to manual payment link if provided, passing userId as client_reference_id
    const paymentLink = "https://buy.stripe.com/test_4gM3cx0rq8ZS85k5rCbsc00";
    const url = new URL(paymentLink);
    url.searchParams.append('client_reference_id', user.uid);
    url.searchParams.append('prefilled_email', user.email || '');
    window.open(url.toString(), '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <header className="w-full px-6 py-4 flex items-center max-w-6xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
              Unlock the <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">Full Experience</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto">
              Join the elite circle of Vibe Coders and get everything you need to build production-ready apps with AI.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* Free Plan */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col opacity-60">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Free Explorer</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">$0</span>
                  <span className="text-slate-500 font-medium">/forever</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <Check className="w-5 h-5 text-emerald-500" />
                  <span>Basic Vibe Coding Intro</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <Check className="w-5 h-5 text-emerald-500" />
                  <span>5 Hearts (Refill daily)</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400 opacity-50">
                  <Check className="w-5 h-5 text-slate-300" />
                  <span>Advanced Full-Stack Course</span>
                </li>
              </ul>

              <button 
                disabled
                className="w-full py-4 px-6 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold cursor-not-allowed"
              >
                Current Plan
              </button>
            </div>

            {/* Pro Plan */}
            <div className="relative bg-white dark:bg-slate-900 p-8 rounded-3xl border-4 border-violet-500 shadow-2xl flex flex-col transform hover:scale-[1.02] transition-transform">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                Early Bird Offer - 50% OFF
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">Pro Lifetime</h3>
                  <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-slate-900 dark:text-white">$10</span>
                  <span className="text-xl text-slate-400 line-through font-bold">$20</span>
                </div>
                <p className="text-sm text-violet-600 dark:text-violet-400 font-bold mt-1">One-time payment. Lifetime access.</p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-bold">
                  <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                  <span>Infinite Hearts (Never wait)</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-bold">
                  <Shield className="w-5 h-5 text-emerald-500 fill-emerald-500" />
                  <span>Full-Stack Vibe Coding Course</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-bold">
                  <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span>AI Agent Masterclass</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-bold">
                  <Rocket className="w-5 h-5 text-violet-500 fill-violet-500" />
                  <span>Exclusive Project Blueprints</span>
                </li>
              </ul>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-pink-50 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-800 text-pink-600 dark:text-pink-400 text-xs font-medium">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-4">
                <button 
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Upgrade Now
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {error && (
                  <button 
                    onClick={handlePaymentLink}
                    className="w-full py-3 px-6 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Try Direct Payment Link
                  </button>
                )}
              </div>
            </div>
          </div>

          <p className="text-center text-slate-500 dark:text-slate-500 text-sm mt-12">
            Secure payment processed by Stripe. No subscription, just a one-time vibey investment.
          </p>
        </motion.div>
      </main>
    </div>
  );
};
