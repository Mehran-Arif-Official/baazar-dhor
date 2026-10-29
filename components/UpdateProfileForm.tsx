"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function UpdateProfileForm({ initialName }: { initialName: string }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = name.trim();
    if (!value) return toast.error("নাম খালি রাখা যাবে না");
    setLoading(true);
    const { error } = await authClient.updateUser({ name: value });
    setLoading(false);
    if (error) return toast.error(error.message || "তথ্য আপডেট করা যায়নি");
    toast.success("তথ্য সফলভাবে আপডেট হয়েছে");
    router.push("/profile");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <label className="grid gap-1">
        <span className="text-sm font-medium">নাম</span>
        <input value={name} onChange={(e) => setName(e.target.value)} className="input w-full" placeholder="আপনার নাম" required />
      </label>
      <button type="submit" disabled={loading} className="btn btn-primary rounded-full">
        {loading && <span className="loading loading-spinner loading-sm" />}
        তথ্য আপডেট করুন
      </button>
    </form>
  );
}
