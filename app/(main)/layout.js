"use client";

import { useState } from "react";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar/navbar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="pt-20">{children}</main>
      </body>
    </html>
  );
}
