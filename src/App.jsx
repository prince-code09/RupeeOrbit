import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
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
import { X } from 'lucide-react';

function RupeeOrbitMain() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { resetToDemo, metrics } = useFinancial();

  const handleConfirmReset = () => {
    resetToDemo();
    setActiveTab('overview');
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-ink-900 flex font-sans antialiased selection:bg-cyan-500/30 selection:text-white">
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-ink-900 focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* Desktop Persistent Left Sidebar */}
      <div className="hidden lg:block shrink-0">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <Sidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onOpenHelp={() => setIsHelpOpen(true)}
            onOpenReset={() => setIsResetOpen(true)}
          />
        </div>
      </div>

      {/* Mobile Slide-over Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-ink-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-72 bg-forest-950 h-full shadow-2xl flex flex-col justify-between">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 text-ink-300 hover:text-white p-1 rounded-lg"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar
              activeTab={activeTab}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                setIsMobileMenuOpen(false);
              }}
              onOpenHelp={() => {
                setIsHelpOpen(true);
                setIsMobileMenuOpen(false);
              }}
              onOpenReset={() => {
                setIsResetOpen(true);
                setIsMobileMenuOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-[#0B1220]">
        {/* Top Header Bar */}
        <Topbar
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onOpenGuide={() => setIsHelpOpen(true)}
        />

        {/* Sub-header identity banner on non-overview pages */}
        {activeTab !== 'overview' && (
          <div className="bg-[#111C30]/85 border-b border-[#1E314F] py-2.5 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LivingMoneyOrbit size="mini" />
                <div className="text-xs text-ink-600 font-medium">
                  Active Sandbox &bull; Available Cash:{' '}
                  <strong className={`font-num font-bold ${metrics.availableCash < 0 ? 'text-red-400' : 'text-teal-400'}`}>
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
                className="text-xs font-semibold text-teal-400 hover:text-teal-300 underline flex items-center gap-1"
              >
                Open Decision Lab &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Main Routed Page Content */}
        <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {activeTab === 'overview' && (
            <Overview
              onNavigateToLab={() => setActiveTab('decision-lab')}
              onNavigateToInsights={() => setActiveTab('insights')}
              onNavigateToTransactions={() => setActiveTab('transactions')}
              onNavigateToBills={() => setActiveTab('budget')}
            />
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

        {/* Clean Luxury Editorial Footer */}
        <footer className="mt-auto border-t border-[#1E314F] py-5 text-xs text-ink-600 text-center space-y-1 bg-[#0B1220]/80">
          <div className="flex items-center justify-center gap-2">
            <span className="font-serif font-bold text-ink-900">RupeeOrbit</span>
            <span>&bull;</span>
            <span>30-Day ₹10,000 Financial Survival Challenge</span>
          </div>
          <p className="text-[11px] text-ink-600">
            Make the decision. See the consequences. Then commit.
          </p>
        </footer>
      </div>

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
      <RupeeOrbitMain />
    </FinancialProvider>
  );
}
