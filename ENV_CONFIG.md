# Cấu hình .env cho Ikigaivilla với SQLite

## Tạo file .env trong thư mục public_html

Tạo file `.env` với nội dung sau:

```env
# Database Configuration - Sử dụng SQLite có sẵn
DATABASE_URL="file:./prisma/dev.db"

# NextAuth Configuration
NEXTAUTH_SECRET="ikigaivilla-secret-key-2024-very-secure-and-long"
NEXTAUTH_URL="https://ikigaivilla.vn"

# Cloudinary Configuration (cần đăng ký)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Environment
NODE_ENV="production"
```

## Bước tiếp theo:

### 1. Upload database
- Upload file `prisma/dev.db` lên thư mục `prisma/` trong `public_html`
- Upload toàn bộ thư mục `prisma/migrations/` lên `public_html/prisma/`

### 2. Upload code
- Upload toàn bộ thư mục `deploy-package/` lên `public_html`

### 3. Tạo file .env
- Tạo file `.env` với nội dung trên
- Thay thế Cloudinary credentials bằng thông tin thực tế

### 4. SSH và chạy
```bash
ssh ng-shost103@137.59.105.22
cd public_html
chmod +x start.sh
./start.sh
```

## Lưu ý:
- Database SQLite sẽ được tạo tự động nếu chưa có
- Dữ liệu sẽ được lưu trong file `prisma/dev.db`
- Backup file database này định kỳ 