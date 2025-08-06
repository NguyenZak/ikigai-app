"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';
import Image from 'next/image';
import { generateVietnameseSlug } from '@/lib/vietnamese-utils';

interface RoomFormData {
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
  features: string[];
  images: string[];
  status: 'ACTIVE' | 'INACTIVE';
}

export default function NewRoom() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<RoomFormData>({
    name: '',
    title: '',
    description: '',
    beds: '',
    area: '',
    price: '',
    floor: '',
    rooms: '',
    view: '',
    slug: '',
    features: [], // Sửa từ [''] thành []
    images: [],   // Sửa từ [''] thành []
    status: 'ACTIVE'
  });

  const handleInputChange = (field: keyof RoomFormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNameChange = (value: string) => {
    handleInputChange('name', value);
    // Auto-generate slug if it's empty or if user hasn't manually edited it
    if (!formData.slug || formData.slug === generateVietnameseSlug(formData.name)) {
      handleInputChange('slug', generateVietnameseSlug(value));
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, url]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Filter out empty features and images
      const cleanFeatures = formData.features.filter(f => f.trim() !== '');
      const cleanImages = formData.images.filter(i => i.trim() !== '');

      const response = await fetch('/api/admin/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          features: cleanFeatures,
          images: cleanImages
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create room');
      }

      router.push('/admin/rooms');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/rooms"
                className="text-[#d11e0f] hover:text-[#b01a0d] transition-colors duration-200"
              >
                ← Quay lại Danh sách phòng
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Thêm phòng mới</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên phòng *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                    placeholder="VD: IKIGAI HOA HỒNG"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                    placeholder="VD: ikigai-hoa-hong"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    URL thân thiện cho SEO. Tự động tạo từ tên phòng
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                    placeholder="VD: IKIGAI HOA HỒNG"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giường *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.beds}
                    onChange={(e) => handleInputChange('beds', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                    placeholder="VD: 1 giường (Double twin)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diện tích *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.area}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                    placeholder="VD: 50m²"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                    placeholder="VD: Liên hệ"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tầng *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.floor}
                    onChange={(e) => handleInputChange('floor', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                    placeholder="VD: 4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số phòng *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.rooms}
                    onChange={(e) => handleInputChange('rooms', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                    placeholder="VD: 1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    View *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.view}
                    onChange={(e) => handleInputChange('view', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                    placeholder="VD: Vườn Nhật"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value as 'ACTIVE' | 'INACTIVE')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                  >
                    <option value="ACTIVE">Hoạt động</option>
                    <option value="INACTIVE">Không hoạt động</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                  placeholder="Mô tả chi tiết về phòng..."
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiện ích
                </label>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={`new-room-feature-${index}`} className="flex space-x-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                        placeholder="VD: WiFi miễn phí"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="px-3 py-2 text-red-600 hover:text-red-800 transition-colors duration-200"
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFeature}
                    className="text-[#d11e0f] hover:text-[#b01a0d] transition-colors duration-200"
                  >
                    + Thêm tiện ích
                  </button>
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hình ảnh
                </label>
                
                {/* Image Upload Component */}
                <ImageUpload
                  onUpload={handleImageUpload}
                  type="rooms"
                  multiple={true}
                  className="mb-4"
                />

                {/* Uploaded Images List */}
                {formData.images.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Hình ảnh đã chọn:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {formData.images.filter(Boolean).map((image, index) => (
                        <div key={`new-room-image-${index}`} className="relative group">
                          <Image
                            src={image}
                            alt={`Room image ${index + 1}`}
                            width={400}
                            height={96}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Link
                  href="/admin/rooms"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Hủy
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-[#d11e0f] text-white rounded-lg hover:bg-[#b01a0d] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Đang tạo...' : 'Tạo phòng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
} 