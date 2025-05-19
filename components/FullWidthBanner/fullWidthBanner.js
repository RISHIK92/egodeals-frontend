// components/FullWidthBanner/fullWidthBanner.jsx
"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import Image from "next/image";

export default function FullWidthBanner({ staticImage }) {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch banners from API
    const fetchBanners = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/banners`
        );
        const data = await response.json();
        setBanners(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching banners:", error);
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prevIndex) =>
          prevIndex === banners.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000); // Change every 4 seconds

      return () => clearInterval(interval);
    }
  }, [banners]);

  if (staticImage) {
    return (
      <div className="w-full overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <img
            src={staticImage}
            alt="Promotional Banner"
            className="w-full h-auto max-h-[500px] object-contain"
          />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full py-12 bg-gradient-to-b from-[#EC5944] to-[#FFAEA2]">
        <div className="max-w-7xl mx-auto px-6">Loading banners...</div>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="w-full py-12 bg-gradient-to-b from-[#EC5944] to-[#FFAEA2]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          {/* Default banner content */}
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold text-white mb-4">
              Post Your Classified Ads
            </h2>
            <p className="text-white/90 mb-6">
              Reach thousands of potential customers with your classified ads.
              Our platform offers the best exposure for your products and
              services.
            </p>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="bg-white rounded-full p-1 mr-3">
                  <Check className="h-4 w-4 text-teal-700" />
                </div>
                <span className="text-white">Easy to use interface</span>
              </div>
              <div className="flex items-center">
                <div className="bg-white rounded-full p-1 mr-3">
                  <Check className="h-4 w-4 text-teal-700" />
                </div>
                <span className="text-white">Premium ads available</span>
              </div>
              <div className="flex items-center">
                <div className="bg-white rounded-full p-1 mr-3">
                  <Check className="h-4 w-4 text-teal-700" />
                </div>
                <span className="text-white">24/7 customer support</span>
              </div>
            </div>
            <button className="mt-8 bg-teal-700 text-white hover:bg-teal-800 font-medium px-6 py-3 rounded-full shadow-lg transition-all">
              Post an Ad Now
            </button>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <svg
                className="w-full max-w-md"
                viewBox="0 0 640 360"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* SVG content remains the same */}
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentBanner = banners[currentBannerIndex];

  return (
    <div className="w-full overflow-hidden relative">
      {/* Banner Image */}
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <img
          src={currentBanner.imageUrl}
          alt={currentBanner.title || "Promotional Banner"}
          className="w-full h-auto max-h-[500px] object-contain"
        />
      </div>

      {/* Banner Content Overlay */}
      {(currentBanner.title || currentBanner.subtitle) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-4 max-w-2xl"></div>
        </div>
      )}

      {/* Navigation Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBannerIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentBannerIndex
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
