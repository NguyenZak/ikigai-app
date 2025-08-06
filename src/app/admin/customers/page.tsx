'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  province?: string;
  provinceName?: string;
  ward?: string;
  wardName?: string;
  source: string;
  status: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'LOST' | 'ARCHIVED';
  notes?: string;
  assignedTo?: number;
  assignedUser?: {
    id: number;
    name: string;
    email: string;
  };
  lastContactDate?: string;
  nextFollowUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

const statusColors = {
  NEW: 'bg-blue-100 text-blue-800',
  CONTACTED: 'bg-yellow-100 text-yellow-800',
  CONVERTED: 'bg-green-100 text-green-800',
  LOST: 'bg-red-100 text-red-800',
  ARCHIVED: 'bg-gray-100 text-gray-800'
};



// Highlight component
const HighlightText = ({ text, searchTerm }: { text: string; searchTerm: string }) => {
  if (!searchTerm || !text) return <span>{text}</span>;
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <span>
      {parts.map((part, index) => 
        regex.test(part) ? (
          <mark key={index} className="bg-yellow-200 px-1 rounded">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

export default function CustomersAdminPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    assignedTo: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    province: '',
    provinceName: '',
    ward: '',
    wardName: '',
    source: 'WEBSITE',
    status: 'NEW' as Customer['status'],
    notes: '',
    assignedTo: '',
    lastContactDate: '',
    nextFollowUpDate: ''
  });
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search && filters.search.trim()) {
        params.append('search', filters.search.trim());
      }
      if (filters.status) params.append('status', filters.status);
      if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);

      console.log('Fetching customers with params:', params.toString());
      const response = await fetch(`/api/admin/customers?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Customers data:', data);
      setCustomers(data.customers || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [filters.search, filters.status, filters.assignedTo]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, []);

  const fetchCustomersWithSearch = useCallback(async (searchTerm?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      const searchValue = searchTerm || filters.search;
      if (searchValue && searchValue.trim()) {
        params.append('search', searchValue.trim());
      }
      if (filters.status) params.append('status', filters.status);
      if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);

      console.log('Fetching customers with params:', params.toString());
      const response = await fetch(`/api/admin/customers?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Customers data:', data);
      setCustomers(data.customers || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [filters.search, filters.status, filters.assignedTo]);

  // Debounced search function
  const debouncedFetchCustomers = useCallback((searchTerm: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      fetchCustomersWithSearch(searchTerm);
    }, 500); // 500ms delay
  }, [fetchCustomersWithSearch]);

  // Handle search separately to avoid continuous re-renders
  useEffect(() => {
    if (filters.search) {
      debouncedFetchCustomers(filters.search);
    } else {
      fetchCustomers();
    }
  }, [filters.search, debouncedFetchCustomers, fetchCustomers]);

  // Handle other filters
  useEffect(() => {
    if (!filters.search) {
      fetchCustomers();
    }
  }, [filters.status, filters.assignedTo, filters.search, fetchCustomers]);

  // Initial load
  useEffect(() => {
    fetchCustomers();
    fetchUsers();
  }, [fetchCustomers, fetchUsers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCustomer 
        ? `/api/admin/customers/${editingCustomer.id}`
        : '/api/admin/customers';
      
      const method = editingCustomer ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save customer');

      setIsModalOpen(false);
      setEditingCustomer(null);
      resetForm();
      fetchCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const handleStatusChange = async (id: number, newStatus: Customer['status']) => {
    try {
      // Find the current customer to get all required data
      const currentCustomer = customers.find(customer => customer.id === id);
      if (!currentCustomer) {
        throw new Error('Customer not found');
      }

      const response = await fetch(`/api/admin/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: currentCustomer.name,
          phone: currentCustomer.phone,
          email: currentCustomer.email || '',
          province: currentCustomer.province || '',
          provinceName: currentCustomer.provinceName || '',
          ward: currentCustomer.ward || '',
          wardName: currentCustomer.wardName || '',
          source: currentCustomer.source,
          status: newStatus,
          notes: currentCustomer.notes || '',
          assignedTo: currentCustomer.assignedTo?.toString() || '',
          lastContactDate: currentCustomer.lastContactDate || '',
          nextFollowUpDate: currentCustomer.nextFollowUpDate || ''
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update customer status');
      }
      
      // Update local state immediately for better UX
      setCustomers(prev => prev.map(customer => 
        customer.id === id ? { ...customer, status: newStatus } : customer
      ));
    } catch (error) {
      console.error('Error updating customer status:', error);
      // Revert the change if failed
      fetchCustomers();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    
    try {
      const response = await fetch(`/api/admin/customers/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete customer');
      
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const openModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name,
        phone: customer.phone,
        email: customer.email || '',
        province: customer.province || '',
        provinceName: customer.provinceName || '',
        ward: customer.ward || '',
        wardName: customer.wardName || '',
        source: customer.source,
        status: customer.status,
        notes: customer.notes || '',
        assignedTo: customer.assignedTo?.toString() || '',
        lastContactDate: customer.lastContactDate || '',
        nextFollowUpDate: customer.nextFollowUpDate || ''
      });
    } else {
      setEditingCustomer(null);
      resetForm();
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      province: '',
      provinceName: '',
      ward: '',
      wardName: '',
      source: 'WEBSITE',
      status: 'NEW',
      notes: '',
      assignedTo: '',
      lastContactDate: '',
      nextFollowUpDate: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getAssignedUserName = (assignedTo?: number) => {
    if (!assignedTo) return 'Chưa phân công';
    const user = users.find(u => u.id === assignedTo);
    return user ? user.name : 'Không xác định';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Quản lý khách hàng</h1>
            <button
              onClick={() => openModal()}
              className="bg-[#d11e0f] text-white px-4 py-2 rounded-md hover:bg-[#b01a0d] transition-colors duration-200"
            >
              Thêm khách hàng
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Tên, số điện thoại, email..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
              >
                <option value="">Tất cả</option>
                <option value="NEW">Mới</option>
                <option value="CONTACTED">Đã liên hệ</option>
                <option value="CONVERTED">Đã chuyển đổi</option>
                <option value="LOST">Mất khách</option>
                <option value="ARCHIVED">Đã lưu trữ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phân công cho
              </label>
              <select
                value={filters.assignedTo}
                onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
              >
                <option value="">Tất cả</option>
                {users.map(user => (
                  <option key={user.id} value={user.id.toString()}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Customers List */}
        <div className="bg-white shadow rounded-lg">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d11e0f]"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Liên hệ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phân công
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            <HighlightText text={customer.name} searchTerm={filters.search} />
                          </div>
                          <div className="text-sm text-gray-500">
                            {customer.provinceName && customer.wardName 
                              ? `${customer.wardName}, ${customer.provinceName}`
                              : customer.provinceName || customer.wardName || 'Chưa có địa chỉ'
                            }
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">
                            <HighlightText text={customer.phone} searchTerm={filters.search} />
                          </div>
                          {customer.email && (
                            <div className="text-sm text-gray-500">
                              <HighlightText text={customer.email} searchTerm={filters.search} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={customer.status}
                          onChange={(e) => handleStatusChange(customer.id, e.target.value as Customer['status'])}
                          className={`text-xs px-2 py-1 rounded-full ${statusColors[customer.status]}`}
                        >
                          <option value="NEW">Mới</option>
                          <option value="CONTACTED">Đã liên hệ</option>
                          <option value="CONVERTED">Đã chuyển đổi</option>
                          <option value="LOST">Mất khách</option>
                          <option value="ARCHIVED">Đã lưu trữ</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getAssignedUserName(customer.assignedTo)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(customer.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openModal(customer)}
                          className="text-[#d11e0f] hover:text-[#b01a0d] mr-3"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {customers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Không có khách hàng nào</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingCustomer ? 'Sửa khách hàng' : 'Thêm khách hàng'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên khách hàng *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                  >
                    <option value="NEW">Mới</option>
                    <option value="CONTACTED">Đã liên hệ</option>
                    <option value="CONVERTED">Đã chuyển đổi</option>
                    <option value="LOST">Mất khách</option>
                    <option value="ARCHIVED">Đã lưu trữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phân công cho
                  </label>
                  <select
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                  >
                    <option value="">Chưa phân công</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id.toString()}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d11e0f] focus:border-transparent"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#d11e0f] text-white rounded-md hover:bg-[#b01a0d] transition-colors duration-200"
                  >
                    {editingCustomer ? 'Cập nhật' : 'Thêm'}
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