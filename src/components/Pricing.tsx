"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faWifi, faBroom, faUtensils, faSpa, faCar, faClock, faCreditCard, faTimes } from '@fortawesome/free-solid-svg-icons';
import CTASection from "./CTASection";

export default function Pricing() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f7f2] to-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/banner/CONG PHU 4_4.png"
            alt="Pricing Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4">
          <h1 className={`text-5xl md:text-6xl font-bold mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Bảng Giá
          </h1>
          <p className={`text-xl md:text-2xl max-w-3xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Khám phá các gói dịch vụ và mức giá phù hợp với nhu cầu của bạn
          </p>
        </div>
      </section>

      {/* Pricing Content */}
      <section className="py-16 px-4">
        <div className="max-w-[1440px] mx-auto">
          {/* Header */}
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Các Gói Dịch Vụ</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Lựa chọn gói dịch vụ phù hợp với nhu cầu và ngân sách của bạn
            </p>
          </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Basic Plan */}
          <div className={`bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col h-full p-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Ikigai Bán Trú Theo Ngày</h3>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center">
                <FontAwesomeIcon icon={faBed} className="text-green-500 mr-2 w-4 h-4" />
                Phòng cao cấp
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faWifi} className="text-green-500 mr-2 w-4 h-4" />
                WiFi tốc độ cao
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faBroom} className="text-green-500 mr-2 w-4 h-4" />
                Dọn phòng 2 lần/ngày
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faUtensils} className="text-green-500 mr-2 w-4 h-4" />
                Bữa sáng buffet
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faSpa} className="text-green-500 mr-2 w-4 h-4" />
                Dịch vụ spa
              </li>
            </ul>
            <div className="mt-auto">
              <Link 
                href="/pricing/ban-tru"
                className="w-full bg-[#d11e0f] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#b01a0d] transition-colors inline-block text-center"
              >
                Chọn Gói
              </Link>
            </div>
          </div>

          {/* Premium Plan */}
          <div className={`bg-white rounded-lg shadow-lg border-2 border-[#d11e0f] relative flex flex-col h-full p-8 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-[#d11e0f] text-white px-4 py-1 rounded-full text-sm font-semibold">
                Best Seller
              </span>
            </div>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Ikigai Nội Trú Cao Cấp</h3>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center">
                <FontAwesomeIcon icon={faBed} className="text-green-500 mr-2 w-4 h-4" />
                Phòng tiêu chuẩn
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faWifi} className="text-green-500 mr-2 w-4 h-4" />
                WiFi miễn phí
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faBroom} className="text-green-500 mr-2 w-4 h-4" />
                Dọn phòng hàng ngày
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faUtensils} className="text-green-500 mr-2 w-4 h-4" />
                Bữa sáng cơ bản
              </li>
            </ul>
            <div className="mt-auto">
              <Link 
                href="/pricing/noi-tru"
                className="w-full bg-[#d11e0f] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#b01a0d] transition-colors inline-block text-center"
              >
                Chọn Gói
              </Link>
            </div>
          </div>

          {/* Luxury Plan */}
          <div className={`bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col h-full p-8 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Ikigai Trải Nghiệm</h3>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center">
                <FontAwesomeIcon icon={faBed} className="text-green-500 mr-2 w-4 h-4" />
                Suite sang trọng
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faWifi} className="text-green-500 mr-2 w-4 h-4" />
                WiFi không giới hạn
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faClock} className="text-green-500 mr-2 w-4 h-4" />
                Dịch vụ 24/7
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faUtensils} className="text-green-500 mr-2 w-4 h-4" />
                Bữa ăn đa dạng
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faSpa} className="text-green-500 mr-2 w-4 h-4" />
                Spa & Gym miễn phí
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faCar} className="text-green-500 mr-2 w-4 h-4" />
                Dịch vụ đưa đón
              </li>
            </ul>
            <div className="mt-auto">
              <Link 
                href="/pricing/trai-nghiem"
                className="w-full bg-[#d11e0f] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#b01a0d] transition-colors inline-block text-center"
              >
                Chọn Gói
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className={`mt-16 text-center transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Thông Tin Bổ Sung</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-3">
                <FontAwesomeIcon icon={faTimes} className="text-[#d11e0f] mr-3 w-5 h-5" />
                <h3 className="text-lg font-semibold text-gray-800">Chính Sách Hủy</h3>
              </div>
              <p className="text-gray-600">
                Hủy phòng miễn phí trước 24h. Sau đó sẽ tính phí 50% giá phòng.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-3">
                <FontAwesomeIcon icon={faCreditCard} className="text-[#d11e0f] mr-3 w-5 h-5" />
                <h3 className="text-lg font-semibold text-gray-800">Thanh Toán</h3>
              </div>
              <p className="text-gray-600">
                Chấp nhận thanh toán bằng tiền mặt, thẻ tín dụng hoặc chuyển khoản ngân hàng.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
      
    {/* CTA Section */}
    <CTASection />
  </div>
);
} 