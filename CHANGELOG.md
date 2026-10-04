# Changelog

All notable changes to this project are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/).

A change to a tax rate is released as a minor version, with the date it takes
effect.

## 1.0.0 - 2026-10-04

First open source release.

- `PROVINCES`, `getProvince` and `isProvinceCode`: the 13 provinces and
  territories with their codes and English and French names.
- `findProvince` matches a code, a name in either language or a common
  abbreviation, in any case and with or without accents.
- `parsePostalCode` and `isPostalCode` check and format postal codes and work
  out the province or territory, including the split of `X` codes between the
  Northwest Territories and Nunavut.
- `getSalesTaxRates` gives the GST, HST, PST, QST or RST rates for any date
  from April 1, 2013.
- `calculateSalesTax` adds tax to an amount before tax, rounding each tax to
  the cent.
- `splitTaxIncludedAmount` works backward from a price that includes tax.
