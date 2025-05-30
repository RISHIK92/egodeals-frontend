"use client";

import { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";

export default function CategorySection() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Color mapping configuration
  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-500",
      border: "border-blue-200",
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-500",
      border: "border-amber-200",
    },
    green: {
      bg: "bg-green-50",
      text: "text-green-500",
      border: "border-green-200",
    },
    red: { bg: "bg-red-50", text: "text-red-500", border: "border-red-200" },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-500",
      border: "border-purple-200",
    },
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-500",
      border: "border-emerald-200",
    },
    sky: { bg: "bg-sky-50", text: "text-sky-500", border: "border-sky-200" },
    orange: {
      bg: "bg-orange-50",
      text: "text-orange-500",
      border: "border-orange-200",
    },
    indigo: {
      bg: "bg-indigo-50",
      text: "text-indigo-500",
      border: "border-indigo-200",
    },
    cyan: {
      bg: "bg-cyan-50",
      text: "text-cyan-500",
      border: "border-cyan-200",
    },
    rose: {
      bg: "bg-rose-50",
      text: "text-rose-500",
      border: "border-rose-200",
    },
    yellow: {
      bg: "bg-yellow-50",
      text: "text-yellow-500",
      border: "border-yellow-200",
    },
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/home-categories`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Function to get the appropriate icon component
  const getIconComponent = (iconName) => {
    if (!iconName) return LucideIcons.Briefcase;

    const formattedName = iconName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");

    return LucideIcons[formattedName] || LucideIcons.BriefcaseBusiness;
  };

  if (loading) {
    return (
      <div className="py-24 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          Loading categories...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto text-center text-red-500">
          Error: {error}
        </div>
      </div>
    );
  }

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
          {categories.map((category, index) => {
            const IconComponent = getIconComponent(category.iconName);
            const colorClass =
              colorClasses[category.color] || colorClasses.blue;

            return (
              <a
                key={category.id}
                href={`/businesses?category=${category.name}`}
                className="group relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className={`relative z-10 bg-white rounded-2xl border ${
                    colorClass.border
                  } overflow-hidden transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg ${
                    hoveredIndex === index ? "transform -translate-y-2" : ""
                  } p-6 flex flex-col items-center h-full`}
                >
                  <div
                    className={`${colorClass.bg} ${
                      colorClass.text
                    } rounded-full p-4 mb-5 transition-transform duration-300 ease-in-out ${
                      hoveredIndex === index ? "scale-110" : ""
                    }`}
                  >
                    <IconComponent className="w-10 h-10" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-base mb-2 text-center transition-colors duration-300">
                    {category.name}
                  </h3>
                  <div className="mt-auto">
                    <div
                      className={`${
                        hoveredIndex === index
                          ? `${colorClass.bg.replace("50", "100")} ${
                              colorClass.text
                            }`
                          : "bg-gray-100 text-gray-500"
                      } font-medium rounded-full px-4 py-1.5 text-sm transition-colors duration-300`}
                    >
                      {category._count?.listings}{" "}
                      {category._count?.listings === 1 ? "listing" : "listings"}
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
