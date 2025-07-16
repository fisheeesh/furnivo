import { errorCode } from "../config/errorCode"

export const createHttpError = ({ message, status, code }: { message: string, status: number, code: string }) => {
    const error: any = new Error(message)
    error.status = status
    error.code = code
    return error
}

export const checkUserExit = (user: any) => {
    if (user) {
        const error: any = new Error('This phone number has already been registered.')
        error.status = 409
        error.code = errorCode.userExists
        throw error
    }
}

export const checkUserIfNotExist = (user: any) => {
    if (!user) {
        const error: any = new Error('This phone number has not been registered.')
        error.status = 401
        error.code = errorCode.unauthenticated
        throw error
    }
}

export const checkOTPErrorIfSameDate = (isSameDate: boolean, errorCount: number) => {
    if (isSameDate && errorCount >= 5) {
        const error: any = new Error(
            "OTP is wrong for 5 times. Please try again tomorrow."
        )
        error.status = 401
        error.code = errorCode.overLimit
        throw error
    }
}

export const checkOTPRow = (otpRow: any) => {
    if (!otpRow) {
        const error: any = new Error('Phone number is incorrect')
        error.status = 400
        error.code = errorCode.invalid
        throw error
    }
}