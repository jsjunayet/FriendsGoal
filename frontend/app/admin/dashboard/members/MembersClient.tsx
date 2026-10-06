"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, X, Search, AlertCircle,
  CheckCircle2, Users, UserPlus, Shield, RefreshCw,
  ChevronUp, ChevronDown,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  getMembersApi, createMemberApi, createAdminApi,
  updateMemberApi, deleteMemberApi,
  type Member, type CreateMemberPayload,
  type CreateAdminPayload, type UpdateMemberPayload,
} from "@/lib/api";

// ─── tiny helpers ─────────────────────────────────────────────────────────────
type SortKey = "name" | "id" | "role" | "status" | "createdAt";
type SortDir = "asc" | "desc";

function statusBadge(status: string) {
  return status === "active"
    ? "bg-[#F0FFF5] text-[#2B5A27] border-[#B5E6CC]"
    : "bg-[#FFF5F5] text-[#7F1D1D] border-[#FECACA]";
}

function roleBadge(role: string) {
  if (role === "superAdmin") return "bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]";
  if (role === "admin") return "bg-[#FFF7ED] text-[#92400E] border-[#FDE68A]";
  return "bg-[#F5F5F5] text-[#555555] border-[#E5E5E5]";
}

function roleLabel(role: string) {
  if (role === "superAdmin") return "Super Admin";
  if (role === "admin") return "Admin";
  return "Member";
}

function initials(name?: string, id?: string) {
  if (name) return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return (id ?? "??").slice(0, 2).toUpperCase();
}

