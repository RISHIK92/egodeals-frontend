"use client";

import { useState, useEffect } from "react";
import {
  Tag,
  Gift,
  Percent,
  Store,
  Lock,
  LogIn,
  Eye,
  EyeOff,
  Sparkles,
  Clock,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function OfferZoneSection() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [offers, setOffers] = useState([]);
  const router = useRouter();

  // Color patterns that repeat every 6 offers
  const colorPatterns = [
    {
      color: "bg-purple-50 text-purple-500",
      borderColor: "border-purple-200",
    },
    {
      color: "bg-cyan-50 text-cyan-500",
      borderColor: "border-cyan-200",
    },
    {
      color: "bg-red-50 text-red-500",
      borderColor: "border-red-200",
    },
    {
      color: "bg-rose-50 text-rose-500",
      borderColor: "border-rose-200",
    },
    {
      color: "bg-amber-50 text-amber-500",
      borderColor: "border-amber-200",
    },
    {
      color: "bg-yellow-50 text-yellow-500",
      borderColor: "border-yellow-200",
    },
  ];

  // Fetch offers from backend
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/offer-zone`
        );
        if (!response.ok) {
        }
        const data = await response.json();

        // Add color patterns to offers
        const offersWithColors = data.data.map((offer, index) => ({
          ...offer,
          ...colorPatterns[index % 6],
        }));

        setOffers(offersWithColors);
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };

    fetchOffers();
  }, []);

  // Simulate authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/check-auth`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Auth check failed");
        }

        const data = await response.json();
        setIsLoggedIn(data);
      } catch (error) {
        console.error("Authentication error:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleOfferClick = (e, offer) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setShowLoginPrompt(true);
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const OfferCard = ({ offer, index }) => (
    <div
      key={offer.id}
      className="group relative cursor-pointer"
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      onClick={(e) => handleOfferClick(e, offer)}
    >
      <div
        className={`relative z-10 bg-white rounded-2xl border ${
          offer.borderColor
        } overflow-hidden transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg ${
          hoveredIndex === index ? "transform -translate-y-2" : ""
        } h-full`}
      >
        <div className="p-6 relative z-10">
          {/* Header with discount */}
          <div className="flex items-center justify-between mb-5">
            <div
              className={`${
                offer.color
              } rounded-full p-4 transition-transform duration-300 ease-in-out ${
                hoveredIndex === index ? "scale-110" : ""
              }`}
            >
              <Gift className="w-6 h-6" />
            </div>
            <div className="text-right">
              <div
                className={`text-2xl font-bold ${offer.color.split(" ")[1]}`}
              >
                {offer.discount}
              </div>
              {offer.rating && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {offer.rating}
                </div>
              )}
            </div>
          </div>

          {/* Vendor name and category */}
          <div className="mb-4">
            {isLoggedIn ? (
              <div className="transition-all duration-300 transform">
                <h3 className="font-semibold text-gray-900 text-base mb-2 flex items-center gap-2">
                  <Store className="w-4 h-4 text-gray-600" />
                  {offer.vendorName}
                </h3>
                {offer.category && (
                  <p className="text-gray-600 text-sm">{offer.category}</p>
                )}
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse blur-sm"></div>
                <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-lg p-3 border-2 border-dashed border-gray-300">
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <Lock className="w-4 h-4" />
                    <span className="font-medium text-sm">Login to View</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {offer.description && (
            <p className="text-gray-600 mb-4 text-sm">{offer.description}</p>
          )}

          {/* Promo code */}
          <div className="mb-4">
            {isLoggedIn ? (
              <div className="bg-gray-50 rounded-lg p-3 border border-dashed border-gray-300 transition-all duration-300 hover:border-[#186667] hover:bg-[#186667]/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">PROMO CODE</p>
                    <p className="font-mono font-medium text-base text-[#186667] tracking-wider">
                      {offer.promoCode}
                    </p>
                  </div>
                  <button
                    className="bg-[#186667]/10 hover:bg-[#186667]/20 text-[#186667] p-2 rounded-lg transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(offer.promoCode);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="bg-gray-100 rounded-lg p-3 border border-dashed border-gray-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse opacity-50"></div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">PROMO CODE</p>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-5 bg-gray-300 rounded animate-pulse blur-sm"></div>
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Valid until */}
          {offer.validUntil && (
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-auto">
              <Clock className="w-4 h-4" />
              Valid until{" "}
              {new Date(offer.validUntil).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          )}

          {/* Login overlay for non-authenticated users */}
          {!isLoggedIn && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl">
              <div className="text-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
                <Lock className="w-8 h-8 text-[#186667] mx-auto mb-2" />
                <p className="text-[#186667] font-semibold mb-2">
                  Login Required
                </p>
                <p className="text-gray-500 text-sm">
                  Sign in to view exclusive offers
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isLoading || offers.length === 0) {
    return (
      <div className="py-24 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block rounded-full bg-[#186667]/10 px-4 py-1.5 text-sm font-medium text-[#186667] mb-4 animate-pulse">
              LOADING OFFERS...
            </div>
            <div className="h-12 bg-gray-200 rounded-lg mx-auto max-w-md animate-pulse mb-6"></div>
            <div className="h-6 bg-gray-100 rounded mx-auto max-w-lg animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse"
              >
                <div className="h-16 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const initialOffers = offers.slice(0, 6);
  const remainingOffers = offers.slice(6);

  return (
    <div className="py-24 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#186667]/10 px-4 py-1.5 text-sm font-medium text-[#186667] mb-4">
            <Gift className="w-4 h-4" />
            EXCLUSIVE OFFERS
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Special Offer Zone
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Unlock amazing discounts and exclusive deals from our premium
            vendors
          </p>
        </div>

        {/* Initial 6 offers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialOffers.map((offer, index) => (
            <OfferCard key={offer.id} offer={offer} index={index} />
          ))}
        </div>

        {/* View More Button */}
        {remainingOffers.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowMore(!showMore)}
              className="inline-flex items-center gap-2 bg-[#186667] text-white px-6 py-3 rounded-full font-semibold shadow-sm hover:shadow-lg transform hover:scale-105 transition-all duration-300 hover:bg-[#186667]/90"
            >
              {showMore ? (
                <>
                  <ChevronUp className="w-5 h-5" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-5 h-5" />
                  View More Offers ({remainingOffers.length})
                </>
              )}
            </button>
          </div>
        )}

        {/* Additional offers in scrollable container */}
        {showMore && remainingOffers.length > 0 && (
          <div
            className="mt-8 max-h-[800px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#186667]/20 scrollbar-track-gray-100 rounded-lg"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#186667 #f3f4f6",
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pr-2">
              {remainingOffers.map((offer, index) => (
                <OfferCard key={offer.id} offer={offer} index={index + 6} />
              ))}
            </div>
          </div>
        )}

        {/* Call to action */}
        <div className="text-center mt-12">
          {!isLoggedIn ? (
            <button
              onClick={() => setShowLoginPrompt(true)}
              className="inline-flex items-center gap-2 bg-[#186667] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-sm hover:shadow-lg transform hover:scale-105 transition-all duration-300 hover:bg-[#186667]/90"
            >
              <LogIn className="w-5 h-5" />
              Login to Access All Offers
              <Sparkles className="w-5 h-5" />
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300 scale-100 opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="bg-[#186667]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-[#186667]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Login Required
              </h3>
              <p className="text-gray-600 mb-6">
                Sign in to your account to access exclusive promo codes and
                special offers from our verified vendors.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleLogin}
                  className="flex-1 bg-[#186667] text-white py-3 px-6 rounded-full font-semibold hover:bg-[#186667]/90 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  Login Now
                </button>
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-full font-semibold hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
