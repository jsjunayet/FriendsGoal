"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  FileSpreadsheet,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { fetchGoogleFormByIdApi, cleanGoogleFormEmbedUrl } from "@/lib/googleFormApi";

interface GoogleFormEmbedViewProps {
  formId: string;
}

export function GoogleFormEmbedView({ formId }: GoogleFormEmbedViewProps) {
  const router = useRouter();

  const { data: form, isLoading, isError } = useQuery({
    queryKey: ["google-form", formId],
    queryFn: () => fetchGoogleFormByIdApi(formId),
  });

  if (isLoading) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-8 bg-[#F8FAFC]">
        <Loader2 className="w-8 h-8 animate-spin text-[#00B074]" />
        <p className="text-xs text-gray-500 mt-2 font-medium">
          Loading embedded form...
        </p>
      </div>
    );
  }

  if (isError || !form) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-8 bg-[#F8FAFC]">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-200 text-center shadow-xs">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900">Form Not Available</h2>
          <p className="text-xs text-gray-500 mt-1 mb-6">
            The requested form may be inactive or does not exist.
          </p>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#00B074] text-white rounded-xl text-xs font-bold hover:bg-[#009663] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Top Header */}
      <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-20 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => router.back()}
              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
              title="Back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="font-serif text-[17px] sm:text-[19px] font-bold text-gray-900 truncate">
                {form.title}
              </h1>
              {form.description && (
                <p className="text-xs text-gray-500 truncate hidden sm:block">
                  {form.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={form.embedUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 shadow-2xs transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Open in new tab</span>
            </a>
          </div>
        </div>
      </div>

      {/* Embedded Iframe Container */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden min-h-[750px] flex flex-col">
          <iframe
            src={cleanGoogleFormEmbedUrl(form.embedUrl)}
            width="100%"
            height="750px"
            title={form.title}
            className="w-full flex-1 min-h-[750px] border-0 rounded-2xl bg-white"
          >
            Loading form...
          </iframe>
        </div>
      </div>
    </div>
  );
}
