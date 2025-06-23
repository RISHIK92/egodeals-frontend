"use client";

import React, { useState, useEffect } from "react";
import { Map, MapPin, ExternalLink } from "lucide-react";
import Image from "next/image";

export default function LocationMap({ locationUrl }) {
  const [state, setState] = useState({
    isLoading: false,
    error: null,
    data: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!locationUrl) return;

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/location/maps`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: locationUrl }),
          }
        );

        const data = await response.json();
        console.log("API Response:", data); // Debug log

        if (!response.ok) {
        }

        setState({
          isLoading: false,
          error: null,
          data: {
            name: data.name || "Location",
            address: data.address || "",
            coordinates: data.coordinates || null,
            staticMapUrl: data.staticMapUrl || "",
          },
        });
      } catch (error) {
        console.error("Fetch error:", error);
        setState({
          isLoading: false,
          error: error.message,
          data: null,
        });
      }
    };

    fetchData();
  }, [locationUrl]);

  if (state.isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-clasifico-red" />
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="h-64 flex items-center justify-center text-red-500">
          Error: {state.error}
        </div>
      </div>
    );
  }

  if (!state.data) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="h-64 flex items-center justify-center text-gray-500">
          No location data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <Map className="mr-2 h-5 w-5 text-clasifico-red" />
          Location Details
        </h2>
        <div className="text-gray-500 text-sm flex items-center">
          <MapPin className="mr-1 h-4 w-4" />
          <span>{state.data.name}</span>
        </div>
      </div>

      {/* Map Preview */}
      <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
        <a
          href={locationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full w-full relative"
        >
          {state.data.staticMapUrl ? (
            <>
              <div className="relative h-full w-full">
                <img
                  src={state.data.staticMapUrl}
                  alt={`Map of ${state.data.name}`}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute inset-0 bg-opacity-0 hover:bg-opacity-10 transition-all flex items-center justify-center">
                <div className="bg-white px-4 py-2 rounded-full flex items-center shadow">
                  <ExternalLink className="h-4 w-4 mr-2 text-clasifico-red" />
                  <span>Open in Maps</span>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-100">
              <p>Map preview not available</p>
            </div>
          )}
        </a>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        {state.data.address && (
          <div className="flex">
            <span className="text-gray-500 text-sm w-16">Address:</span>
            <span className="text-sm flex-1">{state.data.address}</span>
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div className="flex justify-end">
        <a
          href={locationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-clasifico-red text-sm font-medium hover:underline flex items-center"
        >
          View on Google Maps
          <ExternalLink className="w-4 h-4 ml-1" />
        </a>
      </div>
    </div>
  );
}
