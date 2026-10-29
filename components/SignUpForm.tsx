"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import SocialButtons from "./SocialButtons";

export default function SignUpForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function fail(msg: string) {
    setError(msg);
    toast.error(msg);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");
    const confirm = String(fd.get("confirm") || "");
    setError("");

    if (!name) return fail("আপনার নাম লিখুন");
    if (!email) return fail("ইমেইল লিখুন");
    if (password.length < 8) return fail("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
    if (password !== confirm) return fail("পাসওয়ার্ড দুটি মিলছে না");

    setLoading(true);
    const { error } = await authClient.signUp.email({ name, email, password });
    setLoading(false);
    if (error) return fail(error.message || "অ্যাকাউন্ট তৈরি করা যায়নি");

    toast.success("অ্যাকাউন্ট তৈরি হয়েছে! এখন সাইন ইন করুন");
    router.push("/signin");
  }

  return (
    <>
      <form onSubmit={onSubmit} className="grid gap-4" noValidate>
        {error && (
          <div role="alert" className="alert alert-error alert-soft text-sm">
            {error}
          </div>
        )}
        <label className="grid gap-1">
          <span className="text-sm font-medium">নাম</span>
          <input name="name" type="text" autoComplete="name" placeholder="যেমন: রহিম উদ্দিন" className="input w-full" required />
        </label>
        <label className="grid gap-1">
          <span className="text-sm font-medium">ইমেইল</span>
          <input name="email" type="email" autoComplete="email" placeholder="you@example.com" className="input w-full" required />
        </label>
        <label className="grid gap-1">
          <span className="text-sm font-medium">পাসওয়ার্ড</span>
          <input name="password" type="password" autoComplete="new-password" placeholder="কমপক্ষে ৮ অক্ষর" className="input w-full" required />
        </label>
        <label className="grid gap-1">
          <span className="text-sm font-medium">পাসওয়ার্ড নিশ্চিত করুন</span>
          <input name="confirm" type="password" autoComplete="new-password" placeholder="আবার লিখুন" className="input w-full" required />
        </label>
        <button type="submit" disabled={loading} className="btn btn-primary w-full rounded-full">
          {loading && <span className="loading loading-spinner loading-sm" />}
          সাইন আপ করুন
        </button>
      </form>
      <div className="divider my-6 text-sm text-base-content/50">অথবা</div>
      <SocialButtons callbackURL="/" />
      <p className="mt-6 text-center text-sm">
        <Link href="/signin" className="font-medium text-primary hover:underline">
          অ্যাকাউন্ট আছে? সাইন ইন করুন
        </Link>
      </p>
    </>
  );
}
