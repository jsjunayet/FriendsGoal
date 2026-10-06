import { NoticeFeed } from "@/components/sections/NoticeFeed";
import { PageHero } from "@/components/PageHero";

export const metadata = {
  title: "Notices & Announcements — Friends Goal",
  description: "Stay updated with official notices, general assemblies, and community announcements.",
};

export default function NoticesOverviewPage() {
  return (
    <main className="flex-1 w-full bg-white">
      <PageHero
        breadcrumbs={[
          { label: "HOME", href: "/" },
          { label: "NOTICES & STORIES" },
        ]}
        titleLine1="Notices & Stories"
        description="Stay informed with transparent updates, general assembly notes, and investment growth announcements."
      />
      <NoticeFeed />
    </main>
  );
}
