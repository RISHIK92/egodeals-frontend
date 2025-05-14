import { Briefcase, Clock, MapPin, Users, Star } from "lucide-react";

export default function ProductFeatures({ features, listingDetails }) {
  // Check if any business details exist to display
  const hasBusinessDetails =
    listingDetails &&
    (listingDetails.businessCategory ||
      listingDetails.establishedYear ||
      listingDetails.serviceArea ||
      listingDetails.teamSize);

  return (
    <div className="bg-white rounded-md shadow p-6">
      {features && features.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Business Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <div className="h-5 w-5 rounded-full bg-clasifico-red flex items-center justify-center text-white mr-3">
                  <svg
                    className="h-3 w-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 12L10 17L19 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {hasBusinessDetails && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="text-lg font-medium mb-4">Business Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listingDetails.businessCategory && (
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 text-clasifico-red mr-3" />
                <span className="text-gray-700">
                  Business Category: {listingDetails.businessCategory}
                </span>
              </div>
            )}

            {listingDetails.establishedYear && (
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-clasifico-red mr-3" />
                <span className="text-gray-700">
                  Established: {listingDetails.establishedYear}
                </span>
              </div>
            )}

            {listingDetails.serviceArea && (
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-clasifico-red mr-3" />
                <span className="text-gray-700">
                  Service Area: {listingDetails.serviceArea}
                </span>
              </div>
            )}

            {listingDetails.teamSize && (
              <div className="flex items-center">
                <Users className="h-5 w-5 text-clasifico-red mr-3" />
                <span className="text-gray-700">
                  Team Size: {listingDetails.teamSize}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
