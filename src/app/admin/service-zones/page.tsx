"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ImageUpload from '../../../components/ImageUpload';
import Image from "next/image";

interface ServiceZone {
  id: number;
  zoneId: string;
  name: string;
  title: string;
  description: string;
  images: string[];
  features: string[];
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ServiceZonesPage() {
  const [serviceZones, setServiceZones] = useState<ServiceZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<ServiceZone | null>(null);
  const [formData, setFormData] = useState({
    zoneId: '',
    name: '',
    title: '',
    description: '',
    images: [] as string[],
    features: [] as string[],
    order: 0,
    active: true
  });

  useEffect(() => {
    fetchServiceZones();
  }, []);

  const fetchServiceZones = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/service-zones');
      if (!response.ok) throw new Error('Failed to fetch service zones');
      const data = await response.json();
      
      // Parse JSON strings to arrays for each service zone
      const parsedServiceZones = data.serviceZones.map((zone: ServiceZone) => ({
        ...zone,
        images: typeof zone.images === 'string' ? JSON.parse(zone.images || '[]') : (zone.images || []),
        features: typeof zone.features === 'string' ? JSON.parse(zone.features || '[]') : (zone.features || [])
      }));
      
      setServiceZones(parsedServiceZones);
    } catch (error) {
      console.error('Error fetching service zones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingZone 
        ? `/api/admin/service-zones/${editingZone.id}`
        : '/api/admin/service-zones';
      
      const method = editingZone ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save service zone');

      setIsModalOpen(false);
      setEditingZone(null);
      resetForm();
      fetchServiceZones();
    } catch (error) {
      console.error('Error saving service zone:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service zone?')) return;
    
    try {
      const response = await fetch(`/api/admin/service-zones/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete service zone');
      
      fetchServiceZones();
    } catch (error) {
      console.error('Error deleting service zone:', error);
    }
  };

  const openModal = (zone?: ServiceZone) => {
    if (zone) {
      setEditingZone(zone);
      setFormData({
        zoneId: zone.zoneId,
        name: zone.name,
        title: zone.title,
        description: zone.description,
        images: Array.isArray(zone.images) ? zone.images : [],
        features: Array.isArray(zone.features) ? zone.features : [],
        order: zone.order,
        active: zone.active
      });
    } else {
      setEditingZone(null);
      resetForm();
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      zoneId: '',
      name: '',
      title: '',
      description: '',
      images: [],
      features: [],
      order: 0,
      active: true
    });
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, imageUrl]
    }));
  };

  const handleMultipleImageUpload = (imageUrls: string[]) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
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
                href="/admin/dashboard"
                className="text-[#d11e0f] hover:text-[#b01a0d] transition-colors duration-200"
              >
                ← Quay lại Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý Khu vực Dịch vụ</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Khu vực Dịch vụ</h2>
            <p className="text-gray-600 mt-2">Quản lý các khu vực dịch vụ và tiện ích</p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Thêm Khu vực Mới
          </button>
        </div>

        {/* Service Zones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceZones.map((zone) => (
            <div key={zone.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-48 bg-gray-200">
                {zone.images && zone.images.length > 0 && (
                  <Image
                    src={zone.images[0]}
                    alt={zone.name}
                    className="w-full h-full object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={true}
                  />
                )}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    zone.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {zone.active ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {zone.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {zone.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    ID: {zone.zoneId}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openModal(zone)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => handleDelete(zone.id)}
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

        {serviceZones.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Chưa có khu vực dịch vụ nào
            </h3>
            <p className="text-gray-600 mb-6">
              Tạo khu vực dịch vụ đầu tiên để hiển thị trên trang web
            </p>
            <button
              onClick={() => openModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Tạo Khu vực Đầu tiên
            </button>
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingZone ? 'Chỉnh sửa Khu vực Dịch vụ' : 'Thêm Khu vực Dịch vụ Mới'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zone ID (duy nhất)
                    </label>
                    <input
                      type="text"
                      value={formData.zoneId}
                      onChange={(e) => setFormData({...formData, zoneId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., onsen, lobby-library"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên hiển thị
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Khu onsen ngoài trời"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Khu Onsen Ngoài Trời"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Mô tả chi tiết về khu vực dịch vụ..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thứ tự hiển thị
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      checked={formData.active}
                      onChange={(e) => setFormData({...formData, active: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                      Hiển thị khu vực này
                    </label>
                  </div>
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hình ảnh (có thể upload nhiều ảnh cùng lúc)
                  </label>
                  <ImageUpload 
                    onUpload={handleImageUpload}
                    onMultipleUpload={handleMultipleImageUpload}
                    multiple={true}
                    maxFiles={10}
                    type="services"
                  />
                  {Array.isArray(formData.images) && formData.images.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          Hình ảnh đã chọn ({formData.images.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, images: [] }))}
                          className="text-sm text-red-600 hover:text-red-800 font-medium"
                        >
                          Xóa tất cả
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {formData.images.map((image, index) => (
                          <div key={`service-zone-image-${index}`} className="relative group">
                            <Image
                              src={image}
                              alt={`Image ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                              width={300}
                              height={128}
                              sizes="(max-width: 768px) 50vw, 25vw"
                            />
                            <div className="absolute top-2 right-2 flex space-x-1">
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                title="Xóa ảnh"
                              >
                                ×
                              </button>
                            </div>
                            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                              {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đặc điểm nổi bật
                  </label>
                  <div className="space-y-3">
                    {Array.isArray(formData.features) && formData.features.map((feature, index) => (
                      <div key={`service-zone-feature-${index}`} className="flex space-x-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Đặc điểm..."
                        />
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Xóa
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      + Thêm đặc điểm
                    </button>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingZone(null);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    {editingZone ? 'Cập nhật' : 'Tạo Khu vực'}
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