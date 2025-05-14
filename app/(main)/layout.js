"use client";

import { useState } from "react";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { Edit, MapPin } from "lucide-react";

import Navbar from "@/components/Navbar/navbar";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

function Footer() {
  return (
    <div className="w-full">
      {/* Top gradient border */}
      <div className="h-2 bg-gradient-to-r from-[#EC5B46] to-[#FEAA9E]"></div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
          {/* Logo and contact section */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-teal-700 flex items-center justify-center">
                <span className="text-white text-xl font-bold">e</span>
              </div>
              <div className="ml-2">
                <span className="text-xl font-semibold">
                  <span className="text-teal-700">ego</span>
                  <span className="text-red-500">deals</span>
                </span>
                <p className="text-xs text-gray-500">
                  enhancing local business.
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="font-medium">
                Address: <span className="font-normal">Something</span>
              </p>
            </div>

            <div className="mt-2">
              <p className="font-medium">
                Have any queries?{" "}
                <a href="#" className="text-teal-700 font-semibold underline">
                  Contact Support
                </a>
              </p>
            </div>
          </div>

          {/* Categories and shortcuts */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">Top Categories</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-teal-700">
                    Property
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-700">
                    Home Appliances
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-700">
                    Electronics
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-700">
                    Health & Beauty
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Shortcuts</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-teal-700">
                    My Account
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-700">
                    Login
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-700">
                    Register
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-700">
                    Home
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Map section */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Maps</h3>
            <div className="relative h-40 bg-gray-100 rounded-md overflow-hidden">
              {/* Placeholder for map */}
              <div className="absolute inset-0 bg-gray-200">
                <img
                  src="/api/placeholder/400/160"
                  alt="Map"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex flex-col">
                  <button className="bg-white rounded w-6 h-6 flex items-center justify-center mb-1 shadow">
                    +
                  </button>
                  <button className="bg-white rounded w-6 h-6 flex items-center justify-center shadow">
                    −
                  </button>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="text-red-500">
                    <MapPin size={32} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom copyright bar */}
      <div className="bg-teal-800 text-white py-4">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>
            ©2025 egodeals. Website Developed by{" "}
            <span className="font-semibold">AJS Innovations</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
