import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, X, Search, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { api } from "../../../services/api";

interface Country {
  code: string;
  name: string;
  flag: string;
}

interface Region {
  id: string;
  name: string;
  subRegion: string;
}

interface CountryRegionModalProps {
  open: boolean;
  onClose: () => void;
  onAddRegions: (regions: { countryCode: string; countryName: string; countryFlag: string; regionId: string; regionName: string }[]) => void;
}

// Country flag emoji map
const COUNTRY_FLAGS: Record<string, string> = {
  US: "🇺🇸", CA: "🇨🇦", AU: "🇦🇺", BR: "🇧🇷", FR: "🇫🇷",
  DE: "🇩🇪", IN: "🇮🇳", IT: "🇮🇹", JP: "🇯🇵", MX: "🇲🇽",
  NL: "🇳🇱", ES: "🇪🇸", GB: "🇬🇧", CN: "🇨🇳", KR: "🇰🇷",
  RU: "🇷🇺", ZA: "🇿🇦", AE: "🇦🇪", SG: "🇸🇬", NZ: "🇳🇿",
  AR: "🇦🇷", CL: "🇨🇱", CO: "🇨🇴", PH: "🇵🇭", TH: "🇹🇭",
  VN: "🇻🇳", ID: "🇮🇩", MY: "🇲🇾", PK: "🇵🇰", BD: "🇧🇩",
  NG: "🇳🇬", EG: "🇪🇬", KE: "🇰🇪", PL: "🇵🇱", SE: "🇸🇪",
  NO: "🇳🇴", DK: "🇩🇰", FI: "🇫🇮", CH: "🇨🇭", AT: "🇦🇹",
  BE: "🇧🇪", PT: "🇵🇹", GR: "🇬🇷", IE: "🇮🇪", CZ: "🇨🇿",
  HU: "🇭🇺", RO: "🇷🇴", UA: "🇺🇦", IL: "🇮🇱", SA: "🇸🇦",
  TR: "🇹🇷", HK: "🇭🇰", TW: "🇹🇼", PH: "🇵🇭",
};

