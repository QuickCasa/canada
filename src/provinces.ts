import type { Province } from './types.js'

/**
 * Every province and territory, in alphabetical order of the English name.
 * The French names are as the Canada Revenue Agency writes them.
 */
const PROVINCES: readonly Province[] = [
  {
    code: 'AB',
    englishName: 'Alberta',
    frenchName: 'Alberta',
    kind: 'province',
  },
  {
    code: 'BC',
    englishName: 'British Columbia',
    frenchName: 'Colombie-Britannique',
    kind: 'province',
  },
  {
    code: 'MB',
    englishName: 'Manitoba',
    frenchName: 'Manitoba',
    kind: 'province',
  },
  {
    code: 'NB',
    englishName: 'New Brunswick',
    frenchName: 'Nouveau-Brunswick',
    kind: 'province',
  },
  {
    code: 'NL',
    englishName: 'Newfoundland and Labrador',
    frenchName: 'Terre-Neuve-et-Labrador',
    kind: 'province',
  },
  {
    code: 'NT',
    englishName: 'Northwest Territories',
    frenchName: 'Territoires du Nord-Ouest',
    kind: 'territory',
  },
  {
    code: 'NS',
    englishName: 'Nova Scotia',
    frenchName: 'Nouvelle-Écosse',
    kind: 'province',
  },
  {
    code: 'NU',
    englishName: 'Nunavut',
    frenchName: 'Nunavut',
    kind: 'territory',
  },
  {
    code: 'ON',
    englishName: 'Ontario',
    frenchName: 'Ontario',
    kind: 'province',
  },
  {
    code: 'PE',
    englishName: 'Prince Edward Island',
    frenchName: 'Île-du-Prince-Édouard',
    kind: 'province',
  },
  {
    code: 'QC',
    englishName: 'Quebec',
    frenchName: 'Québec',
    kind: 'province',
  },
  {
    code: 'SK',
    englishName: 'Saskatchewan',
    frenchName: 'Saskatchewan',
    kind: 'province',
  },
  {
    code: 'YT',
    englishName: 'Yukon',
    frenchName: 'Yukon',
    kind: 'territory',
  },
]

export { PROVINCES }
