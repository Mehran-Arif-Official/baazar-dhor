import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatTaka } from "@/lib/format";
import ChangeBadge from "./ChangeBadge";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${encodeURIComponent(product.slug)}`}
      className="group block rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary"
    >
      <div className="flex items-center gap-3">
        <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-base-200 text-2xl" aria-hidden>
          {product.emoji}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold leading-tight group-hover:text-primary">{product.name}</h3>
          <p className="text-sm text-base-content/60">{product.unit}</p>
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between gap-2 border-t border-dashed border-base-300 pt-3">
        <div>
          <p className="text-xs text-base-content/60">আজকের দাম</p>
          <p className="text-lg font-bold text-secondary">{formatTaka(product.price)}</p>
        </div>
        <ChangeBadge pct={product.changePct} />
      </div>
    </Link>
  );
}
