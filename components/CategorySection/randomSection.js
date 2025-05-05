import { Camera, Clock, MapPin, Bookmark } from "lucide-react";

export default function RandomListingsSection() {
  const listings = [
    {
      id: 1,
      title: "R.K. EVENT PHOTOGRAPHY",
      category: "EVENTS & SERVICES",
      subcategory: "Videographers & Photographers",
      location: "Kakinada",
      date: "2024-10-05 09:24",
      images: 1,
      imageSrc: "/api/placeholder/400/300",
    },
    {
      id: 2,
      title: "PARADISE COOKING & CATARING & EVENTS",
      category: "EVENTS & SERVICES",
      subcategory: "Event Organizers",
      location: "Kakinada",
      date: "2024-01-22 06:55",
      images: 3,
      imageSrc: "/api/placeholder/400/300",
    },
    {
      id: 3,
      title: "Ayush Interiors",
      category: "INTERIOR DESIGNERS",
      subcategory: "",
      location: "Kakinada",
      date: "2024-09-13 06:46",
      images: 1,
      imageSrc: "/api/placeholder/400/300",
    },
    {
      id: 4,
      title: "Glare Beauty parlour",
      category: "BEAUTY & PERSONAL CARE",
      subcategory: "Parlors & Salon",
      location: "Kakinada",
      date: "2024-09-20 06:15",
      images: 1,
      imageSrc: "/api/placeholder/400/300",
    },
    {
      id: 5,
      title: "Dr Sreeja Dental And Cosmetic Care",
      category: "HEALTH & MEDICAL",
      subcategory: "Dental Hospitals",
      location: "Kakinada",
      date: "2024-09-24 06:33",
      images: 2,
      imageSrc: "/api/placeholder/400/300",
    },
    {
      id: 6,
      title: "SREE BHAVANI MOBILES & GIFT ARTICLES",
      category: "ELECTRONICS",
      subcategory: "",
      location: "Kakinada",
      date: "2023-12-18 10:37",
      images: 1,
      imageSrc: "/api/placeholder/400/300",
    },
  ];

  return (
    <div className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Randomly Selected{" "}
            <span className="font-normal text-gray-600">Listings</span>
          </h2>
          <a
            href="#"
            className="text-pink-500 hover:text-pink-600 flex items-center"
          >
            VIEW MORE <span className="ml-1">≡</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={listing.imageSrc}
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-md flex items-center">
                  <Camera className="h-4 w-4 mr-1" />
                  <span className="text-xs">{listing.images}</span>
                </div>
              </div>

              <div className="px-4 py-3">
                <h3 className="font-bold text-gray-900 mb-2">
                  {listing.title}
                </h3>

                <div className="flex items-start mb-1">
                  <div className="bg-gray-200 text-xs w-6 h-6 rounded-full flex items-center justify-center mr-2 mt-0.5">
                    <span>P</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center text-gray-500 text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{listing.date}</span>
                    </div>
                    <div className="flex flex-wrap items-center mt-1">
                      <span className="text-pink-500 text-xs font-medium">
                        {listing.category}
                      </span>
                      {listing.subcategory && (
                        <>
                          <span className="text-gray-400 mx-1">•</span>
                          <span className="text-gray-500 text-xs">
                            {listing.subcategory}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center mt-1 text-gray-500 text-xs">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{listing.location}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Button */}
                <div className="flex justify-between items-center mt-2">
                  <button className="text-blue-600 text-sm font-medium">
                    Contact us
                  </button>
                  <button className="text-gray-500">
                    <Bookmark className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
