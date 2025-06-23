"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Loader2,
  Image as ImageIcon,
  MapPin,
  Calendar,
  ExternalLink,
  Youtube,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function BannerManagementPage() {
  const router = useRouter();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [mediaType, setMediaType] = useState("image"); // 'image' or 'youtube'
  const [formData, setFormData] = useState({
    youtubeUrl: "",
    ListingUrl: "",
    pincode: "",
    locationUrl: "",
    expiresAt: "",
    active: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [dimensionError, setDimensionError] = useState(null);
  const bannerType = "bottom-banners";

  // Fetch all banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/bottom-banners`,
          {}
        );
        setBanners(response.data);
      } catch (error) {
        console.error("Failed to fetch banners:", error);
        toast.error("Failed to load banners");
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Handle file selection with dimension validation
  const handleFileChange = async (e) => {
    setDimensionError(null);

    if (!e.target.files || !e.target.files[0]) {
      return;
    }

    const file = e.target.files[0];

    // Validate image dimensions
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      if (img.width !== 1500 || img.height !== 500) {
        setDimensionError("Image must be exactly 1500px wide and 500px tall");
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }

      // Dimensions are correct
      setSelectedFile(file);
      setPreviewUrl(img.src);
      setDimensionError(null);
    };

    img.onerror = () => {
      setDimensionError("Failed to load image. Please try another file.");
      setSelectedFile(null);
      setPreviewUrl(null);
    };
  };

  // Format date for datetime-local input
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Create or update banner
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    // Check dimensions again before submitting
    if (mediaType === "image" && selectedFile && !editingId) {
      const img = new Image();
      img.src = URL.createObjectURL(selectedFile);

      const dimensionsValid = await new Promise((resolve) => {
        img.onload = () => {
          resolve(img.width === 1500 && img.height === 500);
        };
      });

      if (!dimensionsValid) {
        setDimensionError("Image must be exactly 1500px wide and 500px tall");
        setIsUploading(false);
        return;
      }
    }

    try {
      // Validate media selection
      if (mediaType === "image" && !selectedFile && !editingId) {
        toast.error("Please select an image");
        return;
      }

      if (mediaType === "youtube" && !formData.youtubeUrl) {
        toast.error("Please enter a YouTube URL");
        return;
      }

      let imageUrl = editingId
        ? banners.find((b) => b.id === editingId)?.Image
        : "";
      let youtubeUrl = editingId
        ? banners.find((b) => b.id === editingId)?.youtubeUrl
        : "";

      // Upload new image if image type is selected and file is provided
      if (mediaType === "image" && selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("image", selectedFile);
        const uploadResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/bottom-banners/upload`,
          uploadFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        imageUrl = uploadResponse.data.Image;
        youtubeUrl = null; // Clear youtubeUrl if switching to image
      } else if (mediaType === "youtube") {
        imageUrl = null; // Clear imageUrl if switching to YouTube
        youtubeUrl = formData.youtubeUrl;
      }

      // Prepare banner data
      const bannerData = {
        Image: imageUrl,
        youtubeUrl: youtubeUrl,
        ListingUrl: formData.ListingUrl,
        pincode: formData.pincode ? parseInt(formData.pincode) : null,
        locationUrl: formData.locationUrl,
        expiresAt: formData.expiresAt
          ? new Date(formData.expiresAt).toISOString()
          : null,
        active: formData.active,
      };

      if (editingId) {
        // Update existing banner
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/bottom-banners/${editingId}`,
          bannerData,
          {
            withCredentials: true,
          }
        );
        toast.success("Banner updated successfully");
      } else {
        // Create new banner
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/bottom-banners`,
          bannerData,
          {
            withCredentials: true,
          }
        );
        toast.success("Banner created successfully");
      }

      // Refresh banner list
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/bottom-banners`,
        {
          withCredentials: true,
        }
      );
      setBanners(response.data);

      // Reset form
      setFormData({
        youtubeUrl: "",
        ListingUrl: "",
        pincode: "",
        locationUrl: "",
        expiresAt: "",
        active: true,
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      setEditingId(null);
      setMediaType("image");
      setDimensionError(null);
    } catch (error) {
      console.error("Error saving banner:", error);
      toast.error("Failed to save banner");
    } finally {
      setIsUploading(false);
    }
  };

  // Edit banner
  const handleEdit = (banner) => {
    setEditingId(banner.id);
    setFormData({
      youtubeUrl: banner.youtubeUrl || "",
      ListingUrl: banner.ListingUrl || "",
      pincode: banner.pincode ? banner.pincode.toString() : "",
      locationUrl: banner.locationUrl || "",
      expiresAt: banner.expiresAt ? formatDateForInput(banner.expiresAt) : "",
      active: banner.active,
    });

    // Determine media type based on what exists
    if (banner.youtubeUrl) {
      setMediaType("youtube");
      setPreviewUrl(
        `https://img.youtube.com/vi/${extractYouTubeId(
          banner.youtubeUrl
        )}/0.jpg`
      );
    } else {
      setMediaType("image");
      setPreviewUrl(banner.Image);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Extract YouTube ID from URL
  const extractYouTubeId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Delete banner
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/bottom-banners/${id}`,
        { withCredentials: true }
      );
      setBanners(banners.filter((banner) => banner.id !== id));
      toast.success("Banner deleted successfully");
    } catch (error) {
      console.error("Failed to delete banner:", error);
      toast.error("Failed to delete banner");
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/${bannerType}/${id}/toggle-status`,
        {},
        { withCredentials: true }
      );

      setBanners(
        banners.map((banner) =>
          banner.id === id ? { ...banner, active: !currentStatus } : banner
        )
      );

      toast.success(`Banner ${!currentStatus ? "activated" : "deactivated"}`);
    } catch (error) {
      console.error("Failed to update banner status:", error);
      toast.error("Failed to update banner status");
    }
  };

  // Check if banner is expired
  const isExpired = (expiresAt) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bottom Banners Management
          </h1>
          <p className="text-gray-600">Manage your home page banners</p>
        </div>

        {/* Banner Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {editingId ? "Edit Banner" : "Add New Banner"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Media Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banner Media Type
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setMediaType("image")}
                  className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                    mediaType === "image"
                      ? "bg-blue-100 text-blue-800 border border-blue-300"
                      : "bg-gray-100 text-gray-800 border border-gray-300"
                  }`}
                >
                  <ImageIcon className="h-4 w-4" />
                  <span>Image</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType("youtube")}
                  className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                    mediaType === "youtube"
                      ? "bg-red-100 text-red-800 border border-red-300"
                      : "bg-gray-100 text-gray-800 border border-gray-300"
                  }`}
                >
                  <Youtube className="h-4 w-4" />
                  <span>YouTube</span>
                </button>
              </div>
            </div>

            {/* Image Upload */}
            {mediaType === "image" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Banner Image (1500px × 500px required)
                </label>
                {dimensionError && (
                  <div className="mb-2 flex items-center text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {dimensionError}
                  </div>
                )}
                <div className="mt-1 flex items-center">
                  <label
                    htmlFor="banner-upload"
                    className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 w-full hover:border-gray-400 transition-colors"
                  >
                    {previewUrl ? (
                      <div className="relative group">
                        <img
                          src={previewUrl}
                          alt="Banner preview"
                          className="max-h-48 rounded-md object-contain"
                        />
                        <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                          <span className="text-yellow-600 font-bold opacity-0 group-hover:opacity-100">
                            Change Image
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                          Click to upload an image
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          Required size: 1500px × 500px
                        </span>
                      </div>
                    )}
                    <input
                      id="banner-upload"
                      name="banner-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* YouTube URL */}
            {mediaType === "youtube" && (
              <div>
                <label
                  htmlFor="youtubeUrl"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  YouTube Video URL
                </label>
                <input
                  type="url"
                  id="youtubeUrl"
                  name="youtubeUrl"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.youtubeUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, youtubeUrl: e.target.value })
                  }
                />
                {formData.youtubeUrl && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-1">Preview:</p>
                    <div className="aspect-w-16 aspect-h-9">
                      {extractYouTubeId(formData.youtubeUrl) ? (
                        <img
                          src={`https://img.youtube.com/vi/${extractYouTubeId(
                            formData.youtubeUrl
                          )}/0.jpg`}
                          alt="YouTube thumbnail preview"
                          className="max-w-xs rounded-md"
                        />
                      ) : (
                        <p className="text-sm text-red-500">
                          Invalid YouTube URL
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="listingUrl"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Link URL (optional)
                </label>
                <input
                  type="url"
                  id="listingUrl"
                  name="listingUrl"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/promotion"
                  value={formData.ListingUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, ListingUrl: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="pincode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Pincode (Leave blank for all locations)
                </label>
                <input
                  type="number"
                  id="pincode"
                  name="pincode"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="110001"
                  value={formData.pincode}
                  onChange={(e) =>
                    setFormData({ ...formData, pincode: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="locationUrl"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Location URL (optional)
                </label>
                <input
                  type="url"
                  id="locationUrl"
                  name="locationUrl"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://maps.google.com/..."
                  value={formData.locationUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, locationUrl: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="expiresAt"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Expires At (optional)
                </label>
                <input
                  type="datetime-local"
                  id="expiresAt"
                  name="expiresAt"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.expiresAt}
                  onChange={(e) =>
                    setFormData({ ...formData, expiresAt: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="active"
                name="active"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={formData.active}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.checked })
                }
              />
              <label
                htmlFor="active"
                className="ml-2 block text-sm text-gray-700"
              >
                Active
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      youtubeUrl: "",
                      ListingUrl: "",
                      pincode: "",
                      locationUrl: "",
                      expiresAt: "",
                      active: true,
                    });
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    setMediaType("image");
                    setDimensionError(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={
                  isUploading || (mediaType === "image" && dimensionError)
                }
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isUploading && (
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                )}
                {editingId ? "Update Banner" : "Add Banner"}
              </button>
            </div>
          </form>
        </div>

        {/* Banners List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Current Banners
            </h2>
          </div>
          {loading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
            </div>
          ) : banners.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No banners found. Add your first banner above.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {banners.map((banner) => (
                <li key={banner.id} className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    <div className="flex-shrink-0">
                      {banner.youtubeUrl ? (
                        <div className="relative">
                          <img
                            src={`https://img.youtube.com/vi/${extractYouTubeId(
                              banner.youtubeUrl
                            )}/0.jpg`}
                            alt={`YouTube thumbnail for ${banner.youtubeUrl}`}
                            className="h-32 w-full lg:w-48 object-cover rounded-md"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-red-600 text-white rounded-full p-2">
                              <Youtube className="h-6 w-6" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={banner.Image}
                          alt={`Banner ${banner.id}`}
                          className="h-32 w-full lg:w-48 object-cover rounded-md"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            Media Type
                          </p>
                          <p className="text-sm text-gray-600 flex items-center">
                            {banner.youtubeUrl ? (
                              <>
                                <Youtube className="h-3 w-3 mr-1 text-red-500" />
                                YouTube Video
                              </>
                            ) : (
                              <>
                                <ImageIcon className="h-3 w-3 mr-1 text-blue-500" />
                                Image
                              </>
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            Link URL
                          </p>
                          <p className="text-sm text-gray-600 truncate flex items-center">
                            {banner.ListingUrl ? (
                              <>
                                <ExternalLink className="h-3 w-3 mr-1" />
                                {banner.ListingUrl}
                              </>
                            ) : (
                              "No link URL"
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            Pincode
                          </p>
                          <p className="text-sm text-gray-600 flex items-center">
                            {banner.pincode ? (
                              <>
                                <MapPin className="h-3 w-3 mr-1" />
                                {banner.pincode}
                              </>
                            ) : (
                              "No pincode"
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            Location URL
                          </p>
                          <p className="text-sm text-gray-600 truncate flex items-center">
                            {banner.locationUrl ? (
                              <>
                                <MapPin className="h-3 w-3 mr-1" />
                                {banner.locationUrl}
                              </>
                            ) : (
                              "No location URL"
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            Expires At
                          </p>
                          <p className="text-sm text-gray-600 flex items-center">
                            {banner.expiresAt ? (
                              <>
                                <Calendar className="h-3 w-3 mr-1" />
                                <span
                                  className={
                                    isExpired(banner.expiresAt)
                                      ? "text-red-600"
                                      : ""
                                  }
                                >
                                  {new Date(banner.expiresAt).toLocaleString()}
                                  {isExpired(banner.expiresAt) && " (Expired)"}
                                </span>
                              </>
                            ) : (
                              "No expiration"
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center space-x-4">
                        <p className="text-sm text-gray-500">
                          Created:{" "}
                          {new Date(banner.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Status:{" "}
                          <span
                            className={`font-medium ${
                              banner.active ? "text-green-600" : "text-gray-500"
                            }`}
                          >
                            {banner.active ? "Active" : "Inactive"}
                          </span>
                        </p>
                        {isExpired(banner.expiresAt) && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Expired
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleActive(banner.id, banner.active)}
                        className={`px-3 py-1 rounded-md text-xs font-medium ${
                          banner.active
                            ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            : "bg-green-100 text-green-800 hover:bg-green-200"
                        }`}
                      >
                        {banner.active ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleEdit(banner)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(banner.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
