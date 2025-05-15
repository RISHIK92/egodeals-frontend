"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronUp, Search, MapPin, Store } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
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
  ]); // Default categories
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const categoryRef = useRef(null);
  const locationRef = useRef(null);
  const searchContainerRef = useRef(null);
  const locationInputRef = useRef(null);

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
        // Keep the default categories on error
      }
    };

    fetchCategories();
  }, []);

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
      // Category dropdown handling
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }

      // Location dropdown handling
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setIsLocationDropdownOpen(false);
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchCities = async (searchQuery) => {
    try {
      setIsLoading(true);
      // For demo/testing purposes when API isn't available
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
      // Set some demo cities for testing when API fails
      setCities(["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    // Navigate to /businesses with query parameters
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
    e.stopPropagation(); // Prevent event bubbling
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
    // Close the other dropdown
    setIsLocationDropdownOpen(false);
  };

  const toggleLocationDropdown = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsLocationDropdownOpen(!isLocationDropdownOpen);
    // Close the other dropdown
    setIsCategoryDropdownOpen(false);
  };

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-[#EC5944] via-[#ED7055] to-[#FFAEA2] h-[650px] before:content-[''] before:absolute before:inset-0 before:bg-[url('https://res.cloudinary.com/df622sxkk/image/upload/v1746738800/noise-texture_rlbvvs.png')] before:opacity-5 before:mix-blend-overlay">
      {/* Background elements */}
      <div
        className="absolute right-0 top-0 bottom-0 w-1/3 bg-teal-700 hidden lg:block"
        style={{
          borderRadius: "40% 0 0 60%",
          opacity: 0.9,
        }}
      />

      {/* Abstract shapes */}
      <div className="absolute -left-20 top-20 w-64 h-64 rounded-full bg-white/10 hidden lg:block" />
      <div className="absolute right-1/3 bottom-1/4 w-32 h-32 rounded-full bg-teal-500/10 hidden lg:block" />

      <div className="absolute w-3/4 md:w-7/8 left-4 md:left-24 bottom-4 rounded-xl" />

      <div className="container mx-auto px-4 lg:px-6 relative z-10 h-full flex flex-col">
        {/* Hero content */}
        <div className="flex flex-row items-center justify-between h-full pb-24">
          <div className="w-full lg:w-2/5 text-left pt-12">
            <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
              One Platform.
              <br />
              <span className="text-teal-50">Local Services.</span>
              <br />
              <span className="bg-teal-700 px-2 py-1 inline-block mt-2 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 hover:scale-[1.02] transition-transform">
                Endless Possibilities
              </span>
            </h1>
            <p className="text-white/90 mt-6 text-lg max-w-md">
              Discover and connect with the best local businesses in your area.
              All in one place.
            </p>
          </div>

          <div className="hidden lg:block lg:w-3/5 relative h-full">
            <div className="absolute top-24 left-28 bg-teal-700 text-white p-5 rounded-xl shadow-xl z-20 transform hover:scale-105 transition-transform">
              <div className="flex items-start gap-3">
                <Store className="h-7 w-7 text-white shrink-0" />
                <div>
                  <p className="font-bold text-xl">Found</p>
                  <p className="text-lg">51 Tech stores in your locality.</p>
                </div>
              </div>
            </div>

            <div className="absolute right-0 h-full flex items-center">
              <img
                src="https://res.cloudinary.com/df622sxkk/image/upload/v1746737951/33128af806068df8106cc0165dd18bb5e5b055b2_slixx2.png"
                alt="Person using app"
                className="object-contain h-full"
              />
            </div>
          </div>
        </div>

        {/* Search Bar Section */}
        <div
          ref={searchContainerRef}
          className="absolute bottom-12 left-0 right-0 px-4 md:px-6 w-full z-40"
        >
          <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl overflow-visible mx-auto border border-white/50 max-w-6xl transition-all duration-300 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]">
            <div className="flex flex-col lg:flex-row">
              {/* Search Keyword Field */}
              <div className="flex-1 p-4 lg:p-5 border-b lg:border-b-0 lg:border-r border-gray-100">
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-teal-700" />
                  <input
                    type="text"
                    placeholder="Search Keyword..."
                    className="w-full outline-none text-gray-700 placeholder-gray-400 text-sm lg:text-base"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>
              </div>

              {/* Location Field */}
              <div
                className="flex-1 p-4 lg:p-5 border-b lg:border-b-0 lg:border-r border-gray-100 relative"
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
                    className="w-full outline-none text-gray-700 placeholder-gray-400 text-sm lg:text-base"
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

                {/* Location Dropdown (shows upward) */}
                {isLocationDropdownOpen && (
                  <div className="absolute left-0 right-0 bottom-full mb-2 bg-white shadow-xl rounded-lg z-50 max-h-60 overflow-y-auto border border-gray-100 transform transition-all duration-200 origin-bottom">
                    {isLoading ? (
                      <div className="p-3 text-center text-gray-500">
                        Loading...
                      </div>
                    ) : cities.length > 0 ? (
                      cities.map((city, index) => (
                        <div
                          key={index}
                          className="p-3 hover:bg-teal-50 cursor-pointer text-gray-700 transition-colors flex items-center"
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
                className="flex-1 p-4 lg:p-5 border-b lg:border-b-0 lg:border-r border-gray-100 relative"
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
                    <span className="text-gray-700 text-sm lg:text-base whitespace-nowrap overflow-hidden text-ellipsis">
                      {category}
                    </span>
                  </div>
                  <ChevronUp
                    className={`h-5 w-5 text-teal-700 ml-1 shrink-0 transition-transform duration-300 ${
                      isCategoryDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* Category Dropdown (shows upward) */}
                {isCategoryDropdownOpen && (
                  <div className="absolute left-0 right-0 bottom-full mb-2 bg-white shadow-xl rounded-lg z-50 max-h-60 overflow-y-auto border border-gray-100 transform transition-all duration-200 origin-bottom">
                    {categories.map((cat, index) => (
                      <div
                        key={index}
                        className="p-3 hover:bg-teal-50 cursor-pointer text-gray-700 transition-colors flex items-center"
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

              {/* Search Button */}
              <div
                className="bg-teal-700 hover:bg-teal-800 transition-all duration-300 p-4 lg:px-8 lg:py-5 flex items-center justify-center cursor-pointer rounded-b-xl md:rounded-bl-none md:rounded-r-xl group"
                onClick={handleSearch}
              >
                <button className="text-white font-medium flex items-center text-sm lg:text-base whitespace-nowrap">
                  <Search className="h-5 w-5 mr-2 group-hover:animate-pulse" />{" "}
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
