"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useNews } from "@/lib/hooks/useNews";

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  slug?: string;
}

export default function NewsSlider() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [componentId] = useState(() => Math.random().toString(36).substr(2, 9));
  
  // Sử dụng custom hook để lấy dữ liệu tin tức
  const { news, loading, error } = useNews({ limit: 8, autoFetch: true });

  useEffect(() => {
    setIsClient(true);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Transform news data to NewsItem format
  const newsData: NewsItem[] = news.map(item => {
    // Strip HTML tags and create excerpt from content (first 100 characters)
    const cleanContent = item.content.replace(/<[^>]*>/g, '');
    const excerpt = cleanContent.length > 100 
      ? cleanContent.substring(0, 100) + '...' 
      : cleanContent;
    
    // Format date
    const date = new Date(item.publishedAt || item.createdAt).toLocaleDateString('vi-VN');
    
    // Calculate read time (roughly 200 words per minute)
    const wordCount = cleanContent.split(' ').length;
    const readTime = Math.ceil(wordCount / 200);
    
    return {
      id: parseInt(item.id),
      title: item.title,
      excerpt: excerpt,
      image: item.featuredImage || "/banner/ONSEN 10_4.png", // Use featured image or default
      category: "Tin tức", // Default category
      date: date,
      readTime: `${readTime} phút`,
      slug: item.slug
    };
  });







  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 4 >= newsData.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.max(0, newsData.length - 4) : prevIndex - 1
    );
  };

  const getVisibleNews = () => {
    const visibleNews = [];
    // On mobile, show 1 card, on tablet show 2, on desktop show 4
    const cardsToShow = isClient ? (windowWidth < 768 ? 1 : windowWidth < 1024 ? 2 : 4) : 1;
    
    // Kiểm tra nếu newsData rỗng
    if (newsData.length === 0) {
      return [];
    }
    
    for (let i = 0; i < cardsToShow; i++) {
      const index = (currentIndex + i) % newsData.length;
      visibleNews.push(newsData[index]);
    }
    return visibleNews;
  };

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-b from-white to-[#f8f7f2]">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Tin Tức & Sự Kiện
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cập nhật những tin tức mới nhất về Ikigai Villa và các sự kiện đặc biệt
            </p>
          </div>
          
          {/* Loading skeleton giống RoomSlider */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:px-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <article 
                key={`news-skeleton-${index}`}
                className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
              >
                <div className="relative h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="flex items-center justify-between">
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4 bg-gradient-to-b from-white to-[#f8f7f2]">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Tin Tức & Sự Kiện
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cập nhật những tin tức mới nhất về Ikigai Villa và các sự kiện đặc biệt
            </p>
          </div>
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-[#d11e0f] text-white px-6 py-3 rounded-lg hover:bg-[#b01a0d] transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (newsData.length === 0) {
    return (
      <section className="py-20 px-4 bg-gradient-to-b from-white to-[#f8f7f2]">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Tin Tức & Sự Kiện
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cập nhật những tin tức mới nhất về Ikigai Villa và các sự kiện đặc biệt
            </p>
          </div>
          <div className="text-center text-gray-500">
            <p>Chưa có tin tức nào được đăng.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-[#f8f7f2]">
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Tin Tức & Sự Kiện
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cập nhật những tin tức mới nhất về Ikigai Villa và các sự kiện đặc biệt
          </p>
        </div>

        {/* News Slider */}
        <div className="relative">
          {/* Navigation Buttons */}
          {newsData.length > 4 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-[#d11e0f] hover:text-white text-[#d11e0f] p-3 rounded-full shadow transition-all duration-300 hover:scale-110 touch-manipulation z-30"
                aria-label="Previous"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-[#d11e0f] hover:text-white text-[#d11e0f] p-3 rounded-full shadow transition-all duration-300 hover:scale-110 touch-manipulation z-30"
                aria-label="Next"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            </>
          )}

          {/* News Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:px-8">
            {getVisibleNews().map((news, index) => (
              <article 
                key={`news-slider-${componentId}-${news.id}-${currentIndex}-${index}`} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-48">
                  <Image
                    src={news.image}
                    alt={news.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#d11e0f] text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {news.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {news.date}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {news.readTime}
                    </span>
                  </div>
                  <h3 
                    className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 cursor-pointer hover:text-[#d11e0f] transition-colors duration-300"
                    onClick={() => {
                      const routeSlug = news.slug && news.slug.trim() !== '' ? news.slug : news.id;
                      router.push(`/news/${routeSlug}`);
                    }}
                  >
                    {news.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                    {news.excerpt}
                  </p>
                  <div className="text-right">
                    <button 
                      onClick={() => {
                        const routeSlug = news.slug && news.slug.trim() !== '' ? news.slug : news.id;
                        router.push(`/news/${routeSlug}`);
                      }}
                      className="text-[#d11e0f] font-semibold hover:underline text-sm cursor-pointer transition-all duration-300 hover:scale-105"
                    >
                      Đọc thêm →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button 
            onClick={() => router.push('/news')}
            className="bg-[#d11e0f] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#b01a0d] transition-colors duration-300"
          >
            Xem tất cả tin tức
          </button>
        </div>
      </div>
    </section>
  );
} 