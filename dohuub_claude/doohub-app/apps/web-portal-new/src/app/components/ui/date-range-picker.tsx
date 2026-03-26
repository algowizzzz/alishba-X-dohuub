import { useState } from "react";
import { Calendar, X } from "lucide-react";
import { DayPicker, DateRange } from "react-day-picker";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import "react-day-picker/dist/style.css";
import { Button } from "./button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";

interface DateRangePickerProps {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePresetClick = (preset: string) => {
    const today = new Date();
    let range: DateRange | undefined;

    switch (preset) {
      case "today":
        range = { from: today, to: today };
        break;
      case "last7":
        range = { from: subDays(today, 6), to: today };
        break;
      case "last30":
        range = { from: subDays(today, 29), to: today };
        break;
      case "thisMonth":
        range = { from: startOfMonth(today), to: endOfMonth(today) };
        break;
    }

    onChange(range);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(undefined);
    setIsOpen(false);
  };

  const formatDateRange = () => {
    if (!value?.from) return "Select date range";
    if (!value.to) return format(value.from, "MMM d, yyyy");
    return `${format(value.from, "MMM d, yyyy")} - ${format(value.to, "MMM d, yyyy")}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={`
            w-full h-[44px] px-3 
            flex items-center justify-between gap-2
            border border-[#E5E7EB] rounded-[10px]
            bg-white
            text-sm text-left
            transition-colors
            hover:border-[#9CA3AF]
            focus:outline-none focus:ring-2 focus:ring-[#1F2937] focus:ring-offset-2
            ${value?.from ? "text-[#1F2937]" : "text-[#9CA3AF]"}
          `}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Calendar className="w-4 h-4 text-[#6B7280] shrink-0" />
            <span className="truncate">{formatDateRange()}</span>
          </div>
          {value?.from && (
            <X
              className="w-4 h-4 text-[#6B7280] hover:text-[#1F2937] shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
            />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col sm:flex-row">
          {/* Quick Presets */}
          <div className="p-4 border-b sm:border-b-0 sm:border-r border-[#E5E7EB]">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#6B7280] mb-3">
                Quick Select
              </p>
              <button
                onClick={() => handlePresetClick("today")}
                className="w-full text-left px-3 py-2 text-sm text-[#1F2937] hover:bg-[#F3F4F6] rounded-lg transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => handlePresetClick("last7")}
                className="w-full text-left px-3 py-2 text-sm text-[#1F2937] hover:bg-[#F3F4F6] rounded-lg transition-colors"
              >
                Last 7 days
              </button>
              <button
                onClick={() => handlePresetClick("last30")}
                className="w-full text-left px-3 py-2 text-sm text-[#1F2937] hover:bg-[#F3F4F6] rounded-lg transition-colors"
              >
                Last 30 days
              </button>
              <button
                onClick={() => handlePresetClick("thisMonth")}
                className="w-full text-left px-3 py-2 text-sm text-[#1F2937] hover:bg-[#F3F4F6] rounded-lg transition-colors"
              >
                This month
              </button>
            </div>
          </div>

          {/* Calendar */}
          <div className="p-4 min-w-[320px]">
            <style>{`
              .rdp {
                --rdp-cell-size: 40px;
                --rdp-accent-color: #1F2937;
                --rdp-background-color: #F3F4F6;
                margin: 0;
              }
              .rdp-months {
                justify-content: center;
              }
              .rdp-month {
                width: 100%;
              }
              .rdp-caption {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 0;
                margin-bottom: 16px;
                position: relative;
              }
              .rdp-caption_label {
                font-size: 14px;
                font-weight: 600;
                color: #1F2937;
              }
              .rdp-nav {
                position: absolute;
                display: flex;
                gap: 4px;
              }
              .rdp-nav_button_previous {
                left: 0;
              }
              .rdp-nav_button_next {
                right: 0;
              }
              .rdp-nav_button {
                width: 32px;
                height: 32px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 150ms;
              }
              .rdp-nav_button:hover {
                background-color: #F3F4F6;
              }
              .rdp-head_cell {
                font-size: 12px;
                font-weight: 600;
                color: #6B7280;
                text-transform: uppercase;
                padding: 8px 0;
              }
              .rdp-cell {
                padding: 2px;
              }
              .rdp-day {
                width: 40px;
                height: 40px;
                border-radius: 8px;
                font-size: 14px;
                transition: background-color 150ms;
              }
              .rdp-day:hover:not(.rdp-day_selected):not(.rdp-day_disabled) {
                background-color: #F3F4F6;
              }
              .rdp-day_selected {
                background-color: #1F2937 !important;
                color: white;
              }
              .rdp-day_selected:hover {
                background-color: #111827 !important;
              }
              .rdp-day_today {
                font-weight: 600;
              }
              .rdp-day_disabled {
                opacity: 0.3;
              }
              .rdp-day_range_middle {
                background-color: #F3F4F6;
                border-radius: 0;
              }
              .rdp-day_range_start {
                border-radius: 8px 0 0 8px;
              }
              .rdp-day_range_end {
                border-radius: 0 8px 8px 0;
              }
              .rdp-day_range_start.rdp-day_range_end {
                border-radius: 8px;
              }
            `}</style>
            <DayPicker
              mode="range"
              selected={value}
              onSelect={onChange}
              numberOfMonths={1}
              disabled={{ after: new Date() }}
            />
            <div className="flex gap-2 mt-4 pt-4 border-t border-[#E5E7EB]">
              <Button
                onClick={handleClear}
                variant="outline"
                className="flex-1"
              >
                Clear
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-[#1F2937] hover:bg-[#111827] text-white"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}