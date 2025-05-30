"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 flex flex-col p-6 md:p-10 lg:p-16">
        <div className="flex justify-center lg:justify-start">
          <img
            src="https://res.cloudinary.com/df622sxkk/image/upload/v1748618480/thumb-816x460-logo-657d3fb8b6ed1_aqovvn.jpg"
            alt="egodeals logo"
            className="h-20 absolute top-4 lg:h-20 lg:absolute lg:left-28 lg:top-10"
          />
        </div>

        <div className="flex mx-0 md:mx-0 sm:mx-0 lg:mx-16 flex-col max-w-md mt-28 lg:mt-24">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Login</h1>
          <p className="text-gray-600 mb-8">
            Don't have an account?{" "}
            <a href="/register" className="text-teal-700 hover:underline">
              Register
            </a>
          </p>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
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
                required
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-teal-700 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-600"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a
                  href="/forgot-password"
                  className="text-teal-700 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-700 text-white font-medium py-3 px-4 rounded-md hover:bg-teal-800 transition duration-300 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
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
