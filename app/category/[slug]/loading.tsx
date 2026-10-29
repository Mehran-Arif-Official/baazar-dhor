import { GridSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8">
      <div className="mb-6 flex items-center justify-between" aria-hidden>
        <div className="space-y-2">
          <div className="skeleton h-9 w-40" />
          <div className="skeleton h-4 w-56" />
        </div>
        <div className="skeleton h-10 w-48" />
      </div>
      <GridSkeleton count={8} />
    </div>
  );
}
