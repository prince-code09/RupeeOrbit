import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  Calendar,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext.jsx';
import { CATEGORIES } from '../engine/financialEngine.js';
import { formatCurrency } from '../utils/formatters.js';

export default function Transactions() {
  const { state, metrics, addTransaction, updateTransaction, deleteTransaction } = useFinancial();

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL'); // 'ALL' | 'expense' | 'income'
  const [sortBy, setSortBy] = useState('day-desc'); // 'day-desc' | 'day-asc' | 'amt-desc' | 'amt-asc'

  // Modal / Form state for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: 'Food & Groceries',
    day: state.currentDay,
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const openAddModal = () => {
    setEditingTx(null);
    setFormData({
      description: '',
      amount: '',
      type: 'expense',
      category: 'Food & Groceries',
      day: state.currentDay,
      notes: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (tx) => {
    setEditingTx(tx);
    setFormData({
      description: tx.description,
      amount: String(tx.amount),
      type: tx.type,
      category: tx.category,
      day: tx.day,
      notes: tx.notes || '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validate = () => {
    const errors = {};
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    const amt = Number(formData.amount);
    if (isNaN(amt) || amt <= 0) {
      errors.amount = 'Amount must be greater than 0';
    }
    const day = Number(formData.day);
    if (isNaN(day) || day < 1 || day > 30) {
      errors.day = 'Day must be between 1 and 30';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveTransaction = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingTx) {
      updateTransaction({
        ...editingTx,
        description: formData.description.trim(),
        amount: Number(formData.amount),
        type: formData.type,
        category: formData.category,
        day: Number(formData.day),
        notes: formData.notes.trim(),
      });
    } else {
      addTransaction(formData);
    }
    setIsModalOpen(false);
  };

  // Filter & Sort Logic
  const filteredTransactions = (state.transactions || []).filter((tx) => {
    const matchesSearch =
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.notes && tx.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'ALL' || tx.category === selectedCategory;
    const matchesType = selectedType === 'ALL' || tx.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  filteredTransactions.sort((a, b) => {
    if (sortBy === 'day-desc') return b.day - a.day;
    if (sortBy === 'day-asc') return a.day - b.day;
    if (sortBy === 'amt-desc') return b.amount - a.amount;
    if (sortBy === 'amt-asc') return a.amount - b.amount;
    return 0;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink-950">
            Transaction Ledger
          </h1>
          <p className="text-xs sm:text-sm text-ink-600">
            Recorded inflows and outflows. Updates safe daily allowance in real time.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-mint-700 hover:bg-mint-800 text-white font-semibold text-xs sm:text-sm shadow-subtle transition-all"
        >
          <Plus className="w-4 h-4" />
          Log Transaction
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-parchment-50 border border-parchment-300 shadow-subtle space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Search Input */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-ink-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search description or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-parchment-100 border border-parchment-300 text-xs text-ink-900 focus:ring-2 focus:ring-mint-500"
            />
          </div>

          {/* Type Filter */}
          <div className="sm:col-span-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-parchment-100 border border-parchment-300 text-xs text-ink-900 focus:ring-2 focus:ring-mint-500"
            >
              <option value="ALL">All Types</option>
              <option value="expense">Expenses Only</option>
              <option value="income">Income Only</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-parchment-100 border border-parchment-300 text-xs text-ink-900 focus:ring-2 focus:ring-mint-500"
            >
              <option value="ALL">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="sm:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-parchment-100 border border-parchment-300 text-xs text-ink-900 focus:ring-2 focus:ring-mint-500"
            >
              <option value="day-desc">Day (Newest)</option>
              <option value="day-asc">Day (Oldest)</option>
              <option value="amt-desc">Amount (High &rarr; Low)</option>
              <option value="amt-asc">Amount (Low &rarr; High)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="rounded-2xl bg-parchment-50 border border-parchment-300 shadow-subtle overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Receipt className="w-10 h-10 text-ink-400 mx-auto" />
            <h3 className="font-serif font-bold text-base text-ink-800">
              No transactions match your criteria
            </h3>
            <p className="text-xs text-ink-500 max-w-sm mx-auto">
              Try adjusting your search query, type or category filter, or log a new transaction.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-parchment-200">
            {filteredTransactions.map((tx) => {
              const isIncome = tx.type === 'income';
              return (
                <div
                  key={tx.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-parchment-100/70 transition-colors"
                >
                  {/* Left: Icon, Description, Category, Notes */}
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isIncome
                          ? 'bg-mint-100 text-mint-800 border border-mint-300'
                          : 'bg-parchment-200 text-terracotta-700 border border-parchment-300'
                      }`}
                    >
                      {isIncome ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm text-ink-950">{tx.description}</h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-parchment-200 text-ink-700">
                          Day {tx.day}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-ink-500">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3 text-ink-400" />
                          {tx.category}
                        </span>
                        {tx.notes && (
                          <>
                            <span>&bull;</span>
                            <span className="italic text-ink-600 line-clamp-1">{tx.notes}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-parchment-200">
                    <span
                      className={`text-base font-bold font-num ${
                        isIncome ? 'text-mint-700' : 'text-ink-950'
                      }`}
                    >
                      {isIncome ? `+${formatCurrency(tx.amount)}` : `-${formatCurrency(tx.amount)}`}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(tx)}
                        aria-label={`Edit ${tx.description}`}
                        className="p-1.5 rounded-lg text-ink-500 hover:text-ink-950 hover:bg-parchment-200 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        aria-label={`Delete ${tx.description}`}
                        className="p-1.5 rounded-lg text-ink-500 hover:text-terracotta-600 hover:bg-terracotta-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Transaction Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/60 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tx-modal-title"
        >
          <div className="w-full max-w-md bg-parchment-50 border border-parchment-300 rounded-2xl shadow-floating p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-parchment-200">
              <h3 id="tx-modal-title" className="text-lg font-serif font-bold text-ink-950">
                {editingTx ? 'Edit Transaction' : 'Record New Transaction'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-ink-400 hover:text-ink-900 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="space-y-4">
              {/* Type Switcher */}
              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                  Flow Type *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      formData.type === 'expense'
                        ? 'bg-terracotta-100 border-terracotta-400 text-terracotta-800'
                        : 'bg-parchment-100 border-parchment-300 text-ink-600'
                    }`}
                  >
                    Expense Outflow
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'income' })}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      formData.type === 'income'
                        ? 'bg-mint-100 border-mint-400 text-mint-800'
                        : 'bg-parchment-100 border-parchment-300 text-ink-600'
                    }`}
                  >
                    Income Inflow
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                  Description *
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Lunch thali, Pharmacy medicine..."
                  className={`w-full px-3 py-2 rounded-xl bg-parchment-100 border text-xs text-ink-900 focus:ring-2 focus:ring-mint-500 ${
                    formErrors.description ? 'border-terracotta-400' : 'border-parchment-300'
                  }`}
                />
                {formErrors.description && (
                  <span className="text-[10px] text-terracotta-600 mt-1 block">{formErrors.description}</span>
                )}
              </div>

              {/* Amount & Day */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl bg-parchment-100 border text-xs font-num text-ink-900 focus:ring-2 focus:ring-mint-500 ${
                      formErrors.amount ? 'border-terracotta-400' : 'border-parchment-300'
                    }`}
                  />
                  {formErrors.amount && (
                    <span className="text-[10px] text-terracotta-600 mt-1 block">{formErrors.amount}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                    Day (1-30) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl bg-parchment-100 border text-xs font-num text-ink-900 focus:ring-2 focus:ring-mint-500 ${
                      formErrors.day ? 'border-terracotta-400' : 'border-parchment-300'
                    }`}
                  />
                  {formErrors.day && (
                    <span className="text-[10px] text-terracotta-600 mt-1 block">{formErrors.day}</span>
                  )}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-parchment-100 border border-parchment-300 text-xs text-ink-900 focus:ring-2 focus:ring-mint-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Optional context"
                  className="w-full px-3 py-2 rounded-xl bg-parchment-100 border border-parchment-300 text-xs text-ink-900 focus:ring-2 focus:ring-mint-500"
                />
              </div>

              {/* Actions */}
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
                  {editingTx ? 'Save Changes' : 'Record Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
