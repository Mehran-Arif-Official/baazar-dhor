import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

export default function ProductSection({
  title,
  subtitle,
  products,
  tone,
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  tone: "up" | "down";
}) {
  return (
    <section className="mt-12">
      <div className="mb-4 flex items-center gap-3">
        <span
          className={`h-8 w-1.5 rounded-full ${tone === "up" ? "bg-green-600" : "bg-red-500"}`}
          aria-hidden
        />
        <div>
          <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
          {subtitle && <p className="text-sm text-base-content/60">{subtitle}</p>}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
