"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';

interface Banner {
  id?: number;
  title: string;
  subtitle: string;
  image: string;
  overlay: string;
  statistics: {
    value: string;
    label: string;
  }[];
  order: number;
  active: boolean;
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/admin/banners');
      if (response.ok) {
        const data = await response.json();
        setBanners(data);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;

    try {
      const url = editingBanner.id 
        ? `/api/admin/banners/${editingBanner.id}`
        : '/api/admin/banners';
      
      const method = editingBanner.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingBanner),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setEditingBanner(null);
        fetchBanners();
      }
    } catch (error) {
      console.error('Error saving banner:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa banner này?')) return;

    try {
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchBanners();
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
    }
  };

  const handleImageUpload = (imageUrl: string) => {
    if (editingBanner) {
      setEditingBanner({ ...editingBanner, image: imageUrl });
    }
  };

  const openModal = (banner?: Banner) => {
    if (banner) {
      setEditingBanner({ ...banner });
    } else {
      setEditingBanner({
        title: '',
        subtitle: '',
        image: '',
        overlay: 'from-black/50 to-transparent',
        statistics: [
          { value: '', label: '' },
          { value: '', label: '' },
          { value: '', label: '' }
        ],
        order: banners.length + 1,
        active: true
      });
    }
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={`skeleton-${i}`} className="bg-white rounded-lg shadow p-6">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
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
              <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý Banner</h1>
          </div>
            </div>
            <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Thêm Banner Mới
          </button>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">


      
      


        {/* Banners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-48 bg-gray-200">
                {banner.image && (
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    width={400}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    banner.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {banner.active ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {banner.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {banner.subtitle}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Thứ tự: {banner.order}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openModal(banner)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id!)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {banners.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📷</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Chưa có banner nào
            </h3>
            <p className="text-gray-600 mb-6">
              Tạo banner đầu tiên để hiển thị trên trang chủ
            </p>
            <button
              onClick={() => openModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Thêm Banner Đầu Tiên
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && editingBanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {editingBanner.id ? 'Chỉnh sửa Banner' : 'Thêm Banner Mới'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề chính
                  </label>
                  <input
                    type="text"
                    value={editingBanner.title}
                    onChange={(e) => setEditingBanner({...editingBanner, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={editingBanner.subtitle}
                    onChange={(e) => setEditingBanner({...editingBanner, subtitle: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hình ảnh
                  </label>
                  <ImageUpload
                    onUpload={handleImageUpload}
                    type="general"
                  />
                </div>

                {/* Overlay */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hiệu ứng overlay
                  </label>
                  <select
                    value={editingBanner.overlay}
                    onChange={(e) => setEditingBanner({...editingBanner, overlay: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="from-black/50 to-transparent">Tối vừa phải</option>
                    <option value="from-black/70 to-transparent">Tối nhiều</option>
                    <option value="from-black/30 to-transparent">Tối ít</option>
                    <option value="from-blue-900/50 to-transparent">Xanh đậm</option>
                    <option value="from-red-900/50 to-transparent">Đỏ đậm</option>
                  </select>
                </div>

                {/* Statistics */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thống kê (tối đa 3)
                  </label>
                  <div className="space-y-3">
                    {editingBanner.statistics.map((stat, index) => (
                      <div key={`banner-stat-${index}`} className="flex space-x-3">
                        <input
                          type="text"
                          placeholder="Giá trị"
                          value={stat.value}
                          onChange={(e) => {
                            const newStats = [...editingBanner.statistics];
                            newStats[index].value = e.target.value;
                            setEditingBanner({...editingBanner, statistics: newStats});
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="Nhãn"
                          value={stat.label}
                          onChange={(e) => {
                            const newStats = [...editingBanner.statistics];
                            newStats[index].label = e.target.value;
                            setEditingBanner({...editingBanner, statistics: newStats});
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thứ tự hiển thị
                  </label>
                  <input
                    type="number"
                    value={editingBanner.order}
                    onChange={(e) => setEditingBanner({...editingBanner, order: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    required
                  />
                </div>

                {/* Active Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    checked={editingBanner.active}
                    onChange={(e) => setEditingBanner({...editingBanner, active: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                    Hiển thị banner này
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingBanner(null);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    {editingBanner.id ? 'Cập nhật' : 'Tạo Banner'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 