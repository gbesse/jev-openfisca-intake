// Objectif : démontrer la frontière de décision sans appel réseau.
import { proposeNext } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const schema = [
  { name: "age", type: "number", question: "Quel est votre âge ?" },
  {
    name: "monthly_rent",
    type: "number",
    question: "Quel est votre loyer mensuel hors charges ?",
  },
];
const p = createFakeProvider(() => ({
  model: "jev-1.13.0",
  answers: {
    next: {
      type: "choice",
      choice: "monthly_rent",
      probabilities: { age: 0.1, monthly_rent: 0.85, stop: 0.05 },
      confidence: 0.85,
    },
  },
  usage: { input_tokens: 70, output_tokens: 0 },
}));
console.log(
  await proposeNext("J’ai 29 ans et je loue seul.", schema, { age: 29 }, p),
);
