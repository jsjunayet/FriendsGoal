export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">

      {/* ── Logo mark ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-6">

        {/* Animated logo ring */}
        <div className="relative w-20 h-20">
          {/* Spinning border ring */}
          <svg
            className="absolute inset-0 animate-spin"
            style={{ animationDuration: "1.8s" }}
            viewBox="0 0 80 80"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="40" cy="40" r="36"
              stroke="#E5E5E5"
              strokeWidth="4"
            />
            <circle
              cx="40" cy="40" r="36"
              stroke="#1FDE64"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="56 170"
              strokeDashoffset="0"
            />
          </svg>

          {/* Static logo centre */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-[#1FDE64] flex items-center justify-center shadow-md">
              <svg width="26" height="26" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M10 2.5C10 2.5 4.5 6.5 4.5 11.5C4.5 14.54 7.19 17 10 17C12.81 17 15.5 14.54 15.5 11.5C15.5 6.5 10 2.5 10 2.5Z"
                  fill="white"
                />
                <circle cx="10" cy="11.5" r="2.8" fill="#1FDE64" />
              </svg>
            </div>
          </div>
        </div>

        {/* Brand name */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="font-bold text-[#1A1A1A] text-[20px] tracking-tight">
            Friends Goal
          </span>
          <span className="text-[12px] text-[#888888] tracking-[0.18em] uppercase font-medium">
            Loading…
          </span>
        </div>

        {/* Animated progress bar */}
        <div className="w-40 h-1 bg-[#F0F0F0] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1FDE64] rounded-full animate-loading-bar"
          />
        </div>
      </div>

      {/* ── Tagline ───────────────────────────────────────────────────────── */}
      <p className="absolute bottom-10 text-[12px] text-[#AAAAAA] tracking-wide italic">
        &ldquo;Let&rsquo;s Go Together, Inshallah.&rdquo;
      </p>
    </div>
  );
}
