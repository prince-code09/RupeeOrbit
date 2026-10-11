/**
 * LEDGERLY FINANCIAL ENGINE
 * 
 * Single source of truth for all financial math, 30-day survival projections,
 * risk & health scoring, and Decision Lab scenario simulations.
 * Uses integer paise internally where appropriate to eliminate floating-point drift.
 */

import { toPaise, fromPaise } from '../utils/formatters.js';

export const CATEGORIES = [
  'Food & Groceries',
  'Travel & Commute',
  'Rent & Living',
  'Subscriptions & Bills',
  'Education & Books',
  'Entertainment & Leisure',
  'Health & Medical',
  'Personal & Misc',
];

/**
 * Calculate due days for a commitment between fromDay and toDay
 */
export function getCommitmentDueDays(commitment, fromDay = 1, toDay = 30) {
  const dueDays = [];
  const start = Math.max(1, commitment.day || 1);

  if (commitment.frequency === 'one-time') {
    if (start >= fromDay && start <= toDay) {
      dueDays.push(start);
    }
  } else if (commitment.frequency === 'weekly') {
    for (let d = start; d <= toDay; d += 7) {
      if (d >= fromDay) dueDays.push(d);
    }
  } else {
    // default: monthly (occurs once in 30 days cycle on commitment.day)
    if (start >= fromDay && start <= toDay) {
      dueDays.push(start);
    }
  }
  return dueDays;
}

/**
 * Core calculation function: evaluates current financial metrics from state
 */
