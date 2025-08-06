"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, CalendarIcon, UserIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { formatVietnameseDate } from "@/lib/vietnamese-utils";

interface NewsDetail {
  id: number;
  title: string;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  slug: string;
  publishedAt: string | null;
  createdAt: string;
  author: {
    id: number;
    name: string;
    email: string;
  } | null;
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string | null;
}

export default function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const [currentNews, setCurrentNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const resolvedParams = await params;
        const slug = resolvedParams.slug;

        const response = await fetch(`/api/news/${slug}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Không tìm thấy tin tức');
          } else {
            setError('Có lỗi xảy ra khi tải tin tức');
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        setCurrentNews(data.news);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        setError('Có lỗi xảy ra khi tải tin tức');
        setLoading(false);
      }
    };

    fetchNews();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f2] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d11e0f]"></div>
      </div>
    );
  }

  if (error || !currentNews) {
    return (
      <div className="min-h-screen bg-[#f8f7f2] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {error || 'Không tìm thấy tin tức'}
          </h1>
          <button 
            onClick={() => router.push('/news')}
            className="bg-[#d11e0f] text-white px-6 py-3 rounded-lg hover:bg-[#b01a0d] transition-colors"
          >
            Quay lại trang tin tức
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f2]">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 py-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-[#d11e0f] transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Quay lại
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-4 py-8">
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-96 md:h-[500px]">
            <Image
              src={currentNews.featuredImage || "/images/placeholder.jpg"}
              alt={currentNews.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-6 left-6">
              <span className="bg-[#d11e0f] text-white px-4 py-2 rounded-full text-sm font-semibold">
                Tin tức
              </span>
            </div>
          </div>

          {/* Article Content */}
          <div className="p-8">
            {/* Article Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                {currentNews.title}
              </h1>
              
              <p className="text-xl text-gray-600 mb-6">
                {currentNews.excerpt}
              </p>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-t border-gray-200 pt-6">
                <div className="flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {currentNews.publishedAt ? formatVietnameseDate(currentNews.publishedAt) : formatVietnameseDate(currentNews.createdAt)}
                </div>
                <div className="flex items-center">
                  <UserIcon className="w-4 h-4 mr-2" />
                  {currentNews.author?.name || 'Ikigai Villa'}
                </div>
              </div>
            </div>

            {/* Article Body */}
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: currentNews.content }}
            />

          </div>
        </article>
      </div>
    </div>
  );
} 