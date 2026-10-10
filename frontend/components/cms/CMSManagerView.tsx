"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  FileText,
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  Bell,
  Check,
  X,
  Sparkles,
  BarChart3,
  Save,
  Search,
  Megaphone,
  Radio,
  Eye,
  Volume2,
  Loader2,
} from "lucide-react";
import { getNoticesApi, createNoticeApi, updateNoticeApi, deleteNoticeApi, type NoticeItem } from "@/lib/noticeApi";
import {
  getMarqueeItemsApi,
  createMarqueeItemApi,
  updateMarqueeItemApi,
  deleteMarqueeItemApi,
  type MarqueeItem,
} from "@/lib/marqueeApi";
import { getGalleryItemsApi, createGalleryItemApi, updateGalleryItemApi, deleteGalleryItemApi, type GalleryItem } from "@/lib/galleryApi";
import { getStatsApi, updateStatApi, bulkUpdateStatsApi, type StatCounterItem } from "@/lib/statsApi";
import { getLocalizedText } from "@/lib/i18nHelpers";
import { FileUploadWidget } from "@/components/ui/FileUploadWidget";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { DataTableSkeleton, DashboardStatsSkeleton } from "@/components/ui/Skeletons";
import { NoticeDetailClient } from "@/components/notice/NoticeDetailClient";
import { Edit3, Users, Briefcase, Clock, RotateCcw, CheckCircle2, Layers } from "lucide-react";

interface CMSManagerViewProps {
  initialTab?: "marquee" | "notices" | "stats" | "gallery";
}

