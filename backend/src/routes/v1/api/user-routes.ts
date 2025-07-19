import express from "express"
import { changeLanguage } from "../../../contorllers/api/profile-controller"

const router = express.Router()

router.post('/change-language', changeLanguage)

export default router