"use client";

import { Search, X } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const IconSelector = ({ value, onChange, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [icons, setIcons] = useState([]);

  const iconsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    // Load icons asynchronously to prevent main thread blocking
    setTimeout(() => {
      const iconList = Object.keys(LucideIcons)
        .filter((iconName) => {
          // Filter out non-component exports
          const icon = LucideIcons[iconName];
          return (
            (iconName !== "createReactComponent" &&
              iconName !== "IconContext" &&
              iconName !== "default" &&
              !iconName.startsWith("_") &&
              typeof icon === "function" &&
              // Additional check to ensure it's a React component
              icon.displayName !== undefined) ||
            iconName.charAt(0) === iconName.charAt(0).toUpperCase()
          );
        })
        .map((iconName) => ({
          name: iconName,
          component: LucideIcons[iconName],
        }))
        .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically

      setIcons(iconList);
      setIsLoading(false);
    }, 0);
  }, []);

  const filteredIcons = useMemo(() => {
    if (!searchTerm) return icons;
    return icons.filter((icon) =>
      icon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [icons, searchTerm]);

  const handleIconClick = (iconName) => {
    onChange(iconName);
    onClose();
  };

  const paginatedIcons = useMemo(() => {
    const start = currentPage * iconsPerPage;
    return filteredIcons.slice(start, start + iconsPerPage);
  }, [filteredIcons, currentPage]);

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b p-4 flex justify-between items-center">
          <h3 className="text-lg font-medium">Select Icon</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search icons..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(0); // Reset to first page on search
              }}
              autoFocus
            />
          </div>
        </div>

        {/* Loader or Icon Grid */}
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {filteredIcons.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No icons found matching "{searchTerm}"
              </div>
            ) : (
              <>
                {/* Icon Grid */}
                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-2 p-4">
                  {paginatedIcons.map((icon) => {
                    const IconComponent = icon.component;
                    return (
                      <button
                        key={icon.name}
                        type="button"
                        className={`p-2 rounded-md flex flex-col items-center transition-colors ${
                          value === icon.name
                            ? "bg-blue-100 border-blue-500 border"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => handleIconClick(icon.name)}
                        title={icon.name}
                      >
                        <div className="flex items-center justify-center w-5 h-5">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <span className="text-xs mt-1 truncate w-full text-center">
                          {icon.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center px-4 pb-4">
                  <button
                    className="text-sm text-blue-500 disabled:opacity-30"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
                    disabled={currentPage === 0}
                  >
                    ← Previous
                  </button>
                  <span className="text-xs text-gray-500">
                    Page {currentPage + 1} of{" "}
                    {Math.ceil(filteredIcons.length / iconsPerPage)}
                  </span>
                  <button
                    className="text-sm text-blue-500 disabled:opacity-30"
                    onClick={() =>
                      setCurrentPage((p) =>
                        p + 1 < Math.ceil(filteredIcons.length / iconsPerPage)
                          ? p + 1
                          : p
                      )
                    }
                    disabled={
                      currentPage + 1 >=
                      Math.ceil(filteredIcons.length / iconsPerPage)
                    }
                  >
                    Next →
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IconSelector;
