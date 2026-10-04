import type { ProvinceCode } from './types.js'

/**
 * The province or territory for the first letter of a postal code, from
 * Canada Post's table of postal districts. `X` is missing because the
 * Northwest Territories and Nunavut share it.
 */
const PROVINCE_BY_FIRST_LETTER: Readonly<Record<string, ProvinceCode>> = {
  A: 'NL',
  B: 'NS',
  C: 'PE',
  E: 'NB',
  G: 'QC',
  H: 'QC',
  J: 'QC',
  K: 'ON',
  L: 'ON',
  M: 'ON',
  N: 'ON',
  P: 'ON',
  R: 'MB',
  S: 'SK',
  T: 'AB',
  V: 'BC',
  Y: 'YT',
}

/**
 * The `X` forward sortation areas and the territory each one is in.
 */
const PROVINCE_BY_X_AREA: Readonly<Record<string, ProvinceCode>> = {
  X0A: 'NU',
  X0B: 'NU',
  X0C: 'NU',
  X0E: 'NT',
  X0G: 'NT',
  X1A: 'NT',
}

export { PROVINCE_BY_FIRST_LETTER, PROVINCE_BY_X_AREA }
