import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X, Plus, Save, Send } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";

interface FormData {
  companionPhoto: string | null;
  companionName: string;
  yearsOfExperience: string;
  hourlyRate: string;
  about: string;
  certifications: string[];
  otherCertification: string;
  specialties: string[];
  otherSpecialty: string;
  supportTypes: string[];
  otherSupportType: string;
  languages: string[];
  credentialImages: string[];
}

interface VendorCompanionshipSupportFormProps {
  onSave: (data: any, isDraft: boolean) => void;
  initialData?: any;
  isEditing?: boolean;
}

export function VendorCompanionshipSupportForm({
  onSave,
  initialData,
  isEditing = false,
}: VendorCompanionshipSupportFormProps) {
  const navigate = useNavigate();
  const { storeId } = useParams();

  const [formData, setFormData] = useState<FormData>({
    companionPhoto: initialData?.companionPhoto || null,
    companionName: initialData?.title || "",
    yearsOfExperience: initialData?.yearsOfExperience?.toString() || "",
    hourlyRate: initialData?.price?.toString() || "",
    about: initialData?.description || "",
    certifications: initialData?.certifications || [],
    otherCertification: "",
    specialties: initialData?.specialties || [],
    otherSpecialty: "",
    supportTypes: initialData?.supportTypes || [],
    otherSupportType: "",
    languages: initialData?.languages || [],
    credentialImages: initialData?.credentialImages || [],
  });

  const [newLanguage, setNewLanguage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const certificationOptions = [
    "Certified Nursing Assistant",
    "CPR & First Aid",
    "Dementia Care Specialist",
  ];

  const specialtyOptions = [
    "Dementia Care",
    "Mobility Assistance",
    "Medication Management",
  ];

  const supportTypeOptions = [
    "Conversation & Social Interaction",
    "Light Activities & Games",
    "Meal Preparation Assistance",
    "Medication Reminders",
    "Light Housekeeping",
    "Errands & Shopping",
    "Accompaniment to Appointments",
    "Personal Care Assistance",
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxToggle = (field: "certifications" | "specialties" | "supportTypes", item: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter((i) => i !== item)
        : [...prev[field], item],
    }));
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()],
      }));
      setNewLanguage("");
    }
  };

  const handleRemoveLanguage = (language: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== language),
    }));
  };

  const handleImageUpload = () => {
    alert("Image upload functionality - to be implemented");
  };

  const handleCredentialImageAdd = () => {
    alert("Credential image upload functionality - to be implemented");
  };

  const handleRemoveCredentialImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      credentialImages: prev.credentialImages.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (isDraft: boolean) => {
    setIsSaving(true);

    const allCertifications = [
      ...formData.certifications,
      ...(formData.otherCertification ? [formData.otherCertification] : []),
    ];

    const allSpecialties = [
      ...formData.specialties,
      ...(formData.otherSpecialty ? [formData.otherSpecialty] : []),
    ];

    const allSupportTypes = [
      ...formData.supportTypes,
      ...(formData.otherSupportType ? [formData.otherSupportType] : []),
    ];

    const listingData = {
      id: isEditing ? initialData?.id : Date.now().toString(),
      title: formData.companionName,
      description: formData.about,
      yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
      price: parseFloat(formData.hourlyRate) || 0,
      certifications: allCertifications,
      specialties: allSpecialties,
      supportTypes: allSupportTypes,
      languages: formData.languages,
      bookings: initialData?.bookings || 0,
      bookingTrend: initialData?.bookingTrend || 0,
      status: isDraft ? "inactive" : "active",
      rating: initialData?.rating || 0,
      reviews: initialData?.reviews || 0,
      regions: initialData?.regions || 2,
      serviceRegions: initialData?.serviceRegions || ["New York, NY", "Brooklyn, NY"],
    };

    setTimeout(() => {
      setIsSaving(false);
      onSave(listingData, isDraft);
      navigate(`/vendor/services/${storeId}/listings`);
    }, 500);
  };

  return (
    <div className="max-w-[900px] mx-auto">
      <button
        onClick={() => navigate(`/vendor/services/${storeId}/listings`)}
        className="flex items-center gap-2 text-[#6B7280] hover:text-[#1F2937] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Listings</span>
      </button>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1F2937] mb-2">
          {isEditing ? "Edit Companion Profile" : "Create New Companion Profile"}
        </h1>
        <p className="text-sm sm:text-[15px] text-[#6B7280]">
          {isEditing
            ? "Update your companion profile details"
            : "Add a new companion profile to your store"}
        </p>
      </div>

      {/* Basic Information */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 mb-6">
        <h2 className="text-xl font-bold text-[#1F2937] mb-6">
          Companion Information
        </h2>

        <div className="space-y-6">
          {/* Companion Photo */}
          <div>
            <Label className="mb-1.5">Companion Photo</Label>
            <p className="text-xs text-[#6B7280] mb-3">PNG or JPG, max 10MB</p>
            <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-8 text-center hover:border-[#9CA3AF] transition-colors">
              <Upload className="w-8 h-8 text-[#9CA3AF] mx-auto mb-3" />
              <Button type="button" variant="outline" onClick={handleImageUpload}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
              <p className="text-xs text-[#6B7280] mt-2">
                {formData.companionPhoto ? "Image uploaded" : "No image selected"}
              </p>
            </div>
          </div>

          {/* Companion Name */}
          <div>
            <Label htmlFor="companionName" className="mb-1.5">
              Companion Name <span className="text-[#DC2626]">*</span>
            </Label>
            <Input
              id="companionName"
              type="text"
              value={formData.companionName}
              onChange={(e) => handleInputChange("companionName", e.target.value)}
              placeholder="e.g., Sarah Johnson"
            />
          </div>

          {/* Years of Experience */}
          <div>
            <Label htmlFor="yearsOfExperience" className="mb-1.5">
              Years of Experience <span className="text-[#DC2626]">*</span>
            </Label>
            <Input
              id="yearsOfExperience"
              type="number"
              value={formData.yearsOfExperience}
              onChange={(e) => handleInputChange("yearsOfExperience", e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>

          {/* Price (Hourly Rate) */}
          <div>
            <Label htmlFor="hourlyRate" className="mb-1.5">
              Price (Hourly Rate) <span className="text-[#DC2626]">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
                $
              </span>
              <Input
                id="hourlyRate"
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
                placeholder="0.00"
                className="pl-7 pr-16"
                min="0"
                step="0.01"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
                /hour
              </span>
            </div>
          </div>

          {/* About */}
          <div>
            <Label htmlFor="about" className="mb-1.5">
              About <span className="text-[#DC2626]">*</span>
            </Label>
            <p className="text-xs text-[#6B7280] mb-2">Maximum 300 characters</p>
            <Textarea
              id="about"
              value={formData.about}
              onChange={(e) =>
                handleInputChange("about", e.target.value.slice(0, 300))
              }
              placeholder="Brief description about the companion"
              rows={4}
              maxLength={300}
            />
            <p className="text-xs text-[#9CA3AF] mt-1 text-right">
              {formData.about.length}/300
            </p>
          </div>

          {/* Certifications & Training */}
          <div>
            <Label className="mb-1.5">Certifications & Training</Label>
            <div className="space-y-3 mb-3">
              {certificationOptions.map((cert) => (
                <div key={cert} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id={`cert-${cert}`}
                    checked={formData.certifications.includes(cert)}
                    onChange={() => handleCheckboxToggle("certifications", cert)}
                    className="mt-1 w-4 h-4 rounded border-[#D1D5DB] text-[#1F2937] focus:ring-[#1F2937]"
                  />
                  <Label
                    htmlFor={`cert-${cert}`}
                    className="font-normal cursor-pointer"
                  >
                    {cert}
                  </Label>
                </div>
              ))}
            </div>
            <div>
              <Label htmlFor="otherCertification" className="mb-1.5 text-sm text-[#6B7280]">
                Other
              </Label>
              <Input
                id="otherCertification"
                type="text"
                value={formData.otherCertification}
                onChange={(e) => handleInputChange("otherCertification", e.target.value)}
                placeholder="Additional certifications"
              />
            </div>
          </div>

          {/* Specialties */}
          <div>
            <Label className="mb-1.5">Specialties</Label>
            <div className="space-y-3 mb-3">
              {specialtyOptions.map((spec) => (
                <div key={spec} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id={`spec-${spec}`}
                    checked={formData.specialties.includes(spec)}
                    onChange={() => handleCheckboxToggle("specialties", spec)}
                    className="mt-1 w-4 h-4 rounded border-[#D1D5DB] text-[#1F2937] focus:ring-[#1F2937]"
                  />
                  <Label
                    htmlFor={`spec-${spec}`}
                    className="font-normal cursor-pointer"
                  >
                    {spec}
                  </Label>
                </div>
              ))}
            </div>
            <div>
              <Label htmlFor="otherSpecialty" className="mb-1.5 text-sm text-[#6B7280]">
                Other
              </Label>
              <Input
                id="otherSpecialty"
                type="text"
                value={formData.otherSpecialty}
                onChange={(e) => handleInputChange("otherSpecialty", e.target.value)}
                placeholder="Additional specialties"
              />
            </div>
          </div>

          {/* Type of Support Offered */}
          <div>
            <Label className="mb-1.5">Type of Support Offered</Label>
            <div className="space-y-3 mb-3">
              {supportTypeOptions.map((support) => (
                <div key={support} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id={`support-${support}`}
                    checked={formData.supportTypes.includes(support)}
                    onChange={() => handleCheckboxToggle("supportTypes", support)}
                    className="mt-1 w-4 h-4 rounded border-[#D1D5DB] text-[#1F2937] focus:ring-[#1F2937]"
                  />
                  <Label
                    htmlFor={`support-${support}`}
                    className="font-normal cursor-pointer"
                  >
                    {support}
                  </Label>
                </div>
              ))}
            </div>
            <div>
              <Label htmlFor="otherSupportType" className="mb-1.5 text-sm text-[#6B7280]">
                Other
              </Label>
              <Input
                id="otherSupportType"
                type="text"
                value={formData.otherSupportType}
                onChange={(e) => handleInputChange("otherSupportType", e.target.value)}
                placeholder="Additional support types"
              />
            </div>
          </div>

          {/* Languages */}
          <div>
            <Label className="mb-1.5">Languages</Label>
            <p className="text-xs text-[#6B7280] mb-3">
              Add languages spoken by the companion
            </p>
            <div className="space-y-3 mb-3">
              {formData.languages.map((language) => (
                <div
                  key={language}
                  className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-lg"
                >
                  <span className="flex-1 text-sm text-[#1F2937]">{language}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveLanguage(language)}
                  >
                    <X className="w-4 h-4 text-[#DC2626]" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                placeholder="e.g., English"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddLanguage();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={handleAddLanguage}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Image Gallery (Credentials & Certifications) */}
          <div>
            <Label className="mb-1.5">
              Image Gallery (Credentials & Certifications)
            </Label>
            <p className="text-xs text-[#6B7280] mb-3">
              Multiple images (PNG/JPG, max 10MB each)
            </p>
            <div className="space-y-3">
              {formData.credentialImages.map((image, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 border border-[#E5E7EB] rounded-lg"
                >
                  <div className="w-12 h-12 bg-[#F3F4F6] rounded flex items-center justify-center">
                    <Upload className="w-5 h-5 text-[#9CA3AF]" />
                  </div>
                  <span className="flex-1 text-sm text-[#6B7280]">
                    Credential Image {index + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCredentialImage(index)}
                  >
                    <X className="w-4 h-4 text-[#DC2626]" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={handleCredentialImageAdd}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Credential Image ({formData.credentialImages.length})
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pb-8">
        <Button
          variant="outline"
          onClick={() => handleSave(true)}
          disabled={isSaving}
          className="flex-1"
        >
          <Save className="w-4 h-4 mr-2" />
          Save as Draft
        </Button>
        <Button
          onClick={() => handleSave(false)}
          disabled={isSaving}
          className="flex-1 bg-[#1F2937] hover:bg-[#111827]"
        >
          <Send className="w-4 h-4 mr-2" />
          Publish
        </Button>
      </div>
    </div>
  );
}
