// components/PageComponents/bookmarkButton.tsx
"use client";

import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

export default function BookmarkButton({ listingId }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkBookmarkStatus();
  }, []);

  const checkBookmarkStatus = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/listings/${listingId}/favorite/check`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsBookmarked(data.isFavorite);
      }
    } catch (error) {
      console.error("Error checking bookmark status:", error);
    }
  };

  const toggleBookmark = async () => {
    setLoading(true);
    try {
      if (isBookmarked) {
        await fetch(`${API_BASE_URL}/listings/${listingId}/favorite`, {
          method: "DELETE",
          credentials: "include",
        });
        setIsBookmarked(false);
        toast.success("Removed from favorites");
      } else {
        await fetch(`${API_BASE_URL}/listings/${listingId}/favorite`, {
          method: "POST",
          credentials: "include",
        });
        setIsBookmarked(true);
        toast.success("Added to favorites");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Failed to update favorite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      disabled={loading}
      className="p-2 border rounded hover:bg-gray-50"
      aria-label={isBookmarked ? "Remove from favorites" : "Add to favorites"}
    >
      <Bookmark
        className={`h-5 w-5 ${
          isBookmarked ? "text-amber-500 fill-amber-500" : "text-gray-500"
        }`}
      />
    </button>
  );
}
