import React from 'react';
import {
  Shield,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  Menu,
  Calendar,
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext.jsx';

export default function Topbar({ onToggleMobileMenu }) {
  const { state, metrics, setCurrentDay } = useFinancial();

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

  const progressPercent = Math.round((state.currentDay / 30) * 100);

  return (
    <header className="sticky top-0 z-30 bg-parchment-50/85 backdrop-blur-md border-b border-parchment-200/90 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
      
      {/* Left: Mobile Menu Trigger + Day Progress Widget */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile Hamburger (visible on < lg screens) */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-ink-700 hover:bg-parchment-200 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Day Tracker with Smooth Emerald Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-ink-950 font-sans">
            <Shield className="w-4 h-4 text-forest-700 shrink-0" />
            <span>Day {state.currentDay} of 30</span>
          </div>

          {/* Stepper buttons */}
          <div className="hidden sm:flex items-center bg-parchment-200/70 rounded-lg p-0.5 border border-parchment-300/60">
            <button
              onClick={handlePrevDay}
              disabled={state.currentDay <= 1}
              aria-label="Previous day"
              className="p-1 rounded text-ink-600 hover:text-ink-950 hover:bg-parchment-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Step back 1 day"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNextDay}
              disabled={state.currentDay >= 30}
              aria-label="Next day"
              className="p-1 rounded text-ink-600 hover:text-ink-950 hover:bg-parchment-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Advance 1 day"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Progress Bar & Days Left */}
          <div className="flex items-center gap-2.5">
            <div className="w-24 sm:w-36 lg:w-48 h-2 rounded-full bg-parchment-300/80 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-mint-600 to-mint-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs text-ink-500 font-sans whitespace-nowrap">
              {metrics.remainingDays} days left
            </span>
          </div>
        </div>
      </div>

      {/* Right: Search, Notifications & User Avatar */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search Button */}
        <button
          aria-label="Search transactions"
          className="p-2 rounded-full text-ink-600 hover:text-ink-950 hover:bg-parchment-200/80 border border-parchment-300/70 transition-colors shadow-subtle"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications with indicator dot */}
        <button
          aria-label="Notifications"
          className="relative p-2 rounded-full text-ink-600 hover:text-ink-950 hover:bg-parchment-200/80 border border-parchment-300/70 transition-colors shadow-subtle"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-terracotta-500 ring-2 ring-parchment-50" />
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2.5 pl-1 sm:pl-2">
          <div className="w-8 h-8 rounded-full bg-forest-900 text-gold-300 flex items-center justify-center font-bold text-xs shadow-sm border border-gold-500/40">
            P
          </div>
          <div className="hidden md:block text-left">
            <span className="block text-xs font-semibold text-ink-950 leading-tight">
              Prince Mishra
            </span>
            <span className="block text-[10px] text-ink-500 leading-tight">
              Stay Financially Smart
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
