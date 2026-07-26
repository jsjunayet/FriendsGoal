// Reusable Friends Goal logo mark (SVG icon + optional label handled by parent)
export function BrandLogo({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md ${
        dark ? "bg-[#1FDE64]" : "bg-[#1FDE64]"
      }`}
    >
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5" aria-hidden="true">
        <path
          d="M10 2.5C10 2.5 4.5 6.5 4.5 11.5C4.5 14.54 7.19 17 10 17C12.81 17 15.5 14.54 15.5 11.5C15.5 6.5 10 2.5 10 2.5Z"
          fill="white"
        />
        <circle cx="10" cy="11.5" r="2.8" fill="#1FDE64" />
      </svg>
    </div>
  );
}
