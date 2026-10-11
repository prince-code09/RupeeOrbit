/**
 * Indian Rupee and numeric formatters for RupeeOrbit
 */

// Convert Rupee value to integer paise to eliminate floating-point rounding errors
export function toPaise(rupees) {
  if (typeof rupees !== 'number' || !Number.isFinite(rupees)) {
    const parsed = Number(rupees);
    if (!Number.isFinite(parsed)) return 0;
    rupees = parsed;
  }
  return Math.round(rupees * 100);
}

// Convert integer paise back to rupees
export function fromPaise(paise) {
  if (typeof paise !== 'number' || !Number.isFinite(paise)) {
    const parsed = Number(paise);
    if (!Number.isFinite(parsed)) return 0;
    paise = parsed;
  }
  return paise / 100;
}

/**
 * Format an amount in Indian Rupee format (en-IN)
 * e.g., 10000 -> ₹10,000
 * -2500 -> -₹2,500
 */
export function formatCurrency(amount, includeDecimals = false) {
  const num = Number(amount) || 0;
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  const options = {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  };

  const formatted = new Intl.NumberFormat('en-IN', options).format(absNum);
  return isNegative ? `-${formatted}` : formatted;
}

/**
 * Format percentage
 */
export function formatPercentage(pct, decimals = 0) {
  const num = Number(pct) || 0;
  return `${num.toFixed(decimals)}%`;
}

/**
 * Format day label e.g., "Day 1", "Day 15"
 */
export function formatDay(dayNum) {
  return `Day ${dayNum}`;
}
