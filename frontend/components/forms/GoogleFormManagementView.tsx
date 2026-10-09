"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FileSpreadsheet,
  Plus,
  Search,
  ExternalLink,
  Copy,
  Pencil,
  Trash2,
  Check,
  Loader2,
  Eye,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import {
  fetchGoogleFormsApi,
  createGoogleFormApi,
  updateGoogleFormApi,
  deleteGoogleFormApi,
  IGoogleFormItem,
} from "@/lib/googleFormApi";

export function GoogleFormManagementView() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    embedUrl: "",
    description: "",
    status: "Active" as "Active" | "Inactive",
  });

  const { data: forms = [], isLoading } = useQuery({
    queryKey: ["google-forms", search],
    queryFn: () => fetchGoogleFormsApi({ search }),
  });

  const createMutation = useMutation({
    mutationFn: createGoogleFormApi,
    onSuccess: () => {
      toast.success("Google Form registered successfully!");
      queryClient.invalidateQueries({ queryKey: ["google-forms"] });
      handleReset();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create Google Form");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: any) => updateGoogleFormApi(editingId!, payload),
    onSuccess: () => {
      toast.success("Google Form updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["google-forms"] });
      handleReset();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update Google Form");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGoogleFormApi,
    onSuccess: () => {
      toast.success("Google Form deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["google-forms"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete Google Form");
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.title.trim()) {
      toast.error("Please enter a form title.");
      return;
    }
    if (!formData.embedUrl.trim()) {
      toast.error("Please enter a Google Form URL or iframe code.");
      return;
    }

    if (editingId) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (form: IGoogleFormItem) => {
    setEditingId(form._id);
    setFormData({
      title: form.title,
      embedUrl: form.rawInput || form.embedUrl,
      description: form.description || "",
      status: form.status,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete form "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleReset = () => {
    setEditingId(null);
    setFormData({
      title: "",
      embedUrl: "",
      description: "",
      status: "Active",
    });
  };

  const copyMemberLink = (formId: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const memberUrl = `${origin}/dashboard/forms/${formId}`;
    navigator.clipboard.writeText(memberUrl);
    setCopiedId(formId);
    toast.success("Member form link copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen">
      {/* ─── Top Header ───────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-[26px] sm:text-[28px] font-bold text-gray-900 tracking-tight">
          Google Forms Management
        </h1>
        <p className="text-xs sm:text-[13px] text-gray-500 mt-1">
          Embed Google Forms directly into member views with native layout integration.
        </p>
      </div>

      {/* ─── Form Creation / Edit Card ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EAF8F1] flex items-center justify-center text-[#00B074]">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-[17px] sm:text-[18px] font-bold text-gray-900">
                {editingId ? "Edit Embedded Google Form" : "Create New Embedded Google Form"}
              </h2>
              <p className="text-xs text-gray-500">
                Provide form details and paste the Google Form URL or iframe tag.
              </p>
            </div>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-gray-500 hover:text-gray-900 font-semibold underline cursor-pointer"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Form Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">
                Form Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g. Annual Event Registration 2026"
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs sm:text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00B074] focus:border-[#00B074]"
              />
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "Active" | "Inactive",
                  })
                }
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs sm:text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#00B074] focus:border-[#00B074] cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Google Form Embed URL / Link */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700">
              Google Form Embed URL / Link <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.embedUrl}
              onChange={(e) =>
                setFormData({ ...formData, embedUrl: e.target.value })
              }
              placeholder="Paste Google Form link (e.g. https://docs.google.com/forms/...) or full <iframe> embed tag"
              required
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs sm:text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00B074] focus:border-[#00B074]"
            />
            <p className="text-[11px] text-gray-400">
              Auto-extracts the source link if you paste full <code>&lt;iframe src=&quot;...&quot;&gt;</code> embed HTML.
            </p>
          </div>

          {/* Optional Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Short note or instructions for members regarding this form"
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs sm:text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00B074] focus:border-[#00B074] resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs sm:text-[13px] font-bold rounded-xl transition-colors cursor-pointer shadow-2xs"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#00B074] hover:bg-[#009663] text-white text-xs sm:text-[13px] font-bold rounded-xl transition-colors cursor-pointer shadow-2xs disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin text-white" />}
              <span>{editingId ? "Update Google Form" : "Save Google Form"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* ─── Table of Registered Forms ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-[18px] sm:text-[20px] font-bold text-gray-900">
              Registered Google Forms
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {forms.length} total form{forms.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="relative min-w-[220px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search forms"
              className="w-full pl-3 pr-8 py-2 bg-white border border-gray-300 rounded-xl text-xs sm:text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00B074] focus:border-[#00B074]"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-[#FAFAFA]/70">
                <th className="py-3.5 px-6 text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                  FORM TITLE
                </th>
                <th className="py-3.5 px-6 text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                  EMBED URL
                </th>
                <th className="py-3.5 px-6 text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                  STATUS
                </th>
                <th className="py-3.5 px-6 text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                  MEMBER PORTAL LINK
                </th>
                <th className="py-3.5 px-6 text-[11px] font-bold tracking-wider text-gray-500 uppercase text-right">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#00B074]" />
                    <p className="text-xs mt-2">Loading forms...</p>
                  </td>
                </tr>
              ) : forms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 text-xs">
                    No Google Forms registered yet. Create one above!
                  </td>
                </tr>
              ) : (
                forms.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/60 transition-colors">
                    {/* TITLE */}
                    <td className="py-4 px-6 max-w-xs">
                      <div className="font-serif font-bold text-gray-900 text-[14px]">
                        {item.title}
                      </div>
                      {item.description && (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                          {item.description}
                        </p>
                      )}
                    </td>

                    {/* EMBED URL */}
                    <td className="py-4 px-6 max-w-xs">
                      <a
                        href={item.embedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-gray-500 hover:text-[#00B074] truncate flex items-center gap-1"
                        title={item.embedUrl}
                      >
                        <span className="truncate">{item.embedUrl}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </td>

                    {/* STATUS */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                          item.status === "Active"
                            ? "bg-[#EAF8F1] text-[#00B074] border border-[#A7F3D0]"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* COPY LINK */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => copyMemberLink(item._id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-semibold text-gray-700 transition-colors cursor-pointer shadow-2xs"
                      >
                        {copiedId === item._id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#00B074]" />
                            <span className="text-[#00B074]">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-gray-500" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* ACTIONS */}
                    <td className="py-4 px-6 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/dashboard/forms/${item._id}`}
                          target="_blank"
                          className="p-1 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                          title="Preview form"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="p-1 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                          title="Edit form"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item._id, item.title)}
                          className="p-1 text-[#EF4444] hover:text-[#DC2626] transition-colors cursor-pointer"
                          title="Delete form"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
