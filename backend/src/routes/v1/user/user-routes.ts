import express from "express"
import { changeLanguage, getMyPhoto, testPermission, uploadProfile, uploadProfileMultiple, uploadProfileOptimize } from "../../../controllers/user/user-controller"
import { auth } from "../../../middlewares/auth-middleware"
import upload, { uploadMemory } from "../../../middlewares/upload-file"

const router = express.Router()

router.post('/change-language', changeLanguage)
router.get('/test-permission', auth, testPermission)
router.patch("/profile/upload", auth, upload.single("avatar"), uploadProfile)
router.patch("/profile/upload/optimize", auth, upload.single("avatar"), uploadProfileOptimize)
router.patch("/profile/upload/multiple", auth, upload.array('avatar'), uploadProfileMultiple)

router.get('/profile/my-photo', getMyPhoto)

export default router