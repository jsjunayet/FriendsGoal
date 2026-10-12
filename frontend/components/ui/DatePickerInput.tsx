"use client";

import React, { useState, useEffect, useRef } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";

interface DatePickerInputProps {
  value?: string;
  onChange: (formattedDate: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const FULL_MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

/**
 * Parses various date formats into Date object or null:
 * Supports: DD-MMM-YYYY, YYYY-MM-DD, MM/DD/YYYY, ISO strings
 */
export function parseDateStrict(str?: string): Date | null {
  if (!str || typeof str !== "string" || !str.trim()) return null;
  const s = str.trim();

  // Format: DD-MMM-YYYY (e.g. 01-Nov-1994)
  const dmmmyMatch = s.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
  if (dmmmyMatch) {
    const day = parseInt(dmmmyMatch[1], 10);
    const mStr = dmmmyMatch[2].toLowerCase();
    const monthIndex = MONTH_NAMES.findIndex((m) => m.toLowerCase() === mStr);
    const year = parseInt(dmmmyMatch[3], 10);
    if (monthIndex !== -1 && day >= 1 && day <= 31) {
      const d = new Date(year, monthIndex, day);
      if (!isNaN(d.getTime())) return d;
    }
  }

  // Format: YYYY-MM-DD
  const ymdMatch = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const month = parseInt(ymdMatch[2], 10) - 1;
    const day = parseInt(ymdMatch[3], 10);
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) return d;
  }

  // Format: MM/DD/YYYY or DD/MM/YYYY
  const slashMatch = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const p1 = parseInt(slashMatch[1], 10);
    const p2 = parseInt(slashMatch[2], 10);
    const year = parseInt(slashMatch[3], 10);
    
    // Defaulting to MM/DD/YYYY if p1 <= 12
    const month = p1 <= 12 ? p1 - 1 : p2 - 1;
    const day = p1 <= 12 ? p2 : p1;
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) return d;
  }

  // Fallback to standard Date parsing
  const fallback = new Date(s);
  if (!isNaN(fallback.getTime())) return fallback;

  return null;
}

/**
 * Formats a Date object strictly into DD-MMM-YYYY (e.g. 01-Nov-1994)
 */
export function formatDateStrict(d: Date | null): string {
  if (!d || isNaN(d.getTime())) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const month = MONTH_NAMES[d.getMonth()];
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

export function DatePickerInput({
  value = "",
  onChange,
  placeholder = "DD-MMM-YYYY",
  disabled = false,
  className = "",
  id,
  name,
}: DatePickerInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const parsedDate = parseDateStrict(value);
  const today = new Date();

  // Calendar view state (month & year being viewed)
  const [viewYear, setViewYear] = useState<number>(parsedDate ? parsedDate.getFullYear() : today.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(parsedDate ? parsedDate.getMonth() : today.getMonth());

  // Update view when value changes externally
  useEffect(() => {
    if (parsedDate) {
      setViewYear(parsedDate.getFullYear());
      setViewMonth(parsedDate.getMonth());
    }
  }, [value]);

  // Close calendar popover on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Days in selected month
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sunday

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const selected = new Date(viewYear, viewMonth, day);
    const formatted = formatDateStrict(selected);
    onChange(formatted);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setIsOpen(false);
  };

  const handleSetToday = () => {
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    onChange(formatDateStrict(now));
    setIsOpen(false);
  };

  // Generate Year options: 1940 to 2035
  const currentYear = today.getFullYear();
  const years: number[] = [];
  for (let y = currentYear + 5; y >= 1940; y--) {
    years.push(y);
  }

  // Display strictly formatted date string
  const displayValue = parsedDate ? formatDateStrict(parsedDate) : value;

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <input
          id={id}
          name={name}
          type="text"
          readOnly
          disabled={disabled}
          value={displayValue}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          placeholder={placeholder}
          className={`w-full h-10 pl-3 pr-10 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-800 cursor-pointer focus:outline-none focus:border-[#00B074] focus:ring-1 focus:ring-[#00B074] transition-all disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
        />
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00B074] transition-colors p-1"
          title="Open calendar"
        >
          <CalendarIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Popover Calendar Modal */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 z-50 w-[290px] sm:w-[310px] bg-white rounded-2xl shadow-xl border border-gray-200 p-3.5 animate-in fade-in zoom-in-95 duration-150">
          {/* Header Controls: Month & Year dropdowns + Prev/Next buttons */}
          <div className="flex items-center justify-between gap-1 mb-3">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {/* Month Selector */}
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(parseInt(e.target.value, 10))}
                className="h-7 px-1.5 py-0 text-xs font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#00B074] cursor-pointer"
              >
                {MONTH_NAMES.map((m, idx) => (
                  <option key={m} value={idx}>
                    {m}
                  </option>
                ))}
              </select>

              {/* Year Selector */}
              <select
                value={viewYear}
                onChange={(e) => setViewYear(parseInt(e.target.value, 10))}
                className="h-7 px-1.5 py-0 text-xs font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#00B074] cursor-pointer"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <span key={d} className="text-[10px] font-bold text-gray-400 uppercase py-0.5">
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty slots for start offset */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="h-7 w-7" />
            ))}

            {/* Month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const isSelected =
                parsedDate &&
                parsedDate.getFullYear() === viewYear &&
                parsedDate.getMonth() === viewMonth &&
                parsedDate.getDate() === dayNum;

              const isToday =
                today.getFullYear() === viewYear &&
                today.getMonth() === viewMonth &&
                today.getDate() === dayNum;

              return (
                <button
                  key={dayNum}
                  type="button"
                  onClick={() => handleSelectDay(dayNum)}
                  className={`h-7 w-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#00B074] text-white font-bold shadow-xs scale-105"
                      : isToday
                      ? "border border-[#00B074] text-[#00B074] font-bold hover:bg-emerald-50"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          {/* Footer Actions: Clear & Today */}
          <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-gray-100 text-[11px]">
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-red-500 font-medium transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleSetToday}
              className="text-[#00B074] hover:text-[#008f5d] font-bold transition-colors"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
