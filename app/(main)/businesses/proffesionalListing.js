"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  MapPin,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Sliders,
  X,
  Bookmark,
  Camera,
  Filter,
  Check,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import debounce from "lodash.debounce";

export default function ProfessionalListings() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalListings, setTotalListings] = useState(0);
  const [itemsPerPage] = useState(9);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search")?.toLowerCase() || ""
  );
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search")?.toLowerCase() || ""
  );
  const [locationFilter, setLocationFilter] = useState(
    searchParams.get("location") || "All Locations"
  );
  const [categoryFilter, setCategoryFilter] = useState(
    searchParams.get("category") || "All Categories"
  );
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [categories, setCategories] = useState(["All Categories"]);
  const [locations, setLocations] = useState(["All Locations"]);
  const [error, setError] = useState(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [bookmarkedListings, setBookmarkedListings] = useState([]);

  const categoryDropdownRef = useRef(null);
  const locationDropdownRef = useRef(null);
  const router = useRouter();

  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredLocations = locations.filter((loc) =>
    loc.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const fetchListings = useCallback(async () => {
    setIsFetching(true);
    setError(null);
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/listing/professional?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm.toLowerCase()}&category=${categoryFilter}&location=${locationFilter}&type=${typeFilter}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setListings(
        data.listings.map((listing) => ({
          ...listing,
          // Map city name from the relation
          city: listing.city?.name || "Unknown Location",
        }))
      );
      setTotalListings(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError("Failed to load listings. Please try again later.");
    } finally {
      setIsFetching(false);
      setIsLoading(false);
    }
  }, [
    currentPage,
    searchTerm,
    categoryFilter,
    locationFilter,
    typeFilter,
    itemsPerPage,
  ]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        categoryOpen &&
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setCategoryOpen(false);
      }
      if (
        locationOpen &&
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target)
      ) {
        setLocationOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [categoryOpen, locationOpen]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoriesRes, locationsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categories`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cities`),
        ]);

        if (!categoriesRes.ok || !locationsRes.ok) {
          throw new Error("Failed to load filter options");
        }

        const [categoriesData, locationsData] = await Promise.all([
          categoriesRes.json(),
          locationsRes.json(),
        ]);

        setCategories(["All Categories", ...categoriesData]);
        setLocations(["All Locations", ...locationsData]);

        await fetchListings();
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError("Failed to load initial data. Please refresh the page.");
      }
    };

    fetchInitialData();
  }, []);

  const fetchBookmarkedListings = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/listings/favorites`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBookmarkedListings(data.map((fav) => fav.listingId));
      }
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
    }
  }, []);

  useEffect(() => {
    fetchBookmarkedListings();
  }, [fetchBookmarkedListings, isLoading]);

  const toggleBookmark = async (listingId) => {
    try {
      const isCurrentlyBookmarked = bookmarkedListings.includes(listingId);

      if (isCurrentlyBookmarked) {
        await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/listings/${listingId}/favorite`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );
        setBookmarkedListings(
          bookmarkedListings.filter((id) => id !== listingId)
        );
      } else {
        await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/listings/${listingId}/favorite`,
          {
            method: "POST",
            credentials: "include",
          }
        );
        setBookmarkedListings([...bookmarkedListings, listingId]);
      }
    } catch (err) {
      console.error("Error toggling bookmark:", err);
    }
  };

  const searchCities = useCallback(
    debounce(async (query) => {
      if (!query) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/cities`
          );
          const data = await response.json();
          setLocations(["All Locations", ...data]);
        } catch (err) {
          console.error("Error fetching cities:", err);
        }
        return;
      }

      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL
          }/cities?search=${query.toLowerCase()}`
        );
        const data = await response.json();
        setLocations(["All Locations", ...data]);
      } catch (err) {
        console.error("Error searching cities:", err);
      }
    }, 300),
    []
  );

  useEffect(() => {
    searchCities(locationSearch);
    return () => searchCities.cancel();
  }, [locationSearch, searchCities]);

  useEffect(() => {
    const debouncedSearch = debounce(() => {
      setSearchTerm(searchInput.toLowerCase());
      setCurrentPage(1);
    }, 500);

    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchInput]);

  useEffect(() => {
    if (!isLoading) {
      fetchListings();
    }
  }, [fetchListings, isLoading]);

  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  const handleLocationChange = (value) => {
    setLocationFilter(value);
    setCurrentPage(1);
  };

  const handleTypeChange = (value) => {
    setTypeFilter(value);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchInput("");
    setCategoryFilter("All Categories");
    setLocationFilter("All Locations");
    setTypeFilter("ALL");
    setCurrentPage(1);
    router.push("/businesses");
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);

  if (isLoading) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p>Loading listings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto text-center py-20">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md mx-auto mb-4">
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Discover Local Businesses
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the best services in your area with our curated listings
          </p>
        </div>

        <div className="mb-6">
          <div className="inline-flex rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <button
              onClick={() => handleTypeChange("ALL")}
              className={`relative py-2.5 px-6 text-center font-medium transition-colors ${
                typeFilter === "ALL"
                  ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {typeFilter === "ALL" && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white opacity-50"></span>
              )}
              All Listings
            </button>
            <button
              onClick={() => handleTypeChange("PROFESSIONAL")}
              className={`relative py-2.5 px-6 text-center font-medium transition-colors ${
                typeFilter === "PROFESSIONAL"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {typeFilter === "PROFESSIONAL" && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white opacity-50"></span>
              )}
              Professional
            </button>
            <button
              onClick={() => handleTypeChange("PRIVATE_INDIVIDUAL")}
              className={`relative py-2.5 px-6 text-center font-medium transition-colors ${
                typeFilter === "PRIVATE_INDIVIDUAL"
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {typeFilter === "PRIVATE_INDIVIDUAL" && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white opacity-50"></span>
              )}
              Individual
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search businesses, categories, or services..."
                className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white text-gray-700 placeholder-gray-400 transition-all duration-200"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value.toLowerCase())}
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-xl shadow-sm font-medium transition-colors ${
                showFilters
                  ? "bg-teal-50 text-teal-700 border-teal-200"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Filter
                size={18}
                className={showFilters ? "text-teal-600" : "text-gray-500"}
              />
              <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
            </button>
          </div>

          {showFilters && (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-4 transition-all duration-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/2" ref={categoryDropdownRef}>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
                    Category
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      className="relative w-full bg-white border border-gray-200 rounded-lg py-2.5 pl-4 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 hover:border-gray-300 transition-colors"
                      onClick={() => {
                        setCategoryOpen(!categoryOpen);
                        setLocationOpen(false);
                        setCategorySearch("");
                      }}
                    >
                      <span className="block truncate text-gray-700">
                        {categoryFilter}
                      </span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronDown
                          className={`h-4 w-4 text-teal-500 transition-transform duration-200 ${
                            categoryOpen ? "transform rotate-180" : ""
                          }`}
                        />
                      </span>
                    </button>

                    {categoryOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-lg overflow-hidden border border-gray-200">
                        <div className="p-2 sticky top-0 bg-white border-b border-gray-100">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                              type="text"
                              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                              placeholder="Search categories..."
                              value={categorySearch}
                              onChange={(e) =>
                                setCategorySearch(e.target.value.toLowerCase())
                              }
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                        <div className="max-h-56 overflow-y-auto py-1">
                          {filteredCategories.length > 0 ? (
                            filteredCategories.map((category) => (
                              <button
                                key={category}
                                className={`flex items-center w-full px-4 py-2.5 text-sm hover:bg-gray-50 ${
                                  categoryFilter === category
                                    ? "bg-teal-50 text-teal-700"
                                    : "text-gray-700"
                                }`}
                                onClick={() => {
                                  handleCategoryChange(category);
                                  setCategoryOpen(false);
                                }}
                              >
                                <span className="flex-grow text-left">
                                  {category}
                                </span>
                                {categoryFilter === category && (
                                  <Check className="h-4 w-4 text-teal-600 ml-2" />
                                )}
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-2.5 text-sm text-gray-500">
                              No categories found
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-full sm:w-1/2" ref={locationDropdownRef}>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
                    Location
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      className="relative w-full bg-white border border-gray-200 rounded-lg py-2.5 pl-4 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 hover:border-gray-300 transition-colors"
                      onClick={() => {
                        setLocationOpen(!locationOpen);
                        setCategoryOpen(false);
                        setLocationSearch("");
                      }}
                    >
                      <span className="flex items-center">
                        {locationFilter !== "All Locations" && (
                          <MapPin className="h-4 w-4 text-teal-500 mr-2" />
                        )}
                        <span className="block truncate text-gray-700">
                          {locationFilter}
                        </span>
                      </span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronDown
                          className={`h-4 w-4 text-teal-500 transition-transform duration-200 ${
                            locationOpen ? "transform rotate-180" : ""
                          }`}
                        />
                      </span>
                    </button>

                    {locationOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-lg overflow-hidden border border-gray-200">
                        <div className="p-2 sticky top-0 bg-white border-b border-gray-100">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                              type="text"
                              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                              placeholder="Search locations..."
                              value={locationSearch}
                              onChange={(e) =>
                                setLocationSearch(e.target.value.toLowerCase())
                              }
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                        <div className="max-h-56 overflow-y-auto py-1">
                          {filteredLocations.length > 0 ? (
                            filteredLocations.map((location) => (
                              <button
                                key={location}
                                className={`flex items-center w-full px-4 py-2.5 text-sm hover:bg-gray-50 ${
                                  locationFilter === location
                                    ? "bg-teal-50 text-teal-700"
                                    : "text-gray-700"
                                }`}
                                onClick={() => {
                                  handleLocationChange(location);
                                  setLocationOpen(false);
                                }}
                              >
                                {location !== "All Locations" && (
                                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                )}
                                <span className="flex-grow text-left">
                                  {location}
                                </span>
                                {locationFilter === location && (
                                  <Check className="h-4 w-4 text-teal-600 ml-2" />
                                )}
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-2.5 text-sm text-gray-500">
                              No locations found
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mb-6 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-medium">
              {totalListings > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, totalListings)}
            </span>{" "}
            of <span className="font-medium">{totalListings}</span> results
          </p>
          {(searchTerm ||
            categoryFilter !== "All Categories" ||
            locationFilter !== "All Locations" ||
            typeFilter !== "ALL") && (
            <button
              onClick={resetFilters}
              className="text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              Reset all filters
            </button>
          )}
        </div>

        {isFetching && (
          <div className="flex justify-center my-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        )}

        {listings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {listings.map((listing) => {
                const isBookmarked = bookmarkedListings.includes(listing.id);
                return (
                  <div
                    key={listing.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer"
                  >
                    <div
                      className="relative h-48"
                      onClick={() =>
                        router.push(
                          `/page/${listing.slug
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`
                        )
                      }
                    >
                      {listing.images?.length > 0 ? (
                        <img
                          src={listing.images[0].url}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">No Image</span>
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full flex items-center text-xs">
                        <Camera className="h-3 w-3 mr-1" />
                        {listing.images?.length || 0}
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3
                          className="font-semibold text-lg text-gray-900 line-clamp-1"
                          onClick={() =>
                            router.push(
                              `/page/${listing.title
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`
                            )
                          }
                        >
                          {listing.title}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(listing.id);
                          }}
                          className={`transition-colors ${
                            isBookmarked
                              ? "text-amber-500"
                              : "text-gray-400 hover:text-amber-500"
                          }`}
                        >
                          <Bookmark
                            className={`h-5 w-5 ${
                              isBookmarked ? "fill-current" : ""
                            }`}
                          />
                        </button>
                      </div>

                      <div
                        className="flex items-center text-sm text-gray-500 mb-3"
                        onClick={() =>
                          router.push(
                            `/page/${listing.title
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`
                          )
                        }
                      >
                        {listing.city && (
                          <>
                            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                            <span>{listing.city}</span>
                          </>
                        )}
                      </div>

                      <div
                        className="flex flex-wrap gap-2 mb-4"
                        onClick={() =>
                          router.push(
                            `/page/${listing.title
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`
                          )
                        }
                      >
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                          {listing.category?.name || "Uncategorized"}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            listing.type === "PROFESSIONAL"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {listing.type === "PROFESSIONAL"
                            ? "Professional"
                            : "Individual"}
                        </span>
                      </div>

                      <button
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/page/${listing.title
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`
                          )
                        }
                      >
                        Contact Business
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                <button
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-teal-600 hover:bg-teal-50"
                  }`}
                >
                  <ChevronsLeft className="h-4 w-4 mr-1" />
                  First
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-teal-600 hover:bg-teal-50"
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </button>

                  <div className="flex items-center gap-1 mx-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => paginate(pageNum)}
                          className={`inline-flex items-center px-3.5 py-1.5 rounded-md text-sm font-medium ${
                            currentPage === pageNum
                              ? "bg-teal-600 text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-teal-600 hover:bg-teal-50"
                    }`}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>

                <button
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-teal-600 hover:bg-teal-50"
                  }`}
                >
                  Last
                  <ChevronsRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No listings found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
            <button
              onClick={resetFilters}
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
