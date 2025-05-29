import Navbar from "@/components/Navbar/navbar";
import HeroSection from "@/components/HeroSection/heroSection";
import Image from "next/image";
import CategorySection from "@/components/CategorySection/categorySection";
import FullWidthBanner from "@/components/FullWidthBanner/fullWidthBanner";
import RandomListingsSection from "@/components/CategorySection/randomSection";
import OfferZoneSection from "@/components/CategorySection/offerZone";
import AdminFullWidthBanner from "@/components/AdminBanner/adminFullWidthBanner";
import PopupBannerModal from "@/components/AdminBanner/PopupBanner";

export default function Home() {
  return (
    <>
      {/* <Navbar /> */}
      <HeroSection />
      <FullWidthBanner />
      {/* <FullWidthBanner
      // image={"https://egodeals.com/data/banners/1737541263.png"}
      /> */}
      <PopupBannerModal />
      <OfferZoneSection />
      <CategorySection />
      <FullWidthBanner />
      <RandomListingsSection />
    </>
  );
}
