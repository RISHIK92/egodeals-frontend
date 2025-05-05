import React from "react";
import { MapPin, Heart, Building } from "lucide-react";

const SimilarAds = ({ ads }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Similar Businesses</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {ads.map((ad) => (
          <div
            key={ad.id}
            className="rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-[4/3]">
              <img
                src={ad.image}
                alt={ad.title}
                className="w-full h-full object-cover"
              />
              <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 text-clasifico-darkGray hover:text-clasifico-red">
                <Heart className="h-4 w-4" />
              </button>
              {ad.featured && (
                <div className="absolute top-2 left-2 bg-clasifico-red text-white text-xs px-2 py-0.5 rounded">
                  Featured
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-sm line-clamp-1 mb-1 hover:text-clasifico-red">
                <a href={`#${ad.id}`}>{ad.title}</a>
              </h3>
              <div className="flex items-center space-x-1 mb-2">
                <Building className="h-3.5 w-3.5 text-clasifico-darkGray" />
                <span className="text-xs text-clasifico-darkGray">
                  Business Services
                </span>
              </div>
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
