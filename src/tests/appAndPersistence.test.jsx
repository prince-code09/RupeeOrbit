import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '../App.jsx';
import { STORAGE_KEY, INITIAL_DEMO_STATE } from '../data/seedData.js';

describe('RupeeOrbit Application UI Flows & Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // Phase 2 Critical Verification: Fresh direct load must NOT show a blocking modal
  it('1. loads dashboard directly on fresh visit without any blocking orientation modal', () => {
    render(<App />);

    // Must NOT have any open modal/dialog on first visit
    const modal = screen.queryByRole('dialog');
    expect(modal).toBeNull();

    // The main dashboard content must be immediately visible and interactive
    expect(screen.getByText('30-Day Financial Survival')).toBeInTheDocument();
    expect(screen.getAllByText(/Make the decision/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Open Decision Lab')).toBeInTheDocument();
  });

  // Explicit Guide opening via button
  it('2. opens the Challenge Guide only upon explicit user request and closes cleanly', () => {
    render(<App />);

    // Initially no modal
    expect(screen.queryByRole('dialog')).toBeNull();

    // Click "How It Works" / "Challenge Guide" button
    const guideBtns = screen.getAllByRole('button', { name: /challenge guide/i });
    expect(guideBtns.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(guideBtns[0]);

    // Modal dialog is now visible
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText('Survive the Month on ₹10,000')).toBeInTheDocument();
    expect(screen.getByText('Explore Dashboard & Simulator')).toBeInTheDocument();

    // Close via Explore button
    const closeCta = screen.getByText('Explore Dashboard & Simulator');
    fireEvent.click(closeCta);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  // Escape key closes Challenge Guide modal
  it('3. closes the Challenge Guide when Escape key is pressed', () => {
    render(<App />);

    const guideBtns = screen.getAllByRole('button', { name: /challenge guide/i });
    fireEvent.click(guideBtns[0]);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  // LocalStorage persistence
  it('4. saves state to LocalStorage and loads on initial visit', () => {
    render(<App />);

    const saved = localStorage.getItem(STORAGE_KEY);
    expect(saved).not.toBeNull();
    const parsed = JSON.parse(saved);
    expect(parsed.initialBudget).toBe(10000);
    expect(parsed.currentDay).toBe(4);
  });

  // Resilience against corrupted LocalStorage JSON
  it('5. gracefully recovers from corrupted LocalStorage JSON without crashing', () => {
    // Write invalid, unparseable JSON into localStorage
    localStorage.setItem(STORAGE_KEY, '{invalid_corrupted_json:');

    // Should render cleanly using fallback seed state
    render(<App />);
    expect(screen.getByText('30-Day Financial Survival')).toBeInTheDocument();
  });

  // Reset functionality
  it('6. resets back to initial demo data on reset action', async () => {
    const modifiedState = {
      ...INITIAL_DEMO_STATE,
      transactions: [{ id: 'tx-custom', name: 'Custom Expense', amount: 500000, type: 'expense', day: 1, status: 'settled' }],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(modifiedState));

    render(<App />);

    const resetBtn = screen.getByTitle('Reset to initial ₹10,000 demo state');
    fireEvent.click(resetBtn);

    const confirmBtn = screen.getByText('Reset to ₹10k Seed');
    fireEvent.click(confirmBtn);

    const refreshed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(refreshed.initialBudget).toBe(10000);
    expect(refreshed.transactions.length).toBe(INITIAL_DEMO_STATE.transactions.length);
  });

  // Decision Lab simulation and single-commit protection
  it('7. switches navigation tabs and simulates scenario in Decision Lab with single commit', async () => {
    render(<App />);

    const decisionLabTabs = screen.getAllByText('Decision Lab');
    fireEvent.click(decisionLabTabs[0]);

    expect(screen.getByText('The Decision Lab')).toBeInTheDocument();

    const presetBtn = screen.getByText('Test ₹999 Monthly Subscription');
    fireEvent.click(presetBtn);

    await waitFor(() => {
      expect(screen.getByText('Simulation Verdict')).toBeInTheDocument();
      expect(screen.getByText('Consequences: Before vs After Breakdown')).toBeInTheDocument();
    });

    const commitBtn = screen.getByText('Commit Decision to Live State');
    fireEvent.click(commitBtn);

    await waitFor(() => {
      expect(screen.getByText('Decision Committed!')).toBeInTheDocument();
    });

    // Clicking again should not duplicate commit (hasCommitted guard)
    const commitButtons = screen.queryAllByText('Commit Decision to Live State');
    expect(commitButtons.length).toBe(0);
  });

  // Transactions ledger display
  it('8. navigates to Transactions tab and displays transactions list', () => {
    render(<App />);

    const txTabs = screen.getAllByText('Transactions');
    fireEvent.click(txTabs[0]);

    expect(screen.getByText('Transaction Ledger')).toBeInTheDocument();
    expect(screen.getByText('Hostel grocery staples & milk')).toBeInTheDocument();
  });
});
