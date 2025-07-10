import express from "express"
import { register, verifyOtp, confirmPassword, login } from "../../contorllers/authController"

const router = express.Router()

router.post('/register', register)
router.post('/verifty-otp', verifyOtp)
router.post('/confirm-password', confirmPassword)
router.post('/login', login)

export default router