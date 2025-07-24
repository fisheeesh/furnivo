import { NextFunction, Request, Response } from "express";
import { getSettignStatus } from "../services/system-service";
import { errorCode } from "../config/error-code";
import { createHttpError } from "../utils/check";

const whiteLists = ["127.0.0.1"]

export const maintenance = async (req: Request, res: Response, next: NextFunction) => {
    const ip: any = req.headers["x-forwarded-for"] || req.socket.remoteAddress

    if (whiteLists.includes(ip)) {
        console.log(`Allowed IP: ${ip}`)
        next()
    } else {
        console.log(`Not Allowed IP: ${ip}`)

        const setting = await getSettignStatus("maintenance")
        if (setting?.value === 'true') {
            return next(createHttpError({
                message: "The server is under maintenance. Please try again later.",
                code: errorCode.maintenance,
                status: 503
            }))
        }

        next()
    }
}