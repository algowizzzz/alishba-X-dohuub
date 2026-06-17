import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { VendorSidebar } from "./VendorSidebar";
import { VendorTopNav } from "./VendorTopNav";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import api from "../../../services/api";

interface DaySchedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

const DAYS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

const DEFAULT_SCHEDULE: DaySchedule[] = DAYS.map((d) => ({
  dayOfWeek: d.value,
  startTime: "09:00",
  endTime: "17:00",
  // Default: weekdays available, weekends off.
  isAvailable: d.value !== 0 && d.value !== 6,
}));

export function VendorAvailability() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1024 ? false : true
  );

  const handleSidebarToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const [schedule, setSchedule] = useState<DaySchedule[]>(DEFAULT_SCHEDULE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<{ success: boolean; data: any[] }>(
          "/api/v1/vendors/me/availability"
        );
        const rows = res?.data || [];
        if (rows.length > 0) {
          // Merge server rows over defaults so missing days fall back to default 9–5.
          const merged = DEFAULT_SCHEDULE.map((d) => {
            const found = rows.find((r) => r.dayOfWeek === d.dayOfWeek);
            return found
              ? {
                  dayOfWeek: d.dayOfWeek,
                  startTime: found.startTime,
                  endTime: found.endTime,
                  isAvailable: found.isAvailable,
                }
              : d;
          });
          setSchedule(merged);
        }
      } catch (e: any) {
        toast.error(e?.response?.data?.error || "Failed to load availability");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateDay = (dayOfWeek: number, patch: Partial<DaySchedule>) => {
    setSchedule((prev) =>
      prev.map((d) => (d.dayOfWeek === dayOfWeek ? { ...d, ...patch } : d))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/api/v1/vendors/me/availability", { schedule });
      toast.success("Availability saved");
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Failed to save availability");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      <VendorTopNav onMenuClick={handleSidebarToggle} />
      <VendorSidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => {
          if (typeof window !== "undefined" && window.innerWidth >= 1024) {
            setSidebarCollapsed(!sidebarCollapsed);
          } else {
            setSidebarOpen(false);
          }
        }}
        activeMenu="availability"
      />

      <main
        className={`
          mt-[72px] min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8
          transition-all duration-300
          ${sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[280px]"}
        `}
      >
        <div className="max-w-[900px] mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#1A1A2E] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1A1A2E] mb-2">
              Working Hours
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              Set the days and times you accept bookings. Customers won't be able to
              book outside these hours.
            </p>
          </div>

          <div className="bg-[#F0F9FF] border border-[#C7DDF7] rounded-xl p-4 mb-6">
            <div className="flex gap-3">
              <Clock className="w-5 h-5 text-[#1E5DB0] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-[#1E5DB0] mb-1">
                  Per-day schedule
                </h3>
                <p className="text-sm text-[#1A4791]">
                  Toggle a day off to pause bookings on that day without removing the
                  hours.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            {loading ? (
              <p className="text-center text-sm text-[#6B7280] py-8">Loading…</p>
            ) : (
              <div className="space-y-4">
                {schedule.map((day) => {
                  const dayLabel = DAYS.find((d) => d.value === day.dayOfWeek)?.label;
                  return (
                    <div
                      key={day.dayOfWeek}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border border-[rgba(46,122,217,0.15)] rounded-xl"
                    >
                      <div className="flex items-center gap-3 sm:w-[180px]">
                        <Calendar className="w-4 h-4 text-[#6B7280]" />
                        <span className="text-sm font-semibold text-[#1A1A2E]">
                          {dayLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        <div className="flex-1">
                          <Label className="text-xs">Start</Label>
                          <Input
                            type="time"
                            value={day.startTime}
                            onChange={(e) =>
                              updateDay(day.dayOfWeek, { startTime: e.target.value })
                            }
                            disabled={!day.isAvailable}
                          />
                        </div>
                        <div className="flex-1">
                          <Label className="text-xs">End</Label>
                          <Input
                            type="time"
                            value={day.endTime}
                            onChange={(e) =>
                              updateDay(day.dayOfWeek, { endTime: e.target.value })
                            }
                            disabled={!day.isAvailable}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          updateDay(day.dayOfWeek, { isAvailable: !day.isAvailable })
                        }
                        className={`
                          relative inline-flex h-6 w-11 items-center rounded-full
                          transition-colors focus:outline-none
                          ${day.isAvailable ? "bg-[#2E7AD9]" : "bg-[rgba(46,122,217,0.12)]"}
                        `}
                      >
                        <span
                          className={`
                            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                            ${day.isAvailable ? "translate-x-6" : "translate-x-1"}
                          `}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving || loading}>
                {saving ? "Saving…" : "Save Schedule"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
