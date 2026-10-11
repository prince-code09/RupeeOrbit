# LEDGERLY — 30-Day Financial Survival & Decision Simulator

> **Core Promise:** *“Make the decision. See the consequences. Then commit.”*

Ledgerly is an editorial fintech application designed for students and Gen Z users navigating a tight financial horizon: surviving 30 days on an initial budget of **₹10,000**.

Unlike generic retrospective expense trackers that simply report money you've already lost, Ledgerly features an isolated **financial Decision Lab** that calculates the future consequences of financial choices before you commit hard cash.

---

## 🌟 Key Features

1. **The Decision Lab (Scenario Simulator)**
   - Sandbox environment that models candidate financial actions without mutating live state.
   - Test purchases, recurring subscriptions, emergency shocks, income gigs, and savings transfers.
   - Side-by-side **Before vs After** impact analysis: Available Cash, Reserved Commitments, Safe Daily Allowance, Day-30 Forecast, Risk Score, and Health Score.
   - Deterministic verdicts: `Affordable`, `Manageable but tight`, `High risk`, and `Unsustainable under current plan`.
   - Single-commit protection prevents accidental duplicate commits.
   - Quick 1-click presets for benchmark scenarios:
     - ₹999 Monthly Streaming Subscription
     - ₹2,000 Emergency Health/Dental Shock
     - +₹1,500 Freelance Inflow

2. **Living Money Orbit (Signature Visual)**
   - Persistent, slowly animated, dimensional financial object evoking money flowing through a balanced equilibrium.
   - Layered translucent illuminated financial tokens with embossed Rupee (`₹`) engraving, counter-rotating orbital rings, and travelling glowing particles.
   - Deep charcoal shadow casting and soft ambient mint radiance.
   - Full decorative panel on Overview desktop, compact visual anchor on subpages, and minimalist badge on mobile.
   - Pure CSS/SVG implementation with zero heavyweight 3D library overhead.
   - Full `prefers-reduced-motion` compliance.

3. **Coherent 3-Bucket Liquidity Ledger**
   - **Bucket 1: Actual Liquid Cash** = `Starting Cash (₹10,000) + Received Income - Actual Expenses - Savings Transfers`.
   - **Bucket 2: Reserved Commitments** = Active scheduled bills due between current day and Day 30 not yet paid.
   - **Bucket 3: Projected Day-30 Cushion** = Net cash on Day 30 after all upcoming commitments are honored.

4. **Dynamic Safe Daily Allowance**
   - Dynamically recalculates discretionary spending allowance per remaining day:
     $$\text{Safe Daily Allowance} = \frac{\max(0, \text{True Uncommitted Cash})}{\max(1, \text{Remaining Days})}$$

5. **Zero Double-Counting Recurring Engine**
   - Future commitments are scheduled and reserved in the forecast without prematurely debiting liquid cash.
   - Paying a bill marks the occurrence as paid and creates an actual expense transaction.
   - Once paid, the commitment is not deducted again for that cycle.
   - Pausing a commitment prevents future occurrences while preserving ledger history.

6. **Explainable Risk & Health Scores**
   - **Risk Score (0–100):** Evaluated from Day-30 deficit hazard, discretionary daily allowance strain, fixed debt ratio, and emergency reserves.
   - **Health Score (0–100):** Weighted composite of Day-30 solvency (40%), daily margin comfort (30%), category budget discipline (15%), and savings goal progress (15%).
   - Transparent factor breakdown modals available directly in the UI.

7. **Category Budget Planner & Savings Buffers**
   - 8 realistic student/living categories with customizable limits and progress indicators.
   - Savings goals treated as balance-sheet transfers (reducing available cash without false consumption spending).

8. **Money-Coach Insights & Sensitivity Simulator**
   - Interactive slider testing discretionary reductions (e.g. ₹50/day trim impact across remaining days).
   - Emergency shock templates (Medical, Tech repairs, Travel, Exam kits).

---

## 🎨 Design System & Palette

