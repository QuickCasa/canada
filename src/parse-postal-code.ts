import {
  PROVINCE_BY_FIRST_LETTER,
  PROVINCE_BY_X_AREA,
} from './postal-districts.js'
import type { PostalCode } from './types.js'

/**
 * Canada Post never uses D, F, I, O, Q or U, and never starts a postal code
 * with W or Z. The two halves can be run together or split by spaces or one
 * hyphen.
 */
const POSTAL_CODE_PATTERN =
  /^\s*([ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z])\s*-?\s*(\d[ABCEGHJ-NPRSTV-Z]\d)\s*$/u

/**
 * Parses a Canadian postal code typed in any common way, such as `k1a0b1`,
 * `K1A 0B1` or `K1A-0B1`, and works out the province or territory it's in.
 *
 * It checks the format and the letters Canada Post uses, not whether Canada
 * Post has actually assigned the code to an address.
 *
 * @param {string} text The text to parse.
 * @returns {PostalCode | undefined} The postal code, or `undefined` if the text
 *   isn't one.
 */
function parsePostalCode(text: string): PostalCode | undefined {
  const match = POSTAL_CODE_PATTERN.exec(text.toUpperCase())
  const forwardSortationArea = match?.[1]
  const localDeliveryUnit = match?.[2]

  if (forwardSortationArea === undefined || localDeliveryUnit === undefined) {
    return undefined
  }

  const firstLetter = forwardSortationArea.charAt(0)

  return {
    postalCode: `${forwardSortationArea} ${localDeliveryUnit}`,
    forwardSortationArea,
    localDeliveryUnit,
    province:
      firstLetter === 'X'
        ? PROVINCE_BY_X_AREA[forwardSortationArea]
        : PROVINCE_BY_FIRST_LETTER[firstLetter],
  }
}

export { parsePostalCode }
