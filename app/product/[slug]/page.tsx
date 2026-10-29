import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getProduct } from "@/lib/api";
import { formatTaka, toBn } from "@/lib/format";
import { getServerSession } from "@/lib/session";
import ChangeBadge from "@/components/ChangeBadge";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  return { title: p?.name ?? "পণ্য" };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  // Protected route: the middleware checks the cookie, here we validate the session itself.
  const session = await getServerSession();
  if (!session) {
    redirect(`/signin?redirect=${encodeURIComponent(`/product/${slug}`)}&reason=login-required`);
  }

  const product = await getProduct(slug);
  if (!product) notFound();

  const diff = product.yesterdayPrice !== null ? Math.round(product.price - product.yesterdayPrice) : null;
  const trendText =
    product.changePct > 0
      ? `গতকালের তুলনায় আজ দাম বেড়েছে${diff ? ` · ${toBn(Math.abs(diff))} টাকা` : ""}`
      : product.changePct < 0
        ? `গতকালের তুলনায় আজ দাম কমেছে${diff ? ` · ${toBn(Math.abs(diff))} টাকা` : ""}`
        : "গতকালের তুলনায় আজ দাম অপরিবর্তিত";
  const avgs = product.markets.map((m) => m.avg);
  const lo = Math.min(...avgs);
  const hi = Math.max(...avgs);
  // Scale bars between the cheapest and the dearest market so differences are visible.
  const barWidth = (v: number) => (hi === lo ? 70 : 30 + ((v - lo) / (hi - lo)) * 70);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6">
      <nav aria-label="breadcrumb" className="text-sm text-base-content/60">
        <Link href="/" className="hover:text-primary">
          হোম
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/category/${encodeURIComponent(product.category)}`} className="hover:text-primary">
          {product.categoryName || "বিভাগ"}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-base-content">{product.name}</span>
      </nav>

      {/* Summary */}
      <section className="mt-4 rounded-3xl border border-base-300 bg-base-100 p-5 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4 sm:items-center">
            <div className="grid size-20 shrink-0 place-items-center rounded-2xl bg-base-200 text-5xl" aria-hidden>
              {product.emoji}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-secondary sm:text-3xl">{product.name}</h1>
              <p className="mt-1 text-base-content/70">{product.description || trendText}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {product.tags.map((t) => (
                  <span key={t} className="badge badge-outline badge-primary">
                    {t}
                  </span>
                ))}
                <span className="badge badge-ghost">{product.unit}</span>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-primary/10 p-4 text-left sm:min-w-52 sm:text-right">
            <p className="text-sm text-base-content/60">আজকের গড় দাম</p>
            <p className="text-3xl font-extrabold text-primary">{formatTaka(product.price)}</p>
            <div className="mt-1 flex items-center gap-2 sm:justify-end">
              <ChangeBadge pct={product.changePct} />
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-base-content/60">{trendText}</p>
      </section>

      {/* Price summary */}
      <section className="mt-8">
        <h2 className="mb-3 text-xl font-bold">দামের সারসংক্ষেপ</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="সর্বনিম্ন দাম" value={product.minPrice} note={product.minMarket && `সবচেয়ে কম দামের বাজার: ${product.minMarket}`} unit={product.unitShort} tone="text-green-700" />
          <Stat label="সর্বাধিক দাম" value={product.maxPrice} note={product.maxMarket && `সবচেয়ে বেশি দামের বাজার: ${product.maxMarket}`} unit={product.unitShort} tone="text-red-600" />
          <Stat label="গড় দাম" value={product.avgPrice} note={`${product.unit}-এর হিসাবে`} unit={product.unitShort} tone="text-primary" />
        </div>
      </section>

      {/* Market table */}
      <section className="mt-8">
        <h2 className="mb-3 text-xl font-bold">বাজারভিত্তিক আজকের দাম</h2>
        {product.markets.length ? (
          <>
            <div className="overflow-x-auto rounded-2xl border border-base-300 bg-base-100">
              <table className="table">
                <thead>
                  <tr className="text-base-content/70">
                    <th>বাজার</th>
                    <th>বিভাগ</th>
                    <th className="text-right">সর্বনিম্ন</th>
                    <th className="text-right">সর্বাধিক</th>
                    <th className="text-right">গড়</th>
                  </tr>
                </thead>
                <tbody>
                  {product.markets.map((m, i) => (
                    <tr key={`${m.name}-${i}`} className="hover:bg-base-200/60">
                      <td className="font-medium">{m.name}</td>
                      <td>{m.division}</td>
                      <td className="text-right whitespace-nowrap">{formatTaka(m.min)}</td>
                      <td className="text-right whitespace-nowrap">{formatTaka(m.max)}</td>
                      <td className="text-right font-semibold whitespace-nowrap">{formatTaka(m.avg)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="mt-8 mb-3 text-lg font-bold">
              <span aria-hidden>⚖️ </span>বাজার তুলনা
            </h3>
            <ul className="space-y-3 rounded-2xl border border-base-300 bg-base-100 p-5">
              {product.markets.map((m, i) => (
                <li key={`${m.name}-bar-${i}`} className="grid grid-cols-[7rem_1fr_5.5rem] items-center gap-3 text-sm sm:grid-cols-[10rem_1fr_6.5rem]">
                  <span className="truncate">{m.name}</span>
                  <span className="h-3 overflow-hidden rounded-full bg-base-200">
                    <span className="block h-full rounded-full bg-primary" style={{ width: `${barWidth(m.avg)}%` }} />
                  </span>
                  <span className="text-right font-medium">{formatTaka(m.avg)}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="rounded-2xl border border-dashed border-base-300 bg-base-100 p-8 text-center text-base-content/60">
            এই পণ্যের বাজারভিত্তিক তথ্য এখনো পাওয়া যায়নি।
          </p>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value, note, unit, tone }: { label: string; value: number; note?: string; unit: string; tone: string }) {
  return (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-5">
      <p className="text-sm text-base-content/60">{label}</p>
      <p className={`mt-1 text-2xl font-extrabold ${tone}`}>
        {formatTaka(value)}
        <span className="text-sm font-medium text-base-content/50"> / {unit}</span>
      </p>
      {note && <p className="mt-2 text-sm text-base-content/60">{note}</p>}
    </div>
  );
}
