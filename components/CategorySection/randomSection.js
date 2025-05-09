"use client";

import { useState } from "react";
import {
  Camera,
  Clock,
  MapPin,
  Bookmark,
  ChevronRight,
  Search,
} from "lucide-react";

export default function RandomListingsSection() {
  const listings = [
    {
      id: 1,
      title: "R.K. EVENT PHOTOGRAPHY",
      category: "EVENTS & SERVICES",
      subcategory: "Videographers & Photographers",
      location: "Kakinada",
      date: "2024-10-05 09:24",
      images: 1,
      imageSrc: "/api/placeholder/400/300",
    },
    {
      id: 2,
      title: "PARADISE COOKING & CATARING & EVENTS",
      category: "EVENTS & SERVICES",
      subcategory: "Event Organizers",
      location: "Kakinada",
      date: "2024-01-22 06:55",
      images: 3,
      imageSrc: "/api/placeholder/400/300",
    },
    {
      id: 3,
      title: "Ayush Interiors",
      category: "INTERIOR DESIGNERS",
      subcategory: "",
      location: "Kakinada",
      date: "2024-09-13 06:46",
      images: 1,
      imageSrc: "/api/placeholder/400/300",
    },
    {
      id: 4,
      title: "Glare Beauty parlour",
      category: "BEAUTY & PERSONAL CARE",
      subcategory: "Parlors & Salon",
      location: "Kakinada",
      date: "2024-09-20 06:15",
      images: 1,
      imageSrc: "/api/placeholder/400/300",
    },
    {
      id: 5,
      title: "Dr Sreeja Dental And Cosmetic Care",
      category: "HEALTH & MEDICAL",
      subcategory: "Dental Hospitals",
      location: "Kakinada",
      date: "2024-09-24 06:33",
      images: 2,
      imageSrc: "/api/placeholder/400/300",
    },
    {
      id: 6,
      title: "SREE BHAVANI MOBILES & GIFT ARTICLES",
      category: "ELECTRONICS",
      subcategory: "",
      location: "Kakinada",
      date: "2023-12-18 10:37",
      images: 1,
      imageSrc: "/api/placeholder/400/300",
    },
  ];

  return (
    <div className="py-16 px-4 bg-gradient-to-b from-[#F8F9FA] to-[#EDF0F2]">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">
            Randomly Selected{" "}
            <span className="font-normal text-teal-700">Listings</span>
          </h2>
          <a
            href="#"
            className="text-teal-700 hover:text-teal-800 flex items-center font-semibold bg-white px-4 py-2 rounded-full shadow-sm transition"
          >
            VIEW MORE <ChevronRight className="ml-1 h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden border border-white/50 hover:shadow-lg transition transform hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={listing.imageSrc}
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded-lg flex items-center">
                  <Camera className="h-4 w-4 mr-1" />
                  <span className="text-xs">{listing.images}</span>
                </div>
                <div className="absolute top-0 left-0 bg-gradient-to-r from-[#EC5944] to-transparent w-1/3 h-1" />
              </div>

              <div className="px-5 py-4">
                <h3 className="font-bold text-gray-800 mb-2 line-clamp-1">
                  {listing.title}
                </h3>

                <div className="flex items-start mb-3">
                  <div className="bg-teal-700 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span>{listing.title.charAt(0)}</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center text-gray-500 text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{listing.date}</span>
                    </div>
                    <div className="flex flex-wrap items-center mt-1">
                      <span className="text-[#EC5944] text-xs font-medium">
                        {listing.category}
                      </span>
                      {listing.subcategory && (
                        <>
                          <span className="text-gray-400 mx-1">•</span>
                          <span className="text-gray-500 text-xs">
                            {listing.subcategory}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center mt-1 text-gray-500 text-xs">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{listing.location}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Button */}
                <div className="flex justify-between items-center mt-3">
                  <button className="bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium py-2 px-4 rounded-lg transition">
                    Contact us
                  </button>
                  <button className="text-gray-400 hover:text-[#EC5944] transition">
                    <Bookmark className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-2xl shadow-xl overflow-hidden border border-white/50 p-6">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Find More Listings
            </h3>
            <p className="text-gray-600">
              Discover services and businesses in your area
            </p>
          </div>

          <div className="flex flex-col md:flex-row bg-gray-50 rounded-xl overflow-hidden">
            <div className="flex-1 p-3 border-b md:border-b-0 md:border-r border-gray-100">
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Keyword..."
                  className="w-full outline-none bg-transparent text-gray-600 placeholder-gray-400"
                />
              </div>
            </div>

            <div className="flex-1 p-3 border-b md:border-b-0 md:border-r border-gray-100">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Location..."
                  className="w-full outline-none bg-transparent text-gray-600 placeholder-gray-400"
                />
              </div>
            </div>

            <div className="bg-teal-700 hover:bg-teal-800 transition p-3 flex items-center justify-center">
              <button className="text-white font-medium flex items-center whitespace-nowrap">
                <Search className="h-5 w-5 mr-2" /> Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
