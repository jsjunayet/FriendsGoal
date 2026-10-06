"use client";

import { NoticeDetailClient } from "@/app/notice/[slug]/NoticeDetailClient";

export default function NoticeDetailPageClient({ id }: { id: string }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NoticeDetailClient idOrSlug={id} />
    </div>
  );
}

