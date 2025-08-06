import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'eurosecuriy',
  api_key: process.env.CLOUDINARY_API_KEY || '851594552588922',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'w4iayBALsvfqgNBuPGUPtWJcc-o',
});

export default cloudinary; 