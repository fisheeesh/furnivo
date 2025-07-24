import { NextFunction, Request, Response } from "express";
import { getUserById } from "../services/auth-service";
import { errorCode } from "../config/error-code";
import { createHttpError } from "../utils/check";

interface CustomRequest extends Request {
    userId?: number;
    user?: any
}

//* authorize(true, "ADMIN", "AUTHOR") -> deny - "USER"
//* authorize(false, "USER") -> allow - "ADMIN", "AUTHOR"
export const authorize = (permission: boolean, ...roles: string[]) => {
    return async (req: CustomRequest, res: Response, next: NextFunction) => {
        const userId = req.userId
        const user = await getUserById(userId!)
        if (!user) return next(createHttpError({
            message: 'This account has not been registered.',
            code: errorCode.unauthenticated,
            status: 403
        }))

        const result = roles.includes(user.role)

        if (permission && !result) return next(createHttpError({
            message: 'You are not authorized to access this resource.',
            code: errorCode.unauthorized,
            status: 403
        }))

        if (!permission && result) return next(createHttpError({
            message: 'You are not authorized to access this resource.',
            code: errorCode.unauthorized,
            status: 403
        }))

        req.user = user

        next()
    }
}