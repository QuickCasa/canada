# @quickcasa/canada

[![CI](https://github.com/QuickCasa/canada/actions/workflows/ci.yml/badge.svg)](https://github.com/QuickCasa/canada/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A free, open source TypeScript library for the Canadian details most apps end
up writing by hand: provinces and territories in English and French, postal
codes, and GST, HST, PST and QST rates with their history since 2013. It has
no dependencies and makes no network requests.

## Install

```bash
npm install @quickcasa/canada
```

It's an ES module with TypeScript types, for Node.js 22 or later and any
current browser bundler.

## Provinces and territories

```ts
import { findProvince, getProvince, PROVINCES } from '@quickcasa/canada'

findProvince('québec')
// { code: 'QC', englishName: 'Quebec', frenchName: 'Québec', kind: 'province' }

findProvince('P.E.I.')?.code
// 'PE'

getProvince('NL').frenchName
// 'Terre-Neuve-et-Labrador'

PROVINCES.map(province => province.code)
// ['AB', 'BC', 'MB', 'NB', 'NL', 'NT', 'NS', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT']
```

- `PROVINCES` lists all 13 in alphabetical order of the English name, each
  with its two-letter code, English name, French name and whether it's a
  province or a territory.
- `getProvince(code)` looks one up by its code.
- `findProvince(text)` matches what people type into an address form: the
  code, the English or French name or a common abbreviation such as `Nfld.`,
  `N.W.T.` or `C.-B.`, in any case, with or without accents. It returns
  `undefined` when nothing matches.
- `isProvinceCode(value)` checks for one of the 13 codes and narrows the type.

The codes are the ones Canada Post and ISO 3166-2:CA both use.

## Postal codes

```ts
import { isPostalCode, parsePostalCode } from '@quickcasa/canada'

parsePostalCode('k1a0b1')
// {
//   postalCode: 'K1A 0B1',
//   forwardSortationArea: 'K1A',
//   localDeliveryUnit: '0B1',
//   province: 'ON',
// }

isPostalCode('90210')
// false
```

`parsePostalCode` accepts any case, with or without a space or a hyphen in
the middle, and returns the code in Canada Post's format. It rejects the
letters Canada Post never uses (D, F, I, O, Q and U, plus W and Z as the first
letter).

The province comes from the first letter. The Northwest Territories and
Nunavut share `X`, so for those it comes from the first three characters:
`X0A`, `X0B` and `X0C` are in Nunavut, and `X0E`, `X0G` and `X1A` are in the
Northwest Territories. An `X` code outside those six gets a `province` of
`undefined`.

This checks the format, not whether Canada Post has given the code to an
address. Checking that takes Canada Post's own address data.

## Sales tax

```ts
import {
  calculateSalesTax,
  getSalesTaxRates,
  splitTaxIncludedAmount,
} from '@quickcasa/canada'

getSalesTaxRates('QC', { date: '2026-10-04' })
// {
//   province: 'QC',
//   date: '2026-10-04',
//   effectiveFrom: '2013-04-01',
//   effectiveTo: undefined,
//   components: [
//     { kind: 'GST', name: 'Goods and services tax', percent: 5 },
//     { kind: 'QST', name: 'Quebec sales tax', percent: 9.975 },
//   ],
//   totalPercent: 14.975,
// }

calculateSalesTax(1999, 'BC').lines.map(line => [line.kind, line.cents])
// [['GST', 100], ['PST', 140]]

splitTaxIncludedAmount(11_300, 'ON').subtotalCents
// 10000
```

Amounts are whole numbers of cents, so no money is lost to floating point.

- `getSalesTaxRates(province, { date })` gives the rates on a date, as GST
  alone, HST alone or GST plus the provincial tax, and the first and last day
  those rates applied.
- `calculateSalesTax(subtotalCents, province, { date })` adds tax to an amount
  before tax. Each tax is worked out on that amount and rounded to the cent on
  its own, with halves rounded away from zero, so a receipt can show each one.
  Negative amounts, such as refunds, work the same way.
- `splitTaxIncludedAmount(totalCents, province, { date })` works backward from
  a price that includes tax. When an amount before tax gives that exact price
  with `calculateSalesTax`, it returns that amount and its taxes. Rounding
  means some prices can't be reached that way, and for those it uses the tax
  fraction (the price times the rate over 100 plus the rate). Either way, the
  parts add up to the price exactly.

`date` is a `YYYY-MM-DD` string and defaults to today in the time zone of the
computer running the code. Pass it whenever you can, such as the date on an
invoice. Dates before April 1, 2013 throw a `RangeError`, because before then
British Columbia and Prince Edward Island had different systems and some
provincial taxes were charged on the price including GST.

### Before you charge tax

These are the general rates that most goods and services are taxed at. Some
goods and services are exempt, zero-rated or have their own rate, and the
place of supply rules decide which province's rates apply to a sale. This
library gives you the rates and the math. Check what applies to what you sell
with the Canada Revenue Agency, or with the province for PST and QST.

Rates change from time to time. When one does, we release a new version with
the change and the date it takes effect, so keep the package up to date.

## Where the data comes from

- **GST and HST rates:** the Canada Revenue Agency's
  [GST/HST rate table](https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-which-rate/calculator.html),
  including its table of earlier rates. The tests check every province against
  each period it lists.
- **Provincial rates:** the provinces' own announcements of each change.
  British Columbia's PST has been 7% since its HST ended on April 1, 2013.
  Manitoba's RST went from 7% to 8% on July 1, 2013 and back to 7% on July 1, 2019. Quebec's QST has been 9.975% of the price before GST since January 1, 2013. Saskatchewan's PST went from 5% to 6% on March 23, 2017.
- **Province names:** the French names are as the Canada Revenue Agency
  writes them.
- **Postal codes:** Canada Post's
  [postal code format and postal districts](https://www.canadapost-postescanada.ca/cpc/en/support/articles/addressing-guidelines/postal-codes.page).

If you find a rate or rule that's out of date, please
[open an issue](https://github.com/QuickCasa/canada/issues/new/choose) with a
link to the official source.

## Development

You need Node.js 22 or later.

```bash
npm install
npm run check     # format, typecheck, tests, build and lint
```

The rates live in `src/sales-tax-history.ts`, the province names in
`src/provinces.ts` and the postal districts in `src/postal-districts.ts`.

## Licence

[MIT](LICENSE)
