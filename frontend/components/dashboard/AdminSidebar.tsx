"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    href: "/admin/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/dashboard/members",
    label: "Member Management",
    icon: Users,
    exact: false,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-[220px] flex-shrink-0 bg-white border-r border-[#E5E5E5] min-h-full">
      {/* Role badge */}
      <div className="px-5 pt-6 pb-4 border-b border-[#F0F0F0]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#2B5A27]" />
          <span className="text-[11px] font-bold tracking-[0.16em] text-[#2B5A27] uppercase">
            {user?.role === "superAdmin" ? "Super Admin" : "Admin"}
          </span>
        </div>
        <p className="text-[12px] text-[#AAAAAA] mt-1 truncate">{user?.userId}</p>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 p-3 flex-1" aria-label="Admin navigation">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 h-[42px] px-3 rounded-[12px] text-[13px] font-semibold transition-colors",
                active
                  ? "bg-[#F0FFF5] text-[#2B5A27]"
                  : "text-[#555555] hover:bg-[#F7F7F7] hover:text-[#1A1A1A]",
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 flex-shrink-0",
                  active ? "text-[#1FDE64]" : "text-[#AAAAAA]",
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
