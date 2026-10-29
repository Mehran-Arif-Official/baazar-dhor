"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { toBn } from "@/lib/format";
import ProductCard from "./ProductCard";

type Sort = "default" | "asc" | "desc";

export default function SortableProducts({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<Sort>("default");

  // price is always a real number (Bengali numerals are parsed on the way in), so this sorts numerically.
  const sorted = useMemo(() => {
    const list = [...products];
    if (sort === "asc") list.sort((a, b) => a.price - b.price);
    if (sort === "desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, sort]);

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-base-content/60">মোট {toBn(sorted.length, 0)}টি পণ্য দেখানো হচ্ছে</p>
        <label className="flex items-center gap-2 text-sm font-medium">
          সাজান:
          <span className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="select select-sm appearance-none pr-9 sm:select-md"
              aria-label="সাজান"
            >
              <option value="default">ডিফল্ট</option>
              <option value="asc">দাম: কম থেকে বেশি</option>
              <option value="desc">দাম: বেশি থেকে কম</option>
            </select>
            <svg
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-base-content/60"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sorted.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  );
}
