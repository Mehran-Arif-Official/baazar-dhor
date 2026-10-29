import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategory, getProductsByCategory } from "@/lib/api";
import { toBn } from "@/lib/format";
import SortableProducts from "@/components/SortableProducts";
import EmptyState from "@/components/EmptyState";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategory((await params).slug);
  return { title: category?.name ?? "বিভাগ" };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  const products = await getProductsByCategory(category);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8">
      <div className="mb-6 flex items-center gap-4">
        <div className="grid size-14 place-items-center rounded-2xl bg-base-100 text-3xl shadow-sm" aria-hidden>
          {category.emoji}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-secondary sm:text-3xl">{category.name}</h1>
          <p className="text-sm text-base-content/60">{toBn(products.length, 0)}টি পণ্যের আজকের দাম ও পরিবর্তন</p>
        </div>
      </div>
      {products.length ? (
        <SortableProducts products={products} />
      ) : (
        <EmptyState title="এই বিভাগে কোনো পণ্য নেই" message="অন্য একটি বিভাগ বেছে নিন বা হোম পেজে ফিরে যান।" />
      )}
    </div>
  );
}
