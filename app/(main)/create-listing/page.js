"use client";
import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Check,
  Image as ImageIcon,
  DollarSign,
  Info,
  Plus,
  X,
  Mail,
  Phone,
  Eye,
  EyeOff,
  HelpCircle,
  Search,
  Bookmark,
  Camera,
  CheckCircle,
  Loader2,
  ImagePlus,
  ImageMinus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import PaymentGateway from "@/components/Payment/paymentGateway";
import CityDropdown from "@/components/CategorySection/addCity";
import { ToastContainer, toast } from "react-toastify";

export default function CreateListing() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    category: "",
    type: "Professional",
    title: "",
    description: "",
    price: "",
    negotiable: false,
    city: "",
    tags: [],
    currentTag: "",
    highlights: [],
    currentHighlight: "",
    email: "",
    phone: "",
    hidePhone: false,
    photos: [],
    pricingOption: "FREE",
    website: "",
    businessHours: {
      weekdays: { open: "9:00 AM", close: "6:00 PM" },
      saturday: { open: "10:00 AM", close: "4:00 PM" },
      sunday: { open: "", close: "" },
    },
    businessCategory: "",
    establishedYear: "",
    serviceArea: "",
    teamSize: "",
    rating: "",
    reviewCount: "",
    youtubeVideo: "",
    locationUrl: "",
    pincode: "",
    serviceRadius: null,
  });

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [currentSection, setCurrentSection] = useState("details");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [createdListingId, setCreatedListingId] = useState(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [imageUploadType, setImageUploadType] = useState("featured");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, citiesRes, userRes, plansRes] = await Promise.all(
          [
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categories`),
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cities`),
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/check-auth`, {
              credentials: "include",
            }),
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/subscription-plans`),
          ]
        );

        const categoriesData = await categoriesRes.json();
        const citiesData = await citiesRes.json();
        const userData = await userRes.json();
        const plansData = await plansRes.json();

        setCategories(categoriesData);
        setCities(citiesData);
        setUser(userData.user);
        setSubscriptionPlans(plansData);

        if (userData.user) {
          setFormData((prev) => ({
            ...prev,
            email: userData.user.email || "",
            phone: userData.user.phone || "",
            city: userData.user.city || "",
          }));
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(categoryFilter.toLowerCase())
  );

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(cityFilter.toLowerCase())
  );

  const validateImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          isValidBanner: img.naturalWidth === 1500 && img.naturalHeight === 500,
        });
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error("Failed to load image"));
      };
      img.src = URL.createObjectURL(file);
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categoryRef = useRef(null);
  const cityRef = useRef(null);

  const CategoryDropdown = () => (
    <div
      ref={categoryRef}
      className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg py-1 border border-gray-200"
    >
      <div className="px-3 py-2 border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search categories..."
            className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          />
        </div>
      </div>
      <div className="max-h-60 overflow-y-auto">
        {filteredCategories.map((category) => (
          <div
            key={category}
            className={`px-4 py-2 cursor-pointer flex justify-between items-center hover:bg-teal-50 ${
              formData.category === category
                ? "bg-teal-50 text-teal-700"
                : "text-gray-700"
            }`}
            onClick={() => {
              setFormData({ ...formData, category });
              setShowCategoryDropdown(false);
              setCategoryFilter("");
            }}
          >
            {category}
            {formData.category === category && (
              <Check className="h-4 w-4 text-teal-600" />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const handleTagKeyDown = (e) => {
    if (["Enter", ","].includes(e.key)) {
      e.preventDefault();
      if (formData.currentTag.trim() && formData.tags.length < 15) {
        const tag = formData.currentTag.trim();
        if (tag.length >= 2 && tag.length <= 30) {
          setFormData((prev) => ({
            ...prev,
            tags: [...prev.tags, tag],
            currentTag: "",
          }));
        }
      }
    }
  };

  const handleHighlightKeyDown = (e) => {
    if (["Enter", ","].includes(e.key)) {
      e.preventDefault();
      if (formData.currentHighlight.trim() && formData.highlights.length < 10) {
        const highlight = formData.currentHighlight.trim();
        if (highlight.length >= 5 && highlight.length <= 50) {
          setFormData((prev) => ({
            ...prev,
            highlights: [...prev.highlights, highlight],
            currentHighlight: "",
          }));
        }
      }
    }
  };

  const removeTag = (index) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const removeHighlight = (index) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  const handlePhotoUpload = async (e, type = "gallery") => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) {
      toast.error("No files selected");
      return;
    }

    // Reset file input
    e.target.value = "";

    // Validate file types and sizes
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type) || file.size > maxSize
    );

    if (invalidFiles.length > 0) {
      toast.error(
        `Invalid files: ${invalidFiles
          .map((f) => `${f.name} (${(f.size / (1024 * 1024)).toFixed(1)}MB)`)
          .join(", ")}. Please upload JPEG/PNG/WebP under 5MB.`
      );
      return;
    }

    // Check type-specific limits
    const currentTypeCount = formData.photos.filter(
      (p) => p.type === type
    ).length;
    let maxAllowed;

    switch (type) {
      case "featured":
        maxAllowed = 1;
        break;
      case "gallery":
        maxAllowed = 8;
        break;
      default:
        maxAllowed = 8;
    }

    if (files.length + currentTypeCount > maxAllowed) {
      toast.error(`You can upload maximum ${maxAllowed} ${type} image(s)`);
      return;
    }

    if (formData.photos.length + files.length > 10) {
      toast.error("You can upload maximum 10 photos in total");
      return;
    }

    setIsLoading(true);
    try {
      const newPhotos = [];
      const dimensionErrors = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const dimensions = await validateImageDimensions(file);

          // Validate dimensions based on type
          let isValidDimensions = true;
          let dimensionError = "";

          if (type === "featured") {
            // Recommend but don't enforce specific dimensions for featured images
            if (dimensions.width < 800 || dimensions.height < 600) {
              toast.warning(
                `Featured image is quite small (${dimensions.width}x${dimensions.height}). Consider using at least 1200x800px for better quality.`
              );
            }
          }

          if (!isValidDimensions) {
            dimensionErrors.push(`${file.name}: ${dimensionError}`);
            continue;
          }

          newPhotos.push({
            id: Date.now() + Math.random(), // Unique ID for each photo
            file,
            type,
            preview: URL.createObjectURL(file),
            dimensions: dimensions,
          });
        } catch (error) {
          dimensionErrors.push(
            `${file.name}: Failed to validate image dimensions`
          );
        }
      }

      if (dimensionErrors.length > 0) {
        toast.error(dimensionErrors.join("; "));
        if (newPhotos.length === 0) {
          setIsLoading(false);
          return;
        }
      }

      if (newPhotos.length > 0) {
        setFormData((prev) => ({
          ...prev,
          photos: [...prev.photos, ...newPhotos],
        }));
        toast.success(
          `${newPhotos.length} ${type} image(s) uploaded successfully!`
        );
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to process images");
    } finally {
      setIsLoading(false);
    }
  };

  const removePhoto = (photoId) => {
    setFormData((prev) => {
      const newPhotos = prev.photos.filter((photo) => photo.id !== photoId);
      return { ...prev, photos: newPhotos };
    });
    toast.success("Image removed successfully");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const featuredImages = formData.photos.filter(
        (photo) => photo.type === "featured"
      );
      if (featuredImages.length === 0) {
        toast.error("At least one featured image is required");
        setIsLoading(false);
        return;
      }

      // 1. Upload photos if any
      let uploadedPhotoUrls = [];
      if (formData.photos.length > 0) {
        const uploadFormData = new FormData();

        // Group photos by type for organized upload
        const photosByType = {
          featured: formData.photos.filter((p) => p.type === "featured"),
          gallery: formData.photos.filter((p) => p.type === "gallery"),
        };

        // Append files with type information
        formData.photos.forEach((photo, index) => {
          uploadFormData.append("photos", photo.file);
          uploadFormData.append(`photoTypes[${index}]`, photo.type);
        });

        // Send metadata about photo organization
        uploadFormData.append(
          "photoMetadata",
          JSON.stringify({
            featuredCount: photosByType.featured.length,
            galleryCount: photosByType.gallery.length,
          })
        );

        const uploadResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`,
          {
            method: "POST",
            body: uploadFormData,
            credentials: "include",
          }
        );

        if (!uploadResponse.ok) {
          throw new Error("Photo upload failed");
        }

        const uploadData = await uploadResponse.json();
        uploadedPhotoUrls = uploadData.urls;
      }

      // 2. Get selected subscription plan
      const selectedPlan = subscriptionPlans.find(
        (plan) => plan.tierType === formData.pricingOption
      );

      if (!selectedPlan) {
        throw new Error("Selected pricing plan not found");
      }

      // 3. Prepare listing data
      const listingData = {
        category: formData.category,
        type: formData.type,
        title: formData.title,
        description: formData.description,
        price: formData.price || "0",
        negotiable: formData.negotiable,
        city: formData.city,
        tags: formData.tags,
        highlights: formData.highlights,
        email: formData.email,
        phone: formData.phone,
        hidePhone: formData.hidePhone,
        listingTier: selectedPlan.tierType,
        website: formData.website,
        businessHours: JSON.stringify(formData.businessHours),
        businessCategory: formData.businessCategory,
        establishedYear: formData.establishedYear,
        serviceArea: formData.serviceArea,
        teamSize: formData.teamSize,
        rating: formData.rating,
        reviewCount: formData.reviewCount,
        subscriptionId: selectedPlan.id,
        photos: uploadedPhotoUrls,
        youtubeVideo: formData.youtubeVideo,
        locationUrl: formData.locationUrl,
        pincode: formData.pincode,
        serviceRadius: formData.serviceRadius,
      };

      // 4. Submit listing data
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/listings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(listingData),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create listing");
      }

      const result = await response.json();
      setCreatedListingId(result.listing.id);

      // 5. Handle payment flow if needed
      if (formData.pricingOption === "FREE") {
        setIsSuccess(true);
        toast.success("Listing created successfully!");
      } else {
        setPaymentAmount(parseFloat(selectedPlan.price) * 100);
        setShowPayment(true);
      }
    } catch (err) {
      console.error("Submission error:", err);
      toast.error(err.message || "Failed to create listing");
      setError(err.message || "An error occurred during submission");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Listing Created Successfully!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Your listing has been submitted and is now live on our platform.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Create New Listing
      </h1>

      {/* Progress Steps */}
      <div className="flex mb-8">
        <button
          onClick={() => setCurrentSection("details")}
          className={`flex-1 py-4 border-b-2 text-center font-medium ${
            currentSection === "details"
              ? "border-teal-500 text-teal-600"
              : "border-gray-200 text-gray-500"
          }`}
        >
          Details
        </button>
        <button
          onClick={() =>
            formData.photos.length > 0 && setCurrentSection("images")
          }
          className={`flex-1 py-4 border-b-2 text-center font-medium ${
            currentSection === "images"
              ? "border-teal-500 text-teal-600"
              : "border-gray-200 text-gray-500"
          } ${
            formData.photos.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Images
        </button>
        <button
          onClick={() =>
            formData.photos.length > 0 && setCurrentSection("pricing")
          }
          className={`flex-1 py-4 border-b-2 text-center font-medium ${
            currentSection === "pricing"
              ? "border-teal-500 text-teal-600"
              : "border-gray-200 text-gray-500"
          } ${
            formData.photos.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Pricing
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {currentSection === "details" && (
          <div className="space-y-6">
            {/* Category Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  className={`w-full flex justify-between items-center px-4 py-3 bg-white border ${
                    showCategoryDropdown
                      ? "border-teal-500 ring-1 ring-teal-500"
                      : "border-gray-300"
                  } rounded-lg shadow-sm text-left focus:outline-none`}
                  onClick={() => {
                    setShowCategoryDropdown(!showCategoryDropdown);
                    setShowCityDropdown(false);
                  }}
                >
                  <span
                    className={`${
                      formData.category ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {formData.category || "Select a category"}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 transition-transform ${
                      showCategoryDropdown ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                {showCategoryDropdown && <CategoryDropdown />}
              </div>
            </div>

            {/* Type Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="Professional"
                    checked={formData.type === "Professional"}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">Professional</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="Private individual"
                    checked={formData.type === "Private individual"}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">Private individual</span>
                </label>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                This will be displayed on the listing details page to inform
                other users.
              </p>
            </div>

            {/* Title Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter listing title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                minLength={2}
                maxLength={100}
              />
              <p className="mt-1 text-sm text-gray-500">
                A great title needs at least 10 characters (max 100).
              </p>
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                rows={4}
                placeholder="Describe your listing..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                minLength={50}
                maxLength={2000}
              />
              <p className="mt-1 text-sm text-gray-500">
                Minimum 50 characters, maximum 2000 characters.
              </p>
            </div>

            {/* Price Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">₹</span>
                </div>
                <input
                  type="number"
                  className="block w-full pl-8 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="eg 15000"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="mt-2 flex items-center">
                <input
                  id="negotiable"
                  type="checkbox"
                  checked={formData.negotiable}
                  onChange={(e) =>
                    setFormData({ ...formData, negotiable: e.target.checked })
                  }
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="negotiable"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Negotiable
                </label>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Enter 0 to offer this item (or service) as a donation.
              </p>
            </div>

            {/* City Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  className={`w-full flex justify-between items-center px-4 py-3 bg-white border ${
                    showCityDropdown
                      ? "border-teal-500 ring-1 ring-teal-500"
                      : "border-gray-300"
                  } rounded-lg shadow-sm text-left focus:outline-none`}
                  onClick={() => {
                    setShowCityDropdown(!showCityDropdown);
                    setShowCategoryDropdown(false);
                  }}
                >
                  <span
                    className={`${
                      formData.city ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {formData.city || "Select a city"}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 transition-transform ${
                      showCityDropdown ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                {showCityDropdown && (
                  <CityDropdown
                    cities={cities}
                    selectedCity={formData.city}
                    onSelectCity={(city) => setFormData({ ...formData, city })}
                    showDropdown={showCityDropdown}
                    setShowDropdown={setShowCityDropdown}
                  />
                )}
              </div>
            </div>

            {/* Tags Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2 p-2 border border-gray-300 rounded-lg min-h-12">
                {formData.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center bg-gray-100 px-2 py-1 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  value={formData.currentTag}
                  onChange={(e) =>
                    setFormData({ ...formData, currentTag: e.target.value })
                  }
                  onKeyDown={handleTagKeyDown}
                  className="flex-1 min-w-[100px] outline-none"
                  placeholder="Add tags..."
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Enter the tags separated by commas or press the Enter (↵) button
                on your keyboard after each tag. The number of tags cannot
                exceed 15. And each tag can only be 2 to 30 characters long.
              </p>
            </div>
            {/* Business Details Section */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Business Details
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube Video Link
                </label>
                <input
                  type="url"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  value={formData.youtubeVideo}
                  onChange={(e) =>
                    setFormData({ ...formData, youtubeVideo: e.target.value })
                  }
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="mt-1 text-sm text-gray-500">
                  Add a YouTube video showcasing your business (optional)
                </p>
              </div>

              {/* Location URL */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location URL
                </label>
                <input
                  type="url"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  value={formData.locationUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, locationUrl: e.target.value })
                  }
                  placeholder="https://maps.google.com/..."
                />
                <p className="mt-1 text-sm text-gray-500">
                  Google Maps or other location service URL (required)
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  value={formData.pincode}
                  onChange={(e) =>
                    setFormData({ ...formData, pincode: e.target.value })
                  }
                  placeholder="Pincode"
                />
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Phone
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              {/* Website */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Hours
                </label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-24 text-gray-600">Monday-Friday:</span>
                    <input
                      type="time"
                      className="border rounded p-2"
                      value={formData.businessHours.weekdays.open}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          businessHours: {
                            ...formData.businessHours,
                            weekdays: {
                              ...formData.businessHours.weekdays,
                              open: e.target.value,
                            },
                          },
                        })
                      }
                    />
                    <span>to</span>
                    <input
                      type="time"
                      className="border rounded p-2"
                      value={formData.businessHours.weekdays.close}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          businessHours: {
                            ...formData.businessHours,
                            weekdays: {
                              ...formData.businessHours.weekdays,
                              close: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="w-24 text-gray-600">Saturday:</span>
                    <input
                      type="time"
                      className="border rounded p-2"
                      value={formData.businessHours.saturday.open}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          businessHours: {
                            ...formData.businessHours,
                            saturday: {
                              ...formData.businessHours.saturday,
                              open: e.target.value,
                            },
                          },
                        })
                      }
                    />
                    <span>to</span>
                    <input
                      type="time"
                      className="border rounded p-2"
                      value={formData.businessHours.saturday.close}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          businessHours: {
                            ...formData.businessHours,
                            saturday: {
                              ...formData.businessHours.saturday,
                              close: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>

                  {/* Sunday */}
                  <div className="flex items-center space-x-2">
                    <span className="w-24 text-gray-600">Sunday:</span>
                    <select
                      className="border rounded p-2"
                      value={
                        formData.businessHours.sunday.open ? "open" : "closed"
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          businessHours: {
                            ...formData.businessHours,
                            sunday:
                              e.target.value === "open"
                                ? { open: "10:00 AM", close: "2:00 PM" }
                                : { open: "", close: "" },
                          },
                        })
                      }
                    >
                      <option value="closed">Closed</option>
                      <option value="open">Open</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Highlights Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Key Features/Highlights
              </label>
              <div className="flex flex-wrap gap-2 mb-2 p-2 border border-gray-300 rounded-lg min-h-12">
                {formData.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center bg-blue-100 px-2 py-1 rounded-full text-sm"
                  >
                    {highlight}
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
                      className="ml-1 text-blue-500 hover:text-blue-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  value={formData.currentHighlight}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentHighlight: e.target.value,
                    })
                  }
                  onKeyDown={handleHighlightKeyDown}
                  className="flex-1 min-w-[100px] outline-none"
                  placeholder="Add key features..."
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                List the key features or benefits of your service (e.g., "Free
                consultation", "10+ years experience"). Press Enter after each
                feature.
              </p>
            </div>

            {/* Seller Information */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Seller information
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    className="block w-full pl-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              {/* Business Category */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Category
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  value={formData.businessCategory}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      businessCategory: e.target.value,
                    })
                  }
                  placeholder="e.g., Consulting, Retail, IT Services"
                />
              </div>

              {/* Established Year */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Established Year
                </label>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  value={formData.establishedYear}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      establishedYear: e.target.value,
                    })
                  }
                  placeholder="e.g., 2010"
                />
              </div>

              {/* Service Area */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Area
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  value={formData.serviceArea}
                  onChange={(e) =>
                    setFormData({ ...formData, serviceArea: e.target.value })
                  }
                  placeholder="e.g., 25 miles, Nationwide, Local"
                />
              </div>

              {/* Team Size */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Size
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  value={formData.teamSize}
                  onChange={(e) =>
                    setFormData({ ...formData, teamSize: e.target.value })
                  }
                  placeholder="e.g., 10-15 employees, 50+ staff"
                />
              </div>

              {/* Rating */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({ ...formData, rating: e.target.value })
                  }
                  placeholder="e.g., 4.8"
                />
              </div>

              {/* Review Count */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Review Count
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  value={formData.reviewCount}
                  onChange={(e) =>
                    setFormData({ ...formData, reviewCount: e.target.value })
                  }
                  placeholder="e.g., 56"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">+91</span>
                  </div>
                  <input
                    type="tel"
                    className="block w-full pl-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                    placeholder=""
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    pattern="[0-9]{10}"
                    maxLength="10"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          hidePhone: !formData.hidePhone,
                        })
                      }
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {formData.hidePhone ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  <input
                    id="hidePhone"
                    type="checkbox"
                    checked={formData.hidePhone}
                    onChange={(e) =>
                      setFormData({ ...formData, hidePhone: e.target.checked })
                    }
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="hidePhone"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Hide phone number
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentSection("images")}
                disabled={
                  !formData.category ||
                  !formData.title ||
                  !formData.description ||
                  !formData.city ||
                  !formData.email
                }
                className="px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Images
              </button>
            </div>
          </div>
        )}
        {currentSection === "images" && (
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Upload Your Images
              </h3>
              <p className="text-sm text-gray-600">
                Add high-quality images to showcase your listing. Different
                image types serve different purposes.
              </p>
            </div>

            {/* Image Type Selector */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">
                Choose Image Type
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-2">
                    <Camera className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-medium text-gray-900">
                      Featured Image
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Main image shown in search results (1200x800px recommended)
                  </p>
                  <button
                    type="button"
                    onClick={() => setImageUploadType("featured")}
                    className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    Upload Featured
                  </button>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-2">
                    <ImagePlus className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium text-gray-900">
                      Gallery Images
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Additional photos for detailed view (any size)
                  </p>
                  <button
                    type="button"
                    onClick={() => setImageUploadType("gallery")}
                    className="w-full px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                  >
                    Upload Gallery
                  </button>
                </div>
              </div>
            </div>

            {/* Image Upload Areas */}
            <div className="space-y-6">
              {/* Featured Image Section */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <Camera className="h-5 w-5 text-blue-600 mr-2" />
                    Featured Image
                    <span className="ml-2 text-sm text-red-500">*</span>
                  </h4>
                  <span className="text-sm text-gray-500">
                    1 image required
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {formData.photos
                    .filter((photo) => photo.type === "featured")
                    .map((photo, index) => (
                      <div key={`featured-${index}`} className="relative group">
                        <div className="aspect-[3/2] bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={photo.preview}
                            alt="Featured"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute top-2 left-2">
                          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                            Featured
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePhoto(photo.id)}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="mt-2 text-sm text-gray-600">
                          {photo.dimensions?.width}x{photo.dimensions?.height}px
                        </div>
                      </div>
                    ))}

                  {formData.photos.filter((photo) => photo.type === "featured")
                    .length === 0 && (
                    <label className="aspect-[3/2] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors bg-gray-50 hover:bg-blue-50">
                      <Camera className="h-12 w-12 text-gray-400 mb-2" />
                      <span className="text-sm font-medium text-gray-700 mb-1">
                        Upload Featured Image
                      </span>
                      <span className="text-xs text-gray-500">
                        Recommended: 1200x800px
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(e, "featured")}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Banner Image Section */}

              {/* Gallery Images Section */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <ImagePlus className="h-5 w-5 text-green-600 mr-2" />
                    Gallery Images
                  </h4>
                  <span className="text-sm text-gray-500">
                    {
                      formData.photos.filter(
                        (photo) => photo.type === "gallery"
                      ).length
                    }
                    /8 images
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {formData.photos
                    .filter((photo) => photo.type === "gallery")
                    .map((photo, index) => (
                      <div key={`gallery-${index}`} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={photo.preview}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute top-2 left-2">
                          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                            #{index + 1}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePhoto(photo.id)}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}

                  {formData.photos.filter((photo) => photo.type === "gallery")
                    .length < 8 && (
                    <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition-colors bg-gray-50 hover:bg-green-50">
                      <ImagePlus className="h-8 w-8 text-gray-400 mb-1" />
                      <span className="text-xs font-medium text-gray-700">
                        Add Image
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handlePhotoUpload(e, "gallery")}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Image Requirements Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                <Info className="h-5 w-5 mr-2" />
                Image Requirements & Tips
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • <strong>Featured Image:</strong> Main listing image
                  (1200x800px recommended, max 5MB)
                </li>
                <li>
                  • <strong>Gallery Images:</strong> Additional detail photos
                  (any size, max 5MB each)
                </li>
                <li>• Supported formats: JPEG, PNG, WebP</li>
                <li>
                  • Use high-quality, well-lit images for better visibility
                </li>
                <li>• Avoid images with text overlay or watermarks</li>
              </ul>
            </div>

            {/* Progress Indicator */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Upload Progress
                </span>
                <span className="text-sm text-gray-600">
                  {formData.photos.length} / 10 images
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      (formData.photos.length / 10) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Featured:{" "}
                {formData.photos.filter((p) => p.type === "featured").length > 0
                  ? "✓"
                  : "✗"}{" "}
                | Banner:{" "}
                {formData.photos.filter((p) => p.type === "banner").length > 0
                  ? "✓"
                  : "Optional"}{" "}
                | Gallery:{" "}
                {formData.photos.filter((p) => p.type === "gallery").length}{" "}
                images
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentSection("details")}
                className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentSection("pricing")}
                disabled={
                  formData.photos.filter((photo) => photo.type === "featured")
                    .length === 0
                }
                className="px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Pricing
              </button>
            </div>
          </div>
        )}
        {currentSection === "pricing" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Premium Listing
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  The premium package helps sellers promote their products or
                  services by giving more visibility to their listings to
                  attract more buyers and sell faster.
                </p>
              </div>

              <div className="divide-y divide-gray-200">
                {subscriptionPlans.map((plan) => (
                  <label
                    key={plan.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="pricingOption"
                        value={plan.tierType}
                        checked={formData.pricingOption === plan.tierType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pricingOption: e.target.value,
                          })
                        }
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <div className="ml-3">
                        <span className="block text-sm font-medium text-gray-700">
                          {plan.name}
                        </span>
                        <span className="block text-sm text-gray-500">
                          {plan.description}
                        </span>
                        <span className="block text-xs text-gray-400 mt-1">
                          Duration: {plan.durationDays} days • Promotion:{" "}
                          {plan.promotionDays} days
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      ₹ {plan.price}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rest of the pricing section remains the same */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                <HelpCircle className="h-5 w-5 text-blue-500 mr-2" />
                How to sell quickly?
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li>Use a brief title and description of the item</li>
                <li>Make sure you post in the correct category</li>
                <li>Add nice photos to your listing</li>
                <li>Put a reasonable price</li>
                <li>Check the item before publish</li>
              </ul>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentSection("images")}
                className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Back
              </button>
              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Create New Listing"
                )}
              </button>
            </div>
          </div>
        )}
      </form>
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <PaymentGateway
              amount={paymentAmount}
              currency="INR"
              listingId={createdListingId}
              pricingOption={formData.pricingOption}
              onSuccess={() => {
                setIsSuccess(true);
                setShowPayment(false);
              }}
              onClose={() => setShowPayment(false)}
            />
          </div>
        </div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
