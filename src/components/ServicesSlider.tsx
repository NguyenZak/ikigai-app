"use client";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface ServiceItem {
  id: string;
  name: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  features: string[];
}

interface ServiceZone {
  id: number;
  zoneId: string;
  name: string;
  title: string;
  description: string;
  images: string[];
  features: string[];
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ServicesSlider() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [serviceZones, setServiceZones] = useState<ServiceZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageIndices, setImageIndices] = useState<{ [key: string]: number }>({});
  const sectionRef = useRef<HTMLElement>(null);

  const fetchServiceZones = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/service-zones');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch service zones: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.serviceZones && data.serviceZones.length > 0) {
        setServiceZones(data.serviceZones);
        // Initialize image indices for each service
        const initialIndices: { [key: string]: number } = {};
        data.serviceZones.forEach((zone: ServiceZone) => {
          initialIndices[zone.zoneId] = 0;
        });
        setImageIndices(initialIndices);
      } else {
        setServiceZones([]);
      }
    } catch (error) {
      console.error('Error fetching service zones:', error);
      setServiceZones([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsVisible(true);
    fetchServiceZones();
  }, [fetchServiceZones]);

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

  // Convert ServiceZone to ServiceItem format for the slider
  const servicesData: ServiceItem[] = serviceZones.map(zone => ({
    id: zone.zoneId,
    name: zone.name,
    title: zone.title,
    description: zone.description,
    images: zone.images.length > 0 ? zone.images : ["/banner/ONSEN 10_4.png"], // Use all images or fallback
    category: "Tiện ích",
    features: zone.features
  }));

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

  const nextImage = (serviceId: string, totalImages: number) => {
    setImageIndices(prev => ({
      ...prev,
      [serviceId]: (prev[serviceId] || 0 + 1) % totalImages
    }));
  };

  const prevImage = (serviceId: string, totalImages: number) => {
    setImageIndices(prev => ({
      ...prev,
      [serviceId]: prev[serviceId] === 0 ? totalImages - 1 : (prev[serviceId] || 0) - 1
    }));
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

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-b from-white to-[#f8f7f2]">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d11e0f] mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  // Don't render if no service zones
  if (serviceZones.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="py-20 px-4 bg-gradient-to-b from-white to-[#f8f7f2]">
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ease-out transform ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`} style={{ willChange: 'transform, opacity' }}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Tiện Ích Đặc Quyền
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá các tiện ích đẳng cấp và dịch vụ chuyên nghiệp tại Ikigai Villa
          </p>
        </div>

        {/* Services Slider */}
        <div className={`relative transition-all duration-1000 ease-out delay-300 transform ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`} style={{ willChange: 'transform, opacity' }}>
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
            {getVisibleServices().map((service, index) => {
              const currentImageIndex = imageIndices[service.id] || 0;
              const totalImages = service.images.length;
              
              return (
                <article 
                  key={service.id} 
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-800 ease-out transform hover:-translate-y-2 ${
                    isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                  style={{ 
                    transitionDelay: `${0.5 + index * 0.2}s`,
                    willChange: 'transform, opacity'
                  }}
                >
                  <div className="relative h-48">
                    <Image
                      src={service.images[currentImageIndex]}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-[#d11e0f] text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {service.category}
                      </span>
                    </div>

                    {/* Image Navigation for multiple images */}
                    {totalImages > 1 && (
                      <>
                        {/* Image Counter */}
                        <div className="absolute top-4 right-4 z-10">
                          <span className="bg-black/50 text-white px-2 py-1 rounded text-xs font-semibold">
                            {currentImageIndex + 1}/{totalImages}
                          </span>
                        </div>

                        {/* Navigation Arrows */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            prevImage(service.id, totalImages);
                          }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-[#d11e0f] hover:text-white text-gray-700 p-2 rounded-full shadow transition-all duration-300 hover:scale-110 z-10"
                          aria-label="Previous Image"
                        >
                          <ChevronLeftIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            nextImage(service.id, totalImages);
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-[#d11e0f] hover:text-white text-gray-700 p-2 rounded-full shadow transition-all duration-300 hover:scale-110 z-10"
                          aria-label="Next Image"
                        >
                          <ChevronRightIcon className="w-4 h-4" />
                        </button>

                        {/* Image Dots Indicator */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 z-10">
                          {service.images.map((_, dotIndex) => (
                            <button
                              key={dotIndex}
                              onClick={(e) => {
                                e.stopPropagation();
                                setImageIndices(prev => ({
                                  ...prev,
                                  [service.id]: dotIndex
                                }));
                              }}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                dotIndex === currentImageIndex 
                                  ? 'bg-white' 
                                  : 'bg-white/50 hover:bg-white/75'
                              }`}
                              aria-label={`Go to image ${dotIndex + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
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
              );
            })}
          </div>
        </div>

        {/* View All Button */}
        <div className={`text-center mt-12 transition-all duration-800 ease-out transform ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`} style={{ 
          transitionDelay: '1.3s',
          willChange: 'transform, opacity'
        }}>
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