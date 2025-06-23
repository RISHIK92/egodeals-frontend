"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BannerSkeleton } from "./BannerSkeleton";

export default function BottomBanner({ staticImage }) {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Helper function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;

    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  };

  // Helper function to get YouTube embed URL with autoplay
  const getYouTubeEmbedUrl = (videoId) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1`;
  };

  // Handle banner click
  const handleBannerClick = (banner) => {
    if (banner?.ListingUrl) {
      // Check if it's an external URL
      if (
        banner.ListingUrl.startsWith("http://") ||
        banner.ListingUrl.startsWith("https://")
      ) {
        window.open(banner.ListingUrl, "_blank");
      } else {
        // Internal route
        router.push(banner.ListingUrl);
      }
    }
  };

  useEffect(() => {
    const userLocation =
      typeof window !== "undefined"
        ? localStorage.getItem("userLocation")
        : null;

    // Fetch banners from API with pincode if available
    const fetchBanners = async () => {
      try {
        const url = userLocation
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/bottom-banners?location=${userLocation}`
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}/hero-banners`;

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
  const youtubeVideoId = getYouTubeVideoId(currentBanner?.youtubeUrl);

  return (
    <div className="w-full overflow-hidden relative">
      {/* Banner Content */}
      <div
        className={`w-full h-full flex items-center justify-center bg-gray-100 ${
          currentBanner?.ListingUrl ? "cursor-pointer" : ""
        }`}
        onClick={() => handleBannerClick(currentBanner)}
      >
        {youtubeVideoId ? (
          // YouTube Video Embed
          <div
            className="w-full relative"
            style={{ paddingBottom: "33.34%", height: 0 }}
          >
            <iframe
              className="absolute top-0 left-0 w-full h-[500px]"
              src={getYouTubeEmbedUrl(youtubeVideoId)}
              title={currentBanner?.title || "YouTube video"}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          // Regular Image
          <img
            src={currentBanner?.Image || currentBanner?.imageUrl || "abc.png"}
            alt={currentBanner?.title || "Promotional Banner"}
            className="w-full h-auto max-h-[500px] object-contain"
          />
        )}
      </div>

      {/* Click indicator for banners with ListingUrl */}
      {currentBanner?.ListingUrl && !youtubeVideoId && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm pointer-events-none">
          Click to view
        </div>
      )}

      {/* Navigation Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation(); // Prevent banner click when clicking dots
                setCurrentBannerIndex(index);
              }}
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
