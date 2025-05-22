"use client";
import Navbar from "@/components/Navbar/navbar";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PricingSection = () => {
  const [pricingPlans, setPricingPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPricingPlans = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscription-plans`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch pricing plans");
        }
        const data = await response.json();
        setPricingPlans(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPricingPlans();
  }, []);

  if (loading) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 text-center">
        Loading pricing plans...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  const transformedPlans = pricingPlans.map((plan) => ({
    name: plan.name,
    price: `₹ ${plan.price}`,
    duration: "/ listing",
    features: [
      plan.promotionDays > 0
        ? `${plan.promotionDays} days of promotion`
        : "Basic listing visibility",
      `Keep online for ${plan.durationDays} days`,
      plan.tierType === "FREE"
        ? "Up to 5 images allowed"
        : plan.tierType === "PREMIUM"
        ? "Up to 10 images allowed"
        : "Up to 15 images allowed",
      plan.tierType !== "FREE"
        ? "Featured on the homepage"
        : "Standard search results",
      plan.tierType !== "FREE" ? "Featured in the category" : "",
    ].filter(Boolean),
    featured: plan.tierType === "PREMIUM",
    cta:
      plan.tierType === "FREE"
        ? "Get Started"
        : plan.tierType === "PREMIUM"
        ? "Upgrade Now"
        : "Get Premium+",
  }));

  return (
    <>
      {/* <Navbar /> */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Boost Your Listings
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get more visibility and sell faster with our promotion packages
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {transformedPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-sm overflow-hidden border ${
                  plan.featured
                    ? "border-teal-500 ring-2 ring-teal-200"
                    : "border-gray-200"
                }`}
              >
                {plan.featured && (
                  <div className="bg-teal-500 text-white text-center py-2 font-medium">
                    Most Popular
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {plan.name}
                  </h3>
                  <div className="flex items-end mb-4">
                    <span className="text-3xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-500 ml-1">{plan.duration}</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-teal-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-3 px-4 rounded-lg font-medium ${
                      plan.featured
                        ? "bg-teal-600 hover:bg-teal-700 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    } transition-colors cursor-pointer`}
                    onClick={() => router.push("/create-listing")}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>All plans include our standard listing features and support</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingSection;
