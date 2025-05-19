"use client";
import { Suspense } from "react";
import ProfessionalListings from "./proffesionalListing";
import FullWidthBanner from "@/components/FullWidthBanner/fullWidthBanner";

export default function BusinessesWrapper() {
  return (
    <>
      <FullWidthBanner />
      <Suspense fallback={<div>Loading...</div>}>
        <ProfessionalListings />
      </Suspense>
    </>
  );
}
