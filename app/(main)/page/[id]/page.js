import React from "react";
// import Header from "@/components/Header";
import ImageGallery from "@/components/PageComponents/imageGallery";
import AdDetails from "@/components/PageComponents/adDetails";
import SellerCard from "@/components/PageComponents/sellerCard";
import SimilarAds from "@/components/PageComponents/similarAds";
// import Footer from "@/components/Footer";
import ProductDescription from "@/components/PageComponents/productDescription";
import ProductFeatures from "@/components/PageComponents/productFeatures";
import LocationMap from "@/components/PageComponents/locationMap";
import Sidebar from "@/components/PageComponents/sidebar";
import { Share, Heart, Building } from "lucide-react";
import Navbar from "@/components/Navbar/navbar";

export default function Page() {
  const businessImages = [
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1568992687947-868a62a9f521?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  ];

  const businessOwner = {
    name: "Michael Johnson",
    verified: true,
    rating: 5,
    reviewCount: 56,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    type: "FEATURED BUSINESS",
    memberSince: "April 2018",
  };

  const businessFeatures = [
    "Free consultation for new clients",
    "Certified professionals with 10+ years experience",
    "Flexible scheduling options",
    "Customized solutions for every business",
    "Ongoing support and follow-up services",
    "Satisfaction guarantee on all services",
  ];

  // Sample similar business listings
  const similarBusinesses = [
    {
      id: "b1",
      title: "TechSolutions Consulting",
      price: "Consultation from $99",
      location: "San Francisco, CA",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      featured: true,
    },
    {
      id: "b2",
      title: "Green Cleaning Services",
      price: "Starting at $50/hr",
      location: "Chicago, IL",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: "b3",
      title: "Elite Financial Advisors",
      price: "Free initial consultation",
      location: "New York, NY",
      image:
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: "b4",
      title: "Apex Marketing Strategies",
      price: "Custom packages available",
      location: "Austin, TX",
      image:
        "https://images.unsplash.com/photo-1551135049-8a33b5883817?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col mt-24">
      {/* <Header /> */}
      {/* <Navbar /> */}
      <div className="relative h-80 bg-gray-800 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1568992687947-868a62a9f521?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Johnson Consulting"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Johnson Business Consulting
          </h1>
          <div className="flex items-center">
            <span className="bg-clasifico-red text-white text-xs px-2 py-1 rounded inline-flex items-center mr-2">
              <span className="h-1.5 w-1.5 bg-white rounded-full mr-1"></span>
              Business Consulting
            </span>
          </div>
        </div>
      </div>

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
                      <svg
                        key={i}
                        className="w-4 h-4 text-yellow-400"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                      </svg>
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
                <span className="text-gray-500 text-sm">
                  Consultations from:
                </span>
                <span className="text-clasifico-red font-bold text-xl ml-2">
                  $150.00/hr
                </span>
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

      <main className="flex-grow bg-gray-50 py-8">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ProductDescription />
              <div className="mt-6 ml-6">
                <ImageGallery images={businessImages} />
              </div>
              <div className="mt-6">
                <ProductFeatures features={businessFeatures} />
              </div>
              <div className="mt-6">
                <LocationMap />
              </div>
              <div className="mt-6">
                <SimilarAds ads={similarBusinesses} />
              </div>
            </div>

            <div>
              <SellerCard
                name={businessOwner.name}
                memberSince={businessOwner.memberSince}
                image={businessOwner.image}
                verified={businessOwner.verified}
              />
              <div className="mt-6">
                <Sidebar />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  );
}
