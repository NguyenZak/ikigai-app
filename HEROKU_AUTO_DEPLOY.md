# Auto-Deploy từ GitHub lên Heroku

## 🚀 Thiết lập GitHub Integration với Heroku

### Bước 1: Kết nối GitHub với Heroku

#### Cách 1: Qua Heroku Dashboard (Khuyến nghị)

1. **Đăng nhập Heroku Dashboard**
   - Truy cập: https://dashboard.heroku.com/
   - Đăng nhập vào tài khoản Heroku

2. **Tạo App mới**
   - Click "New" → "Create new app"
   - Đặt tên app: `ikigai-villa-app`
   - Chọn region gần nhất
   - Click "Create app"

3. **Kết nối GitHub**
   - Trong app dashboard, click tab "Deploy"
   - Chọn "GitHub" trong phần "Deployment method"
   - Click "Connect to GitHub"
   - Authorize Heroku để truy cập GitHub
   - Tìm repository: `NguyenZak/ikigai-app`
   - Click "Connect"

4. **Thiết lập Auto-Deploy**
   - Trong phần "Automatic deploys"
   - Chọn branch: `main`
   - Bật "Wait for CI to pass before deploy" (nếu có)
   - Click "Enable Automatic Deploys"

### Bước 2: Cấu hình Environment Variables

#### Set các biến môi trường trong Heroku Dashboard:

1. **Vào Settings tab**
2. **Click "Reveal Config Vars"**
3. **Thêm các biến sau:**

```
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://ikigai-villa-app-8fcfa78ff74e.herokuapp.com/
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
```

### Bước 3: Thêm PostgreSQL Database

1. **Vào Resources tab**
2. **Click "Find more add-ons"**
3. **Tìm "Heroku Postgres"**
4. **Chọn plan "Mini" (Free tier)**
5. **Click "Submit Order Form"**

### Bước 4: Deploy lần đầu

#### Manual Deploy:
1. **Vào Deploy tab**
2. **Click "Deploy Branch"**
3. **Chọn branch `main`**
4. **Click "Deploy"**

#### Sau khi deploy thành công:
```bash
# Chạy database migrations
heroku run npm run db:migrate --app ikigai-villa-app

# Seed database (nếu cần)
heroku run npm run seed --app ikigai-villa-app
```

## 🔄 Workflow Auto-Deploy

### Khi bạn push code lên GitHub:

1. **Push code:**
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```

2. **Heroku tự động:**
   - Nhận webhook từ GitHub
   - Pull code mới nhất
   - Chạy `npm install`
   - Chạy `npm run build`
   - Deploy lên production

3. **Database migrations:**
   - Heroku sẽ tự động chạy `prisma migrate deploy`
   - (Được cấu hình trong `package.json`)

## 📊 Monitoring

### Xem deployment status:
- **Heroku Dashboard** → App → Activity tab
- **GitHub** → Repository → Actions tab (nếu có)

### Xem logs:
```bash
heroku logs --tail --app ikigai-villa-app
```

### Kiểm tra app:
```bash
heroku open --app ikigai-villa-app
```

## 🔧 Troubleshooting

### Nếu auto-deploy fail:

1. **Kiểm tra logs:**
   ```bash
   heroku logs --tail --app ikigai-villa-app
   ```

2. **Manual deploy:**
   - Vào Heroku Dashboard
   - Deploy tab → "Deploy Branch"

3. **Reset database:**
   ```bash
   heroku pg:reset DATABASE_URL --app ikigai-villa-app
   heroku run npm run db:migrate --app ikigai-villa-app
   ```

### Lỗi thường gặp:

1. **Build failed:**
   - Kiểm tra `package.json` scripts
   - Đảm bảo Node.js version phù hợp

2. **Database connection:**
   - Kiểm tra `DATABASE_URL` trong config vars
   - Đảm bảo PostgreSQL addon đã được thêm

3. **Environment variables:**
   - Kiểm tra tất cả required env vars đã được set

## 🎯 Best Practices

1. **Test locally trước khi push:**
   ```bash
   npm run build
   npm start
   ```

2. **Use meaningful commit messages:**
   ```bash
   git commit -m "feat: add new booking feature"
   git commit -m "fix: resolve database connection issue"
   ```

3. **Monitor deployment:**
   - Luôn kiểm tra logs sau mỗi deploy
   - Test các tính năng quan trọng

4. **Backup database:**
   ```bash
   heroku pg:backups:capture --app ikigai-villa-app
   ```

## 📞 Support

- **Heroku Status:** https://status.heroku.com/
- **GitHub Status:** https://www.githubstatus.com/
- **Heroku Documentation:** https://devcenter.heroku.com/ 