"use client";
import { useState, useEffect, useRef } from "react";
import {
  ChevronUp,
  Search,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  // Search bar states
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([
    "All Categories",
    "Restaurants",
    "Shopping",
    "Services",
  ]);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const categoryRef = useRef(null);
  const locationRef = useRef(null);
  const searchContainerRef = useRef(null);
  const locationInputRef = useRef(null);
  const [isSearchHovered, setIsSearchHovered] = useState(false);

  // Banner slider states
  const [banners, setBanners] = useState([
    {
      id: 1,
      imageUrl:
        "https://res.cloudinary.com/df622sxkk/image/upload/v1710000000/banner1.jpg",
      alt: "Summer Collection",
    },
    {
      id: 2,
      imageUrl:
        "https://res.cloudinary.com/df622sxkk/image/upload/v1710000000/banner2.jpg",
      alt: "New Arrivals",
    },
    {
      id: 3,
      imageUrl:
        "https://res.cloudinary.com/df622sxkk/image/upload/v1710000000/banner3.jpg",
      alt: "Special Offers",
    },
  ]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const bannerIntervalRef = useRef(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/categories`
        );
        if (response.ok) {
          const data = await response.json();
          setCategories(["All Categories", ...data]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch banners from API if needed
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin-banners`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) setBanners(data);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, []);

  // Auto-slide banners
  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  const startAutoSlide = () => {
    bannerIntervalRef.current = setInterval(() => {
      goToNextBanner();
    }, 5000);
  };

  const stopAutoSlide = () => {
    if (bannerIntervalRef.current) {
      clearInterval(bannerIntervalRef.current);
    }
  };

  const goToNextBanner = () => {
    setCurrentBannerIndex((prevIndex) =>
      prevIndex === banners.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevBanner = () => {
    setCurrentBannerIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  const goToBanner = (index) => {
    setCurrentBannerIndex(index);
  };

  // Debounce function for location search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (location.trim() !== "") {
        fetchCities(location);
      } else {
        setCities([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [location]);

  // Handle clicks outside dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }

      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setIsLocationDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchCities = async (searchQuery) => {
    try {
      setIsLoading(true);
      if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
        setTimeout(() => {
          setCities(
            ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"].filter(
              (city) => city.toLowerCase().includes(searchQuery.toLowerCase())
            )
          );
          setIsLoading(false);
        }, 500);
        return;
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/cities?search=${encodeURIComponent(searchQuery)}`
      );

      if (response.ok) {
        const data = await response.json();
        setCities(data);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCities(["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (location) params.set("location", location);
    if (category && category !== "All Categories")
      params.set("category", category);

    router.push(`/businesses?${params.toString()}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const selectCategory = (cat) => {
    setCategory(cat);
    setIsCategoryDropdownOpen(false);
  };

  const selectCity = (city) => {
    setLocation(city);
    setIsLocationDropdownOpen(false);
  };

  const toggleCategoryDropdown = (e) => {
    e.stopPropagation();
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
    setIsLocationDropdownOpen(false);
  };

  const toggleLocationDropdown = (e) => {
    e.stopPropagation();
    setIsLocationDropdownOpen(!isLocationDropdownOpen);
    setIsCategoryDropdownOpen(false);
  };

  return (
    <div className="relative w-full h-[650px] bg-gray-100 overflow-hidden">
      {/* Custom Banner Slider */}
      <div className="relative w-full h-full">
        {/* Banner Images */}
        <div className="relative w-full h-full overflow-hidden">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              onClick={() => router.push(`${banner.ListingUrl}`)}
              className={`absolute inset-0 w-full h-full transition-opacity duration-500 cursor-pointer ${
                index === currentBannerIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={banner.Image}
                alt={banner.alt}
                className="w-full h-full object-contain"
                loading="eager"
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/5 hover:bg-black/10 text-white p-2 rounded-full transition-all"
          onClick={() => {
            stopAutoSlide();
            goToPrevBanner();
            startAutoSlide();
          }}
          aria-label="Previous banner"
        >
          <ChevronLeft size={32} />
        </button>
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/5 hover:bg-black/10 text-white p-2 rounded-full transition-all"
          onClick={() => {
            stopAutoSlide();
            goToNextBanner();
            startAutoSlide();
          }}
          aria-label="Next banner"
        >
          <ChevronRight size={32} />
        </button>

        {/* Pagination Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentBannerIndex
                  ? "bg-white w-6"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              onClick={() => {
                stopAutoSlide();
                goToBanner(index);
                startAutoSlide();
              }}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Search Bar Section */}
      <div
        ref={searchContainerRef}
        className="absolute bottom-12 left-0 right-0 px-4 md:px-6 w-full z-40"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-visible mx-auto border border-white/50 max-w-6xl">
          <div className="flex flex-col lg:flex-row">
            {/* Search Keyword Field */}
            <div className="flex-1 p-5 border-b lg:border-b-0 lg:border-r border-gray-100">
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5 text-teal-700" />
                <input
                  type="text"
                  placeholder="Search Keyword..."
                  className="w-full outline-none text-gray-700 placeholder-gray-400 text-base bg-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>

            {/* Location Field */}
            <div
              className="flex-1 p-5 border-b lg:border-b-0 lg:border-r border-gray-100 relative"
              ref={locationRef}
            >
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={toggleLocationDropdown}
              >
                <MapPin className="h-5 w-5 text-teal-700" />
                <input
                  ref={locationInputRef}
                  type="text"
                  placeholder="Search Location..."
                  className="w-full outline-none text-gray-700 placeholder-gray-400 text-base bg-transparent"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    if (e.target.value.trim() !== "") {
                      setIsLocationDropdownOpen(true);
                    } else {
                      setIsLocationDropdownOpen(false);
                    }
                  }}
                  onKeyPress={handleKeyPress}
                  onFocus={() => {
                    if (location.trim() !== "") {
                      setIsLocationDropdownOpen(true);
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <ChevronUp
                  className={`h-5 w-5 text-teal-700 ml-1 shrink-0 transition-transform duration-300 ${
                    isLocationDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              {isLocationDropdownOpen && (
                <div className="absolute left-0 right-0 bottom-full mb-2 bg-white shadow-xl rounded-xl z-50 max-h-60 overflow-y-auto border border-gray-100">
                  {isLoading ? (
                    <div className="p-3 text-center text-gray-500">
                      Loading...
                    </div>
                  ) : cities.length > 0 ? (
                    cities.map((city, index) => (
                      <div
                        key={index}
                        className="p-3 hover:bg-teal-50 cursor-pointer text-gray-700 transition-colors duration-200 flex items-center"
                        onClick={() => selectCity(city)}
                      >
                        <MapPin className="h-4 w-4 text-teal-600 mr-2 opacity-70" />
                        {city}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-gray-500">
                      No locations found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Category Field */}
            <div
              className="flex-1 p-5 border-b lg:border-b-0 lg:border-r border-gray-100 relative"
              ref={categoryRef}
            >
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={toggleCategoryDropdown}
              >
                <div className="flex items-center gap-3">
                  <svg
                    className="h-5 w-5 text-teal-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 6H20M4 12H20M4 18H20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-gray-700 text-base whitespace-nowrap overflow-hidden text-ellipsis">
                    {category}
                  </span>
                </div>
                <ChevronUp
                  className={`h-5 w-5 text-teal-700 ml-1 shrink-0 transition-transform duration-300 ${
                    isCategoryDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              {isCategoryDropdownOpen && (
                <div className="absolute left-0 right-0 bottom-full mb-2 bg-white shadow-xl rounded-xl z-50 max-h-60 overflow-y-auto border border-gray-100">
                  {categories.map((cat, index) => (
                    <div
                      key={index}
                      className="p-3 hover:bg-teal-50 cursor-pointer text-gray-700 transition-colors duration-200 flex items-center"
                      onClick={() => selectCategory(cat)}
                    >
                      <svg
                        className="h-4 w-4 text-teal-600 mr-2 opacity-70"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4 6H20M4 12H20M4 18H20"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      {cat}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              className="bg-teal-700 hover:bg-teal-800 transition-all duration-300 p-5 flex items-center justify-center cursor-pointer rounded-b-xl md:rounded-bl-none md:rounded-r-xl"
              onClick={handleSearch}
            >
              <button className="text-white font-medium flex items-center text-base whitespace-nowrap">
                <Search className="h-5 w-5 mr-2" />
                <span>Search Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
