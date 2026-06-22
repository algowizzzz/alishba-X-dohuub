import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../../../services/api";
import { Input } from "../ui/input";
import {
  ArrowLeft,
  Plus,
  Globe,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Eye,
  Edit,
  ToggleLeft,
  ChevronDown,
  X,
  TrendingUp,
  TrendingDown,
  Check,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { AdminSidebarRetractable } from "./AdminSidebarRetractable";
import { AdminTopNav } from "./AdminTopNav";

interface Region {
  id: string;
  name: string;
  countryCode: string;
  countryName: string;
  countryFlag: string;
  isActive: boolean;
  activeProfiles: number;
  totalProfiles: number;
  profiles: {
    id: string;
    name: string;
    category: string;
    isActive: boolean;
    listingsCount: number;
  }[];
  performance: {
    bookings: number;
    bookingsTrend: number;
    revenue: number;
    revenueTrend: number;
    customers: number;
  };
  notes: string;
}

interface Country {
  code: string;
  name: string;
  flag: string;
  regions: Region[];
}

// Mock data
const mockRegions: Region[] = [
  {
    id: "1",
    name: "New York, NY",
    countryCode: "US",
    countryName: "United States",
    countryFlag: "🇺🇸",
    isActive: true,
    activeProfiles: 3,
    totalProfiles: 6,
    profiles: [
      { id: "1", name: "Sparkle Clean by Michelle", category: "Cleaning Services", isActive: true, listingsCount: 8 },
      { id: "2", name: "Beauty by Michelle", category: "Beauty Services", isActive: true, listingsCount: 12 },
      { id: "3", name: "Michelle's Rentals", category: "Rental Properties", isActive: true, listingsCount: 5 },
      { id: "4", name: "Fix-It Pro Services", category: "Handyman Services", isActive: false, listingsCount: 0 },
      { id: "5", name: "Michelle's Grocery Hub", category: "Grocery", isActive: false, listingsCount: 0 },
      { id: "6", name: "Caring Hands Caregiving", category: "Caregiving Services", isActive: false, listingsCount: 0 },
    ],
    performance: {
      bookings: 234,
      bookingsTrend: 15,
      revenue: 12450,
      revenueTrend: 12,
      customers: 189,
    },
    notes: "High-performing region with strong demand for cleaning and beauty services.",
  },
  {
    id: "2",
    name: "Los Angeles, CA",
    countryCode: "US",
    countryName: "United States",
    countryFlag: "🇺🇸",
    isActive: true,
    activeProfiles: 2,
    totalProfiles: 6,
    profiles: [
      { id: "1", name: "Sparkle Clean by Michelle", category: "Cleaning Services", isActive: true, listingsCount: 6 },
      { id: "2", name: "Beauty by Michelle", category: "Beauty Services", isActive: true, listingsCount: 9 },
      { id: "3", name: "Michelle's Rentals", category: "Rental Properties", isActive: false, listingsCount: 0 },
      { id: "4", name: "Fix-It Pro Services", category: "Handyman Services", isActive: false, listingsCount: 0 },
      { id: "5", name: "Michelle's Grocery Hub", category: "Grocery", isActive: false, listingsCount: 0 },
      { id: "6", name: "Caring Hands Caregiving", category: "Caregiving Services", isActive: false, listingsCount: 0 },
    ],
    performance: {
      bookings: 156,
      bookingsTrend: 8,
      revenue: 8920,
      revenueTrend: 5,
      customers: 124,
    },
    notes: "",
  },
  {
    id: "3",
    name: "Chicago, IL",
    countryCode: "US",
    countryName: "United States",
    countryFlag: "🇺🇸",
    isActive: false,
    activeProfiles: 0,
    totalProfiles: 6,
    profiles: [
      { id: "1", name: "Sparkle Clean by Michelle", category: "Cleaning Services", isActive: false, listingsCount: 0 },
      { id: "2", name: "Beauty by Michelle", category: "Beauty Services", isActive: false, listingsCount: 0 },
      { id: "3", name: "Michelle's Rentals", category: "Rental Properties", isActive: false, listingsCount: 0 },
      { id: "4", name: "Fix-It Pro Services", category: "Handyman Services", isActive: false, listingsCount: 0 },
      { id: "5", name: "Michelle's Grocery Hub", category: "Grocery", isActive: false, listingsCount: 0 },
      { id: "6", name: "Caring Hands Caregiving", category: "Caregiving Services", isActive: false, listingsCount: 0 },
    ],
    performance: {
      bookings: 0,
      bookingsTrend: 0,
      revenue: 0,
      revenueTrend: 0,
      customers: 0,
    },
    notes: "",
  },
];

export function GeographicRegions() {
  const navigate = useNavigate();
  
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== 'undefined' && window.innerWidth >= 1024 ? false : true
  );

  const handleSidebarToggle = () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  // State
  const [regions, setRegions] = useState<Region[]>([]);
  const [regionsLoading, setRegionsLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ success: boolean; data: any[] }>("/api/v1/admin/regions?limit=200")
      .then((r) => {
        const data = (r as any)?.data || [];
        const mapped: Region[] = data.map((rg: any) => ({
          id: rg.id,
          name: `${rg.city || rg.name}${rg.state || rg.province ? `, ${rg.state || rg.province}` : ""}`,
          countryCode: rg.countryCode || (rg.country === "Canada" ? "CA" : "US"),
          countryName: rg.country || "United States",
          countryFlag: rg.country === "Canada" ? "🇨🇦" : "🇺🇸",
          isActive: rg.isActive ?? true,
          activeProfiles: rg._count?.storeRegions ?? 0,
          totalProfiles: rg._count?.storeRegions ?? 0,
          profiles: [],
          performance: {
            bookings: 0,
            bookingsTrend: 0,
            revenue: 0,
            revenueTrend: 0,
            customers: 0,
          },
          notes: "",
        }));
        setRegions(mapped);
      })
      .catch(() => setRegions([]))
      .finally(() => setRegionsLoading(false));
  }, []);
  const [filter, setFilter] = useState("all");
  const [groupBy, setGroupBy] = useState("country");
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedNotes, setEditedNotes] = useState("");

  // Group regions by country
  const groupedRegions: Country[] = [];
  if (groupBy === "country") {
    const countryMap = new Map<string, Region[]>();
    
    regions
      .filter(region => {
        if (filter === "all") return true;
        if (filter === "active") return region.isActive;
        if (filter === "inactive") return !region.isActive;
        if (filter === "high") return region.performance.bookings > 100;
        if (filter === "low") return region.performance.bookings < 50 && region.performance.bookings > 0;
        return true;
      })
      .forEach(region => {
        if (!countryMap.has(region.countryCode)) {
          countryMap.set(region.countryCode, []);
        }
        countryMap.get(region.countryCode)?.push(region);
      });

    countryMap.forEach((regionsList, countryCode) => {
      const firstRegion = regionsList[0];
      groupedRegions.push({
        code: countryCode,
        name: firstRegion.countryName,
        flag: firstRegion.countryFlag,
        regions: regionsList,
      });
    });
  }

  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState<{ name: string; city: string; state: string; province: string; country: string; countryCode: string; isActive: boolean }>({
    name: "", city: "", state: "", province: "", country: "USA", countryCode: "US", isActive: true,
  });
  const [addBusy, setAddBusy] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  const handleToggleRegion = async (regionId: string) => {
    const region = regions.find((r) => r.id === regionId);
    if (!region) return;
    const next = !region.isActive;
    setRegions(regions.map(r => r.id === regionId ? { ...r, isActive: next } : r));
    try {
      await api.put(`/api/v1/admin/regions/${regionId}`, { isActive: next });
      toast.success(next ? "Region activated" : "Region paused");
    } catch (e: any) {
      setRegions(regions.map(r => r.id === regionId ? { ...r, isActive: !next } : r));
      toast.error(e?.response?.data?.error || e?.message || "Failed to toggle region");
    }
  };

  const handleViewDetails = (region: Region) => {
    setSelectedRegion(region);
    setEditedNotes(region.notes);
    setShowDetailModal(true);
  };

  const handleEditRegion = (region: Region) => {
    setSelectedRegion(region);
    setShowEditModal(true);
  };

  const handleSaveNotes = async () => {
    if (!selectedRegion) return;
    setSavingNotes(true);
    try {
      await api.put(`/api/v1/admin/regions/${selectedRegion.id}`, { notes: editedNotes });
      setRegions(regions.map(r => r.id === selectedRegion.id ? { ...r, notes: editedNotes } : r));
      toast.success("Notes saved");
      setShowDetailModal(false);
    } catch (e: any) {
      toast.error(e?.response?.data?.error || e?.message || "Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  };

  const handleToggleProfileInRegion = (profileId: string) => {
    if (selectedRegion) {
      const updatedProfiles = selectedRegion.profiles.map(p =>
        p.id === profileId ? { ...p, isActive: !p.isActive } : p
      );
      setSelectedRegion({ ...selectedRegion, profiles: updatedProfiles });
    }
  };

  const handleSaveRegionEdit = async () => {
    if (!selectedRegion) return;
    setSavingEdit(true);
    try {
      await api.put(`/api/v1/admin/regions/${selectedRegion.id}`, {
        name: selectedRegion.name,
        isActive: selectedRegion.isActive,
      });
      setRegions(regions.map(r => r.id === selectedRegion.id ? selectedRegion : r));
      toast.success("Region updated");
      setShowEditModal(false);
    } catch (e: any) {
      toast.error(e?.response?.data?.error || e?.message || "Failed to update region");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleAddRegion = async () => {
    if (!addForm.name.trim() || !addForm.city.trim() || !addForm.country.trim()) {
      toast.error("name, city, and country are required");
      return;
    }
    setAddBusy(true);
    try {
      const res: any = await api.post("/api/v1/admin/regions", addForm);
      const created = res?.data;
      if (created) {
        const profilesList: any[] = [];
        const profilesCount = 0;
        const activeProfiles = 0;
        const totalProfiles = 0;
        setRegions((arr) => [
          ...arr,
          {
            id: created.id,
            name: created.name,
            city: created.city,
            state: created.state,
            province: created.province,
            country: created.country,
            countryCode: created.countryCode,
            countryFlag: created.countryCode === "US" ? "🇺🇸" : created.countryCode === "CA" ? "🇨🇦" : "🌐",
            isActive: created.isActive,
            notes: created.notes || "",
            profiles: profilesList,
            profilesCount,
            activeProfiles,
            totalProfiles,
            bookings: 0,
            revenue: 0,
            customers: 0,
            avgBookingValue: 0,
            avgRating: 0,
            totalReviews: 0,
            growth: 0,
          } as any,
        ]);
      }
      toast.success("Region added");
      setShowAddModal(false);
      setAddForm({ name: "", city: "", state: "", province: "", country: "USA", countryCode: "US", isActive: true });
    } catch (e: any) {
      toast.error(e?.response?.data?.error || e?.message || "Failed to add region");
    } finally {
      setAddBusy(false);
    }
  };

  const handleBulkActivate = async (countryCode: string, isActive: boolean) => {
    const ids = regions.filter((r) => r.countryCode === countryCode).map((r) => r.id);
    if (ids.length === 0) return;
    try {
      await api.patch("/api/v1/admin/regions/bulk", { ids, isActive });
      setRegions(regions.map((r) => (r.countryCode === countryCode ? { ...r, isActive } : r)));
      toast.success(isActive ? `Activated ${ids.length} regions` : `Deactivated ${ids.length} regions`);
    } catch (e: any) {
      toast.error(e?.response?.data?.error || e?.message || "Failed to bulk update");
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      <AdminTopNav onMenuClick={handleSidebarToggle} />
      <AdminSidebarRetractable
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        activeMenu="michelle"
      />

      {/* Main Content */}
      <main
        className={`
          mt-[72px] min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8
          transition-all duration-300
          ${sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[280px]'}
        `}
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Back Navigation */}
          <Link
            to="/admin/michelle-profiles"
            className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1A1A2E] hover:underline mb-4 sm:mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Stores</span>
            <span className="sm:hidden">Back</span>
          </Link>

          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1A1A2E] mb-2">
              <span className="hidden sm:inline">Geographic Coverage Management</span>
              <span className="sm:hidden">Geographic Coverage</span>
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280] hidden sm:block">
              Manage regions where Michelle's profiles operate
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6 sm:mb-8">
            <Button
              className="h-12 bg-[#2E7AD9] hover:bg-[#1E5DB0] text-white font-semibold"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-[18px] h-[18px] mr-2" />
              <Globe className="w-[18px] h-[18px] mr-2" />
              Add New Region
            </Button>

            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="h-12 w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                  <SelectItem value="high">High Performance</SelectItem>
                  <SelectItem value="low">Low Performance</SelectItem>
                </SelectContent>
              </Select>

              <Select value={groupBy} onValueChange={setGroupBy}>
                <SelectTrigger className="h-12 w-full sm:w-[200px]">
                  <SelectValue placeholder="Group by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="country">By Country</SelectItem>
                  <SelectItem value="profile">By Profile</SelectItem>
                  <SelectItem value="performance">By Performance</SelectItem>
                  <SelectItem value="alphabetical">Alphabetically</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Regions List */}
          <div className="space-y-4 sm:space-y-5">
            {groupedRegions.map((country) => (
              <div key={country.code}>
                {/* Country Header */}
                <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-lg px-4 sm:px-6 py-3 sm:py-4 mb-3 sm:mb-4 flex items-center justify-between shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-2xl sm:text-[32px]">{country.flag}</span>
                    <div>
                      <h2 className="text-base sm:text-lg lg:text-xl font-bold text-[#1A1A2E]">
                        {country.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#6B7280]">
                        {country.regions.length} {country.regions.length === 1 ? 'region' : 'regions'}
                      </p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="h-9 px-3 text-sm">
                        Manage All
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleBulkActivate(country.code, true)}>Activate All Regions</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkActivate(country.code, false)}>Deactivate All Regions</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Region Cards */}
                <div className="space-y-4 sm:space-y-5 sm:ml-8">
                  {country.regions.map((region) => (
                    <div
                      key={region.id}
                      className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-5 sm:p-6 lg:p-7 hover:border-[#2E7AD9] hover:shadow-[0_6px_16px_rgba(46,122,217,0.22)] transition-all"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-5 sm:mb-6">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[#6B7280] flex-shrink-0" />
                          <h3 className="text-base sm:text-lg font-bold text-[#1A1A2E] truncate">
                            {region.name}
                          </h3>
                        </div>
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3 ml-3">
                          <span className="text-xs sm:text-sm text-[#6B7280] whitespace-nowrap">
                            {region.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <Switch
                            checked={region.isActive}
                            onCheckedChange={() => handleToggleRegion(region.id)}
                          />
                        </div>
                      </div>

                      {/* Active Profiles */}
                      <div className="mb-5">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-semibold text-[#1A1A2E]">Active Profiles:</p>
                          <p className="text-sm text-[#6B7280]">
                            {region.activeProfiles} of {region.totalProfiles}
                          </p>
                        </div>
                        <div className="space-y-2">
                          {region.profiles.filter(p => p.isActive).map((profile) => (
                            <div key={profile.id} className="flex items-center gap-2 text-sm">
                              <span className="text-[#6B7280]">•</span>
                              <span className="text-[#1A1A2E] flex-1 min-w-0">
                                {profile.name}
                                <span className="text-[#6B7280] ml-1">
                                  ({profile.category})
                                </span>
                              </span>
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                                <span className="text-xs text-[#10B981] hidden sm:inline">Active</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="border-t border-[rgba(46,122,217,0.25)] pt-5">
                        <p className="text-sm font-semibold text-[#1A1A2E] mb-4">
                          Performance (This Month):
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                          {/* Bookings */}
                          <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-[#6B7280] flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs text-[#6B7280] mb-1">Bookings</p>
                              <p className="text-xl font-bold text-[#1A1A2E]">
                                {region.performance.bookings}
                              </p>
                            </div>
                          </div>

                          {/* Revenue */}
                          <div className="flex items-start gap-3">
                            <DollarSign className="w-5 h-5 text-[#6B7280] flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs text-[#6B7280] mb-1">Revenue</p>
                              <p className="text-xl font-bold text-[#1A1A2E]">
                                ${region.performance.revenue.toLocaleString()}
                              </p>
                              {region.performance.revenueTrend !== 0 && (
                                <div className="flex items-center gap-1 mt-1">
                                  {region.performance.revenueTrend > 0 ? (
                                    <TrendingUp className="w-3 h-3 text-[#10B981]" />
                                  ) : (
                                    <TrendingDown className="w-3 h-3 text-[#DC2626]" />
                                  )}
                                  <span className={`text-xs ${region.performance.revenueTrend > 0 ? 'text-[#10B981]' : 'text-[#DC2626]'}`}>
                                    {Math.abs(region.performance.revenueTrend)}%
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Customers */}
                          <div className="flex items-start gap-3">
                            <Users className="w-5 h-5 text-[#6B7280] flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs text-[#6B7280] mb-1">Customers</p>
                              <p className="text-xl font-bold text-[#1A1A2E]">
                                {region.performance.customers}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 mt-5 pt-5 border-t border-[rgba(46,122,217,0.25)]">
                        <Button
                          variant="outline"
                          className="h-10 flex-1 sm:flex-none"
                          onClick={() => handleViewDetails(region)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          <span className="hidden sm:inline">View Details</span>
                          <span className="sm:hidden">Details</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-10 flex-1 sm:flex-none"
                          onClick={() => handleEditRegion(region)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          <span className="hidden sm:inline">Edit Region</span>
                          <span className="sm:hidden">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-10 flex-1 sm:flex-none text-[#DC2626] border-[#FEE2E2] hover:bg-[#FEE2E2] hover:text-[#DC2626]"
                        >
                          <ToggleLeft className="w-4 h-4 mr-2" />
                          <span className="hidden sm:inline">Deactivate All</span>
                          <span className="sm:hidden">Deactivate</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Region Detail Modal */}
      {showDetailModal && selectedRegion && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-50 transition-opacity"
            onClick={() => setShowDetailModal(false)}
          />
          <div className="fixed inset-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[90%] sm:max-w-[800px] sm:max-h-[90vh] bg-white sm:rounded-2xl z-50 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[rgba(46,122,217,0.25)] px-5 sm:px-8 py-4 sm:py-6 flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A2E]">
                {selectedRegion.name} Details
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F0F7FF] transition-colors"
              >
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>

            <div className="p-5 sm:p-8 space-y-6">
              {/* Region Status */}
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-[#1A1A2E]">Region Status:</span>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${selectedRegion.isActive ? 'bg-[#10B981]' : 'bg-[#9CA3AF]'}`} />
                  <span className={`text-base font-semibold ${selectedRegion.isActive ? 'text-[#10B981]' : 'text-[#9CA3AF]'}`}>
                    {selectedRegion.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Active Profiles */}
              <div>
                <h3 className="text-lg font-bold text-[#1A1A2E] mb-4">
                  Active Profiles ({selectedRegion.activeProfiles}):
                </h3>
                <div className="space-y-3">
                  {selectedRegion.profiles.filter(p => p.isActive).map((profile) => (
                    <div key={profile.id} className="bg-white border border-[rgba(46,122,217,0.25)] rounded-lg p-4 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-base font-bold text-[#1A1A2E] mb-1">{profile.name}</p>
                          <p className="text-sm text-[#6B7280] mb-2">
                            Category: {profile.category}
                          </p>
                          <p className="text-sm text-[#6B7280]">
                            Status: Active | Listings: {profile.listingsCount}
                          </p>
                          <Button
                            variant="link"
                            className="h-auto p-0 text-sm text-[#2E7AD9] hover:underline mt-2"
                          >
                            Manage Profile in Region
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Trends */}
              <div className="border-t border-[rgba(46,122,217,0.25)] pt-6">
                <h3 className="text-lg font-bold text-[#1A1A2E] mb-4">
                  Performance Summary
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-[#6B7280] mb-2">Total Bookings</p>
                    <p className="text-2xl font-bold text-[#1A1A2E]">
                      {selectedRegion.performance.bookings}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-[#6B7280] mb-2">Total Revenue</p>
                    <p className="text-2xl font-bold text-[#1A1A2E]">
                      ${selectedRegion.performance.revenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-[#6B7280] mb-2">Total Customers</p>
                    <p className="text-2xl font-bold text-[#1A1A2E]">
                      {selectedRegion.performance.customers}
                    </p>
                  </div>
                </div>
              </div>

              {/* Region Notes */}
              <div className="border-t border-[rgba(46,122,217,0.25)] pt-6">
                <h3 className="text-lg font-bold text-[#1A1A2E] mb-3">Region Notes</h3>
                <Textarea
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  placeholder="Add internal notes about this region (not visible to customers)..."
                  className="min-h-[100px] resize-none border-2"
                  maxLength={500}
                />
                <p className="text-xs text-[#9CA3AF] mt-2 text-right">
                  {editedNotes.length} / 500
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-6 border-t border-[rgba(46,122,217,0.25)]">
                <Button
                  variant="outline"
                  className="h-11"
                  onClick={() => setShowDetailModal(false)}
                >
                  Close
                </Button>
                <Button
                  className="h-11 bg-[#2E7AD9] hover:bg-[#1E5DB0] text-white"
                  onClick={handleSaveNotes}
                >
                  Save Notes
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Edit Region Modal */}
      {showEditModal && selectedRegion && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-50 transition-opacity"
            onClick={() => setShowEditModal(false)}
          />
          <div className="fixed inset-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[90%] sm:max-w-[800px] sm:max-h-[90vh] bg-white sm:rounded-2xl z-50 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[rgba(46,122,217,0.25)] px-5 sm:px-8 py-4 sm:py-6 flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A2E]">
                Edit Region: {selectedRegion.name}
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F0F7FF] transition-colors"
              >
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>

            <div className="p-5 sm:p-8 space-y-6">
              {/* Select Active Profiles */}
              <div>
                <h3 className="text-lg font-bold text-[#1A1A2E] mb-4">
                  Select Active Profiles:
                </h3>
                <div className="space-y-3">
                  {selectedRegion.profiles.map((profile) => (
                    <div
                      key={profile.id}
                      className={`border rounded-lg p-4 transition-all ${
                        profile.isActive
                          ? 'border-[#10B981] bg-[#D1FAE5]'
                          : 'border-[rgba(46,122,217,0.25)] bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={profile.isActive}
                          onCheckedChange={() => handleToggleProfileInRegion(profile.id)}
                          className="mt-0.5"
                        />
                        <div className="flex-1">
                          <Label className="text-base font-semibold text-[#1A1A2E] cursor-pointer">
                            {profile.name}
                          </Label>
                          <p className="text-sm text-[#6B7280] mt-1">
                            {profile.listingsCount > 0
                              ? `Listings in region: ${profile.listingsCount}`
                              : 'No listings yet'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Region Settings */}
              <div className="border-t border-[rgba(46,122,217,0.25)] pt-6">
                <h3 className="text-lg font-bold text-[#1A1A2E] mb-4">
                  Region-Specific Settings:
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Checkbox id="featured" />
                    <Label htmlFor="featured" className="text-sm text-[#1A1A2E] cursor-pointer">
                      Feature this region (appears first)
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="delivery" />
                    <Label htmlFor="delivery" className="text-sm text-[#1A1A2E] cursor-pointer">
                      Special delivery area
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="advance" />
                    <Label htmlFor="advance" className="text-sm text-[#1A1A2E] cursor-pointer">
                      Requires advance booking
                    </Label>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-6 border-t border-[rgba(46,122,217,0.25)]">
                <Button
                  variant="outline"
                  className="h-11"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="h-11 bg-[#2E7AD9] hover:bg-[#1E5DB0] text-white"
                  onClick={handleSaveRegionEdit}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add Region Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[500px] p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-4">Add New Region</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1A1A2E] mb-1">
                  Region Name <span className="text-[#DC2626]">*</span>
                </label>
                <Input value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} placeholder='e.g. "New York, NY"' className="h-11" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A2E] mb-1">
                  City <span className="text-[#DC2626]">*</span>
                </label>
                <Input value={addForm.city} onChange={(e) => setAddForm({ ...addForm, city: e.target.value })} placeholder="New York" className="h-11" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A2E] mb-1">State (US)</label>
                  <Input value={addForm.state} onChange={(e) => setAddForm({ ...addForm, state: e.target.value })} placeholder="NY" className="h-11" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A2E] mb-1">Province (CA)</label>
                  <Input value={addForm.province} onChange={(e) => setAddForm({ ...addForm, province: e.target.value })} placeholder="ON" className="h-11" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A2E] mb-1">
                    Country <span className="text-[#DC2626]">*</span>
                  </label>
                  <Input value={addForm.country} onChange={(e) => setAddForm({ ...addForm, country: e.target.value })} placeholder="USA" className="h-11" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A2E] mb-1">
                    Country Code <span className="text-[#DC2626]">*</span>
                  </label>
                  <Input value={addForm.countryCode} onChange={(e) => setAddForm({ ...addForm, countryCode: e.target.value.toUpperCase() })} placeholder="US" maxLength={2} className="h-11" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="active" checked={addForm.isActive} onChange={(e) => setAddForm({ ...addForm, isActive: e.target.checked })} />
                <label htmlFor="active" className="text-sm text-[#1A1A2E]">Active</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowAddModal(false)} disabled={addBusy}>Cancel</Button>
              <Button onClick={handleAddRegion} disabled={addBusy} className="bg-[#2E7AD9] hover:bg-[#1E5DB0]">
                {addBusy ? "Adding..." : "Add Region"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}