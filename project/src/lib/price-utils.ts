import { formatCLP } from "./data";

export function parseWeightKg(weight?: string): number | null {
  if (!weight) return null;

  const normalized = weight.trim().toLowerCase().replace(/,/g, ".");
  const match = normalized.match(/(\d+(?:\.\d+)?)/);
  if (!match) return null;

  const value = Number(match[1]);
  if (!Number.isFinite(value) || value <= 0) return null;

  if (normalized.includes("g") && !normalized.includes("kg")) {
    return value / 1000;
  }

  if (normalized.includes("kg") || normalized.includes("kilo")) {
    return value;
  }

  return null;
}

export function getPricePerKg(price: number, weight?: string): number | null {
  const kg = parseWeightKg(weight);
  if (!kg) return null;
  return Math.round(price / kg);
}

export function formatPricePerKg(price: number, weight?: string): string | null {
  const pricePerKg = getPricePerKg(price, weight);
  if (!pricePerKg) return null;
  return `${formatCLP(pricePerKg)}/kg aprox.`;
}
