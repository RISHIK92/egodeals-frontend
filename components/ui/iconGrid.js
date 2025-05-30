import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // or any left/right icon

const IconsGrid = ({ filteredIcons, searchTerm, value, handleIconClick }) => {
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(filteredIcons.length / itemsPerPage);
  const currentIcons = filteredIcons.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  return (
    <div className="flex-1 overflow-y-auto">
      {filteredIcons.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No icons found matching "{searchTerm}"
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between px-4 pt-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={page === 0}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronLeft />
            </button>
            <span className="text-sm text-gray-600">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
              disabled={page >= totalPages - 1}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronRight />
            </button>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 p-4">
            {currentIcons.map((icon) => {
              const IconComponent = icon.component;

              if (!IconComponent || typeof IconComponent !== "function") {
                return null;
              }

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
        </>
      )}
    </div>
  );
};

export default IconsGrid;
