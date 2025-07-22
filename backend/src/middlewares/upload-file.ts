import { Request } from "express";
import multer, { FileFilterCallback } from "multer";

const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/images')

        // const type = file.mimetype.split('/')[0]
        // if (type === 'image') cb(null, 'uploads/images')
        // else cb(null, 'uploads/files')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + "-" + file.originalname)
    }
})

// const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/webp') {
//         cb(null, true)
//     } else {
//         cb(null, false)
//     }
// }

const upload = multer({
    storage: fileStorage,
    fileFilter,
    //* Maximum file size is 10MB. So, image optimization is needed
    limits: { fileSize: 1024 * 1024 * 2 }
})

export default upload
