"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { BannerSkeleton } from "../FullWidthBanner/BannerSkeleton";

export default function PopupBannerModal() {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const alreadyShown = localStorage.getItem("popupBannerShown");
      if (alreadyShown) {
        setHasShown(true);
      }
    }
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/home-banner`
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
    if (!isLoading && banners.length > 0) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        // if (typeof window !== "undefined") {
        //   localStorage.setItem("popupBannerShown", "true");
        //   setHasShown(true);
        // }
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isLoading, banners]);

  const closeModal = () => {
    setIsVisible(false);
  };

  if (isLoading) return null;
  if (banners.length === 0) return null;
  if (!isVisible) return null;

  const firstBanner = banners[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4  bg-opacity-50 backdrop-blur-sm">
      <div className="relative max-w-4xl w-full bg-transparent rounded-lg overflow-hidden">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 z-10 p-1 rounded-full bg-opacity-50 text-white hover:bg-opacity-70 transition-all cursor-pointer"
          aria-label="Close popup"
        >
          <X size={24} />
        </button>

        <div className="w-full h-full flex items-center justify-center bg-transparent" >
          <img
            src={firstBanner.Image}
            alt={firstBanner.title || "Promotional Banner"}
            className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
