import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getServerSession } from "@/lib/session";
import SignOutButton from "@/components/SignOutButton";

export const metadata: Metadata = { title: "আমার প্রোফাইল" };
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getServerSession();
  if (!session) redirect("/signin?redirect=/profile&reason=login-required");
  const { user } = session;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-extrabold text-secondary sm:text-3xl">আমার প্রোফাইল</h1>
      <p className="text-sm text-base-content/60">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>

      <div className="mt-6 rounded-3xl border border-base-300 bg-base-100 p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="avatar avatar-placeholder">
            <div className="size-20 rounded-full bg-primary text-3xl text-primary-content">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt="" referrerPolicy="no-referrer" />
              ) : (
                <span>{user.name?.[0]?.toUpperCase() ?? "U"}</span>
              )}
            </div>
          </div>
          <div className="min-w-0">
            <p className="truncate text-xl font-bold">{user.name}</p>
            <p className="truncate text-base-content/60">{user.email}</p>
          </div>
        </div>

        <dl className="mt-6 divide-y divide-base-300 text-sm">
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-base-content/60">নাম</dt>
            <dd className="font-medium">{user.name}</dd>
          </div>
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-base-content/60">ইমেইল</dt>
            <dd className="font-medium break-all">{user.email}</dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/profile/update" className="btn btn-primary rounded-full">
            আপডেট
          </Link>
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
