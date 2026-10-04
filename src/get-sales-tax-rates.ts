import { RATE_UNITS_PER_PERCENT } from './constants.js'
import { getDayBefore } from './get-day-before.js'
import { isProvinceCode } from './is-province-code.js'
import { resolveTaxDate } from './resolve-tax-date.js'
import { SALES_TAX_HISTORY } from './sales-tax-history.js'
import { sumRateUnits } from './sum-rate-units.js'
import type { ProvinceCode, SalesTaxOptions, SalesTaxRates } from './types.js'

/**
 * Looks up the general sales tax rates for a province or territory on a date:
 * GST alone, HST alone, or GST plus the provincial tax.
 *
 * These are the rates most goods and services are taxed at. Some are exempt,
 * zero-rated or taxed at a special rate, and which province's rates apply to a
 * sale depends on the place of supply rules. This only gives the rates.
 *
 * @param {ProvinceCode} province The two-letter code, such as `ON`.
 * @param {SalesTaxOptions} [options] The date to use the rates of. Defaults to
 *   today.
 * @returns {SalesTaxRates} The rates, and the dates they applied between.
 * @throws {RangeError} When the province isn't a code, the date isn't a
 *   `YYYY-MM-DD` date, or the date is before April 1, 2013.
 */
function getSalesTaxRates(
  province: ProvinceCode,
  options: SalesTaxOptions = {},
): SalesTaxRates {
  if (!isProvinceCode(province)) {
    throw new RangeError(
      `"${String(province)}" isn't a province or territory code.`,
    )
  }

  const date = resolveTaxDate(options.date, new Date())
  const periods = SALES_TAX_HISTORY[province]
  const index = periods.findLastIndex(period => period.from <= date)
  const period = periods[index]

  if (period === undefined) {
    throw new RangeError(`There are no sales tax rates for ${date}.`)
  }

  const nextPeriod = periods[index + 1]

  return {
    province,
    date,
    effectiveFrom: period.from,
    effectiveTo:
      nextPeriod === undefined ? undefined : getDayBefore(nextPeriod.from),
    components: period.components,
    totalPercent: sumRateUnits(period.components) / RATE_UNITS_PER_PERCENT,
  }
}

export { getSalesTaxRates }
