import React from "react";
import ImageGallery from "@/components/PageComponents/imageGallery";
import AdDetails from "@/components/PageComponents/adDetails";
import SellerCard from "@/components/PageComponents/sellerCard";
import SimilarAds from "@/components/PageComponents/similarAds";
import ProductDescription from "@/components/PageComponents/productDescription";
import ProductFeatures from "@/components/PageComponents/productFeatures";
import LocationMap from "@/components/PageComponents/locationMap";
import Sidebar from "@/components/PageComponents/sidebar";
import { Star } from "lucide-react";
import TagsComponent from "@/components/PageComponents/tagComponent";
import ListingPageClient from "@/components/PageComponents/shareClient";
import ReviewSystem from "@/components/PageComponents/reviewSystem";
import { cookies } from "next/headers";

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

    return await response.json();
  } catch (error) {
    console.error("Error fetching listing details:", error);
    return { listing: null, similarListings: [] };
  }
}

async function getAuthStatus() {
  try {
    const cookieStore = cookies();
    const authCookie = cookieStore.get("token"); // Replace with your actual cookie name

    if (!authCookie) {
      return { isAuthenticated: false, user: null };
    }

    const response = await fetch(`${API_BASE_URL}/check-auth`, {
      credentials: "include",
      headers: {
        Cookie: `${authCookie.name}=${authCookie.value}`,
      },
    });

    if (!response.ok) {
      return { isAuthenticated: false, user: null };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking auth status:", error);
    return { isAuthenticated: false, user: null };
  }
}

export default async function ListingPage({ params }) {
  const { id } = params;
  const { listing, similarListings } = await getListingDetails(id);
  const { isAuthenticated, user: authUser } = await getAuthStatus();
  {
    console.log(authUser);
  }

  function extractYouTubeId(url) {
    // Handle various YouTube URL formats
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }

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

  // Get images sorted with primary first
  const images = listing.images.filter((image) => !image.isBanner) || [];
  const primaryImage =
    images.find((img) => img.isPrimary)?.url || images[0]?.url;

  // Format user data
  const user = listing.user
    ? {
        name:
          `${listing.user.firstName || ""} ${
            listing.user.lastName || ""
          }`.trim() || "Anonymous",
        image: "https://egodeals.com/storage/app/default/user.png", // Default image
        phone: listing.user.phone,
        email: listing.user.email,
        city: listing.user.city?.name,
        memberSince: listing.user.createdAt
          ? new Date(listing.user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            })
          : "Recently",
        isFeatured: listing.promotions?.length > 0,
      }
    : null;

  // Format price display
  const priceDisplay = listing.price
    ? `₹${listing.price.toFixed(2)}`
    : "Contact for Price";

  return (
    <div className="min-h-screen flex flex-col lg:px-20">
      {/* Header with background image */}
      <div className="relative h-80 bg-gray-800 overflow-hidden">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={listing.title}
            className="absolute inset-0 w-full h-full object-cover"
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
            {listing.city?.name && (
              <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded">
                {listing.city.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {user && (
        <div className="bg-white shadow-md">
          <div className="container-custom py-4">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center space-x-4 mx-4">
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h2 className="font-medium">{user.name}</h2>
                  <div className="flex items-center mt-1">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < listing.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex items-center mx-4">
                {user.isFeatured && (
                  <span className="bg-indigo-500 text-white text-xs px-3 py-1 rounded mr-6">
                    FEATURED BUSINESS
                  </span>
                )}
                <div className="flex items-center">
                  <span className="text-gray-500 text-sm">Price:</span>
                  <span className="text-clasifico-red font-bold text-xl ml-2">
                    {priceDisplay}
                  </span>
                  {listing.negotiable && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded ml-3">
                      Negotiable
                    </span>
                  )}
                </div>
                <div className="flex ml-6">
                  <ListingPageClient
                    listing={listing}
                    similarListings={similarListings}
                  />
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

              {listing.youtubeVideo && (
                <div className="mt-6 bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
                      Video
                    </h2>
                    <div className="relative pt-[56.25%]">
                      {" "}
                      {/* 16:9 aspect ratio */}
                      <iframe
                        className="absolute top-0 left-0 w-full h-full rounded-md"
                        src={`https://www.youtube.com/embed/${extractYouTubeId(
                          listing.youtubeVideo
                        )}?modestbranding=1&rel=0`}
                        title={`${listing.title} video`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    {listing.videoDescription && (
                      <p className="mt-4 text-gray-600">
                        {listing.videoDescription}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {images.length > 0 && (
                <div className="mt-6">
                  <ImageGallery images={images.map((img) => img.url)} />
                </div>
              )}

              {listing.highlights?.length > 0 && (
                <div className="mt-6">
                  <ProductFeatures
                    features={listing.highlights}
                    listingDetails={{
                      businessCategory: listing.businessCategory,
                      establishedYear: listing.establishedYear,
                      serviceArea: listing.serviceArea,
                      teamSize: listing.teamSize,
                    }}
                  />
                </div>
              )}

              {listing.tags?.length > 0 && (
                <div className="mt-6">
                  <TagsComponent tags={listing.tags} />
                </div>
              )}

              {listing.locationUrl && (
                <div className="mt-6">
                  <LocationMap locationUrl={listing.locationUrl} />
                </div>
              )}
              {console.log(authUser)}
              <ReviewSystem
                listingId={listing.id}
                userId={authUser?.userId}
                // isAuthenticated={isAuthenticated}
              />

              {similarListings.length > 0 && (
                <div className="mt-6">
                  <SimilarAds
                    ads={similarListings.map((item) => ({
                      id: item.id,
                      title: item.title,
                      price: item.price
                        ? `₹${item.price.toFixed(2)}`
                        : "Contact for Price",
                      location: item.city || "Unknown Location",
                      image: item.images?.[0]?.url || "/placeholder-image.jpg",
                      featured: item.promotions?.length > 0,
                      negotiable: item.negotiable,
                      businessCategory: item.category?.name,
                      slug: item.slug,
                    }))}
                  />
                </div>
              )}
            </div>

            <div>
              {user && (
                <SellerCard
                  name={user.name}
                  memberSince={user.memberSince}
                  image={user.image}
                  verified={true}
                  phone={user.phone}
                  email={user.email}
                  location={user.city}
                />
              )}

              <div className="mt-6">
                <Sidebar
                  listing={{
                    ...listing,
                    priceDisplay,
                    category: listing.category?.name,
                    city: listing.city?.name,
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
