import React, { useEffect, useRef } from 'react';
import { Sparkles, ShieldAlert, ArrowRight, X, Compass } from 'lucide-react';
import LivingMoneyOrbit from './LivingMoneyOrbit.jsx';

export default function FirstRunModal({ isOpen, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="challenge-guide-title"
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-2xl bg-parchment-50 border border-parchment-300 rounded-2xl shadow-floating overflow-hidden"
      >
        {/* Top Header Graphic Banner */}
        <div className="relative bg-gradient-to-r from-ink-900 via-mint-900 to-ink-900 text-parchment-50 p-6 sm:p-8 flex items-center justify-between overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 opacity-40 translate-x-10 pointer-events-none">
            <LivingMoneyOrbit size="compact" />
          </div>

          <div className="relative z-10 max-w-md">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-mint-500/20 border border-mint-400/30 text-mint-300 text-xs font-medium tracking-wide uppercase mb-3">
              <Compass className="w-3.5 h-3.5" />
              Challenge Orientation
            </div>
            <h2 id="challenge-guide-title" className="text-2xl sm:text-3xl font-serif font-bold text-parchment-50">
              Survive the Month on ₹10,000
            </h2>
            <p className="text-ink-300 text-sm mt-1.5 leading-relaxed">
              Welcome to <span className="text-mint-300 font-semibold">RupeeOrbit</span>. You have 30 days, ₹10,000, and a series of real financial trade-offs to navigate.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close introduction modal"
            className="absolute top-4 right-4 text-ink-400 hover:text-parchment-50 p-1.5 rounded-lg bg-ink-800/40 hover:bg-ink-800 transition-colors focus:ring-2 focus:ring-mint-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: The 3 Core Pillars */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-parchment-100 border border-parchment-300/60">
              <div className="w-8 h-8 rounded-lg bg-mint-100 text-mint-800 flex items-center justify-center font-bold text-sm mb-3">
                1
              </div>
              <h3 className="font-semibold text-ink-900 text-sm">₹10,000 Seed Budget</h3>
              <p className="text-xs text-ink-600 mt-1 leading-relaxed">
                Liquid starting cash. You must cover rent, daily food, subscriptions, and emergencies without hitting ₹0.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-parchment-100 border border-parchment-300/60">
              <div className="w-8 h-8 rounded-lg bg-amberGold-400/20 text-amberGold-700 flex items-center justify-center font-bold text-sm mb-3">
                2
              </div>
              <h3 className="font-semibold text-ink-900 text-sm">Decision Lab</h3>
              <p className="text-xs text-ink-600 mt-1 leading-relaxed">
                Test purchases, subscriptions, or emergencies safely in the sandbox before committing your hard cash.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-parchment-100 border border-parchment-300/60">
              <div className="w-8 h-8 rounded-lg bg-terracotta-100 text-terracotta-700 flex items-center justify-center font-bold text-sm mb-3">
                3
              </div>
              <h3 className="font-semibold text-ink-900 text-sm">Dynamic Risk Engine</h3>
              <p className="text-xs text-ink-600 mt-1 leading-relaxed">
                Every rupee spent recalibrates your Safe Daily Spending Allowance and Day-30 Survival forecast.
              </p>
            </div>
          </div>

          {/* Philosophy Banner */}
          <div className="p-4 rounded-xl bg-mint-50/70 border border-mint-200/60 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-mint-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-ink-800 leading-relaxed">
              <strong className="text-mint-800">Core RupeeOrbit Philosophy:</strong> &ldquo;Make the decision. See the consequences. Then commit.&rdquo;
            </div>
          </div>

          {/* CTA Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-parchment-200">
            <p className="text-xs text-ink-500">
              Pre-loaded with Day 4 demo data. Can be reset anytime.
            </p>
            <button
              onClick={onClose}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-mint-700 hover:bg-mint-800 text-parchment-50 font-semibold text-sm transition-all shadow-subtle hover:shadow-card"
            >
              Explore Dashboard & Simulator
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
