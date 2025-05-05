"use client";

import React, { useState } from "react";

const ImageGallery = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div>
      <div className="relative aspect-video bg-white rounded-md overflow-hidden mb-2">
        <img
          src={images[currentImageIndex]}
          alt="Product image"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex space-x-2 overflow-x-auto">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`flex-shrink-0 w-20 h-16 rounded-md overflow-hidden ${
              index === currentImageIndex
                ? "ring-2 ring-clasifico-red"
                : "opacity-70 hover:opacity-100"
            }`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
