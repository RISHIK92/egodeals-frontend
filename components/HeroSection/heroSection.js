"use client";
import { useState, useEffect, useRef } from "react";
import {
  ChevronUp,
  Search,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  Loader2,
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
    "Healthcare",
    "Entertainment",
    "Education",
  ]);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const categoryRef = useRef(null);
  const locationRef = useRef(null);
  const searchContainerRef = useRef(null);
  const locationInputRef = useRef(null);

  // Banner slider states
  const [banners, setBanners] = useState([
    {
      id: 1,
      imageUrl: "/placeholder.svg?height=650&width=1200",
      alt: "Discover Local Businesses",
      title: "Find Your Perfect Match",
      subtitle: "Discover amazing local businesses in your area",
    },
    {
      id: 2,
      imageUrl: "/placeholder.svg?height=650&width=1200",
      alt: "Connect with Services",
      title: "Connect & Grow",
      subtitle: "Build lasting relationships with trusted service providers",
    },
    {
      id: 3,
      imageUrl: "/placeholder.svg?height=650&width=1200",
      alt: "Explore Opportunities",
      title: "Explore Endless Possibilities",
      subtitle: "From dining to shopping, find everything you need nearby",
    },
  ]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const bannerIntervalRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/banners`
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
    }, 6000);
  };

  const stopAutoSlide = () => {
    if (bannerIntervalRef.current) {
      clearInterval(bannerIntervalRef.current);
    }
  };

  const goToNextBanner = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentBannerIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
      setIsTransitioning(false);
    }, 150);
  };

  const goToPrevBanner = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentBannerIndex((prevIndex) =>
        prevIndex === 0 ? banners.length - 1 : prevIndex - 1
      );
      setIsTransitioning(false);
    }, 150);
  };

  const goToBanner = (index) => {
    if (index !== currentBannerIndex) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentBannerIndex(index);
        setIsTransitioning(false);
      }, 150);
    }
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
            [
              "New York",
              "Los Angeles",
              "Chicago",
              "Houston",
              "Phoenix",
              "Philadelphia",
              "San Antonio",
              "San Diego",
            ].filter((city) =>
              city.toLowerCase().includes(searchQuery.toLowerCase())
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

  const currentBanner = banners[currentBannerIndex];

  return (
    <div className="relative w-full h-[700px] bg-gradient-to-br from-teal-50 to-teal-100 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_teal_1px,_transparent_0)] bg-[length:20px_20px]"></div>
      </div>

      {/* Banner Slider */}
      <div className="relative w-full h-full">
        {/* Banner Images with Overlay */}
        <div className="relative w-full h-full overflow-hidden">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${
                index === currentBannerIndex
                  ? `opacity-100 scale-100 ${
                      isTransitioning ? "blur-sm" : "blur-0"
                    }`
                  : "opacity-0 scale-105"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal-900/60 via-teal-800/40 to-transparent z-10"></div>
              <img
                src={banner.imageUrl || "/placeholder.svg"}
                alt={banner.alt}
                className="w-full h-full object-contain"
                loading="eager"
              />
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-2xl">
              <div
                className={`transition-all duration-700 ${
                  isTransitioning
                    ? "opacity-0 translate-y-4"
                    : "opacity-100 translate-y-0"
                }`}
              >
                <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  {currentBanner.title}
                </h1>
                <p className="text-xl lg:text-2xl text-teal-100 mb-8 leading-relaxed">
                  {currentBanner.subtitle}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110 border border-white/20"
          onClick={() => {
            stopAutoSlide();
            goToPrevBanner();
            startAutoSlide();
          }}
          aria-label="Previous banner"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110 border border-white/20"
          onClick={() => {
            stopAutoSlide();
            goToNextBanner();
            startAutoSlide();
          }}
          aria-label="Next banner"
        >
          <ChevronRight size={24} />
        </button>

        {/* Pagination Indicators */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentBannerIndex
                  ? "bg-white w-8 shadow-lg"
                  : "bg-white/50 hover:bg-white/70 w-2"
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

      {/* Enhanced Search Bar */}
      <div
        ref={searchContainerRef}
        className="absolute bottom-8 left-0 right-0 px-4 md:px-6 w-full z-40"
      >
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-visible mx-auto border border-white/50 max-w-7xl">
          <div className="p-2">
            <div className="flex flex-col xl:flex-row gap-2">
              {/* Search Keyword Field */}
              <div className="flex-1 group">
                <div className="flex items-center gap-4 p-6 rounded-2xl transition-all duration-300 group-hover:bg-teal-50/50">
                  <div className="p-2 bg-teal-100 rounded-xl group-hover:bg-teal-200 transition-colors">
                    <Search className="h-5 w-5 text-teal-700" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-teal-700 mb-1">
                      What are you looking for?
                    </label>
                    <input
                      type="text"
                      placeholder="Search businesses, services, products..."
                      className="w-full outline-none text-gray-800 placeholder-gray-500 text-base bg-transparent font-medium"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                  </div>
                </div>
              </div>

              {/* Location Field */}
              <div className="flex-1 group relative" ref={locationRef}>
                <div
                  className="flex items-center gap-4 p-6 rounded-2xl transition-all duration-300 group-hover:bg-teal-50/50 cursor-pointer"
                  onClick={toggleLocationDropdown}
                >
                  <div className="p-2 bg-teal-100 rounded-xl group-hover:bg-teal-200 transition-colors">
                    <MapPin className="h-5 w-5 text-teal-700" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-teal-700 mb-1">
                      Where?
                    </label>
                    <input
                      ref={locationInputRef}
                      type="text"
                      placeholder="Enter city, state, or zip code..."
                      className="w-full outline-none text-gray-800 placeholder-gray-500 text-base bg-transparent font-medium"
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
                  </div>
                  <ChevronUp
                    className={`h-5 w-5 text-teal-700 transition-transform duration-300 ${
                      isLocationDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {isLocationDropdownOpen && (
                  <div className="absolute left-0 right-0 bottom-full mb-3 bg-white shadow-2xl rounded-2xl z-50 max-h-64 overflow-y-auto border border-gray-100">
                    {isLoading ? (
                      <div className="p-4 text-center text-gray-500 flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Searching locations...
                      </div>
                    ) : cities.length > 0 ? (
                      cities.map((city, index) => (
                        <div
                          key={index}
                          className="p-4 hover:bg-teal-50 cursor-pointer text-gray-700 transition-all duration-200 flex items-center gap-3 border-b border-gray-50 last:border-b-0"
                          onClick={() => selectCity(city)}
                        >
                          <MapPin className="h-4 w-4 text-teal-600" />
                          <span className="font-medium">{city}</span>
                        </div>
                      ))
                    ) : location.trim() !== "" ? (
                      <div className="p-4 text-center text-gray-500">
                        No locations found for "{location}"
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Category Field */}
              <div className="flex-1 group relative" ref={categoryRef}>
                <div
                  className="flex items-center gap-4 p-6 rounded-2xl transition-all duration-300 group-hover:bg-teal-50/50 cursor-pointer"
                  onClick={toggleCategoryDropdown}
                >
                  <div className="p-2 bg-teal-100 rounded-xl group-hover:bg-teal-200 transition-colors">
                    <Grid3X3 className="h-5 w-5 text-teal-700" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-teal-700 mb-1">
                      Category
                    </label>
                    <span className="text-gray-800 text-base font-medium block truncate">
                      {category}
                    </span>
                  </div>
                  <ChevronUp
                    className={`h-5 w-5 text-teal-700 transition-transform duration-300 ${
                      isCategoryDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {isCategoryDropdownOpen && (
                  <div className="absolute left-0 right-0 bottom-full mb-3 bg-white shadow-2xl rounded-2xl z-50 max-h-64 overflow-y-auto border border-gray-100">
                    {categories.map((cat, index) => (
                      <div
                        key={index}
                        className="p-4 hover:bg-teal-50 cursor-pointer text-gray-700 transition-all duration-200 flex items-center gap-3 border-b border-gray-50 last:border-b-0"
                        onClick={() => selectCategory(cat)}
                      >
                        <Grid3X3 className="h-4 w-4 text-teal-600" />
                        <span className="font-medium">{cat}</span>
                        {cat === category && (
                          <div className="ml-auto w-2 h-2 bg-teal-600 rounded-full"></div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Button */}
              <div className="xl:w-auto w-full">
                <button
                  onClick={handleSearch}
                  className="w-full xl:w-auto bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-8 py-6 rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-3 min-w-[200px]"
                >
                  <Search className="h-6 w-6" />
                  Search Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
