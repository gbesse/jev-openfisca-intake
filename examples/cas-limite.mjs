// Cas limite : toutes les variables confirmées terminent l’entretien localement.
import assert from "node:assert/strict";
import { proposeNext } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";

const schema = [
  { name: "age", type: "number", question: "Quel est votre âge ?" },
];
const jev = createFakeProvider(() => {
  throw new Error("Jev ne doit pas être appelé");
});
const resultat = await proposeNext("J’ai 29 ans.", schema, { age: 29 }, jev);
assert.equal(resultat.complete, true);
assert.equal(jev.calls, 0);
console.log(JSON.stringify(resultat, null, 2));
