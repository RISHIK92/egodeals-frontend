"use client";

import { useState } from "react";
import { ChevronDown, Edit } from "lucide-react";

export default function Navbar() {
  const [isHomeDropdownOpen, setIsHomeDropdownOpen] = useState(false);

  const navSection = [
    { name: "Home", hasDropdown: true },
    { name: "Categories", hasDropdown: true },
    { name: "Browse Ads", hasDropdown: true },
    { name: "Pages", hasDropdown: true },
    { name: "Elements", hasDropdown: true },
    { name: "Blog", hasDropdown: true },
  ];

  const homeDropdownItems = [
    "Home Page 01",
    "Home Page 02",
    "Home Page 03",
    "Home Page 04",
    "Home Page 05",
    "Home Page 06",
    "OnePage Home",
    "RTL Home",
    "Header Style",
  ];

  return (
    <>
      <div className="flex justify-between items-center h-24 px-16 bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center">
          <div className="flex items-center">
            <div className="w-12 h-12 relative">
              <div className="absolute w-8 h-8 bg-blue-500 rounded-full top-1 left-0 opacity-70"></div>
              <div className="absolute w-8 h-8 bg-pink-500 rounded-full bottom-1 right-0 opacity-70"></div>
            </div>
            <div className="ml-2">
              <p className="text-2xl font-bold text-gray-800">Vyapaar</p>
              <p className="text-xs text-gray-500">Classified Theme</p>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {navSection.map((item, index) => (
            <div
              key={index}
              className="flex items-center cursor-pointer relative group"
              onClick={() =>
                item.name === "Home" &&
                setIsHomeDropdownOpen(!isHomeDropdownOpen)
              }
            >
              <span
                className={`${
                  item.name === "Home" ? "text-pink-500" : "text-gray-700"
                } hover:text-pink-500 font-medium`}
              >
                {item.name}
              </span>
              {item.hasDropdown && (
                <ChevronDown
                  className={`h-4 w-4 ml-1 mt-0.5 ${
                    item.name === "Home" ? "text-pink-500" : "text-gray-700"
                  }`}
                />
              )}

              {item.name === "Home" && isHomeDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md w-64 py-2 z-20">
                  {homeDropdownItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex justify-between"
                    >
                      <span>{item}</span>
                      {idx === homeDropdownItems.length - 1 && (
                        <ChevronDown className="h-4 w-4 rotate-270" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div>
          <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full flex items-center">
            <span className="text-lg mr-1">
              <Edit className="h-4 w-4" />
            </span>{" "}
            Create Listing
          </button>
        </div>
      </div>
    </>
  );
}
