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

var whitelist = ['http://localhost:5173', 'http://localhost:4000']
var corsOptions = {
    origin: function (origin: any, callback: (err: Error | null, origin?: any) => void) {
        //* Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true)
        if (whitelist.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    //* Allow cookies or authorization header
    credentials: true
}

app.use(morgan("dev"))
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(cors(corsOptions))
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