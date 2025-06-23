"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  Eye,
  Star,
  Trash,
  Search,
  ChevronLeft,
  ChevronRight,
  Edit,
  Plus,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import EditListingModal from "./components/editListingModal";

const ListingsPage = ({ defaultStatus = "" }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [listings, setListings] = useState([]);
  const [totalListings, setTotalListings] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(defaultStatus);

  const handleListingCreated = (newListing) => {
    setListings((prev) => [newListing, ...prev]);
    setTotalListings((prev) => prev + 1);
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: currentPage,
          limit: 10,
          ...(statusFilter && { status: statusFilter }),
          ...(searchTerm && { search: searchTerm }),
        });

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/admin/listings?${params}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch listings: ${response.status}`);
        }

        const data = await response.json();
        setListings(data.listings);
        setTotalListings(data.total);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Listings error:", error);
        setError(error.message);
        toast.error("Failed to load listings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [currentPage, statusFilter, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleApprove = async (id) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/admin/listings/${id}/approve`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ comments: "Approved by admin" }),
        }
      );

      if (!response.ok) throw new Error("Failed to approve listing");

      setListings((prevListings) =>
        prevListings.map((listing) =>
          listing.id === id ? { ...listing, status: "APPROVED" } : listing
        )
      );

      if (statusFilter === "PENDING_APPROVAL") {
        setListings((prevListings) =>
          prevListings.filter((listing) => listing.id !== id)
        );
        setTotalListings((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Approve error:", error);
      toast.error("Failed to approve listing");
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/admin/listings/${id}/reject`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ comments: "Rejected by admin" }),
        }
      );

      if (!response.ok) throw new Error("Failed to reject listing");

      setListings((prevListings) =>
        prevListings.map((listing) =>
          listing.id === id ? { ...listing, status: "REJECTED" } : listing
        )
      );

      if (statusFilter === "PENDING_APPROVAL") {
        setListings((prevListings) =>
          prevListings.filter((listing) => listing.id !== id)
        );
        setTotalListings((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Reject error:", error);
      toast.error("Failed to reject listing");
    }
  };

  const handleFeature = async (id) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/admin/listings/${id}/feature`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ duration: "SEVEN_DAYS" }),
        }
      );

      if (!response.ok) throw new Error("Free Tier cannot be Promoted");

      setListings((prevListings) =>
        prevListings.map((listing) => {
          if (listing.id === id) {
            const newPromotion = {
              id: `temp-${Date.now()}`,
              listingId: id,
              promotionType: "FEATURED",
              isActive: true,
              startDate: new Date().toISOString(),
              duration: "SEVEN_DAYS",
            };
            return {
              ...listing,
              promotions: [...(listing.promotions || []), newPromotion],
            };
          }
          return listing;
        })
      );

      toast.success("Listing featured successfully");
    } catch (error) {
      toast.error("Free Tier cannot be Promoted");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/admin/listings/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to delete listing");

      setListings((prevListings) =>
        prevListings.filter((listing) => listing.id !== id)
      );
      setTotalListings((prev) => prev - 1);
      toast.success("Listing deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete listing");
    }
  };

  const handleEdit = (listing) => {
    setSelectedListing(listing);
    setIsEditModalOpen(true);
  };

  const handleEditUpdate = (updatedListing) => {
    setListings((prevListings) =>
      prevListings.map((listing) =>
        listing.id === updatedListing.id ? updatedListing : listing
      )
    );
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedListing(null);
  };

  const ListingTypeBadge = ({ type }) => {
    const typeClasses = {
      FREE: "bg-gray-100 text-gray-800",
      PREMIUM: "bg-blue-100 text-blue-800",
      PREMIUM_PLUS: "bg-purple-100 text-purple-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          typeClasses[type] || "bg-gray-100 text-gray-800"
        }`}
      >
        {type}
      </span>
    );
  };

  const StatusBadge = ({ status }) => {
    const statusClasses = {
      PENDING_APPROVAL: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusClasses[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          {statusFilter === "PENDING_APPROVAL"
            ? "Pending Listings"
            : statusFilter === "APPROVED"
            ? "Approved Listings"
            : statusFilter === "REJECTED"
            ? "Rejected Listings"
            : "All Listings"}
        </h1>
        {statusFilter && (
          <span className="text-sm text-gray-500">
            {totalListings} {statusFilter.toLowerCase().replace("_", " ")}{" "}
            listings
          </span>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Search form can be uncommented if needed
            <form onSubmit={handleSearch} className="flex w-full max-w-lg">
              <input
                type="text"
                className="px-4 py-2 w-full rounded-l-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
            */}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Listing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {listings.length > 0 ? (
                listings.map((listing) => (
                  <tr key={listing.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md overflow-hidden">
                          {listing.images?.[0]?.url ? (
                            <img
                              src={listing.images[0].url}
                              alt={listing.title}
                              className="h-10 w-10 object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 flex items-center justify-center text-gray-500">
                              N/A
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {listing.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {listing.city}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {listing.user.firstName} {listing.user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {listing.user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ListingTypeBadge type={listing.listingTier} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ₹{listing.price}
                        {listing.negotiable && (
                          <span className="ml-1 text-xs text-gray-500">
                            (negotiable)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={listing.status} />
                      {listing.promotions?.some((p) => p.isActive) && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                          Promoted
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            router.push(`/admin/listings/${listing.id}`)
                          }
                          className="text-blue-600 hover:text-blue-900"
                          title="View details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => handleEdit(listing)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit listing"
                        >
                          <Edit className="w-5 h-5" />
                        </button>

                        {listing.status === "PENDING_APPROVAL" && (
                          <>
                            <button
                              onClick={() => handleApprove(listing.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Approve"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleReject(listing.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Reject"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => handleFeature(listing.id)}
                          className={`${
                            listing.promotions?.some((p) => p.isActive)
                              ? "text-purple-600 hover:text-purple-900"
                              : "text-yellow-600 hover:text-yellow-900"
                          }`}
                          title={
                            listing.promotions?.some((p) => p.isActive)
                              ? "Promoted"
                              : "Feature"
                          }
                        >
                          <Star
                            className="w-5 h-5"
                            fill={
                              listing.promotions?.some((p) => p.isActive)
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </button>

                        <button
                          onClick={() => handleDelete(listing.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No listings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * 10 + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * 10, totalListings)}
                  </span>{" "}
                  of <span className="font-medium">{totalListings}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }).map(
                    (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) pageNum = i + 1;
                      else if (currentPage <= 3) pageNum = i + 1;
                      else if (currentPage >= totalPages - 2)
                        pageNum = totalPages - 4 + i;
                      else pageNum = currentPage - 2 + i;

                      return (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNum
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      <EditListingModal
        listing={selectedListing}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onUpdate={handleEditUpdate}
      />

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

export default ListingsPage;
