import express from "express"
import { getAllUsers } from "../../../controllers/admin/admin-controller"
import { setMaintenance } from "../../../controllers/admin/system-controller"
import upload from "../../../middlewares/upload-file"
import { createPost, updatePost, deletePost } from "../../../controllers/admin/post-controller"
import { createProduct, deleteProduct, updateProduct } from "../../../controllers/admin/product-controller"

const router = express.Router()

router.get('/users', getAllUsers)
router.post('/maintenance', setMaintenance)

//* CRUD for posts
router.post('/posts', upload.single('image'), createPost)
router.patch('/posts', upload.single('image'), updatePost)
router.delete('/posts', deletePost)

//* CRUD for product
router.post('/products', upload.array('images', 4), createProduct)
router.patch('/products', upload.array('images', 4), updateProduct)
router.delete('/products', deleteProduct)

export default router