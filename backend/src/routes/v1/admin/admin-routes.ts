import express from "express"
import { getAllUsers } from "../../../contorllers/admin/admin-controller"

const router = express.Router()

router.get('/users', getAllUsers)

export default router