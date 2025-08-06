"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import ContactInfo from './ContactInfo';
import { useContactSettings, contactHelpers } from '@/lib/contact-settings';




interface Province {
  province_code: string;
  name: string;
  wards: Ward[];
}

interface Ward {
  ward_code: string;
  name: string;
  province_code: string;
}

export default function Contact() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    province: "",
    ward: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedWards, setSelectedWards] = useState<Ward[]>([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  // Get contact settings
  const { settings, loading: settingsLoading } = useContactSettings();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Phone number validation function (same as ContactModal)
  const validatePhoneNumber = (phone: string) => {
    // Loại bỏ tất cả ký tự không phải số
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Kiểm tra độ dài (10-11 chữ số)
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      return "Số điện thoại phải có 10-11 chữ số";
    }
    
    // Kiểm tra đầu số Việt Nam
    const validPrefixes = ['03', '05', '07', '08', '09'];
    const prefix = cleanPhone.substring(0, 2);
    
    if (!validPrefixes.includes(prefix)) {
      return "Số điện thoại không đúng định dạng Việt Nam";
    }
    
    return "";
  };

  // Fetch provinces data
  useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        const response = await fetch('/data/data.json');
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error('Error loading provinces:', error);
      } finally {
        setIsLoadingProvinces(false);
      }
    };

    fetchProvinces();
  }, []);



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear phone error when user starts typing
    if (name === 'phone') {
      setPhoneError("");
    }

    // Update wards when province changes
    if (name === 'province') {
      const selectedProvince = provinces.find(p => p.province_code === value);
      if (selectedProvince) {
        setSelectedWards(selectedProvince.wards);
      } else {
        setSelectedWards([]);
      }
      // Reset ward when province changes
      setFormData(prev => ({
        ...prev,
        ward: ""
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number if provided
    if (formData.phone) {
      const phoneValidation = validatePhoneNumber(formData.phone);
      if (phoneValidation) {
        setPhoneError(phoneValidation);
        return;
      }
    }
    
    setPhoneError("");
    setIsSubmitting(true);
    
    try {
      // Send data to CMS (same as ContactModal)
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          province: formData.province,
          provinceName: provinces.find(p => p.province_code === formData.province)?.name || '',
          ward: formData.ward,
          wardName: selectedWards.find(w => w.ward_code === formData.ward)?.name || '',
          subject: formData.subject,
          message: formData.message,
          source: 'WEBSITE',
          notes: 'Từ form liên hệ trang Contact'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra');
      }

      console.log("Contact form data saved:", data);
      setSubmitSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          province: "",
          ward: "",
          subject: "",
          message: ""
        });
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving contact data:', error);
      // Still show success to user even if API fails
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f7f2] to-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/banner/CONG PHU 4_4.png"
            alt="Contact Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4">
          <h1 className={`text-5xl md:text-6xl font-bold mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Liên Hệ
          </h1>
          <p className={`text-xl md:text-2xl max-w-3xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn cho bạn
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 px-4">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className={`bg-white rounded-2xl p-8 shadow-lg ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Thông tin liên hệ</h2>
              <ContactInfo variant="full" />
            </div>
            
            {/* FAQ Section */}
            <div className={`bg-white rounded-2xl p-8 shadow-lg ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Câu hỏi thường gặp</h2>
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Làm thế nào để đặt phòng?</h4>
                  <p className="text-gray-600 text-sm">Bạn có thể đặt phòng qua website, điện thoại hoặc email. Chúng tôi sẽ xác nhận trong vòng 24 giờ.</p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Có dịch vụ đưa đón không?</h4>
                  <p className="text-gray-600 text-sm">Có, chúng tôi cung cấp dịch vụ đưa đón từ sân bay với phụ phí. Vui lòng đặt trước 24 giờ.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Thời gian check-in/check-out?</h4>
                  <p className="text-gray-600 text-sm">Check-in: 14:00, Check-out: 12:00. Có thể sắp xếp sớm/late check-out theo yêu cầu.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 px-4">
        <div className="max-w-[1440px] mx-auto">  
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className={`bg-white rounded-2xl p-8 shadow-lg ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Gửi tin nhắn cho chúng tôi</h2>
              
              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  Cảm ơn bạn! Tin nhắn đã được gửi thành công. Chúng tôi sẽ liên hệ lại sớm nhất.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                      placeholder="Nhập email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent ${
                        phoneError ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Nhập số điện thoại"
                    />
                    {phoneError && (
                      <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                      Chủ đề *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                    >
                      <option value="">Chọn chủ đề</option>
                      <option value="Đặt phòng">Đặt phòng</option>
                      <option value="Tư vấn dịch vụ">Tư vấn dịch vụ</option>
                      <option value="Sự kiện">Sự kiện</option>
                      <option value="Hợp tác">Hợp tác</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="province" className="block text-sm font-semibold text-gray-700 mb-2">
                      Tỉnh/Thành phố
                    </label>
                    <select
                      id="province"
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent bg-white"
                      disabled={isLoadingProvinces}
                    >
                      <option value="">Chọn tỉnh/thành phố</option>
                      {isLoadingProvinces ? (
                        <option value="" disabled>Đang tải...</option>
                      ) : (
                        provinces.map((province) => (
                          <option key={province.province_code} value={province.province_code}>
                            {province.name}
                          </option>
                        ))
                      )}
                    </select>
                    {provinces.length > 0 && !isLoadingProvinces && (
                      <p className="text-xs text-gray-500 mt-1">{provinces.length} tỉnh/thành phố</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="ward" className="block text-sm font-semibold text-gray-700 mb-2">
                      Xã/Phường
                    </label>
                    <select
                      id="ward"
                      name="ward"
                      value={formData.ward}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent ${
                        !formData.province ? 'bg-gray-100 cursor-not-allowed' : 'bg-white border-gray-300'
                      }`}
                      disabled={!formData.province}
                    >
                      <option value="">
                        {!formData.province ? 'Vui lòng chọn tỉnh/thành phố trước' : 'Chọn xã/phường'}
                      </option>
                      {selectedWards.map((ward) => (
                        <option key={ward.ward_code} value={ward.ward_code}>
                          {ward.name}
                        </option>
                      ))}
                    </select>
                    {formData.province && selectedWards.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">Có {selectedWards.length} xã/phường</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nội dung tin nhắn *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent resize-none"
                    placeholder="Nhập nội dung tin nhắn..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#d11e0f] text-white py-4 px-8 rounded-lg font-semibold text-lg hover:bg-[#b01a0d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
                </button>
              </form>
            </div>

            {/* Map & Additional Info */}
            <div className="space-y-8">
              {/* Map Placeholder */}
              <div className={`bg-white rounded-2xl p-6 shadow-lg ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '400ms' }}>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Vị trí của chúng tôi</h3>
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <div className="text-4xl mb-2 text-[#d11e0f]">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                    </div>
                    <p>Bản đồ sẽ được tích hợp tại đây</p>
                    <p className="text-sm mt-2">
                      {settingsLoading ? 'Đang tải...' : (contactHelpers.getAddress(settings) || 'Địa chỉ chưa được cập nhật')}
                    </p>
                    {contactHelpers.getMapLink(settings) && (
                      <a
                        href={contactHelpers.getMapLink(settings)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 px-4 py-2 bg-[#d11e0f] text-white rounded-lg hover:bg-[#b01a0d] transition-colors text-sm"
                      >
                        Xem trên Google Maps
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
            
            </div>
          </div>
        </div>
      </section>

      {/* Social Media & Newsletter */}
      <section className="py-16 px-4 bg-[#d11e0f]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Kết nối với chúng tôi
          </h2>
          <p className="text-xl mb-8">
            Theo dõi chúng tôi trên mạng xã hội để cập nhật tin tức mới nhất
          </p>
          
          <div className="flex justify-center space-x-6 mb-8">
            {contactHelpers.getFacebookLink(settings) && (
              <a 
                href={contactHelpers.getFacebookLink(settings)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-white/30 p-4 rounded-full transition-colors"
              >
                <FontAwesomeIcon icon={faFacebook} className="text-2xl" />
              </a>
            )}
            {contactHelpers.getWhatsAppLink(settings) && (
              <a 
                href={contactHelpers.getWhatsAppLink(settings)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-white/30 p-4 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </a>
            )}
            {contactHelpers.getZaloLink(settings) && (
              <a 
                href={contactHelpers.getZaloLink(settings)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-white/30 p-4 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z"/>
                </svg>
              </a>
            )}
          </div>

       
        </div>
      </section>
    </div>
  );
} 