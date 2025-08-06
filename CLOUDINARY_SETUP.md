# Cloudinary Integration Setup

## Overview
This project now uses Cloudinary for image uploads instead of local file storage. This provides better performance, automatic image optimization, and global CDN delivery.

## Configuration

### Environment Variables
Create a `.env.local` file in the root directory with the following variables:

```env
CLOUDINARY_CLOUD_NAME=eurosecuriy
CLOUDINARY_API_KEY=851594552588922
CLOUDINARY_API_SECRET=w4iayBALsvfqgNBuPGUPtWJcc-o
CLOUDINARY_URL=cloudinary://851594552588922:w4iayBALsvfqgNBuPGUPtWJcc-o@eurosecuriy
```

### Cloudinary Account Setup
1. Sign up for a Cloudinary account at https://cloudinary.com
2. Get your credentials from the dashboard
3. Update the environment variables with your credentials

## Features

### Automatic Image Optimization
- Images are automatically optimized for web delivery
- Automatic format conversion (WebP for modern browsers)
- Quality optimization based on content
- **Automatic compression**: Files larger than 5MB are automatically compressed to 5MB

### Folder Organization
Images are organized in Cloudinary folders:
- `ikigaivilla/rooms` - Room images
- `ikigaivilla/news` - News article images
- `ikigaivilla/services` - Service images
- `ikigaivilla/general` - General images

### Image Transformations
The system supports automatic image transformations:
- Thumbnail generation (150x150)
- Preview images (400x300)
- Full-size images (1200x800)
- Automatic cropping and resizing

## API Endpoints

### Upload Image
```
POST /api/admin/upload
```
- Requires authentication
- Accepts multipart form data
- Returns Cloudinary URL and metadata

### Delete Image
```
DELETE /api/admin/upload/delete?publicId={publicId}
```
- Requires authentication
- Deletes image from Cloudinary
- Returns success status

## Usage in Components

### ImageUpload Component
```tsx
import ImageUpload from '@/components/ImageUpload';

<ImageUpload
  onUpload={(url) => console.log('Uploaded:', url)}
  type="rooms"
  multiple={true}
  maxFiles={30}
/>
```

### Utility Functions
```tsx
import { getOptimizedImageUrl } from '@/lib/cloudinary-utils';

// Get optimized image URL
const thumbnailUrl = getOptimizedImageUrl(publicId, 'thumbnail');
const previewUrl = getOptimizedImageUrl(publicId, 'preview');
const fullUrl = getOptimizedImageUrl(publicId, 'full');
```

## Benefits

1. **Performance**: Global CDN delivery for faster loading
2. **Optimization**: Automatic image optimization and format conversion
3. **Scalability**: No local storage management required
4. **Reliability**: Cloudinary's robust infrastructure
5. **Cost-effective**: Pay only for what you use

## Migration from Local Storage

If you have existing images in local storage:
1. Upload them to Cloudinary using the admin interface
2. Update database records with new Cloudinary URLs
3. Remove old local files

## Security

- API keys are stored in environment variables
- Upload endpoints require admin authentication
- File type and size validation
- Secure HTTPS URLs for all images

## Troubleshooting

### Common Issues

1. **Upload fails**: Check API credentials and network connection
2. **Images not loading**: Verify Cloudinary URLs are accessible
3. **Large file uploads**: Files larger than 5MB are automatically compressed
4. **Too many files**: Maximum 30 files can be uploaded at once

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
```

## Support

For Cloudinary-specific issues, refer to:
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary API Reference](https://cloudinary.com/documentation/admin_api) 