"use client";

import { useState } from "react";
import { Share, Heart } from "lucide-react";
import { usePathname } from "next/navigation";
import BookmarkButton from "./bookmarkButton";
import ShareOptions from "./shareOptions";

export default function ListingPageClient({ listing, similarListings }) {
  const pathname = usePathname();
  const [showShareOptions, setShowShareOptions] = useState(false);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <>
      <button
        className="p-2 border rounded hover:bg-gray-50"
        onClick={() => setShowShareOptions(true)}
      >
        <Share className="h-5 w-5 text-gray-500" />
      </button>

      {showShareOptions && (
        <ShareOptions
          url={shareUrl}
          title={listing.title}
          onClose={() => setShowShareOptions(false)}
        />
      )}

      <BookmarkButton listingId={listing.id} />
    </>
  );
}
