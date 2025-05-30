"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash,
  Edit,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Loader2,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OfferZonePage = () => {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(null);
  const [editOffer, setEditOffer] = useState({
    vendorName: "",
    discount: "",
    promoCode: "",
    description: "",
    validUntil: "",
    link: "",
    rating: 0,
    isActive: true,
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOffer, setNewOffer] = useState({
    vendorName: "",
    discount: "",
    promoCode: "",
    description: "",
    validUntil: "",
    link: "",
    rating: 0,
    isActive: true,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/admin/offer-zone`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch offers");
        }

        const data = await response.json();
        setOffers(data.data || []);
      } catch (error) {
        console.error("Offers error:", error);
        toast.error("Failed to fetch offers");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const handleCreateOffer = async () => {
    try {
      // Validate required fields
      if (!newOffer.vendorName || !newOffer.discount || !newOffer.validUntil) {
        toast.error("Vendor name, discount, and valid until date are required");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/admin/offer-zone`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(newOffer),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create offer");
      }

      const createdOffer = await response.json();
      setOffers([createdOffer.data, ...offers]);
      setShowCreateModal(false);
      setNewOffer({
        vendorName: "",
        discount: "",
        promoCode: "",
        description: "",
        validUntil: "",
        link: "",
        rating: 0,
        isActive: true,
      });
      toast.success("Offer created successfully");
    } catch (error) {
      console.error("Create error:", error);
      toast.error("Failed to create offer");
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/admin/offer-zone/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(editOffer),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update offer");
      }

      const updatedOffer = await response.json();
      setOffers(
        offers.map((offer) => (offer.id === id ? updatedOffer.data : offer))
      );
      setIsEditing(null);
      toast.success("Offer updated successfully");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update offer");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/admin/offer-zone/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete offer");
      }

      setOffers(offers.filter((offer) => offer.id !== id));
      toast.success("Offer deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete offer");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/admin/offer-zone/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            isActive: !currentStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update offer status");
      }

      const updatedOffer = await response.json();
      setOffers(
        offers.map((offer) => (offer.id === id ? updatedOffer.data : offer))
      );
      toast.success(
        `Offer ${!currentStatus ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      console.error("Status toggle error:", error);
      toast.error("Failed to update offer status");
    }
  };

  const startEditing = (offer) => {
    setIsEditing(offer.id);
    setEditOffer({
      vendorName: offer.vendorName,
      discount: offer.discount,
      promoCode: offer.promoCode || "",
      link: offer.link || "",
      description: offer.description || "",
      validUntil: offer.validUntil.split("T")[0],
      rating: offer.rating || 0,
      isActive: offer.isActive,
    });
  };

  const cancelEditing = () => {
    setIsEditing(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const filteredOffers = offers.filter((offer) =>
    offer.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Offer Zone</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search offers..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Offer
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Vendor
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Discount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Promo Code
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Link
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Valid Until
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Rating
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOffers.length > 0 ? (
                filteredOffers.map((offer) => (
                  <tr key={offer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing === offer.id ? (
                        <input
                          type="text"
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={editOffer.vendorName}
                          onChange={(e) =>
                            setEditOffer({
                              ...editOffer,
                              vendorName: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">
                          {offer.vendorName}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing === offer.id ? (
                        <input
                          type="text"
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={editOffer.discount}
                          onChange={(e) =>
                            setEditOffer({
                              ...editOffer,
                              discount: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <div className="text-sm text-gray-900">
                          {offer.discount}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing === offer.id ? (
                        <input
                          type="text"
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={editOffer.promoCode}
                          onChange={(e) =>
                            setEditOffer({
                              ...editOffer,
                              promoCode: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <div className="text-sm text-gray-900">
                          {offer.promoCode || "-"}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing === offer.id ? (
                        <input
                          type="url"
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={editOffer.link}
                          onChange={(e) =>
                            setEditOffer({
                              ...editOffer,
                              link: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <div className="text-sm text-gray-900">
                          {offer.link ? (
                            <a
                              href={offer.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View Link
                            </a>
                          ) : (
                            "-"
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing === offer.id ? (
                        <input
                          type="date"
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={editOffer.validUntil}
                          onChange={(e) =>
                            setEditOffer({
                              ...editOffer,
                              validUntil: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <div className="text-sm text-gray-900">
                          {formatDate(offer.validUntil)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing === offer.id ? (
                        <input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={editOffer.rating}
                          onChange={(e) =>
                            setEditOffer({
                              ...editOffer,
                              rating: parseFloat(e.target.value),
                            })
                          }
                        />
                      ) : (
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`h-5 w-5 ${
                                star <= Math.round(offer.rating || 0)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {isEditing === offer.id ? (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={cancelEditing}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <X className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleUpdate(offer.id)}
                            disabled={
                              !editOffer.vendorName ||
                              !editOffer.discount ||
                              !editOffer.validUntil
                            }
                            className={`${
                              !editOffer.vendorName ||
                              !editOffer.discount ||
                              !editOffer.validUntil
                                ? "text-blue-400 cursor-not-allowed"
                                : "text-blue-600 hover:text-blue-900"
                            }`}
                          >
                            <Check className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => startEditing(offer)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(offer.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No offers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Offer Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Create New Offer
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="vendorName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Vendor Name *
                  </label>
                  <input
                    type="text"
                    id="vendorName"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={newOffer.vendorName}
                    onChange={(e) =>
                      setNewOffer({
                        ...newOffer,
                        vendorName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="discount"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Discount *
                  </label>
                  <input
                    type="text"
                    id="discount"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={newOffer.discount}
                    onChange={(e) =>
                      setNewOffer({
                        ...newOffer,
                        discount: e.target.value,
                      })
                    }
                    placeholder="e.g., 20% off"
                  />
                </div>
                <div>
                  <label
                    htmlFor="promoCode"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Promo Code
                  </label>
                  <input
                    type="text"
                    id="promoCode"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={newOffer.promoCode}
                    onChange={(e) =>
                      setNewOffer({
                        ...newOffer,
                        promoCode: e.target.value,
                      })
                    }
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label
                    htmlFor="link"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Link
                  </label>
                  <input
                    type="url"
                    id="link"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={newOffer.link}
                    onChange={(e) =>
                      setNewOffer({
                        ...newOffer,
                        link: e.target.value,
                      })
                    }
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={newOffer.description}
                    onChange={(e) =>
                      setNewOffer({
                        ...newOffer,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="validUntil"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Valid Until *
                  </label>
                  <input
                    type="date"
                    id="validUntil"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={newOffer.validUntil}
                    onChange={(e) =>
                      setNewOffer({
                        ...newOffer,
                        validUntil: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="rating"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Rating (0-5)
                  </label>
                  <input
                    type="number"
                    id="rating"
                    min="0"
                    max="5"
                    step="0.1"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={newOffer.rating}
                    onChange={(e) =>
                      setNewOffer({
                        ...newOffer,
                        rating: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={newOffer.isActive}
                    onChange={(e) =>
                      setNewOffer({
                        ...newOffer,
                        isActive: e.target.checked,
                      })
                    }
                  />
                  <label
                    htmlFor="isActive"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Active
                  </label>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateOffer}
                  disabled={
                    !newOffer.vendorName ||
                    !newOffer.discount ||
                    !newOffer.validUntil
                  }
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    !newOffer.vendorName ||
                    !newOffer.discount ||
                    !newOffer.validUntil
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  Create Offer
                </button>
              </div>
            </div>
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
};

export default OfferZonePage;
