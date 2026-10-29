export default function Footer() {
  return (
    <footer className="mt-16 border-t border-base-300 bg-base-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-base-content/70 md:flex-row md:items-center md:justify-between">
        <p className="font-medium text-base-content">
          <span aria-hidden>🛒 </span>বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>
        <p className="md:text-right">সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।</p>
      </div>
    </footer>
  );
}
