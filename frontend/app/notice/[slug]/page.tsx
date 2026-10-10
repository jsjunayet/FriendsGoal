import type { Metadata } from "next";
import { NEWS_ARTICLES } from "@/constants/site";
import { getSingleNoticeApi, type NoticeItem } from "@/lib/noticeApi";
import { NoticeDetailClient } from "./NoticeDetailClient";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const notice = await getSingleNoticeApi(slug);
    if (notice) {
      const title =
        (typeof notice.title === "string" ? notice.title : notice.title?.en || notice.title?.bn) ||
        "Notice";
      const desc =
        (typeof notice.description === "string"
          ? notice.description
          : notice.description?.en || notice.description?.bn) || "Official notice from Friends Goal.";
      return {
        title: `${title} | Friends Goal`,
        description: desc,
      };
    }
  } catch {}

  const article = NEWS_ARTICLES.find((a) => a.slug === slug);
  return {
    title: article ? `${article.title} | Friends Goal` : "Notice | Friends Goal",
    description: article
      ? `Read the full notice: ${article.title}`
      : "Official notice from Friends Goal.",
  };
}

export default async function NoticeDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = NEWS_ARTICLES.find((a) => a.slug === slug);

  let initialNotice: NoticeItem | null = null;
  try {
    initialNotice = await getSingleNoticeApi(slug);
  } catch {
    initialNotice = null;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NoticeDetailClient
        article={article}
        idOrSlug={slug}
        initialNotice={initialNotice || undefined}
      />
    </div>
  );
}
