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
 * 8. Admin Financial Analytics Dashboard Skeleton (`/admin/dashboard`)
 */
export function AdminDashboardSkeleton() {
  return (
    <div className="w-full flex flex-col gap-7 p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen animate-pulse">
      {/* 1. Top Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-56 bg-slate-200 rounded-lg" />
          <div className="h-4 w-72 bg-slate-200/80 rounded" />
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-200" />
      </div>

      {/* 2. Top Stats Grid (6 KPI cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Row 1: 4 Cards */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-[#EDF2F7] shadow-xs flex flex-col justify-between h-[116px]"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 bg-slate-200 rounded" />
              <div className="w-9 h-9 rounded-xl bg-slate-100" />
            </div>
            <div className="h-8 w-24 bg-slate-200 rounded-lg mt-2" />
          </div>
        ))}

        {/* Row 2: 2 Cards */}
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-[#EDF2F7] shadow-xs flex flex-col justify-between h-[116px] lg:col-span-2 sm:col-span-1 col-span-1"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 bg-slate-200 rounded" />
              <div className="w-9 h-9 rounded-xl bg-slate-100" />
            </div>
            <div className="h-8 w-24 bg-slate-200 rounded-lg mt-2" />
          </div>
        ))}
      </div>

      {/* 3. Delivery Section */}
      <div className="flex flex-col gap-3">
        <div className="h-5 w-24 bg-slate-200 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Column 1: Member Collection Chart (5/12) */}
          <div className="lg:col-span-6 xl:col-span-5 bg-white rounded-2xl p-6 border border-[#EDF2F7] shadow-xs h-[340px] flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="h-5 w-36 bg-slate-200 rounded" />
              <div className="h-4 w-6 bg-slate-200 rounded" />
            </div>
            <div className="h-[220px] w-full bg-slate-100 rounded-xl" />
          </div>

          {/* Column 2: Performance Pie (3/12) */}
          <div className="lg:col-span-6 xl:col-span-3 bg-white rounded-2xl p-6 border border-[#EDF2F7] shadow-xs h-[340px] flex flex-col justify-between">
            <div className="h-5 w-28 bg-slate-200 rounded" />
            <div className="w-36 h-36 rounded-full bg-slate-100 mx-auto" />
            <div className="space-y-2">
              <div className="h-3 w-3/4 bg-slate-200 rounded" />
              <div className="h-3 w-1/2 bg-slate-200 rounded" />
            </div>
          </div>

          {/* Column 3: Member Due List Table (4/12) */}
          <div className="lg:col-span-12 xl:col-span-4 bg-white rounded-2xl p-6 border border-[#EDF2F7] shadow-xs h-[340px] flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="h-5 w-32 bg-slate-200 rounded" />
              <div className="h-6 w-20 bg-slate-200 rounded-full" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100">
                  <div className="h-4 w-24 bg-slate-200 rounded" />
                  <div className="h-4 w-16 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 8b. Member Dashboard Skeleton (`/dashboard`, `/(auth)/dashboard`)
 */
