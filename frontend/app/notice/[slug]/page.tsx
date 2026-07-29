import type { Metadata } from "next";
import { Footer } from "@/components/footer/Footer";
import { NEWS_ARTICLES } from "@/constants/site";
import { notFound } from "next/navigation";
import { NoticeDetailClient } from "./NoticeDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return NEWS_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
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
  if (!article) notFound();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NoticeDetailClient article={article} />
    </div>
  );
}
