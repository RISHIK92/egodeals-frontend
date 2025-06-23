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

  // Banner slider states
  const [banners, setBanners] = useState([
    {
      id: 1,
      Image: "/placeholder.svg?height=650&width=1200",
      alt: "Summer Collection",
      ListingUrl: "/listings/summer",
    },
    {
      id: 2,
      Image: "/placeholder.svg?height=650&width=1200",
      alt: "New Arrivals",
      ListingUrl: "/listings/new-arrivals",
    },
    {
      id: 3,
      Image: "/placeholder.svg?height=650&width=1200",
      alt: "Special Offers",
      ListingUrl: "/listings/offers",
    },
  ]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);
  const bannerIntervalRef = useRef(null);

  // Helper function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;

    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  };

  // Helper function to get YouTube embed URL with autoplay
  const getYouTubeEmbedUrl = (videoId) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1`;
  };

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (!process.env.NEXT_PUBLIC_BACKEND_URL) return;

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

  useEffect(() => {
    const userLocation =
      typeof window !== "undefined"
        ? localStorage.getItem("userLocation")
        : null;

    const fetchBanners = async () => {
      try {
        if (!process.env.NEXT_PUBLIC_BACKEND_URL) return;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/hero-banners?location=${userLocation}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setBanners(data);
          }
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, []);

  // Auto-slide banners
  useEffect(() => {
    if (isAutoSliding && banners.length > 1) {
      startAutoSlide();
    }
    return () => stopAutoSlide();
  }, [isAutoSliding, banners.length]);

  const startAutoSlide = () => {
    stopAutoSlide(); // Clear any existing interval
    bannerIntervalRef.current = setInterval(() => {
      setCurrentBannerIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
  };

  const stopAutoSlide = () => {
    if (bannerIntervalRef.current) {
      clearInterval(bannerIntervalRef.current);
      bannerIntervalRef.current = null;
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

  const handleBannerNavigation = (direction) => {
    setIsAutoSliding(false);
    if (direction === "next") {
      goToNextBanner();
    } else {
      goToPrevBanner();
    }
    // Resume auto-sliding after 10 seconds
    setTimeout(() => setIsAutoSliding(true), 10000);
  };

  const handleBannerClick = (index) => {
    setIsAutoSliding(false);
    goToBanner(index);
    // Resume auto-sliding after 10 seconds
    setTimeout(() => setIsAutoSliding(true), 10000);
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
        // Fallback with mock data
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
      } else {
        throw new Error("Failed to fetch cities");
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      // Fallback to mock data
      setCities(
        ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"].filter(
          (city) => city.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    if (location.trim()) params.set("location", location.trim());
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

  const handleBannerImageClick = (banner) => {
    if (banner.ListingUrl) {
      router.push(banner.ListingUrl);
    }
  };

  return (
    <div className="relative w-full h-[650px] bg-gray-100 overflow-hidden">
      <div className="relative w-full h-full">
        <div className="relative w-full h-full overflow-hidden">
          {banners.map((banner, index) => {
            const youtubeVideoId = getYouTubeVideoId(banner?.youtubeUrl);

            return (
              <div
                key={banner.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
                  index === currentBannerIndex ? "opacity-100" : "opacity-0"
                } ${banner.ListingUrl ? "cursor-pointer" : ""}`}
                onClick={() => handleBannerImageClick(banner)}
              >
                {youtubeVideoId ? (
                  // YouTube Video Embed
                  <div className="w-full h-full overflow-hidden">
                    <iframe
                      className="w-full h-full"
                      src={getYouTubeEmbedUrl(youtubeVideoId)}
                      title={banner?.title || "YouTube video"}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  // Regular Image
                  <img
                    src={banner.imageUrl || "/placeholder.svg"}
                    alt={banner.alt}
                    className="w-full h-full object-contain"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                )}
                <div className="absolute inset-0" />
              </div>
            );
          })}
        </div>

        {banners.length > 1 && (
          <>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/20 hover:bg-black/40 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
              onClick={() => handleBannerNavigation("prev")}
              aria-label="Previous banner"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/20 hover:bg-black/40 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
              onClick={() => handleBannerNavigation("next")}
              aria-label="Next banner"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {banners.length > 1 && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`h-3 rounded-full transition-all duration-200 ${
                  index === currentBannerIndex
                    ? "bg-white w-8"
                    : "bg-white/50 hover:bg-white/70 w-3"
                }`}
                onClick={() => handleBannerClick(index)}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Search Bar Section */}
      <div
        ref={searchContainerRef}
        className="absolute bottom-6 left-0 right-0 px-4 md:px-6 w-full z-10"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-visible mx-auto border border-white/50 max-w-6xl">
          <div className="flex flex-col lg:flex-row">
            {/* Search Keyword Field */}
            <div className="flex-1 p-5 border-b lg:border-b-0 lg:border-r border-gray-100">
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5 text-teal-700 flex-shrink-0" />
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
                <MapPin className="h-5 w-5 text-teal-700 flex-shrink-0" />
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
                        <MapPin className="h-4 w-4 text-teal-600 mr-2 opacity-70 flex-shrink-0" />
                        {city}
                      </div>
                    ))
                  ) : location.trim() !== "" ? (
                    <div className="p-3 text-center text-gray-500">
                      No locations found
                    </div>
                  ) : null}
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
                <div className="flex items-center gap-3 min-w-0">
                  <svg
                    className="h-5 w-5 text-teal-700 flex-shrink-0"
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
                  <span className="text-gray-700 text-base truncate">
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
                        className="h-4 w-4 text-teal-600 mr-2 opacity-70 flex-shrink-0"
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

            {/* Search Button */}
            <div
              className="bg-teal-700 hover:bg-teal-800 transition-all duration-300 p-5 flex items-center justify-center cursor-pointer rounded-b-xl lg:rounded-bl-none lg:rounded-r-xl"
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
