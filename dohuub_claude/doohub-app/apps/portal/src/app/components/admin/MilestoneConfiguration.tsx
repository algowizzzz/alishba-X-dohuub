import { ArrowLeft, Gift, Save, Info, ChevronDown, ChevronRight, Copy, Check, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AdminSidebarRetractable } from './AdminSidebarRetractable';
import { AdminTopNav } from './AdminTopNav';
import api from '../../../services/api';

const ENUM_TO_LABEL: Record<string, string> = {
  CLEANING: 'Cleaning Services',
  HANDYMAN: 'Handyman Services',
  FOOD: 'Food Delivery',
  GROCERIES: 'Grocery Delivery',
  BEAUTY: 'Beauty Services',
  BEAUTY_PRODUCTS: 'Beauty Products',
  RENTALS: 'Rental Properties',
  RIDE_ASSISTANCE: 'Ride Services',
  COMPANIONSHIP: 'Companionship Services',
};
const CATEGORY_ENUMS = Object.keys(ENUM_TO_LABEL);

export function MilestoneConfiguration() {
  const navigate = useNavigate();
  const [thresholds, setThresholds] = useState<number[]>([5, 10, 25, 50]);

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

  const [categoryBonusPoints, setCategoryBonusPoints] = useState<Record<string, number[]>>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [showApplyAllModal, setShowApplyAllModal] = useState(false);
  const [applyAllValues, setApplyAllValues] = useState<number[]>([25, 50, 100, 200]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch existing config; group rows by category, sort by tier so we get
  // [tier1, tier2, tier3, tier4] consistently.
  useEffect(() => {
    setLoading(true);
    api
      .get<{ success: boolean; data: any[] }>('/api/v1/admin/milestone-config')
      .then((r) => {
        const rows = (r as any)?.data || [];
        const grouped: Record<string, number[]> = {};
        const thresholdMap: Record<number, number> = {};
        for (const row of rows) {
          const cat = ENUM_TO_LABEL[row.category] || row.category;
          if (!grouped[cat]) grouped[cat] = [];
          grouped[cat][row.tier - 1] = row.bonusPoints;
          thresholdMap[row.tier] = row.orderThreshold;
        }
        // Ensure every category has 4 tiers filled out (default if missing)
        for (const cat of Object.values(ENUM_TO_LABEL)) {
          if (!grouped[cat]) grouped[cat] = [25, 50, 100, 200];
          for (let i = 0; i < 4; i++) if (grouped[cat][i] === undefined) grouped[cat][i] = [25, 50, 100, 200][i];
        }
        setCategoryBonusPoints(grouped);
        const orderedThresholds = [1, 2, 3, 4].map((t) => thresholdMap[t] || [5, 10, 25, 50][t - 1]);
        setThresholds(orderedThresholds);
      })
      .catch((e: any) => toast.error(e?.response?.data?.error || e?.message || 'Failed to load milestones'))
      .finally(() => setLoading(false));
  }, []);

  const categories = Object.values(ENUM_TO_LABEL);
  const MILESTONE_THRESHOLDS = thresholds;
  const LABEL_TO_ENUM = Object.fromEntries(Object.entries(ENUM_TO_LABEL).map(([k, v]) => [v, k]));

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const handlePointsChange = (category: string, milestoneIndex: number, value: number) => {
    const newValue = Math.max(1, value); // Minimum of 1
    setCategoryBonusPoints(prev => ({
      ...prev,
      [category]: prev[category].map((pts, idx) => idx === milestoneIndex ? newValue : pts)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const entries: any[] = [];
      for (const [catLabel, bonuses] of Object.entries(categoryBonusPoints)) {
        const enumKey = LABEL_TO_ENUM[catLabel];
        if (!enumKey) continue;
        for (let i = 0; i < bonuses.length; i++) {
          entries.push({
            category: enumKey,
            tier: i + 1,
            orderThreshold: MILESTONE_THRESHOLDS[i] || (i + 1) * 10,
            bonusPoints: bonuses[i],
          });
        }
      }
      await api.put('/api/v1/admin/milestone-config', { entries });
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
      toast.success('Milestones saved');
    } catch (e: any) {
      toast.error(e?.response?.data?.error || e?.message || 'Failed to save milestones');
    } finally {
      setSaving(false);
    }
  };

  const handleApplyToAll = () => {
    const newPoints: Record<string, number[]> = {};
    categories.forEach(category => {
      newPoints[category] = [...applyAllValues];
    });
    setCategoryBonusPoints(newPoints);
    setShowApplyAllModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      <AdminTopNav onMenuClick={handleSidebarToggle} />
      <AdminSidebarRetractable
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        activeMenu="rewards"
      />

      {/* Success Toast */}
      {showSaveSuccess && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-right">
          <Check className="w-5 h-5" />
          <span>Milestone configuration saved successfully!</span>
        </div>
      )}

      {/* Main Content */}
      <main
        className={`
          mt-[72px] min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8
          transition-all duration-300
          ${sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[280px]"}
        `}
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/rewards')}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Milestone Configuration</h1>
                <p className="text-muted-foreground">Configure bonus points for customer milestones</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowApplyAllModal(true)}
                className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-secondary transition-colors"
              >
                <Copy className="w-4 h-4" />
                Apply to All
              </button>
              <button
                onClick={handleSave}
                disabled={saving || loading}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-800 mb-1">About Milestones</h3>
                <p className="text-sm text-blue-700">
                  Customers earn bonus points when they complete {MILESTONE_THRESHOLDS.join(', ')} orders in any category.
                  Click on a category to expand and edit the bonus points. Order thresholds are fixed across all categories.
                </p>
              </div>
            </div>
          </div>

          {/* Milestone Thresholds Legend */}
          <div className="bg-secondary rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-foreground mb-3">Fixed Order Thresholds</h3>
            <div className="flex flex-wrap gap-3">
              {MILESTONE_THRESHOLDS.map((threshold, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-border shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 text-xs font-bold">
                    {idx + 1}
                  </div>
                  <span className="text-sm text-foreground">After <strong>{threshold}</strong> orders</span>
                </div>
              ))}
            </div>
          </div>

          {/* Categories Accordion */}
          <div className="space-y-3">
            {categories.map((category) => {
              const isExpanded = expandedCategories.has(category);

              return (
                <div
                  key={category}
                  className="bg-white rounded-xl border border-border overflow-hidden transition-all shadow-[0_4px_16px_rgba(46,122,217,0.18)]"
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Gift className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <h2 className="font-semibold text-foreground">{category}</h2>
                        </div>
                        {/* Summary when collapsed */}
                        {!isExpanded && (
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {categoryBonusPoints[category].join(' → ')} pts
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Accordion Content */}
                  {isExpanded && (
                    <div className="px-6 py-4 border-t border-border bg-secondary/50">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {MILESTONE_THRESHOLDS.map((threshold, idx) => (
                          <div key={idx} className="space-y-2">
                            <label className="block text-sm text-muted-foreground">
                              After {threshold} orders
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                min="1"
                                value={categoryBonusPoints[category][idx]}
                                onChange={(e) => handlePointsChange(category, idx, parseInt(e.target.value) || 1)}
                                className="w-full px-3 py-2 pr-12 border border-border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-[0_4px_16px_rgba(46,122,217,0.18)]"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">pts</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </main>

      {/* Apply to All Modal */}
      {showApplyAllModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-foreground mb-2">Apply to All Categories</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Set the same bonus points for all categories. This will overwrite any existing values.
            </p>

            <div className="space-y-4 mb-6">
              {MILESTONE_THRESHOLDS.map((threshold, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <label className="w-32 text-sm text-muted-foreground">
                    After {threshold} orders
                  </label>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="1"
                      value={applyAllValues[idx]}
                      onChange={(e) => {
                        const newValues = [...applyAllValues];
                        newValues[idx] = Math.max(1, parseInt(e.target.value) || 1);
                        setApplyAllValues(newValues);
                      }}
                      className="w-full px-3 py-2 pr-12 border border-border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">pts</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowApplyAllModal(false)}
                className="px-4 py-2 text-muted-foreground hover:bg-secondary rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyToAll}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                Apply to All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
