"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface ServiceItem {
  id: string;
  name: string;
  title: string;
  description: string;
  image: string;
  category: string;
  features: string[];
}

export default function ServicesSlider() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsClient(true);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Intersection Observer cho animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const servicesData: ServiceItem[] = [
    {
      id: "onsen",
      name: "Khu Onsen Ngoài Trời",
      title: "Khu Onsen Ngoài Trời",
      description: "Trải nghiệm tắm khoáng nóng ngoài trời chuẩn Nhật Bản, thư giãn giữa thiên nhiên, giúp phục hồi năng lượng và cân bằng cơ thể.",
      image: "/banner/ONSEN 10_4.png",
      category: "Spa & Wellness",
      features: [
        "Nước khoáng nóng tự nhiên",
        "Không gian ngoài trời xanh mát",
        "Bồn tắm khoáng, phòng xông hơi",
        "Dịch vụ spa thư giãn"
      ]
    },
    {
      id: "lobby-library",
      name: "Sảnh Lễ Tân & Thư Viện",
      title: "Sảnh Lễ Tân & Thư Viện",
      description: "Không gian đón tiếp sang trọng, kết hợp thư viện yên tĩnh với hàng ngàn đầu sách, lý tưởng cho việc đọc sách, làm việc và thư giãn.",
      image: "/banner/THU VIEN 8_4.png",
      category: "Tiện ích",
      features: [
        "Sảnh lễ tân sang trọng",
        "Thư viện với hơn 10,000 đầu sách",
        "Không gian làm việc chung",
        "Cà phê và trà miễn phí"
      ]
    },
    {
      id: "restaurant",
      name: "Khu Vực Nhà Hàng",
      title: "Khu Vực Nhà Hàng",
      description: "Nhà hàng phục vụ ẩm thực đa dạng, không gian ấm cúng, thực đơn phong phú từ món Việt đến món Âu, nguyên liệu tươi ngon mỗi ngày.",
      image: "/banner/CONG CHINH 2_3.png",
      category: "Ẩm thực",
      features: [
        "Ẩm thực Việt & Quốc tế",
        "Không gian riêng tư & chung",
        "Nguyên liệu hữu cơ, tươi mới",
        "Phục vụ chuyên nghiệp"
      ]
    },
    {
      id: "wellness",
      name: "Chăm Sóc Sức Khoẻ & Vật Lý Trị Liệu",
      title: "Chăm Sóc Sức Khoẻ & Vật Lý Trị Liệu",
      description: "Dịch vụ chăm sóc sức khoẻ toàn diện: massage, vật lý trị liệu, yoga, thiền, giúp phục hồi thể chất và tinh thần.",
      image: "/banner/CONG PHU 4_4.png",
      category: "Spa & Wellness",
      features: [
        "Massage trị liệu chuyên sâu",
        "Phòng tập yoga & thiền",
        "Chuyên gia vật lý trị liệu",
        "Không gian yên tĩnh, riêng tư"
      ]
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      return prevIndex + 1 >= servicesData.length ? 0 : prevIndex + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const cardsToShow = isClient ? (windowWidth < 768 ? 1 : windowWidth < 1024 ? 2 : 4) : 1;
      return prevIndex === 0 ? Math.max(0, servicesData.length - cardsToShow) : prevIndex - 1;
    });
  };

  const getVisibleServices = () => {
    const visibleServices = [];
    // On mobile, show 1 card, on tablet show 2, on desktop show 4
    const cardsToShow = isClient ? (windowWidth < 768 ? 1 : windowWidth < 1024 ? 2 : 4) : 1;
    
    for (let i = 0; i < cardsToShow; i++) {
      const index = (currentIndex + i) % servicesData.length;
      visibleServices.push(servicesData[index]);
    }
    return visibleServices;
  };

  return (
    <section ref={sectionRef} className="py-20 px-4 bg-gradient-to-b from-white to-[#f8f7f2]">
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ease-out transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Tiện Ích Đặc Quyền
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá các tiện ích đẳng cấp và dịch vụ chuyên nghiệp tại Ikigai Villa
          </p>
        </div>

        {/* Services Slider */}
        <div className={`relative transition-all duration-1000 ease-out delay-300 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-[#d11e0f] hover:text-white text-[#d11e0f] p-3 rounded-full shadow transition-all duration-300 hover:scale-110 touch-manipulation z-30"
            aria-label="Previous"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-[#d11e0f] hover:text-white text-[#d11e0f] p-3 rounded-full shadow transition-all duration-300 hover:scale-110 touch-manipulation z-30"
            aria-label="Next"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>

          {/* Services Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:px-8">
            {getVisibleServices().map((service, index) => (
              <article 
                key={service.id} 
                className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-800 ease-out transform hover:-translate-y-2 ${
                  isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
                }`}
                style={{ transitionDelay: `${0.5 + index * 0.2}s` }}
              >
                <div className="relative h-48">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#d11e0f] text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {service.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 
                    className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 cursor-pointer hover:text-[#d11e0f] transition-colors"
                    onClick={() => router.push(`/services?zone=${service.id}`)}
                  >
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {service.description}
                  </p>
                  
                  {/* Service Features */}
                  <div className="space-y-2 mb-4">
                    {service.features.slice(0, 2).map((feature, idx) => (
                      <div key={`service-feature-${idx}`} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-[#d11e0f] rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-600 text-xs line-clamp-1">{feature}</span>
                      </div>
                    ))}
                    {service.features.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{service.features.length - 2} tiện ích khác
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Miễn phí</span>
                    <button 
                      onClick={() => router.push(`/services?zone=${service.id}`)}
                      className="text-[#d11e0f] font-semibold hover:underline text-sm cursor-pointer"
                    >
                      Xem chi tiết →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className={`text-center mt-12 transition-all duration-800 ease-out transform ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
        }`} style={{ transitionDelay: '1.3s' }}>
          <button 
            onClick={() => router.push('/services')}
            className="bg-[#d11e0f] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#b01a0d] transition-colors duration-300 hover:scale-105"
          >
            Xem tất cả tiện ích
          </button>
        </div>
      </div>
    </section>
  );
} 