"use client";

import { useEffect, useState } from "react";
import { fetchPendingPopups, acknowledgeNotification, INotification } from "../../lib/notificationApi";
import { AlertCircle, X } from "lucide-react";
import { toast } from "sonner";
import { useMemberDashboard } from "../../lib/hooks/useMemberDashboard";

export function NotificationBlocker() {
  const [popups, setPopups] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [acknowledgingId, setAcknowledgingId] = useState<string | null>(null);
  const { summary } = useMemberDashboard();

  useEffect(() => {
    const loadPopups = async () => {
      try {
        const data = await fetchPendingPopups();
        setPopups(data);
      } catch (err) {
        console.error("Failed to fetch pending popups", err);
      } finally {
        setLoading(false);
      }
    };
    
    // Minimal delay to ensure cookies are ready or auth is stable
    setTimeout(loadPopups, 500);
  }, []);

  const handleAcknowledgeAll = async () => {
    try {
      setAcknowledgingId("all");
      // Acknowledge all pending popups
      for (const p of popups) {
        await acknowledgeNotification(p._id);
      }
      setPopups([]);
      toast.success("Acknowledged successfully.");
    } catch (err: any) {
      console.error("Failed to acknowledge notifications:", err);
      toast.error("Failed to acknowledge. Please try again.");
      alert(`Error: ${err.message || "Failed to acknowledge"}`);
    } finally {
      setAcknowledgingId(null);
    }
  };

  if (loading || popups.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-[16px] w-full max-w-lg shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Right Close Button */}
        <button
          onClick={handleAcknowledgeAll}
          disabled={acknowledgingId !== null}
          className="absolute top-4 right-4 p-1.5 rounded-full border-2 border-[#00B074] text-[#00B074] hover:bg-[#00B074]/10 transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" strokeWidth={2.5} />
        </button>

        <div className="p-6 pt-8 sm:p-8 sm:pt-10">
          <h2 className="text-[20px] font-bold text-[#1A1A1A] mb-4 pr-8">
            Due Balance Summary
          </h2>
          
          <div className="text-[15px] text-[#555555] mb-8 leading-relaxed">
            <p className="mb-5">You have new monthly due allocations pending your review.</p>
            
            <div className="bg-[#F8FAFC] p-5 rounded-xl border border-[#E2E8F0] flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[#475569]">Newly Allocated:</span>
                <span className="text-[#1A1A1A] font-bold">
                  {popups.length} Month(s)
                </span>
              </div>
              <div className="h-px w-full bg-[#E2E8F0]" />
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[#475569]">Overall Total Due:</span>
                <span className="text-[#D62828] font-bold text-[18px]">
                  ৳{(summary?.dueAmount || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons (Right Aligned) */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#F0F0F0]">
            <button
              onClick={handleAcknowledgeAll}
              disabled={acknowledgingId !== null}
              className="bg-[#D62828] hover:bg-[#B71C1C] text-white font-bold py-2.5 px-6 rounded-lg transition-colors text-[14px] disabled:opacity-70"
            >
              {acknowledgingId !== null ? "Processing..." : "Acknowledge"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
