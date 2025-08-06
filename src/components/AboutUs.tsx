"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faTrophy, faHandshake, faLeaf, faGem, faUsers, faStar, faAward, faHeart, faCog } from '@fortawesome/free-solid-svg-icons';
import LetterCard from "./LetterCard";
import CTASection from "./CTASection";
import OurTeam from "./OurTeam";

// interface TeamMember {
//   name: string;
//   position: string;
//   image: string;
//   description: string;
// }

interface Value {
  icon: IconProp;
  title: string;
  description: string;
}

interface Statistic {
  value: string;
  label: string;
  suffix?: string;
}

export default function AboutUs() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // const teamMembers: TeamMember[] = [
  //   {
  //     name: "Nguyễn Văn An",
  //     position: "Giám đốc điều hành",
  //     image: "/banner/ONSEN 10_4.png",
  //     description: "Với hơn 15 năm kinh nghiệm trong lĩnh vực bất động sản cao cấp."
  //   },
  //   {
  //     name: "Trần Thị Bình",
  //     position: "Giám đốc thiết kế",
  //     image: "/banner/THU VIEN 8_4.png",
  //     description: "Chuyên gia thiết kế nội thất với tầm nhìn độc đáo và sáng tạo."
  //   },
  //   {
  //     name: "Lê Văn Cường",
  //     position: "Giám đốc vận hành",
  //     image: "/banner/CONG CHINH 2_3.png",
  //     description: "Đảm bảo mọi dịch vụ đều đạt tiêu chuẩn 5 sao quốc tế."
  //   }
  // ];

  const values: Value[] = [
    {
      icon: faTrophy,
      title: "Chất lượng xuất sắc",
      description: "Cam kết mang đến trải nghiệm đẳng cấp nhất cho mọi khách hàng."
    },
    {
      icon: faHandshake,
      title: "Dịch vụ tận tâm",
      description: "Đội ngũ chuyên nghiệp luôn sẵn sàng phục vụ 24/7."
    },
    {
      icon: faLeaf,
      title: "Bền vững môi trường",
      description: "Kiến trúc hài hòa với thiên nhiên, bảo vệ môi trường."
    },
    {
      icon: faGem,
      title: "Độc đáo & Sáng tạo",
      description: "Mỗi thiết kế đều mang dấu ấn riêng biệt và độc đáo."
    }
  ];

  const statistics: Statistic[] = [
    { value: "500+", label: "Khách hàng hài lòng", suffix: "+" },
    { value: "50+", label: "Dự án hoàn thành", suffix: "+" },
    { value: "15", label: "Năm kinh nghiệm", suffix: " năm" },
    { value: "100%", label: "Khách hàng quay lại", suffix: "%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f7f2] to-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/banner/ONSEN 10_4.png"
            alt="About Us Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Về Chúng Tôi
          </h1>
          <p className={`text-lg md:text-xl lg:text-2xl mb-8 text-gray-200 leading-relaxed transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Kiến tạo không gian sống đẳng cấp, nơi mỗi khoảnh khắc đều là trải nghiệm tuyệt vời
          </p>
        </div>
      </section>

      {/* Brief Introduction */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Ikigai Villa - Nơi Hội Tụ Của Sự Hoàn Hảo
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Được thành lập với tầm nhìn kiến tạo những không gian sống đẳng cấp, Ikigai Villa 
            không chỉ là nơi nghỉ dưỡng mà còn là điểm đến của những trải nghiệm tuyệt vời, 
            nơi mỗi chi tiết đều được chăm chút tỉ mỉ để mang đến sự hài lòng tuyệt đối cho khách hàng.
          </p>
        </div>
      </section>

      <LetterCard />
      
      {/* Company Story Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                Câu Chuyện Của Chúng Tôi
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Được thành lập vào năm 2009, Ikigai Villa đã trở thành một trong những thương hiệu hàng đầu 
                trong lĩnh vực bất động sản cao cấp tại Việt Nam. Với tầm nhìn kiến tạo những không gian 
                sống đẳng cấp, chúng tôi cam kết mang đến trải nghiệm tuyệt vời nhất cho mọi khách hàng.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Từ những dự án đầu tiên đến nay, chúng tôi đã xây dựng được uy tín và niềm tin từ hàng trăm 
                khách hàng. Mỗi dự án đều được thiết kế với sự tận tâm, sáng tạo và chú trọng đến từng chi tiết nhỏ nhất.
              </p>
              <div className="flex gap-4 pt-4">
                <Link
                  href="/services"
                  className="bg-gradient-to-r from-[#d11e0f] to-[#b01a0d] hover:from-[#b01a0d] hover:to-[#8f150a] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center"
                >
                  <FontAwesomeIcon icon={faCog} className="w-4 h-4 mr-2" />
                  Khám phá dịch vụ
                </Link>
                <Link
                  href="/contact"
                  className="border-2 border-[#d11e0f] text-[#d11e0f] hover:bg-[#d11e0f] hover:text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center"
                >
                  <FontAwesomeIcon icon={faHandshake} className="w-4 h-4 mr-2" />
                  Liên hệ tư vấn
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">2009</h3>
                    <p className="text-gray-600">Thành lập công ty</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">2015</h3>
                    <p className="text-gray-600">Mở rộng thị trường</p>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">2020</h3>
                    <p className="text-gray-600">Đạt chuẩn 5 sao</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">2024</h3>
                    <p className="text-gray-600">Thương hiệu hàng đầu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Giá Trị Cốt Lõi
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Những giá trị định hình nên thương hiệu Ikigai Villa và cam kết của chúng tôi với khách hàng
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={`value-${index}`}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 text-[#d11e0f]">
                  <FontAwesomeIcon icon={value.icon} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#d11e0f] to-[#b01a0d]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Thành Tựu Của Chúng Tôi
            </h2>
            <p className="text-lg text-gray-200 max-w-3xl mx-auto">
              Những con số ấn tượng phản ánh sự tin tưởng và hài lòng của khách hàng
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <div
                key={`statistic-${index}`}
                className="text-center text-white"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2 flex items-center justify-center">
                  <FontAwesomeIcon icon={index === 0 ? faHeart : index === 1 ? faStar : index === 2 ? faAward : faUsers} className="w-8 h-8 mr-3 text-yellow-300" />
                  {stat.value}
                </div>
                <div className="text-lg text-gray-200">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
     <OurTeam />

      {/* CTA Section */}
      <CTASection 
        title="Sẵn Sàng Trải Nghiệm?"
        description="Hãy để chúng tôi giúp bạn tạo nên những khoảnh khắc đáng nhớ tại Ikigai Villa"
        primaryButtonText="Liên hệ ngay"
        secondaryButtonText="Xem dịch vụ"
        secondaryButtonLink="/services"
      />
    </div>
  );
} 