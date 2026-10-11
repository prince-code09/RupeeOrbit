import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_DEMO_STATE, STORAGE_KEY, LEGACY_STORAGE_KEY } from '../data/seedData.js';
import {
  calculateFinancialMetrics,
  simulateScenario,
  commitScenario,
  payCommitmentOccurrence,
  toggleCommitmentStatus,
} from '../engine/financialEngine.js';

const FinancialContext = createContext(null);

export function FinancialProvider({ children }) {
  // Load state from localStorage or initialize with seed data
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Robust schema validation of stored structure
        if (
          parsed &&
          typeof parsed === 'object' &&
          Number.isFinite(parsed.initialBudget) &&
          parsed.initialBudget > 0 &&
          Array.isArray(parsed.transactions) &&
          Array.isArray(parsed.commitments) &&
          Array.isArray(parsed.goals)
        ) {
          // Sanitize currentDay
          const currentDay = Math.max(1, Math.min(30, Number(parsed.currentDay) || 4));
          // Sanitize transactions
          const validTransactions = parsed.transactions.filter(
            t => t && typeof t === 'object' && Number.isFinite(t.amount) && t.amount > 0 && t.description
          );
          return {
            ...INITIAL_DEMO_STATE,
            ...parsed,
            currentDay,
            transactions: validTransactions,
          };
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved RupeeOrbit state, reverting to seed data.', e);
    }
    return INITIAL_DEMO_STATE;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save RupeeOrbit state to localStorage:', e);
    }
  }, [state]);

  // Derived financial metrics from engine (single source of truth)
  const metrics = calculateFinancialMetrics(state);

  // Actions
  const setCurrentDay = (day) => {
    const validDay = Math.max(1, Math.min(30, Number(day)));
    setState((prev) => ({ ...prev, currentDay: validDay }));
  };

  const addTransaction = (transactionData) => {
    const newTx = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      description: transactionData.description.trim(),
      amount: Number(transactionData.amount),
      type: transactionData.type || 'expense',
      category: transactionData.category || 'Personal & Misc',
      day: Number(transactionData.day || state.currentDay),
      date: transactionData.date || `2026-10-${String(transactionData.day || state.currentDay).padStart(2, '0')}`,
      notes: transactionData.notes ? transactionData.notes.trim() : '',
    };

    setState((prev) => ({
      ...prev,
      transactions: [newTx, ...prev.transactions],
    }));
    return newTx;
  };

  const updateTransaction = (updatedTx) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.map((t) => (t.id === updatedTx.id ? { ...t, ...updatedTx } : t)),
    }));
  };

  const deleteTransaction = (id) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));
  };

  const addCommitment = (commitmentData) => {
    const newComm = {
      id: `comm-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: commitmentData.name.trim(),
      amount: Number(commitmentData.amount),
      frequency: commitmentData.frequency || 'monthly',
      day: Number(commitmentData.day || 1),
      category: commitmentData.category || 'Subscriptions & Bills',
      active: commitmentData.active !== undefined ? commitmentData.active : true,
      paidOccurrences: [],
    };

    setState((prev) => ({
      ...prev,
      commitments: [...prev.commitments, newComm],
    }));
    return newComm;
  };

  const updateCommitment = (updatedComm) => {
    setState((prev) => ({
      ...prev,
      commitments: prev.commitments.map((c) => (c.id === updatedComm.id ? { ...c, ...updatedComm } : c)),
    }));
  };

  const deleteCommitment = (id) => {
    setState((prev) => ({
      ...prev,
      commitments: prev.commitments.filter((c) => c.id !== id),
    }));
  };

  const toggleCommitment = (id) => {
    setState((prev) => toggleCommitmentStatus(prev, id));
  };

  const payCommitment = (commitmentId, dueDay) => {
    setState((prev) => payCommitmentOccurrence(prev, commitmentId, dueDay));
  };

  const addGoal = (goalData) => {
    const newGoal = {
      id: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: goalData.name.trim(),
      targetAmount: Number(goalData.targetAmount),
      savedAmount: Number(goalData.savedAmount || 0),
      deadlineDay: Number(goalData.deadlineDay || 30),
      priority: goalData.priority || 'Medium',
    };

    setState((prev) => ({
      ...prev,
      goals: [...prev.goals, newGoal],
    }));
    return newGoal;
  };

  const updateGoal = (updatedGoal) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => (g.id === updatedGoal.id ? { ...g, ...updatedGoal } : g)),
    }));
  };

  const deleteGoal = (id) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== id),
    }));
  };

  const contributeToGoal = (goalId, amount) => {
    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0) return false;

    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => {
        if (g.id === goalId) {
          return {
            ...g,
            savedAmount: (g.savedAmount || 0) + amt,
          };
        }
        return g;
      }),
    }));
    return true;
  };

  const updateBudgetLimit = (category, amount) => {
    setState((prev) => ({
      ...prev,
      budgetLimits: {
        ...prev.budgetLimits,
        [category]: Math.max(0, Number(amount)),
      },
    }));
  };

  const commitDecision = (scenario) => {
    setState((prev) => commitScenario(prev, scenario));
  };

  const resetToDemo = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      localStorage.removeItem('rupeeorbit_guide_seen');
      localStorage.removeItem('ledgerly_intro_seen');
    } catch (_) {}
    setState(INITIAL_DEMO_STATE);
  };

  const value = {
    state,
    metrics,
    setCurrentDay,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCommitment,
    updateCommitment,
    deleteCommitment,
    toggleCommitment,
    payCommitment,
    addGoal,
    updateGoal,
    deleteGoal,
    contributeToGoal,
    updateBudgetLimit,
    commitDecision,
    resetToDemo,
    // Simulation function exposed to Decision Lab
    runSimulation: (scenario) => simulateScenario(state, scenario),
  };

  return <FinancialContext.Provider value={value}>{children}</FinancialContext.Provider>;
}

export function useFinancial() {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
}
