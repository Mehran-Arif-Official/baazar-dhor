import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPct, formatTaka } from "@/lib/format";
import { cn } from "@/lib/cn";

function Item({ p }: { p: Product }) {
  const up = p.changePct > 0;
  const down = p.changePct < 0;
  return (
    <Link
      href={`/product/${encodeURIComponent(p.slug)}`}
      className="flex items-center gap-2 px-5 py-2 text-sm whitespace-nowrap hover:bg-white/10"
    >
      <span aria-hidden>{p.emoji}</span>
      <span className="font-medium">{p.name}</span>
      <span className="text-white/80">
        {formatTaka(p.price)}/{p.unitShort}
      </span>
      <span className={cn("font-semibold", up && "text-green-300", down && "text-red-300", !up && !down && "text-white/60")}>
        {up ? "▲" : down ? "▼" : "—"} {formatPct(p.changePct)}
      </span>
    </Link>
  );
}

export default function Ticker({ products }: { products: Product[] }) {
  if (!products.length) return null;
  return (
    <div className="marquee overflow-hidden bg-secondary text-secondary-content" aria-label="আজকের দামের তালিকা">
      <div className="marquee-track">
        <div className="flex">
          {products.map((p) => (
            <Item key={p.id} p={p} />
          ))}
        </div>
        <div className="flex" aria-hidden>
          {products.map((p) => (
            <Item key={`dup-${p.id}`} p={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
