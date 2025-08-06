"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Room {
  id: number;
  name: string;
  title: string;
  description: string;
  beds: string;
  area: string;
  price: string;
  floor: string;
  rooms: string;
  view: string;
  slug: string;
  features: string;
  images: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/rooms?page=${currentPage}&limit=6`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch rooms');
        }
        
        const data = await response.json();
        setRooms(data.rooms);
        setPagination(data.pagination);
      } catch (error) {
        setError('Failed to load rooms');
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [currentPage]);

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d11e0f]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f7f2] to-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/banner/ONSEN 10_4.png"
            alt="Rooms Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Các Hạng Phòng
          </h1>
          <p className={`text-lg md:text-xl lg:text-2xl mb-8 text-gray-200 leading-relaxed transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Khám phá các hạng phòng đẳng cấp tại Ikigai Villa
          </p>
        </div>
      </section>

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-[#d11e0f] hover:text-[#b01a0d] transition-colors duration-200"
              >
                ← Quay lại Trang chủ
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Các hạng phòng</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
              {/* Room Image - Square */}
              <div className="relative aspect-square bg-gray-200">
                {room.images && room.images.length > 0 ? (
                  <Image
                    src={room.images[0]}
                    alt={room.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Room Info */}
              <div className="p-6 flex flex-col h-full">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {room.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {truncateText(room.description)}
                  </p>

                  {/* Room Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Giường:</span>
                      <p className="text-gray-600">{room.beds}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Diện tích:</span>
                      <p className="text-gray-600">{room.area}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Tầng:</span>
                      <p className="text-gray-600">{room.floor}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">View:</span>
                      <p className="text-gray-600">{room.view}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-[#d11e0f]">
                      {room.price}
                    </span>
                  </div>

                  {/* Features */}
                  {room.features && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(() => {
                        let features: string[] = [];
                        try {
                          const featuresStr = String(room.features);
                          if (!featuresStr.startsWith('[') && !featuresStr.startsWith('{')) {
                            features = featuresStr.split(',').map(item => item.trim()).filter(item => item !== '');
                          } else {
                            features = JSON.parse(featuresStr);
                          }
                        } catch {
                          const featuresStr = String(room.features);
                          features = featuresStr.split(',').map(item => item.trim()).filter(item => item !== '');
                        }
                        return features.map((feature: string, index: number) => (
                          <span
                            key={`room-filter-${index}`}
                            className="bg-[#d11e0f] text-white text-xs px-2 py-1 rounded-full"
                          >
                            {feature}
                          </span>
                        ));
                      })()}
                    </div>
                  )}
                </div>

                {/* View Details Button - Always at bottom */}
                <div className="mt-auto pt-4">
                  <Link
                    href={`/rooms/${room.slug}`}
                    className="block w-full bg-[#d11e0f] text-white text-center py-2 px-4 rounded-lg hover:bg-[#b01a0d] transition-colors duration-200"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {rooms.length === 0 && !loading && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có phòng nào</h3>
            <p className="mt-1 text-sm text-gray-500">
              Hiện tại chưa có phòng nào được đăng tải.
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={`room-page-${page}`}
                  onClick={() => setCurrentPage(page)}
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
                onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
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