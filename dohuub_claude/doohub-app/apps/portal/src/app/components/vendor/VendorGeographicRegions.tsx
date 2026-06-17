import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Edit, Trash2, MapPin, Check } from "lucide-react";
import { toast } from "sonner";
import { VendorSidebar } from "./VendorSidebar";
import { VendorTopNav } from "./VendorTopNav";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";

interface Region {
  id: string;
  name: string;
  city: string;
  state: string;
  zipCodes: string[];
  isActive: boolean;
}

export function VendorGeographicRegions() {
  const navigate = useNavigate();
  const { storeId } = useParams();

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

  const storeName = "Your service areas";

  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadRegions = async () => {
    setLoading(true);
    try {
      const res = await api.get<{ success: boolean; data: any[] }>("/api/v1/vendors/me/service-areas");
      const rows = (res?.data || []).map((r: any) => ({
        id: r.id,
        name: r.name,
        city: r.city,
        state: r.state,
        zipCodes: Array.isArray(r.zipCodes) ? r.zipCodes : [],
        isActive: r.isActive,
      }));
      setRegions(rows);
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Failed to load service areas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegions();
  }, []);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingRegion, setEditingRegion] = useState<Region | null>(null);
  const [regionToDelete, setRegionToDelete] = useState<Region | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    state: "",
    zipCodes: "",
    isActive: true,
  });

  const handleOpenDialog = (region?: Region) => {
    if (region) {
      setEditingRegion(region);
      setFormData({
        name: region.name,
        city: region.city,
        state: region.state,
        zipCodes: region.zipCodes.join(", "),
        isActive: region.isActive,
      });
    } else {
      setEditingRegion(null);
      setFormData({
        name: "",
        city: "",
        state: "",
        zipCodes: "",
        isActive: true,
      });
    }
    setDialogOpen(true);
  };

  const handleSaveRegion = async () => {
    const zipCodesArray = formData.zipCodes
      .split(",")
      .map((zip) => zip.trim())
      .filter((zip) => zip !== "");

    if (!formData.name || !formData.city || !formData.state) {
      toast.error("Name, city and state are required");
      return;
    }

    setSaving(true);
    try {
      if (editingRegion) {
        await api.put(`/api/v1/vendors/me/service-areas/${editingRegion.id}`, {
          name: formData.name,
          city: formData.city,
          state: formData.state,
          zipCodes: zipCodesArray,
          isActive: formData.isActive,
        });
        toast.success("Service area updated");
      } else {
        await api.post(`/api/v1/vendors/me/service-areas`, {
          name: formData.name,
          city: formData.city,
          state: formData.state,
          zipCodes: zipCodesArray,
          isActive: formData.isActive,
        });
        toast.success("Service area added");
      }
      setDialogOpen(false);
      setEditingRegion(null);
      setFormData({ name: "", city: "", state: "", zipCodes: "", isActive: true });
      await loadRegions();
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Failed to save service area");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRegion = async () => {
    if (!regionToDelete) return;
    setSaving(true);
    try {
      await api.delete(`/api/v1/vendors/me/service-areas/${regionToDelete.id}`);
      toast.success("Service area removed");
      setDeleteDialogOpen(false);
      setRegionToDelete(null);
      await loadRegions();
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Failed to delete service area");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (region: Region) => {
    try {
      await api.put(`/api/v1/vendors/me/service-areas/${region.id}`, {
        isActive: !region.isActive,
      });
      setRegions((rs) => rs.map((r) => (r.id === region.id ? { ...r, isActive: !r.isActive } : r)));
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Failed to toggle area");
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
        activeMenu="services"
      />

      {/* Main Content */}
      <main
        className={`
          mt-[72px] min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8
          transition-all duration-300
          ${sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[280px]"}
        `}
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(`/vendor/services/${storeId}/listings`)}
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#1A1A2E] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Listings</span>
          </button>

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1A1A2E] mb-2">
                Geographic Regions
              </h1>
              <p className="text-sm sm:text-[15px] text-[#6B7280]">
                Manage service areas for {storeName}
              </p>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Region
            </Button>
          </div>

          {/* Info Alert */}
          <div className="bg-[#F0F9FF] border border-[#C7DDF7] rounded-xl p-4 mb-6">
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-[#1E5DB0] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-[#1E5DB0] mb-1">
                  Service Area Configuration
                </h3>
                <p className="text-sm text-[#1A4791]">
                  Define the geographic regions where you offer services. ZIP codes
                  help customers know if you serve their area.
                </p>
              </div>
            </div>
          </div>

          {/* Regions List */}
          {loading ? (
            <div className="text-center py-16">
              <p className="text-sm text-[#6B7280]">Loading service areas…</p>
            </div>
          ) : regions.length === 0 ? (
            <div className="text-center py-16 bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
              <MapPin className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">
                No regions configured
              </h3>
              <p className="text-sm text-[#6B7280] mb-6">
                Add your first service region to get started
              </p>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Region
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regions.map((region) => (
                <div
                  key={region.id}
                  className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-6 hover:border-[#2E7AD9] hover:shadow-[0_8px_24px_rgba(46,122,217,0.25)] transition-all"
                >
                  {/* Region Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#1A1A2E] mb-1">
                        {region.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#6B7280]" />
                        <span className="text-sm text-[#6B7280]">
                          {region.zipCodes.length} ZIP code
                          {region.zipCodes.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleActive(region)}
                      className={`
                        relative inline-flex h-6 w-11 items-center rounded-full
                        transition-colors focus:outline-none
                        ${region.isActive ? "bg-[#2E7AD9]" : "bg-[rgba(46, 122, 217, 0.12)]"}
                      `}
                    >
                      <span
                        className={`
                          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                          ${region.isActive ? "translate-x-6" : "translate-x-1"}
                        `}
                      />
                    </button>
                  </div>

                  {/* ZIP Codes */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-[#6B7280] uppercase mb-2">
                      ZIP Codes
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {region.zipCodes.map((zip) => (
                        <span
                          key={zip}
                          className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-[#F0F7FF] text-[#1A1A2E]"
                        >
                          {zip}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${
                        region.isActive
                          ? "bg-[#D1FAE5] text-[#065F46]"
                          : "bg-[#F0F7FF] text-[#6B7280]"
                      }`}
                    >
                      {region.isActive ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Active
                        </>
                      ) : (
                        "Inactive"
                      )}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleOpenDialog(region)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setRegionToDelete(region);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-[#DC2626]" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Region Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingRegion ? "Edit Region" : "Add New Region"}
            </DialogTitle>
            <DialogDescription>
              {editingRegion
                ? "Update the region details below"
                : "Define a new service region"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Region Name */}
            <div>
              <Label htmlFor="region-name" className="mb-1.5">
                Region Name <span className="text-[#DC2626]">*</span>
              </Label>
              <Input
                id="region-name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Downtown San Francisco"
              />
            </div>

            {/* City / State */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="region-city" className="mb-1.5">
                  City <span className="text-[#DC2626]">*</span>
                </Label>
                <Input
                  id="region-city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                  placeholder="San Francisco"
                />
              </div>
              <div>
                <Label htmlFor="region-state" className="mb-1.5">
                  State <span className="text-[#DC2626]">*</span>
                </Label>
                <Input
                  id="region-state"
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                  placeholder="CA"
                />
              </div>
            </div>

            {/* ZIP Codes */}
            <div>
              <Label htmlFor="zip-codes" className="mb-1.5">
                ZIP Codes
              </Label>
              <Input
                id="zip-codes"
                type="text"
                value={formData.zipCodes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, zipCodes: e.target.value }))
                }
                placeholder="e.g., 94102, 94103, 94104"
              />
              <p className="text-xs text-[#6B7280] mt-1">
                Separate multiple ZIP codes with commas
              </p>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between p-4 bg-white rounded-xl">
              <div>
                <p className="text-sm font-semibold text-[#1A1A2E] mb-1">
                  Active Status
                </p>
                <p className="text-xs text-[#6B7280]">
                  Enable this region for service availability
                </p>
              </div>
              <button
                onClick={() =>
                  setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))
                }
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full
                  transition-colors focus:outline-none
                  ${formData.isActive ? "bg-[#2E7AD9]" : "bg-[rgba(46, 122, 217, 0.12)]"}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${formData.isActive ? "translate-x-6" : "translate-x-1"}
                  `}
                />
              </button>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setEditingRegion(null);
                setFormData({ name: "", city: "", state: "", zipCodes: "", isActive: true });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveRegion}
              disabled={saving || !formData.name || !formData.city || !formData.state}
            >
              {saving ? "Saving…" : editingRegion ? "Save Changes" : "Add Region"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Region</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{regionToDelete?.name}"? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setRegionToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteRegion}
              className="bg-[#DC2626] hover:bg-[#B91C1C]"
            >
              Delete Region
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}