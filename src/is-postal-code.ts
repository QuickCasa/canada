import { parsePostalCode } from './parse-postal-code.js'

/**
 * Checks whether text is a Canadian postal code, typed in any common way. See
 * `parsePostalCode` for what counts.
 *
 * @param {string} text The text to check.
 * @returns {boolean} Whether the text is a postal code.
 */
function isPostalCode(text: string): boolean {
  return parsePostalCode(text) !== undefined
}

export { isPostalCode }
