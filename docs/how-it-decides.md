# How it decides

Jev OpenFisca Intake proposes mappings from a user narrative to an explicit variable schema and selects the next useful question. Every inferred value remains unconfirmed until the application or user accepts it.

The exact question and criteria live beside the call in [src/index.mjs](../src/index.mjs), making review and version control straightforward. Dates, identifiers, arithmetic, candidate generation, thresholds and state transitions remain code-owned. Synthetic demo probabilities are illustrative. Calibrate review thresholds on representative human labels before operational use.
