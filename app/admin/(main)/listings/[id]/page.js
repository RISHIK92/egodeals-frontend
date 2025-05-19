"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  Star,
  Trash,
  ArrowLeft,
  Edit,
  Image as ImageIcon,
  Clock,
  ExternalLink,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

const ListingDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [listing, setListing] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN || "";

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`${backendUrl}/admin/listings/${id}`, {
          credentials: "include",
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch listing: ${errorText}`);
        }

        const data = await response.json();
        setListing(data);
      } catch (error) {
        console.error("Listing error:", error);
        toast.error("Failed to load listing details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id, backendUrl]);

  const handleApprove = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const response = await fetch(
        `${backendUrl}/admin/listings/${id}/approve`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ comments: "Approved by admin" }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to approve listing: ${errorText}`);
      }

      setListing((prev) => (prev ? { ...prev, status: "APPROVED" } : null));
      toast.success("Listing approved successfully");
    } catch (error) {
      console.error("Approve error:", error);
      toast.error("Failed to approve listing");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const response = await fetch(
        `${backendUrl}/admin/listings/${id}/reject`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ comments: "Rejected by admin" }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to reject listing: ${errorText}`);
      }

      setListing((prev) => (prev ? { ...prev, status: "REJECTED" } : null));
      toast.success("Listing rejected successfully");
    } catch (error) {
      console.error("Reject error:", error);
      toast.error("Failed to reject listing");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFeature = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const response = await fetch(
        `${backendUrl}/admin/listings/${id}/feature`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ duration: "SEVEN_DAYS" }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to feature listing: ${errorText}`);
      }

      toast.success("Listing featured successfully");
    } catch (error) {
      console.error("Feature error:", error);
      toast.error("Failed to feature listing");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (isProcessing) return;
    if (!confirm("Are you sure you want to delete this listing?")) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`${backendUrl}/admin/listings/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete listing: ${errorText}`);
      }

      toast.success("Listing deleted successfully");
      router.push("/admin/listings");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete listing");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatBusinessHours = () => {
    if (!listing?.businessHours) return null;

    const days = [
      { key: "weekdays", label: "Weekdays" },
      { key: "saturday", label: "Saturday" },
      { key: "sunday", label: "Sunday" },
    ];

    return days.map((day) => {
      const hours = listing.businessHours[day.key];
      if (!hours || (!hours.open && !hours.close)) return null;

      return (
        <div key={day.key} className="flex items-center text-sm">
          <span className="w-24 font-medium text-gray-500">{day.label}</span>
          <span className="text-gray-900">
            {hours.open && hours.close
              ? `${hours.open} - ${hours.close}`
              : "Closed"}
          </span>
        </div>
      );
    });
  };

  const formatPromotions = () => {
    if (!listing?.promotions || listing.promotions.length === 0) {
      return <p className="text-sm text-gray-500">No active promotions</p>;
    }

    return listing.promotions.map((promo) => (
      <div key={promo.id} className="p-3 bg-gray-50 rounded-md mb-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium">{promo.durationDays} day promotion</p>
            <p className="text-sm text-gray-500">
              {new Date(promo.startDate).toLocaleDateString()} -{" "}
              {new Date(promo.endDate).toLocaleDateString()}
            </p>
          </div>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              promo.isActive
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {promo.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
    ));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Listing not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Listings
        </button>
        <div className="flex flex-wrap gap-2">
          {listing.status === "PENDING_APPROVAL" && (
            <>
              <button
                onClick={handleApprove}
                disabled={isProcessing}
                className={`flex items-center px-4 py-2 ${
                  isProcessing
                    ? "bg-green-400"
                    : "bg-green-600 hover:bg-green-700"
                } text-white rounded-md`}
              >
                <CheckCircle className="w-5 h-5 mr-1" />
                {isProcessing ? "Processing..." : "Approve"}
              </button>
              <button
                onClick={handleReject}
                disabled={isProcessing}
                className={`flex items-center px-4 py-2 ${
                  isProcessing ? "bg-red-400" : "bg-red-600 hover:bg-red-700"
                } text-white rounded-md`}
              >
                <XCircle className="w-5 h-5 mr-1" />
                {isProcessing ? "Processing..." : "Reject"}
              </button>
            </>
          )}
          <button
            onClick={handleFeature}
            disabled={isProcessing}
            className={`flex items-center px-4 py-2 ${
              isProcessing
                ? "bg-yellow-400"
                : "bg-yellow-600 hover:bg-yellow-700"
            } text-white rounded-md`}
          >
            <Star className="w-5 h-5 mr-1" />
            {isProcessing ? "Processing..." : "Feature"}
          </button>
          <button
            onClick={handleDelete}
            disabled={isProcessing}
            className={`flex items-center px-4 py-2 ${
              isProcessing ? "bg-red-400" : "bg-red-600 hover:bg-red-700"
            } text-white rounded-md`}
          >
            <Trash className="w-5 h-5 mr-1" />
            {isProcessing ? "Processing..." : "Delete"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {listing.title}
              </h2>
              <p className="text-sm text-gray-500">
                {listing.category?.name || "N/A"} • {listing.type}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  listing.status === "APPROVED"
                    ? "bg-green-100 text-green-800"
                    : listing.status === "REJECTED"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {listing.status.replace("_", " ")}
              </span>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  listing.listingTier === "PREMIUM"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {listing.listingTier}
              </span>
              {listing.isBannerEnabled && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                  Banner Enabled
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Description
                </h3>
                <p className="mt-2 text-gray-600 whitespace-pre-line">
                  {listing.description}
                </p>
              </div>

              {listing.highlights && listing.highlights.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Highlights
                  </h3>
                  <ul className="mt-2 space-y-2">
                    {listing.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        <span className="text-gray-600">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Business Hours
                </h3>
                <div className="mt-2 space-y-2">{formatBusinessHours()}</div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">Details</h3>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="text-sm font-medium text-gray-900">
                      ₹{listing.price.toLocaleString()}
                      {listing.negotiable && (
                        <span className="ml-2 text-xs text-gray-500">
                          (Negotiable)
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900">
                      {listing.phone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <p className="text-sm font-medium text-gray-900">
                      {listing.website ? (
                        <a
                          href={
                            listing.website.startsWith("http")
                              ? listing.website
                              : `https://${listing.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center"
                        >
                          {listing.website}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Expires At</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(listing.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created At</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(listing.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(listing.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">User</h3>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                      {listing.user.firstName?.charAt(0) || "?"}
                      {listing.user.lastName?.charAt(0) || ""}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {listing.user.firstName} {listing.user.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {listing.user.email || "No email provided"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {listing.user.phone || "No phone provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Promotions
                </h3>
                <div className="mt-2">{formatPromotions()}</div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">Images</h3>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {listing.ListingImage?.length > 0 ? (
                    listing.ListingImage.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square bg-gray-200 rounded-md overflow-hidden"
                      >
                        <img
                          src={image.url}
                          alt={`Listing image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder-image.jpg";
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg text-gray-500">
                      <ImageIcon className="w-8 h-8" />
                      <p className="mt-2 text-sm">No images</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
};

export default ListingDetailPage;