export function MemberDashboardSkeleton() {
  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 xl:px-8 py-8 sm:py-12 flex flex-col gap-10 bg-[#F8FAFC] min-h-screen animate-pulse">
      {/* 1. Welcome Banner */}
      <div className="space-y-2">
        <div className="h-8 w-3/4 sm:w-1/2 bg-slate-200 rounded-xl" />
      </div>

      {/* 2. Personal Financial Status Card */}
      <div className="bg-white rounded-[28px] border border-[#E5E5E5] p-6 sm:p-8 flex flex-col lg:flex-row gap-8 shadow-xs">
        {/* Left Column: Member Profile */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4 lg:w-[260px] shrink-0 border-b lg:border-b-0 lg:border-r border-[#E5E5E5] pb-6 lg:pb-0 lg:pr-8">
          <div className="w-28 h-28 rounded-2xl bg-slate-200" />
          <div className="space-y-2 w-full">
            <div className="h-3 w-16 bg-slate-200 rounded mx-auto lg:mx-0" />
            <div className="h-6 w-36 bg-slate-200 rounded-lg mx-auto lg:mx-0" />
            <div className="h-4 w-28 bg-slate-200 rounded mx-auto lg:mx-0" />
          </div>
        </div>

        {/* Right Column: 3 Stat Cards & Actions */}
        <div className="flex-1 flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <div className="h-5 w-44 bg-slate-200 rounded" />
              <div className="h-3 w-64 bg-slate-200 rounded" />
            </div>
            <div className="flex gap-2">
              <div className="h-9 w-28 bg-slate-200 rounded-lg" />
              <div className="h-9 w-28 bg-slate-200 rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-28 bg-slate-100 rounded-2xl p-5" />
            <div className="h-28 bg-slate-100 rounded-2xl p-5" />
          </div>

          <div className="h-28 bg-slate-100 rounded-2xl p-5" />

          <div className="h-12 w-full bg-slate-200 rounded-xl" />

          {/* Upcoming Schedule */}
          <div className="border-t border-slate-100 pt-5 mt-2 flex flex-col gap-3">
            <div className="h-5 w-44 bg-slate-200 rounded" />
            <div className="h-16 w-full bg-slate-100 rounded-xl" />
          </div>
        </div>
      </div>

      {/* 3. Friends Goal Overview Section */}
      <div className="flex flex-col gap-4">
        <div className="h-7 w-52 bg-slate-200 rounded-lg" />
        <div className="bg-white rounded-[28px] border border-[#E5E5E5] p-6 sm:p-8 flex flex-col gap-5 shadow-xs">
          {/* Top 2 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="h-36 bg-slate-100 rounded-[22px] p-7" />
            <div className="h-36 bg-slate-100 rounded-[22px] p-7" />
          </div>
          {/* Middle Card */}
          <div className="h-32 bg-slate-100 rounded-[24px] p-7" />
          {/* Bottom 3 Mini Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="h-20 bg-slate-100 rounded-[20px]" />
            <div className="h-20 bg-slate-100 rounded-[20px]" />
            <div className="h-20 bg-slate-100 rounded-[20px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 8c. Alias DashboardOverviewSkeleton to AdminDashboardSkeleton
 */
export function DashboardOverviewSkeleton() {
  return <AdminDashboardSkeleton />;
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
 * 10. Operations & Financial Routes Skeleton (Due List, Collection, Adjustment, Expense, Investment, etc.)
 */
export function OperationPageSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 animate-pulse w-full max-w-[1400px] mx-auto bg-[#F8FAFC] min-h-screen">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1.5">
          <div className="h-7 w-48 bg-slate-300 dark:bg-zinc-700 rounded-lg" />
          <div className="h-4 w-64 bg-slate-200 dark:bg-zinc-800 rounded" />
        </div>
        <div className="h-10 w-28 bg-slate-200 dark:bg-zinc-800 rounded-xl" />
      </div>

      {/* 2. Filter Box */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xs">
        <div className="h-3 w-44 bg-slate-200 dark:bg-zinc-800 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-10 bg-slate-100 dark:bg-zinc-800 rounded-xl" />
          <div className="h-10 bg-slate-100 dark:bg-zinc-800 rounded-xl" />
          <div className="h-10 bg-slate-100 dark:bg-zinc-800 rounded-xl" />
        </div>
      </div>

      {/* 3. Status Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="h-7 w-16 bg-slate-200 dark:bg-zinc-800 rounded-full" />
        <div className="h-7 w-20 bg-slate-200 dark:bg-zinc-800 rounded-full" />
        <div className="h-7 w-16 bg-slate-200 dark:bg-zinc-800 rounded-full" />
        <div className="h-7 w-16 bg-slate-200 dark:bg-zinc-800 rounded-full" />
      </div>

      {/* 4. Table Card */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
        {/* Table Header */}
        <div className="bg-[#FAFBFD] dark:bg-zinc-900/60 border-b border-slate-100 dark:border-zinc-800 py-3.5 px-6 flex justify-between gap-4">
          <div className="h-3.5 w-20 bg-slate-200 dark:bg-zinc-800 rounded" />
          <div className="h-3.5 w-32 bg-slate-200 dark:bg-zinc-800 rounded" />
          <div className="h-3.5 w-28 bg-slate-200 dark:bg-zinc-800 rounded hidden md:block" />
          <div className="h-3.5 w-24 bg-slate-200 dark:bg-zinc-800 rounded" />
          <div className="h-3.5 w-24 bg-slate-200 dark:bg-zinc-800 rounded" />
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-slate-100 dark:divide-zinc-800">
          {Array.from({ length: 6 }).map((_, rIdx) => (
            <div key={rIdx} className="py-4 px-6 flex items-center justify-between gap-4">
              <div className="h-4 w-12 bg-slate-200 dark:bg-zinc-800 rounded" />
              <div className="h-4 w-36 bg-slate-200 dark:bg-zinc-800 rounded" />
              <div className="h-4 w-28 bg-slate-200 dark:bg-zinc-800 rounded hidden md:block" />
              <div className="h-4 w-20 bg-slate-200 dark:bg-zinc-800 rounded" />
              <div className="h-5 w-16 bg-slate-200 dark:bg-zinc-800 rounded-full" />
            </div>
          ))}
        </div>

        {/* Table Footer / Pagination */}
        <div className="py-4 px-6 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="h-3.5 w-36 bg-slate-200 dark:bg-zinc-800 rounded" />
          <div className="flex items-center gap-1.5">
            <div className="h-7 w-12 bg-slate-100 dark:bg-zinc-800 rounded-lg" />
            <div className="h-7 w-7 bg-emerald-200 dark:bg-emerald-800 rounded-lg" />
            <div className="h-7 w-12 bg-slate-100 dark:bg-zinc-800 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 11. Reusable Table Rows Skeleton for in-table loading states
 */
export function TableRowsSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr key={rIdx} className="animate-pulse">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <td key={cIdx} className="py-4 px-6">
              <div
                className={`h-4 bg-slate-200 dark:bg-zinc-800 rounded ${
                  cIdx === 0
                    ? "w-14"
                    : cIdx === 1
                    ? "w-36"
                    : cIdx === cols - 1
                    ? "w-16 ml-auto"
                    : "w-24"
                }`}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

