"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, Keyboard } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import ContactModal from './ContactModal';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Custom styles to hide default Swiper navigation buttons
const customStyles = `
  .swiper-button-next,
  .swiper-button-prev {
    display: none !important;
  }
  
  .swiper-pagination-bullet {
    background: white !important;
    opacity: 0.5 !important;
  }
  
  .swiper-pagination-bullet-active {
    opacity: 1 !important;
    background: #d11e0f !important;
  }
  
  /* Ensure custom navigation buttons are visible */
  .custom-nav-button {
    display: flex !important;
    opacity: 1 !important;
    visibility: visible !important;
  }
`;

interface Slide {
  type: "image" | "video";
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  overlay: string;
  statistics: {
    value: string;
    label: string;
  }[];
}

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  overlay: string;
  statistics: {
    value: string;
    label: string;
  }[];
  order: number;
  active: boolean;
}

export default function HeroSlider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners');
      if (response.ok) {
        const banners: Banner[] = await response.json();
        
        // Transform banners to slides format
        const transformedSlides: Slide[] = banners
          .filter(banner => banner.active)
          .sort((a, b) => a.order - b.order)
          .map(banner => ({
            type: "image" as const,
            src: banner.image,
            alt: banner.title,
            title: banner.title,
            subtitle: banner.subtitle,
            overlay: banner.overlay,
            statistics: banner.statistics.filter(stat => stat.value && stat.label)
          }));
        
        setSlides(transformedSlides);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      // Fallback to default slides if API fails
      setSlides([
        {
          type: "image" as const,
          src: "/banner/ONSEN 10_4.png",
          alt: "Ikigaivilla Onsen",
          title: "Chào mừng đến với Ikigaivilla",
          subtitle: "Trải nghiệm nghỉ dưỡng sang trọng với dịch vụ đẳng cấp 5 sao",
          overlay: "from-black/30 to-black/30",
          statistics: [
            { value: "50+", label: "Phòng Nghỉ" },
            { value: "1000+", label: "Khách Hài Lòng" },
            { value: "5★", label: "Đánh Giá Trung Bình" }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSlideChange = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  const handleTransitionEnd = () => {
    setIsAnimating(false);
  };

  const handlePrevClick = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNextClick = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  if (loading) {
    return (
      <section className="relative h-screen overflow-hidden bg-gray-100">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative h-screen overflow-hidden bg-gray-100">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Chào mừng đến với Ikigaivilla
            </h1>
            <p className="text-xl text-gray-600">
              Trải nghiệm nghỉ dưỡng sang trọng với dịch vụ đẳng cấp 5 sao
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <style jsx global>{customStyles}</style>
      <section className="relative h-screen overflow-hidden">
        <Swiper
          modules={[Autoplay, Navigation, Pagination, Keyboard]}
          loop={true}
          keyboard={{
            enabled: true,
            onlyInViewport: true,
          }}
          pagination={{
            clickable: true,
            el: '.swiper-pagination',
          }}
          speed={1000}
          className="h-full"
          onSlideChange={handleSlideChange}
          onTransitionEnd={handleTransitionEnd}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={`slide-${index}`} className="relative">
              {/* Background Media */}
              <div className="absolute inset-0">
                {slide.type === "video" ? (
                  <video
                    autoPlay
                    muted
                    loop
                    className="w-full h-full object-cover"
                  >
                    <source src={slide.src} type="video/mp4" />
                  </video>
                ) : (
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                )}
              </div>

              {/* Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlay}`}></div>

              {/* Content - Positioned at bottom left */}
              <div className="relative z-10 h-full flex items-end">
                <div className="max-w-[1440px] mx-auto px-4 md:px-8 w-full pb-16 md:pb-16">
                  <div className="max-w-2xl">
                    {/* Main Heading */}
                    <h1 className={`text-2xl sm:text-xl md:text-xl lg:text-5xl font-bold mb-3 md:mb-6 leading-tight text-white transition-all duration-1000 ease-out transform ${
                      isAnimating ? 'scale-105' : 'scale-100'
                    }`}>
                      {slide.title}
                    </h1>
                    
                    {/* Descriptive Paragraph */}
                    <p className={`text-sm sm:text-base md:text-xl lg:text-xl mb-4 md:mb-8 text-gray-200 leading-relaxed transition-all duration-1000 ease-out delay-300 transform ${
                      isAnimating ? 'scale-105' : 'scale-100'
                    }`}>
                      {slide.subtitle}
                    </p>

                    {/* Call to Action Buttons */}
                    <div className={`flex flex-row gap-2 md:gap-4 mb-6 md:mb-12 transition-all duration-1000 ease-out delay-600 transform ${
                      isAnimating ? 'scale-105' : 'scale-100'
                    }`}>
                      <button
                        onClick={() => setIsContactModalOpen(true)}
                        className="bg-gradient-to-r from-[#d11e0f] to-[#b01a0d] hover:from-[#b01a0d] hover:to-[#8f150a] text-white px-3 md:px-8 py-2 md:py-4 rounded-lg font-semibold text-xs md:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex-1"
                      >
                        Đặt lịch tư vấn
                      </button>
                      <Link
                        href="/about"
                        className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-800 text-white px-3 md:px-8 py-2 md:py-4 rounded-lg font-semibold text-xs md:text-lg transition-all duration-300 transform hover:scale-105 flex-1"
                      >
                        Tìm hiểu thêm
                      </Link>
                    </div>

                    {/* Statistics Section */}
                    {slide.statistics.length > 0 && (
                      <div className={`flex flex-row gap-2 md:gap-8 transition-all duration-1000 ease-out delay-900 transform ${
                        isAnimating ? 'scale-105' : 'scale-100'
                      }`}>
                        {slide.statistics.map((stat, statIndex) => (
                          <div key={`stat-${statIndex}`} className="text-center flex-1">
                            <div className="text-lg md:text-4xl font-bold mb-1 md:mb-2 text-white">
                              {stat.value}
                            </div>
                            <div className="text-xs md:text-sm text-gray-300">
                              {stat.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <button 
          onClick={handlePrevClick}
          className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 md:p-4 rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group z-50 border border-white/30 shadow-lg min-w-[48px] md:min-w-[56px] min-h-[48px] md:min-h-[56px] flex items-center justify-center opacity-100 hover:border-white/60"
        >
          <svg
            className="w-4 h-4 md:w-6 md:h-6 transition-transform duration-300 group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={handleNextClick}
          className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 md:p-4 rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group z-50 border border-white/30 shadow-lg min-w-[48px] md:min-w-[56px] min-h-[48px] md:min-h-[56px] flex items-center justify-center opacity-100 hover:border-white/60"
        >
          <svg
            className="w-4 h-4 md:w-6 md:h-6 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Custom Pagination */}
        <div className="swiper-pagination absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-3 z-20"></div>

        {/* Swipe indicator for mobile */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 md:hidden z-20">
          <div className="text-white/30 text-sm bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
            Vuốt để chuyển slide
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </>
  );
} 