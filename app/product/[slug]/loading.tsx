export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8" role="status" aria-label="লোড হচ্ছে…">
      <div className="skeleton h-4 w-48" />
      <div className="mt-6 rounded-3xl bg-base-100 p-6">
        <div className="flex items-center gap-4">
          <div className="skeleton size-20 rounded-2xl" />
          <div className="flex-1 space-y-3">
            <div className="skeleton h-8 w-2/3" />
            <div className="skeleton h-4 w-1/2" />
          </div>
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton h-32 rounded-2xl" />
        ))}
      </div>
      <div className="skeleton mt-6 h-72 rounded-2xl" />
    </div>
  );
}
