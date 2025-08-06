"use client";
import { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  onMultipleUpload?: (urls: string[]) => void;
  type?: 'rooms' | 'news' | 'services' | 'general';
  className?: string;
  multiple?: boolean;
  maxFiles?: number;
}

interface UploadedFile {
  originalName: string;
  filename: string;
  url: string;
  size: number;
  originalSize?: number;
  compressedSize?: number;
  type: string;
  cloudinaryId?: string;
  wasCompressed?: boolean;
}

export default function ImageUpload({ 
  onUpload, 
  onMultipleUpload,
  type = 'general', 
  className = '',
  multiple = false,
  maxFiles = 100
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Check max files limit
    if (multiple && uploadedFiles.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setError('');
    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload failed');
        }

        const data = await response.json();
        return data.file;
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      
      if (multiple) {
        setUploadedFiles(prev => [...prev, ...uploadedFiles]);
        const urls = uploadedFiles.map(file => file.url);
        if (onMultipleUpload) {
          onMultipleUpload(urls);
        } else {
          uploadedFiles.forEach(file => onUpload(file.url));
        }
      } else {
        setUploadedFiles(uploadedFiles);
        onUpload(uploadedFiles[0].url);
      }

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-[#d11e0f]', 'bg-red-50');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-[#d11e0f]', 'bg-red-50');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-[#d11e0f]', 'bg-red-50');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      // Check max files limit
      if (multiple && uploadedFiles.length + files.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        return;
      }
      
      const input = fileInputRef.current;
      if (input) {
        input.files = files;
        handleFileSelect({ target: { files } } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  const removeFile = async (index: number) => {
    const fileToRemove = uploadedFiles[index];
    
    // If the file has a Cloudinary ID, delete it from Cloudinary
    if (fileToRemove.cloudinaryId) {
      try {
        const response = await fetch(`/api/admin/upload/delete?publicId=${fileToRemove.cloudinaryId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          console.error('Failed to delete from Cloudinary');
        }
      } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
      }
    }

    // Remove from local state
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number, decimalPoint = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimalPoint < 0 ? 0 : decimalPoint;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className={className}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#d11e0f] transition-colors duration-200 ${
          uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        
        <div className="space-y-2">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          
          <div className="text-sm text-gray-600">
            <span className="font-medium text-[#d11e0f]">Click to upload</span> or drag and drop
          </div>
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF up to 15MB per file (tự động nén nếu lớn hơn 5MB, nén mạnh nếu &gt; 10MB)
            {multiple && ` • Max ${maxFiles} files`}
          </p>
        </div>

        {uploading && (
          <div className="mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#d11e0f] mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Uploading to Cloudinary...</p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Uploaded Files Preview */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Uploaded Images ({uploadedFiles.length}):
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedFiles.map((file, index) => (
                              <div key={`upload-image-${index}`} className="relative group">
                <Image
                  src={file.url}
                  alt={file.originalName}
                  width={400}
                  height={96}
                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                />
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  title="Remove image"
                >
                  ×
                </button>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {file.originalName}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  ✓ Cloudinary
                </p>
                {file.wasCompressed && (
                  <p className="text-xs text-orange-600 mt-1">
                    🔄 Tự động nén
                  </p>
                )}
                {file.originalSize && file.compressedSize && (
                  <p className="text-xs text-blue-600 mt-1">
                    {formatFileSize(file.originalSize)} → {formatFileSize(file.compressedSize)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 