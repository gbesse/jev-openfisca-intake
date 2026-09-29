// Objectif : implémenter la frontière de décision métier propre au dépôt.
export function validateSchema(schema) {
  if (!Array.isArray(schema) || !schema.length)
    throw new TypeError("schema must contain variables");
  for (const v of schema)
    if (!v?.name || !v?.question)
      throw new TypeError("Each variable needs name and question");
  return schema;
}
export function missingVariables(schema, answers = {}) {
  return validateSchema(schema)
    .filter((v) => answers[v.name] === undefined)
    .map((v) => v.name);
}
export async function proposeNext(narrative, schema, answers, provider) {
  const missing = missingVariables(schema, answers);
  if (!missing.length)
    return { complete: true, confirmed: answers, nextQuestion: null };
  const criteria = Object.fromEntries(
    missing.map((name) => [name, schema.find((v) => v.name === name).question]),
  );
  criteria.stop =
    "No remaining variable can be answered safely from this narrative";
  const r = await provider.decide({
    state: {
      narrative,
      confirmed_answers: answers,
      variables: schema.filter((v) => missing.includes(v.name)),
    },
    questions: {
      next: {
        type: "choice",
        instructions:
          "Select the single missing variable whose answer would most reduce ambiguity. Do not invent a value.",
        criteria,
      },
    },
  });
  const a = r.answers.next;
  return {
    complete: false,
    confirmed: answers,
    nextVariable: a.choice === "stop" ? null : a.choice,
    nextQuestion:
      a.choice === "stop"
        ? null
        : schema.find((v) => v.name === a.choice).question,
    confidence: a.confidence,
    review: a.confidence < 0.8,
    usage: r.usage,
  };
}
export function confirmAnswer(schema, answers, name, value) {
  const v = validateSchema(schema).find((x) => x.name === name);
  if (!v) throw new TypeError("Unknown variable " + name);
  if (v.type === "number" && typeof value !== "number")
    throw new TypeError(name + " must be a number");
  if (v.type === "boolean" && typeof value !== "boolean")
    throw new TypeError(name + " must be a boolean");
  if (v.type === "string" && typeof value !== "string")
    throw new TypeError(name + " must be a string");
  return { ...answers, [name]: value };
}
export async function runCli(argv, io = console) {
  io.log(
    JSON.stringify(
      {
        narrative: argv.join(" "),
        next: "Load an OpenFisca variable schema and call proposeNext.",
      },
      null,
      2,
    ),
  );
}
