/*
  Flat config direto, sem o `FlatCompat`.

  O shim do @eslint/eslintrc rebentava com "Converting circular structure to
  JSON" ao formatar erros de validação de esquema: o `eslint-config-next` v16
  já exporta flat config nativo, e passá-lo pela camada de compatibilidade do
  formato antigo fazia o validador tentar serializar o grafo de plugins, que
  tem ciclos. O resultado era o `npm run lint` a morrer sempre, em qualquer
  ficheiro — não a passar, a rebentar.
*/
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      ".superpowers/**",
    ],
  },
];

export default eslintConfig;
