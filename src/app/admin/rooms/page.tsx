"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

export default function AdminRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('/api/admin/rooms');
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/admin/login');
            return;
          }
          throw new Error('Failed to fetch rooms');
        }
        const data = await response.json();
        setRooms(data.rooms);
      } catch (error) {
        setError('Failed to load rooms');
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [router]);

  const handleDeleteRoom = async (slug: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/rooms/${slug}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete room');
      }

      // Refresh rooms list by removing from state
      setRooms(prev => prev.filter(room => room.slug !== slug));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete room');
      console.error('Error deleting room:', error);
    }
  };

  const parseJsonField = (field: string) => {
    if (!field) return [];
    
    const fieldStr = String(field);
    
    // Check if it's already a comma-separated string (no brackets)
    if (!fieldStr.startsWith('[') && !fieldStr.startsWith('{')) {
      return fieldStr.split(',').map(item => item.trim()).filter(item => item !== '');
    }
    
    try {
      const parsed = JSON.parse(fieldStr);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      // If JSON parsing fails, treat as comma-separated string
      console.log('JSON parse failed for field:', fieldStr, 'Error:', error);
      return fieldStr.split(',').map(item => item.trim()).filter(item => item !== '');
    }
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
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/dashboard"
                className="text-[#d11e0f] hover:text-[#b01a0d] transition-colors duration-200"
              >
                ← Quay lại Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý Phòng</h1>
            </div>
            <Link
              href="/admin/rooms/new"
              className="bg-[#d11e0f] text-white px-4 py-2 rounded-lg hover:bg-[#b01a0d] transition-colors duration-200"
            >
              + Thêm phòng mới
            </Link>
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

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => {
            const images = parseJsonField(room.images);
            const features = parseJsonField(room.features);
            
            return (
              <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Room Image */}
                <div className="relative h-48 bg-gray-200">
                  {images && images.length > 0 ? (
                    <Image
                      src={images[0]}
                      alt={room.name}
                      width={400}
                      height={192}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      room.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {room.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </div>
                </div>

                {/* Room Info */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {room.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {room.description}
                  </p>

                  {/* Room Details */}
                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
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

                  {/* Features */}
                  {features && features.length > 0 && (
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-700">Tiện ích:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {features.slice(0, 3).map((feature: string, index: number) => (
                          <span
                            key={`room-skeleton-${index}`}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                          >
                            {feature}
                          </span>
                        ))}
                        {features.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/rooms/${room.slug}/edit`}
                      className="flex-1 bg-blue-500 text-white text-center py-2 px-3 rounded hover:bg-blue-600 transition-colors duration-200"
                    >
                      Sửa
                    </Link>
                    <button
                      onClick={() => handleDeleteRoom(room.slug)}
                      className="flex-1 bg-red-500 text-white py-2 px-3 rounded hover:bg-red-600 transition-colors duration-200"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {rooms.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có phòng nào</h3>
            <p className="mt-1 text-sm text-gray-500">Bắt đầu bằng cách thêm phòng đầu tiên.</p>
            <div className="mt-6">
              <Link
                href="/admin/rooms/new"
                className="bg-[#d11e0f] text-white px-4 py-2 rounded-lg hover:bg-[#b01a0d] transition-colors duration-200"
              >
                + Thêm phòng mới
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 