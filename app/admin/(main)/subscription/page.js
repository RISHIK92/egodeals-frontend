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

const SubscriptionPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [totalPlans, setTotalPlans] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(null);
  const [editPlan, setEditPlan] = useState({
    name: "",
    description: "",
    durationDays: "",
    price: "",
    tierType: "BASIC",
    isActive: true,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/subscription-plans`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch subscription plans");
        }

        const data = await response.json();
        setPlans(data);
        setTotalPlans(data.length);
        setTotalPages(Math.ceil(data.length / 10));
      } catch (error) {
        console.error("Subscription plans error:", error);
        toast.error("Failed to fetch subscription plans");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, [currentPage]);

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/admin/subscription-plans/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ...editPlan,
            durationDays: parseInt(editPlan.durationDays),
            price: parseFloat(editPlan.price),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update subscription plan");
      }

      const updatedPlan = await response.json();
      setPlans(plans.map((plan) => (plan.id === id ? updatedPlan : plan)));
      setIsEditing(null);
      toast.success("Subscription plan updated successfully");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update subscription plan");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const planToUpdate = plans.find((plan) => plan.id === id);
      if (!planToUpdate) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/admin/subscription-plans/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ...planToUpdate,
            isActive: !currentStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update subscription plan status");
      }

      const updatedPlan = await response.json();
      setPlans(plans.map((plan) => (plan.id === id ? updatedPlan : plan)));
      toast.success(
        `Subscription plan ${!currentStatus ? "activated" : "deactivated"}`
      );
    } catch (error) {
      console.error("Status toggle error:", error);
      toast.error("Failed to update subscription plan status");
    }
  };

  const startEditing = (plan) => {
    setIsEditing(plan.id);
    setEditPlan({
      name: plan.name,
      description: plan.description,
      durationDays: plan.durationDays.toString(),
      price: plan.price.toString(),
      tierType: plan.tierType,
      isActive: plan.isActive,
    });
  };

  const cancelEditing = () => {
    setIsEditing(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

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
        <h1 className="text-2xl font-bold text-gray-800">Subscription Plans</h1>
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
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tier
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Duration
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
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
              {plans.length > 0 ? (
                plans.map((plan) => (
                  <tr key={plan.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing === plan.id ? (
                        <input
                          type="text"
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={editPlan.name}
                          onChange={(e) =>
                            setEditPlan({ ...editPlan, name: e.target.value })
                          }
                        />
                      ) : (
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {plan.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {plan.description}
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing === plan.id ? (
                        <select
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={editPlan.tierType}
                          onChange={(e) =>
                            setEditPlan({
                              ...editPlan,
                              tierType: e.target.value,
                            })
                          }
                        >
                          <option value="BASIC">Basic</option>
                          <option value="STANDARD">Premium</option>
                          <option value="PREMIUM">Premium Plus</option>
                        </select>
                      ) : (
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            plan.tierType === "PREMIUM"
                              ? "bg-purple-100 text-purple-800"
                              : plan.tierType === "STANDARD"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {plan.tierType === "STANDARD"
                            ? "Premium"
                            : plan.tierType === "PREMIUM"
                            ? "Premium Plus"
                            : plan.tierType}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing === plan.id ? (
                        <input
                          type="number"
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={editPlan.durationDays}
                          onChange={(e) =>
                            setEditPlan({
                              ...editPlan,
                              durationDays: e.target.value,
                            })
                          }
                          min="1"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">
                          {plan.durationDays} days
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing === plan.id ? (
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">₹</span>
                          </div>
                          <input
                            type="number"
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md py-1 px-2"
                            value={editPlan.price}
                            onChange={(e) =>
                              setEditPlan({
                                ...editPlan,
                                price: e.target.value,
                              })
                            }
                            min="0"
                            step="0.01"
                          />
                        </div>
                      ) : (
                        <div className="text-sm text-gray-900">
                          ₹{plan.price}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing === plan.id ? (
                        <select
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={editPlan.isActive ? "true" : "false"}
                          onChange={(e) =>
                            setEditPlan({
                              ...editPlan,
                              isActive: e.target.value === "true",
                            })
                          }
                        >
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </select>
                      ) : (
                        <span
                          onClick={() =>
                            !isEditing &&
                            handleToggleStatus(plan.id, plan.isActive)
                          }
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${
                            plan.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {plan.isActive ? "Active" : "Inactive"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {isEditing === plan.id ? (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={cancelEditing}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <X className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleUpdate(plan.id)}
                            disabled={
                              !editPlan.name ||
                              !editPlan.durationDays ||
                              !editPlan.price ||
                              isNaN(editPlan.durationDays) ||
                              isNaN(editPlan.price)
                            }
                            className={`${
                              !editPlan.name ||
                              !editPlan.durationDays ||
                              !editPlan.price ||
                              isNaN(editPlan.durationDays) ||
                              isNaN(editPlan.price)
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
                            onClick={() => startEditing(plan)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No subscription plans found
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
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
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
                    {Math.min(currentPage * 10, totalPlans)}
                  </span>{" "}
                  of <span className="font-medium">{totalPlans}</span> results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1
                        ? "text-gray-300"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }).map(
                    (_, index) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = index + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = index + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + index;
                      } else {
                        pageNumber = currentPage - 2 + index;
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNumber
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages
                        ? "text-gray-300"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
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

export default SubscriptionPlansPage;
