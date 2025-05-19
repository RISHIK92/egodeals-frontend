"use client";

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
  PenToolIcon,
  PaintBucket,
  Cat,
} from "lucide-react";

export default function CategorySection() {
  const categories = [
    {
      name: "JOBS ZONE",
      count: 10,
      icon: <Briefcase className="w-12 h-12 text-gray-400" />,
    },
    {
      name: "EDUCATION & LEARNING",
      count: 36,
      icon: <BookOpen className="w-12 h-12 text-gray-400" />,
    },
    {
      name: "TO LET / RENT / HIRE",
      count: 3,
      icon: <Home className="w-12 h-12 text-gray-400" />,
    },
    {
      name: "HEALTH & MEDICAL",
      count: 27,
      icon: <Stethoscope className="w-12 h-12 text-gray-400" />,
    },
    {
      name: "BEAUTY & PERSONAL CARE",
      count: 37,
      icon: <Scissors className="w-12 h-12 text-gray-400" />,
    },
    {
      name: "FINANCE & FINANCIAL SERVICES",
      count: 1,
      icon: <DollarSign className="w-12 h-12 text-gray-400" />,
    },
    {
      name: "TRAVEL & TOURISM / COURIER SERVICES",
      count: 30,
      icon: <Plane className="w-12 h-12 text-gray-400" />,
    },
    {
      name: "EVENTS & SERVICES",
      count: 39,
      icon: <Calendar className="w-12 h-12 text-gray-400" />,
    },
    {
      name: "BUSINESS OPPERTUNITIES",
      count: 0,
      icon: <TrendingUp className="w-12 h-12 text-gray-400" />,
    },
    {
      name: "REPAIRS & SERVICES",
      count: 35,
      icon: <PenToolIcon className="w-12 h-12 text-gray-400" />,
    },
    {
      name: "INTERIOR DESIGNERS",
      count: 16,
      icon: <PaintBucket className="w-12 h-12 text-gray-400" />,
    },
    {
      name: "PETS & PET CARE",
      count: 19,
      icon: <Cat className="w-12 h-12 text-gray-400" />,
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <a
              key={index}
              href={`/businesses?category=${category.name}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-8 flex flex-col items-center cursor-pointer no-underline"
            >
              <div className="mb-4">{category.icon}</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2 text-center">
                {category.name}
              </h3>
              <div className="bg-gray-200 text-gray-600 font-medium rounded-full px-4 py-2 text-sm">
                {category.count}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
