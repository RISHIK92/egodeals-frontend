"use client";

import {
  ChevronDown,
  Search,
  ArrowUp,
  Building,
  Tv,
  Truck,
  Sofa,
  Briefcase,
  Utensils,
  Store,
} from "lucide-react";

export default function CategorySection() {
  const categories = [
    {
      name: "Property",
      count: 52,
      icon: <Building className="w-12 h-12 text-gray-400" />,
    },
    {
      name: "Home Appliances",
      count: 20,
      icon: (
        <svg
          className="w-12 h-12 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 18h12M6 14h12M7 10h10M9 6h6M12 3v3M4 10v11M20 10v11M4 10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2"></path>
        </svg>
      ),
    },
    {
      name: "Electronics",
      count: 35,
      icon: <Tv className="w-12 h-12 text-gray-400" />,
    },
    {
      name: "Health & Beauty",
      count: 10,
      icon: (
        <svg
          className="w-12 h-12 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 12h8M12 8v8"></path>
        </svg>
      ),
    },
    {
      name: "Automotive",
      count: 27,
      icon: <Truck className="w-12 h-12 text-gray-400" />,
    },
    {
      name: "Furnitures",
      count: 52,
      icon: <Sofa className="w-12 h-12 text-gray-400" />,
    },
    {
      name: "Real Estate",
      count: 20,
      icon: (
        <svg
          className="w-12 h-12 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4" y="2" width="16" height="20" rx="2"></rect>
          <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"></path>
        </svg>
      ),
    },
    {
      name: "Jobs",
      count: 35,
      icon: <Briefcase className="w-12 h-12 text-gray-400" />,
    },
    {
      name: "Restaurants",
      count: 10,
      icon: <Utensils className="w-12 h-12 text-gray-400" />,
    },
    {
      name: "Others",
      count: 27,
      icon: <Store className="w-12 h-12 text-gray-400" />,
    },
  ];

  return (
    <div className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[#186667] font-medium mb-2">CATEGORIES</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Explore by Category
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-8 flex flex-col items-center cursor-pointer"
            >
              <div className="mb-4">{category.icon}</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2 text-center">
                {category.name}
              </h3>
              <div className="bg-gray-200 text-gray-600 font-medium rounded-full px-4 py-2 text-sm">
                {category.count}
              </div>
            </div>
          ))}
        </div>

        {/* <div className="flex justify-center mt-12">
          <button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full shadow-md hover:shadow-lg transition-all">
            All Categories
          </button>
        </div> */}

        {/* <div className="fixed bottom-6 right-6">
          <button className="bg-pink-500 p-3 rounded-md shadow-md hover:bg-pink-600 transition-colors">
            <ArrowUp className="h-6 w-6 text-white" />
          </button>
        </div> */}
      </div>
    </div>
  );
}
