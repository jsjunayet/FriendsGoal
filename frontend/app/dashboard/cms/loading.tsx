import { DataTableSkeleton } from "@/components/ui/Skeletons";

export default function Loading() {
  return <DataTableSkeleton rows={6} cols={5} />;
}
