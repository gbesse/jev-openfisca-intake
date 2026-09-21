// Purpose: Verify intake completion and confirmed-value typing.
import test from "node:test";
import assert from "node:assert/strict";
import { missingVariables, confirmAnswer, proposeNext } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const s = [{ name: "age", type: "number", question: "Age?" }];
test("reports missing variables", () =>
  assert.deepEqual(missingVariables(s, {}), ["age"]));
test("validates numeric confirmation", () =>
  assert.throws(() => confirmAnswer(s, {}, "age", "29"), /number/));
test("validates boolean confirmation", () =>
  assert.throws(
    () =>
      confirmAnswer(
        [{ name: "student", type: "boolean", question: "Student?" }],
        {},
        "student",
        "yes",
      ),
    /boolean/,
  ));
test("finishes without model call", async () => {
  let calls = 0;
  const p = createFakeProvider(() => {
    calls++;
  });
  assert.equal((await proposeNext("", s, { age: 29 }, p)).complete, true);
  assert.equal(calls, 0);
});
