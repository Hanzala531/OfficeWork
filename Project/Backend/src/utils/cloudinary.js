import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration of Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});

// Method to upload to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // The next step after the file has been successfully uploaded
    console.log("File has been uploaded successfully", response.url);
    
    // Delete the local file after successful upload
    fs.unlinkSync(localFilePath);
    
    return response;
  } catch (error) {
    console.log("Error uploading file to Cloudinary", error);
    
    // Optionally delete the local file if it exists
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    
    return null; // Return null or handle the error as needed
  }
};

export { uploadOnCloudinary };
