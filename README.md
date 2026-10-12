# cartalog

Catálogo de marcas e modelos usado pelo app CarroQueProcuro. O app baixa o
`vehicleCatalog.json` pelo jsDelivr e usa a cópia embutida como reserva.

## Formato

- `version`: aumente a cada publicação. O app ignora um catálogo remoto com versão
  menor que a cópia embutida.
- `brands` e `modelsByBrand`: as listas que aparecem nos campos de marca e modelo.
- `specs`: o que existe de cada modelo no Brasil. O app usa para não oferecer
  combinações impossíveis (ex.: up! conversível):
  - `types`: `sedan`, `hatch`, `pickup`, `suv`, `coupe`, `wagon`, `convertible`, `van`.
    Com um tipo só, ele já vem marcado.
  - `transmissions`: `Manual` e/ou `Auto`. Com um câmbio só, ele já vem marcado.
  - `years`: `[primeiro ano-modelo, último ano-modelo]`. Use `null` no último se o
    modelo ainda é fabricado.

## Adicionar um modelo

1. Inclua o nome em `modelsByBrand` da marca.
2. Inclua a linha dele em `specs` da mesma marca, com o mesmo nome.
3. Aumente `version` e atualize `updatedAt`.
4. Rode `node validate.mjs`.
5. Faça o commit e o push. O jsDelivr pode levar até 7 dias para atualizar o cache
   de `@main`; para atualizar na hora, acesse
   `https://purge.jsdelivr.net/gh/taiog/cartalog@main/vehicleCatalog.json`.