// ─── Toast ────────────────────────────────────────────────────────────────────
type ToastVariant = "success" | "error";
interface Toast { id: number; message: string; variant: ToastVariant }

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);
  const ok = toast.variant === "success";
  return (
    <motion.div
      layout initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
      className={`flex items-start gap-3 w-full max-w-[380px] rounded-[14px] px-4 py-3 shadow-lg border text-[13px] font-medium
        ${ok ? "bg-[#F0FAF4] border-[#B5E6CC] text-[#14532D]" : "bg-[#FFF5F5] border-[#FECACA] text-[#7F1D1D]"}`}
      role="alert" aria-live="polite"
    >
      {ok ? <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0 mt-0.5" />
        : <AlertCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0 mt-0.5" />}
      <span className="flex-1 leading-snug">{toast.message}</span>
      <button type="button" onClick={() => onDismiss(toast.id)}
        className="opacity-40 hover:opacity-70 transition-opacity flex-shrink-0" aria-label="Dismiss">
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────
function DeleteConfirmModal({
  member, onConfirm, onCancel, loading,
}: { member: Member; onConfirm: () => void; onCancel: () => void; loading: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.2 }}
        className="relative z-10 bg-white rounded-[24px] p-7 w-full max-w-[400px] shadow-2xl">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#FFF5F5] flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-[#EF4444]" />
          </div>
          <div>
            <h2 className="font-bold text-[20px] text-[#1A1A1A] mb-1">Delete Member?</h2>
            <p className="text-[13px] text-[#666] leading-relaxed">
              This will permanently remove <strong>{member.name ?? member.id}</strong> from the system.
              This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3 w-full mt-2">
            <button type="button" onClick={onCancel} disabled={loading}
              className="flex-1 h-[46px] rounded-full border border-[#E5E5E5] text-[#555] text-[14px] font-semibold hover:bg-[#F5F5F5] transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button type="button" onClick={onConfirm} disabled={loading}
              className="flex-1 h-[46px] rounded-full bg-[#EF4444] hover:bg-[#DC2626] text-white text-[14px] font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              {loading ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold tracking-[0.14em] text-[#1A1A1A] uppercase">
        {label}{required && <span className="text-[#EF4444] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full h-[46px] px-4 rounded-[12px] border border-[#E5E5E5] bg-[#FAFAFA] text-[14px] text-[#1A1A1A] placeholder:text-[#AAAAAA] focus:outline-none focus:border-[#1FDE64] focus:bg-white transition-all";
const selectCls = inputCls + " appearance-none cursor-pointer";

// ─── Add/Edit Member Modal ─────────────────────────────────────────────────────
interface MemberFormProps {
  initial?: Member | null;
  isSuperAdmin: boolean;
  onSave: (data: CreateMemberPayload | UpdateMemberPayload, isNew: boolean) => Promise<void>;
  onClose: () => void;
  loading: boolean;
  formError: string;
}

function MemberFormModal({ initial, isSuperAdmin, onSave, onClose, loading, formError }: MemberFormProps) {
  const isEdit = !!initial;
  const [form, setForm] = useState({
    id: initial?.id ?? "",
    email: initial?.email ?? "",
    password: "",
    memberId: initial?.memberId ?? "",
    name: initial?.name ?? "",
    location: initial?.location ?? "",
    dob: initial?.dob ?? "",
    bloodGroup: initial?.bloodGroup ?? "",
    councilCategory: (initial as any)?.councilCategory || (initial as any)?.councilType || "none",
    status: initial?.status ?? "active",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      const payload: UpdateMemberPayload = {
        name: form.name || undefined,
        location: form.location || undefined,
        dob: form.dob || undefined,
        bloodGroup: form.bloodGroup || undefined,
        councilCategory: form.councilCategory !== "none" ? form.councilCategory : undefined,
        councilType: form.councilCategory !== "none" ? form.councilCategory : undefined,
        status: form.status as "active" | "blocked",
      };
      onSave(payload, false);
    } else {
      const payload: CreateMemberPayload = {
        id: form.id, email: form.email, password: form.password,
        memberId: form.memberId, name: form.name,
        location: form.location || undefined, dob: form.dob || undefined,
        bloodGroup: form.bloodGroup || undefined,
        councilCategory: form.councilCategory !== "none" ? form.councilCategory : undefined,
        councilType: form.councilCategory !== "none" ? form.councilCategory : undefined,
      };
      onSave(payload, true);
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 bg-white rounded-[24px] w-full max-w-[540px] shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-[24px] px-7 pt-7 pb-4 border-b border-[#F0F0F0] z-10 flex items-center justify-between">
          <h2 className="font-bold text-[20px] text-[#1A1A1A] flex items-center gap-2">
            {isEdit ? <><Pencil className="w-5 h-5 text-[#1FDE64]" /> Edit Member</> : <><UserPlus className="w-5 h-5 text-[#1FDE64]" /> Add Member</>}
          </h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-[#888] hover:bg-[#F5F5F5] transition-colors" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-7 py-6 flex flex-col gap-4">
          {formError && (
            <div className="flex items-center gap-2 bg-[#FFF5F5] border border-[#FECACA] rounded-[12px] px-4 py-3 text-[13px] text-[#7F1D1D]">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{formError}
            </div>
          )}
          {!isEdit && (
            <div className="grid grid-cols-2 gap-4">
              <Field label="User ID" required><input className={inputCls} placeholder="e.g. M-0042" value={form.id} onChange={set("id")} required /></Field>
              <Field label="Member ID" required><input className={inputCls} placeholder="e.g. FG-042" value={form.memberId} onChange={set("memberId")} required /></Field>
            </div>
          )}
          <Field label="Full Name" required><input className={inputCls} placeholder="MD. Jewel Hasan" value={form.name} onChange={set("name")} required /></Field>
          {!isEdit && (
            <>
              <Field label="Email" required><input className={inputCls} type="email" placeholder="member@example.com" value={form.email} onChange={set("email")} required /></Field>
              <Field label="Password" required><input className={inputCls} type="password" placeholder="Min. 6 characters" value={form.password} onChange={set("password")} required minLength={6} /></Field>
            </>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Location"><input className={inputCls} placeholder="Gazipur, Dhaka" value={form.location} onChange={set("location")} /></Field>
            <Field label="Date of Birth"><input className={inputCls} placeholder="12 Jul 1990" value={form.dob} onChange={set("dob")} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Blood Group"><input className={inputCls} placeholder="O- (Negative)" value={form.bloodGroup} onChange={set("bloodGroup")} /></Field>
            <Field label="Council Role">
              <select className={selectCls} value={form.councilCategory} onChange={set("councilCategory")}>
                <option value="none">None (General Member)</option>
                <option value="executive">Executive Council</option>
                <option value="financial">Financial Council</option>
                <option value="founding">Founding Member</option>
              </select>
            </Field>
          </div>
          {isEdit && (
            <Field label="Status">
              <select className={selectCls} value={form.status} onChange={set("status")}>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </Field>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={loading}
              className="flex-1 h-[48px] rounded-full border border-[#E5E5E5] text-[#555] text-[14px] font-semibold hover:bg-[#F5F5F5] transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 h-[48px] rounded-full bg-[#1FDE64] hover:bg-[#18C957] text-[#1A1A1A] text-[14px] font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Saving…" : isEdit ? "Save Changes" : "Add Member"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Add Admin Modal ──────────────────────────────────────────────────────────
function AddAdminModal({
  onSave, onClose, loading, formError,
}: { onSave: (data: CreateAdminPayload) => Promise<void>; onClose: () => void; loading: boolean; formError: string }) {
  const [form, setForm] = useState({ id: "", email: "", password: "" });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }} transition={{ duration: 0.25 }}
        className="relative z-10 bg-white rounded-[24px] w-full max-w-[440px] shadow-2xl">
        <div className="px-7 pt-7 pb-4 border-b border-[#F0F0F0] flex items-center justify-between">
          <h2 className="font-bold text-[20px] text-[#1A1A1A] flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#F59E0B]" /> Add Admin
          </h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-[#888] hover:bg-[#F5F5F5] transition-colors" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="px-7 py-6 flex flex-col gap-4">
          {formError && (
            <div className="flex items-center gap-2 bg-[#FFF5F5] border border-[#FECACA] rounded-[12px] px-4 py-3 text-[13px] text-[#7F1D1D]">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{formError}
            </div>
          )}
          <Field label="Admin ID" required><input className={inputCls} placeholder="e.g. AD-0002" value={form.id} onChange={set("id")} required /></Field>
          <Field label="Email" required><input className={inputCls} type="email" placeholder="admin@example.com" value={form.email} onChange={set("email")} required /></Field>
          <Field label="Password" required><input className={inputCls} type="password" placeholder="Min. 6 characters" value={form.password} onChange={set("password")} required minLength={6} /></Field>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={loading}
              className="flex-1 h-[48px] rounded-full border border-[#E5E5E5] text-[#555] text-[14px] font-semibold hover:bg-[#F5F5F5] transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 h-[48px] rounded-full bg-[#F59E0B] hover:bg-[#D97706] text-white text-[14px] font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Creating…" : "Create Admin"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Sort Header ──────────────────────────────────────────────────────────────
function SortTh({ col, label, sortKey, sortDir, onSort }: {
  col: SortKey; label: string; sortKey: SortKey; sortDir: SortDir; onSort: (c: SortKey) => void;
}) {
  const active = sortKey === col;
  return (
    <th className="pb-3 pr-4 text-left">
      <button type="button" onClick={() => onSort(col)}
        className="flex items-center gap-1 text-[11px] font-bold tracking-[0.14em] uppercase text-[#888] hover:text-[#1A1A1A] transition-colors group">
        {label}
        <span className="opacity-40 group-hover:opacity-80 transition-opacity">
          {active ? (sortDir === "asc" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />) : <ChevronDown className="w-3.5 h-3.5" />}
        </span>
      </button>
    </th>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────
export default function MembersClient() {
  const { user, accessToken } = useAuth();
  const isSuperAdmin = user?.role === "superAdmin";

  const [members, setMembers] = useState<Member[]>([]);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "member">("all");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const [modal, setModal] = useState<"add" | "edit" | "delete" | "addAdmin" | null>(null);
  const [selected, setSelected] = useState<Member | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  const pushToast = useCallback((message: string, variant: ToastVariant) => {
    const id = ++toastId.current;
    setToasts(p => [...p, { id, message, variant }]);
  }, []);
  const dismissToast = useCallback((id: number) => setToasts(p => p.filter(t => t.id !== id)), []);

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchMembers = useCallback(async () => {
    if (!accessToken) return;
    setFetching(true);
    setFetchError("");
    try {
      const data = await getMembersApi(accessToken);
      setMembers(data);
    } catch (err: unknown) {
      setFetchError(err instanceof Error ? err.message : "Failed to load members.");
    } finally {
      setFetching(false);
    }
  }, [accessToken]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  // ── Sort ─────────────────────────────────────────────────────────────────
  const handleSort = (col: SortKey) => {
    if (sortKey === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(col); setSortDir("asc"); }
  };

  // ── Filtered + sorted list ───────────────────────────────────────────────
  const visible = members
    .filter(m => {
      if (roleFilter !== "all" && m.role !== roleFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        m.id.toLowerCase().includes(q) ||
        (m.name ?? "").toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.memberId ?? "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      let av: string, bv: string;
      switch (sortKey) {
        case "name": av = a.name ?? ""; bv = b.name ?? ""; break;
        case "id": av = a.id; bv = b.id; break;
        case "role": av = a.role; bv = b.role; break;
        case "status": av = a.status; bv = b.status; break;
        case "createdAt": av = a.createdAt; bv = b.createdAt; break;
        default: av = ""; bv = "";
      }
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const stats = {
    total: members.length,
    members: members.filter(m => m.role === "member").length,
    admins: members.filter(m => m.role === "admin").length,
    blocked: members.filter(m => m.status === "blocked").length,
  };

  // ── Handlers ─────────────────────────────────────────────────────────────
  const openEdit = (m: Member) => { setSelected(m); setFormError(""); setModal("edit"); };
  const openDelete = (m: Member) => { setSelected(m); setModal("delete"); };
  const closeModal = () => { setModal(null); setSelected(null); setFormError(""); };

  const handleSaveMember = async (
    data: CreateMemberPayload | UpdateMemberPayload, isNew: boolean,
  ) => {
    if (!accessToken) return;
    setModalLoading(true); setFormError("");
    try {
      if (isNew) {
        const created = await createMemberApi(accessToken, data as CreateMemberPayload);
        setMembers(p => [created, ...p]);
        pushToast(`Member "${created.name ?? created.id}" added successfully.`, "success");
      } else {
        const updated = await updateMemberApi(accessToken, selected!.id, data as UpdateMemberPayload);
        setMembers(p => p.map(m => m.id === updated.id ? updated : m));
        pushToast(`Member "${updated.name ?? updated.id}" updated.`, "success");
      }
      closeModal();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleSaveAdmin = async (data: CreateAdminPayload) => {
    if (!accessToken) return;
    setModalLoading(true); setFormError("");
    try {
      const created = await createAdminApi(accessToken, data);
      setMembers(p => [created, ...p]);
      pushToast(`Admin "${created.id}" created successfully.`, "success");
      closeModal();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!accessToken || !selected) return;
    setModalLoading(true);
    try {
      await deleteMemberApi(accessToken, selected.id);
      setMembers(p => p.filter(m => m.id !== selected.id));
      pushToast(`"${selected.name ?? selected.id}" has been removed.`, "success");
      closeModal();
    } catch (err: unknown) {
      pushToast(err instanceof Error ? err.message : "Delete failed.", "error");
      closeModal();
    } finally {
      setModalLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Toast stack */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 items-center w-full px-4 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map(t => (
            <div key={t.id} className="pointer-events-auto w-full flex justify-center">
              <ToastItem toast={t} onDismiss={dismissToast} />
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {(modal === "add" || modal === "edit") && (
          <MemberFormModal
            initial={modal === "edit" ? selected : null}
            isSuperAdmin={isSuperAdmin}
            onSave={handleSaveMember}
            onClose={closeModal}
            loading={modalLoading}
            formError={formError}
          />
        )}
        {modal === "addAdmin" && (
          <AddAdminModal onSave={handleSaveAdmin} onClose={closeModal} loading={modalLoading} formError={formError} />
        )}
        {modal === "delete" && selected && (
          <DeleteConfirmModal member={selected} onConfirm={handleDelete} onCancel={closeModal} loading={modalLoading} />
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif font-bold text-[28px] text-[#1A1A1A] leading-tight">Member Management</h1>
            <p className="text-[13px] text-[#888] mt-1">Add, update, and manage all club members.</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {isSuperAdmin && (
              <button type="button" onClick={() => { setFormError(""); setModal("addAdmin"); }}
                className="h-[40px] px-4 rounded-full border border-[#FDE68A] bg-[#FFFBEB] text-[#92400E] text-[13px] font-bold flex items-center gap-2 hover:bg-[#FEF3C7] transition-colors">
                <Shield className="w-4 h-4" /> Add Admin
              </button>
            )}
            <button type="button" onClick={() => { setFormError(""); setModal("add"); }}
              className="h-[40px] px-4 rounded-full bg-[#1FDE64] hover:bg-[#18C957] text-[#1A1A1A] text-[13px] font-bold flex items-center gap-2 transition-colors">
              <Plus className="w-4 h-4" /> Add Member
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Users", value: stats.total, icon: <Users className="w-5 h-5" />, bg: "bg-[#1A1A1A] text-white" },
            { label: "Members", value: stats.members, icon: <Users className="w-5 h-5" />, bg: "bg-[#F0FFF5] text-[#2B5A27] border border-[#D4F5D2]" },
            { label: "Admins", value: stats.admins, icon: <Shield className="w-5 h-5" />, bg: "bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]" },
            { label: "Blocked", value: stats.blocked, icon: <AlertCircle className="w-5 h-5" />, bg: "bg-[#FFF5F5] text-[#7F1D1D] border border-[#FECACA]" },
          ].map(s => (
            <div key={s.label} className={`rounded-[18px] p-4 flex items-center gap-3 ${s.bg}`}>
              <div className="opacity-60 flex-shrink-0">{s.icon}</div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide opacity-60">{s.label}</p>
                <p className="text-[26px] font-bold leading-tight">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-[380px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AAAAAA] pointer-events-none" />
            <input type="text" placeholder="Search by name, ID, email…" value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-[42px] pl-10 pr-4 rounded-full border border-[#E5E5E5] bg-white text-[13px] text-[#1A1A1A] placeholder:text-[#AAAAAA] focus:outline-none focus:border-[#1FDE64] transition-all" />
          </div>
          <div className="flex gap-2">
            {(["all", "member", "admin"] as const).map(r => (
              <button key={r} type="button" onClick={() => setRoleFilter(r)}
                className={`h-[42px] px-4 rounded-full text-[13px] font-semibold border transition-colors ${roleFilter === r ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "bg-white text-[#555] border-[#E5E5E5] hover:border-[#AAAAAA]"}`}>
                {r === "all" ? "All" : r === "member" ? "Members" : "Admins"}
              </button>
            ))}
          </div>
          <button type="button" onClick={fetchMembers} disabled={fetching}
            className="h-[42px] px-4 rounded-full border border-[#E5E5E5] bg-white text-[#555] text-[13px] font-semibold flex items-center gap-2 hover:border-[#AAAAAA] transition-colors disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${fetching ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[20px] border border-[#E5E5E5] shadow-xs overflow-hidden">
          {fetching ? (
            <div className="flex items-center justify-center py-20 text-[#AAAAAA] gap-3">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span className="text-[14px]">Loading members…</span>
            </div>
          ) : fetchError ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#EF4444]">
              <AlertCircle className="w-8 h-8" />
              <p className="text-[14px] font-semibold">{fetchError}</p>
              <button type="button" onClick={fetchMembers} className="text-[13px] underline text-[#555]">Try again</button>
            </div>
          ) : visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#AAAAAA]">
              <Users className="w-10 h-10" />
              <p className="text-[15px] font-semibold text-[#1A1A1A]">No members found</p>
              <p className="text-[13px]">{search ? "Try a different search term." : "Add your first member to get started."}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-[#F0F0F0] bg-[#FAFAFA]">
                    <th className="pb-3 pl-5 pr-4 pt-4"><span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#888]">Member</span></th>
                    <SortTh col="id" label="ID" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <SortTh col="role" label="Role" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <SortTh col="status" label="Status" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <th className="pb-3 pr-4 pt-4"><span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#888]">Blood</span></th>
                    <th className="pb-3 pr-4 pt-4"><span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#888]">Location</span></th>
                    <th className="pb-3 pr-5 pt-4 text-right"><span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#888]">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map(m => (
                    <tr key={m._id} className="border-b border-[#F9F9F9] last:border-0 hover:bg-[#FAFAFA] transition-colors">
                      <td className="py-3.5 pl-5 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#F0FFF5] border border-[#D4F5D2] flex items-center justify-center flex-shrink-0 text-[12px] font-bold text-[#2B5A27]">
                            {initials(m.name, m.id)}
                          </div>
                          <div>
                            <p className="font-semibold text-[#1A1A1A] leading-tight">{m.name ?? "—"}</p>
                            <p className="text-[11px] text-[#AAAAAA]">{m.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 text-[#555] font-mono text-[12px]">{m.memberId ?? m.id}</td>
                      <td className="py-3.5 pr-4">
                        <span className={`inline-flex items-center h-[22px] px-2.5 rounded-full text-[11px] font-bold border ${roleBadge(m.role)}`}>
                          {roleLabel(m.role)}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className={`inline-flex items-center h-[22px] px-2.5 rounded-full text-[11px] font-bold border capitalize ${statusBadge(m.status)}`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 text-[#555]">{m.bloodGroup ?? "—"}</td>
                      <td className="py-3.5 pr-4 text-[#555] max-w-[160px] truncate">{m.location ?? "—"}</td>
                      <td className="py-3.5 pr-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button type="button" onClick={() => openEdit(m)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[#555] hover:bg-[#F0FFF5] hover:text-[#2B5A27] transition-colors" aria-label="Edit">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" onClick={() => openDelete(m)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[#555] hover:bg-[#FFF5F5] hover:text-[#EF4444] transition-colors" aria-label="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-5 py-3 border-t border-[#F0F0F0] bg-[#FAFAFA] text-[12px] text-[#AAAAAA]">
                Showing <strong className="text-[#555]">{visible.length}</strong> of <strong className="text-[#555]">{members.length}</strong> users
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
