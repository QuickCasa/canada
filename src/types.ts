/**
 * The two-letter code for a province or territory. Canada Post and ISO
 * 3166-2:CA use the same codes.
 */
type ProvinceCode =
  | 'AB'
  | 'BC'
  | 'MB'
  | 'NB'
  | 'NL'
  | 'NS'
  | 'NT'
  | 'NU'
  | 'ON'
  | 'PE'
  | 'QC'
  | 'SK'
  | 'YT'

type ProvinceKind = 'province' | 'territory'

interface Province {
  readonly code: ProvinceCode
  readonly englishName: string
  readonly frenchName: string
  readonly kind: ProvinceKind
}

interface PostalCode {
  /**
   * The postal code in Canada Post's format: uppercase, with one space, such
   * as `K1A 0B1`.
   */
  readonly postalCode: string
  /**
   * The first three characters, such as `K1A`.
   */
  readonly forwardSortationArea: string
  /**
   * The last three characters, such as `0B1`.
   */
  readonly localDeliveryUnit: string
  /**
   * The province or territory the postal code is in. Only `undefined` for a
   * postal code starting with an `X` area that isn't known to be in either the
   * Northwest Territories or Nunavut.
   */
  readonly province: ProvinceCode | undefined
}

/**
 * GST is the federal goods and services tax. HST is the harmonized sales tax,
 * which replaces GST and the provincial tax in the provinces that use it. PST,
 * QST and RST are the provincial taxes charged alongside GST: provincial sales
 * tax, Quebec sales tax and Manitoba's retail sales tax.
 */
type SalesTaxKind = 'GST' | 'HST' | 'PST' | 'QST' | 'RST'

interface SalesTaxComponent {
  readonly kind: SalesTaxKind
  readonly name: string
  /**
   * The rate as a percentage, such as `5` or `9.975`.
   */
  readonly percent: number
}

interface SalesTaxRates {
  readonly province: ProvinceCode
  /**
   * The date the rates were looked up for, as `YYYY-MM-DD`.
   */
  readonly date: string
  /**
   * The first day these rates applied, as `YYYY-MM-DD`.
   */
  readonly effectiveFrom: string
  /**
   * The last day these rates applied, as `YYYY-MM-DD`, or `undefined` if they
   * still apply.
   */
  readonly effectiveTo: string | undefined
  readonly components: readonly SalesTaxComponent[]
  readonly totalPercent: number
}

interface SalesTaxOptions {
  /**
   * The date to use the rates of, as `YYYY-MM-DD`. Defaults to today in the
   * time zone of the computer running the code.
   */
  readonly date?: string
}

interface SalesTaxLine extends SalesTaxComponent {
  readonly cents: number
}

interface SalesTaxCalculation {
  readonly province: ProvinceCode
  /**
   * The date the rates were looked up for, as `YYYY-MM-DD`.
   */
  readonly date: string
  /**
   * The amount before tax, in cents.
   */
  readonly subtotalCents: number
  readonly lines: readonly SalesTaxLine[]
  readonly taxCents: number
  /**
   * The amount including tax, in cents.
   */
  readonly totalCents: number
}

interface SalesTaxPeriod {
  readonly from: string
  readonly components: readonly SalesTaxComponent[]
}

export type {
  PostalCode,
  Province,
  ProvinceCode,
  ProvinceKind,
  SalesTaxCalculation,
  SalesTaxComponent,
  SalesTaxKind,
  SalesTaxLine,
  SalesTaxOptions,
  SalesTaxPeriod,
  SalesTaxRates,
}
