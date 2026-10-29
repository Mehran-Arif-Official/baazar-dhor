import type { Category, Market, Product } from "./types";

/**
 * Fallback dataset (mirrors the Figma design). It is only used when none of the
 * configured API endpoints respond, so the app never renders a blank page.
 */
export const SEED_CATEGORIES: Category[] = [
  { slug: "chal", name: "চাল", emoji: "🍚" },
  { slug: "dal", name: "ডাল", emoji: "🫘" },
  { slug: "tel", name: "তেল", emoji: "🫙" },
  { slug: "sobji", name: "সবজি", emoji: "🥔" },
  { slug: "mach", name: "মাছ", emoji: "🐟" },
  { slug: "mangsho", name: "মাংস", emoji: "🍗" },
  { slug: "dim-dudh", name: "ডিম-দুধ", emoji: "🥚" },
  { slug: "moshla", name: "মসলা", emoji: "🌶️" },
];

// [name, emoji, category, unit, price, signed change %]
type Row = [string, string, string, string, number, number];
const ROWS: Row[] = [
  ["স্বর্ণমাছি চাল", "🍚", "chal", "কেজি", 148, 2.1],
  ["মিনিকেট চাল", "🍚", "chal", "কেজি", 99, -2.9],
  ["নাজির চাল", "🍚", "chal", "কেজি", 74, 0],
  ["বাটাম সাইজ চাল", "🍚", "chal", "কেজি", 66, 3.1],
  ["মসুর ডাল", "🫘", "dal", "কেজি", 142, 2.9],
  ["মুগ ডাল", "🫘", "dal", "কেজি", 135, 1.8],
  ["ছোলা", "🫘", "dal", "কেজি", 120, -2.4],
  ["আমন ডাল (খোসাসিলা)", "🫘", "dal", "কেজি", 156, 2.6],
  ["সরিষার তেল", "🫙", "tel", "লিটার", 192, -0.8],
  ["পাম তেল", "🫙", "tel", "লিটার", 168, -2.3],
  ["ঘানি ভাঙা সরিষার তেল", "🫙", "tel", "লিটার", 215, 1.1],
  ["পেঁয়াজ", "🧅", "sobji", "কেজি", 54, 12.5],
  ["বেগুন", "🍆", "sobji", "কেজি", 44, 4.8],
  ["আলু", "🥔", "sobji", "কেজি", 30, -6.2],
  ["ঢেঁড়স", "🥬", "sobji", "কেজি", 38, 1.4],
  ["কাঁচামরিচ", "🌶️", "sobji", "কেজি", 92, -12.4],
  ["টমেটো", "🍅", "sobji", "কেজি", 70, 1.6],
  ["রুই মাছ", "🐟", "mach", "কেজি", 46, 4.5],
  ["কাতলা মাছ", "🐟", "mach", "কেজি", 43, -4.4],
  ["তেলাপিয়া", "🐟", "mach", "কেজি", 36, 0.9],
  ["ইলিশ মাছ", "🐟", "mach", "কেজি", 1850, 2.2],
  ["চিংড়ি মাছ (খোলা)", "🦐", "mach", "কেজি", 330, -1.7],
  ["হাঁসের মাংস", "🦆", "mangsho", "কেজি", 285, -3.4],
  ["খাসির মাংস", "🍖", "mangsho", "কেজি", 1290, -3.0],
  ["মুরগির মাংস", "🍗", "mangsho", "কেজি", 225, 1.3],
  ["গরুর মাংস", "🥩", "mangsho", "কেজি", 790, 1.2],
  ["ডিম", "🥚", "dim-dudh", "ডজন", 158, 3.9],
  ["দুধ", "🥛", "dim-dudh", "লিটার", 102, 2.0],
  ["মাখন (১০০ গ্রাম)", "🧈", "dim-dudh", "পিস", 145, 3.6],
  ["আদা", "🫚", "moshla", "কেজি", 85, 9.0],
  ["রসুন", "🧄", "moshla", "কেজি", 125, -7.4],
  ["মরিচ গুঁড়া", "🌶️", "moshla", "কেজি", 245, 0.7],
  ["ধনেপাতা গুঁড়া", "🌿", "moshla", "কেজি", 265, -1.1],
];

const MARKETS: [string, string][] = [
  ["মাঠ বাজার", "ময়মনসিংহ"],
  ["সদর বাজার", "রাজশাহী"],
  ["বাজারহাট", "খুলনা"],
  ["আমতলী বাজার", "চট্টগ্রাম"],
  ["চৌরাস্তা বাজার", "সিলেট"],
  ["গ্রীন মার্কেট, মিরপুর", "ঢাকা"],
  ["কারওয়ান বাজার", "ঢাকা"],
];

function round(n: number) {
  return Math.round(n * 100) / 100;
}

function buildMarkets(price: number, seed: number): Market[] {
  return MARKETS.map(([name, division], i) => {
    const k = ((seed * 7 + i * 13) % 11) - 5; // -5 … +5
    const avg = round(price * (1 + k / 100));
    const spread = Math.max(1, Math.round(price * 0.02));
    return { name, division, min: Math.round(avg - spread), max: Math.round(avg + spread), avg };
  });
}

export const SEED_PRODUCTS: Product[] = ROWS.map(([name, emoji, category, unit, price, pct], i) => {
  const cat = SEED_CATEGORIES.find((c) => c.slug === category)!;
  const markets = buildMarkets(price, i + 1);
  const yesterday = round(price / (1 + pct / 100));
  const min = markets.reduce((a, m) => (m.min < a.min ? m : a), markets[0]);
  const max = markets.reduce((a, m) => (m.max > a.max ? m : a), markets[0]);
  const dir = pct > 0 ? "বেড়েছে" : pct < 0 ? "কমেছে" : "অপরিবর্তিত আছে";
  return {
    id: String(i + 1),
    slug: String(i + 1),
    name,
    emoji,
    unit: `প্রতি ${unit}`,
    unitShort: unit,
    category,
    categoryName: cat.name,
    price,
    yesterdayPrice: yesterday,
    changePct: pct,
    description: `গতকালের তুলনায় আজ দাম ${dir}`,
    tags: [cat.name],
    markets,
    minPrice: min.min,
    maxPrice: max.max,
    avgPrice: round(markets.reduce((s, m) => s + m.avg, 0) / markets.length),
    minMarket: min.name,
    maxMarket: max.name,
  };
});
