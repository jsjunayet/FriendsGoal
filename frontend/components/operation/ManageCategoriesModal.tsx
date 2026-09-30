"use client";

import { useState } from "react";
import { X, GripVertical, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  IExpenseCategory,
  createExpenseCategoryApi,
  reorderExpenseCategoriesApi,
} from "@/lib/expenseApi";

interface ManageCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: IExpenseCategory[];
  onCategoriesUpdated: (categories: IExpenseCategory[]) => void;
}

export function ManageCategoriesModal({
  isOpen,
  onClose,
  categories,
  onCategoriesUpdated,
}: ManageCategoriesModalProps) {
  const [items, setItems] = useState<IExpenseCategory[]>(categories);
  const [newCatName, setNewCatName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  // Sync when categories prop changes
  if (categories !== items && categories.length !== items.length && !isAdding) {
    setItems(categories);
  }

  if (!isOpen) return null;

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newItems = [...items];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    setItems(newItems);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    try {
      setIsSavingOrder(true);
      const reorderedPayload = items.map((cat, idx) => ({
        id: cat._id,
        order: idx,
      }));
      const updated = await reorderExpenseCategoriesApi(reorderedPayload);
      setItems(updated);
      onCategoriesUpdated(updated);
    } catch (err) {
      console.error("Failed to persist category order:", err);
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) return;

    // Check duplicate
    if (items.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("A category with this name already exists.");
      return;
    }

    try {
      setIsAdding(true);
      const created = await createExpenseCategoryApi(trimmed);
      const updated = [...items, created];
      setItems(updated);
      onCategoriesUpdated(updated);
      setNewCatName("");
    } catch (err: any) {
      toast.error("Failed to add category: " + (err.message || "Unknown error"));
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ─── Header: Emerald Green matching Screenshot 3 ───────────────────────── */}
        <div className="bg-[#056839] px-6 py-4.5 flex items-center justify-between text-white">
          <div>
            <h3 className="text-base font-bold leading-tight">Manage Categories</h3>
            <p className="text-xs text-white/80 mt-0.5">
              {items.length} categories · drag to reorder
              {isSavingOrder && <span className="ml-1 text-[11px] italic">(saving...)</span>}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ─── Category List: Drag & Drop ────────────────────────────────────────── */}
        <div className="p-4 overflow-y-auto max-h-[360px] divide-y divide-gray-100 space-y-1">
          {items.map((cat, index) => (
            <div
              key={cat._id || index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-800 font-medium hover:bg-gray-50 transition-colors cursor-grab active:cursor-grabbing select-none ${
                draggedIndex === index ? "bg-emerald-50 border border-emerald-300 opacity-60" : ""
              }`}
            >
              {/* Drag Handle: ☰ icon matching Screenshot 3 */}
              <div className="text-gray-400 hover:text-gray-600 p-0.5">
                <svg
                  className="w-4 h-4 text-gray-400"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.5 4H13.5M2.5 8H13.5M2.5 12H13.5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <span className="flex-1 truncate">{cat.name}</span>
            </div>
          ))}
        </div>

        {/* ─── Add New Category Footer matching Screenshot 3 ───────────────────────── */}
        <div className="p-5 border-t border-gray-100 bg-[#FAFBFD]">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            ADD NEW CATEGORY
          </label>
          <form onSubmit={handleAddCategory} className="flex items-center gap-2">
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="Category name..."
              disabled={isAdding}
              className="flex-1 px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B074]/30 focus:border-[#00B074]"
            />
            <button
              type="submit"
              disabled={isAdding || !newCatName.trim()}
              className="px-4 py-2 bg-[#00B074] hover:bg-[#009663] disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors inline-flex items-center justify-center min-w-[64px] cursor-pointer"
            >
              {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
