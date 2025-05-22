"use client";

import { useState } from "react";
import {
  Briefcase,
  BookOpen,
  Home,
  Stethoscope,
  Scissors,
  DollarSign,
  Plane,
  Calendar,
  TrendingUp,
  PenTool,
  PaintBucket,
  Cat,
} from "lucide-react";

export default function CategorySection() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const categories = [
    {
      name: "JOBS ZONE",
      count: 10,
      icon: <Briefcase className="w-10 h-10" />,
      color: "bg-blue-50 text-blue-500",
      borderColor: "border-blue-200",
    },
    {
      name: "EDUCATION & LEARNING",
      count: 36,
      icon: <BookOpen className="w-10 h-10" />,
      color: "bg-amber-50 text-amber-500",
      borderColor: "border-amber-200",
    },
    {
      name: "TO LET / RENT / HIRE",
      count: 3,
      icon: <Home className="w-10 h-10" />,
      color: "bg-green-50 text-green-500",
      borderColor: "border-green-200",
    },
    {
      name: "HEALTH & MEDICAL",
      count: 27,
      icon: <Stethoscope className="w-10 h-10" />,
      color: "bg-red-50 text-red-500",
      borderColor: "border-red-200",
    },
    {
      name: "BEAUTY & PERSONAL CARE",
      count: 37,
      icon: <Scissors className="w-10 h-10" />,
      color: "bg-purple-50 text-purple-500",
      borderColor: "border-purple-200",
    },
    {
      name: "FINANCE & FINANCIAL SERVICES",
      count: 1,
      icon: <DollarSign className="w-10 h-10" />,
      color: "bg-emerald-50 text-emerald-500",
      borderColor: "border-emerald-200",
    },
    {
      name: "TRAVEL & TOURISM / COURIER SERVICES",
      count: 30,
      icon: <Plane className="w-10 h-10" />,
      color: "bg-sky-50 text-sky-500",
      borderColor: "border-sky-200",
    },
    {
      name: "EVENTS & SERVICES",
      count: 39,
      icon: <Calendar className="w-10 h-10" />,
      color: "bg-orange-50 text-orange-500",
      borderColor: "border-orange-200",
    },
    {
      name: "BUSINESS OPPERTUNITIES",
      count: 0,
      icon: <TrendingUp className="w-10 h-10" />,
      color: "bg-indigo-50 text-indigo-500",
      borderColor: "border-indigo-200",
    },
    {
      name: "REPAIRS & SERVICES",
      count: 35,
      icon: <PenTool className="w-10 h-10" />,
      color: "bg-cyan-50 text-cyan-500",
      borderColor: "border-cyan-200",
    },
    {
      name: "INTERIOR DESIGNERS",
      count: 16,
      icon: <PaintBucket className="w-10 h-10" />,
      color: "bg-rose-50 text-rose-500",
      borderColor: "border-rose-200",
    },
    {
      name: "PETS & PET CARE",
      count: 19,
      icon: <Cat className="w-10 h-10" />,
      color: "bg-yellow-50 text-yellow-500",
      borderColor: "border-yellow-200",
    },
  ];

  return (
    <div className="py-24 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block rounded-full bg-[#186667]/10 px-4 py-1.5 text-sm font-medium text-[#186667] mb-4">
            CATEGORIES
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Explore by Category
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Browse through our extensive collection of services and offerings
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <a
              key={index}
              href={`/businesses?category=${category.name}`}
              className="group relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={`relative z-10 bg-white rounded-2xl border ${
                  category.borderColor
                } overflow-hidden transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg ${
                  hoveredIndex === index ? "transform -translate-y-2" : ""
                } p-6 flex flex-col items-center h-full`}
              >
                <div
                  className={`${
                    category.color
                  } rounded-full p-4 mb-5 transition-transform duration-300 ease-in-out ${
                    hoveredIndex === index ? "scale-110" : ""
                  }`}
                >
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-900 text-base mb-2 text-center transition-colors duration-300">
                  {category.name}
                </h3>
                <div className="mt-auto">
                  <div
                    className={`${
                      hoveredIndex === index
                        ? category.color.split(" ")[0] +
                          " " +
                          category.color.split(" ")[1].replace("50", "100")
                        : "bg-gray-100 text-gray-500"
                    } font-medium rounded-full px-4 py-1.5 text-sm transition-colors duration-300`}
                  >
                    {category.count}{" "}
                    {category.count === 1 ? "listing" : "listings"}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
