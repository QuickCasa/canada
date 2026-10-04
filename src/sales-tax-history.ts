import type {
  ProvinceCode,
  SalesTaxComponent,
  SalesTaxPeriod,
} from './types.js'

const GST: SalesTaxComponent = {
  kind: 'GST',
  name: 'Goods and services tax',
  percent: 5,
}

/**
 * @param {number} percent The HST rate.
 * @returns {SalesTaxComponent} An HST component at that rate.
 */
function harmonizedSalesTax(percent: number): SalesTaxComponent {
  return { kind: 'HST', name: 'Harmonized sales tax', percent }
}

/**
 * @param {number} percent The PST rate.
 * @returns {SalesTaxComponent} A PST component at that rate.
 */
function provincialSalesTax(percent: number): SalesTaxComponent {
  return { kind: 'PST', name: 'Provincial sales tax', percent }
}

/**
 * @param {number} percent Manitoba's RST rate.
 * @returns {SalesTaxComponent} An RST component at that rate.
 */
function retailSalesTax(percent: number): SalesTaxComponent {
  return { kind: 'RST', name: 'Retail sales tax', percent }
}

const QUEBEC_SALES_TAX: SalesTaxComponent = {
  kind: 'QST',
  name: 'Quebec sales tax',
  percent: 9.975,
}

/**
 * The general sales tax rates in each province and territory since April 1,
 * 2013, oldest first. Since that date every provincial tax is charged on the
 * price before GST, so the components never compound.
 *
 * GST and HST rates are from the Canada Revenue Agency's rate table:
 * https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-which-rate/calculator.html
 *
 * Provincial rates and the dates they changed:
 * - British Columbia: PST of 7% since the HST ended on April 1, 2013.
 * - Manitoba: RST up from 7% to 8% on July 1, 2013, and back to 7% on July 1,
 *   2019.
 * - Quebec: QST of 9.975% on the price before GST since January 1, 2013.
 * - Saskatchewan: PST up from 5% to 6% on March 23, 2017.
 */
const SALES_TAX_HISTORY: Readonly<
  Record<ProvinceCode, readonly SalesTaxPeriod[]>
> = {
  AB: [{ from: '2013-04-01', components: [GST] }],
  BC: [{ from: '2013-04-01', components: [GST, provincialSalesTax(7)] }],
  MB: [
    { from: '2013-04-01', components: [GST, retailSalesTax(7)] },
    { from: '2013-07-01', components: [GST, retailSalesTax(8)] },
    { from: '2019-07-01', components: [GST, retailSalesTax(7)] },
  ],
  NB: [
    { from: '2013-04-01', components: [harmonizedSalesTax(13)] },
    { from: '2016-07-01', components: [harmonizedSalesTax(15)] },
  ],
  NL: [
    { from: '2013-04-01', components: [harmonizedSalesTax(13)] },
    { from: '2016-07-01', components: [harmonizedSalesTax(15)] },
  ],
  NS: [
    { from: '2013-04-01', components: [harmonizedSalesTax(15)] },
    { from: '2025-04-01', components: [harmonizedSalesTax(14)] },
  ],
  NT: [{ from: '2013-04-01', components: [GST] }],
  NU: [{ from: '2013-04-01', components: [GST] }],
  ON: [{ from: '2013-04-01', components: [harmonizedSalesTax(13)] }],
  PE: [
    { from: '2013-04-01', components: [harmonizedSalesTax(14)] },
    { from: '2016-10-01', components: [harmonizedSalesTax(15)] },
  ],
  QC: [{ from: '2013-04-01', components: [GST, QUEBEC_SALES_TAX] }],
  SK: [
    { from: '2013-04-01', components: [GST, provincialSalesTax(5)] },
    { from: '2017-03-23', components: [GST, provincialSalesTax(6)] },
  ],
  YT: [{ from: '2013-04-01', components: [GST] }],
}

export { SALES_TAX_HISTORY }
