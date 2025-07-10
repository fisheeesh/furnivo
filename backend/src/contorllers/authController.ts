import { NextFunction, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'

import { getUserByPhone, createOTP, getOTPByPhone, updateOTP } from '../services/authServices'
import { checkOTPErrorIfSameDate, checkUserExit } from '../utils/auth'
import { generateOTP, generateToken } from '../utils/generate'

export const register = [
    body("phone", "Invalid phone number")
        .trim()
        .notEmpty()
        .matches(/^[\d]+$/)
        .isLength({ min: 5, max: 12 }),
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })

        if (errors.length > 0) {
            const error: any = new Error(errors[0].msg)
            error.status = 400
            error.code = 'Error_Invalid'

            return next(error)
        }

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
                    const error: any = new Error(
                        "OTP is allowed to request 3 times per day."
                    )
                    error.status = 405
                    error.code = 'Error_OverLimit'
                    return next(error)
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

        if (errors.length > 0) {
            const error: any = new Error(errors[0].msg)
            error.status = 400
            error.code = 'Error_Invalid'

            return next(error)
        }

        res.status(200).json({ message: 'register' })
    }
]

export const confirmPassword = async (req: Request, res: Response) => {
    res.status(200).json({ message: 'register' })
}

export const login = async (req: Request, res: Response) => {
    res.status(200).json({ message: 'register' })
}
