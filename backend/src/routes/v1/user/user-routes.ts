import express from "express"
import { changeLanguage, testPermission } from "../../../controllers/user/user-controller"
import { auth } from "../../../middlewares/auth-middleware"

const router = express.Router()

router.post('/change-language', changeLanguage)
router.get('/test-permission', auth, testPermission)

export default router