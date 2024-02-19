import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

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
