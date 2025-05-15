"use client";
import { Suspense } from "react";
import ProfessionalListings from "./proffesionalListing";

export default function BusinessesWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfessionalListings />
    </Suspense>
  );
}
