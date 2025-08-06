"use client";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

export default function LetterCard() {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

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

    const currentRef = cardRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section className="py-16 bg-white" ref={cardRef}>
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Logo Column - 1/3 */}
            <div className="flex items-center justify-center">
              <div 
                className={`transition-all duration-1000 ease-out transform ${
                  isVisible 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-8 scale-95'
                }`}
              >
                <Image
                  src="/logo-vertical.svg"
                  alt="Ikigaivilla Logo"
                  width={300}
                  height={400}
                  className="max-w-full h-auto hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Content Column - 2/3 */}
            <div className="md:col-span-2">
              <div 
                className={`transition-all duration-1000 ease-out delay-300 transform ${
                  isVisible 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 translate-x-8'
                }`}
              >
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center md:text-left font-svn-manchester">
                  Thư ngỏ
                </h2>
                <div className="text-gray-700 leading-relaxed space-y-4">
                  <p className={`transition-all duration-800 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '0.4s' }}>
                    Kính gửi Quý Ông/Bà, Quý Gia đình và Quý Đối tác,
                  </p>
                  <p className={`transition-all duration-800 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '0.5s' }}>
                    Trước hết, <strong>TRUNG TÂM PHỨC HỢP NGHỈ DƯỠNG IKIGAI VIỆT NAM</strong> xin được gửi lời chào trân trọng, lời cảm ơn chân thành đến Quý vị đã luôn quan tâm, đồng hành và dành sự tin tưởng cho sứ mệnh chăm sóc người cao tuổi của chúng tôi trong suốt thời gian qua.
                  </p>
                  <p className={`transition-all duration-800 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '0.6s' }}>
                    Lấy cảm hứng từ triết lý sống <strong>&quot;IKIGAI&quot;</strong> – lý do để mỗi người thức dậy mỗi sáng, chúng tôi xây dựng IKIGAI Việt Nam không chỉ là nơi an dưỡng tuổi già, mà còn là không gian sống trọn vẹn, bình yên và đầy ý nghĩa. Tại đây, mỗi khách hàng không chỉ được chăm sóc toàn diện về sức khỏe thể chất, tinh thần mà còn được đồng hành cùng các hoạt động vui khỏe, kết nối, sẻ chia và phát triển giá trị sống theo cách riêng của mình.
                  </p>
                  <p className={`transition-all duration-800 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '0.7s' }}>
                    IKIGAI Việt Nam là sự kết hợp giữa mô hình dưỡng lão hiện đại và không gian nghỉ dưỡng khách sạn. Chúng tôi tự hào mang đến:
                  </p>
                  <ul className={`list-disc list-inside space-y-2 ml-4 transition-all duration-800 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '0.8s' }}>
                    <li>Đội ngũ bác sĩ, điều dưỡng và nhân viên tâm huyết, chuyên môn cao, phục vụ 24/7.</li>
                    <li>Không gian xanh, yên tĩnh, an toàn với thiết kế tối ưu cho mọi khách hàng.</li>
                    <li>Các chương trình chăm sóc tinh thần, trị liệu, hoạt động văn hóa – nghệ thuật định kỳ.</li>
                    <li>Dịch vụ nghỉ dưỡng, lưu trú ngắn ngày - dài ngày cho người lớn tuổi & trải nghiệm nghỉ ngơi cho cả gia đình.</li>
                  </ul>
                  <p className={`transition-all duration-800 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '0.9s' }}>
                    Chúng tôi tin rằng: <strong>&quot;Sống thảnh thơi – Sống ý nghĩa – Sống khỏe mạnh&quot;</strong> là quyền được chọn của mỗi người ở bất kỳ độ tuổi nào. Và tại IKIGAI, chúng tôi đồng hành để điều đó trở thành hiện thực.
                  </p>
                  <p className={`transition-all duration-800 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '1.0s' }}>
                    Chúng tôi rất mong có cơ hội được đón tiếp và phục vụ Quý vị cũng như người thân yêu của Quý vị trong thời gian tới. Hãy để IKIGAI là người bạn đồng hành đáng tin cậy của mỗi gia đình, để tuổi già không còn là chặng dừng, mà là hành trình sống đẹp – sống vui – sống trọn vẹn.
                  </p>
                  <p className={`transition-all duration-800 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '1.1s' }}>
                    Trân trọng cảm ơn và kính chúc Quý vị luôn mạnh khỏe, hạnh phúc!
                  </p>
                  <div className={`text-center mt-8 transition-all duration-800 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '1.2s' }}>
                    <p className="font-bold text-lg text-gray-800">
                      TRUNG TÂM PHỨC HỢP NGHỈ DƯỠNG IKIGAI VIỆT NAM
                    </p>
                    <p className="text-[#d11e0f] font-semibold text-lg mt-2">
                      Sống trọn vẹn – An nhiên mỗi ngày!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 