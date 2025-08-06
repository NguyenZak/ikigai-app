"use client";
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

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
}

interface Booking {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalAmount: number;
  specialRequests?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
  room: {
    id: number;
    name: string;
    price: string;
    description: string;
  };
}

export default function EditBookingPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    roomId: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    roomPrice: 0,
    totalAmount: 0,
    specialRequests: '',
    status: 'PENDING' as const,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsResponse, bookingResponse] = await Promise.all([
          fetch('/api/admin/rooms'),
          fetch(`/api/admin/bookings/${bookingId}`)
        ]);

        if (!roomsResponse.ok || !bookingResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [roomsData, bookingResponseData] = await Promise.all([
          roomsResponse.json(),
          bookingResponse.json()
        ]);

        if (!bookingResponseData || !bookingResponseData.booking || !bookingResponseData.booking.id) {
          throw new Error('Booking not found');
        }

        const bookingData = bookingResponseData.booking;
        setRooms(roomsData.rooms || []);
        setBooking(bookingData);

        // Pre-fill form data
        setFormData({
          customerName: bookingData.customerName || '',
          customerEmail: bookingData.customerEmail || '',
          customerPhone: bookingData.customerPhone || '',
          roomId: bookingData.roomId ? bookingData.roomId.toString() : '',
          checkInDate: bookingData.checkInDate ? bookingData.checkInDate.split('T')[0] : '',
          checkOutDate: bookingData.checkOutDate ? bookingData.checkOutDate.split('T')[0] : '',
          numberOfGuests: bookingData.numberOfGuests || 1,
          roomPrice: bookingData.room?.price ? parseInt(bookingData.room.price, 10) : 0,
          totalAmount: bookingData.totalAmount || 0,
          specialRequests: bookingData.specialRequests || '',
          status: bookingData.status || 'PENDING',
        });

      } catch (error) {
        setError('Failed to load booking data');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [bookingId]);

  // Tự động tính tổng tiền khi có thay đổi
  // useEffect will be moved after calculateTotalAmount

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Xử lý giá trị cho các trường number
    let processedValue: string | number = value;
    if (name === 'numberOfGuests' || name === 'roomPrice' || name === 'totalAmount') {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        processedValue = name === 'numberOfGuests' ? 1 : 0;
      } else {
        processedValue = numValue;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Tự động điền giá phòng khi chọn phòng
    if (name === 'roomId' && value) {
      const selectedRoom = rooms.find(room => room.id === parseInt(value, 10));
      if (selectedRoom) {
        const roomPrice = parseInt(selectedRoom.price, 10);
        if (!isNaN(roomPrice)) {
          setFormData(prev => ({
            ...prev,
            roomPrice: roomPrice
          }));
        }
      }
    }

    // Auto-calculate total amount when room, dates, or room price change
    if (name === 'roomId' || name === 'checkInDate' || name === 'checkOutDate' || name === 'roomPrice') {
      calculateTotalAmount();
    }
  };

  const calculateTotalAmount = useCallback(() => {
    if (formData.roomId && formData.checkInDate && formData.checkOutDate) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      
      // Kiểm tra ngày hợp lệ
      if (checkIn >= checkOut || isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
        setFormData(prev => ({ ...prev, totalAmount: 0 }));
        return;
      }
      
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      
      // Lấy giá phòng từ danh sách phòng hoặc từ input roomPrice
      let pricePerNight = formData.roomPrice || 0;
      if (formData.roomId && rooms.length > 0) {
        const selectedRoom = rooms.find(room => room.id === parseInt(formData.roomId, 10));
        if (selectedRoom) {
          const parsedPrice = parseInt(selectedRoom.price, 10);
          if (!isNaN(parsedPrice)) {
            pricePerNight = parsedPrice;
            // Cập nhật roomPrice nếu chưa được set
            if (!formData.roomPrice || formData.roomPrice === 0) {
              setFormData(prev => ({ ...prev, roomPrice: pricePerNight }));
            }
          }
        }
      }
      
      // Kiểm tra giá trị hợp lệ
      if (isNaN(pricePerNight) || isNaN(nights)) {
        setFormData(prev => ({ ...prev, totalAmount: 0 }));
        return;
      }
      
      const total = pricePerNight * nights;
      setFormData(prev => ({ ...prev, totalAmount: total }));
    } else {
      setFormData(prev => ({ ...prev, totalAmount: 0 }));
    }
  }, [formData.roomId, formData.checkInDate, formData.checkOutDate, formData.roomPrice, rooms]);

  // Tự động tính tổng tiền khi có thay đổi
  useEffect(() => {
    calculateTotalAmount();
  }, [calculateTotalAmount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update booking');
      }

      setSuccess('Cập nhật booking thành công!');
      setTimeout(() => {
        router.push('/admin/bookings');
      }, 2000);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update booking');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    if (isNaN(amount) || amount === null || amount === undefined) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(0);
    }
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d11e0f]"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy booking</h2>
          <Link
            href="/admin/bookings"
            className="text-[#d11e0f] hover:text-[#b01a0d] transition-colors duration-200"
          >
            Quay lại Bookings
          </Link>
        </div>
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
                href="/admin/bookings"
                className="text-[#d11e0f] hover:text-[#b01a0d] transition-colors duration-200"
              >
                ← Quay lại Bookings
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Sửa Booking</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Booking Info */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin Booking</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">ID:</span>
                <span className="ml-2 text-gray-900">{booking.id}</span>
              </div>
              <div>
                <span className="font-medium text-gray-500">Ngày tạo:</span>
                <span className="ml-2 text-gray-900">{formatDate(booking.createdAt)}</span>
              </div>
              <div>
                <span className="font-medium text-gray-500">Phòng hiện tại:</span>
                <span className="ml-2 text-gray-900">{booking.room.name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-500">Trạng thái hiện tại:</span>
                <span className="ml-2 text-gray-900">{booking.status}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin khách hàng</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên khách hàng *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số khách *
                    </label>
                    <input
                      type="number"
                      name="numberOfGuests"
                      value={formData.numberOfGuests || 1}
                      onChange={handleInputChange}
                      min="1"
                      max="10"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá phòng/đêm (VND) *
                    </label>
                    <input
                      type="number"
                      name="roomPrice"
                      value={formData.roomPrice || 0}
                      onChange={handleInputChange}
                      min="0"
                      step="1000"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                      placeholder="Nhập giá phòng..."
                    />
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Chi tiết đặt phòng</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phòng *
                    </label>
                    <select
                      name="roomId"
                      value={formData.roomId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                    >
                      <option value="">Chọn phòng</option>
                      {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.name} - {formatCurrency(parseInt(room.price, 10))}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng thái
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                    >
                      <option value="PENDING">Chờ xác nhận</option>
                      <option value="CONFIRMED">Đã xác nhận</option>
                      <option value="CANCELLED">Đã hủy</option>
                      <option value="COMPLETED">Hoàn thành</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày check-in *
                    </label>
                    <input
                      type="date"
                      name="checkInDate"
                      value={formData.checkInDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày check-out *
                    </label>
                    <input
                      type="date"
                      name="checkOutDate"
                      value={formData.checkOutDate}
                      onChange={handleInputChange}
                      required
                      min={formData.checkInDate}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent ${
                        formData.checkOutDate && formData.checkInDate && 
                        new Date(formData.checkOutDate) <= new Date(formData.checkInDate)
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300'
                      }`}
                    />
                    {formData.checkOutDate && formData.checkInDate && 
                     new Date(formData.checkOutDate) <= new Date(formData.checkInDate) && (
                      <p className="mt-1 text-sm text-red-600">
                        Ngày check-out phải sau ngày check-in
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yêu cầu đặc biệt
                </label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                  placeholder="Nhập yêu cầu đặc biệt nếu có..."
                />
              </div>

              {/* Total Amount */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900">Tổng tiền:</span>
                  <span className="text-2xl font-bold text-[#d11e0f]">
                    {formatCurrency(formData.totalAmount || 0)}
                  </span>
                </div>
                {formData.roomId && formData.checkInDate && formData.checkOutDate && (formData.totalAmount || 0) > 0 && (
                  <div className="mt-3 space-y-1">
                    <div className="text-sm text-gray-600">
                      {(() => {
                        const checkIn = new Date(formData.checkInDate);
                        const checkOut = new Date(formData.checkOutDate);
                        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
                        const selectedRoom = rooms.find(room => room.id === parseInt(formData.roomId, 10));
                        return `${nights} đêm × ${formatCurrency(selectedRoom ? parseFloat(selectedRoom.price) : 0)}/đêm`;
                      })()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {(() => {
                        const checkIn = new Date(formData.checkInDate);
                        const checkOut = new Date(formData.checkOutDate);
                        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
                        return `Check-in: ${checkIn.toLocaleDateString('vi-VN')} | Check-out: ${checkOut.toLocaleDateString('vi-VN')} (${nights} đêm)`;
                      })()}
                    </div>
                  </div>
                )}
                {formData.roomId && formData.checkInDate && formData.checkOutDate && (formData.totalAmount || 0) === 0 && (
                  <div className="mt-2 text-sm text-red-600">
                    ⚠️ Vui lòng kiểm tra lại ngày check-in và check-out
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Link
                  href="/admin/bookings"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Hủy
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-[#d11e0f] text-white rounded-md hover:bg-[#b01a0d] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Đang cập nhật...' : 'Cập nhật booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
} 