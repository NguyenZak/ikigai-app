import cloudinary from './cloudinary';

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  quality?: string;
  format?: string;
  crop?: string;
  gravity?: string;
}

/**
 * Generate a Cloudinary URL with transformations
 */
export function getCloudinaryUrl(publicId: string, options: CloudinaryTransformOptions = {}) {
  const {
    width,
    height,
    quality = 'auto:good',
    format = 'auto',
    crop = 'fill',
    gravity = 'auto'
  } = options;

  const transformations = [];

  if (width || height) {
    // Only include width and height if they are valid numbers
    const widthParam = width ? width.toString() : '';
    const heightParam = height ? height.toString() : '';
    
    if (widthParam && heightParam) {
      transformations.push(`${widthParam},${heightParam}`);
    } else if (widthParam) {
      transformations.push(`${widthParam},a_auto`);
    } else if (heightParam) {
      transformations.push(`a_auto,${heightParam}`);
    }
  }

  if (crop !== 'fill') {
    transformations.push(`c_${crop}`);
  }

  if (gravity !== 'auto') {
    transformations.push(`g_${gravity}`);
  }

  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);

  const transformString = transformations.join('/');
  
  return cloudinary.url(publicId, {
    transformation: transformString
  });
}

/**
 * Get optimized image URL for different use cases
 */
export function getOptimizedImageUrl(publicId: string, type: 'thumbnail' | 'preview' | 'full' = 'preview') {
  const options: CloudinaryTransformOptions = {};

  switch (type) {
    case 'thumbnail':
      options.width = 150;
      options.height = 150;
      options.crop = 'fill';
      break;
    case 'preview':
      options.width = 400;
      options.height = 300;
      options.crop = 'fill';
      break;
    case 'full':
      options.width = 1200;
      options.height = 800;
      options.crop = 'limit';
      break;
  }

  return getCloudinaryUrl(publicId, options);
}

/**
 * Extract public ID from Cloudinary URL
 */
export function extractPublicIdFromUrl(url: string): string | null {
  const match = url.match(/\/v\d+\/([^\/]+)\./);
  return match ? match[1] : null;
} 