import { NextFunction, Request, Response } from "express";
import { createHttpError } from "../utils/auth";
import jwt from "jsonwebtoken"

interface CustomRequest extends Request {
    userId?: number
}

export const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
    const accessToken = req.cookies ? req.cookies.accessToken : null
    const refreshToken = req.cookies ? req.cookies.refreshToken : null

    if (!refreshToken) return next(createHttpError({
        message: 'You are not an authenticated user.',
        code: "Error_Unauthenticated",
        status: 401,
    }))

    if (!accessToken) return next(createHttpError({
        message: 'Access Token has expired.',
        code: "Error_AccessTokenExired",
        status: 401,
    }))

    //* Verify access token
    let decoded;
    try {
        decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as { id: number }
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return next(createHttpError({
                message: 'Access Token has expired.',
                code: "Error_AccessTokenExired",
                status: 401,
            }))
        } else {
            return next(createHttpError({
                message: 'Access Token is invalid.',
                code: "Error_AccessTokenInvalid",
                status: 401,
            }))
        }
    }

    req.userId = decoded.id

    next()
}