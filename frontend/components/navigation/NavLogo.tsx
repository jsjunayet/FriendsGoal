import Link from "next/link";

export function NavLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
      <div className="w-9 h-9 rounded-full bg-[#1FDE64] flex items-center justify-center flex-shrink-0 group-hover:bg-[#18C957] transition-colors duration-200 shadow-sm">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M10 2.5C10 2.5 4.5 6.5 4.5 11.5C4.5 14.54 7.19 17 10 17C12.81 17 15.5 14.54 15.5 11.5C15.5 6.5 10 2.5 10 2.5Z"
            fill="#262626"
          />
          <circle cx="10" cy="11.5" r="2.8" fill="#1FDE64" />
        </svg>
      </div>
      <span className="font-bold text-gray-900 text-[15px] leading-tight hidden sm:block tracking-tight">
        Friends Goal
      </span>
    </Link>
  );
}
