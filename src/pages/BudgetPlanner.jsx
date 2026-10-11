import React, { useState } from 'react';
import {
  PieChart,
  Calendar,
  Plus,
  Play,
  Pause,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Check,
  X,
  CreditCard,
  DollarSign,
  Info,
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext.jsx';
import { CATEGORIES } from '../engine/financialEngine.js';
import { formatCurrency, formatPercentage } from '../utils/formatters.js';

export default function BudgetPlanner() {
  const {
    state,
    metrics,
    addCommitment,
    updateCommitment,
    deleteCommitment,
    toggleCommitment,
    payCommitment,
    updateBudgetLimit,
  } = useFinancial();

  // Modal State for Recurring Commitment
  const [isCommModalOpen, setIsCommModalOpen] = useState(false);
  const [editingComm, setEditingComm] = useState(null);
  const [commForm, setCommForm] = useState({
    name: '',
    amount: '',
    frequency: 'monthly',
    day: 15,
    category: 'Subscriptions & Bills',
    active: true,
  });
  const [commErrors, setCommErrors] = useState({});

  // Editing Category Budget Inline
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryLimitInput, setCategoryLimitInput] = useState('');

  const openAddCommModal = () => {
    setEditingComm(null);
    setCommForm({
      name: '',
      amount: '',
      frequency: 'monthly',
      day: Math.min(28, state.currentDay + 3),
      category: 'Subscriptions & Bills',
      active: true,
    });
    setCommErrors({});
    setIsCommModalOpen(true);
  };

  const openEditCommModal = (c) => {
    setEditingComm(c);
    setCommForm({
      name: c.name,
      amount: String(c.amount),
      frequency: c.frequency,
      day: c.day,
      category: c.category,
      active: c.active,
    });
    setCommErrors({});
    setIsCommModalOpen(true);
  };

  const validateComm = () => {
    const errors = {};
    if (!commForm.name.trim()) errors.name = 'Commitment name is required';
    const amt = Number(commForm.amount);
    if (isNaN(amt) || amt <= 0) errors.amount = 'Amount must be greater than 0';
    const day = Number(commForm.day);
    if (isNaN(day) || day < 1 || day > 30) errors.day = 'Day must be between 1 and 30';
    setCommErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveComm = (e) => {
    e.preventDefault();
    if (!validateComm()) return;

    if (editingComm) {
      updateCommitment({
        ...editingComm,
        name: commForm.name.trim(),
        amount: Number(commForm.amount),
        frequency: commForm.frequency,
        day: Number(commForm.day),
        category: commForm.category,
        active: commForm.active,
      });
    } else {
      addCommitment(commForm);
    }
    setIsCommModalOpen(false);
  };

  const handleSaveCategoryLimit = (cat) => {
    const amt = Number(categoryLimitInput);
    if (!isNaN(amt) && amt >= 0) {
      updateBudgetLimit(cat, amt);
    }
    setEditingCategory(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink-950">
            Budget Planner & Commitments
          </h1>
          <p className="text-xs sm:text-sm text-ink-600">
            Control category spending allowances and schedule recurring fixed bills.
          </p>
        </div>

        <button
          onClick={openAddCommModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Recurring Commitment
        </button>
      </div>

      {/* SECTION 1: CATEGORY BUDGET LIMITS & ACTUALS */}
      <section className="p-6 sm:p-7 rounded-3xl bg-[#16243A] border border-[#243B5E] shadow-card relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-1.5 before:bg-gradient-to-r before:from-teal-400 via-cyan-400 to-blue-500 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif font-bold text-ink-950">
              Category Budgets vs Actual Spend
            </h2>
            <p className="text-xs text-ink-500">
              Set spending ceilings. Overspending reduces financial health score.
            </p>
          </div>
          <span className="text-xs font-mono text-ink-500">
            {CATEGORIES.length} Categories
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.categorySummary.map((item) => {
            const isEditing = editingCategory === item.category;
            return (
              <div
                key={item.category}
                className="p-4 rounded-xl bg-parchment-100/90 border border-parchment-200/80 space-y-2.5 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-ink-900 truncate pr-2">
                      {item.category}
                    </span>
                    {item.isOverBudget && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-terracotta-100 text-terracotta-700 font-mono font-bold shrink-0">
                        Over!
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex items-baseline justify-between text-xs">
                    <span className="text-ink-500">
                      Spent: <strong className="text-ink-950 font-num">{formatCurrency(item.spent)}</strong>
                    </span>
                    <span className="text-ink-500 font-num">
                      of {formatCurrency(item.allocated)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-parchment-300 h-2 rounded-full overflow-hidden mt-1.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.isOverBudget
                          ? 'bg-terracotta-600'
                          : item.percentUsed > 80
                          ? 'bg-amberGold-500'
                          : 'bg-mint-600'
                      }`}
                      style={{ width: `${Math.min(100, item.percentUsed)}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-parchment-200/70 flex items-center justify-between text-[11px]">
                  <span className={item.remaining < 0 ? 'text-terracotta-600 font-semibold font-num' : 'text-mint-800 font-num'}>
                    {item.remaining < 0 ? `-${formatCurrency(Math.abs(item.remaining))} over` : `${formatCurrency(item.remaining)} left`}
                  </span>

                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={categoryLimitInput}
                        onChange={(e) => setCategoryLimitInput(e.target.value)}
                        className="w-16 px-1.5 py-0.5 rounded bg-parchment-50 border border-mint-500 text-xs font-num"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveCategoryLimit(item.category)}
                        className="p-1 rounded bg-mint-700 text-white"
                        title="Save limit"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingCategory(item.category);
                        setCategoryLimitInput(String(item.allocated));
                      }}
                      className="text-ink-500 hover:text-ink-900 underline text-[10px]"
                    >
                      Edit Limit
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: RECURRING COMMITMENTS & SUBSCRIPTIONS */}
      <section className="p-6 sm:p-7 rounded-3xl bg-[#16243A] border border-[#243B5E] shadow-card relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-1.5 before:bg-gradient-to-r before:from-cyan-400 via-teal-400 to-blue-500 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-serif font-bold text-ink-950">
              Recurring Bills & Subscriptions
            </h2>
            <p className="text-xs text-ink-500 font-medium">
              Future scheduled bills appear in forecast and are reserved, but never double-counted when paid.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 shadow-xs">
              {formatCurrency(metrics.outstandingCommitments)} Unpaid Future Commitments
            </span>
          </div>
        </div>

        {/* Commitment Items Table/List */}
        <div className="divide-y divide-parchment-200 border border-parchment-200 rounded-2xl overflow-hidden bg-parchment-50/70">
          {(state.commitments || []).map((comm) => {
            const isDueTodayOrPast = comm.day <= state.currentDay;
            const isPaid = (comm.paidOccurrences || []).includes(comm.day);

            return (
              <div
                key={comm.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-parchment-100 transition-colors"
              >
                {/* Left: Info */}
                <div className="flex items-start sm:items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold font-mono text-xs ${
                      !comm.active
                        ? 'bg-parchment-200 text-ink-400'
                        : isPaid
                        ? 'bg-mint-100 text-mint-800'
                        : 'bg-amberGold-100 text-amberGold-800'
                    }`}
                  >
                    D{comm.day}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm text-ink-950">{comm.name}</h3>
                      <span className={`text-[10px] font-mono px-2 py-0.2 rounded font-bold uppercase ${
                        comm.active ? 'bg-mint-100 text-mint-800' : 'bg-parchment-300 text-ink-500'
                      }`}>
                        {comm.active ? 'Active' : 'Paused'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-ink-500 mt-0.5">
                      <span>{comm.category}</span>
                      <span>&bull;</span>
                      <span className="capitalize">{comm.frequency} cycle</span>
                      <span>&bull;</span>
                      <span className={isPaid ? 'text-mint-700 font-semibold' : 'text-amberGold-700 font-medium'}>
                        {isPaid
                          ? 'Paid this cycle'
                          : comm.day < state.currentDay
                          ? 'Cycle overdue'
                          : `Due on Day ${comm.day}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-parchment-200">
                  <span className="font-num font-bold text-base text-ink-950">
                    {formatCurrency(comm.amount)}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* Pay button (if active and not yet paid for its due day) */}
                    {comm.active && !isPaid && (
                      <button
                        onClick={() => payCommitment(comm.id, comm.day)}
                        className="px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1 shadow-xs hover:shadow transition-all active:scale-95"
                        title="Mark bill paid and record transaction"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Pay
                      </button>
                    )}

                    {/* Pause / Resume Button */}
                    <button
                      onClick={() => toggleCommitment(comm.id)}
                      className="p-1.5 rounded-lg text-ink-600 hover:text-ink-950 hover:bg-parchment-200 transition-colors"
                      title={comm.active ? 'Pause recurring commitment' : 'Resume commitment'}
                    >
                      {comm.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => openEditCommModal(comm)}
                      className="p-1.5 rounded-lg text-ink-600 hover:text-ink-950 hover:bg-parchment-200 transition-colors"
                      title="Edit commitment"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => deleteCommitment(comm.id)}
                      className="p-1.5 rounded-lg text-ink-500 hover:text-terracotta-600 hover:bg-terracotta-50 transition-colors"
                      title="Delete commitment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Add / Edit Recurring Commitment Modal */}
      {isCommModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/60 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-labelledby="comm-modal-title"
        >
          <div className="w-full max-w-md bg-parchment-50 border border-parchment-300 rounded-2xl shadow-floating p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-parchment-200">
              <h3 id="comm-modal-title" className="text-lg font-serif font-bold text-ink-950">
                {editingComm ? 'Edit Recurring Commitment' : 'Add Recurring Commitment'}
              </h3>
              <button
                onClick={() => setIsCommModalOpen(false)}
                className="text-ink-400 hover:text-ink-900 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveComm} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                  Commitment Name *
                </label>
                <input
                  type="text"
                  value={commForm.name}
                  onChange={(e) => setCommForm({ ...commForm, name: e.target.value })}
                  placeholder="e.g. PG Rent, Broadband, Netflix..."
                  className="w-full px-3 py-2 rounded-xl bg-parchment-100 border border-parchment-300 text-xs text-ink-900 focus:ring-2 focus:ring-mint-500"
                />
                {commErrors.name && (
                  <span className="text-[10px] text-terracotta-600 mt-1 block">{commErrors.name}</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={commForm.amount}
                    onChange={(e) => setCommForm({ ...commForm, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-parchment-100 border border-parchment-300 text-xs font-num text-ink-900 focus:ring-2 focus:ring-mint-500"
                  />
                  {commErrors.amount && (
                    <span className="text-[10px] text-terracotta-600 mt-1 block">{commErrors.amount}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                    Due Day of Month (1-30) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={commForm.day}
                    onChange={(e) => setCommForm({ ...commForm, day: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-parchment-100 border border-parchment-300 text-xs font-num text-ink-900 focus:ring-2 focus:ring-mint-500"
                  />
                  {commErrors.day && (
                    <span className="text-[10px] text-terracotta-600 mt-1 block">{commErrors.day}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                    Frequency
                  </label>
                  <select
                    value={commForm.frequency}
                    onChange={(e) => setCommForm({ ...commForm, frequency: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-parchment-100 border border-parchment-300 text-xs text-ink-900 focus:ring-2 focus:ring-mint-500"
                  >
                    <option value="monthly">Monthly Cycle</option>
                    <option value="weekly">Weekly Recurring</option>
                    <option value="one-time">One-time Scheduled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                    Category
                  </label>
                  <select
                    value={commForm.category}
                    onChange={(e) => setCommForm({ ...commForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-parchment-100 border border-parchment-300 text-xs text-ink-900 focus:ring-2 focus:ring-mint-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-parchment-200">
                <button
                  type="button"
                  onClick={() => setIsCommModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-ink-600 hover:text-ink-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-mint-700 hover:bg-mint-800 rounded-xl shadow-subtle"
                >
                  {editingComm ? 'Save Changes' : 'Add Commitment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
