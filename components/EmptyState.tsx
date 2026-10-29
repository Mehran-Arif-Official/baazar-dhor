import Link from "next/link";

export default function EmptyState({
  title = "কিছু পাওয়া যায়নি",
  message = "আপনি যে পাতাটি খুঁজছেন সেটি পাওয়া যায়নি বা এখানে কোনো পণ্য নেই।",
  code = "৪০৪",
}: {
  title?: string;
  message?: string;
  code?: string;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <div className="text-6xl" aria-hidden>
        🧺
      </div>
      <p className="mt-4 text-5xl font-extrabold text-primary">{code}</p>
      <h1 className="mt-2 text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-base-content/70">{message}</p>
      <Link href="/" className="btn btn-primary mt-6 rounded-full">
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}
