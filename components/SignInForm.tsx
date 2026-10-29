"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import SocialButtons from "./SocialButtons";

function Form() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect");
  const target = redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const toasted = useRef(false);

  useEffect(() => {
    if (params.get("reason") === "login-required" && !toasted.current) {
      toasted.current = true;
      toast.error("এই পাতা দেখতে আগে সাইন ইন করুন");
    }
  }, [params]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");
    setError("");
    if (!email || !password) {
      const msg = "ইমেইল ও পাসওয়ার্ড দিন";
      setError(msg);
      return toast.error(msg);
    }
    setLoading(true);
    const { error } = await authClient.signIn.email({ email, password });
    setLoading(false);
    if (error) {
      const msg = error.message || "সাইন ইন করা যায়নি। ইমেইল ও পাসওয়ার্ড যাচাই করুন।";
      setError(msg);
      return toast.error(msg);
    }
    toast.success("সফলভাবে সাইন ইন হয়েছে");
    router.push(target);
    router.refresh();
  }

  return (
    <>
      <form onSubmit={onSubmit} className="grid gap-4" noValidate>
        {error && (
          <div role="alert" className="alert alert-error alert-soft text-sm">
            {error}
          </div>
        )}
        <label className="form-control grid gap-1">
          <span className="text-sm font-medium">ইমেইল</span>
          <input name="email" type="email" autoComplete="email" placeholder="you@example.com" className="input w-full" required />
        </label>
        <label className="form-control grid gap-1">
          <span className="text-sm font-medium">পাসওয়ার্ড</span>
          <input name="password" type="password" autoComplete="current-password" placeholder="কমপক্ষে ৮ অক্ষর" className="input w-full" required />
        </label>
        <button type="submit" disabled={loading} className="btn btn-primary w-full rounded-full">
          {loading && <span className="loading loading-spinner loading-sm" />}
          সাইন ইন
        </button>
      </form>
      <div className="divider my-6 text-sm text-base-content/50">অথবা</div>
      <SocialButtons callbackURL={target} />
      <p className="mt-6 text-center text-sm">
        <Link href="/signup" className="font-medium text-primary hover:underline">
          অ্যাকাউন্ট নেই? সাইন আপ করুন
        </Link>
      </p>
    </>
  );
}

export default function SignInForm() {
  return (
    <Suspense fallback={<div className="skeleton h-72 w-full" />}>
      <Form />
    </Suspense>
  );
}
