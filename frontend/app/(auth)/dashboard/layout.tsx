import { DashboardNav } from "@/components/dashboard/DashboardNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F7FAF8] flex flex-col">
      <DashboardNav />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-[#E5E5E5] bg-white py-4">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 xl:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] text-[#AAAAAA]">
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
