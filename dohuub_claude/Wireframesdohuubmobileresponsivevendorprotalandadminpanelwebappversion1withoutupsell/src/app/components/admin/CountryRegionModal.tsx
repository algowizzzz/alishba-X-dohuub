import { useState } from "react";
import { ArrowLeft, X, Search, Globe } from "lucide-react";
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

const COUNTRIES: Country[] = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
];

const REGIONS_BY_COUNTRY: Record<string, { major: Region[]; all: Region[] }> = {
  US: {
    major: [
      { id: "us-1", name: "New York, NY", subRegion: "Northeast" },
      { id: "us-2", name: "Los Angeles, CA", subRegion: "West Coast" },
      { id: "us-3", name: "Chicago, IL", subRegion: "Midwest" },
      { id: "us-4", name: "Houston, TX", subRegion: "South" },
    ],
    all: [
      { id: "us-1", name: "New York, NY", subRegion: "Northeast" },
      { id: "us-2", name: "Los Angeles, CA", subRegion: "West Coast" },
      { id: "us-3", name: "Chicago, IL", subRegion: "Midwest" },
      { id: "us-4", name: "Houston, TX", subRegion: "South" },
      { id: "us-5", name: "Atlanta, GA", subRegion: "South" },
      { id: "us-6", name: "Austin, TX", subRegion: "South" },
      { id: "us-7", name: "Boston, MA", subRegion: "Northeast" },
      { id: "us-8", name: "Dallas, TX", subRegion: "South" },
      { id: "us-9", name: "Denver, CO", subRegion: "West" },
      { id: "us-10", name: "Miami, FL", subRegion: "South" },
      { id: "us-11", name: "Phoenix, AZ", subRegion: "Southwest" },
      { id: "us-12", name: "San Diego, CA", subRegion: "West Coast" },
      { id: "us-13", name: "San Francisco, CA", subRegion: "West Coast" },
      { id: "us-14", name: "Seattle, WA", subRegion: "Northwest" },
    ],
  },
  CA: {
    major: [
      { id: "ca-1", name: "Toronto, ON", subRegion: "Ontario" },
      { id: "ca-2", name: "Montreal, QC", subRegion: "Quebec" },
      { id: "ca-3", name: "Vancouver, BC", subRegion: "British Columbia" },
      { id: "ca-4", name: "Calgary, AB", subRegion: "Alberta" },
    ],
    all: [
      { id: "ca-1", name: "Toronto, ON", subRegion: "Ontario" },
      { id: "ca-2", name: "Montreal, QC", subRegion: "Quebec" },
      { id: "ca-3", name: "Vancouver, BC", subRegion: "British Columbia" },
      { id: "ca-4", name: "Calgary, AB", subRegion: "Alberta" },
      { id: "ca-5", name: "Ottawa, ON", subRegion: "Ontario" },
      { id: "ca-6", name: "Edmonton, AB", subRegion: "Alberta" },
      { id: "ca-7", name: "Halifax, NS", subRegion: "Nova Scotia" },
      { id: "ca-8", name: "Winnipeg, MB", subRegion: "Manitoba" },
    ],
  },
  GB: {
    major: [
      { id: "gb-1", name: "London", subRegion: "England" },
      { id: "gb-2", name: "Manchester", subRegion: "England" },
      { id: "gb-3", name: "Birmingham", subRegion: "England" },
      { id: "gb-4", name: "Edinburgh", subRegion: "Scotland" },
    ],
    all: [
      { id: "gb-1", name: "London", subRegion: "England" },
      { id: "gb-2", name: "Manchester", subRegion: "England" },
      { id: "gb-3", name: "Birmingham", subRegion: "England" },
      { id: "gb-4", name: "Edinburgh", subRegion: "Scotland" },
      { id: "gb-5", name: "Glasgow", subRegion: "Scotland" },
      { id: "gb-6", name: "Liverpool", subRegion: "England" },
      { id: "gb-7", name: "Cardiff", subRegion: "Wales" },
      { id: "gb-8", name: "Belfast", subRegion: "Northern Ireland" },
    ],
  },
  AU: {
    major: [
      { id: "au-1", name: "Sydney", subRegion: "New South Wales" },
      { id: "au-2", name: "Melbourne", subRegion: "Victoria" },
      { id: "au-3", name: "Brisbane", subRegion: "Queensland" },
      { id: "au-4", name: "Perth", subRegion: "Western Australia" },
    ],
    all: [
      { id: "au-1", name: "Sydney", subRegion: "New South Wales" },
      { id: "au-2", name: "Melbourne", subRegion: "Victoria" },
      { id: "au-3", name: "Brisbane", subRegion: "Queensland" },
      { id: "au-4", name: "Perth", subRegion: "Western Australia" },
      { id: "au-5", name: "Adelaide", subRegion: "South Australia" },
      { id: "au-6", name: "Gold Coast", subRegion: "Queensland" },
    ],
  },
};

export function CountryRegionModal({ open, onClose, onAddRegions }: CountryRegionModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [countrySearch, setCountrySearch] = useState("");
  const [regionSearch, setRegionSearch] = useState("");
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  const handleClose = () => {
    setStep(1);
    setSelectedCountry(null);
    setCountrySearch("");
    setRegionSearch("");
    setSelectedRegions([]);
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
  };

  const handleAddSelected = () => {
    if (!selectedCountry) return;
    
    const regionsData = REGIONS_BY_COUNTRY[selectedCountry.code]?.all || [];
    const regionsToAdd = selectedRegions.map(regionId => {
      const region = regionsData.find(r => r.id === regionId);
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

  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const currentRegions = selectedCountry ? REGIONS_BY_COUNTRY[selectedCountry.code] : null;
  const filteredMajorRegions = currentRegions?.major.filter(region =>
    region.name.toLowerCase().includes(regionSearch.toLowerCase()) ||
    region.subRegion.toLowerCase().includes(regionSearch.toLowerCase())
  ) || [];
  const filteredAllRegions = currentRegions?.all.filter(region =>
    region.name.toLowerCase().includes(regionSearch.toLowerCase()) ||
    region.subRegion.toLowerCase().includes(regionSearch.toLowerCase())
  ) || [];

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
                </div>
              </div>

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
                        <span className="text-[13px] text-[#6B7280]">
                          ({region.subRegion})
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

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
                </div>
              </div>

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