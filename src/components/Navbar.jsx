import React, { useState } from 'react';
import {
  LayoutDashboard,
  FlaskConical,
  Receipt,
  PieChart,
  Target,
  Lightbulb,
  RotateCcw,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Calendar,
} from 'lucide-react';
import LivingMoneyOrbit from './LivingMoneyOrbit.jsx';
import { useFinancial } from '../context/FinancialContext.jsx';
import { formatCurrency } from '../utils/formatters.js';

export const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'decision-lab', label: 'Decision Lab', icon: FlaskConical, badge: 'Simulator' },
  { id: 'transactions', label: 'Transactions', icon: Receipt },
  { id: 'budget', label: 'Budget Planner', icon: PieChart },
  { id: 'goals', label: 'Savings Goals', icon: Target },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
];

export default function Navbar({ activeTab, onSelectTab, onOpenHelp, onOpenReset }) {
  const { state, metrics, setCurrentDay } = useFinancial();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handlePrevDay = () => {
    if (state.currentDay > 1) {
      setCurrentDay(state.currentDay - 1);
    }
  };

  const handleNextDay = () => {
    if (state.currentDay < 30) {
      setCurrentDay(state.currentDay + 1);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-parchment-100/90 backdrop-blur-md border-b border-parchment-300 transition-all">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Brand Logo & Compact Orbit */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab('overview')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
              aria-label="Go to Overview dashboard"
            >
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-ink-900 border border-mint-500/30 flex items-center justify-center overflow-hidden shadow-subtle group-hover:border-mint-400 transition-all">
                <LivingMoneyOrbit size="mini" />
              </div>
              <div>
                <span className="font-serif font-bold text-xl sm:text-2xl tracking-tight text-ink-950 flex items-center gap-1.5">
                  RupeeOrbit
                  <span className="text-[10px] uppercase font-sans font-semibold tracking-widest px-1.5 py-0.5 rounded bg-mint-100 text-mint-800 border border-mint-300">
                    30-Day Run
                  </span>
                </span>
                <span className="hidden sm:block text-[11px] text-ink-500 font-sans tracking-wide">
                  Broke But Functional Engine
                </span>
              </div>
            </button>
          </div>

          {/* Center: Interactive Day Tracker & Metric Pill */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center bg-parchment-50 border border-parchment-300 rounded-xl p-1 shadow-subtle">
              <button
                onClick={handlePrevDay}
                disabled={state.currentDay <= 1}
                aria-label="Previous day"
                className="p-1 rounded-lg text-ink-600 hover:text-ink-950 hover:bg-parchment-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="px-2.5 py-0.5 text-center min-w-[90px] sm:min-w-[110px]">
                <div className="flex items-center justify-center gap-1 text-xs font-semibold text-ink-900 font-sans">
                  <Calendar className="w-3.5 h-3.5 text-mint-700" />
                  Day {state.currentDay} of 30
                </div>
                <div className="text-[10px] text-ink-500">
                  {metrics.remainingDays} days left
                </div>
              </div>

              <button
                onClick={handleNextDay}
                disabled={state.currentDay >= 30}
                aria-label="Next day"
                className="p-1 rounded-lg text-ink-600 hover:text-ink-950 hover:bg-parchment-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Available Cash Pill */}
            <div className="hidden md:flex flex-col items-end px-3 py-1 bg-parchment-50 border border-parchment-300 rounded-xl shadow-subtle">
              <span className="text-[10px] font-medium text-ink-500 uppercase tracking-wider">
                Available Cash
              </span>
              <span className={`text-sm font-bold font-num ${metrics.availableCash < 0 ? 'text-terracotta-600' : 'text-mint-800'}`}>
                {formatCurrency(metrics.availableCash)}
              </span>
            </div>
          </div>

          {/* Right Utility Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={onOpenHelp}
              aria-label="Open survival challenge guide"
              className="p-2 rounded-xl text-ink-600 hover:text-ink-950 hover:bg-parchment-200 transition-colors"
              title="Challenge Orientation & Rules"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenReset}
              aria-label="Reset demo data"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ink-700 hover:text-ink-950 hover:bg-parchment-200 border border-parchment-300 rounded-xl transition-colors shadow-subtle"
              title="Reset to initial ₹10,000 demo state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-ink-700 hover:bg-parchment-200 transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Desktop Primary Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 pb-2 overflow-x-auto" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all relative ${
                  isActive
                    ? 'text-ink-950 bg-parchment-50 border border-parchment-300 shadow-subtle font-semibold'
                    : 'text-ink-600 hover:text-ink-900 hover:bg-parchment-200/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-mint-700' : 'text-ink-500'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold tracking-tight uppercase ${
                    isActive ? 'bg-mint-600 text-white' : 'bg-mint-100 text-mint-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-[-9px] left-3 right-3 h-[2px] bg-mint-700 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-parchment-300 bg-parchment-50 px-4 py-3 space-y-1 animate-fadeIn shadow-elevated">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-mint-700 text-parchment-50 font-semibold'
                    : 'text-ink-700 hover:bg-parchment-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase font-bold ${
                    isActive ? 'bg-mint-900 text-mint-200' : 'bg-mint-100 text-mint-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
