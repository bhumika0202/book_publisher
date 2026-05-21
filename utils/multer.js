import multer from "multer";

let storage = multer.diskStorage({
    destination : (req,file,cb ) => {
        cb(null,"uploads/")
    },
    filename : ( req,file,cb ) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
}); 
let multerUpload = multer({ storage : storage})

export default multerUpload;