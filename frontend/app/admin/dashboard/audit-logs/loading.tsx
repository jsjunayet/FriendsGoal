import { DataTableSkeleton } from "@/components/ui/Skeletons";

export default function Loading() {
  return <DataTableSkeleton rows={7} cols={4} />;
}
