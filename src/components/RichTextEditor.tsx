"use client";
import { useEditor, EditorContent } from '@tiptap/react';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBold,
  faItalic,
  faUnderline,
  faStrikethrough,
  faListUl,
  faListOl,
  faQuoteLeft,
  faCode,
  faUndo,
  faRedo,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faAlignJustify,
  faLink,
  faUnlink,
  faImage,
  faTable,
  faHighlighter,
  faPalette,
  faHeading,
  faParagraph,
  faUpload,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const [isUploading, setIsUploading] = useState(false);
  
  if (!editor) {
    return null;
  }

  const uploadImage = async (file: File) => {
    if (!file) return;

    // Validation
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('Kích thước file quá lớn. Vui lòng chọn file nhỏ hơn 5MB.');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP).');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      if (data.url) {
        editor.chain().focus().setImage({ src: data.url }).run();
        // Hiển thị thông báo thành công nhỏ
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
        notification.textContent = 'Tải ảnh thành công!';
        document.body.appendChild(notification);
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 3000);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Lỗi khi tải ảnh lên: ${error instanceof Error ? error.message : 'Vui lòng thử lại.'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = () => {
    if (isUploading) return;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        uploadImage(file);
      }
    };
    input.click();
  };

  const addImage = () => {
    const url = window.prompt('Nhập URL hình ảnh:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const url = window.prompt('Nhập URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  const colors = [
    '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
    '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
    '#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc',
    '#dd7e6b', '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#a4c2f4', '#b4a7d6', '#d5a6bd', '#c27ba0',
    '#cc4125', '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6d9eeb', '#6fa8dc', '#8e7cc3', '#a64d79',
    '#a61c00', '#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3c78d8', '#3d85c6', '#674ea7', '#741b47',
    '#85200c', '#990000', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#1155cc', '#0b5394', '#351c75', '#4c1130',
    '#5b0f00', '#660000', '#783f04', '#7f6000', '#274e13', '#0c343d', '#073763', '#20124d', '#741b47', '#4c1130'
  ].filter((color, index, arr) => arr.indexOf(color) === index);

  return (
    <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2">
      <div className="flex flex-wrap gap-1">
        {/* Text Formatting */}
        <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-300' : ''}`}
            title="Bold"
          >
            <FontAwesomeIcon icon={faBold} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-300' : ''}`}
            title="Italic"
          >
            <FontAwesomeIcon icon={faItalic} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-gray-300' : ''}`}
            title="Underline"
          >
            <FontAwesomeIcon icon={faUnderline} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('strike') ? 'bg-gray-300' : ''}`}
            title="Strikethrough"
          >
            <FontAwesomeIcon icon={faStrikethrough} />
          </button>
        </div>

        {/* Headings */}
        <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''}`}
            title="Heading 1"
          >
            <FontAwesomeIcon icon={faHeading} className="text-sm" />
            <span className="text-xs ml-1">1</span>
          </button>
          <button
            onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''}`}
            title="Heading 2"
          >
            <FontAwesomeIcon icon={faHeading} className="text-sm" />
            <span className="text-xs ml-1">2</span>
          </button>
          <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('paragraph') ? 'bg-gray-300' : ''}`}
            title="Paragraph"
          >
            <FontAwesomeIcon icon={faParagraph} />
          </button>
        </div>

        {/* Lists */}
        <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-300' : ''}`}
            title="Bullet List"
          >
            <FontAwesomeIcon icon={faListUl} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-300' : ''}`}
            title="Numbered List"
          >
            <FontAwesomeIcon icon={faListOl} />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''}`}
            title="Align Left"
          >
            <FontAwesomeIcon icon={faAlignLeft} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''}`}
            title="Align Center"
          >
            <FontAwesomeIcon icon={faAlignCenter} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''}`}
            title="Align Right"
          >
            <FontAwesomeIcon icon={faAlignRight} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-300' : ''}`}
            title="Justify"
          >
            <FontAwesomeIcon icon={faAlignJustify} />
          </button>
        </div>

        {/* Links and Media */}
        <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            onClick={setLink}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-300' : ''}`}
            title="Add Link"
          >
            <FontAwesomeIcon icon={faLink} />
          </button>
          <button
            onClick={removeLink}
            className="p-2 rounded hover:bg-gray-200"
            title="Remove Link"
          >
            <FontAwesomeIcon icon={faUnlink} />
          </button>
          <div className="relative group">
            <button
              onClick={handleImageUpload}
              disabled={isUploading}
              className={`p-2 rounded hover:bg-gray-200 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isUploading ? "Đang tải ảnh..." : "Tải ảnh lên"}
            >
              <FontAwesomeIcon icon={isUploading ? faSpinner : faUpload} className={isUploading ? 'animate-spin' : ''} />
            </button>
            <div className="absolute top-full left-0 mt-1 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20">
              Tải ảnh lên (tối đa 5MB)
            </div>
          </div>
          <button
            onClick={addImage}
            className="p-2 rounded hover:bg-gray-200"
            title="Thêm ảnh từ URL"
          >
            <FontAwesomeIcon icon={faImage} />
          </button>
        </div>

        {/* Tables */}
        <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            className="p-2 rounded hover:bg-gray-200"
            title="Insert Table"
          >
            <FontAwesomeIcon icon={faTable} />
          </button>
        </div>

        {/* Highlight and Color */}
        <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('highlight') ? 'bg-gray-300' : ''}`}
            title="Highlight"
          >
            <FontAwesomeIcon icon={faHighlighter} />
          </button>
          <div className="relative group">
            <button className="p-2 rounded hover:bg-gray-200" title="Text Color">
              <FontAwesomeIcon icon={faPalette} />
            </button>
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-10 hidden group-hover:block">
              <div className="grid grid-cols-10 gap-1 w-80">
                {colors.map((color) => (
                  <button
                    key={`color-${color}`}
                    onClick={() => editor.chain().focus().setColor(color).run()}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Code and Quote */}
        <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-300' : ''}`}
            title="Quote"
          >
            <FontAwesomeIcon icon={faQuoteLeft} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('codeBlock') ? 'bg-gray-300' : ''}`}
            title="Code Block"
          >
            <FontAwesomeIcon icon={faCode} />
          </button>
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-1">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            className="p-2 rounded hover:bg-gray-200"
            title="Undo"
          >
            <FontAwesomeIcon icon={faUndo} />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            className="p-2 rounded hover:bg-gray-200"
            title="Redo"
          >
            <FontAwesomeIcon icon={faRedo} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function RichTextEditor({ content, onChange, placeholder = "Bắt đầu viết nội dung..." }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none p-4 min-h-[400px] focus:outline-none',
      },
    },
    immediatelyRender: false,
  });

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent 
        editor={editor} 
      />
    </div>
  );
} 