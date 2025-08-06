"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faUsers, faHeart, faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons';

const reasons = [
  {
    icon: faLightbulb,
    title: "Triết lý của chúng tôi",
    desc: "Chúng tôi mang theo triết lý ấy để tạo nên một nơi chốn – không phải bệnh viện, cũng không chỉ là mái ấm – mà là một không gian sống nơi tuổi già được lắng nghe, được tôn trọng, được mỉm cười vì vẫn còn điều để mong chờ.",
  },
  {
    icon: faUsers,
    title: "Cách chúng tôi đồng hành cùng người già",
    desc: "Chúng tôi sống cùng họ – lắng nghe những mẩu chuyện kể đi kể lại, nắm lấy đôi tay run rẩy nhưng đầy ký ức, cùng gieo trồng một khu vườn, hay chỉ đơn giản là ngồi bên nhau dưới một buổi chiều im lặng.",
  },
  {
    icon: faHeart,
    title: "Quan điểm về tuổi già",
    desc: "Với chúng tôi, người già không phải là \"người ở lại\" – mà là những người cần được sống tiếp, một cách đúng nghĩa.",
  },
  {
    icon: faHandHoldingHeart,
    title: "Gửi đến những người con đang loay hoay",
    desc: "Và với bạn – những người con đang loay hoay giữa bổn phận và yêu thương – Ikigai là nơi để bạn nhẹ lòng. Bởi vì ở đây, cha mẹ bạn không bị quên lãng. Họ vẫn có người cạnh bên. Họ vẫn có một lý do để bước thêm một ngày nữa, với nụ cười thật khẽ, nhưng rất thật.",
  },
];

export default function WhyChooseUs() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-[1440px] mx-auto px-4">
        <div 
          className={`text-center mb-10 transition-opacity duration-1000 ease-out ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ willChange: 'opacity' }}
        >
          <div className="text-[#d11e0f] font-semibold mb-2 text-lg">Tại sao chọn chúng tôi?</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Tại sao chọn chúng tôi?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg font-excalifont">
            Ikigai – trong tiếng Nhật – là lý do để ta muốn thức dậy vào buổi sáng. <br /> Là điều khiến trái tim vẫn còn đập không chỉ vì nó phải, mà vì nó muốn.
          </p>
        </div>
        <div 
          className={`grid md:grid-cols-3 gap-8 items-stretch transition-opacity duration-1000 ease-out delay-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ willChange: 'opacity' }}
        >
          {/* Left: 4 cards */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {reasons.map((r, i) => (
              <div 
                key={`reason-${i}`} 
                className={`bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start h-full transition-all duration-800 ease-out ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ 
                  transitionDelay: `${0.5 + i * 0.2}s`,
                  willChange: 'opacity'
                }}
              >
                <div className="mb-4">
                  <FontAwesomeIcon icon={r.icon} className="w-8 h-8 text-[#d11e0f]" />
                </div>
                <div className="font-bold text-xl mb-2">{r.title}</div>
                <div className="text-gray-600">{r.desc}</div>
              </div>
            ))}
          </div>
          {/* Right: Image */}
          <div 
            className={`flex items-center justify-center transition-opacity duration-800 ease-out ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`} 
            style={{ 
              transitionDelay: '1.3s',
              willChange: 'opacity'
            }}
          >
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg min-h-[300px]">
              <Image
                src="/images/ONSEN 10_4.png"
                alt="Caring Team"
                width={500}
                height={500}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}