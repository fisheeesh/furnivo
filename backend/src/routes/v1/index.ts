import express from "express"
import { auth } from "../../middlewares/auth-middleware"
import { authorize } from "../../middlewares/authorize-middleware"

import adminRoutes from "./admin/admin-routes"
import authRoutes from "./auth/auth-routes"
import userRoutes from "./user/user-routes"

const router = express.Router()

router.use('/api/v1', authRoutes)
router.use('/api/v1/user', userRoutes)
router.use('/api/v1/admin', auth, authorize(true, "ADMIN"), adminRoutes)

export default router