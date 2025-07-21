import { NextFunction, Request, Response } from "express";
import { getSettignStatus } from "../services/system-service";
import { errorCode } from "../config/error-code";
import { createHttpError } from "../utils/auth";

export const maintenance = async (req: Request, res: Response, next: NextFunction) => {
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