import Image from "next/image";
import { getProducts } from "@/lib/api";
import { toBn } from "@/lib/format";
import ProductSection from "@/components/ProductSection";
import AllProducts from "@/components/AllProducts";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getProducts();
  const risers = products
    .filter((p) => p.changePct > 0)
    .sort((a, b) => b.changePct - a.changePct)
    .slice(0, 6);
  const fallers = products
    .filter((p) => p.changePct < 0)
    .sort((a, b) => a.changePct - b.changePct)
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-4">
      {/* Hero */}
      <section className="mt-6 grid items-center gap-8 overflow-hidden rounded-3xl bg-gradient-to-br from-green-50 via-white to-emerald-100 p-6 sm:p-10 md:grid-cols-2">
        <div>
          <p className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            {toBn(products.length, 0)}টি নিত্যদিনের পণ্য
          </p>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-secondary sm:text-4xl lg:text-5xl">
            আজকের বাজারের দাম এক নজরে
          </h1>
          <p className="mt-4 max-w-xl text-base text-base-content/70 sm:text-lg">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং
            দামের পরিবর্তন এক জায়গায়।
          </p>
          <a href="#সব-পণ্য" className="btn btn-primary mt-6 rounded-full px-6">
            সব পণ্য দেখুন
          </a>
        </div>
        <div className="flex justify-center md:justify-end">
          <Image
            src="/hero-basket.png"
            alt="ফল ও সবজির ঝুড়ি"
            width={315}
            height={263}
            priority
            className="h-auto w-full max-w-xs sm:max-w-sm md:max-w-md"
          />
        </div>
      </section>

      <ProductSection title="আজ দাম বেড়েছে ▲" subtitle="সবচেয়ে বেশি দাম বেড়েছে এমন ৬টি পণ্য" products={risers} tone="up" />
      <ProductSection title="আজ দাম কমেছে ▼" subtitle="সবচেয়ে বেশি দাম কমেছে এমন ৬টি পণ্য" products={fallers} tone="down" />
      <AllProducts products={products} />
    </div>
  );
}
