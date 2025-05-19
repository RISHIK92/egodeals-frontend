"use client";

import React, { useState, useEffect } from "react";
import { Map, Navigation, MapPin } from "lucide-react";

export default function LocationMap({ location }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate fetching coordinates based on location
    const fetchCoordinates = async () => {
      try {
        // In a real implementation, you would use a geocoding service like Google Maps API
        // This is a simulation that creates predictable coordinates based on the location string
        const simulateCoordinates = () => {
          // Create a simple hash of the location string to generate predictable coordinates
          let hash = 0;
          for (let i = 0; i < location.length; i++) {
            hash = location.charCodeAt(i) + ((hash << 5) - hash);
          }

          // Generate latitude between 8 and 37 (roughly India's latitude range)
          const lat = 8 + Math.abs(hash % 29);

          // Generate longitude between 68 and 97 (roughly India's longitude range)
          const lng = 68 + Math.abs((hash >> 4) % 29);

          return { lat, lng };
        };

        // Add a small delay to simulate network request
        setTimeout(() => {
          const coords = simulateCoordinates();
          setCoordinates(coords);
          setIsLoaded(true);
        }, 500);
      } catch (err) {
        setError("Failed to load map coordinates");
        setIsLoaded(true);
      }
    };

    fetchCoordinates();
  }, [location]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <Map className="mr-2 h-5 w-5 text-clasifico-red" />
          Location
        </h2>
        <div className="text-gray-500 text-sm flex items-center">
          <MapPin className="mr-1 h-4 w-4" />
          {location}
        </div>
      </div>

      <div className="rounded-lg overflow-hidden">
        {!isLoaded ? (
          <div className="h-64 bg-gray-100 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-t-clasifico-red border-gray-200 rounded-full animate-spin mb-2"></div>
              <p className="text-gray-500">Loading map...</p>
            </div>
          </div>
        ) : error ? (
          <div className="h-64 bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-500 mb-2">{error}</p>
              <p className="text-gray-500">
                Unable to display map for {location}
              </p>
            </div>
          </div>
        ) : (
          <div className="relative h-64">
            {/* Map display with pin at coordinates */}
            <div className="absolute inset-0 bg-blue-50">
              <div className="w-full h-full relative overflow-hidden">
                {/* Simulated map background with grid */}
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-6">
                  {Array(48)
                    .fill()
                    .map((_, i) => (
                      <div key={i} className="border border-blue-100"></div>
                    ))}
                </div>

                {/* Roads */}
                <div className="absolute top-1/4 left-0 right-0 h-1 bg-gray-300"></div>
                <div className="absolute top-2/3 left-0 right-0 h-0.5 bg-gray-300"></div>
                <div className="absolute left-1/3 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                <div className="absolute left-3/4 top-0 bottom-0 w-1 bg-gray-300"></div>

                {/* Water feature */}
                <div className="absolute bottom-2 right-6 w-16 h-12 bg-blue-200 rounded-full"></div>

                {/* Location pin */}
                <div
                  className="absolute"
                  style={{
                    left: `${((coordinates.lng - 68) * 100) / 29}%`,
                    top: `${((coordinates.lat - 8) * 100) / 29}%`,
                  }}
                >
                  <div className="relative -left-3 -top-8">
                    <div className="w-6 h-6 bg-clasifico-red rounded-full flex items-center justify-center animate-bounce">
                      <MapPin className="h-4 w-4 text-white" />
                    </div>
                    <div className="w-4 h-4 bg-clasifico-red opacity-30 rounded-full mx-auto mt-1"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map controls */}
            <div className="absolute bottom-3 right-3 bg-white rounded-lg shadow p-1">
              <div className="flex flex-col">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
                <div className="my-1 h-px bg-gray-200"></div>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Compass */}
            <div className="absolute top-3 right-3">
              <div className="bg-white rounded-full p-1 shadow">
                <Navigation className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-between">
        <div className="text-sm text-gray-500">
          {coordinates && (
            <span>
              Coordinates: {coordinates.lat.toFixed(4)}°N,{" "}
              {coordinates.lng.toFixed(4)}°E
            </span>
          )}
        </div>
        <a
          href={`https://maps.google.com/?q=${location},India`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-clasifico-red text-sm font-medium hover:underline flex items-center"
        >
          View on Google Maps
          <svg
            className="w-4 h-4 ml-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
          </svg>
        </a>
      </div>
    </div>
  );
}