export function CountryRegionModal({ open, onClose, onAddRegions }: CountryRegionModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [countrySearch, setCountrySearch] = useState("");
  const [regionSearch, setRegionSearch] = useState("");
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  // Data state
  const [countries, setCountries] = useState<Country[]>([]);
  const [regions, setRegions] = useState<{ major: Region[]; all: Region[] }>({ major: [], all: [] });
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch countries on mount
  const fetchCountries = useCallback(async () => {
    setIsLoadingCountries(true);
    setError(null);
    try {
      const response: any = await api.get('/regions/grouped');
      const data = response?.data || response;

      // Extract unique countries from grouped data
      const countryList: Country[] = [];
      if (Array.isArray(data)) {
        data.forEach((group: any) => {
          const code = group.countryCode || group.country?.code;
          const name = group.countryName || group.country?.name || group.country;
          if (code && name && !countryList.find(c => c.code === code)) {
            countryList.push({
              code,
              name,
              flag: COUNTRY_FLAGS[code] || "🏳️",
            });
          }
        });
      } else if (typeof data === 'object') {
        // Handle { countryCode: [regions] } format
        Object.keys(data).forEach(code => {
          const countryData = data[code];
          const name = countryData.name || code;
          countryList.push({
            code,
            name,
            flag: COUNTRY_FLAGS[code] || "🏳️",
          });
        });
      }

      // Sort alphabetically
      countryList.sort((a, b) => a.name.localeCompare(b.name));
      setCountries(countryList);
    } catch (err: any) {
      console.error('Failed to fetch countries:', err);
      setError('Failed to load countries');
    } finally {
      setIsLoadingCountries(false);
    }
  }, []);

  // Fetch regions for selected country
  const fetchRegions = useCallback(async (countryCode: string) => {
    setIsLoadingRegions(true);
    setError(null);
    try {
      const response: any = await api.get(`/regions?country=${countryCode}`);
      const data = response?.data || response;

      const allRegions: Region[] = [];
      if (Array.isArray(data)) {
        data.forEach((r: any) => {
          allRegions.push({
            id: r.id,
            name: r.name || r.city || r.region,
            subRegion: r.subRegion || r.state || r.province || "",
          });
        });
      }

      // Sort alphabetically
      allRegions.sort((a, b) => a.name.localeCompare(b.name));

      // Major cities are first 4 (or marked as major)
      const major = allRegions.filter(r => (r as any).isMajor).slice(0, 4);
      if (major.length === 0) {
        // Take first 4 as major if none marked
        setRegions({ major: allRegions.slice(0, 4), all: allRegions });
      } else {
        setRegions({ major, all: allRegions });
      }
    } catch (err: any) {
      console.error('Failed to fetch regions:', err);
      setError('Failed to load regions');
      setRegions({ major: [], all: [] });
    } finally {
      setIsLoadingRegions(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchCountries();
    }
  }, [open, fetchCountries]);

  useEffect(() => {
    if (selectedCountry) {
      fetchRegions(selectedCountry.code);
    }
  }, [selectedCountry, fetchRegions]);

  const handleClose = () => {
    setStep(1);
    setSelectedCountry(null);
    setCountrySearch("");
    setRegionSearch("");
    setSelectedRegions([]);
    setRegions({ major: [], all: [] });
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
    setRegions({ major: [], all: [] });
  };

  const handleAddSelected = () => {
    if (!selectedCountry) return;

    const regionsToAdd = selectedRegions.map(regionId => {
      const region = regions.all.find(r => r.id === regionId);
      return {
        countryCode: selectedCountry.code,
        countryName: selectedCountry.name,
        countryFlag: selectedCountry.flag,
        regionId,
        regionName: region?.name || "",
      };
    });

    onAddRegions(regionsToAdd);
    handleClose();
  };

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const filteredMajorRegions = regions.major.filter(region =>
    region.name.toLowerCase().includes(regionSearch.toLowerCase()) ||
    region.subRegion.toLowerCase().includes(regionSearch.toLowerCase())
  );
  const filteredAllRegions = regions.all.filter(region =>
    region.name.toLowerCase().includes(regionSearch.toLowerCase()) ||
    region.subRegion.toLowerCase().includes(regionSearch.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-[600px] max-h-[90vh] sm:max-h-[700px] p-0 gap-0">
        <DialogHeader className="p-4 sm:p-8 pb-3 sm:pb-4 border-b border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-[#1F2937]">
              Add Service Region
            </DialogTitle>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-lg hover:bg-[#F3F4F6] flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-[#6B7280]" />
            </button>
          </div>
          <DialogDescription className="sr-only">
            Select a country and regions where you want to offer services
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 sm:p-8 overflow-y-auto max-h-[calc(90vh-120px)] sm:max-h-[600px]">
          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[#FEE2E2] border border-[#DC2626] text-[#991B1B] text-sm">
              {error}
            </div>
          )}

          {step === 1 ? (
            // Step 1: Select Country
            <div className="space-y-6">
              <div>
                <p className="text-base font-semibold text-[#1F2937] mb-2">
                  Step 1: Select Country
                </p>
                <p className="text-sm text-[#6B7280]">
                  Choose the country where you want to offer services.
                </p>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF]" />
                <Input
                  placeholder="Search countries..."
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  className="h-11 pl-12 border-2 border-[#E5E7EB] rounded-lg"
                />
              </div>

              {isLoadingCountries ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-[#6B7280] animate-spin" />
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">
                      Popular Countries
                    </p>
                    <div className="space-y-2">
                      {filteredCountries.slice(0, 2).map((country) => (
                        <button
                          key={country.code}
                          onClick={() => handleCountrySelect(country)}
                          className="w-full h-14 flex items-center justify-between px-4 border border-[#E5E7EB] rounded-lg hover:border-[#1F2937] hover:bg-[#F8F9FA] transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[32px]">{country.flag}</span>
                            <span className="text-base font-semibold text-[#1F2937]">
                              {country.name}
                            </span>
                          </div>
                          <ArrowLeft className="w-5 h-5 text-[#9CA3AF] rotate-180" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">
                      All Countries (Alphabetical)
                    </p>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                      {filteredCountries.map((country) => (
                        <button
                          key={country.code}
                          onClick={() => handleCountrySelect(country)}
                          className="w-full h-14 flex items-center justify-between px-4 border border-[#E5E7EB] rounded-lg hover:border-[#1F2937] hover:bg-[#F8F9FA] transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[32px]">{country.flag}</span>
                            <span className="text-base font-semibold text-[#1F2937]">
                              {country.name}
                            </span>
                          </div>
                          <ArrowLeft className="w-5 h-5 text-[#9CA3AF] rotate-180" />
                        </button>
                      ))}
                      {filteredCountries.length === 0 && (
                        <p className="text-center py-8 text-[#6B7280]">
                          No countries found
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="pt-6 flex justify-center">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="w-[140px] h-11"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            // Step 2: Select Regions
            <div className="space-y-6">
              <button
                onClick={handleBackToCountries}
                className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1F2937] hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Countries
              </button>

              <div>
                <p className="text-base font-semibold text-[#1F2937] mb-2">
                  Step 2: Select Regions in {selectedCountry?.name}
                </p>
                <p className="text-sm text-[#6B7280]">
                  Choose specific cities or states where you'll provide services.
                </p>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF]" />
                <Input
                  placeholder={`Search regions in ${selectedCountry?.name}...`}
                  value={regionSearch}
                  onChange={(e) => setRegionSearch(e.target.value)}
                  className="h-11 pl-12 border-2 border-[#E5E7EB] rounded-lg"
                />
              </div>

              {isLoadingRegions ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-[#6B7280] animate-spin" />
                </div>
              ) : regions.all.length === 0 ? (
                <p className="text-center py-8 text-[#6B7280]">
                  No regions available for this country
                </p>
              ) : (
                <>
                  {filteredMajorRegions.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">
                        Major Cities
                      </p>
                      <div className="space-y-2">
                        {filteredMajorRegions.map((region) => {
                          const isSelected = selectedRegions.includes(region.id);
                          return (
                            <div
                              key={region.id}
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedRegions(selectedRegions.filter(id => id !== region.id));
                                } else {
                                  setSelectedRegions([...selectedRegions, region.id]);
                                }
                              }}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  if (isSelected) {
                                    setSelectedRegions(selectedRegions.filter(id => id !== region.id));
                                  } else {
                                    setSelectedRegions([...selectedRegions, region.id]);
                                  }
                                }
                              }}
                              className={`w-full h-14 flex items-center gap-3 px-4 border rounded-lg transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-[#10B981] bg-[#D1FAE5]'
                                  : 'border-[#E5E7EB] hover:border-[#1F2937] hover:bg-[#F8F9FA]'
                              }`}
                            >
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => {}}
                                className="w-5 h-5 pointer-events-none"
                              />
                              <span className="text-base font-semibold text-[#1F2937]">
                                {region.name}
                              </span>
                              {region.subRegion && (
                                <span className="text-[13px] text-[#6B7280]">
                                  ({region.subRegion})
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">
                      All Regions (Alphabetical)
                    </p>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                      {filteredAllRegions.map((region) => {
                        const isSelected = selectedRegions.includes(region.id);
                        return (
                          <div
                            key={region.id}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedRegions(selectedRegions.filter(id => id !== region.id));
                              } else {
                                setSelectedRegions([...selectedRegions, region.id]);
                              }
                            }}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                if (isSelected) {
                                  setSelectedRegions(selectedRegions.filter(id => id !== region.id));
                                } else {
                                  setSelectedRegions([...selectedRegions, region.id]);
                                }
                              }
                            }}
                            className={`w-full h-14 flex items-center gap-3 px-4 border rounded-lg transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#10B981] bg-[#D1FAE5]'
                                : 'border-[#E5E7EB] hover:border-[#1F2937] hover:bg-[#F8F9FA]'
                            }`}
                          >
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => {}}
                              className="w-5 h-5 pointer-events-none"
                            />
                            <span className="text-base font-semibold text-[#1F2937]">
                              {region.name}
                            </span>
                          </div>
                        );
                      })}
                      {filteredAllRegions.length === 0 && (
                        <p className="text-center py-8 text-[#6B7280]">
                          No regions found
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="pt-4">
                <p className="text-sm text-[#6B7280] text-center mb-6">
                  Selected: {selectedRegions.length} region{selectedRegions.length !== 1 ? 's' : ''}
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    className="w-[140px] h-11"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddSelected}
                    disabled={selectedRegions.length === 0}
                    className="w-[180px] h-11 bg-[#1F2937] hover:bg-[#111827] text-white font-semibold disabled:bg-[#D1D5DB] disabled:cursor-not-allowed"
                  >
                    Add Selected
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
