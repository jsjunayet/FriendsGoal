"use client";

import React from "react";

/**
 * 1. Hero Section Skeleton
 * Pixel-perfect hero slider fallback (aspect-ratio/fixed height box with title & action placeholders)
 */
export function HeroSectionSkeleton() {
  return (
    <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 my-6 animate-pulse">
      <div className="w-full h-[380px] sm:h-[460px] md:h-[500px] bg-slate-200 dark:bg-zinc-800 rounded-3xl overflow-hidden relative p-8 md:p-12 flex flex-col justify-end">
        <div className="space-y-4 max-w-2xl">
          <div className="h-6 w-32 bg-slate-300 dark:bg-zinc-700 rounded-full" />
          <div className="h-10 sm:h-12 w-3/4 bg-slate-300 dark:bg-zinc-700 rounded-xl" />
          <div className="h-4 w-5/6 bg-slate-300 dark:bg-zinc-700 rounded-lg" />
          <div className="flex gap-4 pt-4">
            <div className="h-12 w-36 bg-slate-300 dark:bg-zinc-700 rounded-xl" />
            <div className="h-12 w-36 bg-slate-300 dark:bg-zinc-700 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 2. Notice Ticker Strip Skeleton
 */
export function NoticeTickerSkeleton() {
  return (
    <div className="w-full bg-slate-100 dark:bg-zinc-900 border-y border-slate-200 dark:border-zinc-800 py-3 px-6 flex items-center gap-4 animate-pulse">
      <div className="h-6 w-24 bg-slate-300 dark:bg-zinc-700 rounded-full shrink-0" />
      <div className="h-4 w-full bg-slate-200 dark:bg-zinc-800 rounded-md" />
    </div>
  );
}

/**
 * 3. Notice Card & Notice Grid Skeleton
 */
export function NoticeCardSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs animate-pulse flex flex-col h-full">
      <div className="h-48 w-full bg-slate-200 dark:bg-zinc-800 shrink-0" />
      <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-5 w-28 bg-slate-200 dark:bg-zinc-800 rounded-full" />
            <div className="h-4 w-20 bg-slate-200 dark:bg-zinc-800 rounded" />
          </div>
          <div className="h-6 w-5/6 bg-slate-300 dark:bg-zinc-700 rounded-md" />
          <div className="h-4 w-full bg-slate-200 dark:bg-zinc-800 rounded" />
          <div className="h-4 w-3/4 bg-slate-200 dark:bg-zinc-800 rounded" />
        </div>
        <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex justify-between items-center">
          <div className="h-4 w-24 bg-slate-200 dark:bg-zinc-800 rounded" />
          <div className="h-4 w-16 bg-slate-300 dark:bg-zinc-700 rounded" />
        </div>
      </div>
    </div>
  );
}

export function NoticeGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <NoticeCardSkeleton key={idx} />
      ))}
    </div>
  );
}

/**
 * 4. Single Notice Detail Page Skeleton
 * Matches `/notice/[slug]` pixel-perfect typography layout
 */
