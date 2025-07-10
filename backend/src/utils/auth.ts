export const checkUserExit = (user: any) => {
    if (user) {
        const error: any = new Error('This phone number has already been registered.')
        error.status = 409
        error.code = 'Error_Already_Exist'
        throw error
    }
}

export const checkOTPErrorIfSameDate = (isSameDate: boolean, errorCount: number) => {
    if (isSameDate && errorCount >= 5) {
        const error: any = new Error(
            "OTP is wrong for 5 times. Please try again tomorrow."
        )
        error.status = 401
        error.code = 'Error_OverLimit'
        throw error
    }
}

export const checkOTPRow = (otpRow: any) => {
    if(!otpRow){
        const error: any = new Error('Phone number is incorrect')
        error.status = 400
        error.code = 'Error_Invalid'
        throw error
    }
}