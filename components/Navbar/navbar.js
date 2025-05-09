"use client";
import { useState } from "react";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [activeItem, setActiveItem] = useState("Home");
  const router = useRouter();

  const navItems = ["Home", "Businesses", "Pricing", "Contact"];

  const handleClick = (item) => {
    setActiveItem(item);
    const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
    router.push(path);
  };

  return (
    <div className="flex justify-between items-center h-20 px-6 lg:px-12 bg-white border-b border-gray-100 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center">
        <div
          className="h-48 mt-2 w-auto cursor-pointer"
          onClick={() => router.push("/")}
        >
          <img
            src="https://res.cloudinary.com/df622sxkk/image/upload/v1746742290/0c8eb74fb6f15192bef2770ba22d1524669d558f_xzk58h.png"
            alt="egodeals logo"
            className="h-full object-contain"
          />
        </div>
      </div>

      <div className="hidden md:flex gap-8">
        {navItems.map((item) => (
          <div
            key={item}
            className="flex items-center cursor-pointer"
            onClick={() => handleClick(item)}
          >
            <span
              className={`${
                activeItem === item ? "text-teal-700" : "text-gray-700"
              } hover:text-teal-700 font-medium`}
            >
              {item}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          className="text-teal-700 font-medium hover:text-teal-800 cursor-pointer"
          onClick={() => router.push("/login")}
        >
          Login
        </button>
        <button className="bg-[#186667] hover:bg-teal-800 text-white px-5 py-2 rounded-full flex items-center">
          <Edit className="h-4 w-4 mr-2" />
          List your business
        </button>
      </div>
    </div>
  );
}
