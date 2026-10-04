import { PROVINCES } from './provinces.js'
import type { ProvinceCode } from './types.js'

const PROVINCE_CODES: ReadonlySet<string> = new Set(
  PROVINCES.map(province => province.code),
)

/**
 * Checks whether a value is one of the 13 two-letter province and territory
 * codes. It's case-sensitive, so `on` is not a code but `ON` is. Use
 * `findProvince` to match looser input.
 *
 * @param {string} value The value to check.
 * @returns {boolean} Whether the value is a province or territory code.
 */
function isProvinceCode(value: string): value is ProvinceCode {
  return PROVINCE_CODES.has(value)
}

export { isProvinceCode }
