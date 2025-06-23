"use client";
import { Suspense } from "react";
import ProfessionalListings from "./proffesionalListing";
import MiddleBanner from "@/components/FullWidthBanner/middleBanner";
import CategoryBanner from "@/components/FullWidthBanner/categoryBanner";

export default function BusinessesWrapper() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <CategoryBanner />
        <ProfessionalListings />
      </Suspense>
    </>
  );
}
