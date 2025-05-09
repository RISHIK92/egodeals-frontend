"use client";
import { useState } from "react";
import { ChevronDown, Search, MapPin, Store } from "lucide-react";

export default function HeroSection() {
  const [selectedCategory, setSelectedCategory] = useState("Select Category");

  return (
    <div
      className="relative w-full overflow-hidden mt-20 bg-gradient-to-b from-[#EC5944] to-[#FFAEA2]"
      style={{ height: "600px" }}
    >
      <div
        className="absolute right-0 top-0 bottom-0 w-1/3 bg-teal-700 hidden lg:block"
        style={{
          borderRadius: "40% 0 0 60%",
        }}
      />

      <div className="absolute w-7/8 ml-24 left-0 bottom-4 h-1/5 bg-[rgba(255,174,162,0.3)] backdrop-blur-2xl rounded-xl" />

      <div className="container mx-auto px-6 relative z-10 h-full flex flex-col">
        <div className="flex flex-row items-center justify-between h-full pb-24">
          <div className="w-full lg:w-2/5 text-left pt-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              One Platform.
              <br />
              Local Services.
              <br />
              <span className="block">Endless Possibilities</span>
            </h1>
          </div>

          <div className="hidden lg:block lg:w-3/5 relative h-full">
            <div className="absolute top-24 left-28 bg-teal-700 text-white p-4 rounded-lg shadow-lg z-20">
              <div className="flex items-start gap-3">
                <Store className="h-6 w-6 text-white shrink-0" />
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

        <div className="absolute bottom-12 left-0 right-0 px-6 w-full">
          <div className="bg-white rounded-4xl shadow-xl overflow-hidden mx-auto border border-white/50">
            <div className="flex flex-col lg:flex-row">
              <div className="flex-1 p-3 lg:p-4 border-b lg:border-b-0 lg:border-r border-gray-100">
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search Keyword..."
                    className="w-full outline-none text-gray-600 placeholder-gray-400 text-sm lg:text-base"
                  />
                </div>
              </div>

              <div className="flex-1 p-3 lg:p-4 border-b lg:border-b-0 lg:border-r border-gray-100">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search Location..."
                    className="w-full outline-none text-gray-600 placeholder-gray-400 text-sm lg:text-base"
                  />
                </div>
              </div>

              <div className="flex-1 p-3 lg:p-4 border-b lg:border-b-0 lg:border-r border-gray-100">
                <div className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <svg
                      className="h-5 w-5 text-gray-400"
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
                    <span className="text-gray-600 text-sm lg:text-base whitespace-nowrap overflow-hidden text-ellipsis">
                      {selectedCategory}
                    </span>
                  </div>
                  <ChevronDown className="h-5 w-5 text-gray-400 ml-1 shrink-0" />
                </div>
              </div>

              <div className="bg-teal-700 hover:bg-teal-800 transition p-3 lg:px-6 lg:py-4 flex items-center justify-center">
                <button className="text-white font-medium flex items-center text-sm lg:text-base whitespace-nowrap">
                  <Search className="h-5 w-5 mr-2" /> Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
