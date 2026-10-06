"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  Camera,
  Trash2,
  Eye,
  EyeOff,
  PenTool,
  Upload,
  UserCheck,
  Check,
  Download,
  Edit2,
  ChevronDown,
  Loader2,
  X,
} from "lucide-react";
import { z } from "zod";
import {
  createMemberApi,
  updateMemberApi,
  deleteMemberApi,
  type IMember,
} from "@/lib/memberApi";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { ExportDropdown } from "@/components/shared";

// Predefined designation mapping to Bangla
const DESIGNATION_PRESETS: Record<string, string> = {
  President: "সভাপতি",
  "Vice President": "সহ-সভাপতি",
  "General Secretary": "সাধারণ সম্পাদক",
  Secretary: "সচিব",
  "Assistant General Secretary": "সহকারী সাধারণ সম্পাদক",
  Treasurer: "কোষাধ্যক্ষ",
  "Organizing Secretary": "সাংগঠনিক সম্পাদক",
  "Executive Member": "নির্বাহী সদস্য",
  "Financial Member": "আর্থিক সদস্য",
  "General Member": "সাধারণ সদস্য",
};

// Zod Schema for frontend validation
const memberFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  mobileNo: z.string().min(10, "Mobile number must be at least 10 characters"),
  bloodGroup: z.string().optional(),
  profession: z.string().optional(),
  nidNo: z.string().optional(),
  birthRegistrationNo: z.string().optional(),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  dateOfBirth: z.string().optional(),
  division: z.string().optional(),
  district: z.string().optional(),
  thana: z.string().optional(),
  presentAddress: z.string().optional(),
  designation: z.string(),
  designationBn: z.string(),
  councilCategory: z.enum(["core_leadership", "financial_leadership", "general_member"]),
  role: z.enum(["superadmin", "admin", "manager", "member"]),
  password: z.string().optional(),
  nomineeName: z.string().optional(),
  nomineeRelation: z.string().optional(),
  nomineeDob: z.string().optional(),
  nomineeNid: z.string().optional(),
  nomineeAddress: z.string().optional(),
});

interface MemberFormViewProps {
  initialMember?: IMember;
  isCreateMode?: boolean;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:5000/api/v1";

export function MemberFormView({ initialMember, isCreateMode = false }: MemberFormViewProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingSignature, setUploadingSignature] = useState(false);
  const [uploadingNominee, setUploadingNominee] = useState(false);