export function NoticeDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-pulse">
      {/* Top back button skeleton */}
      <div className="h-5 w-20 bg-slate-200 dark:bg-zinc-800 rounded-md" />

      {/* Header section skeleton */}
      <div className="flex flex-col items-center space-y-3 text-center">
        <div className="h-5 w-36 bg-emerald-100 dark:bg-emerald-950/40 rounded-full" />
        <div className="h-10 w-4/5 bg-slate-300 dark:bg-zinc-700 rounded-xl" />
        <div className="h-4 w-44 bg-slate-200 dark:bg-zinc-800 rounded" />
      </div>

      {/* Hero Image Slider skeleton */}
      <div className="w-full h-[360px] md:h-[460px] bg-slate-200 dark:bg-zinc-800 rounded-2xl" />

      {/* Agenda Highlights Card skeleton */}
      <div className="bg-slate-50 dark:bg-zinc-900/60 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-4">
        <div className="h-6 w-44 bg-slate-300 dark:bg-zinc-700 rounded-md" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-slate-200 dark:bg-zinc-800 rounded" />
          <div className="h-4 w-5/6 bg-slate-200 dark:bg-zinc-800 rounded" />
          <div className="h-4 w-4/6 bg-slate-200 dark:bg-zinc-800 rounded" />
        </div>
      </div>

      {/* Rich Text Paragraphs skeleton */}
      <div className="space-y-4 pt-4">
        <div className="h-4 w-full bg-slate-200 dark:bg-zinc-800 rounded" />
        <div className="h-4 w-11/12 bg-slate-200 dark:bg-zinc-800 rounded" />
        <div className="h-4 w-4/5 bg-slate-200 dark:bg-zinc-800 rounded" />
        <div className="h-4 w-full bg-slate-200 dark:bg-zinc-800 rounded" />
        <div className="h-4 w-3/4 bg-slate-200 dark:bg-zinc-800 rounded" />
      </div>
    </div>
  );
}

/**
 * 5. Dashboard Stats Cards Skeleton
 */
export function DashboardStatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 space-y-3 shadow-2xs"
        >
          <div className="flex justify-between items-center">
            <div className="h-4 w-24 bg-slate-200 dark:bg-zinc-800 rounded" />
            <div className="h-8 w-8 bg-slate-200 dark:bg-zinc-800 rounded-full" />
          </div>
          <div className="h-8 w-32 bg-slate-300 dark:bg-zinc-700 rounded-lg" />
          <div className="h-3 w-20 bg-slate-200 dark:bg-zinc-800 rounded" />
        </div>
      ))}
    </div>
  );
}

/**
 * 6. Data Table Skeleton
 */
