import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  X,
  Ban,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { AdminSidebarRetractable } from "./AdminSidebarRetractable";
import { AdminTopNav } from "./AdminTopNav";
import api from "../../../services/api";

interface ListingReport {
  id: string;
  listingName: string;
  vendorId: string;
  vendorName: string;
  customerName: string;
  reportReason: string;
  reportExplanation: string;
  reportedAt: string;
}

// Mock data - Only listing reports
const mockReports: ListingReport[] = [
  {
    id: "1",
    listingName: "Deep Cleaning Service",
    vendorId: "V001",
    vendorName: "CleanCo Services",
    customerName: "John D.",
    reportReason: "Service Not As Described",
    reportExplanation:
      "Service advertised as 3-hour deep clean. Vendor left after 90 minutes, many areas not cleaned as promised. When questioned, claimed 3 hours is 'maximum' not standard. Very disappointed.",
    reportedAt: "2026-01-03",
  },
  {
    id: "2",
    listingName: "Professional Plumbing Repair",
    vendorId: "V002",
    vendorName: "QuickFix Pro",
    customerName: "Maria S.",
    reportReason: "Safety Concerns",
    reportExplanation:
      "The vendor did not follow proper safety protocols. No protective equipment was used and water was left running after the job, causing minor flooding in my basement.",
    reportedAt: "2026-01-02",
  },
  {
    id: "3",
    listingName: "Home Beauty Services",
    vendorId: "V003",
    vendorName: "Glam Squad Mobile",
    customerName: "Sarah K.",
    reportReason: "Misleading Pricing",
    reportExplanation:
      "Listing showed $50 for haircut but was charged $120 at completion. Hidden fees were not disclosed upfront. This is deceptive pricing.",
    reportedAt: "2025-12-28",
  },
];

function ReportCard({ report, onResolved }: { report: ListingReport; onResolved: (id: string) => void }) {
  const navigate = useNavigate();
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<"ignore" | "suspend" | null>(null);
  const [busy, setBusy] = useState(false);

  const handleAction = (action: "ignore" | "suspend") => {
    setActionType(action);
    setShowActionModal(true);
  };

  const confirmAction = async () => {
    setBusy(true);
    try {
      if (actionType === "suspend" && report.vendorId) {
        await api.patch(`/api/v1/admin/vendors/${report.vendorId}/status`, { status: "SUSPENDED" });
      }
      // Mark the report as reviewed/dismissed in either case
      await api.patch(`/api/v1/admin/reports/${report.id}/status`, {
        status: "REVIEWED",
        resolution: actionType === "suspend" ? `Vendor suspended` : `Report dismissed`,
      });
      onResolved(report.id);
    } catch (e: any) {
      toast.error(e?.response?.data?.error || e?.message || "Failed to apply action");
    } finally {
      setBusy(false);
      setShowActionModal(false);
    }
  };

  return (
    <>
      <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-5 sm:p-6 mb-5 hover:shadow-[0_8px_24px_rgba(46,122,217,0.25)] transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#DC2626] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-[#1A1A2E] mb-1">{report.reportReason}</h3>
              <p className="text-sm text-[#6B7280]">
                Reported {new Date(report.reportedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 pb-4 border-b border-[rgba(46,122,217,0.25)]">
          <div>
            <p className="text-xs text-[#6B7280] mb-1">Listing</p>
            <p className="text-sm font-semibold text-[#1A1A2E]">{report.listingName}</p>
          </div>
          <div>
            <p className="text-xs text-[#6B7280] mb-1">Vendor</p>
            <button
              onClick={() => navigate(`/admin/vendors/${report.vendorId}`)}
              className="text-sm font-semibold text-[#2E7AD9] hover:underline"
            >
              {report.vendorName}
            </button>
          </div>
          <div>
            <p className="text-xs text-[#6B7280] mb-1">Reported by</p>
            <p className="text-sm font-semibold text-[#1A1A2E]">{report.customerName}</p>
          </div>
        </div>

        {/* Report Explanation */}
        <div className="mb-4">
          <p className="text-sm font-semibold text-[#1A1A2E] mb-2">Explanation:</p>
          <div className="bg-white border border-[rgba(46,122,217,0.25)] px-4 py-3 rounded-lg shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            <p className="text-sm text-[#4B5563]">{report.reportExplanation}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-[rgba(46,122,217,0.25)]">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleAction("ignore")}
          >
            <X className="w-4 h-4 mr-2" />
            Ignore
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-[#DC2626] border-[#FECACA]"
            onClick={() => handleAction("suspend")}
          >
            <Ban className="w-4 h-4 mr-2" />
            Suspend Vendor
          </Button>
        </div>
      </div>

      {/* Action Confirmation Modal */}
      <Dialog open={showActionModal} onOpenChange={setShowActionModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "suspend" ? "Suspend Vendor?" : "Ignore Report?"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "suspend"
                ? `This will suspend ${report.vendorName}'s account. All their listings will be hidden and they won't be able to accept new bookings.`
                : "This will dismiss the report and no action will be taken."}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActionModal(false)}>
              Cancel
            </Button>
            <Button
              className={actionType === "suspend" ? "bg-[#DC2626] hover:bg-[#B91C1C]" : ""}
              disabled={busy}
              onClick={confirmAction}
            >
              {busy ? "Working..." : actionType === "suspend" ? "Suspend Vendor" : "Ignore Report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function ReportedListings() {
  // Sidebar state
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

  const [reports, setReports] = useState<ListingReport[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ success: boolean; data: any[] }>("/api/v1/admin/reports?status=PENDING&limit=100")
      .then((r) => {
        const data = (r as any)?.data || [];
        const mapped: ListingReport[] = data.map((rep: any) => ({
          id: rep.id,
          listingName: rep.targetTitle || rep.listingName || rep.targetType || "Listing",
          vendorId: rep.vendorId || rep.targetId || "",
          vendorName: rep.vendorName || rep.targetVendorName || "Unknown vendor",
          customerName:
            rep.user?.profile?.firstName
              ? `${rep.user.profile.firstName} ${rep.user.profile.lastName?.[0] || ""}.`
              : rep.user?.email?.split("@")[0] || "Customer",
          reportReason: rep.reason || rep.type || "Report",
          reportExplanation: rep.description || rep.details || "No additional details provided.",
          reportedAt: rep.createdAt || new Date().toISOString(),
        }));
        setReports(mapped.length > 0 ? mapped : []);
      })
      .catch(() => setReports([]))
      .finally(() => setReportsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      <AdminTopNav onMenuClick={handleSidebarToggle} />
      <AdminSidebarRetractable
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        activeMenu="moderation"
      />

      {/* Main Content */}
      <main
        className={`
          pt-[72px] min-h-screen transition-all duration-300
          ${sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-[280px]"}
        `}
      >
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1A1A2E] mb-2">
              Reported Listings
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              Review customer reports and take action
            </p>
          </div>

          {/* Stats */}
          <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-4 mb-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
              <p className="text-sm font-semibold text-[#1A1A2E]">
                {reports.length} {reports.length === 1 ? "Report" : "Reports"} Pending Review
              </p>
            </div>
          </div>

          {/* Report Cards */}
          {reports.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-[rgba(46, 122, 217, 0.18)] mx-auto mb-3" />
              <p className="text-[#6B7280]">No reports to review</p>
            </div>
          ) : (
            <div>
              {reports.map((report) => (
                <ReportCard key={report.id} report={report} onResolved={(id) => setReports((prev) => prev.filter((r) => r.id !== id))} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}