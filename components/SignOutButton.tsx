"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SignOutButton() {
  const router = useRouter();
  return (
    <button
      className="btn btn-outline btn-error rounded-full"
      onClick={async () => {
        const { error } = await authClient.signOut();
        if (error) return toast.error(error.message || "সাইন আউট করা যায়নি");
        toast.success("সফলভাবে সাইন আউট হয়েছে");
        router.push("/");
        router.refresh();
      }}
    >
      ↩ সাইন আউট
    </button>
  );
}
