# Jev OpenFisca Intake

**Transforme une situation exprimée en français en entrées confirmables pour une simulation OpenFisca.**

[![Tests](https://github.com/gbesse/jev-openfisca-intake/actions/workflows/test.yml/badge.svg)](https://github.com/gbesse/jev-openfisca-intake/actions/workflows/test.yml) [MIT](LICENSE) · Node.js 22+ · v0.1.4 · Documentation française

Le dépôt propose des correspondances entre un récit utilisateur et un schéma explicite de variables, puis sélectionne la prochaine question utile. Toute valeur inférée reste non confirmée tant que l’application ou l’utilisateur ne l’accepte pas.

## Démarrage rapide

```sh
git clone https://github.com/gbesse/jev-openfisca-intake.git
cd jev-openfisca-intake
npm install
npm run demo
```

La démonstration utilise uniquement des données et probabilités synthétiques. Elle n’effectue aucun appel réseau et ne constitue pas une mesure de qualité de Jev.

## Exemple exécutable

Cet exemple sélectionne la prochaine question d’un entretien OpenFisca. Il utilise un fournisseur Jev simulé : aucune clé API ni connexion réseau n’est nécessaire. L’assertion intégrée fait échouer la commande si le comportement attendu change.

Le code complet de [`examples/demo.mjs`](examples/demo.mjs) est directement copiable :

```js
// Objectif : démontrer la frontière de décision sans appel réseau.
import assert from "node:assert/strict";
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
const resultat = await proposeNext(
  "J’ai 29 ans et je loue seul.",
  schema,
  { age: 29 },
  p,
);
assert.equal(resultat.nextVariable, "monthly_rent");
console.log(JSON.stringify(resultat, null, 2));
```

Lancez-le avec :

```sh
npm run demo:principal
```

Résultat à repérer : `nextVariable: monthly_rent`.

### Cas limite à tester

Un dossier déjà complet se termine sans demander une décision au modèle. Le code se trouve dans [`examples/cas-limite.mjs`](examples/cas-limite.mjs).

```sh
npm run demo:limite
```

Résultat à repérer : `complete: true · appels Jev: 0`. La commande `npm run demo` exécute les deux exemples.

## Utilisation de la bibliothèque

Importez les fonctions métier depuis `@gbesse/jev-openfisca-intake`. Fournissez soit `createJevClient()` depuis l’export `./jev`, soit `createFakeProvider()` pour les tests hors ligne.

Les noms de l’API JavaScript restent stables pour préserver la compatibilité avec les versions précédentes. La documentation, les exemples et les explications destinées aux utilisateurs sont en français.

## Frontière de décision

Jev ne calcule ni droits ni prestations. Les valeurs numériques, dates et faits du foyer doivent être validés par le code ou confirmés par l’utilisateur avant toute simulation OpenFisca.

La question exacte envoyée à Jev est versionnée dans [`src/index.mjs`](src/index.mjs). Les identifiants, dates, calculs, filtres, seuils et transitions d’état restent gérés par du code ordinaire.

## Sources

- [https://openfisca.org](https://openfisca.org)
- [https://github.com/openfisca/openfisca-france](https://github.com/openfisca/openfisca-france)

Conservez l’attribution amont, les identifiants d’origine, les URL de source et les dates de récupération avec chaque enregistrement dérivé.

## Appels Jev réels

Les appels réels sont facultatifs et payants. Le client fixe le modèle `jev-1.13.0`, valide l’identité du modèle et toutes les probabilités, refuse les redirections, ne retente que les erreurs réseau et les réponses HTTP 429/529, puis bloque les requêtes dépassant une estimation prudente de 24 000 jetons.

```sh
TYPESAFE_API_KEY=... node scripts/live-smoke.mjs
```

N’envoyez jamais de secret, de donnée personnelle ni de dossier sensible non expurgé. Évaluez le comportement sur un jeu représentatif de cas français avant tout usage opérationnel.

## Parcours comparatif

`npm run demo:parcours` produit un rapport JSON partageable pour **jev-openfisca-intake** : le scénario principal et la frontière déterministe. Chaque scénario garde sa sortie propre et échoue si son assertion ne passe plus. Les données et probabilités sont synthétiques ; aucun appel Jev n’est effectué.

Cette vue permet de comparer rapidement les chemins de décision et de choisir quel exemple adapter à vos propres données sourcées.

## Validation

```sh
npm run check
npm run typecheck
npm test
npm run demo
```

La CI exécute ces vérifications sous Node.js 22 et 24.

Projet indépendant, sans affiliation avec TypeSafe AI ni avec l’administration française. Consultez la [documentation de l’API Jev](https://docs.typesafe.ai/api) et les [limites du modèle](https://docs.typesafe.ai/model-jaggedness/jev-1.13).
