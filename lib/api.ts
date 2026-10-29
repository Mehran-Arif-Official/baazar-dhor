import { cache } from "react";
import { parseNumber, slugify } from "./format";
import { SEED_CATEGORIES, SEED_PRODUCTS } from "./seed";
import type { Category, Market, Product } from "./types";

const MAIN = process.env.NEXT_PUBLIC_API_URL || "https://openapi.programming-hero.com/api/bazardor";
const BASES = [
  MAIN,
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

/* ------------------------------------------------------------------ */
/* Low-level fetch with endpoint fail-over                             */
/* ------------------------------------------------------------------ */
async function getJson(path: string): Promise<unknown | null> {
  for (const base of BASES) {
    try {
      const res = await fetch(`${base}${path}`, {
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) continue;
      return await res.json();
    } catch {
      // try the next base URL
    }
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Normalisation helpers (API shape is tolerated, not assumed)         */
/* ------------------------------------------------------------------ */
type Raw = Record<string, unknown>;
const isObj = (v: unknown): v is Raw => typeof v === "object" && v !== null && !Array.isArray(v);

function pick(raw: Raw, ...keys: string[]): unknown {
  for (const k of keys) {
    const v = raw[k];
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return undefined;
}
const str = (v: unknown): string | undefined =>
  typeof v === "string" ? v : typeof v === "number" ? String(v) : undefined;

function extractArray(json: unknown): unknown[] {
  if (Array.isArray(json)) return json;
  if (isObj(json)) {
    for (const k of ["data", "products", "items", "result", "results", "categories"]) {
      const v = json[k];
      if (Array.isArray(v)) return v;
      if (isObj(v)) {
        const inner = extractArray(v);
        if (inner.length) return inner;
      }
    }
    for (const v of Object.values(json)) if (Array.isArray(v)) return v;
  }
  return [];
}

function extractObject(json: unknown): Raw | null {
  if (!isObj(json)) return null;
  for (const k of ["data", "product", "category", "result"]) {
    if (isObj(json[k])) return json[k] as Raw;
  }
  return json;
}

const UNIT_MAP: Record<string, string> = {
  kg: "কেজি",
  liter: "লিটার",
  litre: "লিটার",
  l: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
  pcs: "পিস",
  pc: "পিস",
};

function normUnit(v: unknown): { unit: string; short: string } {
  let s = (str(v) ?? "কেজি").trim();
  s = s.replace(/^প্রতি\s*/, "").replace(/^per\s*/i, "").replace(/^\//, "").trim();
  s = UNIT_MAP[s.toLowerCase()] ?? s;
  return { unit: `প্রতি ${s}`, short: s };
}

function categoryOf(raw: Raw): { slug: string; name: string } {
  const c = pick(raw, "category", "category_slug", "categorySlug", "category_id", "categoryId");
  if (isObj(c)) {
    const slug = str(pick(c, "slug", "id", "key")) ?? "";
    return { slug, name: str(pick(c, "name", "title", "name_bn", "label")) ?? slug };
  }
  const slug = str(c) ?? "";
  return { slug, name: str(pick(raw, "category_name", "categoryName")) ?? slug };
}

function normMarket(m: unknown): Market | null {
  if (!isObj(m)) return null;
  const price = parseNumber(pick(m, "price", "today_price", "todayPrice"));
  const min = parseNumber(pick(m, "min", "min_price", "minPrice", "minimum", "lowest")) ?? price;
  const max = parseNumber(pick(m, "max", "max_price", "maxPrice", "maximum", "highest")) ?? price;
  if (min === null || max === null) return null;
  const avg = parseNumber(pick(m, "avg", "average", "avg_price", "avgPrice", "mean")) ?? price ?? (min + max) / 2;
  return {
    name: str(pick(m, "name", "market", "market_name", "marketName", "bazar", "title")) ?? "বাজার",
    division: str(pick(m, "division", "location", "city", "district", "area")) ?? "",
    min,
    max,
    avg,
  };
}

function normProduct(rawIn: unknown, i: number): Product | null {
  if (!isObj(rawIn)) return null;
  const raw = rawIn;
  const name = str(pick(raw, "name", "title", "product_name", "productName", "name_bn", "nameBn"));
  if (!name) return null;

  const cat = categoryOf(raw);
  const seedCat = SEED_CATEGORIES.find((c) => c.slug === cat.slug || c.name === cat.name);
  const { unit, short } = normUnit(pick(raw, "unit", "unit_bn", "unitLabel", "unit_name"));

  const rawMarkets = pick(raw, "markets", "market_prices", "marketPrices", "bazars", "bazar_prices", "prices");
  const markets = (Array.isArray(rawMarkets) ? rawMarkets : []).map(normMarket).filter((m): m is Market => !!m);

  const yesterday = parseNumber(
    pick(raw, "yesterday_price", "yesterdayPrice", "previous_price", "previousPrice", "prev_price", "last_price"),
  );
  let price = parseNumber(
    pick(raw, "price", "today_price", "todayPrice", "current_price", "currentPrice", "avg_price", "average_price", "avgPrice"),
  );
  const avgFromMarkets = markets.length ? markets.reduce((s, m) => s + m.avg, 0) / markets.length : null;
  if (price === null) price = parseNumber(pick(raw, "avg", "average")) ?? avgFromMarkets ?? 0;

  let pct = parseNumber(
    pick(raw, "change_percent", "changePercent", "percent_change", "percentChange", "change_pct", "changePct", "percentage", "percent", "change"),
  );
  const dirRaw = (str(pick(raw, "trend", "direction", "status", "change_type", "changeType")) ?? "").toLowerCase();
  if (pct === null) pct = yesterday ? ((price - yesterday) / yesterday) * 100 : 0;
  if (/down|fall|decrease|কম|▼|negative/.test(dirRaw)) pct = -Math.abs(pct);
  else if (/up|rise|increase|বেড়|বাড়|▲|positive/.test(dirRaw)) pct = Math.abs(pct);

  const minP = parseNumber(pick(raw, "min_price", "minPrice", "min", "lowest_price"));
  const maxP = parseNumber(pick(raw, "max_price", "maxPrice", "max", "highest_price"));
  const avgP = parseNumber(pick(raw, "avg_price", "avgPrice", "average_price", "averagePrice", "avg", "average"));
  const minM = markets.length ? markets.reduce((a, m) => (m.min < a.min ? m : a)) : null;
  const maxM = markets.length ? markets.reduce((a, m) => (m.max > a.max ? m : a)) : null;

  const rawTags = pick(raw, "tags", "categories");
  const tags = Array.isArray(rawTags)
    ? rawTags.map((t) => (isObj(t) ? str(pick(t, "name", "title")) : str(t))).filter((t): t is string => !!t)
    : [];
  if (!tags.length && (cat.name || seedCat?.name)) tags.push(seedCat?.name ?? cat.name);

  const id = str(pick(raw, "id", "_id", "product_id", "productId")) ?? String(i + 1);
  const emojiRaw = str(pick(raw, "emoji", "icon", "symbol", "image"));
  const emoji = emojiRaw && [...emojiRaw].length <= 6 ? emojiRaw : (seedCat?.emoji ?? "🛒");

  return {
    id,
    slug: str(pick(raw, "slug")) ?? id ?? slugify(name),
    name,
    emoji,
    unit,
    unitShort: short,
    category: cat.slug,
    categoryName: seedCat?.name ?? cat.name,
    price,
    yesterdayPrice: yesterday,
    changePct: Math.round(pct * 10) / 10,
    description:
      str(pick(raw, "description", "summary", "subtitle", "details")) ??
      (pct > 0 ? "গতকালের তুলনায় আজ দাম বেড়েছে" : pct < 0 ? "গতকালের তুলনায় আজ দাম কমেছে" : "গতকালের তুলনায় আজ দাম অপরিবর্তিত"),
    tags,
    markets,
    minPrice: minP ?? minM?.min ?? price,
    maxPrice: maxP ?? maxM?.max ?? price,
    avgPrice: avgP ?? avgFromMarkets ?? price,
    minMarket: str(pick(raw, "min_market", "minMarket", "lowest_market")) ?? minM?.name ?? "",
    maxMarket: str(pick(raw, "max_market", "maxMarket", "highest_market")) ?? maxM?.name ?? "",
  };
}

function normCategory(rawIn: unknown): Category | null {
  if (typeof rawIn === "string") {
    const seed = SEED_CATEGORIES.find((c) => c.slug === rawIn || c.name === rawIn);
    return { slug: rawIn, name: seed?.name ?? rawIn, emoji: seed?.emoji ?? "🛒" };
  }
  if (!isObj(rawIn)) return null;
  const name = str(pick(rawIn, "name", "title", "name_bn", "label"));
  const slug = str(pick(rawIn, "slug", "id", "key", "_id")) ?? (name ? slugify(name) : undefined);
  if (!slug || !name) return null;
  const seed = SEED_CATEGORIES.find((c) => c.slug === slug || c.name === name);
  const e = str(pick(rawIn, "emoji", "icon", "symbol"));
  return { slug, name: seed?.name ?? name, emoji: e && [...e].length <= 6 ? e : (seed?.emoji ?? "🛒") };
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */
export const getProducts = cache(async (): Promise<Product[]> => {
  const json = await getJson("/products");
  const list = extractArray(json)
    .map(normProduct)
    .filter((p): p is Product => !!p);
  return list.length ? list : SEED_PRODUCTS;
});

export const getCategories = cache(async (): Promise<Category[]> => {
  const json = await getJson("/categories");
  const list = extractArray(json)
    .map(normCategory)
    .filter((c): c is Category => !!c);
  return list.length ? list : SEED_CATEGORIES;
});

export function matchesCategory(p: Product, cat: Category): boolean {
  return p.category === cat.slug || p.categoryName === cat.name || p.category === cat.name;
}

export const getCategory = cache(async (slug: string): Promise<Category | null> => {
  const decoded = decodeURIComponent(slug);
  const all = await getCategories();
  const found = all.find((c) => c.slug === decoded);
  if (found) return found;
  const json = await getJson(`/categories/${encodeURIComponent(decoded)}`);
  const obj = extractObject(json);
  return obj ? normCategory(obj) : null;
});

export const getProductsByCategory = cache(async (cat: Category): Promise<Product[]> => {
  const json = await getJson(`/products?category=${encodeURIComponent(cat.slug)}`);
  const list = extractArray(json)
    .map(normProduct)
    .filter((p): p is Product => !!p)
    .map((p) => (p.category ? p : { ...p, category: cat.slug, categoryName: cat.name }));
  if (list.length) return list;
  return (await getProducts()).filter((p) => matchesCategory(p, cat));
});

export const getProduct = cache(async (slug: string): Promise<Product | null> => {
  const decoded = decodeURIComponent(slug);
  const all = await getProducts();
  const fromList = all.find((p) => p.slug === decoded || p.id === decoded) ?? null;

  const json = await getJson(`/products/${encodeURIComponent(decoded)}`);
  const obj = extractObject(json);
  const detailed = obj ? normProduct(obj, 0) : null;
  if (detailed && fromList) {
    // Detailed endpoint wins, list item fills any gaps (e.g. category name, emoji).
    return {
      ...fromList,
      ...detailed,
      emoji: detailed.emoji !== "🛒" ? detailed.emoji : fromList.emoji,
      categoryName: detailed.categoryName || fromList.categoryName,
      category: detailed.category || fromList.category,
      markets: detailed.markets.length ? detailed.markets : fromList.markets,
      tags: detailed.tags.length ? detailed.tags : fromList.tags,
    };
  }
  return detailed ?? fromList;
});
