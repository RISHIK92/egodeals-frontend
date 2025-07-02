"use client";

import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { Edit, MapPin } from "lucide-react";

import Navbar from "@/components/Navbar/navbar";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

function Footer() {
  const router = useRouter();
  const [pages, setPages] = useState([]);

  useEffect(() => {
    async function fetchPages() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/pages`
        );
        const data = await response.json();
        setPages(data);
      } catch (error) {
        console.error("Failed to fetch pages:", error);
      }
    }
    fetchPages();
  }, []);

  return (
    <div className="w-full">
      {/* Top gradient border */}
      <div className="h-2 bg-gradient-to-r from-[#EC5B46] to-[#FEAA9E]"></div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-2">
          <div className="flex flex-col space-y-1">
            {" "}
            <div
              className="h-16 w-auto cursor-pointer"
              onClick={() => router.push("/")}
            >
              <img
                src="https://res.cloudinary.com/df622sxkk/image/upload/v1748618480/thumb-816x460-logo-657d3fb8b6ed1_aqovvn.jpg"
                alt="egodeals logo"
                className="h-16 object-contain"
              />
            </div>
            <div className="mt-4">
              <ul className="space-y-2 md:ml-8">
                {pages.map((page) => (
                  <li key={page.id}>
                    <a
                      href={`/${page.slug}`}
                      className="hover:text-teal-700 text-md"
                    >
                      {page.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">Top Categories</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href={`/businesses?category=${"property"}`}
                    className="hover:text-teal-700"
                  >
                    Property
                  </a>
                </li>
                <li>
                  <a
                    href={`/businesses?category=${"Home Appliances"}`}
                    className="hover:text-teal-700"
                  >
                    Home Appliances
                  </a>
                </li>
                <li>
                  <a
                    href={`/businesses?category=${"Electronics"}`}
                    className="hover:text-teal-700"
                  >
                    Electronics
                  </a>
                </li>
                <li>
                  <a
                    href={`/businesses?category=${"Health & Beauty"}`}
                    className="hover:text-teal-700"
                  >
                    Health & Beauty
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Shortcuts</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/profile" className="hover:text-teal-700">
                    My Account
                  </a>
                </li>
                <li>
                  <a href="/login" className="hover:text-teal-700">
                    Login
                  </a>
                </li>
                <li>
                  <a href="/register" className="hover:text-teal-700">
                    Register
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-teal-700">
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
          <p>©2025 egodeals.</p>
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
