"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface RoomItem {
  id: number;
  name: string;
  title: string;
  description: string;
  beds: string;
  area: string;
  price: string;
  floor: string;
  rooms: string;
  view: string;
  slug: string;
  features: string;
  images: string;
  status: string;
}

export default function RoomsSlider() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [roomsData, setRoomsData] = useState<RoomItem[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Fetch rooms data
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/rooms?page=1&limit=10');
        
        if (!response.ok) {
          throw new Error('Failed to fetch rooms');
        }
        
        const data = await response.json();
        setRoomsData(data.rooms || []);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
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

  const nextSlide = () => {
    if (roomsData.length === 0) return;
    setCurrentIndex((prevIndex) => 
      prevIndex + 4 >= roomsData.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    if (roomsData.length === 0) return;
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.max(0, roomsData.length - 4) : prevIndex - 1
    );
  };

  const getVisibleRooms = () => {
    const visibleRooms = [];
    // On mobile, show 1 card, on tablet show 2, on desktop show 4
    const cardsToShow = isClient ? (windowWidth < 768 ? 1 : windowWidth < 1024 ? 2 : 4) : 1;
    
    for (let i = 0; i < cardsToShow; i++) {
      const index = (currentIndex + i) % roomsData.length;
      if (roomsData[index]) {
        visibleRooms.push(roomsData[index]);
      }
    }
    return visibleRooms;
  };

  return (
    <section ref={sectionRef} className="py-20 px-4 bg-gradient-to-b from-[#f8f7f2] to-white">
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ease-out transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Khám Phá Các Hạng Phòng
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trải nghiệm các hạng phòng đẳng cấp với thiết kế độc đáo và tiện ích hiện đại
          </p>
        </div>

        {/* Rooms Slider */}
        <div className={`relative transition-all duration-1000 ease-out delay-300 transform ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`} style={{ willChange: 'transform, opacity' }}>
          {/* Navigation Buttons */}
          {!loading && roomsData.length > 4 && (
            <>
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
            </>
          )}

          {/* Rooms Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:px-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <article key={`loading-${index}`} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="relative aspect-square bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                </article>
              ))
            ) : getVisibleRooms().map((room, index) => {
              // Images are already parsed by the API
              const images = Array.isArray(room.images) ? room.images : [];
              console.log('Room images:', room.name, images); // Debug log

              return (
                <article 
                  key={`room-slider-${room.id}-${currentIndex}-${index}`} 
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-800 ease-out transform hover:-translate-y-2 ${
                    isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                  style={{ 
                    transitionDelay: `${0.5 + index * 0.2}s`,
                    willChange: 'transform, opacity'
                  }}
                >
                  <div className="relative aspect-square">
                    <Image
                      src={images.length > 0 ? images[0] : '/images/placeholder.jpg'}
                      alt={room.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        console.error('Image load error for:', room.name, images[0]);
                        // Fallback to placeholder
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholder.jpg';
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#d11e0f] text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {room.beds}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 
                      className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 cursor-pointer hover:text-[#d11e0f] transition-colors"
                      onClick={() => router.push(`/rooms/${room.slug}`)}
                    >
                      {room.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {room.description}
                    </p>
                    
                    {/* Room Specifications */}
                    <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                      <div>
                        <span className="font-semibold text-gray-700">Diện tích:</span>
                        <p className="text-gray-600">{room.area}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Tầng:</span>
                        <p className="text-gray-600">{room.floor}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Số phòng:</span>
                        <p className="text-gray-600">{room.rooms}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">View:</span>
                        <p className="text-gray-600">{room.view}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{room.price}</span>
                      <button 
                        onClick={() => router.push(`/rooms/${room.slug}`)}
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
            onClick={() => router.push('/rooms')}
            className="bg-[#d11e0f] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#b01a0d] transition-colors duration-300 hover:scale-105"
          >
            Xem tất cả phòng
          </button>
        </div>
      </div>
    </section>
  );
} 