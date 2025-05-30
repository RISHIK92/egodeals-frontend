"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { X } from "lucide-react";
import { BannerSkeleton } from "../FullWidthBanner/BannerSkeleton";

const STORAGE_KEY = "popupBannerShown";
const SHOW_DELAY = 1500;
const ANIMATION_DURATION = 300;

export default function PopupBannerModal() {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(null);

  const modalRef = useRef(null);
  const timeoutRef = useRef(null);

  // Check if banner was already shown
  const checkIfAlreadyShown = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEY) === "true";
    }
    return false;
  }, []);

  // Fetch banners with error handling
  const fetchBanners = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/home-banner`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setBanners(data);
      } else {
        setBanners([]);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      setError(error.message);
      setBanners([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Show modal with animation
  const showModal = useCallback(() => {
    if (checkIfAlreadyShown()) return;

    setIsVisible(true);
    // Start with animation, then show
    setTimeout(() => {
      setIsAnimating(false);
    }, 50);
  }, [checkIfAlreadyShown]);

  // Close modal with animation
  const closeModal = useCallback(() => {
    setIsAnimating(true);

    setTimeout(() => {
      setIsVisible(false);
      setIsAnimating(false);
    }, ANIMATION_DURATION);
  }, []);

  // Handle escape key
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    },
    [closeModal]
  );

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    },
    [closeModal]
  );

  // Handle image load
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  // Handle image error
  const handleImageError = useCallback(() => {
    setError("Failed to load banner image");
  }, []);

  // Fetch banners on mount
  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  // Show modal after delay if conditions are met
  useEffect(() => {
    if (!isLoading && !error && banners.length > 0 && !checkIfAlreadyShown()) {
      setIsAnimating(true); // Start hidden
      timeoutRef.current = setTimeout(showModal, SHOW_DELAY);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isLoading, error, banners, showModal, checkIfAlreadyShown]);

  // Add/remove event listeners
  useEffect(() => {
    if (isVisible) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("click", handleBackdropClick);
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleBackdropClick);
      document.body.style.overflow = "unset";
    };
  }, [isVisible, handleKeyDown, handleBackdropClick]);

  // Don't render if conditions aren't met
  if (isLoading || error || banners.length === 0 || !isVisible) {
    return null;
  }

  const firstBanner = banners[0];
  const animationClass = isAnimating
    ? "opacity-0 scale-95"
    : "opacity-100 scale-100";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-50 backdrop-blur-sm transition-all duration-300 ease-out ${animationClass}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="banner-title"
      aria-describedby="banner-description"
    >
      <div
        ref={modalRef}
        className="relative max-w-6xl w-full bg-white rounded-lg overflow-hidden shadow-2xl"
      >
        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black cursor-pointer bg-opacity-50 text-white hover:bg-opacity-70 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
          aria-label="Close banner popup"
          type="button"
        >
          <X size={20} />
        </button>

        {/* Banner content */}
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <BannerSkeleton />
            </div>
          )}

          <img
            src={firstBanner.Image}
            alt={firstBanner.title || firstBanner.alt || "Promotional banner"}
            className={`w-full h-auto max-h-[90vh] object-contain transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="eager"
          />
        </div>

        {/* Screen reader content */}
        <div className="sr-only">
          <h2 id="banner-title">{firstBanner.title || "Promotional Banner"}</h2>
          <p id="banner-description">
            {firstBanner.description || "Marketing promotion or announcement"}
          </p>
        </div>
      </div>
    </div>
  );
}
