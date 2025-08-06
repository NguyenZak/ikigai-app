"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { PhotoProvider } from 'react-photo-view';
import "react-photo-view/dist/react-photo-view.css";
import ContactModal from "../../../components/ContactModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
interface PackageDetails {
  id: string;
  name: string;
  title: string;
  description: string;
  features: string[];
  images: string[];
  highlights: string[];
  terms: string[];
}

export default function PackageDetailPage() {
  const params = useParams();
  const packageId = params.package as string;
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Package data
  const packages: Record<string, PackageDetails> = {
    "ban-tru": {
      id: "ban-tru",
      name: "Ikigai Bán Trú Theo Ngày",
      title: "Gói Bán Trú Theo Ngày",
      description: "Trải nghiệm nghỉ dưỡng linh hoạt với gói bán trú theo ngày, phù hợp cho những chuyến đi ngắn hạn hoặc công tác.",
      features: [
        "Phòng tiêu chuẩn với view đẹp",
        "WiFi tốc độ cao miễn phí",
        "Dọn phòng hàng ngày",
        "Bữa sáng buffet đa dạng",
        "Sử dụng tiện ích chung",
        "Bảo vệ 24/7",
        "Bãi đỗ xe miễn phí",
        "Hỗ trợ đặt tour du lịch"
      ],
      images: [
        "/images/ONSEN 10_4.png",
        "/images/THU VIEN 8_4.png",
        "/images/CONG CHINH 2_3.png"
      ],
      highlights: [
        "Check-in linh hoạt từ 14:00",
        "Check-out trước 12:00",
        "Hủy phòng miễn phí trước 24h",
        "Thanh toán tại chỗ hoặc online"
      ],
      terms: [
        "Áp dụng cho khách lẻ và đoàn",
        "Giá chưa bao gồm thuế VAT",
        "Có thể thay đổi theo mùa",
        "Liên hệ để được tư vấn chi tiết"
      ]
    },
    "noi-tru": {
      id: "noi-tru",
      name: "Ikigai Nội Trú Cao Cấp",
      title: "Gói Nội Trú Cao Cấp",
      description: "Gói nội trú cao cấp với đầy đủ tiện nghi, dịch vụ chăm sóc toàn diện cho kỳ nghỉ dưỡng hoàn hảo.",
      features: [
        "Phòng cao cấp với view tuyệt đẹp",
        "WiFi tốc độ cao không giới hạn",
        "Dọn phòng 2 lần/ngày",
        "Bữa sáng buffet sang trọng",
        "Dịch vụ spa cơ bản",
        "Sử dụng gym và hồ bơi",
        "Dịch vụ đưa đón sân bay",
        "Hỗ trợ đặt nhà hàng, tour"
      ],
      images: [
        "/images/THU VIEN 8_4.png",
        "/images/ONSEN 10_4.png",
        "/images/CONG PHU 4_4.png"
      ],
      highlights: [
        "Check-in từ 14:00, check-out trước 12:00",
        "Hủy phòng miễn phí trước 48h",
        "Bao gồm 1 bữa ăn chính/ngày",
        "Dịch vụ concierge 24/7"
      ],
      terms: [
        "Áp dụng cho khách lẻ và đoàn",
        "Giá đã bao gồm thuế VAT",
        "Có thể thay đổi theo mùa",
        "Đặt phòng tối thiểu 2 ngày"
      ]
    },
    "trai-nghiem": {
      id: "trai-nghiem",
      name: "Ikigai Trải Nghiệm",
      title: "Gói Trải Nghiệm Đặc Biệt",
      description: "Gói trải nghiệm đặc biệt dành cho những ai muốn sống và làm việc tại Ikigai Villa trong thời gian dài.",
      features: [
        "Suite sang trọng với không gian riêng",
        "WiFi không giới hạn tốc độ cao",
        "Dịch vụ 24/7 với butler riêng",
        "Bữa ăn đa dạng 3 bữa/ngày",
        "Spa & Gym miễn phí không giới hạn",
        "Dịch vụ đưa đón sân bay",
        "Không gian làm việc riêng",
        "Tham gia các hoạt động cộng đồng"
      ],
      images: [
        "/banner/CONG CHINH 2_3.png",
        "/banner/ONSEN 10_4.png",
        "/banner/THU VIEN 8_4.png"
      ],
      highlights: [
        "Thời gian linh hoạt từ 1-12 tháng",
        "Giảm giá 20% cho đặt từ 3 tháng",
        "Bao gồm tất cả tiện ích",
        "Hỗ trợ setup workspace"
      ],
      terms: [
        "Áp dụng cho khách dài hạn",
        "Giá đã bao gồm tất cả dịch vụ",
        "Có thể thay đổi theo mùa",
        "Liên hệ để được tư vấn chi tiết"
      ]
    }
  };

  const packageData = packages[packageId];

  if (!packageData) {
    return (
      <div className="min-h-screen bg-[#f8f7f2] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Gói không tồn tại</h1>
          <Link 
            href="/pricing"
            className="bg-[#d11e0f] text-white px-6 py-3 rounded-lg hover:bg-[#b01a0d] transition-colors"
          >
            Quay lại bảng giá
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PhotoProvider>
      <div className="min-h-screen bg-[#f8f7f2]">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <Link 
                href="/pricing"
                className="flex items-center text-gray-600 hover:text-[#d11e0f] transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại bảng giá
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">{packageData.title}</h1>
              <div className="w-20"></div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Package Header */}
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">{packageData.name}</h2>
                  <p className="text-lg text-gray-600 mb-6">{packageData.description}</p>

                  {/* Package Details - Only for noi-tru package */}
                  {packageData.id === "ban-tru" && (
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Chi tiết gói Ikigai Nội Trú:</h3>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <span className="text-[#d11e0f] mr-3 mt-1">•</span>
                          <span className="text-gray-700">Khách đăng ký sáng đi chiều về</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-[#d11e0f] mr-3 mt-1">•</span>
                          <span className="text-gray-700">Đơn giá chưa bao gồm chi phí xe đưa đón</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-[#d11e0f] mr-3 mt-1">•</span>
                          <span className="text-gray-700">Đơn giá dự kiến: <span className="font-semibold text-[#d11e0f]">650.000 VNĐ/người</span></span>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-gray-300">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Lịch trình hoạt động hàng ngày:</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="text-[#d11e0f] font-semibold">8h00:</div>
                              <div className="text-gray-700">Đón các cụ NCT</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="text-[#d11e0f] font-semibold">8h30-9h00:</div>
                              <div className="text-gray-700">Kiểm tra & theo dõi sức khoẻ</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="text-[#d11e0f] font-semibold">9h00-11h00:</div>
                              <div className="text-gray-700">Sinh hoạt CLB / Tắm Onsen, xông hơi, spa & massage (tuần 1 lần)</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="text-[#d11e0f] font-semibold">11h00-11h30:</div>
                              <div className="text-gray-700">Hoạt động tự do</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="text-[#d11e0f] font-semibold">11h30-12h30:</div>
                              <div className="text-gray-700">Ăn trưa</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="text-[#d11e0f] font-semibold">12h30-14h00:</div>
                              <div className="text-gray-700">Nghỉ trưa</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="text-[#d11e0f] font-semibold">14h00-15h00:</div>
                              <div className="text-gray-700">Dùng bữa phụ</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="text-[#d11e0f] font-semibold">15h00-16h30:</div>
                              <div className="text-gray-700">Tham gia hoạt động CLB / các hoạt động tự do</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="text-[#d11e0f] font-semibold">16h30-17h00:</div>
                              <div className="text-gray-700">Nghỉ ngơi</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="text-[#d11e0f] font-semibold">17h00:</div>
                              <div className="text-gray-700">Đưa các cụ NCT về điểm đón</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Package Details - Only for trai-nghiem package */}
                  {packageData.id === "trai-nghiem" && (
                    <div className="space-y-6 mb-6">
                      {/* Card 1: Trải nghiệm 1 ngày */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Chi tiết gói Ikigai Trải Nghiệm:</h3>
                        <div className="space-y-3 mb-6">
                          <div className="flex items-start">
                            <span className="text-[#d11e0f] mr-3 mt-1">1.</span>
                            <span className="text-gray-700">Trải nghiệm 1 ngày: <span className="font-semibold text-[#d11e0f]">850.000 VNĐ/người</span></span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-[#d11e0f] mr-3 mt-1">2.</span>
                            <span className="text-gray-700">Trải nghiệm 2 ngày: <span className="font-semibold text-[#d11e0f]">1.450.000 VNĐ/người</span></span>
                          </div>
                        </div>
                        
                        <div className="border-t border-gray-300 pt-6">
                          <h4 className="text-lg font-semibold text-gray-800 mb-4">LỊCH TRÌNH TRẢI NGHIỆM 1 NGÀY:</h4>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="text-md font-semibold text-gray-800 mb-3">BUỔI SÁNG:</h5>
                              <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="text-[#d11e0f] font-semibold">8h00:</div>
                                  <div className="text-gray-700">Đón khách</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="text-[#d11e0f] font-semibold">8h30-9h00:</div>
                                  <div className="text-gray-700">Kiểm tra & theo dõi sức khoẻ</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="text-[#d11e0f] font-semibold">9h00-11h00:</div>
                                  <div className="text-gray-700">Sinh hoạt CLB / Tắm Onsen, xông hơi, spa & massage</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="text-[#d11e0f] font-semibold">11h00-11h30:</div>
                                  <div className="text-gray-700">Hoạt động tự do</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="text-[#d11e0f] font-semibold">11h30-12h30:</div>
                                  <div className="text-gray-700">Ăn trưa</div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h5 className="text-md font-semibold text-gray-800 mb-3">BUỔI CHIỀU:</h5>
                              <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="text-[#d11e0f] font-semibold">12h30-14h00:</div>
                                  <div className="text-gray-700">Nghỉ trưa</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="text-[#d11e0f] font-semibold">14h00-15h00:</div>
                                  <div className="text-gray-700">Dùng bữa phụ</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="text-[#d11e0f] font-semibold">15h00-16h30:</div>
                                  <div className="text-gray-700">Tham gia hoạt động CLB và các hoạt động trải nghiệm tự do như (bơi, golf, pickleball...)</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="text-[#d11e0f] font-semibold">16h30-17h00:</div>
                                  <div className="text-gray-700">Tiệc trà tư vấn</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="text-[#d11e0f] font-semibold">17h00:</div>
                                  <div className="text-gray-700">Kết thúc và tạm biệt</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card 2: Trải nghiệm 2 ngày 1 đêm */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">LỊCH TRÌNH TRẢI NGHIỆM 2 NGÀY 1 ĐÊM:</h3>
                        <div className="space-y-6">
                          {/* NGÀY 1 */}
                          <div>
                            <h5 className="text-md font-semibold text-gray-800 mb-3">NGÀY 1:</h5>
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <h6 className="text-sm font-semibold text-gray-700 mb-2">BUỔI SÁNG:</h6>
                                <div className="space-y-2">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="text-[#d11e0f] font-semibold">8h00:</div>
                                    <div className="text-gray-700">Đón khách</div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="text-[#d11e0f] font-semibold">8h30-9h00:</div>
                                    <div className="text-gray-700">Kiểm tra & theo dõi sức khoẻ</div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="text-[#d11e0f] font-semibold">9h00-11h00:</div>
                                    <div className="text-gray-700">Sinh hoạt CLB / Tắm Onsen, xông hơi, spa & massage</div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="text-[#d11e0f] font-semibold">11h00-11h30:</div>
                                    <div className="text-gray-700">Hoạt động tự do</div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="text-[#d11e0f] font-semibold">11h30-12h30:</div>
                                    <div className="text-gray-700">Ăn trưa</div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="text-[#d11e0f] font-semibold">12h30-14h00:</div>
                                    <div className="text-gray-700">Nghỉ trưa</div>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h6 className="text-sm font-semibold text-gray-700 mb-2">BUỔI CHIỀU:</h6>
                                <div className="space-y-2">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="text-[#d11e0f] font-semibold">14h00-15h00:</div>
                                    <div className="text-gray-700">Dùng bữa phụ</div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="text-[#d11e0f] font-semibold">15h00-16h30:</div>
                                    <div className="text-gray-700">Tham gia hoạt động CLB và các hoạt động trị liệu thư giãn</div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="text-[#d11e0f] font-semibold">16h30-17h30:</div>
                                    <div className="text-gray-700">Hoạt động tự do các hoạt động trải nghiệm tự do như: bơi, golf, pickleball, cầu lông...</div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="text-[#d11e0f] font-semibold">17h30-18h30:</div>
                                    <div className="text-gray-700">Ăn tối</div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="text-[#d11e0f] font-semibold">18h30-19h30:</div>
                                    <div className="text-gray-700">Vệ sinh cá nhân</div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="text-[#d11e0f] font-semibold">19h30-21h00:</div>
                                    <div className="text-gray-700">Thư giãn tự do (đọc sách, xem truyền hình giải trí)</div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="text-[#d11e0f] font-semibold">21h00:</div>
                                    <div className="text-gray-700">Kiểm tra theo dõi sức khỏe và nghỉ ngơi</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* NGÀY 2 */}
                          <div>
                            <h5 className="text-md font-semibold text-gray-800 mb-3">NGÀY 2:</h5>
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <h6 className="text-sm font-semibold text-gray-700 mb-2">BUỔI SÁNG:</h6>
                                <div className="space-y-2">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="text-[#d11e0f] font-semibold">6h00-7h30:</div>
                                    <div className="text-gray-700">Thức dậy, vệ sinh cá nhân, tham gia hoạt động thể dục</div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="text-[#d11e0f] font-semibold">7h30-8h30:</div>
                                    <div className="text-gray-700">Dùng điểm tâm sáng, thưởng trà</div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="text-[#d11e0f] font-semibold">8h30-9h00:</div>
                                    <div className="text-gray-700">Kiểm tra & theo dõi sức khoẻ</div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="text-[#d11e0f] font-semibold">9h00-10h30:</div>
                                    <div className="text-gray-700">Sinh hoạt CLB và tham gia trải nghiệm các hoạt động tự do</div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="text-[#d11e0f] font-semibold">10h30-11h00:</div>
                                    <div className="text-gray-700">Tiệc trà tư vấn</div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="text-[#d11e0f] font-semibold">11h00:</div>
                                    <div className="text-gray-700">Kết thúc và tạm biệt</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Tính năng bao gồm:</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {packageData.features.map((feature, index) => (
                        <div key={`pricing-feature-${index}`} className="flex items-center">
                          <span className="text-green-500 mr-3">✓</span>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Gallery */}
              {/* <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Hình ảnh tiện ích:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {packageData.images.filter(Boolean).map((image, index) => (
                    image && image.trim() !== '' ? (
                      <PhotoView key={`pricing-image-${index}`} src={image}>
                        <div className="relative h-48 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                          <Image
                            src={image}
                            alt={`${packageData.name} ${index + 1}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </PhotoView>
                    ) : null
                  ))}
                </div>
              </div> */}

              {/* Detailed Pricing Table - Only for ban-tru package */}
              {packageData.id === "noi-tru" && (
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Bảng giá chi tiết</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-[#d11e0f] text-white">
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold">STT</th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold">LOẠI PHÒNG</th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold">SỐ LƯỢNG NGƯỜI /PHÒNG</th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold">ĐƠN GIÁ/ NGƯỜI</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-3 font-medium">1</td>
                          <td className="border border-gray-300 px-4 py-3">Phòng Ikigai Hoa Hồng</td>
                          <td className="border border-gray-300 px-4 py-3">1-2 người</td>
                          <td className="border border-gray-300 px-4 py-3 font-semibold text-[#d11e0f]">40.000.000 VNĐ</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-3 font-medium">2</td>
                          <td className="border border-gray-300 px-4 py-3">Phòng Ikigai Hoa Đào</td>
                          <td className="border border-gray-300 px-4 py-3">1-2 người</td>
                          <td className="border border-gray-300 px-4 py-3 font-semibold text-[#d11e0f]">24.000.000 VNĐ</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-3 font-medium">3</td>
                          <td className="border border-gray-300 px-4 py-3">Phòng Ikigai Hoa Mai</td>
                          <td className="border border-gray-300 px-4 py-3">2 người</td>
                          <td className="border border-gray-300 px-4 py-3 font-semibold text-[#d11e0f]">21.000.000 VNĐ</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-3 font-medium">4</td>
                          <td className="border border-gray-300 px-4 py-3">Phòng Ikigai Hướng dương</td>
                          <td className="border border-gray-300 px-4 py-3">3 người</td>
                          <td className="border border-gray-300 px-4 py-3 font-semibold text-[#d11e0f]">18.000.000 VNĐ</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-3 font-medium">5</td>
                          <td className="border border-gray-300 px-4 py-3">Phòng Ikigai Hoa Phượng</td>
                          <td className="border border-gray-300 px-4 py-3">4 người</td>
                          <td className="border border-gray-300 px-4 py-3 font-semibold text-[#d11e0f]">16.000.000 VNĐ</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-lg font-semibold text-gray-700">
                      Tổng số phòng: <span className="text-[#d11e0f]">16 phòng</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Highlights */}
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Điểm nổi bật:</h3>
                <div className="space-y-3">
                  {packageData.highlights.map((highlight, index) => (
                    <div key={`pricing-highlight-${index}`} className="flex items-start">
                      <div className="w-2 h-2 bg-[#d11e0f] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terms */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Điều khoản:</h3>
                <div className="space-y-3">
                  {packageData.terms.map((term, index) => (
                    <div key={`pricing-term-${index}`} className="flex items-start">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">{term}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Đặt gói này</h3>
                <div className="space-y-4">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-[#d11e0f] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#b01a0d] transition-colors mb-4"
                  >
                    Đặt ngay
                  </button>
                  
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full border-2 border-[#d11e0f] text-[#d11e0f] py-3 px-6 rounded-lg font-semibold hover:bg-[#d11e0f] hover:text-white transition-colors"
                  >
                    Liên hệ tư vấn
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3">Liên hệ:</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div><FontAwesomeIcon icon={faPhone} /> 0123 456 789</div>
                    <div><FontAwesomeIcon icon={faEnvelope} /> info@ikigaivilla.com</div>
                    <div><FontAwesomeIcon icon={faMapMarkerAlt} />Khu C15, Số nhà 12-12A Vạn Lộc, Xanh Villa Resort, Tiến Xuân Thạch Thất, Hà Nội</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContactModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </PhotoProvider>
  );
} 