import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"



cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET_KEY  // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) =>{
    try {
        if(!localFilePath) return null;
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        //file has been uploaded successfully
        // console.log("File is uploaded on cloudinary");  
        // console.log(response.url);
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

const extractPublicIdFromURL =(imageURL) =>{
    if(!imageURL) return null;
    const publicIdMatch = imageURL.match(/\/v\d+\/([^/]+)\.\w+$/);
    return publicIdMatch ? publicIdMatch[1] : null;
}

const deleteFromCloudinary = async(imageURL)=>{
    if(!imageURL) return false;

    try {
        const publicId = extractPublicIdFromURL(imageURL);
        if(!publicId){
            throw new ApiError(400,"Could not extract publicId of Image");
        }
        const result = await cloudinary.uploader.destroy(publicId);
        return res
        .status(200)
        .json(
        new ApiResponse(200,user,"Avatar deleted Successfully")
    )
    } catch (error) {
        throw new ApiError(500,'Error deleting image from Cloudinary')
    }
}

export {uploadOnCloudinary,deleteFromCloudinary}























// (async function() {

//     // Configuration
//     cloudinary.config({ 
//         cloud_name: process.env.CLOUDINARY_NAME, 
//         api_key: process.env.CLOUDINARY_API_KEY, 
//         api_secret: process.env.CLOUDINARY_SECRET_KEY  // Click 'View API Keys' above to copy your API secret
//     });
    
//     // Upload an image
//     const uploadResult = await cloudinary.uploader
//         .upload(
//             'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                 public_id: 'shoes',
//             }
//         )
//         .catch((error) => {
//             console.log(error);
//         });
    
//     console.log(uploadResult);
    
//     // Optimize delivery by resizing and applying auto-format and auto-quality
//     const optimizeUrl = cloudinary.url('shoes', {
//         fetch_format: 'auto',
//         quality: 'auto'
//     });
    
//     console.log(optimizeUrl);
    
//     // Transform the image: auto-crop to square aspect_ratio
//     const autoCropUrl = cloudinary.url('shoes', {
//         crop: 'auto',
//         gravity: 'auto',
//         width: 500,
//         height: 500,
//     });
    
//     console.log(autoCropUrl);    
// })(); 