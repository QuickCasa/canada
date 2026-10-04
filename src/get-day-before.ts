const MILLISECONDS_PER_DAY = 86_400_000

/**
 * @param {string} date A date as `YYYY-MM-DD`.
 * @returns {string} The day before it, as `YYYY-MM-DD`.
 */
function getDayBefore(date: string): string {
  const time = Date.parse(`${date}T00:00:00Z`) - MILLISECONDS_PER_DAY

  return new Date(time).toISOString().slice(0, 10)
}

export { getDayBefore }
