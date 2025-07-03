import compression from "compression"
import cors from "cors"
import express, { NextFunction, Request, Response } from "express"
import helmet from "helmet"
import morgan from "morgan"
import { check } from "./middlewares/check"
import { limiter } from "./middlewares/rate_limiter"

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

interface CustomRequest extends Request {
    userId?: number
}

app.get('/health', check, (req: CustomRequest, res: Response) => {
    throw new Error("An error occured")
    res.status(200).json({
        message: 'hello we are ready for response.',
        userId: req.userId || 7
    })
})

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    const status = error.status || 500
    const message = error.message || 'Server Error'
    const errorCode = error.code || "Error_Code"

    res.status(status).json({
        message, error: errorCode
    })
})