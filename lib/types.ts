export type Market = {
  name: string;
  division: string;
  min: number;
  max: number;
  avg: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  unit: string; // e.g. "প্রতি কেজি"
  unitShort: string; // e.g. "কেজি"
  category: string; // category slug
  categoryName: string;
  price: number;
  yesterdayPrice: number | null;
  changePct: number; // signed percentage
  description: string;
  tags: string[];
  markets: Market[];
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  minMarket: string;
  maxMarket: string;
};

export type Category = {
  slug: string;
  name: string;
  emoji: string;
};
