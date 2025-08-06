"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ContactSetting {
  key: string;
  value: string;
  label: string;
  type: 'text' | 'url' | 'email' | 'phone';
  placeholder: string;
  description: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<ContactSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');



  useEffect(() => {
    const defaultSettings: ContactSetting[] = [
      {
        key: 'contact_phone',
        value: '',
        label: 'Số điện thoại',
        type: 'phone',
        placeholder: '0123456789',
        description: 'Số điện thoại chính để khách hàng liên hệ'
      },
      {
        key: 'contact_phone_display',
        value: '',
        label: 'Số điện thoại hiển thị',
        type: 'text',
        placeholder: '0123 456 789',
        description: 'Số điện thoại hiển thị trên website (có thể format đẹp hơn)'
      },
      {
        key: 'contact_whatsapp',
        value: '',
        label: 'Link WhatsApp',
        type: 'url',
        placeholder: 'https://wa.me/84123456789',
        description: 'Link WhatsApp để khách hàng chat trực tiếp'
      },
      {
        key: 'contact_facebook',
        value: '',
        label: 'Link Facebook',
        type: 'url',
        placeholder: 'https://facebook.com/ikigaivilla',
        description: 'Link Facebook page của Ikigai Villa'
      },
      {
        key: 'contact_zalo',
        value: '',
        label: 'Link Zalo',
        type: 'url',
        placeholder: 'https://zalo.me/0123456789',
        description: 'Link Zalo để khách hàng liên hệ'
      },
      {
        key: 'contact_email',
        value: '',
        label: 'Email liên hệ',
        type: 'email',
        placeholder: 'info@ikigaivilla.com',
        description: 'Email chính để khách hàng gửi thông tin'
      },
      {
        key: 'contact_address',
        value: '',
        label: 'Địa chỉ',
        type: 'text',
        placeholder: 'Đường ABC, Quận XYZ, TP.HCM',
        description: 'Địa chỉ của Ikigai Villa'
      },
      {
        key: 'contact_map_url',
        value: '',
        label: 'Link Google Maps',
        type: 'url',
        placeholder: 'https://maps.google.com/?q=ikigaivilla',
        description: 'Link Google Maps để khách hàng tìm đường'
      }
    ];

    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings');
        if (response.ok) {
          const data = await response.json();
          const updatedSettings = defaultSettings.map(setting => {
            const savedSetting = data.settings.find((s: { key: string; value: string }) => s.key === setting.key);
            return {
              ...setting,
              value: savedSetting ? savedSetting.value : ''
            };
          });
          setSettings(updatedSettings);
        } else {
          setSettings(defaultSettings);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleInputChange = (key: string, value: string) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.key === key ? { ...setting, value } : setting
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      });

      if (response.ok) {
        setMessage('Cài đặt đã được cập nhật thành công!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Có lỗi xảy ra khi cập nhật cài đặt');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      setMessage('Có lỗi xảy ra khi cập nhật cài đặt');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cài đặt liên hệ</h1>
              <p className="text-gray-600 mt-2">
                Quản lý thông tin liên hệ hiển thị trên website
              </p>
            </div>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Quay lại Dashboard
            </button>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes('thành công') 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {settings.map((setting) => (
                <div key={setting.key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {setting.label}
                  </label>
                  <input
                    type={setting.type}
                    value={setting.value}
                    onChange={(e) => handleInputChange(setting.key, e.target.value)}
                    placeholder={setting.placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  />
                  <p className="text-xs text-gray-500">
                    {setting.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <span>Lưu cài đặt</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 