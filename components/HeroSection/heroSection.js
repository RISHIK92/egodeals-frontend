"use client";

import { useState } from "react";
import { ChevronDown, Search, MapPin } from "lucide-react";

export default function HeroSection() {
  const [selectedLocation, setSelectedLocation] = useState("Select Location");
  const [selectedCategory, setSelectedCategory] = useState("Select Category");

  const categories = [
    { name: "All", active: true },
    { name: "Education", active: false },
    { name: "Restaurant", active: false },
    { name: "Real Estate", active: false },
  ];

  return (
    <div className="relative h-screen bg-gray-900 overflow-hidden mt-16">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black opacity-60"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Buy, Rent & Exchange <br />
            With One Click
          </h1>
          <p className="text-lg text-gray-200">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit sed do
            eiusmod.
          </p>
        </div>

        <div className="w-full max-w-5xl">
          <div className="bg-white rounded-full flex overflow-hidden shadow-lg">
            <div className="flex-1 p-4 pl-6 border-r border-gray-200">
              <div className="flex items-center">
                <Search className="h-5 w-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Search Keyword..."
                  className="w-full outline-none text-gray-700"
                />
              </div>
            </div>

            <div className="w-64 p-4 border-r border-gray-200 relative">
              <div className="flex items-center justify-between cursor-pointer">
                <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Search Location..."
                  className="w-full outline-none text-gray-700"
                />
              </div>
            </div>

            <div className="w-64 p-4 border-r border-gray-200 relative">
              <div className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-500">{selectedCategory}</span>
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="bg-pink-500 px-8 flex items-center justify-center">
              <button className="text-white font-medium flex items-center">
                <Search className="h-5 w-5 mr-2" /> Search
              </button>
            </div>
          </div>
        </div>

        <div className="flex mt-8 space-x-8">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`flex items-center cursor-pointer ${
                category.active ? "text-pink-500" : "text-white"
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  category.active ? "bg-pink-500" : "border border-white"
                } mr-2`}
              ></div>
              <span>{category.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
