import { NextResponse } from "next/server";
import crypto from 'crypto'
import dotenv from 'dotenv'
dotenv.config()

// I am SO sorry for making this.
// Lord, please forgive me.
export const POST = async (request) => {
  try {
    function PublicIdFromUrl(url) {
      // Split the URL by '/'
    const parts = url.split('/');
    // Get the index of "upload" in the URL
    const uploadIndex = parts.indexOf("upload");
    // Get the parts of the URL after "upload"
    const uploadParts = parts.slice(uploadIndex + 2);
    // Join the remaining parts to form the public ID
    let publicId = uploadParts.join('/');
    if (publicId.includes(".")) {
      publicId = publicId.split(".")[0];
  }
    return publicId;
    }
    
    // Generate the signature for authentication
    function sha1Hash(data) {
      const hash = crypto.createHash('sha1');
      hash.update(data);
      return hash.digest('hex');
    }

    // Signature parameters
    const API_KEY = "578141593239547"
    const API_SECRET = 'FwLekwqMLHgOvucXuGE6hIMRhL4' /*  process.env.API_KEY */
    const currentTime = Date.now()
    const { imageUrl } = await request.json()
    const publicId = PublicIdFromUrl(imageUrl)
    console.log(publicId)
    
    const signatureString = `public_id=${publicId}&timestamp=${currentTime}${API_SECRET}`
    const hashedSignature = sha1Hash(signatureString)

    const queryParams = `?signature=${hashedSignature}&public_id=${publicId}&timestamp=${currentTime}&api_key=${API_KEY}`
    const imageUpload = await fetch(`https://api.cloudinary.com/v1_1/dvlb9ylqb/image/destroy${queryParams}`, {
      method: 'POST',
      /* headers: {
        'Content-Type': 'application/json' // Set Content-Type header
      } */
    }); 

    const imageResponse = await imageUpload.json()

    return NextResponse.json({
      success: true,
      message: `Deleted image from Cloudinary`,
      data: imageResponse
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: `Failed to delete image from Cloudinary: ${error.message}`,
      error: error
    }, {
      status: 500
    });
  }
};