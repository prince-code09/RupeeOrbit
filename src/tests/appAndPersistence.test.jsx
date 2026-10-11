import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '../App.jsx';
import { STORAGE_KEY, INITIAL_DEMO_STATE } from '../data/seedData.js';

describe('Ledgerly Application UI Flows & Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    // Mark intro seen so first-run modal doesn't block DOM interaction in tests
    localStorage.setItem('ledgerly_intro_seen', 'true');
  });

  // Test 13: LocalStorage persistence
  it('13. loads from and saves to LocalStorage correctly', () => {
    render(<App />);

    // Check that default state is saved to localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    expect(saved).not.toBeNull();
    const parsed = JSON.parse(saved);
    expect(parsed.initialBudget).toBe(10000);
    expect(parsed.currentDay).toBe(4);
  });

  // Test 14: Reset functionality
  it('14. resets back to initial demo data on reset action', async () => {
    // Populate modified state
    const modifiedState = {
      ...INITIAL_DEMO_STATE,
      transactions: [{ id: 'tx-custom', description: 'Custom Spent', amount: 5000, type: 'expense', day: 1 }],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(modifiedState));

    render(<App />);

    // Click "Reset Demo" button
    const resetBtn = screen.getByTitle('Reset to initial ₹10,000 demo state');
    fireEvent.click(resetBtn);

    // Confirm modal should appear
    const confirmBtn = screen.getByText('Reset to ₹10k Seed');
    fireEvent.click(confirmBtn);

    // State in localStorage should be back to initial seed data
    const refreshed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(refreshed.initialBudget).toBe(10000);
    expect(refreshed.transactions.length).toBe(INITIAL_DEMO_STATE.transactions.length);
  });

  // Test 15: Important UI flows - Tab switching and Decision Lab simulation
  it('15. switches navigation tabs and simulates scenario in Decision Lab', async () => {
    render(<App />);

    // Verify Overview is rendered
    expect(screen.getByText('Survive the Month on ₹10,000')).toBeInTheDocument();

    // Click "Decision Lab" tab
    const decisionLabTabs = screen.getAllByText('Decision Lab');
    fireEvent.click(decisionLabTabs[0]);

    // Check Decision Lab header
    expect(screen.getByText('The Decision Lab')).toBeInTheDocument();

    // Click quick preset: "Test ₹999 Monthly Subscription"
    const presetBtn = screen.getByText('Test ₹999 Monthly Subscription');
    fireEvent.click(presetBtn);

    // Should display Simulation Verdict
    await waitFor(() => {
      expect(screen.getByText('Simulation Verdict')).toBeInTheDocument();
      expect(screen.getByText('Consequences: Before vs After Breakdown')).toBeInTheDocument();
    });

    // Check that Commit button is present and clickable
    const commitBtn = screen.getByText('Commit Decision to Live State');
    fireEvent.click(commitBtn);

    // Should indicate successful commit
    await waitFor(() => {
      expect(screen.getByText('Decision Committed!')).toBeInTheDocument();
    });
  });

  it('16. navigates to Transactions tab and displays transactions list', () => {
    render(<App />);

    const txTabs = screen.getAllByText('Transactions');
    fireEvent.click(txTabs[0]);

    expect(screen.getByText('Transaction Ledger')).toBeInTheDocument();
    expect(screen.getByText('Hostel grocery staples & milk')).toBeInTheDocument();
  });
});
