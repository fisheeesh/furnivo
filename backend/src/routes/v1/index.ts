import express from "express"
import { auth } from "../../middlewares/auth-middleware"
import { authorize } from "../../middlewares/authorize-middleware"
import { maintenance } from "../../middlewares/maintenance-middleware"

import adminRoutes from "./admin/admin-routes"
import authRoutes from "./auth/auth-routes"
import userRoutes from "./user/user-routes"

const router = express.Router()

router.use('/api/v1', maintenance, authRoutes)
router.use('/api/v1/user', maintenance, userRoutes)
router.use('/api/v1/admin', maintenance, auth, authorize(true, "ADMIN"), adminRoutes)

export default router