export default function CMSManagerView({ initialTab = "marquee" }: CMSManagerViewProps) {
  const [activeTab, setActiveTab] = useState<"marquee" | "notices" | "stats" | "gallery">(initialTab);

  // State data
  const [stats, setStats] = useState<StatCounterItem[]>([]);
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [marqueeItems, setMarqueeItems] = useState<MarqueeItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Notice Filtering & Ticker Toggle state
  const [noticeSearchQuery, setNoticeSearchQuery] = useState("");
  const [noticeFilterTab, setNoticeFilterTab] = useState<"all" | "ticker">("all");

  // Unified Home Statistics Form State (Active Members, Projects, Years Serving)
  const [unifiedStatsForm, setUnifiedStatsForm] = useState({
    activeMembers: "111+",
    projects: "70+",
    yearsServing: "3+",
    activeMembersLabelEn: "ACTIVE MEMBERS",
    activeMembersLabelBn: "সক্রিয় সদস্য",
    projectsLabelEn: "PROJECTS",
    projectsLabelBn: "চলমান ও সফল প্রকল্প",
    yearsServingLabelEn: "YEARS SERVING",
    yearsServingLabelBn: "সেবার বছর",
  });

  // Individual Stats inline edit form state
  const [editingStatId, setEditingStatId] = useState<string | null>(null);
  const [statForm, setStatForm] = useState({
    value: "",
    labelBn: "",
    labelEn: "",
  });

  // Modal State for Notice, Marquee & Gallery
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"notice" | "marquee" | "gallery">("marquee");
  const [noticeModalView, setNoticeModalView] = useState<"editor" | "preview">("editor");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Marquee Form State
  const [marqueeForm, setMarqueeForm] = useState({
    textBn: "",
    textEn: "",
    link: "",
    isActive: true,
  });

  // Notice Form State
  const [noticeForm, setNoticeForm] = useState({
    categoryBn: "আনুষ্ঠানিক নোটিশ",
    categoryEn: "OFFICIAL NOTICE",
    titleBn: "",
    titleEn: "",
    descBn: "",
    descEn: "",
    contentBn: "",
    contentEn: "",
    publishedDate: "",
    author: "ADMIN",
    images: [] as string[],
    isTickerActive: false,
    agendaHighlights: [] as Array<{
      num: number;
      titleBn: string;
      titleEn: string;
      textBn: string;
      textEn: string;
    }>,
  });

  // Gallery Form State
  const [galleryForm, setGalleryForm] = useState({
    titleBn: "",
    titleEn: "",
    subtitleBn: "",
    subtitleEn: "",
    category: "event",
    images: [] as string[],
  });

  const loadData = async () => {
    try {
      const [statData, noticeData, marqueeData, galleryData] = await Promise.all([
        getStatsApi().catch(() => []),
        getNoticesApi().catch(() => []),
        getMarqueeItemsApi().catch(() => []),
        getGalleryItemsApi().catch(() => []),
      ]);
      setStats(statData || []);
      if (statData && Array.isArray(statData) && statData.length > 0) {
        const memberStat = statData.find((s) => s.key === "active_members" || s.key === "members");
        const projectStat = statData.find((s) => s.key === "projects");
        const yearStat = statData.find((s) => s.key === "years_serving" || s.key === "years");

        setUnifiedStatsForm({
          activeMembers: memberStat?.value || "111+",
          projects: projectStat?.value || "70+",
          yearsServing: yearStat?.value || "3+",
          activeMembersLabelEn: memberStat?.label?.en || "ACTIVE MEMBERS",
          activeMembersLabelBn: memberStat?.label?.bn || "সক্রিয় সদস্য",
          projectsLabelEn: projectStat?.label?.en || "PROJECTS",
          projectsLabelBn: projectStat?.label?.bn || "চলমান ও সফল প্রকল্প",
          yearsServingLabelEn: yearStat?.label?.en || "YEARS SERVING",
          yearsServingLabelBn: yearStat?.label?.bn || "সেবার বছর",
        });
      }
      setNotices(noticeData || []);
      setMarqueeItems(marqueeData || []);
      setGalleryItems(galleryData || []);
      return { statData, noticeData, marqueeData, galleryData };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const triggerToast = (msg: string) => {
    setActionSuccess(msg);
    toast.success(msg);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  // Toggle Marquee Ticker status directly from table row
  const handleToggleTicker = async (n: NoticeItem) => {
    try {
      const updatedStatus = !n.isTickerActive;
      setNotices((prev) =>
        prev.map((item) => (item._id === n._id ? { ...item, isTickerActive: updatedStatus } : item))
      );
      await updateNoticeApi(n._id, { isTickerActive: updatedStatus });
      triggerToast(
        updatedStatus
          ? "Activated notice on Home Marquee Ticker!"
          : "Deactivated from Home Marquee Ticker"
      );
      await loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update ticker status");
      await loadData();
    }
  };

  // Save Stats Counter Item (Individual)
  const handleSaveStat = async (id: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await updateStatApi(id, {
        value: statForm.value,
        label: { bn: statForm.labelBn, en: statForm.labelEn },
      });
      triggerToast("Stat counter updated successfully!");
      setEditingStatId(null);
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update stat counter");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Unified Save for All 3 Home Statistics Counters (Active Members, Projects, Years Serving)
  const handleSaveAllStats = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const payload = [
        {
          key: "active_members",
          value: unifiedStatsForm.activeMembers.trim() || "111+",
          label: {
            en: unifiedStatsForm.activeMembersLabelEn.trim() || "ACTIVE MEMBERS",
            bn: unifiedStatsForm.activeMembersLabelBn.trim() || "সক্রিয় সদস্য",
          },
          order: 1,
        },
        {
          key: "projects",
          value: unifiedStatsForm.projects.trim() || "70+",
          label: {
            en: unifiedStatsForm.projectsLabelEn.trim() || "PROJECTS",
            bn: unifiedStatsForm.projectsLabelBn.trim() || "চলমান ও সফল প্রকল্প",
          },
          order: 2,
        },
        {
          key: "years_serving",
          value: unifiedStatsForm.yearsServing.trim() || "3+",
          label: {
            en: unifiedStatsForm.yearsServingLabelEn.trim() || "YEARS SERVING",
            bn: unifiedStatsForm.yearsServingLabelBn.trim() || "সেবার বছর",
          },
          order: 3,
        },
      ];
      await bulkUpdateStatsApi(payload);
      triggerToast("Home Statistics Counter numbers updated & published to Home Page!");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update statistics");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset to Standard Default Metrics (111+, 70+, 3+)
  const handleResetStatsToDefault = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const payload = [
        {
          key: "active_members",
          value: "111+",
          label: { en: "ACTIVE MEMBERS", bn: "সক্রিয় সদস্য" },
          order: 1,
        },
        {
          key: "projects",
          value: "70+",
          label: { en: "PROJECTS", bn: "চলমান ও সফল প্রকল্প" },
          order: 2,
        },
        {
          key: "years_serving",
          value: "3+",
          label: { en: "YEARS SERVING", bn: "সেবার বছর" },
          order: 3,
        },
      ];
      await bulkUpdateStatsApi(payload);
      triggerToast("Reset metrics to standard default numbers (111+, 70+, 3+)!");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to reset statistics");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Notice Save
  const handleSaveNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const payload = {
        category: { bn: noticeForm.categoryBn, en: noticeForm.categoryEn },
        title: { bn: noticeForm.titleBn, en: noticeForm.titleEn },
        description: { bn: noticeForm.descBn, en: noticeForm.descEn },
        content: { bn: noticeForm.contentBn, en: noticeForm.contentEn },
        publishedDate: noticeForm.publishedDate,
        author: noticeForm.author,
        images: noticeForm.images.filter((img) => img.trim().length > 0),
        isTickerActive: noticeForm.isTickerActive,
        agendaHighlights: noticeForm.agendaHighlights.map((ag, idx) => ({
          num: ag.num || idx + 1,
          title: { bn: ag.titleBn, en: ag.titleEn },
          text: { bn: ag.textBn, en: ag.textEn },
        })),
      };

      if (editingId) {
        const updated = await updateNoticeApi(editingId, payload);
        setNotices((prev) => prev.map((n) => (n._id === editingId ? { ...n, ...updated } : n)));
        triggerToast("Notice updated successfully!");
      } else {
        const created = await createNoticeApi(payload);
        setNotices((prev) => [created, ...prev.filter((n) => n._id !== created._id)]);
        setNoticeSearchQuery(""); // Clear search filter so newly created notice is immediately visible
        setNoticeFilterTab("all");
        triggerToast("Notice created successfully!");
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to save notice");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Gallery Save
  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const payload = {
        title: { bn: galleryForm.titleBn, en: galleryForm.titleEn },
        subtitle: { bn: galleryForm.subtitleBn, en: galleryForm.subtitleEn },
        category: galleryForm.category,
        images: galleryForm.images.filter((img) => img.trim().length > 0),
      };

      if (editingId) {
        const updated = await updateGalleryItemApi(editingId, payload);
        setGalleryItems((prev) => prev.map((g) => (g._id === editingId ? { ...g, ...updated } : g)));
        triggerToast("Gallery item updated successfully!");
      } else {
        const created = await createGalleryItemApi(payload);
        setGalleryItems((prev) => [created, ...prev.filter((g) => g._id !== created._id)]);
        triggerToast("Gallery item created successfully!");
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to save gallery item");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Marquee Save
  const handleSaveMarquee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const payload = {
        headline: { bn: marqueeForm.textBn, en: marqueeForm.textEn },
        text: { bn: marqueeForm.textBn, en: marqueeForm.textEn },
        targetLink: marqueeForm.link,
        link: marqueeForm.link,
        isActive: marqueeForm.isActive,
      };

      if (editingId) {
        const updated = await updateMarqueeItemApi(editingId, payload);
        setMarqueeItems((prev) => prev.map((m) => (m._id === editingId ? { ...m, ...updated } : m)));
        triggerToast("Marquee ticker headline updated!");
      } else {
        const created = await createMarqueeItemApi(payload);
        setMarqueeItems((prev) => [created, ...prev.filter((m) => m._id !== created._id)]);
        triggerToast("Marquee ticker headline created!");
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to save marquee item");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Handlers
  const handleDeleteNotice = async (id: string) => {
    toast("Delete Notice?", {
      description: "Are you sure you want to delete this notice permanently?",
      action: {
        label: "Confirm Delete",
        onClick: async () => {
          try {
            setNotices((prev) => prev.filter((n) => n._id !== id));
            await deleteNoticeApi(id);
            triggerToast("Notice deleted");
            await loadData();
          } catch (err: any) {
            toast.error(err.message || "Failed to delete notice");
            await loadData();
          }
        },
      },
    });
  };

  const handleDeleteGallery = async (id: string) => {
    toast("Delete Gallery Item?", {
      description: "Are you sure you want to delete this gallery item?",
      action: {
        label: "Confirm Delete",
        onClick: async () => {
          try {
            setGalleryItems((prev) => prev.filter((g) => g._id !== id));
            await deleteGalleryItemApi(id);
            triggerToast("Gallery item deleted");
            await loadData();
          } catch (err: any) {
            toast.error(err.message || "Failed to delete item");
            await loadData();
          }
        },
      },
    });
  };

  const handleDeleteMarquee = async (id: string) => {
    toast("Delete Ticker Headline?", {
      description: "Are you sure you want to delete this marquee headline?",
      action: {
        label: "Confirm Delete",
        onClick: async () => {
          try {
            setMarqueeItems((prev) => prev.filter((m) => m._id !== id));
            await deleteMarqueeItemApi(id);
            triggerToast("Marquee headline deleted");
            await loadData();
          } catch (err: any) {
            toast.error(err.message || "Failed to delete item");
            await loadData();
          }
        },
      },
    });
  };

  const handleToggleMarqueeItem = async (m: MarqueeItem) => {
    try {
      const nextActive = !m.isActive;
      setMarqueeItems((prev) =>
        prev.map((item) => (item._id === m._id ? { ...item, isActive: nextActive } : item))
      );
      await updateMarqueeItemApi(m._id, { isActive: nextActive });
      triggerToast(nextActive ? "Activated on Home Marquee Ticker!" : "Paused from Home Marquee Ticker");
      await loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update ticker status");
      await loadData();
    }
  };

  // Open Create Modals
  const openMarqueeModal = (item?: MarqueeItem) => {
    setModalType("marquee");
    if (item) {
      setEditingId(item._id);
      setMarqueeForm({
        textBn: item.headline?.bn || item.text?.bn || "",
        textEn: item.headline?.en || item.text?.en || "",
        link: item.targetLink || item.link || "",
        isActive: item.isActive !== false,
      });
    } else {
      setEditingId(null);
      setMarqueeForm({
        textBn: "",
        textEn: "",
        link: "",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const openNoticeModal = (item?: NoticeItem, forceTicker: boolean = false) => {
    setModalType("notice");
    setNoticeModalView("editor");
    if (item) {
      setEditingId(item._id);
      setNoticeForm({
        categoryBn: item.category?.bn || "আনুষ্ঠানিক নোটিশ",
        categoryEn: item.category?.en || "OFFICIAL NOTICE",
        titleBn: item.title?.bn || "",
        titleEn: item.title?.en || "",
        descBn: item.description?.bn || "",
        descEn: item.description?.en || "",
        contentBn: item.content?.bn || "",
        contentEn: item.content?.en || "",
        publishedDate: item.publishedDate || (item.createdAt ? item.createdAt.split("T")[0] : ""),
        author: item.author || "ADMIN",
        images: item.images || [],
        isTickerActive: item.isTickerActive || false,
        agendaHighlights: (item.agendaHighlights || []).map((ag, idx) => ({
          num: ag.num || idx + 1,
          titleBn: ag.title?.bn || "",
          titleEn: ag.title?.en || "",
          textBn: ag.text?.bn || "",
          textEn: ag.text?.en || "",
        })),
      });
    } else {
      setEditingId(null);
      setNoticeForm({
        categoryBn: "আনুষ্ঠানিক নোটিশ",
        categoryEn: "OFFICIAL NOTICE",
        titleBn: "",
        titleEn: "",
        descBn: "",
        descEn: "",
        contentBn: "",
        contentEn: "",
        publishedDate: new Date().toISOString().split("T")[0],
        author: "ADMIN",
        images: [],
        isTickerActive: forceTicker,
        agendaHighlights: [],
      });
    }
    setIsModalOpen(true);
  };

  const openGalleryModal = (item?: GalleryItem) => {
    setModalType("gallery");
    if (item) {
      setEditingId(item._id);
      setGalleryForm({
        titleBn: item.title?.bn || "",
        titleEn: item.title?.en || "",
        subtitleBn: item.subtitle?.bn || "",
        subtitleEn: item.subtitle?.en || "",
        category: item.category || "event",
        images: item.images || [],
      });
    } else {
      setEditingId(null);
      setGalleryForm({
        titleBn: "",
        titleEn: "",
        subtitleBn: "",
        subtitleEn: "",
        category: "event",
        images: [],
      });
    }
    setIsModalOpen(true);
  };

  // Filtered notice list
  const tickerNotices = notices.filter((n) => n.isTickerActive);
  const filteredNotices = notices.filter((n) => {
    if (noticeFilterTab === "ticker" && !n.isTickerActive) return false;
    if (noticeSearchQuery.trim()) {
      const q = noticeSearchQuery.toLowerCase().trim();
      const titleEn = typeof n.title === "string" ? n.title : (n.title?.en || "");
      const titleBn = typeof n.title === "string" ? "" : (n.title?.bn || "");
      const catEn = typeof n.category === "string" ? n.category : (n.category?.en || "");
      const catBn = typeof n.category === "string" ? "" : (n.category?.bn || "");
      const descEn = typeof n.description === "string" ? n.description : (n.description?.en || "");
      const descBn = typeof n.description === "string" ? "" : (n.description?.bn || "");
      const author = n.author || "";

      return (
        titleEn.toLowerCase().includes(q) ||
        titleBn.toLowerCase().includes(q) ||
        catEn.toLowerCase().includes(q) ||
        catBn.toLowerCase().includes(q) ||
        descEn.toLowerCase().includes(q) ||
        descBn.toLowerCase().includes(q) ||
        author.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen">
      {/* Toast alert */}
      {actionSuccess && (
        <div className="fixed top-6 right-6 z-50 bg-[#00B074] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-bold animate-bounce">
          <Check className="w-5 h-5" />
          {actionSuccess}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-[#0E8A5A] font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            CMS Management Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">CMS Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage Home Page Stats, Notices & Marquee Announcement Ticker, and Photo Gallery dynamically.
          </p>
        </div>

        {/* Action Button Group */}
        {activeTab !== "stats" && (
          <div className="flex items-center gap-3 self-start sm:self-auto">
            {activeTab === "marquee" && (
              <button
                type="button"
                onClick={() => openMarqueeModal()}
                className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-[#00B074] hover:bg-[#0E8A5A] text-white font-bold text-sm transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Marquee Headline</span>
              </button>
            )}
            {activeTab === "notices" && (
              <>
                <button
                  type="button"
                  onClick={() => openNoticeModal(undefined, true)}
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#0E8A5A] border border-emerald-200 font-bold text-sm transition-all shadow-2xs cursor-pointer"
                >
                  <Megaphone className="w-4 h-4 text-[#00B074]" />
                  <span>+ Add Home Ticker</span>
                </button>
                <button
                  type="button"
                  onClick={() => openNoticeModal()}
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-[#00B074] hover:bg-[#0E8A5A] text-white font-bold text-sm transition-all shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Full Notice</span>
                </button>
              </>
            )}
            {activeTab === "gallery" && (
              <button
                type="button"
                onClick={() => openGalleryModal()}
                className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-[#00B074] hover:bg-[#0E8A5A] text-white font-bold text-sm transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Photo Set</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Sub-Tabs */}
      <div className="flex border-b border-gray-200 gap-6">
        <button
          type="button"
          onClick={() => setActiveTab("marquee")}
          className={`flex items-center gap-2 pb-3.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "marquee"
              ? "border-[#00B074] text-[#0E8A5A]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Volume2 className="w-4 h-4 text-[#00B074]" />
          Marquee Ticker ({marqueeItems.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("notices")}
          className={`flex items-center gap-2 pb-3.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "notices"
              ? "border-[#00B074] text-[#0E8A5A]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <FileText className="w-4 h-4" />
          Home Notices ({notices.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("stats")}
          className={`flex items-center gap-2 pb-3.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "stats"
              ? "border-[#00B074] text-[#0E8A5A]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Home Stats Counter ({stats.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("gallery")}
          className={`flex items-center gap-2 pb-3.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "gallery"
              ? "border-[#00B074] text-[#0E8A5A]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Gallery Manager ({galleryItems.length})
        </button>
      </div>

      {/* Skeleton Loading State */}
      {loading ? (
        <DataTableSkeleton rows={6} cols={5} />
      ) : (
        <>
          {/* Tab 1: Dedicated Marquee Announcement Ticker Section */}
          {activeTab === "marquee" && (
        <div className="space-y-6">
          {/* Live Marquee Scrolling Banner Preview */}
          <div className="bg-[#F8FAF5] border border-[#E3EBDC] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="inline-flex items-center gap-1.5 bg-[#2D5A27] text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full shadow-2xs">
                <Radio className="w-3.5 h-3.5 text-[#10B981] animate-pulse" />
                Live Marquee Ticker Preview
              </span>
            </div>
            <div className="flex-1 overflow-hidden font-semibold text-xs text-[#1A1A1A]">
              {marqueeItems.filter((m) => m.isActive).length > 0 ? (
                <div className="flex items-center gap-6 whitespace-nowrap overflow-hidden">
                  {marqueeItems
                    .filter((m) => m.isActive)
                    .map((m) => (
                      <span key={m._id} className="inline-flex items-center gap-3 text-[#262626]">
                        <span>{(m.headline?.en || m.text?.en) || (m.headline?.bn || m.text?.bn)}</span>
                        <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block" />
                      </span>
                    ))}
                </div>
              ) : (
                <span className="text-gray-400 italic">No marquee items currently active on home header ticker.</span>
              )}
            </div>
            <span className="text-[11.5px] font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-xl flex-shrink-0">
              {marqueeItems.filter((m) => m.isActive).length} Item(s) Active
            </span>
          </div>

          {/* Marquee Table */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-bold text-gray-700">
                  <tr>
                    <th className="px-6 py-4">Marquee Headline (EN / BN)</th>
                    <th className="px-6 py-4">Target Notice / Link</th>
                    <th className="px-6 py-4">Status Toggle</th>
                    <th className="px-6 py-4">Created Date</th>
                    <th className="px-6 py-4 text-right">CRUD Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {marqueeItems.map((m) => (
                    <tr key={m._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 max-w-[360px]">
                        <p className="font-bold text-gray-900 line-clamp-1">{(m.headline?.en || m.text?.en) || "No English Text"}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{(m.headline?.bn || m.text?.bn) || "No Bangla Text"}</p>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-emerald-700">
                        {m.targetLink || m.link || <span className="text-gray-400 italic">None</span>}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => handleToggleMarqueeItem(m)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                            m.isActive
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200"
                              : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                          }`}
                        >
                          <Radio className={`w-3.5 h-3.5 ${m.isActive ? "text-emerald-600" : "text-gray-400"}`} />
                          <span>{m.isActive ? "ACTIVE (ON)" : "PAUSED (OFF)"}</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {new Date(m.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => openMarqueeModal(m)}
                          className="p-2 text-gray-600 hover:text-[#00B074] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Marquee Headline"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMarquee(m._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Marquee Headline"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {marqueeItems.length === 0 && !loading && (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-gray-400">
                        No marquee headline items found. Click "+ Add Marquee Headline" to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Dynamic Home Stats Counter CMS Form Section */}
      {activeTab === "stats" && (
        <div className="space-y-8">
          {/* Header & Quick Action Bar */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-50 text-[#00B074]">
                  <BarChart3 className="w-5 h-5" />
                </span>
                <h2 className="text-lg font-bold text-gray-900">
                  Home Page Statistics Counter Configuration
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
                Manage the live counters displayed on the public Home Page strip. Changes are stored in the database and reflect <strong>instantly</strong> on the live website without code redeployment.
              </p>
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <button
                type="button"
                onClick={handleResetStatsToDefault}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                title="Reset to 111+, 70+, 3+"
              >
                <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
                <span>Reset Defaults</span>
              </button>

              <button
                type="button"
                onClick={handleSaveAllStats}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-[#00B074] hover:bg-[#0E8A5A] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Save & Publish to Home Page</span>
              </button>
            </div>
          </div>

          {/* 1. Main Unified Statistics Form Section */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#00B074]" />
                  Home Page Counter Metric Fields
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Update the number counts and labels for the three primary metrics.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Dynamic Database Binding Active
              </span>
            </div>

            <form onSubmit={handleSaveAllStats} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Metric 1: ACTIVE MEMBERS */}
                <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all hover:border-[#00B074]/50 hover:shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center">
                          <Users className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                          Metric 1
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white text-gray-500 border border-gray-200">
                        active_members
                      </span>
                    </div>

                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">
                      ACTIVE MEMBERS Count
                    </label>
                    <input
                      type="text"
                      value={unifiedStatsForm.activeMembers}
                      onChange={(e) =>
                        setUnifiedStatsForm({ ...unifiedStatsForm, activeMembers: e.target.value })
                      }
                      placeholder="e.g. 111+"
                      className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 text-xl font-extrabold text-gray-900 outline-none focus:border-[#00B074] focus:ring-2 focus:ring-emerald-100 transition-all shadow-xs"
                    />

                    <div className="mt-3.5 pt-3 border-t border-slate-200/60 space-y-2">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 mb-0.5">
                          Display Label (English)
                        </label>
                        <input
                          type="text"
                          value={unifiedStatsForm.activeMembersLabelEn}
                          onChange={(e) =>
                            setUnifiedStatsForm({
                              ...unifiedStatsForm,
                              activeMembersLabelEn: e.target.value,
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-800 outline-none focus:border-[#00B074]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 mb-0.5">
                          Display Label (Bangla)
                        </label>
                        <input
                          type="text"
                          value={unifiedStatsForm.activeMembersLabelBn}
                          onChange={(e) =>
                            setUnifiedStatsForm({
                              ...unifiedStatsForm,
                              activeMembersLabelBn: e.target.value,
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-800 outline-none focus:border-[#00B074]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metric 2: PROJECTS */}
                <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all hover:border-[#00B074]/50 hover:shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                          Metric 2
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white text-gray-500 border border-gray-200">
                        projects
                      </span>
                    </div>

                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">
                      PROJECTS Count
                    </label>
                    <input
                      type="text"
                      value={unifiedStatsForm.projects}
                      onChange={(e) =>
                        setUnifiedStatsForm({ ...unifiedStatsForm, projects: e.target.value })
                      }
                      placeholder="e.g. 70+"
                      className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 text-xl font-extrabold text-gray-900 outline-none focus:border-[#00B074] focus:ring-2 focus:ring-emerald-100 transition-all shadow-xs"
                    />

                    <div className="mt-3.5 pt-3 border-t border-slate-200/60 space-y-2">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 mb-0.5">
                          Display Label (English)
                        </label>
                        <input
                          type="text"
                          value={unifiedStatsForm.projectsLabelEn}
                          onChange={(e) =>
                            setUnifiedStatsForm({
                              ...unifiedStatsForm,
                              projectsLabelEn: e.target.value,
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-800 outline-none focus:border-[#00B074]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 mb-0.5">
                          Display Label (Bangla)
                        </label>
                        <input
                          type="text"
                          value={unifiedStatsForm.projectsLabelBn}
                          onChange={(e) =>
                            setUnifiedStatsForm({
                              ...unifiedStatsForm,
                              projectsLabelBn: e.target.value,
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-800 outline-none focus:border-[#00B074]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metric 3: YEARS SERVING */}
                <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all hover:border-[#00B074]/50 hover:shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center">
                          <Clock className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                          Metric 3
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white text-gray-500 border border-gray-200">
                        years_serving
                      </span>
                    </div>

                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">
                      YEARS SERVING Count
                    </label>
                    <input
                      type="text"
                      value={unifiedStatsForm.yearsServing}
                      onChange={(e) =>
                        setUnifiedStatsForm({ ...unifiedStatsForm, yearsServing: e.target.value })
                      }
                      placeholder="e.g. 3+"
                      className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 text-xl font-extrabold text-gray-900 outline-none focus:border-[#00B074] focus:ring-2 focus:ring-emerald-100 transition-all shadow-xs"
                    />

                    <div className="mt-3.5 pt-3 border-t border-slate-200/60 space-y-2">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 mb-0.5">
                          Display Label (English)
                        </label>
                        <input
                          type="text"
                          value={unifiedStatsForm.yearsServingLabelEn}
                          onChange={(e) =>
                            setUnifiedStatsForm({
                              ...unifiedStatsForm,
                              yearsServingLabelEn: e.target.value,
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-800 outline-none focus:border-[#00B074]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 mb-0.5">
                          Display Label (Bangla)
                        </label>
                        <input
                          type="text"
                          value={unifiedStatsForm.yearsServingLabelBn}
                          onChange={(e) =>
                            setUnifiedStatsForm({
                              ...unifiedStatsForm,
                              yearsServingLabelBn: e.target.value,
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-800 outline-none focus:border-[#00B074]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Action Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  Clicking save updates the public Home Page immediately with live database values.
                </span>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-7 rounded-xl bg-[#00B074] hover:bg-[#0E8A5A] text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>Save Changes to Home Page</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* 2. Live Public Website Preview Section */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                  Live Home Page Preview (Public View)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  How visitors see the statistics section on the public Home Page (matching StatsSection).
                </p>
              </div>
              <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Interactive Visual Mirror
              </span>
            </div>

            {/* Public UI Mirror Strip */}
            <div className="rounded-2xl border border-gray-200 bg-white py-10 px-4 sm:px-8 text-center shadow-inner">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center items-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
                {/* 1. Active Members */}
                <div className="flex flex-col items-center justify-center py-4 md:py-0">
                  <span className="font-extrabold text-[#262626] text-4xl sm:text-5xl lg:text-6xl leading-none tracking-tight">
                    {unifiedStatsForm.activeMembers || "111+"}
                  </span>
                  <p className="mt-3 text-[13px] font-bold tracking-[0.22em] text-[#666666] uppercase">
                    {unifiedStatsForm.activeMembersLabelEn || "ACTIVE MEMBERS"}
                  </p>
                  <p className="text-[11px] text-[#888888] font-medium mt-0.5">
                    ({unifiedStatsForm.activeMembersLabelBn || "সক্রিয় সদস্য"})
                  </p>
                </div>

                {/* 2. Projects */}
                <div className="flex flex-col items-center justify-center py-4 md:py-0">
                  <span className="font-extrabold text-[#262626] text-4xl sm:text-5xl lg:text-6xl leading-none tracking-tight">
                    {unifiedStatsForm.projects || "70+"}
                  </span>
                  <p className="mt-3 text-[13px] font-bold tracking-[0.22em] text-[#666666] uppercase">
                    {unifiedStatsForm.projectsLabelEn || "PROJECTS"}
                  </p>
                  <p className="text-[11px] text-[#888888] font-medium mt-0.5">
                    ({unifiedStatsForm.projectsLabelBn || "চলমান ও সফল প্রকল্প"})
                  </p>
                </div>

                {/* 3. Years Serving */}
                <div className="flex flex-col items-center justify-center py-4 md:py-0">
                  <span className="font-extrabold text-[#262626] text-4xl sm:text-5xl lg:text-6xl leading-none tracking-tight">
                    {unifiedStatsForm.yearsServing || "3+"}
                  </span>
                  <p className="mt-3 text-[13px] font-bold tracking-[0.22em] text-[#666666] uppercase">
                    {unifiedStatsForm.yearsServingLabelEn || "YEARS SERVING"}
                  </p>
                  <p className="text-[11px] text-[#888888] font-medium mt-0.5">
                    ({unifiedStatsForm.yearsServingLabelBn || "সেবার বছর"})
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Home Notices & Marquee Ticker CMS Section */}
      {activeTab === "notices" && (
        <div className="space-y-6">
          {/* Live Marquee Ticker Preview Box */}
          <div className="bg-[#F8FAF5] border border-[#E3EBDC] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="inline-flex items-center gap-1.5 bg-[#2D5A27] text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full shadow-2xs">
                <Radio className="w-3.5 h-3.5 text-[#10B981] animate-pulse" />
                Home Marquee Preview
              </span>
            </div>
            <div className="flex-1 overflow-hidden font-semibold text-xs text-[#1A1A1A]">
              {tickerNotices.length > 0 ? (
                <div className="flex items-center gap-4 whitespace-nowrap overflow-hidden">
                  {tickerNotices.map((t, idx) => (
                    <span key={t._id} className="inline-flex items-center gap-3 text-[#262626]">
                      <span className="font-bold text-[#0E8A5A]">[{t.category?.en || "NOTICE"}]</span>
                      {t.title?.en || t.title?.bn}
                      <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block" />
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-400 italic">No notices currently active on top ticker marquee bar.</span>
              )}
            </div>
            <span className="text-[11.5px] font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-xl flex-shrink-0">
              {tickerNotices.length} Ticker Item(s) Active
            </span>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200">
            {/* Filter Pills */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setNoticeFilterTab("all")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  noticeFilterTab === "all"
                    ? "bg-[#00B074] text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All Notices ({notices.length})
              </button>
              <button
                type="button"
                onClick={() => setNoticeFilterTab("ticker")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  noticeFilterTab === "ticker"
                    ? "bg-[#0E8A5A] text-white shadow-xs"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                Home Ticker Active ({tickerNotices.length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search notices by title or category..."
                value={noticeSearchQuery}
                onChange={(e) => setNoticeSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-9 py-2 text-xs font-medium outline-none focus:border-[#00B074]"
              />
              {noticeSearchQuery && (
                <button
                  type="button"
                  onClick={() => setNoticeSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Notices Table */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-bold text-gray-700">
                  <tr>
                    <th className="px-6 py-4">Notice Title (EN / BN)</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Home Ticker Status</th>
                    <th className="px-6 py-4">Photos</th>
                    <th className="px-6 py-4">Published Date</th>
                    <th className="px-6 py-4 text-right">CRUD Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {filteredNotices.map((n) => (
                    <tr key={n._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 max-w-[340px]">
                        <p className="font-bold text-gray-900 line-clamp-1">
                          {typeof n.title === "string" ? n.title : (n.title?.en || n.title?.bn || "Untitled Notice")}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {typeof n.title === "object" ? n.title?.bn : ""}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-[#0E8A5A] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                          {n.category?.en || "GENERAL"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => handleToggleTicker(n)}
                          title="Click to toggle Home Marquee Ticker visibility"
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                            n.isTickerActive
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200"
                              : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                          }`}
                        >
                          <Bell className={`w-3.5 h-3.5 ${n.isTickerActive ? "text-emerald-600" : "text-gray-400"}`} />
                          <span>{n.isTickerActive ? "Ticker Active (ON)" : "Standard (OFF)"}</span>
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                          {n.images?.length || 0} photo(s)
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {n.publishedDate || new Date(n.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <a
                          href={`/notice/${n.slug || n._id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block p-2 text-gray-500 hover:text-[#00B074] hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Single Notice Page"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <button
                          type="button"
                          onClick={() => openNoticeModal(n)}
                          className="p-2 text-gray-600 hover:text-[#00B074] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Notice"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteNotice(n._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Notice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredNotices.length === 0 && !loading && (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-400">
                        No notices found matching current filter/search. Click "+ Add Notice" to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Gallery Table */}
      {activeTab === "gallery" && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-bold text-gray-700">
                <tr>
                  <th className="px-6 py-4">Title (BN / EN)</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Image Set</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {galleryItems.map((g) => (
                  <tr key={g._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 max-w-[360px]">
                      <p className="font-bold text-gray-900 line-clamp-1">{g.title?.en || "Untitled Set"}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{g.title?.bn || "শিরোনাম নেই"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize bg-emerald-50 text-[#0E8A5A] px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-100">
                        {g.category || "General"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                        {g.images?.length || 0} photo(s)
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(g.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => openGalleryModal(g)}
                        className="p-2 text-gray-600 hover:text-[#00B074] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteGallery(g._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {galleryItems.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400">
                      No photo gallery items found. Click "Add Photo Set" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
        </>
      )}

      {/* CRUD MODAL FOR NOTICE & GALLERY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`bg-white rounded-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl transition-all ${
            modalType === "notice" ? "max-w-[860px]" : "max-w-[680px]"
          }`}>
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingId ? "Edit" : "Create"} {modalType.toUpperCase()}
                </h2>

                {/* Segmented View Mode Toggle for Notice Modal */}
                {modalType === "notice" && (
                  <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setNoticeModalView("editor")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        noticeModalView === "editor" ? "bg-white text-gray-900 shadow-2xs" : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Form Editor</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNoticeModalView("preview")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        noticeModalView === "preview" ? "bg-[#00B074] text-white shadow-2xs" : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Live Preview</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MARQUEE FORM */}
            {modalType === "marquee" && (
              <form onSubmit={handleSaveMarquee} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                    Marquee Headline Text (Bangla)
                  </label>
                  <input
                    type="text"
                    required
                    value={marqueeForm.textBn}
                    onChange={(e) => setMarqueeForm({ ...marqueeForm, textBn: e.target.value })}
                    placeholder="বাংলা মার্কি টেক্সট লিখুন..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B074]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                    Marquee Headline Text (English)
                  </label>
                  <input
                    type="text"
                    required
                    value={marqueeForm.textEn}
                    onChange={(e) => setMarqueeForm({ ...marqueeForm, textEn: e.target.value })}
                    placeholder="Enter English marquee headline text..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B074]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                    Target Notice URL / Link (Optional)
                  </label>
                  <input
                    type="text"
                    value={marqueeForm.link}
                    onChange={(e) => setMarqueeForm({ ...marqueeForm, link: e.target.value })}
                    placeholder="/notice/annual-general-assembly-2026"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B074]"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Leave blank if headline has no specific notice link.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="marqueeIsActive"
                    checked={marqueeForm.isActive}
                    onChange={(e) => setMarqueeForm({ ...marqueeForm, isActive: e.target.checked })}
                    className="w-4 h-4 text-[#00B074] accent-[#00B074] rounded cursor-pointer"
                  />
                  <label htmlFor="marqueeIsActive" className="text-sm font-bold text-gray-700 cursor-pointer">
                    Active on Home Page Top Marquee Ticker Bar
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-[#00B074] hover:bg-[#0E8A5A] text-white font-bold text-sm shadow-md cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed inline-flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving Headline...</span>
                      </>
                    ) : (
                      "Save Marquee Headline"
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* NOTICE FORM & LIVE PREVIEW MODAL */}
            {modalType === "notice" && (
              <>
                {noticeModalView === "editor" ? (
                  <form onSubmit={handleSaveNotice} className="space-y-4">
                    {/* Category & Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Category (EN)</label>
                        <input
                          type="text"
                          value={noticeForm.categoryEn}
                          onChange={(e) => setNoticeForm({ ...noticeForm, categoryEn: e.target.value })}
                          placeholder="OFFICIAL NOTICE"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B074]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Category (BN)</label>
                        <input
                          type="text"
                          value={noticeForm.categoryBn}
                          onChange={(e) => setNoticeForm({ ...noticeForm, categoryBn: e.target.value })}
                          placeholder="আনুষ্ঠানিক নোটিশ"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B074]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Published Date</label>
                        <input
                          type="date"
                          value={noticeForm.publishedDate}
                          onChange={(e) => setNoticeForm({ ...noticeForm, publishedDate: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B074]"
                        />
                      </div>
                    </div>

                    {/* Title */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Title (Bangla)</label>
                        <input
                          type="text"
                          required
                          value={noticeForm.titleBn}
                          onChange={(e) => setNoticeForm({ ...noticeForm, titleBn: e.target.value })}
                          placeholder="বিজ্ঞপ্তির শিরোনাম"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B074]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Title (English)</label>
                        <input
                          type="text"
                          required
                          value={noticeForm.titleEn}
                          onChange={(e) => setNoticeForm({ ...noticeForm, titleEn: e.target.value })}
                          placeholder="Notice Title"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B074]"
                        />
                      </div>
                    </div>

                    {/* Short Description */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Short Description (BN)</label>
                        <textarea
                          rows={2}
                          value={noticeForm.descBn}
                          onChange={(e) => setNoticeForm({ ...noticeForm, descBn: e.target.value })}
                          placeholder="সংক্ষিপ্ত বিবরণ"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#00B074]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Short Description (EN)</label>
                        <textarea
                          rows={2}
                          value={noticeForm.descEn}
                          onChange={(e) => setNoticeForm({ ...noticeForm, descEn: e.target.value })}
                          placeholder="Short summary"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#00B074]"
                        />
                      </div>
                    </div>

                    {/* WYSIWYG Rich Text Editors */}
                    <RichTextEditor
                      label="Content / Body (Bangla Rich Text Editor)"
                      value={noticeForm.contentBn}
                      onChange={(html) => setNoticeForm({ ...noticeForm, contentBn: html })}
                      placeholder="বাংলা বিষয়বস্তু লিখুন..."
                    />

                    <RichTextEditor
                      label="Content / Body (English Rich Text Editor)"
                      value={noticeForm.contentEn}
                      onChange={(html) => setNoticeForm({ ...noticeForm, contentEn: html })}
                      placeholder="Detailed English notice content body..."
                    />

                    {/* Dynamic Agenda Highlights List */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold uppercase text-gray-700">
                          Agenda Highlights ({noticeForm.agendaHighlights.length})
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setNoticeForm({
                              ...noticeForm,
                              agendaHighlights: [
                                ...noticeForm.agendaHighlights,
                                {
                                  num: noticeForm.agendaHighlights.length + 1,
                                  titleBn: "",
                                  titleEn: "",
                                  textBn: "",
                                  textEn: "",
                                },
                              ],
                            });
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#00B074] hover:underline cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Agenda Item
                        </button>
                      </div>

                      {noticeForm.agendaHighlights.map((ag, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-2xl space-y-2 relative">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-500">
                              Agenda #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const nextAgendas = noticeForm.agendaHighlights.filter((_, i) => i !== idx);
                                setNoticeForm({ ...noticeForm, agendaHighlights: nextAgendas });
                              }}
                              className="text-gray-400 hover:text-red-500 p-1 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Title (English)"
                              value={ag.titleEn}
                              onChange={(e) => {
                                const updated = [...noticeForm.agendaHighlights];
                                updated[idx].titleEn = e.target.value;
                                setNoticeForm({ ...noticeForm, agendaHighlights: updated });
                              }}
                              className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-[#00B074]"
                            />
                            <input
                              type="text"
                              placeholder="Title (Bangla)"
                              value={ag.titleBn}
                              onChange={(e) => {
                                const updated = [...noticeForm.agendaHighlights];
                                updated[idx].titleBn = e.target.value;
                                setNoticeForm({ ...noticeForm, agendaHighlights: updated });
                              }}
                              className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-[#00B074]"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Description (English)"
                              value={ag.textEn}
                              onChange={(e) => {
                                const updated = [...noticeForm.agendaHighlights];
                                updated[idx].textEn = e.target.value;
                                setNoticeForm({ ...noticeForm, agendaHighlights: updated });
                              }}
                              className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-[#00B074]"
                            />
                            <input
                              type="text"
                              placeholder="Description (Bangla)"
                              value={ag.textBn}
                              onChange={(e) => {
                                const updated = [...noticeForm.agendaHighlights];
                                updated[idx].textBn = e.target.value;
                                setNoticeForm({ ...noticeForm, agendaHighlights: updated });
                              }}
                              className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-[#00B074]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Drag-and-Drop Multi-File Uploader */}
                    <FileUploadWidget
                      images={noticeForm.images}
                      onChange={(imgs) => setNoticeForm({ ...noticeForm, images: imgs })}
                      multiple={true}
                      label="Notice Attachment Photos (Drag & Drop or Click)"
                    />

                    <div className="flex items-center gap-3 pt-2">
                      <input
                        type="checkbox"
                        id="tickerToggle"
                        checked={noticeForm.isTickerActive}
                        onChange={(e) => setNoticeForm({ ...noticeForm, isTickerActive: e.target.checked })}
                        className="w-4 h-4 text-[#00B074] rounded focus:ring-[#00B074]"
                      />
                      <label htmlFor="tickerToggle" className="text-sm font-bold text-gray-800 cursor-pointer">
                        Set as Top Announcement Ticker (isTickerActive)
                      </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="h-10 px-5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-10 px-6 rounded-xl bg-[#00B074] hover:bg-[#0E8A5A] text-white font-bold text-sm shadow-sm cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed inline-flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Saving Notice...</span>
                          </>
                        ) : (
                          "Save Notice"
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* LIVE PREVIEW MODE MATCHING FIGMA DESIGN 1:1 */
                  <div className="space-y-4">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-[#00B074]" />
                        <span className="text-xs font-bold text-[#0E8A5A] uppercase tracking-wider">
                          Pixel-Perfect Live Preview Mode
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        Reviewing exact layout before publishing
                      </span>
                    </div>

                    <div className="border border-gray-200 rounded-2xl p-4 sm:p-6 bg-white overflow-y-auto max-h-[65vh] shadow-inner">
                      <NoticeDetailClient
                        previewData={{
                          categoryText: noticeForm.categoryEn || noticeForm.categoryBn || "OFFICIAL NOTICE",
                          titleText: noticeForm.titleEn || noticeForm.titleBn || "Notice Title Preview",
                          dateText: noticeForm.publishedDate
                            ? new Date(noticeForm.publishedDate).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
                            : "October 12, 2025",
                          images: noticeForm.images.length > 0 ? noticeForm.images : ["/images/news/news-1.svg"],
                          htmlContent: noticeForm.contentEn || noticeForm.contentBn || noticeForm.descEn || noticeForm.descBn || "<p>Detailed notice body text preview...</p>",
                          agendaHighlights: noticeForm.agendaHighlights.map((ag, idx) => ({
                            num: ag.num || idx + 1,
                            title: ag.titleEn || ag.titleBn || `Agenda #${idx + 1}`,
                            text: ag.textEn || ag.textBn || "",
                          })),
                        }}
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setNoticeModalView("editor")}
                        className="h-10 px-5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 cursor-pointer"
                      >
                        Back to Form Editor
                      </button>
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={(e) => handleSaveNotice(e)}
                        className="h-10 px-6 rounded-xl bg-[#00B074] hover:bg-[#0E8A5A] text-white font-bold text-sm shadow-sm cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed inline-flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Publishing...</span>
                          </>
                        ) : (
                          "Publish / Save Notice"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* GALLERY FORM WITH DRAG & DROP MULTI-FILE UPLOADER */}
            {modalType === "gallery" && (
              <form onSubmit={handleSaveGallery} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Title (Bangla)</label>
                    <input
                      type="text"
                      required
                      value={galleryForm.titleBn}
                      onChange={(e) => setGalleryForm({ ...galleryForm, titleBn: e.target.value })}
                      placeholder="ছবি সেটের শিরোনাম"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B074]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Title (English)</label>
                    <input
                      type="text"
                      required
                      value={galleryForm.titleEn}
                      onChange={(e) => setGalleryForm({ ...galleryForm, titleEn: e.target.value })}
                      placeholder="Photo Set Title"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B074]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Subtitle / Caption (BN)</label>
                    <input
                      type="text"
                      value={galleryForm.subtitleBn}
                      onChange={(e) => setGalleryForm({ ...galleryForm, subtitleBn: e.target.value })}
                      placeholder="উপশিরোনাম"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B074]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Subtitle / Caption (EN)</label>
                    <input
                      type="text"
                      value={galleryForm.subtitleEn}
                      onChange={(e) => setGalleryForm({ ...galleryForm, subtitleEn: e.target.value })}
                      placeholder="Caption / Subtitle"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B074]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Category</label>
                  <select
                    value={galleryForm.category}
                    onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B074]"
                  >
                    <option value="event">Event</option>
                    <option value="workshop">Workshop</option>
                    <option value="assembly">Assembly</option>
                    <option value="general">General</option>
                  </select>
                </div>

                {/* Professional Drag-and-Drop Multi-File Uploader */}
                <FileUploadWidget
                  images={galleryForm.images}
                  onChange={(imgs) => setGalleryForm({ ...galleryForm, images: imgs })}
                  multiple={true}
                  label="Gallery Photo Set (Drag & Drop or Click)"
                />

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="h-10 px-5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-10 px-6 rounded-xl bg-[#00B074] hover:bg-[#0E8A5A] text-white font-bold text-sm shadow-sm cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed inline-flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving Photos...</span>
                      </>
                    ) : (
                      "Save Photo Set"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
