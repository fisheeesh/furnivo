export const checkUserExit = (user: any) => {
    if (user) {
        const error: any = new Error('This phone number has already been registered.')
        error.status = 409
        error.code = 'Error_Already_Exist'
        throw error
    }
}