"use client";
import { useState, useEffect } from "react";
import { Edit, Menu, X, User, MapPin, ChevronDown, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [activeItem, setActiveItem] = useState("Home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("Select Location");
  const [manualPincode, setManualPincode] = useState("");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const router = useRouter();

  const navItems = ["Home", "Businesses", "Pricing"];

  useEffect(() => {
    checkAuthStatus();
    // Try to get location from localStorage if available
    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) {
      setCurrentLocation(savedLocation);
    }

    const handleClickOutside = (event) => {
      if (
        profileDropdownOpen &&
        !event.target.closest(".profile-dropdown-container")
      ) {
        setProfileDropdownOpen(false);
      }
      if (
        locationDropdownOpen &&
        !event.target.closest(".location-dropdown-container")
      ) {
        setLocationDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileDropdownOpen, locationDropdownOpen]);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/check-auth`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    }
  };

  const handleClick = (item) => {
    setActiveItem(item);
    const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
    router.push(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
      setIsLoggedIn(false);
      setProfileDropdownOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const toggleLocationDropdown = () => {
    setLocationDropdownOpen(!locationDropdownOpen);
  };

  const handleLocationSelect = (location) => {
    setCurrentLocation(location);
    localStorage.setItem("userLocation", location);
    setLocationDropdownOpen(false);
  };

  const handleManualPincodeSubmit = (e) => {
    e.preventDefault();
    if (manualPincode.trim()) {
      handleLocationSelect(manualPincode);
      setManualPincode("");
    }
  };

  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
      );
      const data = await response.json();

      if (data.address && data.address.postcode) {
        return data.address.postcode;
      }
      return null;
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      return null;
    }
  };

  const detectLocation = async () => {
    setIsDetectingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const pincode = await reverseGeocode(
              position.coords.latitude,
              position.coords.longitude
            );

            if (pincode) {
              handleLocationSelect(pincode);
            } else {
              alert(
                "Could not determine pincode for this location. Please enter manually."
              );
            }
          } catch (error) {
            console.error("Error getting location:", error);
            alert("Error determining your location. Please enter manually.");
          } finally {
            setIsDetectingLocation(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not detect your location. Please enter manually.");
          setIsDetectingLocation(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsDetectingLocation(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center h-20 px-6 lg:px-12 bg-gradient-to-r from-white to-teal-50 backdrop-blur-sm border-b border-teal-100/30 fixed top-0 left-0 right-0 z-50 shadow-sm">
        <div className="flex items-center">
          <div
            className="h-44 w-auto cursor-pointer"
            onClick={() => router.push("/")}
          >
            <img
              src="https://res.cloudinary.com/df622sxkk/image/upload/v1746742290/0c8eb74fb6f15192bef2770ba22d1524669d558f_xzk58h.png"
              alt="egodeals logo"
              className="h-full object-contain"
            />
          </div>
        </div>

        <div className="hidden md:flex gap-8 items-center">
          {/* Location dropdown */}
          <div className="relative location-dropdown-container mr-4">
            <button
              className={`flex items-center gap-1 px-4 py-2 rounded-full transition-all duration-200 ${
                locationDropdownOpen
                  ? "bg-gradient-to-r from-teal-500/10 to-teal-600/20 text-teal-700"
                  : "hover:bg-teal-50/50"
              }`}
              onClick={toggleLocationDropdown}
            >
              <MapPin className="h-4 w-4 cursor-pointer" />
              <span className="text-sm font-medium cursor-pointer">
                {currentLocation}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 cursor-pointer ${
                  locationDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {locationDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg py-3 z-50 border border-teal-100/30">
                <div className="px-4 py-2 text-sm font-medium text-teal-800">
                  Your Location
                </div>
                <button
                  onClick={detectLocation}
                  disabled={isDetectingLocation}
                  className={`block px-4 py-2 text-sm w-full text-left ${
                    isDetectingLocation
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-teal-50 hover:text-teal-700"
                  }`}
                >
                  {isDetectingLocation ? "Detecting..." : "Detect my location"}
                </button>
                <form
                  onSubmit={handleManualPincodeSubmit}
                  className="px-4 py-2"
                >
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Enter pincode"
                      className="flex-1 border border-teal-200 rounded-l-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                      value={manualPincode}
                      onChange={(e) => setManualPincode(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-3 py-1.5 rounded-r-md text-sm hover:from-teal-700 hover:to-teal-800 transition-all duration-200"
                    >
                      Go
                    </button>
                  </div>
                </form>
                <div className="border-t border-teal-100 mt-2 pt-2">
                  <div className="px-4 py-1 text-sm font-medium text-teal-800">
                    Popular Locations
                  </div>
                  {["110001", "400001", "560001", "700001"].map((pincode) => (
                    <button
                      key={pincode}
                      onClick={() => handleLocationSelect(pincode)}
                      className="block px-4 py-1.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 w-full text-left"
                    >
                      {pincode}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {navItems.map((item) => (
            <div
              key={item}
              className="flex items-center cursor-pointer relative group"
              onClick={() => handleClick(item)}
            >
              <span
                className={`${
                  activeItem === item ? "text-teal-700" : "text-gray-700"
                } hover:text-teal-700 font-medium transition-colors duration-200`}
              >
                {item}
              </span>
              {activeItem === item && (
                <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full"></span>
              )}
              <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="relative profile-dropdown-container">
              <button
                className={`p-2 rounded-full transition-all duration-200 ${
                  profileDropdownOpen
                    ? "bg-gradient-to-r from-teal-500/10 to-teal-600/20 text-teal-700"
                    : "hover:bg-teal-50/50"
                }`}
                onClick={toggleProfileDropdown}
              >
                <User
                  className={`h-5 w-5 ${
                    profileDropdownOpen ? "text-teal-700" : "text-gray-700"
                  } cursor-pointer`}
                />
              </button>
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg py-2 z-50 border border-teal-100/30">
                  <button
                    onClick={() => {
                      router.push("/profile");
                      setProfileDropdownOpen(false);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 w-full text-left cursor-pointer"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 w-full text-left cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="hidden md:block text-teal-700 font-medium hover:text-teal-800 cursor-pointer transition-colors duration-200"
              onClick={() => router.push("/login")}
            >
              Login
            </button>
          )}
          <button
            className="hidden md:flex bg-gradient-to-r from-[#186667] to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-5 py-2.5 rounded-full items-center cursor-pointer shadow-sm hover:shadow transition-all duration-200"
            onClick={() => router.push("/create-listing")}
          >
            <Edit className="h-4 w-4 mr-2" />
            List your business
          </button>

          <button
            className="md:hidden text-gray-700 hover:text-teal-700 transition-colors duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed top-20 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg z-40 md:hidden border-b border-teal-100/30">
          <div className="flex flex-col px-6 py-4 space-y-4">
            {/* Mobile location selector */}
            <div className="pb-4 border-b border-teal-100">
              <div className="flex items-center gap-2 text-teal-800">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">Location: {currentLocation}</span>
              </div>
              <div className="mt-3 flex flex-col gap-2">
                <button
                  onClick={detectLocation}
                  disabled={isDetectingLocation}
                  className={`text-sm w-full text-left flex items-center gap-1.5 ${
                    isDetectingLocation
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-teal-700 hover:text-teal-800"
                  }`}
                >
                  <Search className="h-3.5 w-3.5" />
                  {isDetectingLocation
                    ? "Detecting location..."
                    : "Detect my location"}
                </button>
                <form
                  onSubmit={handleManualPincodeSubmit}
                  className="flex mt-1"
                >
                  <input
                    type="text"
                    placeholder="Enter pincode"
                    className="flex-1 border border-teal-200 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                    value={manualPincode}
                    onChange={(e) => setManualPincode(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-3 py-2 rounded-r-md text-sm hover:from-teal-700 hover:to-teal-800 transition-all duration-200"
                  >
                    Go
                  </button>
                </form>
              </div>
            </div>

            {navItems.map((item) => (
              <div
                key={item}
                className="py-3 border-b border-teal-100 last:border-b-0"
                onClick={() => handleClick(item)}
              >
                <span
                  className={`${
                    activeItem === item ? "text-teal-700" : "text-gray-700"
                  } font-medium text-lg transition-colors duration-200`}
                >
                  {item}
                </span>
              </div>
            ))}
            <div className="pt-4 space-y-3">
              {isLoggedIn ? (
                <>
                  <button
                    className="w-full text-teal-700 font-medium hover:text-teal-800 py-2 transition-colors duration-200"
                    onClick={() => {
                      router.push("/profile");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Profile
                  </button>
                  <button
                    className="w-full text-teal-700 font-medium hover:text-teal-800 py-2 transition-colors duration-200"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  className="w-full text-teal-700 font-medium hover:text-teal-800 py-2 transition-colors duration-200"
                  onClick={() => {
                    router.push("/login");
                    setMobileMenuOpen(false);
                  }}
                >
                  Login
                </button>
              )}
              <button
                className="w-full bg-gradient-to-r from-[#186667] to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-5 py-3 rounded-full flex items-center justify-center cursor-pointer shadow-sm hover:shadow transition-all duration-200 mt-2"
                onClick={() => {
                  router.push("/create-listing");
                  setMobileMenuOpen(false);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                List your business
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
