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

const LocationPage = () => {
  const [cities, setCities] = useState([]);
  const [totalCities, setTotalCities] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [newCity, setNewCity] = useState({
    name: "",
  });
  const [editCity, setEditCity] = useState({
    name: "",
  });
  const router = useRouter();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const queryParams = new URLSearchParams({
          page: currentPage,
          limit: 10,
        });

        if (searchTerm) {
          queryParams.append("search", searchTerm);
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/admin/cities?${queryParams}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch cities");
        }

        const data = await response.json();
        setCities(data);
        setTotalCities(data.length);
        setTotalPages(Math.ceil(data.length / 10));
      } catch (error) {
        console.error("Cities error:", error);
        toast.error("Failed to fetch cities");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, [currentPage, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleCreate = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/admin/cities`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(newCity),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create city");
      }

      const createdCity = await response.json();
      setCities([createdCity, ...cities]);
      setIsCreating(false);
      setNewCity({ name: "" });
      toast.success("City created successfully");
    } catch (error) {
      toast.error("Failed to create city");
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/admin/cities/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(editCity),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update city");
      }

      const updatedCity = await response.json();
      setCities(cities.map((city) => (city.id === id ? updatedCity : city)));
      setIsEditing(null);
      toast.success("City updated successfully");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update city");
    }
  };

  const handleDelete = async (id) => {
    if (
      !confirm(
        "Are you sure you want to delete this city? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/admin/cities/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete city");
      }

      setCities(cities.filter((city) => city.id !== id));
      toast.success("City deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete city");
    }
  };

  const startEditing = (city) => {
    setIsEditing(city.id);
    setEditCity({
      name: city.name,
    });
  };

  const cancelEditing = () => {
    setIsEditing(null);
  };

  const cancelCreating = () => {
    setIsCreating(false);
    setNewCity({ name: "" });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
        <h1 className="text-2xl font-bold text-gray-800">Cities</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="w-5 h-5 mr-1" />
          Add City
        </button>
      </div>

      {isCreating && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Create New City
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="new-city-name"
                className="block text-sm font-medium text-gray-700"
              >
                Name *
              </label>
              <input
                type="text"
                id="new-city-name"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={newCity.name}
                onChange={(e) =>
                  setNewCity({ ...newCity, name: e.target.value.toUpperCase() })
                }
                placeholder="City name"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelCreating}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <X className="w-5 h-5 mr-1" />
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newCity.name}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  !newCity.name
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                <Check className="w-5 h-5 mr-1" />
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <form onSubmit={handleSearch} className="flex w-full max-w-lg">
            <input
              type="text"
              className="px-4 py-2 w-full rounded-l-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search cities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>

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
                  Listings
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created
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
              {cities.length > 0 ? (
                cities.map((city) => (
                  <tr key={city.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing === city.id ? (
                        <input
                          type="text"
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={editCity.name}
                          onChange={(e) =>
                            setEditCity({
                              ...editCity,
                              name: e.target.value.toUpperCase(),
                            })
                          }
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">
                          {city.name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {city._count?.listings || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(city.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {isEditing === city.id ? (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={cancelEditing}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <X className="w-5 h-5" />
                          </button>
                          {console.log(city)}
                          <button
                            onClick={() => handleUpdate(city.id)}
                            disabled={!editCity.name}
                            className={`${
                              !editCity.name
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
                            onClick={() => startEditing(city)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(city.id)}
                            className="text-red-600 hover:text-red-900"
                            disabled={city._count?.listings > 0}
                            title={
                              city._count?.listings > 0
                                ? "Cannot delete city with listings"
                                : ""
                            }
                          >
                            <Trash
                              className={`w-5 h-5 ${
                                city._count?.listings > 0
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No cities found
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
                    {Math.min(currentPage * 10, totalCities)}
                  </span>{" "}
                  of <span className="font-medium">{totalCities}</span> results
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

export default LocationPage;
