"use client";
import Link from "next/link";
import { useState } from "react";
import ContactModal from "./ContactModal";

interface CTASectionProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  className?: string;
  useModal?: boolean;
}

export default function CTASection({
  title = "Sẵn sàng trải nghiệm?",
  description = "Hãy liên hệ với chúng tôi để được tư vấn chi tiết về các tiện ích và dịch vụ",
  primaryButtonText = "Liên hệ tư vấn",
  primaryButtonLink = "/contact",
  secondaryButtonText = "Xem bảng giá",
  secondaryButtonLink = "/pricing",
  className = "",
  useModal = true
}: CTASectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePrimaryClick = () => {
    if (useModal) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <section className={`py-20 px-4 bg-gradient-to-r from-gray-900 to-gray-800 ${className}`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{title}</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {useModal ? (
              <button
                onClick={handlePrimaryClick}
                className="bg-gradient-to-r from-[#d11e0f] to-[#b01a0d] hover:from-[#b01a0d] hover:to-[#8f150a] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {primaryButtonText}
              </button>
            ) : (
              <Link
                href={primaryButtonLink}
                className="bg-gradient-to-r from-[#d11e0f] to-[#b01a0d] hover:from-[#b01a0d] hover:to-[#8f150a] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {primaryButtonText}
              </Link>
            )}
            <Link
              href={secondaryButtonLink}
              className="border-2 border-white text-white hover:bg-white hover:text-gray-800 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
            >
              {secondaryButtonText}
            </Link>
          </div>
        </div>
      </section>

      <ContactModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
} 