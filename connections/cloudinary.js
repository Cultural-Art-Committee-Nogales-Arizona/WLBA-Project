require('dotenv').config()
const { CLOUD_NAME, API_KEY, SECRET_CLOUDINARY_KEY } = process.env

const cloudinaryConfig = {
  cloudName: CLOUD_NAME,
  apiKey: API_KEY,
  apiSecret: SECRET_CLOUDINARY_KEY,
};

export default cloudinaryConfig;
