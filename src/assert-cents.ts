/**
 * @param {number} cents The amount to check.
 * @param {string} label What the amount is, for the error message.
 * @throws {RangeError} When the amount isn't a whole number of cents.
 */
function assertCents(cents: number, label: string): void {
  if (!Number.isSafeInteger(cents)) {
    throw new RangeError(
      `The ${label} must be a whole number of cents, such as 1999 for $19.99, not ${String(cents)}.`,
    )
  }
}

export { assertCents }
