import React, { useState } from 'react';
import {
  FlaskConical,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Sparkles,
  Zap,
  Info,
  Calendar,
  Layers,
  HelpCircle,
  XCircle,
  CopyCheck,
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext.jsx';
import { CATEGORIES } from '../engine/financialEngine.js';
import { formatCurrency, formatPercentage } from '../utils/formatters.js';

export default function DecisionLab({ onNavigateToOverview }) {
  const { state, metrics, runSimulation, commitDecision } = useFinancial();

  // Form State
  const [formData, setFormData] = useState({
    name: 'New Streaming Subscription',
    amount: '999',
    type: 'subscription', // 'purchase' | 'subscription' | 'unexpected_expense' | 'income' | 'savings_contribution'
    category: 'Subscriptions & Bills',
    day: state.currentDay,
    frequency: 'monthly',
    notes: 'Testing ₹999 recurring monthly subscription impact',
  });

  const [formErrors, setFormErrors] = useState({});
  const [simulationResult, setSimulationResult] = useState(null);
  const [hasCommitted, setHasCommitted] = useState(false);
  const [commitMessage, setCommitMessage] = useState(null);

  // Quick Preset Handlers (for judging & instant test validation)
  const loadPreset = (presetType) => {
    setHasCommitted(false);
    setCommitMessage(null);

    if (presetType === 'preset-subscription-999') {
      const p = {
        name: 'Gym & Fitness Membership / App',
        amount: '999',
        type: 'subscription',
        category: 'Subscriptions & Bills',
        day: state.currentDay + 2,
        frequency: 'monthly',
        notes: 'Monthly fitness club auto-renewal',
      };
      setFormData(p);
      triggerSimulation(p);
    } else if (presetType === 'preset-emergency-2000') {
      const p = {
        name: 'Emergency Dental Treatment',
        amount: '2000',
        type: 'unexpected_expense',
        category: 'Health & Medical',
        day: state.currentDay,
        frequency: 'one-time',
        notes: 'Sudden toothache consultation and prescription medications',
      };
      setFormData(p);
      triggerSimulation(p);
    } else if (presetType === 'preset-income-1500') {
      const p = {
        name: 'Freelance Design Gig Payout',
        amount: '1500',
        type: 'income',
        category: 'Personal & Misc',
        day: state.currentDay + 3,
        frequency: 'one-time',
        notes: 'Campus club fest poster commission',
      };
      setFormData(p);
      triggerSimulation(p);
    }
  };

  const validate = (data = formData) => {
    const errors = {};
    if (!data.name || data.name.trim().length === 0) {
      errors.name = 'Please provide a decision or item name';
    }
    const amt = Number(data.amount);
    if (isNaN(amt) || amt <= 0) {
      errors.amount = 'Amount must be a positive number greater than 0';
    }
    if (!data.day || isNaN(Number(data.day)) || Number(data.day) < 1 || Number(data.day) > 30) {
      errors.day = 'Day must be between Day 1 and Day 30';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const triggerSimulation = (overrideData = null) => {
    const data = overrideData || formData;
    if (!validate(data)) return;

    try {
      const scenario = {
        name: data.name.trim(),
        amount: Number(data.amount),
        type: data.type,
        category: data.category,
        day: Number(data.day),
        frequency: data.frequency,
        notes: data.notes ? data.notes.trim() : '',
      };
      const result = runSimulation(scenario);
      setSimulationResult(result);
      setHasCommitted(false);
      setCommitMessage(null);
    } catch (err) {
      setFormErrors({ general: err.message });
    }
  };

  const handleSimulateSubmit = (e) => {
    e.preventDefault();
    triggerSimulation();
  };

  const handleCommit = () => {
    if (!simulationResult || hasCommitted) return;

    try {
      commitDecision(simulationResult.scenario);
      setHasCommitted(true);
      setCommitMessage(
        `Successfully committed "${simulationResult.scenario.name}" (${formatCurrency(simulationResult.scenario.amount)}) into actual financial state!`
      );
    } catch (err) {
      setFormErrors({ general: `Commit failed: ${err.message}` });
    }
  };

  const handleDiscard = () => {
    setSimulationResult(null);
    setHasCommitted(false);
    setCommitMessage(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-ink-900 via-ink-950 to-ink-900 text-parchment-50 border border-ink-800 shadow-elevated">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint-500/20 border border-mint-400/30 text-mint-300 text-xs font-semibold tracking-wider uppercase font-mono">
            <FlaskConical className="w-3.5 h-3.5" />
            Interactive Scenario Sandbox &bull; Zero Mutation Until Commit
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            The Decision Lab
          </h1>
          <p className="text-ink-300 text-sm sm:text-base leading-relaxed">
            Test any expense, subscription, sudden shock, or income opportunity before committing actual cash.{' '}
            <strong className="text-mint-300 font-medium">
              &ldquo;Make the decision. See the consequences. Then commit.&rdquo;
            </strong>
          </p>
        </div>

        {/* Required Presets Ribbon for quick evaluation */}
        <div className="mt-6 pt-5 border-t border-ink-800/80">
          <span className="text-xs text-ink-400 font-medium block mb-2.5">
            Judge & Benchmark Scenarios (1-Click Presets):
          </span>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => loadPreset('preset-subscription-999')}
              className="px-3.5 py-2 rounded-xl bg-ink-800 hover:bg-mint-900 text-mint-200 border border-mint-500/30 text-xs font-semibold flex items-center gap-2 transition-all shadow-subtle"
            >
              <Zap className="w-3.5 h-3.5 text-amberGold-400" />
              Test ₹999 Monthly Subscription
            </button>

            <button
              type="button"
              onClick={() => loadPreset('preset-emergency-2000')}
              className="px-3.5 py-2 rounded-xl bg-ink-800 hover:bg-terracotta-900 text-terracotta-200 border border-terracotta-500/30 text-xs font-semibold flex items-center gap-2 transition-all shadow-subtle"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-terracotta-400" />
              Test ₹2,000 Emergency Expense
            </button>

            <button
              type="button"
              onClick={() => loadPreset('preset-income-1500')}
              className="px-3.5 py-2 rounded-xl bg-ink-800 hover:bg-mint-900 text-mint-300 border border-ink-700 text-xs font-medium flex items-center gap-2 transition-all"
            >
              <TrendingUp className="w-3.5 h-3.5 text-mint-400" />
              Test +₹1,500 Side Income
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Form Builder, Right Simulated Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: Scenario Configuration Form */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-parchment-50 border border-parchment-300 shadow-subtle space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-parchment-200">
            <div>
              <h2 className="text-lg font-serif font-bold text-ink-950">
                Configure Financial Decision
              </h2>
              <p className="text-xs text-ink-500">Define candidate parameters to simulate</p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-parchment-200 text-ink-700">
              Isolated
            </span>
          </div>

          {formErrors.general && (
            <div className="p-3 bg-terracotta-50 border border-terracotta-200 rounded-xl text-xs text-terracotta-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-terracotta-600 shrink-0" />
              <span>{formErrors.general}</span>
            </div>
          )}

          <form onSubmit={handleSimulateSubmit} className="space-y-4">
            {/* Decision Type */}
            <div>
              <label htmlFor="decision-type" className="block text-xs font-semibold text-ink-700 mb-1.5">
                Decision Type *
              </label>
              <select
                id="decision-type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-parchment-100 border border-parchment-300 text-sm font-medium text-ink-900 focus:ring-2 focus:ring-mint-500 transition-all"
              >
                <option value="subscription">Recurring Subscription / Bill</option>
                <option value="unexpected_expense">Unexpected Emergency Expense</option>
                <option value="purchase">Planned One-Time Purchase</option>
                <option value="ordinary_expense">Ordinary Living Expense</option>
                <option value="income">Additional Income Opportunity</option>
                <option value="savings_contribution">Savings Goal Contribution</option>
              </select>
            </div>

            {/* Name / Description */}
            <div>
              <label htmlFor="decision-name" className="block text-xs font-semibold text-ink-700 mb-1.5">
                Decision Name *
              </label>
              <input
                id="decision-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Netflix 4K, Bike Repair, Winter Coat..."
                className={`w-full px-3 py-2 rounded-xl bg-parchment-100 border text-sm text-ink-900 focus:ring-2 focus:ring-mint-500 transition-all ${
                  formErrors.name ? 'border-terracotta-400' : 'border-parchment-300'
                }`}
              />
              {formErrors.name && (
                <span className="text-[11px] text-terracotta-600 mt-1 block">{formErrors.name}</span>
              )}
            </div>

            {/* Amount & Day */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="decision-amount" className="block text-xs font-semibold text-ink-700 mb-1.5">
                  Amount (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-ink-400 font-num text-sm">₹</span>
                  <input
                    id="decision-amount"
                    type="number"
                    min="1"
                    step="1"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className={`w-full pl-7 pr-3 py-2 rounded-xl bg-parchment-100 border text-sm font-num text-ink-900 focus:ring-2 focus:ring-mint-500 transition-all ${
                      formErrors.amount ? 'border-terracotta-400' : 'border-parchment-300'
                    }`}
                  />
                </div>
                {formErrors.amount && (
                  <span className="text-[11px] text-terracotta-600 mt-1 block">{formErrors.amount}</span>
                )}
              </div>

              <div>
                <label htmlFor="decision-day" className="block text-xs font-semibold text-ink-700 mb-1.5">
                  Effective Day (1-30) *
                </label>
                <input
                  id="decision-day"
                  type="number"
                  min="1"
                  max="30"
                  value={formData.day}
                  onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl bg-parchment-100 border text-sm font-num text-ink-900 focus:ring-2 focus:ring-mint-500 transition-all ${
                    formErrors.day ? 'border-terracotta-400' : 'border-parchment-300'
                  }`}
                />
                {formErrors.day && (
                  <span className="text-[11px] text-terracotta-600 mt-1 block">{formErrors.day}</span>
                )}
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="decision-category" className="block text-xs font-semibold text-ink-700 mb-1.5">
                Category
              </label>
              <select
                id="decision-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-parchment-100 border border-parchment-300 text-sm text-ink-900 focus:ring-2 focus:ring-mint-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="decision-notes" className="block text-xs font-semibold text-ink-700 mb-1.5">
                Simulation Rationale / Notes (Optional)
              </label>
              <textarea
                id="decision-notes"
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Why are you testing this decision?"
                className="w-full px-3 py-2 rounded-xl bg-parchment-100 border border-parchment-300 text-xs text-ink-900 focus:ring-2 focus:ring-mint-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-mint-700 hover:bg-mint-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-subtle transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                Simulate Decision
              </button>

              <button
                type="button"
                onClick={handleDiscard}
                className="px-3.5 py-2.5 rounded-xl border border-parchment-300 text-ink-600 hover:text-ink-900 hover:bg-parchment-200 text-xs font-medium transition-colors"
                title="Clear current simulation"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT: Simulation Results & Consequences */}
        <div className="lg:col-span-7 space-y-6">
          {commitMessage && (
            <div className="p-4 rounded-2xl bg-mint-900 text-mint-100 border border-mint-500/40 shadow-card flex items-start gap-3 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-mint-300 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-sm text-white">Decision Committed!</h3>
                <p className="text-xs text-mint-200 mt-1">{commitMessage}</p>
                <p className="text-[11px] text-mint-300/80 mt-1 font-mono">
                  All dashboard metrics, runway forecasts, and risk scores have been permanently recalculated.
                </p>
                {onNavigateToOverview && (
                  <button
                    type="button"
                    onClick={onNavigateToOverview}
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-mint-700 hover:bg-mint-600 text-white text-xs font-semibold shadow-subtle transition-colors"
                  >
                    View Updated Overview Dashboard &rarr;
                  </button>
                )}
              </div>
            </div>
          )}

          {!simulationResult ? (
            /* Empty State when no scenario simulated yet */
            <div className="p-10 rounded-2xl bg-parchment-50 border border-parchment-300 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-parchment-200 text-mint-700 mx-auto flex items-center justify-center shadow-subtle">
                <FlaskConical className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="font-serif font-bold text-lg text-ink-900">
                  Ready to Simulate Consequences
                </h3>
                <p className="text-xs text-ink-500 mt-1.5 leading-relaxed">
                  Enter an expense or choose a preset on the left, then click <strong>Simulate Decision</strong>.
                  You will see an isolated side-by-side Before vs After impact analysis.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => loadPreset('preset-subscription-999')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-parchment-200 hover:bg-parchment-300 text-xs font-semibold text-ink-800 transition-colors"
                >
                  <Zap className="w-3.5 h-3.5 text-amberGold-600" />
                  Try ₹999 Subscription Preset
                </button>
              </div>
            </div>
          ) : (
            /* Active Simulation Impact Panel */
            <div className="p-6 sm:p-7 rounded-2xl bg-parchment-50 border border-parchment-300/90 shadow-card space-y-6 animate-fadeIn">
              
              {/* Verdict Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-parchment-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-ink-500 font-medium">
                      Simulation Verdict
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-parchment-200 text-ink-800">
                      {simulationResult.scenario.type.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <h3 className={`text-xl sm:text-2xl font-serif font-bold mt-1 ${
                    simulationResult.verdict === 'AFFORDABLE'
                      ? 'text-mint-700'
                      : simulationResult.verdict === 'MANAGEABLE_BUT_TIGHT'
                      ? 'text-amberGold-600'
                      : 'text-terracotta-600'
                  }`}>
                    {simulationResult.verdictTitle}
                  </h3>
                </div>

                {/* Verdict Badge */}
                <div className={`px-4 py-2 rounded-xl border font-semibold text-xs text-center ${
                  simulationResult.verdict === 'AFFORDABLE'
                    ? 'bg-mint-50 border-mint-200 text-mint-800'
                    : simulationResult.verdict === 'MANAGEABLE_BUT_TIGHT'
                    ? 'bg-amberGold-50 border-amberGold-200 text-amberGold-800'
                    : 'bg-terracotta-50 border-terracotta-200 text-terracotta-800'
                }`}>
                  {simulationResult.verdict}
                </div>
              </div>

              {/* Verdict Explanation Text */}
              <p className="text-xs sm:text-sm text-ink-700 leading-relaxed bg-parchment-100 p-3.5 rounded-xl border border-parchment-200">
                {simulationResult.verdictExplanation}
              </p>

              {/* BEFORE VS AFTER METRICS TABLE */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink-500 font-mono">
                  Consequences: Before vs After Breakdown
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Metric: Available Cash */}
                  <div className="p-3.5 rounded-xl bg-parchment-100 border border-parchment-200 space-y-1">
                    <span className="text-[11px] text-ink-500 font-medium block">Available Cash</span>
                    <div className="flex items-baseline justify-between font-num">
                      <span className="text-xs text-ink-600">
                        {formatCurrency(simulationResult.beforeMetrics.availableCash)}
                      </span>
                      <ArrowRight className="w-3 h-3 text-ink-400" />
                      <span className="text-sm font-bold text-ink-950">
                        {formatCurrency(simulationResult.afterMetrics.availableCash)}
                      </span>
                    </div>
                    <p className="text-[10px] text-ink-500 mt-1 leading-normal">
                      {simulationResult.metricExplanations.availableCash}
                    </p>
                  </div>

                  {/* Metric: Outstanding Commitments */}
                  <div className="p-3.5 rounded-xl bg-parchment-100 border border-parchment-200 space-y-1">
                    <span className="text-[11px] text-ink-500 font-medium block">Reserved Commitments</span>
                    <div className="flex items-baseline justify-between font-num">
                      <span className="text-xs text-ink-600">
                        {formatCurrency(simulationResult.beforeMetrics.outstandingCommitments)}
                      </span>
                      <ArrowRight className="w-3 h-3 text-ink-400" />
                      <span className="text-sm font-bold text-amberGold-700">
                        {formatCurrency(simulationResult.afterMetrics.outstandingCommitments)}
                      </span>
                    </div>
                    <p className="text-[10px] text-ink-500 mt-1 leading-normal">
                      {simulationResult.metricExplanations.outstandingCommitments}
                    </p>
                  </div>

                  {/* Metric: Safe Daily Allowance */}
                  <div className="p-3.5 rounded-xl bg-parchment-100 border border-parchment-200 space-y-1">
                    <span className="text-[11px] text-ink-500 font-medium block">Daily Spending Allowance</span>
                    <div className="flex items-baseline justify-between font-num">
                      <span className="text-xs text-ink-600">
                        {formatCurrency(simulationResult.beforeMetrics.safeDailyAllowance)}/d
                      </span>
                      <ArrowRight className="w-3 h-3 text-ink-400" />
                      <span className={`text-sm font-bold ${
                        simulationResult.afterMetrics.safeDailyAllowance < 70 ? 'text-terracotta-600' : 'text-mint-800'
                      }`}>
                        {formatCurrency(simulationResult.afterMetrics.safeDailyAllowance)}/d
                      </span>
                    </div>
                    <p className="text-[10px] text-ink-500 mt-1 leading-normal">
                      {simulationResult.metricExplanations.safeDailyAllowance}
                    </p>
                  </div>

                  {/* Metric: Day-30 Projected Balance */}
                  <div className="p-3.5 rounded-xl bg-parchment-100 border border-parchment-200 space-y-1">
                    <span className="text-[11px] text-ink-500 font-medium block">Day-30 Projected Cushion</span>
                    <div className="flex items-baseline justify-between font-num">
                      <span className="text-xs text-ink-600">
                        {formatCurrency(simulationResult.beforeMetrics.projectedDay30Balance)}
                      </span>
                      <ArrowRight className="w-3 h-3 text-ink-400" />
                      <span className={`text-sm font-bold ${
                        simulationResult.afterMetrics.projectedDay30Balance < 0 ? 'text-terracotta-600' : 'text-ink-950'
                      }`}>
                        {formatCurrency(simulationResult.afterMetrics.projectedDay30Balance)}
                      </span>
                    </div>
                    <p className="text-[10px] text-ink-500 mt-1 leading-normal">
                      {simulationResult.metricExplanations.projectedDay30Balance}
                    </p>
                  </div>

                  {/* Metric: Financial Risk Score */}
                  <div className="p-3.5 rounded-xl bg-parchment-100 border border-parchment-200 space-y-1">
                    <span className="text-[11px] text-ink-500 font-medium block">Risk Score (0-100)</span>
                    <div className="flex items-baseline justify-between font-num">
                      <span className="text-xs text-ink-600">
                        {simulationResult.beforeMetrics.riskScore}/100
                      </span>
                      <ArrowRight className="w-3 h-3 text-ink-400" />
                      <span className={`text-sm font-bold ${
                        simulationResult.afterMetrics.riskScore > 60 ? 'text-terracotta-600' : 'text-ink-950'
                      }`}>
                        {simulationResult.afterMetrics.riskScore}/100
                      </span>
                    </div>
                    <p className="text-[10px] text-ink-500 mt-1 leading-normal">
                      {simulationResult.metricExplanations.riskScore}
                    </p>
                  </div>

                  {/* Metric: Financial Health Score */}
                  <div className="p-3.5 rounded-xl bg-parchment-100 border border-parchment-200 space-y-1">
                    <span className="text-[11px] text-ink-500 font-medium block">Health Score (0-100)</span>
                    <div className="flex items-baseline justify-between font-num">
                      <span className="text-xs text-ink-600">
                        {simulationResult.beforeMetrics.healthScore}/100
                      </span>
                      <ArrowRight className="w-3 h-3 text-ink-400" />
                      <span className="text-sm font-bold text-mint-700">
                        {simulationResult.afterMetrics.healthScore}/100
                      </span>
                    </div>
                    <p className="text-[10px] text-ink-500 mt-1 leading-normal">
                      Overall resilience index movement: {simulationResult.deltas.healthScore >= 0 ? `+${simulationResult.deltas.healthScore}` : simulationResult.deltas.healthScore} pts.
                    </p>
                  </div>
                </div>
              </div>

              {/* STRICT COMMITMENT BAR */}
              <div className="pt-4 border-t border-parchment-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-ink-500 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-mint-600 shrink-0" />
                  <span>
                    {hasCommitted
                      ? 'Already committed to live ledger.'
                      : 'Simulated in memory only. Click Commit to apply permanently.'}
                  </span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleDiscard}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-parchment-300 text-xs font-semibold text-ink-700 hover:text-ink-950 hover:bg-parchment-200 transition-colors"
                  >
                    Discard Simulation
                  </button>

                  <button
                    type="button"
                    onClick={handleCommit}
                    disabled={hasCommitted}
                    className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-subtle transition-all ${
                      hasCommitted
                        ? 'bg-parchment-300 text-ink-400 cursor-not-allowed'
                        : simulationResult.verdict === 'UNSUSTAINABLE'
                        ? 'bg-terracotta-700 hover:bg-terracotta-800 text-white'
                        : 'bg-mint-700 hover:bg-mint-800 text-white'
                    }`}
                  >
                    {hasCommitted ? (
                      <>
                        <CopyCheck className="w-4 h-4" />
                        Committed
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Commit Decision to Live State
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
