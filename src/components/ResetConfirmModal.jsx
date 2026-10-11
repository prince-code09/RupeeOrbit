import React, { useEffect } from 'react';
import { AlertTriangle, RotateCcw, X } from 'lucide-react';

export default function ResetConfirmModal({ isOpen, onClose, onConfirm }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-modal-title"
    >
      <div className="relative w-full max-w-md bg-parchment-50 border border-parchment-300 rounded-2xl shadow-floating p-6">
        <button
          onClick={onClose}
          aria-label="Cancel reset"
          className="absolute top-4 right-4 text-ink-400 hover:text-ink-800 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-terracotta-100 text-terracotta-700 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 id="reset-modal-title" className="text-xl font-serif font-bold text-ink-900">
          Reset Demo Data?
        </h3>

        <p className="text-sm text-ink-600 mt-2 leading-relaxed">
          This will restore Ledgerly to the initial ₹10,000 challenge starting state (Day 4 baseline). All custom transactions, simulated decisions, and adjusted goals will be cleared.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-ink-700 hover:text-ink-900 hover:bg-parchment-200 rounded-xl transition-colors"
          >
            Keep My Data
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-terracotta-600 hover:bg-terracotta-700 rounded-xl shadow-subtle transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to ₹10k Seed
          </button>
        </div>
      </div>
    </div>
  );
}
