"use client";

import { useState, useEffect } from "react";
import {
  Camera,
  Clock,
  MapPin,
  Bookmark,
  ChevronRight,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function RandomListingsSection() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRandomListings = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/listings/random`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch listings");
        }
        const data = await response.json();
        setListings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomListings();
  }, []);

  if (loading) {
    return (
      <div className="py-16 px-4 bg-gradient-to-b from-[#F8F9FA] to-[#EDF0F2]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-md overflow-hidden h-96 animate-pulse"
              >
                <div className="bg-gray-200 h-48 w-full"></div>
                <div className="p-5 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 px-4 bg-gradient-to-b from-[#F8F9FA] to-[#EDF0F2]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-500">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-teal-700 hover:bg-teal-800 text-white font-medium py-2 px-4 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 bg-gradient-to-b from-[#F8F9FA] to-[#EDF0F2]">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">
            Randomly Selected{" "}
            <span className="font-normal text-teal-700">Listings</span>
          </h2>
          <a
            href="/businesses"
            className="text-teal-700 hover:text-teal-800 flex items-center font-semibold bg-white px-4 py-2 rounded-full shadow-sm transition"
          >
            VIEW MORE <ChevronRight className="ml-1 h-4 w-4" />
          </a>
        </div>

        {listings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden border border-white/50 hover:shadow-lg transition transform hover:-translate-y-1 cursor-pointer"
                  onClick={() =>
                    router.push(
                      `page/${listing.title.toLowerCase().replace(/\s+/g, "-")}`
                    )
                  }
                >
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
                          <span>
                            {new Date(listing.date).toLocaleDateString()}
                          </span>
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
          </>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No listings found</p>
          </div>
        )}
      </div>
    </div>
  );
}
