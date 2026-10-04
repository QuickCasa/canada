import { normalizeName } from './normalize-name.js'
import { PROVINCE_ALIASES } from './province-aliases.js'
import { PROVINCES } from './provinces.js'
import type { Province } from './types.js'

const PROVINCES_BY_NAME: ReadonlyMap<string, Province> = new Map([
  ...PROVINCES.flatMap(province =>
    [province.code, province.englishName, province.frenchName].map(
      name => [normalizeName(name), province] as const,
    ),
  ),
  ...Object.entries(PROVINCE_ALIASES).flatMap(([alias, code]) => {
    const province = PROVINCES.find(candidate => candidate.code === code)

    return province === undefined ? [] : [[alias, province] as const]
  }),
])

/**
 * Finds the province or territory that a piece of text names, the way people
 * type it into a form: a code, the English or French name or a common
 * abbreviation, in any case, with or without accents and punctuation. `on`,
 * `Ontario`, `P.E.I.`, `Quebec` and `québec` all match.
 *
 * @param {string} text The text to match.
 * @returns {Province | undefined} The province or territory, or `undefined` if
 *   the text doesn't name one.
 */
function findProvince(text: string): Province | undefined {
  return PROVINCES_BY_NAME.get(normalizeName(text))
}

export { findProvince }
