import React, { useState } from 'react';
import {
  Lightbulb,
  ShieldAlert,
  HeartPulse,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Sliders,
  ArrowRight,
  Info,
  CheckCircle2,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext.jsx';
import { formatCurrency, formatPercentage } from '../utils/formatters.js';

export default function Insights({ onNavigateToLab }) {
  const { state, metrics } = useFinancial();

  // Interactive Discretionary Spending Trim Simulator
  const [dailyTrimAmount, setDailyTrimAmount] = useState(50);

  const remainingDays = metrics.remainingDays;
  const estimatedTrimSavings = dailyTrimAmount * remainingDays;
  const newSimulatedDay30 = metrics.projectedDay30Balance + estimatedTrimSavings;
  const newSimulatedDaily = Math.max(0, metrics.safeDailyAllowance - dailyTrimAmount);

  // Pre-configured Unexpected Expense Templates
  const emergencyTemplates = [
    {
      title: 'Sudden Medical / Dental Consultation',
      amount: 2000,
      category: 'Health & Medical',
      severity: 'High Shock',
      impact: 'Immediate liquid deduction',
    },
    {
      title: 'Phone Screen Repair / Tech Replacement',
      amount: 1800,
      category: 'Personal & Misc',
      severity: 'Moderate Shock',
      impact: 'Drains ~40% of uncommitted cash',
    },
    {
      title: 'Emergency Travel / Tatkal Train Ticket',
      amount: 1200,
      category: 'Travel & Commute',
      severity: 'Medium Shock',
      impact: 'Requires reducing daily food allowance',
    },
    {
      title: 'Academic Kit & Practical Exam Fee',
      amount: 750,
      category: 'Education & Books',
      severity: 'Manageable Shock',
      impact: 'Feasible if non-essential spending is paused',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink-950">
          Financial Intelligence & Resilience Coach
        </h1>
        <p className="text-xs sm:text-sm text-ink-600">
          Algorithmic heuristics, sensitivity modeling, and emergency shock testing.
        </p>
      </div>

      {/* SECTION 1: INTERACTIVE DISCRETIONARY TRIM SIMULATOR */}
      <section className="p-6 sm:p-7 rounded-3xl bg-[#16243A] border border-[#243B5E] shadow-card relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-1.5 before:bg-gradient-to-r before:from-emerald-600 via-teal-400 to-amber-500 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-mint-100 text-mint-800">
                <Sliders className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-serif font-bold text-ink-950">
                Discretionary Spending Trim Sensitivity
              </h2>
            </div>
            <p className="text-xs text-ink-500 mt-0.5">
              Simulate how tightening your daily living budget frees up safety reserves across the remaining {remainingDays} days.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-parchment-200 text-ink-600">
            Rule-Based Sensitivity
          </span>
        </div>

        {/* Slider Controls */}
        <div className="p-5 rounded-xl bg-parchment-100/90 border border-parchment-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="trim-slider" className="text-xs font-semibold text-ink-800">
              Daily Discretionary Trim Target:
            </label>
            <span className="font-num font-bold text-base text-mint-800">
              ₹{dailyTrimAmount}/day
            </span>
          </div>

          <input
            id="trim-slider"
            type="range"
            min="10"
            max="150"
            step="10"
            value={dailyTrimAmount}
            onChange={(e) => setDailyTrimAmount(Number(e.target.value))}
            className="w-full accent-mint-700 cursor-pointer"
          />

          <div className="flex justify-between text-[10px] font-mono text-ink-500">
            <span>₹10/day (Minor thrift)</span>
            <span>₹50/day (Recommended benchmark)</span>
            <span>₹150/day (Strict austerity)</span>
          </div>
        </div>

        {/* Trim Projection Outcome */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-parchment-100 border border-parchment-200">
            <span className="text-[11px] text-ink-500 font-medium block">
              Estimated Retained Buffer
            </span>
            <span className="text-xl font-bold font-num text-mint-800">
              +{formatCurrency(estimatedTrimSavings)}
            </span>
            <span className="text-[10px] text-ink-400 block mt-0.5">
              Over {remainingDays} days (₹{dailyTrimAmount} &times; {remainingDays})
            </span>
          </div>

          <div className="p-4 rounded-xl bg-parchment-100 border border-parchment-200">
            <span className="text-[11px] text-ink-500 font-medium block">
              Simulated Day-30 Balance
            </span>
            <span className={`text-xl font-bold font-num ${
              newSimulatedDay30 >= 0 ? 'text-ink-950' : 'text-terracotta-600'
            }`}>
              {formatCurrency(newSimulatedDay30)}
            </span>
            <span className="text-[10px] text-ink-400 block mt-0.5">
              vs base {formatCurrency(metrics.projectedDay30Balance)}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-parchment-100 border border-parchment-200">
            <span className="text-[11px] text-ink-500 font-medium block">
              Adjusted Daily Allowance
            </span>
            <span className="text-xl font-bold font-num text-ink-800">
              {formatCurrency(newSimulatedDaily)}/day
            </span>
            <span className="text-[10px] text-ink-400 block mt-0.5">
              Remaining daily living flexibility
            </span>
          </div>
        </div>

        <p className="text-[11px] text-ink-500 italic">
          *Estimates assume uniform discretionary restraint across all remaining challenge days; actual outcomes depend on unexpected occurrences. RupeeOrbit does not guarantee financial safety.
        </p>
      </section>

      {/* SECTION 2: UNEXPECTED SHOCK STRESS-TEST TEMPLATES */}
      <section className="p-6 sm:p-7 rounded-3xl bg-[#16243A] border border-[#243B5E] shadow-card relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-1.5 before:bg-gradient-to-r before:from-rose-500 via-amber-500 to-indigo-500 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-serif font-bold text-ink-950 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-terracotta-600" />
              Emergency Shock Stress Tests
            </h2>
            <p className="text-xs text-ink-500 font-medium">
              Test sudden unavoidable shocks in the Decision Lab to verify whether your ₹10,000 plan survives.
            </p>
          </div>
          <button
            onClick={onNavigateToLab}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:to-teal-500 text-white text-xs font-bold shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            Open Decision Lab
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergencyTemplates.map((template, idx) => {
            const wouldBreachZero = metrics.availableCash - template.amount < 0;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-parchment-100/90 border border-parchment-200 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-ink-950">{template.title}</span>
                    <span className="font-num font-bold text-terracotta-700">
                      -{formatCurrency(template.amount)}
                    </span>
                  </div>
                  <p className="text-[11px] text-ink-500 mt-1">{template.impact}</p>
                </div>

                <div className="pt-2 border-t border-parchment-200 flex items-center justify-between text-xs">
                  <span className={`font-mono text-[10px] px-2 py-0.5 rounded font-semibold ${
                    wouldBreachZero ? 'bg-terracotta-100 text-terracotta-800' : 'bg-parchment-200 text-ink-700'
                  }`}>
                    {wouldBreachZero ? 'Breaches ₹0 cash!' : 'Absorbable with buffer'}
                  </span>

                  <button
                    onClick={onNavigateToLab}
                    className="text-mint-800 hover:text-mint-900 font-semibold text-[11px] flex items-center gap-1"
                  >
                    Simulate this in Lab
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: EXPLAINABLE SCORING ARCHITECTURE DOCUMENTATION */}
      <section className="p-6 rounded-2xl bg-[#16243A] border border-[#243B5E] shadow-card space-y-4">
        <h2 className="text-lg font-serif font-bold text-ink-950">
          Scoring Methodology & Mathematical Transparency
        </h2>
        <p className="text-xs text-ink-600 leading-relaxed">
          RupeeOrbit uses deterministic, fully explainable rules without black-box approximations. Both Risk Score and Health Score are evaluated strictly against survival constraints:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-parchment-100 border border-parchment-200 space-y-2 text-xs">
            <h3 className="font-semibold text-ink-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-terracotta-600" />
              Financial Risk Score Formula (0 to 100)
            </h3>
            <ul className="list-disc list-inside space-y-1 text-ink-600 text-[11px]">
              <li><strong>Day-30 Deficit Penalty:</strong> +60 pts if forecast balance &lt; ₹0; +40 pts if &lt; ₹500; +22 pts if &lt; ₹1,500.</li>
              <li><strong>Daily Allowance Constraint:</strong> +30 pts if allowance = ₹0/day; +24 pts if &lt; ₹70/day; +12 pts if &lt; ₹150/day.</li>
              <li><strong>Commitment Ratio:</strong> +16 pts if upcoming commitments exceed 65% of available cash.</li>
              <li><strong>Zero Savings Buffer:</strong> +8 pts if no savings reserves exist for sudden shocks.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-parchment-100 border border-parchment-200 space-y-2 text-xs">
            <h3 className="font-semibold text-ink-900 flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-mint-700" />
              Financial Health Score Formula (0 to 100)
            </h3>
            <ul className="list-disc list-inside space-y-1 text-ink-600 text-[11px]">
              <li><strong>Solvency Weight (40 pts):</strong> Proportional to Day-30 buffer, maxing out at ₹2,500 surplus.</li>
              <li><strong>Daily Margin Comfort (30 pts):</strong> Proportional to safe daily spending allowance, maxing out at ₹200/day.</li>
              <li><strong>Budget Discipline (15 pts):</strong> 15 points minus 5 points per category that exceeds its spending ceiling.</li>
              <li><strong>Savings Goal Progress (15 pts):</strong> Scaled by percentage of declared savings goal targets fulfilled.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
