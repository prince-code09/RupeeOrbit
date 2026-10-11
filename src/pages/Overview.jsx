import React, { useState } from 'react';
import {
  Wallet,
  Calendar,
  BarChart3,
  Shield,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Smartphone,
  Home,
  ShoppingBag,
  Car,
  Utensils,
  BookOpen,
  Heart,
  Sparkles,
  Info,
  Check,
  CheckCircle2,
  ChevronDown,
  FlaskConical,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useFinancial } from '../context/FinancialContext.jsx';
import { formatCurrency, formatPercentage } from '../utils/formatters.js';
import LivingMoneyOrbit from '../components/LivingMoneyOrbit.jsx';

const DONUT_COLORS = [
  '#059669', // Food & Dining (Vibrant Emerald)
  '#2563EB', // Transport (Royal Blue)
  '#D97706', // Education (Warm Amber Gold)
  '#7C3AED', // Shopping (Vivid Purple)
  '#0284C7', // Utilities (Sky Blue)
  '#E11D48', // Health (Rose Crimson)
  '#0D9488', // Entertainment (Teal)
  '#475569', // Personal/Misc (Slate)
];

export default function Overview({ onNavigateToLab, onNavigateToInsights, onNavigateToTransactions, onNavigateToBills }) {
  const { state, metrics, payCommitment, setCurrentDay } = useFinancial();
  const [timeToggle, setTimeToggle] = useState('Today');
  const [calendarMonth, setCalendarMonth] = useState('October 2026');
  const [paidToast, setPaidToast] = useState(null);

  const handlePayBill = (bill) => {
    payCommitment(bill.commitmentId, bill.dueDay);
    setPaidToast(`Paid ${bill.name} (${formatCurrency(bill.amount)})! Recorded in ledger.`);
    setTimeout(() => setPaidToast(null), 4000);
  };

  // Recharts Custom Tooltip for 30-Day Forecast
  const CustomForecastTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-forest-950 text-parchment-50 p-3 rounded-xl border border-forest-700 shadow-floating text-xs font-sans space-y-1">
          <div className="flex items-center justify-between gap-4 font-semibold text-gold-300">
            <span>Day {label}</span>
            <span className="text-[10px] text-ink-400 font-mono">
              {data.isPast ? 'Recorded' : data.isCurrent ? 'Today' : 'Projected'}
            </span>
          </div>
          <div className="text-sm font-bold font-num text-white">
            {formatCurrency(data.balance)}
          </div>
          {data.billsDue && data.billsDue.length > 0 && (
            <div className="pt-1.5 border-t border-forest-800 text-[11px] text-amberGold-300">
              Bills Due: {data.billsDue.map((b) => `${b.name} (${formatCurrency(b.amount)})`).join(', ')}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Category spending breakdown data for Donut Chart
  const categoryData = metrics.categorySummary
    .filter((c) => c.spent > 0)
    .map((c) => ({
      name: c.category,
      value: c.spent,
      pct: metrics.actualExpenses > 0 ? Math.round((c.spent / metrics.actualExpenses) * 100) : 0,
    }));

  // Fallback category chart demo seed if zero transactions spent
  const displayCategoryData = categoryData.length > 0 ? categoryData : [
    { name: 'Food & Dining', value: 1760, pct: 32 },
    { name: 'Transport', value: 998, pct: 18 },
    { name: 'Education', value: 776, pct: 14 },
    { name: 'Shopping', value: 665, pct: 12 },
    { name: 'Utilities', value: 554, pct: 10 },
    { name: 'Health', value: 443, pct: 8 },
    { name: 'Entertainment', value: 332, pct: 6 },
  ];

  const totalSpentFormatted = formatCurrency(metrics.actualExpenses > 0 ? metrics.actualExpenses : 5548);

  // Next imminent bill
  const nextBill = metrics.upcomingBills[0] || {
    name: 'Internet Bill',
    amount: 799,
    daysUntilDue: 3,
  };

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* Toast Notification */}
      {paidToast && (
        <div className="p-3.5 bg-forest-900 text-parchment-50 rounded-xl border border-mint-500/40 shadow-floating flex items-center gap-2.5 text-xs sm:text-sm animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-mint-300 shrink-0" />
          <span>{paidToast}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. HERO SECTION: Title, Living Money Orbit, & Mini Calendar Widget        */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        
        {/* Left / Center Hero: Vision, Copy, Buttons & Living Money Orbit */}
        <div className="xl:col-span-8 p-6 sm:p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-[#111C30] via-[#16243A] to-[#0E1726] border border-[#243B5E] shadow-elevated relative overflow-hidden flex flex-col justify-between">
          
          {/* Subtle Ambient Cyan & Teal Aura behind orbit */}
          <div className="absolute -right-10 -top-10 w-96 h-96 bg-gradient-to-br from-cyan-400/20 via-teal-300/15 to-blue-600/15 blur-3xl pointer-events-none rounded-full" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left Column: Heading and Action Buttons */}
            <div className="lg:col-span-6 space-y-4 z-10">
              <span className="text-[11px] font-mono tracking-widest text-cyan-300 uppercase font-bold block bg-cyan-950/70 border border-cyan-400/40 px-2.5 py-0.5 rounded-full w-fit shadow-xs">
                FINANCIAL SURVIVAL SIMULATOR
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-bold text-white leading-[1.15] tracking-tight">
                Make the decision.<br />
                See the consequences.<br />
                Then commit.
              </h1>

              <p className="text-xs sm:text-sm text-ink-600 leading-relaxed max-w-sm">
                Start with <strong className="text-white font-num">₹10,000</strong>. You have <strong className="text-teal-300 font-num">{metrics.remainingDays} days</strong> left. Simulate expenses, handle bills, set savings goals and stay in control.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={onNavigateToLab}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 hover:from-teal-300 hover:to-cyan-300 text-[#070C16] font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-glow-cyan border border-cyan-300/40 group active:scale-95"
                >
                  <FlaskConical className="w-4 h-4 text-[#070C16] group-hover:rotate-12 transition-transform shrink-0" />
                  <span className="tracking-wide text-[#070C16] font-extrabold">Open Decision Lab</span>
                  <ArrowRight className="w-4 h-4 text-[#070C16] group-hover:translate-x-1 transition-transform shrink-0" />
                </button>

                <button
                  onClick={onNavigateToInsights}
                  className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-full bg-[#16243A] hover:bg-[#1E314F] text-white font-semibold text-xs sm:text-sm border border-[#243B5E] shadow-xs hover:shadow transition-all"
                >
                  <BarChart3 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>View Insights</span>
                </button>
              </div>
            </div>

            {/* Right Column: Signature Living Money Orbit Visual */}
            <div className="lg:col-span-6 flex items-center justify-center relative min-h-[240px]">
              <LivingMoneyOrbit size="full" />
            </div>
          </div>
        </div>

        {/* Right Hero: October 2026 Calendar & Next Bill Widget */}
        <div className="xl:col-span-4 p-5 sm:p-6 rounded-3xl bg-parchment-50 border border-parchment-300/80 shadow-subtle flex flex-col justify-between space-y-4">
          
          {/* Calendar Header */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-parchment-200">
              <span className="font-serif font-bold text-sm text-ink-950">
                {calendarMonth}
              </span>
              <div className="flex items-center gap-1">
                <button className="p-1 rounded-md text-ink-500 hover:text-ink-950 hover:bg-parchment-200 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-1 rounded-md text-ink-500 hover:text-ink-950 hover:bg-parchment-200 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Calendar Days Row */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-ink-400 font-medium mt-3 mb-2">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>

            {/* Calendar Days Matrix (October 2026 starts on Thursday) */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-num">
              {/* Empty offset days */}
              <span className="p-1.5 text-ink-300"></span>
              <span className="p-1.5 text-ink-300"></span>
              <span className="p-1.5 text-ink-300"></span>
              
              {/* Days 1 to 31 */}
              {[...Array(31)].map((_, i) => {
                const dayNum = i + 1;
                const isCurrent = dayNum === state.currentDay;
                const hasBill = metrics.upcomingBills.some((b) => b.dueDay === dayNum);

                return (
                  <button
                    key={dayNum}
                    onClick={() => setCurrentDay(dayNum)}
                    className={`p-1.5 rounded-full text-xs font-semibold transition-all relative ${
                      isCurrent
                        ? 'bg-forest-900 text-gold-300 font-bold shadow-subtle'
                        : 'text-ink-700 hover:bg-parchment-200'
                    }`}
                    title={`Day ${dayNum}${hasBill ? ' (Bill due)' : ''}`}
                  >
                    <span>{dayNum}</span>
                    {hasBill && !isCurrent && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Next Bill Card Container */}
          <div className="pt-3 border-t border-parchment-200">
            <span className="text-[11px] font-semibold text-ink-700 block mb-2">
              Next Bill
            </span>

            <div className="p-3 rounded-2xl bg-parchment-100/90 border border-parchment-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amberGold-100 text-amberGold-800 flex items-center justify-center shrink-0">
                  <Wifi className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-ink-950">
                    {nextBill.name}
                  </span>
                  <span className="block text-[11px] text-ink-500">
                    Due in {nextBill.daysUntilDue} days
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-num font-bold text-sm text-ink-950">
                  {formatCurrency(nextBill.amount)}
                </span>
                <ChevronRight className="w-4 h-4 text-ink-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. "YOUR FINANCIAL POSITION" - 4 DISTINCT EDITORIAL CARDS                  */}
      {/* ========================================================================= */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-serif font-bold text-ink-950">
              Your Financial Position
            </h2>
            <Info className="w-4 h-4 text-ink-400 cursor-pointer" />
          </div>

          {/* Time Toggle [Today | Week | Month] */}
          <div className="flex items-center bg-parchment-200/80 p-0.5 rounded-full border border-parchment-300 text-xs font-medium">
            {['Today', 'Week', 'Month'].map((tab) => (
              <button
                key={tab}
                onClick={() => setTimeToggle(tab)}
                className={`px-3 py-1 rounded-full transition-all ${
                  timeToggle === tab
                    ? 'bg-parchment-50 text-ink-950 font-semibold shadow-subtle'
                    : 'text-ink-600 hover:text-ink-950'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Available Cash */}
          <div className="p-5 rounded-2xl bg-parchment-50 border border-parchment-300/80 shadow-card space-y-3 flex flex-col justify-between relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-1.5 before:bg-gradient-to-r before:from-emerald-500 before:to-teal-400 hover:border-emerald-300/70 transition-all">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 flex items-center justify-center shadow-sm">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100/90 text-emerald-800 border border-emerald-300/80 font-sans shadow-subtle">
                  Liquid Now
                </span>
              </div>

              <div className="mt-3.5">
                <span className="text-xs text-ink-600 font-medium">Available Cash</span>
                <div className="text-2xl lg:text-3xl font-bold font-num text-ink-950 mt-0.5 tracking-tight">
                  {formatCurrency(metrics.availableCash)}
                </div>
                <span className="text-[11px] text-ink-500 block mt-1">
                  Remaining from ₹10,000
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div className="w-full bg-parchment-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((metrics.availableCash / 10000) * 100))}%` }}
                />
              </div>
              <span className="text-[10px] font-num text-emerald-700 font-semibold text-right block mt-1">
                {Math.round((metrics.availableCash / 10000) * 100)}%
              </span>
            </div>
          </div>

          {/* Card 2: Reserved Commitments */}
          <div className="p-5 rounded-2xl bg-parchment-50 border border-parchment-300/80 shadow-card space-y-3 flex flex-col justify-between relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-1.5 before:bg-gradient-to-r before:from-amber-500 before:to-amberGold-400 hover:border-amber-300/70 transition-all">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-700 flex items-center justify-center shadow-sm">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100/90 text-amber-800 border border-amber-300/80 font-sans shadow-subtle">
                  Upcoming Bills
                </span>
              </div>

              <div className="mt-3.5">
                <span className="text-xs text-ink-600 font-medium">Reserved Commitments</span>
                <div className="text-2xl lg:text-3xl font-bold font-num text-amber-950 mt-0.5 tracking-tight">
                  {formatCurrency(metrics.outstandingCommitments)}
                </div>
                <span className="text-[11px] text-ink-500 block mt-1">
                  {metrics.upcomingBills.length} bills scheduled (Day 5 – Day 28)
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div className="w-full bg-parchment-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-600 to-amberGold-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((metrics.outstandingCommitments / 10000) * 100))}%` }}
                />
              </div>
              <span className="text-[10px] font-num text-amber-700 font-semibold text-right block mt-1">
                {Math.round((metrics.outstandingCommitments / 10000) * 100)}%
              </span>
            </div>
          </div>

          {/* Card 3: Projected Day-30 Cash */}
          <div className="p-5 rounded-2xl bg-parchment-50 border border-parchment-300/80 shadow-card space-y-3 flex flex-col justify-between relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-1.5 before:bg-gradient-to-r before:from-teal-500 before:to-cyan-400 hover:border-teal-300/70 transition-all">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/80 text-teal-700 flex items-center justify-center shadow-sm">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-100/90 text-teal-800 border border-teal-300/80 font-sans shadow-subtle">
                  Survival Cushion
                </span>
              </div>

              <div className="mt-3.5">
                <span className="text-xs text-ink-600 font-medium">Projected Day-30 Cash</span>
                <div className={`text-2xl lg:text-3xl font-bold font-num mt-0.5 tracking-tight ${
                  metrics.projectedDay30Balance >= 0 ? 'text-teal-950' : 'text-terracotta-600'
                }`}>
                  {formatCurrency(metrics.projectedDay30Balance)}
                </div>
                <span className="text-[11px] text-ink-500 block mt-1">
                  After all upcoming commitments
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div className="w-full bg-parchment-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${metrics.projectedDay30Balance >= 0 ? 'bg-gradient-to-r from-teal-600 to-cyan-400' : 'bg-terracotta-600'}`}
                  style={{ width: `${Math.max(0, Math.min(100, Math.round((metrics.projectedDay30Balance / 10000) * 100)))}%` }}
                />
              </div>
              <span className="text-[10px] font-num text-teal-700 font-semibold text-right block mt-1">
                {Math.max(0, Math.round((metrics.projectedDay30Balance / 10000) * 100))}%
              </span>
            </div>
          </div>

          {/* Card 4: Safe Daily Allowance */}
          <div className="p-5 rounded-2xl bg-parchment-50 border border-parchment-300/80 shadow-card space-y-3 flex flex-col justify-between relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-1.5 before:bg-gradient-to-r before:from-emerald-600 before:to-emerald-400 hover:border-emerald-300/70 transition-all">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 flex items-center justify-center shadow-sm">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-orange-100/90 text-orange-800 border border-orange-200/90 font-sans shadow-subtle">
                  Discretionary
                </span>
              </div>

              <div className="mt-3.5">
                <span className="text-xs text-ink-600 font-medium">Safe Daily Allowance</span>
                <div className="text-2xl lg:text-3xl font-bold font-num text-emerald-950 mt-0.5 tracking-tight">
                  {formatCurrency(metrics.safeDailyAllowance)}/day
                </div>
                <span className="text-[11px] text-ink-500 block mt-1">
                  For remaining {metrics.remainingDays} days
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div className="w-full bg-parchment-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((metrics.safeDailyAllowance / 300) * 100))}%` }}
                />
              </div>
              <span className="text-[10px] font-num text-emerald-700 font-semibold text-right block mt-1">
                Safe pace
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CHARTS ROW: 30-Day Cash Flow Forecast vs Category Spending Donut       */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column (8 cols): 30-Day Cash Flow Forecast Chart */}
        <div className="lg:col-span-8 p-6 sm:p-7 rounded-3xl bg-[#16243A] border border-[#243B5E] shadow-card hover:shadow-elevated transition-all flex flex-col justify-between space-y-4 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-1.5 before:bg-gradient-to-r before:from-teal-400 via-cyan-400 to-blue-500">
          
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-xs">
                  <BarChart3 className="w-4 h-4" />
                </span>
                <h3 className="font-serif font-bold text-lg text-white">
                  30-Day Cash Flow Forecast
                </h3>
              </div>

              {/* Legend matching mockup with colorful pills */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                <div className="px-2.5 py-1 rounded-full bg-teal-500/15 border border-teal-400/40 text-teal-300 font-semibold flex items-center gap-1.5 shadow-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400 shadow-xs" />
                  <span>Available Cash</span>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 font-semibold flex items-center gap-1.5 shadow-xs">
                  <span className="w-2.5 h-0.5 bg-amberGold-400 border-t border-dashed" />
                  <span>Reserved Commitments</span>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 font-semibold flex items-center gap-1.5 shadow-xs">
                  <span className="w-2.5 h-0.5 bg-cyan-400 border-t border-dotted" />
                  <span>Projected Cash</span>
                </div>
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-60 sm:h-64 w-full pt-3">
              {/* Screen reader text alternative */}
              <div className="sr-only">
                <h4>30-Day Cash Flow Forecast Data Table</h4>
                <table>
                  <thead>
                    <tr><th>Day</th><th>Projected Balance</th></tr>
                  </thead>
                  <tbody>
                    {metrics.dailyForecast.map((pt) => (
                      <tr key={pt.day}><td>Day {pt.day}</td><td>₹{pt.balance}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <AreaChart data={metrics.dailyForecast} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cashFlowGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.4} />
                      <stop offset="50%" stopColor="#2DD4BF" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#0B1220" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E314F" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: '#A8B6CA', fontWeight: 500 }}
                    tickFormatter={(d) => `Day ${d}`}
                    stroke="#243B5E"
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#A8B6CA', fontWeight: 500 }}
                    tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}`}
                    stroke="#243B5E"
                  />
                  <Tooltip content={<CustomForecastTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="#38BDF8"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#cashFlowGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Yellow Warning Strip below chart (matching mockup) */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#2A1D0E] via-[#352512] to-[#2A1D0E] border border-amber-500/40 text-xs text-amber-200 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="p-1 rounded-lg bg-amber-500/20 text-amber-300 shrink-0 shadow-xs border border-amber-400/30">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <span className="font-medium leading-relaxed">
                You're on track, but a few upcoming bills will significantly reduce your balance. Consider reviewing discretionary spending.
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-400 shrink-0 cursor-pointer" />
          </div>
        </div>

        {/* Right Column (4 cols): Category Spending Donut Chart */}
        <div className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-[#16243A] border border-[#243B5E] shadow-card hover:shadow-elevated transition-all flex flex-col justify-between space-y-4 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-1.5 before:bg-gradient-to-r before:from-amber-500 via-rose-500 to-indigo-500">
          
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-parchment-200">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-xs">
                  <Utensils className="w-4 h-4" />
                </span>
                <h3 className="font-serif font-bold text-lg text-white">
                  Category Spending
                </h3>
              </div>

              <div className="flex items-center gap-1 text-xs text-ink-600 bg-[#111C30] hover:bg-[#1A2C46] px-2.5 py-1 rounded-lg border border-[#243B5E] font-medium">
                <span>This Month</span>
                <ChevronDown className="w-3.5 h-3.5 text-ink-500" />
              </div>
            </div>

            {/* Donut Chart with central metric */}
            <div className="relative h-44 w-full flex items-center justify-center mt-2">
              {/* Accessible breakdown for screen readers */}
              <div className="sr-only">
                <h4>Category Spending Distribution Table</h4>
                <table>
                  <thead>
                    <tr><th>Category</th><th>Amount Spent</th></tr>
                  </thead>
                  <tbody>
                    {displayCategoryData.map((cat) => (
                      <tr key={cat.name}><td>{cat.name}</td><td>₹{cat.value}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <PieChart>
                  <Pie
                    data={displayCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={74}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {displayCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Central Text inside Donut Hole */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#111C30] via-[#16243A] to-[#111C30] border border-[#243B5E] shadow-sm flex flex-col items-center justify-center">
                  <span className="text-sm font-bold font-num text-white tracking-tight">
                    {totalSpentFormatted}
                  </span>
                  <span className="text-[9px] text-ink-600 font-bold uppercase tracking-wider">
                    Total Spent
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Category Breakdown List matching mockup */}
          <div className="space-y-2 pt-2 border-t border-parchment-200 text-xs">
            {displayCategoryData.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between py-0.5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: DONUT_COLORS[idx % DONUT_COLORS.length] }}
                  />
                  <span className="text-ink-800 font-semibold truncate max-w-[120px]">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 font-num">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-parchment-150 text-ink-600">{item.pct}%</span>
                  <span className="font-bold text-ink-950">
                    {formatCurrency(item.value)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. LOWER ROW: Recent Transactions & Upcoming Bills & AI Money Coach       */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Sub-Column (4 cols): Recent Transactions */}
        <div className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-[#16243A] border border-[#243B5E] shadow-card hover:shadow-elevated transition-all flex flex-col justify-between space-y-4 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-1.5 before:bg-gradient-to-r before:from-rose-500 via-amber-500 to-emerald-500">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-parchment-200">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-amber-600 text-white flex items-center justify-center shadow-xs">
                  <ShoppingBag className="w-4 h-4" />
                </span>
                <h3 className="font-serif font-bold text-base text-white">
                  Recent Transactions
                </h3>
              </div>
              <button
                onClick={onNavigateToTransactions}
                className="text-xs font-bold text-cyan-300 hover:text-white bg-[#111C30] hover:bg-[#1A2C46] px-2.5 py-1 rounded-full border border-[#243B5E] transition-colors flex items-center gap-1"
              >
                View All &rarr;
              </button>
            </div>

            {/* Transactions items matching mockup with colorful category containers */}
            <div className="space-y-3.5 mt-3.5">
              {(state.transactions || []).slice(0, 3).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between gap-3 p-1 rounded-xl hover:bg-[#1A2C46] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs">
                      {(tx.category || '').includes('Food') ? (
                        <div className="w-full h-full rounded-xl bg-gradient-to-br from-rose-950/70 to-rose-900/50 border border-rose-500/40 text-rose-300 flex items-center justify-center">
                          <Utensils className="w-4 h-4" />
                        </div>
                      ) : (tx.category || '').includes('Travel') ? (
                        <div className="w-full h-full rounded-xl bg-gradient-to-br from-sky-950/70 to-sky-900/50 border border-sky-500/40 text-sky-300 flex items-center justify-center">
                          <Car className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-full h-full rounded-xl bg-gradient-to-br from-amber-950/70 to-amber-900/50 border border-amber-500/40 text-amber-300 flex items-center justify-center">
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-white truncate max-w-[130px]">
                        {tx.description}
                      </span>
                      <span className="block text-[11px] text-ink-600">
                        {tx.category || 'Personal & Misc'} &bull; Day {tx.day}
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-400/40 text-rose-300 font-bold font-num text-xs shrink-0 shadow-xs">
                    - {formatCurrency(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Sub-Column (4 cols): Upcoming Bills with green [Pay] pills */}
        <div className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-[#16243A] border border-[#243B5E] shadow-card hover:shadow-elevated transition-all flex flex-col justify-between space-y-4 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-1.5 before:bg-gradient-to-r before:from-sky-500 via-indigo-500 to-emerald-500">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-parchment-200">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Calendar className="w-4 h-4" />
                </span>
                <h3 className="font-serif font-bold text-base text-white">
                  Upcoming Bills
                </h3>
              </div>
              <button
                onClick={onNavigateToBills}
                className="text-xs font-bold text-cyan-300 hover:text-white bg-[#111C30] hover:bg-[#1A2C46] px-2.5 py-1 rounded-full border border-[#243B5E] transition-colors flex items-center gap-1"
              >
                Manage &rarr;
              </button>
            </div>

            {/* Upcoming Bills List with green [Pay] pills */}
            <div className="space-y-3 mt-3.5">
              {metrics.upcomingBills.slice(0, 3).map((bill) => (
                <div key={bill.id} className="flex items-center justify-between gap-2 p-2 rounded-xl hover:bg-[#1A2C46] transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs">
                      {(bill.name || '').toLowerCase().includes('internet') || (bill.name || '').toLowerCase().includes('wifi') ? (
                        <div className="w-full h-full rounded-xl bg-gradient-to-br from-sky-950/70 to-blue-900/50 border border-blue-500/40 text-blue-300 flex items-center justify-center">
                          <Wifi className="w-4 h-4" />
                        </div>
                      ) : (bill.name || '').toLowerCase().includes('phone') || (bill.name || '').toLowerCase().includes('mobile') ? (
                        <div className="w-full h-full rounded-xl bg-gradient-to-br from-purple-950/70 to-purple-900/50 border border-purple-500/40 text-purple-300 flex items-center justify-center">
                          <Smartphone className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-full h-full rounded-xl bg-gradient-to-br from-emerald-950/70 to-emerald-900/50 border border-emerald-500/40 text-emerald-300 flex items-center justify-center">
                          <Home className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-white truncate max-w-[110px]">
                        {bill.name}
                      </span>
                      <span className="block text-[10px] text-ink-600 font-medium">
                        Due in {bill.daysUntilDue} days &bull; Day {bill.dueDay}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-num text-white">
                      {formatCurrency(bill.amount)}
                    </span>
                    <button
                      onClick={() => handlePayBill(bill)}
                      className="px-3 py-1 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-[#070C16] text-xs font-bold shadow-xs hover:shadow transition-all active:scale-95"
                      title="Pay bill now"
                    >
                      Pay
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sub-Column (4 cols): AI Money Coach Card (matching mockup) */}
        <div className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#111C30] via-[#16243A] to-[#0E1726] border border-cyan-500/40 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between space-y-4 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-1.5 before:bg-gradient-to-r before:from-cyan-400 via-teal-400 to-blue-500">
          
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-parchment-200">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-gold-200 flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h3 className="font-serif font-bold text-base text-white">
                  AI Money Coach
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 uppercase tracking-wider">
                BETA
              </span>
            </div>

            {/* Coach Insight Box with Leaf Icon */}
            <div className="mt-3.5 p-4 rounded-2xl bg-[#111C30]/90 backdrop-blur-sm border border-[#243B5E] shadow-xs flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 mt-0.5 shadow-xs border border-teal-400/30">
                <Sparkles className="w-4 h-4 text-teal-300" />
              </div>
              <p className="text-xs text-[#CBD5E1] leading-relaxed font-sans">
                Your spending on Food & Dining is 22% higher than your recommended budget. You could save around <strong className="px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-200 border border-teal-400/30 font-bold font-num">₹450</strong> in the next 10 days by cooking more meals at home.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={onNavigateToInsights}
              className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#16243A] via-[#1E314F] to-[#16243A] hover:from-[#1E314F] hover:to-[#263E63] text-cyan-200 font-bold text-xs flex items-center justify-center gap-2 border border-cyan-400/40 shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <span>View Personalized Suggestions</span>
              <ArrowRight className="w-3.5 h-3.5 text-gold-400" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
