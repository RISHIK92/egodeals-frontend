import React from "react";
import { Button } from "@/components/ui/button";
import { Search, Building, MapPin, Phone } from "lucide-react";

const Sidebar = () => {
  const categories = [
    "All Categories",
    "Business Consulting",
    "Legal Services",
    "Marketing & PR",
    "Financial Services",
    "IT & Software",
    "Health & Wellness",
    "Education & Training",
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-md shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Contact Business</h2>
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-clasifico-red"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-clasifico-red"
            />
          </div>
          <div>
            <input
              type="tel"
              placeholder="Your Phone"
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-clasifico-red"
            />
          </div>
          <div>
            <textarea
              placeholder="Your Message"
              rows={4}
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-clasifico-red"
            ></textarea>
          </div>
          <Button className="w-full bg-clasifico-red hover:bg-opacity-90">
            Send Message
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-md shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Business Hours</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Monday - Friday:</span>
            <span className="font-medium">9:00 AM - 6:00 PM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Saturday:</span>
            <span className="font-medium">10:00 AM - 4:00 PM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Sunday:</span>
            <span className="font-medium">Closed</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <Phone className="h-5 w-5 text-clasifico-red mr-2" />
            <span className="font-medium">+1 (555) 123-4567</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
