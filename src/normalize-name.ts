const COMBINING_MARKS = /\p{Mark}/gu
const NON_ALPHANUMERIC = /[^\p{Letter}\p{Number}]/gu

/**
 * Reduces a name to lowercase letters and digits with the accents removed, so
 * `Île-du-Prince-Édouard`, `ile du prince edouard` and `ILE-DU-PRINCE-EDOUARD`
 * all compare equal.
 *
 * @param {string} name The name to reduce.
 * @returns {string} The reduced name.
 */
function normalizeName(name: string): string {
  return name
    .normalize('NFD')
    .replaceAll(COMBINING_MARKS, '')
    .replaceAll(NON_ALPHANUMERIC, '')
    .toLowerCase()
}

export { normalizeName }
