"use client";

import React from "react";
import { MapPin, Heart, Building } from "lucide-react";
import { useRouter } from "next/navigation";

const SimilarAds = ({ ads }) => {
  const router = useRouter();

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Similar Businesses</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {ads.map((ad) => (
          <div
            key={ad.id}
            className="rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push(`/page/${ad.slug}`)}
          >
            <div className="h-56">
              <img
                src={ad.image}
                alt={ad.title}
                className="w-full h-full object-cover"
              />
              {ad.featured && (
                <div className="absolute top-2 left-2 bg-clasifico-red text-white text-xs px-2 py-0.5 rounded">
                  Featured
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-sm line-clamp-1 mb-1 hover:text-clasifico-red">
                <a>{ad.title}</a>
              </h3>
              {ad.businessCategory && (
                <div className="flex items-center space-x-1 mb-2">
                  <Building className="h-3.5 w-3.5 text-clasifico-darkGray" />
                  <span className="text-xs text-clasifico-darkGray">
                    {ad.businessCategory}
                  </span>
                </div>
              )}
              <div className="text-clasifico-red font-bold text-sm mb-2">
                {ad.price}
              </div>
              <div className="flex items-center text-xs text-clasifico-darkGray">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="truncate">{ad.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarAds;
