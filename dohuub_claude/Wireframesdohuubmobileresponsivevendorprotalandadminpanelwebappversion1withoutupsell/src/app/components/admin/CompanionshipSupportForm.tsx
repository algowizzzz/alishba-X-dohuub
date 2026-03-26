import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Upload, X, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { AdminSidebarRetractable } from "./AdminSidebarRetractable";
import { AdminTopNav } from "./AdminTopNav";

export function CompanionshipSupportForm() {
  const navigate = useNavigate();
  const { profileId, listingId } = useParams();
  const isEditMode = !!listingId;

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

  // Form state
  const [thumbnail, setThumbnail] = useState<string>("");
  const [companionName, setCompanionName] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [about, setAbout] = useState("");
  const [certifications, setCertifications] = useState({
    cna: false,
    cprFirstAid: false,
    dementiaCare: false,
    other: "",
  });
  const [specialties, setSpecialties] = useState({
    dementiaCare: false,
    mobilityAssistance: false,
    medicationManagement: false,
    other: "",
  });
  const [supportTypes, setSupportTypes] = useState({
    conversation: false,
    activities: false,
    mealPrep: false,
    medicationReminders: false,
    housekeeping: false,
    errands: false,
    appointments: false,
    personalCare: false,
    other: "",
  });
  const [languages, setLanguages] = useState<string[]>([]);
  const [customLanguage, setCustomLanguage] = useState("");
  const [imageGallery, setImageGallery] = useState<string[]>([]);

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageGallery((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeGalleryImage = (index: number) => {
    setImageGallery((prev) => prev.filter((_, i) => i !== index));
  };

  const addLanguage = () => {
    if (customLanguage && !languages.includes(customLanguage)) {
      setLanguages([...languages, customLanguage]);
      setCustomLanguage("");
    }
  };

  const removeLanguage = (lang: string) => {
    setLanguages(languages.filter((l) => l !== lang));
  };

  const handleSaveDraft = () => {
    console.log("Saving draft...");
    navigate(`/admin/michelle-profiles/${profileId}/listings`);
  };

  const handlePublish = () => {
    console.log("Publishing...");
    navigate(`/admin/michelle-profiles/${profileId}/listings`);
  };

  const aboutCharCount = about.length;
  const aboutMaxChars = 300;

  return (
    <div className="min-h-screen bg-white">
      <AdminTopNav onMenuClick={handleSidebarToggle} />
      <AdminSidebarRetractable
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        activeMenu="michelle"
      />

      <main
        className={`
          mt-[72px] min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8
          transition-all duration-300
          ${sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[280px]"}
        `}
      >
        <div className="max-w-[900px]">
          {/* Back Navigation */}
          <Link
            to={`/admin/michelle-profiles/${profileId}/listings`}
            className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1F2937] hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Listings
          </Link>

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1F2937] mb-2">
              {isEditMode ? "Edit" : "Create"} Companionship Support Listing
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              Provide companion care and emotional support services
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Companion Photo */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6">
              <h2 className="text-lg font-bold text-[#1F2937] mb-4">Companion Photo</h2>
              <div className="space-y-4">
                {thumbnail ? (
                  <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
                    <img
                      src={thumbnail}
                      alt="Companion"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setThumbnail("")}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-[300px] border-2 border-dashed border-[#E5E7EB] rounded-lg cursor-pointer hover:border-[#1F2937] transition-colors">
                    <Upload className="w-12 h-12 text-[#9CA3AF] mb-4" />
                    <p className="text-sm text-[#6B7280] mb-1">Upload companion photo</p>
                    <p className="text-xs text-[#9CA3AF]">PNG, JPG up to 10MB</p>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6">
              <h2 className="text-lg font-bold text-[#1F2937] mb-4">Basic Information</h2>
              <div className="space-y-4">
                {/* Companion Name */}
                <div>
                  <Label htmlFor="companionName" className="text-sm font-semibold text-[#1F2937] mb-2">
                    Companion Name *
                  </Label>
                  <Input
                    id="companionName"
                    value={companionName}
                    onChange={(e) => setCompanionName(e.target.value)}
                    placeholder="e.g., Maria Garcia"
                    className="h-12"
                  />
                </div>

                {/* Years of Experience */}
                <div>
                  <Label htmlFor="yearsExperience" className="text-sm font-semibold text-[#1F2937] mb-2">
                    Years of Experience *
                  </Label>
                  <Input
                    id="yearsExperience"
                    type="number"
                    min="0"
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                    placeholder="e.g., 8"
                    className="h-12"
                  />
                </div>

                {/* Hourly Rate */}
                <div>
                  <Label htmlFor="hourlyRate" className="text-sm font-semibold text-[#1F2937] mb-2">
                    Price (Hourly Rate) *
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]">$</span>
                    <Input
                      id="hourlyRate"
                      type="number"
                      min="0"
                      step="0.01"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      placeholder="35.00"
                      className="h-12 pl-8 pr-16"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280]">/hour</span>
                  </div>
                </div>

                {/* About */}
                <div>
                  <Label htmlFor="about" className="text-sm font-semibold text-[#1F2937] mb-2">
                    About *
                  </Label>
                  <Textarea
                    id="about"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="e.g., Certified caregiver with extensive experience in senior care and companionship."
                    maxLength={aboutMaxChars}
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-[#6B7280] mt-1 text-right">
                    {aboutCharCount}/{aboutMaxChars} characters
                  </p>
                </div>
              </div>
            </div>

            {/* Certifications & Training */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6">
              <h2 className="text-lg font-bold text-[#1F2937] mb-4">Certifications & Training</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="cna"
                    checked={certifications.cna}
                    onCheckedChange={(checked) =>
                      setCertifications({ ...certifications, cna: checked as boolean })
                    }
                  />
                  <Label htmlFor="cna" className="text-sm text-[#1F2937] cursor-pointer">
                    Certified Nursing Assistant
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="cprFirstAid"
                    checked={certifications.cprFirstAid}
                    onCheckedChange={(checked) =>
                      setCertifications({ ...certifications, cprFirstAid: checked as boolean })
                    }
                  />
                  <Label htmlFor="cprFirstAid" className="text-sm text-[#1F2937] cursor-pointer">
                    CPR & First Aid
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="dementiaCareSpecialist"
                    checked={certifications.dementiaCare}
                    onCheckedChange={(checked) =>
                      setCertifications({ ...certifications, dementiaCare: checked as boolean })
                    }
                  />
                  <Label htmlFor="dementiaCareSpecialist" className="text-sm text-[#1F2937] cursor-pointer">
                    Dementia Care Specialist
                  </Label>
                </div>
                <div>
                  <Label htmlFor="otherCertification" className="text-sm font-semibold text-[#1F2937] mb-2">
                    Other
                  </Label>
                  <Input
                    id="otherCertification"
                    value={certifications.other}
                    onChange={(e) =>
                      setCertifications({ ...certifications, other: e.target.value })
                    }
                    placeholder="Enter additional certifications"
                    className="h-12"
                  />
                </div>
              </div>
            </div>

            {/* Specialties */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6">
              <h2 className="text-lg font-bold text-[#1F2937] mb-4">Specialties</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="dementiaCareSpecialty"
                    checked={specialties.dementiaCare}
                    onCheckedChange={(checked) =>
                      setSpecialties({ ...specialties, dementiaCare: checked as boolean })
                    }
                  />
                  <Label htmlFor="dementiaCareSpecialty" className="text-sm text-[#1F2937] cursor-pointer">
                    Dementia Care
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="mobilityAssistance"
                    checked={specialties.mobilityAssistance}
                    onCheckedChange={(checked) =>
                      setSpecialties({ ...specialties, mobilityAssistance: checked as boolean })
                    }
                  />
                  <Label htmlFor="mobilityAssistance" className="text-sm text-[#1F2937] cursor-pointer">
                    Mobility Assistance
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="medicationManagement"
                    checked={specialties.medicationManagement}
                    onCheckedChange={(checked) =>
                      setSpecialties({ ...specialties, medicationManagement: checked as boolean })
                    }
                  />
                  <Label htmlFor="medicationManagement" className="text-sm text-[#1F2937] cursor-pointer">
                    Medication Management
                  </Label>
                </div>
                <div>
                  <Label htmlFor="otherSpecialty" className="text-sm font-semibold text-[#1F2937] mb-2">
                    Other
                  </Label>
                  <Input
                    id="otherSpecialty"
                    value={specialties.other}
                    onChange={(e) =>
                      setSpecialties({ ...specialties, other: e.target.value })
                    }
                    placeholder="Enter additional specialties"
                    className="h-12"
                  />
                </div>
              </div>
            </div>

            {/* Type of Support Offered */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6">
              <h2 className="text-lg font-bold text-[#1F2937] mb-4">Type of Support Offered</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="conversation"
                    checked={supportTypes.conversation}
                    onCheckedChange={(checked) =>
                      setSupportTypes({ ...supportTypes, conversation: checked as boolean })
                    }
                  />
                  <Label htmlFor="conversation" className="text-sm text-[#1F2937] cursor-pointer">
                    Conversation & Social Interaction
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="activities"
                    checked={supportTypes.activities}
                    onCheckedChange={(checked) =>
                      setSupportTypes({ ...supportTypes, activities: checked as boolean })
                    }
                  />
                  <Label htmlFor="activities" className="text-sm text-[#1F2937] cursor-pointer">
                    Light Activities & Games
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="mealPrep"
                    checked={supportTypes.mealPrep}
                    onCheckedChange={(checked) =>
                      setSupportTypes({ ...supportTypes, mealPrep: checked as boolean })
                    }
                  />
                  <Label htmlFor="mealPrep" className="text-sm text-[#1F2937] cursor-pointer">
                    Meal Preparation Assistance
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="medicationReminders"
                    checked={supportTypes.medicationReminders}
                    onCheckedChange={(checked) =>
                      setSupportTypes({ ...supportTypes, medicationReminders: checked as boolean })
                    }
                  />
                  <Label htmlFor="medicationReminders" className="text-sm text-[#1F2937] cursor-pointer">
                    Medication Reminders
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="housekeeping"
                    checked={supportTypes.housekeeping}
                    onCheckedChange={(checked) =>
                      setSupportTypes({ ...supportTypes, housekeeping: checked as boolean })
                    }
                  />
                  <Label htmlFor="housekeeping" className="text-sm text-[#1F2937] cursor-pointer">
                    Light Housekeeping
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="errands"
                    checked={supportTypes.errands}
                    onCheckedChange={(checked) =>
                      setSupportTypes({ ...supportTypes, errands: checked as boolean })
                    }
                  />
                  <Label htmlFor="errands" className="text-sm text-[#1F2937] cursor-pointer">
                    Errands & Shopping
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="appointments"
                    checked={supportTypes.appointments}
                    onCheckedChange={(checked) =>
                      setSupportTypes({ ...supportTypes, appointments: checked as boolean })
                    }
                  />
                  <Label htmlFor="appointments" className="text-sm text-[#1F2937] cursor-pointer">
                    Accompaniment to Appointments
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="personalCare"
                    checked={supportTypes.personalCare}
                    onCheckedChange={(checked) =>
                      setSupportTypes({ ...supportTypes, personalCare: checked as boolean })
                    }
                  />
                  <Label htmlFor="personalCare" className="text-sm text-[#1F2937] cursor-pointer">
                    Personal Care Assistance
                  </Label>
                </div>
                <div>
                  <Label htmlFor="otherSupport" className="text-sm font-semibold text-[#1F2937] mb-2">
                    Other
                  </Label>
                  <Input
                    id="otherSupport"
                    value={supportTypes.other}
                    onChange={(e) =>
                      setSupportTypes({ ...supportTypes, other: e.target.value })
                    }
                    placeholder="Enter additional support types"
                    className="h-12"
                  />
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6">
              <h2 className="text-lg font-bold text-[#1F2937] mb-4">Languages</h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={customLanguage}
                    onChange={(e) => setCustomLanguage(e.target.value)}
                    placeholder="e.g., English, Spanish, French"
                    className="h-12"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addLanguage();
                      }
                    }}
                  />
                  <Button type="button" onClick={addLanguage} className="h-12 px-6">
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
                {languages.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {languages.map((lang) => (
                      <div
                        key={lang}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg"
                      >
                        <span className="text-sm text-[#1F2937]">{lang}</span>
                        <button
                          type="button"
                          onClick={() => removeLanguage(lang)}
                          className="text-[#6B7280] hover:text-[#1F2937]"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Image Gallery */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6">
              <h2 className="text-lg font-bold text-[#1F2937] mb-4">
                Image Gallery (Credentials & Certifications)
              </h2>
              <div className="space-y-4">
                <label className="flex flex-col items-center justify-center w-full h-[200px] border-2 border-dashed border-[#E5E7EB] rounded-lg cursor-pointer hover:border-[#1F2937] transition-colors">
                  <Upload className="w-10 h-10 text-[#9CA3AF] mb-3" />
                  <p className="text-sm text-[#6B7280] mb-1">Upload images</p>
                  <p className="text-xs text-[#9CA3AF]">PNG, JPG up to 10MB each</p>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageGalleryUpload}
                  />
                </label>

                {imageGallery.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {imageGallery.map((img, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                        <img
                          src={img}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removeGalleryImage(index)}
                          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-lg hover:bg-gray-100"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-8 border-t border-[#E5E7EB]">
              <Button
                variant="outline"
                onClick={() => navigate(`/admin/michelle-profiles/${profileId}/listings`)}
                className="h-11 px-6"
              >
                Cancel
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  className="h-11 px-6"
                >
                  Save Draft
                </Button>
                <Button onClick={handlePublish} className="h-11 px-6 bg-[#1F2937] hover:bg-[#374151]">
                  Publish
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
