'use client';
import { useState, useEffect } from 'react';
import ImageUpload from '@/components/ImageUpload';
import Image from 'next/image';

interface TeamMember {
  id: number;
  name: string;
  title: string;
  img: string;
  createdAt: string;
  updatedAt: string;
}

export default function TeamAdminPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    img: ''
  });

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/team-members');
      
      if (response.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      
      if (!response.ok) throw new Error('Failed to fetch team members');
      
      const data = await response.json();
      setTeamMembers(data.teamMembers);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingMember 
        ? `/api/admin/team-members/${editingMember.id}`
        : '/api/admin/team-members';
      
      const method = editingMember ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.status === 401) {
        window.location.href = '/admin/login';
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save team member');
      }

      setIsModalOpen(false);
      setEditingMember(null);
      resetForm();
      fetchTeamMembers();
    } catch (error) {
      console.error('Error saving team member:', error);
      alert(error instanceof Error ? error.message : 'Failed to save team member');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    
    try {
      const response = await fetch(`/api/admin/team-members/${id}`, {
        method: 'DELETE'
      });
      
      if (response.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete team member');
      }
      
      fetchTeamMembers();
    } catch (error) {
      console.error('Error deleting team member:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete team member');
    }
  };

  const openModal = (member?: TeamMember) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        title: member.title,
        img: member.img
      });
    } else {
      setEditingMember(null);
      resetForm();
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      img: ''
    });
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      img: imageUrl
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
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý Đội ngũ</h1>
            <p className="text-gray-600 mt-2">
              Thêm, chỉnh sửa và xóa thành viên đội ngũ
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-[#d11e0f] hover:bg-[#b01a0d] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Thêm Thành viên Mới
          </button>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-48 bg-gray-200">
                {member.img && (
                  <Image
                    src={member.img}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {member.title}
                </p>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    ID: {member.id}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openModal(member)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
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

        {teamMembers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Chưa có thành viên nào
            </h3>
            <p className="text-gray-600 mb-6">
              Thêm thành viên đầu tiên để hiển thị trên trang web
            </p>
            <button
              onClick={() => openModal()}
              className="bg-[#d11e0f] hover:bg-[#b01a0d] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Thêm Thành viên Đầu tiên
            </button>
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingMember ? 'Chỉnh sửa Thành viên' : 'Thêm Thành viên Mới'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên thành viên
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập tên thành viên"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vị trí/Chức danh
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập vị trí/chức danh"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ảnh đại diện
                  </label>
                  <ImageUpload onUpload={handleImageUpload} />
                  {formData.img && (
                    <div className="mt-4">
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                        <Image
                          src={formData.img}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingMember(null);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#d11e0f] hover:bg-[#b01a0d] text-white rounded-lg font-medium transition-colors"
                  >
                    {editingMember ? 'Cập nhật' : 'Thêm Thành viên'}
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