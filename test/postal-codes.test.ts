import { describe, expect, it } from 'vitest'
import { isPostalCode, parsePostalCode } from '../src/index.js'

describe('parsePostalCode', () => {
  it.each(['K1A 0B1', 'k1a0b1', '  k1a  0b1  ', 'K1A-0B1', 'k1a - 0b1'])(
    'parses %j',
    text => {
      expect(parsePostalCode(text)).toEqual({
        postalCode: 'K1A 0B1',
        forwardSortationArea: 'K1A',
        localDeliveryUnit: '0B1',
        province: 'ON',
      })
    },
  )

  it.each([
    ['A1C 5M2', 'NL'],
    ['B3H 4R2', 'NS'],
    ['C1A 7N8', 'PE'],
    ['E1C 4M3', 'NB'],
    ['G1R 4P5', 'QC'],
    ['H2X 1Y4', 'QC'],
    ['J4K 2T5', 'QC'],
    ['K1A 0A6', 'ON'],
    ['L5B 3C2', 'ON'],
    ['M5V 3L9', 'ON'],
    ['N2L 3G1', 'ON'],
    ['P3E 2C6', 'ON'],
    ['R3C 4T3', 'MB'],
    ['S4P 3V7', 'SK'],
    ['T2P 2M5', 'AB'],
    ['V6B 4Y8', 'BC'],
    ['Y1A 2C6', 'YT'],
    ['X1A 2L9', 'NT'],
    ['X0E 0N0', 'NT'],
    ['X0G 0A0', 'NT'],
    ['X0A 0H0', 'NU'],
    ['X0B 0C0', 'NU'],
    ['X0C 0G0', 'NU'],
  ])('puts %s in %s', (text, province) => {
    expect(parsePostalCode(text)?.province).toBe(province)
  })

  it('accepts an X area it does not know, with no province', () => {
    expect(parsePostalCode('X2A 1A1')).toEqual({
      postalCode: 'X2A 1A1',
      forwardSortationArea: 'X2A',
      localDeliveryUnit: '1A1',
      province: undefined,
    })
  })

  it('accepts W and Z after the first character', () => {
    expect(parsePostalCode('T2Z 1W1')?.postalCode).toBe('T2Z 1W1')
  })

  it.each([
    '',
    'K1A',
    'K1A 0B',
    'K1A 0B12',
    '12345',
    'K1A--0B1',
    'K1A 0B1 2',
    'KK1 0B1',
    'D1A 1A1',
    'F1A 1A1',
    'I1A 1A1',
    'O1A 1A1',
    'Q1A 1A1',
    'U1A 1A1',
    'W1A 1A1',
    'Z1A 1A1',
    'K1O 1A1',
    'K1A 1U1',
    'K1D 1A1',
  ])('rejects %j', text => {
    expect(parsePostalCode(text)).toBeUndefined()
  })
})

describe('isPostalCode', () => {
  it('matches parsePostalCode', () => {
    expect(isPostalCode('m5v3l9')).toBe(true)
    expect(isPostalCode('90210')).toBe(false)
  })
})
