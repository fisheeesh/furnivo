import bcrypt from 'bcrypt'
import { NextFunction, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import moment from 'moment'

import { createOTP, createUser, getOTPByPhone, getUserById, getUserByPhone, updateOTP, updateUser } from '../services/authService'
import { checkOTPErrorIfSameDate, checkOTPRow, checkUserExit, checkUserIfNotExist, createHttpError } from '../utils/auth'
import { generateToken } from '../utils/generate'

export const register = [
    body("phone", "Invalid phone number")
        .trim()
        .notEmpty()
        .matches(/^[\d]+$/)
        .isLength({ min: 5, max: 12 }),
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })

        if (errors.length > 0) return next(createHttpError({
            message: errors[0].msg,
            status: 400,
            code: 'Error_Invalid',
        }))

        let phone = req.body.phone
        if (phone.slice(0, 2) === '09') {
            phone = phone.substring(2, phone.length)
        }

        //* Check if user already exist
        const user = await getUserByPhone(phone)
        checkUserExit(user)

        //* Genereate OTP & call OTP sending API
        const otp = 123456 //? For testing
        // const otp = generateOTP()
        const salt = await bcrypt.genSalt(10)
        const hashOtp = await bcrypt.hash(otp.toString(), salt)
        const token = generateToken()

        //* Get otp by phone
        const otpRow = await getOTPByPhone(phone)
        let result;
        //* Check if otp is already in db
        if (!otpRow) {
            const otpData = {
                phone,
                otp: hashOtp,
                rememberToken: token,
                count: 1
            }

            //* If not create otp
            result = await createOTP(otpData)
        } else {
            const lastOtpRequest = new Date(otpRow.updatedAt).toLocaleDateString()
            const today = new Date().toLocaleDateString()
            const isSameDate = lastOtpRequest === today

            //* If in db, and check if in same date and error is not happened 5 times
            checkOTPErrorIfSameDate(isSameDate, otpRow.error)

            //* If not in same date
            if (!isSameDate) {
                const otpData = {
                    phone,
                    otp: hashOtp,
                    rememberToken: token,
                    count: 1,
                    error: 0
                }

                //* reset otp count and error and update
                result = await updateOTP(otpRow.id, otpData)
            } else {
                //* Same date and coutn is already times
                if (otpRow.count === 3) {
                    return next(createHttpError({
                        message: "OTP is allowed to request 3 times per day.",
                        status: 405,
                        code: 'Error_OverLimit',
                    }))
                } else {
                    const otpData = {
                        phone,
                        otp: hashOtp,
                        rememberToken: token,
                        count: { increment: 1 },
                    }

                    //* If not, let user to get otp max per 3 times
                    result = await updateOTP(otpRow.id, otpData)
                }
            }
        }

        res.status(200).json({
            message: `We are sending OTP to 09${result.phone}`,
            phone: result.phone,
            token: result.rememberToken
        })
    }
]

export const verifyOtp = [
    body("phone", "Invalid phone number")
        .trim()
        .notEmpty()
        .matches(/^[\d]+$/)
        .isLength({ min: 5, max: 12 }),
    body("otp", "Invalid OTP")
        .trim()
        .notEmpty()
        .matches(/^[\d]+$/)
        .isLength({ min: 6, max: 6 }),
    body('token', "Invalid Token")
        .trim()
        .notEmpty()
        .escape(),
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })
        if (errors.length > 0) return next(createHttpError({
            message: errors[0].msg,
            status: 400,
            code: 'Error_Invalid',
        }))

        const { phone, otp, token } = req.body
        const user = await getUserByPhone(phone)
        checkUserExit(user)

        const otpRow = await getOTPByPhone(phone)
        checkOTPRow(otpRow)

        const lastOtpVerify = new Date(otpRow!.updatedAt).toLocaleDateString()
        const today = new Date().toLocaleDateString()
        const isSameDate = lastOtpVerify === today
        //* If OTP verify is in the same date and over limit
        checkOTPErrorIfSameDate(isSameDate, otpRow!.error)

        if (otpRow?.rememberToken !== token) {
            const otpData = {
                error: 5
            }
            await updateOTP(otpRow!.id, otpData)

            return next(createHttpError({
                message: 'Token is wrong',
                status: 400,
                code: 'Error_Invalid',
            }))
        }

        const isExpired = moment().diff(otpRow?.updatedAt, "minutes") > 2

        //* Check if otp is expired
        if (isExpired) return next(createHttpError({
            message: 'OTP is expired',
            status: 403,
            code: 'Error_Expried',
        }))


        const isMatchOtp = await bcrypt.compare(otp, otpRow!.otp)

        //* Check if otp is match
        if (!isMatchOtp) {
            //* If OTP is first time today
            if (!isSameDate) {
                const otpData = {
                    error: 1
                }

                await updateOTP(otpRow!.id, otpData)
            } else {
                //* If OTP error is not first time today
                const otpData = {
                    error: { increment: 1 }
                }

                await updateOTP(otpRow!.id, otpData)
            }

            return next(createHttpError({
                message: 'OTP is incorrect',
                status: 400,
                code: 'Error_Invalid',
            }))
        }

        const verifyToken = generateToken()
        const otpData = {
            verifyToken,
            error: 0,
            count: 1
        }

        const result = await updateOTP(otpRow!.id, otpData)

        res.status(200).json({
            message: "OTP is successfully verified",
            phone: result.phone,
            token: result.verifyToken
        })
    }
]

