const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// 1. Configure Cloudinary with your .env keys
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Set up the Cloudinary Storage Engine
// This replaces your diskStorage and fileFilter logic!
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'insuretrack_claims', // Creates this folder in your Cloudinary account
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'], // Automatically rejects other formats
  },
});

// 3. Create the upload middleware
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Keeps your 5MB limit!
});

module.exports = upload;