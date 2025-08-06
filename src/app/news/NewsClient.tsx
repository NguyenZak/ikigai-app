"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useNews } from '@/lib/hooks/useNews';

export default function NewsClient() {
  const { news, loading, error, pagination, currentPage, setPage } = useNews({ 
    page: 1, 
    limit: 6, 
    autoFetch: true 
  });

  const stripHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    const cleanText = stripHtmlTags(text);
    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength) + '...';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d11e0f]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-[#d11e0f] hover:text-[#b01a0d] transition-colors duration-200"
              >
                ← Quay lại Trang chủ
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Tin tức & Sự kiện</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => {
            // Calculate read time (roughly 200 words per minute)
            const cleanContent = stripHtmlTags(item.content);
            const wordCount = cleanContent.split(' ').length;
            const readTime = Math.ceil(wordCount / 200);
            
            return (
              <article 
                key={`news-client-${item.id}`} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image Section */}
                <div className="relative h-48">
                  <Image
                    src={item.featuredImage || "/banner/ONSEN 10_4.png"}
                    alt={item.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/banner/ONSEN 10_4.png";
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#d11e0f] text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Tin tức
                    </span>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-6">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(item.publishedAt)}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {readTime} phút
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 cursor-pointer hover:text-[#d11e0f] transition-colors duration-300">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                    {truncateText(item.content)}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span>Bởi </span>
                      <span className="font-medium">
                        {item.author?.name || item.author?.email || 'Ikigai Villa'}
                      </span>
                    </div>
                    
                    <Link
                      href={`/news/${item.slug}`}
                      className="text-[#d11e0f] font-semibold hover:underline text-sm cursor-pointer transition-all duration-300 hover:scale-105"
                    >
                      Đọc thêm →
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Empty State */}
        {news.length === 0 && !loading && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có tin tức nào</h3>
            <p className="mt-1 text-sm text-gray-500">
              Hiện tại chưa có tin tức nào được đăng tải.
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={`news-page-${page}`}
                  onClick={() => setPage(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    currentPage === page
                      ? 'bg-[#d11e0f] text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setPage(Math.min(pagination.totalPages, currentPage + 1))}
                disabled={currentPage === pagination.totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </nav>
          </div>
        )}
      </main>
    </div>
  );
} 