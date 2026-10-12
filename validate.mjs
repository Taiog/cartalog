// Confere o vehicleCatalog.json antes de publicar: node validate.mjs
import { readFileSync } from "node:fs";

const TYPES = ["sedan", "hatch", "pickup", "suv", "coupe", "wagon", "convertible", "van"];
const TRANSMISSIONS = ["Manual", "Auto"];
const MAX_YEAR = new Date().getFullYear() + 1;

const catalog = JSON.parse(readFileSync(new URL("./vehicleCatalog.json", import.meta.url), "utf8"));
const errors = [];

for (const brand of catalog.brands) {
  const models = catalog.modelsByBrand[brand];
  if (!models) {
    errors.push(`${brand}: está em "brands" mas não em "modelsByBrand"`);
    continue;
  }
  for (const model of models) {
    const spec = catalog.specs?.[brand]?.[model];
    const name = `${brand} ${model}`;
    if (!spec) {
      errors.push(`${name}: sem entrada em "specs"`);
      continue;
    }
    if (!Array.isArray(spec.types) || spec.types.length === 0) errors.push(`${name}: "types" vazio`);
    spec.types?.forEach((t) => TYPES.includes(t) || errors.push(`${name}: tipo "${t}" inválido`));
    if (!Array.isArray(spec.transmissions) || spec.transmissions.length === 0) {
      errors.push(`${name}: "transmissions" vazio`);
    }
    spec.transmissions?.forEach(
      (t) => TRANSMISSIONS.includes(t) || errors.push(`${name}: câmbio "${t}" inválido`),
    );
    const [from, to] = spec.years ?? [];
    if (!Number.isInteger(from) || from < 1900 || from > MAX_YEAR) errors.push(`${name}: ano inicial inválido`);
    if (to !== null && (!Number.isInteger(to) || to < from || to > MAX_YEAR)) {
      errors.push(`${name}: ano final inválido (use null se ainda é fabricado)`);
    }
  }
}

for (const [brand, models] of Object.entries(catalog.specs ?? {})) {
  for (const model of Object.keys(models)) {
    if (!catalog.modelsByBrand[brand]?.includes(model)) {
      errors.push(`${brand} ${model}: está em "specs" mas não em "modelsByBrand"`);
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`ok: versão ${catalog.version}, ${catalog.brands.length} marcas`);
