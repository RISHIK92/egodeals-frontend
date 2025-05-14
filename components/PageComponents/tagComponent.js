"use client";

import { useState } from "react";
import { Tag, X } from "lucide-react";

export default function TagsComponent({
  tags = ["Design", "UI/UX", "Frontend", "React", "Components"],
  title = "Tags",
  color = "teal",
}) {
  const [hoveredTag, setHoveredTag] = useState(null);

  if (!tags || tags.length === 0) return null;

  const colorClasses = {
    teal: {
      container: "bg-white border-teal-200",
      title: "text-teal-800",
      icon: "text-teal-500",
      tags: {
        bg: "bg-teal-100",
        bgHover: "hover:bg-teal-200",
        text: "text-teal-800",
        dot: "bg-teal-500",
      },
    },
    red: {
      container: "bg-red-50 border-red-200",
      title: "text-red-800",
      icon: "text-red-500",
      tags: {
        bg: "bg-red-100",
        bgHover: "hover:bg-red-200",
        text: "text-red-800",
        dot: "bg-red-500",
      },
    },
    green: {
      container: "bg-green-50 border-green-200",
      title: "text-green-800",
      icon: "text-green-500",
      tags: {
        bg: "bg-green-100",
        bgHover: "hover:bg-green-200",
        text: "text-green-800",
        dot: "bg-green-500",
      },
    },
    purple: {
      container: "bg-purple-50 border-purple-200",
      title: "text-purple-800",
      icon: "text-purple-500",
      tags: {
        bg: "bg-purple-100",
        bgHover: "hover:bg-purple-200",
        text: "text-purple-800",
        dot: "bg-purple-500",
      },
    },
  };

  const scheme = colorClasses[color] || colorClasses.teal;

  return (
    <div className={`rounded-xl border shadow-sm p-5 mb-6 ${scheme.container}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-medium flex items-center ${scheme.title}`}>
          <Tag className={`w-5 h-5 mr-2 ${scheme.icon}`} />
          {title}
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="relative"
            onMouseEnter={() => setHoveredTag(index)}
            onMouseLeave={() => setHoveredTag(null)}
          >
            <button
              onClick={() => handleTagClick(tag)}
              className={`${scheme.tags.bg} ${scheme.tags.bgHover} ${
                scheme.tags.text
              } rounded-lg px-3 py-1.5 text-sm font-medium flex items-center transition-all duration-200 transform ${
                hoveredTag === index ? "scale-105" : ""
              }`}
            >
              <span
                className={`h-2 w-2 ${scheme.tags.dot} rounded-full mr-2`}
              ></span>
              {tag}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
