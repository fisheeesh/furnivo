import compression from "compression"
import cors from "cors"
import express, { NextFunction, Request, Response } from "express"
import helmet from "helmet"
import morgan from "morgan"
import { limiter } from "./middlewares/rate_limiter"
import cookieParser from "cookie-parser"

import authRoutes from "./routes/v1/auth"
import userRoutes from './routes/v1/admin/user'
import { auth } from "./middlewares/auth"

//* client -> req -> middleware -> controller -> res -> client
export const app = express()

app.use(morgan("dev"))
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(cors())
    .use(helmet())
    .use(compression({}))
    .use(limiter)
    .use(cookieParser())

app.use('/api/v1', authRoutes)
app.use('/api/v1/admin', auth, userRoutes)

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    const status = error.status || 500
    const message = error.message || 'Server Error'
    const errorCode = error.code || "Error_Code"

    res.status(status).json({
        message, error: errorCode
    })
})