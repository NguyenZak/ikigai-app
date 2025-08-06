"use client";
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import RichTextEditor from '@/components/RichTextEditor';
import ImageUpload from '@/components/ImageUpload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faSearch, faImage, faTags } from '@fortawesome/free-solid-svg-icons';
import { generateVietnameseSlug } from '@/lib/vietnamese-utils';

interface Author {
  id: string;
  name?: string;
  email: string;
}

interface News {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  featuredImage?: string;
  status: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
}

interface NewsFormData {
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  featuredImage: string;
  status: 'DRAFT' | 'PUBLISHED';
}

export default function EditNews({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const [newsSlug, setNewsSlug] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'preview'>('content');
  const [news, setNews] = useState<News | null>(null);
  const [formData, setFormData] = useState<NewsFormData>({
    title: '',
    content: '',
    excerpt: '',
    slug: '',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    featuredImage: '',
    status: 'DRAFT'
  });

  const fetchNews = useCallback(async (newsSlug: string) => {
    try {
      console.log('Fetching news with slug:', newsSlug);
      
      const response = await fetch(`/api/admin/news/${newsSlug}`);
      console.log('Response status:', response.status);
      
      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }
      
      if (response.status === 403) {
        setError('Bạn không có quyền truy cập trang này');
        setLoading(false);
        return;
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Response error:', errorData);
        
        if (response.status === 404) {
          let errorMessage = `Tin tức với slug "${newsSlug}" không tồn tại.`;
          
          if (errorData.availableSlugs && errorData.availableSlugs.length > 0) {
            errorMessage += ` Các slug có sẵn: ${errorData.availableSlugs.join(', ')}`;
          } else {
            errorMessage += ` Không có tin tức nào trong database.`;
          }
          
          // Add suggestion for creating new news
          errorMessage += ` Bạn có thể tạo tin tức mới tại đây.`;
          
          throw new Error(errorMessage);
        }
        
        const errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!data.news) {
        throw new Error('News data not found in response');
      }
      
      setNews(data.news);

      setFormData({
        title: data.news.title,
        content: data.news.content,
        excerpt: data.news.excerpt || '',
        slug: data.news.slug || '',
        metaTitle: data.news.metaTitle || '',
        metaDescription: data.news.metaDescription || '',
        keywords: data.news.keywords || '',
        featuredImage: data.news.featuredImage || '',
        status: data.news.status as 'DRAFT' | 'PUBLISHED'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load news';
      setError(errorMessage);
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params;
        console.log('Resolved params:', resolvedParams);
        const slug = decodeURIComponent(resolvedParams.slug);
        console.log('Decoded slug:', slug);
        
        // Validate slug format
        if (!slug || slug.trim() === '') {
          setError('News slug is required');
          setLoading(false);
          return;
        }
        
        // Clean slug (remove special characters that might cause issues)
        const cleanSlug = slug.trim().toLowerCase();
        console.log('Clean slug:', cleanSlug);
        
        setNewsSlug(cleanSlug);
        fetchNews(cleanSlug);
      } catch (error) {
        console.error('Error resolving params:', error);
        setError('Failed to resolve news parameters');
        setLoading(false);
      }
    };
    resolveParams();
  }, [params, fetchNews]);

  const handleInputChange = (field: keyof NewsFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({
      ...prev,
      featuredImage: url
    }));
  };

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: generateVietnameseSlug(value),
      metaTitle: value || prev.metaTitle
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
        
      const response = await fetch(`/api/admin/news/${newsSlug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update news');
      }

      router.push('/admin/news');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update news');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'content', label: 'Nội dung', icon: faEye },
    { id: 'seo', label: 'SEO', icon: faSearch },
    { id: 'preview', label: 'Xem trước', icon: faEyeSlash }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d11e0f]"></div>
      </div>
    );
  }

  if (!news && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy tin tức</h2>
          {error && (
            <p className="text-red-600 mb-4">{error}</p>
          )}
          <div className="space-y-3">
            <Link
              href="/admin/news"
              className="block text-[#d11e0f] hover:text-[#b01a0d] transition-colors duration-200"
            >
              Quay lại danh sách tin tức
            </Link>
            <Link
              href="/admin/news/new"
              className="block text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              Tạo tin tức mới
            </Link>
          </div>
        </div>
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
                href="/admin/news"
                className="text-[#d11e0f] hover:text-[#b01a0d] transition-colors duration-200"
              >
                ← Quay lại Danh sách tin tức
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Sửa tin tức: {news?.title || 'Loading...'}</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          {/* News Info */}
          {news && (
            <div className="bg-gray-50 p-4 border-b">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Tác giả:</span>
                  <span className="ml-2 text-gray-600">{news.author?.name || news.author?.email || 'Không xác định'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Tạo lúc:</span>
                  <span className="ml-2 text-gray-600">
                    {new Date(news.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                {news.publishedAt && (
                  <div>
                    <span className="font-medium text-gray-700">Xuất bản:</span>
                    <span className="ml-2 text-gray-600">
                      {new Date(news.publishedAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-700">Cập nhật:</span>
                  <span className="ml-2 text-gray-600">
                    {new Date(news.updatedAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'content' | 'seo' | 'preview')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-[#d11e0f] text-[#d11e0f]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <FontAwesomeIcon icon={tab.icon} className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {!news && loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d11e0f]"></div>
                <span className="ml-3 text-gray-600">Đang tải dữ liệu tin tức...</span>
              </div>
            )}
            
            {news && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Content Tab */}
                {activeTab === 'content' && (
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiêu đề *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                      placeholder="Nhập tiêu đề tin tức..."
                    />
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tóm tắt
                    </label>
                    <textarea
                      rows={3}
                      value={formData.excerpt}
                      onChange={(e) => handleInputChange('excerpt', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                      placeholder="Tóm tắt ngắn gọn về bài viết (hiển thị trong danh sách tin tức)..."
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Tóm tắt sẽ hiển thị trong danh sách tin tức và kết quả tìm kiếm
                    </p>
                  </div>

                  {/* Featured Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hình ảnh nổi bật
                    </label>
                    <div className="space-y-3">
                      {/* ImageUpload Component */}
                      <ImageUpload
                        onUpload={handleImageUpload}
                        type="news"
                        className="mb-4"
                      />
                      
                      {/* URL Input (Alternative) */}
                      <div className="flex items-center space-x-3">
                        <input
                          type="url"
                          value={formData.featuredImage}
                          onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                          placeholder="https://example.com/image.jpg"
                        />
                        <FontAwesomeIcon icon={faImage} className="text-gray-400" />
                      </div>

                      {/* Image Preview */}
                      {formData.featuredImage && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-700">Xem trước:</p>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, featuredImage: '' }));
                              }}
                              className="text-sm text-red-600 hover:text-red-800 transition-colors"
                            >
                              Xóa ảnh
                            </button>
                          </div>
                          <div className="relative w-full max-w-md h-48 border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                            <Image
                              src={formData.featuredImage}
                              alt="Featured image preview"
                              fill
                              className="object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                              Preview
                            </div>
                          </div>
                          <p className="mt-2 text-xs text-gray-500">
                            Ảnh sẽ hiển thị trong danh sách tin tức và trang chi tiết
                          </p>
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Tải ảnh lên (tối đa 5MB) hoặc nhập URL hình ảnh đại diện cho bài viết
                    </p>
                  </div>

                  {/* Rich Text Editor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nội dung *
                    </label>
                    <RichTextEditor
                      content={formData.content}
                      onChange={(content) => handleInputChange('content', content)}
                      placeholder="Bắt đầu viết nội dung bài viết..."
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng thái
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value as 'DRAFT' | 'PUBLISHED')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                    >
                      <option value="DRAFT">Bản nháp</option>
                      <option value="PUBLISHED">Xuất bản</option>
                    </select>
                    <p className="mt-2 text-sm text-gray-500">
                      Chọn &quot;Bản nháp&quot; để lưu và chỉnh sửa sau, hoặc &quot;Xuất bản&quot; để đăng tin tức
                    </p>
                  </div>
                </div>
              )}

                              {/* SEO Tab */}
                {activeTab === 'seo' && (
                <div className="space-y-6">
                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                      placeholder="url-friendly-title"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      URL thân thiện cho SEO. Để trống để tự động tạo từ tiêu đề
                    </p>
                  </div>

                  {/* Meta Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={formData.metaTitle}
                      onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                      placeholder="Tiêu đề hiển thị trong kết quả tìm kiếm..."
                      maxLength={60}
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      {formData.metaTitle.length}/60 ký tự
                    </p>
                  </div>

                  {/* Meta Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.metaDescription}
                      onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                      placeholder="Mô tả ngắn gọn về bài viết (hiển thị trong kết quả tìm kiếm)..."
                      maxLength={160}
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      {formData.metaDescription.length}/160 ký tự
                    </p>
                  </div>

                  {/* Keywords */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Từ khóa SEO
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={formData.keywords}
                        onChange={(e) => handleInputChange('keywords', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                        placeholder="từ khóa 1, từ khóa 2, từ khóa 3..."
                      />
                      <FontAwesomeIcon icon={faTags} className="text-gray-400" />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Các từ khóa quan trọng, phân cách bằng dấu phẩy
                    </p>
                  </div>

                  {/* SEO Preview */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Xem trước kết quả tìm kiếm</h3>
                    <div className="bg-white p-4 rounded border">
                      <div className="text-blue-600 text-sm mb-1">
                        {formData.slug ? `example.com/news/${formData.slug}` : 'example.com/news/...'}
                      </div>
                      <div className="text-lg font-medium text-gray-900 mb-1">
                        {formData.metaTitle || formData.title || 'Tiêu đề bài viết'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formData.metaDescription || formData.excerpt || 'Mô tả bài viết sẽ hiển thị ở đây...'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preview Tab */}
              {activeTab === 'preview' && (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">{formData.title || 'Tiêu đề bài viết'}</h2>
                    {formData.featuredImage && (
                      <Image 
                        src={formData.featuredImage} 
                        alt={formData.title}
                        width={800}
                        height={256}
                        className="w-full h-64 object-cover rounded-lg mb-4"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    {formData.excerpt && (
                      <p className="text-gray-600 mb-4 italic">{formData.excerpt}</p>
                    )}
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: formData.content }}
                    />
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Link
                  href="/admin/news"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Hủy
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-[#d11e0f] text-white rounded-lg hover:bg-[#b01a0d] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 