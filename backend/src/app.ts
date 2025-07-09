import compression from "compression"
import cors from "cors"
import express, { NextFunction, Request, Response } from "express"
import helmet from "helmet"
import morgan from "morgan"
import { limiter } from "./middlewares/rate_limiter"
import healthRoutes from "./routes/v1/health"
import viewRoutees from "./routes/v1/web/view"
import * as errorController from "./contorllers/web/errorController"

//* client -> req -> middleware -> controller -> res -> client
export const app = express()

app.set("view engine", "ejs")
app.set('views', "src/views")

app.use(morgan("dev"))
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(cors())
    .use(helmet())
    .use(compression({}))
    .use(limiter)
    .use(express.static('public'))


app.use("/api/v1", healthRoutes)
app.use(viewRoutees)
app.use(errorController.notFound)

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    const status = error.status || 500
    const message = error.message || 'Server Error'
    const errorCode = error.code || "Error_Code"

    res.status(status).json({
        message, error: errorCode
    })
})