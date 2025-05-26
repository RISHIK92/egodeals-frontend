"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import Image from "next/image";
import { BannerSkeleton } from "../FullWidthBanner/BannerSkeleton";

export default function AdminFullWidthBanner({ staticImage }) {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userLocation =
      typeof window !== "undefined"
        ? localStorage.getItem("userLocation")
        : null;

    // Fetch banners from API with pincode if available
    const fetchBanners = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/home-banner`;

        const response = await fetch(url);
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

  // Show skeleton while loading
  if (isLoading) {
    return <BannerSkeleton />;
  }

  if (banners.length === 0) {
    return <></>;
  }

  const currentBanner = banners[currentBannerIndex];

  return (
    <div className="w-full overflow-hidden relative">
      {/* Banner Image */}
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <img
          src={currentBanner.Image}
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
