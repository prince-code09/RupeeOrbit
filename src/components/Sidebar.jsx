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
    <aside className="w-64 lg:w-72 bg-[#09120D] text-parchment-100 flex flex-col justify-between shrink-0 min-h-screen relative border-r border-[#1B2F25] shadow-2xl select-none">
      
      {/* Top Branding & Navigation */}
      <div className="p-5 lg:p-6 space-y-7 z-10">
        
        {/* Brand Logo Header */}
        <div className="flex items-center gap-3.5">
          {/* Ornate Gold & Emerald Glowing Medallion */}
          <div className="relative w-12 h-12 rounded-full p-[2.5px] bg-gradient-to-tr from-gold-500 via-gold-300 to-amberGold-600 shadow-md flex items-center justify-center shrink-0">
            <div className="w-full h-full rounded-full bg-[#0D1A14] border border-gold-400/50 flex items-center justify-center overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-mint-400 via-mint-600 to-forest-950 flex items-center justify-center border border-mint-300/80 shadow-inner">
                <span className="font-serif font-bold text-sm text-gold-200">₹</span>
              </div>
            </div>
            {/* Ambient gold glow */}
            <div className="absolute inset-0 rounded-full bg-gold-400/30 blur-md pointer-events-none" />
          </div>

          <div>
            <h1 className="font-serif font-bold text-2xl text-white tracking-tight leading-none drop-shadow-sm">
              Ledgerly
            </h1>
            <span className="text-[11px] font-sans text-emerald-300/90 tracking-wider block mt-1.5 font-medium">
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
                    ? 'bg-gradient-to-r from-[#183024] to-[#12241B] text-white border border-emerald-500/60 shadow-lg font-bold'
                    : 'text-[#F1F6F3] hover:text-white hover:bg-[#12231A] border border-transparent font-medium'
                }`}
              >
                {/* Active left indicator accent */}
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1.5 bg-gradient-to-b from-gold-400 via-mint-400 to-emerald-500 rounded-r-full shadow-glow-emerald" />
                )}

                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg border transition-transform group-hover:scale-110 ${
                    isActive
                      ? 'bg-emerald-500/25 border-emerald-400/50 shadow-inner'
                      : `${item.iconBg}`
                  }`}>
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-gold-300' : item.iconColor
                      }`}
                    />
                  </div>
                  <span className={`tracking-wide ${isActive ? 'text-white font-extrabold' : 'text-[#F3F7F5] font-semibold'}`}>
                    {item.label}
                  </span>
                </div>

                {item.badge && (
                  <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-400 to-gold-400 text-[#09120D] uppercase tracking-wider shadow-sm">
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
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40 z-0">
          <svg
            viewBox="0 0 300 220"
            className="w-full h-full object-cover absolute bottom-0 left-0"
            preserveAspectRatio="none"
          >
            <path
              d="M0 160 L40 120 L80 145 L130 90 L180 140 L230 105 L270 135 L300 110 L300 220 L0 220 Z"
              fill="#182A22"
            />
            <path
              d="M0 180 L50 140 L100 165 L150 130 L200 160 L250 140 L300 160 L300 220 L0 220 Z"
              fill="#0B1410"
            />
            <circle cx="240" cy="110" r="18" fill="#FACC15" opacity="0.25" filter="blur(8px)" />
          </svg>
        </div>

        {/* Floating Glassmorphic "Today's Tip" Card with Crisp Text */}
        <div className="relative z-10 p-4 rounded-2xl bg-[#111F18]/90 backdrop-blur-md border border-[#234033] shadow-elevated group cursor-pointer hover:border-gold-400/50 transition-all">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-1.5 font-semibold tracking-wider uppercase text-[10px] text-emerald-300">
              <span className="p-1 rounded-md bg-gold-400/20 text-gold-300 shadow-sm">
                <Lightbulb className="w-3.5 h-3.5" />
              </span>
              <span className="text-gold-200 font-bold">TODAY'S TIP</span>
            </div>
            <button
              onClick={nextTip}
              className="text-emerald-400 hover:text-gold-300 p-0.5 rounded transition-transform active:rotate-180"
              title="Next tip"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-white leading-relaxed font-sans pr-2 font-normal">
            {DAILY_TIPS[tipIndex]}
          </p>

          <div className="flex justify-end mt-1.5 text-gold-300 opacity-90 group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Mini Utility Controls (Help & Reset) - Fully Visible */}
        <div className="relative z-10 flex items-center justify-between pt-2.5 border-t border-[#1C3328] text-xs text-emerald-200/80">
          <button
            onClick={onOpenHelp}
            className="hover:text-white flex items-center gap-1.5 transition-colors font-medium"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Orientation</span>
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
