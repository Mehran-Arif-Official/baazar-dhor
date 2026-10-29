import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getServerSession } from "@/lib/session";
import UpdateProfileForm from "@/components/UpdateProfileForm";

export const metadata: Metadata = { title: "তথ্য আপডেট" };
export const dynamic = "force-dynamic";

export default async function UpdateProfilePage() {
  const session = await getServerSession();
  if (!session) redirect("/signin?redirect=/profile/update&reason=login-required");

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Link href="/profile" className="text-sm text-base-content/60 hover:text-primary">
        ← প্রোফাইলে ফিরে যান
      </Link>
      <div className="mt-4 rounded-3xl border border-base-300 bg-base-100 p-6 sm:p-8">
        <h1 className="text-2xl font-extrabold text-secondary">তথ্য আপডেট</h1>
        <p className="mt-1 mb-6 text-sm text-base-content/60">আপনার নাম পরিবর্তন করুন।</p>
        <UpdateProfileForm initialName={session.user.name} />
      </div>
    </div>
  );
}
