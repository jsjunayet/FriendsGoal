import type { Metadata } from "next";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { AdminSidebar } from "@/components/dashboard/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin Dashboard | Friends Goal",
  description: "Friends Goal administration and financial overview.",
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F7FAF8] flex flex-col">
      <DashboardNav />

      {/* Body: sidebar + main */}
      <div className="flex flex-1 max-w-[1400px] w-full mx-auto px-0 xl:px-4">
        <AdminSidebar />
        <main className="flex-1 min-w-0 px-4 sm:px-6 xl:px-8 py-8">
          {children}
        </main>
      </div>

      <footer className="border-t border-[#E5E5E5] bg-white py-4">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 xl:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] text-[#AAAAAA]">
          <span>© 2024 Friends Goal. Built for collective prosperity.</span>
          <span>
            Developed by{" "}
            <a href="#" className="text-[#2B5A27] font-semibold hover:underline">
              Turtle Studio
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
