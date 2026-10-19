/**
 * Indian Rupee (INR) Formatting Utilities
 * Adheres to Indian numbering system (Lakhs and Crores, en-IN locale).
 */

export interface FormatINROptions {
  /** Explicit number of decimal places (default: 0 if integer, 2 if has decimals) */
  decimals?: number;
  /** Whether to format large values compactly (e.g., ₹1.42 Cr or ₹2.5 Lakh) */
  compact?: boolean;
}

/**
 * Format a numeric amount into Indian Rupees (₹) with en-IN numbering.
 * Examples:
 *   formatINR(75000) => "₹75,000"
 *   formatINR(150000) => "₹1,50,000"
 *   formatINR(250000) => "₹2,50,000"
 *   formatINR(500, { decimals: 2 }) => "₹500.00"
 */
export const formatINR = (amount: number, options?: FormatINROptions): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }

  if (options?.compact) {
    if (Math.abs(amount) >= 10000000) {
      return `₹${(amount / 10000000).toLocaleString('en-IN', { maximumFractionDigits: 2 })} Cr`;
    }
    if (Math.abs(amount) >= 100000) {
      return `₹${(amount / 100000).toLocaleString('en-IN', { maximumFractionDigits: 2 })} Lakh`;
    }
  }

  const decimals = options?.decimals !== undefined 
    ? options.decimals 
    : (Number.isInteger(amount) ? 0 : 2);

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(amount);
};

/**
 * Format raw numbers according to the Indian numbering system without currency symbol.
 * Example: 150000 => "1,50,000"
 */
export const formatNumberIN = (num: number, decimals: number = 0): string => {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
};
