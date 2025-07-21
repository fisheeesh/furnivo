import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { errorCode } from "../../../config/error-code";
import { createHttpError } from "../../../utils/auth";
import { createOrUpdateSettingStatus } from "../../../services/system-service";

interface CustomRequest extends Request {
    userId?: number
}

export const setMaintenance = [
    body("mode", "Mode must be boolean").isBoolean(),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })
        if (errors.length > 0) return next(createHttpError({
            message: errors[0].msg,
            status: 400,
            code: errorCode.invalid
        }))

        const { mode } = req.body

        const value = mode ? 'true' : 'false'
        const message = mode ? 'Successfully set Maintenance mode.' : 'Successfully turn off Maintenance mode.'

        await createOrUpdateSettingStatus("maintenance", value)

        res.status(200).json({ message })
    }
]