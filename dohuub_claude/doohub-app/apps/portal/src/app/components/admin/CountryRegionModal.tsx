import { useEffect, useState } from "react";
import { ArrowLeft, X, Search, Globe, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "../ui/dialog";
import api from "../../../services/api";

interface Country {
  code: string;
  name: string;
  flag: string;
}

interface RegionRow {
  id: string;
  name: string;
  city: string;
  state?: string | null;
  province?: string | null;
  country: string;
  countryCode: string;
}

interface CountryRegionModalProps {
  open: boolean;
  onClose: () => void;
  onAddRegions: (regions: { countryCode: string; countryName: string; countryFlag: string; regionId: string; regionName: string }[]) => void;
}

function flagFor(code: string): string {
  const map: Record<string, string> = {
    US: "🇺🇸", CA: "🇨🇦", GB: "🇬🇧", AU: "🇦🇺", IN: "🇮🇳", FR: "🇫🇷",
    DE: "🇩🇪", IT: "🇮🇹", JP: "🇯🇵", BR: "🇧🇷", MX: "🇲🇽", NL: "🇳🇱", ES: "🇪🇸",
  };
  return map[code] || "🌐";
}

export function CountryRegionModal({ open, onClose, onAddRegions }: CountryRegionModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [countrySearch, setCountrySearch] = useState("");
  const [regionSearch, setRegionSearch] = useState("");
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [countryRegions, setCountryRegions] = useState<RegionRow[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingRegions, setLoadingRegions] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoadingCountries(true);
    // /api/v1/regions returns regions plus a distinct list of countries with
    // active regions. We use the countries[] field to drive Step 1, so the
    // modal only shows countries that actually have seeded regions (kills
    // the dead-end UX where 9 of 13 hardcoded countries had no regions).
    api
      .get<{ success: boolean; countries: { name: string; code: string; flag: string }[] }>(
        "/api/v1/regions?isActive=true&limit=1"
      )
      .then((r) => {
        const cs = ((r as any)?.countries || []).map((c: any) => ({
          code: c.code,
          name: c.name,
          flag: c.flag || flagFor(c.code),
        }));
        setCountries(cs);
      })
      .catch(() => setCountries([]))
      .finally(() => setLoadingCountries(false));
  }, [open]);

  useEffect(() => {
    if (!open || !selectedCountry) return;
    setLoadingRegions(true);
    api
      .get<{ success: boolean; data: RegionRow[] }>(
        `/api/v1/regions?isActive=true&countryCode=${encodeURIComponent(selectedCountry.code)}&limit=500`
      )
      .then((r) => setCountryRegions((r as any)?.data || []))
      .catch(() => setCountryRegions([]))
      .finally(() => setLoadingRegions(false));
  }, [open, selectedCountry]);

  const handleClose = () => {
    setStep(1);
    setSelectedCountry(null);
    setCountrySearch("");
    setRegionSearch("");
    setSelectedRegions([]);
    setCountryRegions([]);
    onClose();
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setStep(2);
    setSelectedRegions([]);
  };

  const handleBackToCountries = () => {
    setStep(1);
    setSelectedCountry(null);
    setRegionSearch("");
    setSelectedRegions([]);
    setCountryRegions([]);
  };

  const handleAddSelected = () => {
    if (!selectedCountry) return;
    const regionsToAdd = selectedRegions.map((regionId) => {
      const region = countryRegions.find((r) => r.id === regionId);
      return {
        countryCode: selectedCountry.code,
        countryName: selectedCountry.name,
        countryFlag: selectedCountry.flag,
        regionId, // real cuid from the DB
        regionName: region?.name || "",
      };
    });
    onAddRegions(regionsToAdd);
    handleClose();
  };

  const filteredCountries = countries
    .filter((c) => c.name.toLowerCase().includes(countrySearch.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const filteredRegions = countryRegions.filter(
    (r) =>
      r.name.toLowerCase().includes(regionSearch.toLowerCase()) ||
      (r.state || "").toLowerCase().includes(regionSearch.toLowerCase()) ||
      (r.province || "").toLowerCase().includes(regionSearch.toLowerCase()) ||
      r.city.toLowerCase().includes(regionSearch.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-[600px] max-h-[90vh] sm:max-h-[700px] p-0 gap-0">
        <DialogHeader className="p-4 sm:p-8 pb-3 sm:pb-4 border-b border-[rgba(46,122,217,0.25)]">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-[#1A1A2E]">Add Service Region</DialogTitle>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-lg hover:bg-[#F0F7FF] flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-[#6B7280]" />
            </button>
          </div>
          <DialogDescription className="sr-only">
            Select a country and regions where you want to offer services
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 sm:p-8 overflow-y-auto max-h-[calc(90vh-120px)] sm:max-h-[600px]">
          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <p className="text-base font-semibold text-[#1A1A2E] mb-2">Step 1: Select Country</p>
                <p className="text-sm text-[#6B7280]">Choose a country with available service regions.</p>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF]" />
                <Input
                  type="text"
                  placeholder="Search countries..."
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  className="pl-12 h-12"
                />
              </div>

              {loadingCountries ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 text-[#2E7AD9] animate-spin" />
                </div>
              ) : filteredCountries.length === 0 ? (
                <div className="text-center py-12 text-sm text-[#6B7280]">
                  <Globe className="w-10 h-10 mx-auto mb-3 text-[#9CA3AF]" />
                  No countries available. Add regions via Admin → Geographic Regions first.
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => handleCountrySelect(country)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border border-[rgba(46,122,217,0.25)] hover:bg-[#F0F7FF] hover:border-[#2E7AD9] transition-colors text-left"
                    >
                      <span className="text-2xl">{country.flag}</span>
                      <span className="flex-1 text-sm font-medium text-[#1A1A2E]">{country.name}</span>
                      <span className="text-xs text-[#9CA3AF]">{country.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <button
                onClick={handleBackToCountries}
                className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1A1A2E] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to countries
              </button>

              <div>
                <p className="text-base font-semibold text-[#1A1A2E] mb-1 flex items-center gap-2">
                  <span className="text-2xl">{selectedCountry?.flag}</span>
                  Step 2: Select regions in {selectedCountry?.name}
                </p>
                <p className="text-sm text-[#6B7280]">Pick one or more regions.</p>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF]" />
                <Input
                  type="text"
                  placeholder="Search regions..."
                  value={regionSearch}
                  onChange={(e) => setRegionSearch(e.target.value)}
                  className="pl-12 h-12"
                />
              </div>

              {loadingRegions ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 text-[#2E7AD9] animate-spin" />
                </div>
              ) : filteredRegions.length === 0 ? (
                <div className="text-center py-12 text-sm text-[#6B7280]">
                  No regions in {selectedCountry?.name} yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredRegions.map((region) => {
                    const checked = selectedRegions.includes(region.id);
                    return (
                      <div
                        key={region.id}
                        onClick={() =>
                          setSelectedRegions((prev) =>
                            checked ? prev.filter((id) => id !== region.id) : [...prev, region.id]
                          )
                        }
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          checked
                            ? "bg-[#F0F7FF] border-[#2E7AD9]"
                            : "border-[rgba(46,122,217,0.25)] hover:bg-[#F0F7FF]"
                        }`}
                      >
                        <Checkbox checked={checked} onCheckedChange={() => {}} className="pointer-events-none" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#1A1A2E]">{region.name}</p>
                          <p className="text-xs text-[#6B7280]">{region.state || region.province || region.country}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-[rgba(46,122,217,0.25)]">
                <span className="text-sm text-[#6B7280]">{selectedRegions.length} selected</span>
                <Button
                  onClick={handleAddSelected}
                  disabled={selectedRegions.length === 0}
                  className="bg-[#2E7AD9] hover:bg-[#1E5DB0]"
                >
                  Add Selected
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
