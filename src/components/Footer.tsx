import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faInfoCircle, faCog, faNewspaper } from '@fortawesome/free-solid-svg-icons';
import ContactInfo from './ContactInfo';

export default function Footer() {
  return (
    <footer className="bg-[#fff] text-black py-12">
      <div className="max-w-[1440px] mx-auto px-8"> 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Contact Information */}
          <div className="space-y-6 order-2 md:order-1">
            <h3 className="text-xl font-semibold mb-4">Liên hệ</h3>
            <ContactInfo variant="footer" />
          </div>

          {/* Middle Column - Navigation Links */}
          <div className="space-y-2 order-3 md:order-2">
            <h3 className="text-xl font-semibold mb-4">Liên kết</h3>
            <Link href="/" className="block text-black hover:text-red transition-colors flex items-center">
              <FontAwesomeIcon icon={faHome} className="w-4 h-4 mr-2" />
              Trang chủ
            </Link>
            <Link href="/about" className="block text-black hover:text-red transition-colors flex items-center">
              <FontAwesomeIcon icon={faInfoCircle} className="w-4 h-4 mr-2" />
              Về chúng tôi
            </Link>
            <Link href="/services" className="block text-black hover:text-red transition-colors flex items-center">
              <FontAwesomeIcon icon={faCog} className="w-4 h-4 mr-2" />
              Dịch vụ
            </Link>
            <Link href="/news" className="block text-black hover:text-red transition-colors flex items-center">
              <FontAwesomeIcon icon={faNewspaper} className="w-4 h-4 mr-2" />
              Tin tức
            </Link>
          </div>

          {/* Right Column - Brand & Description */}
          <div className="space-y-4 order-1 md:order-3">
            <h3 className="text-2xl font-bold">
            <Link href="/">
            <Image src="/logo.svg" alt="Logo" width={300} height={200} />
          </Link>   
            </h3>
            <p className="text-black leading-relaxed">
            Ikigai Home lấy cảm hứng từ hình ảnh mặt trời đỏ –
biểu tượng của một ngày trọn vẹn. Đó không phải là điểm kết, mà
là thời khắc đẹp nhất để lắng lại, thở sâu, và cảm nhận mình vẫn
đang sống.
Ikigai Home mang trong mình một niềm tin giản dị:
Mỗi người, ở bất kỳ độ tuổi nào, đều xứng đáng được sống theo
cách khiến họ thấy ý nghĩa            </p>
          </div>
        </div>

        {/* Separator Line */}
        <div className="border-t border-gray-700 mb-6"></div>

        {/* Copyright */}
        <div className="text-center text-black">
          <p>All Right Reserved | ©Copyright 2025 | Ikigaivilla By Việt Ý - Design by Viz Solutions</p>
        </div>
      </div>
    </footer>
  );
} 