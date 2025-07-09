import express from "express"
import { about, home } from "../../../contorllers/web/viewController"

const router = express.Router()

router.get('/home', home)

router.get('/about', about)

export default router