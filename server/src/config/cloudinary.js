import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

// Test Cloudinary connection
const testConnection = async () => {
    try {
        await cloudinary.api.ping();
        console.log('✅ Connected to Cloudinary');
    } catch (error) {
        console.error('❌ Cloudinary connection failed:', error.message);
    }
};

testConnection();

export default cloudinary;
