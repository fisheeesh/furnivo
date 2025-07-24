import { NextFunction, Request, Response } from "express"
import { body, validationResult } from "express-validator"
import { errorCode } from "../../config/error-code"
import { createHttpError } from "../../utils/check"

interface CustomRequest extends Request {
    user?: any
}

export const getPost = [
    body(""),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })
        if (errors.length > 0) return next(createHttpError({
            message: errors[0].msg,
            status: 400,
            code: errorCode.invalid
        }))


        res.status(200).json({
            message: "Create post successfully."
        })
    }
]

export const getPostsByPagination = [
    body(""),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })
        if (errors.length > 0) return next(createHttpError({
            message: errors[0].msg,
            status: 400,
            code: errorCode.invalid
        }))


        res.status(200).json({
            message: "Create post successfully."
        })
    }
]