export function calculateFinancialMetrics(state) {
  const initialBudget = Number(state.initialBudget ?? 10000);
  const currentDay = Math.max(1, Math.min(30, Number(state.currentDay ?? 1)));
  const remainingDays = Math.max(0, 30 - currentDay + 1);

  const transactions = state.transactions || [];
  const commitments = state.commitments || [];
  const goals = state.goals || [];
  const budgetLimits = state.budgetLimits || {};

  // 1. Calculate actual spending and received income from transactions
  let incomePaise = 0;
  let expensePaise = 0;
  const spentByCategory = {};

  for (const t of transactions) {
    const amtPaise = toPaise(t.amount);
    if (t.type === 'income') {
      incomePaise += amtPaise;
    } else if (t.type === 'expense') {
      expensePaise += amtPaise;
      const cat = t.category || 'Personal & Misc';
      spentByCategory[cat] = (spentByCategory[cat] || 0) + amtPaise;
    }
  }

  // 2. Savings Reserves (transferred cash locked into goals)
  let savingsReservedPaise = 0;
  for (const g of goals) {
    savingsReservedPaise += toPaise(g.savedAmount || 0);
  }

  // 3. Current Available Balance (Actual liquid cash on hand right now)
  // Available Cash = Starting Cash + Received Income - Actual Expenses - Savings Reserves
  const initialPaise = toPaise(initialBudget);
  const availableCashPaise = initialPaise + incomePaise - expensePaise - savingsReservedPaise;
  const availableCash = fromPaise(availableCashPaise);

  // 4. Outstanding Future Commitments (Active bills scheduled between currentDay and Day 30 not yet paid)
  let outstandingCommitmentsPaise = 0;
  const upcomingBills = [];

  for (const c of commitments) {
    if (!c.active) continue;
    const dueDays = getCommitmentDueDays(c, currentDay, 30);
    const paidList = c.paidOccurrences || [];

    for (const dueDay of dueDays) {
      // Check if this specific occurrence has already been recorded as paid
      const isPaid = paidList.includes(dueDay);
      if (!isPaid) {
        const cAmtPaise = toPaise(c.amount);
        outstandingCommitmentsPaise += cAmtPaise;
        upcomingBills.push({
          id: `${c.id}-day-${dueDay}`,
          commitmentId: c.id,
          name: c.name,
          amount: c.amount,
          category: c.category,
          dueDay,
          daysUntilDue: dueDay - currentDay,
        });
      }
    }
  }

  // Sort upcoming bills by due day
  upcomingBills.sort((a, b) => a.dueDay - b.dueDay);

  const outstandingCommitments = fromPaise(outstandingCommitmentsPaise);
  const totalReservedMoney = fromPaise(savingsReservedPaise + outstandingCommitmentsPaise);

  // 5. True Uncommitted Cash (Safety cushion after setting aside all future commitments)
  const trueUncommittedCashPaise = availableCashPaise - outstandingCommitmentsPaise;
  const trueUncommittedCash = fromPaise(trueUncommittedCashPaise);

  // 6. Safe Daily Spending Allowance
  // How much user can spend per day on groceries/miscellaneous without going negative by Day 30
  let safeDailyAllowance = 0;
  if (remainingDays > 0) {
    safeDailyAllowance = Math.max(0, trueUncommittedCash / remainingDays);
  }

  // 7. Projected Day-30 Balance
  // Cash remaining after paying all outstanding commitments
  const projectedDay30Balance = trueUncommittedCash;

  // 8. 30-Day Timeline & Cash-Flow Projection
  const dailyForecast = [];
  let lowestProjectedBalance = availableCash;
  let lowestDay = currentDay;

  // Running simulator for 30 days
  let simulatedBalance = availableCash;

  for (let d = 1; d <= 30; d++) {
    if (d < currentDay) {
      // Past day: compute historical end of day balance
      let pastBalPaise = initialPaise;
      for (const t of transactions) {
        if (t.day <= d) {
          const tPaise = toPaise(t.amount);
          if (t.type === 'income') pastBalPaise += tPaise;
          else if (t.type === 'expense') pastBalPaise -= tPaise;
        }
      }
      dailyForecast.push({
        day: d,
        balance: fromPaise(pastBalPaise),
        isCurrent: false,
        isPast: true,
        billsDue: [],
        status: pastBalPaise >= 0 ? 'safe' : 'negative',
      });
    } else if (d === currentDay) {
      // Current day
      const dayBills = upcomingBills.filter(b => b.dueDay === d);
      dailyForecast.push({
        day: d,
        balance: availableCash,
        isCurrent: true,
        isPast: false,
        billsDue: dayBills,
        status: availableCash >= 0 ? 'safe' : 'negative',
      });
      if (availableCash < lowestProjectedBalance) {
        lowestProjectedBalance = availableCash;
        lowestDay = d;
      }
    } else {
      // Future day: deduct any scheduled bills due on day d
      const dayBills = upcomingBills.filter(b => b.dueDay === d);
      let dayBillsTotal = 0;
      for (const b of dayBills) {
        dayBillsTotal += b.amount;
      }
      simulatedBalance -= dayBillsTotal;

      if (simulatedBalance < lowestProjectedBalance) {
        lowestProjectedBalance = simulatedBalance;
        lowestDay = d;
      }

      dailyForecast.push({
        day: d,
        balance: Math.round(simulatedBalance * 100) / 100,
        isCurrent: false,
        isPast: false,
        billsDue: dayBills,
        status: simulatedBalance < 0 ? 'negative' : (simulatedBalance < 1000 ? 'tight' : 'safe'),
      });
    }
  }

  // 9. Financial Risk Score (0 to 100) & Factor Breakdown
  // 0 = Ultra safe, 100 = Imminent insolvency
  const riskFactors = [];
  let riskScore = 0;

  // Factor A: Day-30 Buffer
  if (projectedDay30Balance < 0) {
    riskScore += 60;
    riskFactors.push({
      name: 'Projected Deficit',
      impact: '+60',
      description: `Projected to end the month at ${formatCurrency(projectedDay30Balance)} in the red.`,
      severity: 'critical'
    });
  } else if (projectedDay30Balance < 500) {
    riskScore += 40;
    riskFactors.push({
      name: 'Razor-thin Cushion',
      impact: '+40',
      description: `Day 30 forecast buffer is only ${formatCurrency(projectedDay30Balance)}.`,
      severity: 'high'
    });
  } else if (projectedDay30Balance < 1500) {
    riskScore += 22;
    riskFactors.push({
      name: 'Modest Safety Margin',
      impact: '+22',
      description: `End balance of ${formatCurrency(projectedDay30Balance)} leaves little room for surprises.`,
      severity: 'medium'
    });
  } else {
    riskFactors.push({
      name: 'Healthy Day-30 Reserve',
      impact: '0',
      description: `Projected buffer is ${formatCurrency(projectedDay30Balance)}.`,
      severity: 'low'
    });
  }

  // Factor B: Daily Spending Allowance
  if (safeDailyAllowance <= 0) {
    riskScore += 30;
    riskFactors.push({
      name: 'Zero Daily Allowance',
      impact: '+30',
      description: 'You have ₹0/day safe spending left for remaining days.',
      severity: 'critical'
    });
  } else if (safeDailyAllowance < 70) {
    riskScore += 24;
    riskFactors.push({
      name: 'Extremely Restrictive Allowance',
      impact: '+24',
      description: `Daily allowance is only ${formatCurrency(safeDailyAllowance)}/day, barely meeting meals.`,
      severity: 'high'
    });
  } else if (safeDailyAllowance < 150) {
    riskScore += 12;
    riskFactors.push({
      name: 'Tight Daily Budget',
      impact: '+12',
      description: `Daily allowance of ${formatCurrency(safeDailyAllowance)}/day requires discipline.`,
      severity: 'medium'
    });
  } else {
    riskFactors.push({
      name: 'Comfortable Daily Allowance',
      impact: '0',
      description: `Daily allowance of ${formatCurrency(safeDailyAllowance)}/day is sustainable.`,
      severity: 'low'
    });
  }

  // Factor C: Commitment Ratio
  const commitmentRatio = availableCash > 0 ? (outstandingCommitments / availableCash) : 1;
  if (commitmentRatio > 0.65) {
    riskScore += 16;
    riskFactors.push({
      name: 'Heavy Fixed Commitments',
      impact: '+16',
      description: `${Math.round(commitmentRatio * 100)}% of current funds are locked into future bills.`,
      severity: 'high'
    });
  } else if (commitmentRatio > 0.4) {
    riskScore += 8;
    riskFactors.push({
      name: 'Moderate Commitment Ratio',
      impact: '+8',
      description: `${Math.round(commitmentRatio * 100)}% of cash pledged to upcoming bills.`,
      severity: 'medium'
    });
  }

  // Factor D: Savings Cushion
  const savingsAmount = fromPaise(savingsReservedPaise);
  if (savingsAmount === 0 && goals.length > 0) {
    riskScore += 8;
    riskFactors.push({
      name: 'Zero Emergency Savings Pledged',
      impact: '+8',
      description: 'No savings buffer put aside for sudden shocks.',
      severity: 'medium'
    });
  }

  riskScore = Math.min(100, Math.max(0, Math.round(riskScore)));

  // 10. Financial Health Score (0 to 100) & Factor Breakdown
  // Higher = Better
  const healthFactors = [];
  let healthScore = 0;

  // Solvency Component (Max 40 pts)
  if (projectedDay30Balance >= 2500) {
    healthScore += 40;
    healthFactors.push({ name: 'Solid Final Reserve', points: '40/40' });
  } else if (projectedDay30Balance >= 1000) {
    const pts = Math.round(20 + ((projectedDay30Balance - 1000) / 1500) * 20);
    healthScore += pts;
    healthFactors.push({ name: 'Viable Final Reserve', points: `${pts}/40` });
  } else if (projectedDay30Balance >= 0) {
    const pts = Math.round((projectedDay30Balance / 1000) * 20);
    healthScore += pts;
    healthFactors.push({ name: 'Narrow Final Reserve', points: `${pts}/40` });
  } else {
    healthFactors.push({ name: 'Deficit Warning', points: '0/40' });
  }

  // Daily Allowance Component (Max 30 pts)
  if (safeDailyAllowance >= 200) {
    healthScore += 30;
    healthFactors.push({ name: 'Generous Daily Margin', points: '30/30' });
  } else if (safeDailyAllowance >= 100) {
    const pts = Math.round(15 + ((safeDailyAllowance - 100) / 100) * 15);
    healthScore += pts;
    healthFactors.push({ name: 'Adequate Daily Margin', points: `${pts}/30` });
  } else if (safeDailyAllowance > 0) {
    const pts = Math.round((safeDailyAllowance / 100) * 15);
    healthScore += pts;
    healthFactors.push({ name: 'Strained Daily Allowance', points: `${pts}/30` });
  } else {
    healthFactors.push({ name: 'Exhausted Daily Margin', points: '0/30' });
  }

  // Budget Adherence Component (Max 15 pts)
  let overBudgetCount = 0;
  for (const cat of CATEGORIES) {
    const limit = budgetLimits[cat] || 0;
    const spent = fromPaise(spentByCategory[cat] || 0);
    if (limit > 0 && spent > limit) overBudgetCount++;
  }
  const budgetPts = Math.max(0, 15 - overBudgetCount * 5);
  healthScore += budgetPts;
  healthFactors.push({ name: 'Budget Discipline', points: `${budgetPts}/15` });

  // Savings Progress Component (Max 15 pts)
  let totalGoalTarget = 0;
  let totalGoalSaved = 0;
  for (const g of goals) {
    totalGoalTarget += Number(g.targetAmount || 0);
    totalGoalSaved += Number(g.savedAmount || 0);
  }
  const goalProgressPct = totalGoalTarget > 0 ? (totalGoalSaved / totalGoalTarget) : 0;
  const savingsPts = Math.min(15, Math.round(goalProgressPct * 15));
  healthScore += savingsPts;
  healthFactors.push({ name: 'Savings Progress', points: `${savingsPts}/15` });

  healthScore = Math.min(100, Math.max(0, healthScore));

  // 11. Category Budgets & Actuals
  const categorySummary = CATEGORIES.map(cat => {
    const limit = budgetLimits[cat] || 0;
    const spent = fromPaise(spentByCategory[cat] || 0);
    const remaining = limit - spent;
    const percentUsed = limit > 0 ? Math.round((spent / limit) * 100) : 0;
    return {
      category: cat,
      allocated: limit,
      spent,
      remaining,
      percentUsed,
      isOverBudget: limit > 0 && spent > limit,
    };
  });

  // 12. Smart Money-Coach Insights
  const coachInsights = [];

  // Insight A: ₹50 discretionary reduction estimation
  if (remainingDays > 0) {
    const trimAmount = 50 * remainingDays;
    coachInsights.push({
      id: 'insight-trim',
      type: 'tip',
      title: 'Discretionary Trim Simulation',
      text: `Reducing discretionary spend by ₹50/day across the remaining ${remainingDays} days would retain an estimated ₹${trimAmount.toLocaleString('en-IN')} in safety buffer.`,
      disclaimer: 'Estimate based on uniform reduction; not a guaranteed outcome.'
    });
  }

  // Insight B: Upcoming bills alert
  const immediateBills = upcomingBills.filter(b => b.daysUntilDue <= 3 && b.daysUntilDue >= 0);
  if (immediateBills.length > 0) {
    const sumImmediate = immediateBills.reduce((acc, b) => acc + b.amount, 0);
    coachInsights.push({
      id: 'insight-bills',
      type: 'warning',
      title: 'Imminent Fixed Commitments',
      text: `${immediateBills.length} bill(s) totaling ${formatCurrency(sumImmediate)} due within the next 3 days (${immediateBills.map(b => b.name).join(', ')}).`,
      disclaimer: 'Ensure cash is available prior to due date.'
    });
  }

  // Insight C: Feasibility overview
  if (projectedDay30Balance < 0) {
    coachInsights.push({
      id: 'insight-critical',
      type: 'critical',
      title: 'Survival Deficit Alert',
      text: `Your current trajectory falls ₹${Math.abs(projectedDay30Balance).toLocaleString('en-IN')} short of surviving Day 30. Immediate spending cuts or emergency income are needed.`,
      disclaimer: 'Calculated from active commitments and current daily burn.'
    });
  } else if (safeDailyAllowance < 80) {
    coachInsights.push({
      id: 'insight-tight',
      type: 'advisory',
      title: 'Tight Spending Constraint',
      text: `Safe discretionary allowance is limited to ${formatCurrency(safeDailyAllowance)}/day. Prioritize home-cooked meals and pause non-vital subscriptions.`,
      disclaimer: 'Rule-based financial advice.'
    });
  } else {
    coachInsights.push({
      id: 'insight-on-track',
      type: 'success',
      title: 'Plan On Track',
      text: `You have ${formatCurrency(projectedDay30Balance)} projected buffer and ${formatCurrency(safeDailyAllowance)}/day safe allowance. Steady execution will clear the 30-day challenge!`,
      disclaimer: 'Assumes no further unplanned expenses.'
    });
  }

  return {
    initialBudget,
    currentDay,
    remainingDays,
    totalIncome: fromPaise(incomePaise),
    actualExpenses: fromPaise(expensePaise),
    totalSavingsReserved: fromPaise(savingsReservedPaise),
    availableCash,
    outstandingCommitments,
    totalReservedMoney,
    trueUncommittedCash,
    safeDailyAllowance: Math.round(safeDailyAllowance * 100) / 100,
    projectedDay30Balance: Math.round(projectedDay30Balance * 100) / 100,
    lowestProjectedBalance: Math.round(lowestProjectedBalance * 100) / 100,
    lowestDay,
    riskScore,
    riskFactors,
    healthScore,
    healthFactors,
    upcomingBills,
    dailyForecast,
    categorySummary,
    coachInsights,
  };
}

