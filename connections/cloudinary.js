import dotenv from 'dotenv';

// Load environment variables
const result = dotenv.config({ path: '.env.local' });

if (result.error) {
    console.error("Error loading .env file:", result.error);
}

// Configure Cloudinary with environment variables
const cloudinaryConfig = {
    cloud: {
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.SECRET_CLOUDINARY_KEY,
        secure: true
    }
}

export default cloudinaryConfig;
