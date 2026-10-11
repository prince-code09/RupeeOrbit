import React, { useState } from 'react';
import {
  LayoutDashboard,
  FlaskConical,
  Receipt,
  PieChart,
  Target,
  Lightbulb,
  Sparkles,
  ArrowRight,
  RotateCw,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'decision-lab', label: 'Decision Lab', icon: FlaskConical, badge: 'NEW' },
  { id: 'transactions', label: 'Transactions', icon: Receipt },
  { id: 'budget', label: 'Budget Planner', icon: PieChart },
  { id: 'goals', label: 'Savings Goals', icon: Target },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
];

const DAILY_TIPS = [
  "Small daily choices compound. Simulate before you spend.",
  "Check commitments before discretionary splurges.",
  "Transferring to goals is saving, not consumption.",
  "Surviving Day 30 requires steady execution, not perfection.",
];

export default function Sidebar({ activeTab, onSelectTab, onOpenHelp, onOpenReset }) {
  const [tipIndex, setTipIndex] = useState(0);

  const nextTip = (e) => {
    e.stopPropagation();
    setTipIndex((prev) => (prev + 1) % DAILY_TIPS.length);
  };

  return (
    <aside className="w-64 lg:w-72 bg-forest-950 text-parchment-100 flex flex-col justify-between shrink-0 min-h-screen relative border-r border-forest-800/80 shadow-2xl select-none">
      
      {/* Top Branding & Navigation */}
      <div className="p-5 lg:p-6 space-y-7 z-10">
        
        {/* Brand Logo Header */}
        <div className="flex items-center gap-3.5">
          {/* Ornate Gold & Emerald Glowing Medallion */}
          <div className="relative w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr from-gold-600 via-gold-400 to-gold-700 shadow-md flex items-center justify-center shrink-0">
            <div className="w-full h-full rounded-full bg-forest-900 border border-gold-500/40 flex items-center justify-center overflow-hidden">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-mint-500 via-mint-700 to-forest-950 flex items-center justify-center border border-mint-400/60 shadow-inner">
                <span className="font-serif font-bold text-xs text-gold-300">₹</span>
              </div>
            </div>
            {/* Ambient gold glow */}
            <div className="absolute inset-0 rounded-full bg-gold-400/20 blur-md pointer-events-none" />
          </div>

          <div>
            <h1 className="font-serif font-bold text-2xl text-parchment-50 tracking-tight leading-none">
              Ledgerly
            </h1>
            <span className="text-[11px] font-sans text-forest-700 tracking-wider text-ink-300 block mt-1">
              30-Day Financial Survival
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-forest-850/90 text-parchment-50 border border-forest-700/80 shadow-subtle font-semibold'
                    : 'text-ink-300 hover:text-parchment-100 hover:bg-forest-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-gold-400' : 'text-forest-700 group-hover:text-ink-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/30 uppercase tracking-tight">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: Mountain Landscape Vignette & Today's Tip */}
      <div className="relative pt-24 pb-5 px-5 lg:px-6 z-10 flex flex-col gap-3">
        {/* Mountain Silhouette Background Graphic */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35 z-0">
          <svg
            viewBox="0 0 300 220"
            className="w-full h-full object-cover absolute bottom-0 left-0"
            preserveAspectRatio="none"
          >
            <path
              d="M0 160 L40 120 L80 145 L130 90 L180 140 L230 105 L270 135 L300 110 L300 220 L0 220 Z"
              fill="#172720"
            />
            <path
              d="M0 180 L50 140 L100 165 L150 130 L200 160 L250 140 L300 160 L300 220 L0 220 Z"
              fill="#0E1914"
            />
            <circle cx="240" cy="110" r="18" fill="#FACC15" opacity="0.15" filter="blur(8px)" />
          </svg>
        </div>

        {/* Floating Glassmorphic "Today's Tip" Card */}
        <div className="relative z-10 p-3.5 rounded-2xl bg-forest-900/80 backdrop-blur-md border border-forest-700/60 shadow-elevated group cursor-pointer hover:border-gold-500/40 transition-all">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1.5 font-semibold tracking-wider uppercase text-[10px] text-parchment-200">
              <span className="p-1 rounded bg-gold-500/20 text-gold-400">
                <Lightbulb className="w-3.5 h-3.5" />
              </span>
              <span>TODAY'S TIP</span>
            </div>
            <button
              onClick={nextTip}
              className="text-ink-400 hover:text-gold-300 p-0.5 rounded transition-transform active:rotate-180"
              title="Next tip"
            >
              <RotateCw className="w-3 h-3" />
            </button>
          </div>

          <p className="text-xs text-ink-300 leading-relaxed font-sans pr-4">
            {DAILY_TIPS[tipIndex]}
          </p>

          <div className="flex justify-end mt-1 text-gold-400 opacity-80 group-hover:translate-x-0.5 transition-transform">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Mini Utility Controls (Help & Reset) */}
        <div className="relative z-10 flex items-center justify-between pt-2 border-t border-forest-800/60 text-xs text-ink-400">
          <button
            onClick={onOpenHelp}
            className="hover:text-parchment-100 flex items-center gap-1 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Orientation</span>
          </button>

          <button
            onClick={onOpenReset}
            className="hover:text-terracotta-400 flex items-center gap-1 transition-colors"
            title="Reset to initial ₹10,000 demo state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
