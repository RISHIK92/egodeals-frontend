import React from "react";
import ImageGallery from "@/components/PageComponents/imageGallery";
import AdDetails from "@/components/PageComponents/adDetails";
import SellerCard from "@/components/PageComponents/sellerCard";
import SimilarAds from "@/components/PageComponents/similarAds";
import ProductDescription from "@/components/PageComponents/productDescription";
import ProductFeatures from "@/components/PageComponents/productFeatures";
import LocationMap from "@/components/PageComponents/locationMap";
import Sidebar from "@/components/PageComponents/sidebar";
import { Share, Heart, Building, Star } from "lucide-react";
import Navbar from "@/components/Navbar/navbar";
import TagsComponent from "@/components/PageComponents/tagComponent";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

async function getListingDetails(slug) {
  try {
    const response = await fetch(`${API_BASE_URL}/list/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch listing: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching listing details:", error);
    return { listing: null, similarListings: [] };
  }
}

export default async function ListingPage({ params }) {
  const { listing, similarListings } = await getListingDetails(params.id);

  if (!listing) {
    return (
      <div className="container-custom py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-700">Listing not found</h2>
        <p className="mt-4 text-gray-500">
          The listing you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  // Only create businessOwner if we have user data
  const businessOwner = listing.user
    ? {
        name:
          `${listing.user?.firstName || ""} ${
            listing.user?.lastName || ""
          }`.trim() || "Anonymous",
        verified: true,
        rating: 5,
        reviewCount: listing.user?.reviewCount || 0,
        image:
          listing.user?.image ||
          "https://egodeals.com/storage/app/default/user.png",
        type:
          listing.promotions?.length > 0
            ? "FEATURED BUSINESS"
            : "STANDARD BUSINESS",
        memberSince: listing.user?.createdAt
          ? new Date(listing.user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            })
          : "Recently",
      }
    : null;

  // Only use highlights if they exist
  const businessFeatures =
    listing.highlights?.length > 0 ? listing.highlights : null;

  // Format price display
  const getPriceDisplay = () => {
    if (
      listing.price === undefined ||
      listing.price === null ||
      listing.price === 0
    ) {
      return "Contact for Price";
    }
    return `₹${listing.price.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen flex flex-col lg:px-20">
      <div className="relative h-80 bg-gray-800 overflow-hidden">
        {listing.images?.length > 0 ? (
          <img
            src={listing.images[0].url}
            alt={listing.title}
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-600"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {listing.title}
          </h1>
          <div className="flex items-center flex-wrap gap-2">
            {listing.category?.name && (
              <span className="bg-clasifico-red text-white text-xs px-2 py-1 rounded inline-flex items-center">
                <span className="h-1.5 w-1.5 bg-white rounded-full mr-1"></span>
                {listing.category.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {businessOwner && (
        <div className="bg-white shadow-md">
          <div className="container-custom py-4">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center space-x-4 mx-4">
                <img
                  src={businessOwner.image}
                  alt={businessOwner.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center">
                    <h2 className="font-medium">{businessOwner.name}</h2>
                    {businessOwner.verified && (
                      <span className="ml-2 text-green-500">
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
                            fill="currentColor"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < businessOwner.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    <span className="text-xs text-gray-500 ml-1">
                      ({businessOwner.reviewCount})
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex items-center mx-4">
                <span className="bg-indigo-500 text-white text-xs px-3 py-1 rounded mr-6">
                  {businessOwner.type}
                </span>
                <div>
                  <div className="flex items-center">
                    <span className="text-gray-500 text-sm">Price:</span>
                    <span className="text-clasifico-red font-bold text-xl ml-2">
                      {getPriceDisplay()}
                    </span>
                    {listing.negotiable && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded ml-3 flex items-center">
                        Negotiable
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex ml-6 space-x-2">
                  <button className="p-2 border rounded hover:bg-gray-50">
                    <Share className="h-5 w-5 text-gray-500" />
                  </button>
                  <button className="p-2 border rounded hover:bg-gray-50">
                    <svg
                      className="h-5 w-5 text-gray-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 17L17 7M7 7H17V17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button className="p-2 border rounded hover:bg-gray-50">
                    <Heart className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {listing.description && (
                <ProductDescription description={listing.description} />
              )}

              {listing.images?.length > 0 && (
                <div className="mt-6 ml-6">
                  <ImageGallery images={listing.images.map((img) => img.url)} />
                </div>
              )}

              {businessFeatures && (
                <div className="mt-6">
                  <ProductFeatures
                    features={businessFeatures}
                    listingDetails={{
                      ...(listing.businessCategory && {
                        businessCategory: listing.businessCategory,
                      }),
                      ...(listing.establishedYear && {
                        establishedYear: listing.establishedYear,
                      }),
                      ...(listing.serviceArea && {
                        serviceArea: listing.serviceArea,
                      }),
                      ...(listing.teamSize && { teamSize: listing.teamSize }),
                      ...(listing.rating && { rating: listing.rating }),
                      ...(listing.reviewCount && {
                        reviewCount: listing.reviewCount,
                      }),
                    }}
                  />
                </div>
              )}

              {/* Tags Component */}
              {listing.tags && listing.tags.length > 0 && (
                <div className="mt-6">
                  <TagsComponent tags={listing.tags} />
                </div>
              )}

              {listing.city && (
                <div className="mt-6">
                  <LocationMap location={listing.city} />
                </div>
              )}

              {similarListings?.length > 0 && (
                <div className="mt-6">
                  <SimilarAds
                    ads={similarListings.map((item) => ({
                      id: item.id,
                      title: item.title,
                      price:
                        item.price === undefined ||
                        item.price === null ||
                        item.price === 0
                          ? "Contact for Price"
                          : `₹${item.price.toFixed(2)}`,
                      location: item.city,
                      image:
                        item.images?.[0]?.url ||
                        "https://images.unsplash.com/photo-1568992687947-868a62a9f521?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                      featured: item.promotions?.length > 0,
                      negotiable: item.negotiable,
                    }))}
                  />
                </div>
              )}
            </div>
            <div>
              {businessOwner && (
                <SellerCard
                  name={businessOwner.name}
                  memberSince={businessOwner.memberSince}
                  image={businessOwner.image}
                  verified={businessOwner.verified}
                  phone={listing.user?.phone}
                  email={listing.user?.email}
                />
              )}
              <div className="mt-6">
                <Sidebar
                  listing={{
                    ...listing,
                    priceDisplay: getPriceDisplay(),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
