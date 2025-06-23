"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { BannerSkeleton } from "./BannerSkeleton";

export default function CategoryBanner() {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get category from props or URL params
  const categoryName = searchParams.get("category");

  // Helper function to convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;

    // Handle different YouTube URL formats
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^&\n?#]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0&showinfo=0`;
      }
    }

    return null;
  };

  const isValidIframeUrl = (url) => {
    if (!url) return false;

    if (getYouTubeEmbedUrl(url)) return true;

    const allowedDomains = [
      "youtube.com",
      "youtu.be",
      "vimeo.com",
      "player.vimeo.com",
    ];

    try {
      const urlObj = new URL(url);
      return allowedDomains.some((domain) => urlObj.hostname.includes(domain));
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const userLocation =
      typeof window !== "undefined"
        ? localStorage.getItem("userLocation")
        : null;

    // Fetch banners from API
    const fetchBanners = async () => {
      try {
        let url;

        if (categoryName) {
          // Fetch category banners
          const params = new URLSearchParams();
          params.append("category", categoryName);
          if (userLocation) {
            params.append("location", userLocation);
          }
          url = `${
            process.env.NEXT_PUBLIC_BACKEND_URL
          }/category-banners?${params.toString()}`;
        } else {
          // Fetch hero banners when no category
          const params = new URLSearchParams();
          if (userLocation) {
            params.append("location", userLocation);
          }
          url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/hero-banners${
            params.toString() ? `?${params.toString()}` : ""
          }`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setBanners(Array.isArray(data) ? data : []);
        setIsLoading(false);
      } catch (error) {
        console.error(
          `Error fetching ${categoryName ? "category" : "hero"} banners:`,
          error
        );
        setBanners([]);
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, [categoryName]);

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

  // Handle banner click
  const handleBannerClick = (banner) => {
    // Don't handle clicks on iframe content
    if (banner?.youtubeUrl && isValidIframeUrl(banner.youtubeUrl)) {
      return;
    }

    if (banner?.ListingUrl && banner.ListingUrl !== "#") {
      if (banner.ListingUrl.startsWith("http")) {
        window.open(banner.ListingUrl, "_blank");
      } else {
        router.push(banner.ListingUrl);
      }
    }
  };

  // Render banner content (image or iframe)
  const renderBannerContent = (banner) => {
    // Check if we should render an iframe (YouTube or other video)
    if (banner.youtubeUrl && isValidIframeUrl(banner.youtubeUrl)) {
      const embedUrl =
        getYouTubeEmbedUrl(banner.youtubeUrl) || banner.youtubeUrl;

      return (
        <iframe
          src={embedUrl}
          title={banner.title || `${categoryName} Video Banner`}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    // Fallback to image
    {
      console.log(banner);
    }

    if (banner.imageUrl) {
      return (
        <img
          src={banner.imageUrl}
          alt={banner.title || `${categoryName} Promotional Banner`}
          className="w-full h-full object-contain transition-transform duration-300"
        />
      );
    }

    // No content available
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-200">
        <span className="text-gray-500">No banner content available</span>
      </div>
    );
  };

  // Show skeleton while loading
  if (isLoading) {
    return <BannerSkeleton />;
  }

  // If no banners found, show default banner
  if (banners.length === 0) {
    return (
      <div className="w-full py-12 bg-gradient-to-b from-[#2563EB] to-[#93C5FD]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          {/* Default category banner content */}
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold text-white mb-4">
              {categoryName
                ? `Explore ${categoryName}`
                : "Discover Local Businesses"}
            </h2>
            <p className="text-white/90 mb-6">
              {categoryName
                ? `Find the best ${categoryName.toLowerCase()} services in your area. Connect with trusted professionals and businesses.`
                : "Discover amazing local businesses and services in your area. From restaurants to professional services, find what you need."}
            </p>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="bg-white rounded-full p-1 mr-3">
                  <Check className="h-4 w-4 text-blue-700" />
                </div>
                <span className="text-white">Verified local businesses</span>
              </div>
              <div className="flex items-center">
                <div className="bg-white rounded-full p-1 mr-3">
                  <Check className="h-4 w-4 text-blue-700" />
                </div>
                <span className="text-white">Real customer reviews</span>
              </div>
              <div className="flex items-center">
                <div className="bg-white rounded-full p-1 mr-3">
                  <Check className="h-4 w-4 text-blue-700" />
                </div>
                <span className="text-white">Easy contact and booking</span>
              </div>
            </div>
            <button
              onClick={() => router.push("/businesses")}
              className="mt-8 bg-blue-700 text-white hover:bg-blue-800 font-medium px-6 py-3 rounded-full shadow-lg transition-all"
            >
              Browse All Businesses
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
                {/* Business/Category themed SVG */}
                <rect
                  width="640"
                  height="360"
                  fill="url(#categoryGradient)"
                  rx="20"
                />
                <defs>
                  <linearGradient
                    id="categoryGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
                {/* Store/business icon */}
                <rect
                  x="270"
                  y="120"
                  width="100"
                  height="80"
                  fill="white"
                  fillOpacity="0.9"
                  rx="8"
                />
                <rect x="285" y="135" width="15" height="25" fill="#3B82F6" />
                <rect x="310" y="135" width="15" height="25" fill="#3B82F6" />
                <rect x="335" y="135" width="15" height="25" fill="#3B82F6" />
                <rect x="285" y="170" width="70" height="8" fill="#3B82F6" />
                <circle cx="320" cy="100" r="12" fill="#F59E0B" />
                <path
                  d="M315 95 L320 100 L325 95"
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                />
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
      {/* Banner Content with fixed 500px height */}
      <div
        className="w-full h-[500px] flex items-center justify-center bg-gray-100 overflow-hidden"
        onClick={() => handleBannerClick(currentBanner)}
        style={{
          cursor:
            currentBanner?.youtubeUrl &&
            isValidIframeUrl(currentBanner.youtubeUrl)
              ? "default"
              : "pointer",
        }}
      >
        {renderBannerContent(currentBanner)}
      </div>

      {/* Category Badge */}
      {categoryName && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {categoryName}
          </span>
        </div>
      )}

      {/* Navigation Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
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
