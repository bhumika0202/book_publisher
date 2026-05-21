import { v2 as cloudinary} from "cloudinary";


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET
});

let upload = async (file_path) => {
    try {
        let result = await cloudinary.uploader.upload(file_path,{
            folder : "book_publisher/uploads"
        });
        // console.log("result = ", result);
        
        return result;
    } catch (error) {
        console.log(error);
        
        throw error.message;
    }
}

export default upload