  const profileInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const nomineeInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    file: File,
    targetField: "pictureUrl" | "signatureUrl" | "nomineePictureUrl"
  ) => {
    if (!file) return;
    if (targetField === "pictureUrl") setUploadingProfile(true);
    if (targetField === "signatureUrl") setUploadingSignature(true);
    if (targetField === "nomineePictureUrl") setUploadingNominee(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("images", file);

      let token = null;
      try {
        token =
          sessionStorage.getItem("fg_access_token") ||
          localStorage.getItem("fg_access_token");
      } catch (e) {}

      const res = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formDataUpload,
      });

      const json = await res.json();
      if (res.ok && json.success) {
        const uploadedUrl = json.data?.url || (json.data?.urls && json.data.urls[0]);
        if (uploadedUrl) {
          setFormData((prev) => ({ ...prev, [targetField]: uploadedUrl }));
          toast.success("Image uploaded successfully!");
        }
      } else {
        toast.error(json.message || "Failed to upload image");
      }
    } catch (err: any) {
      toast.error(err.message || "Error uploading file");
    } finally {
      if (targetField === "pictureUrl") setUploadingProfile(false);
      if (targetField === "signatureUrl") setUploadingSignature(false);
      if (targetField === "nomineePictureUrl") setUploadingNominee(false);
    }
  };

  const [formData, setFormData] = useState<Partial<IMember>>({
    fullName: initialMember?.fullName || "",
    email: initialMember?.email || "",
    bloodGroup: initialMember?.bloodGroup || "B+",
    profession: initialMember?.profession || "Business",
    nidNo: initialMember?.nidNo || "",
    birthRegistrationNo: initialMember?.birthRegistrationNo || "",
    fatherName: initialMember?.fatherName || "",
    motherName: initialMember?.motherName || "",
    mobileNo: initialMember?.mobileNo || "",
    dateOfBirth: initialMember?.dateOfBirth || "11/15/1992",
    division: initialMember?.division || "Barisal",
    district: initialMember?.district || "Patuakhali",
    thana: initialMember?.thana || "Bauphal",
    presentAddress:
      initialMember?.presentAddress ||
      "Village: Gosinga, P.O: Gosinga-8620, P.S: Bauphal, Dist: Patuakhali.",
    designation: initialMember?.designation || "General Member",
    designationBn: initialMember?.designationBn || "সাধারণ সদস্য",
    councilCategory: initialMember?.councilCategory || "general_member",
    role: initialMember?.role || "member",
    password: "",
    nomineeName: initialMember?.nomineeName || "",
    nomineeRelation: initialMember?.nomineeRelation || "Spouse",
    nomineeDob: initialMember?.nomineeDob || "mm/dd/yyyy",
    nomineeNid: initialMember?.nomineeNid || "",
    nomineeAddress: initialMember?.nomineeAddress || "",
    pictureUrl: initialMember?.pictureUrl || "/images/hero/hero-2.png",
    signatureUrl: initialMember?.signatureUrl || "",
    totalDeposit: isCreateMode ? 0 : (initialMember?.totalDeposit ?? 0),
    savingsBalance: isCreateMode ? 0 : (initialMember?.savingsBalance ?? 0),
    dueAmount: isCreateMode ? 0 : (initialMember?.dueAmount ?? 0),
    memberCode: isCreateMode ? undefined : (initialMember?.memberCode || undefined),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [customDesignation, setCustomDesignation] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [successToast, setSuccessToast] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Sync designation with Bangla mapping
  const handleDesignationChange = (val: string) => {
    if (val === "custom") {
      setCustomDesignation(true);
      setFormData((prev) => ({ ...prev, designation: "" }));
    } else {
      setCustomDesignation(false);
      const bn = DESIGNATION_PRESETS[val] || val;
      setFormData((prev) => ({
        ...prev,
        designation: val,
        designationBn: bn,
      }));
    }
  };

  // Save Mutation
  const saveMutation = useMutation({
    mutationFn: async (data: Partial<IMember>) => {
      if (isCreateMode) {
        return await createMemberApi(data);
      } else if (initialMember?._id) {
        return await updateMemberApi(initialMember._id, data);
      }
      throw new Error("Missing ID");
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["member", result._id] });
      setSuccessToast(
        isCreateMode
          ? "Member registered successfully!"
          : "Member profile updated successfully!"
      );
      setTimeout(() => {
        setSuccessToast("");
        if (isCreateMode) {
          router.push("/dashboard/member");
        }
      }, 1500);
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (initialMember?._id) {
        return await deleteMemberApi(initialMember._id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setIsDeleteModalOpen(false);
      router.push("/dashboard/member");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const result = memberFormSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0].toString()] = issue.message;
        }
      });
      setFormErrors(errors);
      return;
    }

    const dataToSubmit: Partial<IMember> = {
      ...formData,
      ...(isCreateMode
        ? {
            totalDeposit: 0,
            savingsBalance: 0,
            dueAmount: 0,
            memberCode: undefined,
          }
        : {}),
    };

    saveMutation.mutate(dataToSubmit);
  };

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen">
      {/* ── Top Bar: Back Link & Title (Screenshot 1) ────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/dashboard/member"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 hover:text-gray-900 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
          <h1 className="text-[22px] sm:text-[26px] font-bold text-[#0F172A] tracking-tight">
            {isCreateMode
              ? "Add New Member"
              : `Member Profile: ${formData.fullName || "Member"}`}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {!isCreateMode && (
            <ExportDropdown 
              endpointUrl={`/api/v1/members/${initialMember?._id || formData.memberCode}/export`} 
              defaultFilename={`Member_${formData.memberCode}_Statement`} 
            />
          )}
        </div>
      </div>

      {/* Success Notification Alert */}
      {successToast && (
        <div className="bg-[#EAF8F1] border border-[#00B074]/30 text-[#00B074] px-4 py-3 rounded-xl text-[13px] font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* ── 2-Column Layout (Screenshot 1) ───────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── Left Column (4 cols): Profile Avatar, Signature, Danger Zone ───── */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Card 1: Avatar Profile Overview */}
          <div className="bg-white rounded-2xl p-6 border border-[#EDF2F7] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col items-center text-center">
            {/* Portrait Image with Camera Badge */}
            <div
              onClick={() => profileInputRef.current?.click()}
              className="relative w-28 h-28 rounded-full bg-gray-100 border-4 border-white shadow-md overflow-hidden mb-3 cursor-pointer group"
            >
              <Image
                src={formData.pictureUrl || "/images/hero/hero-2.png"}
                alt={formData.fullName || "Profile"}
                fill
                className="object-cover object-top"
              />
              <input
                ref={profileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "pictureUrl")}
              />
              <button
                type="button"
                className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow flex items-center justify-center transition-all cursor-pointer"
                title="Change Photo"
              >
                {uploadingProfile ? (
                  <Loader2 className="w-3.5 h-3.5 text-[#00B074] animate-spin" />
                ) : (
                  <Camera className="w-3.5 h-3.5 text-[#00B074]" />
                )}
              </button>
            </div>

            <h2 className="text-[17px] font-bold text-[#0F172A] leading-tight">
              {formData.fullName || "Member Name"}
            </h2>
            <p className="text-[12px] text-gray-400 mt-1">
              Member Code: {formData.memberCode || "001"}
            </p>

            <div className="w-full h-px bg-gray-100 my-4" />

            {/* Joined & Savings Row */}
            <div className="flex items-center justify-between w-full text-[12px] text-gray-500">
              <div className="text-left">
                <span className="block text-gray-400 text-[11px]">Joined</span>
                <span className="font-semibold text-gray-700">01-Jan-2024</span>
              </div>
              <div className="text-right">
                <span className="block text-gray-400 text-[11px]">Savings</span>
                <span className="font-bold text-[#00B074] text-[13px]">
                  {Number(formData.savingsBalance || 1000).toFixed(2)} ৳
                </span>
              </div>
            </div>

            {/* Member Signature Upload Box */}
            <div className="w-full mt-5 text-left">
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Member Signature
              </label>
              <input
                ref={signatureInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "signatureUrl")}
              />
              {formData.signatureUrl ? (
                <div className="relative w-full h-24 border border-gray-200 rounded-xl bg-white p-2 flex items-center justify-center group overflow-hidden shadow-xs">
                  <Image
                    src={formData.signatureUrl}
                    alt="Signature"
                    fill
                    className="object-contain p-2"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData((prev) => ({ ...prev, signatureUrl: "" }));
                    }}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition-colors z-10"
                    title="Remove signature"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => signatureInputRef.current?.click()}
                  className="w-full h-24 border-2 border-dashed border-gray-200 rounded-xl bg-[#FAFAFA] flex flex-col items-center justify-center text-gray-400 hover:border-[#00B074] hover:bg-emerald-50/20 transition-all cursor-pointer p-2"
                >
                  {uploadingSignature ? (
                    <Loader2 className="w-6 h-6 text-[#00B074] animate-spin mb-1" />
                  ) : (
                    <PenTool className="w-5 h-5 text-gray-400 mb-1" />
                  )}
                  <span className="text-[11.5px] font-medium text-gray-500">
                    {uploadingSignature ? "Uploading signature..." : "Click to upload signature"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Danger Zone (Screenshot 1 & 4) */}
          {!isCreateMode && (
            <div className="bg-[#FEF2F2] rounded-2xl p-5 border border-[#FEE2E2] shadow-xs flex flex-col gap-3">
              <div>
                <h3 className="text-[14px] font-bold text-[#DC2626]">Danger Zone</h3>
                <p className="text-[12px] text-gray-600 mt-1 leading-snug">
                  Deleting this member will remove all their data from the system.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="w-full h-10 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold text-[13px] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Member</span>
              </button>
            </div>
          )}
        </div>

        {/* ── Right Column (8 cols): Personal Info, Council, Security, Nominee ─ */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Section 1: Personal Information (Screenshot 1) */}
          <div className="bg-white rounded-2xl p-6 border border-[#EDF2F7] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-[15px] font-bold text-[#0F172A]">
                Personal Information
              </h3>
              <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#00B074]">
                <Edit2 className="w-3.5 h-3.5" />
                <span>Quick Edit</span>
              </span>
            </div>

            {/* Row 1: Name, Blood Group, Profession */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Full Name (English) *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="MD JUWEL HASAN"
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-800 focus:outline-none focus:border-[#00B074] focus:ring-1 focus:ring-[#00B074]"
                />
                {formErrors.fullName && (
                  <p className="text-[11px] text-red-500 mt-1">{formErrors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Blood Group
                </label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-800 focus:outline-none focus:border-[#00B074]"
                >
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Profession
                </label>
                <select
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-800 focus:outline-none focus:border-[#00B074]"
                >
                  {["Business", "Service", "Teacher", "Engineer", "Doctor", "Student", "Other"].map(
                    (p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            {/* Row 2: NID No, Birth Reg */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  NID No
                </label>
                <input
                  type="text"
                  value={formData.nidNo}
                  onChange={(e) => setFormData({ ...formData, nidNo: e.target.value })}
                  placeholder="Enter NID Number"
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-800 focus:outline-none focus:border-[#00B074]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Birth Registration Number
                </label>
                <input
                  type="text"
                  value={formData.birthRegistrationNo}
                  onChange={(e) =>
                    setFormData({ ...formData, birthRegistrationNo: e.target.value })
                  }
                  placeholder="Enter Birth Registration No"
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-800 focus:outline-none focus:border-[#00B074]"
                />
              </div>
            </div>

            {/* Row 3: Father's Name, Mother's Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Father&apos;s Name
                </label>
                <input
                  type="text"
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  placeholder="MD KADOM ALI"
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-800 focus:outline-none focus:border-[#00B074]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Mother&apos;s Name
                </label>
                <input
                  type="text"
                  value={formData.motherName}
                  onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                  placeholder="MD KADOM ALI"
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-800 focus:outline-none focus:border-[#00B074]"
                />
              </div>
            </div>

            {/* Row 4: Mobile No, Date of Birth */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Mobile No *
                </label>
                <input
                  type="text"
                  value={formData.mobileNo}
                  onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                  placeholder="01774987030"
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-800 focus:outline-none focus:border-[#00B074]"
                />
                {formErrors.mobileNo && (
                  <p className="text-[11px] text-red-500 mt-1">{formErrors.mobileNo}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Date of Birth
                </label>
                <input
                  type="text"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  placeholder="11/15/1992"
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-800 focus:outline-none focus:border-[#00B074]"
                />
              </div>
            </div>

            {/* Row 5: Division, District, Thana/Upazila */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Division
                </label>
                <input
                  type="text"
                  value={formData.division}
                  onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                  placeholder="Barisal"
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-800 focus:outline-none focus:border-[#00B074]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  District
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="Patuakhali"
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-800 focus:outline-none focus:border-[#00B074]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Thana / Upazila
                </label>
                <input
                  type="text"
                  value={formData.thana}
                  onChange={(e) => setFormData({ ...formData, thana: e.target.value })}
                  placeholder="Bauphal"
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-800 focus:outline-none focus:border-[#00B074]"
                />
              </div>
            </div>

            {/* Present Address */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Present Address
              </label>
              <input
                type="text"
                value={formData.presentAddress}
                onChange={(e) => setFormData({ ...formData, presentAddress: e.target.value })}
                placeholder="Village: Gosinga, P.O: Gosinga-8620, P.S: Bauphal, Dist: Patuakhali."
                className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-800 focus:outline-none focus:border-[#00B074]"
              />
            </div>
          </div>

          {/* Section 2: Council & Designation Control (Requirement 2 & 5) */}
          <div className="bg-white rounded-2xl p-6 border border-[#EDF2F7] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col gap-4">
            <h3 className="text-[15px] font-bold text-[#0F172A] pb-3 border-b border-gray-100">
              Council &amp; Designation Control
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Council Category */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Council Category *
                </label>
                <select
                  value={formData.councilCategory}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      councilCategory: e.target.value as IMember["councilCategory"],
                    })
                  }
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-800 focus:outline-none focus:border-[#00B074]"
                >
                  <option value="core_leadership">Executive Leadership (মূল নেতৃত্ব)</option>
                  <option value="financial_leadership">Financial Leadership (আর্থিক নেতৃত্ব)</option>
                  <option value="general_member">General Member (সাধারণ সদস্য)</option>
                </select>
              </div>

              {/* Designation Preset with Auto-mapped Bangla */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Designation (Auto-Mapped to Bangla) *
                </label>
                <select
                  value={customDesignation ? "custom" : formData.designation}
                  onChange={(e) => handleDesignationChange(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-800 focus:outline-none focus:border-[#00B074]"
                >
                  {Object.entries(DESIGNATION_PRESETS).map(([en, bn]) => (
                    <option key={en} value={en}>
                      {en} ({bn})
                    </option>
                  ))}
                  <option value="custom">+ Custom Designation</option>
                </select>
              </div>
            </div>

            {/* Custom Designation Inputs if selected */}
            {customDesignation && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3 rounded-xl bg-gray-50 border border-gray-200">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Custom Designation (English)
                  </label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) =>
                      setFormData({ ...formData, designation: e.target.value })
                    }
                    placeholder="e.g. Senior Advisor"
                    className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-[13px]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    পদবি (বাংলা)
                  </label>
                  <input
                    type="text"
                    value={formData.designationBn}
                    onChange={(e) =>
                      setFormData({ ...formData, designationBn: e.target.value })
                    }
                    placeholder="যেমন: জ্যেষ্ঠ উপদেষ্টা"
                    className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-[13px]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Account Security & Access (Screenshot 1) */}
          <div className="bg-white rounded-2xl p-6 border border-[#EDF2F7] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col gap-4">
            <h3 className="text-[15px] font-bold text-[#0F172A] pb-3 border-b border-gray-100">
              Account Security &amp; Access
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Role */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as IMember["role"],
                    })
                  }
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-800 focus:outline-none focus:border-[#00B074]"
                >
                  <option value="member">Member</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password || ""}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full h-10 pl-3 pr-10 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-800 focus:outline-none focus:border-[#00B074]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Email Address (Unique Login ID) *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="member@friendsgoal.org"
                className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-800 focus:outline-none focus:border-[#00B074]"
              />
              {formErrors.email && (
                <p className="text-[11px] text-red-500 mt-1">{formErrors.email}</p>
              )}
            </div>
          </div>

          {/* Section 4: Nominee Information (Screenshot 1 & 3) */}
          <div className="bg-white rounded-2xl p-6 border border-[#EDF2F7] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col gap-4">
            <h3 className="text-[15px] font-bold text-[#0F172A] pb-3 border-b border-gray-100">
              Nominee Information
            </h3>

            {/* Nominee Picture Frame */}
            <div className="flex items-center gap-4 py-2">
              <input
                ref={nomineeInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "nomineePictureUrl")}
              />
              <div
                onClick={() => nomineeInputRef.current?.click()}
                className="w-14 h-14 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0 relative overflow-hidden cursor-pointer hover:border-[#00B074] group"
              >
                {formData.nomineePictureUrl ? (
                  <Image src={formData.nomineePictureUrl} alt="Nominee" fill className="object-cover" />
                ) : uploadingNominee ? (
                  <Loader2 className="w-5 h-5 text-[#00B074] animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
              </div>
              <div>
                <span className="text-[12.5px] font-semibold text-gray-700 block">
                  Nominee Picture
                </span>
                <button
                  type="button"
                  onClick={() => nomineeInputRef.current?.click()}
                  className="text-[11px] text-[#00B074] font-medium hover:underline cursor-pointer block text-left"
                >
                  {uploadingNominee
                    ? "Uploading..."
                    : formData.nomineePictureUrl
                    ? "Change Nominee Photo"
                    : "Upload a clear photo of the nominee. Max size 2MB."}
                </button>
              </div>
            </div>

            {/* Nominee Name & Relation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Nominee Name
                </label>
                <input
                  type="text"
                  value={formData.nomineeName}
                  onChange={(e) => setFormData({ ...formData, nomineeName: e.target.value })}
                  placeholder="Enter Nominee Name"
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-800 focus:outline-none focus:border-[#00B074]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Relation
                </label>
                <select
                  value={formData.nomineeRelation}
                  onChange={(e) => setFormData({ ...formData, nomineeRelation: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-800 focus:outline-none focus:border-[#00B074]"
                >
                  {["Spouse", "Father", "Mother", "Brother", "Sister", "Son", "Daughter", "Other"].map(
                    (rel) => (
                      <option key={rel} value={rel}>
                        {rel}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            {/* Date of Birth & NID No */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Date of Birth
                </label>
                <input
                  type="text"
                  value={formData.nomineeDob}
                  onChange={(e) => setFormData({ ...formData, nomineeDob: e.target.value })}
                  placeholder="mm/dd/yyyy"
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-800 focus:outline-none focus:border-[#00B074]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  NID No
                </label>
                <input
                  type="text"
                  value={formData.nomineeNid}
                  onChange={(e) => setFormData({ ...formData, nomineeNid: e.target.value })}
                  placeholder="Enter Nominee NID"
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-800 focus:outline-none focus:border-[#00B074]"
                />
              </div>
            </div>

            {/* Nominee Address */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Address
              </label>
              <input
                type="text"
                value={formData.nomineeAddress}
                onChange={(e) => setFormData({ ...formData, nomineeAddress: e.target.value })}
                placeholder="Enter Nominee Address"
                className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-800 focus:outline-none focus:border-[#00B074]"
              />
            </div>
          </div>

          {/* ── Form Actions: Cancel & Save Changes (Screenshot 3) ──────────── */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/dashboard/member"
              className="h-10 px-5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-[13px] font-semibold text-gray-700 transition-colors flex items-center justify-center cursor-pointer shadow-xs"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="h-10 px-6 rounded-xl bg-[#00B074] hover:bg-[#009663] text-white text-[13px] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {saveMutation.isPending ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isCreateMode ? "Create Member" : "Save Changes"}</span>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {!isCreateMode && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={async () => {
            await deleteMutation.mutateAsync();
          }}
          memberName={formData.fullName || ""}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
