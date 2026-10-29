const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

/** Convert any Bengali digits inside a string to ASCII digits. */
export function bnToEn(input: string): string {
  return input
    .replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)))
    .replace(/٫/g, ".");
}

/** Parse numbers like 148, "১,৮৫০ টাকা", "২.১%", "-3.5" into a JS number. */
export function parseNumber(input: unknown): number | null {
  if (typeof input === "number") return Number.isFinite(input) ? input : null;
  if (typeof input !== "string") return null;
  const cleaned = bnToEn(input).replace(/,/g, "").replace(/−/g, "-");
  const m = cleaned.match(/-?\d+(?:\.\d+)?/);
  if (!m) return null;
  const n = parseFloat(m[0]);
  return Number.isFinite(n) ? n : null;
}

/** Number -> Bengali digits string with grouping (১,৮৫০). */
export function toBn(n: number, maxFractionDigits = 2, minFractionDigits = 0): string {
  const s = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: maxFractionDigits,
    minimumFractionDigits: minFractionDigits,
  }).format(n);
  return s.replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
}

export const formatTaka = (n: number) => `${toBn(n)} টাকা`;

export const formatPct = (n: number) => `${toBn(Math.abs(n), 1, 1)}%`;

const BN_DAYS = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
const BN_MONTHS = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

/** "মঙ্গলবার, ৬ অক্টোবর, ২০২৬" in Asia/Dhaka time. */
export function banglaDate(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "short",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  const day = Number(get("day"));
  const month = Number(get("month")) - 1;
  const year = Number(get("year"));
  return `${BN_DAYS[wd]}, ${toBn(day, 0)} ${BN_MONTHS[month]}, ${toBn(year, 0).replace(/,/g, "")}`;
}

export function slugify(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{M}\p{N}-]/gu, "");
}