- **Paper / Parchment Surfaces:** Warm ivory `#FAF8F5`, `#F5F2EB`, `#EBE5D8`
- **Typography:** Editorial serif `Playfair Display`, UI sans `Plus Jakarta Sans`, tabular numerals `JetBrains Mono`
- **Muted Mint / Emerald:** `#106B52`, `#1EA67E`, `#DDF7ED` (positive liquidity and signature aura)
- **Restrained Terracotta:** `#CF563C`, `#B53C24`, `#FDF6F4` (risk and warnings)
- **Warm Metallic Amber:** `#D97706`, `#F59E0B`, `#FCD34D` (commitments and token rims)
- Indian Rupee (`₹`) formatting across all metrics.

---

## 🛠️ Technology Stack

- **Framework:** React 18 + Vite 5
- **Styling:** Tailwind CSS + PostCSS + Modular CSS Tokens
- **Icons:** Lucide React
- **Data Visualization:** Recharts (30-day responsive cash-flow trajectory)
- **State & Persistence:** React Context + HTML5 LocalStorage with validation and safe recovery
- **Testing:** Vitest 2 + React Testing Library + JSDOM

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended; developed on Node v24)
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/ledgerly-survival.git

# Enter project directory
cd frontend

# Install dependencies
npm install
```

### Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### Run Test Suite
```bash
npm run test
```
Runs all 16 Vitest unit and integration tests covering financial calculations, scenario isolation, commit protection, double-counting safeguards, and LocalStorage persistence.

### Production Build
```bash
npm run build
```
Creates an optimized production bundle in `/dist`.

### Preview Production Build
```bash
npm run preview
```

---

## 📂 Architecture

```
frontend/
├── index.html                   # HTML entry point with Google Fonts
├── package.json                 # Dependencies and scripts
├── vite.config.js               # Vite & Vitest test config
├── tailwind.config.js           # Editorial fintech palette & animation tokens
├── postcss.config.js            # PostCSS pipeline
├── src/
│   ├── main.jsx                 # React root mount
│   ├── App.jsx                  # Main application shell & tab routing
│   ├── styles/
│   │   └── index.css            # Base styles, scrollbars, reduced-motion rules
│   ├── engine/
│   │   └── financialEngine.js   # Single source of truth: pure financial math & simulation
│   ├── data/
│   │   └── seedData.js          # Default ₹10,000 / 30-day challenge state
│   ├── context/
│   │   └── FinancialContext.jsx # State management, CRUD actions & LocalStorage persistence
│   ├── components/
│   │   ├── LivingMoneyOrbit.jsx # Signature visual effect (3D tokens, orbit rings, particles)
│   │   ├── Navbar.jsx           # Topbar, day switcher, mobile drawer navigation
│   │   ├── FirstRunModal.jsx    # Challenge orientation & introductory rules
│   │   └── ResetConfirmModal.jsx# Reset confirmation dialog
│   ├── pages/
│   │   ├── Overview.jsx         # Dashboard, 3 liquidity buckets, Recharts timeline
│   │   ├── DecisionLab.jsx      # Scenario simulator, Before vs After, single-commit
│   │   ├── Transactions.jsx     # Searchable, filterable ledger with CRUD
│   │   ├── BudgetPlanner.jsx    # Category limits & recurring commitments
│   │   ├── SavingsGoals.jsx     # Goal buffers & cash transfers
│   │   └── Insights.jsx         # Sensitivity slider & shock stress tests
│   ├── utils/
│   │   └── formatters.js        # Indian Rupee (₹) formatting & integer paise helpers
│   └── tests/
│       ├── setup.js             # Vitest jsdom setup & mocks
│       ├── financialEngine.test.js # Core calculation & scenario test suite
│       └── appAndPersistence.test.jsx # UI integration, persistence & reset tests
```

---

## ☁️ Deployment Instructions (Vercel)

1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: complete Ledgerly financial survival application"
   git remote add origin https://github.com/your-username/ledgerly-survival.git
   git push -u origin main
   ```
2. Log in to [Vercel](https://vercel.com).
3. Click **Add New Project** and import the repository.
4. Framework Preset: **Vite**.
5. Build Command: `npm run build`.
6. Output Directory: `dist`.
7. Click **Deploy**.

*Note on LocalStorage:* LocalStorage is used for client-side persistence and demo exploration; no backend secrets or external keys are required.
