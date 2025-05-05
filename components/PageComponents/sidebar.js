import React from "react";
import { Button } from "@/components/ui/button";
import { Search, Building, MapPin, Phone } from "lucide-react";

const Sidebar = () => {
  const categories = [
    "All Categories",
    "Business Consulting",
    "Legal Services",
    "Marketing & PR",
    "Financial Services",
    "IT & Software",
    "Health & Wellness",
    "Education & Training",
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-md shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Contact Business</h2>
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-clasifico-red"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-clasifico-red"
            />
          </div>
          <div>
            <input
              type="tel"
              placeholder="Your Phone"
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-clasifico-red"
            />
          </div>
          <div>
            <textarea
              placeholder="Your Message"
              rows={4}
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-clasifico-red"
            ></textarea>
          </div>
          <Button className="w-full bg-clasifico-red hover:bg-opacity-90">
            Send Message
          </Button>
        </div>
      </div>

      {/* Search Box */}
      <div className="bg-white rounded-md shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Find Businesses</h2>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Businesses..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-clasifico-red"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>

          <div className="relative">
            <div className="flex items-center border border-gray-200 rounded-md px-4 py-2">
              <MapPin className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-500">Select Location</span>
              <svg
                className="h-5 w-5 text-gray-400 ml-auto"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center border border-gray-200 rounded-md px-4 py-2">
              <Building className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-500">Select Business Type</span>
              <svg
                className="h-5 w-5 text-gray-400 ml-auto"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Business Categories</h2>
        <div className="space-y-3">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center">
              <input
                type="radio"
                id={`category-${index}`}
                name="category"
                className="h-4 w-4 text-clasifico-red focus:ring-clasifico-red"
                defaultChecked={category === "Business Consulting"}
              />
              <label
                htmlFor={`category-${index}`}
                className="ml-2 text-gray-700"
              >
                {category}
              </label>
              {category === "Business Consulting" && (
                <svg
                  className="h-4 w-4 text-gray-400 ml-auto"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Business Hours */}
      <div className="bg-white rounded-md shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Business Hours</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Monday - Friday:</span>
            <span className="font-medium">9:00 AM - 6:00 PM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Saturday:</span>
            <span className="font-medium">10:00 AM - 4:00 PM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Sunday:</span>
            <span className="font-medium">Closed</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <Phone className="h-5 w-5 text-clasifico-red mr-2" />
            <span className="font-medium">+1 (555) 123-4567</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
