"use client";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { useSearchParams } from "next/navigation";
import CTASection from "./CTASection";

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

// Fallback data in case API fails
const fallbackServiceZones: ServiceZone[] = [
  {
    id: 1,
    zoneId: "onsen",
    name: "Khu onsen ngoài trời",
    title: "Khu Onsen Ngoài Trời",
    description: "Trải nghiệm tắm khoáng nóng ngoài trời chuẩn Nhật Bản, thư giãn giữa thiên nhiên, giúp phục hồi năng lượng và cân bằng cơ thể.",
    images: [
      "/banner/ONSEN 10_4.png",
      "/banner/THU VIEN 8_4.png",
      "/banner/CONG CHINH 2_3.png",
      "/banner/CONG PHU 4_4.png"
    ],
    features: [
      "Nước khoáng nóng tự nhiên",
      "Không gian ngoài trời xanh mát",
      "Bồn tắm khoáng, phòng xông hơi",
      "Dịch vụ spa thư giãn"
    ],
    order: 1,
    active: true,
    createdAt: "",
    updatedAt: ""
  },
  {
    id: 2,
    zoneId: "lobby-library",
    name: "Sảnh lễ tân & Thư viện",
    title: "Sảnh Lễ Tân & Thư Viện",
    description: "Không gian đón tiếp sang trọng, kết hợp thư viện yên tĩnh với hàng ngàn đầu sách, lý tưởng cho việc đọc sách, làm việc và thư giãn.",
    images: [
      "/banner/THU VIEN 8_4.png",
      "/banner/ONSEN 10_4.png",
      "/banner/CONG CHINH 2_3.png",
      "/banner/CONG PHU 4_4.png"
    ],
    features: [
      "Sảnh lễ tân sang trọng",
      "Thư viện với hơn 10,000 đầu sách",
      "Không gian làm việc chung",
      "Cà phê và trà miễn phí"
    ],
    order: 2,
    active: true,
    createdAt: "",
    updatedAt: ""
  },
  {
    id: 3,
    zoneId: "restaurant",
    name: "Khu vực nhà hàng",
    title: "Khu Vực Nhà Hàng",
    description: "Nhà hàng phục vụ ẩm thực đa dạng, không gian ấm cúng, thực đơn phong phú từ món Việt đến món Âu, nguyên liệu tươi ngon mỗi ngày.",
    images: [
      "/banner/CONG CHINH 2_3.png",
      "/banner/THU VIEN 8_4.png",
      "/banner/ONSEN 10_4.png",
      "/banner/CONG PHU 4_4.png"
    ],
    features: [
      "Ẩm thực Việt & Quốc tế",
      "Không gian riêng tư & chung",
      "Nguyên liệu hữu cơ, tươi mới",
      "Phục vụ chuyên nghiệp"
    ],
    order: 3,
    active: true,
    createdAt: "",
    updatedAt: ""
  },
  {
    id: 4,
    zoneId: "wellness",
    name: "Khu vực chăm sóc sức khoẻ & vật lý trị liệu",
    title: "Chăm Sóc Sức Khoẻ & Vật Lý Trị Liệu",
    description: "Dịch vụ chăm sóc sức khoẻ toàn diện: massage, vật lý trị liệu, yoga, thiền, giúp phục hồi thể chất và tinh thần.",
    images: [
      "/banner/CONG PHU 4_4.png",
      "/banner/THU VIEN 8_4.png",
      "/banner/ONSEN 10_4.png",
      "/banner/CONG CHINH 2_3.png"
    ],
    features: [
      "Massage trị liệu chuyên sâu",
      "Phòng tập yoga & thiền",
      "Chuyên gia vật lý trị liệu",
      "Không gian yên tĩnh, riêng tư"
    ],
    order: 4,
    active: true,
    createdAt: "",
    updatedAt: ""
  }
];

export default function Services() {
  const searchParams = useSearchParams();
  const [activeZone, setActiveZone] = useState("onsen");
  const [isVisible, setIsVisible] = useState(false);
  const [serviceZones, setServiceZones] = useState<ServiceZone[]>(fallbackServiceZones);
  const [loading, setLoading] = useState(true);

  const fetchServiceZones = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching service zones...');
      const response = await fetch('/api/service-zones');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Failed to fetch service zones: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Service zones data:', data);
      
      if (data.serviceZones && data.serviceZones.length > 0) {
        setServiceZones(data.serviceZones);
        
        // Set default active zone to first available zone
        if (!searchParams.get('zone')) {
          setActiveZone(data.serviceZones[0].zoneId);
        }
      } else {
        console.log('No service zones found, using fallback data');
        setServiceZones(fallbackServiceZones);
      }
    } catch (error) {
      console.error('Error fetching service zones:', error);
      console.log('Using fallback data due to API error');
      setServiceZones(fallbackServiceZones);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    setIsVisible(true);
    fetchServiceZones();
  }, [fetchServiceZones]);

  useEffect(() => {
    const zone = searchParams.get('zone');
    if (zone) {
      setActiveZone(zone);
    }
  }, [searchParams]);

  const currentZone = serviceZones.find((zone) => zone.zoneId === activeZone);

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
            alt="Services Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Tiện ích đặc quyền
          </h1>
          <p className={`text-lg md:text-xl lg:text-2xl mb-8 text-gray-200 leading-relaxed transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Khám phá các tiện ích và phân khu phòng nghỉ đẳng cấp tại Ikigai Villa
          </p>
        </div>
      </section>

      {/* Zone Navigation */}
      <section className={`py-8 px-4 bg-white transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {serviceZones.map((zone, index) => (
              <button
                key={zone.zoneId}
                onClick={() => setActiveZone(zone.zoneId)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeZone === zone.zoneId
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
                    {currentZone.images && currentZone.images.length > 0 ? (
                      currentZone.images.map((image, index) => (
                        <PhotoView key={`service-image-${index}`} src={image}>
                          <div
                            className={`relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                              index === 0 ? 'col-span-2 row-span-2' : ''
                            }`}
                          >
                            <div className={`relative ${index === 0 ? 'h-96' : 'h-48'}`}>
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
                      ))
                    ) : (
                      // Fallback image if no images are available
                      <div className="col-span-2 row-span-2 relative overflow-hidden rounded-xl shadow-lg">
                        <div className="relative h-96">
                          <Image
                            src="/images/placeholder.jpg"
                            alt={`${currentZone.title} placeholder`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <p className="text-white text-lg font-medium">Không có hình ảnh</p>
                        </div>
                      </div>
                    )}
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
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      Đặc điểm nổi bật:
                    </h3>
                    <ul className="space-y-3">
                      {currentZone.features.map((feature, idx) => (
                        <li key={`service-feature-${idx}`} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-[#d11e0f] rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
