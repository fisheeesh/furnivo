import compression from "compression"
import cors from "cors"
import express, { NextFunction, Request, Response } from "express"
import helmet from "helmet"
import morgan from "morgan"
import { limiter } from "./middlewares/rate_limiter"
import healthRoutes from "./routes/v1/health"

//* client -> req -> middleware -> controller -> res -> client
export const app = express()

/**
 * * client ka ny api to call tine terminal mr log twy pya pay (bandwidth, response time, ...)
 * * req ka ny form data twy pr lr yin . call p use loh ya ag parse pay
 * * json ka ny Js obj ko converty pay
 */
app.use(morgan("dev"))
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(cors())
    .use(helmet())
    .use(compression({}))
    .use(limiter)

app.use("/api/v1", healthRoutes)

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    const status = error.status || 500
    const message = error.message || 'Server Error'
    const errorCode = error.code || "Error_Code"

    res.status(status).json({
        message, error: errorCode
    })
})