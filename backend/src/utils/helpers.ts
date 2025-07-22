import { errorCode } from "../config/error-code"

export const checkUploadFile = (file: any) => {
    if (!file) {
        const error: any = new Error('Invalid image format.')
        error.status = 409
        error.code = errorCode.invalid
        throw error
    }
}