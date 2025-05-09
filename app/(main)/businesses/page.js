"use client";
import { useState, useEffect } from "react";
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
  Clock,
  Star,
} from "lucide-react";
import Navbar from "@/components/Navbar/navbar";

export default function ProfessionalListings() {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [showFilters, setShowFilters] = useState(false);

  // Categories and locations for filters
  const categories = [
    "All Categories",
    "Events & Services",
    "Interior Design",
    "Beauty & Care",
    "Health & Medical",
    "Electronics",
    "Restaurants",
    "Home Services",
  ];

  const locations = [
    "All Locations",
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Miami",
  ];

  // Mock data
  useEffect(() => {
    const mockListings = Array.from({ length: 27 }, (_, i) => ({
      id: i + 1,
      title: [
        "Elite Event Planning",
        "Urban Interior Designs",
        "Prestige Beauty Lounge",
        "Advanced Dental Care",
        "Tech Haven Electronics",
        "Gourmet Bistro",
        "Home Service Masters",
        "Luxe Wedding Planners",
        "Organic Spa Retreat",
      ][i % 9],
      category: [
        "EVENTS & SERVICES",
        "INTERIOR DESIGN",
        "BEAUTY & CARE",
        "HEALTH & MEDICAL",
        "ELECTRONICS",
        "RESTAURANTS",
        "HOME SERVICES",
        "EVENTS & SERVICES",
        "BEAUTY & CARE",
      ][i % 9],
      subcategory: [
        "Event Planning",
        "Residential",
        "Spa & Salon",
        "Dentistry",
        "Gadgets",
        "French Cuisine",
        "Plumbing",
        "Weddings",
        "Organic Treatments",
      ][i % 9],
      location: [
        "New York",
        "Los Angeles",
        "Chicago",
        "Houston",
        "Miami",
        "New York",
        "Los Angeles",
        "Chicago",
        "Houston",
      ][i % 9],
      date: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(
        2,
        "0"
      )}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
      images: Math.floor(Math.random() * 5) + 1,
      imageSrc: `https://source.unsplash.com/random/400x300/?${
        [
          "event",
          "interior",
          "salon",
          "dental",
          "electronics",
          "restaurant",
          "home",
          "wedding",
          "spa",
        ][i % 9]
      }`,
      rating: Number((Math.random() * 2 + 3).toFixed(1)),
      reviews: Math.floor(Math.random() * 100) + 5,
    }));

    setListings(mockListings);
    setFilteredListings(mockListings);
  }, []);

  // Apply filters
  useEffect(() => {
    let results = listings;

    if (searchTerm) {
      results = results.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.subcategory.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter !== "All Locations") {
      results = results.filter(
        (listing) => listing.location === locationFilter
      );
    }

    if (categoryFilter !== "All Categories") {
      results = results.filter(
        (listing) =>
          listing.category ===
          categoryFilter.replace(" & ", " AND ").toUpperCase()
      );
    }

    setFilteredListings(results);
    setCurrentPage(1);
  }, [searchTerm, locationFilter, categoryFilter, listings]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredListings.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);

  return (
    <>
      {/* <Navbar /> */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Discover Local Businesses
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find the best services in your area with our curated listings
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              {/* Enhanced Search Bar */}
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search businesses, categories, or services..."
                  className="block w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-700 placeholder-gray-400 transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  </button>
                )}
              </div>

              {/* Mobile Filter Button - Enhanced */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center justify-center gap-2 px-4 py-3.5 border border-gray-300 rounded-xl shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                {showFilters ? (
                  <>
                    <X size={18} className="text-gray-600" />
                    <span>Close</span>
                  </>
                ) : (
                  <>
                    <Sliders size={18} className="text-gray-600" />
                    <span>Filters</span>
                  </>
                )}
              </button>
            </div>

            {/* Filter Row - shown on mobile when toggled */}
            <div
              className={`${
                showFilters ? "block" : "hidden"
              } md:flex gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200 transition-all duration-200`}
            >
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <div className="relative">
                  <select
                    className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 rounded-lg appearance-none bg-white"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <div className="relative">
                  <select
                    className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 rounded-lg appearance-none bg-white"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  >
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastItem, filteredListings.length)}
              </span>{" "}
              of <span className="font-medium">{filteredListings.length}</span>{" "}
              results
            </p>
          </div>

          {/* Listings Grid */}
          {currentItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentItems.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200"
                >
                  {/* Image */}
                  <div className="relative h-48">
                    <img
                      src={listing.imageSrc}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full flex items-center text-xs">
                      <Camera className="h-3 w-3 mr-1" />
                      {listing.images}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                        {listing.title}
                      </h3>
                      <button className="text-gray-400 hover:text-rose-500 transition-colors">
                        <Bookmark className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex items-center mb-3">
                      <div className="flex items-center mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(listing.rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {listing.rating} ({listing.reviews} reviews)
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{listing.location}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                        {listing.category}
                      </span>
                      {listing.subcategory && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {listing.subcategory}
                        </span>
                      )}
                    </div>

                    <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                      Contact Business
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
                onClick={() => {
                  setSearchTerm("");
                  setLocationFilter("All Locations");
                  setCategoryFilter("All Categories");
                }}
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                Reset all filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {filteredListings.length > itemsPerPage && (
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
        </div>
      </div>
    </>
  );
}