export const confirmPassword = [
    body("phone", "Invalid phone number")
        .trim()
        .notEmpty()
        .matches(/^[\d]+$/)
        .isLength({ min: 5, max: 12 }),
    body("password", "Password must be at least 8 digits.")
        .trim()
        .notEmpty()
        .matches(/^[\d]+$/)
        .isLength({ min: 8, max: 8 }),
    body('token', "Invalid Token")
        .trim()
        .notEmpty()
        .escape(),
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })
        if (errors.length > 0) return next(createHttpError({
            message: errors[0].msg,
            status: 400,
            code: 'Error_Invalid',
        }))

        const { phone, password, token } = req.body

        const user = await getUserByPhone(phone)
        checkUserExit(user)

        const otpRow = await getOTPByPhone(phone)
        checkOTPRow(otpRow)

        //* OTP error count is over-limit
        if (otpRow?.error === 5) {
            return next(createHttpError({
                message: "Your request is over-limit. Please try again.",
                status: 400,
                code: 'Error_Invalid',
            }))
        }

        //* Token is wrong
        if (otpRow?.verifyToken !== token) {
            const otpData = {
                error: 5
            }
            await updateOTP(otpRow!.id, otpData)
            return next(createHttpError({
                message: "Invalid Token",
                status: 400,
                code: 'Error_Invalid',
            }))
        }

        //* request is expired
        const isExpired = moment().diff(otpRow!.updatedAt, "minutes") > 10
        if (isExpired) return next(createHttpError({
            message: "Your request is expired. Please try again.",
            status: 403,
            code: "Error_Expried"
        }))

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        const randToken = "@TODO://"

        const userData = {
            phone,
            password: hashPassword,
            randToken,
        }
        const newUser = await createUser(userData)

        const accessTokenPayload = { id: newUser.id }
        const refreshTokenPayload = { id: newUser.id, phone: newUser.phone }

        const accessToken = jwt.sign(
            accessTokenPayload,
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: 60 * 15 }
        )

        const refreshToken = jwt.sign(
            refreshTokenPayload,
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: "30d" }
        )

        const userUpdatedData = { randToken: refreshToken }

        await updateUser(newUser.id, userUpdatedData)

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 1000 * 60 * 15
        }).cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 30
        }).status(201).json({
            message: 'Successfully created an accouht.',
            userId: newUser.id,
        })
    }
]

export const login = [
    body("phone", "Invalid phone number")
        .trim()
        .notEmpty()
        .matches(/^[\d]+$/)
        .isLength({ min: 5, max: 12 }),
    body("password", "Password must be at least 8 digits.")
        .trim()
        .notEmpty()
        .matches(/^[\d]+$/)
        .isLength({ min: 8, max: 8 }),
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })
        if (errors.length > 0) return next(createHttpError({
            message: errors[0].msg,
            status: 400,
            code: 'Error_Invalid',
        }))

        const password = req.body.password
        let phone = req.body.phone
        if (phone.slice(0, 2) === '09') {
            phone = phone.substring(2, phone.length)
        }

        const user = await getUserByPhone(phone)
        checkUserIfNotExist(user)

        if (user?.status === 'FREEZE') {
            return next(createHttpError({
                message: "Your account is temporarily locked. Please contact us.",
                status: 401,
                code: 'Error_Freeze',
            }))
        }

        const isMatchPassword = await bcrypt.compare(password, user!.password)

        if (!isMatchPassword) {
            //* ------------ Starting to record wrong times
            const lastRequest = new Date(user!.updatedAt).toLocaleDateString()
            const isSameDate = lastRequest === new Date().toLocaleDateString()

            if (!isSameDate) {
                const userData = {
                    errorLoginCount: 1
                }

                await updateUser(user!.id, userData)
            } else {
                if (user!.errorLoginCount >= 2) {
                    const userData = {
                        status: 'FREEZE'
                    }

                    await updateUser(user!.id, userData)
                } else {
                    const userData = {
                        errorLoginCount: { increment: 1 }
                    }

                    await updateUser(user!.id, userData)
                }
            }
            //* ------------ Ending -------------
            return next(createHttpError({
                message: "Your password is incorrect.",
                status: 401,
                code: 'Error_Invalid',
            }))
        }

        //* Authorization token
        const accessTokenPayload = { id: user!.id }
        const refreshTokenPayload = { id: user!.id, phone: user!.phone }

        const accessToken = jwt.sign(
            accessTokenPayload,
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: 60 * 15 }
        )

        const refreshToken = jwt.sign(
            refreshTokenPayload,
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: "30d" }
        )

        const userData = {
            errorLoginCount: 0,
            randToken: refreshToken
        }

        await updateUser(user!.id, userData)

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 1000 * 60 * 15
        }).cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 30
        }).status(200).json({
            message: 'Successfully Logged In',
            userId: user!.id,
        })
    }
]

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    //* Clear HttpOnly cookies
    const refreshToken = req.cookies ? req.cookies.refreshToken : null
    if (!refreshToken) return next(createHttpError({
        message: 'You are not an authenticated user.',
        code: "Error_Unauthenticated",
        status: 401,
    }))

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as {
            id: number, phone: string
        }
    } catch (error) {
        return next(createHttpError({
            message: 'You are not an authenticated user.',
            code: "Error_Unauthenticated",
            status: 401,
        }))
    }

    const user = await getUserById(decoded.id)
    checkUserIfNotExist(user)

    if (user!.phone !== decoded.phone) return next(createHttpError({
        message: 'You are not an authenticated user.',
        code: "Error_Unauthenticated",
        status: 401,
    }))

    //* Update randToken is User Table
    const userData = {
        randToken: generateToken(),
    }
    await updateUser(user!.id, userData)

    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    res.status(200).json({ message: "Successfully logged out. See you soon.!" })
}
