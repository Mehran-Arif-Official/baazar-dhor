import type { Metadata } from "next";
import AuthShell from "@/components/AuthShell";
import SignInForm from "@/components/SignInForm";

export const metadata: Metadata = { title: "সাইন ইন" };

export default function SignInPage() {
  return (
    <AuthShell title="সাইন ইন" subtitle="বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।">
      <SignInForm />
    </AuthShell>
  );
}
