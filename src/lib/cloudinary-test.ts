import cloudinary from './cloudinary';

export async function testCloudinaryConnection() {
  try {
    // Test basic configuration
    const result = await new Promise((resolve, reject) => {
      cloudinary.api.ping((error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });

    console.log('✅ Cloudinary connection successful:', result);
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error);
    return false;
  }
}

export function getCloudinaryConfig() {
  return {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'eurosecuriy',
    api_key: process.env.CLOUDINARY_API_KEY || '851594552588922',
    api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'w4iayBALsvfqgNBuPGUPtWJcc-o',
  };
} 