import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  HeartPulse,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Info,
  Sparkles,
  Zap,
  PiggyBank,
  Check,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { useFinancial } from '../context/FinancialContext.jsx';
import { formatCurrency, formatPercentage } from '../utils/formatters.js';
import LivingMoneyOrbit from '../components/LivingMoneyOrbit.jsx';

export default function Overview({ onNavigateToLab }) {
  const { state, metrics, payCommitment, setCurrentDay } = useFinancial();
  const [selectedTimelineDay, setSelectedTimelineDay] = useState(state.currentDay);
  const [showRiskDetail, setShowRiskDetail] = useState(false);
  const [showHealthDetail, setShowHealthDetail] = useState(false);
  const [paidToast, setPaidToast] = useState(null);

  const handlePayBill = (bill) => {
    payCommitment(bill.commitmentId, bill.dueDay);
    setPaidToast(`Paid ${bill.name} (${formatCurrency(bill.amount)})! Recorded as actual expense.`);
    setTimeout(() => setPaidToast(null), 4000);
  };

  // Recharts custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-ink-950 text-parchment-50 p-3 rounded-xl border border-ink-800 shadow-floating text-xs font-sans space-y-1">
          <div className="font-semibold text-mint-300 flex items-center justify-between gap-4">
            <span>Day {label}</span>
            <span className="text-[10px] text-ink-400 font-mono">
              {data.isPast ? 'Recorded' : data.isCurrent ? 'Today' : 'Projected'}
            </span>
          </div>
          <div className="font-num text-sm font-bold text-white">
            {formatCurrency(data.balance)}
          </div>
          {data.billsDue && data.billsDue.length > 0 && (
            <div className="pt-1.5 border-t border-ink-800 text-[11px] text-amberGold-300">
              Bills Due: {data.billsDue.map((b) => `${b.name} (${formatCurrency(b.amount)})`).join(', ')}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Toast Notification */}
      {paidToast && (
        <div className="p-3.5 bg-mint-900 text-mint-100 rounded-xl border border-mint-500/40 shadow-floating flex items-center gap-2.5 text-xs sm:text-sm animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-mint-300 shrink-0" />
          <span>{paidToast}</span>
        </div>
      )}

      {/* HERO SECTION: Challenge Header + Living Money Orbit Signature Visual */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 via-ink-950 to-[#0A1612] text-parchment-50 border border-ink-800 shadow-elevated p-6 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text / Challenge Summary */}
          <div className="lg:col-span-7 space-y-4 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint-500/20 border border-mint-400/30 text-mint-300 text-xs font-semibold tracking-wider uppercase font-mono">
              <span className="w-2 h-2 rounded-full bg-mint-400 animate-ping" />
              Day {state.currentDay} of 30 &bull; Financial Survival Status
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
              Survive the Month on ₹10,000
            </h1>

            <p className="text-ink-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Starting with a strict <strong className="text-white font-num">₹10,000</strong> budget, you have{' '}
              <strong className="text-mint-300 font-num">{metrics.remainingDays} days</strong> remaining. Monitor cash flows, honor essential bills, and simulate choices in the Decision Lab before spending.
            </p>

            {/* Quick Verdict Banner */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="px-3.5 py-2 rounded-xl bg-ink-800/80 border border-ink-700/60 flex items-center gap-2 text-xs">
                <span className="text-ink-400">Survival Status:</span>
                <span className={`font-semibold font-mono px-2 py-0.5 rounded text-xs ${
                  metrics.projectedDay30Balance >= 1500
                    ? 'bg-mint-500/20 text-mint-300'
                    : metrics.projectedDay30Balance >= 0
                    ? 'bg-amberGold-500/20 text-amberGold-300'
                    : 'bg-terracotta-500/20 text-terracotta-300'
                }`}>
                  {metrics.projectedDay30Balance >= 1500
                    ? 'Viable Cushion'
                    : metrics.projectedDay30Balance >= 0
                    ? 'Manageable But Tight'
                    : 'Solvency Deficit Alert'}
                </span>
              </div>

              <button
                onClick={onNavigateToLab}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-mint-600 hover:bg-mint-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-subtle hover:shadow-card"
              >
                <Sparkles className="w-4 h-4 text-amberGold-300" />
                Launch Decision Lab
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Signature Visual: The Living Money Orbit */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative min-h-[220px] lg:min-h-[280px]">
            <div className="relative flex items-center justify-center">
              <LivingMoneyOrbit size="full" />
            </div>
            <div className="text-center mt-3 text-[11px] font-mono text-ink-400 tracking-wider uppercase">
              Living Money Orbit &bull; Financial Equilibrium
            </div>
          </div>
        </div>
      </section>

      {/* CORE 3-BUCKET LIQUIDITY LEDGER (Distinguishing Actual Cash, Reserved, & Projected) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-ink-950">
            Cash Liquidity & Reservation Buckets
          </h2>
          <span className="text-xs text-ink-500 font-mono">
            Single Source of Truth Engine
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* BUCKET 1: Actual Liquid Cash */}
          <div className="p-5 rounded-2xl bg-parchment-50 border border-parchment-300/80 shadow-subtle relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-ink-500 font-medium">
              <span>Actual Liquid Cash</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-mint-100 text-mint-800 font-mono">
                Liquid Now
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-num text-ink-950">
                {formatCurrency(metrics.availableCash)}
              </span>
            </div>
            <p className="mt-2 text-xs text-ink-600 leading-relaxed">
              Available cash in pocket. Starting ₹10,000 + income ({formatCurrency(metrics.totalIncome)}) - spent ({formatCurrency(metrics.actualExpenses)}) - saved ({formatCurrency(metrics.totalSavingsReserved)}).
            </p>
          </div>

          {/* BUCKET 2: Reserved Commitments */}
          <div className="p-5 rounded-2xl bg-parchment-50 border border-parchment-300/80 shadow-subtle relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-ink-500 font-medium">
              <span>Reserved Commitments</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amberGold-100 text-amberGold-800 font-mono">
                Pledged Bills
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-num text-amberGold-700">
                {formatCurrency(metrics.outstandingCommitments)}
              </span>
            </div>
            <p className="mt-2 text-xs text-ink-600 leading-relaxed">
              {metrics.upcomingBills.length} unpaid recurring bill(s) scheduled between Day {state.currentDay} and Day 30 (Rent, Internet, Phone, etc.).
            </p>
          </div>

          {/* BUCKET 3: Projected Day-30 Cash */}
          <div className="p-5 rounded-2xl bg-parchment-50 border border-parchment-300/80 shadow-subtle relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-ink-500 font-medium">
              <span>Projected Day-30 Cash</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                metrics.projectedDay30Balance >= 0 ? 'bg-mint-100 text-mint-800' : 'bg-terracotta-100 text-terracotta-800'
              }`}>
                Survival Cushion
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className={`text-2xl sm:text-3xl font-bold font-num ${
                metrics.projectedDay30Balance >= 0 ? 'text-mint-800' : 'text-terracotta-600'
              }`}>
                {formatCurrency(metrics.projectedDay30Balance)}
              </span>
            </div>
            <p className="mt-2 text-xs text-ink-600 leading-relaxed">
              Net balance on Day 30 after all upcoming commitments are honored. Safe daily allowance: <strong className="text-ink-900 font-num">{formatCurrency(metrics.safeDailyAllowance)}/day</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* METRIC RIBBON: Starting Budget, Actual Spent, Income, Daily Allowance, Scores */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-parchment-50 border border-parchment-300">
          <span className="text-[11px] text-ink-500 font-medium block">Starting Budget</span>
          <span className="text-base sm:text-lg font-bold font-num text-ink-900">
            {formatCurrency(metrics.initialBudget)}
          </span>
          <span className="text-[10px] text-ink-400 block mt-0.5">Day 1 baseline</span>
        </div>

        <div className="p-3.5 rounded-xl bg-parchment-50 border border-parchment-300">
          <span className="text-[11px] text-ink-500 font-medium block">Total Spent</span>
          <span className="text-base sm:text-lg font-bold font-num text-terracotta-700">
            {formatCurrency(metrics.actualExpenses)}
          </span>
          <span className="text-[10px] text-ink-400 block mt-0.5">Through Day {state.currentDay}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-parchment-50 border border-parchment-300">
          <span className="text-[11px] text-ink-500 font-medium block">Income Added</span>
          <span className="text-base sm:text-lg font-bold font-num text-mint-700">
            {formatCurrency(metrics.totalIncome)}
          </span>
          <span className="text-[10px] text-ink-400 block mt-0.5">External earnings</span>
        </div>

        <div className="p-3.5 rounded-xl bg-parchment-50 border border-parchment-300">
          <span className="text-[11px] text-ink-500 font-medium block">Safe Daily Allowance</span>
          <span className="text-base sm:text-lg font-bold font-num text-mint-800">
            {formatCurrency(metrics.safeDailyAllowance)}/d
          </span>
          <span className="text-[10px] text-ink-400 block mt-0.5">For {metrics.remainingDays} days</span>
        </div>

        {/* Financial Risk Score Card */}
        <div
          onClick={() => setShowRiskDetail(!showRiskDetail)}
          className="p-3.5 rounded-xl bg-parchment-50 border border-parchment-300 hover:border-terracotta-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-ink-500 font-medium">Risk Score</span>
            <ShieldAlert className="w-3.5 h-3.5 text-terracotta-600" />
          </div>
          <span className={`text-base sm:text-lg font-bold font-num ${
            metrics.riskScore > 60 ? 'text-terracotta-600' : metrics.riskScore > 35 ? 'text-amberGold-600' : 'text-mint-700'
          }`}>
            {metrics.riskScore} <span className="text-xs font-normal text-ink-400">/100</span>
          </span>
          <span className="text-[10px] text-ink-500 block underline mt-0.5">
            {showRiskDetail ? 'Hide factors' : 'View factors'}
          </span>
        </div>

        {/* Financial Health Score Card */}
        <div
          onClick={() => setShowHealthDetail(!showHealthDetail)}
          className="p-3.5 rounded-xl bg-parchment-50 border border-parchment-300 hover:border-mint-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-ink-500 font-medium">Health Score</span>
            <HeartPulse className="w-3.5 h-3.5 text-mint-700" />
          </div>
          <span className={`text-base sm:text-lg font-bold font-num ${
            metrics.healthScore >= 70 ? 'text-mint-700' : metrics.healthScore >= 45 ? 'text-amberGold-600' : 'text-terracotta-600'
          }`}>
            {metrics.healthScore} <span className="text-xs font-normal text-ink-400">/100</span>
          </span>
          <span className="text-[10px] text-ink-500 block underline mt-0.5">
            {showHealthDetail ? 'Hide factors' : 'View factors'}
          </span>
        </div>
      </section>

      {/* RISK SCORE EXPLAINER ACCORDION */}
      {showRiskDetail && (
        <div className="p-5 rounded-2xl bg-parchment-50 border border-terracotta-300 shadow-subtle space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-ink-950 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-terracotta-600" />
              Financial Risk Score Breakdown ({metrics.riskScore}/100)
            </h3>
            <button
              onClick={() => setShowRiskDetail(false)}
              className="text-xs text-ink-500 hover:text-ink-900"
            >
              Close
            </button>
          </div>
          <p className="text-xs text-ink-600">
            A transparent calculation derived from Day 30 deficit hazard, discretionary daily allowance constraint, fixed recurring debt load, and emergency reserves.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {metrics.riskFactors.map((factor, i) => (
              <div key={i} className="p-3 rounded-xl bg-parchment-100 border border-parchment-200 text-xs">
                <div className="flex items-center justify-between font-semibold text-ink-900">
                  <span>{factor.name}</span>
                  <span className={`font-mono ${factor.impact === '0' ? 'text-mint-700' : 'text-terracotta-600'}`}>
                    {factor.impact} pts
                  </span>
                </div>
                <div className="text-ink-600 mt-1 text-[11px]">{factor.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HEALTH SCORE EXPLAINER ACCORDION */}
      {showHealthDetail && (
        <div className="p-5 rounded-2xl bg-parchment-50 border border-mint-300 shadow-subtle space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-ink-950 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-mint-700" />
              Financial Health Score Breakdown ({metrics.healthScore}/100)
            </h3>
            <button
              onClick={() => setShowHealthDetail(false)}
              className="text-xs text-ink-500 hover:text-ink-900"
            >
              Close
            </button>
          </div>
          <p className="text-xs text-ink-600">
            Measures your long-term buffer quality, daily breathing room, savings goal progress, and category budget discipline.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {metrics.healthFactors.map((factor, i) => (
              <div key={i} className="p-3 rounded-xl bg-parchment-100 border border-parchment-200 text-xs flex items-center justify-between">
                <span className="font-medium text-ink-900">{factor.name}</span>
                <span className="font-mono font-bold text-mint-800">{factor.points}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 30-DAY CASH FLOW CHART (RECHARTS) */}
      <section className="p-6 rounded-2xl bg-parchment-50 border border-parchment-300/80 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-serif font-bold text-ink-950">
              30-Day Cash-Flow Trajectory
            </h2>
            <p className="text-xs text-ink-500">
              Historical ledger through Day {state.currentDay} &rarr; Projected runway through Day 30
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-mint-500" />
              <span className="text-ink-600">Actual/Projected Balance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-terracotta-500 border-t border-dashed" />
              <span className="text-ink-600">Zero Line (Insolvency)</span>
            </div>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.dailyForecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#106B52" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#106B52" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EBE5D8" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: '#637A71' }}
                tickFormatter={(d) => `D${d}`}
                stroke="#DDD5C2"
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#637A71' }}
                tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}`}
                stroke="#DDD5C2"
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="#CF563C" strokeDasharray="4 4" strokeWidth={1.5} />
              <ReferenceLine x={state.currentDay} stroke="#D97706" strokeWidth={1.5} label={{ value: 'Today', fill: '#D97706', fontSize: 10, position: 'top' }} />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#106B52"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#balanceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Interactive Day 1-30 Mini Timeline Scroller */}
        <div className="pt-3 border-t border-parchment-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-ink-700">
              Interactive 30-Day Timeline Selector:
            </span>
            <span className="text-[11px] text-ink-500">
              Click a day to jump simulation perspective
            </span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
            {metrics.dailyForecast.map((item) => {
              const isCurrent = item.day === state.currentDay;
              const hasBills = item.billsDue && item.billsDue.length > 0;
              return (
                <button
                  key={item.day}
                  onClick={() => setCurrentDay(item.day)}
                  className={`shrink-0 flex flex-col items-center justify-center w-10 sm:w-11 py-1.5 rounded-lg border text-xs transition-all ${
                    isCurrent
                      ? 'bg-ink-900 text-parchment-50 border-ink-950 font-bold shadow-subtle'
                      : item.day < state.currentDay
                      ? 'bg-parchment-100 text-ink-500 border-parchment-300'
                      : 'bg-parchment-50 text-ink-800 border-parchment-300 hover:border-mint-500'
                  }`}
                  title={`Day ${item.day}: ${formatCurrency(item.balance)}${hasBills ? ' (Bill due!)' : ''}`}
                >
                  <span className="text-[10px] font-mono leading-none">D{item.day}</span>
                  <span className={`w-1.5 h-1.5 rounded-full mt-1 ${
                    hasBills ? 'bg-amberGold-500' : isCurrent ? 'bg-mint-400' : 'bg-transparent'
                  }`} />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* UPCOMING BILLS & SMART MONEY-COACH INSIGHTS */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Upcoming Bills with Instant Payment Action */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-parchment-50 border border-parchment-300/80 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif font-bold text-ink-950">
                Upcoming Active Commitments
              </h2>
              <p className="text-xs text-ink-500">
                Pay early or track due dates without double-counting.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-amberGold-700 bg-amberGold-100 px-2.5 py-1 rounded-full">
              {formatCurrency(metrics.outstandingCommitments)} Total
            </span>
          </div>

          {metrics.upcomingBills.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-parchment-100/60 border border-parchment-200">
              <Check className="w-8 h-8 text-mint-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-ink-800">
                All scheduled bills for the remaining month are paid!
              </p>
              <p className="text-xs text-ink-500 mt-1">
                No outstanding recurring payments pending through Day 30.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {metrics.upcomingBills.map((bill) => (
                <div
                  key={bill.id}
                  className="p-3.5 rounded-xl bg-parchment-100/80 border border-parchment-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-parchment-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amberGold-400/20 text-amberGold-800 flex flex-col items-center justify-center font-mono text-[10px] shrink-0 font-bold leading-tight">
                      <span>D{bill.dueDay}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-ink-900">{bill.name}</h3>
                      <div className="text-xs text-ink-500 flex items-center gap-2 mt-0.5">
                        <span>{bill.category}</span>
                        <span>&bull;</span>
                        <span className={bill.daysUntilDue <= 3 ? 'text-terracotta-600 font-semibold' : ''}>
                          {bill.daysUntilDue === 0 ? 'Due Today' : bill.daysUntilDue < 0 ? 'Overdue' : `Due in ${bill.daysUntilDue} days`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-parchment-200">
                    <span className="font-num font-bold text-base text-ink-950">
                      {formatCurrency(bill.amount)}
                    </span>
                    <button
                      onClick={() => handlePayBill(bill)}
                      className="px-3 py-1.5 rounded-lg bg-mint-700 hover:bg-mint-800 text-white text-xs font-semibold shadow-subtle transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Pay Bill Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Money-Coach Dynamic Insights */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-parchment-50 border border-parchment-300/80 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif font-bold text-ink-950 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amberGold-600" />
              Money-Coach Intelligence
            </h2>
            <span className="text-[10px] text-ink-400 font-mono">Dynamic Heuristics</span>
          </div>

          <div className="space-y-3">
            {metrics.coachInsights.map((insight) => (
              <div
                key={insight.id}
                className={`p-3.5 rounded-xl border text-xs leading-relaxed space-y-1.5 ${
                  insight.type === 'critical'
                    ? 'bg-terracotta-50 border-terracotta-200 text-terracotta-900'
                    : insight.type === 'warning'
                    ? 'bg-amberGold-50 border-amberGold-200 text-amberGold-900'
                    : insight.type === 'tip'
                    ? 'bg-mint-50/70 border-mint-200 text-ink-900'
                    : 'bg-parchment-100 border-parchment-200 text-ink-800'
                }`}
              >
                <div className="font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-mint-600 shrink-0" />
                  <span>{insight.title}</span>
                </div>
                <p className="text-ink-700">{insight.text}</p>
                {insight.disclaimer && (
                  <p className="text-[10px] text-ink-400 italic pt-0.5">
                    *{insight.disclaimer}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Quick CTA to Scenario Simulator */}
          <div className="pt-2">
            <button
              onClick={onNavigateToLab}
              className="w-full py-2.5 px-4 rounded-xl bg-ink-900 hover:bg-ink-950 text-parchment-50 text-xs font-semibold flex items-center justify-center gap-2 shadow-subtle transition-all"
            >
              Test Unplanned Purchases in Decision Lab
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
