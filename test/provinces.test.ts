import { describe, expect, it } from 'vitest'
import {
  findProvince,
  getProvince,
  isProvinceCode,
  PROVINCES,
  type ProvinceCode,
} from '../src/index.js'

describe('PROVINCES', () => {
  it('lists 10 provinces and 3 territories with unique codes', () => {
    const codes = new Set(PROVINCES.map(province => province.code))

    expect(PROVINCES).toHaveLength(13)
    expect(codes.size).toBe(13)
    expect(
      PROVINCES.filter(province => province.kind === 'province'),
    ).toHaveLength(10)
    expect(
      PROVINCES.filter(province => province.kind === 'territory').map(
        province => province.code,
      ),
    ).toEqual(['NT', 'NU', 'YT'])
  })

  it('is in alphabetical order of the English name', () => {
    const names = PROVINCES.map(province => province.englishName)

    expect(names).toEqual(names.toSorted((a, b) => a.localeCompare(b, 'en')))
  })
})

describe('getProvince', () => {
  it('looks a province up by its code', () => {
    expect(getProvince('PE')).toEqual({
      code: 'PE',
      englishName: 'Prince Edward Island',
      frenchName: 'Île-du-Prince-Édouard',
      kind: 'province',
    })
  })

  it('throws for a code that is not a province', () => {
    expect(() => getProvince('XX' as ProvinceCode)).toThrow(RangeError)
  })
})

describe('isProvinceCode', () => {
  it('accepts the 13 codes only, in uppercase', () => {
    expect(isProvinceCode('ON')).toBe(true)
    expect(isProvinceCode('YT')).toBe(true)
    expect(isProvinceCode('on')).toBe(false)
    expect(isProvinceCode('YK')).toBe(false)
    expect(isProvinceCode('')).toBe(false)
  })
})

describe('findProvince', () => {
  it.each([
    ['ON', 'ON'],
    ['on', 'ON'],
    ['Ontario', 'ON'],
    ['  ONTARIO ', 'ON'],
    ['Ont.', 'ON'],
    ['Quebec', 'QC'],
    ['Québec', 'QC'],
    ['Que.', 'QC'],
    ['PQ', 'QC'],
    ['P.E.I.', 'PE'],
    ['Île-du-Prince-Édouard', 'PE'],
    ['ile du prince edouard', 'PE'],
    ['Newfoundland', 'NL'],
    ['Nfld.', 'NL'],
    ['Terre-Neuve-et-Labrador', 'NL'],
    ['N.W.T.', 'NT'],
    ['Territoires du Nord-Ouest', 'NT'],
    ['Colombie-Britannique', 'BC'],
    ['C.-B.', 'BC'],
    ['Nouvelle-Écosse', 'NS'],
    ['Yukon Territory', 'YT'],
    ['YK', 'YT'],
    ['Alta.', 'AB'],
    ['Sask', 'SK'],
    ['Man.', 'MB'],
  ])('finds %j as %s', (text, code) => {
    expect(findProvince(text)?.code).toBe(code)
  })

  it.each(['', 'Canada', 'Ontari', 'NE', 'NY', 'Labrador City'])(
    'finds nothing for %j',
    text => {
      expect(findProvince(text)).toBeUndefined()
    },
  )
})