export function DataTableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-2xs animate-pulse">
      <div className="p-4 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center bg-slate-50/50 dark:bg-zinc-900/50">
        <div className="h-5 w-36 bg-slate-200 dark:bg-zinc-800 rounded" />
        <div className="h-9 w-28 bg-slate-300 dark:bg-zinc-700 rounded-xl" />
      </div>
      <div className="divide-y divide-slate-100 dark:border-zinc-800">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="p-4 flex items-center justify-between gap-4">
            {Array.from({ length: cols }).map((_, cIdx) => (
              <div
                key={cIdx}
                className={`h-4 bg-slate-200 dark:bg-zinc-800 rounded ${
                  cIdx === 0 ? "w-1/6" : cIdx === 1 ? "w-1/3" : "w-1/5"
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 7. Form Modal Skeleton
 */
export function FormModalSkeleton() {
  return (
    <div className="space-y-6 animate-pulse p-6">
      <div className="h-6 w-48 bg-slate-300 dark:bg-zinc-700 rounded-md" />
      <div className="space-y-4">
        <div className="h-4 w-24 bg-slate-200 dark:bg-zinc-800 rounded" />
        <div className="h-10 w-full bg-slate-100 dark:bg-zinc-800 rounded-xl" />
      </div>
      <div className="space-y-4">
        <div className="h-4 w-32 bg-slate-200 dark:bg-zinc-800 rounded" />
        <div className="h-28 w-full bg-slate-100 dark:bg-zinc-800 rounded-xl" />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <div className="h-10 w-24 bg-slate-200 dark:bg-zinc-800 rounded-xl" />
        <div className="h-10 w-32 bg-emerald-300 dark:bg-emerald-800 rounded-xl" />
      </div>
    </div>
  );
}

/**
 * 8. Dashboard Overview Skeleton (`/dashboard`, `/admin/dashboard`)
 */
export function DashboardOverviewSkeleton() {
  return (
    <div className="p-6 space-y-8 animate-pulse w-full max-w-[1400px] mx-auto">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-56 bg-slate-300 dark:bg-zinc-700 rounded-lg" />
        <div className="h-4 w-96 bg-slate-200 dark:bg-zinc-800 rounded" />
      </div>

      {/* 4 KPI Stat Cards Skeleton */}
      <DashboardStatsSkeleton count={4} />

      {/* Chart & Recent Transactions Block Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        <div className="lg:col-span-2 h-80 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
          <div className="h-5 w-40 bg-slate-300 dark:bg-zinc-700 rounded" />
          <div className="h-48 w-full bg-slate-200 dark:bg-zinc-800/60 rounded-xl" />
        </div>
        <div className="h-80 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="h-5 w-32 bg-slate-300 dark:bg-zinc-700 rounded" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-slate-200/50 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-800" />
                  <div className="h-4 w-28 bg-slate-200 dark:bg-zinc-800 rounded" />
                </div>
                <div className="h-4 w-16 bg-slate-300 dark:bg-zinc-700 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 9. Member Management Skeleton (`/admin/dashboard/members`)
 */
export function MemberManagementSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse w-full max-w-[1400px] mx-auto">
      {/* Header & Action bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-slate-300 dark:bg-zinc-700 rounded-lg" />
          <div className="h-4 w-64 bg-slate-200 dark:bg-zinc-800 rounded" />
        </div>
        <div className="h-11 w-36 bg-emerald-300 dark:bg-emerald-800/60 rounded-xl" />
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800">
        <div className="h-10 w-full sm:w-80 bg-slate-100 dark:bg-zinc-800 rounded-xl" />
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-slate-100 dark:bg-zinc-800 rounded-xl" />
          <div className="h-10 w-32 bg-slate-100 dark:bg-zinc-800 rounded-xl" />
        </div>
      </div>

      {/* Member Table Skeleton with Avatars */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
          <div className="h-4 w-full bg-slate-200 dark:bg-zinc-800 rounded" />
        </div>
        <div className="divide-y divide-slate-100 dark:divide-zinc-800">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-1/4">
                <div className="w-9 h-9 rounded-full bg-slate-300 dark:bg-zinc-700 shrink-0" />
                <div className="space-y-1.5 w-full">
                  <div className="h-4 w-3/4 bg-slate-300 dark:bg-zinc-700 rounded" />
                  <div className="h-3 w-1/2 bg-slate-200 dark:bg-zinc-800 rounded" />
                </div>
              </div>
              <div className="h-4 w-1/6 bg-slate-200 dark:bg-zinc-800 rounded hidden md:block" />
              <div className="h-6 w-20 bg-slate-200 dark:bg-zinc-800 rounded-full" />
              <div className="h-4 w-1/6 bg-slate-200 dark:bg-zinc-800 rounded hidden sm:block" />
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-zinc-800" />
                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 10. Operations & Financial Routes Skeleton
 */
export function OperationPageSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse w-full max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-7 w-52 bg-slate-300 dark:bg-zinc-700 rounded-lg" />
          <div className="h-4 w-72 bg-slate-200 dark:bg-zinc-800 rounded" />
        </div>
        <div className="h-10 w-32 bg-emerald-300 dark:bg-emerald-800/60 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="h-24 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 space-y-2">
          <div className="h-4 w-28 bg-slate-200 dark:bg-zinc-800 rounded" />
          <div className="h-7 w-36 bg-slate-300 dark:bg-zinc-700 rounded" />
        </div>
        <div className="h-24 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 space-y-2">
          <div className="h-4 w-28 bg-slate-200 dark:bg-zinc-800 rounded" />
          <div className="h-7 w-36 bg-slate-300 dark:bg-zinc-700 rounded" />
        </div>
        <div className="h-24 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 space-y-2">
          <div className="h-4 w-28 bg-slate-200 dark:bg-zinc-800 rounded" />
          <div className="h-7 w-36 bg-slate-300 dark:bg-zinc-700 rounded" />
        </div>
      </div>

      <DataTableSkeleton rows={6} cols={5} />
    </div>
  );
}