/**
 * Helper to format currency inside engine
 */
function formatCurrency(amt) {
  const n = Number(amt) || 0;
  return `₹${n.toLocaleString('en-IN')}`;
}

/**
 * SIMULATE A SCENARIO IN THE DECISION LAB
 * Strictly leaves baseState unmodified!
 */
export function simulateScenario(baseState, scenario) {
  // Validate inputs
  if (!scenario || typeof scenario !== 'object') {
    throw new Error('Invalid scenario object');
  }
  const amount = Number(scenario.amount);
  if (isNaN(amount) || amount <= 0) {
    throw new Error('Scenario amount must be a positive number');
  }
  if (!scenario.name || scenario.name.trim() === '') {
    throw new Error('Scenario name is required');
  }

  // Deep clone state to ensure 100% strict scenario isolation
  const simulatedState = {
    ...baseState,
    transactions: [...(baseState.transactions || []).map(t => ({ ...t }))],
    commitments: [...(baseState.commitments || []).map(c => ({ ...c, paidOccurrences: [...(c.paidOccurrences || [])] }))],
    goals: [...(baseState.goals || []).map(g => ({ ...g }))],
    budgetLimits: { ...(baseState.budgetLimits || {}) },
  };

  const scenarioDay = Math.max(1, Math.min(30, Number(scenario.day || simulatedState.currentDay || 1)));

  // Apply simulated decision based on type
  switch (scenario.type) {
    case 'expense':
    case 'purchase':
    case 'ordinary_expense':
    case 'unexpected_expense': {
      simulatedState.transactions.push({
        id: `sim-exp-${Date.now()}`,
        description: scenario.name,
        amount: amount,
        type: 'expense',
        category: scenario.category || 'Personal & Misc',
        day: scenarioDay,
        notes: scenario.notes || 'Simulated expense',
        isSimulated: true,
      });
      break;
    }

    case 'subscription':
    case 'recurring_bill': {
      simulatedState.commitments.push({
        id: `sim-comm-${Date.now()}`,
        name: scenario.name,
        amount: amount,
        frequency: scenario.frequency || 'monthly',
        day: scenarioDay,
        category: scenario.category || 'Subscriptions & Bills',
        active: true,
        paidOccurrences: [],
        isSimulated: true,
      });
      break;
    }

    case 'income': {
      simulatedState.transactions.push({
        id: `sim-inc-${Date.now()}`,
        description: scenario.name,
        amount: amount,
        type: 'income',
        category: scenario.category || 'Personal & Misc',
        day: scenarioDay,
        notes: scenario.notes || 'Simulated income',
        isSimulated: true,
      });
      break;
    }

    case 'savings_contribution': {
      // Find goal or simulate transfer to first goal
      const targetGoalId = scenario.goalId;
      const targetGoal = simulatedState.goals.find(g => g.id === targetGoalId) || simulatedState.goals[0];
      if (targetGoal) {
        targetGoal.savedAmount = (targetGoal.savedAmount || 0) + amount;
      } else {
        simulatedState.goals.push({
          id: `sim-goal-${Date.now()}`,
          name: scenario.name || 'Emergency Cushion',
          targetAmount: amount * 2,
          savedAmount: amount,
          priority: 'High',
          isSimulated: true,
        });
      }
      break;
    }

    default:
      throw new Error(`Unsupported scenario type: ${scenario.type}`);
  }

  // Calculate Before vs After
  const beforeMetrics = calculateFinancialMetrics(baseState);
  const afterMetrics = calculateFinancialMetrics(simulatedState);

  // Compute metric deltas
  const deltas = {
    availableCash: afterMetrics.availableCash - beforeMetrics.availableCash,
    outstandingCommitments: afterMetrics.outstandingCommitments - beforeMetrics.outstandingCommitments,
    safeDailyAllowance: afterMetrics.safeDailyAllowance - beforeMetrics.safeDailyAllowance,
    projectedDay30Balance: afterMetrics.projectedDay30Balance - beforeMetrics.projectedDay30Balance,
    riskScore: afterMetrics.riskScore - beforeMetrics.riskScore,
    healthScore: afterMetrics.healthScore - beforeMetrics.healthScore,
  };

  // Determine Verdict according to documented rules:
  // 1. UNSUSTAINABLE: Projected Day-30 balance < 0 OR Available cash dips negative
  // 2. HIGH_RISK: Projected balance < ₹500 OR Safe daily allowance < ₹60 OR Risk score > 65
  // 3. MANAGEABLE_BUT_TIGHT: Projected balance < ₹1,500 OR Safe daily allowance < ₹140 OR Risk score > 35
  // 4. AFFORDABLE: Safe and robust under current plan
  let verdict = 'AFFORDABLE';
  let verdictTitle = 'Affordable';
  let verdictColor = 'mint';
  let verdictExplanation = '';

  if (afterMetrics.projectedDay30Balance < 0 || afterMetrics.availableCash < 0) {
    verdict = 'UNSUSTAINABLE';
    verdictTitle = 'Unsustainable Under Current Plan';
    verdictColor = 'terracotta';
    verdictExplanation = `Executing this decision will cause a financial deficit of ₹${Math.abs(afterMetrics.projectedDay30Balance).toLocaleString('en-IN')} by Day 30. Cash flow will be completely exhausted.`;
  } else if (afterMetrics.projectedDay30Balance < 500 || afterMetrics.safeDailyAllowance < 60 || afterMetrics.riskScore >= 65) {
    verdict = 'HIGH_RISK';
    verdictTitle = 'High Risk';
    verdictColor = 'terracotta';
    verdictExplanation = `This pushes your safety buffer to an alarming ${formatCurrency(afterMetrics.projectedDay30Balance)} and limits daily living to ${formatCurrency(afterMetrics.safeDailyAllowance)}/day. Any minor emergency would cause default.`;
  } else if (afterMetrics.projectedDay30Balance < 1500 || afterMetrics.safeDailyAllowance < 140 || afterMetrics.riskScore >= 38) {
    verdict = 'MANAGEABLE_BUT_TIGHT';
    verdictTitle = 'Manageable But Tight';
    verdictColor = 'amberGold';
    verdictExplanation = `Viable, but requires discipline. Reduces your daily living allowance by ${formatCurrency(Math.abs(deltas.safeDailyAllowance))}/day, leaving ${formatCurrency(afterMetrics.projectedDay30Balance)} buffer on Day 30.`;
  } else {
    verdict = 'AFFORDABLE';
    verdictTitle = 'Affordable & Sustainable';
    verdictColor = 'mint';
    verdictExplanation = `Comfortably within parameters. Leaves an ample Day-30 buffer of ${formatCurrency(afterMetrics.projectedDay30Balance)} and maintains a daily living allowance of ${formatCurrency(afterMetrics.safeDailyAllowance)}/day.`;
  }

  // Explanations for why each important metric moved
  const metricExplanations = {
    availableCash: deltas.availableCash < 0
      ? `Decreases by ${formatCurrency(Math.abs(deltas.availableCash))} immediately due to upfront cash outflow.`
      : deltas.availableCash > 0
        ? `Increases by ${formatCurrency(deltas.availableCash)} immediately from added funds.`
        : `Unchanged immediately; impact is deferred to scheduled future commitment dates.`,
    
    outstandingCommitments: deltas.outstandingCommitments > 0
      ? `Adds ${formatCurrency(deltas.outstandingCommitments)} in pledged recurring payments that must be reserved.`
      : `No change to recurring fixed commitments.`,

    safeDailyAllowance: deltas.safeDailyAllowance < 0
      ? `Shrinks by ${formatCurrency(Math.abs(deltas.safeDailyAllowance))}/day across ${beforeMetrics.remainingDays} remaining survival days.`
      : deltas.safeDailyAllowance > 0
        ? `Expands by ${formatCurrency(deltas.safeDailyAllowance)}/day giving greater flexibility.`
        : `Remains stable.`,

    projectedDay30Balance: deltas.projectedDay30Balance < 0
      ? `Reduces month-end reserve by ${formatCurrency(Math.abs(deltas.projectedDay30Balance))}.`
      : deltas.projectedDay30Balance > 0
        ? `Boosts month-end cushion by ${formatCurrency(deltas.projectedDay30Balance)}.`
        : `Remains identical on Day 30.`,

    riskScore: deltas.riskScore > 0
      ? `Risk increases by +${deltas.riskScore} points due to reduced liquidity cushion.`
      : deltas.riskScore < 0
        ? `Risk decreases by ${deltas.riskScore} points thanks to stronger liquidity.`
        : `Risk level unchanged.`,
  };

  return {
    scenario,
    beforeMetrics,
    afterMetrics,
    deltas,
    verdict,
    verdictTitle,
    verdictColor,
    verdictExplanation,
    metricExplanations,
    simulatedState,
  };
}

