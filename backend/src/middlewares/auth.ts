import { NextFunction, Request, Response } from "express";
import { createHttpError } from "../utils/auth";
import jwt from "jsonwebtoken"
import { errorCode } from "../config/errorCode";
import { getUserById, updateUser } from "../services/authService";

interface CustomRequest extends Request {
    userId?: number
}

export const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
    //* For mobil api calls only
    // const platform = req.header('x-platform')
    // if (platform === 'mobile') {
    //     const accessTokenMobile = req.headers.authorization?.split(' ')[1]
    //     console.log('Request from mobile: ', accessTokenMobile)
    // } else {
    //     console.log('Request from web')
    // }

    const accessToken = req.cookies ? req.cookies.accessToken : null
    const refreshToken = req.cookies ? req.cookies.refreshToken : null

    if (!refreshToken) return next(createHttpError({
        message: 'You are not an authenticated user.',
        code: errorCode.unauthenticated,
        status: 401,
    }))

    const generateNewTokens = async () => {
        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as {
                id: number,
                phone: string
            }
        } catch (error) {
            return next(createHttpError({
                message: 'You are not an authenticated user.',
                code: errorCode.unauthenticated,
                status: 401,
            }))
        }

        const user = await getUserById(decoded.id)
        if (!user) {
            return next(createHttpError({
                message: 'This account has not been registered.',
                code: errorCode.unauthenticated,
                status: 401,
            }))
        }

        if (user.phone !== decoded.phone || user.randToken !== refreshToken) {
            return next(createHttpError({
                message: 'You are not an authenticated user.',
                code: errorCode.unauthenticated,
                status: 401,
            }))
        }

        const accessTokenPayload = { id: user.id }
        const refreshTokenPayload = { id: user.id, phone: user.phone }

        const newAccessToken = jwt.sign(
            accessTokenPayload,
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: 60 * 2 }
        )

        const newRefreshToken = jwt.sign(
            refreshTokenPayload,
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: "30d" }
        )

        const userData = {
            randToken: newRefreshToken
        }

        await updateUser(user!.id, userData)

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 1000 * 60 * 15
        }).cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 30
        })

        req.userId = decoded.id
        next()
    }

    if (!accessToken) {
        generateNewTokens()
    } else {
        //* Verify access token
        let decoded;
        try {
            decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as { id: number }

            req.userId = decoded.id
            next()
        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                generateNewTokens()
            } else {
                return next(createHttpError({
                    message: 'Access Token is invalid.',
                    code: errorCode.attack,
                    status: 401,
                }))
            }
        }
    }
}