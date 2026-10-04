/**
 * The first day the sales tax history covers. Before it, British Columbia and
 * Prince Edward Island used different systems, and some provincial taxes were
 * charged on the price including GST.
 */
const EARLIEST_SALES_TAX_DATE = '2013-04-01'

/**
 * Rates are worked with as whole thousandths of a percent, so 9.975% is 9975
 * and 100% is 100,000. Every rate in the history fits exactly.
 */
const RATE_UNITS_PER_PERCENT = 1000
const RATE_UNITS_PER_WHOLE = 100 * RATE_UNITS_PER_PERCENT

const CALENDAR_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/u

export {
  CALENDAR_DATE_PATTERN,
  EARLIEST_SALES_TAX_DATE,
  RATE_UNITS_PER_PERCENT,
  RATE_UNITS_PER_WHOLE,
}
