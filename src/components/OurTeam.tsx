"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface TeamMember {
  id: number;
  name: string;
  title: string;
  img: string;
}

// Fallback data in case API fails
const fallbackTeam: TeamMember[] = [
  {
    id: 1,
    name: "Dr. Michael Evans",
    title: "Geriatric Specialist",
    img: "/team/doctor1.jpg",
  },
  {
    id: 2,
    name: "Dr. Anna Lee",
    title: "Senior Care Physician",
    img: "/team/doctor2.jpg",
  },
  {
    id: 3,
    name: "Dr. John Smith",
    title: "Rehabilitation Expert",
    img: "/team/doctor3.jpg",
  },
  {
    id: 4,
    name: "Dr. Emily Tran",
    title: "Wellness Coordinator",
    img: "/team/doctor4.jpg",
  },
];

function getVisibleCount(width: number) {
  if (width >= 1024) return 4;
  if (width >= 768) return 2;
  return 1;
}

export default function OurTeam() {
  const [current, setCurrent] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [team, setTeam] = useState<TeamMember[]>(fallbackTeam);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  // Fetch team members from API
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/team-members');
        if (response.ok) {
          const data = await response.json();
          if (data.teamMembers && data.teamMembers.length > 0) {
            setTeam(data.teamMembers);
            console.log('Team members loaded:', data.teamMembers);
          } else {
            console.log('No team members found in database, using fallback data');
          }
        } else {
          console.error('API response not ok:', response.status);
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
        // Keep fallback data if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  useEffect(() => {
    setIsClient(true);
    function handleResize() {
      setVisibleCount(getVisibleCount(window.innerWidth));
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
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

    // Fallback: set visible after 1 second if intersection observer fails
    const fallbackTimer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Đảm bảo current không vượt quá maxIndex khi visibleCount thay đổi
  useEffect(() => {
    const maxIndex = team.length - visibleCount;
    setCurrent((c) => Math.min(c, Math.max(0, maxIndex)));
  }, [visibleCount, team.length]);

  if (loading) {
    return (
      <section className="py-20 bg-[#f8f7f2]">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d11e0f] mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  // const maxIndex = team.length - visibleCount;

  const prev = () => {
    if (current === 0) {
      setCurrent(team.length - visibleCount);
    } else {
      setCurrent(current - 1);
    }
  };

  const next = () => {
    if (current >= team.length - visibleCount) {
      setCurrent(0);
    } else {
      setCurrent(current + 1);
    }
  };

  // Tạo mảng hiển thị với vòng lặp
  const getDisplayItems = () => {
    const items = [];
    const count = isClient ? visibleCount : 1;
    for (let i = 0; i < count; i++) {
      const index = (current + i) % team.length;
      items.push(team[index]);
    }
    console.log('Display items:', items);
    return items;
  };

  console.log('OurTeam rendering with team length:', team.length);
  return (
    <section ref={sectionRef} className="py-20 bg-[#f8f7f2]">
      <div className="max-w-[1440px] mx-auto px-4">
        <div className={`text-center mb-10 transition-opacity duration-1000 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`} style={{ willChange: 'opacity' }}>
          <div className="text-[#d11e0f] font-semibold mb-2 text-lg">Đội ngũ của chúng tôi</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Đội ngũ của chúng tôi</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Đội ngũ chuyên gia tận tâm, giàu kinh nghiệm luôn đồng hành cùng khách hàng trên hành trình sống khỏe mạnh và ý nghĩa.
          </p>
        </div>
        <div className={`relative mb-10 transition-opacity duration-1000 ease-out delay-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`} style={{ willChange: 'opacity' }}>
          {/* Slider */}
          <div className="flex overflow-x-hidden">
            {getDisplayItems().map((member, i) => (
              <div 
                key={`team-member-${member.id}-${current}-${i}`} 
                className={`bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col items-center mx-2 min-w-0 w-full mb-10 transition-opacity duration-800 ease-out ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ 
                  transitionDelay: `${0.5 + i * 0.2}s`,
                  willChange: 'opacity'
                }}
              >
                <div className="w-full aspect-[3/4] bg-gray-100">
                  <Image
                    src={member.img || "/images/placeholder.jpg"}
                    alt={member.name}
                    width={400}
                    height={533}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/placeholder.jpg";
                    }}
                  />
                </div>
                <div className="p-6 w-full text-center">
                  <div className="font-bold text-2xl mb-2">{member.name}</div>
                  <div className="text-gray-500 text-lg">{member.title}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Navigation */}
          <button
            onClick={prev}
            className={`absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-[#d11e0f] hover:text-white text-[#d11e0f] p-3 rounded-full shadow transition-opacity duration-500 ease-out ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ 
              transitionDelay: '1.2s',
              willChange: 'opacity'
            }}
            aria-label="Previous"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={next}
            className={`absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-[#d11e0f] hover:text-white text-[#d11e0f] p-3 rounded-full shadow transition-opacity duration-500 ease-out ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ 
              transitionDelay: '1.2s',
              willChange: 'opacity'
            }}
            aria-label="Next"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}