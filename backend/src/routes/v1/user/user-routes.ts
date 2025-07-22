import express from "express"
import { changeLanguage, testPermission, uploadProfile } from "../../../controllers/user/user-controller"
import { auth } from "../../../middlewares/auth-middleware"
import upload from "../../../middlewares/upload-file"

const router = express.Router()

router.post('/change-language', changeLanguage)
router.get('/test-permission', auth, testPermission)
router.patch("/profile/upload", auth, upload.single("avatar"), uploadProfile)

export default router