# Contributing

Thanks for wanting to help. The most useful contributions are reports of a rate
or rule that's out of date, with a link to the official source.

## Reporting a wrong rate or rule

Open an issue with:

- The province or territory, and the date or postal code you looked up.
- What the library gave you, and what it should be.
- A link to the official source: the Canada Revenue Agency, the province's
  finance ministry or revenue agency, or Canada Post.

A rate change needs the date it takes effect, not just the new rate, because
the library keeps the old rate for earlier dates.

## Scope

This library covers facts that are the same for every app: the provinces and
territories, postal code rules and general sales tax rates. Some things are
out of scope on purpose:

- Which goods and services are exempt, zero-rated or have their own rate.
- Place of supply rules.
- Anything that needs a network request or a large data file, such as checking
  that a postal code belongs to a real address.

Open an issue before starting on something new, so we can agree it fits.

## Getting set up

You need Node.js 22 or later.

```bash
npm install
npm run check
```

`npm run check` runs everything CI runs: the formatting check, the typecheck,
the tests, the build and ESLint.

## Rules for changes

- Every rate, name and postal district comes from an official source. Link it
  in the pull request, and add it to "Where the data comes from" in the README
  if it's a new source.
- A rate change adds a new period to `src/sales-tax-history.ts`. Never edit a
  past period unless it was wrong, because invoices from that time depend on
  it.
- Add tests for the day before and the day a change takes effect.
- Amounts stay in whole cents.
- The library has no dependencies. A change that adds one needs a strong
  reason in the pull request.
- Code follows [@quickcasa/eslint-config](https://github.com/QuickCasa/eslint-config),
  and Prettier formats everything. Run `npm run format` before committing.

## Releasing

Maintainers only.

1. Update the version in `package.json` and add an entry to `CHANGELOG.md`.
2. Commit, then tag the commit, for example `git tag v1.1.0`.
3. Push the commit and the tag. The release workflow runs the full check,
   creates the GitHub release with the packed tarball attached and stages the
   version on npm. npm trusts the workflow directly, so there is no npm token.
4. Approve the staged version with 2FA. Find its id with `npm stage list`, then
   run `npm stage approve <stage-id>`. Until then, the version isn't
   installable.
