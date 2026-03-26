import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  GripVertical,
  Plus,
  Save,
  Check,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { AdminSidebarRetractable } from "./AdminSidebarRetractable";
import { AdminTopNav } from "./AdminTopNav";

interface ImageFile {
  id: string;
  url: string;
  file?: File;
}

interface WhatsIncludedItem {
  id: string;
  text: string;
  checked: boolean;
}

const DEFAULT_INCLUDED_ITEMS: WhatsIncludedItem[] = [
  { id: "1", text: "Professional equipment & supplies", checked: true },
  { id: "2", text: "Trained professionals", checked: true },
  { id: "3", text: "Eco-friendly products available", checked: true },
  { id: "4", text: "Quality guarantee", checked: true },
];

export function CleaningServiceForm() {
  const navigate = useNavigate();
  const { profileId, listingId } = useParams();
  const isEditing = !!listingId;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Form state
  const [thumbnail, setThumbnail] = useState<ImageFile | null>(null);
  const [serviceTitle, setServiceTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [imageGallery, setImageGallery] = useState<ImageFile[]>([]);
  const [longDescription, setLongDescription] = useState("");
  const [pricingType, setPricingType] = useState("fixed");
  const [price, setPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [whatsIncluded, setWhatsIncluded] = useState<WhatsIncludedItem[]>(DEFAULT_INCLUDED_ITEMS);
  const [customItem, setCustomItem] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [galleryDragOver, setGalleryDragOver] = useState(false);

  const handleSidebarToggle = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleThumbnailUpload = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setThumbnail({ id: Date.now().toString(), url, file });
    }
  };

  const handleGalleryUpload = (files: FileList | null) => {
    if (files && imageGallery.length < 5) {
      const newImages: ImageFile[] = [];
      const remainingSlots = 5 - imageGallery.length;
      const filesToAdd = Math.min(files.length, remainingSlots);

      for (let i = 0; i < filesToAdd; i++) {
        const file = files[i];
        const url = URL.createObjectURL(file);
        newImages.push({ id: Date.now().toString() + i, url, file });
      }

      setImageGallery([...imageGallery, ...newImages]);
    }
  };

  const removeGalleryImage = (id: string) => {
    setImageGallery(imageGallery.filter((img) => img.id !== id));
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newGallery = [...imageGallery];
    const [movedItem] = newGallery.splice(fromIndex, 1);
    newGallery.splice(toIndex, 0, movedItem);
    setImageGallery(newGallery);
  };

  const toggleIncludedItem = (id: string) => {
    setWhatsIncluded(
      whatsIncluded.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const addCustomItem = () => {
    if (customItem.trim()) {
      setWhatsIncluded([
        ...whatsIncluded,
        {
          id: Date.now().toString(),
          text: customItem.trim(),
          checked: true,
        },
      ]);
      setCustomItem("");
    }
  };

  const handleSaveDraft = () => {
    // Mock save draft
    console.log("Saving draft...");
    navigate(`/admin/michelle-profiles/${profileId}/listings`);
  };

  const handlePublish = () => {
    // Mock publish
    console.log("Publishing service...");
    navigate(`/admin/michelle-profiles/${profileId}/listings`);
  };

  return (
    <div className="min-h-screen bg-white">
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
          <h1 className="text-[32px] font-bold text-[#1F2937] mb-2">
            {isEditing ? "Edit Service" : "Create New Service"}
          </h1>
          <p className="text-[15px] text-[#6B7280] mb-8">
            Complete the form below to {isEditing ? "update" : "create"} your cleaning service listing
          </p>

          {/* Form */}
          <div className="space-y-8">
            {/* Thumbnail Upload */}
            <div>
              <Label className="text-sm font-semibold text-[#1F2937] mb-2 block">
                Service Thumbnail *
              </Label>
              <p className="text-[13px] text-[#6B7280] mb-3">
                This image will appear as the main thumbnail on your listing card
              </p>
              <div
                className={`
                  border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                  transition-all
                  ${isDragOver ? "border-[#1F2937] bg-[#F8F9FA]" : "border-[#E5E7EB] hover:border-[#9CA3AF]"}
                `}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  handleThumbnailUpload(e.dataTransfer.files);
                }}
                onClick={() => document.getElementById("thumbnail-upload")?.click()}
              >
                {thumbnail ? (
                  <div className="relative inline-block">
                    <img
                      src={thumbnail.url}
                      alt="Thumbnail"
                      className="w-[200px] h-[200px] rounded-lg object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setThumbnail(null);
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-[#DC2626] text-white rounded-full flex items-center justify-center hover:bg-[#B91C1C] transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
                    <p className="text-base font-semibold text-[#1F2937] mb-1">
                      Drag and drop or click to upload
                    </p>
                    <p className="text-[13px] text-[#6B7280]">
                      JPG or PNG • Max 5MB
                    </p>
                  </>
                )}
                <input
                  id="thumbnail-upload"
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={(e) => handleThumbnailUpload(e.target.files)}
                />
              </div>
            </div>

            {/* Service Title */}
            <div>
              <Label htmlFor="service-title" className="text-sm font-semibold text-[#1F2937] mb-2 block">
                Service Title *
              </Label>
              <Input
                id="service-title"
                value={serviceTitle}
                onChange={(e) => setServiceTitle(e.target.value.slice(0, 60))}
                placeholder="e.g., Residential Deep Cleaning"
                className="h-12 text-base"
                maxLength={60}
              />
              <p className="text-[13px] text-[#6B7280] mt-1.5 text-right">
                {serviceTitle.length}/60 characters
              </p>
            </div>

            {/* Short Description */}
            <div>
              <Label htmlFor="short-desc" className="text-sm font-semibold text-[#1F2937] mb-2 block">
                Short Description *
              </Label>
              <p className="text-[13px] text-[#6B7280] mb-3">
                Brief summary that appears on the listing card preview
              </p>
              <Textarea
                id="short-desc"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value.slice(0, 150))}
                placeholder="Provide a brief summary of your service..."
                className="min-h-[80px] text-base resize-none"
                maxLength={150}
              />
              <p className="text-[13px] text-[#6B7280] mt-1.5 text-right">
                {shortDescription.length}/150 characters
              </p>
            </div>

            {/* Image Gallery */}
            <div>
              <Label className="text-sm font-semibold text-[#1F2937] mb-2 block">
                Image Gallery (Optional)
              </Label>
              <p className="text-[13px] text-[#6B7280] mb-3">
                Upload up to 5 images • Drag to reorder
              </p>

              {/* Gallery Grid */}
              <div className="grid grid-cols-5 gap-3 mb-3">
                {imageGallery.map((image, index) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt={`Gallery ${index + 1}`}
                      className="w-full aspect-square rounded-lg object-cover"
                    />
                    <button
                      onClick={() => removeGalleryImage(image.id)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#DC2626] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="absolute top-1.5 left-1.5 w-5 h-5 bg-[#1F2937]/60 text-white rounded flex items-center justify-center cursor-move">
                      <GripVertical className="w-3 h-3" />
                    </div>
                  </div>
                ))}

                {/* Upload Slot */}
                {imageGallery.length < 5 && (
                  <div
                    className={`
                      aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all
                      ${galleryDragOver ? "border-[#1F2937] bg-[#F8F9FA]" : "border-[#E5E7EB] hover:border-[#9CA3AF]"}
                    `}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setGalleryDragOver(true);
                    }}
                    onDragLeave={() => setGalleryDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setGalleryDragOver(false);
                      handleGalleryUpload(e.dataTransfer.files);
                    }}
                    onClick={() => document.getElementById("gallery-upload")?.click()}
                  >
                    <ImageIcon className="w-6 h-6 text-[#9CA3AF] mb-1" />
                    <p className="text-[11px] text-[#9CA3AF] text-center px-1">
                      Upload
                    </p>
                  </div>
                )}
              </div>

              <input
                id="gallery-upload"
                type="file"
                accept="image/jpeg,image/png"
                multiple
                className="hidden"
                onChange={(e) => handleGalleryUpload(e.target.files)}
              />

              <p className="text-[13px] text-[#6B7280]">
                {imageGallery.length}/5 images uploaded
              </p>
            </div>

            {/* Long Description */}
            <div>
              <Label htmlFor="long-desc" className="text-sm font-semibold text-[#1F2937] mb-2 block">
                Full Description *
              </Label>
              <p className="text-[13px] text-[#6B7280] mb-3">
                Complete details about your service, what's included, and what customers can expect
              </p>
              <Textarea
                id="long-desc"
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value.slice(0, 500))}
                placeholder="Provide a detailed description of your service..."
                className="min-h-[160px] text-base resize-none"
                maxLength={500}
              />
              <p className="text-[13px] text-[#6B7280] mt-1.5 text-right">
                {longDescription.length}/500 characters
              </p>
            </div>

            {/* Pricing */}
            <div>
              <Label className="text-sm font-semibold text-[#1F2937] mb-3 block">
                Pricing *
              </Label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Pricing Type */}
                <div className="md:col-span-3">
                  <Label className="text-[13px] text-[#6B7280] mb-2 block">
                    Pricing Type
                  </Label>
                  <Select value={pricingType} onValueChange={setPricingType}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Pricing</SelectItem>
                      <SelectItem value="hourly">Hourly Rate</SelectItem>
                      <SelectItem value="range">Price Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Base Price */}
                <div className={pricingType === "range" ? "md:col-span-1" : "md:col-span-3"}>
                  <Label className="text-[13px] text-[#6B7280] mb-2 block">
                    {pricingType === "range" ? "Starting Price" : "Price"}
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base text-[#6B7280]">
                      $
                    </span>
                    <Input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="h-11 pl-8 text-base"
                    />
                  </div>
                </div>

                {/* Max Price (for range) */}
                {pricingType === "range" && (
                  <div className="md:col-span-1">
                    <Label className="text-[13px] text-[#6B7280] mb-2 block">
                      Maximum Price
                    </Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base text-[#6B7280]">
                        $
                      </span>
                      <Input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="0.00"
                        className="h-11 pl-8 text-base"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* What's Included */}
            <div>
              <Label className="text-sm font-semibold text-[#1F2937] mb-3 block">
                What's Included
              </Label>

              <div className="space-y-3">
                {whatsIncluded.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <Checkbox
                      id={`included-${item.id}`}
                      checked={item.checked}
                      onCheckedChange={() => toggleIncludedItem(item.id)}
                    />
                    <Label
                      htmlFor={`included-${item.id}`}
                      className="text-[15px] text-[#1F2937] cursor-pointer flex-1"
                    >
                      {item.text}
                    </Label>
                  </div>
                ))}
              </div>

              {/* Add Custom Item */}
              <div className="mt-4 flex gap-2">
                <Input
                  value={customItem}
                  onChange={(e) => setCustomItem(e.target.value)}
                  placeholder="Add custom item..."
                  className="h-10 text-[15px]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomItem();
                    }
                  }}
                />
                <Button
                  onClick={addCustomItem}
                  variant="outline"
                  className="h-10 px-4 shrink-0"
                  disabled={!customItem.trim()}
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-[#E5E7EB]">
              <Button
                onClick={handleSaveDraft}
                variant="outline"
                className="h-12 px-6 text-base font-semibold"
              >
                <Save className="w-[18px] h-[18px] mr-2" />
                Save as Draft
              </Button>
              <Button
                onClick={handlePublish}
                className="h-12 px-8 bg-[#10B981] hover:bg-[#059669] text-white text-base font-semibold ml-auto"
              >
                <Check className="w-[18px] h-[18px] mr-2" />
                Publish Service
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}