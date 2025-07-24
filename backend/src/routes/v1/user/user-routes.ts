import express from "express"
import { changeLanguage, getMyPhoto, testPermission, uploadProfile, uploadProfileMultiple, uploadProfileOptimize } from "../../../controllers/user/user-controller"
import { auth } from "../../../middlewares/auth-middleware"
import upload, { uploadMemory } from "../../../middlewares/upload-file"
import { getInfinitePostsByPagination, getPost, getPostsByPagination } from "../../../controllers/user/post-controller"

const router = express.Router()

router.post('/change-language', changeLanguage)
router.get('/test-permission', auth, testPermission)
router.patch("/profile/upload", auth, upload.single("avatar"), uploadProfile)
router.patch("/profile/upload/optimize", auth, upload.single("avatar"), uploadProfileOptimize)
router.patch("/profile/upload/multiple", auth, upload.array('avatar'), uploadProfileMultiple)

router.get('/profile/my-photo', getMyPhoto)

router.get("/posts", auth, getPostsByPagination) //* Offset pagination
router.get("/posts/infinite", auth, getInfinitePostsByPagination) //* Cursor-based pagination
router.get("/posts/:id", auth, getPost)

export default router