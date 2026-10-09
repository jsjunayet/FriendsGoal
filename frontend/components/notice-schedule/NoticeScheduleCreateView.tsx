"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, DollarSign } from "lucide-react";
import { toast } from "sonner";
import {
  createNoticeScheduleApi,
  updateNoticeScheduleApi,
  fetchNoticeScheduleByIdApi,
  NoticeScheduleType,
  NoticeAudience,
} from "@/lib/noticeScheduleApi";
import { fetchMembersApi, IMember } from "@/lib/memberApi";

export function NoticeScheduleCreateView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<NoticeScheduleType>("Fee Reminder");

  // Query members for the Specific Member selector
  const { data: membersRes } = useQuery({
    queryKey: ["members-list-for-audience"],
    queryFn: () => fetchMembersApi({ limit: 100 }),
    staleTime: 60000,
  });
  const membersList: IMember[] = membersRes?.data || [];

  // Shared form state preserved across tab switching
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    audience: "All members" as NoticeAudience,
    targetMemberId: "",
    targetMemberName: "",
    targetMemberCode: "",
    dueDate: "",
    feeAmount: "",
    eventDate: "",
    time: "",
    location: "",
    agenda: "",
  });

  // Prepopulate if editing
  const { data: editData } = useQuery({
    queryKey: ["notice-schedule-edit", editId],
    queryFn: () => (editId ? fetchNoticeScheduleByIdApi(editId) : null),
    enabled: !!editId,
  });

  useEffect(() => {
    if (editData) {
      setActiveTab(editData.type);
      setFormData({
        title: editData.title || "",
        message: editData.message || "",
        audience: editData.audience || "All members",
        targetMemberId: editData.targetMemberId || "",
        targetMemberName: editData.targetMemberName || "",
        targetMemberCode: editData.targetMemberCode || "",
        dueDate: editData.dueDate || "",
        feeAmount: editData.feeAmount ? String(editData.feeAmount) : "",
        eventDate: editData.eventDate || "",
        time: editData.time || "",
        location: editData.location || "",
        agenda: editData.agenda || "",
      });
    }
  }, [editData]);

  const createMutation = useMutation({
    mutationFn: createNoticeScheduleApi,
    onSuccess: () => {
      toast.success("Notice schedule published successfully!");
      queryClient.invalidateQueries({ queryKey: ["notice-schedules"] });
      router.push("/dashboard/notice-schedule");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to publish notice schedule");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: any) => updateNoticeScheduleApi(editId!, payload),
    onSuccess: () => {
      toast.success("Notice schedule updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["notice-schedules"] });
      router.push("/dashboard/notice-schedule");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update notice schedule");
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.title.trim()) {
      toast.error("Please enter a notice title.");
      return;
    }

    if (activeTab === "Fee Reminder") {
      if (!formData.dueDate.trim()) {
        toast.error("Please specify a payment due date.");
        return;
      }
      if (!formData.feeAmount.trim() || Number(formData.feeAmount) <= 0) {
        toast.error("Please enter a valid fee amount.");
        return;
      }
    }

    if (activeTab === "Invitation" || activeTab === "Meeting") {
      if (!formData.eventDate.trim()) {
        toast.error("Please specify an event date.");
        return;
      }
      if (!formData.time.trim()) {
        toast.error("Please specify an event time.");
        return;
      }
      if (!formData.location.trim()) {
        toast.error("Please specify an event location.");
        return;
      }
    }

    if (formData.audience === "Specific member" && !formData.targetMemberId) {
      toast.error("Please select a specific member.");
      return;
    }

    const payload: any = {
      type: activeTab,
      title: formData.title.trim(),
      message: formData.message.trim(),
      audience: formData.audience,
      status: "Published",
    };

    if (formData.audience === "Specific member") {
      payload.targetMemberId = formData.targetMemberId;
      payload.targetMemberName = formData.targetMemberName;
      payload.targetMemberCode = formData.targetMemberCode;
    }

    if (activeTab === "Fee Reminder") {
      payload.dueDate = formData.dueDate.trim();
      payload.feeAmount = Number(formData.feeAmount);
      payload.feeCurrency = "$";
      payload.paymentStatus = "Payment due";
    } else if (activeTab === "Invitation") {
      payload.eventDate = formData.eventDate.trim();
      payload.time = formData.time.trim();
      payload.location = formData.location.trim();
    } else if (activeTab === "Meeting") {
      payload.eventDate = formData.eventDate.trim();
      payload.time = formData.time.trim();
      payload.location = formData.location.trim();
      payload.agenda = formData.agenda.trim() || formData.message.trim();
    }

    if (editId) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleClear = () => {
    setFormData({
      title: "",
      message: "",
      audience: "All members",
      targetMemberId: "",
      targetMemberName: "",
      targetMemberCode: "",
      dueDate: "",
      feeAmount: "",
      eventDate: "",
      time: "",
      location: "",
      agenda: "",
    });
  };

  const getFormHeading = () => {
    switch (activeTab) {
      case "Fee Reminder":
        return editId ? "Edit fee reminder" : "Create fee reminder";
      case "Important Notice":
        return editId ? "Edit important notice" : "Create important notice";
      case "Invitation":
        return editId ? "Edit invitation" : "Create invitation";
      case "Meeting":
        return editId ? "Edit meeting" : "Create meeting";
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen">
      {/* ─── Top Header matching Screenshot 4 & 5 ─────────────────────────── */}
      <div>
        <Link
          href="/dashboard/notice-schedule"
          className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-gray-500 hover:text-gray-900 mb-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to notice schedules</span>
        </Link>
        <h1 className="text-[26px] sm:text-[28px] font-bold text-gray-900 tracking-tight">
          Notice Schedule
        </h1>
        <p className="text-xs sm:text-[13px] text-gray-500 mt-1">
          Publish fee reminders, important notices, invitations, and member meetings directly to members.
        </p>
      </div>

      {/* ─── Form Card matching Screenshot 4 & 5 ──────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden max-w-4xl">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Card Title & Required Notice */}
          <div>
            <h2 className="font-serif text-[20px] sm:text-[22px] font-bold text-gray-900">
              {getFormHeading()}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Required fields are marked with an asterisk.
            </p>
          </div>

          {/* 1. Message Type Selector Tabs matching Screenshots 4 & 5 */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700">
              Message type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(
                [
                  "Fee Reminder",
                  "Important Notice",
                  "Invitation",
                  "Meeting",
                ] as NoticeScheduleType[]
              ).map((type) => {
                const isActive = activeTab === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setActiveTab(type)}
                    className={`py-2.5 px-4 rounded-xl text-xs sm:text-[13px] font-semibold transition-all border text-center cursor-pointer ${
                      isActive
                        ? "bg-[#EAF8F1] border-[#00B074] text-[#0E8A5A] shadow-2xs font-bold"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Dynamic Input Fields based on Active Tab */}
          {/* A. TITLE FIELD (adapts label & placeholder) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700">
              {activeTab === "Fee Reminder"
                ? "Reminder title *"
                : activeTab === "Meeting"
                ? "Meeting title *"
                : "Notice title *"}
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder={
                activeTab === "Fee Reminder"
                  ? "e.g. Monthly Maintenance Fee"
                  : activeTab === "Important Notice"
                  ? "e.g. Office Closed on Friday"
                  : activeTab === "Invitation"
                  ? "e.g. Annual Members Dinner"
                  : "e.g. Quarterly Members Meeting"
              }
              required
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs sm:text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00B074] focus:border-[#00B074]"
            />
          </div>

          {/* B. TAB SPECIFIC MIDDLE FIELDS */}
          {/* Fee Reminder: Payment due date + Fee amount matching Screenshot 4 */}
          {activeTab === "Fee Reminder" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  Payment due date <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                  placeholder="e.g. Oct 15, 2026"
                  required
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs sm:text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00B074] focus:border-[#00B074]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  Fee amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-[13px] font-medium pointer-events-none">
                    $
                  </span>
                  <input
                    type="number"
                    step="any"
                    value={formData.feeAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, feeAmount: e.target.value })
                    }
                    placeholder="0.00"
                    required
                    className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs sm:text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00B074] focus:border-[#00B074]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Invitation & Meeting: Event Date + Time + Location */}
          {(activeTab === "Invitation" || activeTab === "Meeting") && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  Event Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.eventDate}
                  onChange={(e) =>
                    setFormData({ ...formData, eventDate: e.target.value })
                  }
                  placeholder="e.g. Oct 22, 2026"
                  required
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs sm:text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00B074] focus:border-[#00B074]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  placeholder="e.g. 6:30 PM"
                  required
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs sm:text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00B074] focus:border-[#00B074]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="e.g. Friends Goal Community"
                  required
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs sm:text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00B074] focus:border-[#00B074]"
                />
              </div>
            </div>
          )}

          {/* C. DETAILS / AGENDA TEXTAREA matching Screenshots 4 & 5 */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700">
              {activeTab === "Meeting"
                ? "Agenda / Meeting details"
                : "Message details"}
            </label>
            <textarea
              rows={4}
              value={activeTab === "Meeting" ? formData.agenda || formData.message : formData.message}
              onChange={(e) => {
                if (activeTab === "Meeting") {
                  setFormData({
                    ...formData,
                    agenda: e.target.value,
                    message: e.target.value,
                  });
                } else {
                  setFormData({ ...formData, message: e.target.value });
                }
              }}
              placeholder="Write the message members should receive"
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs sm:text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00B074] focus:border-[#00B074] resize-y"
            />
          </div>

          {/* D. AUDIENCE SELECT DROPDOWN */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">
                Audience
              </label>
              <select
                value={formData.audience}
                onChange={(e) => {
                  const newAudience = e.target.value as NoticeAudience;
                  setFormData({
                    ...formData,
                    audience: newAudience,
                    ...(newAudience !== "Specific member"
                      ? { targetMemberId: "", targetMemberName: "", targetMemberCode: "" }
                      : {}),
                  });
                }}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs sm:text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#00B074] focus:border-[#00B074] cursor-pointer"
              >
                <option value="All members">All members</option>
                <option value="Due members">Due members (Only members with pending dues)</option>
                <option value="Specific member">Specific member (Single member)</option>
                <option value="Active members">Active members</option>
              </select>
            </div>

            {/* When Specific member is selected, render searchable/selectable member dropdown */}
            {formData.audience === "Specific member" && (
              <div className="space-y-2 p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-xl animate-in fade-in duration-200">
                <label className="block text-xs font-bold text-emerald-900">
                  Select Specific Member *
                </label>
                <select
                  value={formData.targetMemberId}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const selectedMember = membersList.find(
                      (m) => m._id === selectedId
                    );
                    setFormData({
                      ...formData,
                      targetMemberId: selectedId,
                      targetMemberName: selectedMember?.fullName || "",
                      targetMemberCode: selectedMember?.memberCode || "",
                    });
                  }}
                  className="w-full px-4 py-2.5 bg-white border border-emerald-300 rounded-xl text-xs sm:text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#00B074] focus:border-[#00B074] cursor-pointer"
                >
                  <option value="">-- Choose member from list --</option>
                  {membersList.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.fullName} ({m.memberCode || "No Code"})
                      {m.dueAmount !== undefined ? ` - ৳${m.dueAmount.toLocaleString()} Due` : ""}
                    </option>
                  ))}
                </select>
                {formData.targetMemberName ? (
                  <p className="text-[11px] text-emerald-800 font-medium">
                    Targeted strictly to: <span className="font-bold">{formData.targetMemberName}</span> ({formData.targetMemberCode})
                  </p>
                ) : (
                  <p className="text-[11px] text-emerald-700/80">
                    Choose the member who should receive this schedule directly in their dashboard.
                  </p>
                )}
              </div>
            )}

            {/* When Due members is selected, show informative badge */}
            {formData.audience === "Due members" && (
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-[11.5px] text-amber-800 font-medium animate-in fade-in duration-200">
                ⚠️ Notice will be published exclusively to members with an outstanding due balance. Members with ৳0 due will not see this notice.
              </div>
            )}
          </div>

          {/* E. Action Buttons matching Screenshots 4 & 5 */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs sm:text-[13px] font-bold rounded-xl transition-colors cursor-pointer shadow-2xs"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#2B4A24] hover:bg-[#1E3E1A] text-white text-xs sm:text-[13px] font-bold rounded-xl transition-colors cursor-pointer shadow-2xs disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin text-white" />}
              <span>{editId ? "Update notice" : "Publish now"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
