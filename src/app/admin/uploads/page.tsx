"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface UploadedFile {
  name: string;
  url: string;
  size: number;
  type: string;
  lastModified: Date;
}

export default function AdminUploads() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'rooms' | 'news' | 'services'>('all');


  useEffect(() => {
    fetchUploads();
  }, [selectedType]);

  const fetchUploads = async () => {
    try {
      // This would typically be an API call to get uploaded files
      // For now, we'll simulate with local storage or show a message
      setFiles([]);
    } catch (error) {
      setError('Failed to load uploads');
      console.error('Error fetching uploads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileName: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa file này?')) {
      return;
    }

    try {
      // This would be an API call to delete the file
      console.log('Deleting file:', fileName);
      // Remove from local state
      setFiles(prev => prev.filter(file => file.name !== fileName));
    } catch (error) {
      setError('Failed to delete file');
      console.error('Error deleting file:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
                href="/admin/dashboard"
                className="text-[#d11e0f] hover:text-[#b01a0d] transition-colors duration-200"
              >
                ← Quay lại Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý File Upload</h1>
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

        {/* Filter */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Lọc theo loại:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as 'all' | 'rooms' | 'news' | 'services')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
              >
                <option value="all">Tất cả</option>
                <option value="rooms">Phòng</option>
                <option value="news">Tin tức</option>
                <option value="services">Dịch vụ</option>
              </select>
            </div>
          </div>
        </div>

        {/* Files Grid */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {files.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có file nào</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Các file upload sẽ hiển thị ở đây khi bạn sử dụng tính năng upload trong các form.
                </p>
                <div className="mt-6">
                  <Link
                    href="/admin/rooms/new"
                    className="bg-[#d11e0f] text-white px-4 py-2 rounded-lg hover:bg-[#b01a0d] transition-colors duration-200"
                  >
                    Thêm phòng mới
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {files.map((file, index) => (
                  <div key={`upload-item-${index}`} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="relative">
                      <Image
                        src={file.url}
                        alt={file.name}
                        width={400}
                        height={128}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <button
                        onClick={() => handleDeleteFile(file.name)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors duration-200"
                      >
                        ×
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </h4>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>Kích thước: {formatFileSize(file.size)}</p>
                        <p>Loại: {file.type}</p>
                        <p>Cập nhật: {formatDate(file.lastModified)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upload Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Hướng dẫn sử dụng Cloudinary:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• File upload được lưu trữ trên Cloudinary CDN</li>
            <li>• Hỗ trợ các định dạng: PNG, JPG, GIF, WebP</li>
            <li>• Kích thước tối đa: 5MB per file (tự động nén nếu lớn hơn)</li>
            <li>• Số lượng tối đa: 30 files mỗi lần upload</li>
            <li>• File được tổ chức theo thư mục: ikigaivilla/rooms, ikigaivilla/news, ikigaivilla/services</li>
            <li>• Tự động tối ưu hóa hình ảnh và chuyển đổi định dạng</li>
            <li>• Tự động nén file lớn hơn 5MB xuống 5MB</li>
            <li>• Hỗ trợ responsive images và lazy loading</li>
            <li>• Sử dụng drag & drop hoặc click để upload</li>
          </ul>
        </div>

        {/* Cloudinary Benefits */}
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-green-900 mb-2">Lợi ích của Cloudinary:</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Tốc độ tải trang nhanh hơn với CDN toàn cầu</li>
            <li>• Tự động tối ưu hóa hình ảnh</li>
            <li>• Hỗ trợ responsive images</li>
            <li>• Bảo mật và độ tin cậy cao</li>
            <li>• Không cần quản lý storage local</li>
          </ul>
        </div>
      </main>
    </div>
  );
} 