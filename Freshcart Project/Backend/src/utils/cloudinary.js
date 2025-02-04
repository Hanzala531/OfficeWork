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
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("File has been uploaded successfully", response.url);

    // Check if the file exists before deletion
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log("Local file deleted successfully");
    } else {
      console.log("Local file does not exist, cannot delete");
    }

    return response;
  } catch (error) {
    console.log("Error uploading file to Cloudinary", error);

    // Check if the file exists before attempting to delete
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log("Local file deleted after error");
    } else {
      console.log("Local file does not exist, cannot delete after error");
    }

    return null; // Return null or handle the error as needed
  }
};

export { uploadOnCloudinary };
