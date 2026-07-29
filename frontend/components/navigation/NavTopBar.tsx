import { Phone, Mail, MapPin } from "lucide-react";
import { SITE_CONFIG } from "@/constants/site";

const SOCIALS = [
  { key: "fb",  label: "Facebook",   icon: "f"  },
  { key: "li",  label: "LinkedIn",   icon: "in" },
  { key: "tw",  label: "X (Twitter)", icon: "𝕏" },
] as const;

export function NavTopBar() {
  return (
    <div className="hidden lg:block bg-[#1FDE64] text-[#262626] text-[11.5px]">
      <div className="max-w-[1280px] mx-auto px-6 xl:px-8 h-9 flex items-center justify-between">
        {/* Left: address + email */}
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[#262626]/80">
            <MapPin className="w-3 h-3 flex-shrink-0 text-[#262626]/60" />
            {SITE_CONFIG.address}
          </span>
          <span className="w-px h-3 bg-[#262626]/20" aria-hidden="true" />
          <a
            href={`mailto:${SITE_CONFIG.email}`}
            className="flex items-center gap-1.5 text-[#262626]/80 hover:text-[#262626] transition-colors"
          >
            <Mail className="w-3 h-3 flex-shrink-0 text-[#262626]/60" />
            {SITE_CONFIG.email}
          </a>
        </div>

        {/* Right: phone + socials */}
        <div className="flex items-center gap-4">
          <a
            href={`tel:${SITE_CONFIG.phone}`}
            className="flex items-center gap-1.5 text-[#262626]/80 hover:text-[#262626] transition-colors"
          >
            <Phone className="w-3 h-3 flex-shrink-0 text-[#262626]/60" />
            {SITE_CONFIG.phone}
          </a>
          <span className="w-px h-3.5 bg-[#262626]/20" aria-hidden="true" />
          <div className="flex items-center gap-[16px]">
            {SOCIALS.map((s) => (
              <a
                key={s.key}
                href="#"
                aria-label={s.label}
                className="w-5 h-5 bg-[#262626]/15 rounded-full flex items-center justify-center hover:bg-[#262626] hover:text-white transition-colors text-[9px] font-bold leading-none"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
