import { assertCents } from './assert-cents.js'
import { calculateSalesTax } from './calculate-sales-tax.js'
import { RATE_UNITS_PER_WHOLE } from './constants.js'
import { getSalesTaxRates } from './get-sales-tax-rates.js'
import { roundShare } from './round-share.js'
import { sumRateUnits } from './sum-rate-units.js'
import { toRateUnits } from './to-rate-units.js'
import type {
  ProvinceCode,
  SalesTaxCalculation,
  SalesTaxOptions,
} from './types.js'

/**
 * How far either side of the estimate to look for an amount before tax that
 * gives the price exactly. Each tax rounds by at most half a cent, so the
 * estimate is never more than a couple of cents out.
 */
const SEARCH_RADIUS_CENTS = 3

/**
 * Splits a price that already includes sales tax into the amount before tax
 * and each tax. The parts always add up to the price exactly.
 *
 * When there is an amount before tax that `calculateSalesTax` turns into this
 * exact price, that amount and its taxes are returned, so the split matches a
 * receipt worked forward. There is never more than one.
 *
 * Some prices can't be reached that way, because rounding makes the total jump
 * by two cents between neighbouring amounts. For those, each tax is the price
 * times its rate over 100 plus the total rate, which the Canada Revenue Agency
 * calls the tax fraction, rounded to the cent with halves away from zero, and
 * the amount before tax is whatever is left.
 *
 * @param {number} totalCents The price including tax, in whole cents.
 * @param {ProvinceCode} province The two-letter code, such as `ON`.
 * @param {SalesTaxOptions} [options] The date to use the rates of. Defaults to
 *   today.
 * @returns {SalesTaxCalculation} Each tax, the total tax and the amount before
 *   tax.
 * @throws {RangeError} When the price isn't whole cents, or for any reason
 *   `getSalesTaxRates` throws.
 */
function splitTaxIncludedAmount(
  totalCents: number,
  province: ProvinceCode,
  options: SalesTaxOptions = {},
): SalesTaxCalculation {
  assertCents(totalCents, 'price including tax')

  const rates = getSalesTaxRates(province, options)
  const denominator = RATE_UNITS_PER_WHOLE + sumRateUnits(rates.components)
  const estimate = roundShare(totalCents, RATE_UNITS_PER_WHOLE, denominator)
  const datedOptions = { date: rates.date }

  for (
    let subtotalCents = estimate - SEARCH_RADIUS_CENTS;
    subtotalCents <= estimate + SEARCH_RADIUS_CENTS;
    subtotalCents += 1
  ) {
    const forward = calculateSalesTax(subtotalCents, province, datedOptions)

    if (forward.totalCents === totalCents) {
      return forward
    }
  }

  const lines = rates.components.map(component => ({
    ...component,
    cents: roundShare(totalCents, toRateUnits(component.percent), denominator),
  }))
  const taxCents = lines.reduce((total, line) => total + line.cents, 0)

  return {
    province: rates.province,
    date: rates.date,
    subtotalCents: totalCents - taxCents,
    lines,
    taxCents,
    totalCents,
  }
}

export { splitTaxIncludedAmount }
