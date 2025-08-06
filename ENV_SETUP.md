# Cấu hình file .env cho Ikigaivilla

## Tạo file .env trong thư mục public_html

Tạo file `.env` với nội dung sau:

```env
# Database Configuration
# Thay thế bằng URL database thực tế của bạn
DATABASE_URL="file:./prisma/dev.db"

# NextAuth Configuration
NEXTAUTH_SECRET="ikigaivilla-secret-key-2024-very-secure-and-long"
NEXTAUTH_URL="https://ikigaivilla.vn"

# Cloudinary Configuration
# Đăng ký tài khoản tại https://cloudinary.com và lấy thông tin
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email Configuration (tùy chọn)
# Nếu muốn gửi email từ contact form
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Environment
NODE_ENV="production"
```

## Hướng dẫn cấu hình từng phần:

### 1. Database URL
**Tùy chọn A: SQLite (đơn giản nhất)**
```env
DATABASE_URL="file:./prisma/dev.db"
```

**Tùy chọn B: MySQL (từ hosting)**
```env
DATABASE_URL="mysql://username:password@localhost:3306/ikigaivilla"
```

**Tùy chọn C: PostgreSQL (từ hosting)**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/ikigaivilla"
```

### 2. Cloudinary Setup
1. Đăng ký tài khoản tại https://cloudinary.com
2. Vào Dashboard → API Keys
3. Copy thông tin:
   - Cloud Name
   - API Key
   - API Secret

### 3. Email Setup (tùy chọn)
Nếu muốn contact form gửi email:
1. Tạo Gmail App Password
2. Điền thông tin SMTP

## Thông tin đã có sẵn:
- **Domain:** ikigaivilla.vn
- **Server:** 137.59.105.22
- **Username:** ng-shost103
- **NEXTAUTH_SECRET:** Đã tạo ngẫu nhiên
- **NEXTAUTH_URL:** https://ikigaivilla.vn

## Bước tiếp theo:
1. Tạo file `.env` với nội dung trên
2. Thay thế các giá trị placeholder bằng thông tin thực tế
3. Upload lên server
4. SSH và chạy ứng dụng 