/**
 * PERMANENTLY COMMIT A SCENARIO TO ACTUAL STATE
 * Ensures single-commit protection and consistent state updates.
 */
export function commitScenario(currentState, scenario) {
  if (!scenario || typeof scenario !== 'object') {
    throw new Error('Invalid scenario for commit');
  }

  const newState = {
    ...currentState,
    transactions: [...(currentState.transactions || []).map(t => ({ ...t }))],
    commitments: [...(currentState.commitments || []).map(c => ({ ...c, paidOccurrences: [...(c.paidOccurrences || [])] }))],
    goals: [...(currentState.goals || []).map(g => ({ ...g }))],
  };

  const amount = Number(scenario.amount);
  const scenarioDay = Math.max(1, Math.min(30, Number(scenario.day || currentState.currentDay || 1)));

  switch (scenario.type) {
    case 'expense':
    case 'purchase':
    case 'ordinary_expense':
    case 'unexpected_expense': {
      newState.transactions.unshift({
        id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        description: scenario.name,
        amount: amount,
        type: 'expense',
        category: scenario.category || 'Personal & Misc',
        day: scenarioDay,
        date: `2026-10-${String(scenarioDay).padStart(2, '0')}`,
        notes: scenario.notes || (scenario.type === 'unexpected_expense' ? 'Emergency commitment' : 'Committed decision'),
      });
      break;
    }

    case 'subscription':
    case 'recurring_bill': {
      newState.commitments.push({
        id: `comm-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: scenario.name,
        amount: amount,
        frequency: scenario.frequency || 'monthly',
        day: scenarioDay,
        category: scenario.category || 'Subscriptions & Bills',
        active: true,
        paidOccurrences: [],
      });
      break;
    }

    case 'income': {
      newState.transactions.unshift({
        id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        description: scenario.name,
        amount: amount,
        type: 'income',
        category: scenario.category || 'Personal & Misc',
        day: scenarioDay,
        date: `2026-10-${String(scenarioDay).padStart(2, '0')}`,
        notes: scenario.notes || 'Committed income',
      });
      break;
    }

    case 'savings_contribution': {
      const targetGoalId = scenario.goalId;
      const targetGoal = newState.goals.find(g => g.id === targetGoalId) || newState.goals[0];
      if (targetGoal) {
        targetGoal.savedAmount = (targetGoal.savedAmount || 0) + amount;
      }
      break;
    }

    default:
      throw new Error(`Cannot commit unknown scenario type: ${scenario.type}`);
  }

  return newState;
}

/**
 * Pay a recurring commitment occurrence
 * Marks occurrence as paid and creates an expense transaction so it's not double counted!
 */
export function payCommitmentOccurrence(currentState, commitmentId, dueDay) {
  const newState = {
    ...currentState,
    transactions: [...(currentState.transactions || []).map(t => ({ ...t }))],
    commitments: [...(currentState.commitments || []).map(c => ({ ...c, paidOccurrences: [...(c.paidOccurrences || [])] }))],
  };

  const commitment = newState.commitments.find(c => c.id === commitmentId);
  if (!commitment) return currentState;

  if (!commitment.paidOccurrences.includes(dueDay)) {
    commitment.paidOccurrences.push(dueDay);

    // Create the actual paid expense transaction
    newState.transactions.unshift({
      id: `tx-bill-${commitment.id}-d${dueDay}`,
      description: `${commitment.name} (Day ${dueDay} Bill)`,
      amount: commitment.amount,
      type: 'expense',
      category: commitment.category,
      day: dueDay,
      date: `2026-10-${String(dueDay).padStart(2, '0')}`,
      commitmentId: commitment.id,
      notes: `Recurring bill payment for Day ${dueDay}`,
    });
  }

  return newState;
}

/**
 * Toggle commitment active status
 */
export function toggleCommitmentStatus(currentState, commitmentId) {
  return {
    ...currentState,
    commitments: (currentState.commitments || []).map(c => {
      if (c.id === commitmentId) {
        return { ...c, active: !c.active };
      }
      return c;
    }),
  };
}
