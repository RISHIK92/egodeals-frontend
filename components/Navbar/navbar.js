"use client";
import { useState, useEffect } from "react";
import { Edit, Menu, X, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [activeItem, setActiveItem] = useState("Home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const router = useRouter();

  const navItems = ["Home", "Businesses", "Pricing"];

  useEffect(() => {
    checkAuthStatus();

    const handleClickOutside = (event) => {
      if (
        profileDropdownOpen &&
        !event.target.closest(".profile-dropdown-container")
      ) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileDropdownOpen]);

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

  return (
    <>
      <div className="flex justify-between items-center h-20 px-6 lg:px-12 bg-white border-b border-gray-100 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center">
          <div
            className="h-48 mt-2 w-auto cursor-pointer"
            onClick={() => router.push("/")}
          >
            <img
              src="https://res.cloudinary.com/df622sxkk/image/upload/v1746742290/0c8eb74fb6f15192bef2770ba22d1524669d558f_xzk58h.png"
              alt="egodeals logo"
              className="h-full object-contain"
            />
          </div>
        </div>

        <div className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <div
              key={item}
              className="flex items-center cursor-pointer"
              onClick={() => handleClick(item)}
            >
              <span
                className={`${
                  activeItem === item ? "text-teal-700" : "text-gray-700"
                } hover:text-teal-700 font-medium`}
              >
                {item}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="relative profile-dropdown-container">
              <button
                className={`p-2 rounded-full ${
                  profileDropdownOpen
                    ? "bg-teal-100 text-teal-700"
                    : "hover:bg-gray-100"
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
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
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
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 w-full text-left cursor-pointer
                    "
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="hidden md:block text-teal-700 font-medium hover:text-teal-800 cursor-pointer"
              onClick={() => router.push("/login")}
            >
              Login
            </button>
          )}
          <button
            className="hidden md:flex bg-[#186667] hover:bg-teal-800 text-white px-5 py-2 rounded-full items-center cursor-pointer"
            onClick={() => router.push("/create-listing")}
          >
            <Edit className="h-4 w-4 mr-2" />
            List your business
          </button>

          <button
            className="md:hidden text-gray-700 hover:text-teal-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed top-20 left-0 right-0 bg-white shadow-lg z-40 md:hidden">
          <div className="flex flex-col px-6 py-4 space-y-4">
            {navItems.map((item) => (
              <div
                key={item}
                className="py-2 border-b border-gray-100 last:border-b-0"
                onClick={() => handleClick(item)}
              >
                <span
                  className={`${
                    activeItem === item ? "text-teal-700" : "text-gray-700"
                  } font-medium text-lg`}
                >
                  {item}
                </span>
              </div>
            ))}
            <div className="pt-4 space-y-3">
              {isLoggedIn ? (
                <>
                  <button
                    className="w-full text-teal-700 font-medium hover:text-teal-800 py-2"
                    onClick={() => {
                      router.push("/profile");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Profile
                  </button>
                  <button
                    className="w-full text-teal-700 font-medium hover:text-teal-800 py-2"
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
                  className="w-full text-teal-700 font-medium hover:text-teal-800 py-2"
                  onClick={() => {
                    router.push("/login");
                    setMobileMenuOpen(false);
                  }}
                >
                  Login
                </button>
              )}
              <button
                className="w-full bg-[#186667] hover:bg-teal-800 text-white px-5 py-3 rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => router.push("/create-listing")}
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
