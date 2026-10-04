import { PROVINCES } from './provinces.js'
import type { Province, ProvinceCode } from './types.js'

const PROVINCES_BY_CODE: ReadonlyMap<ProvinceCode, Province> = new Map(
  PROVINCES.map(province => [province.code, province]),
)

/**
 * Looks up a province or territory by its two-letter code.
 *
 * @param {ProvinceCode} code The two-letter code, such as `ON`.
 * @returns {Province} The province or territory.
 * @throws {RangeError} When the code isn't a province or territory code.
 */
function getProvince(code: ProvinceCode): Province {
  const province = PROVINCES_BY_CODE.get(code)

  if (province === undefined) {
    throw new RangeError(
      `"${String(code)}" isn't a province or territory code.`,
    )
  }

  return province
}

export { getProvince }
