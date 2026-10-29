"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/cn";

export default function Navbar({ categories, date }: { categories: Category[]; date: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  async function handleSignOut() {
    const { error } = await authClient.signOut();
    if (error) return toast.error(error.message || "সাইন আউট করা যায়নি");
    toast.success("সফলভাবে সাইন আউট হয়েছে");
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3 lg:flex-nowrap">
          <Link href="/" className="flex flex-col leading-tight">
            <span className="text-xl font-extrabold text-primary">
              <span aria-hidden>🛒 </span>বাজার দর
            </span>
            <span className="text-xs text-base-content/60" suppressHydrationWarning>
              {date}
            </span>
          </Link>

          <nav
            aria-label="পণ্যের বিভাগ"
            className="order-3 -mx-4 w-[calc(100%+2rem)] overflow-x-auto px-4 lg:order-none lg:mx-0 lg:w-auto lg:flex-1 lg:px-0"
          >
            <ul className="flex w-max items-center gap-1 lg:mx-auto">
              {categories.map((c) => {
                const href = `/category/${encodeURIComponent(c.slug)}`;
                const active = pathname === href || pathname === `/category/${c.slug}`;
                return (
                  <li key={c.slug}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block rounded-full px-3.5 py-1.5 text-sm font-medium transition",
                        active
                          ? "bg-primary text-primary-content shadow-sm"
                          : "text-base-content/75 hover:bg-base-200 hover:text-primary",
                      )}
                    >
                      {c.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {isPending ? (
              <div className="skeleton h-9 w-28 rounded-full" />
            ) : user ? (
              <div className="dropdown dropdown-end">
                <button tabIndex={0} className="btn btn-ghost btn-sm gap-2 rounded-full sm:btn-md" aria-label="প্রোফাইল মেনু">
                  <span className="avatar avatar-placeholder">
                    <span className="size-8 rounded-full bg-primary text-primary-content">
                      {user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.image} alt="" className="rounded-full" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="text-sm">{user.name?.[0]?.toUpperCase() ?? "U"}</span>
                      )}
                    </span>
                  </span>
                  <span className="hidden max-w-28 truncate sm:inline">{user.name}</span>
                </button>
                <ul tabIndex={0} className="menu dropdown-content z-50 mt-2 w-48 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg">
                  <li>
                    <Link href="/profile">আমার প্রোফাইল</Link>
                  </li>
                  <li>
                    <button onClick={handleSignOut}>↩ সাইন আউট</button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link href="/signin" className="btn btn-outline btn-primary btn-sm rounded-full sm:btn-md">
                  সাইন ইন
                </Link>
                <Link href="/signup" className="btn btn-primary btn-sm rounded-full sm:btn-md">
                  সাইন আপ
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
