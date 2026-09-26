"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMemberByIdApi } from "@/lib/memberApi";
import { MemberFormView } from "@/components/member/MemberFormView";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function MemberDetailClient({ id }: { id: string }) {
  const { data: member, isLoading, error } = useQuery({
    queryKey: ["member", id],
    queryFn: () => fetchMemberByIdApi(id),
  });

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#00B074] border-t-transparent" />
          <p className="text-xs font-semibold text-gray-500">Loading member profile...</p>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="p-8 text-center bg-[#F8FAFC] min-h-screen">
        <div className="max-w-md mx-auto bg-white p-6 rounded-2xl border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Member Not Found</h2>
          <p className="text-sm text-gray-500 mb-4">
            Could not find details for member ID: {id}
          </p>
          <Link
            href="/dashboard/member"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00B074] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Member List</span>
          </Link>
        </div>
      </div>
    );
  }

  return <MemberFormView initialMember={member} isCreateMode={false} />;
}
