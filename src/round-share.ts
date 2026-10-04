/**
 * Works out `cents × numerator ÷ denominator` and rounds it to a whole cent,
 * with halves rounded away from zero, as sales tax is usually rounded. The
 * math is done with BigInt, so it's exact for any whole number of cents.
 *
 * @param {number} cents A whole number of cents, which can be negative.
 * @param {number} numerator A whole number.
 * @param {number} denominator A whole number above zero.
 * @returns {number} The share, in whole cents.
 */
function roundShare(
  cents: number,
  numerator: number,
  denominator: number,
): number {
  const product = BigInt(cents) * BigInt(numerator)
  const divisor = BigInt(denominator)
  const quotient = product / divisor
  const remainder = product % divisor
  const absoluteRemainder = remainder < 0n ? -remainder : remainder

  if (absoluteRemainder * 2n < divisor) {
    return Number(quotient)
  }

  return Number(product < 0n ? quotient - 1n : quotient + 1n)
}

export { roundShare }
