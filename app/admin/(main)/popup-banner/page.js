"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Loader2, Image as ImageIcon } from "lucide-react";
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
  const [formData, setFormData] = useState({
    ListingUrl: "",
    active: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [bannerLimitReached, setBannerLimitReached] = useState(false);

  // Fetch all banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/home-banner`,
          { withCredentials: true }
        );
        setBanners(response.data);
        setBannerLimitReached(response.data.length >= 1);
      } catch (error) {
        console.error("Failed to fetch banners:", error);
        toast.error("Failed to load banners");
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Create or update banner
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (bannerLimitReached && !editingId) {
      toast.error(
        "Only one banner is allowed. Please delete the current banner first."
      );
      return;
    }

    setIsUploading(true);

    try {
      if (!selectedFile && !editingId) {
        toast.error("Please select an image");
        return;
      }

      let imageUrl = editingId
        ? banners.find((b) => b.id === editingId)?.Image
        : "";

      // Upload new image if not editing or if editing with new file
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("image", selectedFile);
        const uploadResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/home-banner/upload`,
          uploadFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        imageUrl = uploadResponse.data.Image;
      }

      // Prepare banner data
      const bannerData = {
        Image: imageUrl,
        ListingUrl: formData.ListingUrl,
        active: formData.active,
      };

      if (editingId) {
        // Update existing banner
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/home-banner/${editingId}`,
          bannerData,
          { withCredentials: true }
        );
        toast.success("Banner updated successfully");
      } else {
        // Create new banner
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/home-banner`,
          bannerData,
          { withCredentials: true }
        );
        toast.success("Banner created successfully");
        setBannerLimitReached(true);
      }

      // Refresh banner list
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/home-banner`,
        { withCredentials: true }
      );
      setBanners(response.data);

      // Reset form
      setFormData({ ListingUrl: "", active: true });
      setSelectedFile(null);
      setPreviewUrl(null);
      setEditingId(null);
    } catch (error) {
      console.error("Error saving banner:", error);
      toast.error(error.response?.data?.message || "Failed to save banner");
    } finally {
      setIsUploading(false);
    }
  };

  // Edit banner
  const handleEdit = (banner) => {
    setEditingId(banner.id);
    setFormData({
      ListingUrl: banner.ListingUrl || "",
      active: banner.active,
    });
    setPreviewUrl(banner.Image);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete banner
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/home-banner/${id}`,
        { withCredentials: true }
      );
      setBanners(banners.filter((banner) => banner.id !== id));
      setBannerLimitReached(false);
      toast.success("Banner deleted successfully");

      // Reset form if editing the deleted banner
      if (editingId === id) {
        setFormData({ ListingUrl: "", active: true });
        setSelectedFile(null);
        setPreviewUrl(null);
        setEditingId(null);
      }
    } catch (error) {
      console.error("Failed to delete banner:", error);
      toast.error("Failed to delete banner");
    }
  };

  // Toggle banner status
  const toggleActive = async (id, currentStatus) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/home-banner/${id}`,
        { active: !currentStatus },
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

  return (
    <div className="py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            PopUp Banner Management
          </h1>
          <p className="text-gray-600">
            {bannerLimitReached
              ? "You can only have one popup banner at a time"
              : "Add your popup page banner"}
          </p>
        </div>

        {/* Banner Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {editingId
              ? "Edit Banner"
              : bannerLimitReached
              ? "Edit Current Banner"
              : "Add New Banner"}
          </h2>

          {bannerLimitReached && !editingId ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Only one banner is allowed. Please delete the current banner
                    before uploading a new one.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Banner Image
                </label>
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
                          <span className="text-black opacity-0 group-hover:opacity-100">
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
                          Recommended size: 1200x400px
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
                      setFormData({ ListingUrl: "", active: true });
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isUploading && (
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  )}
                  {editingId ? "Update Banner" : "Add Banner"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Banners List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Current Banner
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
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-shrink-0">
                      <img
                        src={banner.Image}
                        alt={`Banner ${banner.id}`}
                        className="h-32 w-full object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {banner.ListingUrl || "No link URL"}
                      </p>
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
