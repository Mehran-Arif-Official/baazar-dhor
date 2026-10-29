"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { toBn } from "@/lib/format";
import ProductCard from "./ProductCard";

export default function AllProducts({ products }: { products: Product[] }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? products.filter((p) => p.name.toLowerCase().includes(s)) : products;
  }, [q, products]);

  return (
    <section id="সব-পণ্য" className="section-anchor mt-14">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold sm:text-2xl">সব পণ্য</h2>
          <p className="text-sm text-base-content/60">মোট {toBn(filtered.length, 0)}টি পণ্য দেখানো হচ্ছে</p>
        </div>
        <label className="input w-full sm:w-72">
          <span aria-hidden>🔍</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="পণ্যের নাম লিখুন…"
            aria-label="পণ্য খুঁজুন"
          />
        </label>
      </div>
      {filtered.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-base-300 bg-base-100 p-10 text-center text-base-content/60">
          “{q}” নামে কোনো পণ্য পাওয়া যায়নি।
        </p>
      )}
    </section>
  );
}
