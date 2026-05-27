/**
 * Shared formatting utilities.
 */

/** Format a number as Indian rupees: ₹1,23,456 */
export function fmt(num) {
  if (num === null || num === undefined || isNaN(num)) return '₹0'
  return '₹' + Math.round(num).toLocaleString('en-IN')
}

/** Format without the ₹ symbol */
export function fmtNum(num) {
  if (!num) return '0'
  return Math.round(num).toLocaleString('en-IN')
}

/** Convert any input value to a number (empty string → 0) */
export function toNum(val) {
  const n = Number(val)
  return isNaN(n) ? 0 : n
}

/** Sum 80C investments from state */
export function calc80CTotal(data) {
  return data.has80CItems.reduce((sum, key) => sum + toNum(data.investments80C[key]), 0)
}
