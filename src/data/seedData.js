/**
 * RUPEEORBIT DEFAULT SEED DATA
 * Initial 30-day survival state with ₹10,000 starting budget.
 */

export const INITIAL_DEMO_STATE = {
  initialBudget: 10000,
  currentDay: 4, // Day 4 of the 30-day challenge
  
  // Category spending allowances
  budgetLimits: {
    'Food & Groceries': 2600,
    'Travel & Commute': 800,
    'Rent & Living': 3500,
    'Subscriptions & Bills': 1000,
    'Education & Books': 600,
    'Entertainment & Leisure': 600,
    'Health & Medical': 500,
    'Personal & Misc': 400,
  },

  // Initial transactions logged through Day 4
  transactions: [
    {
      id: 'tx-seed-1',
      description: 'Hostel grocery staples & milk',
      amount: 620,
      type: 'expense',
      category: 'Food & Groceries',
      day: 1,
      date: '2026-10-01',
      notes: 'Rice, dal, spices and oat packets for breakfast',
    },
    {
      id: 'tx-seed-2',
      description: 'Monthly Metro SmartCard recharge',
      amount: 300,
      type: 'expense',
      category: 'Travel & Commute',
      day: 2,
      date: '2026-10-02',
      notes: 'Daily commute to campus',
    },
    {
      id: 'tx-seed-3',
      description: 'Study materials & lab manual printing',
      amount: 180,
      type: 'expense',
      category: 'Education & Books',
      day: 3,
      date: '2026-10-03',
      notes: 'Semester project reference printouts',
    },
    {
      id: 'tx-seed-4',
      description: 'Campus cafeteria thali with batchmates',
      amount: 240,
      type: 'expense',
      category: 'Food & Groceries',
      day: 4,
      date: '2026-10-04',
      notes: 'Lunch on Day 4',
    },
  ],

  // Recurring commitments scheduled during the 30 days
  commitments: [
    {
      id: 'comm-seed-rent',
      name: 'Hostel Room / PG Rent Share',
      amount: 3500,
      frequency: 'monthly',
      day: 10,
      category: 'Rent & Living',
      active: true,
      paidOccurrences: [],
    },
    {
      id: 'comm-seed-wifi',
      name: 'Shared Fiber Broadband Internet',
      amount: 350,
      frequency: 'monthly',
      day: 14,
      category: 'Subscriptions & Bills',
      active: true,
      paidOccurrences: [],
    },
    {
      id: 'comm-seed-phone',
      name: 'Mobile Prepaid 5G Plan (28 days)',
      amount: 299,
      frequency: 'monthly',
      day: 18,
      category: 'Subscriptions & Bills',
      active: true,
      paidOccurrences: [],
    },
    {
      id: 'comm-seed-spotify',
      name: 'Spotify Student Premium',
      amount: 59,
      frequency: 'monthly',
      day: 22,
      category: 'Subscriptions & Bills',
      active: true,
      paidOccurrences: [],
    },
  ],

  // Savings goals
  goals: [
    {
      id: 'goal-seed-emergency',
      name: 'Emergency Medical & Travel Buffer',
      targetAmount: 2000,
      savedAmount: 800,
      deadlineDay: 30,
      priority: 'High',
    },
    {
      id: 'goal-seed-books',
      name: 'Coding Bootcamp / Cloud Cert Fee',
      targetAmount: 1500,
      savedAmount: 400,
      deadlineDay: 28,
      priority: 'Medium',
    },
  ],
};

export const STORAGE_KEY = 'rupeeorbit_survival_v1_state';
export const LEGACY_STORAGE_KEY = 'ledgerly_survival_v1_state';
