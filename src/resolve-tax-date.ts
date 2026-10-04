import { CALENDAR_DATE_PATTERN, EARLIEST_SALES_TAX_DATE } from './constants.js'

/**
 * @param {Date} date A moment in time.
 * @returns {string} The local calendar date of that moment, as `YYYY-MM-DD`.
 */
function toLocalCalendarDate(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

/**
 * Checks the date a sales tax lookup was asked for, or picks today's.
 *
 * @param {string | undefined} date The date as `YYYY-MM-DD`, or `undefined`
 *   for today in the local time zone.
 * @param {Date} now The current moment, used when no date is given.
 * @returns {string} The date to use, as `YYYY-MM-DD`.
 * @throws {RangeError} When the date isn't a real `YYYY-MM-DD` date, or is
 *   before the history starts.
 */
function resolveTaxDate(date: string | undefined, now: Date): string {
  const resolved = date ?? toLocalCalendarDate(now)
  const match = CALENDAR_DATE_PATTERN.exec(resolved)
  const year = Number(match?.[1])
  const month = Number(match?.[2])
  const day = Number(match?.[3])
  const parsed = new Date(Date.UTC(year, month - 1, day))

  if (
    match === null ||
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    throw new RangeError(
      `"${resolved}" isn't a date. Write dates as YYYY-MM-DD, such as 2026-04-01.`,
    )
  }

  if (resolved < EARLIEST_SALES_TAX_DATE) {
    throw new RangeError(
      `Sales tax rates are only available from ${EARLIEST_SALES_TAX_DATE}, not for ${resolved}.`,
    )
  }

  return resolved
}

export { resolveTaxDate }
