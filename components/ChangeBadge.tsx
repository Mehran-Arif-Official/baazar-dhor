import { formatPct } from "@/lib/format";
import { cn } from "@/lib/cn";

export default function ChangeBadge({ pct, className }: { pct: number; className?: string }) {
  const up = pct > 0;
  const down = pct < 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        up && "bg-green-100 text-green-700",
        down && "bg-red-100 text-red-600",
        !up && !down && "bg-gray-100 text-gray-500",
        className,
      )}
    >
      {up ? "▲" : down ? "▼" : "—"} {formatPct(pct)}
    </span>
  );
}
