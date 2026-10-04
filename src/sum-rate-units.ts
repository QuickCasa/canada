import { toRateUnits } from './to-rate-units.js'
import type { SalesTaxComponent } from './types.js'

/**
 * Adds up the rates of some tax components in whole thousandths of a percent,
 * so 5% and 9.975% make exactly 14975 with no floating point noise.
 *
 * @param {readonly SalesTaxComponent[]} components The components to add up.
 * @returns {number} The combined rate in thousandths of a percent.
 */
function sumRateUnits(components: readonly SalesTaxComponent[]): number {
  return components.reduce(
    (total, component) => total + toRateUnits(component.percent),
    0,
  )
}

export { sumRateUnits }
