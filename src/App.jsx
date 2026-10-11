import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import FirstRunModal from './components/FirstRunModal.jsx';
import ResetConfirmModal from './components/ResetConfirmModal.jsx';
import LivingMoneyOrbit from './components/LivingMoneyOrbit.jsx';

import Overview from './pages/Overview.jsx';
import DecisionLab from './pages/DecisionLab.jsx';
import Transactions from './pages/Transactions.jsx';
import BudgetPlanner from './pages/BudgetPlanner.jsx';
import SavingsGoals from './pages/SavingsGoals.jsx';
import Insights from './pages/Insights.jsx';

import { FinancialProvider, useFinancial } from './context/FinancialContext.jsx';
import { formatCurrency } from './utils/formatters.js';

function LedgerlyMain() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  const { resetToDemo, metrics } = useFinancial();

  // Show first-run introduction on initial load if not previously dismissed
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('ledgerly_intro_seen');
    if (!hasSeenIntro) {
      setIsHelpOpen(true);
      localStorage.setItem('ledgerly_intro_seen', 'true');
    }
  }, []);

  const handleConfirmReset = () => {
    resetToDemo();
    setActiveTab('overview');
  };

  return (
    <div className="min-h-screen bg-parchment-100 text-ink-950 flex flex-col font-sans">
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-ink-900 focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenReset={() => setIsResetOpen(true)}
      />

      {/* Sub-header identity badge for non-overview pages */}
      {activeTab !== 'overview' && (
        <div className="bg-parchment-200/50 border-b border-parchment-300 py-2.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Preserved compact version of the Living Money Orbit */}
              <div className="relative w-8 h-8 rounded-lg bg-ink-900 border border-mint-500/40 flex items-center justify-center overflow-hidden shadow-subtle shrink-0">
                <LivingMoneyOrbit size="mini" />
              </div>
              <div className="text-xs text-ink-600 font-medium">
                Active Sandbox &bull; Available Cash:{' '}
                <strong className={`font-num font-bold ${metrics.availableCash < 0 ? 'text-terracotta-600' : 'text-mint-800'}`}>
                  {formatCurrency(metrics.availableCash)}
                </strong>
                {' '}&bull; Safe Allowance:{' '}
                <strong className="font-num font-bold text-ink-900">
                  {formatCurrency(metrics.safeDailyAllowance)}/day
                </strong>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('decision-lab')}
              className="text-xs font-semibold text-mint-800 hover:text-mint-900 underline flex items-center gap-1"
            >
              Open Decision Lab &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'overview' && (
          <Overview onNavigateToLab={() => setActiveTab('decision-lab')} />
        )}
        {activeTab === 'decision-lab' && (
          <DecisionLab onNavigateToOverview={() => setActiveTab('overview')} />
        )}
        {activeTab === 'transactions' && <Transactions />}
        {activeTab === 'budget' && <BudgetPlanner />}
        {activeTab === 'goals' && (
          <SavingsGoals onNavigateToLab={() => setActiveTab('decision-lab')} />
        )}
        {activeTab === 'insights' && (
          <Insights onNavigateToLab={() => setActiveTab('decision-lab')} />
        )}
      </main>

      {/* Application Footer */}
      <footer className="mt-auto border-t border-parchment-300 bg-parchment-200/40 py-6 text-xs text-ink-500 text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
          <span className="font-serif font-bold text-ink-900">Ledgerly</span>
          <span>&bull;</span>
          <span>30-Day ₹10,000 Financial Survival Challenge</span>
        </div>
        <p className="text-[11px] text-ink-400">
          Make the decision. See the consequences. Then commit. Built with pure client-side deterministic engine.
        </p>
      </footer>

      {/* Modals */}
      <FirstRunModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <ResetConfirmModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={handleConfirmReset}
      />
    </div>
  );
}

export default function App() {
  return (
    <FinancialProvider>
      <LedgerlyMain />
    </FinancialProvider>
  );
}
