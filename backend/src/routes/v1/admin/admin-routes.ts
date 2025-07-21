import express from "express"
import { getAllUsers } from "../../../controllers/admin/admin-controller"
import { setMaintenance } from "./system-controller"

const router = express.Router()

router.get('/users', getAllUsers)
router.post('/maintenance', setMaintenance)

export default router