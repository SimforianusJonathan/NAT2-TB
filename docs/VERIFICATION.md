# Implementation verification

Verified on 15 October 2026 in the supplied Windows workspace. This records software behavior, not clinical validation.

## Acceptance checklist

- [x] Local app runs without runtime errors on loopback port 3001.
- [x] Overview explains the precision-monitoring concept and research boundaries.
- [x] Patient dashboard lists four synthetic cases with search and priority filtering.
- [x] Patient detail shows profile, genotype, phenotype and independent concern bands.
- [x] Monitoring prompts and each rule's reasoning are visible with source references.
- [x] Follow-up form validates inputs, preserves unknown values and saves browser-local visits.
- [x] Day 0 and day 14 can be compared; historical assessment does not use later observations.
- [x] TB-004 changes from Low to High while genotype and therapy remain fixed.
- [x] Evidence strength, Indonesian applicability, core-field completeness and uncertainty are visible.
- [x] Literature, prototype choices and the unfilled local-protocol citation are clearly distinguished.
- [x] Disclaimers are visible; no diagnostic, dosing or clinical-performance claim is made.
- [x] Required screenshots and additional overview/mobile screenshots are captured.
- [x] README, original brief, proposal notes and reproducible browser check are included.
- [x] Separate Git repository uses the main branch; no remote is configured.

## Checks performed

- `npm test`: 24 passing tests, covering all four required scenarios, lab boundaries, missing observations, adherence confounding, historical interpretation, independent concerns, input validation and source immutability.
- `npm run typecheck`: generated current route types and passed TypeScript.
- `npm run build`: production build passed using Webpack, including overview, workspace, patient detail, evidence, icon and not-found handling.
- `npm run test:browser`: 11 passing check groups. See `BROWSER_VERIFICATION.json` for the recorded run and browser version.
- Browser coverage: navigation, filters, empty state recovery, independent concerns, export, longitudinal escalation, unchanged genotype, reload persistence, historical view, optional concentration controls, missing data, evidence, reset/cancel, malformed storage recovery, invalid patient handling and mobile overflow containment.
- Final browser run reported no unexpected HTTP errors, console errors or uncaught exceptions.
- Desktop screenshots inspected at 1440×1100; mobile layout checked at 390×844.

## Environment notes

- Windows rejected port 3000 with EACCES; ports 3001 and several alternatives were available. The local verification used `npm start -- --port 3001`.
- Turbopack's child-process handshake failed in this environment. Project scripts explicitly use Webpack. A subsequent restricted build encountered filesystem EPERM; the final permitted build succeeded after the running preview was stopped.
- For this run the browser script used an existing local Chromium executable via `BROWSER_EXECUTABLE`, and `BASE_URL=http://127.0.0.1:3001`. On another machine, install the matching Playwright Chromium as documented in README.
- No Docker, external backend, API integration, secrets or environment files are required.
- Literature metadata and broad study findings were checked against accessible published records. This does not constitute systematic appraisal, independent replication or clinical partner approval.
- The prototype remains an unvalidated research demonstration using synthetic data.
