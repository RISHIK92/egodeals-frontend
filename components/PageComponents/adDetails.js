import React from "react";
import { Clock, MapPin, Eye, Phone, Calendar, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdDetails = ({
  title,
  price,
  location,
  category,
  condition,
  postedDate,
  views,
  description,
  specifications,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg card-shadow">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>
            <div className="flex flex-wrap items-center text-sm text-clasifico-darkGray gap-3 mb-2">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{location}</span>
              </div>
              <span className="hidden md:block">•</span>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{postedDate}</span>
              </div>
              <span className="hidden md:block">•</span>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                <span>{views} views</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end">
            <div className="text-3xl font-bold text-clasifico-red">{price}</div>
            <Button className="btn-primary mt-2">
              <Phone className="h-4 w-4 mr-2" />
              Show Contact
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg card-shadow">
        <h2 className="text-xl font-semibold mb-4">Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <span className="text-clasifico-darkGray w-32">Category:</span>
            <span className="font-medium">{category}</span>
          </div>
          <div className="flex items-center">
            <span className="text-clasifico-darkGray w-32">Condition:</span>
            <span className="font-medium">{condition}</span>
          </div>
          <div className="flex items-center">
            <span className="text-clasifico-darkGray w-32">Posted:</span>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-clasifico-darkGray" />
              <span className="font-medium">{postedDate}</span>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-clasifico-darkGray w-32">Ad ID:</span>
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-1 text-clasifico-darkGray" />
              <span className="font-medium">
                CL-{Math.floor(Math.random() * 1000000)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white p-6 rounded-lg card-shadow">
        <h2 className="text-xl font-semibold mb-4">Description</h2>
        <p className="text-clasifico-darkGray leading-relaxed">{description}</p>
      </div>

      {/* Specifications */}
      {Object.keys(specifications).length > 0 && (
        <div className="bg-white p-6 rounded-lg card-shadow">
          <h2 className="text-xl font-semibold mb-4">Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(specifications).map(([key, value]) => (
              <div key={key} className="flex items-center">
                <span className="text-clasifico-darkGray w-40">{key}:</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Safety tips */}
      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <h3 className="text-lg font-semibold mb-2 flex items-center text-yellow-800">
          <Shield className="h-5 w-5 mr-2" />
          Safety Tips
        </h3>
        <ul className="list-disc pl-5 text-yellow-700 space-y-1 text-sm">
          <li>Meet seller in a public place</li>
          <li>Check the item before you buy</li>
          <li>Pay only after inspecting the item</li>
          <li>Never pay in advance or via money transfer services</li>
        </ul>
      </div>
    </div>
  );
};

export default AdDetails;
