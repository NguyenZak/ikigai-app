"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { useSearchParams } from "next/navigation";
import CTASection from "./CTASection";

interface Room {
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
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface RoomZone {
  id: string;
  name: string;
  title: string;
  description: string;
  images: string[];
  beds: string;
  area: string;
  price: string;
  floor: string;
  rooms: string;
  view: string;
  features: string[];
}

export default function Rooms() {
  const searchParams = useSearchParams();
  const [activeZone, setActiveZone] = useState("hoa-hong");
  const [isVisible, setIsVisible] = useState(false);
  
  // Add pagination and data fetching state
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const zone = searchParams.get('zone');
    if (zone) {
      setActiveZone(zone);
    }
  }, [searchParams]);

  // Add data fetching effect
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/rooms?page=${currentPage}&limit=6`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch rooms');
        }
        
        const data = await response.json();
        setRooms(data.rooms);
        setPagination(data.pagination);
      } catch (error) {
        setError('Failed to load rooms');
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [currentPage]);

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const roomZones: RoomZone[] = [
    {
      id: "hoa-hong",
      name: "IKIGAI HOA HỒNG",
      title: "IKIGAI HOA HỒNG",
      description: "1 giường (Double twin) 1 phòng duy nhất (phòng ngủ, wc, bàn trà, sofa tiếp khách....)",
      images: [
        "/banner/THU VIEN 8_4.png",
        "/banner/ONSEN 10_4.png",
        "/banner/CONG CHINH 2_3.png",
        "/banner/CONG PHU 4_4.png"
      ],
      beds: "1 giường (Double twin)",
      area: "50m²",
      price: "Liên hệ",
      floor: "4",
      rooms: "1",
      view: "Vườn Nhật",
      features: [
        "Phòng ngủ riêng biệt",
        "WC riêng",
        "Bàn trà",
        "Sofa tiếp khách",
        "View vườn Nhật tuyệt đẹp"
      ]
    },
    {
      id: "hoa-dao",
      name: "IKIGAI HOA ĐÀO (PHÒNG C)",
      title: "IKIGAI HOA ĐÀO (PHÒNG C)",
      description: "Phòng nghỉ ấm cúng với WC chung, phù hợp cho du khách muốn trải nghiệm không gian cộng đồng.",
      images: [
        "/banner/ONSEN 10_4.png",
        "/banner/THU VIEN 8_4.png",
        "/banner/CONG PHU 4_4.png",
        "/banner/PCTT 2_2.png"
      ],
      beds: "1 giường (Double twin)",
      area: "13m²/phòng",
      price: "Liên hệ",
      floor: "2-3",
      rooms: "2",
      view: "Vườn Nhật",
      features: [
        "WC chung",
        "Bàn trà",
        "Không gian ấm cúng",
        "View vườn Nhật"
      ]
    },
    {
      id: "hoa-mai",
      name: "IKIGAI HOA MAI (PHÒNG A,B)",
      title: "IKIGAI HOA MAI (PHÒNG A,B)",
      description: "Phòng rộng rãi với 2 giường, thiết kế hiện đại, view hướng núi tuyệt đẹp.",
      images: [
        "/banner/CONG CHINH 2_3.png",
        "/banner/ONSEN 10_4.png",
        "/banner/THU VIEN 8_4.png",
        "/banner/CONG PHU 4_4.png"
      ],
      beds: "2 giường (Double twin)",
      area: "13m² - 17m²",
      price: "Liên hệ",
      floor: "2-3",
      rooms: "6",
      view: "Núi",
      features: [
        "WC chung",
        "Không gian rộng rãi",
        "View núi tuyệt đẹp",
        "Thiết kế hiện đại"
      ]
    },
    {
      id: "huong-duong",
      name: "IKIGAI HƯỚNG DƯƠNG (PHÒNG C)",
      title: "IKIGAI HƯỚNG DƯƠNG (PHÒNG C)",
      description: "Phòng lớn với 3 giường, không gian lý tưởng cho nhóm bạn hoặc gia đình.",
      images: [
        "/banner/CONG PHU 4_4.png",
        "/banner/THU VIEN 8_4.png",
        "/banner/ONSEN 10_4.png",
        "/banner/PCTT 2_2.png"
      ],
      beds: "3 giường (3 twin)",
      area: "22m²",
      price: "Liên hệ",
      floor: "2-3",
      rooms: "2",
      view: "Vườn Nhật",
      features: [
        "WC chung",
        "Không gian rộng rãi",
        "Phù hợp nhóm bạn",
        "View vườn Nhật"
      ]
    },
    {
      id: "hoa-phuong",
      name: "IKIGAI HOA PHƯỢNG (PHÒNG A,D)",
      title: "IKIGAI HOA PHƯỢNG (PHÒNG A,D)",
      description: "Phòng lớn nhất với 4 giường, không gian lý tưởng cho nhóm lớn hoặc sự kiện.",
      images: [
        "/banner/PCTT 2_2.png",
        "/banner/THU VIEN 8_4.png",
        "/banner/ONSEN 10_4.png",
        "/banner/CONG CHINH 2_3.png"
      ],
      beds: "4 giường (4 twin)",
      area: "25m² - 49m²",
      price: "Liên hệ",
      floor: "2-3-4",
      rooms: "5",
      view: "Nội khu, sân golf",
      features: [
        "WC chung",
        "Không gian rộng rãi nhất",
        "Phù hợp nhóm lớn",
        "View nội khu và sân golf"
      ]
    }
  ];

  const currentZone = roomZones.find((zone) => zone.id === activeZone);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d11e0f]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f7f2] to-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/banner/ONSEN 10_4.png"
            alt="Rooms Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Các Hạng Phòng
          </h1>
          <p className={`text-lg md:text-xl lg:text-2xl mb-8 text-gray-200 leading-relaxed transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Khám phá các hạng phòng đẳng cấp tại Ikigai Villa
          </p>
        </div>
      </section>

      {/* Zone Navigation */}
      <section className={`py-8 px-4 bg-white transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {roomZones.map((zone, index) => (
              <button
                key={zone.id}
                onClick={() => setActiveZone(zone.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeZone === zone.id
                    ? 'bg-gradient-to-r from-[#d11e0f] to-[#b01a0d] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {zone.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Active Zone Details - Pinterest Style */}
      {currentZone && (
        <section className={`py-12 px-4 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-[1440px] mx-auto">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Images Section - 3/4 width */}
              <div className="lg:col-span-3">
                <PhotoProvider
                  maskOpacity={0.9}
                  photoClosable={true}
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {currentZone.images.map((image, index) => (
                      <PhotoView key={`room-image-${index}`} src={image}>
                        <div
                          className={`relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                            index === 0 ? 'col-span-2 row-span-2' : ''
                          }`}
                        >
                          <div className={`relative ${index === 0 ? 'aspect-square' : 'aspect-square'}`}>
                            <Image
                              src={image}
                              alt={`${currentZone.title} ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          {/* Overlay with zoom icon */}
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                            <div className="opacity-0 hover:opacity-100 transition-opacity duration-300">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </PhotoView>
                    ))}
                  </div>
                </PhotoProvider>
              </div>

              {/* Text Section - 1/4 width */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    {currentZone.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    {currentZone.description}
                  </p>

                  {/* Room Specifications */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      Thông số phòng:
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="font-semibold text-gray-700">Giường:</span>
                        <p className="text-gray-600">{currentZone.beds}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="font-semibold text-gray-700">Diện tích:</span>
                        <p className="text-gray-600">{currentZone.area}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="font-semibold text-gray-700">Tầng:</span>
                        <p className="text-gray-600">{currentZone.floor}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="font-semibold text-gray-700">Số phòng:</span>
                        <p className="text-gray-600">{currentZone.rooms}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                        <span className="font-semibold text-gray-700">View:</span>
                        <p className="text-gray-600">{currentZone.view}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                        <span className="font-semibold text-gray-700">Giá:</span>
                        <p className="text-gray-600">{currentZone.price}</p>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      Tiện ích:
                    </h3>
                    <ul className="space-y-3">
                      {currentZone.features.map((feature, idx) => (
                        <li key={`room-feature-${idx}`} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-[#d11e0f] rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-4">
                    <button className="w-full bg-[#d11e0f] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#b01a0d] transition-colors duration-300">
                      Đặt phòng ngay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Rooms Grid Section - Added from page.tsx */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tất cả các phòng</h2>
            <p className="text-gray-600">Khám phá tất cả các hạng phòng có sẵn</p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
                {/* Room Image - Square */}
                <div className="relative aspect-square bg-gray-200">
                  {room.images && room.images.length > 0 ? (
                    <Image
                      src={room.images[0]}
                      alt={room.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Room Info */}
                <div className="p-6 flex flex-col h-full">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {room.name}
                    </h3>
                    
                    <p className="text-gray-600 mb-4">
                      {truncateText(room.description)}
                    </p>

                    {/* Room Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Giường:</span>
                        <p className="text-gray-600">{room.beds}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Diện tích:</span>
                        <p className="text-gray-600">{room.area}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Tầng:</span>
                        <p className="text-gray-600">{room.floor}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">View:</span>
                        <p className="text-gray-600">{room.view}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-[#d11e0f]">
                        {room.price}
                      </span>
                    </div>

                    {/* Features */}
                    {room.features && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(() => {
                          let features: string[] = [];
                          try {
                            const featuresStr = String(room.features);
                            if (!featuresStr.startsWith('[') && !featuresStr.startsWith('{')) {
                              features = featuresStr.split(',').map(item => item.trim()).filter(item => item !== '');
                            } else {
                              features = JSON.parse(featuresStr);
                            }
                          } catch {
                            const featuresStr = String(room.features);
                            features = featuresStr.split(',').map(item => item.trim()).filter(item => item !== '');
                          }
                          return features.map((feature: string, index: number) => (
                            <span
                              key={`room-filter-${index}`}
                              className="bg-[#d11e0f] text-white text-xs px-2 py-1 rounded-full"
                            >
                              {feature}
                            </span>
                          ));
                        })()}
                      </div>
                    )}
                  </div>

                  {/* View Details Button - Always at bottom */}
                  <div className="mt-auto pt-4">
                    <a
                      href={`/rooms/${room.slug}`}
                      className="block w-full bg-[#d11e0f] text-white text-center py-2 px-4 rounded-lg hover:bg-[#b01a0d] transition-colors duration-200"
                    >
                      Xem chi tiết
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {rooms.length === 0 && !loading && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có phòng nào</h3>
              <p className="mt-1 text-sm text-gray-500">
                Hiện tại chưa có phòng nào được đăng tải.
              </p>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={`room-page-${page}`}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === page
                        ? 'bg-[#d11e0f] text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </nav>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  );
} 