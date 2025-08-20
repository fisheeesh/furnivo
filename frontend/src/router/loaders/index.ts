import api, { authApi } from '@/api'
import useAuthStore, { Status } from '@/store/authStore'
import { redirect } from 'react-router'

export const homeLoader = async () => {
    try {
        const res = await api.get("/user/products")
        console.log(res.data)
    } catch (error) {
        console.log(error)
    }
}

export const loginLoader = async () => {
    try {
        const res = await authApi.get("auth-check")

        if (res.status !== 200) {
            return null
        }

        return redirect("/")
    } catch (error) {
        console.log(error)
    }
}

export const OTPLoader = () => {
    const authStore = useAuthStore.getState()

    if (authStore.status !== Status.otp) {
        return redirect("/register")
    }

    return null
}

export const confirmPasswordLoader = () => {
    const authStore = useAuthStore.getState()

    if (authStore.status !== Status.confirm) {
        return redirect("/register")
    }

    return null
}