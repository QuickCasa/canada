import type { ProvinceCode } from './types.js'

/**
 * Other ways people write a province or territory, on top of its code and its
 * English and French names. Each is written the way `normalizeName` reduces
 * it, so `P.E.I.` is `pei`.
 *
 * These are the traditional English abbreviations, the French ones that don't
 * clash with anything else, the codes Canada Post used before NL and the
 * common `YK` for Yukon. Two-letter US state codes that look like a province,
 * such as `NE`, are left out on purpose.
 */
const PROVINCE_ALIASES: Readonly<Record<string, ProvinceCode>> = {
  alta: 'AB',
  man: 'MB',
  newfoundland: 'NL',
  nfld: 'NL',
  nf: 'NL',
  tnl: 'NL',
  nwt: 'NT',
  tno: 'NT',
  ont: 'ON',
  pei: 'PE',
  ipe: 'PE',
  que: 'QC',
  pq: 'QC',
  sask: 'SK',
  cb: 'BC',
  yukonterritory: 'YT',
  yk: 'YT',
}

export { PROVINCE_ALIASES }
