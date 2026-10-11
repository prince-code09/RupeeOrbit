import React, { useState } from 'react';
import {
  Target,
  Plus,
  PiggyBank,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Clock,
  ArrowRight,
  Edit2,
  Trash2,
  X,
  Zap,
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext.jsx';
import { formatCurrency, formatPercentage } from '../utils/formatters.js';

export default function SavingsGoals({ onNavigateToLab }) {
  const { state, metrics, addGoal, updateGoal, deleteGoal, contributeToGoal } = useFinancial();

  // Modal State for New/Edit Goal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    savedAmount: '0',
    deadlineDay: 30,
    priority: 'Medium',
  });
  const [formErrors, setFormErrors] = useState({});

  // Contribution Modal / State
  const [contributeGoal, setContributeGoal] = useState(null);
  const [contributeAmount, setContributeAmount] = useState('200');
  const [contributeError, setContributeError] = useState(null);
  const [successToast, setSuccessToast] = useState(null);

  const openAddModal = () => {
    setEditingGoal(null);
    setFormData({
      name: '',
      targetAmount: '',
      savedAmount: '0',
      deadlineDay: 30,
      priority: 'Medium',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (g) => {
    setEditingGoal(g);
    setFormData({
      name: g.name,
      targetAmount: String(g.targetAmount),
      savedAmount: String(g.savedAmount),
      deadlineDay: g.deadlineDay || 30,
      priority: g.priority || 'Medium',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Goal name is required';
    const target = Number(formData.targetAmount);
    if (isNaN(target) || target <= 0) errors.targetAmount = 'Target amount must be greater than 0';
    const saved = Number(formData.savedAmount);
    if (isNaN(saved) || saved < 0) errors.savedAmount = 'Saved amount cannot be negative';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveGoal = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingGoal) {
      updateGoal({
        ...editingGoal,
        name: formData.name.trim(),
        targetAmount: Number(formData.targetAmount),
        savedAmount: Number(formData.savedAmount),
        deadlineDay: Number(formData.deadlineDay),
        priority: formData.priority,
      });
    } else {
      addGoal(formData);
    }
    setIsModalOpen(false);
  };

  const handleContributeSubmit = (e) => {
    e.preventDefault();
    setContributeError(null);
    const amt = Number(contributeAmount);
    if (isNaN(amt) || amt <= 0) {
      setContributeError('Enter a valid contribution amount');
      return;
    }
    if (amt > metrics.availableCash) {
      setContributeError(
        `Insufficient liquid cash. You only have ${formatCurrency(metrics.availableCash)} available to transfer.`
      );
      return;
    }

    const success = contributeToGoal(contributeGoal.id, amt);
    if (success) {
      setSuccessToast(`Transferred ${formatCurrency(amt)} into "${contributeGoal.name}"!`);
      setContributeGoal(null);
      setTimeout(() => setSuccessToast(null), 4000);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-3.5 bg-mint-900 text-mint-100 rounded-xl border border-mint-500/40 shadow-card flex items-center gap-2.5 text-xs sm:text-sm animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-mint-300 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink-950">
            Savings Goals & Emergency Buffers
          </h1>
          <p className="text-xs sm:text-sm text-ink-600">
            Pledge cash cushions. Contributions reduce available cash as balance sheet transfers.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-mint-700 hover:bg-mint-800 text-white font-semibold text-xs sm:text-sm shadow-subtle transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Savings Goal
        </button>
      </div>

      {/* Total Savings Metrics Ribbon */}
      <div className="p-6 rounded-2xl bg-parchment-50 border border-parchment-300 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-mint-100 text-mint-800 flex items-center justify-center shrink-0">
            <PiggyBank className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-ink-500 font-medium">Total Reserved in Savings</span>
            <div className="text-2xl font-bold font-num text-ink-950">
              {formatCurrency(metrics.totalSavingsReserved)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToLab}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-parchment-200 hover:bg-parchment-300 text-xs font-semibold text-ink-800 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-amberGold-600" />
            Simulate Contribution in Lab
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Goals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(state.goals || []).map((goal) => {
          const target = Number(goal.targetAmount) || 1;
          const saved = Number(goal.savedAmount) || 0;
          const remaining = Math.max(0, target - saved);
          const percent = Math.min(100, Math.round((saved / target) * 100));
          const isComplete = saved >= target;

          // Feasibility evaluation under current plan
          const isFeasible = metrics.projectedDay30Balance >= remaining;

          return (
            <div
              key={goal.id}
              className="p-6 rounded-2xl bg-parchment-50 border border-parchment-300/90 shadow-subtle space-y-4 relative flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      goal.priority === 'High'
                        ? 'bg-terracotta-100 text-terracotta-800'
                        : goal.priority === 'Medium'
                        ? 'bg-amberGold-100 text-amberGold-800'
                        : 'bg-parchment-200 text-ink-700'
                    }`}>
                      {goal.priority || 'Medium'} Priority
                    </span>
                    <h3 className="font-serif font-bold text-lg text-ink-950 mt-1">
                      {goal.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(goal)}
                      className="p-1.5 rounded-lg text-ink-500 hover:text-ink-900 hover:bg-parchment-200 transition-colors"
                      title="Edit Goal"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="p-1.5 rounded-lg text-ink-500 hover:text-terracotta-600 hover:bg-terracotta-50 transition-colors"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress bar & Percent */}
                <div>
                  <div className="flex items-baseline justify-between text-xs mb-1.5">
                    <span className="font-num font-bold text-ink-900 text-sm">
                      {formatCurrency(saved)}
                    </span>
                    <span className="text-ink-500 font-num">
                      Goal: {formatCurrency(target)} ({percent}%)
                    </span>
                  </div>

                  <div className="w-full bg-parchment-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isComplete ? 'bg-mint-500' : 'bg-mint-700'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Feasibility Status */}
                <div className="p-3 rounded-xl bg-parchment-100 border border-parchment-200 text-xs flex items-center justify-between">
                  <span className="text-ink-600">Plan Feasibility:</span>
                  <span className={`font-semibold flex items-center gap-1 ${
                    isComplete
                      ? 'text-mint-700'
                      : isFeasible
                      ? 'text-mint-800'
                      : 'text-amberGold-700'
                  }`}>
                    {isComplete ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Goal Achieved!
                      </>
                    ) : isFeasible ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Fully Feasible
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5" /> Requires Additional Inflow
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Action: Transfer / Contribute */}
              <div className="pt-3 border-t border-parchment-200 flex items-center justify-between">
                <span className="text-xs text-ink-500">
                  {remaining > 0 ? `${formatCurrency(remaining)} to target` : '100% funded'}
                </span>

                <button
                  onClick={() => {
                    setContributeGoal(goal);
                    setContributeAmount(String(Math.min(remaining, 250) || 100));
                    setContributeError(null);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-mint-700 hover:bg-mint-800 text-white text-xs font-semibold shadow-subtle transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Transfer Funds
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Goal Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/60 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-labelledby="goal-modal-title"
        >
          <div className="w-full max-w-md bg-parchment-50 border border-parchment-300 rounded-2xl shadow-floating p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-parchment-200">
              <h3 id="goal-modal-title" className="text-lg font-serif font-bold text-ink-950">
                {editingGoal ? 'Edit Savings Goal' : 'Create New Savings Goal'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-ink-400 hover:text-ink-900 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                  Goal Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Emergency Health Cushion..."
                  className="w-full px-3 py-2 rounded-xl bg-parchment-100 border border-parchment-300 text-xs text-ink-900 focus:ring-2 focus:ring-mint-500"
                />
                {formErrors.name && (
                  <span className="text-[10px] text-terracotta-600 mt-1 block">{formErrors.name}</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                    Target (₹) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-parchment-100 border border-parchment-300 text-xs font-num text-ink-900 focus:ring-2 focus:ring-mint-500"
                  />
                  {formErrors.targetAmount && (
                    <span className="text-[10px] text-terracotta-600 mt-1 block">{formErrors.targetAmount}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                    Initial Saved (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.savedAmount}
                    onChange={(e) => setFormData({ ...formData, savedAmount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-parchment-100 border border-parchment-300 text-xs font-num text-ink-900 focus:ring-2 focus:ring-mint-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                    Deadline (Day 1-30)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={formData.deadlineDay}
                    onChange={(e) => setFormData({ ...formData, deadlineDay: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-parchment-100 border border-parchment-300 text-xs font-num text-ink-900 focus:ring-2 focus:ring-mint-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-parchment-100 border border-parchment-300 text-xs text-ink-900 focus:ring-2 focus:ring-mint-500"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-parchment-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-ink-600 hover:text-ink-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-mint-700 hover:bg-mint-800 rounded-xl shadow-subtle"
                >
                  {editingGoal ? 'Save Goal' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Funds Modal */}
      {contributeGoal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/60 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-labelledby="transfer-modal-title"
        >
          <div className="w-full max-w-sm bg-parchment-50 border border-parchment-300 rounded-2xl shadow-floating p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-parchment-200">
              <h3 id="transfer-modal-title" className="text-base font-serif font-bold text-ink-950">
                Transfer to {contributeGoal.name}
              </h3>
              <button
                onClick={() => setContributeGoal(null)}
                className="text-ink-400 hover:text-ink-900 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {contributeError && (
              <div className="p-3 bg-terracotta-50 border border-terracotta-200 rounded-xl text-xs text-terracotta-700">
                {contributeError}
              </div>
            )}

            <form onSubmit={handleContributeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                  Transfer Amount (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  max={metrics.availableCash}
                  value={contributeAmount}
                  onChange={(e) => setContributeAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-parchment-100 border border-parchment-300 text-sm font-num text-ink-900 focus:ring-2 focus:ring-mint-500"
                />
                <span className="text-[10px] text-ink-500 mt-1 block">
                  Available to transfer: {formatCurrency(metrics.availableCash)}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-parchment-200">
                <button
                  type="button"
                  onClick={() => setContributeGoal(null)}
                  className="px-3.5 py-1.5 text-xs text-ink-600 hover:text-ink-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-mint-700 hover:bg-mint-800 rounded-xl shadow-subtle"
                >
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
