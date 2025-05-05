import React from "react";
import { Button } from "@/components/ui/button";
import { Phone, User, Clock, Shield, Flag } from "lucide-react";

const SellerCard = ({ name, memberSince, image, phone, verified = false }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden card-shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Seller Information</h2>
        <div className="flex items-center mb-4">
          <div className="h-16 w-16 rounded-full bg-clasifico-lightGray overflow-hidden mr-4 flex-shrink-0">
            {image ? (
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="h-8 w-8 text-clasifico-darkGray" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center">
              <h3 className="font-semibold">{name}</h3>
              {verified && (
                <div className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </div>
              )}
            </div>
            <div className="text-sm text-clasifico-darkGray flex items-center mt-1">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>Member since {memberSince}</span>
            </div>
          </div>
        </div>

        {phone ? (
          <a
            href={`tel:${phone}`}
            className="btn-primary w-full justify-center mb-3 flex items-center"
          >
            <Phone className="h-4 w-4 mr-2" />
            {phone}
          </a>
        ) : (
          <Button className="btn-primary w-full justify-center mb-3">
            <Phone className="h-4 w-4 mr-2" />
            Show Contact
          </Button>
        )}

        <Button
          variant="outline"
          className="btn-outline w-full justify-center flex items-center"
        >
          Message Seller
        </Button>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <button className="text-sm text-clasifico-darkGray hover:text-clasifico-red flex items-center justify-center w-full">
            <Flag className="h-4 w-4 mr-1" />
            Report this ad
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerCard;
