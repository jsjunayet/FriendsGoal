import NoticeDetailPageClient from "./NoticeDetailPageClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return {
    title: `Notice — Friends Goal`,
    description: "Detailed notice announcement for Friends Goal members and public visitors.",
  };
}

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <NoticeDetailPageClient id={id} />;
}
