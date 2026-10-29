import { GridSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-4">
      <div className="mt-6 grid gap-6 rounded-3xl bg-base-100 p-6 sm:p-10 md:grid-cols-2" aria-hidden>
        <div className="space-y-4">
          <div className="skeleton h-6 w-40 rounded-full" />
          <div className="skeleton h-12 w-full" />
          <div className="skeleton h-12 w-3/4" />
          <div className="skeleton h-16 w-full" />
          <div className="skeleton h-12 w-40 rounded-full" />
        </div>
        <div className="skeleton h-52 w-full rounded-2xl" />
      </div>
      <div className="mt-12 mb-4 skeleton h-8 w-56" />
      <GridSkeleton count={6} />
    </div>
  );
}
