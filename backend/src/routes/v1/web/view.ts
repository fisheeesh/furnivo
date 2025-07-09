import express from "express"
import { home } from "../../../contorllers/web/viewController"

const router = express.Router()

router.get('/home', home)

export default router