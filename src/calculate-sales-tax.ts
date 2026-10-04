import { assertCents } from './assert-cents.js'
import { RATE_UNITS_PER_WHOLE } from './constants.js'
import { getSalesTaxRates } from './get-sales-tax-rates.js'
import { roundShare } from './round-share.js'
import { toRateUnits } from './to-rate-units.js'
import type {
  ProvinceCode,
  SalesTaxCalculation,
  SalesTaxOptions,
} from './types.js'

/**
 * Adds sales tax to an amount before tax. Each tax is worked out on the amount
 * before tax and rounded to the cent on its own, halves away from zero, so a
 * receipt can show each one.
 *
 * Negative amounts, such as refunds, are taxed the same way and give negative
 * taxes.
 *
 * @param {number} subtotalCents The amount before tax, in whole cents.
 * @param {ProvinceCode} province The two-letter code, such as `ON`.
 * @param {SalesTaxOptions} [options] The date to use the rates of. Defaults to
 *   today.
 * @returns {SalesTaxCalculation} Each tax, the total tax and the total.
 * @throws {RangeError} When the amount isn't whole cents, or for any reason
 *   `getSalesTaxRates` throws.
 */
function calculateSalesTax(
  subtotalCents: number,
  province: ProvinceCode,
  options: SalesTaxOptions = {},
): SalesTaxCalculation {
  assertCents(subtotalCents, 'amount before tax')

  const rates = getSalesTaxRates(province, options)
  const lines = rates.components.map(component => ({
    ...component,
    cents: roundShare(
      subtotalCents,
      toRateUnits(component.percent),
      RATE_UNITS_PER_WHOLE,
    ),
  }))
  const taxCents = lines.reduce((total, line) => total + line.cents, 0)

  return {
    province: rates.province,
    date: rates.date,
    subtotalCents,
    lines,
    taxCents,
    totalCents: subtotalCents + taxCents,
  }
}

export { calculateSalesTax }
