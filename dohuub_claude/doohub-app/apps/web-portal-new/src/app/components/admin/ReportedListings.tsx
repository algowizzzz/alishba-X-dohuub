import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  X,
  Ban,
  Loader2,
  RefreshCw,
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
import { api } from "../../../services/api";

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

function ReportCard({ report, onReportHandled }: { report: ListingReport; onReportHandled?: (reportId: string) => void }) {
  const navigate = useNavigate();
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<"ignore" | "suspend" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleAction = (action: "ignore" | "suspend") => {
    setActionType(action);
    setShowActionModal(true);
  };

  const confirmAction = async () => {
    setIsLoading(true);
    setFeedback(null);

    try {
      if (actionType === "suspend") {
        await api.updateVendorStatus(report.vendorId, 'SUSPENDED');
        setFeedback({ type: 'success', message: `${report.vendorName} has been suspended` });
      } else {
        // For ignore, we just dismiss the report (no API call needed for demo)
        setFeedback({ type: 'success', message: 'Report ignored' });
      }
      setShowActionModal(false);
      // Remove from list after short delay to show feedback
      setTimeout(() => {
        onReportHandled?.(report.id);
      }, 1500);
    } catch (error: any) {
      console.error('Failed to process action:', error);
      setFeedback({
        type: 'error',
        message: error?.response?.data?.error || error?.message || 'Action failed'
      });
      setShowActionModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`mb-4 p-4 rounded-lg flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-[#D1FAE5] border border-[#10B981] text-[#065F46]'
              : 'bg-[#FEE2E2] border border-[#DC2626] text-[#991B1B]'
          }`}
        >
          <span className="font-medium">{feedback.message}</span>
          <button
            onClick={() => setFeedback(null)}
            className="ml-4 text-current opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 sm:p-6 mb-5 hover:shadow-lg transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#DC2626] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-[#1F2937] mb-1">{report.reportReason}</h3>
              <p className="text-sm text-[#6B7280]">
                Reported {new Date(report.reportedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 pb-4 border-b border-[#E5E7EB]">
          <div>
            <p className="text-xs text-[#6B7280] mb-1">Listing</p>
            <p className="text-sm font-semibold text-[#1F2937]">{report.listingName}</p>
          </div>
          <div>
            <p className="text-xs text-[#6B7280] mb-1">Vendor</p>
            <button
              onClick={() => navigate(`/admin/vendors/${report.vendorId}`)}
              className="text-sm font-semibold text-[#3B82F6] hover:underline"
            >
              {report.vendorName}
            </button>
          </div>
          <div>
            <p className="text-xs text-[#6B7280] mb-1">Reported by</p>
            <p className="text-sm font-semibold text-[#1F2937]">{report.customerName}</p>
          </div>
        </div>

        {/* Report Explanation */}
        <div className="mb-4">
          <p className="text-sm font-semibold text-[#1F2937] mb-2">Explanation:</p>
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] px-4 py-3 rounded-lg">
            <p className="text-sm text-[#4B5563]">{report.reportExplanation}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-[#E5E7EB]">
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
            <Button variant="outline" onClick={() => setShowActionModal(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              className={actionType === "suspend" ? "bg-[#DC2626] hover:bg-[#B91C1C]" : ""}
              onClick={confirmAction}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                actionType === "suspend" ? "Suspend Vendor" : "Ignore Report"
              )}
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch reports from API
  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response: any = await api.getReportedListings();
      const reportsData = Array.isArray(response) ? response : response?.data || [];
      setReports(reportsData.map((r: any) => ({
        id: r.id,
        listingName: r.listingName || r.listing?.title || 'Unknown Listing',
        vendorId: r.vendorId || r.listing?.vendorId || '',
        vendorName: r.vendorName || r.vendor?.businessName || 'Unknown Vendor',
        customerName: r.customerName || r.customer?.name || 'Anonymous',
        reportReason: r.reason || r.reportReason || 'Unspecified',
        reportExplanation: r.explanation || r.reportExplanation || r.description || '',
        reportedAt: r.createdAt || r.reportedAt || new Date().toISOString(),
      })));
    } catch (err: any) {
      console.error('Failed to fetch reports:', err);
      setError(err?.response?.data?.error || 'Failed to load reports. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleReportHandled = (reportId: string) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
  };

  return (
    <div className="min-h-screen bg-white">
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
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1F2937] mb-2">
              Reported Listings
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              Review customer reports and take action
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-[#FEE2E2] border border-[#DC2626] text-[#991B1B] flex items-center justify-between">
              <span className="text-sm font-medium">{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchReports}
                className="ml-4 border-[#DC2626] text-[#DC2626] hover:bg-[#FEE2E2]"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Stats */}
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
                <p className="text-sm font-semibold text-[#1F2937]">
                  {reports.length} {reports.length === 1 ? "Report" : "Reports"} Pending Review
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchReports}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Report Cards */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#E5E7EB] border-t-[#1F2937] rounded-full animate-spin mb-4" />
              <p className="text-[15px] text-[#6B7280]">Loading reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-[#D1D5DB] mx-auto mb-3" />
              <p className="text-[#6B7280]">No reports to review</p>
            </div>
          ) : (
            <div>
              {reports.map((report) => (
                <ReportCard key={report.id} report={report} onReportHandled={handleReportHandled} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}