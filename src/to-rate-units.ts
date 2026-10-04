import { RATE_UNITS_PER_PERCENT } from './constants.js'

/**
 * @param {number} percent A rate as a percentage, such as `9.975`.
 * @returns {number} The rate in whole thousandths of a percent, such as `9975`.
 */
function toRateUnits(percent: number): number {
  return Math.round(percent * RATE_UNITS_PER_PERCENT)
}

export { toRateUnits }
