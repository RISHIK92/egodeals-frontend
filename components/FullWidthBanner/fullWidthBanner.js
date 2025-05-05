import { Check } from "lucide-react";

export default function FullWidthBanner({ image }) {
  if (image) {
    return (
      <div className="w-full overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <img
            src={image}
            alt="Promotional Banner"
            className="w-full h-auto max-h-[500px] object-contain"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h2 className="text-3xl font-bold text-white mb-4">
            Post Your Classified Ads
          </h2>
          <p className="text-blue-100 mb-6">
            Reach thousands of potential customers with your classified ads. Our
            platform offers the best exposure for your products and services.
          </p>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="bg-white rounded-full p-1 mr-3">
                <Check className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-white">Easy to use interface</span>
            </div>
            <div className="flex items-center">
              <div className="bg-white rounded-full p-1 mr-3">
                <Check className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-white">Premium ads available</span>
            </div>
            <div className="flex items-center">
              <div className="bg-white rounded-full p-1 mr-3">
                <Check className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-white">24/7 customer support</span>
            </div>
          </div>
          <button className="mt-8 bg-white text-blue-600 hover:bg-blue-50 font-medium px-6 py-3 rounded-full shadow-lg transition-all">
            Post an Ad Now
          </button>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <div className="relative">
            <svg
              className="w-full max-w-md"
              viewBox="0 0 640 360"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.8">
                <path
                  d="M480 50H160C82.1 50 20 112.1 20 190s62.1 140 140 140h320c77.9 0 140-62.1 140-140S557.9 50 480 50z"
                  fill="#ffffff"
                  fillOpacity="0.1"
                />
                <rect
                  x="140"
                  y="90"
                  width="360"
                  height="220"
                  rx="10"
                  fill="#ffffff"
                />
                <rect
                  x="160"
                  y="120"
                  width="320"
                  height="160"
                  rx="5"
                  fill="#e0e7ff"
                />
                <circle cx="320" cy="200" r="60" fill="#3b82f6" />
                <path
                  d="M350 200l-40 30l-20-15"
                  stroke="white"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect
                  x="160"
                  y="290"
                  width="80"
                  height="10"
                  rx="5"
                  fill="#3b82f6"
                />
                <rect
                  x="250"
                  y="290"
                  width="120"
                  height="10"
                  rx="5"
                  fill="#e0e7ff"
                />
                <rect
                  x="400"
                  y="290"
                  width="80"
                  height="10"
                  rx="5"
                  fill="#e0e7ff"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
