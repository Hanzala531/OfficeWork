import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

    // Configuration of cloudinary 
    cloudinary.config({ 
        cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`, 
        api_key: `${process.env.CLOUDINARY_CLOUD_API_KEY}`, 
        api_secret: `${process.env.CLOUDINARY_CLOUD_API_SECRET}`
    });
    

    //Method to upload on cloudinary

    const uploadOnCloudinary= async (localFilePath)=>{
        try {
            if(!localFilePath) return null;
            const response = await cloudinary.uploader.upload(localFilePath , {
                resource_type : "auto"
            })
            //The next step after the file has been successfully uploaded
            console.log("File has been uploaded succesfully " , response.url);
            return response;
            
        } catch (error) {
            fs.unlinkSync(localFilePath);
            console.log("Error uploading file on cloudinary ", error);
            
        }
    }

    export {uploadOnCloudinary}