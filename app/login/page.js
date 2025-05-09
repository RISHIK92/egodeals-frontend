"use client";

import { useState } from "react";
import Image from "next/image";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 flex flex-col p-6 md:p-10 lg:p-16">
        <div className="flex justify-center lg:justify-start">
          <img
            src="https://res.cloudinary.com/df622sxkk/image/upload/v1746742290/0c8eb74fb6f15192bef2770ba22d1524669d558f_xzk58h.png"
            alt="egodeals logo"
            className="h-48 absolute -top-12 lg:h-48 lg:absolute lg:left-28 lg:top-1"
          />
        </div>

        <div className="flex mx-0 md:mx-0 sm:mx-0 lg:mx-16 flex-col max-w-md mt-16 lg:mt-48">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Welcome Back!
          </h1>
          <p className="text-gray-600 mb-8">
            Don't have an Account?{" "}
            <a href="/register" className="text-teal-700 hover:underline">
              Register
            </a>
          </p>

          <div className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-teal-700 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>
                <div>
                  <a
                    href="/forgot-password"
                    className="text-sm text-teal-700 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-teal-700 text-white font-medium py-3 px-4 rounded-md hover:bg-teal-800 transition duration-300"
            >
              Login
            </button>
          </div>
        </div>
      </div>

      <div className="hidden md:block w-1/2 bg-gradient-to-b from-[#EC5944] to-[#FFAEA2] relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="w-full">
            <div>
              <img src="https://res.cloudinary.com/df622sxkk/image/upload/v1746815360/9afb6fa4e27fcfedfec5a0de90b512f30fcc25d9_xugg9g.png" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
