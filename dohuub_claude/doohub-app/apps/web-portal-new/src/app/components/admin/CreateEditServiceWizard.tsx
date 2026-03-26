import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../../../services/api";
import {
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  GripVertical,
  Eye,
  Save,
  CheckCircle2,
  Plus,
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
import { Calendar } from "../ui/calendar";
import { AdminSidebarRetractable } from "./AdminSidebarRetractable";
import { AdminTopNav } from "./AdminTopNav";
import { CompanionshipSupportForm } from "./CompanionshipSupportForm";

interface ImageFile {
  id: string;
  url: string;
  file?: File;
}

interface IncludedItem {
  id: string;
  text: string;
  isCustom: boolean;
}

const DEFAULT_INCLUDED_ITEMS: IncludedItem[] = [
  { id: "1", text: "Professional equipment & supplies", isCustom: false },
  { id: "2", text: "Trained professionals", isCustom: false },
  { id: "3", text: "Eco-friendly products available", isCustom: false },
  { id: "4", text: "Quality guarantee", isCustom: false },
];

const HANDYMAN_INCLUDED_ITEMS: IncludedItem[] = [
  { id: "1", text: "Tools & equipment provided", isCustom: false },
  { id: "2", text: "Skilled handyman professional", isCustom: false },
  { id: "3", text: "Quality workmanship guarantee", isCustom: false },
  { id: "4", text: "Clean-up after service", isCustom: false },
  { id: "5", text: "Parts & materials sourcing", isCustom: false },
];

const BEAUTY_SERVICES_INCLUDED_ITEMS: IncludedItem[] = [
  { id: "1", text: "Professional beauty products", isCustom: false },
  { id: "2", text: "Certified beauty specialist", isCustom: false },
  { id: "3", text: "Clean & hygienic setup", isCustom: false },
];

export function CreateEditServiceWizard() {
  const navigate = useNavigate();
  const { profileId, listingId } = useParams();
  const isEditing = !!listingId;

  // Check if this is a Companionship Support profile and route to specialized form
  const isCompanionshipSupportProfile = profileId === "32" || profileId === "33" || profileId === "34";
  
  if (isCompanionshipSupportProfile) {
    return <CompanionshipSupportForm />;
  }

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== 'undefined' && window.innerWidth >= 1024 ? false : true
  );

  // Profile and region state (fetched from API)
  const [profileInfo, setProfileInfo] = useState<{ name: string; category: string }>({ name: "", category: "" });
  const [vendorRegions, setVendorRegions] = useState<string[]>([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Fetch profile info from API
  useEffect(() => {
    const fetchProfileInfo = async () => {
      if (!profileId) return;
      setIsLoadingProfile(true);
      try {
        const response: any = await api.get(`/admin/michelle-profiles/${profileId}`);
        const profile = response?.data || response;
        setProfileInfo({
          name: profile.businessName || profile.name || 'Unknown Profile',
          category: profile.category || 'General',
        });
        // Fetch vendor regions from the profile
        const regionData = profile.regions || [];
        setVendorRegions(Array.isArray(regionData)
          ? regionData.map((r: any) => typeof r === 'string' ? r : r.name || `${r.city}, ${r.state}`)
          : []);
      } catch (err) {
        console.error('Failed to fetch profile info:', err);
        setProfileInfo({ name: 'Unknown Profile', category: 'General' });
      } finally {
        setIsLoadingProfile(false);
      }
    };
    fetchProfileInfo();
  }, [profileId]);

  const profileName = profileInfo.name;
  const profileCategory = profileInfo.category;

  // Determine profile type based on category from API
  const isCleaningProfile = profileCategory === "Cleaning Services";
  const isHandymanProfile = profileCategory === "Handyman Services";
  const isBeautyServicesProfile = profileCategory === "Beauty Services";
  const isBeautyProductsProfile = profileCategory === "Beauty Products";
  const isGroceryProfile = profileCategory === "Grocery";
  const isFoodProfile = profileCategory === "Food";
  const isRentalPropertiesProfile = profileCategory === "Rental Properties";
  const isRideAssistanceProfile = profileCategory === "Ride Assistance";
  
  // Select default items based on category
  const getDefaultItems = () => {
    if (isHandymanProfile) return HANDYMAN_INCLUDED_ITEMS;
    if (isBeautyServicesProfile) return BEAUTY_SERVICES_INCLUDED_ITEMS;
    return DEFAULT_INCLUDED_ITEMS;
  };
  
  const getDefaultSelectedIds = () => {
    if (isHandymanProfile) return ["1", "2", "3", "4", "5"];
    if (isBeautyServicesProfile) return ["1", "2", "3"];
    return ["1", "2", "3", "4"];
  };
  
  const defaultItems = getDefaultItems();
  const defaultSelectedIds = getDefaultSelectedIds();

  // Form state
  const [thumbnail, setThumbnail] = useState<ImageFile | null>(null);
  const [serviceTitle, setServiceTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [imageGallery, setImageGallery] = useState<ImageFile[]>([]);
  const [longDescription, setLongDescription] = useState("");
  const [pricingType, setPricingType] = useState(isHandymanProfile ? "hourly" : "fixed");
  const [price, setPrice] = useState("");
  const [durationType, setDurationType] = useState<"fixed" | "variable">("fixed");
  const [duration, setDuration] = useState("");
  const [includedItems, setIncludedItems] = useState<IncludedItem[]>(defaultItems);
  const [selectedItems, setSelectedItems] = useState<string[]>(defaultSelectedIds);
  const [customItemText, setCustomItemText] = useState("");

  // Beauty Products and Grocery specific state
  const [productCategory, setProductCategory] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [quantityUnit, setQuantityUnit] = useState(isGroceryProfile ? "lb" : "ml");

  // Food specific state
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [portionSize, setPortionSize] = useState("");

  // Rental Properties specific state
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [totalArea, setTotalArea] = useState("");
  const [areaUnit, setAreaUnit] = useState("ft²");
  const [pricePerNight, setPricePerNight] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [houseRules, setHouseRules] = useState("");
  const [cleaningFee, setCleaningFee] = useState("");
  const [serviceFee, setServiceFee] = useState("");
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);

  // Ride Assistance specific state
  const [hourlyRate, setHourlyRate] = useState("");
  const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);
  const [specialFeatures, setSpecialFeatures] = useState("");
  const [coverageArea, setCoverageArea] = useState("");
  const [totalSeats, setTotalSeats] = useState("");

  const handleSidebarToggle = () => {
    if (window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail({
          id: Date.now().toString(),
          url: reader.result as string,
          file,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 5 - imageGallery.length;
    const filesToAdd = files.slice(0, remainingSlots);

    filesToAdd.forEach(file => {
      if (file.size <= 5 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newImage: ImageFile = {
            id: Date.now().toString() + Math.random(),
            url: reader.result as string,
            file,
          };
          setImageGallery(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeGalleryImage = (id: string) => {
    setImageGallery(imageGallery.filter(img => img.id !== id));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newGallery = [...imageGallery];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < imageGallery.length) {
      [newGallery[index], newGallery[newIndex]] = [newGallery[newIndex], newGallery[index]];
      setImageGallery(newGallery);
    }
  };

  const toggleIncludedItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const addCustomItem = () => {
    if (customItemText.trim()) {
      const newItem: IncludedItem = {
        id: Date.now().toString(),
        text: customItemText.trim(),
        isCustom: true,
      };
      setIncludedItems([...includedItems, newItem]);
      setSelectedItems([...selectedItems, newItem.id]);
      setCustomItemText("");
    }
  };

  const removeCustomItem = (id: string) => {
    setIncludedItems(includedItems.filter(item => item.id !== id));
    setSelectedItems(selectedItems.filter(itemId => itemId !== id));
  };

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Get listing type based on profile
  const getListingType = () => {
    if (isCleaningProfile) return 'cleaning';
    if (isHandymanProfile) return 'handyman';
    if (isBeautyServicesProfile) return 'beauty';
    if (isBeautyProductsProfile) return 'beauty-products';
    if (isGroceryProfile) return 'groceries';
    if (isFoodProfile) return 'food';
    if (isRentalPropertiesProfile) return 'rentals';
    if (isRideAssistanceProfile) return 'ride-assistance';
    return 'cleaning'; // default
  };

  // Build listing data based on type
  const buildListingData = (status: 'DRAFT' | 'ACTIVE') => {
    const listingType = getListingType();
    const images = imageGallery.map(img => img.url);

    const baseData = {
      title: serviceTitle || itemName,
      description: longDescription || shortDescription,
      images,
      status,
    };

    switch (listingType) {
      case 'cleaning':
        return {
          ...baseData,
          cleaningType: productCategory || 'STANDARD',
          basePrice: parseFloat(price) || 0,
          duration: parseInt(duration) || 120,
        };
      case 'handyman':
        return {
          ...baseData,
          serviceType: productCategory || 'GENERAL',
          basePrice: parseFloat(price) || parseFloat(hourlyRate) || 0,
        };
      case 'beauty':
        return {
          ...baseData,
          serviceType: productCategory || 'GENERAL',
          basePrice: parseFloat(price) || 0,
          duration: parseInt(duration) || 60,
        };
      case 'groceries':
        return {
          name: itemName || serviceTitle,
          description: longDescription || shortDescription,
          category: productCategory || 'GENERAL',
          price: parseFloat(price) || 0,
          images,
        };
      case 'food':
        return {
          ...baseData,
          foodType: productCategory || 'MEAL',
          basePrice: parseFloat(price) || 0,
          cuisines: cuisines,
        };
      case 'rentals':
        return {
          ...baseData,
          propertyType: propertyType || 'APARTMENT',
          pricePerMonth: parseFloat(pricePerNight) || parseFloat(price) || 0,
          bedrooms: parseInt(bedrooms) || 1,
          bathrooms: parseInt(bathrooms) || 1,
          location,
          amenities,
        };
      case 'ride-assistance':
        return {
          ...baseData,
          vehicleType: vehicleTypes[0] || 'SEDAN',
          pricePerKm: parseFloat(hourlyRate) || parseFloat(price) || 0,
        };
      default:
        return baseData;
    }
  };

  const handleSaveAsDraft = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const listingType = getListingType();
      const data = buildListingData('DRAFT');

      console.log('[Listing] Saving draft:', { type: listingType, data });

      if (isEditing && listingId) {
        await api.updateListing(listingType, listingId, data);
      } else {
        await api.createListing(listingType, data);
      }

      navigate(`/admin/michelle-profiles/${profileId}/listings`);
    } catch (error: any) {
      console.error('[Listing] Save error:', error);
      setSaveError(error?.response?.data?.error || error?.message || 'Failed to save listing');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const listingType = getListingType();
      const data = buildListingData('ACTIVE');

      console.log('[Listing] Publishing:', { type: listingType, data });

      if (isEditing && listingId) {
        await api.updateListing(listingType, listingId, data);
      } else {
        await api.createListing(listingType, data);
      }

      navigate(`/admin/michelle-profiles/${profileId}/listings`);
    } catch (error: any) {
      console.error('[Listing] Publish error:', error);
      setSaveError(error?.response?.data?.error || error?.message || 'Failed to publish listing');
    } finally {
      setIsSaving(false);
    }
  };

  const titleCharCount = serviceTitle.length;
  const shortDescCharCount = shortDescription.length;
  const longDescCharCount = longDescription.length;

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
          ${sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[280px]'}
        `}
      >
        <div className="max-w-[900px] mx-auto">
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
            {isEditing 
              ? isRentalPropertiesProfile ? "Edit Property" : (isBeautyProductsProfile || isGroceryProfile || isFoodProfile) ? "Edit Product" : "Edit Service"
              : isRentalPropertiesProfile ? "Add New Property" : (isBeautyProductsProfile || isGroceryProfile || isFoodProfile) ? "Create New Product" : "Create New Service"
            }
          </h1>
          <p className="text-base text-[#6B7280] mb-8">
            Profile: <span className="font-semibold text-[#1F2937]">{profileName}</span> • Category: <span className="font-semibold text-[#1F2937]">{profileCategory}</span>
          </p>

          {/* Form - Beauty Products */}
          {isBeautyProductsProfile ? (
            <div className="space-y-8">
              {/* Thumbnail Upload */}
              <div>
                <Label className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Product Thumbnail *
                </Label>
                <p className="text-sm text-[#6B7280] mb-4">
                  Main product image. JPG or PNG, max 5MB.
                </p>
                {thumbnail ? (
                  <div className="relative w-full h-[240px] border border-[#E5E7EB] rounded-xl overflow-hidden">
                    <img
                      src={thumbnail.url}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setThumbnail(null)}
                      className="absolute top-3 right-3 w-8 h-8 bg-[#1F2937] hover:bg-[#111827] text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="w-full h-[240px] border-2 border-dashed border-[#E5E7EB] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#1F2937] hover:bg-[#F8F9FA] transition-all">
                    <Upload className="w-10 h-10 text-[#9CA3AF] mb-3" />
                    <p className="text-base font-semibold text-[#1F2937] mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-[#6B7280]">
                      JPG or PNG (max 5MB)
                    </p>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Shop Name (Read-only) */}
              <div>
                <Label htmlFor="shopName" className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Shop Name
                </Label>
                <div className="h-12 px-4 border border-[#E5E7EB] rounded-lg bg-[#F8F9FA] flex items-center text-[#1F2937]">
                  {profileName}
                </div>
                <p className="text-sm text-[#6B7280] mt-2">
                  This is auto-filled from your store profile
                </p>
              </div>

              {/* Product Category Dropdown */}
              <div>
                <Label htmlFor="productCategory" className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Product Category *
                </Label>
                <Select value={productCategory} onValueChange={setProductCategory}>
                  <SelectTrigger id="productCategory" className="h-12">
                    <SelectValue placeholder="Select a category..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Skincare">Skincare</SelectItem>
                    <SelectItem value="Haircare">Haircare</SelectItem>
                    <SelectItem value="Makeup">Makeup</SelectItem>
                    <SelectItem value="Fragrance">Fragrance</SelectItem>
                    <SelectItem value="Body Care">Body Care</SelectItem>
                    <SelectItem value="Tools">Tools & Accessories</SelectItem>
                    <SelectItem value="Personal Care">Personal Care</SelectItem>
                    <SelectItem value="Sets">Gift Sets</SelectItem>
                    <SelectItem value="Wellness">Wellness</SelectItem>
                    <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Item Name */}
              <div>
                <Label htmlFor="itemName" className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Item Name *
                </Label>
                <Input
                  id="itemName"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value.slice(0, 60))}
                  placeholder="e.g., HD Foundation"
                  className="h-12 text-base"
                  maxLength={60}
                />
                <p className="text-sm text-[#6B7280] mt-2">
                  {itemName.length}/60 characters
                </p>
              </div>

              {/* Short Description */}
              <div>
                <Label htmlFor="shortDescription" className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Short Description *
                </Label>
                <Textarea
                  id="shortDescription"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value.slice(0, 150))}
                  placeholder="e.g., Full coverage liquid foundation"
                  className="min-h-[100px] text-base resize-none"
                  maxLength={150}
                />
                <p className="text-sm text-[#6B7280] mt-2">
                  {shortDescription.length}/150 characters
                </p>
              </div>

              {/* Quantity with Unit Selector */}
              <div>
                <Label className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Quantity *
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity" className="text-sm text-[#6B7280] mb-2 block">
                      Amount
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="30"
                      className="h-12 text-base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantityUnit" className="text-sm text-[#6B7280] mb-2 block">
                      Unit
                    </Label>
                    <Select value={quantityUnit} onValueChange={setQuantityUnit}>
                      <SelectTrigger id="quantityUnit" className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ml">ml (Milliliter)</SelectItem>
                        <SelectItem value="oz">oz (Ounce)</SelectItem>
                        <SelectItem value="g">g (Gram)</SelectItem>
                        <SelectItem value="kg">kg (Kilogram)</SelectItem>
                        <SelectItem value="lb">lb (Pound)</SelectItem>
                        <SelectItem value="count">Count/Pieces</SelectItem>
                        <SelectItem value="set">Set</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <p className="text-sm text-[#6B7280] mt-2">
                  Example: 30ml, 1oz, 50g
                </p>
              </div>

              {/* Price */}
              <div>
                <Label htmlFor="price" className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Price *
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] font-semibold">
                    $
                  </span>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="35.99"
                    className="h-12 pl-8 text-base"
                  />
                </div>
                <p className="text-sm text-[#6B7280] mt-2">
                  Enter the price per item
                </p>
              </div>

              {/* Image Gallery */}
              <div>
                <Label className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Product Images (Up to 5 images)
                </Label>
                <p className="text-sm text-[#6B7280] mb-4">
                  Upload product photos from multiple angles. Drag to reorder.
                </p>
                
                {/* Gallery Grid */}
                {imageGallery.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {imageGallery.map((img, index) => (
                      <div
                        key={img.id}
                        className="relative border border-[#E5E7EB] rounded-lg overflow-hidden aspect-square group"
                      >
                        <img
                          src={img.url}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Controls */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {index > 0 && (
                            <button
                              onClick={() => moveImage(index, 'up')}
                              className="w-8 h-8 bg-white text-[#1F2937] rounded-full flex items-center justify-center hover:bg-[#F8F9FA]"
                              title="Move left"
                            >
                              <GripVertical className="w-4 h-4 rotate-90" />
                            </button>
                          )}
                          {index < imageGallery.length - 1 && (
                            <button
                              onClick={() => moveImage(index, 'down')}
                              className="w-8 h-8 bg-white text-[#1F2937] rounded-full flex items-center justify-center hover:bg-[#F8F9FA]"
                              title="Move right"
                            >
                              <GripVertical className="w-4 h-4 -rotate-90" />
                            </button>
                          )}
                          <button
                            onClick={() => removeGalleryImage(img.id)}
                            className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Image number */}
                        <div className="absolute top-2 left-2 w-6 h-6 bg-[#1F2937] text-white text-xs rounded-full flex items-center justify-center font-semibold">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Button */}
                {imageGallery.length < 5 && (
                  <label className="w-full h-[120px] border-2 border-dashed border-[#E5E7EB] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#1F2937] hover:bg-[#F8F9FA] transition-all">
                    <ImageIcon className="w-8 h-8 text-[#9CA3AF] mb-2" />
                    <p className="text-sm font-semibold text-[#1F2937]">
                      Add Images ({imageGallery.length}/5)
                    </p>
                    <p className="text-xs text-[#6B7280]">JPG or PNG (max 5MB each)</p>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      multiple
                      onChange={handleGalleryUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          ) : isGroceryProfile ? (
            /* Form - Grocery Products */
            <div className="space-y-8">
              {/* Thumbnail Upload */}
              <div>
                <Label className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Product Thumbnail *
                </Label>
                <p className="text-sm text-[#6B7280] mb-4">
                  Main product image. JPG or PNG, max 5MB.
                </p>
                {thumbnail ? (
                  <div className="relative w-full h-[240px] border border-[#E5E7EB] rounded-xl overflow-hidden">
                    <img
                      src={thumbnail.url}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setThumbnail(null)}
                      className="absolute top-3 right-3 w-8 h-8 bg-[#1F2937] hover:bg-[#111827] text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="w-full h-[240px] border-2 border-dashed border-[#E5E7EB] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#1F2937] hover:bg-[#F8F9FA] transition-all">
                    <Upload className="w-10 h-10 text-[#9CA3AF] mb-3" />
                    <p className="text-base font-semibold text-[#1F2937] mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-[#6B7280]">
                      JPG or PNG (max 5MB)
                    </p>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Shop Name (Read-only) */}
              <div>
                <Label htmlFor="shopName" className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Shop Name
                </Label>
                <div className="h-12 px-4 border border-[#E5E7EB] rounded-lg bg-[#F8F9FA] flex items-center text-[#1F2937]">
                  {profileName}
                </div>
                <p className="text-sm text-[#6B7280] mt-2">
                  This is auto-filled from your store profile
                </p>
              </div>

              {/* Product Category Dropdown - Grocery Specific */}
              <div>
                <Label htmlFor="productCategory" className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Category *
                </Label>
                <Select value={productCategory} onValueChange={setProductCategory}>
                  <SelectTrigger id="productCategory" className="h-12">
                    <SelectValue placeholder="Select a category..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fruits & Vegetables">Fruits & Vegetables</SelectItem>
                    <SelectItem value="Dairy & Eggs">Dairy & Eggs</SelectItem>
                    <SelectItem value="Bakery">Bakery</SelectItem>
                    <SelectItem value="Pantry Essentials">Pantry Essentials</SelectItem>
                    <SelectItem value="Snacks & Beverages">Snacks & Beverages</SelectItem>
                    <SelectItem value="Frozen Foods">Frozen Foods</SelectItem>
                    <SelectItem value="Household Items">Household Items</SelectItem>
                    <SelectItem value="Personal Care">Personal Care</SelectItem>
                    <SelectItem value="Baby & Kids">Baby & Kids</SelectItem>
                    <SelectItem value="Health & Wellness">Health & Wellness</SelectItem>
                    <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Item Name */}
              <div>
                <Label htmlFor="itemName" className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Item Name *
                </Label>
                <Input
                  id="itemName"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value.slice(0, 60))}
                  placeholder="e.g., Fresh Bananas"
                  className="h-12 text-base"
                  maxLength={60}
                />
                <p className="text-sm text-[#6B7280] mt-2">
                  {itemName.length}/60 characters
                </p>
              </div>

              {/* Short Description */}
              <div>
                <Label htmlFor="shortDescription" className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Short Description *
                </Label>
                <Textarea
                  id="shortDescription"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value.slice(0, 150))}
                  placeholder="e.g., Ripe yellow bananas"
                  className="min-h-[100px] text-base resize-none"
                  maxLength={150}
                />
                <p className="text-sm text-[#6B7280] mt-2">
                  {shortDescription.length}/150 characters
                </p>
              </div>

              {/* Quantity with Unit Selector */}
              <div>
                <Label className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Quantity *
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity" className="text-sm text-[#6B7280] mb-2 block">
                      Amount
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="1"
                      className="h-12 text-base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantityUnit" className="text-sm text-[#6B7280] mb-2 block">
                      Unit
                    </Label>
                    <Select value={quantityUnit} onValueChange={setQuantityUnit}>
                      <SelectTrigger id="quantityUnit" className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lb">lb (Pound)</SelectItem>
                        <SelectItem value="kg">kg (Kilogram)</SelectItem>
                        <SelectItem value="g">g (Gram)</SelectItem>
                        <SelectItem value="oz">oz (Ounce)</SelectItem>
                        <SelectItem value="count">Count/Pieces</SelectItem>
                        <SelectItem value="bunch">Bunch</SelectItem>
                        <SelectItem value="pack">Pack</SelectItem>
                        <SelectItem value="bag">Bag</SelectItem>
                        <SelectItem value="box">Box</SelectItem>
                        <SelectItem value="bottle">Bottle</SelectItem>
                        <SelectItem value="can">Can</SelectItem>
                        <SelectItem value="jar">Jar</SelectItem>
                        <SelectItem value="l">L (Liter)</SelectItem>
                        <SelectItem value="ml">ml (Milliliter)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <p className="text-sm text-[#6B7280] mt-2">
                  Example: 1 lb, 500g, 12 count
                </p>
              </div>

              {/* Price */}
              <div>
                <Label htmlFor="price" className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Price *
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] font-semibold">
                    $
                  </span>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="2.99"
                    className="h-12 pl-8 text-base"
                  />
                </div>
                <p className="text-sm text-[#6B7280] mt-2">
                  Enter the price per item
                </p>
              </div>

              {/* Image Gallery */}
              <div>
                <Label className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Product Images (Up to 5 images)
                </Label>
                <p className="text-sm text-[#6B7280] mb-4">
                  Upload product photos from multiple angles. Drag to reorder.
                </p>
                
                {/* Gallery Grid */}
                {imageGallery.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {imageGallery.map((img, index) => (
                      <div
                        key={img.id}
                        className="relative border border-[#E5E7EB] rounded-lg overflow-hidden aspect-square group"
                      >
                        <img
                          src={img.url}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Controls */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {index > 0 && (
                            <button
                              onClick={() => moveImage(index, 'up')}
                              className="w-8 h-8 bg-white text-[#1F2937] rounded-full flex items-center justify-center hover:bg-[#F8F9FA]"
                              title="Move left"
                            >
                              <GripVertical className="w-4 h-4 rotate-90" />
                            </button>
                          )}
                          {index < imageGallery.length - 1 && (
                            <button
                              onClick={() => moveImage(index, 'down')}
                              className="w-8 h-8 bg-white text-[#1F2937] rounded-full flex items-center justify-center hover:bg-[#F8F9FA]"
                              title="Move right"
                            >
                              <GripVertical className="w-4 h-4 -rotate-90" />
                            </button>
                          )}
                          <button
                            onClick={() => removeGalleryImage(img.id)}
                            className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Image number */}
                        <div className="absolute top-2 left-2 w-6 h-6 bg-[#1F2937] text-white text-xs rounded-full flex items-center justify-center font-semibold">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Button */}
                {imageGallery.length < 5 && (
                  <label className="w-full h-[120px] border-2 border-dashed border-[#E5E7EB] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#1F2937] hover:bg-[#F8F9FA] transition-all">
                    <ImageIcon className="w-8 h-8 text-[#9CA3AF] mb-2" />
                    <p className="text-sm font-semibold text-[#1F2937]">
                      Add Images ({imageGallery.length}/5)
                    </p>
                    <p className="text-xs text-[#6B7280]">JPG or PNG (max 5MB each)</p>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      multiple
                      onChange={handleGalleryUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          ) : isFoodProfile ? (
            /* Form - Food Products */
            <div className="space-y-8">
              {/* Thumbnail Upload */}
              <div>
                <Label className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Product Thumbnail *
                </Label>
                <p className="text-sm text-[#6B7280] mb-4">
                  Main product image. JPG or PNG, max 5MB.
                </p>
                {thumbnail ? (
                  <div className="relative w-full h-[240px] border border-[#E5E7EB] rounded-xl overflow-hidden">
                    <img
                      src={thumbnail.url}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setThumbnail(null)}
                      className="absolute top-3 right-3 w-8 h-8 bg-[#1F2937] hover:bg-[#111827] text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="w-full h-[240px] border-2 border-dashed border-[#E5E7EB] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#1F2937] hover:bg-[#F8F9FA] transition-all">
                    <Upload className="w-10 h-10 text-[#9CA3AF] mb-3" />
                    <p className="text-base font-semibold text-[#1F2937] mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-[#6B7280]">
                      JPG or PNG (max 5MB)
                    </p>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Shop Name (Read-only) */}
              <div>
                <Label htmlFor="shopName" className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Restaurant/Kitchen Name
                </Label>
                <div className="h-12 px-4 border border-[#E5E7EB] rounded-lg bg-[#F8F9FA] flex items-center text-[#1F2937]">
                  {profileName}
                </div>
                <p className="text-sm text-[#6B7280] mt-2">
                  This is auto-filled from your store profile
                </p>
              </div>

              {/* Cuisines Multi-Select */}
              <div>
                <Label className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Cuisines *
                </Label>
                <p className="text-sm text-[#6B7280] mb-4">
                  Select all cuisines that apply to this dish
                </p>
                <div className="border border-[#E5E7EB] rounded-lg p-4 max-h-[300px] overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      "American", "Italian", "Mexican", "Chinese", "Indian", "Pakistani",
                      "Middle Eastern", "Mediterranean", "Japanese", "Korean", "Thai",
                      "Vietnamese", "French", "Spanish", "Greek", "Turkish", "Lebanese",
                      "Moroccan", "Ethiopian", "Caribbean", "Brazilian", "Peruvian",
                      "Argentinian", "German", "British", "Irish", "Russian", "Polish",
                      "Filipino", "Indonesian", "Malaysian", "Singaporean", "Nepalese",
                      "Bangladeshi", "Sri Lankan", "African", "Cajun", "Creole", "Fusion",
                      "Vegan", "Vegetarian", "Gluten-Free", "Organic", "Farm-to-Table"
                    ].map((cuisine) => (
                      <div key={cuisine} className="flex items-center gap-2">
                        <Checkbox
                          id={`cuisine-${cuisine}`}
                          checked={cuisines.includes(cuisine)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setCuisines([...cuisines, cuisine]);
                            } else {
                              setCuisines(cuisines.filter(c => c !== cuisine));
                            }
                          }}
                        />
                        <Label
                          htmlFor={`cuisine-${cuisine}`}
                          className="text-sm text-[#1F2937] cursor-pointer"
                        >
                          {cuisine}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                {cuisines.length > 0 && (
                  <p className="text-sm text-[#6B7280] mt-2">
                    Selected: {cuisines.join(", ")}
                  </p>
                )}
              </div>

              {/* Product Category Dropdown - Food Specific */}
              <div>
                <Label htmlFor="productCategory" className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Category *
                </Label>
                <Select value={productCategory} onValueChange={setProductCategory}>
                  <SelectTrigger id="productCategory" className="h-12">
                    <SelectValue placeholder="Select a category..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Appetizers">Appetizers</SelectItem>
                    <SelectItem value="Main Courses">Main Courses</SelectItem>
                    <SelectItem value="Desserts">Desserts</SelectItem>
                    <SelectItem value="Beverages">Beverages</SelectItem>
                    <SelectItem value="Snacks">Snacks</SelectItem>
                    <SelectItem value="Salads">Salads</SelectItem>
                    <SelectItem value="Soups">Soups</SelectItem>
                    <SelectItem value="Pasta">Pasta</SelectItem>
                    <SelectItem value="Grilled">Grilled</SelectItem>
                    <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="Vegan">Vegan</SelectItem>
                    <SelectItem value="Gluten-Free">Gluten-Free</SelectItem>
                    <SelectItem value="Dairy-Free">Dairy-Free</SelectItem>
                    <SelectItem value="Low-Carb">Low-Carb</SelectItem>
                    <SelectItem value="High-Protein">High-Protein</SelectItem>
                    <SelectItem value="Healthy">Healthy</SelectItem>
                    <SelectItem value="Comfort Food">Comfort Food</SelectItem>
                    <SelectItem value="International">International</SelectItem>
                    <SelectItem value="Specialty">Specialty</SelectItem>
                    <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Item Name */}
              <div>
                <Label htmlFor="itemName" className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Item Name *
                </Label>
                <Input
                  id="itemName"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value.slice(0, 60))}
                  placeholder="e.g., Grilled Chicken Salad"
                  className="h-12 text-base"
                  maxLength={60}
                />
                <p className="text-sm text-[#6B7280] mt-2">
                  {itemName.length}/60 characters
                </p>
              </div>

              {/* Short Description */}
              <div>
                <Label htmlFor="shortDescription" className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Short Description *
                </Label>
                <Textarea
                  id="shortDescription"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value.slice(0, 150))}
                  placeholder="e.g., Fresh grilled chicken with mixed greens"
                  className="min-h-[100px] text-base resize-none"
                  maxLength={150}
                />
                <p className="text-sm text-[#6B7280] mt-2">
                  {shortDescription.length}/150 characters
                </p>
              </div>

              {/* Portion Size */}
              <div>
                <Label htmlFor="portionSize" className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Portion Size (Optional)
                </Label>
                <Select value={portionSize} onValueChange={setPortionSize}>
                  <SelectTrigger id="portionSize" className="h-12">
                    <SelectValue placeholder="Select portion size..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Small">Small</SelectItem>
                    <SelectItem value="Regular">Regular</SelectItem>
                    <SelectItem value="Large">Large</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-[#6B7280] mt-2">
                  Optionally specify the serving size for this item
                </p>
              </div>

              {/* Quantity with Unit Selector */}
              <div>
                <Label className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Quantity (Optional)
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity" className="text-sm text-[#6B7280] mb-2 block">
                      Amount
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="1"
                      className="h-12 text-base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantityUnit" className="text-sm text-[#6B7280] mb-2 block">
                      Unit
                    </Label>
                    <Select value={quantityUnit} onValueChange={setQuantityUnit}>
                      <SelectTrigger id="quantityUnit" className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lb">lb (Pound)</SelectItem>
                        <SelectItem value="kg">kg (Kilogram)</SelectItem>
                        <SelectItem value="g">g (Gram)</SelectItem>
                        <SelectItem value="oz">oz (Ounce)</SelectItem>
                        <SelectItem value="count">Count/Pieces</SelectItem>
                        <SelectItem value="bunch">Bunch</SelectItem>
                        <SelectItem value="pack">Pack</SelectItem>
                        <SelectItem value="bag">Bag</SelectItem>
                        <SelectItem value="box">Box</SelectItem>
                        <SelectItem value="bottle">Bottle</SelectItem>
                        <SelectItem value="can">Can</SelectItem>
                        <SelectItem value="jar">Jar</SelectItem>
                        <SelectItem value="l">L (Liter)</SelectItem>
                        <SelectItem value="ml">ml (Milliliter)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <p className="text-sm text-[#6B7280] mt-2">
                  Optionally specify quantity if applicable (e.g., 1 serving, 2 pieces, 500g)
                </p>
              </div>

              {/* Price */}
              <div>
                <Label htmlFor="price" className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Price *
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] font-semibold">
                    $
                  </span>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="2.99"
                    className="h-12 pl-8 text-base"
                  />
                </div>
                <p className="text-sm text-[#6B7280] mt-2">
                  Enter the price per item
                </p>
              </div>

              {/* Image Gallery */}
              <div>
                <Label className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Product Images (Up to 5 images)
                </Label>
                <p className="text-sm text-[#6B7280] mb-4">
                  Upload product photos from multiple angles. Drag to reorder.
                </p>
                
                {/* Gallery Grid */}
                {imageGallery.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {imageGallery.map((img, index) => (
                      <div
                        key={img.id}
                        className="relative border border-[#E5E7EB] rounded-lg overflow-hidden aspect-square group"
                      >
                        <img
                          src={img.url}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Controls */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {index > 0 && (
                            <button
                              onClick={() => moveImage(index, 'up')}
                              className="w-8 h-8 bg-white text-[#1F2937] rounded-full flex items-center justify-center hover:bg-[#F8F9FA]"
                              title="Move left"
                            >
                              <GripVertical className="w-4 h-4 rotate-90" />
                            </button>
                          )}
                          {index < imageGallery.length - 1 && (
                            <button
                              onClick={() => moveImage(index, 'down')}
                              className="w-8 h-8 bg-white text-[#1F2937] rounded-full flex items-center justify-center hover:bg-[#F8F9FA]"
                              title="Move right"
                            >
                              <GripVertical className="w-4 h-4 -rotate-90" />
                            </button>
                          )}
                          <button
                            onClick={() => removeGalleryImage(img.id)}
                            className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Image number */}
                        <div className="absolute top-2 left-2 w-6 h-6 bg-[#1F2937] text-white text-xs rounded-full flex items-center justify-center font-semibold">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Button */}
                {imageGallery.length < 5 && (
                  <label className="w-full h-[120px] border-2 border-dashed border-[#E5E7EB] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#1F2937] hover:bg-[#F8F9FA] transition-all">
                    <ImageIcon className="w-8 h-8 text-[#9CA3AF] mb-2" />
                    <p className="text-sm font-semibold text-[#1F2937]">
                      Add Images ({imageGallery.length}/5)
                    </p>
                    <p className="text-xs text-[#6B7280]">JPG or PNG (max 5MB each)</p>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      multiple
                      onChange={handleGalleryUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          ) : isRentalPropertiesProfile ? (
            /* Form - Rental Properties */
            <div className="space-y-8">
              {/* Thumbnail Upload */}
              <div>
                <Label className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Property Thumbnail *
                </Label>
                <p className="text-sm text-[#6B7280] mb-4">
                  Main property image. JPG or PNG, max 5MB.
                </p>
                {thumbnail ? (
                  <div className="relative w-full h-[240px] border border-[#E5E7EB] rounded-xl overflow-hidden">
                    <img
                      src={thumbnail.url}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setThumbnail(null)}
                      className="absolute top-3 right-3 w-8 h-8 bg-[#1F2937] hover:bg-[#111827] text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="w-full h-[240px] border-2 border-dashed border-[#E5E7EB] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#1F2937] hover:bg-[#F8F9FA] transition-all">
                    <Upload className="w-10 h-10 text-[#9CA3AF] mb-3" />
                    <p className="text-base font-semibold text-[#1F2937] mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-[#6B7280]">
                      JPG or PNG (max 5MB)
                    </p>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Property Title */}
              <div>
                <Label htmlFor="propertyTitle" className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Property Title *
                </Label>
                <Input
                  id="propertyTitle"
                  value={serviceTitle}
                  onChange={(e) => setServiceTitle(e.target.value)}
                  placeholder="e.g., Luxury Downtown Apartment"
                  className="h-12 text-base"
                />
              </div>

              {/* Region */}
              <div>
                <Label htmlFor="location" className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Region *
                </Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger id="location" className="h-12">
                    <SelectValue placeholder="Select a region" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendorRegions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-[#6B7280] mt-2">
                  Choose from the regions you selected when creating your store
                </p>
              </div>

              {/* Property Type */}
              <div>
                <Label htmlFor="propertyType" className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Property Type *
                </Label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger id="propertyType" className="h-12">
                    <SelectValue placeholder="Select property type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="House">House</SelectItem>
                    <SelectItem value="Condo">Condo</SelectItem>
                    <SelectItem value="Studio">Studio</SelectItem>
                    <SelectItem value="Loft">Loft</SelectItem>
                    <SelectItem value="Townhouse">Townhouse</SelectItem>
                    <SelectItem value="Villa">Villa</SelectItem>
                    <SelectItem value="Penthouse">Penthouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Short Description */}
              <div>
                <Label htmlFor="shortDescription" className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Short Description *
                </Label>
                <Textarea
                  id="shortDescription"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Brief overview of your property (e.g., Modern 2BR apartment with stunning city views)"
                  className="min-h-[100px] text-base resize-none"
                />
              </div>

              {/* Property Information Grid */}
              <div className="grid grid-cols-2 gap-6">
                {/* Bedrooms */}
                <div>
                  <Label htmlFor="bedrooms" className="text-base font-semibold text-[#1F2937] mb-3 block">
                    Bedrooms *
                  </Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min="0"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    placeholder="2"
                    className="h-12 text-base"
                  />
                </div>

                {/* Bathrooms */}
                <div>
                  <Label htmlFor="bathrooms" className="text-base font-semibold text-[#1F2937] mb-3 block">
                    Bathrooms *
                  </Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min="0"
                    step="0.5"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    placeholder="1"
                    className="h-12 text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Max Guests */}
                <div>
                  <Label htmlFor="maxGuests" className="text-base font-semibold text-[#1F2937] mb-3 block">
                    Max Guests *
                  </Label>
                  <Input
                    id="maxGuests"
                    type="number"
                    min="1"
                    value={maxGuests}
                    onChange={(e) => setMaxGuests(e.target.value)}
                    placeholder="4"
                    className="h-12 text-base"
                  />
                </div>

                {/* Total Area */}
                <div>
                  <Label className="text-base font-semibold text-[#1F2937] mb-3 block">
                    Total Area *
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="number"
                      min="0"
                      value={totalArea}
                      onChange={(e) => setTotalArea(e.target.value)}
                      placeholder="850"
                      className="h-12 text-base"
                    />
                    <Select value={areaUnit} onValueChange={setAreaUnit}>
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ft²">ft² (Square feet)</SelectItem>
                        <SelectItem value="m²">m² (Square meters)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Price Per Night */}
              <div>
                <Label htmlFor="pricePerNight" className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Price Per Night *
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] font-semibold">
                    $
                  </span>
                  <Input
                    id="pricePerNight"
                    type="number"
                    step="0.01"
                    value={pricePerNight}
                    onChange={(e) => setPricePerNight(e.target.value)}
                    placeholder="150.00"
                    className="h-12 text-base pl-8"
                  />
                </div>
              </div>

              {/* Amenities */}
              <div>
                <Label className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Amenities
                </Label>
                <p className="text-sm text-[#6B7280] mb-4">
                  Select all amenities available at your property
                </p>
                <div className="border border-[#E5E7EB] rounded-lg p-6 space-y-4 max-h-[400px] overflow-y-auto">
                  {/* Essentials */}
                  <div>
                    <p className="text-sm font-semibold text-[#1F2937] mb-3">Essential Amenities</p>
                    <div className="grid grid-cols-2 gap-3">
                      {["WiFi", "Kitchen", "Air Conditioning", "Heating", "TV", "Washer", "Dryer", "Hot Water", "Essentials (towels, bed sheets, soap, toilet paper)", "Hair Dryer", "Iron"].map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <Checkbox
                            id={`amenity-${item}`}
                            checked={amenities.includes(item)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setAmenities([...amenities, item]);
                              } else {
                                setAmenities(amenities.filter(a => a !== item));
                              }
                            }}
                          />
                          <Label htmlFor={`amenity-${item}`} className="text-sm cursor-pointer">{item}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Kitchen & Dining */}
                  <div className="pt-4 border-t border-[#E5E7EB]">
                    <p className="text-sm font-semibold text-[#1F2937] mb-3">Kitchen & Dining</p>
                    <div className="grid grid-cols-2 gap-3">
                      {["Refrigerator", "Microwave", "Oven", "Stove", "Dishwasher", "Coffee Maker", "Cooking Basics", "Dishes & Silverware", "Dining Table"].map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <Checkbox
                            id={`amenity-${item}`}
                            checked={amenities.includes(item)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setAmenities([...amenities, item]);
                              } else {
                                setAmenities(amenities.filter(a => a !== item));
                              }
                            }}
                          />
                          <Label htmlFor={`amenity-${item}`} className="text-sm cursor-pointer">{item}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Property Features */}
                  <div className="pt-4 border-t border-[#E5E7EB]">
                    <p className="text-sm font-semibold text-[#1F2937] mb-3">Property Features</p>
                    <div className="grid grid-cols-2 gap-3">
                      {["Private Entrance", "Lockbox or Smart Lock", "Free Parking on Premises", "Paid Parking", "Elevator", "Balcony or Patio", "Outdoor Furniture", "Garden or Backyard", "Pool", "Hot Tub", "Gym", "Fireplace", "BBQ Grill"].map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <Checkbox
                            id={`amenity-${item}`}
                            checked={amenities.includes(item)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setAmenities([...amenities, item]);
                              } else {
                                setAmenities(amenities.filter(a => a !== item));
                              }
                            }}
                          />
                          <Label htmlFor={`amenity-${item}`} className="text-sm cursor-pointer">{item}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Safety & Security */}
                  <div className="pt-4 border-t border-[#E5E7EB]">
                    <p className="text-sm font-semibold text-[#1F2937] mb-3">Safety & Security</p>
                    <div className="grid grid-cols-2 gap-3">
                      {["Smoke Alarm", "Carbon Monoxide Alarm", "Fire Extinguisher", "First Aid Kit", "Security Cameras (Exterior)", "Doorman"].map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <Checkbox
                            id={`amenity-${item}`}
                            checked={amenities.includes(item)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setAmenities([...amenities, item]);
                              } else {
                                setAmenities(amenities.filter(a => a !== item));
                              }
                            }}
                          />
                          <Label htmlFor={`amenity-${item}`} className="text-sm cursor-pointer">{item}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Accessibility & Extras */}
                  <div className="pt-4 border-t border-[#E5E7EB]">
                    <p className="text-sm font-semibold text-[#1F2937] mb-3">Accessibility & Extras</p>
                    <div className="grid grid-cols-2 gap-3">
                      {["Wheelchair Accessible", "Step-Free Access", "Single-Level Home", "Family/Kid Friendly", "Crib", "High Chair", "Extra Pillows & Blankets", "Closet or Wardrobe", "Hangers", "Luggage Dropoff Allowed", "Long-Term Stays Allowed", "Self Check-in", "Cleaning Before Checkout", "Pet Friendly", "Smoking Allowed"].map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <Checkbox
                            id={`amenity-${item}`}
                            checked={amenities.includes(item)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setAmenities([...amenities, item]);
                              } else {
                                setAmenities(amenities.filter(a => a !== item));
                              }
                            }}
                          />
                          <Label htmlFor={`amenity-${item}`} className="text-sm cursor-pointer">{item}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Location Views */}
                  <div className="pt-4 border-t border-[#E5E7EB]">
                    <p className="text-sm font-semibold text-[#1F2937] mb-3">Location & Views</p>
                    <div className="grid grid-cols-2 gap-3">
                      {["Beach Access", "Lake Access", "Waterfront", "City View", "Mountain View"].map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <Checkbox
                            id={`amenity-${item}`}
                            checked={amenities.includes(item)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setAmenities([...amenities, item]);
                              } else {
                                setAmenities(amenities.filter(a => a !== item));
                              }
                            }}
                          />
                          <Label htmlFor={`amenity-${item}`} className="text-sm cursor-pointer">{item}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Long Description */}
              <div>
                <Label htmlFor="longDescription" className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Long Description *
                </Label>
                <Textarea
                  id="longDescription"
                  value={longDescription}
                  onChange={(e) => setLongDescription(e.target.value)}
                  placeholder="Provide detailed information about your property, including special features, nearby attractions, and what makes it unique..."
                  className="min-h-[180px] text-base resize-none"
                />
              </div>

              {/* Location Coordinates */}
              <div>
                <Label className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Location Coordinates (Optional)
                </Label>
                <p className="text-sm text-[#6B7280] mb-3">
                  Enter coordinates to show property location on map
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {/* Latitude */}
                  <div>
                    <Label htmlFor="latitude" className="text-sm font-medium text-[#6B7280] mb-2 block">
                      Latitude (N)
                    </Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="0.000001"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      placeholder="40.758000"
                      className="h-12 text-base"
                    />
                  </div>

                  {/* Longitude */}
                  <div>
                    <Label htmlFor="longitude" className="text-sm font-medium text-[#6B7280] mb-2 block">
                      Longitude (W)
                    </Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="0.000001"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      placeholder="-73.985500"
                      className="h-12 text-base"
                    />
                  </div>
                </div>
              </div>

              {/* House Rules */}
              <div>
                <Label htmlFor="houseRules" className="text-base font-semibold text-[#1F2937] mb-3 block">
                  House Rules
                </Label>
                <Textarea
                  id="houseRules"
                  value={houseRules}
                  onChange={(e) => setHouseRules(e.target.value)}
                  placeholder="e.g., No smoking, Check-in: 3 PM / Check-out: 11 AM, Quiet hours: 10 PM - 8 AM"
                  className="min-h-[120px] text-base resize-none"
                />
              </div>

              {/* Fees */}
              <div>
                <Label className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Additional Fees
                </Label>
                <div className="grid grid-cols-2 gap-6">
                  {/* Cleaning Fee */}
                  <div>
                    <Label htmlFor="cleaningFee" className="text-sm text-[#6B7280] mb-2 block">
                      Cleaning Fee
                    </Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] font-semibold">
                        $
                      </span>
                      <Input
                        id="cleaningFee"
                        type="number"
                        step="0.01"
                        value={cleaningFee}
                        onChange={(e) => setCleaningFee(e.target.value)}
                        placeholder="50.00"
                        className="h-12 text-base pl-8"
                      />
                    </div>
                  </div>

                  {/* Service Fee */}
                  <div>
                    <Label htmlFor="serviceFee" className="text-sm text-[#6B7280] mb-2 block">
                      Service Fee
                    </Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] font-semibold">
                        $
                      </span>
                      <Input
                        id="serviceFee"
                        type="number"
                        step="0.01"
                        value={serviceFee}
                        onChange={(e) => setServiceFee(e.target.value)}
                        placeholder="45.00"
                        className="h-12 text-base pl-8"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Availability Calendar */}
              <div>
                <Label className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Availability Calendar
                </Label>
                <p className="text-sm text-[#6B7280] mb-4">
                  Select dates when the property is unavailable for booking
                </p>
                <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-6 w-fit">
                  <Calendar
                    mode="multiple"
                    selected={unavailableDates}
                    onSelect={(dates) => setUnavailableDates(dates || [])}
                    className="rounded-md"
                  />
                  {unavailableDates.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
                      <p className="text-sm font-semibold text-[#1F2937] mb-2">
                        Unavailable Dates ({unavailableDates.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {unavailableDates.slice(0, 5).map((date, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FEE2E2] text-[#DC2626] text-xs rounded-lg"
                          >
                            {date.toLocaleDateString()}
                            <button
                              type="button"
                              onClick={() => {
                                setUnavailableDates(unavailableDates.filter((d) => d !== date));
                              }}
                              className="hover:text-[#991B1B]"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        {unavailableDates.length > 5 && (
                          <span className="inline-flex items-center px-3 py-1.5 text-[#6B7280] text-xs">
                            +{unavailableDates.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Property Image Gallery */}
              <div>
                <Label className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Property Image Gallery *
                </Label>
                <p className="text-sm text-[#6B7280] mb-4">
                  Upload photos from different rooms and angles. Max 5 images, JPG or PNG (max 5MB each).
                </p>

                {/* Gallery Grid */}
                {imageGallery.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {imageGallery.map((img, index) => (
                      <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-[#E5E7EB]">
                        <img
                          src={img.url}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Controls */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {index > 0 && (
                            <button
                              onClick={() => moveImage(index, 'up')}
                              className="w-8 h-8 bg-white text-[#1F2937] rounded-full flex items-center justify-center hover:bg-[#F8F9FA]"
                              title="Move left"
                            >
                              <GripVertical className="w-4 h-4 rotate-90" />
                            </button>
                          )}
                          {index < imageGallery.length - 1 && (
                            <button
                              onClick={() => moveImage(index, 'down')}
                              className="w-8 h-8 bg-white text-[#1F2937] rounded-full flex items-center justify-center hover:bg-[#F8F9FA]"
                              title="Move right"
                            >
                              <GripVertical className="w-4 h-4 -rotate-90" />
                            </button>
                          )}
                          <button
                            onClick={() => removeGalleryImage(img.id)}
                            className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Image number */}
                        <div className="absolute top-2 left-2 w-6 h-6 bg-[#1F2937] text-white text-xs rounded-full flex items-center justify-center font-semibold">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Button */}
                {imageGallery.length < 5 && (
                  <label className="w-full h-[120px] border-2 border-dashed border-[#E5E7EB] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#1F2937] hover:bg-[#F8F9FA] transition-all">
                    <ImageIcon className="w-8 h-8 text-[#9CA3AF] mb-2" />
                    <p className="text-sm font-semibold text-[#1F2937]">
                      Add Images ({imageGallery.length}/5)
                    </p>
                    <p className="text-xs text-[#6B7280]">JPG or PNG (max 5MB each)</p>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      multiple
                      onChange={handleGalleryUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          ) : isRideAssistanceProfile ? (
            /* Form - Ride Assistance */
            <div className="space-y-8">
              {/* Thumbnail Upload */}
              <div>
                <Label className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Service Thumbnail *
                </Label>
                <p className="text-sm text-[#6B7280] mb-4">
                  This image will appear on listing cards. JPG or PNG, max 5MB.
                </p>
                {thumbnail ? (
                  <div className="relative w-full h-[240px] border border-[#E5E7EB] rounded-xl overflow-hidden">
                    <img
                      src={thumbnail.url}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setThumbnail(null)}
                      className="absolute top-3 right-3 w-8 h-8 bg-[#1F2937] hover:bg-[#111827] text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="w-full h-[240px] border-2 border-dashed border-[#E5E7EB] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#1F2937] hover:bg-[#F8F9FA] transition-all">
                    <Upload className="w-10 h-10 text-[#9CA3AF] mb-3" />
                    <p className="text-base font-semibold text-[#1F2937] mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-[#6B7280]">
                      JPG or PNG (max 5MB)
                    </p>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Shop Name (Auto-populated) */}
              <div>
                <Label htmlFor="shopName" className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Shop Name
                </Label>
                <Input
                  id="shopName"
                  value={profileName}
                  disabled
                  className="h-12 text-base bg-[#F8F9FA] cursor-not-allowed"
                />
                <p className="text-sm text-[#6B7280] mt-2">
                  Auto-populated from your business profile
                </p>
              </div>

              {/* Hourly Rate */}
              <div>
                <Label htmlFor="hourlyRate" className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Hourly Rate *
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] text-base font-semibold">
                    $
                  </span>
                  <Input
                    id="hourlyRate"
                    type="number"
                    step="0.01"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    placeholder="35.00"
                    className="h-12 text-base pl-8"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] text-sm">
                    /hour
                  </span>
                </div>
                <p className="text-sm text-[#6B7280] mt-2">
                  Set your hourly transportation rate
                </p>
              </div>

              {/* Short Description */}
              <div>
                <Label htmlFor="shortDescription" className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Short Description *
                </Label>
                <p className="text-sm text-[#6B7280] mb-3">
                  Brief overview of your transportation service
                </p>
                <Textarea
                  id="shortDescription"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value.slice(0, 150))}
                  placeholder="e.g., Reliable senior transportation with trained caregivers"
                  className="min-h-[100px] text-base resize-none"
                  maxLength={150}
                />
                <p className="text-sm text-[#6B7280] mt-2">
                  {shortDescription.length}/150 characters
                </p>
              </div>

              {/* Long Description */}
              <div>
                <Label htmlFor="longDescription" className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Long Description *
                </Label>
                <p className="text-sm text-[#6B7280] mb-3">
                  Detailed information about your specialized transportation service
                </p>
                <Textarea
                  id="longDescription"
                  value={longDescription}
                  onChange={(e) => setLongDescription(e.target.value)}
                  placeholder="Describe your transportation service, driver qualifications, safety measures, and any special accommodations..."
                  className="min-h-[180px] text-base resize-none"
                />
              </div>

              {/* Available Vehicle Types */}
              <div>
                <Label className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Available Vehicle Types *
                </Label>
                <p className="text-sm text-[#6B7280] mb-4">
                  Select all vehicle types you offer
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 border border-[#E5E7EB] rounded-[10px] hover:border-[#1F2937] transition-colors">
                    <Checkbox
                      id="vehicle-standard"
                      checked={vehicleTypes.includes("Standard")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setVehicleTypes([...vehicleTypes, "Standard"]);
                        } else {
                          setVehicleTypes(vehicleTypes.filter(v => v !== "Standard"));
                        }
                      }}
                    />
                    <Label htmlFor="vehicle-standard" className="text-base cursor-pointer flex-1">
                      Standard Vehicle
                    </Label>
                  </div>
                  <div className="flex items-center gap-3 p-4 border border-[#E5E7EB] rounded-[10px] hover:border-[#1F2937] transition-colors">
                    <Checkbox
                      id="vehicle-wheelchair"
                      checked={vehicleTypes.includes("Wheelchair Accessible")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setVehicleTypes([...vehicleTypes, "Wheelchair Accessible"]);
                        } else {
                          setVehicleTypes(vehicleTypes.filter(v => v !== "Wheelchair Accessible"));
                        }
                      }}
                    />
                    <Label htmlFor="vehicle-wheelchair" className="text-base cursor-pointer flex-1">
                      Wheelchair Accessible Vehicle
                    </Label>
                  </div>
                </div>
              </div>

              {/* Special Features */}
              <div>
                <Label htmlFor="specialFeatures" className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Special Features
                </Label>
                <p className="text-sm text-[#6B7280] mb-3">
                  List special features separated by commas (e.g., Senior specialists, Memory care trained, Mobility assistance)
                </p>
                <Textarea
                  id="specialFeatures"
                  value={specialFeatures}
                  onChange={(e) => setSpecialFeatures(e.target.value)}
                  placeholder="Senior specialists, Memory care trained, Mobility assistance, Door-to-door service, Medical appointment transportation"
                  className="min-h-[120px] text-base resize-none"
                />
              </div>

              {/* Coverage Area */}
              <div>
                <Label htmlFor="coverageArea" className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Coverage Area *
                </Label>
                <p className="text-sm text-[#6B7280] mb-3">
                  Select the regions where you provide service
                </p>
                <Select value={coverageArea} onValueChange={setCoverageArea}>
                  <SelectTrigger id="coverageArea" className="h-12">
                    <SelectValue placeholder="Select coverage area..." />
                  </SelectTrigger>
                  <SelectContent>
                    {vendorRegions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Total Number of Seats */}
              <div>
                <Label htmlFor="totalSeats" className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Total Number of Seats *
                </Label>
                <Input
                  id="totalSeats"
                  type="number"
                  min="1"
                  max="15"
                  value={totalSeats}
                  onChange={(e) => setTotalSeats(e.target.value)}
                  placeholder="4"
                  className="h-12 text-base"
                />
                <p className="text-sm text-[#6B7280] mt-2">
                  Specify vehicle capacity (passenger seats available)
                </p>
              </div>

              {/* Image Gallery */}
              <div>
                <Label className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Vehicle Images *
                </Label>
                <p className="text-sm text-[#6B7280] mb-4">
                  Upload photos of your vehicles and special equipment. Max 5 images, JPG or PNG (max 5MB each).
                </p>

                {/* Gallery Grid */}
                {imageGallery.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {imageGallery.map((img, index) => (
                      <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-[#E5E7EB]">
                        <img
                          src={img.url}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Controls */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {index > 0 && (
                            <button
                              onClick={() => moveImage(index, 'up')}
                              className="w-8 h-8 bg-white text-[#1F2937] rounded-full flex items-center justify-center hover:bg-[#F8F9FA]"
                              title="Move left"
                            >
                              <GripVertical className="w-4 h-4 rotate-90" />
                            </button>
                          )}
                          {index < imageGallery.length - 1 && (
                            <button
                              onClick={() => moveImage(index, 'down')}
                              className="w-8 h-8 bg-white text-[#1F2937] rounded-full flex items-center justify-center hover:bg-[#F8F9FA]"
                              title="Move right"
                            >
                              <GripVertical className="w-4 h-4 -rotate-90" />
                            </button>
                          )}
                          <button
                            onClick={() => removeGalleryImage(img.id)}
                            className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Image number */}
                        <div className="absolute top-2 left-2 w-6 h-6 bg-[#1F2937] text-white text-xs rounded-full flex items-center justify-center font-semibold">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Button */}
                {imageGallery.length < 5 && (
                  <label className="w-full h-[120px] border-2 border-dashed border-[#E5E7EB] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#1F2937] hover:bg-[#F8F9FA] transition-all">
                    <ImageIcon className="w-8 h-8 text-[#9CA3AF] mb-2" />
                    <p className="text-sm font-semibold text-[#1F2937]">
                      Add Images ({imageGallery.length}/5)
                    </p>
                    <p className="text-xs text-[#6B7280]">JPG or PNG (max 5MB each)</p>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      multiple
                      onChange={handleGalleryUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          ) : (
            /* Form - Regular Services */
            <div className="space-y-8">
              {/* Thumbnail Upload */}
              <div>
                <Label className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Thumbnail Image *
                </Label>
                <p className="text-sm text-[#6B7280] mb-4">
                  This image will appear on listing cards. JPG or PNG, max 5MB.
                </p>
                {thumbnail ? (
                  <div className="relative w-full h-[240px] border border-[#E5E7EB] rounded-xl overflow-hidden">
                    <img
                      src={thumbnail.url}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setThumbnail(null)}
                      className="absolute top-3 right-3 w-8 h-8 bg-[#1F2937] hover:bg-[#111827] text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="w-full h-[240px] border-2 border-dashed border-[#E5E7EB] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#1F2937] hover:bg-[#F8F9FA] transition-all">
                    <Upload className="w-10 h-10 text-[#9CA3AF] mb-3" />
                    <p className="text-base font-semibold text-[#1F2937] mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-[#6B7280]">
                      JPG or PNG (max 5MB)
                    </p>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Service Title */}
              <div>
                <Label htmlFor="serviceTitle" className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Service Title *
                </Label>
                <Input
                  id="serviceTitle"
                  value={serviceTitle}
                  onChange={(e) => setServiceTitle(e.target.value.slice(0, 60))}
                  placeholder="e.g., Residential Deep Cleaning"
                  className="h-12 text-base"
                  maxLength={60}
                />
                <p className={`text-sm mt-2 ${titleCharCount > 60 ? 'text-red-500' : 'text-[#6B7280]'}`}>
                  {titleCharCount}/60 characters
                </p>
              </div>

              {/* Short Description */}
              <div>
                <Label htmlFor="shortDescription" className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Short Description *
                </Label>
                <p className="text-sm text-[#6B7280] mb-3">
                  This appears on the listing card preview. Keep it concise.
                </p>
                <Textarea
                  id="shortDescription"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value.slice(0, 150))}
                  placeholder="Brief overview of the service..."
                  className="min-h-[100px] text-base resize-none"
                  maxLength={150}
                />
                <p className={`text-sm mt-2 ${shortDescCharCount > 150 ? 'text-red-500' : 'text-[#6B7280]'}`}>
                  {shortDescCharCount}/150 characters
                </p>
              </div>

              {/* Image Gallery */}
              <div>
                <Label className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Image Gallery (Up to 5 images)
                </Label>
                <p className="text-sm text-[#6B7280] mb-4">
                  Upload multiple images to showcase your service. Drag to reorder.
                </p>
                
                {/* Gallery Grid */}
                {imageGallery.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {imageGallery.map((img, index) => (
                      <div
                        key={img.id}
                        className="relative border border-[#E5E7EB] rounded-lg overflow-hidden aspect-square group"
                      >
                        <img
                          src={img.url}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Controls */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {index > 0 && (
                            <button
                              onClick={() => moveImage(index, 'up')}
                              className="w-8 h-8 bg-white text-[#1F2937] rounded-full flex items-center justify-center hover:bg-[#F8F9FA]"
                              title="Move left"
                            >
                              <GripVertical className="w-4 h-4 rotate-90" />
                            </button>
                          )}
                          {index < imageGallery.length - 1 && (
                            <button
                              onClick={() => moveImage(index, 'down')}
                              className="w-8 h-8 bg-white text-[#1F2937] rounded-full flex items-center justify-center hover:bg-[#F8F9FA]"
                              title="Move right"
                            >
                              <GripVertical className="w-4 h-4 -rotate-90" />
                            </button>
                          )}
                          <button
                            onClick={() => removeGalleryImage(img.id)}
                            className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Image number */}
                        <div className="absolute top-2 left-2 w-6 h-6 bg-[#1F2937] text-white text-xs rounded-full flex items-center justify-center font-semibold">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Button */}
                {imageGallery.length < 5 && (
                  <label className="w-full h-[120px] border-2 border-dashed border-[#E5E7EB] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#1F2937] hover:bg-[#F8F9FA] transition-all">
                    <ImageIcon className="w-8 h-8 text-[#9CA3AF] mb-2" />
                    <p className="text-sm font-semibold text-[#1F2937]">
                      Add Images ({imageGallery.length}/5)
                    </p>
                    <p className="text-xs text-[#6B7280]">JPG or PNG (max 5MB each)</p>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      multiple
                      onChange={handleGalleryUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Long Description */}
              <div>
                <Label htmlFor="longDescription" className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Long Description *
                </Label>
                <p className="text-sm text-[#6B7280] mb-3">
                  Provide complete details about the service, what's included, and what customers can expect.
                </p>
                <Textarea
                  id="longDescription"
                  value={longDescription}
                  onChange={(e) => setLongDescription(e.target.value.slice(0, 500))}
                  placeholder="Detailed description of your service..."
                  className="min-h-[200px] text-base resize-none"
                  maxLength={500}
                />
                <p className={`text-sm mt-2 ${longDescCharCount > 500 ? 'text-red-500' : 'text-[#6B7280]'}`}>
                  {longDescCharCount}/500 characters
                </p>
              </div>

              {/* Pricing */}
              <div>
                <Label className="text-base font-semibold text-[#1F2937] mb-3 block">
                  Pricing *
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pricingType" className="text-sm text-[#6B7280] mb-2 block">
                      Pricing Type
                    </Label>
                    {isCleaningProfile ? (
                      <div className="h-12 px-4 border border-[#E5E7EB] rounded-lg bg-[#F8F9FA] flex items-center text-[#1F2937]">
                        Fixed Pricing
                      </div>
                    ) : isBeautyServicesProfile ? (
                      <div className="h-12 px-4 border border-[#E5E7EB] rounded-lg bg-[#F8F9FA] flex items-center text-[#1F2937]">
                        Hourly Rate
                      </div>
                    ) : (
                      <Select value={pricingType} onValueChange={setPricingType}>
                        <SelectTrigger id="pricingType" className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">Fixed Pricing</SelectItem>
                          <SelectItem value="hourly">Hourly Rate</SelectItem>
                          <SelectItem value="range">Price Range</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="price" className="text-sm text-[#6B7280] mb-2 block">
                      {pricingType === "fixed" ? "Price" : pricingType === "hourly" ? "Hourly Rate" : "Starting Price"}
                    </Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] font-semibold">
                        $
                      </span>
                      <Input
                        id="price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="150"
                        className="h-12 pl-8 text-base"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Duration (Beauty Services only) */}
              {isBeautyServicesProfile && (
                <div>
                  <Label className="text-base font-semibold text-[#1F2937] mb-3 block">
                    Duration *
                  </Label>
                  <div className="space-y-4">
                    {/* Duration Input */}
                    <div>
                      <Label htmlFor="duration" className="text-sm text-[#6B7280] mb-2 block">
                        Duration (minutes)
                      </Label>
                      <Input
                        id="duration"
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="60"
                        className="h-12 text-base"
                      />
                      <p className="text-xs text-[#6B7280] mt-1.5">
                        Example: 60 mins, 90 mins, 120 mins
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* What's Included */}
              <div>
                <Label className="text-base font-semibold text-[#1F2937] mb-3 block">
                  What's Included
                </Label>
                <p className="text-sm text-[#6B7280] mb-4">
                  Select items included in this service or add custom items.
                </p>
                
                <div className="space-y-3 mb-4">
                  {includedItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <Checkbox
                        id={`item-${item.id}`}
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => toggleIncludedItem(item.id)}
                      />
                      <Label
                        htmlFor={`item-${item.id}`}
                        className="flex-1 text-sm text-[#1F2937] cursor-pointer"
                      >
                        {item.text}
                      </Label>
                      {item.isCustom && (
                        <button
                          onClick={() => removeCustomItem(item.id)}
                          className="text-[#6B7280] hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Custom Item */}
                <div className="flex gap-2">
                  <Input
                    value={customItemText}
                    onChange={(e) => setCustomItemText(e.target.value)}
                    placeholder="Add custom item..."
                    className="h-10 text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomItem();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addCustomItem}
                    variant="outline"
                    className="h-10 px-4"
                    disabled={!customItemText.trim()}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {saveError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <strong>Error:</strong> {saveError}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-10 pt-8 border-t border-[#E5E7EB]">
            <Button
              onClick={handleSaveAsDraft}
              variant="outline"
              className="h-12 px-6 text-base font-semibold"
              disabled={isSaving}
            >
              <Save className="w-[18px] h-[18px] mr-2" />
              {isSaving ? "Saving..." : "Save as Draft"}
            </Button>
            <Button
              onClick={handlePublish}
              className="h-12 px-6 text-base font-semibold bg-[#059669] hover:bg-[#047857] text-white flex-1 sm:flex-none"
              disabled={isSaving}
            >
              <CheckCircle2 className="w-[18px] h-[18px] mr-2" />
              {isSaving ? "Publishing..." : isRentalPropertiesProfile ? "Publish Property" : (isBeautyProductsProfile || isGroceryProfile || isFoodProfile) ? "Publish Product" : "Publish Service"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}