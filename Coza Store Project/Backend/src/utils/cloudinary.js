import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration of Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("No file path provided");
      return null;
    }

    // Check if Cloudinary credentials are set
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_CLOUD_API_KEY || !process.env.CLOUDINARY_CLOUD_API_SECRET) {
      throw new Error("Cloudinary credentials are missing");
    }
    console.time('uploadTime');
    const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" });
    console.timeEnd('uploadTime');

    console.log("File uploaded to Cloudinary:", response.url);

    // Delete the local file after successful upload
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log("Local file deleted successfully");
    } else {
      console.log("Local file does not exist, cannot delete");
    }

    return response;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);

    // Delete the local file if it exists
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log("Local file deleted after error");
    } else {
      console.log("Local file does not exist, cannot delete after error");
    }

    return null;
  }
};
export { uploadOnCloudinary };
