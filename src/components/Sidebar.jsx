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
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, iconColor: 'text-amber-400', iconBg: 'bg-amber-500/15 border-amber-500/30' },
  { id: 'decision-lab', label: 'Decision Lab', icon: FlaskConical, badge: 'NEW', iconColor: 'text-emerald-400', iconBg: 'bg-emerald-500/20 border-emerald-500/40' },
  { id: 'transactions', label: 'Transactions', icon: Receipt, iconColor: 'text-sky-400', iconBg: 'bg-sky-500/20 border-sky-500/40' },
  { id: 'budget', label: 'Budget Planner', icon: PieChart, iconColor: 'text-amberGold-400', iconBg: 'bg-amberGold-500/20 border-amberGold-500/40' },
  { id: 'goals', label: 'Savings Goals', icon: Target, iconColor: 'text-teal-300', iconBg: 'bg-teal-500/20 border-teal-500/40' },
  { id: 'insights', label: 'Insights', icon: Lightbulb, iconColor: 'text-yellow-300', iconBg: 'bg-yellow-500/20 border-yellow-500/40' },
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
    <aside className="w-64 lg:w-72 bg-[#0E1726] text-ink-900 flex flex-col justify-between shrink-0 min-h-screen relative border-r border-[#1E314F] shadow-2xl select-none">
      
      {/* Top Branding & Navigation */}
      <div className="p-5 lg:p-6 space-y-7 z-10">
        
        {/* Brand Logo Header */}
        <div className="flex items-center gap-3.5">
          {/* Ornate Gold & Cyan Glowing Medallion */}
          <div className="relative w-12 h-12 rounded-full p-[2.5px] bg-gradient-to-tr from-cyan-400 via-teal-300 to-amberGold-400 shadow-md flex items-center justify-center shrink-0">
            <div className="w-full h-full rounded-full bg-[#0B1220] border border-cyan-400/50 flex items-center justify-center overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 via-cyan-600 to-[#070C16] flex items-center justify-center border border-teal-300/80 shadow-inner">
                <span className="font-serif font-bold text-sm text-gold-200">₹</span>
              </div>
            </div>
            {/* Ambient cyan glow */}
            <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-md pointer-events-none" />
          </div>

          <div>
            <h1 className="font-serif font-bold text-2xl text-white tracking-tight leading-none drop-shadow-sm">
              RupeeOrbit
            </h1>
            <span className="text-[11px] font-sans text-cyan-300/90 tracking-wider block mt-1.5 font-medium">
              30-Day Financial Survival
            </span>
          </div>
        </div>

        {/* Navigation List - High Contrast & Clearly Visible */}
        <nav className="space-y-2.5" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm transition-all group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-[#16243A] to-[#111C30] text-white border border-cyan-500/50 shadow-lg font-bold'
                    : 'text-[#CBD5E1] hover:text-white hover:bg-[#16243A] border border-transparent font-medium'
                }`}
              >
                {/* Active left indicator accent */}
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1.5 bg-gradient-to-b from-cyan-400 via-teal-400 to-blue-500 rounded-r-full shadow-glow-cyan" />
                )}

                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg border transition-transform group-hover:scale-110 ${
                    isActive
                      ? 'bg-cyan-500/20 border-cyan-400/50 shadow-inner'
                      : `${item.iconBg}`
                  }`}>
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-cyan-300' : item.iconColor
                      }`}
                    />
                  </div>
                  <span className={`tracking-wide ${isActive ? 'text-white font-extrabold' : 'text-[#E2E8F0] font-semibold'}`}>
                    {item.label}
                  </span>
                </div>

                {item.badge && (
                  <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 text-[#070C16] uppercase tracking-wider shadow-sm">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: Mountain Landscape Vignette & Today's Tip */}
      <div className="relative pt-20 pb-5 px-5 lg:px-6 z-10 flex flex-col gap-3.5">
        {/* Mountain Silhouette Background Graphic */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
          <svg
            viewBox="0 0 300 220"
            className="w-full h-full object-cover absolute bottom-0 left-0"
            preserveAspectRatio="none"
          >
            <path
              d="M0 160 L40 120 L80 145 L130 90 L180 140 L230 105 L270 135 L300 110 L300 220 L0 220 Z"
              fill="#16243A"
            />
            <path
              d="M0 180 L50 140 L100 165 L150 130 L200 160 L250 140 L300 160 L300 220 L0 220 Z"
              fill="#0B1220"
            />
            <circle cx="240" cy="110" r="18" fill="#38BDF8" opacity="0.2" filter="blur(8px)" />
          </svg>
        </div>

        {/* Floating Glassmorphic "Today's Tip" Card with Crisp Text */}
        <div className="relative z-10 p-4 rounded-2xl bg-[#16243A]/90 backdrop-blur-md border border-[#243B5E] shadow-elevated group cursor-pointer hover:border-cyan-400/50 transition-all">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-1.5 font-semibold tracking-wider uppercase text-[10px] text-cyan-300">
              <span className="p-1 rounded-md bg-cyan-400/20 text-cyan-300 shadow-sm">
                <Lightbulb className="w-3.5 h-3.5" />
              </span>
              <span className="text-cyan-200 font-bold">TODAY'S TIP</span>
            </div>
            <button
              onClick={nextTip}
              className="text-cyan-400 hover:text-cyan-200 p-0.5 rounded transition-transform active:rotate-180"
              title="Next tip"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-[#E2E8F0] leading-relaxed font-sans pr-2 font-normal">
            {DAILY_TIPS[tipIndex]}
          </p>

          <div className="flex justify-end mt-1.5 text-cyan-300 opacity-90 group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Mini Utility Controls (Help & Reset) - Fully Visible */}
        <div className="relative z-10 flex items-center justify-between pt-2.5 border-t border-[#1E314F] text-xs text-ink-600">
          <button
            onClick={onOpenHelp}
            aria-label="Open 30-Day Challenge Guide"
            className="hover:text-cyan-300 flex items-center gap-1.5 transition-colors font-medium"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Challenge Guide</span>
          </button>

          <button
            onClick={onOpenReset}
            className="hover:text-rose-400 flex items-center gap-1.5 transition-colors font-medium"
            title="Reset to initial ₹10,000 demo state"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-300" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
