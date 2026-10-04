import { calculateSalesTax } from './calculate-sales-tax.js'
import { findProvince } from './find-province.js'
import { getProvince } from './get-province.js'
import { getSalesTaxRates } from './get-sales-tax-rates.js'
import { isPostalCode } from './is-postal-code.js'
import { isProvinceCode } from './is-province-code.js'
import { parsePostalCode } from './parse-postal-code.js'
import { PROVINCES } from './provinces.js'
import { splitTaxIncludedAmount } from './split-tax-included-amount.js'
import type {
  PostalCode,
  Province,
  ProvinceCode,
  ProvinceKind,
  SalesTaxCalculation,
  SalesTaxComponent,
  SalesTaxKind,
  SalesTaxLine,
  SalesTaxOptions,
  SalesTaxRates,
} from './types.js'

export {
  calculateSalesTax,
  findProvince,
  getProvince,
  getSalesTaxRates,
  isPostalCode,
  isProvinceCode,
  parsePostalCode,
  PROVINCES,
  splitTaxIncludedAmount,
  type PostalCode,
  type Province,
  type ProvinceCode,
  type ProvinceKind,
  type SalesTaxCalculation,
  type SalesTaxComponent,
  type SalesTaxKind,
  type SalesTaxLine,
  type SalesTaxOptions,
  type SalesTaxRates,
}
