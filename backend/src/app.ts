import compression from "compression"
import cors from "cors"
import express from "express"
import helmet from "helmet"
import morgan from "morgan"
import { limiter } from "./middlewares/rate_limiter"

//* client -> req -> middle -> controller -> res -> client
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

app.get('/health', (req, res) => {
    res.status(200).json({ message: 'hello we are ready for response.' })
})