import React from "react";

const LocationMap = () => {
  return (
    <div className="bg-white rounded-md shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Location</h2>
      <div className="flex items-center mb-2">
        <svg
          className="h-4 w-4 text-gray-500 mr-1"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="text-sm">
          <span className="font-semibold">Hyderabad</span>
          <span className="text-gray-500 ml-1">India</span>
        </div>
        <a href="#" className="text-blue-500 text-sm ml-auto">
          Directions
        </a>
      </div>
      <div className="h-64 w-full bg-gray-200 rounded-md relative overflow-hidden">
        <iframe
          className="absolute inset-0 w-full h-full"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.150948649724!2d78.47444477512215!3d17.385044588059845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb973b3c8b4dff%3A0x36a81b6189c3d5e5!2sHyderabad%2C%20Telangana%2C%20India!5e0!3m2!1sen!2sin!4v1684195576872!5m2!1sen!2sin"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
      <div className="text-xs text-gray-500 mt-2">
        <a href="#" className="mr-2">
          View larger map
        </a>
        <div className="inline-block">
          <span className="mr-2">Keyboard shortcuts</span>
          <span className="mr-2">Map data ©2023 Google</span>
          <span className="mr-2">Terms</span>
          <span>Report a map error</span>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;
