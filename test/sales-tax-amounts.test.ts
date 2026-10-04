import { describe, expect, it } from 'vitest'
import {
  calculateSalesTax,
  PROVINCES,
  splitTaxIncludedAmount,
} from '../src/index.js'

const DATE = '2026-10-04'

/**
 * A small seeded random number generator (mulberry32), so the randomized
 * checks run the same cases every time.
 *
 * @param {number} seed The starting seed.
 * @returns {() => number} A function returning numbers from 0 up to 1.
 */
function createRandom(seed: number): () => number {
  let state = seed

  return () => {
    state = Math.trunc(state + 0x6d_2b_79_f5)

    let value = Math.imul(state ^ (state >>> 15), 1 | state)

    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value)

    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296
  }
}

describe('calculateSalesTax', () => {
  it('adds HST', () => {
    expect(calculateSalesTax(1000, 'ON', { date: DATE })).toEqual({
      province: 'ON',
      date: DATE,
      subtotalCents: 1000,
      lines: [
        {
          kind: 'HST',
          name: 'Harmonized sales tax',
          percent: 13,
          cents: 130,
        },
      ],
      taxCents: 130,
      totalCents: 1130,
    })
  })

  it('rounds each tax on its own, halves away from zero', () => {
    const calculation = calculateSalesTax(10_000, 'QC', { date: DATE })

    expect(calculation.lines.map(line => line.cents)).toEqual([500, 998])
    expect(calculation.totalCents).toBe(11_498)
  })

  it('rounds a refund the same way as a sale', () => {
    expect(
      calculateSalesTax(-2000, 'QC', { date: DATE }).lines.map(
        line => line.cents,
      ),
    ).toEqual([-100, -200])
    expect(
      calculateSalesTax(2000, 'QC', { date: DATE }).lines.map(
        line => line.cents,
      ),
    ).toEqual([100, 200])
  })

  it('adds GST and PST', () => {
    const calculation = calculateSalesTax(1999, 'BC', { date: DATE })

    expect(calculation.lines.map(line => [line.kind, line.cents])).toEqual([
      ['GST', 100],
      ['PST', 140],
    ])
    expect(calculation.totalCents).toBe(2239)
  })

  it('uses the rates on the date given', () => {
    expect(
      calculateSalesTax(10_000, 'NS', { date: '2025-03-31' }).taxCents,
    ).toBe(1500)
    expect(
      calculateSalesTax(10_000, 'NS', { date: '2025-04-01' }).taxCents,
    ).toBe(1400)
  })

  it('stays exact for large amounts', () => {
    expect(
      calculateSalesTax(123_456_789_012_345, 'QC', { date: DATE }).lines.map(
        line => line.cents,
      ),
    ).toEqual([6_172_839_450_617, 12_314_814_703_981])
  })

  it.each([19.99, NaN, Infinity, 2 ** 53])(
    'rejects %d as an amount',
    amount => {
      expect(() => calculateSalesTax(amount, 'ON', { date: DATE })).toThrow(
        RangeError,
      )
    },
  )
})

describe('splitTaxIncludedAmount', () => {
  it('takes HST out of a price', () => {
    expect(splitTaxIncludedAmount(11_300, 'ON', { date: DATE })).toEqual({
      province: 'ON',
      date: DATE,
      subtotalCents: 10_000,
      lines: [
        {
          kind: 'HST',
          name: 'Harmonized sales tax',
          percent: 13,
          cents: 1300,
        },
      ],
      taxCents: 1300,
      totalCents: 11_300,
    })
  })

  it('takes GST and QST out of a price', () => {
    const split = splitTaxIncludedAmount(11_498, 'QC', { date: DATE })

    expect(split.lines.map(line => line.cents)).toEqual([500, 998])
    expect(split.subtotalCents).toBe(10_000)
  })

  it('uses the tax fraction for a price no amount before tax reaches', () => {
    const totals = [888, 889].map(
      subtotal => calculateSalesTax(subtotal, 'ON', { date: DATE }).totalCents,
    )

    expect(totals).toEqual([1003, 1005])
    expect(splitTaxIncludedAmount(1004, 'ON', { date: DATE })).toMatchObject({
      subtotalCents: 888,
      taxCents: 116,
    })
  })

  it('always adds up, and matches working forward whenever it can', () => {
    const random = createRandom(20_261_004)
    let exactMatches = 0
    const cases = 5000

    for (let index = 0; index < cases; index += 1) {
      const province =
        PROVINCES[Math.floor(random() * PROVINCES.length)]?.code ?? 'ON'
      const totalCents = Math.floor(random() * 10_000_000) - 1_000_000
      const split = splitTaxIncludedAmount(totalCents, province, { date: DATE })
      const lineTotal = split.lines.reduce((sum, line) => sum + line.cents, 0)
      const forward = calculateSalesTax(split.subtotalCents, province, {
        date: DATE,
      })

      expect(split.subtotalCents + lineTotal).toBe(totalCents)
      expect(split.taxCents).toBe(lineTotal)

      if (forward.totalCents === totalCents) {
        exactMatches += 1
        expect(split).toEqual(forward)
      } else {
        expect(Math.abs(forward.totalCents - totalCents)).toBeLessThanOrEqual(2)
      }
    }

    expect(exactMatches / cases).toBeGreaterThan(0.85)
  })
})
