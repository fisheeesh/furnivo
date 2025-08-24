import express from "express"
import { register, verifyOtp, confirmPassword, login, logout, forgetPassword, verifyOtpForPassword, resetPassword, authCheck, changePassword } from "../../../controllers/auth/auth-controller"
import { auth } from "../../../middlewares/auth-middleware"

const router = express.Router()

router.post('/register', register)
router.post('/verify-otp', verifyOtp)
router.post('/confirm-password', confirmPassword)
router.post('/login', login)
router.post('/logout', logout)

router.post('/forget-password', forgetPassword)
router.post('/verify', verifyOtpForPassword)
router.post('/reset-password', resetPassword)

router.get('/auth-check', auth, authCheck)

router.post('/change-password', auth, changePassword)

export default router