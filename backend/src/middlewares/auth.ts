import { NextFunction, Request, Response } from "express";
import { createHttpError } from "../utils/auth";

export const auth = (req: Request, res: Response, next: NextFunction) => {
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



    next()
}