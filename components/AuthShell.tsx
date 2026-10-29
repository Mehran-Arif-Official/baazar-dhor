import Link from "next/link";

export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Link href="/" className="text-sm text-base-content/60 hover:text-primary">
        ← হোম পেজে ফিরে যান
      </Link>
      <div className="mt-4 rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-extrabold text-secondary">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-base-content/60">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
