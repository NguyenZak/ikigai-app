"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

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
  features: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export default function RoomDetailPage() {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathSegments = window.location.pathname.split('/');
      const roomSlug = pathSegments[pathSegments.length - 1];
      if (roomSlug) {
        fetchRoom(roomSlug);
      }
    }
  }, []);

  const fetchRoom = async (roomSlug: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/rooms/${roomSlug}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Phòng không tồn tại');
        }
        throw new Error('Failed to fetch room');
      }
      
      const data = await response.json();
      console.log('Room data:', data.room);
      console.log('Images:', data.room.images);
      setRoom(data.room);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load room');
      console.error('Error fetching room:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d11e0f]"></div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || 'Không tìm thấy phòng'}
          </h2>
          <Link
            href="/rooms"
            className="text-[#d11e0f] hover:text-[#b01a0d] transition-colors duration-200"
          >
            Quay lại danh sách phòng
          </Link>
        </div>
      </div>
    );
  }

  console.log('Room data in render:', room);
  console.log('Images in render:', room.images);
  console.log('Images type:', typeof room.images);
  console.log('Images length:', room.images?.length);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/rooms"
                className="text-[#d11e0f] hover:text-[#b01a0d] transition-colors duration-200"
              >
                ← Quay lại Danh sách phòng
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{room.name}</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Room Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Info */}
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {room.name}
                </h2>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {room.description}
                </p>

                {/* Room Specifications */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#d11e0f] rounded-lg flex items-center justify-center mx-auto mb-2">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-medium text-gray-700">Giường</h4>
                    <p className="text-sm text-gray-600">{room.beds}</p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#d11e0f] rounded-lg flex items-center justify-center mx-auto mb-2">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-medium text-gray-700">Diện tích</h4>
                    <p className="text-sm text-gray-600">{room.area}</p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#d11e0f] rounded-lg flex items-center justify-center mx-auto mb-2">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-medium text-gray-700">Tầng</h4>
                    <p className="text-sm text-gray-600">{room.floor}</p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#d11e0f] rounded-lg flex items-center justify-center mx-auto mb-2">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-medium text-gray-700">View</h4>
                    <p className="text-sm text-gray-600">{room.view}</p>
                  </div>
                </div>

                {/* Features */}
                {room.features && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Tiện ích</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {room.features && room.features.length > 0 && room.features.map((feature: string, index: number) => (
                        <div key={`room-feature-${index}`} className="flex items-center">
                          <svg className="w-5 h-5 text-[#d11e0f] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Booking Card */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
                  <h3 className="text-2xl font-bold text-[#d11e0f] mb-4">
                    {room.price}
                  </h3>
                  
                  <div className="space-y-4">
                    <button className="w-full bg-[#d11e0f] text-white py-3 px-4 rounded-lg hover:bg-[#b01a0d] transition-colors duration-200 font-medium">
                      Đặt phòng ngay
                    </button>
                    
                    <button className="w-full border border-[#d11e0f] text-[#d11e0f] py-3 px-4 rounded-lg hover:bg-[#d11e0f] hover:text-white transition-colors duration-200 font-medium">
                      Liên hệ tư vấn
                    </button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Đặt phòng miễn phí
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pinterest Style Image Gallery */}
          {room.images && room.images.length > 0 && (
            <div className="p-6 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Hình ảnh phòng</h3>
              
              {/* Debug info */}
  
              
              <PhotoProvider
                maskOpacity={0.9}
                photoClosable={true}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {room.images
                    .filter(image => image && typeof image === 'string' && image.trim() !== '')
                    .map((image: string, index: number) => {
                      console.log('Rendering image:', image, 'at index:', index);
                      return (
                        <PhotoView key={`image-${index}`} src={image}>
                          <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                            <div className="relative h-48">
                              <Image
                                src={image}
                                alt={`${room.name} - Ảnh ${index + 1}`}
                                fill
                                className="object-cover"
                                loading="lazy"
                                onError={(e) => {
                                  console.error('Image load error:', e);
                                  console.error('Failed image URL:', image);
                                }}
                                onLoad={() => {
                                  console.log('Image loaded successfully:', image);
                                }}
                              />
                            </div>
                            {/* Overlay with zoom icon */}
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                              <div className="opacity-0 hover:opacity-100 transition-opacity duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </PhotoView>
                      );
                    })}
                </div>
              </PhotoProvider>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 