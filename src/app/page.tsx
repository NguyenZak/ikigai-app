"use client";
import HeroSlider from "../components/HeroSlider";
import LetterCard from "../components/LetterCard";
import WhyChooseUs from "../components/WhyChooseUs";
import OurTeam from "../components/OurTeam";
import NewsSlider from "../components/NewsSlider";

import RoomsSlider from "../components/RoomsSlider";
import ServicesSlider from "../components/ServicesSlider";
import CTASection from "../components/CTASection";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8f7f2]">
      {/* Hero Banner Slider */}
      <HeroSlider />

      {/* Thư ngỏ Section */}
      <LetterCard />

      {/* Why Choose Us */}
      <WhyChooseUs />
      {/* Our Team */}
      <OurTeam />

      {/* Services Slider */}
      <ServicesSlider />

       {/* Rooms Slider */}
       <RoomsSlider />

      {/* News Slider */}
      <NewsSlider />

     

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
