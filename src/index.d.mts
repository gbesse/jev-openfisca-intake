// Objectif : décrire les types de l’API métier publique.
import type { JevProvider } from "./jev.mjs";
export type IntakeVariable = {
  name: string;
  question: string;
  type?: "number" | "string" | "boolean";
};
export function validateSchema(schema: IntakeVariable[]): IntakeVariable[];
export function missingVariables(
  schema: IntakeVariable[],
  answers?: Record<string, unknown>,
): string[];
export function proposeNext(
  narrative: string,
  schema: IntakeVariable[],
  answers: Record<string, unknown>,
  provider: JevProvider,
): Promise<any>;
export function confirmAnswer(
  schema: IntakeVariable[],
  answers: Record<string, unknown>,
  name: string,
  value: unknown,
): Record<string, unknown>;
export function runCli(
  argv: string[],
  io?: { log(value: string): void },
): Promise<void>;
