import express from "express"
import { getAllUsers } from "../../../controllers/admin/admin-controller"
import { setMaintenance } from "../../../controllers/admin/system-controller"
import upload from "../../../middlewares/upload-file"
import { createPost, updatePost, deletePost } from "../../../controllers/admin/post-controller"

const router = express.Router()

router.get('/users', getAllUsers)
router.post('/maintenance', setMaintenance)

//* CRUD for posts
router.post('/posts', upload.single('image'), createPost)
router.patch('/posts', upload.single('image'), updatePost)
router.delete('/posts', deletePost)

export default router