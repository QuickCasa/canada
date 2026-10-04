import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  getSalesTaxRates,
  PROVINCES,
  type ProvinceCode,
  type SalesTaxKind,
} from '../src/index.js'

/**
 * @param {ProvinceCode} province The province to look up.
 * @param {string} date The date as YYYY-MM-DD.
 * @returns {number} The GST or HST rate on that date.
 */
function getFederalPercent(province: ProvinceCode, date: string): number {
  const component = getSalesTaxRates(province, { date }).components.find(
    candidate => candidate.kind === 'GST' || candidate.kind === 'HST',
  )

  return component?.percent ?? NaN
}

/**
 * The GST/HST column of the Canada Revenue Agency's rate table, for one day in
 * each period it lists.
 */
const CRA_GST_HST_TABLE: Readonly<
  Record<string, Readonly<Record<ProvinceCode, number>>>
> = {
  '2014-06-15': {
    AB: 5,
    BC: 5,
    MB: 5,
    NB: 13,
    NL: 13,
    NS: 15,
    NT: 5,
    NU: 5,
    ON: 13,
    PE: 14,
    QC: 5,
    SK: 5,
    YT: 5,
  },
  '2016-08-15': {
    AB: 5,
    BC: 5,
    MB: 5,
    NB: 15,
    NL: 15,
    NS: 15,
    NT: 5,
    NU: 5,
    ON: 13,
    PE: 14,
    QC: 5,
    SK: 5,
    YT: 5,
  },
  '2020-06-15': {
    AB: 5,
    BC: 5,
    MB: 5,
    NB: 15,
    NL: 15,
    NS: 15,
    NT: 5,
    NU: 5,
    ON: 13,
    PE: 15,
    QC: 5,
    SK: 5,
    YT: 5,
  },
  '2026-06-15': {
    AB: 5,
    BC: 5,
    MB: 5,
    NB: 15,
    NL: 15,
    NS: 14,
    NT: 5,
    NU: 5,
    ON: 13,
    PE: 15,
    QC: 5,
    SK: 5,
    YT: 5,
  },
}

afterEach(() => {
  vi.useRealTimers()
})

describe('getSalesTaxRates', () => {
  it.each(Object.entries(CRA_GST_HST_TABLE))(
    "matches the CRA's GST/HST table on %s",
    (date, table) => {
      for (const province of PROVINCES) {
        expect(getFederalPercent(province.code, date), province.code).toBe(
          table[province.code],
        )
      }
    },
  )

  it.each<[ProvinceCode, number, SalesTaxKind[]]>([
    ['AB', 5, ['GST']],
    ['BC', 12, ['GST', 'PST']],
    ['MB', 12, ['GST', 'RST']],
    ['NB', 15, ['HST']],
    ['NL', 15, ['HST']],
    ['NS', 14, ['HST']],
    ['NT', 5, ['GST']],
    ['NU', 5, ['GST']],
    ['ON', 13, ['HST']],
    ['PE', 15, ['HST']],
    ['QC', 14.975, ['GST', 'QST']],
    ['SK', 11, ['GST', 'PST']],
    ['YT', 5, ['GST']],
  ])('gives %s a total of %d%% in 2026', (province, totalPercent, kinds) => {
    const rates = getSalesTaxRates(province, { date: '2026-10-04' })

    expect(rates.totalPercent).toBe(totalPercent)
    expect(rates.components.map(component => component.kind)).toEqual(kinds)
    expect(rates.effectiveTo).toBeUndefined()
  })

  it.each<[ProvinceCode, string, number, number]>([
    ['MB', '2013-07-01', 12, 13],
    ['MB', '2019-07-01', 13, 12],
    ['NB', '2016-07-01', 13, 15],
    ['NL', '2016-07-01', 13, 15],
    ['PE', '2016-10-01', 14, 15],
    ['SK', '2017-03-23', 10, 11],
    ['NS', '2025-04-01', 15, 14],
  ])(
    'changes %s on %s from %d%% to %d%%',
    (province, changeDate, before, after) => {
      const dayBefore = new Date(
        Date.parse(`${changeDate}T00:00:00Z`) - 86_400_000,
      )
        .toISOString()
        .slice(0, 10)
      const earlier = getSalesTaxRates(province, { date: dayBefore })
      const later = getSalesTaxRates(province, { date: changeDate })

      expect(earlier.totalPercent).toBe(before)
      expect(earlier.effectiveTo).toBe(dayBefore)
      expect(later.totalPercent).toBe(after)
      expect(later.effectiveFrom).toBe(changeDate)
    },
  )

  it('gives the period the rates applied in', () => {
    expect(getSalesTaxRates('MB', { date: '2015-01-01' })).toEqual({
      province: 'MB',
      date: '2015-01-01',
      effectiveFrom: '2013-07-01',
      effectiveTo: '2019-06-30',
      components: [
        { kind: 'GST', name: 'Goods and services tax', percent: 5 },
        { kind: 'RST', name: 'Retail sales tax', percent: 8 },
      ],
      totalPercent: 13,
    })
  })

  it('works from April 1, 2013', () => {
    expect(getSalesTaxRates('BC', { date: '2013-04-01' }).totalPercent).toBe(12)
  })

  it('defaults to the local calendar date', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 2, 31, 23, 59))

    const rates = getSalesTaxRates('NS')

    expect(rates.date).toBe('2025-03-31')
    expect(rates.totalPercent).toBe(15)
  })

  it.each([
    '2013-03-31',
    '2025-02-30',
    '2025-13-01',
    '2025-1-1',
    '20250101',
    '',
  ])('rejects the date %j', date => {
    expect(() => getSalesTaxRates('ON', { date })).toThrow(RangeError)
  })

  it('rejects a code that is not a province', () => {
    expect(() => getSalesTaxRates('on' as ProvinceCode)).toThrow(RangeError)
  })
})
