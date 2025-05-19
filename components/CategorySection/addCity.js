"use client";
import { useState, useEffect, useRef } from "react";
import { Search, Plus, Check, X } from "lucide-react";
import { toast } from "react-toastify";

export default function CityDropdown({
  cities,
  selectedCity,
  onSelectCity,
  showDropdown,
  setShowDropdown,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingNewCity, setIsAddingNewCity] = useState(false);
  const [newCityName, setNewCityName] = useState("");
  const dropdownRef = useRef(null);

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setSearchTerm("");
        setIsAddingNewCity(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowDropdown]);

  const handleAddNewCity = async () => {
    if (newCityName.trim() && !cities.includes(newCityName.trim())) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/cities`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: newCityName.trim() }),
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to add new city");
        }

        const newCity = await response.json();
        onSelectCity(newCity.name);
        setShowDropdown(false);
        setSearchTerm("");
        setIsAddingNewCity(false);
        setNewCityName("");
        toast.success("City added successfully");
      } catch (error) {
        toast.error(error.message || "Failed to add new city");
      }
    }
  };

  if (!showDropdown) return null;

  return (
    <div
      className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg py-1 border border-gray-200"
      ref={dropdownRef}
    >
      <div className="px-3 py-2 border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search cities..."
            className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsAddingNewCity(false);
            }}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                searchTerm &&
                !filteredCities.includes(searchTerm)
              ) {
                setIsAddingNewCity(true);
                setNewCityName(searchTerm);
              }
            }}
          />
        </div>
      </div>
      <div className="max-h-60 overflow-y-auto">
        {isAddingNewCity ? (
          <div className="px-4 py-2">
            <div className="flex items-center">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                value={newCityName}
                onChange={(e) => setNewCityName(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddNewCity();
                  }
                }}
              />
              <button
                onClick={handleAddNewCity}
                className="ml-2 p-1 text-teal-600 hover:text-teal-800"
                aria-label="Add city"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setIsAddingNewCity(false);
                  setNewCityName("");
                }}
                className="ml-1 p-1 text-gray-500 hover:text-gray-700"
                aria-label="Cancel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Press Enter or click the checkmark to add this new city
            </p>
          </div>
        ) : (
          <>
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => (
                <div
                  key={city}
                  className={`px-4 py-2 cursor-pointer flex justify-between items-center hover:bg-teal-50 ${
                    selectedCity === city
                      ? "bg-teal-50 text-teal-700"
                      : "text-gray-700"
                  }`}
                  onClick={() => {
                    onSelectCity(city);
                    setShowDropdown(false);
                    setSearchTerm("");
                  }}
                >
                  {city}
                  {selectedCity === city && (
                    <Check className="h-4 w-4 text-teal-600" />
                  )}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500 italic text-sm">
                No cities found
              </div>
            )}

            {/* Always show "Add new city" option at the bottom */}
            <div
              className="px-4 py-2 cursor-pointer flex items-center text-teal-600 hover:bg-teal-50 border-t border-gray-200"
              onClick={() => {
                setIsAddingNewCity(true);
                setNewCityName(searchTerm);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              {searchTerm ? (
                <>Add "{searchTerm}" as new city</>
              ) : (
                "Add new city"
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
