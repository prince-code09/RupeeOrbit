import { describe, it, expect } from 'vitest';
import {
  calculateFinancialMetrics,
  simulateScenario,
  commitScenario,
  payCommitmentOccurrence,
  toggleCommitmentStatus,
  getCommitmentDueDays,
} from '../engine/financialEngine.js';
import { INITIAL_DEMO_STATE } from '../data/seedData.js';

describe('RupeeOrbit Financial Engine - Core Calculations & Survival Rules', () => {
  // Test 1: Initial ₹10,000 demo state
  it('1. calculates initial ₹10,000 demo baseline correctly', () => {
    const metrics = calculateFinancialMetrics(INITIAL_DEMO_STATE);

    expect(metrics.initialBudget).toBe(10000);
    expect(metrics.currentDay).toBe(4);
    expect(metrics.remainingDays).toBe(27); // 30 - 4 + 1

    // Seed transactions spent: 620 + 300 + 180 + 240 = 1340
    expect(metrics.actualExpenses).toBe(1340);
    expect(metrics.totalIncome).toBe(0);

    // Seed savings: 800 + 400 = 1200
    expect(metrics.totalSavingsReserved).toBe(1200);

    // Available cash = 10000 + 0 - 1340 - 1200 = 7460
    expect(metrics.availableCash).toBe(7460);

    // Active unpaid commitments from Day 4 to 30:
    // Rent: 3500 (D10)
    // Wifi: 350 (D14)
    // Phone: 299 (D18)
    // Spotify: 59 (D22)
    // Total commitments = 3500 + 350 + 299 + 59 = 4208
    expect(metrics.outstandingCommitments).toBe(4208);

    // True uncommitted cash = 7460 - 4208 = 3252
    expect(metrics.trueUncommittedCash).toBe(3252);
    expect(metrics.projectedDay30Balance).toBe(3252);

    // Safe daily allowance = 3252 / 27 days = ~120.44
    expect(metrics.safeDailyAllowance).toBeCloseTo(120.44, 1);
  });

  // Test 2: Adding income and expenses
  it('2. adds income and expenses correctly and updates liquid balances', () => {
    const baseState = {
      initialBudget: 10000,
      currentDay: 1,
      transactions: [
        { id: '1', amount: 500, type: 'income', day: 1 },
        { id: '2', amount: 1500, type: 'expense', day: 1 },
      ],
      commitments: [],
      goals: [],
    };
    const metrics = calculateFinancialMetrics(baseState);

    expect(metrics.totalIncome).toBe(500);
    expect(metrics.actualExpenses).toBe(1500);
    expect(metrics.availableCash).toBe(9000); // 10000 + 500 - 1500
    expect(metrics.safeDailyAllowance).toBeCloseTo(9000 / 30, 2); // 300/day
  });

  // Test 3: Future commitment calculations
  it('3. calculates upcoming future commitments accurately without double-counting', () => {
    const state = {
      initialBudget: 10000,
      currentDay: 15,
      transactions: [],
      commitments: [
        { id: 'c1', name: 'Past Bill', amount: 500, frequency: 'monthly', day: 10, active: true, paidOccurrences: [] },
        { id: 'c2', name: 'Future Bill 1', amount: 1200, frequency: 'monthly', day: 20, active: true, paidOccurrences: [] },
        { id: 'c3', name: 'Future Bill 2', amount: 300, frequency: 'monthly', day: 25, active: true, paidOccurrences: [] },
        { id: 'c4', name: 'Paused Bill', amount: 999, frequency: 'monthly', day: 22, active: false, paidOccurrences: [] },
      ],
      goals: [],
    };

    const metrics = calculateFinancialMetrics(state);
    // On Day 15, Past Bill (D10) is past due window for remaining days (15..30)
    // Paused Bill (c4) is inactive so not counted
    // Outstanding = Future Bill 1 (1200) + Future Bill 2 (300) = 1500
    expect(metrics.outstandingCommitments).toBe(1500);
    expect(metrics.upcomingBills.length).toBe(2);
  });

  // Test 4: Recurring payment scheduling
  it('4. schedules weekly commitments occurring multiple times in 30 days', () => {
    const weeklyComm = {
      id: 'w1',
      name: 'Weekly Meal Plan',
      amount: 400,
      frequency: 'weekly',
      day: 5,
    };
    const dueDays = getCommitmentDueDays(weeklyComm, 1, 30);
    // Day 5, 12, 19, 26
    expect(dueDays).toEqual([5, 12, 19, 26]);
  });

  // Test 5: Preventing duplicate payments
  it('5. prevents double-counting when paying a commitment occurrence', () => {
    const baseState = {
      initialBudget: 10000,
      currentDay: 5,
      transactions: [],
      commitments: [
        { id: 'c-rent', name: 'Rent', amount: 3000, frequency: 'monthly', day: 10, active: true, paidOccurrences: [] },
      ],
      goals: [],
    };

    // Before payment: Rent is in outstanding commitments
    const beforeMetrics = calculateFinancialMetrics(baseState);
    expect(beforeMetrics.availableCash).toBe(10000);
    expect(beforeMetrics.outstandingCommitments).toBe(3000);
    expect(beforeMetrics.projectedDay30Balance).toBe(7000);

    // Pay rent for Day 10
    const stateAfterPay = payCommitmentOccurrence(baseState, 'c-rent', 10);

    const afterMetrics = calculateFinancialMetrics(stateAfterPay);
    // Rent is now in transactions as actual expense (-3000)
    expect(afterMetrics.actualExpenses).toBe(3000);
    expect(afterMetrics.availableCash).toBe(7000);
    // And Rent is marked paid in paidOccurrences, so outstanding commitments is now 0!
    expect(afterMetrics.outstandingCommitments).toBe(0);
    // Projected Day 30 balance is STILL 7000 (NOT 4000 double-counted!)
    expect(afterMetrics.projectedDay30Balance).toBe(7000);

    // Attempting to pay same occurrence again should NOT duplicate
    const stateDoublePay = payCommitmentOccurrence(stateAfterPay, 'c-rent', 10);
    expect(stateDoublePay.transactions.length).toBe(1);
    expect(stateDoublePay.commitments[0].paidOccurrences.length).toBe(1);
  });

  // Test 6: Savings transfers and goal progress
  it('6. treats savings contributions as transfers, not consumption expenses', () => {
    const baseState = {
      initialBudget: 10000,
      currentDay: 1,
      transactions: [],
      commitments: [],
      goals: [{ id: 'g1', name: 'Emergency', targetAmount: 2000, savedAmount: 500, deadlineDay: 30 }],
    };

    const metrics = calculateFinancialMetrics(baseState);
    expect(metrics.totalSavingsReserved).toBe(500);
    expect(metrics.actualExpenses).toBe(0); // NOT an expense!
    expect(metrics.availableCash).toBe(9500); // 10000 - 500
  });

  // Test 7: Simulation not mutating actual state
  it('7. strictly isolates scenario simulation without mutating original state', () => {
    const originalState = JSON.parse(JSON.stringify(INITIAL_DEMO_STATE));

    const simResult = simulateScenario(INITIAL_DEMO_STATE, {
      name: 'Luxury Dinner',
      amount: 4000,
      type: 'purchase',
      day: 5,
    });

    // Original state remains 100% identical
    expect(INITIAL_DEMO_STATE.transactions.length).toBe(originalState.transactions.length);
    expect(INITIAL_DEMO_STATE.commitments.length).toBe(originalState.commitments.length);

    // Simulated result correctly shows impact
    expect(simResult.afterMetrics.availableCash).toBe(simResult.beforeMetrics.availableCash - 4000);
    expect(simResult.deltas.availableCash).toBe(-4000);
  });

  // Test 8: Commit applying a decision exactly once
  it('8. applies committed decision permanently to state exactly once', () => {
    const baseState = {
      initialBudget: 10000,
      currentDay: 4,
      transactions: [],
      commitments: [],
      goals: [],
    };

    const scenario = {
      name: 'New Netflix Subscription',
      amount: 199,
      type: 'subscription',
      category: 'Subscriptions & Bills',
      day: 15,
      frequency: 'monthly',
    };

    const committedState = commitScenario(baseState, scenario);
    expect(committedState.commitments.length).toBe(1);
    expect(committedState.commitments[0].name).toBe('New Netflix Subscription');
    expect(committedState.commitments[0].amount).toBe(199);

    const metrics = calculateFinancialMetrics(committedState);
    expect(metrics.outstandingCommitments).toBe(199);
  });

  // Test 9: Discard leaving the actual state unchanged
  it('9. ensures discarded scenario leaves base state completely untouched', () => {
    const baseState = { ...INITIAL_DEMO_STATE };
    const sim = simulateScenario(baseState, {
      name: 'Unused Test Decision',
      amount: 9999,
      type: 'expense',
      day: 10,
    });
    expect(sim).toBeDefined();
    // Do not call commit; verify baseState is unchanged
    const metrics = calculateFinancialMetrics(baseState);
    expect(metrics.initialBudget).toBe(10000);
    expect(baseState.transactions.length).toBe(INITIAL_DEMO_STATE.transactions.length);
  });

  // Test 10: Unexpected expense impact & Required Presets
  it('10. calculates required demo scenarios: ₹999 subscription and ₹2,000 emergency expense', () => {
    // Required Demo 1: ₹999 monthly subscription
    const subResult = simulateScenario(INITIAL_DEMO_STATE, {
      name: 'Streaming Service',
      amount: 999,
      type: 'subscription',
      category: 'Subscriptions & Bills',
      day: 10,
      frequency: 'monthly',
    });

    expect(subResult.deltas.outstandingCommitments).toBe(999);
    expect(subResult.deltas.projectedDay30Balance).toBe(-999);
    expect(subResult.afterMetrics.safeDailyAllowance).toBeLessThan(subResult.beforeMetrics.safeDailyAllowance);

    // Required Demo 2: ₹2,000 unexpected expense
    const emergencyResult = simulateScenario(INITIAL_DEMO_STATE, {
      name: 'Emergency Medical',
      amount: 2000,
      type: 'unexpected_expense',
      category: 'Health & Medical',
      day: 4,
    });

    expect(emergencyResult.deltas.availableCash).toBe(-2000);
    expect(emergencyResult.deltas.projectedDay30Balance).toBe(-2000);
    expect(emergencyResult.afterMetrics.riskScore).toBeGreaterThan(emergencyResult.beforeMetrics.riskScore);
  });

  // Test 11: Negative forecast warnings & Unsustainable verdict
  it('11. flags unsustainable decisions with negative Day-30 balance and high risk score', () => {
    const catastrophicResult = simulateScenario(INITIAL_DEMO_STATE, {
      name: 'Impulse Expensive Gadget',
      amount: 9000,
      type: 'purchase',
      day: 4,
    });

    expect(catastrophicResult.afterMetrics.projectedDay30Balance).toBeLessThan(0);
    expect(catastrophicResult.verdict).toBe('UNSUSTAINABLE');
    expect(catastrophicResult.afterMetrics.riskScore).toBeGreaterThanOrEqual(60);
  });

  // Test 12: Invalid input rejection
  it('12. rejects invalid amounts, empty names, and malformed inputs', () => {
    expect(() => simulateScenario(INITIAL_DEMO_STATE, null)).toThrow();
    expect(() => simulateScenario(INITIAL_DEMO_STATE, { name: '', amount: 500, type: 'purchase' })).toThrow();
    expect(() => simulateScenario(INITIAL_DEMO_STATE, { name: 'Test', amount: -100, type: 'purchase' })).toThrow();
    expect(() => simulateScenario(INITIAL_DEMO_STATE, { name: 'Test', amount: 'abc', type: 'purchase' })).toThrow();
  });

  // Test 13: Exact ₹0 balance boundary & negative allowance clamp
  it('13. correctly handles exact ₹0 balance and clamps safe daily allowance to 0', () => {
    const zeroCashState = {
      initialBudget: 10000,
      currentDay: 10,
      transactions: [
        { id: '1', amount: 10000, type: 'expense', day: 5 },
      ],
      commitments: [
        { id: 'c1', name: 'Remaining Bill', amount: 500, frequency: 'monthly', day: 20, active: true },
      ],
      goals: [],
    };
    const metrics = calculateFinancialMetrics(zeroCashState);
    expect(metrics.availableCash).toBe(0);
    expect(metrics.outstandingCommitments).toBe(500);
    expect(metrics.trueUncommittedCash).toBe(-500);
    expect(metrics.projectedDay30Balance).toBe(-500);
    // Safe daily allowance must be non-negative (floored at 0)
    expect(metrics.safeDailyAllowance).toBe(0);
    expect(metrics.riskScore).toBeGreaterThanOrEqual(60);
  });

  // Test 14: Day 30 final day edge boundary
  it('14. correctly evaluates day 30 single remaining day boundary', () => {
    const day30State = {
      initialBudget: 10000,
      currentDay: 30,
      transactions: [
        { id: '1', amount: 9000, type: 'expense', day: 15 },
      ],
      commitments: [],
      goals: [],
    };
    const metrics = calculateFinancialMetrics(day30State);
    expect(metrics.currentDay).toBe(30);
    expect(metrics.remainingDays).toBe(1);
    expect(metrics.availableCash).toBe(1000);
    expect(metrics.safeDailyAllowance).toBe(1000); // 1000 / 1 day
  });
});
